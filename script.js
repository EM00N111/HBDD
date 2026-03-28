const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

let branches = [];
let leaves = [];
let offsetX = 0;
let started = false;
let finished = false;

/* resize */
window.addEventListener("resize", () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

/* start */
document.getElementById("startBtn").addEventListener("click", () => {
  if (started) return;
  started = true;

  document.getElementById("screen1").style.display = "none";
  initTree();
});

/* branch */
class Branch {
  constructor(x, y, len, angle, depth) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.angle = angle;
    this.depth = depth;
    this.progress = 0;
    this.done = false;
  }
}

/* init */
function initTree() {
  branches = [new Branch(W / 2, H, 120, -90, 9)];
  leaves = [];
  offsetX = 0;
  finished = false;
  animate();
}

/* draw */
function drawBranch(b) {
  const len = b.len * b.progress;

  const x2 = b.x + len * Math.cos(b.angle * Math.PI / 180);
  const y2 = b.y + len * Math.sin(b.angle * Math.PI / 180);

  ctx.beginPath();
  ctx.moveTo(b.x + offsetX, b.y);
  ctx.lineTo(x2 + offsetX, y2);
  ctx.strokeStyle = "#4d2600";
  ctx.lineWidth = b.depth;
  ctx.stroke();

  if (b.progress < 1) {
    b.progress += 0.035;
    return;
  }

  if (!b.done && b.depth > 0) {
    b.done = true;

    branches.push(new Branch(x2, y2, b.len * 0.7, b.angle - 18, b.depth - 1));
    branches.push(new Branch(x2, y2, b.len * 0.7, b.angle + 18, b.depth - 1));
  }

  if (b.depth === 0) {
    leaves.push({ x: x2, y: y2 });
  }
}

/* 💖 ONLY HEART LEAVES (NO TEXT) */
function drawLeaves() {
  ctx.font = "14px sans-serif";

  leaves.forEach(l => {
    ctx.fillText("💖", l.x + offsetX, l.y);
  });
}

/* animate */
function animate() {
  ctx.clearRect(0, 0, W, H);

  branches.forEach(drawBranch);
  drawLeaves();

  if (branches.length < 220) {
    requestAnimationFrame(animate);
  } else if (!finished) {
    finished = true;
    moveTree();
  }
}

/* FIX: LIMIT TREE MOVEMENT */
function moveTree() {
  let maxMove = W * 0.25; // max 25% screen
  let moved = 0;

  function move() {
    ctx.clearRect(0, 0, W, H);

    offsetX += 3;   // slower move
    moved += 3;

    branches.forEach(drawBranch);
    drawLeaves();

    if (moved < maxMove) {
      requestAnimationFrame(move);
    } else {
      document.getElementById("wishText").style.opacity = "1";
    }
  }

  move();
}