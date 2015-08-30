var React = require('react');

var InputGroup = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      options: [],
      wrapStyle: null,
      itemStyle: null
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    var inputList = this.props.options.map(function(item, index) {
      if(item.type == 'number'){
        return (
          <div key={ index } className={ "passport-common-input-" + item.name } style={this.props.itemStyle}>
            <input type={ item.type } placeholder={ item.holder } id="mobile" />
          </div>
        );
      }
      return (
        <div key={ index } className={ "passport-common-input-" + item.name } style={this.props.itemStyle}>
          <input type={ item.type } placeholder={ item.holder } />
        </div>
      );

    }.bind(this));
    return (
      <div className="passport-common-inputgroup" style={this.props.wrapStyle}>
      { inputList }
      </div>
    );
  }

});

module.exports = InputGroup;