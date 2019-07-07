import React, { Component } from "react";

import "../css/app.scss";

export default class SaveDialogueBox extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { fileName: "" };
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  render() {
    return (
      <div className="save-code-overlay">
        <input
          className="filename-input"
          value={this.state.fileName}
          onChange={this.updateInputValue}
        />
        <a
          className="link-action"
          download={this.state.fileName + ".txt"}
          href={"data:text/plain," + this.props.editor}
          onClick={this.props.toggleDisplay}
        >
          Save
        </a>
      </div>
    );
  }

  updateInputValue(evt) {
    this.setState({
      fileName: evt.target.value
    });
  }
}
