import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import {
  Button,
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";

import Menus from "./Menus";
import Login from "./Login";
src = "/neutralino.js";

function App() {
  useEffect(() => {
    console.log("window0", window.Neutralino.window);
    console.log("window1", window.Neutralino);
    // console.log("NL_OS", window.Neutralino.NL_OS);
    // console.log("window0", window.Neutralino.os);
    // console.log("os", os.platform());

    // const nets = os.networkInterfaces();
    // console.log(nets);
    let ip = window.Neutralino.os.execCommand("ifconfig");
    console.log(ip);
    console.log(window.navigator.platform);
  }, []);

  return (
    <div className="App">
      {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button variant="secondary">SAVE</Button> */}
      {/* <Login /> */}
      {/* <Menus /> */}
    </div>
  );
}

export default App;
