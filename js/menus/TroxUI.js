/**
 * Created by aghassaei on 4/9/15.
 */


TroxUI = Backbone.View.extend({

    el: "#navRibbon",

    events: {
        "click .troxCellButton":                                       "_selectCellType",
        "click #troxDeleteButton":                                     "_updateDeleteMode",
        "click .aboutTrox":                                            "_showAboutModal",
        "click #troxReset":                                            "_showResetModal"
    },

    initialize: function(){

        _.bindAll(this, "render");

        this.listenTo(this.model, "change:deleteMode", this.render);
        this.listenTo(dmaGlobals.lattice, "change:freeformCellType", this.render);
        this.render();
    },

    _selectCellType: function(e){
        e.preventDefault();
        var newType = $(e.target).parent("a").data("type");
        if (newType == "icosa") return;
        dmaGlobals.lattice.set("freeformCellType", newType);
    },

    _updateDeleteMode: function(e){
        e.preventDefault();
        dmaGlobals.appState.set("deleteMode", !dmaGlobals.appState.get("deleteMode"));
    },

    _showAboutModal: function(e){
        e.preventDefault();

    },

    _showResetModal: function(e){
        e.preventDefault();
        
    },

    render: function(){
        this.$el.html(this.template(_.extend(dmaGlobals.lattice.toJSON(), this.model.toJSON())));
    },

    template: _.template('\
        <div class="btn-toolbar">\
              <a data-type="tetra" class="troxCellButton" href="#">\
                <% if (freeformCellType == "tetra") { %><img src="assets/imgs/trox_highlighted_07.png">\
                <% } else { %><img src="assets/imgs/trox_assets_07.png"><% } %></a>\
              <a data-type="octa" class="troxCellButton" href="#">\
                <% if (freeformCellType == "octa") { %><img src="assets/imgs/trox_highlighted_09.png">\
                <% } else { %><img src="assets/imgs/trox_assets_09.png"><% } %></a>\
              <a data-type="icosa" class="troxCellButton" href="#">\
                <% if (freeformCellType == "icosa") { %><img src="assets/imgs/trox_highlighted_11.png">\
                <% } else { %><img src="assets/imgs/trox_assets_11.png"><% } %></a>\
              <a id="troxDeleteButton">\
                <% if (deleteMode) { %><img src="assets/imgs/trox_highlighted_13.png">\
                <% } else { %><img src="assets/imgs/trox_assets_13.png"><% } %></a>\
        </div>\
        <div id="troxFooter">\
            <a class="aboutTrox pull-left" href="#"><img class="troxLogo" src="assets/imgs/trox_assets_15.png"></a>\
            <a id="troxReset" href="#">Reset</a>\
        </div>\
        ')

});