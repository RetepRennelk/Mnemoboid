class CubeMaster {
    constructor(wh, main_scene) {
        this.wh = wh
        this.main_scene = main_scene
        this.raycaster = new THREE.Raycaster()
        this.current_scene = this.main_scene
        this.scene_history = [main_scene]
        this.scene_level = 0
    }

    get_current_three_scene() {
        return this.current_scene.getThreeScene()
    }

    raycast() {
        this.raycaster.setFromCamera(mouse, camera)
        var intersects = this.raycaster.intersectObjects(scene.children, true)
        var saveClickBox = null;
        var clickBoxes = this.current_scene.getClickBoxes()
        if (intersects.length > 0) {
            for (let i=0; i<clickBoxes.length; i++) {
                let clickBox = clickBoxes[i]
                if (clickBox == null)
                    continue
                if (this.scene_level==1)
                    console.log(i+':'+clickBox)
                if (clickBox.contains(intersects[0].object)) {
                    clickBox.start_clip()
                    saveClickBox = clickBox
                }
            }
        }
        for (let i=0; i<clickBoxes.length; i++) {
            let clickBox = clickBoxes[i]
            if (clickBox == null) 
                continue
            if (clickBox !== saveClickBox)
                clickBox.stop_clip()
        }
        return saveClickBox
    }

    update(delta) {
        this.current_scene.update(delta)
    }

    click(event) {
        var saveClickBox = this.raycast()
        if (saveClickBox) {
            var clickBoxes = this.current_scene.getClickBoxes()
            var index = clickBoxes.indexOf(saveClickBox)
            let new_scene = this.current_scene.getScene(index)
            set_scene_children_style_display(this.current_scene.getThreeScene(), 'None')
            set_scene_children_style_display(new_scene.getThreeScene(), 'flex')
            this.current_scene = new_scene
            this.scene_history.push(new_scene)
            this.scene_level += 1
        }
    }

    pop_scene_history() {
        if (this.scene_history.length == 1) 
            return
        set_scene_children_style_display(this.current_scene.getThreeScene(), 'None')
        this.scene_history.pop()
        this.current_scene = this.scene_history.slice(-1)[0]
        set_scene_children_style_display(this.current_scene.getThreeScene(), 'flex')
    }
}
