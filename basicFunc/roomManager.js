/**
 * Created by wgw on 2016/2/6.
 */

var baRoom = require('../private/baRoom');
var serverMethod = require('../private/method/server_method');
var userManager = require('./userManager');
var SMT = require("../private/socket/socket_msgDefine").SERVER_MSG_TYPE;


var roomIdCount = 0;
var roomList = [];
var uM = new userManager();

module.exports = roomManager;

function roomManager(){
    this.bindedUM  = null;
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
    /**
     * 添加新房间
     * @param roomInfo
     * @param user
     * @returns {baRoom|exports|module.exports}
     */
    addRoom:function(roomInfo,user){

        var roomID = this.getIdForNewRoom();
        var room = new baRoom(roomID,roomInfo.name,roomInfo.memNum);
        roomList.push(room);
        room.addLeader(user);
        this.roomIntroRefresh(room);
        return room;
    },
    /**
     * 删除房间
     * @param room
     */
    deleteRoom:function(room){
        var leader = room.roomLeader;
        leader.getOutRoom();

        var roomMem = room.roomMem;
        for(var i = 0;i<roomMem.length;i++){
            var mem_i = roomMem[i];
            mem_i.getOutRoom();
        }

        var roomInfo = room.getBriefInfo();
        var objCharaList = uM.getUsersByStateType(["mainTable","waitingQueue"]);
        serverMethod.broadcastToList(objCharaList,SMT.ROOM_DELETE,roomInfo);
    },
    /**
     * 房间更新
     * @param room
     */
    roomRefresh:function(room){
        this.roomIntroRefresh(room);
        this.roomMemRefresh(room);
    },
    /**
     * 房间简介更新
     * @param room
     */
    roomIntroRefresh:function(room){
        var info = room.getBriefInfo();
        var objCharaList = uM.getUsersByStateType(["mainTable","waitingQueue"]);
        serverMethod.broadcastToList(objCharaList,SMT.ROOM_LIST_REFRESH,info);
    },
    /**
     * 房间成员更新
     * @param {baRoom}
     */
    roomMemRefresh:function(room){
        var roomLeader = room.roomLeader;
        uM.sendCurRoomInfo(roomLeader,room);

        var roomMemList = room.roomMem;
        for(var i = 0;i<roomMemList.length;i++){
            var mem_i = roomMemList[i];
            uM.sendCurRoomInfo(mem_i,room);
        }
    },
    /**
     * 用户请求当前所有房间的信息
     * @param {baPlayer}
     */
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
    /**
     * 开始游戏
     * @param room
     */
    startGame:function(room){
        var memInfo = _getMemInfo(room);

        var roomLeader = room.roomLeader;
        var rlSocket = roomLeader.socket;
        rlSocket.emit("startGame",{playerType:"leader",mem:memInfo});

        var roomMemList = room.roomMem;
        for(var i = 0;i<roomMemList.length;i++){
            var mem_i = roomMemList[i];
            var memSocket = mem_i.socket;
            memSocket.emit("startGame",{playerType:"normal",mem:memInfo});
        }

        function _getMemInfo(room){
            var info = [];
            var roomMemList = room.roomMem;
            for(var i =0;i< roomMemList.length;i++){
                var player_i = roomMemList[i];
                var info_i = player_i.getPlayerInfo();
                info.push(info_i);
            }
            return info;
        }
    }
}