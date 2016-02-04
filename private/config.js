/**
 * Created by wangguowei on 2001/1/11.
 */

var charaIDCount = 0;
var roomIDCount = 0;
var roomList = [];
var charaList = [];

exports.getNewCharaID = function(){
    charaIDCount++;
    return "chara_" + charaIDCount;
}

exports.getNewRoomID = function(){
    roomIDCount++;
    return "room_" + roomIDCount;
}

exports.getRoomList = function(){
    return roomList;
}

exports.getRoomById = function(roomId){
    for(var i =0;i<roomList.length;i++){
        var room_i = roomList[i];
        if(room_i.id == roomId){
            return room_i;
        }
    }
    return 0;
}

exports.getCharaList = function(){
    return charaList;
}

exports.getCharaBySocketId = function(socketId){
    var chara;
    for(var i = 0;i<charaList.length;i++){
        chara = charaList[i];
        if(chara.socket.id == socketId){
            return chara;
        }
    }
    return 0;
}

exports.getCharasByState = function(state){
    var chosenChara = [];
    var chara_i;

    if(typeof state == 'string'){
        for(var i =0;i<charaList.length;i++){
            chara_i = charaList[i];
            if(chara_i.state == state){
                chosenChara.push(chara_i);
            }
        }
    }
    else{
        outerLoop:
        for(var i =0;i<charaList.length;i++){
            chara_i = charaList[i];
            innerLoop:
            for(var m = 0;m<state.length;m++){
                if(chara_i.state == state[m]){
                    chosenChara.push(chara_i);
                    break innerLoop;
                }
            }
        }
    }

    return chosenChara;
}