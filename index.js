CANVAS_WIDTH = "800"
CANVAS_HEIGHT = "800"
BG_COLOR = "background-color:000000" 
RENDER_COLOR = "green"
LINE_THICKNESS = 10
FOCAL_LENGTH = 1.5
DEG2RAD = Math.PI/180
DZ = 2
FPS = 60
DELTATIME = 1/60
ANGLE = 0
CULLING = true 

RIGHTPRESSED = false;
LEFTPRESSED = false;
UPPRESSED = false;
DOWNPRESSED = false;
FRONTPRESSED = false;
BACKPRESSED = false;

MOUSEDOWN = false;
MOUSEX = 0;
MOUSEY = 0;
MOUSE_SENSITIVITY = 0.15;


var ctx = canvas.getContext("2d");
function initialze(width,height,color){
    canvas.width=width
    canvas.height=height
    canvas.style=color 
}
function clear(){
    ctx.fillStyle = BG_COLOR
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
}
function vec3(x,y,z) {
    return{x,y,z}
}
function sub(a, b) {
  return vec3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function cross(a, b) {
  return vec3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
function quadToTris([a,b,c,d]) {
  return [
    [a,b,c],
    [a,c,d]
  ];
}
function faceNormal(face, verts) {
  const v0 = verts[face[0]];
  const v1 = verts[face[1]];
  const v2 = verts[face[2]];

  const e1 = sub(v1, v0);
  const e2 = sub(v2, v0);

  return cross(e1, e2);
}
function isFaceVisible(face, verts) {
  const normal = faceNormal(face, verts);
  const v0 = verts[face[0]];
  return dot(normal, v0) < 0;
}
function getFaceDepth(face, verts) {
  let z = 0;
  for (let idx of face) {
    z += verts[idx].z;
  }
  return z / face.length;
}
function isTriangleInFront(tri, verts) {
  return (
    verts[tri[0]].z > 0 &&
    verts[tri[1]].z > 0 &&
    verts[tri[2]].z > 0
  );
}
function projectVerts(verts) {
  return verts.map(p => {
    const z = Math.max(p.z, 0.0001);
    const x = (p.x * FOCAL_LENGTH) / z;
    const y = (p.y * FOCAL_LENGTH) / z;

    return {
      x: (x + 1)/2 * CANVAS_WIDTH,
      y: (1 - y)/2 * CANVAS_HEIGHT
    };
  });
}
function meshToWorld(mesh) {
  let v = mesh.vertices;

  v = rotateX(v, mesh.rotation.x);
  v = rotateY(v, mesh.rotation.y);
  v = rotateZ(v, mesh.rotation.z);

  v = translate(
    v,
    mesh.position.x,
    mesh.position.y,
    mesh.position.z
  );

  return v;
}
function worldToView(verts, camera) {
  let v = translate(verts,
    -camera.position.x,
    -camera.position.y,
    -camera.position.z
  );

  v = rotateY(v, -camera.rotation.y);
  v = rotateX(v, -camera.rotation.x);
  v = rotateZ(v, -camera.rotation.z);

  return v;
}
function translate(poslist, dx, dy, dz){
  return poslist.map(p => ({
    x: p.x + dx,
    y: p.y + dy,
    z: p.z + dz
  }));
}
function rotateY(poslist,angle){
    rad = angle * DEG2RAD
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    newlist = []

    for(var i = 0; i < poslist.length; i++){
        var p = poslist[i];
        x = p.x * cos - p.z * sin;
        z = p.z * cos + p.x * sin;
        newlist[i] = {x: x,y: p.y,z:z}
    }
    return newlist
}
function rotateX(poslist,angle){
    rad = angle * DEG2RAD
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    newlist = []

    for(var i = 0; i < poslist.length; i++){
        var p = poslist[i];
        y = p.y * cos - p.z * sin;
        z = p.z * cos + p.y * sin;
        newlist[i] = {x: p.x,y: y,z: z}
    }
    return newlist
}
function rotateZ(poslist, angle) {
    var rad = angle * DEG2RAD;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var newlist = [];

    for (var i = 0; i < poslist.length; i++) {
        var p = poslist[i];
        var x = p.x * cos - p.y * sin;
        var y = p.x * sin + p.y * cos;
        newlist[i] = { x: x, y: y, z: p.z };
    }
    return newlist;
}
function calculateLight(color,light){
    let r = (Math.floor(parseInt(color.slice(1,3),16) * light)).toString(16)
    let g = (Math.floor(parseInt(color.slice(3,5),16) * light)).toString(16)
    let b = (Math.floor(parseInt(color.slice(5,7),16) * light)).toString(16)
    if(b == "0"){
      b = "00"
    }if(g == "0"){
      g= "00"
    }if(r == "0"){
      r = "00"
    }
    return "#"+r+g+b
}
function collectMeshTriangles(mesh, camera,renderQueue) {

  const worldVerts = meshToWorld(mesh);
  const viewVerts = worldToView(worldVerts, camera);
  const projected = projectVerts(viewVerts);
  
  for (let tri of mesh.triangles) {

    if (!isTriangleInFront(tri, viewVerts)) continue;
    if (CULLING && !isFaceVisible(tri, viewVerts)) continue;

    renderQueue.push({
      projected,
      tri,
      material: mesh.material,
      depth: getFaceDepth(tri, viewVerts)
    });
  }
}

function drawTriangle(projected, tri, material) {
  ctx.beginPath();
  const p0 = projected[tri[0]];
  ctx.moveTo(p0.x, p0.y);

  for (let i=1;i<3;i++){
    const p = projected[tri[i]];
    ctx.lineTo(p.x, p.y);
  }

  ctx.closePath();
  ctx.fillStyle = calculateLight(material.color,AMBIENTLIGHT.ambientLightStrength);
  ctx.fill();
  ctx.stroke();
}
function keyDownHandler(event) {
  if (event.code === "KeyD") {
    RIGHTPRESSED = true;
  } else if (event.code === "KeyA") {
    LEFTPRESSED = true;
  } else if (event.code === "ShiftLeft") {
    DOWNPRESSED = true;
  } else if (event.code === "Space") {
    UPPRESSED = true;
  } else if (event.code === "KeyW") {
    FRONTPRESSED = true;
  } else if (event.code === "KeyS") {
    BACKPRESSED = true;
  }
}

function keyUpHandler(event) {
  if (event.code === "KeyD") {
    RIGHTPRESSED = false;
  } else if (event.code === "KeyA") {
    LEFTPRESSED = false;
  } else if (event.code === "ShiftLeft") {
    DOWNPRESSED = false;
  } else if (event.code === "Space") {
    UPPRESSED = false;
  } else if (event.code === "KeyW") {
    FRONTPRESSED = false;
  } else if (event.code === "KeyS") {
    BACKPRESSED = false;
  }
}

function MouseDownHandler(e){
  MOUSEDOWN = true;
  MOUSEX = e.clientX;
  MOUSEY = e.clientY;
}

function MouseUpHandler(e){
  MOUSEDOWN = false;
}

function MouseMoveHandler(e){
  if (!MOUSEDOWN) return;

  const dx = -e.clientX + MOUSEX;
  const dy = -e.clientY + MOUSEY;

  MOUSEX = e.clientX;
  MOUSEY = e.clientY;

  CAMERA.rotation.y += dx * MOUSE_SENSITIVITY;
  CAMERA.rotation.x -= dy * MOUSE_SENSITIVITY;

  if (CAMERA.rotation.x > 90) CAMERA.rotation.x = 90;
  if (CAMERA.rotation.x < -90) CAMERA.rotation.x = -90;
}
function checkEvent() {
  const speed = 0.025;

  const yawRad = CAMERA.rotation.y * DEG2RAD;

  const forward = {
    x: -Math.sin(yawRad),
    z: Math.cos(yawRad)
  };

  const right = {
    x: Math.cos(yawRad),
    z: Math.sin(yawRad)
  };

  if (FRONTPRESSED) {
    CAMERA.position.x += forward.x * speed;
    CAMERA.position.z += forward.z * speed;
  }
  if (BACKPRESSED) {
    CAMERA.position.x -= forward.x * speed;
    CAMERA.position.z -= forward.z * speed;
  }
  if (RIGHTPRESSED) {
    CAMERA.position.x += right.x * speed;
    CAMERA.position.z += right.z * speed;
  }
  if (LEFTPRESSED) {
    CAMERA.position.x -= right.x * speed;
    CAMERA.position.z -= right.z * speed;
  }
  if (UPPRESSED) CAMERA.position.y += speed;
  if (DOWNPRESSED) CAMERA.position.y -= speed;
}
function frame() {
  clear();
  //cube.rotation.y += 0.5;
  //cube.rotation.x += 0.5;

  const renderQueue = [];

  for (let mesh of WORLD) {
    collectMeshTriangles(mesh, CAMERA, renderQueue);
  }

  collectMeshTriangles(cube, CAMERA, renderQueue);
  collectMeshTriangles(cube1, CAMERA, renderQueue);

  renderQueue.sort((a, b) => b.depth - a.depth);

  for (let r of renderQueue) {
    drawTriangle(r.projected, r.tri, r.material);
  }
  checkEvent();
  requestAnimationFrame(frame);
}
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
canvas.addEventListener("mousedown", MouseDownHandler);
document.addEventListener("mouseup", MouseUpHandler);
document.addEventListener("mousemove", MouseMoveHandler);
const CAMERA = new Camera();
const MATERIAL = new Material("#00FF00");
const MATERIAL1 = new Material("#0000FF");
const AMBIENTLIGHT = new AmbientLight(1);
CAMERA.position.z = -3;
const cube = new Mesh(createCubeV(),createCubeF(),MATERIAL);
const cube1 = new Mesh(createCubeV(),createCubeF(),MATERIAL1);
cube1.position.x = 1;
var WORLD = new World(10,5).createWorld();

initialze(CANVAS_WIDTH,CANVAS_HEIGHT,BG_COLOR) 
frame()