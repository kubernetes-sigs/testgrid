import { ReactiveController, ReactiveControllerHost } from 'lit';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export class ApiController<T> implements ReactiveController {
  private host: ReactiveControllerHost;

  private _state: ApiState<T> = { data: null, loading: false, error: null };

  private cache = new Map<string, { data: T; timestamp: number }>();

  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  get state(): ApiState<T> {
    return this._state;
  }

  async fetch(key: string, fetcher: () => Promise<T>): Promise<T> {
    // check if its cached
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      this._state = { data: cached.data, loading: false, error: null };
      this.host.requestUpdate();
      return cached.data;
    }

    this._state = { ...this._state, loading: true, error: null };
    this.host.requestUpdate();

    try {
      const data = await fetcher();

      // cache the result
      this.cache.set(key, { data, timestamp: Date.now() });

      this._state = { data, loading: false, error: null };
      this.host.requestUpdate();

      return data;
    } catch (error) {
      this._state = { data: null, loading: false, error: error as Error };
      this.host.requestUpdate();
      throw error;
    }
  }

  clear() {
    this._state = { data: null, loading: false, error: null };
    this.cache.clear();
    this.host.requestUpdate();
  }

  // eslint-disable-next-line class-methods-use-this
  hostConnected() {}

  hostDisconnected() {
    this.cache.clear();
  }
}
