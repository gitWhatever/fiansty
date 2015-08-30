/**
 * @file action驱动数据 数据驱动行为
 */
var dispatcher = require('../dispatcher/community.dispatcher.js');
var constant = require('../constants/community.constants.js');

var CommunityAction = {
  toggleLayer: function(bool) {
    dispatcher.dispatch({
      actionType: constant.TOGGLE_LAYER,
      type: 'visibility',
      value: bool
    });
  },
  toggleMusic: function(bool) {
    dispatcher.dispatch({
      actionType: constant.TOGGLE_MUSIC,
      type: 'music',
      value: bool
    });
  },
  changeUid: function (val) {
    dispatcher.dispatch({
      actionType: constant.CHANGE_UID,
      type: 'uid',
      value: val
    });
  },
  showErrMsg: function(msg) {
    dispatcher.dispatch({
      actionType: constant.CHANGE_ERR_MSG,
      type: 'errmsg',
      value: msg
    });
  },
  setTheme: function(src) {
    dispatcher.dispatch({
      actionType: constant.CHANGE_THEME_SRC,
      type: 'theme',
      value: src
    });
  },
  uploadUserInfo: function (obj) {
    dispatcher.dispatch({
      actionType: constant.CHANGE_USER_INFO,
      type: 'data',
      value: obj
    });
  },
  initReplyArr: function (obj) {
    dispatcher.dispatch({
      actionType: constant.INIT_REPLY_ARR,
      type: 'data',
      value: obj
    });
  },
  addReplyArr: function (obj) {
    dispatcher.dispatch({
      actionType: constant.ADD_REPLY_ARR,
      type: 'data',
      value: obj
    });
  }
};

module.exports = CommunityAction;