/**
 * Created by aghassaei on 5/26/15.
 */


define(['underscore', 'stlLoader', 'part', 'bin!gikPartSTL', 'bin!gikEndPartSTL'], function(_, THREE, DMAPart, gikPart, gikEndPart){

    var loader = new THREE.STLLoader();
    var unitGeo = preProcessGeo(loader.parse(gikPart));
    var unitGeoEnd = preProcessGeo(loader.parse(gikEndPart));

    function preProcessGeo(geo){
        var unitScale = 1/(1.2699999809265137);
        geo.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
        geo.applyMatrix(new THREE.Matrix4().makeScale(unitScale, unitScale, unitScale));
        return geo;
    }

    function GIKPart(index, parent){
        DMAPart.call(this, index, parent);
    }
    GIKPart.prototype = Object.create(DMAPart.prototype);

    GIKPart.prototype._getGeometry = function(){
        if (this._isEnd()) return unitGeoEnd;
        return unitGeo;
    };

    GIKPart.prototype._rotatePart = function(mesh){
        if (this._getGIKLength()-1 == this.index) mesh.rotateZ(Math.PI);
        return mesh;
    };

    GIKPart.prototype._isEnd = function(){
        return this.index == 0 || this.index == this._getGIKLength()-1;
    };

    GIKPart.prototype._getGIKLength = function(){
        return this.parentCell.getLength();
    };

    return GIKPart;

});