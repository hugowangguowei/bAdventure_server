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
    //系统通知
    SYSTEM_INFORM : "system_inform",
    //基本连接返回值
    BASIC_CONNECT_RETURN : "basicConnectReturn",
    //房间展示列表更新
    ROOM_LIST_REFRESH : 'roomListRefresh',
    //房间成员更新
    WAITING_QUEUE_REFRESH: 'waitingQueueRefresh',
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