import asyncio
import json
import os
from typing import Any
from urllib.parse import urlencode
from xml.sax.saxutils import escape

import httpx
from dotenv import load_dotenv
from fastapi import Body, FastAPI, HTTPException, Query, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field
from twilio.rest import Client

load_dotenv()

app = FastAPI(title="Twilio Voice Agent")

client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))

DEFAULT_GREETING = os.getenv(
    "DEFAULT_GREETING",
    "Hello, this is the automated procurement desk for Nexus. How can I help you today?",
)
DEFAULT_REASONING_MODEL = os.getenv("REASONING_MODEL_NAME", "local-fallback")

# In-memory call metadata keyed by Twilio CallSid. Fine for local/dev testing.
CALL_CONTEXT: dict[str, dict[str, Any]] = {}


class OutboundCallRequest(BaseModel):
    hotel_phone: str = Field(..., description="Destination E.164 number to call")
    goal_price: float | None = Field(default=None, description="Optional target price")
    greeting: str | None = Field(default=None, description="First thing the agent should say")
    metadata: dict[str, str] = Field(default_factory=dict)


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise HTTPException(status_code=500, detail=f"Missing required environment variable: {name}")
    return value


def build_public_http_url(path: str) -> str:
    domain = require_env("DOMAIN")
    return f"https://{domain}{path}"


def build_public_ws_url(path: str) -> str:
    domain = require_env("DOMAIN")
    return f"wss://{domain}{path}"


def build_conversation_relay_twiml(greeting: str | None, params: dict[str, str]) -> str:
    ws_url = build_public_ws_url("/conversation-relay")
    welcome_attr = f' welcomeGreeting="{escape(greeting)}"' if greeting else ""

    tts_provider = os.getenv("TWILIO_TTS_PROVIDER", "ElevenLabs")
    tts_voice = os.getenv("TWILIO_TTS_VOICE", "UgBBYS2sOqTuMpoF3BR0")
    transcription_provider = os.getenv("TWILIO_TRANSCRIPTION_PROVIDER", "Google")
    speech_model = os.getenv("TWILIO_SPEECH_MODEL")
    language_code = os.getenv("TWILIO_LANGUAGE_CODE", "en-US")
    elevenlabs_text_normalization = os.getenv("TWILIO_ELEVENLABS_TEXT_NORMALIZATION", "on")

    language_attrs = [f'code="{escape(language_code)}"']
    if tts_provider:
        language_attrs.append(f'ttsProvider="{escape(tts_provider)}"')
    if tts_voice:
        language_attrs.append(f'voice="{escape(tts_voice)}"')
    if transcription_provider:
        language_attrs.append(f'transcriptionProvider="{escape(transcription_provider)}"')
    if speech_model:
        language_attrs.append(f'speechModel="{escape(speech_model)}"')

    param_xml = "".join(
        f'<Parameter name="{escape(name)}" value="{escape(value)}" />'
        for name, value in params.items()
        if value
    )
    elevenlabs_attr = ""
    if tts_provider == "ElevenLabs":
        elevenlabs_attr = f' elevenlabsTextNormalization="{escape(elevenlabs_text_normalization)}"'

    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        "<Response>"
        "<Connect>"
        f'<ConversationRelay url="{escape(ws_url)}"{welcome_attr}{elevenlabs_attr}>'
        f'<Language {" ".join(language_attrs)} />'
        f"{param_xml}"
        "</ConversationRelay>"
        "</Connect>"
        "</Response>"
    )


async def prompt_terminal_response(prompt_text: str) -> str:
    return await asyncio.to_thread(input, prompt_text)


async def builtin_reasoning_reply(transcript: str, goal_price: float | None) -> str:
    lowered = transcript.lower()
    if goal_price is not None and "$" in lowered:
        return (
            f"I heard your offer. Our target is {goal_price:.2f} dollars. "
            "Can you improve the rate or add concessions to get us there?"
        )
    if "email" in lowered:
        return "I can share final details by email once we agree on the terms."
    if "manager" in lowered:
        return "Please involve your manager. I can wait while you confirm the best available option."
    return (
        "Thanks. I am reviewing that now. "
        "Can you confirm your best available rate, any required minimums, and cancellation terms?"
    )


async def generate_agent_reply(
    transcript: str,
    call_context: dict[str, Any],
    history: list[dict[str, str]],
) -> str:
    reasoning_url = os.getenv("REASONING_API_URL")
    if reasoning_url:
        payload = {
            "call_sid": call_context.get("call_sid"),
            "session_id": call_context.get("session_id"),
            "goal_price": call_context.get("goal_price"),
            "transcript": transcript,
            "history": history,
            "metadata": call_context.get("metadata", {}),
        }
        timeout = float(os.getenv("REASONING_API_TIMEOUT_SECONDS", "20"))
        async with httpx.AsyncClient(timeout=timeout) as http:
            response = await http.post(reasoning_url, json=payload)
            response.raise_for_status()
            data = response.json()
            reply = data.get("response") or data.get("reply") or data.get("output")
            if not isinstance(reply, str) or not reply.strip():
                raise RuntimeError("Reasoning API response must include a non-empty response string")
            return reply.strip()

    if os.getenv("REASONING_MODE", "").lower() == "terminal":
        prompt = (
            f"\nCaller said: {transcript}\n"
            f"Goal price: {call_context.get('goal_price')}\n"
            "Reply to send: "
        )
        reply = (await prompt_terminal_response(prompt)).strip()
        if reply:
            return reply

    return await builtin_reasoning_reply(transcript, call_context.get("goal_price"))


class ConversationRelaySession:
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.send_lock = asyncio.Lock()
        self.reply_lock = asyncio.Lock()
        self.closed = False
        self.session_id: str | None = None
        self.call_sid: str | None = None
        self.goal_price: float | None = None
        self.metadata: dict[str, Any] = {}
        self.history: list[dict[str, str]] = []

    async def run(self) -> None:
        await self.websocket.accept()
        try:
            while True:
                payload = await self.websocket.receive_text()
                message = json.loads(payload)
                await self.handle_message(message)
        except WebSocketDisconnect:
            print("ConversationRelay websocket disconnected")
        except Exception as exc:
            print(f"ConversationRelay session failed: {exc}")
        finally:
            await self.shutdown()

    async def handle_message(self, message: dict[str, Any]) -> None:
        msg_type = message.get("type")

        if msg_type == "setup":
            self.session_id = message.get("sessionId")
            self.call_sid = message.get("callSid")
            custom = message.get("customParameters") or {}
            context = CALL_CONTEXT.get(self.call_sid or "", {})
            self.metadata = context.get("metadata", {})

            goal_value = custom.get("goal_price")
            if goal_value is None:
                goal_value = context.get("goal_price")

            try:
                self.goal_price = float(goal_value) if goal_value not in (None, "") else None
            except (TypeError, ValueError):
                self.goal_price = None

            greeting = custom.get("greeting") or context.get("greeting") or DEFAULT_GREETING
            self.history.append({"role": "system", "content": f"Reasoning mode: {DEFAULT_REASONING_MODEL}"})
            self.history.append({"role": "assistant", "content": greeting})
            print(f"ConversationRelay session started: {self.call_sid or self.session_id}")
            return

        if msg_type == "prompt":
            transcript = (message.get("voicePrompt") or "").strip()
            if not transcript:
                return

            print(f"Caller said: {transcript}")
            asyncio.create_task(self.handle_prompt(transcript))
            return

        if msg_type == "interrupt":
            print(f"Caller interrupted playback after: {message.get('utteranceUntilInterrupt', '')}")
            return

        if msg_type == "error":
            print(f"ConversationRelay error: {message.get('description')}")
            return

        print(f"Unhandled ConversationRelay message: {message}")

    async def handle_prompt(self, transcript: str) -> None:
        async with self.reply_lock:
            if self.closed:
                return

            self.history.append({"role": "user", "content": transcript})
            context = {
                "call_sid": self.call_sid,
                "session_id": self.session_id,
                "goal_price": self.goal_price,
                "metadata": self.metadata,
            }

            try:
                response_text = await generate_agent_reply(transcript, context, self.history)
            except Exception as exc:
                print(f"Reasoning step failed: {exc}")
                response_text = "I am having trouble processing that. Could you repeat your last point?"

            self.history.append({"role": "assistant", "content": response_text})
            await self.send_text_reply(response_text)

    async def send_text_reply(self, text: str) -> None:
        if not text.strip():
            return

        await self.send_json(
            {
                "type": "text",
                "token": text,
                "last": True,
            }
        )

    async def send_json(self, message: dict[str, Any]) -> None:
        if self.closed:
            return

        async with self.send_lock:
            await self.websocket.send_text(json.dumps(message))

    async def shutdown(self) -> None:
        if self.closed:
            return
        self.closed = True

        if self.call_sid:
            CALL_CONTEXT.pop(self.call_sid, None)


@app.get("/healthz")
async def healthcheck() -> JSONResponse:
    missing = [
        name
        for name in (
            "TWILIO_ACCOUNT_SID",
            "TWILIO_AUTH_TOKEN",
            "TWILIO_PHONE_NUMBER",
            "DOMAIN",
        )
        if not os.getenv(name)
    ]
    return JSONResponse({"ok": not missing, "missing_env": missing})


@app.post("/make-call")
async def make_call(
    request: OutboundCallRequest | None = Body(default=None),
    hotel_phone: str | None = Query(default=None),
    goal_price: float | None = Query(default=None),
    greeting: str | None = Query(default=None),
) -> JSONResponse:
    payload = request or OutboundCallRequest(
        hotel_phone=hotel_phone or "",
        goal_price=goal_price,
        greeting=greeting,
    )

    if not payload.hotel_phone:
        raise HTTPException(status_code=422, detail="hotel_phone is required")

    twiml_url = build_public_http_url("/twiml-negotiate")
    if payload.goal_price is not None or payload.greeting:
        params = {}
        if payload.goal_price is not None:
            params["goal_price"] = str(payload.goal_price)
        if payload.greeting:
            params["greeting"] = payload.greeting
        twiml_url = f"{twiml_url}?{urlencode(params)}"

    call = client.calls.create(
        to=payload.hotel_phone,
        from_=require_env("TWILIO_PHONE_NUMBER"),
        url=twiml_url,
        method="POST",
    )

    CALL_CONTEXT[call.sid] = {
        "call_sid": call.sid,
        "goal_price": payload.goal_price,
        "greeting": payload.greeting or DEFAULT_GREETING,
        "metadata": payload.metadata,
    }

    return JSONResponse(
        {
            "status": "Call initiated",
            "call_sid": call.sid,
            "twiml_url": twiml_url,
        }
    )


@app.api_route("/twiml-negotiate", methods=["GET", "POST"])
@app.api_route("/incoming-call", methods=["GET", "POST"])
async def twiml_negotiate(request: Request) -> HTMLResponse:
    goal_price = request.query_params.get("goal_price") or ""
    greeting = request.query_params.get("greeting") or DEFAULT_GREETING
    params = {
        "goal_price": goal_price,
        "greeting": greeting,
    }
    xml = build_conversation_relay_twiml(greeting=greeting, params=params)
    return HTMLResponse(content=xml, media_type="application/xml")


@app.websocket("/conversation-relay")
async def conversation_relay(websocket: WebSocket) -> None:
    session = ConversationRelaySession(websocket)
    await session.run()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
