/**
 * States are only created as needed, to save memory, reduce clean-up bugs and
 * increase speed due to garbage collection taking longer with more data in memory.
 *
 * States are added with a string identifier and a State object.
 *
 * const stateMachine = new StateMachine();
 *
 * stateMachine.add('main-menu', new MainMenuState());
 * stateMachine.add('play', new PlayState());
 * stateMachine.add('game-over', new GameOverState());
 *
 * stateMachine.change('main-menu', {});
 *
 * Arguments passed into the change() function after the state name will
 * be forwarded to the enter() function of the state being changed to.
 *
 * State identifiers should be the lower-case kebab-case version of
 * the state object without the 'State' suffix.
 * ex. 'main-menu' identifies a state object of type MainMenuState.
 */
export default class StateMachine {
	constructor() {
		this.states = {};
		this.currentState = null;
	}

	add(stateName, state) {
		state.name = stateName;
		this.states[stateName] = state;
		
		// Only set as current state if this is the first state added
		if (this.currentState === null) {
			this.currentState = state;
		}
	}

	change(stateName, enterParameters = {}) {
		// Ensure the state exists
		if (!this.states[stateName]) {
			console.error(`State "${stateName}" does not exist in StateMachine`);
			return;
		}

		// Exit current state if one exists
		if (this.currentState && this.currentState.exit) {
			this.currentState.exit();
		}

		// Change to new state
		this.currentState = this.states[stateName];
		
		// Enter new state if it has an enter method
		if (this.currentState.enter) {
			this.currentState.enter(enterParameters);
		}
	}

	update(dt) {
		if (this.currentState && this.currentState.update) {
			this.currentState.update(dt);
		}
	}

	render(context) {
		if (this.currentState && this.currentState.render) {
			this.currentState.render(context);
		}
	}

	getCurrentStateName() {
		return this.currentState ? this.currentState.name : null;
	}

	isEmpty() {
		return Object.keys(this.states).length === 0;
	}
}
