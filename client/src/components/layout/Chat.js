import React, { Component } from "react";
import Message from "../common/Message";
import { wsEmit, wsReceive } from "../../actions/api";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: "",
      messages: [],
      room: "",
      message: "",
      onlineUsers: []
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    const login = this.props.match.params.username;
    const room = this.props.match.params.roomname;

    this.setState({
      login,
      room
    });

    // Telling server that we're joining current room
    const joinData = {
      login,
      room
    };
    wsEmit("join", joinData);

    // Getting new messages and adding them to state array
    wsReceive("message", msg => {
      let allMessages = this.state.messages;
      allMessages.push(msg);
      this.setState({ messages: allMessages });
    });

    // Receiving array of users that are currently online
    wsReceive("online", msg => {
      this.setState({ onlineUsers: msg });
    });

    // Receiving login of user who left chat and removing him from online users array
    wsReceive("offline", msg => {
      let newOnline = this.state.onlineUsers;
      const index = newOnline.indexOf(msg);
      newOnline.splice(index, 1);
      this.setState({ onlineUsers: newOnline });
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // Send the message if user hit Enter
  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onClick();
    }
  }

  // Formatting and sending new message
  onClick() {
    if (this.state.message !== "") {
      const timesent = this.formatTime();
      const newMessage = {
        room: this.state.room,
        msg: {
          login: this.state.login,
          message: this.state.message,
          timesent
        }
      };
      wsEmit("message", newMessage);
      this.setState({ message: "" });
    }
  }

  // Formating current time into string like HH:MM:SS
  formatTime() {
    const now = new Date();
    let hours = now.getHours();
    if (hours < 10) {
      hours = "0" + String(hours);
    }
    let minutes = now.getMinutes();
    if (minutes < 10) {
      minutes = "0" + String(minutes);
    }
    let seconds = now.getSeconds();
    if (seconds < 10) {
      seconds = "0" + String(seconds);
    }
    return `${hours}:${minutes}:${seconds}`;
  }

  // Selecting link to chat when it's clicked
  selectLink(e) {
    let range = document.createRange();
    range.selectNode(e.target);
    if (range) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(range);
    }
  }

  render() {
    let linkToChat;
    if (typeof window !== "undefined") {
      linkToChat = `${window.location.protocol}//${
        window.location.host
      }/rooms/${this.state.room}/`; // (or whatever)
    } else {
      linkToChat = `http://localhost:3000/rooms/${this.state.room}/`;
    }

    const messagesToOut = this.state.messages.map((elem, i) => {
      let classes = "message";

      // Deciding if it is current users's message and adding class if so
      if (elem.login === this.state.login) {
        classes += " my-message";
      }
      return (
        <Message
          text={elem.message}
          login={elem.login}
          timesent={elem.timesent}
          classes={classes}
        />
      );
    });

    const onlineUsers = this.state.onlineUsers.map(elem => {
      return (
        <li>
          <i className="fas fa-user" />
          {" " + elem}
        </li>
      );
    });

    return (
      <div className="chatroom main-background">
        <div className="chatroom-container">
          <div id="flying-link">
            <span>Ссылка на чат: </span>
            <div className="selectable">
              <span onClick={this.selectLink}>{linkToChat}</span>
            </div>
          </div>
          <div className="chatroom-messenger-container">
            <div className="messagebox">{messagesToOut}</div>
            <div className="textbox input-group">
              <input
                type="text"
                className="form-control chatroom-form-control"
                placeholder="Введите сообщение"
                name="message"
                value={this.state.message}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
              />
              <div className="input-group-append no-border-radius">
                <button
                  className="btn btn-block btn-gm-info"
                  type="button"
                  disabled={!this.state.message}
                  onClick={this.onClick}
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
          <div className="chatroom-online-container">
            <h2 className="lead">Сейчас онлайн:</h2>
            <ul className="online-users">{onlineUsers}</ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
