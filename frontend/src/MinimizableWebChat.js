import classNames from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import { createStore, createStyleSet } from "botframework-webchat";

import WebChat from "./WebChat";

import "./fabric-icons-inline.css";
import "./MinimizableWebChat.css";

import { UBLogoWhiteBg } from "./svg/ub_logo_whtie_bg";

import { theme } from "./constants";

const MinimizableWebChat = () => {
  const store = useMemo(
    () =>
      createStore({}, ({ dispatch }) => (next) => (action) => {
        if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
          dispatch({
            type: "WEB_CHAT/SEND_EVENT",
            payload: {
              name: "webchat/join",
              value: {
                language: window.navigator.language,
              },
            },
          });
        } else if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
          if (action.payload.activity.from.role === "bot") {
            setNewMessage(true);
          }
        }

        return next(action);
      }),
    []
  );

  const styleSet = useMemo(
    () =>
      createStyleSet({
        backgroundColor: "Transparent",
      }),
    []
  );

  const [loaded, setLoaded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [side, setSide] = useState("right");
  // const [token, setToken] = useState();

  // To learn about reconnecting to a conversation, see the following documentation:
  // https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-reconnect-to-conversation?view=azure-bot-service-4.0

  //   const handleFetchToken = useCallback(async () => {
  //   if (!token) {
  //     const res = await fetch('https://webchat-mockbot.azurewebsites.net/directline/token', { method: 'POST' });
  //     const { token } = await res.json();

  //     setToken(token);
  //   }
  // }, [setToken, token]);

  const handleMaximizeButtonClick = useCallback(async () => {
    setLoaded(true);
    setMinimized(false);
    setNewMessage(false);
  }, [setMinimized, setNewMessage]);

  const handleMinimizeButtonClick = useCallback(() => {
    setMinimized(true);
    setNewMessage(false);
  }, [setMinimized, setNewMessage]);

  const handleSwitchButtonClick = useCallback(() => {
    setSide(side === "left" ? "right" : "left");
  }, [setSide, side]);

  // TODO: [P2] Currently, we cannot unmount Web Chat from DOM when it is minimized.
  //       Today, if we unmount it, Web Chat will call disconnect on DirectLineJS object.
  //       When minimized, we still want to maintain that connection while the UI is gone.
  //       This is related to https://github.com/microsoft/BotFramework-WebChat/issues/2750.

  return (
    <div className="minimizable-web-chat">
      <button
        className={classNames(
          minimized ? "minimize" : "maximize",
          "chat-icon-container"
        )}
        onClick={handleMaximizeButtonClick}
      >
        <UBLogoWhiteBg fill="#FFFFFF" />
      </button>
      {/* {loaded && ( */}
      <div
        className={classNames(
          side === "left" ? "chat-box left" : "chat-box right",
          minimized ? "hide" : ""
        )}
      >
        <header>
          <div className="header-banner">
            <div className="ub-logo-container">
              <UBLogoWhiteBg fill={theme["ub-orange"]} />
            </div>
            <div className="header-text-container">
              <p className="header-text header-title">Rafa of UnionBank</p>
              <p className="header-text header-subtitle">
                Union Bank of the Philippines
              </p>
            </div>
          </div>
          <div className="filler" />
          <button className="minimize" onClick={handleMinimizeButtonClick}>
            <span className="ms-Icon ms-Icon--ChromeMinimize" />
          </button>
        </header>
        <WebChat
          className="react-web-chat"
          // onFetchToken={handleFetchToken}
          store={store}
          styleSet={styleSet}
          // token={token}
        />

        <footer className="footer-container">
          <div className="powered-by">
            Built by{" "}
            <a
              href="https://www.onebyzero.ai/chattr"
              target="_blank"
              rel="noreferrer"
              className="powered-by"
            >
              OneByZero
            </a>
          </div>
          <div className="disclaimer-text">
            Rafa uses AI which can make mistakes
          </div>
        </footer>
      </div>
      {/* )} */}
    </div>
  );
};

export default MinimizableWebChat;
