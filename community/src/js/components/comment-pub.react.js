/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var q = require('q');

var action = require('../actions/community.action');
var Store = require('../store/community.store');

var TopBar = require('./top-bar.react');
var Input = require('./input.react');

var CommentPub = React.createClass({
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

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    $('textarea').attr({'maxlength':'100'});
    o.$('.comment-send a')[0].addEventListener('click', function () {
      this._pub();
    }.bind(this));
  },

  _pub : function () {
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/subjectact/add',
      jsonp: '_jp',
      data: {
        'data' : '{"content":"' + encodeURI(o.$('.comment-textarea textarea')[0].value) + '","title":"' + encodeURI(o.$('.passport-common-input input')[0].value) + '"}'
      },
      success: function (data) {
        console.log(data);
        if(data.errno == 0){
          location.hash = '#/commentlist/' + Store.getUid();
        }else{
          alert('发送失败,'+data.errmsg);
        }
      }.bind(this)
    });
  },

  /**
   * @return {object}
   */
  render: function() {
    var option = {
      'type': 'text',
      'holder': '标题（必填）'
    };
    return (
      <div className="comment-container">
        <TopBar title='发表主题' backUrl={'#/commentlist/' + Store.getUid()}/>
        <div className="comment-send">
          <a>发帖</a>
        </div>
        <div className="comment-input-area">
          <Input option={ option } />
        </div>
        <div className="comment-textarea">
          <textarea autocomplete="off" autocorrect="off" maxlength="80" data-sug="1"></textarea>
        </div>
      </div>
    )
  }
});

module.exports = CommentPub;