export default class DeadState {
  constructor(player) {
    this.player = player;
    this.name = 'dead';
  }
  enter() {}
  update(dt) {}
  exit() {}
}
