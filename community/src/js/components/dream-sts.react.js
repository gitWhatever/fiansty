/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var q = require('q');

var Router = require('react-router');
var Link = Router.Link;

var Store = require('../store/community.store');
var action = require('../actions/community.action');

var DreamSts = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      barrage: null,
      prevY: 0,
      isown: 0 //0-暂未知 1-自己 2-其他人
    };
  },

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function () {
    return {
      data: {}
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function () {
    if(this.context.router.getCurrentParams().uid == 0){
      location.hash = '#/';
      return;
    }

    var userInfo = Store.getUserInfo();
    if(userInfo != null){
      this.props.data = userInfo.data;
      this._renderUserInfo();
    }

    var url = location.host;
    url = url.replace('renzhenge.', 'api.renzhenge.');

    this._getUserInfo(url)
      .then(this._isMe)
      .then(this._renderUserInfo)
      .then(this._renderBarrageInfo);
    this._slideToggle();

  },

  _isMe: function () {
    var deferred = q.defer();

    var url = location.host;
    url = url.replace('renzhenge.', 'u.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/auth',
      jsonp: '_jp',
      success: function (data) {
        console.log(data.data);
        if (data.errno == 0) {
          this.props.uid = data.data.rid;
          action.changeUid(data.data.rid);
        }else if (data.errno == 1) {
          this.setState({'isown': 2});
          $('.index-container').on('click', '#d_index', function () {
            location.hash = '#/login';
          }.bind(this));
        }
        deferred.resolve();
      }.bind(this)
    });

    return deferred.promise;
  },

  _getUserInfo: function (url) {
    var deferred = q.defer();

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/getUserIndex?uid=' + this.context.router.getCurrentParams().uid,
      jsonp: '_jp',
      data: {},
      success: function (data) {
        console.log(data.data);
        if (data.errno == 0) {
          action.uploadUserInfo(data);
          this.props.data = data.data;
          deferred.resolve();
        } else {
          deferred.reject();
        }
      }.bind(this)
    });

    return deferred.promise;
  },

  _renderUserInfo: function () {
    var deferred = q.defer();

    o.$('.cont-text-wrap h2 span')[0].innerHTML = this.props.data.nickName || this.props.data.userName;
    o.$('.cont-text-wrap h3 span')[0].innerHTML = this.props.data.gender || '';
    if (this.props.data.age) {
      o.$('.cont-text-wrap h3 span')[1].innerHTML = this.props.data.age + '岁';
    }

    if(this.props.data.nickName.length >4){
      o.$('.comment-name')[0].innerHTML = this.props.data.nickName.substr(0,4) + '…';
    }else{
      o.$('.comment-name')[0].innerHTML = this.props.data.nickName || '-';
    }

    if (this.props.data.district && this.props.data.constellation) {
      o.$('.comment-info')[0].innerHTML = this.props.data.district + '，' + this.props.data.constellation;
    }

    if (this.props.data.theme) {
      o.$('.dream-cont')[0].style.background = '#ffffff url(' + this.props.data.theme + ') center center no-repeat';
      o.$('.dream-cont')[0].style.backgroundSize = 'cover';
      action.setTheme(this.props.data.theme);
    }
    if (this.props.data.avatar) {
      o.$('img')[0].src = this.props.data.avatar;
    }
    o.$('.comment-mark')[0].addEventListener('click', function () {
      location.hash = '#/commentlist/' + this.props.data.rid;
    }.bind(this));

    this.props.uid = Store.getUid();
    var index = $('.index-container');
    if (this.props.uid == this.context.router.getCurrentParams().uid) {
      this.setState({'isown': 1});
      index.on('click', '#z_index', function () {
        location.hash = '#/';
      });
      index.on('click', '.comment-user', function () {
        location.hash = '#/info';
      });
      index.on('click', '.btn-editable', function () {
        location.hash = '#/info';
      });
      index.on('click', '.dream-share', function () {
        action.toggleLayer(true);
      });
      $('.dream-layer').click( function () {
        action.toggleLayer(false);
      });
    }else{
      this.setState({'isown': 2});
      index.on('click', '.dream-back', function () {
        location.hash = '#/';
      });
      index.on('click', '#f_index', function () {
        action.toggleLayer(true);
      });
      $('.dream-layer').click( function () {
        action.toggleLayer(false);
      });
      index.on('click', '#d_index', function () {
        location.hash = '#/commentlist/' + this.context.router.getCurrentParams().uid;
      }.bind(this));
    }

    deferred.resolve();

    return deferred.promise;
  },

  _renderBarrageInfo: function () {
    var url = location.host;
    url = url.replace('renzhenge.', 'api.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/subjectact/getSubjectByUid?uid=' + this.context.router.getCurrentParams().uid + '&page=0',
      jsonp: '_jp',
      data: {},
      success: function (data) {
        console.log(data);
        if (data.data[0].lastuser == '') {
          data.data[0].lastuser = '-';
        }
        o.$('.comment-title')[1].innerHTML = '弹幕评论(' + data.data.length + ')';
        o.$('.comment-item')[0].innerHTML = data.data[0].roomcname;
        var nickname = '-';
        if(data.data[0].lastuser.nickName != undefined){
          nickname = data.data[0].lastuser.nickName;
        }
        if(nickname.length > 4){
          nickname = nickname.substr(0,4) + '…';
        }
        o.$('.comment-author')[0].innerHTML = nickname + ' &nbsp;&nbsp; ' + data.data[0].showtime + ' &nbsp;&nbsp; 回复：' + data.data[0].count;
      }.bind(this)
    });
  },

  _slideToggle : function () {
    var commentBox = $('.dream-comment');
    var boundaryTop = commentBox.offset().top;
    o.event.on(o.g('slide'), 'touchstart', function (evt) {
      this.props.prevY = evt.changedTouches[0].pageY;
    }.bind(this));
    o.event.on(o.g('slide'), 'touchmove', function (evt) {
      var curY = evt.changedTouches[0].pageY;
      if (curY > boundaryTop) {
        commentBox.css({
          'bottom': '-' + (curY - boundaryTop) + 'px'
        });
      }
    }.bind(this));
    o.event.on(o.g('slide'), 'touchend touchcancel', function (evt) {
      if (evt.changedTouches[0].pageY > this.props.prevY) {
        commentBox.animate(
          {'bottom': '-' + commentBox.height() + 'px'},
          200,
          function () {
            $('#slide').addClass('dream-slide-up').removeClass('dream-slide-down');
            location.hash = "#/dream/" + this.context.router.getCurrentParams().uid;
          }.bind(this)
        );
      } else {
        commentBox.animate(
          {'bottom': '0px'},
          200,
          function () {
            $('#slide').addClass('dream-slide-down').removeClass('dream-slide-up');
          }
        );
      }
    }.bind(this));
  },

  /*
   * 播放背景音乐
   * */
  play : function () {
    var isPlay = Store.getMusicIsPlay();
    if(isPlay == false){
      o.$('audio')[0].play();
      action.toggleMusic(true);
    }else{
      o.$('audio')[0].pause();
      action.toggleMusic(false);
    }
  },

  /**
   * @return {object}
   */
  render: function () {
    var edit = null,
      arrow = null,
      ownFooter = null,
      btn = null;
    if(this.state.isown === 0){
      edit = null;
      arrow = null;
      btn = null;
    }else if(this.state.isown === 1){
      edit =  <div className="btn-editable"></div>;
      arrow = <div className="comment-arrow"></div>;
      ownFooter = (
        <div className="index-footer">
          <div className="footer-btn" id="z_index">
            <i></i>
            <p>真女孩</p>
          </div>
          <div className="footer-btn cur" id="s_index">
            <i></i>
            <p>我的梦想</p>
          </div>
        </div>
      );
      btn = <div className="dream-share"></div>;
    }else if(this.state.isown === 2){
      edit = null;
      arrow = null;
      ownFooter = (
        <div className="index-footer">
          <div className="footer-btn" id="f_index">
            <i></i>
            <p>分享</p>
          </div>
          <div className="footer-btn" id="d_index">
            <i></i>
            <p>发弹幕</p>
          </div>
        </div>
      );
      btn = <div className="dream-back"></div>;
    }

    var bgStyle ={'background' : '#ffffff url('+ Store.getThemeSrc() +') center center no-repeat'};
    return (
      <div className="index-container">
        {btn}
        <div className="dream-music enable-click-ios" onClick={this.play}></div>
        <div className="touch-area" id='slide'></div>

        <div className="dream-cont" style={bgStyle}>
          <div className="cont-photo-wrap">
            <div className="cont-photo-inner-wrap">
              <img src="../../../img/community/pic-person.png" align="center" />
            </div>
          </div>
          <div className="cont-text-wrap">
            <h2>
              <span></span>
            </h2>
            <h3>
              <span></span>
            &nbsp;
              <span></span>
            </h3>
            { edit }
          </div>
          <div className="dream-comment">
            <div className="dream-slide-down">
              <a></a>
            </div>
            <div className="comment-user">
              <div className="comment-title">账号信息</div>
              <div className="comment-name"></div>
              <div className="comment-info"></div>
            { arrow }
            </div>
            <div className="comment-mark">
              <div className="comment-title">弹幕评论(0条)</div>
              <div className="comment-item"></div>
              <div className="comment-author"></div>
              <div className="comment-arrow"></div>
            </div>
          </div>
        </div>

      {ownFooter}

      </div>
    );
  }

});

module.exports = DreamSts;