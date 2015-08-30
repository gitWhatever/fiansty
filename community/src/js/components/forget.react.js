/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var assign = require('object-assign');

var TopBar = require('./top-bar.react');
var ForgetStep1 = require('./forget-step1.react');
var ForgetStep2 = require('./forget-step2.react');
var ForgetStep3 = require('./forget-step3.react');

var interfaceAction = require('../actions/interface.action');
var action = require('../actions/community.action');

var fieldValues = {
  step            : 0,
  token           : '',
  errmsg          : '',
  mobile          : '',
  password        : '',
  confirmPassword : '',
  refreshVcode    : false
};

var Forget = React.createClass({
  getInitialState : function () {
    return {
      step : 0
    }
  },

  _saveValues: function(fields) {
    return function() {
      fieldValues = assign({}, fieldValues, fields)
    }()
  },
  _error: function (msg) {
    action.showErrMsg(msg);
  },
  /**
   * @desc 下一步按钮触发的回调函数
   * @property func
   */
  _next: function () {
    if(o.util.trim(fieldValues.mobile) == '') {
      return this._error('请先输入手机号');
    }
    if(o.util.trim(o.$('.passport-common-vcode input')[0].value) == '') {
      return this._error('请输入验证码');
    }
    interfaceAction.askPassword({
      mobile: fieldValues.mobile,
      vcode: o.$('.passport-common-vcode input')[0].value
    }).then(function(response) {
      if(response.errno == 0) {
        this.setState({
          step : 1
        });
        fieldValues.token = response.data.token;
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
    console.log(fieldValues.password);
    if(o.util.trim(fieldValues.password) == '') {
      return this._error('请输入新密码');
    }
    if(o.util.trim(fieldValues.confirmPassword) == '') {
      return this._error('请确认新密码');
    }
    if(o.util.trim(fieldValues.password) != o.util.trim(fieldValues.confirmPassword)) {
      return this._error('两次密码输入不同');
    }
    interfaceAction.aesPassword(fieldValues.password)
      .then(function(word) {
        interfaceAction.resetPassword({
          password: word,
          _t: fieldValues.token
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
  render : function () {
    console.log('render was invoked');
    var step1 = <ForgetStep1 fieldValues={fieldValues} nextStep={this._next} saveValue={this._saveValues} ref="step1" parent={this}/>,
        step2 = <ForgetStep2 fieldValues={fieldValues} nextStep={this._submit} saveValue={this._saveValues} ref="step2"/>,
        step3 = <ForgetStep3/>;
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

module.exports = Forget;