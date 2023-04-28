import Vertex from "./vertex.js";
let fov = 90;
let aspect = innerWidth / innerHeight;
let near = 0.1;
let far = 1000;

function createPerspectiveProjectionMatrix(fovy, aspect, near, far) {
  const f = 1.0 / tan(fovy / 2.0);
  const nf = 1.0 / (near - far);

  return [
    [f / aspect, 0, 0, 0],
    [0, f, 0, 0],
    [0, 0, (far + near) * nf, -1],
    [0, 0, 2 * far * near * nf, 0],
  ];
}

export let projectionMatrix = createPerspectiveProjectionMatrix(
  fov,
  aspect,
  near,
  far
);
export let orthographiqueProjectionMatrix = [
  [1, 0, 0],
  [0, 1, 0],
];

export let angle = {
  x: 0,
  y: 0,
  z: 0,
};

export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}
export function sin(teta) {
  return Math.sin(degToRad(teta));
}
export function cos(teta) {
  return Math.cos(degToRad(teta));
}
export function tan(teta) {
  return Math.tan(degToRad(teta));
}

export var rotationMatrix = {
  rotationX: [
    [1, 0, 0],
    [0, cos(angle.x), -sin(angle.x)],
    [0, sin(angle.x), cos(angle.x)],
  ],

  rotationY: [
    [cos(angle.y), 0, sin(angle.y)],
    [0, 1, 0],
    [-sin(angle.y), 0, cos(angle.y)],
  ],

  rotationZ: [
    [cos(angle.z), -sin(angle.z), 0],
    [sin(angle.z), cos(angle.z), 0],
    [0, 0, 1],
  ],
};
export function updateAngle(prop, newAngle) {
  angle[prop] = newAngle;
  rotationMatrix = {
    rotationX: [
      [1, 0, 0],
      [0, cos(angle.x), -sin(angle.x)],
      [0, sin(angle.x), cos(angle.x)],
    ],

    rotationY: [
      [cos(angle.y), 0, sin(angle.y)],
      [0, 1, 0],
      [-sin(angle.y), 0, cos(angle.y)],
    ],

    rotationZ: [
      [cos(angle.z), -sin(angle.z), 0],
      [sin(angle.z), cos(angle.z), 0],
      [0, 0, 1],
    ],
  };
}
export function getCanvas(id, { fillScreen = false } = {}) {
  const canvas = document.getElementById(id);
  if (fillScreen) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  return {
    ctx: canvas.getContext("2d"),
    width: canvas.width,
    height: canvas.height,
  };
}
export function fill(ctx = undefined, color = "white") {
  ctx.fillStyle = color;
}
export function stroke(ctx = undefined, color = "white") {
  ctx.strokeStyle = color;
}
export function matrixMultiply(A, B) {
  let mat1 = [...A];
  let mat2 = [...B];
  if (!Array.isArray(mat1[0])) {
    mat1 = new Array(A.length);
    for (let i = 0; i < A.length; i++) {
      mat1[i] = [A[i]];
    }
  }
  if (!Array.isArray(mat2[0])) {
    mat2 = new Array(B.length);
    for (let i = 0; i < B.length; i++) {
      mat2[i] = [B[i]];
    }
  }
  let n = mat1.length;
  let m = mat1[0].length;
  let p = mat2[0].length;
  if (m !== mat2.length)
    throw new Error("columns of matrix1 must match rows of matrix2");
  let result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = new Array(p);
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += mat1[i][k] * mat2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function drawVertex(ctx = undefined, vertex, { weight = 1 } = {}) {
  ctx.beginPath();
  ctx.arc(vertex[0], vertex[1], weight, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}
export function connect(ctx, i, j, vertices) {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.moveTo(vertices[i][0], vertices[i][1]);
  ctx.lineTo(vertices[j][0], vertices[j][1]);
  ctx.stroke();
  ctx.closePath();
}
function drawShape(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  ctx.lineTo(points[1][0], points[1][1]);
  ctx.lineTo(points[2][0], points[2][1]);
  ctx.lineTo(points[3][0], points[3][1]);
  ctx.lineTo(points[0][0], points[0][1]);
  ctx.fill();
  ctx.closePath();
}
export function drawFaces(ctx, cube) {
  let faces = [
    [0, 1, 2, 3], // front face
    [1, 5, 6, 2], // left face
    [4, 0, 3, 7], // right face
    [5, 4, 7, 6], // back face
    [4, 5, 1, 0], // top face
    [3, 2, 6, 7], // bottom face
  ];
  for (let face of faces) {
    let vertices = [];
    for (let i = 0; i < 4; i++) {
      vertices[i] = cube[face[i]];
    }
    drawShape(ctx, vertices);
  }
}
export function drawEdges(ctx, cube) {
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // front face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // back face
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // connecting edges
  ];

  for (let edge of edges) {
    connect(ctx, edge[0], edge[1], cube);
  }
}
export function Mesh(cube, { tx = 0, ty = 0, tz = 0 } = {}) {
  let projectedCube = [];
  for (let vertex of cube) {
    let point = new Vertex(vertex[0], vertex[1], vertex[2]);
    point.rotate("x");
    point.rotate("y");
    point.rotate("z");
    point.translate(tx, ty, tz);
    projectedCube.push(point.projection);
  }
  return projectedCube;
}

export function pushMesh(
  ctx,
  mesh,
  { vertices = false, faces = false, edges = false, stroke = 1 } = {}
) {
  if (vertices)
    for (let vertex of mesh) {
      drawVertex(ctx, vertex, { weight: stroke });
    }
  if (faces) {
    drawFaces(ctx, mesh);
  }
  if (edges) {
    drawEdges(ctx, mesh);
  }
}
export function generateSphereVertices(radius, divisions) {
  const vertices = [];
  for (let i = 0; i <= divisions; i++) {
    const phi = (Math.PI * i) / divisions;
    for (let j = 0; j <= divisions; j++) {
      const theta = (2 * Math.PI * j) / divisions;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      vertices.push([x, y, z]);
    }
  }
  return vertices;
}

export function generateTorusVertices(r, R, n, m) {
  // r is the radius of the tube
  // R is the radius of the torus
  // n is the number of vertices along the tube
  // m is the number of vertices around the torus

  // Generate the vertices
  const phi = new Array(m).fill(0).map((_, i) => (2 * Math.PI * i) / m);
  const theta = new Array(n).fill(0).map((_, i) => (2 * Math.PI * i) / n);
  const vertices = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const x = (R + r * Math.cos(theta[i])) * Math.cos(phi[j]);
      const y = (R + r * Math.cos(theta[i])) * Math.sin(phi[j]);
      const z = r * Math.sin(theta[i]);
      vertices.push([x, y, z]);
    }
  }

  return vertices;
}
