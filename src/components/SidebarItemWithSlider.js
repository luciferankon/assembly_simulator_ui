import React, { Component } from 'react';

class SidebarItemWithSlider extends Component {
  constructor(props) {
    super(props);
    this.state = { sliderValue: 100 };
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  handleSliderChange(event) {
    this.setState({ sliderValue: event.target.value });
  }

  render() {
    return (
      <div>
        <span className="sidebar-item-title">{this.props.title}</span>
        <div className="sidebar-item-slider">
          <input
            type="range"
            min={this.props.min}
            max={this.props.max}
            ref={this.props.sliderRef}
            onChange={this.handleSliderChange}
            onInput={this.handleSliderChange}
          />
          <span>{this.state.sliderValue}</span>
        </div>
      </div>
    );
  }
}

export default SidebarItemWithSlider;
