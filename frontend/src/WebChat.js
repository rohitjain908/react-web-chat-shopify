import React, { useEffect, useMemo } from "react";
import ReactWebChat, { createDirectLine } from "botframework-webchat";
import { useIdleTimer } from "react-idle-timer";

import "./WebChat.css";

import { theme } from "./constants";

const WebChat = ({ className, onFetchToken, store, token }) => {
  // const directLine = useMemo(() => createDirectLine({ token }), [token]);
  // const directLine = useMemo(() => {
  //   createDirectLine({
  //     secret: '59d4884b-f9f5-4605-8ec2-0371267d36e2',
  //     domain: 'https://ubp-directline.demos.onebyzero.ai/v3',
  //     webSocket: true,
  //   });
  // }, [])

  const directLine = useMemo(
    () =>
      createDirectLine({
        secret: "59d4884b-f9f5-4605-8ec2-0371267d36e2",
        domain: "https://ubp-directline.demos.onebyzero.ai/v3",
        //domain: "http://localhost:5000/v3",
        webSocket: true,
      }),
    []
  );

  const styleOptions = {
    primaryFont:
      "fontFamily(['Gotham', 'Helvetica Neue', 'Arial', 'sans-serif'])",
    backgroundColor: "Transparent",

    botAvatarImage:
      "https://cdn.yellowmessenger.com/C282ttbyzNtB1630395945901.jpeg",
    botAvatarBackgroundColor: "transparent",
    botAvatarInitials: "UB",

    bubbleBorderRadius: "8px",
    bubbleBorderColor: "transparent",
    bubbleFromUserBackground: theme["ub-orange"],
    bubbleFromUserTextColor: "White",
    bubbleFromUserBorderRadius: "8px",
    bubbleFromUserBorderColor: "transparent",

    sendBoxBackground: "var(--UB-Lightest-Grey, #EDEDED)",
    hideUploadButton: true,
    sendBoxTextWrap: true,

    suggestedActionBackground: "transparent",
    suggestedActionLayout: "flow",
    suggestedActionBorderRadius: "20px",
    suggestedActionBorderColor: theme["ub-orange"],
    suggestedActionTextColor: theme["ub-orange"],
    suggestedActionBorderWidth: 1,
  };

  useEffect(() => {
    // Send the event when the conversation starts
    directLine
      .postActivity({
        from: { id: "user" },
        name: "startConversation",
        type: "event",
        value: "start",
      })
      .subscribe(
        (id) => console.log(`Posted activity, assigned ID ${id}`),
        (error) => console.log(`Error posting activity ${error}`)
      );
  }, []); // Run this effect only once

  // useEffect(() => {
  //   onFetchToken();
  // }, [onFetchToken]);

  // return token ? (
  //   <>

  const onIdle = () => {
    console.log("getRemainingTime ", getRemainingTime());
    window.location.href = "";
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 900000,
  });

  return (
    <ReactWebChat
      className={`${className || ""} web-chat`}
      directLine={directLine}
      store={store}
      styleOptions={styleOptions}
    />
  );
  //   </>
  // ) : (
  //   <div className={`${className || ''} connect-spinner`}>
  //     <div className="content">
  //       <div className="icon">
  //         <span className="ms-Icon ms-Icon--Robot" />
  //       </div>
  //       <p>Please wait while we are connecting.</p>
  //     </div>
  //   </div>
  // );
};

export default WebChat;
