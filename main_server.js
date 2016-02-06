/**
 * Created by wangguowei on 2001/1/11.
 */

var io = require('socket.io')();

var xssEscape = require('xss-escape');
var config = require('./private/config');
var baPlayer = require('./private/baPlayer');
var roomManager = require('./basicFunc/roomManager');
var userManager = require('./basicFunc/userManager');

var uM = new userManager();
var rM = new roomManager();

io.on('connection',function(_socket){
    console.log(_socket.id + ":connected");
    _socket.emit('server_message','connect success');

    _socket.on('disconnect',function(){
        console.log(_socket.id + ":disconnected");
    });

    _socket.on('basicConnect',function(cd){
        console.log(cd.userName + " get In");

        var userName = cd.userName;
        var userID = uM.getIdForNewUser();
        var chara = new baPlayer(userName,userID,_socket);
        var clientList = uM.getUserList();
        clientList.push(chara);
        _socket.emit('basicConnectReturn','ok');
        rM.clientRoomInfoInitialize(chara);
    });

    _socket.on('createNewRoom', function (roomInfo) {
        console.log("createNewRoom");

        var chara = uM.getUserBySocketId(_socket.id);
        if(!chara){
            return 0;
        }

        var room = rM.addRoom(roomInfo,chara);
        uM.intoARoom(chara,room);
    });

    _socket.on('askGetIntoRoom', function (roomID) {
        console.log("ask get into room");

        var chara = uM.getUserBySocketId(_socket.id);
        if(!chara){
            throw new Error("can't find a user id like this");
        }
        uM.kickUserOutRoom(chara);
        var room = rM.getRoomById(roomID);
        if(!room){
            return 0;
        }
        uM.joinTheRoom(chara,room);
    });

    _socket.on('startGame',function(){
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