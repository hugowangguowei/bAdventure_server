/**
 * Created by wangguowei on 2001/1/11.
 */

var io = require('socket.io')();

var xssEscape = require('xss-escape');
var baPlayer = require('./private/baPlayer');
var roomManager = require('./basicFunc/roomManager');
var userManager = require('./basicFunc/userManager');

var rM = new roomManager();
var uM = new userManager();


io.on('connection',function(_socket){
    console.log(_socket.id + ":connected");
    _socket.emit('server_message','connect success');

    _socket.on('disconnect',function(){
        console.log(_socket.id + ":disconnected");
    });

    _socket.on('basicConnect',function(cd){
        console.log(cd.userName + " get In");

        _basicConnect();
        function _basicConnect(){
            var userName = cd.userName;
            var userID = uM.getIdForNewUser();
            var chara = new baPlayer(userName,userID,_socket);
            var clientList = uM.getUserList();
            clientList.push(chara);
            _socket.emit('basicConnectReturn','ok');
            rM.clientRoomInfoInitialize(chara);
        }
    });

    _socket.on('createNewRoom', function (roomInfo) {
        console.log("createNewRoom");

        _createNewRoom();
        function _createNewRoom(){
            var chara = uM.getUserBySocketId(_socket.id);
            if(!chara){
                return 0;
            }
            var room = rM.addRoom(roomInfo,chara);
            uM.sendCurRoomInfo(chara,room);
        }
    });

    _socket.on('askGetIntoRoom', function (roomID) {
        console.log("ask get into room");

        _getIntoRoom();
        function _getIntoRoom(){
            var chara = uM.getUserBySocketId(_socket.id);
            uM.kickUserOutRoom(chara);

            var room = rM.getRoomById(roomID);
            if(uM.joinTheRoom(chara,room)){
                rM.roomRefresh(room);
            }
        }
    });

    _socket.on('startGame',function(){
        console.log("startGame");
        _startGame(_socket);

        function _startGame(_socket){
            var chara = uM.getUserBySocketId(_socket.id);
            if(!uM.permissionCheck(chara,"startGame")){
                return 0;
            }
        }
    });
});

exports.listen = function(_server){
    return io.listen(_server);
}