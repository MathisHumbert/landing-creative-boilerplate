import * as THREE from 'three';

import Media from './Media';

export default class Canvas {
  constructor({ size }) {
    this.template = null;
    this.screen = size;

    this.createScene();
    this.createCamera();
    this.createRender();

    this.onResize(size);
  }

  /**
   * THREE.
   */
  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.screen.width / this.screen.height,
      0.1,
      100
    );
    this.camera.position.z = 5;
  }

  createRender() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(this.renderer.domElement);
  }

  createMedia() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 16, 16);

    this.media = new Media({
      element: document.querySelector('.home__media'),
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
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
  onResize(size) {
    this.screen = size;

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };

    if (this.media && this.media.onResize) {
      this.media.onResize({ screen: this.screen, viewport: this.viewport });
    }
  }

  onTouchDown(event) {}

  onTouchMove(event) {}

  onTouchUp() {}

  onWheel(normalized) {}

  /**
   * Loop.
   */
  update(scroll, time) {
    if (this.media && this.media.update) {
      this.media.update(scroll);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
