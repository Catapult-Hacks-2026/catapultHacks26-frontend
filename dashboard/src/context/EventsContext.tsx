import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAcceptEventOffer, useEventsList } from "@/hooks/useEvents";
import {
  isClosedDeal,
  type EventAgent,
  type GalileoEvent,
} from "@/lib/dashboard-data";

type EventsContextValue = {
  events: GalileoEvent[];
  error: unknown;
  getEvent: (id: string) => GalileoEvent | undefined;
  getEventForNegotiation: (negotiationId: string) => GalileoEvent | undefined;
  isLoading: boolean;
  canAcceptAgent: (event: GalileoEvent, agent: EventAgent) => boolean;
  acceptOffer: (eventId: string, negotiationId: string) => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

function hasAcceptedType(event: GalileoEvent, type: EventAgent["type"]) {
  return event.agents.some((agent) => agent.type === type && agent.isAccepted);
}

function isEventComplete(event: GalileoEvent) {
  const acceptedTypes = new Set(
    event.agents.filter((agent) => agent.isAccepted).map((agent) => agent.type),
  );

  return acceptedTypes.has("Hotel");
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const { data: events = [], error, isLoading } = useEventsList();
  const acceptMutation = useAcceptEventOffer();

  const value = useMemo<EventsContextValue>(() => {
    const getEvent = (id: string) => events.find((event) => event.id === id);

    const getEventForNegotiation = (negotiationId: string) =>
      events.find((event) => event.agents.some((agent) => agent.negotiationId === negotiationId));

    const canAcceptAgent = (event: GalileoEvent, agent: EventAgent) =>
      event.status === "Active" &&
      isClosedDeal(agent) &&
      !agent.isAccepted &&
      !hasAcceptedType(event, agent.type);

    const acceptOffer = (eventId: string, negotiationId: string) => {
      const event = getEvent(eventId);
      const targetAgent = event?.agents.find((agent) => agent.negotiationId === negotiationId);

      if (!event || !targetAgent) {
        return;
      }

      if (!isClosedDeal(targetAgent) || targetAgent.isAccepted || hasAcceptedType(event, targetAgent.type)) {
        return;
      }

      acceptMutation.mutate({ agentId: negotiationId, eventId });
    };

    return {
      error,
      events,
      getEvent,
      getEventForNegotiation,
      isLoading,
      canAcceptAgent,
      acceptOffer,
    };
  }, [acceptMutation, error, events, isLoading]);

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }

  return context;
}
