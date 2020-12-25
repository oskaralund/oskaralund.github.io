let rows = 40;
let cols = 40;
let viewport_height = 300;
let viewport_width = 300;
let tile_width = viewport_width / cols;
let tile_height = viewport_height / rows;

let board_div = d3
  .select("body")
  .on("keydown", e => handle_keypress(e))
  .append("center")
  .append("div")
  .attr("id", "board_div");

let board_svg = board_div
  .append("svg")
  .attr("id", "board_svg")
  .attr("width", viewport_width)
  .attr("height", viewport_height);

board_svg
  .append("rect")
  .attr("width", viewport_width)
  .attr("height", viewport_height)
  .attr("stroke", "black")
  .attr("fill", "white");

let directions = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

let snake = {
  svg: board_svg.append("g"),
  coordinates: [
    [Math.floor(cols/2) + 3, Math.floor(rows/2)],
    [Math.floor(cols/2) + 2, Math.floor(rows/2)],
    [Math.floor(cols/2) + 1, Math.floor(rows/2)],
    [Math.floor(cols/2) + 0, Math.floor(rows/2)]
  ],
  direction: directions.right,
  new_direction: directions.right,
  grow: false,
};

let food = {
  svg: board_svg.append("rect"),
  coordinate: [0, 0]
};

function new_direction_is_opposite_current() {
  if (
    snake.new_direction[0] + snake.direction[0] == 0 &&
    snake.new_direction[1] + snake.direction[1] == 0
  ) {
    return true;
  } else {
    return false;
  }
}

function draw_snake() {
  snake.svg
    .selectAll("rect")
    .data(snake.coordinates)
    .join("rect")
    .attr("x", d => d[0] * tile_width)
    .attr("y", d => d[1] * tile_height)
    .attr("height", tile_height)
    .attr("width", tile_width)
    .attr("fill", "black")
    .attr("stroke", "gold");
}

function draw_food() {
  food.svg
    .attr("x", food.coordinate[0] * tile_width)
    .attr("y", food.coordinate[1] * tile_height)
    .attr("height", tile_height)
    .attr("width", tile_width)
    .attr("fill", "red");
}

function move_snake() {
  if (!snake.grow) {
    snake.coordinates.pop();
  } else {
    snake.grow = false;
  }

  //If new direction is opposite of current direction, continue in current direction
  if (new_direction_is_opposite_current()) {
    snake.new_direction = snake.direction;
  } else {
    snake.direction = snake.new_direction;
  }

  let head = [
    (cols + snake.coordinates[0][0] + snake.direction[0]) % cols,
    (rows + snake.coordinates[0][1] + snake.direction[1]) % rows
  ];
  snake.coordinates.unshift(head);
}

function eat_food() {
  if (
    snake.coordinates[0][0] == food.coordinate[0] &&
    snake.coordinates[0][1] == food.coordinate[1]
  ) {
    snake.grow = true;
    food.coordinate[0] = Math.floor(Math.random() * cols);
    food.coordinate[1] = Math.floor(Math.random() * rows);
  }
}

function detect_self_collision() {
  let head = snake.coordinates[0];
  for (let i = 1; i < snake.coordinates.length; i++) {
    if (
      snake.coordinates[i][0] == head[0] &&
      snake.coordinates[i][1] == head[1]
    ) {
      respawn();
    }
  }
}

function respawn() {
  snake.coordinates = [
    [Math.floor(cols/2) + 3, Math.floor(rows/2)],
    [Math.floor(cols/2) + 2, Math.floor(rows/2)],
    [Math.floor(cols/2) + 1, Math.floor(rows/2)],
    [Math.floor(cols/2) + 0, Math.floor(rows/2)]
  ];
  snake.direction = directions.right;
  snake.new_direction = directions.right;
  snake.grow = false;
}

function handle_keypress(e) {
  switch (e.keyCode) {
    case 37: //left
      snake.new_direction = directions.left;
      break;
    case 38: //up
      snake.new_direction = directions.up;
      break;
    case 39: //right
      snake.new_direction = directions.right;
      break;
    case 40: //down
      snake.new_direction = directions.down;
      break;
  }
}

async function game_loop() {
  while (true) {
    move_snake();
    eat_food();
    detect_self_collision();
    draw_snake();
    draw_food();
    await new Promise(r => setTimeout(r, 100));
  }
}

game_loop();
