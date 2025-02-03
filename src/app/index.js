import '../styles/index.scss';
import './utils/scroll';

import AutoBind from 'auto-bind';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Stats from 'stats.js';
import Lenis from 'lenis';

import Home from './page/Home';
import Canvas from './canvas';

import Preloader from './components/Preloader';
import Grid from './components/Grid';

import Clock from './classes/Clock';
import Responsive from './classes/Responsive';

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    AutoBind(this);

    this.clock = new Clock();
    this.isVisible = true;
    this.odlElapsedTime = 0;
    this.lenis = null;

    if (import.meta.env.MODE === 'development') {
      this.createStats();
      this.createGrid();
    }

    this.init();
  }

  init() {
    this.createResponsive();

    this.createPage();
    this.createCanvas();

    this.createPreloader();
    this.createLenis();

    this.addEventListeners();

    this.update();
  }

  /**
   * Create.
   */
  createPage() {
    this.page = new Home({ responsive: this.responsive });
  }

  createCanvas() {
    this.canvas = new Canvas({
      size: this.responsive.size,
    });
  }

  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.load(this.page.element);

    this.preloader.once('loaded', this.onPreloaded);
  }

  createStats() {
    this.stats = new Stats();

    this.stats.showPanel(0);

    document.body.appendChild(this.stats.dom);
  }

  createGrid() {
    this.grid = new Grid();
  }

  createResponsive() {
    this.responsive = new Responsive();
  }

  createLenis() {
    this.lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.125,
    });
    this.lenis.stop();
    this.lenis.on('scroll', ScrollTrigger.update);
    this.lenis.on('scroll', this.onWheel);

    this.page.lenis = this.lenis;
  }

  /**
   * Events.
   */
  async onPreloaded() {
    this.onResize();

    this.canvas.onPreloaded();
    this.page.createPageLoader();

    await Promise.all([this.page.show(), this.canvas.show()]);

    this.lenis.start();

    this.isVisible = false;
  }

  onResize() {
    if (this.responsive && this.responsive.onResize) {
      this.responsive.onResize();
    }

    if (this.page && this.page.onResize) {
      this.page.onResize(this.responsive.size, this.responsive.fontSize);
    }

    if (this.grid && this.grid.onResize) {
      this.grid.onResize();
    }

    window.requestAnimationFrame(() => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize(this.responsive.size);
      }
    });
  }

  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event);
    }

    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }

    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event);
    }
  }

  onWheel(event) {
    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(event);
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(event);
    }
  }

  /**
   * Loop.
   */
  update(time) {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.odlElapsedTime;
    this.odlElapsedTime = elapsedTime;

    if (this.stats) {
      this.stats.begin();
    }

    if (!this.isVisible) {
      this.lenis.raf(time);
    }

    if (this.page) {
      this.page.update(this.lenis.scroll, deltaTime);
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.lenis.scroll, deltaTime);
    }

    if (this.stats) {
      this.stats.end();
    }

    ScrollTrigger.update();

    window.requestAnimationFrame(this.update.bind(this));
  }

  /***
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener('resize', this.onResize, { passive: true });

    window.addEventListener('mousedown', this.onTouchDown, {
      passive: true,
    });
    window.addEventListener('mousemove', this.onTouchMove, {
      passive: true,
    });
    window.addEventListener('mouseup', this.onTouchUp, { passive: true });

    window.addEventListener('touchstart', this.onTouchDown, {
      passive: true,
    });
    window.addEventListener('touchmove', this.onTouchMove, {
      passive: true,
    });
    window.addEventListener('touchend', this.onTouchUp, { passive: true });
  }
}

new App();
