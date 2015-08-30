/**
 * @file 个人信息的store
 */

var Dispatcher = require('../dispatcher/community.dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/community.constants.js');
var assign = require('object-assign');

var layerVisibility = false;
var LAYERVISIBILITY_CHANGE = "visibility_change";

var uid = '';
var UID_CHANGE = 'uid_change';

var errMsg = '';
var ERRMSG_CHANGE = 'msg_change';

var themeSrc = 'http://p3.qhimg.com/d/inn/eb8857ee/theme1.jpg';
var THEME_CHANGE = 'theme_change';

var musicIsPlay = false;
var MUSIC_CHANGE = 'music_change';

var userInfo = null;
var USERINFO_CHANGE = 'userinfo_change';

var replyArr = {};
var REPLYARR_CHANGE = 'replyarr_change';

var CommunityStore = assign({}, EventEmitter.prototype, {

  /**
   * @desc 获取弹层可见性
   */
  getLayerVisibility: function() {
    return layerVisibility;
  },

  emitLayerVisibilityChange: function() {
    this.emit(LAYERVISIBILITY_CHANGE);
  },

  addLayerListener: function(callback) {
    this.on(LAYERVISIBILITY_CHANGE, callback);
  },

  removeLayerEventListener: function(callback) {
    this.removeListener(LAYERVISIBILITY_CHANGE, callback);
  },

  /**
   * @desc 获取背景音乐播放状态
   */
  getMusicIsPlay: function() {
    return musicIsPlay;
  },

  emitMusicIsPlayChange: function() {
    this.emit(MUSIC_CHANGE);
  },

  addMusicListener: function(callback) {
    this.on(MUSIC_CHANGE, callback);
  },

  removeMusicEventListener: function(callback) {
    this.removeListener(MUSIC_CHANGE, callback);
  },

  /**
   * @desc 获取当前用户的uid
   */
  getUid: function () {
    return uid;
  },

  emitUidChange: function () {
    this.emit(UID_CHANGE);
  },

  addUidListener: function (callback) {
    this.on(UID_CHANGE, callback);
  },

  removeUidEventListener: function (callback) {
    this.removeListener(UID_CHANGE, callback)
  },

  /**
   * @desc 获取错误信息
   */

  getErrMsg: function() {
    return errMsg;
  },

  emitErrMsgChange: function() {
    this.emit(ERRMSG_CHANGE);
  },

  addMsgListener: function(callback) {
    this.on(ERRMSG_CHANGE, callback);
  },

  removeMsgEventListener: function(callback) {
    this.removeListener(ERRMSG_CHANGE, callback);
  },

  /**
   * @desc 获取主题图片地址
   */

  getThemeSrc : function () {
    return themeSrc;
  },
  emitThemeSrcChange : function () {
    this.emit(THEME_CHANGE);
  },
  addThemeListener : function (callback) {
    this.on(THEME_CHANGE, callback);
  },
  removeThemeEventListener : function (callback) {
    this.removeListener(THEME_CHANGE, callback)
  },

  /**
   * @desc 获取用户信息
   */
  getUserInfo : function () {
    return userInfo;
  },
  emitUserInfoChange : function () {
    this.emit(USERINFO_CHANGE);
  },
  addUserInfoListener : function (callback) {
    this.on(USERINFO_CHANGE, callback);
  },
  removeUserInfoEventListener : function (callback) {
    this.removeListener(USERINFO_CHANGE, callback)
  },

  /**
   * @desc 获取回复列表
   */
  getReplyArr: function() {
    return replyArr;
  },

  emitReplyArrChange: function() {
    this.emit(REPLYARR_CHANGE);
  },

  addReplyListener: function(callback) {
    this.on(REPLYARR_CHANGE, callback);
  },

  removeReplyEventListener: function(callback) {
    this.removeListener(REPLYARR_CHANGE, callback);
  }

});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.TOGGLE_LAYER:
      var visibility = action.value || '';
      layerVisibility = visibility;
      CommunityStore.emitLayerVisibilityChange();
      break;
    case Constants.TOGGLE_MUSIC:
      var isPlay = action.value || '';
      musicIsPlay = isPlay;
      CommunityStore.emitMusicIsPlayChange();
      break;
    case Constants.CHANGE_UID:
      var userId = action.value || '';
      uid = userId;
      console.log('current uid:'+uid);
      CommunityStore.emitUidChange();
      break;
    case Constants.CHANGE_ERR_MSG:
      var msg = action.value || '';
      errMsg = msg;
      CommunityStore.emitErrMsgChange();
      break;
    case Constants.CHANGE_THEME_SRC:
      var src = action.value || '';
      themeSrc = src;
      CommunityStore.emitThemeSrcChange();
      break;
    case Constants.CHANGE_USER_INFO:
      var user = action.value || '';
      userInfo = user;
      CommunityStore.emitUserInfoChange();
      break;
    case Constants.INIT_REPLY_ARR:
      var arr = action.value || '';
      replyArr[arr.sid] = arr;
      console.log('now the replyArr in store:');
      console.log(replyArr);
      CommunityStore.emitReplyArrChange();
      break;
    case Constants.ADD_REPLY_ARR:
      var newItem = action.value || '';
      var lastItemInArr = replyArr[newItem[0].sid].comments.length-1;
      if(lastItemInArr == -1){
        newItem[0].floor = 1;
      }else{
        newItem[0].floor = replyArr[newItem[0].sid].comments[lastItemInArr][0].floor + 1;
      }
      replyArr[newItem[0].sid].comments.push(newItem);
      replyArr[newItem[0].sid].count++;
      console.log('now the replyArr in store:');
      console.log(replyArr);
      CommunityStore.emitReplyArrChange();
      break;
    default:
      break;
  }
});

module.exports = CommunityStore;