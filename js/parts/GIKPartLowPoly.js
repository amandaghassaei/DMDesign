/**
 * Created by aghassaei on 6/8/15.
 */



define(['underscore', 'stlLoader', 'gikPart', 'bin!gikPartLowPolySTL', 'bin!gikEndPartLowPolySTL'], function(_, THREE, GIKPart, gikPartLowPoly, gikEndPartLowPoly){

    var loader = new THREE.STLLoader();
    var unitGeo = preProcessGeo(loader.parse(gikPartLowPoly));
    var unitGeoEnd = preProcessGeo(loader.parse(gikEndPartLowPoly));

    function preProcessGeo(geo){
        var unitScale = 1/(1.2699999809265137);
        geo.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
        geo.applyMatrix(new THREE.Matrix4().makeScale(unitScale, unitScale, unitScale));
        return geo;
    }

    function GIKPartLowPoly(index, parent){
        GIKPart.call(this, index, parent);
    }
    GIKPartLowPoly.prototype = Object.create(GIKPart.prototype);

    GIKPartLowPoly.prototype._getGeometry = function(){
        if (this._isEnd()) return unitGeoEnd;
        return unitGeo;
    };

    return GIKPartLowPoly;
});