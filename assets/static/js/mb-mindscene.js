class MindScene {
    constructor (wh, cards) {
        this.wh = wh
        this.cards = cards.cards
        this.scene = new THREE.Scene()
        this.scenes = []
        switch (this.cards.length) {
            case 6:
                this.box = new MindBox6(wh, this.cards); break
            case 24:
                this.box = new MindBox24(wh, this.cards); break
            case 54:
                this.box = new MindBox54(wh, this.cards); break
            default:
                throw "Number of cards is not supported."; break
        }
        this.scene.add(this.box.group)

        this.guidanceBox = new GuidanceBox(wh_guide, cards.breadCrumb)
        this.scene.add(this.guidanceBox.group)
    }
    getThreeScene() {
        return this.scene
    }
    addClickBox(i) {
        this.box.addClickBox(i)    
    }
    getClickBoxes() {
        return this.box.getClickBoxes()
    }
    update(delta) {
        this.box.update(delta)
    }
    getScene(index) {
        return this.scenes[index]
    }
    map_tile_index(index) {
        return this.box.map_index(index)
    }
}