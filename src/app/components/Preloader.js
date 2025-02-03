import * as THREE from 'three';
import imagesLoaded from 'imagesloaded';
import FontFaceObserver from 'fontfaceobserver';

import Component from '../classes/Component';
import { map } from '../utils/dom';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
    });

    window.TEXTURES = {};

    this.textureLoader = new THREE.TextureLoader();
  }

  /**
   * Events.
   */
  load(content) {
    const images = content.querySelectorAll('data-src');

    const preloadImages = new Promise((res) => {
      imagesLoaded(content, { background: true }, res);
    });

    const preloadTextures = this.loadTextures([...images, 'texture.jpeg']);

    const preloadFonts = this.loadFonts();

    const preloaderAnimation = this.animatePreloader();

    Promise.all([
      preloadImages,
      preloadTextures,
      preloadFonts,
      preloaderAnimation,
    ]).then(() => {
      if (this.element) {
        this.element.parentNode.removeChild(this.element);
      }

      this.emit('loaded');
    });
  }

  loadFonts() {
    const satoshiFont = new FontFaceObserver('Satoshi');

    return Promise.all([satoshiFont.load()]);
  }

  loadTextures(images) {
    return Promise.all(
      map(
        images,
        (image) =>
          new Promise((res) => {
            this.textureLoader.load(image, (texture) => {
              texture.generateMipmaps = false;
              texture.minFilter = THREE.LinearFilter;
              texture.needsUpdate = true;

              window.TEXTURES[image] = texture;
              res();
            });
          })
      )
    );
  }

  /**
   * Animations.
   */
  animatePreloader() {
    return new Promise(async (res) => {
      res();
    });
  }
}
