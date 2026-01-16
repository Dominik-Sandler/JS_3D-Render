CANVAS_WIDTH = "800"
CANVAS_HEIGHT = "800"
BG_COLOR = "background-color:000000" 
RENDER_COLOR = "green"
LINE_THICKNESS = 10
DISTANCE = 10
DEG2RAD = Math.PI/180


var ctx = canvas.getContext("2d");

function vec2(x,y) {
    return{x,y}
}
function vec3(x,y,z) {
    return{x,y,z}
}
function projection(x,y,z){
    var factor = DISTANCE/(DISTANCE + z)
    return {
        x: x/z * factor,
        y: y/z * factor
    }
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
function centralize({x,y}){
    var centerx = CANVAS_WIDTH/2 - LINE_THICKNESS/2
    var centery = CANVAS_HEIGHT/2 - LINE_THICKNESS/2

    return {
        x: x + centerx,
        y: centery - y ,
    };
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
function createCubeV(){
    var pos0 = vec3(-100,-100,1)
    var pos1 = vec3(100,-100,1)
    var pos2 = vec3(100,100,1)
    var pos3 = vec3(-100,100,1)

    var pos4 = vec3(-100,-100,2)
    var pos5 = vec3(100,-100,2)
    var pos6 = vec3(100,100,2)
    var pos7 = vec3(-100,100,2)

    return [pos0,pos1,pos2,pos3,pos4,pos5,pos6,pos7]
}


initialze(CANVAS_WIDTH,CANVAS_HEIGHT,BG_COLOR) 

draw(render(rotateY(createCubeV(),10)))