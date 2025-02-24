import { PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import AutoBind from 'auto-bind';

import Media from './Media';

import { responsive } from '../classes/Responsive';
import { events } from '../utils/events';

export default class Canvas {
  constructor() {
    AutoBind(this);

    this.createScene();
    this.createCamera();
    this.createRender();

    this.addEventListeners();
  }

  /**
   * THREE.
   */
  createScene() {
    this.scene = new Scene();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      45,
      responsive.screen.width / responsive.screen.height,
      0.1,
      100
    );
    this.camera.position.z = 5;

    responsive.setCamera(this.camera);
  }

  createRender() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setSize(responsive.screen.width, responsive.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(this.renderer.domElement);
  }

  createMedia() {
    this.media = new Media({
      element: document.querySelector('.home__media'),
      scene: this.scene,
      geometry: new PlaneGeometry(1, 1, 16, 16),
    });
  }

  onPreloaded() {
    this.createMedia();
  }

  /**
   * Animations.
   */
  show() {
    let promise;

    if (this.media && this.media.show) {
      promise = this.media.show();
    }

    return promise;
  }

  /**
   * Events.
   */
  onResize() {
    this.renderer.setSize(responsive.screen.width, responsive.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.aspect = responsive.screen.width / responsive.screen.height;
    this.camera.updateProjectionMatrix();
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
    events.on('end-update', this.update);
  }

  /**
   * Loop.
   */
  update() {
    this.renderer.render(this.scene, this.camera);
  }
}
