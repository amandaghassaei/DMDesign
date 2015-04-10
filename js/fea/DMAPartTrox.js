/**
 * Created by aghassaei on 4/9/15.
 */


(function () {

    var tetraTrox;

    var skin = THREE.ImageUtils.loadTexture('assets/textures/blackPaper.png');
	skin.wrapS = skin.wrapT = THREE.RepeatWrapping;

    var texture = THREE.ImageUtils.loadTexture( "assets/textures/blackPaper.png" );

    var paperMaterial = new THREE.MeshPhongMaterial({
        map: skin,
//        bumpMap:texture,
        color: new THREE.Color("#999999"),
        bumpScale:10,
        shininess:10,
        fog: false,
        shading:THREE.SmoothShading
    });



    //import part geometry
    var loader = new THREE.STLLoader();
    loader.load("assets/stls/parts/troxTetra.stl", function(geometry){

        tetraTrox = new THREE.Geometry().fromBufferGeometry(geometry);
        tetraTrox.computeBoundingBox();
        var unitScale = 1/3.25;
        tetraTrox.applyMatrix(new THREE.Matrix4().makeScale(unitScale, unitScale, unitScale));
        tetraTrox.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));
    });

    function DMATetraTroxPart(type, parent){
        DMAPart.call(this, type, parent);
    }
    DMATetraTroxPart.prototype = Object.create(DMAPart.prototype);

    DMATetraTroxPart.prototype._makeMeshForType = function(){
        var mesh = new THREE.Mesh(new THREE.SphereGeometry(1), paperMaterial);
        mesh.myPart = this;//need a ref back to this part
        return mesh;
    };

    self.DMATetraTroxPart = DMATetraTroxPart;

    var octaTrox;

    //import part geometry
    loader.load("assets/stls/parts/troxOcta.stl", function(geometry){

        octaTrox = geometry;
        octaTrox.computeBoundingBox();
        var unitScale = 1/3.25;
        octaTrox.applyMatrix(new THREE.Matrix4().makeScale(unitScale, unitScale, unitScale));
        octaTrox.computeTangents();
//        octaTrox = new THREE.Geometry().fromBufferGeometry(octaTrox);

        console.log(octaTrox);
    });

    function DMAOctaTroxPart(type, parent){
        DMAPart.call(this, type, parent);
    }
    DMAOctaTroxPart.prototype = Object.create(DMAPart.prototype);

    DMAOctaTroxPart.prototype._makeMeshForType = function(){
        var mesh = new THREE.Mesh(octaTrox, paperMaterial);
        mesh.myPart = this;//need a ref back to this part
        return mesh;
    };

    self.DMAOctaTroxPart = DMAOctaTroxPart;

})();
