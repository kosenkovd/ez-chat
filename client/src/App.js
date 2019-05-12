import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Page, where user must enter his login to create or join a room
import Login from "./components/layout/Login";
// Chat room page
import Chat from "./components/layout/Chat";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="outer-container">
            <Route exact path="/" component={Login} />
            <Route exact path="/rooms/:roomname" component={Login} />
            <Route exact path="/rooms/:roomname/:username" component={Chat} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
