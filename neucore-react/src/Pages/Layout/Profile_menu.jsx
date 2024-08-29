import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Navbar,
  NavDropdown,
  Item,
  Nav,
  Form,
  Container,
  FormControl,
  InputGroup,
  Table,
  Alert,
  Modal,
  Tab,
  Card,
  Accordion,
  CloseButton,
  Tabs,
} from "react-bootstrap";
import menu_utilities from "@/assets/images/1x/menu_utilities.png";
import user_profile_avatar from "@/assets/images/user_profile_avatar.svg";
import menu_master from "@/assets/images/1x/menu_master.png";
import { DropdownSubmenu, NavDropdownMenu } from "@/CustMenu";

import { eventBus } from "@/helpers";
import { authenticationService } from "@/services/api_functions";
import themes from "@/assets/images/icon/themes.svg";
import profileup from "@/assets/images/icon/profileup.svg";
import out from "@/assets/images/icon/out.svg";
import change from "@/assets/images/icon/change.svg";

export default class Profile_menu extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <Nav>
          <NavDropdownMenu
            className="right-side profile-icon"
            title={
              <span className="text-white">
                {authenticationService.currentUserValue &&
                  authenticationService.currentUserValue.fullName}
                <img
                  alt="menu_account_entry"
                  src={user_profile_avatar}
                  className="profileimg"
                />
              </span>
            }
          >
            {/* <NavDropdown.Item href="#action/8.1">
              <span>
                <img alt="" src={profileup} style={{ height: "20px" }} /> Update
                Profile
              </span>
            </NavDropdown.Item> */}
            {/* <NavDropdown.Item href="#action/8.1">
              <span>
                <img alt="" src={change} style={{ height: "20px" }} /> Change
                Password
              </span>
            </NavDropdown.Item>
            <DropdownSubmenu
              href="#action/3.7"
              title={
                <span>
                  <img alt="" src={themes} style={{ height: "20px" }} /> Themes
                </span>
              }
            >
              <NavDropdown.Item href="#action/8.1">Blue</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Green</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Purple</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Red</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Orange</NavDropdown.Item>
              <NavDropdown.Item href="#action/8.1">Yellow</NavDropdown.Item>
            </DropdownSubmenu> */}
            <NavDropdown.Item
              href="#action/8.1"
              onClick={(e) => {
                e.preventDefault();
                // console.log("logout clicked");
                eventBus.dispatch("page_change", "logout");
                // eventBus.dispatch("handle_main_state", {
                //   statekey: "isShowMenu",
                //   statevalue: false,
                // });
              }}
            >
              <span>
                <img alt="" src={out} style={{ height: "20px" }} /> Sign Out
              </span>
            </NavDropdown.Item>
          </NavDropdownMenu>
        </Nav>
      </>
    );
  }
}
