/**
 * Created by aghassaei on 6/11/15.
 */


/**
 * Created by aghassaei on 1/16/15.
 */


define(['underscore', 'backbone', 'appState', 'globals', 'plist', 'three', 'threeModel'],
    function(_, Backbone, appState, globals, plist, THREE, three){

    return Backbone.Model.extend({

        defaults: {

            cellsMin: null,//min position of cells matrix
            cellsMax: null,//max position of cells matrix
            numCells: 0
        },


        initialize: function(options, classProperties, callback){

            this.cells = [[[null]]];//3D matrix containing all cells and null, dynamic size
            this.sparseCells = [[[null]]];//3D matrix containing highest hierarchical level of cells and null

            //bind events

            this.listenTo(appState, "change:cellMode", this._updateForMode);
            this.listenTo(appState, "change:cellsVisible", this._setCellVisibility);

            if (this.__bindEvents) this.__bindEvents();
            if (this.__initialize) this.__initialize(options, callback);
        },





        //add/remove cells

        addCellsInRange: function(range){//add a block of cells (extrude)
            this.checkForMatrixExpansion(this.sparseCells, range.max, range.min);

            var cellsMin = this.get("cellsMin");
            var relativeMin = (new THREE.Vector3()).subVectors(range.min, cellsMin);
            var relativeMax = (new THREE.Vector3()).subVectors(range.max, this.get("cellsMin"));

            for (var x=relativeMin.x;x<=relativeMax.x;x++){
                for (var y=relativeMin.y;y<=relativeMax.y;y++){
                    for (var z=relativeMin.z;z<=relativeMax.z;z++){
                        if (!this.sparseCells[x][y][z]) {
                            var self = this;
                             this.makeCellForLatticeType({index: (new THREE.Vector3(x, y, z)).add(cellsMin)}, function(cell){
                                self.sparseCells[x][y][z] = cell;
                                self.set("numCells", self.get("numCells")+1);
                            });
                        } else console.warn("already a cell there");
                    }
                }
            }
            three.render();
        },

        addCellAtIndex: function(index, noRender, noCheck, material){//no render no check from fill/load

            if (!noCheck || noCheck === undefined) this.checkForMatrixExpansion(this.sparseCells, index, index);

            var relIndex = (new THREE.Vector3()).subVectors(index, this.get("cellsMin") || index);
            if (!this.sparseCells[relIndex.x][relIndex.y][relIndex.z]) {
                var self = this;
                if (!noRender || noRender === undefined) three.setRenderFlag();
                this.makeCellForLatticeType({index:index, material:material}, function(cell){
                    self.sparseCells[relIndex.x][relIndex.y][relIndex.z] = cell;
                    self.set("numCells", self.get("numCells")+1);
                });
            } else console.warn("already a cell there");

        },

        _indexForPosition: function(absPosition){
            return new THREE.Vector3(
                Math.round(absPosition.x/this.xScale()),
                Math.round(absPosition.y/this.yScale()),
                Math.round(absPosition.z/this.zScale()));
        },

        _positionForIndex: function(index){
            var position = index.clone();
            position.x = (position.x)*this.xScale();
            position.y = (position.y)*this.yScale();
            position.z = (position.z)*this.zScale();
            return position;
        },

    //    removeCellAtIndex: function(indices){
    //
    //        var index = this._subtract(indices, this.get("cellsMin"));
    //        var cells = this.get("cells");
    //        if (index.x<cells.length && index.y<cells[0].length && index.z<cells[0][0].length){
    //            this.removeCell(cells[index.x][index.y][index.z]);
    //        }
    //    },

        removeCell: function(cell){
            if (!cell) return;
            var index = (new THREE.Vector3()).subVectors(cell.index, this.get("cellsMin"));
            cell.destroy();
            this.sparseCells[index.x][index.y][index.z] = null;

            //todo shrink cells matrix if needed

            this.set("numCells", this.get("numCells")-1);
            three.render();
        },

        clearCells: function(silent){
            if (silent === undefined) silent = false;
            this._loopCells(this.sparseCells, function(cell){//send destroy to top level
                if (cell) cell.destroy();
            });
            this.cells = [[[null]]];
            this.sparseCells = [[[null]]];
            this.set("cellsMax", null, {silent:silent});
            this.set("cellsMin", null, {silent:silent});
            this.set("numCells", 0, {silent:silent});
            if (this.__clearCells) this.__clearCells(silent);
            three.render();
        },

        calculateBoundingBox: function(){
            var scale = this._allAxesScales();
            var min = _.clone(this.get("cellsMin"));
            var max = _.clone(this.get("cellsMax"));
            _.each(_.keys(scale), function(key){
                min[key] *= scale[key];
                max[key] *= scale[key];
            });
            return {min:min, max:max};
        },








        //cells array

        checkForMatrixExpansion: function(cells, indicesMax, indicesMin){

            if (!cells) {
                console.warn("no cells specified in matrix expansion");
                return;
            }

            if (!this.get("cellsMax") || !this.get("cellsMin")){
                this.set("cellsMax", indicesMax);
                this.set("cellsMin", indicesMin);
                this._expandCellsArray(cells, (new THREE.Vector3()).subVectors(indicesMax, indicesMin), false);
                return;
            }

            var lastMax = this.get("cellsMax");
            var lastMin = this.get("cellsMin");
            var newMax = this._updateCellsMax(indicesMax, lastMax);
            var newMin = this._updateCellsMin(indicesMin, lastMin);
            if (newMax) {
                this._expandCellsArray(cells, (new THREE.Vector3()).subVectors(newMax, lastMax), false);
                this.set("cellsMax", newMax);
            }
            if (newMin) {
                this._expandCellsArray(cells, (new THREE.Vector3()).subVectors(lastMin, newMin), true);
                this.set("cellsMin", newMin);
            }
        },

        _expandCellsArray: function(cells, expansion, fromFront){

            _.each(_.keys(expansion), function(key){
                if (expansion[key] == 0) return;//no expansion on this axis

                var cellsX = cells.length;
                var cellsY = cells[0].length;
                var cellsZ = cells[0][0].length;

                if (key=="x"){
                    for (var x=0;x<expansion[key];x++){
                        var newLayer = [];
                        for (var y=0;y<cellsY;y++){
                            var newCol = [];
                            for (var z=0;z<cellsZ;z++){
                                newCol.push(null);
                            }
                            newLayer.push(newCol);
                        }
                        if (fromFront) cells.unshift(newLayer);
                        else cells.push(newLayer);
                    }
                } else if (key=="y"){
                    for (var x=0;x<cellsX;x++){
                        for (var y=0;y<expansion[key];y++){
                            var newCol = [];
                            for (var z=0;z<cellsZ;z++){
                                newCol.push(null);
                            }
                            if (fromFront) cells[x].unshift(newCol);
                            else cells[x].push(newCol);
                        }
                    }
                } else if (key=="z"){
                    for (var x=0;x<cellsX;x++){
                        for (var y=0;y<cellsY;y++){
                            for (var z=0;z<expansion[key];z++){
                                if (fromFront) cells[x][y].unshift(null);
                                else cells[x][y].push(null);
                            }
                        }
                    }
                }
            });
        },

        _updateCellsMin: function(newPosition, currentMin){
            var newMin = new THREE.Vector3();
            var hasChanged = false;
            _.each(_.keys(newPosition), function(key){
                if (newPosition[key]<currentMin[key]){
                    hasChanged = true;
                    newMin[key] = newPosition[key];
                } else {
                    newMin[key] = currentMin[key];
                }
            });
            if (hasChanged) return newMin;
            return false;
        },

        _updateCellsMax: function(newPosition, currentMax){
            var newMax = new THREE.Vector3();
            var hasChanged = false;
            _.each(_.keys(newPosition), function(key){
                if (newPosition[key]>currentMax[key]){
                    hasChanged = true;
                    newMax[key] = newPosition[key];
                } else {
                    newMax[key] = currentMax[key];
                }
            });
            if (hasChanged) return newMax;
            return false;
        },



        //events

        _updatePartType: function(){
            this._iterCells(this.sparseCells, function(cell){
                if (cell) cell.destroyParts();
            });
            this._updateForMode();
        },

        _updateForMode: function(){
            var cellMode = appState.get("cellMode");
            var numCells = this.get("numCells");
            this._iterCells(this.sparseCells, function(cell){
                if (cell) cell.setMode(cellMode, function(){
                    if (--numCells <= 0) three.render();
                });
            });
        },

        _setCellVisibility: function(){
            if (appState.get("cellsVisible")) this.showCells();
            else this.hideCells();
        },

        hideCells: function(){
            this._iterCells(this.sparseCells, function(cell){
                if (cell) cell.hide();
            });
            three.render();
        },

        showCells: function(){
            var cellMode = appState.get("cellMode");
            this._iterCells(this.sparseCells, function(cell){
                if (cell) cell.show(cellMode)
            });
            three.render();
        },






        //utils

        _iterCells: function(cells, callback){
            _.each(cells, function(cellLayer){
                _.each(cellLayer, function(cellColumn){
                    _.each(cellColumn, function(cell){
                        callback(cell, cellColumn, cellLayer);
                    });
                });

            });
        },

        _loopCells: function(cells, callback){
            for (var x=0;x<cells.length;x++){
                for (var y=0;y<cells[0].length;y++){
                    for (var z=0;z<cells[0][0].length;z++){
                        callback(cells[x][y][z], x, y, z, this);
                    }
                }
            }
        },

        _allAxesScales: function(){
            var xScale = this.xScale();
            var yScale = this.yScale();
            var zScale = this.zScale();
            return {x:xScale, y:yScale, z:zScale};
        },





        //save/load

        parseCellsJSON: function(sparseCells){
            var cellsMin = this.get("cellsMin");
            this._loopCells(sparseCells, function(cell, x, y, z, self){
                if (cell) self.addCellAtIndex((new THREE.Vector3(x, y, z)).add(cellsMin), true, true, cell.material);
            });
        },

        getSaveJSON: function(){
            var data = this.toJSON();
            data.sparseCells = this.sparseCells;
            return data;
        },

        toJSON: function(){//a minimal toJSON for ui stuff - no need to parse all cells
            return _.omit(this.attributes, ["nodes"]);//omit makes a copy
        }//todo something weird here

    });
});