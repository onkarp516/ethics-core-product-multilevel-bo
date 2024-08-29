import { React, useState } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  EMAILREGEXP,
  OnlyEnterNumbers,
  getValue,
  getSelectValue,
  AuthenticationCheck,
  MyDatePicker,
  ledger_select,
  MyTextDatePicker,
  MyNotifications,
} from "@/helpers";
import moment from "moment";
import {
  faEye,
  faEyedropper,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Step2(props) {
  const curDate = new Date();
  let dt = new Date();
  const { values, handleChange, errors, setFieldValue, touched } = props;
  dt = moment(curDate).format("DD/MM/YYYY");
  // dt = curDate.getTime();
  // console.log("curDate", dt);

  const [showPassword, setShowPassword] = useState(true);

  const togglePasswordVisiblity = () => {
    setShowPassword(showPassword ? false : true);
  };
  return (
    <>
      <Row className="mt-2">
        <Col md="12" className="mb-2">
          <h5 className="Mail-title">Admin Details</h5>
          <Row className="">
            <Col lg={3}>
              <Row>
                <Col lg={3}>
                  <Form.Label>
                    Full Name
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col lg={9}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      name="fullName"
                      className="text-box"
                      id="fullName"
                      onChange={handleChange}
                      value={values.fullName}
                    />
                    <span className="text-danger errormsg">
                      {errors.fullName}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col lg={3}>
              <Row>
                <Col lg={3}>
                  <Form.Label>
                    Mobile No <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col lg={9}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Mobile No"
                      className="text-box"
                      name="contactNumber"
                      id="contactNumber"
                      onKeyPress={(e) => {
                        OnlyEnterNumbers(e);
                      }}
                      onChange={handleChange}
                      value={values.contactNumber}
                      maxLength={10}
                    />
                    <span className="text-danger errormsg">
                      {errors.contactNumber}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col lg={3}>

              <Row>
                <Col lg={4}>
                  <Form.Label>Date of anniversary</Form.Label>
                </Col>
                <Col lg={6}>
                  <MyTextDatePicker
                    innerRef={(input) => {
                      // this.invoiceDateRef.current = input;
                    }}
                    // className="text-box "
                    className="tnx-pur-inv-date-style "
                    name="userDoa"
                    id="userDoa"
                    placeholder="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    value={values.userDoa}
                    onChange={handleChange}
                    onBlur={(e) => {
                      if (e.target.value != null && e.target.value != "") {
                        console.warn(
                          "sid:: isValid",
                          moment(e.target.value, "DD-MM-YYYY").isValid()
                        );
                        if (
                          moment(e.target.value, "DD-MM-YYYY").isValid() == true
                        ) {
                          let cDate = moment(dt, "DD-MM-YYYY").toDate();
                          let expDate = moment(
                            e.target.value,
                            "DD-MM-YYYY"
                          ).toDate();
                          console.log(cDate <= expDate);
                          if (cDate.getTime() >= expDate.getTime()) {
                            console.log(e.target.value);
                            setFieldValue("userDoa", e.target.value);
                          } else {
                            console.log("date is greater than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Anniversary date can't be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("userDoa", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid anniversary date",
                            is_button_show: true,
                          });
                          setFieldValue("userDoa", "");
                        }
                      } else {
                        setFieldValue("userDoa", "");
                      }
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={3}>
              <Row>
                <Col lg={4}>
                  <Form.Label>Date of birth</Form.Label>
                </Col>
                <Col lg={6}>
                  <MyTextDatePicker
                    innerRef={(input) => {
                      // this.invoiceDateRef.current = input;
                    }}
                    className="tnx-pur-inv-date-style "
                    name="userDob"
                    id="userDob"
                    placeholder="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    value={values.userDob}
                    onChange={handleChange}
                    onBlur={(e) => {
                      if (e.target.value != null && e.target.value != "") {
                        console.warn(
                          "sid:: isValid",
                          moment(e.target.value, "DD-MM-YYYY").isValid()
                        );
                        if (
                          moment(e.target.value, "DD-MM-YYYY").isValid() == true
                        ) {
                          let cDate = moment(dt, "DD-MM-YYYY").toDate();
                          let expDate = moment(
                            e.target.value,
                            "DD-MM-YYYY"
                          ).toDate();
                          console.log(cDate <= expDate);
                          if (cDate.getTime() >= expDate.getTime()) {
                            console.log(e.target.value);
                            setFieldValue("userDob", e.target.value);
                          } else {
                            console.log("date is greater than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Birth date can't be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("userDob", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid birth date",
                            is_button_show: true,
                          });
                          setFieldValue("userDob", "");
                        }
                      } else {
                        setFieldValue("userDob", "");
                      }
                    }}
                  />
                </Col>
              </Row>
            </Col>


          </Row>
          <Row className="mt-3">
            <Col lg={3}>
              <Row>
                <Col lg={4}>
                  <Form.Label className="mb-0">
                    Gender
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col lg={8}>
                  <Form.Group className="gender1 custom-control-inline radiotag d-flex">
                    <Form.Check
                      type="radio"
                      label="Male"
                      className="pr-3 pe-2"
                      name="gender"
                      id="gender1"
                      value="male"
                      onChange={handleChange}
                      checked={values.gender == "male" ? true : false}
                    />
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="gender"
                      id="gender2"
                      value="female"
                      className=""
                      onChange={handleChange}
                      checked={values.gender == "female" ? true : false}
                    />
                  </Form.Group>
                  <span className="text-danger errormsg">
                    {errors.gender && "Select Gender"}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col md={3}>
              <Row>
                <Col md={3}>
                  <Form.Label>Email</Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Email"
                      name="emailId"
                      className="text-box"
                      id="emailId"
                      onChange={handleChange}
                      value={values.emailId}
                    />
                    <span className="text-danger errormsg">
                      {errors.emailId}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>

            <Col lg={3}>
              <Row>
                <Col lg={4}>
                  <Form.Label>
                    Username
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col lg={6}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      name="usercode"
                      className="text-box"
                      id="usercode"
                      onChange={handleChange}
                      value={values.usercode}
                      onBlur={(e) => {
                        e.preventDefault();
                        // this.validateUserDuplicate(values.usercode);
                        // alert("On Blur Call");
                      }}
                    />
                    <span className="text-danger errormsg">
                      {errors.usercode}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            {values.id === "" && (
              <Col lg={3}>
                <Row>
                  <Col lg={4}>
                    <Form.Label>
                      Password
                      <span className="text-danger">*</span>
                    </Form.Label>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <InputGroup className="mb-2  mdl-text">
                        <Form.Control
                          type="text"
                          style={{

                            webkitTextSecurity:
                              showPassword != "" ? "disc" : "unset",
                            // border: "1px solid #dcdcdc",
                            paddingLeft: '6px'

                          }}
                          placeholder="Password"
                          name="password"
                          className="mdl-text-box"
                          id="password"
                          onChange={handleChange}
                          value={values.password}
                        />
                        <InputGroup.Text style={{ border: "none" }}>
                          {showPassword != "" ? (
<FontAwesomeIcon
icon={faEyeSlash}
onClick={() => {
  togglePasswordVisiblity(false);
}}
/>                     
                          ) : (
                            <FontAwesomeIcon
                            icon={faEye}
                            onClick={() => {
                              togglePasswordVisiblity(true);
                            }}
                          />
                          )}
                        </InputGroup.Text>
                      </InputGroup>
                      <span className="text-danger errormsg">
                        {errors.password}
                      </span>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            )}




            {!values.id == "" && <Col md="3"></Col>}

          </Row>
        </Col>
      </Row>
    </>
  );
}
