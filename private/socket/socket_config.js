/**
 * Created by wgw on 2016/2/28.
 */

/**
 * 客户端发送信息名称
 * @constructor
 */

var baPlayer = require('../baPlayer');
var roomManager = require('../../basicFunc/roomManager');
var userManager = require('../../basicFunc/userManager');

var rM = new roomManager();
var uM = new userManager();

var CLIENT_MSG_TYPE = {
    DISCONNECT:'disconnect',
    BASIC_CONNECT:'basicConnect',
    ASK_GET_INTO_ROOM:'askGetIntoRoom',
    CREATE_NEW_ROOM:'createNewRoom',
    START_GAME:'startGame',
    CLIENT_INPUT:'clientInput',
    ROLL:'roll'
}

exports.clientHandle = function(){
    return [
        {msgName:CLIENT_MSG_TYPE.DISCONNECT,msgFunc:function(){
            console.log(this.id + ":disconnected");
        }},
        {msgName:CLIENT_MSG_TYPE.BASIC_CONNECT,msgFunc:function(cd){
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
        {msgName:CLIENT_MSG_TYPE.ASK_GET_INTO_ROOM,msgFunc:function (roomID) {
            console.log("ask get into room");

            _getIntoRoom(this);
            function _getIntoRoom(_socket){
                var chara = uM.getUserBySocketId(_socket.id);
                uM.kickUserOutRoom(chara);

                var room = rM.getRoomById(roomID);
                if(uM.joinTheRoom(chara,room)){
                    rM.roomRefresh(room);
                }
            }
        }},
        {msgName:CLIENT_MSG_TYPE.CREATE_NEW_ROOM,msgFunc:function (roomInfo) {
            console.log("createNewRoom");

            _createNewRoom(this);
            function _createNewRoom(_socket){
                var chara = uM.getUserBySocketId(_socket.id);
                if(!chara){
                    return 0;
                }
                var room = rM.addRoom(roomInfo,chara);
                uM.sendCurRoomInfo(chara,room);
            }
        }},
        {msgName:CLIENT_MSG_TYPE.START_GAME,msgFunc:function(){
            console.log("startGame");
            _startGame(this);

            function _startGame(_socket){
                var chara = uM.getUserBySocketId(_socket.id);
                if(!uM.permissionCheck(chara,"startGame")){
                    return 0;
                }
                var room = chara.room;
                rM.startGame(room);
            }
        }},
        {msgName:CLIENT_MSG_TYPE.CLIENT_INPUT,msgFunc:function(){

        }},
        {msgName:CLIENT_MSG_TYPE.ROLL,msgFunc:function(){

        }}
    ];
}

/**
 * 服务端接收消息名称
 * @constructor
 */
var SERVER_MSG_TYPE = {
    SYSTEM_INFORM : "system_inform",
    BASIC_CONNECT_RETURN : "basicConnectReturn",
    ROOM_LIST_REFRESH : 'roomListRefresh',
    INTO_A_ROOM : 'intoARoom',
    CLIENT_ROOM_INFO_INITIALIZE : 'clientRoomInfoInitialize',
    GET_OUT_THE_ROOM : 'getOutTheRoom',
    START_GAME : 'startGame'
}