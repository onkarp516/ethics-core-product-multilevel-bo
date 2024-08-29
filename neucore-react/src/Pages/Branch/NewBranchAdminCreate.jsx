import { Formik } from "formik";
import * as Yup from "yup";

import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
} from "react-bootstrap";
import {
  ledger_select,
  MyTextDatePicker,
  MyNotifications,
  truncateString,
  OnlyAlphabets,
  OnlyEnterNumbers,
  AuthenticationCheck,
  companystyle,
  getSelectValue,
  getValue,
  eventBus,
  EMAILREGEXP,
  GSTINREX,
} from "@/helpers";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";

import {
  faEye,
  faEyedropper,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
export default class NewBranchAdminCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      opendiv: false,
      opCompanyList: [],
      opBranchList: [],
      user_options: [],
      data: [],
      BranchInitVal: {
        id: "",
        companyId: "",
        branchId: "",
        fullName: "",
        role: "",
        mobileNumber: "",
        userRole: "BADMIN",
        email: "",
        gender: "",
        usercode: "",
        password: "",
        showPassword: false,
      },
    };
    this.ref = React.createRef();
  }

  togglePasswordVisiblity = (status) => {
    this.setState({ showPassword: status });
  };

  render() {
    const {
      opCompanyList,
      opendiv,
      data,
      BranchInitVal,
      opBranchList,
      showPassword,
    } = this.state;
    return (
      <div>
        <div className="branchcreate">
          <Formik>
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
              <Form onSubmit={handleSubmit} autoComplete="off">
                <div className="branch-inner-div">
                  <Row>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        className="my-auto"
                        style={{
                          // flex: 1,
                          height: "1px",
                          backgroundColor: "rgb(181 174 174)",
                        }}
                      />

                      <div>
                        <p
                          style={{ textAlign: "center", marginBottom: "0" }}
                          className="px-2 heding"
                        >
                          Correspondence
                        </p>
                      </div>

                      <div
                        className="my-auto"
                        style={{
                          flex: 1,
                          height: "1px",
                          backgroundColor: " #D9D9D9",
                        }}
                      />
                    </div>
                    <Col lg={6} md={6} sm={6} xs={6}>
                      <Row>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Label>Company Name</Form.Label>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                              <Form.Group>
                                <Select
                                  autoFocus={true}
                                  className="selectTo"
                                  styles={ledger_select}
                                  placeholder="Country"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={6} md={6} sm={6} xs={6}>
                          <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Label>Branch Name</Form.Label>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                              <Form.Group>
                                <Select
                                  className="selectTo"
                                  styles={ledger_select}
                                  placeholder="Branch Name"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={6}>
                      <Row>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Label> Full Name.</Form.Label>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                              <Form.Group>
                                <Form.Control
                                  className="co_text_box"
                                  placeholder=" Whatsapp No."
                                  type="text"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <Row>
                            <Col lg={3} md={3} sm={3} xs={3}>
                              {" "}
                              <Form.Label>Gender</Form.Label>
                            </Col>
                            <Col lg="9">
                              {" "}
                              <Form.Group className="d-flex label_style">
                                <Form.Check
                                  type="radio"
                                  label="Male"
                                  name="gender"
                                  id="gender1"
                                  value="male"
                                  // onChange={handleChange}
                                  // checked={values.gender == "male" ? true : false}
                                />
                                <Form.Check
                                  type="radio"
                                  label="Female"
                                  name="gender"
                                  id="gender2"
                                  value="female"
                                  className=""
                                  // onChange={handleChange}
                                  // checked={
                                  //   values.gender == "female" ? true : false
                                  // }
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} md={6} sm={6} xs={6}>
                      <Row>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Label>Email</Form.Label>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                              <Form.Group>
                                <Form.Control
                                  className="co_text_box"
                                  placeholder="Email"
                                  type="text"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={6} md={6} sm={6} xs={6}>
                          <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Label>Mobile No.</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Form.Group>
                                <Form.Control
                                  className="co_text_box"
                                  placeholder="Mobile No"
                                  type="text"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={6}>
                      <Row>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Label>Username</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Form.Group>
                                <Form.Control
                                  className="co_text_box"
                                  placeholder="Username"
                                  type="text"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Label>Password</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              {/* <InputGroup>
                                <Form.Control
                                  type="text"
                                  style={{
                                    webkitTextSecurity:
                                      showPassword != "" ? "disc" : "unset",
                                    border: "1px solid #dcdcdc",
                                  }}
                                  placeholder="Password"
                                  name="password"
                                  id="password"
                                  onChange={handleChange}
                                  value={values.password}
                                  invalid={errors.password ? true : false}
                                />
                                <InputGroup.Text>
                                  {showPassword == "" ? (
                                    <FontAwesomeIcon
                                      icon={faEye}
                                      onClick={() => {
                                        this.togglePasswordVisiblity(
                                          !showPassword
                                        );
                                      }}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faEyeSlash}
                                      onClick={() => {
                                        this.togglePasswordVisiblity(
                                          !showPassword
                                        );
                                      }}
                                    />
                                  )}
                                </InputGroup.Text>
                              </InputGroup> */}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <Row className="style-btn">
                  <Col lg={12} className="text-end">
                    <Button className="successbtn-style  me-2" type="submit">
                      Submit
                    </Button>
                    <Button
                      variant="secondary cancel-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        // console.log("reset");
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
                                from: "newBranchAdminCreate",
                                to: "branchList",
                                isNewTab: false,
                                isCancel: true,
                              });
                            },
                            handleFailFn: () => {},
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
      </div>
    );
  }
}
