function createCubeV(){
    return [
        vec3(0.5, 0.5, 0.5),vec3(-0.5, 0.5, 0.5), // top-right, top-left, bottom-left, bottom-right
        vec3(-0.5, -0.5, 0.5),vec3(0.5, -0.5, 0.5),
        vec3(0.5, 0.5, -0.5),vec3(-0.5, 0.5, -0.5),
        vec3(-0.5, -0.5, -0.5),vec3(0.5, -0.5, -0.5)
    ];
}
function createCubeF(){
    return[
        [0,1,2,3],
        [4,7,6,5],
        [1,5,6,2],
        [0,3,7,4],
        [0,4,5,1],
        [3,2,6,7]
    ]
}

// function createDonutV(majorRadius = 0.6, minorRadius = 0.2) {
//     let vertices = [];
//     let ringSegments = 32; // Precision around the main ring
//     let tubeSegments = 16;  // Precision of the tube itself

//     for (let i = 0; i < ringSegments; i++) {
//         let theta = (i / ringSegments) * Math.PI * 2;
//         let cosTheta = Math.cos(theta);
//         let sinTheta = Math.sin(theta);

//         for (let j = 0; j < tubeSegments; j++) {
//             let phi = (j / tubeSegments) * Math.PI * 2;
//             let cosPhi = Math.cos(phi);
//             let sinPhi = Math.sin(phi);

//             // Parametric equations for a Torus
//             let x = (majorRadius + minorRadius * cosPhi) * cosTheta;
//             let y = (majorRadius + minorRadius * cosPhi) * sinTheta;
//             let z = minorRadius * sinPhi;

//             vertices.push(vec3(x, y, z));
//         }
//     }
//     return vertices;
// }

// function createDonutE(ringSegments = 32, tubeSegments = 16) {
//     let edges = [];
//     for (let i = 0; i < ringSegments; i++) {
//         for (let j = 0; j < tubeSegments; j++) {
//             let current = i * tubeSegments + j;
//             let nextTube = i * tubeSegments + (j + 1) % tubeSegments;
//             let nextRing = ((i + 1) % ringSegments) * tubeSegments + j;

//             // Connect around the tube
//             edges.push({ a: current, b: nextTube });
//             // Connect to the next ring segment
//             edges.push({ a: current, b: nextRing });
//         }
//     }
//     return edges;
// }