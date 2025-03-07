import AutoBind from 'auto-bind';
import gsap from 'gsap';

import LazyLoad from './LazyLoad';
import PageLoad from './PageLoad';

import { map, each } from '../utils/dom';

import Appear from '../animations/Appear';
import Text from '../animations/Text';
import Title from '../animations/Title';
import { events } from '../utils/events';

export default class Page {
  constructor({ classes, id, element, elements }) {
    AutoBind(this);

    this.classes = { ...classes };
    this.id = id;
    this.selectors = {
      element,
      elements: {
        lazyLoaders: '[lazy-src]',
        pageLoaders: '[page-src]',

        animationsAppears: '[data-animation="appear"]',
        animationsTexts: '[data-animation="text"]',
        animationsTitles: '[data-animation="title"]',

        ...elements,
      },
    };

    this.isVisible = false;

    this.create();
  }

  create() {
    this.animations = [];

    this.element = document.querySelector(this.selectors.element);
    this.elements = {};

    each(this.selectors.elements, ([key, selector]) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList
      ) {
        this.elements[key] = selector;
      } else if (Array.isArray(selector)) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = this.element.querySelectorAll(selector);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector);
        }
      }
    });

    this.createAnimations();
    this.createLazyLoader();
    this.addEventListeners();
  }

  /**
   * Animations.
   */
  createAnimations() {
    /**
     * Appear.
     */
    this.animationsAppear = map(this.elements.animationsAppears, (element) => {
      return new Appear({ element });
    });

    this.animations.push(...this.animationsAppear);

    /**
     * Text.
     */
    this.animationsText = map(this.elements.animationsTexts, (element) => {
      return new Text({ element });
    });

    this.animations.push(...this.animationsText);

    /**
     * Title.
     */
    this.animationsTitle = map(this.elements.animationsTitles, (element) => {
      return new Title({ element });
    });

    this.animations.push(...this.animationsTitle);
  }

  /**
   * Loaders.
   */
  createLazyLoader() {
    each(
      this.elements.lazyLoaders,
      (element) =>
        new LazyLoad({
          element,
        })
    );
  }

  createPageLoader() {
    if (this.imagesLoaded) return;

    this.imagesLoaded = true;

    each(this.elements.pageLoaders, (element) => new PageLoad({ element }));
  }

  /**
   * Animations.
   */
  show() {
    each(this.animations, (animation) => animation.createAnimation());

    return new Promise((res) => {
      const tl = gsap.timeline();

      tl.set(this.element, { autoAlpha: 1 }, 0).call(() => {
        this.isVisible = true;
        res();
      });
    });
  }

  /**
   * Events.
   */
  onResize(event) {
    window.requestAnimationFrame(() => {
      each(this.animations, (animation) => {
        if (animation.onResize) {
          animation.onResize();
        }
      });
    });
  }

  onTouchDown(event) {}

  onTouchMove(event) {}

  onTouchUp() {}

  onLenis(event) {}

  /**
   * Listeners.
   */
  addEventListeners() {
    events.on('resize', this.onResize);
    events.on('touchdown', this.onTouchDown);
    events.on('touchmove', this.onTouchMove);
    events.on('touchup', this.onTouchUp);
    events.on('lenis', this.onLenis);
    events.on('update', this.update);
  }

  /**
   * Loop.
   */
  update() {
    if (!this.isVisible) return;

    each(this.animations, (animation) => {
      if (animation.update) {
        animation.update();
      }
    });
  }
}
