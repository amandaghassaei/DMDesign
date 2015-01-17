

ThreeView = Backbone.View.extend({

    el: "#threeContainer",

    camera: new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000),
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({antialias:false}),

    initialize: function(){

        _.bindAll(this, "render", "animate", "onWindowResize");

        this.camera.position.z = 500;
        this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002);
        this.controls = new THREE.OrbitControls(this.camera, this.$el.get(0));
        this.controls.addEventListener('change', this.render);

        this.drawRandomStuff();

        // lights
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        this.scene.add(light);
        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        this.scene.add(light);
        light = new THREE.AmbientLight( 0x222222 );
        this.scene.add(light);


        // renderer
        this.renderer.setClearColor(this.scene.fog.color, 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.$el.append(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize, false);

        this.animate();
    },

    drawRandomStuff: function(){
        var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
        var material = new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );

        for ( var i = 0; i < 500; i ++ ) {
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = ( Math.random() - 0.5 ) * 1000;
            mesh.position.y = ( Math.random() - 0.5 ) * 1000;
            mesh.position.z = ( Math.random() - 0.5 ) * 1000;
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            this.scene.add(mesh);
        }
    },

    setFillGeometry: function(fillGeometry){
        var self = this;
        fillGeometry.bind("change:geometry", function(){
            if (fillGeometry.previous("mesh")) self.scene.remove(fillGeometry.previous("mesh"));
            self.render();
        });
        this.scene.add(fillGeometry.get("mesh"));
        fillGeometry.bind("change:mesh change:orientation", this.render);
        this.render();
    },

    onWindowResize: function(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    },

    animate: function(){
        requestAnimationFrame(this.animate);
        this.controls.update();
    },

    render: function(){
        this.renderer.render(this.scene, this.camera);
    },

    clearAll: function(){
        var children = this.scene.children;
        for (var i=children.length;i>=0;i--){
            var object = children[i];
            if (object instanceof THREE.Mesh){
                this.scene.remove(object);
            }
        }
        this.render();
    }
});