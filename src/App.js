import React, {Component} from 'react';

import {highlightErrorClass, highlightingClass, INITIALCODE, INITIALMESSAGE} from "./constants";

import MessageBox from "./components/MessageBox";
import Machine from '@craftybones/assembly_simulator';
import helpers from "./helpers";
import EditorComp from "./components/EditorComp";
import Prints from "./components/Prints";
import CustomTable from "./components/CustomTable";
import LoadButton from "./components/LoadButton";
import Sidebar from "./components/Sidebar";
import Stack from "./components/Stack";
import SaveCodeDialogueBox from "./components/SaveCodeDialogueBox";



const successStatus = "success";
const errorStatus = "error";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: new Machine(),
      editor: this.getInitialCode(),
      registerTable: [],
      message: INITIALMESSAGE,
      prints: [],
      stack: [],
      isExecutingStepWise: false,
      highlightLine: 0,
      highlightingClass: highlightingClass,
      isSidebarOpen: false,
      codeStatus: successStatus,
      maxLinesToExecute: 100,
      isDialogueVisible : false
    };
    this.executeCode = this.executeCode.bind(this);
    this.executeStepWise = this.executeStepWise.bind(this);
    this.updateRegisterAndStack = this.updateRegisterAndStack.bind(this);
    this.executeNextLine = this.executeNextLine.bind(this);
    this.setError = this.setError.bind(this);
    this.handleCodeEdit = this.handleCodeEdit.bind(this);
    this.showStackForLine = this.showStackForLine.bind(this);
    this.setHasChangedPropertyForChangedRows = this.setHasChangedPropertyForChangedRows.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.saveCurrentCode = this.saveCurrentCode.bind(this);
    this.loadCode = this.loadCode.bind(this);

    this.maxLinesToExecuteSliderRef = React.createRef();
    this.toggleSaveCodeDialogue = this.toggleSaveCodeDialogue.bind(this);
    this.sidbarRef = React.createRef();
  }

  toggleMenu() {
    this.setState({isSidebarOpen: !this.state.isSidebarOpen});
  }

  closeSidebar(event) {
    if (!this.state.isSidebarOpen) return;
    const { target } = event;
    if(this.sidbarRef.current.contains(target)) return;
    this.setState({isSidebarOpen: false});
  }

  render() {
    const sidebarClassName = this.state.isSidebarOpen ? 'active' : '';
    return (
        <div className="app" onClick={this.closeSidebar}>
          <div className="assembly-simulator-container">
            <div className="assembly-simulator-header">
              <div className="header-title-action">
                <span className={`menu ${sidebarClassName}`} onClick={this.toggleMenu}>...</span>
                <span className="title">Assembly Simulator</span>
              </div>
              <div className="save-load-container">
                <button className="save-button" onClick= {this.toggleSaveCodeDialogue} >Save</button>
                <LoadButton className="link-action" loadCode={this.loadCode}/>
              </div>
            </div>
            <div className="code-container">
            <Sidebar sidebarRef={this.sidbarRef} className="sidebar" isOpened={this.state.isSidebarOpen} sliderRef={this.maxLinesToExecuteSliderRef}/>
              <EditorComp initialCode={this.getInitialCode()} highlightLine={this.state.highlightLine}
                          highlightingClass={this.state.highlightingClass} onEdit={this.handleCodeEdit}/>
              <div className="actions">
                <button onClick={this.executeStepWise} disabled={this.state.isExecutingStepWise}>Step Into</button>
                <button onClick={this.executeCode}>Run</button>
                <button onClick={this.executeNextLine} disabled={!this.state.isExecutingStepWise}>Next</button>
              </div>
              <div>
            </div>
              <MessageBox message={this.state.message} className={this.state.codeStatus}/>
            </div>
            <div className="output-container">
              <Prints prints={this.state.prints}/>
            </div>
            <div className="trace-table">
              <CustomTable rows={this.state.registerTable} headers={helpers.getColumns()} className="registerTable"
                           onClickOfHeader={this.setHasChangedPropertyForChangedRows}
                           onClickOfRow={this.showStackForLine}/>
              <Stack stack={this.state.stack}/>
            </div>
            <SaveCodeDialogueBox display={this.state.isDialogueVisible} toggleDisplay={this.toggleSaveCodeDialogue} editor= {this.state.editor}/>
          </div>
        
        </div>
    );
  }

  persistCode(code) {
    let editor = helpers.replaceInString(code, "\n", "{{{{,}}}}");
    editor = helpers.replaceInString(editor, ";", "{{{{:}}}}");
    document.cookie = "assemblyCode=" + editor;
  }

  loadCode(code){
    this.persistCode(code);
    this.handleCodeEdit(code);  
  }

  toggleSaveCodeDialogue(){
    const display = !this.state.isDialogueVisible;
    this.setState({isDialogueVisible : display})
  }

  saveCurrentCode() {
    let editor = this.state.editor;
    this.persistCode(editor);
  }
  
  getInitialCode() {
    window.onbeforeunload = this.saveCurrentCode;
    let cookies = document.cookie.split(';').filter(item => item.includes("assemblyCode"));
    let savedCode = cookies[0];
    if (!savedCode) {
      return INITIALCODE
    }
    savedCode = helpers.replaceInString(savedCode, "assemblyCode=", "");
    savedCode = helpers.replaceInString(savedCode, "{{{{,}}}}", "\n");
    savedCode = helpers.replaceInString(savedCode, "{{{{:}}}}", ";");
    return savedCode || INITIALCODE;
  }

  handleCodeEdit(editor) {
    this.setState({editor});
    this.clearState();
    this.setAsNotExecutingStepWise();
  }

  setHasChangedPropertyForChangedRows(event) {
    this.setState({highlightLine: 0});
    let columnId = event.target.id;
    let registerTable = this.state.registerTable;
    let previousState = (registerTable[0]) ? registerTable[0][columnId] : undefined;
    registerTable.forEach((row, rowIndex) => {
      let onChange = this.setHasChangedAs.bind(this, rowIndex, true);
      let onNotChange = this.setHasChangedAs.bind(this, rowIndex, false);
      let currentState = row[columnId];
      //Think about name for this function : Here you are not only comparing but also executing onChange or onNotChange function
      helpers.compareState(currentState, previousState, onChange, onNotChange);
      previousState = row[columnId];
    });
  }

  setHasChangedAs(rowIndex, state) {
    let registerTable = this.state.registerTable;
    registerTable[rowIndex].hasChanged = state;
    this.setState({registerTable});
  }

  executeCode() {
    let lines = this.state.editor.split(/\n/);
    let numberedCode = lines.map((l, i) => `${(i + 1) * 10} ${l.trim()}`).join("\n");
    let machine = this.state.machine;
    try {
      machine.setMaxLinesToExecute(this.maxLinesToExecuteSliderRef.current.value);
      machine.load(numberedCode);
      machine.execute();
      this.setAsNotExecutingStepWise();
      this.setState({
        registerTable: machine.getTable(),
        prints: machine.getPrn(),
        stack: machine.getStack(),
        message: INITIALMESSAGE,
        highlightingClass: highlightingClass,
        highlightLine: 0
      });
    } catch (e) {
      this.setError(e);
    }
  }

  executeStepWise() {
    let lines = this.state.editor.split(/\n/);
    let numberedCode = lines.map((l, i) => `${(i + 1) * 10} ${l.trim()}`).join("\n");
    let machine = this.state.machine;
    try {
      machine.load(numberedCode);
      machine.executeStepWise(this.updateRegisterAndStack);
      this.clearState();
      this.setAsExecutingStepWise();
    } catch (e) {
      this.setError(e);
    }
  }

  clearState() {
    this.setState({
      registerTable: [], prints: [], stack: [],
      highlightLine: 0, highlightingClass: highlightingClass,
      message: INITIALMESSAGE, codeStatus: successStatus
    })
  }

  executeNextLine() {
    this.state.machine.nextStep();
  }

  setAsNotExecutingStepWise() {
    this.setState({isExecutingStepWise: false})
  }

  setAsExecutingStepWise() {
    this.setState({isExecutingStepWise: true})
  }

  updateRegisterAndStack(state) {
    let {A, B, C, D, EQ, NE, GT, LT, CL, NL, SL, PRN, INST, STK} = state;
    let registerTable = this.state.registerTable;
    let prints = this.state.prints;
    registerTable.push({A, B, C, D, EQ, NE, GT, LT, CL, SL, NL, STK, PRN, INST});
    prints.push(PRN);
    this.setState({registerTable, prints, stack: STK});
  }

  showStackForLine(clickedRow) {
    this.setState({stack: clickedRow.STK});
    let registerTable = this.state.registerTable;
    for (let i = 0; i < registerTable.length; i++) {
      registerTable[i].hasChanged = (registerTable[i] === clickedRow);
    }
    this.setState({registerTable, highlightLine: clickedRow.SL});
  }

  setError(error) {
    let message = `${error} at ${error.lineNumber}`;
    let highlightLine = error.lineNumber;

    if(error.name == "MaxInstructionsExceededException") {
      message = "Potential infinite loop";
      highlightLine = "";
    }

    this.setState({
      message: message,
      highlightLine: highlightLine,
      highlightingClass: highlightErrorClass,
      registerTable: [],
      codeStatus: errorStatus
    })
  }
}

export default App;
