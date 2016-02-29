/**
 * Created by wangguowei on 2001/1/11.
 */

module.exports = baRoom;

function baRoom(roomID,roomName,maxMem){
    this.id = roomID;
    this.name = roomName;
    this.maxMemNum = maxMem||2;
    this.roomLeader = 0;
    this.roomMem = [];

    this.roomIsReady = true;
}

baRoom.prototype = {
    addLeader:function(chara){
        this.roomLeader = chara;
        chara.room = this;
    },
    addChara:function(chara){
        this.roomMem.push(chara);
        chara.room = this;
    },
    removeChara: function (chara) {
        for(var i = 0;i<this.roomMem.length;i++){
            var chara_i = this.roomMem[i];
            if(chara_i.userID == chara.userID){
                chara_i.room = 0;
                this.roomMem.splice(i,1);
                return true;
            }
        }
        return false;
    },
    getBriefInfo: function () {
        var roomInfo ={
            roomName:this.name,
            serverID:this.id,
            roomMaxMem:this.maxMemNum,
            roomCurMem:this.roomMem.length
        }

        var leaderIntro = {
            leaderName :this.roomLeader.userName
        }

        var memIntro = [];
        for(var i =0;i<this.roomMem.length;i++){
            var memInfo_i;
            var mem = this.roomMem[i];
            memInfo_i = {
                userName:mem.userName,
                level:mem.level
            }
            memIntro.push(memInfo_i);
        }

        return {
            roomInfo:roomInfo,
            leaderIntro:leaderIntro,
            memIntro:memIntro
        }
    },
    getRoomInitInfo:function(){
        var leaderInfo = {
            userName:this.roomLeader.userName,
            level:this.roomLeader.level,
            serverID:this.roomLeader.userID
        }

        var memInfo = [];
        for(var i =0;i<this.roomMem.length;i++){
            var memInfo_i;
            var mem = this.roomMem[i];
            memInfo_i = {
                userName:mem.userName,
                level:mem.level,
                serverID:mem.userID
            }
            memInfo.push(memInfo_i);
        }

        return{
            leaderInfo:leaderInfo,
            memInfo:memInfo
        }
    },
    broadcastMsg:function(msgName,msg){
        var roomLeader = this.roomLeader;
        var rlSocket = roomLeader.socket;
        rlSocket.emit(msgName,msg);

        var roomMemList = this.roomMem;
        for(var i = 0;i<roomMemList.length;i++){
            var mem_i = roomMemList[i];
            var memSocket = mem_i.socket;
            memSocket.emit(msgName,msg);
        }
    }
}