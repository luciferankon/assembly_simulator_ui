import React, { Component } from 'react';
import SidebarItemWithSlider from './SidebarItemWithSlider';

class Sidebar extends Component {
  render() {
    const className =
      this.props.className + (this.props.isOpened ? '' : ' sidebar-closed');
    return (
      <div className={className}>
        <SidebarItemWithSlider title={"Max Instructions"} min={100} max={10000} sliderRef={this.props.sliderRef} />
      </div>
    );
  }
}

export default Sidebar;
