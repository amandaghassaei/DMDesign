/**
 * Created by aghassaei on 4/9/15.
 */


(function () {

    var tetraTrox;

    var skin = THREE.ImageUtils.loadTexture('assets/textures/blackPaper.png');
	skin.wrapS = skin.wrapT = THREE.RepeatWrapping;
    skin.repeat.set(4,4);

    var texture = THREE.ImageUtils.loadTexture( "assets/textures/paperSpecMap.jpg" );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4,4);

    var paperMaterial = new THREE.MeshPhongMaterial({
        map: skin,
        bumpMap:texture,
        color: new THREE.Color("#999999"),
        bumpScale:0.2,
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
        tetraTrox.computeBoundingBox();
        var max = tetraTrox.boundingBox.max,
            min = tetraTrox.boundingBox.min;
        var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
        var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
        tetraTrox.faceVertexUvs[0] = [];
        for (var i = 0; i < tetraTrox.faces.length ; i++) {

            var v1 = tetraTrox.vertices[tetraTrox.faces[i].a], v2 = tetraTrox.vertices[tetraTrox.faces[i].b], v3 = tetraTrox.vertices[tetraTrox.faces[i].c];
            tetraTrox.faceVertexUvs[0].push(
                [
                    new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
                    new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
                    new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
                ]);

        }
        tetraTrox.uvsNeedUpdate = true;
        tetraTrox.computeTangents();
    });

    function DMATetraTroxPart(type, parent){
        DMAPart.call(this, type, parent);
    }
    DMATetraTroxPart.prototype = Object.create(DMAPart.prototype);

    DMATetraTroxPart.prototype._makeMeshForType = function(){
        var mesh = new THREE.Mesh(tetraTrox, paperMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = false;
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
        octaTrox = new THREE.Geometry().fromBufferGeometry(octaTrox);
        octaTrox.computeBoundingBox();
        var max = octaTrox.boundingBox.max,
            min = octaTrox.boundingBox.min;
        var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
        var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
        octaTrox.faceVertexUvs[0] = [];
        for (var i = 0; i < octaTrox.faces.length ; i++) {

            var v1 = octaTrox.vertices[octaTrox.faces[i].a], v2 = octaTrox.vertices[octaTrox.faces[i].b], v3 = octaTrox.vertices[octaTrox.faces[i].c];
            octaTrox.faceVertexUvs[0].push(
                [
                    new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
                    new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
                    new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
                ]);

        }
        octaTrox.uvsNeedUpdate = true;
        octaTrox.computeTangents();
    });

    function DMAOctaTroxPart(type, parent){
        DMAPart.call(this, type, parent);
    }
    DMAOctaTroxPart.prototype = Object.create(DMAPart.prototype);

    DMAOctaTroxPart.prototype._makeMeshForType = function(){
        var mesh = new THREE.Mesh(octaTrox, paperMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        mesh.myPart = this;//need a ref back to this part
        return mesh;
    };

    self.DMAOctaTroxPart = DMAOctaTroxPart;

})();
