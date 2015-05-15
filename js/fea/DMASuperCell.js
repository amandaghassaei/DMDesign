/**
 * Created by aghassaei on 5/15/15.
 */


var cellMaterials = [new THREE.MeshNormalMaterial()];

DMASuperCell = function(length, index){
    this.mesh = this._buildSuperCellMesh(length);
    this.index = _.clone(index);
    this.setScale();
    dmaGlobals.three.sceneAdd(this.mesh);
};

DMASuperCell.prototype._buildSuperCellMesh = function(length){
    var superCellGeo = new THREE.BoxGeometry(1,1,1);
    superCellGeo.applyMatrix(new THREE.Matrix4().makeScale(length, 1, 1));
    var mesh = THREE.SceneUtils.createMultiMaterialObject(superCellGeo, cellMaterials);
    var wireframe = new THREE.BoxHelper(mesh.children[0]);
    wireframe.material.color.set(0x000000);
    mesh.children.push(wireframe);
    return mesh;
};

DMASuperCell.prototype._setPosition = function(index){
    var position = dmaGlobals.lattice.getPositionForIndex(index);
    this.mesh.position.set(position.x, position.y, position.z);
};

DMASuperCell.prototype.setScale = function(scale){
    if (!scale) scale = dmaGlobals.lattice.get("scale");
    this.mesh.scale.set(scale, scale, scale);
    this._setPosition(this.index);
};

DMASuperCell.prototype.destroy = function(){
    dmaGlobals.three.sceneRemove(this.mesh);
    this.mesh = null;
    this.index = null;
}