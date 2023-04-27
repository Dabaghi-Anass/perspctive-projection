import {
  drawVertex,
  matrixMultiply,
  rotationMatrix,
  projectionMatrix,
} from "./utils.js";

export default class Vertex {
  constructor(x, y, z) {
    this.position = [x, y, z];
  }
  fromMatrix(mat) {
    let vertex = new Array(mat.length);
    for (let i = 0; i < mat.length; i++) {
      vertex[i] = mat[i][0];
    }
    return vertex;
  }
  draw(ctx) {
    drawVertex(ctx, this);
  }
  translate(tx = 0, ty = 0, tz = 0) {
    let translationMatrix = [
      [1, 0, 0, tx],
      [0, 1, 0, ty],
      [0, 0, 1, tz],
      [0, 0, 0, 1],
    ];
    let translatedMat = matrixMultiply(translationMatrix, [
      ...this.position,
      1,
    ]);
    translatedMat.pop();
    let translation = this.fromMatrix(translatedMat);
    this.position = [...translation];
    return translation;
  }
  rotate(vect) {
    let rotatedPoint = [];
    switch (vect) {
      case "x":
        rotatedPoint = [
          ...this.fromMatrix(
            matrixMultiply(rotationMatrix.rotationX, this.position)
          ),
        ];
        break;
      case "y":
        rotatedPoint = [
          ...this.fromMatrix(
            matrixMultiply(rotationMatrix.rotationY, this.position)
          ),
        ];
        break;
      case "z":
        rotatedPoint = [
          ...this.fromMatrix(
            matrixMultiply(rotationMatrix.rotationZ, this.position)
          ),
        ];
        break;
    }
    this.position = [...rotatedPoint];
    return rotatedPoint;
  }
  get projection() {
    let projection = matrixMultiply(projectionMatrix, [...this.position, 1]);
    projection = projection.slice(0, 2);
    return this.fromMatrix(projection);
  }
}
