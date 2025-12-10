/**
 * Enumeration of all possible game states for Cosmic Hopper.
 * These correspond to the state machine identifiers used throughout the game.
 * 
 * Note: Values are in kebab-case to match the StateMachine convention.
 */
const GameStateName = {
	TitleScreen: 'title-screen',
	Instructions: 'instructions', 
	Play: 'play',
	Pause: 'pause',
	GameOver: 'game-over',
	Victory: 'victory',
	HighScore: 'high-score'
};

export default GameStateName;
