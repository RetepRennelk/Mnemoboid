class MindBox24 {
    constructor(wh, cards) {
        this.wh = wh
        this.cards = cards
        this.clickBoxes = Array(24).fill(null)
        this.tiles = []
        this.group = new THREE.Group()
        this.map = [
            0,1,2,3,
            4,5,6,7,
            8,9,10,11,
            12,13,14,15,
            16,17,18,19,
            22,23,20,21
        ]
        this.init()
    }

    make_wall(which) {
        let tiles = new Array(4)
        let offsets = {'left':0,'bow':4,'right':8,'rear':12,'floor':16,'ceiling':20}
        for (let i=0; i<4; i++) {
            const offset = offsets[which]
            const j = this.map[i+offset]
            tiles[i] = this.tiles[j]
        }
        tiles[0].translateXY(-this.wh/4, +this.wh/4)
        tiles[1].translateXY(+this.wh/4, +this.wh/4)
        tiles[2].translateXY(-this.wh/4, -this.wh/4)
        tiles[3].translateXY(+this.wh/4, -this.wh/4)
        var tile = new THREE.Group()
        tile.add(tiles[0].group)
        tile.add(tiles[1].group)
        tile.add(tiles[2].group)
        tile.add(tiles[3].group)
        return tile
    }

    init() {
        this.tiles = []

        for (let i=0; i<24; i++) {
            this.tiles.push(new MindTile(this.wh/2, this.cards[i]))
        }
        for (let i=0; i<24; i++) {
            const j = this.map.indexOf(i)
            if (j < 4)
                this.tiles[i].addClass('tile_left')
            else if (j < 8)
                this.tiles[i].addClass('tile_bow')
            else if (j < 12)
                this.tiles[i].addClass('tile_right')
            else if (j < 16)
                this.tiles[i].addClass('tile_rear')
            else if (j < 20)
                this.tiles[i].addClass('tile_floor')
            else if (j < 24)
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
