class Mesh {
  constructor(vertices, faces,material) {
    this.vertices = vertices;
    this.triangles = [];
     for (let f of faces) {
      if (f.length === 3) this.triangles.push(f);
      if (f.length === 4) this.triangles.push(...quadToTris(f));
    }
    this.position = vec3(0,0,0);
    this.rotation = vec3(0,0,0);
    this.material = material;
  }
}
