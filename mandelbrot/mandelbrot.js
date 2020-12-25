let canvas = document.querySelector("#glCanvas");
let gl = canvas.getContext("webgl");

const vsSource = `
attribute vec4 pos;

void main() {
  gl_Position = pos;
}
`;

const fsSource = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_zoomCenter;
uniform float u_zoomSize;
uniform int u_maxIterations;

vec2 f(vec2 z, vec2 c) {
    return mat2(z,-z.y,z.x)*z + c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 c = u_zoomCenter + (uv * 4.0 -vec2(2.0)) * (u_zoomSize / 4.0);
  vec2 z = vec2(0.0);
  bool escaped = false;
  int num_iter = 0;
  for (int i = 0; i < 10000; i++) {
    num_iter += 1;
    if (i > u_maxIterations) break;
    z = f(z, c);
    if (length(z) > 2.0) {
      escaped = true;
      break;
    }
  }
  gl_FragColor = escaped ? vec4(vec3(float(num_iter))/float(u_maxIterations), 1.0) : vec4(vec3(0.0), 1.0);
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
let positionAttributeLocation = gl.getAttribLocation(program, "pos");
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
gl.uniform1i(loc, 100);

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
