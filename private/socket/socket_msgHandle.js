/**
 * Created by wgw on 2016/2/28.
 */



var baPlayer = require('../baPlayer');
var roomManager = require('../basicFunc/roomManager');
var userManager = require('../basicFunc/userManager');
var CMT = require('./socket_msgDefine').CLIENT_MSG_TYPE;
var SMT = require('./socket_msgDefine').SERVER_MSG_TYPE;

var rM = new roomManager();
var uM = new userManager();

exports.clientHandle = function(){
    return [
        //断开连接
        {msgName:CMT.DISCONNECT,msgFunc:function(){
            console.log(this.id + ":disconnected");
            _disconnect(this);

            function _disconnect(_socket){
                var chara = uM.getUserBySocketId(_socket.id);
                var room = chara.room;
                if(!room){
                    return 0;
                }else{
                    if(chara.isRoomLeader()){
                        rM.deleteRoom(chara.room);
                    }else{
                        //if()
                        //uM.kickUserOutRoom(chara);
                        chara.room.roomRefresh();
                        //rM.roomRefresh(chara.room);
                    }
                }
            };
        }},
        //请求连接服务器
        {msgName:CMT.BASIC_CONNECT,msgFunc:function(cd){
            console.log(cd.userName + " get In");

            _basicConnect(this);
            function _basicConnect(_socket){
                var userName = cd.userName;
                var userID = uM.getIdForNewUser();
                var chara = new baPlayer(userName,userID,_socket);
                var clientList = uM.getUserList();
                clientList.push(chara);
                _socket.emit('basicConnectReturn','ok');
                rM.clientRoomInfoInitialize(chara);
            }
        }},
        //请求进入房间
        {msgName:CMT.ASK_GET_INTO_ROOM,msgFunc:function (roomID) {
            console.log("ask get into room");

            _getIntoRoom(this);
            function _getIntoRoom(_socket){
                var chara = uM.getUserBySocketId(_socket.id);

                var oriRoom = chara.room;
                if(oriRoom){
                    oriRoom.removeChara(chara);
                    rM.roomRefresh(oriRoom);
                }

                var newRoom = rM.getRoomById(roomID);
                //console.log(newRoom);
                if(newRoom.addChara(chara)){
                    //rM.roomRefresh(newRoom);
                    newRoom.roomRefresh();
                }
            }
        }},
        //请求创建新房间
        {msgName:CMT.CREATE_NEW_ROOM,msgFunc:function (roomInfo) {
            console.log("createNewRoom");

            _createNewRoom(this);
            function _createNewRoom(_socket){
                var chara = uM.getUserBySocketId(_socket.id);
                var room = rM.addRoom(roomInfo,chara);
                room.roomRefresh();
            }
        }},
        //请求开始游戏
        {msgName:CMT.START_GAME,msgFunc:function(){
            console.log("startGame");
            _startGame(this);

            function _startGame(_socket){
                var chara = uM.getUserBySocketId(_socket.id);
                if(!uM.permissionCheck(chara,CMT.START_GAME)){
                    return 0;
                }
                chara.room.startGame();
            }
        }},
        //客户端文字输入
        {msgName:CMT.CLIENT_SUBMIT,msgFunc:function(clientSubmit){
            console.log("clientSubmit");
            _clientSubmit(this);

            function _clientSubmit(_socket){
                var chara = uM.getUserBySocketId(_socket.id);
                if(!uM.permissionCheck(chara,CMT.CLIENT_SUBMIT)){
                    return 0;
                }
                var value = chara.userName + ":" + clientSubmit;
                var room = chara.room;
                room.broadcastMsg(SMT.CLIENT_MSG_DISTRIBUTE,value);
            }
        }},
        {msgName:"test",msgFunc:function(msg){
           console.log("test");
        }},
        //客户端ROLL点
        {msgName:CMT.ROLL,msgFunc:function(){

        }}
    ];
}

