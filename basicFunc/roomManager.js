/**
 * Created by wgw on 2016/2/6.
 * 房间管理器
 */

module.exports = roomManager;

var roomIdCount = 0;
var roomList = [];

function roomManager(){
}

roomManager.prototype = {
    getIdForNewRoom:function(){
        roomIdCount++;
        return "room_" + roomIdCount;
    },
    getRoomById:function(roomId){
        for(var i =0;i<roomList.length;i++){
            var room_i = roomList[i];
            if(room_i.id == roomId){
                return room_i;
            }
        }
        return 0;
    },
    getRoomList:function(){
        return roomList;
    },
    addRoom:function(room){
        roomList.push(room);
    },
    startMachine: function () {

    }
}