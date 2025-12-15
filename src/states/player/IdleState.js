export default class IdleState {
  constructor(player) {
    this.player = player;
    this.name = 'idle';
  }
  enter() {
    if (this.player.idleRenderer) {
      this.player.currentAnim = null;
      this.player.sprite = {
        render: (ctx, x, y) => this.player.idleRenderer.render(x, y)
      };
    }
  }
  update(dt) {
    // Leave idle when vertical movement resumes
    if (this.player.vy < 0) this.player.stateMachine.change('jumping');
    else if (this.player.vy > 0) this.player.stateMachine.change('falling');
  }
  exit() {}
}