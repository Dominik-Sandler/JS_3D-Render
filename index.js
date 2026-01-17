CANVAS_WIDTH = "800"
CANVAS_HEIGHT = "800"
BG_COLOR = "background-color:000000" 
RENDER_COLOR = "green"
LINE_THICKNESS = 10
FOCAL_LENGTH = 1.5
DEG2RAD = Math.PI/180
DZ = 2


var ctx = canvas.getContext("2d");

function vec2(x,y) {
    return{x,y}
}
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

    for(var i = 0; i < poslist.length; i++){
        
    }
    return poslist
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
function frame(){
    DZ += 0.01
    clear()
    var cube = createCubeV()
    cube = translateZ(cube,DZ)
    draw(render(cube))
    requestAnimationFrame(frame);
}
function createCubeV(){
    return [
        vec3(0.5, 0.5, 0.5), vec3(-0.5, 0.5, 0.5), 
        vec3(0.5, -0.5, 0.5),   vec3(-0.5, -0.5, 0.5),
        vec3(0.5, 0.5, -0.5), vec3(-0.5, 0.5, -0.5), 
        vec3(0.5, -0.5, -0.5),   vec3(-0.5, -0.5, -0.5)
    ];
}


initialze(CANVAS_WIDTH,CANVAS_HEIGHT,BG_COLOR) 

frame()