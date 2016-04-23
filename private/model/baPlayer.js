/**
 * Created by wangguowei on 2001/1/11.
 */

module.exports = baPlayer;
var SMT = require('./../socket/socket_msgDefine').SERVER_MSG_TYPE;

var playerState = {
    MAIN_TABLE:"mainTable",
    WAITING_QUEUE:"waitingQueue",
    GAME:"game"
}

function baPlayer(userName,id,socket){

    this.userName = userName;
    this.userID = id;
    this.level = 0;
    this.state = playerState.MAIN_TABLE;
    this.socket = socket;
    this.room = null;
}

baPlayer.prototype = {
    /**
     * 获取player信息
     * @returns {{name: *, serverId: *, level: *}}
     */
    getPlayerInfo:function(){
        return {
            name:this.userName,
            serverId:this.userID,
            level:this.level
        }
    },
    /**
     * 判断是否是房间领主
     * @returns {boolean}
     */
    isRoomLeader:function(){
        if(!this.room){
            return false;
        }
        if(this.room.roomLeader.userID == this.userID){
            return true;
        }else{
            return false;
        }
    },
    /**
     * 进入房间等待队列
     * @param detail
     */
    getIntoQueue:function(room){
        this.room = room;
        this.state = playerState.WAITING_QUEUE;
    },
    /**
     * 离开当前的队列
     * @param detail
     */
    getOutQueue:function(detail){
        this.state = playerState.MAIN_TABLE;
        this.sendInfo(SMT.GET_OUT_THE_QUEUE,detail);
    },
    /**
     * 离开当前所在的游戏
     */
    getOutGame:function(detail){
        this.state = playerState.MAIN_TABLE;
        this.sendInfo(SMT.GET_OUT_THE_GAME,detail);
    },
    /**
     * 发送当前房间的消息
     * @param roomInitInfo
     */
    sendCurRoomInfo:function(roomInitInfo){
    },
    /**
     * 发送消息
     * @param msgName
     * @param msg
     */
    sendInfo:function(msgName,msg){
        this.socket.emit(msgName,msg);
    },

}