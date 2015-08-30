var React = require('react');

var Input = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      option: null
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    if(this.props.option.type == 'number'){
      return (
        <div className="passport-common-input">
          <input type={ this.props.option.type } placeholder={ this.props.option.holder } id="mobile" />
        </div>
      )
    }
    return (
      <div className="passport-common-input">
        <input type={ this.props.option.type } placeholder={ this.props.option.holder } />
      </div>
    );
  }

});

module.exports = Input;