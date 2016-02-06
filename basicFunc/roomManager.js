/**
 * Created by wgw on 2016/2/6.
 */

var baRoom = require('../private/baRoom');
var serverMethod = require('../private/method/server_method');
var userManager = require('./userManager');


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
     * ����·���
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
     * �������
     * @param room
     */
    roomRefresh:function(room){
        this.roomIntroRefresh(room);
        this.roomMemRefresh(room);
    },
    /**
     * ���������
     * @param room
     */
    roomIntroRefresh:function(room){
        var info = room.getBriefInfo();
        var objCharaList = uM.getUsersByStateType(["mainTable","waitingQueue"]);
        serverMethod.broadcastToList(objCharaList,'roomListRefresh',info);
    },
    /**
     * �����Ա����
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
     * �û�����ǰ���з������Ϣ
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
}