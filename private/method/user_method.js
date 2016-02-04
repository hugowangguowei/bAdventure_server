/**
 * Created by wangguowei on 2001/1/11.
 */
var roomMethod = require('./room_method');

exports.permissionCheck = function (chara,action) {
    switch (action){
        case "startGame":
            _canStartGame(chara);
            break;
    }

    function _canStartGame(chara){
        if(!chara.room){
            return false;
        }
        var room = chara.room;
        var roomLeader = room.roomLeader;
        if(roomLeader && roomLeader.userID == chara.userID){
            return true;
        }
        return false;
    }
}

exports.intoARoom = function(chara,room){
    var roomInitInfo = room.getRoomInitInfo();
    roomInitInfo['yourInfo'] = {
        yourID:chara.userID
    }

    var userType;
    if(room.roomLeader.userID ==chara.userID){
        userType = "leader";
    }else{
        userType = "normalMem";
    }
    roomInitInfo['userType'] = userType;
    chara.socket.emit('initARoom',roomInitInfo);
}

exports.kickUserOutRoom = function(chara){
    var room = chara.room;
    if(!room){
        return 0;
    }
    var removeResult = room.removeChara(chara);
    if(removeResult){
        roomMethod.roomRefresh(room);
    }

    var socket = chara.socket;
    socket.emit("getOutTheRoom");
}

exports.askForJoinTheRoom = function(room,chara){
    var curMemNum = room.roomMem.length;
    var maxMemNum = room.maxMemNum;

    if(curMemNum >= maxMemNum){
        return false;
    }

    room.roomMem.push(chara);
    chara.state = "waitingQueue";
    roomMethod.roomRefresh(room);
}

exports.errorHandler = function(errorName){

}















