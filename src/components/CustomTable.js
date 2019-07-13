import React from 'react';
import { highlightingClass } from '../constants';

function getClassName(row) {
  return row.hasChanged ? highlightingClass : null;
}

export default class TraceTable extends React.Component {
  constructor(props) {
    super(props);
    this.createRow = this.createRow.bind(this);
    this.tableEndRef = React.createRef();
  }

  createRow(row) {
    let cols = this.props.headers.map(header => (
      <td className={header.header + 'Class'}>{row[header.accessor]}</td>
    ));
    return (
      <tr className={getClassName(row)} onClick={this.props.onClickOfRow.bind(null, row)}>
        {cols}
      </tr>
    );
  };

  createHeader(){
    let cols = this.props.headers.map(header => {
      return (
        <th onClick={this.props.onClickOfHeader} id={header.header}>
          {header.header}
        </th>
      );
    });
    return (
      <thead>
        <tr>{cols}</tr>
      </thead>
    );
  };

  scrollTableToBottom(){
    this.tableEndRef.current.scrollIntoView({behavior: "smooth"});
  }

  componentDidMount(){
    this.scrollTableToBottom();
  }

  componentDidUpdate(){
    this.scrollTableToBottom();
  }

  render() {
    let { rows, className } = this.props;
    const tableRows = rows.map(this.createRow);
    const tableHeaders = this.createHeader();

    return (
      <div className="result-table">
        <table className={className}>
          {tableHeaders}
          <tbody>{tableRows}</tbody>
        </table>
        <div ref={this.tableEndRef}></div>
      </div>
    );
  }
}
