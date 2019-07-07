import React, { Component } from 'react';
import { DUNSTON_FILE_EXTENSION } from '../constants';

class LoadButton extends Component {
  constructor(props) {
    super(props);
    this.fileReader = new FileReader();
    this.fileInputRef = React.createRef();
    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
  }

  handleFileRead(){
    const fileContent = this.fileReader.result;
    this.props.loadCode(fileContent);
  }

  handleFileChosen(e) {
    const file = e.target.files[0];
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsText(file);
  }

  handleLoadClick() {
    this.fileInputRef.current.click();
  }

  render() {
    return (
      <div>
        <input
          type="file"
          style={{ display: 'none' }}
          ref={this.fileInputRef}
          onChange={this.handleFileChosen}
          accept={DUNSTON_FILE_EXTENSION}
        />
        <a className={this.props.className} onClick={this.handleLoadClick}>
          Load
        </a>
      </div>
    );
  }
}

export default LoadButton;
