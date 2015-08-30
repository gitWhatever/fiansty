/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var Router = require('react-router');
var Link = Router.Link;

var Store = require('../store/community.store');
var action = require('../actions/community.action');

var Dream = React.createClass({

  contextTypes: {
    router : React.PropTypes.func
  },

  getInitialState: function() {
    return {
      title: '',
      logo: '',
      isown : 0 //0-暂未知 1-自己 2-其他人
    };
  },

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      data: {}
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    if(this.context.router.getCurrentParams().uid == 0){
      location.hash = '#/';
      return;
    }

    this._renderInfo();

    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    this._isMe();
    this._getInfo(url);
    this._slideToggle();
  },

  _isMe: function () {
    var url = location.host;
    url = url.replace('renzhenge.', 'u.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/auth',
      jsonp: '_jp',
      success: function (data) {
        console.log(data.data);
        if (data.errno == 0) {
          console.log(data);

          if (data.data.rid == this.context.router.getCurrentParams().uid) {
            this.setState({'isown': 1});
            action.changeUid(data.data.rid);
            o.$('.cont-text-wrap')[0].addEventListener('click', function () {
              location.hash = '#/info';
            });
            o.$('.cont-text-wrap')[0].className += ' own';
            o.event.on(o.g('z_index'), 'click', function () {
              location.hash = '#/';
            });
            o.event.on(o.$('.dream-share')[0], 'click', function () {
              action.toggleLayer(true);
            });
            o.event.on(o.$('.dream-layer')[0], 'click', function () {
              action.toggleLayer(false);
            });
          }else{
            this.setState({'isown': 2});
            o.event.on(o.$('.dream-back')[0], 'click', function () {
              location.hash = '#/';
            });
            o.event.on(o.g('f_index'), 'click', function () {
              action.toggleLayer(true);
            });
            o.event.on(o.$('.dream-layer')[0], 'click', function () {
              action.toggleLayer(false);
            });
            o.event.on(o.g('d_index'), 'click', function () {
              location.hash = '#/commentlist/' + this.context.router.getCurrentParams().uid;
            }.bind(this));
          }

        }else if (data.errno == 1) {
          this.setState({'isown': 2});
          o.event.on(o.$('.dream-back')[0], 'click', function () {
            location.hash = '#/';
          });
          o.event.on(o.g('f_index'), 'click', function () {
            action.toggleLayer(true);
          });
          o.event.on(o.$('.dream-layer')[0], 'click', function () {
            action.toggleLayer(false);
          });
          o.event.on(o.g('d_index'), 'click', function () {
            location.hash = '#/login';
          }.bind(this));
        }
      }.bind(this)
    });

  },

  _getInfo : function (url) {
    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/getUserIndex?uid=' + this.context.router.getCurrentParams().uid,
      jsonp: '_jp',
      success: function (data) {
        console.log(data);
        if(data.errno == 0){

          action.uploadUserInfo(data);

          if(data.data.story != undefined){
            var str = data.data.story,
              story = '';
            str = str.split('\n');
            for(var i =0;i<str.length && i<5;i++){
              story += str[i] + '<br/>';
            }
            story = story.substr(0,story.length-5);

            o.$('.cont-text-wrap p')[0].innerHTML = story || '';
          }

          o.$('.cont-text-wrap h2 span')[0].innerHTML = data.data.nickName || data.data.userName;
          o.$('.cont-gender-wrap span')[0].innerHTML = data.data.gender || '';
          o.$('.cont-height-wrap span')[0].innerHTML = data.data.height || '';
          o.$('.cont-constellation-wrap span')[0].innerHTML = data.data.constellation || '';
          o.$('.cont-age-wrap span')[0].innerHTML = data.data.age || '';

          if(!data.data.gender){
            o.$('.cont-gender-wrap')[0].style.display = 'none';
          }
          if(!data.data.height){
            o.$('.cont-height-wrap')[0].style.display = 'none';
          }
          if(!data.data.age){
            o.$('.cont-age-wrap')[0].style.display = 'none';
          }
          if(!data.data.constellation){
            o.$('.cont-constellation-wrap')[0].style.display = 'none';
          }

          if(data.data.avatar){
            o.$('img')[0].src = data.data.avatar;
          }
          if(data.data.theme){
            o.$('.dream-cont')[0].style.background = '#ffffff url(' + data.data.theme + ') center center no-repeat';
            o.$('.dream-cont')[0].style.backgroundSize = 'cover';
            action.setTheme(data.data.theme);
          }

        }
      }.bind(this)
    });
  },

  _renderInfo : function () {
    var data = Store.getUserInfo();

    if(data != null){
      o.$('.cont-text-wrap h2 span')[0].innerHTML = data.data.nickName || '';
      o.$('.cont-gender-wrap span')[0].innerHTML = data.data.gender || '';
      o.$('.cont-height-wrap span')[0].innerHTML = data.data.height || '';
      o.$('.cont-constellation-wrap span')[0].innerHTML = data.data.constellation || '';
      o.$('.cont-age-wrap span')[0].innerHTML = data.data.age || '';

      if(data.data.story != undefined){
        var str = data.data.story,
          story = '';
        str = str.split('\n');
        for(var i =0;i<str.length && i<5;i++){
          story += str[i] + '<br/>';
        }
        story = story.substr(0,story.length-5);
        o.$('.cont-text-wrap p')[0].innerHTML = story || '';
      }

      if(!data.data.gender){
        o.$('.cont-gender-wrap')[0].style.display = 'none';
      }
      if(!data.data.height){
        o.$('.cont-height-wrap')[0].style.display = 'none';
      }
      if(!data.data.age){
        o.$('.cont-age-wrap')[0].style.display = 'none';
      }
      if(!data.data.constellation){
        o.$('.cont-constellation-wrap')[0].style.display = 'none';
      }

      if(data.data.avatar){
        o.$('img')[0].src = data.data.avatar;
      }
      if(data.data.theme){
        o.$('.dream-cont')[0].style.background = '#ffffff url(' + data.data.theme + ') center center no-repeat';
        o.$('.dream-cont')[0].style.backgroundSize = 'cover';
        action.setTheme(data.data.theme);
      }
    }
  },

  _slideToggle : function () {
    var commentBox = $('.dream-comment');
    commentBox.css({'bottom' : '-'+commentBox.height()+'px'});
    var boundaryTop = commentBox.offset().top - commentBox.height();
    o.event.on(o.g('slide'), 'touchmove', function (evt) {
      var curY = evt.changedTouches[0].pageY;
      if (curY > boundaryTop) {
        commentBox.css({
          'bottom': '-' + (curY - boundaryTop) + 'px'
        });
      }
    });
    o.event.on(o.g('slide'), 'touchstart', function (evt) {
      this.props.prevY = evt.changedTouches[0].pageY;
    }.bind(this));
    o.event.on(o.g('slide'),'touchend touchcancel',function(evt){
      if (evt.changedTouches[0].pageY < this.props.prevY) {
        commentBox.animate(
          {'bottom': '0px'},
          200,
          function () {
            $('#slide').addClass('dream-slide-down').removeClass('dream-slide-up');
            location.hash = "#/dreamsts/" + this.context.router.getCurrentParams().uid;
          }.bind(this)
        );
      } else {
        commentBox.animate(
          {'bottom': '-' + commentBox.height() + 'px'},
          200,
          function () {
            $('#slide').addClass('dream-slide-up').removeClass('dream-slide-down');
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
  render: function() {
    var ownFooter = null,
      btn = null;
    if (this.state.isown === 0) {
      ownFooter = null;
      btn = null;
    } else if (this.state.isown === 1) {
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

        <div className="dream-switch on" id="switch">
          <a href={"#/dreamsubtitle/" + this.context.router.getCurrentParams().uid}></a>
        </div>

        <div className="dream-cont" style={bgStyle}>
          <div className="cont-photo-wrap">
            <div className="cont-photo-inner-wrap">
              <img src="../../../img/community/pic-person.png" align="center" />
            </div>
          </div>
          <div className="cont-gender-wrap">
            <span></span>
          </div>
          <div className="cont-height-wrap">
            <span></span>
          </div>
          <div className="cont-age-wrap">
            <span></span>
          </div>
          <div className="cont-constellation-wrap">
            <span></span>
          </div>
          <div className="cont-text-wrap">
            <h2>
              <span></span>
            </h2>
            <p></p>
          </div>
          <div className="dream-comment">
            <div className="dream-slide-up">
              <a></a>
            </div>
            <div className="comment-user">
              <div className="comment-title">账号信息</div>
              <div className="comment-name"></div>
              <div className="comment-info"></div>
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

module.exports = Dream;