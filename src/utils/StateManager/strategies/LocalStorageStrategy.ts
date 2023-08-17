import StateManagerStrategy from "./StateManagerStrategy";

class LocalStorageStrategy<State extends {}> extends StateManagerStrategy<State> {
    LOCAL_STORAGE_KEY: string = 'Mandebrot_StateManager_LocalStorageStrategy';
    public clearState() {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
    
    public setState(state: Partial<State>) {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
    
    public getState(): Partial<State> {
        const state = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY) ?? '{}');
        return state
    }
}

export default LocalStorageStrategy;