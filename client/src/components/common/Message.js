import React from "react";

export default function Message({ text, login, timesent, classes }) {
  return (
    <div className="message-container">
      <div className={classes}>
        <p className="message-text">{text}</p>
        <span className="message-info">
          <span className="message-sender">{login}</span> в {timesent}
        </span>
      </div>
      <div className="clearfix" />
    </div>
  );
}
