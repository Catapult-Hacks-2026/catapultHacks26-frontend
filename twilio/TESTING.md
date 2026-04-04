# Twilio Voice Agent Testing

This app uses Twilio ConversationRelay for the phone call, Twilio-managed speech-to-text, a pluggable reasoning step, and Twilio-managed text-to-speech through ConversationRelay. If your Twilio account is configured for an external TTS provider such as ElevenLabs, you can point ConversationRelay at that provider with environment variables.

## Architecture

1. Twilio places or receives a phone call and requests [`/twiml-negotiate`](/Users/nathanielkemmenash/Desktop/Catapult26/catapultHacks26/twilio/main.py).
2. The TwiML response opens a ConversationRelay websocket to `wss://<DOMAIN>/conversation-relay`.
3. Twilio performs speech recognition and sends caller turns to your server as `prompt` websocket messages.
4. Final user turns are sent to either:
   - `REASONING_API_URL` if set, or
   - terminal input if `REASONING_MODE=terminal`, or
   - the built-in fallback responder.
5. The reply text is sent back to Twilio as ConversationRelay `text` tokens.
6. Twilio converts those tokens to speech with the configured ConversationRelay TTS provider.
7. If the caller starts talking while playback is active, Twilio emits an `interrupt` event.

## Required Environment Variables

Set these in `.env`:

```env
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
DOMAIN=your-public-host.example.com
```

Optional variables:

```env
PORT=8000
DEFAULT_GREETING=Hello, this is Nexus procurement.
REASONING_API_URL=https://your-model-host.example.com/respond
REASONING_API_TIMEOUT_SECONDS=20
REASONING_MODE=terminal
TWILIO_LANGUAGE_CODE=en-US
TWILIO_TRANSCRIPTION_PROVIDER=Google
TWILIO_SPEECH_MODEL=telephony
TWILIO_TTS_PROVIDER=ElevenLabs
TWILIO_TTS_VOICE=UgBBYS2sOqTuMpoF3BR0
TWILIO_ELEVENLABS_TEXT_NORMALIZATION=on
```

## Install And Run

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Your `DOMAIN` must point to this server over both HTTPS and WSS. `ngrok`, a Cloudflare Tunnel, or a deployed host is fine.

## Twilio Dashboard Setup

You only need one Twilio Console change if you want to test inbound calls to your Twilio number:

1. Open the phone number in the Twilio Console.
2. Under `Voice`, set `A call comes in` to `Webhook`.
3. Set the URL to `https://<DOMAIN>/incoming-call`.
4. Use HTTP `POST`.

For outbound test calls started by your backend through `/make-call`, Twilio uses the webhook URL supplied by the API call, so the phone number webhook is not required for that path.

## Outbound Test

Start a call from another terminal:

```bash
curl -X POST http://127.0.0.1:8000/make-call \
  -H 'Content-Type: application/json' \
  -d '{
    "hotel_phone": "+1YOUR_TEST_NUMBER",
    "goal_price": 175,
    "greeting": "Hello, this is Nexus procurement calling about a group booking."
  }'
```

Expected behavior:

1. The destination phone rings.
2. After answer, the greeting is spoken by ConversationRelay.
3. When the callee talks, logs show `Caller said: ...`.
4. The server gets a response from your reasoning hook and sends it back as a text token.
5. If the callee interrupts the AI while it is speaking, Twilio emits an `interrupt` event and the logs reflect it.

## Reasoning API Contract

If you set `REASONING_API_URL`, your endpoint should accept `POST` JSON like:

```json
{
  "call_sid": "CA123",
  "session_id": "VX123",
  "goal_price": 175.0,
  "transcript": "Can you do 220 per night?",
  "history": [
    {"role": "assistant", "content": "Hello..."},
    {"role": "user", "content": "Can you do 220 per night?"}
  ],
  "metadata": {}
}
```

It should return JSON with one of these keys:

```json
{"response": "We are targeting 175. Can you improve that offer?"}
```

`reply` or `output` are also accepted as response keys.

## Terminal Mode

If you want to manually drive responses without a model:

```env
REASONING_MODE=terminal
```

When a transcript arrives, the running server process will prompt:

```text
Caller said: ...
Goal price: ...
Reply to send:
```

This only works if the server is running attached to an interactive terminal.

## Troubleshooting

Use `GET /healthz` first. It returns missing environment variables.

Common failures:

1. No audio after the call connects:
   - Verify `DOMAIN` is publicly reachable over `https://` and `wss://`.
2. Caller speech never appears in logs:
   - Confirm Twilio is hitting `/conversation-relay`.
   - Confirm your ConversationRelay transcription provider, language, and speech model are valid.
3. Twilio connects and then drops:
   - ConversationRelay requires `wss`; plain `ws` will fail.
4. TTS sounds wrong or does not play:
   - Check the `TWILIO_TTS_PROVIDER`, `TWILIO_TTS_VOICE`, and `TWILIO_ELEVENLABS_TEXT_NORMALIZATION` values supported by your Twilio account configuration.

## Verification Checklist

1. `curl http://127.0.0.1:8000/healthz` returns `"ok": true`.
2. Twilio can fetch `https://<DOMAIN>/twiml-negotiate`.
3. Twilio can open `wss://<DOMAIN>/conversation-relay`.
4. Logs show:
   - `ConversationRelay session started: ...`
   - `Caller said: ...`
5. You hear spoken replies in the live call.
