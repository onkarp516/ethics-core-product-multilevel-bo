import React, { Component } from "react";
import Marquee from "react-fast-marquee";
// import work1 from "@/assets/images/marqueeicons/work1.png";
// import work2 from "@/assets/images/marqueeicons/work2.png";
import refresh from "@/assets/images/refresh.png";
import office from "@/assets/images/loginScreen/office.png";
import brifcase from "@/assets/images/loginScreen/Briefcase.svg";
import cabinet from "@/assets/images/loginScreen/Cabinet.svg";
import barGraphic from "@/assets/images/loginScreen/Bar Graphic.svg";
import FloppyDisk from "@/assets/images/loginScreen/Floppy Disk.svg";
import Projector from "@/assets/images/loginScreen/Projector Screen.svg";
import Calculator from "@/assets/images/loginScreen/Calculator.svg";
import Team from "@/assets/images/loginScreen/Teamwork.svg";
import Clock from "@/assets/images/loginScreen/Clock.svg";
import User from "@/assets/images/loginScreen/user.svg";
import Pass from "@/assets/images/loginScreen/pass.svg";
import Icon from "@/assets/images/loginScreen/Iconeo.png";
import { useSelector, useDispatch } from "react-redux";

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
  img,
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

import top_icon from "@/assets/images/top_icon.svg";
import close_icon from "@/assets/images/close.svg";
import Max from "@/assets/images/maximize.png";
import login_bg from "@/assets/images/login_backgrond.png";
import login1 from "@/assets/images/login2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faMaximize } from "@fortawesome/free-solid-svg-icons";
import {
  faUser as faSolidUser,
  faLock,
  faPlusSquare,
  faAngleDown,
  faSearch,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import logo from "@/assets/images/logo.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";

import {
  authenticationService,
  getUserPermission,
} from "@/services/api_functions";
import { app, window } from "@neutralinojs/lib";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  MyNotifications,
  allEqual,
  handlesetFieldValue,
} from "@/helpers";

export default class Login1 extends Component {
  constructor(props) {
    super(props);

    this.state = { userPermission: "", errorArrayBorder: "" };
  }

  callUserPermission = (userId) => {
    let requestData = new FormData();
    requestData.append("user_id", userId);
    getUserPermission(requestData)
      .then((response) => {
        // console.log("user permission=>", response);
        if (response.status === 200) {
          // console.log("data=>", response.data.userActions);
          let userPerm = response.data.userActions;
          this.setState({ userPermission: userPerm });
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: "Login Successfully",
            is_timeout: true,
            delay: 1000,
          });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: response.message,
            // is_button_show: true,
            is_timeout: true,
            delay: 1500,
          });
        }
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  };
  componentDidMount() {}

  /* minimizeButton = () => {
    console.log("in Minimize button function");
    console.log("window-->", window);
    // window.minimize(); 2.tried
    // window.window.minimize();3 tried
    //Neutralino.window.minimize();
    // console.log("isMaximised : ", window.Neutralino.window);
    try {
      // window.Neutralino.window.minimize();
    } catch (error) {
      console.log("Ers==>>", error);
    }

    //window.Neutralino.app.exit();

    // window.Neutralino.minimize(); 1.tried
  }; */

  // customizewindow = () => {};
  /* async customizewindow(params) {
    let isMaximized = await window.Neutralino.window.isMaximized();
    let closeBtn = document.getElementById("restoreBtn");
    if (isMaximized) {
      window.Neutralino.window.unmaximize();
    } else {
      window.Neutralino.window.maximize();
    }
  } */

  // ! function set border to required fields
  setErrorBorder(index, value) {
    let { errorArrayBorder } = this.state;
    let errorArrayData = [];
    if (errorArrayBorder.length > 0) {
      errorArrayData = errorArrayBorder;
      if (errorArrayBorder.length >= index) {
        errorArrayData.splice(index, 1, value);
      }
    } else {
      {
        Array.from(Array(index + 1), (v) => {
          errorArrayData.push(value);
        });
      }
    }

    this.setState({ errorArrayBorder: errorArrayData });
  }

  render() {
    const { errorArrayBorder } = this.state;
    return (
      <>
        <div style={{ height: "32px", background: "#EBEBEB" }}>
          <img src={top_icon} alt="" className="top_logo_style" />
          <span className="core_product_style">Core Product | Ethics 2.0</span>

          <div style={{ display: "inline", float: "right", display: "flex" }}>
            <div>
              <FontAwesomeIcon
                icon={faMinus}
                onClick={async (e) => {
                  e.preventDefault();
                  console.log("Min Button Clicked");
                  await window.minimize();
                  // this.minimizeButton();
                }}
                className="minus_icon_style"
              />
            </div>
            <div id="restoreBtn">
              <img
                className="maximize_icon"
                onClick={async (e) => {
                  console.log("Max Button Clicked");
                  console.log("IsMax : ", window.isMaximized);

                  await window.maximize();

                  /* if (window.isMaximized) {
                    await window.unmaximize();
                  } else {
                    await window.maximize();
                  } */
                }}
                src={Max}
                alt=""
              />
            </div>
            <img
              className="close-icon"
              onClick={(e) => {
                // e.preventDefault();
                console.log("Close Button Clicked");
                app.exit();
              }}
              src={close_icon}
              alt=""
            />
          </div>
        </div>

        <Container fluid className="layout-style-login1">
          {" "}
          <Row>
            <Col>
              <img
                className="Main-Logo-style mt-4 ms-3"
                alt="MainLogo"
                src={logo}
              />
            </Col>
          </Row>
          <Row className="topmargin">
            <Col lg={7} md={7} sm={7} className="my-auto">
              <Row>
                <Col className="loginhead ms-3">
                  <p style={{ margin: "0px" }}>
                    #1 solution of accurate financial
                  </p>
                  <p className="mb-2">
                    analysis for{" "}
                    <span className="status">All Business Sectors</span>
                  </p>
                  <hr
                    className="mt-0"
                    style={{
                      width: "43px",
                      height: "5px",
                      background: "#00A0F5",
                      color: "#00A0F5",
                    }}
                  />
                </Col>
              </Row>
              <Marquee
                // direction="left"
                speed={0}
                gradient={false}
                className="for_margin_top_marquee"
              >
                <Row>
                  <Col md={1} className="pe-0">
                    <Row>
                      <Col md={12}>
                        <Card
                          className="card-style"
                          style={{
                            marginLeft: "10px",
                          }}
                        >
                          <Card.Body>
                            <img src={barGraphic} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={12} className="mt-2">
                        <Card
                          className="card-style"
                          style={{
                            marginLeft: "10px",
                          }}
                        >
                          <Card.Body>
                            <img src={FloppyDisk} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={1} className="my-auto pe-0">
                    <Card className="card-style">
                      <Card.Body className="card-logo-style">
                        <img src={Projector} alt="" />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={1} className="pe-0">
                    <Row>
                      <Col md={12}>
                        <Card className="card-style">
                          <Card.Body>
                            <img src={Calculator} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={12} className="mt-2">
                        <Card className="card-style">
                          <Card.Body>
                            <img src={Team} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={1} className="my-auto pe-0">
                    <Card className="card-style">
                      <Card.Body>
                        <img src={Clock} alt="" />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={1} className="pe-0">
                    <Row>
                      <Col md={12}>
                        <Card className="card-style">
                          <Card.Body>
                            <img src={office} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={12} className="mt-2">
                        <Card className="card-style">
                          <Card.Body>
                            <img src={brifcase} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={1} className="my-auto pe-0">
                    <Card className="card-style">
                      <Card.Body>
                        <img src={cabinet} alt="" />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={1} className="pe-0">
                    <Row>
                      <Col md={12}>
                        <Card
                          className="card-style"
                          style={
                            {
                              // marginLeft: "12px",
                            }
                          }
                        >
                          <Card.Body>
                            <img src={barGraphic} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={12} className="mt-2">
                        <Card
                          className="card-style"
                          style={
                            {
                              // marginLeft: "15px",
                            }
                          }
                        >
                          <Card.Body>
                            <img src={FloppyDisk} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={1} className="pe-0">
                    <Row>
                      <Col md={12}>
                        <Card className="card-style">
                          <Card.Body>
                            <img src={Calculator} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={12} className="mt-2">
                        <Card className="card-style">
                          <Card.Body>
                            <img src={Team} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>

                  <Col md={1} className="my-auto pe-0">
                    <Card className="card-style">
                      <Card.Body>
                        <img src={Clock} alt="" />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={1} className="pe-0">
                    <Row>
                      <Col md={12}>
                        <Card className="card-style">
                          <Card.Body>
                            <img src={office} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={12} className="mt-2">
                        <Card className="card-style">
                          <Card.Body>
                            <img src={brifcase} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={1} className="my-auto pe-0">
                    <Card className="card-style">
                      <Card.Body>
                        <img src={Clock} alt="" />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={1} className="pe-0">
                    <Row>
                      <Col md={12}>
                        <Card className="card-style">
                          <Card.Body>
                            <img src={office} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={12} className="mt-2">
                        <Card className="card-style">
                          <Card.Body>
                            <img src={brifcase} alt="" />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Marquee>
            </Col>
            <Col md={4} lg={4} sm={4} className="login-layout">
              <Row>
                <Col md={4} xs={12} className="logo-style">
                  <img className="logo-style1" alt="logo" src={login1} />
                </Col>
                <Col md={12} xs={12}>
                  <p className="title-style mb-2 mt-0 py-0">Login to account</p>
                  {/* <p className="title1-style">Login to your account</p> */}
                </Col>
              </Row>
              <Row>
                <Col md={12} xs={12}>
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={{
                      usercode: "",
                      password: "",
                    }}
                    // validationSchema={Yup.object().shape({
                    //   usercode: Yup.string()
                    //     .trim()
                    //     .required("User Name is required"),
                    //   password: Yup.string()
                    //     .trim()
                    //     .required("Password is required"),
                    // })}
                    onSubmit={(value, { setSubmitting }) => {
                      //! validation required start

                      let errorArray = [];
                      if (value.usercode == "") {
                        errorArray.push("Y");
                      } else {
                        errorArray.push("");
                      }

                      if (value.password == "") {
                        errorArray.push("Y");
                      } else {
                        errorArray.push("");
                      }
                      //! validation required end
                      this.setState({ errorArrayBorder: errorArray }, () => {
                        if (allEqual(errorArray)) {
                          setSubmitting(false);
                          authenticationService.login(value).then(
                            (response) => {
                              if (response.status == 200) {
                                localStorage.setItem(
                                  "authenticationService",
                                  response.token
                                );
                                this.callUserPermission(response.userId);

                                // this.props.block.handleMultiScreen(true);
                                eventBus.dispatch("handle_multiscreen", true);
                                eventBus.dispatch("handle_main_state", {
                                  statekey: "isShowMenu",
                                  statevalue: true,
                                });
                                MyNotifications.fire({
                                  show: true,
                                  icon: "success",
                                  title: "Success",
                                  msg: "Login Successfully",
                                  is_timeout: true,
                                  delay: 1000,
                                });
                                  eventBus.dispatch("page_change", "dashboard");
                                
                              } else {
                                setSubmitting(false);
                                if (response.responseStatus == 401) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: response.message,
                                    // is_button_show: true,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Server Error! Please Check Your Connectivity",
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  console.log(
                                    "Server Error! Please Check Your Connectivity"
                                  );
                                }
                              }
                            },
                            (error) => {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: "Server Error! Please Check Your Connectivity",
                                is_timeout: true,
                                delay: 1500,
                              });
                              console.log(
                                "Server Error! Please Check Your Connectivity"
                              );
                              setSubmitting(false);
                              console.log("error", error);
                              // ShowNotification('Error', 'Error! ');
                            }
                          );
                        }
                      });
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      resetForm,
                      setFieldValue,
                    }) => (
                      <Form
                        onSubmit={handleSubmit}
                        noValidation
                        className="login-form-style mt-3"
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) {
                            e.preventDefault();
                          }
                        }}
                        spellcheck="false"
                      >
                        <Row>
                          <Col
                            md={8}
                            xs={12}
                            className="form-control-width mb-2"
                          >
                            <InputGroup>
                              <InputGroup.Text className="form-control-icon">
                                {/* <FontAwesomeIcon icon={faSolidUser} /> */}
                                <img src={User} alt="" />
                              </InputGroup.Text>
                              <FormControl
                                autoFocus={true}
                                placeholder="Email or Username"
                                aria-label="Username"
                                autoComplete="nope"
                                aria-describedby="basic-addon1"
                                name="usercode"
                                id="usercode"
                                type="text"
                                onChange={handleChange}
                                value={values.usercode}
                                className={`${
                                  errorArrayBorder[0] == "Y"
                                    ? "border border-danger "
                                    : ""
                                }`}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode == 9) {
                                    e.preventDefault();
                                  } else if (e.keyCode == 9) {
                                    if (e.target.value) {
                                      e.preventDefault();
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "usercode",
                                        e.target.value
                                      );
                                      document
                                        .getElementById("password")
                                        .focus();
                                      this.setErrorBorder(0, "");
                                    } else {
                                      e.preventDefault();
                                    }
                                  } else if (e.keyCode == 13) {
                                    if (e.target.value) {
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "usercode",
                                        e.target.value
                                      );
                                      document
                                        .getElementById("password")
                                        .focus();
                                      this.setErrorBorder(0, "");
                                    } else e.preventDefault();
                                  }
                                }}
                              />
                            </InputGroup>
                            <span className="text-danger">
                              {errors.usercode}
                            </span>
                          </Col>
                          <Col
                            md={8}
                            xs={12}
                            className="form-control-width my-2"
                          >
                            <InputGroup>
                              <InputGroup.Text className="form-control-icon">
                                {/* <FontAwesomeIcon icon={faLock} /> */}
                                <img src={Pass} alt="" />
                              </InputGroup.Text>
                              <FormControl
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                name="password"
                                id="password"
                                type="password"
                                onChange={handleChange}
                                value={values.password}
                                className={`${
                                  errorArrayBorder[1] == "Y"
                                    ? "border border-danger "
                                    : ""
                                }`}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode == 9) {
                                    document.getElementById("usercode").focus();
                                    if (e.target.value) {
                                      e.preventDefault();

                                      this.setErrorBorder(1, "");
                                    } else {
                                      this.setErrorBorder(1, "Y");
                                    }
                                  } else if (e.keyCode == 9) {
                                    if (e.target.value) {
                                      e.preventDefault();

                                      document
                                        .getElementById("login_submit_btn")
                                        .focus();
                                      this.setErrorBorder(1, "");
                                    } else {
                                      e.preventDefault();
                                    }
                                  } else if (e.keyCode == 13) {
                                    if (e.target.value) {
                                      e.preventDefault();
                                      handleSubmit();
                                      this.setErrorBorder(1, "");
                                    } else e.preventDefault();
                                  }
                                }}
                              />
                            </InputGroup>

                            <span className="text-danger">
                              {errors.password}
                            </span>
                          </Col>
                        </Row>
                        <Row className="text-center">
                          <Col md={12} xs={12}>
                            <Button
                              type="submit"
                              className="button-style"
                              id="login_submit_btn"
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  handleSubmit();
                                }
                              }}
                            >
                              <img src={Icon} alt="" className="button-text" />
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={7} lg={7} sm={7}></Col>
            <Col md={3} lg={3} sm={3} className="bottom-text-layout">
              <p className="title1-style">
                Designed & developed by
                <b> Truethic Solution</b>
                <br />
                copyright @ 2022Truethic Solution *v2.0
              </p>
            </Col>
            <Col md={1} lg={1} sm={1}></Col>
          </Row>
          {/* <Marquee direction="left" speed={100} gradient={false}>
            <p>
              online marketing &nbsp;&nbsp; <span>offline marketing </span>
              &nbsp;&nbsp; product design &nbsp;&nbsp;
              <span> graphic design </span>
            </p>
          </Marquee> */}
        </Container>
      </>
    );
  }
}
