/**
 * Abstract base class for all game states in Cosmic Hopper.
 * Defines the standard interface that all states must implement.
 * 
 * This class provides default implementations for common functionality
 * and ensures consistent behavior across all game states.
 */
export default class BaseState {
	constructor() {
		this.name = '';
	}

	/**
	 * Called when entering this state.
	 * Use this to initialize state-specific data and resources.
	 * 
	 * @param {Object} params - Parameters passed from the previous state
	 */
	enter(params = {}) {
		// Default implementation - override in subclasses
	}

	/**
	 * Called when exiting this state.
	 * Use this to clean up state-specific resources and data.
	 */
	exit() {
		// Default implementation - override in subclasses  
	}

	/**
	 * Called every frame to update the state logic.
	 * 
	 * @param {number} dt - Delta time in seconds since last frame
	 */
	update(dt) {
		// Default implementation - override in subclasses
	}

	/**
	 * Called every frame to render the state to the canvas.
	 * 
	 * @param {CanvasRenderingContext2D} context - The canvas rendering context
	 */
	render(context) {
		// Default implementation - override in subclasses
	}

	/**
	 * Utility method to handle common input processing.
	 * Can be called by subclasses to handle shared input patterns.
	 * 
	 * @param {Object} input - Input manager instance
	 */
	handleInput(input) {
		// Default implementation - override in subclasses if needed
	}
}