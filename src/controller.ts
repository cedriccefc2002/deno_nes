export enum BUTTON {
  A = 0,
  B = 1,
  SELECT = 2,
  START = 3,
  UP = 4,
  DOWN = 5,
  LEFT = 6,
  RIGHT = 7,
}

export class Controller {
  public state = new Array<number>(8);
  public constructor() {
    for (var i = 0; i < this.state.length; i++) {
      this.state[i] = 0x40;
    }
  }

  public buttonDown(key: BUTTON) {
    this.state[key] = 0x41;
  };

  public buttonUp(key: BUTTON) {
    this.state[key] = 0x40;
  }
}