import Page from '../classes/Page';

export default class Home extends Page {
  constructor({ responsive }) {
    super({
      id: 'home',
      element: '.home',
      elements: {},
      responsive,
    });
  }

  /**
   * Create.
   */
  create() {
    super.create();
  }

  /**
   * Animations.
   */
  show() {
    return super.show();
  }

  /**
   * Events
   */
  onResize(size, fontSize) {
    super.onResize(size, fontSize);

    this.fontSize = fontSize;
    this.size = size;
  }

  /**
   * Listeners.
   */
  addEventListeners() {}

  /**
   * Loop.
   */
  update(scroll, time) {
    super.update(scroll, time);
  }
}
