/**
 * @file 真女郎的列表
 */
var React = require('react');
var TestList2 = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      data: {}
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>test-list-2.react</div>
    );
  }

});

module.exports = TestList2;