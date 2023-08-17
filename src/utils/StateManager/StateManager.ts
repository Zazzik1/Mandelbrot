import StateManagerStrategy from "./strategies/StateManagerStrategy"

class StateManager<State extends {}> {
    protected strategy: StateManagerStrategy<State>;

    constructor(strategy: new () => StateManagerStrategy<State>) {
        this.strategy = new strategy();
    }

    public clearState() {
        this.strategy.clearState();
    }

    public setState(state: Partial<State>) {
        this.strategy.setState(state);
    }

    public getState(): Partial<State> {
        return this.strategy.getState();
    }

    public setOne(key: keyof State, value: string | number) {
        const state = this.getState();
        this.setState({ ...state, [key]: value });
    }
}

export default StateManager;