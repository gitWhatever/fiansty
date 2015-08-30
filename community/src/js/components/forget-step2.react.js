/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var Submit = require('./submit.react');

var ForgetStep2 = React.createClass({
  _submit : function (e) {
    e.preventDefault();
    this.props.nextStep();
  },
  onInputChange: function(e) {
    var obj = {};
    obj[o.dom.data(e.target, 'state')] = e.target.value;
    this.props.saveValue(obj);
  },
  render : function () {
    var wrapStyle = {
      'width': '100%'
    };
    var bottomStlye = {
      'marginBottom': '1rem'
    };
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
  }
});

module.exports = ForgetStep2;