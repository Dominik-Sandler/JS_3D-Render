CANVAS_WIDTH = "800"
CANVAS_HEIGHT = "800"
BG_COLOR = "background-color:000000" 
RENDER_COLOR = "green"
LINE_THICKNESS = 10


var ctx = canvas.getContext("2d");

function vec2(x,y) {
    return{x,y}
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
function render(pos){
    var cpos = centralize(pos)
    ctx.fillStyle = RENDER_COLOR;
    ctx.fillRect(cpos.x,cpos.y,LINE_THICKNESS,LINE_THICKNESS)
}



initialze(CANVAS_WIDTH,CANVAS_HEIGHT,BG_COLOR)
var pos = vec2(0,0)
render(pos)