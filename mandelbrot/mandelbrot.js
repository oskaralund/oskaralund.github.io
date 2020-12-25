let canvas = document.querySelector("#glCanvas");
let gl = canvas.getContext("webgl");

const vsSource = `
attribute vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

const fsSource = `
/* Fragment shader that renders Mandelbrot set */
precision highp float;

/* Width and height of screen in pixels */
uniform vec2 u_resolution;

/* Point on the complex plane that will be mapped to the center of the screen */
uniform vec2 u_zoomCenter;

/* Distance between left and right edges of the screen. This essentially specifies
   which points on the plane are mapped to left and right edges of the screen.
   Together, u_zoomCenter and u_zoomSize determine which piece of the complex
   plane is displayed. */
uniform float u_zoomSize;

/* How many iterations to do before deciding that a point is in the set. */
uniform int u_maxIterations;

vec2 f(vec2 z, vec2 c) {
    return mat2(z,-z.y,z.x)*z + c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  /* Decide which point on the complex plane this fragment corresponds to.*/
  vec2 c = u_zoomCenter + (uv * 4.0 -vec2(2.0)) * (u_zoomSize / 4.0);

  /* Now iterate the function. */
  vec2 z = vec2(0.0);
  bool escaped = false;
  float abs;
  for (int i = 0; i < 10000; i++) {
    /* Unfortunately, GLES 2 doesn't allow non-constant expressions in loop
       conditions so we have to do this ugly thing instead. */
    if (i > u_maxIterations) break;
    z = f(z, c);
    abs = length(z);
    if (length(z) > 2.0) {
      escaped = true;
      abs = 2.0;
      break;
    }
  }
  gl_FragColor = vec4(abs/2.0, abs/2.0, abs/2.0, 1.0);
}
`;

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

let vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

let program = createProgram(gl, vertexShader, fragmentShader);
let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

let positions = [];
let N = 501;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    positions.push(-1 + (i * 2) / (N - 1));
    positions.push(-1 + (j * 2) / (N - 1));
  }
}
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
let size = 2;
let type = gl.FLOAT;
let normalize = false;
let stride = 0;
let offset = 0;
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset
);

let loc = gl.getUniformLocation(program, "u_resolution");
gl.uniform2fv(loc, [500, 500]);
loc = gl.getUniformLocation(program, "u_zoomCenter");
gl.uniform2fv(loc, [-0.7, 0]);
loc = gl.getUniformLocation(program, "u_zoomSize");
gl.uniform1f(loc, 3);
loc = gl.getUniformLocation(program, "u_maxIterations");
gl.uniform1i(loc, 50);

let primitiveType = gl.POINTS;
let count = N * N;
let zoom = 3;
let zoom_center = [-0.7, 0.0];
gl.drawArrays(primitiveType, offset, count);

d3.select("body").on("keydown", function (e) {
  switch (e.keyCode) {
    case 65: //left
      zoom_center[0] -= zoom*0.1;
      break;
    case 87: //up
      zoom_center[1] += zoom*0.1;
      break;
    case 68: //right
      zoom_center[0] += zoom*0.1;
      break;
    case 83: //down
      zoom_center[1] -= zoom*0.1;
      break;
    case 69: //E
      zoom *= 0.9;
      break;
    case 81: //Q
      zoom *= 1.1;
      break;
    case 82: //R
      zoom = 3.0;
      zoom_center = [-0.7, 0];
      break;
  }
  let loc = gl.getUniformLocation(program, "u_zoomCenter");
  gl.uniform2fv(loc, zoom_center);
  loc = gl.getUniformLocation(program, "u_zoomSize");
  gl.uniform1f(loc, zoom);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(primitiveType, offset, count);
});
