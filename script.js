import {
  angle,
  pushMesh,
  generateSphereVertices,
  getCanvas,
  Mesh,
  fill,
  stroke,
  updateAngle,
  generateTorusVertices,
} from "./utils.js";

const { ctx, width, height } = getCanvas("screen", { fillScreen: true });
fill(ctx, "#ff005940");
stroke(ctx, "#ffbf00");
function scaleMesh(cube, amount) {
  for (let i = 0; i < cube.length; i++)
    for (let j = 0; j < cube[0].length; j++) {
      cube[i][j] *= amount;
    }
  return cube;
}
let cubeVertices = [
  [1, 1, 1],
  [-1, 1, 1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, -1],
  [1, -1, -1],
];
let sphereGeoMetry = generateSphereVertices(100, 50);

let torusGeoMetry = generateTorusVertices(100, 200, 70, 60);

updateAngle("z", angle.z + 10);
updateAngle("x", angle.x + 25);

let translation = innerHeight / 1.5;
torusGeoMetry = scaleMesh(torusGeoMetry, 0.5);
cubeVertices = scaleMesh(cubeVertices, 80);
function loop() {
  // requestAnimationFrame(loop);
  ctx.clearRect(0, 0, width, height);
  updateAngle("y", angle.y + 1);
  let projectedTorus = Mesh(torusGeoMetry, {
    ty: translation / 2,
    tx: translation * 2,
  });
  // let projectedSphere = Mesh(sphereGeoMetry, {
  //   ty: translation / 2,
  //   tx: 300 + translation * 2,
  // });
  // let projectedCube = Mesh(cubeVertices, {
  //   ty: translation / 2,
  //   tx: -300 + translation * 2,
  // });
  fill(ctx, "#ff005940");
  // pushMesh(ctx, projectedCube, {
  //   vertices: true,
  //   edges: true,
  //   faces: true,
  //   stroke: 3,
  // });
  fill(ctx, "#ffbf0070");
  // pushMesh(ctx, projectedSphere, { vertices: true });
  pushMesh(ctx, projectedTorus, { vertices: true });
}
// onload = () => requestAnimationFrame(loop);
let frameRate = 30; //fixing the frame rate will gain more performance
setInterval(loop, 1000 / frameRate);
