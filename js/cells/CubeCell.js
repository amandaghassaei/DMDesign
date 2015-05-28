/**
 * Created by aghassaei on 5/26/15.
 */


(function () {

    var unitCellGeo = new THREE.BoxGeometry(1,1,1);

    function CubeCell(indices){
        DMACell.call(this, indices);
    }
    CubeCell.prototype = Object.create(DMACell.prototype);

    CubeCell.prototype._getGeometry = function(){
        return unitCellGeo;
    };

    CubeCell.prototype._buildWireframe = function(mesh){//abstract mesh representation of cell
        var wireframe = new THREE.BoxHelper(mesh);
        wireframe.material.color.set(0x000000);
        wireframe.matrixWorld = mesh.matrixWorld;
        wireframe.matrixAutoUpdate = true;
        return wireframe;
    };

    CubeCell.prototype.calcHighlighterPosition = function(face){

        var direction = face.normal.clone().applyEuler(this.object3D.rotation);
        var position = this.getPosition();
        var scale = this.xScale();
        _.each(_.keys(position), function(key){
            position[key] += direction[key]*scale/2;
        });
        return {index: _.clone(this.indices), direction:direction, position:position};
    };

    self.CubeCell = CubeCell;

})();