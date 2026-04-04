import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { initialEvents, type EventAgent, type GalileoEvent } from "@/lib/dashboard-data";

type EventsContextValue = {
  events: GalileoEvent[];
  getEvent: (id: string) => GalileoEvent | undefined;
  getEventForNegotiation: (negotiationId: string) => GalileoEvent | undefined;
  canAcceptAgent: (event: GalileoEvent, agent: EventAgent) => boolean;
  acceptOffer: (eventId: string, negotiationId: string) => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

function cloneInitialEvents() {
  return initialEvents.map((event) => ({
    ...event,
    agents: event.agents.map((agent) => ({ ...agent })),
  }));
}

function hasAcceptedType(event: GalileoEvent, type: EventAgent["type"]) {
  return event.agents.some((agent) => agent.type === type && agent.isAccepted);
}

function isEventComplete(event: GalileoEvent) {
  const acceptedTypes = new Set(
    event.agents.filter((agent) => agent.isAccepted).map((agent) => agent.type),
  );

  if (event.service === "Hotel") return acceptedTypes.has("Hotel");
  if (event.service === "Airline") return acceptedTypes.has("Airline");
  return acceptedTypes.has("Hotel") && acceptedTypes.has("Airline");
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<GalileoEvent[]>(cloneInitialEvents);

  const value = useMemo<EventsContextValue>(() => {
    const getEvent = (id: string) => events.find((event) => event.id === id);

    const getEventForNegotiation = (negotiationId: string) =>
      events.find((event) => event.agents.some((agent) => agent.negotiationId === negotiationId));

    const canAcceptAgent = (event: GalileoEvent, agent: EventAgent) =>
      event.status === "Active" &&
      agent.status === "Completed" &&
      !agent.isAccepted &&
      !hasAcceptedType(event, agent.type);

    const acceptOffer = (eventId: string, negotiationId: string) => {
      setEvents((currentEvents) =>
        currentEvents.map((event) => {
          if (event.id !== eventId || event.status === "Completed") {
            return event;
          }

          const targetAgent = event.agents.find((agent) => agent.negotiationId === negotiationId);
          if (!targetAgent) {
            return event;
          }

          if (
            targetAgent.status !== "Completed" ||
            targetAgent.isAccepted ||
            hasAcceptedType(event, targetAgent.type)
          ) {
            return event;
          }

          const updatedAgents: EventAgent[] = event.agents.map((agent) =>
            agent.negotiationId === negotiationId
              ? { ...agent, isAccepted: true, status: "Completed" }
              : agent.type === targetAgent.type
                ? { ...agent, isAccepted: false, status: "Cancelled" }
                : agent,
          );

          const updatedEvent: GalileoEvent = {
            ...event,
            agents: updatedAgents,
          };

          return {
            ...updatedEvent,
            status: isEventComplete(updatedEvent) ? "Completed" : "Active",
          };
        }),
      );
    };

    return {
      events,
      getEvent,
      getEventForNegotiation,
      canAcceptAgent,
      acceptOffer,
    };
  }, [events]);

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }

  return context;
}
