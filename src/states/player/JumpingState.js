export default class JumpingState {
  constructor(player) {
    this.player = player;
    this.name = 'jumping';
  }
  enter() {
    if (this.player.jumpAnim) {
      this.player.currentAnim = this.player.jumpAnim;
      this.player.currentAnim.refresh();
    }
  }
  update(dt) {
    // Transition to falling when ascending stops (vy >= 0)
    if (this.player.vy >= 0) {
      this.player.stateMachine.change('falling');
    }
  }
  exit() {}
}
