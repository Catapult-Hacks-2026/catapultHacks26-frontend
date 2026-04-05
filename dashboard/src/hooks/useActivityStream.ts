import { useEffect, useMemo, useState } from "react";
import { buildRealtimeHttpUrl } from "@/lib/realtime";
import type { RawGalileoActivityItem } from "@/lib/api-types";
import type { ActivityItem } from "@/hooks/useNegotiationDetail";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

function formatTimeLabel(timestamp?: string | null) {
  if (!timestamp) {
    return "Now";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizeActivityItem(item: RawGalileoActivityItem, active = true): ActivityItem {
  return {
    active: item.active ?? active,
    badge: item.badge ?? null,
    badgeTone:
      item.badgeTone ??
      (item.badgeType === "savings"
        ? "bg-tertiary-fixed text-on-tertiary-fixed"
        : "bg-secondary-fixed text-on-secondary-fixed"),
    detail: item.detail ?? "Status updated",
    detailTone:
      item.detailTone ??
      (item.detailType === "positive"
        ? "bg-tertiary-fixed text-on-tertiary-fixed"
        : item.detailType === "negative"
          ? "bg-error-container text-error"
          : undefined),
    price: typeof item.price === "number" ? formatCurrency(item.price) : item.price ?? "—",
    time: item.time ?? formatTimeLabel(item.timestamp ?? item.created_at),
  };
}

function activityKey(item: ActivityItem) {
  return JSON.stringify([
    item.price,
    item.badge,
    item.badgeTone,
    item.detail,
    item.detailTone ?? "",
    item.time,
  ]);
}

export function mergeActivityItems(...groups: Array<ActivityItem[] | undefined>) {
  const seen = new Set<string>();
  const merged: ActivityItem[] = [];

  for (const group of groups) {
    for (const item of group ?? []) {
      const key = activityKey(item);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      merged.push(item);
    }
  }

  return merged;
}

export function useActivityStream(agentId: string | null) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [rawItems, setRawItems] = useState<RawGalileoActivityItem[]>([]);

  useEffect(() => {
    if (!agentId) {
      setItems([]);
      setRawItems([]);
      return;
    }

    const url = buildRealtimeHttpUrl(`/api/galileo/agents/${agentId}/activity-stream`);
    if (!url) {
      setItems([]);
      setRawItems([]);
      return;
    }

    const source = new EventSource(url);

    const handleMessage = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data) as RawGalileoActivityItem;
        setRawItems((current) => [...current, parsed]);
        setItems((current) => mergeActivityItems(current, [normalizeActivityItem(parsed)]));
      } catch {
        return;
      }
    };

    source.addEventListener("activity", handleMessage as EventListener);
    source.onmessage = handleMessage;
    source.onerror = () => {
      source.close();
    };

    return () => {
      source.removeEventListener("activity", handleMessage as EventListener);
      source.close();
    };
  }, [agentId]);

  return useMemo(() => ({ items, rawItems }), [items, rawItems]);
}
