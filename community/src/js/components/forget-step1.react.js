/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var Submit = require('./submit.react');
var VCode = require('./v-code.react');

var ForgetStep1 = React.createClass({
  getInitialState: function() {
    return {
      text: '获取验证码',
      disable: false,
      disableCss: ''
    };
  },
  _next : function (e) {
    e.preventDefault();
    this.props.nextStep();
  },
  onInputChange: function(e) {
    var obj = {};
    obj[o.dom.data(e.target, 'state')] = e.target.value;
    this.setState(obj);
    this.props.saveValue(obj);
  },
  render : function () {
    var wrapStyle = {
      'width': '100%',
      'background' : '#f8f8f8'
    };
    var noBottomStyle = {
      'width': '100%',
      'borderBottom': 'none'
    };
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
  }
});

module.exports = ForgetStep1;