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

/**
 * 服务端接收消息名称
 * @type {}
 */
var CMT = {
    DISCONNECT:'disconnect',
    BASIC_CONNECT:'basicConnect',
    ASK_GET_INTO_ROOM:'askGetIntoRoom',
    CREATE_NEW_ROOM:'createNewRoom',
    START_GAME:'startGame',
    CLIENT_SUBMIT:'clientSubmit',
    ROLL:'roll'
}
exports.CLIENT_MSG_TYPE = CMT;

/**
 * 服务端发送消息名称
 * @constructor
 */
var SMT = {
    SYSTEM_INFORM : "system_inform",
    BASIC_CONNECT_RETURN : "basicConnectReturn",
    ROOM_LIST_REFRESH : 'roomListRefresh',
    INTO_A_ROOM : 'intoARoom',
    CLIENT_ROOM_INFO_INITIALIZE : 'clientRoomInfoInitialize',
    GET_OUT_THE_ROOM : 'getOutTheRoom',
    START_GAME : 'startGame',
    CLIENT_MSG_DISTRIBUTE:'clientMsgDistribute'
}
exports.SERVER_MSG_TYPE = SMT;

exports.clientHandle = function(){
    return [
        //断开连接
        {msgName:CMT.DISCONNECT,msgFunc:function(){
            console.log(this.id + ":disconnected");
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
                uM.kickUserOutRoom(chara);

                var room = rM.getRoomById(roomID);
                if(uM.joinTheRoom(chara,room)){
                    rM.roomRefresh(room);
                }
            }
        }},
        //请求创建新房间
        {msgName:CMT.CREATE_NEW_ROOM,msgFunc:function (roomInfo) {
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
        //请求开始游戏
        {msgName:CMT.START_GAME,msgFunc:function(){
            console.log("startGame");
            _startGame(this);

            function _startGame(_socket){
                var chara = uM.getUserBySocketId(_socket.id);
                if(!uM.permissionCheck(chara,CMT.START_GAME)){
                    return 0;
                }
                var room = chara.room;
                rM.startGame(room);
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
                console.log(value);
                var room = chara.room;
                console.log(room);
                //TODO :client数据无法提交
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

