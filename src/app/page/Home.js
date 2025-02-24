import Page from '../classes/Page';

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {},
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
  onResize(event) {
    super.onResize(event);
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    super.addEventListeners();
  }

  /**
   * Loop.
   */
  update(event) {
    super.update(event);
  }
}
