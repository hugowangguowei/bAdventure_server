/**
 * Created by wgw on 2016/3/1.
 */

/**
 * 客户端发送信息名称
 * @constructor
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
    //进入房间
    INTO_A_ROOM : 'intoARoom',
    //客户端房间信息初始化
    CLIENT_ROOM_INFO_INITIALIZE : 'clientRoomInfoInitialize',
    //离开等待队列
    GET_OUT_THE_QUEUE : 'getOutTheQueue',
    //离开游戏
    GET_OUT_THE_GAME: 'getOutTheGame',
    //开始游戏
    START_GAME : 'startGame',
    //用户提交的信息分发
    CLIENT_MSG_DISTRIBUTE:'clientMsgDistribute',
    //当前的房间被删除
    ROOM_DELETE:'roomDelete'
}
exports.SERVER_MSG_TYPE = SMT;