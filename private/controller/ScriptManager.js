/**
 * Created by wgw on 2016/4/17.
 */
module.exports = ScriptManager;

var instance = null;

function ScriptManager(){
    this.scriptList = [];
    this.initialize();
}

ScriptManager.prototype = {
    initialize:function(){
        var
    },
    getScriptInitialInfoByID: function (scriptID) {
        if(scriptID == "test"){
            return
        }
    },
}