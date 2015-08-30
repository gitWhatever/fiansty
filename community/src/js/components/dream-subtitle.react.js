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

var DreamSubtitle = React.createClass({

  contextTypes: {
    router : React.PropTypes.func
  },

  /**
   * @desc 状态机初态
   * @property initState
   */
  getInitialState: function () {
    return {
      items : null,
      interval : null,
      barrageQueue : [],
      isown : 0 //0-暂未知 1-自己 2-其他人
    }
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

    this._getInfo()
      .then(this._isMe)
      .then(this._getSubjects)
    .then(this._playBarrages);
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
          o.event.on(o.g('d_index'), 'click', function () {
            location.hash = '#/hash';
          }.bind(this));
        }
        deferred.resolve();
      }.bind(this)
    });

    return deferred.promise;
  },

  _getInfo : function () {
    var deferred = q.defer();

    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/getUserIndex?uid=' + this.context.router.getCurrentParams().uid,
      jsonp: '_jp',
      data: {},
      success: function (data) {
        console.log(data.data);
        if(data.errno == 0){
          this.props.data = data.data;
          this.props.uid = this.context.router.getCurrentParams().uid;

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

          if(data.data.avatar){
            o.$('img')[0].src = data.data.avatar;
          }
          if(data.data.theme){
            o.$('.dream-cont')[0].style.background = '#ffffff url(' + data.data.theme + ') center center no-repeat';
            o.$('.dream-cont')[0].style.backgroundSize = 'cover';
            action.setTheme(data.data.theme);
          }

          if(data.data.isown){
            this.setState({'isown': 1});
            o.$('.cont-text-wrap')[0].addEventListener('click', function () {
              location.hash = '#/info';
            });
            o.$('.cont-text-wrap')[0].className += ' own';
            o.$('#z_index')[0].addEventListener('click', function () {
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

          deferred.resolve();
        }else{
          deferred.reject();
        }
      }.bind(this)
    });

    return deferred.promise;
  },

  _getSubjects : function () {
    var deferred = q.defer();

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
          deferred.resolve();
        }else{
          deferred.reject();
        }
      }.bind(this)
    });
    return deferred.promise;
  },

  _checkOverlay : function (left, top) {
    var queue = this.state.barrageQueue;
    for(var i=0;i<queue.length;i++){
      if(Math.abs(queue[i].left-left) < 4 && Math.abs(queue[i].top-top) < 2){
        return false;
      }
    }
    return true;
  },

  _barrage: function (str) {
    var left = Math.random() * 17 + 1;
    var top = Math.random() * 25 + 4;
    while(left>3 && left<15 && top>5 && top<15){
      console.warn("left:"+left+",top:"+top);
      left = Math.random() * 17 + 1;
      top = Math.random() * 25 + 4;
    }
    while(!this._checkOverlay(left, top)){
      left = Math.random() * 17 + 1;
      top = Math.random() * 25 + 4;
    }
    console.log("success:   left:"+left+",top:"+top);
    var style = {
      'position': 'absolute',
      'left': left + 'rem',
      'top': top + 'rem'
    };
    this.state.barrageQueue.push({
      'left' : left,
      'top' : top
    });
    return (
      <div className="dream-barrage" style={style}>{str}</div>
    );
  },

  _playBarrages: function () {
    /*
    *
    * 少年 这里千万别删 以后还要优化算法呢
    *
    * */
    //var i = 0;
    //this.state.interval = setInterval(function () {
    //  i = i<$('.dream-barrage').length? i+1: 0;
    //  $($('.dream-barrage')[i]).fadeToggle('slow');
    //},1000);
    $('.dream-barrage').fadeToggle('slow');
  },

  __dealStrLen : function (str) {
    var buff = 0;
    for(var i=0;i<str.length;i++){
      buff += str.charCodeAt(i);
    }
    if(buff > 40000 && str.length > 4){
      str = str.substr(0,4);
      str += '…';
    }else if(buff < 3000 && str.length > 8){
      str = str.substr(0,8);
      str += '…';
    }
    return str;
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

    var barrages = this.state.items != null? this.state.items.map(function(item, i) {
      var str = item.roomcname;
      return this._barrage(this.__dealStrLen(str));
    }.bind(this)) : null;
    var bgStyle ={'background' : '#ffffff url('+ Store.getThemeSrc() +') center center no-repeat'};

    return (
      <div className="index-container">
        {barrages}
        {btn}
        <div className="dream-music enable-click-ios" onClick={this.play}></div>
        <div className="dream-switch off" id="switch">
          <a href={"#/dream/" + this.context.router.getCurrentParams().uid}></a>
        </div>
        <div className="dream-slide-up">
          <a href={"#/dreamsts/" + this.context.router.getCurrentParams().uid}></a>
        </div>

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
            <p></p>
          </div>
        </div>

      {ownFooter}
      </div>
    );
  }

});

module.exports = DreamSubtitle;