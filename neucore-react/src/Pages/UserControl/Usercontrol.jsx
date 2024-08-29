import React, { Component } from "react";
import "./Usercontrol.css";
import axios from "axios";
import {
  Button,
  Col,
  Row,
  Table,
  Collapse,
  ButtonGroup,
  FormGroup,
  Input,
  Form,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import * as Yup from "yup";
import {
  createappConfig,
  getappConfig,
  updateAppConfig,
  getOutletAppConfig,
  getAllMasterAppConfig,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
import Select from "react-select";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  customStyles,
  ArraySplitChunkElement,
  MyNotifications,
  eventBus,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

class Usercontrol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      userControlData: [],
      data: [],

      selectedOption: "",
      userRole: "USER",
      sysPermission: [],
      orgSysPermission: [],
      userPermission: [],
    };
    this.ref = React.createRef();
  }

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  getAllMasterAppConfig = () => {
    getappConfig()
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          // console.log("result : ", result);
          let res = result.responseObject;

          let opt = res.map((v) => {
            return {
              id: v.id,
              display_name: v.display_name,
              slug: v.slug,
              is_label: v.is_label,
              value: v.value,
              label: v.label,
            };
          });
          this.setState({
            userControlData: opt,
          });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: result.message,
            is_button_show: true,
          });
          // ShowNotification("Error", result.message);
        }
      })
      .catch((error) => { });
  };

  // handleSelectionChange = (slug, value, setFieldValue) => {
  //   console.log("slug", slug);
  //   console.log("value", value);
  //   let { userControlData } = this.state;
  //   console.log("userControlData", userControlData);
  //   // let fObj = userControlData.find((v) => v.slug == slug);
  //   // if (fObj) {
  //   //   fObj.value = value;
  //   // }

  //   // let fUserControlData = [...userControlData, fObj];
  //   userControlData = userControlData.map((v) => {
  //     if (v.slug == slug) {
  //       v.value = parseInt(value);
  //     }

  //     return v;
  //   });

  //   this.setState({ userControlData: userControlData }, () => {
  //     console.log("userControlData=--->>>>", userControlData);
  //   });
  // };

  handleSelectionChange = (slug, value, index) => {
    // console.log("slug", slug);
    // console.log("value", value);
    let { userControlData } = this.state;
    // console.log("userControlData", userControlData);
    // let fObj = userControlData.find((v) => v.slug == slug);
    // if (fObj) {
    //   fObj.value = value;
    // }

    // let fUserControlData = [...userControlData, fObj];

    // console.warn('Index ->>>>>', userControlData[index - 1]['is_label'])
    // console.warn('Index ->>>>>', userControlData[index - 1]['label'])
    // console.warn('Index ->>>>>', userControlData[index]['is_label'])
    // console.warn('before Value ->>>>>', userControlData[index]["value"])
    // console.warn('before Label ->>>>>', userControlData[index]["label"])

    userControlData = userControlData.map((v) => {
      if (v.slug == slug) {
        // if (
        //   userControlData[index - 1] != undefined &&
        //   userControlData[index + 1] != undefined
        // ) {

        if (userControlData[index]["is_label"]) {
          // if (userControlData[index - 1]["is_label"]) {
          if (userControlData[index - 1]["is_label"]) {
            if (userControlData[index]["label"]) {
              v.value = 1;
            } else if (
              userControlData[index + 1]["is_label"] &&
              userControlData[index + 1]["value"] == 1
            ) {
              v.value = 1;
            } else if (
              userControlData[index - 1]["label"] &&
              userControlData[index - 1]["value"] == 1
            ) {
              v.value = value;
            } else {
              v.value = 0;
            }
          } else if (userControlData[index]["label"]) {
            v.value = 1;
          } else if (index + 1 == userControlData.length) {
            if (userControlData[index]["label"]) {
              v.value = 1;
            } else {
              v.value = value;
            }
          } else {
            if (userControlData[index + 1]["label"]) {
              v.value = 1;
            } else if (userControlData[index + 1]["value"] == 1) {
              v.value = 1;
            } else {
              v.value = value;
            }
          }
        } else {
          v.value = value;
        }
      }

      return v;
    });

    this.setState({ userControlData: userControlData }, () => {
      // console.log("userControlData", userControlData);
      // console.warn('Value ->>>>>', userControlData[index]["value"])
      // console.warn('Label ->>>>>', userControlData[index]["label"])
    });
  };

  handleLabelChange = (slug, value) => {
    let { userControlData } = this.state;
    userControlData = userControlData.map((v) => {
      if (v.slug == slug) {
        v.label = value;
      }

      return v;
    });

    this.setState({ userControlData: userControlData }, () => {
      // console.log("userControlData", userControlData);
    });
  };

  SelectionChangeCheck = (slug) => {
    // console.log("slug", slug);
    let { userControlData } = this.state;

    let fObj = userControlData.find((v) => v.slug == slug);
    // console.log("fObj", fObj);
    if (fObj) {
      if (parseInt(fObj.value) == 1) {
        return true;
      }
    }
    return false;
  };

  callUserControl = () => {
    let userControl = this.props.userControl;

    getOutletAppConfig()
      .then((response) => {
        if (response.data.responseStatus === 200) {
          console.log("settings", response);
          let userctrl = response.data.responseObject;
          this.props.setUserControl(userctrl);
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: response.message,
            is_button_show: true,
          });
        }
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getAllMasterAppConfig();
      // this.listSysPermission();
      // mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);settings
      // mousetrap.bindGlobal("ctrl+c", this.setInitValue);
    }
  }

  // componentDidUpdate() {
  //   if (AuthenticationCheck()) {
  //     this.getappConfig();
  //   }
  // }

  componentWillUnmount() {
    // mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    // mousetrap.unbindGlobal("ctrl+c", this.setInitValue);
  }

  pageReload = () => {
    this.componentDidMount();
  };

  level_a_validation = (idx, uclst) => {
    if (uclst[idx]["value"] === 1 && uclst[idx]["label"] !== "") return false;
    return true;
  };

  level_a_b_validation = (idx_a, idx_b, uclst) => {
    if (
      uclst[idx_a]["value"] === 1 &&
      uclst[idx_a]["label"] !== "" &&
      uclst[idx_b]["value"] === 1 &&
      uclst[idx_b]["label"] !== ""
    ) {
      return false;
    }
    return true;
  };

  render() {
    let { userControlData } = this.state;

    return (
      <>
        <div className="newcompanycreate" style={{ overflow: "hidden" }}>
          {/* {JSON.stringify(userControlData)} integrated */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={userControlData}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              // groupName: Yup.string()
              //   .trim()
              //   .matches(AlphabetwithSpecialChars, "Enter only alphabet")
              //   .required("Group name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to save",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 1000,
                  handleSuccessFn: () => {
                    let requestData = new FormData();
                    requestData.append(
                      "userControlData",
                      JSON.stringify(userControlData)
                    );

                    updateAppConfig(requestData)
                      .then((response) => {
                        let res = response.data;
                        console.log("res", res);

                        if (res.responseStatus == 200) {
                          this.callUserControl();
                          this.getAllMasterAppConfig();
                          MyNotifications.fire({
                            show: true,
                            icon: "success",
                            title: "Success",
                            msg: res.message,
                            is_timeout: true,
                            delay: 1000,
                          });
                          resetForm();
                          this.props.handleRefresh(true);
                          this.pageReload();
                        } else if (res.responseStatus == 409) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        }
                      })
                      .catch((error) => { });
                    eventBus.dispatch("page_change", "dashboard");
                  },
                  handleFailFn: () => { },
                },
                () => {
                  console.warn("return_data");
                }
              );
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
              isSubmitting,
              resetForm,
            }) => (
              <Form
                onSubmit={handleSubmit}
                // className="form-style"
                autoComplete="off"
              >
                <div className="co-inner-div">
                  <h2
                    style={{
                      fontFamily: "Inter",
                      fontStyle: "normal",
                      fontWeight: "700",
                      color: "#00a0f5",
                      textDecorationLine: "underline",
                      marginLeft: "10px",
                      marginTop: "10px",
                    }}
                  >
                    User Control
                  </h2>
                  {/* <Row>
                    <Col lg="12" className=" my-auto mt-1 ms-2"> */}
                  <div className="mt-2">
                    {/* {JSON.stringify(userControlData)} */}
                    {userControlData && userControlData.length > 0 ? (
                      userControlData.map((v, i) => {
                        return (
                          // <Row>
                          //   <Col lg={12}>
                          <div className=" d-flex m-3">
                            <Form.Check
                              type="switch"
                              label={v && v.display_name}
                              name={v.slug}
                              id={`${v.slug}-${i}-yes`}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  this.handleSelectionChange(v.slug, 1, i);
                                } else {
                                  this.handleSelectionChange(v.slug, 0, i);
                                }
                              }}
                              checked={this.SelectionChangeCheck(v.slug)}
                            />
                            {v.is_label && parseInt(v.value) == 1 && (
                              <>
                                {v.slug === "is_level_a" && (
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      autoFocus="true"
                                      className="control_text_box1 ms-5"
                                      placeholder="Enter"
                                      name={`${v.slug}-label`}
                                      id={`${v.slug}-label`}
                                      onChange={(e) => {
                                        this.handleLabelChange(
                                          v.slug,
                                          e.target.value
                                        );
                                      }}
                                      value={v.label}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                        } else if (
                                          e.key === "Tab" &&
                                          !e.target.value.trim()
                                        )
                                          e.preventDefault();
                                      }}
                                    />
                                  </Form.Group>
                                )}
                                {v.slug === "is_level_b" && v.value === 1 && (
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      autoFocus="true"
                                      className="control_text_box1 ms-5"
                                      placeholder="Enter"
                                      name={`${v.slug}-label`}
                                      id={`${v.slug}-label`}
                                      onChange={(e) => {
                                        this.handleLabelChange(
                                          v.slug,
                                          e.target.value
                                        );
                                      }}
                                      value={v.label}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                        } else if (
                                          e.key === "Tab" &&
                                          !e.target.value.trim()
                                        )
                                          e.preventDefault();
                                      }}
                                    />
                                  </Form.Group>
                                )}
                                {v.slug === "is_level_c" && v.value === 1 && (
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      autoFocus="true"
                                      className="control_text_box1 ms-5"
                                      placeholder="Enter"
                                      name={`${v.slug}-label`}
                                      id={`${v.slug}-label`}
                                      onChange={(e) => {
                                        this.handleLabelChange(
                                          v.slug,
                                          e.target.value
                                        );
                                      }}
                                      value={v.label}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                        } else if (
                                          e.key === "Tab" &&
                                          !e.target.value.trim()
                                        )
                                          e.preventDefault();
                                      }}
                                    />
                                  </Form.Group>
                                )}
                              </>
                            )}
                          </div>

                          //   </Col>
                          // </Row>
                        );
                      })
                    ) : (
                      <>
                        <h1>ABC</h1>
                      </>
                    )}
                  </div>
                  {/* </Col>
                  </Row> */}
                </div>
                <Row className="style-btn">
                  <Col lg={12} className="text-end">
                    <Button className="successbtn-style" type="submit">
                      Submit
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        MyNotifications.fire(
                          {
                            show: true,
                            icon: "confirm",
                            title: "Confirm",
                            msg: "Do you want to cancel",
                            is_button_show: false,
                            is_timeout: false,
                            delay: 0,
                            handleSuccessFn: () => {
                              eventBus.dispatch("page_change", {
                                from: "usercontrol",
                                to: "dashboard",
                                isNewTab: false,
                                isCancel: true,
                              });
                            },
                            handleFailFn: () => { },
                          },
                          () => {
                            console.warn("return_data");
                          }
                        );
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
        <Row className="mx-0 btm-rows-btn1">
          <Col md="2" className="px-0">
            <Form.Label className="btm-label">
              <img src={keyboard} className="svg-style mt-0 mx-2"></img>
              New entry: <span className="shortkey">Ctrl + N</span>
            </Form.Label>
          </Col>
          <Col md="8">
            <Form.Label className="btm-label">
              Duplicate: <span className="shortkey">Ctrl + D</span>
            </Form.Label>
          </Col>
          {/* <Col md="8"></Col> */}
          <Col md="2" className="text-end">
            <img src={question} className="svg-style ms-1"></img>
          </Col>
        </Row>
      </>
    );
  }
}

const mapStateToProps = ({ userPermissions, userControl }) => {
  return { userPermissions, userControl };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
      setUserControl,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(Usercontrol);
