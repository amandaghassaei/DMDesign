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

//        _.bindAll(this, "render");

        this.listenTo(this.model, "change:deleteMode", this.render);
        this.listenTo(dmaGlobals.lattice, "change:freeformCellType", this.render);
        this.render();
    },

    _selectCellType: function(e){
        e.preventDefault();
        var $target = $(e.target);
        if (!$(e.target).hasClass("troxCellButton")) $target = $($target.parent());
        var newType = $target.data("type");
        if (newType == "icosa") return;
        dmaGlobals.lattice.set("freeformCellType", newType);
    },

    _updateDeleteMode: function(e){
        e.preventDefault();
        dmaGlobals.appState.set("deleteMode", !dmaGlobals.appState.get("deleteMode"));
    },

    _showAboutModal: function(e){
        e.preventDefault();
        $("#aboutTroxModal").modal('show');
    },

    _showResetModal: function(e){
        e.preventDefault();
        $("#resetTroxModal").modal('show');
    },

    render: function(){
        this.$el.html(this.template());
        var cellType = dmaGlobals.lattice.get("freeformCellType");
        var highlighted = this.$el.find("[data-type='" + cellType + "']");
        highlighted.children(".troxHighlight").show();
        highlighted.children(".troxNoHighlight").hide();
        if (this.model.get("deleteMode")){
            var deleteButton = $("#troxDeleteButton");
            deleteButton.children(".troxHighlight").show();
            deleteButton.children(".troxNoHighlight").hide();
        }
    },

    template: _.template('\
        <div class="btn-toolbar">\
              <a data-type="tetra" class="troxCellButton" href="#">\
                <img class="troxHighlight" src="assets/imgs/trox_highlighted_07.png">\
                <img class="troxNoHighlight" src="assets/imgs/trox_assets_07.png">\
                <br/><span>Tetra</span>\
                </a>\
              <a data-type="octa" class="troxCellButton" href="#">\
                <img class="troxHighlight" src="assets/imgs/trox_highlighted_09.png">\
                <img class="troxNoHighlight" src="assets/imgs/trox_assets_09.png">\
                <br/><span>Octa</span>\
              </a>\
              <a data-type="icosa" class="troxCellButton" href="#">\
                <img class="troxHighlight" src="assets/imgs/trox_highlighted_11.png">\
                <img class="troxNoHighlight" src="assets/imgs/trox_assets_11.png">\
                <br/><span>Icosa</span>\
                </a>\
              <a id="troxDeleteButton" href="#">\
                <img class="troxHighlight" src="assets/imgs/trox_highlighted_13.png">\
                <img class="troxNoHighlight" src="assets/imgs/trox_assets_13.png">\
                <br/><span>Erase</span>\
                </a>\
        </div>\
        <div id="troxFooter">\
            <a class="aboutTrox pull-left" href="#"><img class="troxLogo" src="assets/imgs/trox_assets_15.png"></a>\
            <a id="troxReset" href="#">Reset</a>\
        </div>\
        ')

});