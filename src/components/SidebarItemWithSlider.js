import React, { Component } from 'react';

class SidebarItemWithSlider extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (<div>
    <span style={{ fontSize: '16px' }}>
      {this.props.title}
    </span>
      <input
        style={{ width: '70%', position: 'relative', left: '15%' }}
        type="range"
        min={this.props.min}
        max={this.props.max}
        ref={this.props.sliderRef}
      />
  </div>)
  }
}

export default SidebarItemWithSlider;