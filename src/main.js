/**
 * Cosmic Hopper
 *
 * A vertical endless jumping game where players hop between platforms,
 * collect power-ups, avoid enemies, and reach for the stars!
 *
 * Authors: Zackary De Luca
 *
 * Asset sources:
 * - Sprites: foozlecc, lionheart963, clembod, atomicrealm, gamesupply, twojyou, wenrexa
 * - Sounds: Ahmed_Abdulaal, Arnav_Geddada, freesound_community, Bithuh
 * - Fonts: Matt McInerney, multype studios 
 */

import GameStateName from './enums/GameStateName.js';
import Game from '../lib/Game.js';
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	timer,
	sounds,
	stateMachine,
} from './globals.js';

// Import all game states
import TitleScreenState from './states/TitleScreenState.js';
import PlayState from './states/PlayState.js';
import GameOverState from './states/GameOverState.js';
import VictoryState from './states/VictoryState.js';
import PauseState from './states/PauseState.js';
import InstructionsState from './states/InstructionsState.js';
import HighScoreState from './states/HighScoreState.js';

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Add all the states to the state machine.
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
stateMachine.add(GameStateName.Play, new PlayState());
stateMachine.add(GameStateName.GameOver, new GameOverState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.Pause, new PauseState());
stateMachine.add(GameStateName.Instructions, new InstructionsState());
stateMachine.add(GameStateName.HighScore, new HighScoreState());

// Start with the title screen
stateMachine.change(GameStateName.TitleScreen);

// Create and start the game
const game = new Game(
	stateMachine,
	context,
	timer,
	canvas.width,
	canvas.height
);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();

// Unlock audio and start music on first user interaction
let _musicStarted = false;
const _startMusic = () => {
	if (_musicStarted) return;
	try {
		if (sounds && sounds.get && sounds.get('bg_music')) {
			sounds.play('bg_music');
			_musicStarted = true;
			window.removeEventListener('pointerdown', _startMusic);
			window.removeEventListener('keydown', _startMusic);
		}
	} catch {}
};
window.addEventListener('pointerdown', _startMusic, { once: false });
window.addEventListener('keydown', _startMusic, { once: false });
