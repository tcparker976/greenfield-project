import React, { Component } from 'react';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    //temporary state for populating dummy message
    this.state = {
      messageInput : '',
      messages: [
        {
          user: 'Marshall',
          content: 'Whats up James'
        },
        {
          user: 'James',
          content: 'Yo Stouf'
        },
        {
          user: 'Marshall',
          content: 'I couldnt make it to the warthog'
        },
        {
          user: 'James',
          content: 'God bless it!'
        }
      ]
    };
  }

  handleChange(e) {
    this.setState({ messageInput: e.target.value });
  }

  handleNewMessage(e) {
    if (e.keyCode === 13) {
      this.setState({
        messages:this.state.messages.concat({
          user: 'Earl',
          content: this.state.messageInput
        }),
        messageInput: ''
      });
    }
  }

  render() {
    return (
      <div className="chat-container">
        <div className="message-container">
          {this.state.messages.map(message => {
            return (
              <div className="message-instance">
                <div className="message-username">{message.user}</div>
                <div className="message-content">{message.content}</div>
              </div>
            );
          })}
        </div>
        <div style={{position:'relative'}}>
          <div className="message-input-container">
            {/* for future styling:
              https://alistapart.com/article/expanding-text-areas-made-elegant */}
            <input type="text" className="message-input" value={this.state.messageInput} onChange={this.handleChange.bind(this)} onKeyDown={this.handleNewMessage.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }

}
