// 스크립트 파일의 경로: sketch.js

let cols, rows;
let cellSize = 50;
let grid = [];
let current;
let stack = [];
let player;
let angle = 0;

function setup() {
  createCanvas(800, 800, WEBGL);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);

  // 미로 생성
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push(new Cell(x, y));
    }
  }

  current = grid[0];
  current.visited = true;

  player = createVector(cellSize / 2, cellSize / 2);
}

function draw() {
  background(0);

  // 카메라 설정 (1인칭 시점)
  let camX = player.x - width / 2;
  let camZ = player.y - height / 2;
  camera(camX, -200, camZ + 400, camX, 0, camZ, 0, 1, 0);

  // 미로 생성 및 그리기
  for (let cell of grid) {
    cell.show();
  }

  // DFS를 사용해 미로 완성
  let next = current.checkNeighbors();
  if (next) {
    next.visited = true;

    // 스택 저장
    stack.push(current);

    // 벽 제거
    removeWalls(current, next);

    // 다음 셀로 이동
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }

  // 플레이어 그리기
  push();
  translate(player.x, 10, player.y);
  fill(255, 0, 0);
  sphere(10);
  pop();

  // 이동 제어
  handlePlayerMovement();
}

function handlePlayerMovement() {
  let speed = 2;

  if (keyIsDown(LEFT_ARROW)) {
    angle -= 0.05;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    angle += 0.05;
  }
  if (keyIsDown(UP_ARROW)) {
    player.x += cos(angle) * speed;
    player.y += sin(angle) * speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.x -= cos(angle) * speed;
    player.y -= sin(angle) * speed;
  }
}

function index(x, y) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) return -1;
  return x + y * cols;
}

function removeWalls(a, b) {
  let x = a.x - b.x;
  if (x === 1) {
    a.walls.left = false;
    b.walls.right = false;
  } else if (x === -1) {
    a.walls.right = false;
    b.walls.left = false;
  }

  let y = a.y - b.y;
  if (y === 1) {
    a.walls.top = false;
    b.walls.bottom = false;
  } else if (y === -1) {
    a.walls.bottom = false;
    b.walls.top = false;
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
  }

  show() {
    let x = this.x * cellSize;
    let y = this.y * cellSize;

    push();
    translate(x - width / 2, 0, y - height / 2);

    stroke(255);
    if (this.walls.top) {
      line(0, 0, 0, cellSize, 0, 0);
    }
    if (this.walls.right) {
      line(cellSize, 0, 0, cellSize, 0, cellSize);
    }
    if (this.walls.bottom) {
      line(0, 0, cellSize, cellSize, 0, cellSize);
    }
    if (this.walls.left) {
      line(0, 0, 0, 0, 0, cellSize);
    }

    pop();
  }

  checkNeighbors() {
    let neighbors = [];

    let top = grid[index(this.x, this.y - 1)];
    let right = grid[index(this.x + 1, this.y)];
    let bottom = grid[index(this.x, this.y + 1)];
    let left = grid[index(this.x - 1, this.y)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      return random(neighbors);
    } else {
      return undefined;
    }
  }
}
