import React, { Component } from 'react';
import css from '../styles.css';

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
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
        },
        {
          user: 'James',
          content: 'God bless it!'
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
      <div className={css.chatContainer}>
        <div className={css.messageContainer}>
          {this.state.messages.map(message => {
            return (
              <div className={css.messageInstance}>
                <div className={css.messageUsername}>{message.user}</div>
                <div className={css.messageContent}>{message.content}</div>
              </div>
            );
          })}
        </div>
        <div style={{position:'relative'}}>
          <div className={css.messageInputContainer}>
            {/* for future styling:
              https://alistapart.com/article/expanding-text-areas-made-elegant */}
            <input type="text" className={css.messageInput} value={this.state.messageInput} onChange={this.handleChange.bind(this)} onKeyDown={this.handleNewMessage.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }

}
