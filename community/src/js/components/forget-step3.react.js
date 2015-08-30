/**
 * @file 真女郎的列表
 */
var React = require('react');

var Submit = require('./submit.react');

var ForgetStep2 = React.createClass({
  render : function () {
    return (
      <div className="passport-success">
        <h2>恭喜您，密码重置成功！</h2>
        <div className="passport-success-text">
          <p>3秒后自动跳转到登陆页面</p>
          <p>如果页面未自动跳转，请点击<a href="#/login">手动跳转</a></p></div>
      </div>
    );
  }
});

module.exports = ForgetStep2;