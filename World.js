class World{
    constructor(length, width){
        this.length = length
        this.width = width
    }

    createWorld(){
        var meshlist = []
        var x = 0
        for(let i = 0; this.length > i;i++){
            for(let j = 0;this.width > j; j++){
                const cube = new Mesh(createCubeV(),createCubeF(),MATERIAL);
                cube.position.x = i;
                cube.position.z = j;
                meshlist[x] = cube;
                x++
            }
        }
        return meshlist;
    }
}