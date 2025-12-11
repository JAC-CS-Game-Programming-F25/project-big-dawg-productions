import { CANVAS_HEIGHT, CAMERA_FOLLOW_SPEED, CAMERA_DEADZONE_Y } from '../globals.js';

export default class Camera {
    constructor() {
        this.y = 0; // top of the camera
    }

    follow(target, dt) {
        const targetCenterY = target.y + target.height / 2;
        const desiredTop = Math.max(0, targetCenterY - CANVAS_HEIGHT / 2);

        // Only move camera upward when player goes above deadzone
        if (targetCenterY < this.y + CANVAS_HEIGHT / 2 - CAMERA_DEADZONE_Y) {
            this.y += (desiredTop - this.y) * Math.min(1, CAMERA_FOLLOW_SPEED * dt);
        }
        // Never scroll down when player falls
        this.y = Math.min(this.y, desiredTop);
    }

    worldToScreenY(y) {
        return y - this.y;
    }
}