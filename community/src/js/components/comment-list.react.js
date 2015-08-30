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
var CommentItem = require('./comment-item.react');

var CommentList = React.createClass({
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
        }else{
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
          var selfUid = Store.getUid();
          var curUid = this.context.router.getCurrentParams().uid;
          if(selfUid == curUid){
            o.$('.comment-pub')[0].style.display = 'block';
          }
        }else{
          alert(data.errmsg);
        }
      }.bind(this)
    });
  },

  contextTypes: {
    router : React.PropTypes.func
  },

  /**
   * @desc 状态机初态
   * @property initState
   */
  getInitialState: function () {
    return {
      items : null
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function () {
    this.__storeUid()
      .then(this.__storeUserInfo);
    this._getSubjects();
  },



  _getSubjects : function () {
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/subjectact/getSubjectByUid',
      jsonp: '_jp',
      data: {
        'uid' : this.context.router.getCurrentParams().uid,
        'page' : '0'
      },
      success: function (data) {
        console.log(data);
        if(data.errno == 0) {
          this.setState({items : data.data});
        }
      }.bind(this)
    });
  },

  /**
   * @return {object}
   */
  render: function() {
    var items = this.state.items != null? this.state.items.map(function(item, i) {
      var user = '-',
          count = 0;
      if(item.lastuser != ''){
        user = item.lastuser.nickName;
      }
      if(item.count != 0){
        count = item.count;
      }

      var sid = item.roomid;
      if(!$.isEmptyObject(Store.getReplyArr())){
        if(Store.getReplyArr()[sid] != undefined){
          count = Store.getReplyArr()[sid].count;
        }
      }
      return (
        <CommentItem text={item.roomcname} author={user} time={item.showtime} count={count} sid={item.roomid} />
      );
    }.bind(this)) : null;
    var hideStyle = {'display':'none'};
    return (
      <div className="comment-container">
        <TopBar title='弹幕评论' backUrl={'#/dreamsts/' + this.context.router.getCurrentParams().uid} />
        <div className="comment-pub" style={hideStyle}>
          <a href="#/commentpub"></a>
        </div>
        <div className="comment-scroll-wrap">
          {items}
        </div>
      </div>
    )
  }
});

module.exports = CommentList;