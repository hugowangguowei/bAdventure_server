/**
 * Created by wgw on 2016/2/5.
 */

var userIdCount = 0;
var userList =[];
var SMT = require('../socket/socket_msgDefine').SERVER_MSG_TYPE;

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
        //TODO:更改设计
        var result = true;

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
}

