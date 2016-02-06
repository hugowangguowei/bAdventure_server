/**
 * Created by wgw on 2016/2/6.
 * 房间管理器
 */
var baRoom = require('../private/baRoom');
var baPlayer = require('../private/baPlayer');
var serverMethod = require('../private/method/server_method');
var userMethod = require('../private/method/user_method');

module.exports = roomManager;

var roomIdCount = 0;
var roomList = [];
var refreshList = {};

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


    addRoom:function(roomInfo,user){

        var roomID = this.getIdForNewRoom();
        var room = new baRoom(roomID,roomInfo.name,roomInfo.memNum);
        roomList.push(room);

        room.addLeader(user);

        this.roomIntroRefresh(room);
        return room;
    },
    roomRefresh:function(room){
        this.roomIntroRefresh(room);
        this.roomMemRefresh(room);
    },
    roomIntroRefresh:function(room){
        var info = room.getBriefInfo();
        var objCharaList = uM.getUsersByStateType(["mainTable","waitingQueue"]);
        serverMethod.broadcastToList(objCharaList,'roomListRefresh',info);
    },
    roomMemRefresh:function(room){
        var roomLeader = room.roomLeader;
        userMethod.intoARoom(roomLeader,room);

        var roomMemList = room.roomMem;
        for(var i = 0;i<roomMemList.length;i++){
            var mem_i = roomMemList[i];
            userMethod.intoARoom(mem_i,room);
        }
    },
    clientRoomInfoInitialize: function (user) {

        var roomInfoList = [];
        for(var i = 0;i<roomList.length;i++){
            var room_i = roomList[i];
            var info_i = room_i.getBriefInfo();
            roomInfoList.push(info_i);
        }

        var socket = user.socket;
        socket.emit('clientRoomInfoInitialize',roomInfoList);
    },
    startMachine: function () {

    }
}