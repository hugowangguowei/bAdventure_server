/**
 * Created by wgw on 2016/2/5.
 * �û�����
 * �����������
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

