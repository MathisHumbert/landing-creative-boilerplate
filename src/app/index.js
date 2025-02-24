import '../styles/index.scss';
import './utils/scroll';
import './classes/WindowEvents';

import AutoBind from 'auto-bind';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Stats from 'stats.js';

import { lenis } from './classes/Lenis';

import Home from './page/Home';
import Canvas from './canvas';

import Preloader from './components/Preloader';
import Grid from './components/Grid';

import { events } from './utils/events';

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    AutoBind(this);

    if (import.meta.env.MODE === 'development') {
      this.createStats();
      this.createGrid();
    }

    this.init();
  }

  init() {
    this.createPage();
    this.createCanvas();
    this.createPreloader();

    this.addEventListeners();
  }

  /**
   * Create.
   */
  createPage() {
    this.page = new Home();
  }

  createCanvas() {
    this.canvas = new Canvas();
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

  /**
   * Events.
   */
  async onPreloaded() {
    this.canvas.onPreloaded();
    this.page.createPageLoader();

    await Promise.all([this.page.show(), this.canvas.show()]);

    lenis.start();
  }

  /**
   * Loop.
   */
  update() {
    if (this.stats) {
      this.stats.begin();
    }

    if (this.stats) {
      this.stats.end();
    }

    ScrollTrigger.update();
  }

  /***
   * Listeners.
   */
  addEventListeners() {
    events.on('update', this.update.bind(this));
  }
}

new App();
