/**
 * Created by wangguowei on 2001/1/11.
 */

var io = require('socket.io')();

var xssEscape = require('xss-escape');
var config = require('./private/config');
var baRoom = require('./private/baRoom');
var baPlayer = require('./private/baPlayer');
var roomMethod = require('./private/method/room_method');
var userMethod = require('./private/method/user_method');

io.on('connection',function(_socket){
    console.log(_socket.id + ":connected");
    _socket.emit('server_message','connect success');

    _socket.on('disconnect',function(){
        console.log(_socket.id + ":disconnected");
    });

    _socket.on('basicConnect',function(cd){
        console.log(cd.userName + " get In");

        var userName = cd.userName;
        var userID = config.getNewCharaID();
        var chara = new baPlayer(userName,userID,_socket);
        var clientList = config.getCharaList();
        clientList.push(chara);
        _socket.emit('basicConnectReturn','ok');
        roomMethod.getAllRooms(chara);
    });

    _socket.on('createNewRoom', function (roomInfo) {
        console.log("createNewRoom");
        var chara = config.getCharaBySocketId(_socket.id);
        if(!chara){
            return 0;
        }
        var room = roomMethod.buildNewRoom(roomInfo,chara);
        userMethod.intoARoom(chara,room);
    });

    _socket.on('askGetIntoRoom', function (roomID) {
        console.log("ask get into room");

        var chara = config.getCharaBySocketId(_socket.id);
        if(!chara){
            throw new Error("can't find a user id like this");
        }
        userMethod.kickUserOutRoom(chara);
        var room = config.getRoomById(roomID);
        if(!room){
            return 0;
        }
        userMethod.askForJoinTheRoom(room,chara);
    });

    _socket.on('startGame',function(){
        _startGame(_socket);

        function _startGame(_socket){
            var chara = config.getCharaBySocketId(_socket.id);
            if(!userMethod.permissionCheck(chara,"startGame")){
                return 0;
            }
            var room = chara.room;
            roomMethod.startGame(room);
        }
    });
});

exports.listen = function(_server){
    return io.listen(_server);
}