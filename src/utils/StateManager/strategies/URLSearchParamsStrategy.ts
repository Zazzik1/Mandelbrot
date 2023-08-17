import StateManagerStrategy from "./StateManagerStrategy";

class URLSearchParamsStrategy<State extends {}> extends StateManagerStrategy<State> {
    public clearState() {
        window.history.pushState({}, '', window.location.origin + window.location.pathname);
    }
    
    public setState(state: Partial<State>) {
        const params = new URLSearchParams(state as Record<string, string>);
        window.history.pushState({}, '', `?${params.toString()}`);
    }
    
    public getState(): Partial<State> {
        const params = new URLSearchParams(document.location.search);
        const state: State = {} as State;
        for (const key of params.keys()) {
            const value = params.get(key);
            if (value != null) (state as any)[key] = value;
        }
        return state;
    }
}

export default URLSearchParamsStrategy;