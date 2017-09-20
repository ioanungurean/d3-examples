let OrbitControls = require('three-orbitcontrols');

import { Scene, WebGLRenderer, PerspectiveCamera, AmbientLight, PointLight, Vector3, Raycaster } from 'three';
import { Character } from 'character';

export class App {
  constructor () {
    let renderer = this.createRender();
    let camera = this.createCamera();

    this.scene = new Scene();
    let model = new Character();
    this.scene.add(model);

    this.addContols(renderer, camera);
    this.createLight();
    this.renderScene(renderer, camera);
  }

  createRender () {
    let renderer = new WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x99CCCC);
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  createCamera () {
    let camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 6, 100);
    return camera;
  }

  createLight () {
    let ambientLight = new AmbientLight(0xffffff, 0.5);
    let pointLight = new PointLight(0xffffff, 0.5);

    this.scene.add(ambientLight);
    this.scene.add(pointLight);
  }

  addContols (renderer, camera) {
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 60;
    controls.maxDistance = 80;
  }

  renderScene (renderer, camera) {
    let render = () => {
      requestAnimationFrame(render);
      renderer.render(this.scene, camera);
    };
    render();
  }
}
