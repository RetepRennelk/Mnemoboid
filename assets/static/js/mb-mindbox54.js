class MindBox54 {
    constructor(wh, cards) {
        this.wh = wh
        this.cards = cards
        this.clickBoxes = Array(54).fill(null)
        this.tiles = []
        this.group = new THREE.Group()
        this.map = [
            0,  1,  2,  3,  4,  5,  6,  7,  8,
            10, 11, 12, 13, 14, 15, 16, 17, 18,
            20, 21, 22, 23, 24, 25, 26, 27, 28,
            30, 31, 32, 33, 34, 35, 36, 37, 38,
            40, 41, 42, 43, 44, 45, 46, 47, 48,
            52, 39, 53,  9, 49, 29, 50, 19, 51]
        this.init()
        }

    make_wall(which) {
        let tiles = new Array(9)
        let offsets = {'left':0,'bow':9,'right':18,'rear':27,'floor':36,'ceiling':45}
        for (let i=0; i<9; i++) {
            const offset = offsets[which]
            const j = this.map[i+offset]
            tiles[i] = this.tiles[j]
        }
        tiles[0].translateXY(-this.wh/3, +this.wh/3)
        tiles[1].translateXY(0,          +this.wh/3)
        tiles[2].translateXY(+this.wh/3, +this.wh/3)
        tiles[3].translateXY(-this.wh/3, 0)
        tiles[4].translateXY(0,          0)
        tiles[5].translateXY(+this.wh/3, 0)
        tiles[6].translateXY(-this.wh/3, -this.wh/3)
        tiles[7].translateXY(0,          -this.wh/3)
        tiles[8].translateXY(+this.wh/3, -this.wh/3)
        if (which == 'ceiling') {
            // Align ceiling tiles (left, right and rear) with
            // their respective wall tiles 
            tiles[1].rotate(Math.PI)
            tiles[3].rotate(-Math.PI/2)
            tiles[5].rotate(Math.PI/2)
        }
        var tile = new THREE.Group()
        for (let i=0; i<tiles.length; i++)
            tile.add(tiles[i].group)
        return tile
    }

    init() {
        this.tiles = []

        for (let i=0; i<54; i++) {
            this.tiles.push(new MindTile(this.wh/3, this.cards[i]))
        }
        for (let i=0; i<54; i++) {
            const j = this.map.indexOf(i)
            if (j < 9)
                this.tiles[i].addClass('tile_left')
            else if (j < 18)
                this.tiles[i].addClass('tile_bow')
            else if (j < 27)
                this.tiles[i].addClass('tile_right')
            else if (j < 36)
                this.tiles[i].addClass('tile_rear')
            else if (j < 45)
                this.tiles[i].addClass('tile_floor')
            else if (j < 54)
                this.tiles[i].addClass('tile_ceiling')
        }

        var tile_left = this.make_wall('left')
        var tile_bow = this.make_wall('bow')
        var tile_right = this.make_wall('right')
        var tile_rear = this.make_wall('rear')
        var tile_floor = this.make_wall('floor')
        var tile_ceiling = this.make_wall('ceiling')

        tile_left.position.z = -this.wh/2
        tile_bow.position.z = -this.wh/2
        tile_right.position.z = -this.wh/2
        tile_rear.position.z = -this.wh/2
        tile_floor.position.z = -this.wh/2
        tile_ceiling.position.z = -this.wh/2
        
        var pivot_left = new THREE.Group();
        var pivot_bow = new THREE.Group();
        var pivot_right = new THREE.Group();
        var pivot_rear = new THREE.Group();
        var pivot_floor = new THREE.Group();
        var pivot_ceiling = new THREE.Group();

        pivot_left.rotation.y = Math.PI/2;
        pivot_right.rotation.y = -Math.PI/2;
        pivot_rear.rotation.y = Math.PI;
        pivot_floor.rotation.x = -Math.PI/2;
        pivot_ceiling.rotation.x = Math.PI/2;

        pivot_left.add(tile_left)
        this.group.add(pivot_left)
        pivot_bow.add(tile_bow)
        this.group.add(pivot_bow)
        pivot_right.add(tile_right)
        this.group.add(pivot_right)
        pivot_rear.add(tile_rear)
        this.group.add(pivot_rear)
        pivot_floor.add(tile_floor)
        this.group.add(pivot_floor)
        pivot_ceiling.add(tile_ceiling)
        this.group.add(pivot_ceiling)
    }

    addToScene(scene) {
        scene.add(this.group)
    }

    getClickBoxes() {
        return this.clickBoxes
    }

    update(delta) {
        for (let i=0; i<this.clickBoxes.length; i++) {
            let clickBox = this.clickBoxes[i]
            if (clickBox)
                clickBox.update(delta)
        }
    }
    map_index(i) {
        return this.map.indexOf(i)
    }
    addClickBox(i) {
        this.tiles[i].addClickBox()
        this.clickBoxes[i] = this.tiles[i].get_click_box()
    }
}
