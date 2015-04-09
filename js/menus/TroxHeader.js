/**
 * Created by aghassaei on 4/9/15.
 */

TroxHeader = Backbone.View.extend({

    el: "#troxHeader",

    events: {
    },

    initialize: function(){

        var $logo = $("#troxCBALogo");
        $logo.mouseover(function(){
            $logo.attr("src","assets/imgs/logo-active.png");
        });
        $logo.mouseout(function(){
            $logo.attr("src","assets/imgs/logo.png");
        });

    }

});