import Fonts from '../lib/Fonts.js';
import Images from '../lib/Images.js';
import Sounds from '../lib/Sounds.js';
import StateMachine from '../lib/StateMachine.js';
import Timer from '../lib/Timer.js';
import Input from '../lib/Input.js';

export const canvas = document.createElement('canvas');
export const context =
	canvas.getContext('2d') || new CanvasRenderingContext2D();

// Canvas dimensions - 16:9 aspect ratio for modern screens
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

const resizeCanvas = () => {
	const scaleX = window.innerWidth / CANVAS_WIDTH;
	const scaleY = window.innerHeight / CANVAS_HEIGHT;
	const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

	canvas.style.width = `${CANVAS_WIDTH * scale}px`;
	canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
};

// Listen for canvas resize events
window.addEventListener('resize', resizeCanvas);

resizeCanvas(); // Call once to scale initially

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const timer = new Timer();
export const input = new Input(canvas);
export const sounds = new Sounds();

// ========================================
// COSMIC HOPPER GAME CONSTANTS
// ========================================

// Physics Constants
export const GRAVITY = 1000; // Pixels per second squared
export const PLAYER_SPEED = 300; // Horizontal movement speed
export const JUMP_VELOCITY = -450; // Initial jump velocity (negative = up)
export const MAX_FALL_SPEED = 800; // Terminal velocity
export const PLATFORM_COLLISION_BUFFER = 5; // Collision detection tolerance

// Camera Constants
export const CAMERA_FOLLOW_SPEED = 5; // How fast camera follows player
export const CAMERA_DEADZONE_Y = 100; // Vertical deadzone before camera moves

// Game Balance
export const PLATFORM_SPACING_MIN = 80; // Minimum vertical distance between platforms
export const PLATFORM_SPACING_MAX = 120; // Maximum vertical distance between platforms
export const DIFFICULTY_INCREASE_HEIGHT = 500; // Height intervals for difficulty increases
export const ENEMY_SPAWN_CHANCE = 0.3; // Chance of enemy spawning on platform
export const POWERUP_SPAWN_CHANCE = 0.15; // Chance of powerup spawning

// Screen Boundaries
export const SCREEN_WRAP_BUFFER = 50; // Buffer for horizontal screen wrapping
export const DEATH_BOUNDARY = CANVAS_HEIGHT + 200; // How far below screen player dies

// Power-up Durations (in seconds)
export const SHIELD_DURATION = 8;
export const DOUBLE_JUMP_DURATION = 10;
export const WEAPON_DURATION = 12;
export const GRAVITY_FLIP_DURATION = 6;

// Scoring System
export const POINTS_PER_PLATFORM = 10;
export const POINTS_PER_ENEMY_KILL = 50;
export const POINTS_PER_POWERUP = 25;
export const HEIGHT_BONUS_MULTIPLIER = 2; // Points multiplier based on height reached

// Milestone Heights (for victory conditions)
export const BRONZE_HEIGHT = 1000;
export const SILVER_HEIGHT = 2500;
export const GOLD_HEIGHT = 5000;

// UI Constants
export const UI_FONT_SIZE = 24;
export const UI_LARGE_FONT_SIZE = 48;
export const UI_COLOR = '#FFFFFF';
export const UI_HIGHLIGHT_COLOR = '#FFD700';
export const UI_DANGER_COLOR = '#FF4444';

// Input Keys
export const KEYS = {
	LEFT: Input.KEYS.ARROW_LEFT,
	RIGHT: Input.KEYS.ARROW_RIGHT, 
	UP: Input.KEYS.ARROW_UP,
	DOWN: Input.KEYS.ARROW_DOWN,
	JUMP: Input.KEYS.SPACE,
	SHOOT: Input.KEYS.X,
	PAUSE: Input.KEYS.P,
	ENTER: Input.KEYS.ENTER,
	ESCAPE: Input.KEYS.ESCAPE
};

// Color Palette
export const COLORS = {
	BACKGROUND_SPACE: '#0a0a0f',
	BACKGROUND_GRADIENT_START: '#1a0a2e',
	BACKGROUND_GRADIENT_END: '#16213e',
	PLATFORM_NORMAL: '#4a90e2',
	PLATFORM_BREAKABLE: '#e74c3c',
	PLATFORM_MOVING: '#f39c12',
	PLATFORM_BOUNCY: '#2ecc71',
	ENEMY_GROUND: '#8e44ad',
	ENEMY_FLYING: '#e67e22',
	POWERUP_SHIELD: '#3498db',
	POWERUP_WEAPON: '#e74c3c',
	POWERUP_GRAVITY: '#9b59b6',
	POWERUP_JUMP: '#2ecc71'
};

// Animation Frame Rates
export const ANIMATION_FPS = {
	PLAYER_IDLE: 4,
	PLAYER_JUMP: 8,
	PLAYER_FALL: 6,
	ENEMY_PATROL: 6,
	POWERUP_COLLECT: 12
};

// Entity Dimensions (will be overridden when sprites are loaded)
export const ENTITY_SIZES = {
	PLAYER_WIDTH: 32,
	PLAYER_HEIGHT: 48,
	PLATFORM_WIDTH: 128,
	PLATFORM_HEIGHT: 16,
	ENEMY_WIDTH: 32,
	ENEMY_HEIGHT: 32,
	POWERUP_WIDTH: 24,
	POWERUP_HEIGHT: 24,
	PROJECTILE_WIDTH: 8,
	PROJECTILE_HEIGHT: 8
};

// Game State Transition Delays
export const STATE_TRANSITION_DELAY = 1.0; // Seconds before auto-transitions
export const VICTORY_DISPLAY_TIME = 3.0; // How long to show victory screen
export const GAME_OVER_DELAY = 2.0; // Delay before showing game over screen

// Save/Load Keys for localStorage
export const SAVE_KEYS = {
	HIGH_SCORES: 'cosmic_hopper_high_scores',
	SETTINGS: 'cosmic_hopper_settings', 
	GAME_STATE: 'cosmic_hopper_save_game'
};

// Performance Settings
export const MAX_ENTITIES_ON_SCREEN = 50; // Limit for performance
export const ENTITY_CLEANUP_DISTANCE = CANVAS_HEIGHT * 2; // When to remove off-screen entities
export const PLATFORM_GENERATION_AHEAD = 5; // How many screens ahead to generate platforms
