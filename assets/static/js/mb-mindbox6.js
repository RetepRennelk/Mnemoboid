class MindBox6 {
    constructor(wh, cards) {
        this.wh = wh
        this.cards = cards
        this.clickBoxes = []
        this.tiles = []
        this.group = new THREE.Group()
        this.init()
    }
    init() {
        var tile_left    = new MindTile(this.wh, this.cards[0])
        var tile_bow     = new MindTile(this.wh, this.cards[1])
        var tile_right   = new MindTile(this.wh, this.cards[2])
        var tile_rear    = new MindTile(this.wh, this.cards[3])
        var tile_floor   = new MindTile(this.wh, this.cards[4], 'middle')
        var tile_ceiling = new MindTile(this.wh, this.cards[5], 'middle')

        tile_left.addClass('tile_left')
        tile_bow.addClass('tile_bow')
        tile_right.addClass('tile_right')
        tile_rear.addClass('tile_rear')
        tile_floor.addClass('tile_floor')
        tile_ceiling.addClass('tile_ceiling')
        
        this.tiles = [tile_left, tile_bow, tile_right, tile_rear, tile_floor, tile_ceiling]
        this.clickBoxes = Array(6).fill(null)

        tile_left.translateBack();
        tile_bow.translateBack();
        tile_right.translateBack();
        tile_rear.translateBack();
        tile_floor.translateBack();
        tile_ceiling.translateBack();
        
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

        pivot_left.add(tile_left.group);
        this.group.add(pivot_left);
        pivot_bow.add(tile_bow.group);
        this.group.add(pivot_bow);
        pivot_right.add(tile_right.group);
        this.group.add(pivot_right);
        pivot_rear.add(tile_rear.group);
        this.group.add(pivot_rear);
        pivot_floor.add(tile_floor.group);
        this.group.add(pivot_floor);
        pivot_ceiling.add(tile_ceiling.group);
        this.group.add(pivot_ceiling);
    }
    addClickBox(i) {
        this.tiles[i].addClickBox()
        this.clickBoxes[i] = this.tiles[i].get_click_box()
    }
    addToScene(scene) {
        scene.add(this.group);
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
        return i
    }
}
