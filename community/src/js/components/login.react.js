/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var Router = require('react-router');
var Link = Router.Link;

var Submit = require('./submit.react');

var action = require('../actions/community.action');
var interfaceAction = require('../actions/interface.action');

var Login = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      inputOption: [
        {
          'name': 'account',
          'type': 'number',
          'holder': '请输入手机号',
          'id': 'username'
        },
        {
          'name': 'password',
          'type': 'password',
          'holder': '请输入密码',
          'id': 'password'
        }
      ],
      timeout : null
    }
  },

  /**
   * @desc 状态机初态
   * @property initState
   */
  getInitialState: function () {
    return {
      errmsg : '',
      username: '',
      password: ''
    }
  },

  /**
   * @desc 出现errno时的弹层
   * @property func
   */
  _error: function (msg) {
    action.showErrMsg(msg);
  },

  /**
   * @desc 登录
   */
  handleLogin: function () {
    var me = this;
    if(o.util.trim(this.state.username) == ''){
      me._error('用户名不能为空');
      return;
    }
    if(o.util.trim(this.state.password) == ''){
      me._error('密码不能为空');
      return;
    }
    interfaceAction.aesPassword(this.state.password)
      .then(function(data) {
        var obj = {
          username: this.state.username,
          password: data
        };
        interfaceAction.login(obj)
          .then(function(response) {
            if(response.errno == 0){
              console.log('LOGIN SUCCESS!');
              console.log(response.data.rid);
              location.hash = '#/dream/' + response.data.rid;
            }else if(response.errno == 1001){
              me._error('该账号已停用');
            }else if(response.errno == 1010 || response.errno == 1304){
              me._error('该用户名不存在');
            }else if(response.errno == 1105 || response.errno == 1005){
              me._error('帐号和密码不匹配，请重新输入');
            }
          }.bind(this));
      }.bind(this));
  },

  onInputChange: function(e) {
    var obj = {};
    obj[o.dom.data(e.target, 'state')] = e.target.value;
    this.setState(obj);
  },

  back2Index: function() {
    window.location.hash = "#/";
  },

  /**
   * @return {object}
   */
  render: function() {
    var st= {
      'marginTop':'2rem',
      'cursor': 'pointer'
    };
    var inputList = this.props.inputOption.map(function(item, index) {
      return (
        <div key={ index } className={ "passport-common-input-" + item.name }>
          <input data-state={ item.id } type={ item.type } placeholder={ item.holder } onChange={ this.onInputChange } />
        </div>
      );
    }.bind(this));
    return (
      <div className="passport-login">
        <div className="passport-login-back">
          <div className="back enable-click" onClick={ this.back2Index }></div>
        </div>
        <div className="passport-login-title">
          <img src="../../img/passport/title-login.png" />
        </div>
        <div className="passport-content-area">
          <div className="passport-login-input-area">
            <div className="passport-common-inputgroup">
              { inputList }
            </div>
          </div>
          <div onClick={ this.handleLogin } style={st}>
            <Submit name="登录" styleName="passport-login-submit"></Submit>
          </div>
        </div>
        <div className="passport-login-bottom">
          <div className="passport-login-appendix">
            <Link to="forget" >忘记密码</Link>
            <Link to="regist" >注册账号</Link>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Login;