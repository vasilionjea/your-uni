type pojo = { [key: string]: unknown };

export class StateEvent extends Event {
  constructor(private readonly state: pojo) {
    super('statechange');
  }
}

export default class State extends EventTarget {
  private state: pojo;

  constructor(initState = {}) {
    super();
    this.state = initState;
  }

  setState(newState: pojo) {
    if (newState === this.state) return;
    this.state = newState;
    this.dispatchEvent(new StateEvent(newState));
  }

  getState() {
    return { ...this.state };
  }
}
