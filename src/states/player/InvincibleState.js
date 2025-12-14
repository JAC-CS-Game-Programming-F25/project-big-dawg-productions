export default class InvincibleState {
  constructor(player) {
    this.player = player;
    this.name = 'invincible';
  }
  enter() {
    // keep current animation based on vy, but player can't die
  }
  update(dt) {
    // Exit to jumping when landing is signaled externally
    // Landing is handled by PlayState calling player.onLand()
  }
  exit() {}
}
