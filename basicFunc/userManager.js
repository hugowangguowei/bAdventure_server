/**
 * Created by wgw on 2016/2/5.
 */

var userIdCount = 0;
var userList =[];

module.exports = userManager;

function userManager() {
    this.id = "userManager";
}

userManager.prototype = {
    getIdForNewUser:function(){
        userIdCount++;
        return "user_" + userIdCount;
    },
    getUserList:function(){
        return userList;
    },
    getUserBySocketId:function(socketId){
        var chara;
        for(var i = 0;i<userList.length;i++){
            chara = userList[i];
            if(chara.socket.id == socketId){
                return chara;
            }
        }
        return 0;
    },
    getUsersByStateType:function(state){
        var chosenChara = [];
        var chara_i;

        if(typeof state == 'string'){
            for(var i =0;i<userList.length;i++){
                chara_i = userList[i];
                if(chara_i.state == state){
                    chosenChara.push(chara_i);
                }
            }
        }
        else{
            outerLoop:
            for(var i =0;i<userList.length;i++){
                chara_i = userList[i];
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
    },
    permissionCheck:function(user,action){
        var result = false;
        switch (action){
            case "startGame":
                result = _canStartGame(user);
                break;
        }

        return result;

        function _canStartGame(user){
            if(!user.room){
                return false;
            }
            var room = user.room;
            var roomLeader = room.roomLeader;
            if(roomLeader && roomLeader.userID == user.userID){
                return true;
            }
            return false;
        }
    },

    joinTheRoom:function(user,room){
        if(!user||!room){
            return false;
        }
        var curMemNum = room.roomMem.length;
        var maxMemNum = room.maxMemNum;

        if(curMemNum >= maxMemNum){
            return false;
        }

        room.roomMem.push(user);
        user.state = "waitingQueue";
        return true;
    },
    kickUserOutRoom:function(user){
        if(!user){
            return 0;
        }
        var room = user.room;
        if(!room||!room.id){
            return 0;
        }
        var removeResult = room.removeChara(user);
        if(removeResult){
            //rM.roomRefresh(room);
        }

        var socket = user.socket;
        socket.emit("getOutTheRoom");
    },
    sendCurRoomInfo:function(user,room){
        var roomInitInfo = room.getRoomInitInfo();
        roomInitInfo['yourInfo'] = {
            yourID:user.userID
        }

        var userType;
        if(room.roomLeader.userID ==user.userID){
            userType = "leader";
        }else{
            userType = "normalMem";
        }
        roomInitInfo['userType'] = userType;
        user.socket.emit('intoARoom',roomInitInfo);
    },
}

