export default class ShootingState {
  constructor(player) {
    this.player = player;
    this.name = 'shooting';
    this.timer = 0;
    this.duration = 0.2; // short anim
  }
  enter() {
    this.timer = this.duration;
    // Keep jump animation during shooting or add a dedicated one if available
  }
  update(dt) {
    this.timer = Math.max(0, this.timer - dt);
    if (this.timer === 0) {
      this.player.stateMachine.change('jumping');
    }
  }
  exit() {}
}
