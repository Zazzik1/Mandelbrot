abstract class StateManagerStrategy<State extends {}> {
    public abstract clearState(): void;
    public abstract setState(state: Partial<State>): void;
    public abstract getState(): Partial<State>;
}

export default StateManagerStrategy;