/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var q = require('q');
var CryptoJS = require('../lib/aes');

var Input = require('./input.react');
var Submit = require('./submit.react');
var TopBar = require('./top-bar.react');

var action = require('../actions/community.action');

var Modify = React.createClass({
  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      aes : ''
    }
  },

  /**
   * @desc 状态机初态
   * @property initState
   */
  getInitialState: function () {
    return {
      errmsg : '',
      timeout : null,
      submitAble : true
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    window.addEventListener('click', function () {
      action.showErrMsg('');
      this.props.submitAble = true;
    }.bind(this));
  },

  /**
   * @desc 出现errno时的弹层
   * @property func
   */
  _error: function (msg) {
    this.props.submitAble = false;
    action.showErrMsg(msg);
    this.props.timeout = setTimeout(function(){
      action.showErrMsg('');
      this.props.submitAble = true;
    }.bind(this),3000);
  },

  _submit : function () {

    if(o.$('input')[1].value != o.$('input')[2].value){
      this._error('两次密码输入不一致');
      return;
    }

    var url = location.host;
    url = url.replace('renzhenge.','u.renzhenge.');

    this._getAesKey(url)
        .then(function(data) {
        this._modifyPwd(url, data)
      }.bind(this));


  },

  _getAesKey : function (url) {
    var deferred = q.defer();
    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/ajax_aeskey',
      jsonp: '_jp',
      success: function (data) {
        if(data.errno == 0){
          console.log('aeskey :'+data.data);
          deferred.resolve(data.data);
        }else{
          console.log('get aeskey failed!');
          deferred.reject();
        }
      }.bind(this)
    });
    return deferred.promise;
  },

  _modifyPwd : function (url, key) {
    console.log("123"+key);
    key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse("995d1b5ebbac3761");
    var encryptedOldPwd = CryptoJS.AES.encrypt(o.$('input')[0].value, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString();
    console.log('encryptedOldPwd: ' + encryptedOldPwd);
    var encryptedNewPwd = CryptoJS.AES.encrypt(o.$('input')[1].value, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString();
    console.log('encryptedNewPwd: ' + encryptedNewPwd);

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/ajax_repass',
      jsonp: '_jp',
      data: {
        oldPassword : encryptedOldPwd,
        newPassword : encryptedNewPwd
      },
      success: function (data) {
        console.log(data.data);
        if(data.errno == 0){
          location.hash = '#/login';
        }else if(data.errno == 1105){
          this._error('旧密码错误');
        }
      }.bind(this)
    });
  },

  /**
   * @return {object}
   */
  render: function() {

    var options = [
      {
        'type': 'password',
        'holder': '旧密码'
      },
      {
        'type': 'password',
        'holder': '新密码'
      },
      {
        'type': 'password',
        'holder': '再次输入密码'
      }
    ];
    return (
      <div>
        <div className="passport-forget">
          <TopBar title='重置密码' backUrl='#/info'/>
          <div className="passport-forget-input-group">
            <div className="passport-forget-input-area">
              <div className="passport-single-input">
                <Input option={ options[0] }/>
              </div>
            </div>
            <div className="passport-forget-input-area">
              <div className="passport-single-input">
                <Input option={ options[1] }/>
              </div>
            </div>
            <div className="passport-forget-input-area">
              <div className="passport-single-input">
                <Input option={ options[2] }/>
              </div>
            </div>
          </div>
          <div className="passport-forget-submit-area enable-click-ios" onClick={this._submit}>
            <Submit name="提交" />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Modify;