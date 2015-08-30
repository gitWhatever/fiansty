/**
 * @file 真女郎的列表
 */
var React = require('react');

var TopBar = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      title : '',
      backUrl : ''
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="passport-common-top-bar">
        <h1>{this.props.title}</h1>
        <div className="back">
          <a href={this.props.backUrl}></a>
        </div>
      </div>
    );
  }
});

module.exports = TopBar;