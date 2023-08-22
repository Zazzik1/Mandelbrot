import StateManagerStrategy from "./StateManagerStrategy";

class VariableStrategy<State extends {}> extends StateManagerStrategy<State> {
    protected state: Partial<State> = {} as State;
    public clearState() {
        this.state = {};
    }
    
    public setState(state: Partial<State>) {
        this.state = state;
    }
    
    public getState(): Partial<State> {
        return this.state;
    }
}

export default VariableStrategy;