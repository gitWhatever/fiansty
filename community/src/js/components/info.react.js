/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var q = require('q');

var TopBar = require('./top-bar.react');

var action = require('../actions/community.action');

var Info = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      data : {}
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    this._getInfo()
      .then(this._renderInfo);

    this._upload();

    this._btnEvent(this.refs.story.getDOMNode(), '#/setstory');
    this._btnEvent(this.refs.nickName.getDOMNode(), '#/setname');
    this._btnEvent(this.refs.gender.getDOMNode(), '#/setgender');
    this._btnEvent(this.refs.age.getDOMNode(), '#/setage');
    this._btnEvent(this.refs.height.getDOMNode(), '#/setheight');
    this._btnEvent(this.refs.district.getDOMNode(), '#/setdistrict');
    this._btnEvent(this.refs.constellation.getDOMNode(), '#/setconstellation');

    var url = location.host;
    url = url.replace('renzhenge.','u.renzhenge.');

    this.refs.logout.getDOMNode().addEventListener('click', function () {
      o.ajax.ajaxJSONP({
        url: 'http://' + url + '/logout',
        jsonp: '_jp',
        dataType : 'json',
        success: function (data) {
          console.log(data);
          if(data.errno == 0){
            location.hash = '#/login';
          }
        }
      });
    });

    this.refs.pwd.getDOMNode().addEventListener('click', function () {
      location.hash = '#/modify'
    });
  },

  _upload : function () {
    var uploader = mobileUploader.initUploader({
      link: '/uploadavatar',
      selector: '.passport-info-img-wrap'
    });
    uploader.on("fileQueued", function () {
      action.showErrMsg('正在上传');
      uploader.upload();
    });
    uploader.on("uploadSuccess", function (file , response) {
      action.showErrMsg('上传成功');
      if(this.props.timeout != null){
        clearTimeout(this.props.timeout);
      }
      this.props.timeout = setTimeout(function(){
        action.showErrMsg('');
      }.bind(this),3000);

      console.log(response);
      if(response.errno == 0){
        this.refs.avatar.getDOMNode().src = response.data;

        var url = location.host;
        url = url.replace('renzhenge.','api.renzhenge.');

        var cont = response.data;

        o.ajax.ajaxJSONP({
          url: 'http://' + url + '/uprofile/edit',
          jsonp: '_jp',
          dataType : 'json',
          data: {
            'data' : '{"avatar":"'+ cont +'"}'
          },
          success: function (data) {
            console.log(data);
            if(data.errno == 0){
              location.hash = '#/info';
            }
          }
        });
      }
    }.bind(this));
  },

  _btnEvent : function (el, hash) {
    el.addEventListener('click', function () {
      location.hash = hash;
    });
  },

  _getInfo : function () {
    var deferred = q.defer();

    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/getProfile',
      jsonp: '_jp',
      data: {},
      success: function (data) {
        console.log(data.data);
        if(data.errno == 0){
          this.props.data = data.data;
          this.setState({'data' : data.data});
          deferred.resolve();
        }
        else{
          deferred.reject();
        }
      }.bind(this)
    });
    return deferred.promise;
  },

  _renderInfo : function () {
    this.refs.story.getDOMNode().innerHTML = this.props.data.story.split('\n')[0] + '…' || '未填写';
    this.refs.avatar.getDOMNode().src = this.props.data.avatar || '未填写';
    this.refs.nickName.getDOMNode().innerHTML = this.props.data.nickName || this.props.data.userName;
    this.refs.gender.getDOMNode().innerHTML = this.props.data.gender || '未填写';
    this.refs.age.getDOMNode().innerHTML = this.props.data.age + '岁' || '未填写';
    this.refs.height.getDOMNode().innerHTML = this.props.data.height + 'cm' || '未填写';
    this.refs.district.getDOMNode().innerHTML = this.props.data.district || '未填写';
    this.refs.constellation.getDOMNode().innerHTML = this.props.data.constellation || '未填写';
  },

  /**
   * @return {object}
   */
  render: function() {
    var backUrl = this.state? '#/dream/' +  this.state.data.rid : '#/dream/0';
    return (
      <div className="passport-info">
        <div className="passport-info-layout">
          <TopBar title='完善资料' backUrl={backUrl} />
          <div className="passport-info-skip">
            <a href={backUrl}>预览</a>
          </div>
          {/*梦想区域 开始*/}
          <div className="passport-info-story-wrap">
            <p>梦想故事</p>
            <div className="passport-info-story-text" id="story" ref="story">（写下你的梦想故事，让更多的人发现你的美）</div>
          </div>
          {/*梦想区域 结束*/}

          {/*头像区域 开始*/}
          <div className="passport-info-img-wrap">
            <h4>头像</h4>
            <img src="../../../img/passport/pic-person.png" align="center" ref="avatar"/>
            <div className="arrow"></div>
          </div>
          {/*头像区域 结束*/}

          {/*资料区域 开始*/}
          <div className="passport-info-list">
            <div className="passport-info-item">
              <p>真实姓名</p>
              <div className="passport-info-item-text">
                <span id="nickName" ref="nickName"></span>
              </div>
              <div className="item-arrow"></div>
            </div>
            <div className="passport-info-item">
              <p>性别</p>
              <div className="passport-info-item-text">
                <span id="gender" ref="gender"></span>
              </div>
              <div className="item-arrow"></div>
            </div>
            <div className="passport-info-item">
              <p>年龄</p>
              <div className="passport-info-item-text">
                <span id="age" ref="age"></span>
              </div>
              <div className="item-arrow"></div>
            </div>
            <div className="passport-info-item">
              <p>身高</p>
              <div className="passport-info-item-text">
                <span id="height" ref="height"></span>
              </div>
              <div className="item-arrow"></div>
            </div>
            <div className="passport-info-item">
              <p>地区</p>
              <div className="passport-info-item-text">
                <span id="district" ref="district"></span>
              </div>
              <div className="item-arrow"></div>
            </div>
            <div className="passport-info-item">
              <p>星座</p>
              <div className="passport-info-item-text">
                <span id="constellation" ref="constellation"></span>
              </div>
              <div className="item-arrow"></div>
            </div>
          </div>
          {/*资料区域 结束*/}

          <div className="passport-info-button-group">
            <div className="btn-pwd">
              <a href="javascript:void(0)" ref="pwd">修改密码</a>
            </div>
            <div className="btn-logout">
              <a href="javascript:void(0)" ref="logout">退出账号</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Info;