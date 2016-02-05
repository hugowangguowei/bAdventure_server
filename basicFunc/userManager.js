/**
 * Created by wgw on 2016/2/5.
 * 用户管理
 * 例如心跳检测
 */

module.exports = userManager;

function userManager() {
    this.id = "userManager";
}

userManager.prototype = {
    start: function () {
        console.log("start useManager");
    },
    close: function () {
        console.log("close userManager");
    }
}

