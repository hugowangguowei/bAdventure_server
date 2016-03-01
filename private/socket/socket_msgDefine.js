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
    INTO_A_ROOM : 'intoARoom',
    CLIENT_ROOM_INFO_INITIALIZE : 'clientRoomInfoInitialize',
    GET_OUT_THE_ROOM : 'getOutTheRoom',
    START_GAME : 'startGame',
    CLIENT_MSG_DISTRIBUTE:'clientMsgDistribute'
}
exports.SERVER_MSG_TYPE = SMT;