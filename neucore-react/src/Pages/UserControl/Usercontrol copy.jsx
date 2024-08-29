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
} from "react-bootstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createappConfig, getappConfig } from "@/services/api_functions";
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
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

export default class CompanyUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      data: [],
      initialVal: {
        settings: [
          { id: "", key: "is_free_qty", value: false, label: "" },
          { id: "", key: "is_multi_rate", value: false, label: "" },
          { id: "", key: "is_multi_discount", value: false, label: "" },
          { id: "", key: "level_a", value: false, label: "" },
          { id: "", key: "level_b", value: false, label: "" },
          { id: "", key: "level_c", value: false, label: "" },
        ],
      },

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

  getappConfig = () => {
    getappConfig()
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          // console.log("result : ", result);
          let res = result.responseObject.settings;

          console.log(res);

          this.setState({
            initialVal: { ...this.state.initialVal, settings: res },
          });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getappConfig();
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

  handleOptionChange = (event) => {
    this.setState({ selectedOption: event.target.value });
  };

  render() {
    let { opendiv, initialVal } = this.state;

    return (
      <div className="">
        <Collapse in={opendiv}>
          <div
            id="example-collapse-text"
            className=" "
            style={{ margin: "1%" }}
          >
            <div className="main-div mb-2 m-0 company-from">
              <h4 className="form-header">User Control</h4>
            </div>
          </div>
        </Collapse>
        <div className="wrapper_div">
          {/* <h2>page start from here</h2> */}

          <Formik
            enableReinitialize={true}
            initialValues={initialVal}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log("values", values);
              let requestData = new FormData();
              requestData.append("settings", JSON.stringify(values.settings));
              // requestData.append("appConfigName", values.settings[0].key);
              // requestData.append("appConfigValue", values.settings[0].value);
              createappConfig(requestData)
                .then((response) => {
                  let res = response.data;
                  if (res.responseStatus == 200) {
                    MyNotifications.fire({
                      show: true,
                      icon: "success",
                      title: "Success",
                      msg: res.message,
                      is_timeout: true,
                      delay: 1000,
                    });
                    // this.myRef.current.resetForm();
                    this.pageReload();
                  } else {
                    MyNotifications.fire({
                      show: true,
                      icon: "error",
                      title: "Error",
                      msg: res.message,
                      is_timeout: true,
                      delay: 1000,
                    });
                  }
                })
                .catch((error) => {});
            }}
          >
            {({
              values,
              handleSubmit,
              setFieldValue,
              resetForm,
              setSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                {JSON.stringify(values)}

                <Row style={{ marginTop: "15px", marginLeft: "15px" }}>
                  <Col className="md-4">
                    <label style={{ margin: "15px", fontWeight: "bold" }}>
                      Free Quantity
                    </label>

                    <label style={{ marginLeft: "20px" }}>
                      <Field
                        type="radio"
                        name="settings[0].value"
                        id="settings"
                        value={values.settings[0].value}
                        checked={values.settings[0].value === true}
                        onChange={() =>
                          setFieldValue("settings[0].value", true)
                        }
                      />
                      Yes
                    </label>
                    <label style={{ marginLeft: "25px" }}>
                      <Field
                        type="radio"
                        name="settings[0].value"
                        value={false}
                        checked={values.settings[0].value === false}
                        onChange={() =>
                          setFieldValue("settings[0].value", false)
                        }
                      />
                      No
                    </label>
                  </Col>

                  <Col className="md-4">
                    <label style={{ margin: "15px", fontWeight: "bold" }}>
                      Multi Rate
                    </label>

                    <label style={{ marginLeft: "20px" }}>
                      <Field
                        type="radio"
                        name="settings[1].value"
                        value={true}
                        checked={values.settings[1].value === true}
                        onChange={() =>
                          setFieldValue("settings[1].value", true)
                        }
                      />
                      Yes
                    </label>
                    <label style={{ marginLeft: "25px" }}>
                      <Field
                        type="radio"
                        name="settings[1].value"
                        value={false}
                        checked={values.settings[1].value === false}
                        onChange={() =>
                          setFieldValue("settings[1].value", false)
                        }
                      />
                      No
                    </label>
                  </Col>

                  <Col className="md-4">
                    <label style={{ margin: "15px", fontWeight: "bold" }}>
                      Multi Discount
                    </label>

                    <label style={{ marginLeft: "20px" }}>
                      <Field
                        type="radio"
                        name="settings[2].value"
                        value={true}
                        checked={values.settings[2].value === true}
                        onChange={() =>
                          setFieldValue("settings[2].value", true)
                        }
                      />
                      Yes
                    </label>
                    <label style={{ marginLeft: "25px" }}>
                      <Field
                        type="radio"
                        name="settings[2].value"
                        value={false}
                        checked={values.settings[2].value === false}
                        onChange={() =>
                          setFieldValue("settings[2].value", false)
                        }
                      />
                      No
                    </label>
                  </Col>
                </Row>
                {/* level a,b & c */}
                {/* <label
                  style={{
                    margin: "15px",
                    fontWeight: "bold",
                    marginLeft: "42px",
                  }}
                >
                  Multi Level
                  
                </label> */}
                <div style={{}}>
                  <Row style={{ marginLeft: "25px", marginTop: "15px" }}>
                    <Col className="md-4">
                      <span style={{ fontWeight: "bold" }}>Multi Level :</span>
                      <label style={{ marginLeft: "25px" }}>
                        <Field
                          type="checkbox"
                          name="settings[3].value"
                          checked={values.settings[3].value}
                          onChange={() =>
                            setFieldValue(
                              "settings[3].value",
                              !values.settings[3].value
                            )
                          }
                        />
                        {"  "}
                        LevelA
                      </label>

                      {values.settings[3].value === true && (
                        <Field
                          style={{ marginLeft: "15px" }}
                          type="text"
                          name="settings[3].label"
                          // checked={values.settings[4].value}
                          onChange={(event) =>
                            setFieldValue(
                              "settings[3].label",
                              event.target.value
                            )
                          }
                        />
                      )}
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: "142px", marginTop: "25px" }}>
                    {values.settings[3].value === true && (
                      <Col className="md-4">
                        <label>
                          <Field
                            type="checkbox"
                            name="settings[4].value"
                            checked={values.settings[4].value}
                            onChange={() =>
                              setFieldValue(
                                "settings[4].value",
                                !values.settings[4].value
                              )
                            }
                          />{" "}
                          LevelB
                        </label>
                        {values.settings[4].value === true && (
                          <Field
                            style={{ marginLeft: "15px" }}
                            type="text"
                            name="settings[4].label"
                            // checked={values.settings[4].value}
                            onChange={(e) =>
                              setFieldValue("settings[4].label", e.target.value)
                            }
                          />
                        )}
                      </Col>
                    )}
                  </Row>
                  <Row style={{ marginLeft: "142px", marginTop: "25px" }}>
                    {values.settings[4].value === true && (
                      <Col className="md-4">
                        <label>
                          <Field
                            type="checkbox"
                            name="settings[5].value"
                            checked={values.settings[5].value}
                            onChange={() =>
                              setFieldValue(
                                "settings[5].value",
                                !values.settings[5].value
                              )
                            }
                          />{" "}
                          LevelC
                        </label>
                        {values.settings[5].value === true && (
                          <Field
                            type="text"
                            name="settings[5].label"
                            style={{ marginLeft: "15px" }}
                            // checked={values.settings[4].value}
                            onChange={(e) =>
                              setFieldValue("settings[5].label", e.target.value)
                            }
                          />
                        )}
                      </Col>
                    )}
                  </Row>
                </div>
                <Row style={{ marginLeft: "25px" }}>
                  <Col className="md-4" style={{ marginTop: "15px" }}>
                    <button className="btn btn-success" type="submit">
                      Submit
                    </button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

// freeQty: "",
//               multiRate: "",
//               multiDis: "",
//               multiLevel: "",

// <Row>
//                   <Col lg="3" className="p-0">
//
//                     <Form.Group>
//                                         <Form.Label>Free Qty</Form.Label>
//                                         <br />
//                       <div className="genderhorizotal">
//
//                         <Form.Check
//                           type="radio"
//                           name="settings[0].value"
//                           value={true}
//                           checked={values.settings[0].value === true}
//                           onChange={() =>
//                             setFieldValue("settings[0].value", true)
//                           }
//                         />
//
//                         <Form.Check
//                           type="radio"
//                           name="settings[0].value"
//                           value={false}
//                           checked={values.settings[0].value === false}
//                           onChange={() =>
//                             setFieldValue("settings[0].value", false)
//                           }
//                         />
//
//                       </div>
//
//                     </Form.Group>
//
//                   </Col>
//                 </Row>
