export default class FallingState {
  constructor(player) {
    this.player = player;
    this.name = 'falling';
  }
  enter() {
    if (this.player.fallAnim) {
      this.player.currentAnim = this.player.fallAnim;
      this.player.currentAnim.refresh();
    }
  }
  update(dt) {
    // Transition to jumping when rising (vy < 0)
    if (this.player.vy < 0) {
      this.player.stateMachine.change('jumping');
    }
    // If invincibility active, move to invincible state
    if (this.player.invulnerableTimer && this.player.invulnerableTimer > 0) {
      this.player.stateMachine.change('invincible');
    }
  }
  exit() {}
}
