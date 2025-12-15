import BaseState from './BaseState.js';
import GameStateName from '../enums/GameStateName.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, UI_COLOR, UI_FONT_SIZE, UI_FONT_FAMILY, stateMachine, input, KEYS, COLORS } from '../globals.js';

export default class InstructionsState extends BaseState {
    update(dt) {
        if (input.isKeyPressed(KEYS.ESCAPE) || input.isKeyPressed(KEYS.ENTER)) {
            stateMachine.change(GameStateName.TitleScreen);
        }
    }

    render(ctx) {
        ctx.fillStyle = COLORS.BACKGROUND_SPACE;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = UI_COLOR;
        ctx.textAlign = 'center';
        ctx.font = `${UI_FONT_SIZE * 0.6}px ${UI_FONT_FAMILY}`;
        ctx.fillText('How to Play', CANVAS_WIDTH / 2, 60);

        ctx.font = `${UI_FONT_SIZE * 0.55}px ${UI_FONT_FAMILY}`;
        const sections = [
            { title: 'Controls', items: [
                'Move: A / D to steer mid-air.',
                'Auto-Jump: Landing triggers a jump automatically.',
                'Double Jump: Press Space once mid-air when active (consumes on use).',
                'Shoot: Press X when Weapon power-up is active.',
                'Pause: P to pause/resume. Enter / Esc to exit this screen.'
            ]},
            { title: 'Goal', items: [
                'Ascend by landing on platforms and avoiding hazards. Survive and climb higher.'
            ]},
            { title: 'Platforms', items: [
                'Normal: Standard bounce upward on landing.',
                'Bouncy: Extra-strong bounce for higher jumps.',
                'Breakable: Crumbles after landing; weaker bounce.',
                'Moving: Slides horizontally; time your landings.'
            ]},
            { title: 'Power-Ups', items: [
                'Shield: Temporary invincibility against enemies.',
                'Double Jump: One mid-air jump to bridge a gap.',
                'Gravity Flip: Briefly reverse gravity; screen rotates for clarity.',
                'Weapon: Shoot with X; defeat enemies to earn points.'
            ]},
            { title: 'Enemies', items: [
                'Ground: Patrol platforms; contact hurts unless shielded.',
                'Flying: Roam the air; dodge or shoot them when armed.'
            ]},
            { title: 'Scoring & Milestones', items: [
                'Score: Earn points from platform landings and enemy defeats.',
                'Height: Your best height is tracked during the run.',
                'Milestones: Bronze / Silver / Gold banners at key heights; keep climbing!',
                'High Scores: Saved locally; view from Title screen.'
            ]}
        ];

        let y = 105;
        const lineGap = 17;
        const sectionGap = 12;
        sections.forEach((section) => {
            // Section title (slightly larger)
            ctx.font = `${UI_FONT_SIZE * 0.55}px ${UI_FONT_FAMILY}`;
            ctx.fillText(section.title, CANVAS_WIDTH / 2, y);
            y += sectionGap;
            // Section items
            ctx.font = `${UI_FONT_SIZE * 0.5}px ${UI_FONT_FAMILY}`;
            section.items.forEach((item) => {
                ctx.fillText(item, CANVAS_WIDTH / 2, y);
                y += lineGap;
            });
            y += 4; // small spacing between sections
        });
    }
}