class ClickBox {
    constructor(wh) {
        this.meshes = []
        this.wh = wh
        this.make_box()
        this.init_animation()
    }
    
    make_box() {
        var className = 'clickboxside';
        this.group = new THREE.Group();
        // Bow
        var el = this.createEmptyCSS3DObject(className);
        this.meshes.push(el);
        el.position.z = -this.wh/2;
        this.group.add(el);
    
        // Left
        var el = this.createEmptyCSS3DObject(className);
        this.meshes.push(el);
        el.position.z = -this.wh/2;
        var pivot_left = new THREE.Group();
        pivot_left.rotation.y = Math.PI/2;
        pivot_left.add(el);
        this.group.add(pivot_left);
    
        // Right
        var el = this.createEmptyCSS3DObject(className);
        this.meshes.push(el);
        el.position.z = -this.wh/2;
        var pivot_right = new THREE.Group();
        pivot_right.rotation.y = -Math.PI/2;
        pivot_right.add(el);
        this.group.add(pivot_right);
    
        // Rear
        var el = this.createEmptyCSS3DObject(className);
        this.meshes.push(el);
        el.position.z = -this.wh/2;
        var pivot_rear = new THREE.Group();
        pivot_rear.rotation.y = Math.PI;
        pivot_rear.add(el);
        this.group.add(pivot_rear);
    
        // Bottom
        var el = this.createEmptyCSS3DObject(className);
        this.meshes.push(el);
        el.position.z = -this.wh/2;
        var pivot_bottom = new THREE.Group();
        pivot_bottom.rotation.x = -Math.PI/2;
        pivot_bottom.add(el);
        this.group.add(pivot_bottom);
    
        // Top
        var el = this.createEmptyCSS3DObject(className);
        this.meshes.push(el);
        el.position.z = -this.wh/2;
        var pivot_top = new THREE.Group();
        pivot_top.rotation.x = +Math.PI/2;
        pivot_top.add(el);
        this.group.add(pivot_top);
    }

    init_animation() {
        var scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 1, 1, 1, 1 ] );
        var clip = new THREE.AnimationClip( 'Action', 2, [ scaleKF ] );
        this.mixer = new THREE.AnimationMixer( this.group );
        this.clipAction = this.mixer.clipAction( clip );
    }

    start_clip() {
        this.clipAction.play();        
    }

    stop_clip() {
        this.clipAction.stop();
    }

    update(delta) {
        if ( this.mixer )
            this.mixer.update( delta )
    }

    createEmptyCSS3DObject(className) {
        var div = document.createElement('div');
        div.style.width = this.wh + 'px';
        div.style.height = this.wh + 'px';
        div.className = className;
        var object = new THREE.CSS3DObject(div);
        var plane = new THREE.PlaneGeometry(this.wh, this.wh);
        var mesh = new THREE.Mesh(plane);
        mesh.clickable = true;
        mesh.add(object);
        return mesh;
    }

    addToScene(scene) {
        scene.add(this.group);
    }

    translate(x, y, z) {
        this.group.position.set(x, y, z);
    }

    contains(mesh) {
        return this.meshes.includes(mesh);
    }
}
