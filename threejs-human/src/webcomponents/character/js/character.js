import { Object3D, ObjectLoader } from 'three';

import * as JSONModel from '../models/standard-male-figure.json';

export class Character extends Object3D {
  constructor () {
    super();
    this.createModel();
  }

  getModel () {
    let loader = new ObjectLoader();
    return loader.parse(JSON.parse(JSONModel));
  }

  createModel () {
    this.add(this.getModel());
  }
}
