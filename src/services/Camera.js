import { CANVAS_HEIGHT, CAMERA_FOLLOW_SPEED, CAMERA_DEADZONE_Y } from '../globals.js';

export default class Camera {
    constructor() {
        this.y = 0; // top of the camera
    }

    follow(target, dt) {
        const targetCenterY = target.y + target.height / 2;
        
        // Camera should always follow player upward - track the highest point reached
        const desiredCameraY = targetCenterY - CANVAS_HEIGHT / 2;
        
        // Only move camera up, never down (endless runner style)
        if (desiredCameraY < this.y) {
            this.y = desiredCameraY;
        }
    }

    worldToScreenY(y) {
        return y - this.y;
    }
}