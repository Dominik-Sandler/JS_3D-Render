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
CAMERA = new Camera()


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
function projection(x,y,z){
    return {
        x: (x * FOCAL_LENGTH)/z,
        y: (y * FOCAL_LENGTH)/z
    }
}
function centralize({x,y}){

    return {
        x: (x + 1)/2 * CANVAS_WIDTH - LINE_THICKNESS/2,
        y: (1 - y)/2 * CANVAS_HEIGHT - LINE_THICKNESS/2
    };
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
function initialze(width,height,color){
    canvas.width=width
    canvas.height=height
    canvas.style=color 
}
function clear(){
    ctx.fillStyle = BG_COLOR
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
}
function render(poslist){
    newlist = []
    for(var i = 0; i < poslist.length; i++){
        var pos = poslist[i]
        var ppos = projection(pos.x,pos.y,pos.z)
        var cpos = centralize(ppos)
        newlist[i] = cpos
    }
    return newlist
}
function drawFaces(projectedVerts, faces, worldVerts,colorlist) {
  ctx.strokeStyle = RENDER_COLOR;
  ctx.lineWidth = 2;
  let i = 0;
  const faceOrder = faces.map((face, index) => ({
    face,
    index,
    depth: getFaceDepth(face, worldVerts)
  }))
  .sort((a, b) => b.depth - a.depth);


  for (let f of faceOrder) {
    if (!isFaceVisible(f.face, worldVerts) && CULLING) continue;
    ctx.fillStyle = colorlist[f.index];
    ctx.beginPath();

    let p0 = projectedVerts[f.face[0]];
    ctx.moveTo(p0.x, p0.y);

    for (let i = 1; i < f.face.length; i++) {
      let p = projectedVerts[f.face[i]];
      ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fill()
    ctx.stroke();
  }
}
function frame(){
    //DZ += 0.01
    ANGLE += 10*Math.PI * DELTATIME
    clear()
    const cube = new Mesh(createCubeV(), createCubeF());
    var colorlist = ["#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF"]
    var dirt_images = createDirtImage();
    let verts = cube.vertices;
    verts = rotateX(verts,ANGLE -30);
    verts = rotateY(verts,ANGLE -30);
    verts = translate(verts, 0, 0, DZ);

    let projected = render(verts);
    drawFaces(projected, cube.faces,verts,colorlist);

    requestAnimationFrame(frame);
}

initialze(CANVAS_WIDTH,CANVAS_HEIGHT,BG_COLOR) 
frame()