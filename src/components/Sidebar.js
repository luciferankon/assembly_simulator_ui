import React, { Component } from 'react';

class Sidebar extends Component {
  render() {
    const className =
      this.props.className + ' ' + (this.props.isOpened ? 'sidebar-opened' : '');
      console.log(this.props.className)
    return <div className={className} />;
  }
}

export default Sidebar;