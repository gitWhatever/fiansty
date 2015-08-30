/**
 * @file 真女郎的列表
 */
var React = require('react');

var Submit = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      name: 'Submit',
      styleName : null
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    if(this.props.styleName){
      return (
        <div className={this.props.styleName}>{ this.props.name }</div>
      );
    }
    return (
      <div className="passport-common-submit">{ this.props.name }</div>
    );
  }

});

module.exports = Submit;