CANVAS_WIDTH = "800"
CANVAS_HEIGHT = "800"
BG_COLOR = "background-color:000000" 
RENDER_COLOR = "green"
LINE_THICKNESS = 10


var ctx = canvas.getContext("2d");

function vec2(x,y) {
    return{x,y}
}
function vec3(x,y,z) {
    return{x,y,z}
}
function projection(x,y,z){
    return {
        x: x/z,
        y: y/z
    }
}
function initialze(width,height,color){
    canvas.width=width
    canvas.height=height
    canvas.style=color 
}
function centralize({x,y}){
    var centerx = CANVAS_WIDTH/2 - LINE_THICKNESS/2
    var centery = CANVAS_HEIGHT/2 - LINE_THICKNESS/2

    return {
        x: x + centerx,
        y: y + centery
    };
}
function render(poslist){
    for(var i = 0; i < poslist.length; i++){
        var pos = poslist[i]
        var cpos = centralize(pos)
        ctx.fillStyle = RENDER_COLOR;
        ctx.fillRect(cpos.x,cpos.y,LINE_THICKNESS,LINE_THICKNESS)
    }
}
function createRectangle(){
    var pos0 = vec2(-100,-100)
    var pos1 = vec2(100,-100)
    var pos2 = vec2(100,100)
    var po4 = vec2(-100,100)

    return [pos0,pos1,pos2,po4]
}


initialze(CANVAS_WIDTH,CANVAS_HEIGHT,BG_COLOR) 

render(createRectangle())