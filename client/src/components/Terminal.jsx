import React, { Component } from 'react';
import css from '../styles.css';
import TextareaAutosize from "react-textarea-autosize";

export default class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.commandArray.length !== this.props.commandArray.length) {
      let commandLogContainer = document.getElementsByClassName(css.commandLogContainer)[0];
      if (commandLogContainer.clientHeight + commandLogContainer.scrollTop === commandLogContainer.scrollHeight) {
        // User is scrolled to the bottom of messages, so do autoscroll
        this.setState({
          shouldScroll: true,
          showNewMessageBanner: false
        });
      } else {
        // User is reading old messages above the scroll, so do NOT autoscroll
        this.setState({
          shouldScroll: false,
          showNewMessageBanner: true
        });
        setTimeout(function() {
          this.setState({showNewMessageBanner: false});
        }.bind(this), 2000);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // check to see if there are new messages incoming
      // if there are new messages, and the user is at the bottom of the message log scroll
        // then scroll down to show the message
    if (prevProps.commandArray.length !== this.props.commandArray.length) {
      let commandLogContainer = document.getElementsByClassName(css.commandLogContainer)[0];
      if (this.state.shouldScroll) {
        commandLogContainer.scrollTop = commandLogContainer.scrollHeight;
      }
    }
  }

  render() {
    return (
      <div className={css.terminalContainer}>
        <div className={css.commandLogContainer}>
          {this.props.commandArray.map((command, i) => {
            return (
              <div key={i} className={css.commandInstance}>
                {command.command}
              </div>
            )
          })}
        </div>
        <TextareaAutosize className={css.commandInput} value={this.props.commandInput} onKeyDown={this.props.handleCommands} onChange={this.props.handleCommandChange} />
      </div>
    )
  }
}
