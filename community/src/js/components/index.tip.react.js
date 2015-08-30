/**
 * @file 真女郎的列表
 */
var React = require('react');
var Tip = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      text: ''
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="index-common-tip">
          <i></i>{ this.props.text }
      </div>
    );
  }

});

module.exports = Tip;