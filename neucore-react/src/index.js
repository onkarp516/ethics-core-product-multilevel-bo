import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";
import "./assets/scss/App.scss";
import { eventBus } from "@/helpers";
import { init, window, app, events } from "@neutralinojs/lib";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
if (process.env.NODE_ENV === "development") {
  console.log("In Development");
} else {
  console.log("In Production");
  init();
}

// events.on("ready", () => {
//   console.log("Project is ready");
// });

/* window.addEventListener("beforeunload", function (e) {
  eventBus.dispatch("page_change", "logout");

  localStorage.removeItem(`currentUser`);
  localStorage.removeItem(`authenticationService`);
  return null;
}); */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// window.Neutralino.init(); // Add this function call

// window.Neutralino.events.on("ready", () => {
//   console.log("main ready");
// });

// window.Neutralino.events.on("windowClose", () => {
//   console.log("windowClose ready");
//   alert("windowClose");
//   window.Neutralino.app.exit();

// });
