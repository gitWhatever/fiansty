/**
 * @file 真女郎的列表
 */
var React = require('react');
var FormMixin = require('../mixins/form-mixin');
var action = require('../actions/community.action');
var interfaceAction = require('../actions/interface.action');

var o = require('g-octopus');
var q = require('q');

var VCode = React.createClass({

  //mixins: [FormMixin],

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      data: {},
      id : '',
      interval : null
    }
  },

  getInitialState: function() {
    return {
      text: '获取验证码',
      disable: false,
      disableCss: '',
      phone: '',
      pwd: false,
      refreshVcode: false
    };
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
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    this.setState({
      refreshVcode: false
    });
  },


  /**
   * @desc 出现errno时的弹层
   * @property func
   */
  _error: function (msg) {
    action.showErrMsg(msg);
  },

  requestCode: function(event) {
    if(this.state.disable){
      return;
    }
    if(this.props.id == '') {
      this._error('请先输入手机号');
      return;
    }
    var request = this.props.pwd ? interfaceAction.requestPasswordVCode : interfaceAction.requestRegistVCode;
    request({
      mobile: this.props.id
    }).then(function(response) {
      if(response.errno == '0') {
        this.setState({
          'disable': true,
          'disableCss': 'passport-common-disable-vcode',
          'text' : '60S后重新获取'
        });
        var time = 60;//秒
        var interval = setInterval(function () {
          if(this.state.refreshVcode) {
            clearInterval(interval);
            interval = null;
          }
          time--;
          if(time == 0){
            this.setState({
              'disable': false,
              'disableCss': '',
              'text' : '获取验证码'
            });
            clearInterval(interval);
            return;
          }
          this.setState({
            'text' : time + 'S后重新获取'
          });
        }.bind(this), 1000);
      } else if(response.errmsg) {
        this._error(response.errmsg);
      } else {
        this._error('获取验证码发生未知错误，请稍后重试');
      }
    }.bind(this));
  },

  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="passport-common-vcode">
        <input type="text" placeholder="验证码" />
        <div onClick={ this.requestCode } className={ "enable-click passport-common-request-vcode " + this.state.disableCss }>
        { this.state.text }
        </div>
      </div>
    );
  }

});

module.exports = VCode;
