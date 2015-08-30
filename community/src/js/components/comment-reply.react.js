/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var q = require('q');

var Router = require('react-router');
var Link = Router.Link;

var action = require('../actions/community.action');
var Store = require('../store/community.store');

var TopBar = require('./top-bar.react');

var CommentReply = React.createClass({

  componentWillMount: function () {
    this.__storeUid()
      .then(this.__storeUserInfo);
  },

  __storeUid : function () {
    var deferred = q.defer();

    var url = location.host;
    url = url.replace('renzhenge.', 'u.renzhenge.');
    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/auth',
      jsonp: '_jp',
      success: function (data) {
        if (data.errno == 0) {
          action.changeUid(data.data.rid);
          deferred.resolve();
        }else if (data.errno == 1) {
          alert(data.errmsg+' ,请重新登陆');
          location.hash = '#/login';
          deferred.reject();
        }
      }
    });

    return deferred.promise;
  },

  __storeUserInfo : function () {
    var url = location.host;
    url = url.replace('renzhenge.', 'api.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/getUserIndex?uid=' + Store.getUid(),
      jsonp: '_jp',
      success: function (data) {
        if (data.errno == 0) {
          action.uploadUserInfo(data);
          console.log('预先用户信息获取成功：');
          console.log(data);
        }else{
          alert(data.errmsg);
        }
      }
    });
  },

  contextTypes: {
    router : React.PropTypes.func
  },
  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    $('textarea').attr({'maxlength':'80'});
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    var sid = this.context.router.getCurrentParams().sid;

    o.$('.comment-send a')[0].addEventListener('click', function () {
      o.ajax.ajaxJSONP({
        url: 'http://' + url + '/subjectact/addcomment?sid=' + sid + '&content=' + o.$('.comment-textarea textarea')[0].value,
        jsonp: '_jp',
        data: {},
        success: function (data) {
          console.log(data);
          if(data.errno == 0){
            var user = Store.getUserInfo().data;
            var tempData = [{
              sid : sid,
              authorname : user.nickName,
              authorimg : user.avatar,
              content : o.$('.comment-textarea textarea')[0].value,
              ctime : this._getTime()
            }];
            action.addReplyArr(tempData);
            location.hash = '#/commentreplylist/' + sid;
          }else{
            alert('发送失败,错误码：'+data.errno.toString());
          }
        }.bind(this)
      });
    }.bind(this));
  },

  _getTime : function () {
    var time = new Date();
    var month =  time.getMonth() + 1,
        day = time.getDay(),
        hour = time.getHours(),
        minute = time.getMinutes(),
        result = '';

    if(month>0 && month<10){
      month = '0' + month.toString();
    }
    if(day>0 && day<10){
      day = '0' + day.toString();
    }
    if(hour>0 && hour<10){
      hour = '0' + hour.toString();
    }
    if(minute>0 && minute<10){
      minute = '0' + minute.toString();
    }

    result = month + '-' + day + ' ' + hour + ':' + minute;
    return result;
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="comment-container">
        <TopBar title='评论回复' backUrl={'#/commentreplylist/' + this.context.router.getCurrentParams().sid}/>
        <div className="comment-send">
          <a>发表</a>
        </div>
        <div className="comment-textarea">
          <textarea autocomplete="off" autocorrect="off" maxlength="80" data-sug="1"></textarea>
        </div>
      </div>
    )
  }
});

module.exports = CommentReply;