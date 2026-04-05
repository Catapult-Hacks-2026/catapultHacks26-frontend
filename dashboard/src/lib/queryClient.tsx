import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type QueryKey = readonly unknown[];

type QueryOptions<TData> = {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  enabled?: boolean;
};

type MutationOptions<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: unknown, variables: TVariables) => void | Promise<void>;
};

type InvalidateOptions = {
  queryKey: QueryKey;
};

type QueryStatus = "idle" | "loading" | "success" | "error";

type QueryState<TData = unknown> = {
  data?: TData;
  error: unknown;
  promise?: Promise<TData>;
  status: QueryStatus;
};

function serializeKey(queryKey: QueryKey) {
  return JSON.stringify(queryKey);
}

export class QueryClient {
  private versions = new Map<string, number>();

  private listeners = new Set<(key: string) => void>();

  private cache = new Map<string, QueryState>();

  private notify(key: string) {
    for (const listener of this.listeners) {
      listener(key);
    }
  }

  getQueryState<TData>(queryKey: QueryKey) {
    return this.cache.get(serializeKey(queryKey)) as QueryState<TData> | undefined;
  }

  fetchQuery<TData>(queryKey: QueryKey, queryFn: () => Promise<TData>) {
    const key = serializeKey(queryKey);
    const cachedState = this.cache.get(key) as QueryState<TData> | undefined;

    if (cachedState?.status === "loading" && cachedState.promise) {
      return cachedState.promise;
    }

    if (cachedState?.status === "success" && cachedState.data !== undefined) {
      return Promise.resolve(cachedState.data);
    }

    if (cachedState?.status === "error") {
      return Promise.reject(cachedState.error);
    }

    const promise = queryFn()
      .then((data) => {
        this.cache.set(key, {
          data,
          error: null,
          status: "success",
        });
        this.notify(key);
        return data;
      })
      .catch((error) => {
        this.cache.set(key, {
          error,
          status: "error",
        });
        this.notify(key);
        throw error;
      });

    this.cache.set(key, {
      data: cachedState?.data,
      error: null,
      promise,
      status: "loading",
    });
    this.notify(key);

    return promise;
  }

  invalidateQueries({ queryKey }: InvalidateOptions) {
    const target = serializeKey(queryKey);

    for (const key of Array.from(this.versions.keys())) {
      if (key === target || key.startsWith(`${target.slice(0, -1)},`) || target === "[]") {
        this.versions.set(key, (this.versions.get(key) ?? 0) + 1);
        this.cache.delete(key);
        this.notify(key);
      }
    }

    if (!this.versions.has(target)) {
      this.versions.set(target, 1);
      this.cache.delete(target);
      this.notify(target);
    }
  }

  getVersion(queryKey: QueryKey) {
    return this.versions.get(serializeKey(queryKey)) ?? 0;
  }

  subscribe(listener: (key: string) => void) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}

const QueryClientContext = createContext<QueryClient | null>(null);

export const queryClient = new QueryClient();

export function QueryClientProvider({
  children,
  client,
}: PropsWithChildren<{ client: QueryClient }>) {
  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
}

export function useQueryClient() {
  const client = useContext(QueryClientContext);

  if (!client) {
    throw new Error("useQueryClient must be used within QueryClientProvider");
  }

  return client;
}

export function useQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
}: QueryOptions<TData>) {
  const client = useQueryClient();
  const initialState = enabled
    ? client.getQueryState<TData>(queryKey)
    : undefined;
  const [data, setData] = useState<TData | undefined>(initialState?.data);
  const [error, setError] = useState<unknown>(initialState?.error ?? null);
  const [isLoading, setIsLoading] = useState(
    enabled && (initialState?.status === "loading" || initialState?.status === undefined),
  );
  const [version, setVersion] = useState(() => client.getVersion(queryKey));
  const key = useMemo(() => serializeKey(queryKey), [queryKey]);

  useEffect(() => {
    return client.subscribe((changedKey) => {
      if (changedKey === key) {
        const nextState = client.getQueryState<TData>(queryKey);
        setData(nextState?.data);
        setError(nextState?.error ?? null);
        setIsLoading(nextState?.status === "loading");
        setVersion(client.getVersion(queryKey));
      }
    });
  }, [client, key, queryKey]);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const cachedState = client.getQueryState<TData>(queryKey);

    if (cachedState?.status === "success" || cachedState?.status === "error") {
      setData(cachedState.data);
      setError(cachedState.error ?? null);
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);
    setError(null);

    void client
      .fetchQuery(queryKey, queryFn)
      .then((result) => {
        if (cancelled) {
          return;
        }

        setData(result);
        setIsLoading(false);
      })
      .catch((queryError) => {
        if (cancelled) {
          return;
        }

        setError(queryError);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, enabled, key, queryFn, queryKey, version]);

  return {
    data,
    error,
    isError: error !== null,
    isLoading,
  };
}

export function useMutation<TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
}: MutationOptions<TData, TVariables>) {
  const [error, setError] = useState<unknown>(null);
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (variables: TVariables) => {
    setIsPending(true);
    setError(null);

    try {
      const data = await mutationFn(variables);
      await onSuccess?.(data, variables);
      setIsPending(false);

      return data;
    } catch (mutationError) {
      await onError?.(mutationError, variables);
      setError(mutationError);
      setIsPending(false);

      throw mutationError;
    }
  };

  return {
    error,
    isError: error !== null,
    isPending,
    mutate: (variables: TVariables) => {
      void mutateAsync(variables);
    },
    mutateAsync,
  };
}
