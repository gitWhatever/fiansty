/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var Tip = require('./index.tip.react');
var IndexSlider = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      data: []
    }
  },

  componentDidUpdate: function() {
    this.refreshSlider();
    console.log(this.props.data);
    for(var i=0;i<this.props.data.length;i++){
      o.$('.octopusui-slider-children')[i].addEventListener('click', function (evt) {
        var i = $(evt.target).parent().parent().index();
        location.hash = '#/dream/' + this.props.data[i].uid;
      }.bind(this))
    }
  },

  refreshSlider: function() {
    var manager = o.widgetManager(document.body);
    manager.init();

    var widgets = manager.getWidgetByClass("octopus.Widget.HtmlSlider");
    o.util.each(widgets, function(item) {
      item.on("slider-item-ontap", function(data) {
        console.log(data);
      })
    });
  },

  /**
   * @return {object}
   */
  render: function() {
    //console.log(this.props.data);
    var UserLists = this.props.data.map(function(item, index) {
      var DistrictTip = item.district ? (<Tip text={item.district} />) : null;
      var HeightTip = item.height ? (<Tip text={item.height + 'cm'} />) : null;
      var AgeTip = item.age ? (<Tip text={item.age + '岁'} />) : null;
      var ConstellationTip = item.constellation ? (<Tip text={item.constellation} />) : null;
      return (
        <div className="index-slider-user-container" key={ index }>
          <img className="octopusui-slider-imgChildren" style={
          {
            maxWidth: '100%',
            maxHeight: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 'auto'
          }
          } src={ item.theme} />
          <div className="octopusui-slider-imgTitle">
            <div className="octopusi-slider-imgTitleContent octopusui-text-limit">{ item.nickName }</div>
          </div>
          <div className="index-slider-tip-top index-slider-tip">
              { DistrictTip }
          </div>
          <div className="index-slider-tip-left index-slider-tip">
              { HeightTip }
          </div>
          <div className="index-slider-tip-right index-slider-tip">
            { AgeTip }
          </div>
          <div className="index-slider-tip-bottom index-slider-tip">
          { ConstellationTip }
          </div>
        </div>
      );
    }.bind(this));
    return (
      <div className="index-content-slider-container">
        <div className="octopusui-container" data-octopusui-type="slider"
          data-octopusui-slider-loop="true" data-octopusui-slider-nobutton="true">
        { UserLists }
        </div>
      </div>
    );
  }

});

module.exports = IndexSlider;