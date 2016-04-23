/**
 * Created by wangguowei on 2001/1/11.
 */

module.exports = baRoom;

var userManager = require("./../controller/userManager");
var serverMethod = require("./../method/server_method");
var SMT = require("./../socket/socket_msgDefine").SERVER_MSG_TYPE;
var uM = new userManager();
/**
 * 房间当前的状态
 * @type {{WAITING: string, IN_GAME: string}}
 */
var roomState = {
    WAITING:"waiting",
    IN_GAME:"inGame"
}



function baRoom(roomID,roomName,maxMem,scriptName){
    this.id = roomID;
    this.name = roomName;
    this.maxMemNum = maxMem||2;
    this.scriptName = scriptName;
    this.roomLeader = 0;
    this.roomMem = [];
    this.roomState = roomState.WAITING;
}

baRoom.prototype = {
    addLeader:function(chara){
        this.roomLeader = chara;
        chara.getIntoQueue(this);
    },
    addChara:function(chara){
        var curMemNum = this.roomMem.length;
        var maxMemNum = this.maxMemNum;
        if(curMemNum >= maxMemNum){
            return false;
        }
        this.roomMem.push(chara);
        chara.getIntoQueue(this);
        return true;
    },
    removeChara: function (chara) {
        var self = this;

        for(var i = 0;i<self.roomMem.length;i++){
            var chara_i = self.roomMem[i];
            if(chara_i.userID == chara.userID){
                chara_i.room = 0;
                self.roomMem.splice(i,1);
                return true;
            }
        }

        switch (this.roomState){
            case roomState.WAITING:
                chara.getOutQueue();
                break;
            case roomState.IN_GAME:
                chara.getOutGame();
                break;
        }
    },
    getBriefInfo: function () {
        var roomInfo ={
            roomName:this.name,
            serverID:this.id,
            roomMaxMem:this.maxMemNum,
            roomCurMem:this.roomMem.length,
            roomState:this.roomState
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
    getWaitingQueueInfo:function(){
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
    /**
     * 房间更新
     */
    roomRefresh:function(){
        switch (this.roomState){
            case roomState.WAITING:
                this.roomIntroRefresh();
                this.waitingQueueRefresh();
                break;
            case roomState.IN_GAME:
                break;
        }
    },
    /**
     * 房间简介列表更新
     */
    roomIntroRefresh:function(){
        var info = this.getBriefInfo();
        var objCharaList = uM.getUsersByStateType(["mainTable","waitingQueue"]);
        serverMethod.broadcastToList(objCharaList,SMT.ROOM_LIST_REFRESH,info);
    },
    /**
     * 排队列表更新
     */
    waitingQueueRefresh:function(){
        var roomInitInfo = this.getWaitingQueueInfo();
        var roomLeader = this.roomLeader;
        roomInitInfo['yourInfo'] = {yourID:roomLeader.userID};
        roomInitInfo['userType'] = "leader";
        roomLeader.sendInfo(SMT.WAITING_QUEUE_REFRESH,roomInitInfo);

        var roomMemList = this.roomMem;
        for(var i = 0;i<roomMemList.length;i++){
            var mem_i = roomMemList[i];
            roomInitInfo['yourInfo'] = {yourID:mem_i.userID};
            roomInitInfo['userType'] = "normalMem";
            mem_i.sendInfo(SMT.WAITING_QUEUE_REFRESH,roomInitInfo);
        }
    },
    /**
     * 房间内成员更新
     */
    roomMemRefresh:function(){
        //TODO
    },
    /**
     * 开始游戏
     * @param room
     */
    startGame:function(){
        var self = this;
        self.roomState = roomState.IN_GAME;
        this.roomIntroRefresh();

        var memInfo = _getMemInfo();
        var roomLeader = this.roomLeader;
        roomLeader.sendInfo("startGame",{playerType:"leader",mem:memInfo,script:self.scriptName});
        var roomMemList = this.roomMem;
        for(var i = 0;i<roomMemList.length;i++){
            var mem_i = roomMemList[i];
            mem_i.sendInfo("startGame",{playerType:"normal",mem:memInfo,script:self.scriptName});
        }

        function _getMemInfo(){
            var info = [];
            var roomMemList = self.roomMem;
            for(var i =0;i< roomMemList.length;i++){
                var player_i = roomMemList[i];
                var info_i = player_i.getPlayerInfo();
                info.push(info_i);
            }
            return info;
        }

    },
    /**
     * 房间内信息广播
     * @param msgName
     * @param msg
     */
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