/* A Tile is the three.js equivalent of a card from the outline.
 * It contains div elements plus the little box for going down
 * the outline hierarchy.
 */

class MindTile {
    constructor(wh, card, loc="bottom") {
        this.wh = wh
        this.wh_box = wh/16
        this.loc = loc
        this.group = new THREE.Group()
        let html_string = (card != null) ? fittext.add_font_size_to_html(wh, card) : '<p> X </p>'
        this.div = null
        this.group.add(this.createCSS3DObject(html_string))
        this.clickBox = null
    }

    addClickBox() {
        this.clickBox = new ClickBox(this.wh_box)
        this.positionClickBox()
        this.clickBox.addToScene(this.group)
    }

    createCSS3DObject(s) {
        // Convert string to DOM element.
        this.div = document.createElement('div')
        this.div.className = 'tile'
        this.div.innerHTML = s
        this.div.style.width = this.wh + 'px'
        this.div.style.height = this.wh + 'px'
        var object = new THREE.CSS3DObject(this.div)
        return object
    }

    positionClickBox() {
        var x = this.wh/2-this.wh_box
        var y = (this.loc==='bottom') ? this.wh_box-this.wh/2 : 0
        var z = this.wh_box/2+1
        this.clickBox.translate(x, y, z)
    }

    translateBack() {
        this.group.position.z = -this.wh/2
    }

    translateXY(x, y) {
        this.group.position.x = x
        this.group.position.y = y
    }

    rotate(angle) {
        this.group.rotateZ(angle)
    }

    get_click_box() {
        return this.clickBox
    }

    addClass(class_name) {
        this.div.classList.add(class_name)
    }
}