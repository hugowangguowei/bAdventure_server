/**
 * Created by wangguowei on 2001/1/11.
 */

module.exports = baPlayer;

function baPlayer(userName,id,socket){

    this.userName = userName;
    this.userID = id;
    this.level = 0;
    this.state = "mainTable";
    this.socket = socket;
    this.room = null;
}

baPlayer.prototype = {
    getPlayerInfo:function(){
        return {
            name:this.userName,
            serverId:this.userID,
            level:this.level
        }
    },
    /**
     * �ж��Ƿ��Ƿ�������
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
    }
}