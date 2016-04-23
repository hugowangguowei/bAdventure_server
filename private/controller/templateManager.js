/**
 * Created by wgw on 2016/2/10.
 * Ä£°å¹ÜÀíÆ÷
 */
var errManager = require('./errorManager');

var templateList = {};
var defaultTemplate = {

}
var eM = new errManager();

module.exports = templateManager;

function templateManager(){

}

templateManager.prototype = {
    getTemplateById:function(tName){
        if(!tName){
            this.getTemplateById("default");
        }
        else{
            if(templateList[tName]){
                return templateList[tName];
            }
            eM.uploadError("can't find the template!");
            return 0;
        }
    }
}