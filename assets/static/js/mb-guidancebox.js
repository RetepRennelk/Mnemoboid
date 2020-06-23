class GuidanceBox {
    constructor(wh, breadCrumb) {
        this.wh = wh
        this.breadCrumb = breadCrumb
        this.group = new THREE.Group()
        this.init()
    }
    init() {
        const lid_card = new Card(0)
        lid_card.add_content_part('h1', {type:'string', content:this.breadCrumb.name})
        const side_card = new Card(0)  
        for (let i=0; i<this.breadCrumb.context.length; i++) {      
            const value = this.breadCrumb.context[i]
            side_card.add_content_part('li', {type:'string', content:value})
        }
        var tile_ceiling = new GuidanceTile(this.wh, lid_card)
        var tile_floor   = new GuidanceTile(this.wh, lid_card)
        var tile_left    = new GuidanceTile(this.wh, side_card)
        var tile_bow     = new GuidanceTile(this.wh, side_card)
        var tile_right   = new GuidanceTile(this.wh, side_card)
        var tile_rear    = new GuidanceTile(this.wh, side_card)

        tile_ceiling.rotate(-Math.PI/2,0,0)
        tile_ceiling.translate(0,this.wh/2,0)
        tile_floor.rotate(Math.PI/2,0,0)
        tile_floor.translate(0,-this.wh/2,0)
        tile_left.translate(-this.wh/2,null,null)
        tile_left.rotate(0,-Math.PI/2,0)
        tile_bow.rotate(0,Math.PI,0)
        tile_bow.translate(null,null,-this.wh/2)
        tile_right.translate(this.wh/2,null,null)
        tile_right.rotate(0,Math.PI/2,0)
        tile_rear.translate(0,0,this.wh/2)

        this.group.add(tile_ceiling.group)
        this.group.add(tile_floor.group)
        this.group.add(tile_left.group)
        this.group.add(tile_bow.group)
        this.group.add(tile_right.group)
        this.group.add(tile_rear.group)
    }
}

class GuidanceTile {
    constructor(wh, card) {
        this.wh = wh
        this.group = new THREE.Group()
        let html_string = (card != null) ? fittext.add_font_size_to_html(wh, card) : '<p> X </p>'
        this.group.add(this.createCSS3DObject(html_string))
    }
    createCSS3DObject(s) {
        this.div = document.createElement('div')
        this.div.className = 'guidance-tile'
        this.div.innerHTML = s
        this.div.style.width = this.wh + 'px'
        this.div.style.height = this.wh + 'px'
        var object = new THREE.CSS3DObject(this.div)
        return object
    }
    translate(x, y, z) {
        if (x)
            this.group.position.x = x
        if (y)
            this.group.position.y = y
        if (z)
            this.group.position.z = z
    }
    rotate(x, y, z) {
        this.group.rotation.x = x
        this.group.rotation.y = y
        this.group.rotation.z = z
    }
}
