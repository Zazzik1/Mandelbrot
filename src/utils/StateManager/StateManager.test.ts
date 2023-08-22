import StateManager from "./StateManager";
import VariableStrategy from "./strategies/VariableStrategy";

type State = {
    a: number;
    b: string;
}

describe('StateManager', () => {
    test('setState method should set the state', () => {
        const state: State = { a: 1, b: 'x' };
        const stateManager = new StateManager<State>(VariableStrategy);
        stateManager.setState(state);
        expect(stateManager.getState()).toEqual({ a: 1, b: 'x' });
    });

    test('clearState method should clear the state', () => {
        const initialState: State = { a: 1, b: 'x' };
        const stateManager = new StateManager<State>(VariableStrategy);
        stateManager.setState(initialState);
        stateManager.clearState();
        expect(stateManager.getState()).toEqual({});
    });

    test('setOne method should set one state property', () => {
        const stateManager = new StateManager<State>(VariableStrategy);
        stateManager.setOne('a', 123);
        expect(stateManager.getState()).toEqual({ a: 123 });
    });

    test('setOne method should update one state property', () => {
        const initialState: State = { a: 1, b: 'x' };
        const stateManager = new StateManager<State>(VariableStrategy);
        stateManager.setState(initialState);
        stateManager.setOne('a', 123);
        expect(stateManager.getState()).toEqual({ a: 123, b: 'x' });
    });
});