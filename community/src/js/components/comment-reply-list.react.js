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
var CommentReplyItem = require('./comment-reply-item.react');

var CommentReplyList = React.createClass({
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
   * @desc 状态机初态
   * @property initState
   */
  getInitialState: function () {
    return {
      items : null,
      curUid : '0'
    }
  },

  contextTypes: {
    router : React.PropTypes.func
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    var sid = this.context.router.getCurrentParams().sid;

    this._renderFirstFloor(url, sid);
    this._renderItemsFloor(url, sid);

  },

  _renderFirstFloor : function (url, sid) {
    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/subjectact/getSubject',
      jsonp: '_jp',
      data: {
        'sid' : sid
      },
      success: function (data) {
        console.log(data);
        if(data.errno == 0) {
          var info = data.data;
          o.$('.reply-name')[0].innerHTML = info.up.nickName;
          o.$('.reply-pic img')[0].src = info.up.avatar;
          o.$('.reply-info p')[0].innerHTML = '1楼 &nbsp; '+ info.showtime +'&nbsp; 回复';
          o.$('.reply-head-title')[0].innerHTML = info.roomcname;
          o.$('.reply-head-cont')[0].innerHTML = info.descript;

          this.setState({'curUid':info.uid});
        }
      }.bind(this)
    });
  },

  _renderItemsFloor : function (url, sid) {
    if(!$.isEmptyObject(Store.getReplyArr())){
      if(Store.getReplyArr()[sid] != undefined){
        this.setState({items : Store.getReplyArr()[sid].comments});
        o.$('.reply-count')[0].innerHTML = '回复：' + Store.getReplyArr()[sid].count;
        return;
      }
    }

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/subjectact/getCommentList',
      jsonp: '_jp',
      data: {
        'sid' : sid
      },
      success: function (data) {
        console.log(data);
        if(data.errno == 0) {
          this.setState({items : data.data.comments});
          o.$('.reply-count')[0].innerHTML = '回复：' + data.data.count;

          data.data.sid = this.context.router.getCurrentParams().sid;
          action.initReplyArr(data.data);
        }
      }.bind(this)
    });
  },

  /**
   * @return {object}
   */
  render: function() {
    var items = this.state.items != null? this.state.items.map(function(item, i) {
      var author = '-';
      if(item[0].authorname != ''){
        author = item[0].authorname;
      }
      return (
        <CommentReplyItem cont={item[0].content} author={author} time={item[0].ctime} imgSrc={item[0].authorimg} floor={item[0].floor+1 + '楼'} />
      );
    }.bind(this)) : null;
    return (
      <div className="comment-container">
        <TopBar title='评论回复' backUrl={'#/commentlist/' + this.state.curUid} />
        <div className="reply-count">回复：0</div>

        <div className="comment-scroll-wrap">
          <div className="reply-head">
            <div className="reply-author">
              <div className="reply-pic">
                <img src="" align="center" />
              </div>
              <div className="reply-name"></div>
              <div className="reply-info">
                <p>1楼 &nbsp; 3-26 &nbsp; 回复 &nbsp; 10 : 54</p>
              </div>
            </div>
            <div className="reply-btn">
              <a href={"#/commentreply/" + this.context.router.getCurrentParams().sid}>回复</a>
            </div>
            <div className="reply-head-title"></div>
            <div className="reply-head-cont"></div>
          </div>
          {items}
        </div>

      </div>
    )
  }
});

module.exports = CommentReplyList;