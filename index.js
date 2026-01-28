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
const CAMERA = new Camera()
CAMERA.position.z = 0;
const MATERIAL = new Material("#0000FF");



var ctx = canvas.getContext("2d");

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
  const viewDir = sub(v0, CAMERA.position);

  return dot(normal, viewDir) < 0;
}
function getFaceDepth(face, verts) {
  let z = 0;
  for (let idx of face) {
    z += verts[idx].z;
  }
  return z / face.length;
}
function projectVerts(verts) {
  return verts.map(p => {
    const x = (p.x * FOCAL_LENGTH) / p.z;
    const y = (p.y * FOCAL_LENGTH) / p.z;

    return {
      x: (x + 1)/2 * CANVAS_WIDTH,
      y: (1 - y)/2 * CANVAS_HEIGHT
    };
  });
}
function translate(poslist, dx, dy, dz){
  return poslist.map(p => ({
    x: p.x + dx,
    y: p.y + dy,
    z: p.z + dz
  }));
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
function initialze(width,height,color){
    canvas.width=width
    canvas.height=height
    canvas.style=color 
}
function clear(){
    ctx.fillStyle = BG_COLOR
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
}
function renderMesh(mesh, camera) {

  const worldVerts = meshToWorld(mesh);
  const viewVerts = worldToView(worldVerts, camera);
  const projected = projectVerts(viewVerts);
  let faces = mesh.triangles.map(tri => ({
    tri,
    depth: getFaceDepth(tri, viewVerts)
  }));

  if (CULLING) {
    faces = faces.filter(f =>
      isFaceVisible(f.tri, viewVerts, camera)
    );
  }

  faces.sort((a,b)=>b.depth-a.depth);
  
  for (let f of faces) {
    drawTriangle(projected, f.tri, mesh.material);
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
  ctx.fillStyle = material.color;
  ctx.fill();
  ctx.stroke();
}
function frame() {
  clear();

  cube.rotation.y += 0.5;
  cube.rotation.x += 0.5;

  renderMesh(cube, CAMERA);
  requestAnimationFrame(frame);
}

const cube = new Mesh(createCubeV(),createCubeF(),MATERIAL);
cube.position.z = 3;
initialze(CANVAS_WIDTH,CANVAS_HEIGHT,BG_COLOR) 
frame()