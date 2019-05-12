import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import Particles from "react-particles-js";

// Load particles options from different file cuz they are far too big
const particlesOptions = require("../../assets/js/particlesOptions");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      room: "",
      newRoom: true
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const newVal = e.target.value.replace(/\s/g, "-").replace(/[^\w-]/g, "");
    this.setState({ [e.target.name]: newVal });
  }

  componentDidMount() {
    // If the param is not undefined we are entering some user's room
    if (this.props.match.params.roomname) {
      this.setState({ newRoom: false, room: this.props.match.params.roomname });
    }
  }

  render() {
    // Chat room link is created by mask rooms/{login of user created the room}/{login of current user}
    let href;
    let lead;
    let text;

    if (this.state.newRoom) {
      href = "rooms/" + this.state.login + "/" + this.state.login;
      lead = "Создай свою комнату для общения онлайн!";
      text = "Создать комнату";
    } else {
      href = this.state.login;
      lead = "Введи логин для начала общения!";
      text = "Войти в комнату";
    }

    let link;
    if (this.state.login) {
      link = (
        <Link to={href} className="btn btn-block btn-gm-info">
          {text}
        </Link>
      );
    } else {
      link = (
        <button className="btn btn-block btn-gm-info btn-disabled">
          {text}
        </button>
      );
    }

    return (
      <div className="login">
        <Particles className="particles" params={particlesOptions} />
        <div className="login-inner text-light flex-center">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto auth-form mt-5 mb-4 no-border-radius">
                <h1 className="display-3 mb-4 text-center">
                  <span className="jaapokki-substract">E</span>
                  <span className="jaapokki-enchance">z</span>
                  <span className="jaapokki-substract">C</span>
                  <span className="jaapokki-enchance">H</span>
                  <span className="jaapokki-enchance">A</span>
                  <span className="jaapokki-substract">T</span>
                </h1>
                <p className="lead text-center">{lead}</p>
                <hr />
                <TextFieldGroup
                  type="text"
                  placeholder="Введите Ваш логин"
                  name="login"
                  value={this.state.login}
                  onChange={this.onChange}
                  onKeyDown=""
                  disabled={false}
                  info='Можно использовать латинские буквы, цифры и "-"'
                />
                {link}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
