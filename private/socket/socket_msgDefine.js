/**
 * Created by wgw on 2016/3/1.
 */

/**
 * �ͻ��˷�����Ϣ����
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
 * ����˷�����Ϣ����
 * @constructor
 */
var SMT = {
    SYSTEM_INFORM : "system_inform",
    BASIC_CONNECT_RETURN : "basicConnectReturn",
    ROOM_LIST_REFRESH : 'roomListRefresh',
    //���뷿��
    INTO_A_ROOM : 'intoARoom',
    //�ͻ��˷�����Ϣ��ʼ��
    CLIENT_ROOM_INFO_INITIALIZE : 'clientRoomInfoInitialize',
    //�뿪�ȴ�����
    GET_OUT_THE_QUEUE : 'getOutTheQueue',
    //�뿪��Ϸ
    GET_OUT_THE_GAME: 'getOutTheGame',
    //��ʼ��Ϸ
    START_GAME : 'startGame',
    //�û��ύ����Ϣ�ַ�
    CLIENT_MSG_DISTRIBUTE:'clientMsgDistribute',
    //��ǰ�ķ��䱻ɾ��
    ROOM_DELETE:'roomDelete'
}
exports.SERVER_MSG_TYPE = SMT;