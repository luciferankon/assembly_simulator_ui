import React, { Component } from 'react';

import '../css/app.scss';
import { DUNSTON_FILE_EXTENSION } from '../constants';

export default class SaveDialogueBox extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { fileName: '' };
    this.updateInputValue = this.updateInputValue.bind(this);
    this.getDisplay = this.getDisplay.bind(this);
  }

  render() {
    return (
      <div className="save-code-overlay" style={{ display: this.getDisplay() }}>
        <button
          className="save-button save-dialogue-box-close-button"
          onClick={this.props.toggleDisplay}
        >
          x
        </button>
        <input
          className="filename-input"
          value={this.state.fileName}
          onChange={this.updateInputValue}
        />
        <a
          className="link-action"
          download={this.state.fileName + DUNSTON_FILE_EXTENSION}
          href={'data:text/plain,' + this.props.editor}
          onClick={this.props.toggleDisplay}
        >
          Save
        </a>
      </div>
    );
  }

  getDisplay() {
    return this.props.display ? 'flex' : 'none';
  }

  updateInputValue(evt) {
    this.setState({
      fileName: evt.target.value
    });
  }
}
