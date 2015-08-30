/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var Input = require('./input.react');
var Submit = require('./submit.react');
var VCode = require('./v-code.react');
var TopBar = require('./top-bar.react');

var interfaceAction = require('../actions/interface.action');
var action = require('../actions/community.action');

var ForgetStep1 = React.createClass({
  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {

    }
  },

  /**
   * @desc 状态机初态 {step:0}-验证手机号 {step:1}-验证密码 {step:2}-修改成功
   * @property initState
   */
  getInitialState: function () {
    return {
      step : 0,
      token : '',
      errmsg : '',
      mobile: '',
      password: '',
      confirmPassword: '',
      refreshVcode: false
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    this.setState({
      refreshVcode: false
    });
  },

  /**
   * @desc 解绑监听，避免内存泄露
   * @property unbind event with react method
   */
  componentWillUnmount: function() {
    this.setState({
      refreshVcode: true
    });
  },

  /**
   * @desc 出现errno时的弹层
   * @property func
   */
  _error: function (msg) {
    action.showErrMsg(msg);
  },

  /**
   * @desc 下一步按钮触发的回调函数
   * @property func
   */
  _next: function () {
    if(o.util.trim(this.state.mobile) == '') {
      return this._error('请先输入手机号');
    }
    if(o.util.trim(o.$('.passport-common-vcode input')[0].value) == '') {
      return this._error('请输入验证码');
    }
    interfaceAction.askPassword({
      mobile: this.state.mobile,
      vcode: o.$('.passport-common-vcode input')[0].value
    }).then(function(response) {
      if(response.errno == 0) {
        this.setState({
          step : 1,
          token : response.data.token
        });
      } else if(response.errmsg) {
        this._error(response.errmsg);
      } else {
        this._error('发生未知错误 请稍后重试');
      }
    }.bind(this));
  },

  /**
   * @desc 提交按钮触发的回调函数
   * @property func
   */
  _submit: function () {
    console.log(this.state.password);
    if(o.util.trim(this.state.password) == '') {
      return this._error('请输入新密码');
    }
    if(o.util.trim(this.state.confirmPassword) == '') {
      return this._error('请确认新密码');
    }
    if(o.util.trim(this.state.password) != o.util.trim(this.state.confirmPassword)) {
      return this._error('两次密码输入不同');
    }
    interfaceAction.aesPassword(this.state.password)
      .then(function(word) {
        interfaceAction.resetPassword({
          password: word,
          _t: this.state.token
        }).then(function(response) {
          if(response.errno == 0) {
            console.log(this);
            this.setState({
              step: 2
            });
            window.setTimeout(function() {
              window.location.hash = '#/login';
            }, 3000);
          } else if(response.errmsg) {
            this._error(response.errmsg);
          } else {
            this._error('发生未知错误 请稍后重试');
          }
        }.bind(this));
      }.bind(this));
  },

  onInputChange: function(e) {
    var obj = {};
    obj[o.dom.data(e.target, 'state')] = e.target.value;
    this.setState(obj);
  },

  /**
   * @return {object}
   */
  render: function() {
    var wrapStyle = {
      'width': '100%'
    };
    var noBottomStyle = {
      'width': '100%',
      'borderBottom': 'none'
    };

    var bottomStlye = {
      'marginBottom': '1rem'
    };
    var step1 = (function() {
      return (
        <div>
          <div className="passport-forget-input-area">
            <div className="passport-common-inputgroup" style={ wrapStyle }>
              <div className={ "passport-common-input-number" } style={ noBottomStyle }>
                <input id="step1-mobile" data-state="mobile" type='number' placeholder='请输入手机号' onChange={ this.onInputChange } />
              </div>
            </div>
          </div>
          <div className="passport-forget-vcode-area">
            <VCode id={ this.state.mobile } pwd={true}/>
          </div>
          <div className="passport-forget-submit-area enable-click" onClick={this._next}>
            <Submit name="下一步" />
          </div>
        </div>
      );
    }.bind(this))();

    var step2 = (function() {
      return (
        <div>
          <div className="passport-forget-input-area" style={ bottomStlye }>
            <div className="passport-forget-diff">
              <div className="passport-common-inputgroup" style={ wrapStyle }>
                <div className={ "passport-common-input-password" } style={ wrapStyle }>
                  <input data-state="password" type='password' placeholder='新密码' onChange={ this.onInputChange } />
                </div>
                <div className={ "passport-common-input-password" } style={ wrapStyle }>
                  <input data-state="confirmPassword" type='password' placeholder='再次输入密码' onChange={ this.onInputChange } />
                </div>
              </div>
            </div>
          </div>
          <div className="passport-forget-submit-area enable-click" onClick={this._submit}>
            <Submit name="提交" />
          </div>
        </div>
      );
    }.bind(this))();

    var step3 = (function() {
      return (
        <div className="passport-forget">
          <TopBar title='重置密码' backUrl='login' />
          <div className="passport-success">
            <h2>恭喜您，密码重置成功！</h2>
            <div className="passport-success-text">
              <p>3秒后自动跳转到登陆页面</p>
              <p>如果页面未自动跳转，请点击<a href="#/login">手动跳转</a></p></div>
          </div>
        </div>
      );
    }.bind(this))();

    var elList = [step1, step2, step3];
    return (
      <div>
        <div className="passport-forget">
          <TopBar title='找回密码' backUrl='#login'/>
          {elList[this.state.step]}
        </div>
      </div>
    );
  }
});

module.exports = ForgetStep1;