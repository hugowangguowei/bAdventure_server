/**
 * Created by wangguowei on 2001/1/11.
 */

var config = require('./../config');
var baRoom = require('./../baRoom');
var serverMethod = require('./server_method');
var userMethod = require('./user_method');

exports.buildNewRoom = function (roomInfo,chara) {
    var roomID = config.getNewRoomID();
    var room = new baRoom(roomID,roomInfo.name,roomInfo.memNum);
    var roomList = config.getRoomList();
    roomList.push(room);

    room.addLeader(chara);

    roomListRefresh(room);
    return room;
}

exports.getAllRooms = function (chara) {
    var roomList = config.getRoomList();
    var roomInfoList = [];

    for(var i = 0;i<roomList.length;i++){
        var room_i = roomList[i];
        var info_i = room_i.getBriefInfo();
        roomInfoList.push(info_i);
    }

    var socket = chara.socket;
    socket.emit('getAllRooms',roomInfoList);
}

exports.roomRefresh = function(room){
    roomListRefresh(room);
    roomMemRefresh(room);
}

function roomListRefresh(room){
    var info = room.getBriefInfo();
    var objCharaList = config.getCharasByState(["mainTable","waitingQueue"]);
    serverMethod.broadcastToList(objCharaList,'roomListRefresh',info);
}

function roomMemRefresh(room){
    var roomLeader = room.roomLeader;
    userMethod.intoARoom(roomLeader,room);

    var roomMemList = room.roomMem;
    for(var i = 0;i<roomMemList.length;i++){
        var mem_i = roomMemList[i];
        userMethod.intoARoom(mem_i,room);
    }
}















