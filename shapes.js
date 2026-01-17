function createCubeV(){
    return [
        vec3(-0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),
        vec3(0.5, -0.5, 0.5),vec3(-0.5, -0.5, 0.5),
        vec3(-0.5, 0.5, -0.5),vec3(0.5, 0.5, -0.5),
        vec3(0.5, -0.5, -0.5),vec3(-0.5, -0.5, -0.5)
    ];
}

function createCubeE(){
    return [
        {a:0, b:1}, {a:1, b:2}, {a:2, b:3}, {a:3, b:0},
        {a:4, b:5}, {a:5, b:6}, {a:6, b:7}, {a:7, b:4},
        {a:0, b:4}, {a:1, b:5}, {a:2, b:6}, {a:3, b:7} 
    ];
}
function createDonutV(majorRadius = 0.6, minorRadius = 0.2) {
    let vertices = [];
    let ringSegments = 32; // Precision around the main ring
    let tubeSegments = 16;  // Precision of the tube itself

    for (let i = 0; i < ringSegments; i++) {
        let theta = (i / ringSegments) * Math.PI * 2;
        let cosTheta = Math.cos(theta);
        let sinTheta = Math.sin(theta);

        for (let j = 0; j < tubeSegments; j++) {
            let phi = (j / tubeSegments) * Math.PI * 2;
            let cosPhi = Math.cos(phi);
            let sinPhi = Math.sin(phi);

            // Parametric equations for a Torus
            let x = (majorRadius + minorRadius * cosPhi) * cosTheta;
            let y = (majorRadius + minorRadius * cosPhi) * sinTheta;
            let z = minorRadius * sinPhi;

            vertices.push(vec3(x, y, z));
        }
    }
    return vertices;
}

function createDonutE(ringSegments = 32, tubeSegments = 16) {
    let edges = [];
    for (let i = 0; i < ringSegments; i++) {
        for (let j = 0; j < tubeSegments; j++) {
            let current = i * tubeSegments + j;
            let nextTube = i * tubeSegments + (j + 1) % tubeSegments;
            let nextRing = ((i + 1) % ringSegments) * tubeSegments + j;

            // Connect around the tube
            edges.push({ a: current, b: nextTube });
            // Connect to the next ring segment
            edges.push({ a: current, b: nextRing });
        }
    }
    return edges;
}