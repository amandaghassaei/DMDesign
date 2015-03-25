///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////ONE BIT///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

function OneBitBot(){
    Machine.call(this);
}
OneBitBot.prototype = Object.create(Machine.prototype);

OneBitBot.prototype._buildMeshes = function(callback){
    var meshes = [];
    var numMeshes = 4;
    function allLoaded(){
        numMeshes -= 1;
        return numMeshes <= 0;
    }
    function geometryScale(geometry){
        var unitScale = 0.05;
        geometry.applyMatrix(new THREE.Matrix4().makeScale(unitScale, unitScale, unitScale));
        return geometry;
    }
    function meshPrep(geometry, name){
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-10,-12.8,0));
        var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color:0xaaaaaa, shading: THREE.FlatShading}));
        meshes[name] = mesh;
        if (allLoaded()) callback(meshes);
    }
    var loader = new THREE.STLLoader();
    loader.load("assets/stls/oneBitBot/zAxis.stl", function(geometry){
        geometryScale(geometry);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(5,-2.4,-0.8-1.9685));
        meshPrep(geometry, "zAxis");
    });
    loader.load("assets/stls/oneBitBot/zDrive.stl", function(geometry){
        geometryScale(geometry);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(5,-2.4,0));
        meshPrep(geometry, "zDrive");
    });
    loader.load("assets/stls/oneBitBot/yAxisMount.stl", function(geometry){
        geometryScale(geometry);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(5,0,0));
        meshPrep(geometry, "yAxisMount");
    });
    loader.load("assets/stls/oneBitBot/basePlate.stl", function(geometry){
        geometryScale(geometry);
        meshPrep(geometry, "basePlate");
    });
};

OneBitBot.prototype._moveTo = function(x, y, z, speed, wcs, callback){
    var totalThreads = 3;
    function sketchyCallback(){
        totalThreads -= 1;
        if (totalThreads > 0) return;
        callback();
    }
    var startingPos = this.meshes["zAxis"].position.clone();
    speed = this._normalizeSpeed(startingPos, x, y, this._reorganizeSpeed(speed));
    this._moveXAxis(startingPos.x, x, "x", speed.x, sketchyCallback);
    this._moveYAxis(startingPos.y, y, "y", speed.y, sketchyCallback);
    this._moveZAxis(startingPos.z, z, "z", speed.z, sketchyCallback);
};

OneBitBot.prototype._moveXAxis = function(startingPos, target, axis, speed, callback){
    if (target == null || target === undefined) {
        callback();
        return;
    }
    this._animateObjects([this.meshes["zAxis"], this.meshes["zDrive"], this.meshes["yAxisMount"], this.cell], axis, speed, startingPos, target, callback);
};
OneBitBot.prototype._moveYAxis = function(startingPos, target, axis, speed, callback){
    if (target == null || target === undefined) {
        callback();
        return;
    }
    this._animateObjects([this.meshes["zAxis"], this.meshes["zDrive"],  this.cell], axis, speed, startingPos, target, callback);
};
OneBitBot.prototype._moveZAxis = function(startingPos, target, axis, speed, callback){
    if (target == null || target === undefined) {
        callback();
        return;
    }
    this._animateObjects([this.meshes["zAxis"], this.cell], axis, speed, startingPos, target, callback);
};