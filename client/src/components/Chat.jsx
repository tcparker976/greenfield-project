import React, { Component } from 'react';
import css from '../styles.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    //temporary state for populating dummy message
    this.state = {
      shouldScroll: true
    };
  }

  componentDidMount() {
    // let messageContainer = document.getElementsByClassName(css.messageContainer)[0];
    // console.log(messageContainer);
    // console.log(messageContainer.scrollHeight);
    // messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messageArray.length !== this.props.messageArray.length) {
      let messageContainer = document.getElementsByClassName(css.messageContainer)[0];
      if (messageContainer.clientHeight + messageContainer.scrollTop === messageContainer.scrollHeight) {
        console.log('User is scrolled to the bottom of messages, so do autoscroll');
        this.setState({
          shouldScroll: true
        });
      } else {
        console.log('User is reading old messages above the scroll, so do NOT autoscroll');
        this.setState({
          shouldScroll: false
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.messageArray.length !== this.props.messageArray.length) {
      let messageContainer = document.getElementsByClassName(css.messageContainer)[0];
      // console.log('New Message');
      // console.log('SH:', messageContainer.scrollHeight);
      // console.log('ST:', messageContainer.scrollTop);
      // console.log('CH:', messageContainer.clientHeight);

      if (this.state.shouldScroll) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
  }

  render() {
    return (
      <div className={css.chatContainer}>
        <div className="brett"></div>
        <div className={css.messageContainer}>
          {this.props.messageArray.map(message => {
            return (
              <div className={css.messageInstance}>
                <div className={css.messageUsername}>{message.name}</div>
                <div className={css.messageText}>{message.text}</div>
              </div>
            );
          })}
        </div>
        <div style={{position:'relative'}}>
          <div className={css.messageInputContainer}>
            {/* for future styling:
              https://alistapart.com/article/expanding-text-areas-made-elegant */}
            <input type="text" className={css.messageInput} value={this.props.chatInput} onKeyDown={this.props.handleChatInputSubmit} onChange={this.props.handleChatInputChange}/>
          </div>
        </div>
      </div>
    )
  }

}
