/**
 * Created by aghassaei on 4/9/15.
 */


TroxUI = Backbone.View.extend({

    el: "#navRibbon",

    events: {
        "click .troxCellButton":                                    "_selectCellType",
        "click .deleteMode":                                     "_updateDeleteMode",
    },

    initialize: function(){

        _.bindAll(this, "render");

        this.listenTo(this.model, "change:deleteMode", this.render);
        this.listenTo(dmaGlobals.lattice, "change:freeformCellType", this.render);
        this.render();
    },

    _selectCellType: function(e){
        e.preventDefault();
        var newType = $(e.target).data("type");
        if (newType == "icosa") return;
        dmaGlobals.lattice.set("freeformCellType", newType);
    },

    _updateDeleteMode: function(e){
        e.preventDefault();
        dmaGlobals.appState.set("deleteMode", !dmaGlobals.appState.get("deleteMode"));
    },

    render: function(){
        this.$el.html(this.template(_.extend(dmaGlobals.lattice.toJSON(), this.model.toJSON())));
        var cellType = dmaGlobals.lattice.get("freeformCellType");
        this.$el.find("[data-type='" + cellType + "']").addClass("troxCellSelected");
    },

    template: _.template('\
        <div class="btn-toolbar">\
              <a data-type="tetra" class="btn btn-primary troxCellButton" href="#">tetra</a>\
              <a data-type="octa" class="btn btn-primary troxCellButton" href="#">octa</a>\
              <a data-type="icosa" class="btn btn-primary troxCellButton" href="#">icosa</a>\
              <a class="btn btn-primary <% if (deleteMode){ %> troxSelected<% } %>"><span class="fui-cross"></span></a>\
              <a class="btn btn-primary">Reset</a>\
        </div>\
        ')

});