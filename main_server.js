/**
 * Created by wangguowei on 2001/1/11.
 */

var io = require('socket.io')();

var xssEscape = require('xss-escape');
var baPlayer = require('./private/baPlayer');
var roomManager = require('./basicFunc/roomManager');
var userManager = require('./basicFunc/userManager');
var socket_config = require('./private/socket/socket_config');

var rM = new roomManager();
var uM = new userManager();


io.on('connection',function(_socket){
    console.log(_socket.id + ":connected");

    //加载处理函数
    var clientHandle = socket_config.clientHandle();
    for(var i = 0 ; i<clientHandle.length ; i++){
        _socket.on(clientHandle[i].msgName,clientHandle[i].msgFunc);
    }

    _socket.emit('server_message','connect success');
});

exports.listen = function(_server){
    return io.listen(_server);
}