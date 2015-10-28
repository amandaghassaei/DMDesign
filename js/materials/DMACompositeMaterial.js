/**
 * Created by aghassaei on 9/22/15.
 */


define(['material'], function(DMAMaterial){

    var materialNum = 1;

    function getNextMaterialNum(){
        return materialNum++;
    }

    function DMACompositeMaterial(json, id){

        var defaults = {
            elementaryCells: [],
            compositeCells: [],
            sparseCells: [[[null]]],//store as json
            cells: [[[null]]],//store as json
            cellsMin: null,
            cellsMax: null
        };

        json = _.extend(defaults, json);
        DMAMaterial.call(this, json, id);
    }
    DMACompositeMaterial.prototype = Object.create(DMAMaterial.prototype);

    DMACompositeMaterial.prototype.generateMaterialName = function(){
        return "Composite Material " + materialNum++;
    };

    DMACompositeMaterial.prototype.setData = function(data){

        var edited = false;
        if (data.sparseCells){
            edited |= !(_.isEqual(data.sparseCells, this.sparseCells));//must be comparing json
            this.sparseCells = data.sparseCells;
        }

        if (edited){
            console.log("composite material edited");
            var self = this;
            require(['materials'], function(materials){
                var compositeChildren = [];
                var elementaryChildren = [];

                var firstGen = self.getFirstGenChildMaterials(materials);
                elementaryChildren = _.clone(firstGen.elementaryCells);
                compositeChildren = _.clone(firstGen.compositeCells);

                _.each(firstGen.compositeCells, function(compositeID){
                    var material = materials.getMaterialForId(compositeID);
                    compositeChildren.concat(material.getCompositeChildren());
                    elementaryChildren.concat(material.getElementaryChildren());
                });
                compositeChildren = _.uniq(compositeChildren);//remove duplicates
                elementaryChildren = _.uniq(elementaryChildren);

                self.compositeChildren = compositeChildren;
                self.elementaryChildren = elementaryChildren;

                //getParentComposites
                if (!_.isEqual(self.getCompositeChildren(), compositeChildren)){

                }
                if (!_.isEqual(self.getElementaryChildren(), elementaryChildren)){
                    self.properties = self.getPropertiesFromElements(elementaryChildren)
                }
            });
        }
        return edited;
    };

    DMACompositeMaterial.prototype.getFirstGenChildMaterials = function(materials){
        var compositeChildrenFirstGen = [];
        var elementaryChildrenFirstGen = [];
        this.loopCells(function(cell, x, y, z){
            var materialID = cell.materialID;
            var material = materials.getMaterialForId(materialID);
            if (material.isComposite()){
                if (compositeChildrenFirstGen.indexOf(materialID) == -1) compositeChildren.push(materialID);
            } else {
                if (elementaryChildrenFirstGen.indexOf(materialID) == -1) elementaryChildren.push(materialID);
            }
        });
        return {compositeCells:compositeChildrenFirstGen, elementaryCells:elementaryChildrenFirstGen};
    };

    DMACompositeMaterial.prototype.recalcChildren = function(){

    };

    DMACompositeMaterial.prototype.getPropertiesFromElements = function(elementaryChildren){
        var properties = [];
        return properties;
    };

    DMACompositeMaterial.prototype._setCompositeChildren = function(compositeChildren){
        this.compositeChildren = compositeChildren;
    };

    DMACompositeMaterial.prototype.getCompositeChildren = function(){
        return this.compositeChildren;
    };

    DMACompositeMaterial.prototype._setElementaryChildren = function(elementaryChildren){

    };

    DMACompositeMaterial.prototype.getElementaryChildren = function(){
        return this.elementaryChildren;
    };

    DMACompositeMaterial.prototype.getDimensions = function(){
        return this.dimensions.clone();
    };

    DMACompositeMaterial.prototype.isComposite = function(){
        return true;
    };

    DMACompositeMaterial.prototype.isCompositeChild = function(id){
        return this.compositeChildren.indexOf(id)>-1;
    };

    DMACompositeMaterial.prototype.getSparseCells = function(){
        return this.sparseCells;//json description
    };

    DMACompositeMaterial.prototype.loopCells = function(callback){
        var cells = this.sparseCells;
        for (var x=0;x<cells.length;x++){
            for (var y=0;y<cells[0].length;y++){
                for (var z=0;z<cells[0][0].length;z++){
                    if (cells[x][y][z]) callback(cells[x][y][z], x, y, z);
                }
            }
        }
    };

    DMACompositeMaterial.prototype.toJSON = function(){
        var json = DMAMaterial.prototype.toJSON.call(this);
        return _.extend(json, {
            cellsMin: this.cellsMin,
            cellsMax: this.cellsMax,
            compositeChildren: this.compositeChildren,
            elementaryChildren: this.elementaryChildren,
            sparseCells: this.sparseCells
        });
    };

    return DMACompositeMaterial;

});