import React, { Component } from 'react';
import SidebarItemWithSlider from './SidebarItemWithSlider';

const Sidebar = (props) => {
    const className =
      props.className + (props.isOpened ? '' : ' sidebar-closed');
    return (
      <div className={className} ref={props.sidebarRef}>
        <SidebarItemWithSlider title={"Max Instructions"} min={100} max={100000} sliderRef={props.sliderRef} />
      </div>
    );
}

export default Sidebar;
