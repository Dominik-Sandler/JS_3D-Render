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


var ctx = canvas.getContext("2d");

function vec3(x,y,z) {
    return{x,y,z}
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
function translateZ(poslist,dz){
    for(var i = 0; i < poslist.length; i++){
        poslist[i].z += dz
    }
    return poslist

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
function draw(poslist){
    for(var i = 0; i < poslist.length; i++){
        ctx.fillStyle = RENDER_COLOR;
        ctx.fillRect(poslist[i].x,poslist[i].y,LINE_THICKNESS,LINE_THICKNESS)
    }
}
function draw1(poslist, edgelist) {
    ctx.strokeStyle = RENDER_COLOR;
    ctx.lineWidth = LINE_THICKNESS / 5;
    ctx.beginPath();

    for (let i = 0; i < edgelist.length; i++) {
        let edge = edgelist[i];
        
        let startPoint = poslist[edge.a];
        let endPoint = poslist[edge.b];

        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
    }

    ctx.stroke();
}
function frame(){
    //DZ += 0.01
    ANGLE += 10*Math.PI * DELTATIME
    clear()
    var cube = createCubeV()
    var cubeE = createCubeE()
    cube = rotateY(cube,ANGLE)
    //cube = rotateX(cube,ANGLE)
    //cube = rotateZ(cube,ANGLE)
    cube = translateZ(cube,DZ)
    draw1(render(cube),cubeE)
    requestAnimationFrame(frame);
}

initialze(CANVAS_WIDTH,CANVAS_HEIGHT,BG_COLOR) 
frame()