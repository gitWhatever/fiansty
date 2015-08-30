/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var q = require('q');

var InputGroup = require('./input-group.react');
var Submit = require('./submit.react');
var VCode = require('./v-code.react');
var ErrMsg = require('./errmsg.react');
var TopBar = require('./top-bar.react');

var interfaceAction = require('../actions/interface.action');
var action = require('../actions/community.action');

var Regist = React.createClass({

  getInitialState: function() {
    return {
      mobile: '',
      password: '',
      confirmPassword: '',
      errmsg: ''
    };
  },

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
          'holder': '手机号',
          'id': 'mobile'
        },
        {
          'name': 'password',
          'type': 'password',
          'holder': '密码',
          'id': 'password'
        },
        {
          'name': 'confirm-password',
          'type': 'password',
          'holder': '请再次输入密码',
          'id': 'confirmPassword'
        }
      ],
      timeout : null
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    var me = this;
    window.addEventListener('touchstart', function () {
      me.setState({
        errmsg : ''
      });
    });
  },

  /**
   * @desc 解绑监听，避免内存泄露
   * @property unbind event with react method
   */
  componentWillUnmount: function() {
    window.removeEventListener('touchstart');
  },

  /**
   * @desc 出现errno时的弹层
   * @property func
   */
  _error: function (msg) {
    action.showErrMsg(msg);
  },

  _submit: function () {
    if(o.util.trim(this.state.password) != o.util.trim(this.state.confirmPassword)) {
      return this._error('两次密码输入不一致');
    }
    if(o.util.trim(this.state.mobile) == '') {
      return this._error('手机号不能为空');
    }
    if(o.util.trim(this.state.password) == '') {
      return this._error('用户密码不能为空');
    }
    if(o.util.trim(this.state.confirmPassword) == '') {
      return this._error('确认密码不能为空');
    }
    if(o.util.trim(o.$('.passport-common-vcode input')[0].value) == '') {
      return this._error('请输入验证码');
    }
    interfaceAction.aesPassword(this.state.password)
      .then(function(word) {
        interfaceAction.register({
          'mobile': this.state.mobile,
          'password': word,
          'vcode': o.util.trim(o.$('.passport-common-vcode input')[0].value)
        }).then(function(response) {
          if(response.errno == 0){
            alert('注册成功！');
            location.hash = "#/info";
          }else if(response.errmsg){
            this._error(response.errmsg);
          }else {
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
    var st= {
      'cursor': 'pointer'
    };
    var inputList = this.props.inputOption.map(function(item, index) {
      return (
        <div key={ index } className={ "passport-common-input-" + item.name } style={wrapStyle}>
          <input data-state={ item.id } type={ item.type } placeholder={ item.holder } onChange={ this.onInputChange } />
        </div>
      );
    }.bind(this));
    return (
      <div>
        <div className="passport-regist">
          <TopBar title='注册' backUrl='#login'/>
          <div className="passport-regist-input-area">
            <div className="passport-common-inputgroup" style={ wrapStyle }>
              { inputList }
            </div>
          </div>
          <div className="passport-regist-vcode-area">
            <VCode id={ this.state.mobile } />
          </div>
          <div className="passport-regist-submit-area enable-click" onClick={this._submit}>
            <Submit name="提交" />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Regist;
