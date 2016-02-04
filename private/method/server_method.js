/**
 * Created by wangguowei on 2001/1/11.
 */

exports.broadcastToList = function (list,type,info) {
    var chara_i,socket_i;
    for(var i = 0;i<list.length;i++){
        chara_i = list[i];
        socket_i = chara_i.socket;
        socket_i.emit(type,info);
    }
}