/**
 * Created by aghassaei on 2/25/15.
 */

define(['jquery', 'underscore', 'menuParent', 'plist', 'lattice', 'globals', 'materials', 'text!materialMenuTemplate'],
    function($, _, MenuParentView, plist, lattice, globals, materials, template){

    var materialID = 0;

    return MenuParentView.extend({

        events: {
            "click #navToCompositeMenu":                             "_navToCompositeMenu",
            "click #compositeFromLattice":                           "_latticeToComposite",
            "click .editComposite":                                  "_editComposite",
            "click .editMaterial":                                   "_editMaterial",
            "click #newElementaryMaterial":                          "_newMaterial"
        },

        _initialize: function(){
            //bind events
            this.listenTo(lattice, "change", this.render);
            this.listenTo(this.model, "change", this.render);
        },

        _navToCompositeMenu: function(e){
            e.preventDefault();
            lattice.setToCompositeMode();
        },

        _editComposite: function(e){
            e.stopPropagation();
            e.preventDefault();
            var id = $(e.target).data("id");
            lattice.setToCompositeMode(id,materials.getMaterialForId(id));
        },

        _editMaterial: function(e){
            e.stopPropagation();
            e.preventDefault();
            this._openMaterialEditor($(e.target).data("id"));
        },

        _newMaterial: function(e){
            e.preventDefault();
            var id = "material" + this.cid + materialID++;//first create new material id
            this._openMaterialEditor(id);
        },

        _openMaterialEditor: function(materialID){
            require(['menuWrapper'], function(menuWrapper){
                menuWrapper.initTabWithObject(materialID, "materialEditor", "navMaterial")
            });
        },

        _latticeToComposite: function(e){
            lattice.setToCompositeMode(null, lattice.getCompositeData());
            lattice.clearCells();
            e.preventDefault();
        },

        _makeTemplateJSON: function(){
            return _.extend(lattice.toJSON(), this.model.toJSON(), plist, globals, {inSimMode:false, materials:materials.list, compositeMaterialsKeys:materials.getCompositeKeys()});
        },

        template: _.template(template)
    });
});