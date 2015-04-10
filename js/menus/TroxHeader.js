/**
 * Created by aghassaei on 4/9/15.
 */

TroxHeader = Backbone.View.extend({

    el: "body",

    events: {
        "click #troxMainLogo":                                            "_showAboutModal",
        "click #moreInfoTrox":                                            "_showAboutModal"
    },

    initialize: function(){

    },

    _showAboutModal: function(e){
        e.preventDefault();
        $("#aboutTroxModal").modal('show');
    }

});