import React from "react";

import { Button, Col, Row, Form, InputGroup, Input } from "react-bootstrap";

import Select from "react-select";
import {
  ledger_select,
  MyTextDatePicker,
  MyNotifications,
  truncateString,
  OnlyAlphabets,
  OnlyEnterNumbers,
} from "@/helpers";
import moment from "moment";
import "mousetrap-global-bind";

const CustomClearText = () => "clear all";
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles("clearIndicator", props)}
    >
      <div style={{ padding: "0px 5px" }}>{children}</div>
    </div>
  );
};

export default function Step1(props) {
  const curDate = new Date();
  let dt = new Date();
  const {
    values,
    handleChange,
    errors,
    setFieldValue,
    countryOpt,
    stateOpt,
    GSTopt,
    Currencyopt,
  } = props;
  dt = moment(curDate).format("DD/MM/YYYY");
  // dt = curDate.getTime();
  // console.log("curDate", dt);

  return (
    <>
      <Row className="mt-2">
        <Col md="12">
          <h5 className="Mail-title">Institute Details</h5>

          <Row>
            <Col lg={7} style={{ borderRight: "1px solid #dcdcdc" }}>
              <Row className="mb-2">
                <Col md={2}>
                  <Form.Label>
                    Company Name <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col md="4">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      autoFocus="true"
                      placeholder="Company Name"
                      className="text-box"
                      name="companyName"
                      id="companyName"
                      onChange={handleChange}
                      value={values.companyName}
                      onBlur={(e) => {
                        e.preventDefault();
                        this.validateCompanyDuplicate(values.companyName);
                        // alert("On Blur Call");
                      }}
                    />
                    <span className="text-danger errormsg">
                      {errors.companyName}
                    </span>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Label>Company Code</Form.Label>
                </Col>
                <Col md="4">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Company Code"
                      name="companyCode"
                      className="text-box"
                      id="companyCode"
                      onChange={handleChange}
                      value={values.companyCode}
                    />
                    <span className="text-danger errormsg">
                      {errors.companyCode}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={2}>
                  <Form.Label>Register Address</Form.Label>
                </Col>
                <Col md="4">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      style={{
                        height: "50px",
                        resize: "none",
                      }}
                      name="registeredAddress"
                      id="registeredAddress"
                      placeholder="Register Address"
                      className="text-box mt-auto"
                      onChange={(e) => {
                        setFieldValue("registeredAddress", e.target.value);
                        setFieldValue(
                          "corporateAddress",
                          values.sameAsAddress === true ? e.target.value : ""
                        );
                      }}
                      value={values.registeredAddress}
                    />
                    <span className="text-danger errormsg">
                      {errors.registeredAddress}
                    </span>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Label>
                    Corporate Address
                    <Form.Check
                      type="checkbox"
                      // id="custom-switch"
                      label="same as register"
                      name="sameAsAddress"
                      id="sameAsAddress"
                      onChange={() => {
                        setFieldValue("sameAsAddress", !values.sameAsAddress);

                        setFieldValue(
                          "corporateAddress",
                          !values.sameAsAddress === true
                            ? values.registeredAddress
                            : ""
                        );
                      }}
                      value={values.sameAsAddress}
                    />
                  </Form.Label>
                </Col>
                <Col md="4">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      style={{
                        height: "50px",
                        resize: "none",
                      }}
                      className="text-box mt-auto"
                      name="corporateAddress"
                      id="corporateAddress"
                      placeholder="Corporate Address"
                      onChange={handleChange}
                      value={values.corporateAddress}
                    />
                    <span className="text-danger errormsg">
                      {errors.corporateAddress}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                {/* <Col lg={7}>
                  <Row> */}
                <Col md={2}>
                  <Form.Label>Trade Of Business</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Group className="mt-2 d-flex" style={{ fontSize: "14px" }}>
                    <Form.Check
                      type="radio"
                      label="Retailer"
                      className="checkbox-text"
                      id="Retailer"
                      name="tradeOfBusiness"
                      value="retailer"
                      checked={
                        values.tradeOfBusiness == "retailer" ? true : false
                      }
                      onChange={handleChange}
                    />
                    <Form.Check
                      className="ms-2 checkbox-text"
                      type="radio"
                      label="Manufaturer"
                      id="Manufaturer"
                      name="tradeOfBusiness"
                      value="manufacturer"
                      checked={
                        values.tradeOfBusiness == "manufacturer" ? true : false
                      }
                      onChange={handleChange}
                    />
                    <Form.Check
                      className="ms-2 checkbox-text"
                      type="radio"
                      label="Distributor"
                      id="distributor"
                      name="tradeOfBusiness"
                      value="distributor"
                      checked={
                        values.tradeOfBusiness == "distributor" ? true : false
                      }
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                {/* </Row>
                </Col> */}

                <Col md={2}>
                  <Form.Label>Nature Of Business</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Nature of business"
                      name="natureOfBusiness"
                      id="natureOfBusiness"
                      onChange={handleChange}
                      value={values.natureOfBusiness}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md="2">
                  <Form.Label className="mb-0">
                    Multi Branch
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col md="4">
                  <Form.Group className="mb-2 d-flex">
                    <Form.Check
                      type="radio"
                      label="Yes"
                      className="pr-3 checkbox-text"
                      name="multiBranch"
                      id="BranchYes"
                      onClick={() => {
                        setFieldValue("multiBranch", "yes");
                      }}
                      value="yes"
                      checked={values.multiBranch == "yes" ? true : false}
                    />
                    <Form.Check
                      className="ms-2 checkbox-text"
                      type="radio"
                      label="No"
                      name="multiBranch"
                      id="BranchNo"
                      onClick={() => {
                        setFieldValue("multiBranch", "no");
                        setFieldValue("gstIn", "");
                        setFieldValue("gstType", "");
                      }}
                      value="no"
                      checked={values.multiBranch == "no" ? true : false}
                    />
                  </Form.Group>
                  <span className="text-danger errormsg">
                    {errors.multiBranch}
                  </span>
                </Col>

                <Col lg={2}>
                  <Form.Label htmlFor="employeeType">Company Logo</Form.Label>
                </Col>
                <Col lg={4} className="">
                  <Form.Group>
                    <div className="custom-file">
                      <Form.Control
                        type="file"
                        name="companyLogo"
                        className="custom-file-input m-0"
                        onChange={(e) => {
                          setFieldValue("companyLogo", e.target.files[0]);
                        }}
                        style={{
                          border: "1px groove #d9d9d9",
                          marginTop: "5px",
                          borderRadius: "1px",
                          padding: "7px",
                          height: "35px",
                          fontSize: "12px",
                        }}
                      />
                    </div>
                    <span className="text-danger errormsg">
                      {errors.companyLogo}
                    </span>
                  </Form.Group>
                </Col>
                {values.id !== "" && (
                  <Col md="4">
                    <Form.Group>
                      <Form.Label htmlFor="employeeType">
                        Previous Logo
                      </Form.Label>
                      <div className="custom-file">
                        <img
                          src={values.previousLogo}
                          alt=""
                          style={{ width: "100px", height: "100px" }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                )}
              </Row>
            </Col>
            <Col lg={5}>
              <Row className="mb-2">
                <Col md={2}>
                  <Form.Label>License No</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="License No"
                      name="licenseNo"
                      id="licenseNo"
                      onChange={handleChange}
                      value={values.licenseNo}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Label>License Expiry</Form.Label>
                </Col>
                <Col md={3}>
                  <MyTextDatePicker
                    innerRef={(input) => {
                      //   this.invoiceDateRef.current = input;
                    }}
                    className="text-box"
                    name="licenseExpiryDate"
                    id="licenseExpiryDate"
                    placeholder="DD/MM/YYYY"
                    // dateFormat="DD/MM/YYYY"
                    value={values.licenseExpiryDate}
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
                          if (cDate.getTime() <= expDate.getTime()) {
                            console.log(e.target.value);
                            setFieldValue("licenseExpiryDate", e.target.value);
                          } else {
                            console.log("date is less than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Expiry Date should be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("licenseExpiryDate", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid Date",
                            is_button_show: true,
                          });
                          setFieldValue("licenseExpiryDate", "");
                        }
                      } else {
                        setFieldValue("licenseExpiryDate", "");
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={2}>
                  <Form.Label>FSSAI No.</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Food License No"
                      name="foodLicenseNo"
                      id="foodLicenseNo"
                      onChange={handleChange}
                      value={values.foodLicenseNo}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Label>FSSAI Expiry</Form.Label>
                </Col>
                <Col md={3}>
                  <MyTextDatePicker
                    // innerRef={(input) => {
                    //   this.invoiceDateRef.current = input;
                    // }}
                    className="text-box "
                    name="foodLicenseExpiryDate"
                    id="foodLicenseExpiryDate"
                    placeholder="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    value={values.foodLicenseExpiryDate}
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
                          if (cDate.getTime() <= expDate.getTime()) {
                            console.log(e.target.value);
                            setFieldValue(
                              "foodLicenseExpiryDate",
                              e.target.value
                            );
                          } else {
                            console.log("date is less than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Expiry Date should be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("foodLicenseExpiryDate", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid Date",
                            is_button_show: true,
                          });
                          setFieldValue("foodLicenseExpiryDate", "");
                        }
                      } else {
                        setFieldValue("foodLicenseExpiryDate", "");
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={2}>
                  <Form.Label>Mfg. License No.</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Mfg. License No"
                      name="manufacturingLicenseNo"
                      id="manufacturingLicenseNo"
                      onChange={handleChange}
                      value={values.manufacturingLicenseNo}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Label>Mfg. Expiry</Form.Label>
                </Col>
                <Col md={3}>
                  <MyTextDatePicker
                    // innerRef={(input) => {
                    //   this.invoiceDateRef.current = input;
                    // }}
                    className="text-box"
                    name="manufacturingLicenseExpiry"
                    id="manufacturingLicenseExpiry"
                    placeholder="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    value={values.manufacturingLicenseExpiry}
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
                          if (cDate.getTime() <= expDate.getTime()) {
                            console.log(e.target.value);
                            setFieldValue(
                              "manufacturingLicenseExpiry",
                              e.target.value
                            );
                          } else {
                            console.log("date is less than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Expiry Date should be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("manufacturingLicenseExpiry", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid Date",
                            is_button_show: true,
                          });
                          setFieldValue("manufacturingLicenseExpiry", "");
                        }
                      } else {
                        setFieldValue("manufacturingLicenseExpiry", "");
                      }
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <hr className="mt-3" />

          {/* <Row className="mb-2">
            <Col md={1}>
              <Form.Label>
                Company Name <span className="text-danger">*</span>
              </Form.Label>
            </Col>
            <Col md="3">
              <Form.Group>
                <Form.Control
                  type="text"
                  autoFocus="true"
                  placeholder="Company Name"
                  className="text-box"
                  name="companyName"
                  id="companyName"
                  onChange={handleChange}
                  value={values.companyName}
                  onBlur={(e) => {
                    e.preventDefault();
                    this.validateCompanyDuplicate(values.companyName);
                    // alert("On Blur Call");
                  }}
                />
                <span className="text-danger errormsg">
                  {errors.companyName}
                </span>
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Label>Company Code</Form.Label>
            </Col>
            <Col md="2">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Company Code"
                  name="companyCode"
                  className="text-box"
                  id="companyCode"
                  onChange={handleChange}
                  value={values.companyCode}
                />
                <span className="text-danger errormsg">
                  {errors.companyCode}
                </span>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Row>
                <Col md={4}>
                  <Form.Label>License No</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="License No"
                      name="licenseNo"
                      id="licenseNo"
                      onChange={handleChange}
                      value={values.licenseNo}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md={3}>
              <Row>
                <Col md={3}>
                  <Form.Label>License Expiry</Form.Label>
                </Col>
                <Col md={4}>
                  <MyTextDatePicker
                    innerRef={(input) => {
                      //   this.invoiceDateRef.current = input;
                    }}
                    className="text-box "
                    name="licenseExpiryDate"
                    id="licenseExpiryDate"
                    placeholder="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    value={values.licenseExpiryDate}
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
                          if (cDate.getTime() <= expDate.getTime()) {
                            console.log(e.target.value);
                            setFieldValue("licenseExpiryDate", e.target.value);
                          } else {
                            console.log("date is less than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Expiry Date should be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("licenseExpiryDate", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid Date",
                            is_button_show: true,
                          });
                          setFieldValue("licenseExpiryDate", "");
                        }
                      } else {
                        setFieldValue("licenseExpiryDate", "");
                      }
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={1}>
              <Form.Label>FSSAI No.</Form.Label>
            </Col>
            <Col md={1}>
              <Form.Group>
                <Form.Control
                  className="text-box"
                  type="text"
                  placeholder="Food License No"
                  name="foodLicenseNo"
                  id="foodLicenseNo"
                  onChange={handleChange}
                  value={values.foodLicenseNo}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Row>
                <Col md={4}>
                  <Form.Label>FSSAI Expiry</Form.Label>
                </Col>
                <Col md={5}>
                  <MyTextDatePicker
                    // innerRef={(input) => {
                    //   this.invoiceDateRef.current = input;
                    // }}
                    className="text-box "
                    name="foodLicenseExpiryDate"
                    id="foodLicenseExpiryDate"
                    placeholder="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    value={values.foodLicenseExpiryDate}
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
                          if (cDate.getTime() <= expDate.getTime()) {
                            console.log(e.target.value);
                            setFieldValue(
                              "foodLicenseExpiryDate",
                              e.target.value
                            );
                          } else {
                            console.log("date is less than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Expiry Date should be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("foodLicenseExpiryDate", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid Date",
                            is_button_show: true,
                          });
                          setFieldValue("foodLicenseExpiryDate", "");
                        }
                      } else {
                        setFieldValue("foodLicenseExpiryDate", "");
                      }
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={2}>
              <Row>
                <Col md={6}>
                  <Form.Label>Mfg. License No.</Form.Label>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Mfg. License No"
                      name="manufacturingLicenseNo"
                      id="manufacturingLicenseNo"
                      onChange={handleChange}
                      value={values.manufacturingLicenseNo}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md={2}>
              <Row>
                <Col md={4}>
                  <Form.Label>Mfg. Expiry</Form.Label>
                </Col>
                <Col md={6}>
                  <MyTextDatePicker
                    // innerRef={(input) => {
                    //   this.invoiceDateRef.current = input;
                    // }}
                    className="text-box "
                    name="manufacturingLicenseExpiry"
                    id="manufacturingLicenseExpiry"
                    placeholder="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    value={values.manufacturingLicenseExpiry}
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
                          if (cDate.getTime() <= expDate.getTime()) {
                            console.log(e.target.value);
                            setFieldValue(
                              "manufacturingLicenseExpiry",
                              e.target.value
                            );
                          } else {
                            console.log("date is less than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Expiry Date should be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("manufacturingLicenseExpiry", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid Date",
                            is_button_show: true,
                          });
                          setFieldValue("manufacturingLicenseExpiry", "");
                        }
                      } else {
                        setFieldValue("manufacturingLicenseExpiry", "");
                      }
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={1}>
              <Form.Label>Nature Of Business</Form.Label>
            </Col>
            <Col md={1}>
              <Form.Group>
                <Form.Control
                  className="text-box"
                  type="text"
                  placeholder="Nature of business"
                  name="natureOfBusiness"
                  id="natureOfBusiness"
                  onChange={handleChange}
                  value={values.natureOfBusiness}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={1}>
              <Form.Label>Register Address</Form.Label>
            </Col>
            <Col md="3">
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  style={{
                    height: "50px",
                    resize: "none",
                  }}
                  name="registeredAddress"
                  id="registeredAddress"
                  placeholder="Register Address"
                  className="text-box"
                  onChange={(e) => {
                    setFieldValue("registeredAddress", e.target.value);
                    setFieldValue(
                      "corporateAddress",
                      values.sameAsAddress === true ? e.target.value : ""
                    );
                  }}
                  value={values.registeredAddress}
                />
                <span className="text-danger errormsg">
                  {errors.registeredAddress}
                </span>
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Label>
                Corporate Address
                <Form.Check
                  type="checkbox"
                  // id="custom-switch"
                  label="same as register"
                  name="sameAsAddress"
                  id="sameAsAddress"
                  onChange={() => {
                    setFieldValue("sameAsAddress", !values.sameAsAddress);

                    setFieldValue(
                      "corporateAddress",
                      !values.sameAsAddress === true
                        ? values.registeredAddress
                        : ""
                    );
                  }}
                  value={values.sameAsAddress}
                />
              </Form.Label>
            </Col>
            <Col md="3">
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  style={{
                    height: "50px",
                    resize: "none",
                  }}
                  className="text-box"
                  name="corporateAddress"
                  id="corporateAddress"
                  placeholder="Corporate Address"
                  onChange={handleChange}
                  value={values.corporateAddress}
                />
                <span className="text-danger errormsg">
                  {errors.corporateAddress}
                </span>
              </Form.Group>
            </Col>
            <Col md={1}>
              <Form.Label>Trade Of Business</Form.Label>
            </Col>
            <Col md={3} className="d-flex">
              <Form.Group className="mb-2 d-flex">
                <Form.Check
                  type="radio"
                  label="Retailer"
                  className="pr-3"
                  id="Retailer"
                  name="tradeOfBusiness"
                />
                <Form.Check
                  className="ms-2"
                  type="radio"
                  label="Manufature"
                  id="Manufature"
                  name="tradeOfBusiness"
                />
                <Form.Check
                  className="ms-2"
                  type="radio"
                  label="Distributor"
                  id="Distributor"
                  name="tradeOfBusiness"
                />
              </Form.Group>
            </Col>

            <Col md="1">
              <Form.Label className="mb-0">
                Company Have Multiple Branches
              </Form.Label>
            </Col>
            <Col md="1">
              <Form.Group className="mb-2 d-flex">
                <Form.Check
                  type="radio"
                  label="Yes"
                  className="pr-3"
                  name="multiBranch"
                  id="BranchYes"
                  onClick={() => {
                    setFieldValue("multiBranch", "yes");
                  }}
                  value="yes"
                  checked={values.multiBranch == "yes" ? true : false}
                />
                <Form.Check
                  className="ms-2"
                  type="radio"
                  label="No"
                  name="multiBranch"
                  id="BranchNo"
                  onClick={() => {
                    setFieldValue("multiBranch", "no");
                    setFieldValue("gstIn", "");
                    setFieldValue("gstType", "");
                  }}
                  value="no"
                  checked={values.multiBranch == "no" ? true : false}
                />
              </Form.Group>
              <span className="text-danger errormsg">{errors.multiBranch}</span>
            </Col>

            <Col md="4">
              <Form.Group>
                <Form.Label htmlFor="employeeType">
                  {values.companyLogo
                    ? "Selected " + truncateString(values.companyLogo.name, 20)
                    : "Upload Logo"}
                </Form.Label>
                <div className="custom-file">
                  <Form.Control
                    type="file"
                    name="companyLogo"
                    className="custom-file-input"
                    onChange={(e) => {
                      setFieldValue("companyLogo", e.target.files[0]);
                    }}
                  />
                </div>
                <span className="text-danger errormsg">
                  {errors.companyLogo}
                </span>
              </Form.Group>
            </Col>
            {values.id !== "" && (
              <Col md="4">
                <Form.Group>
                  <Form.Label htmlFor="employeeType">Previous Logo</Form.Label>
                  <div className="custom-file">
                    <img
                      src={values.previousLogo}
                      alt=""
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                </Form.Group>
              </Col>
            )}
          </Row> */}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="12">
          <h5 className="Mail-title">Correspondence</h5>

          <Row className="px-1">
            <Col lg={6} style={{ borderRight: "1px solid #dcdcdc" }}>
              <Row className="mb-2">
                <Col md="2">
                  <Form.Label>
                    Country
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col md="3">
                  <Select
                    className="selectTo"
                    styles={ledger_select}
                    closeMenuOnSelect={true}
                    components={{ ClearIndicator }}
                    onChange={(v) => {
                      setFieldValue("countryId", v);
                    }}
                    name="countryId"
                    id="countryId"
                    value={values.countryId}
                    options={countryOpt}
                  />
                  <span className="text-danger errormsg">
                    {errors.countryId}
                  </span>
                </Col>
                <Col lg={2}>
                  <Form.Label>
                    State
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col lg={3}>
                  <Select
                    className="selectTo"
                    styles={ledger_select}
                    closeMenuOnSelect={true}
                    components={{ ClearIndicator }}
                    onChange={(v) => {
                      setFieldValue("stateId", v);
                    }}
                    name="stateId"
                    id="stateId"
                    value={values.stateId}
                    options={stateOpt}
                  />
                  <span className="text-danger errormsg">{errors.stateId}</span>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={2}>
                  <Form.Label>District</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="District"
                      name="district"
                      onKeyPress={(e) => {
                        OnlyAlphabets(e);
                      }}
                      id="district"
                      onChange={handleChange}
                      value={values.district}
                      maxLength={10}
                    />
                    <span className="text-danger errormsg">
                      {errors.district}
                    </span>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Label>Place</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Place"
                      name="place"
                      onKeyPress={(e) => {
                        OnlyAlphabets(e);
                      }}
                      id="place"
                      onChange={handleChange}
                      value={values.place}
                      maxLength={10}
                    />
                    <span className="text-danger errormsg">{errors.place}</span>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                {/* <Col md={2}>
                  <Form.Label>Route</Form.Label>
                </Col> */}
                {/* <Col md={3}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Enter Route"
                      name="route"
                      id="route"
                      value={values.route}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col> */}
                <Col md="2">
                  <Form.Label>Pincode</Form.Label>
                </Col>
                <Col md="3">
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Pincode"
                      name="pincode"
                      id="pincode"
                      onKeyPress={(e) => {
                        OnlyEnterNumbers(e);
                      }}
                      onChange={handleChange}
                      value={values.pincode}
                      maxLength={6}
                    />
                    <span className="text-danger errormsg">
                      {errors.pincode}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md="2">
                  <Form.Label>Mobile No.</Form.Label>
                </Col>
                <Col md="3">
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Mobile No"
                      name="mobileNumber"
                      id="mobileNumber"
                      onKeyPress={(e) => {
                        OnlyEnterNumbers(e);
                      }}
                      onChange={(e) => {
                        let mob = e.target.value;
                        setFieldValue("mobileNumber", mob);
                        setFieldValue("whatsappNumber", mob);
                      }}
                      value={values.mobileNumber}
                      maxLength={10}
                    />
                    <span className="text-danger errormsg">
                      {errors.mobileNumber}
                    </span>
                  </Form.Group>
                </Col>

                <Col md="2">
                  <Form.Label>Whatsapp No.</Form.Label>
                </Col>
                <Col md="3">
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Whatsapp No."
                      name="whatsappNumber"
                      id="whatsappNumber"
                      onKeyPress={(e) => {
                        OnlyEnterNumbers(e);
                      }}
                      onChange={handleChange}
                      value={values.whatsappNumber}
                      maxLength={10}
                    />
                    <span className="text-danger errormsg">
                      {errors.whatsappNumber}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <Row className="mb-2">
                <Col md="2">
                  <Form.Label>Website </Form.Label>
                </Col>
                <Col md="3">
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Website"
                      aria-describedby="inputGroupPrepend"
                      name="website"
                      id="website"
                      onChange={handleChange}
                      value={values.website}
                    />
                  </Form.Group>
                </Col>
                <Col lg={2}>
                  <Form.Label>Email</Form.Label>
                </Col>
                <Col lg={4}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Email"
                      name="email"
                      id="email"
                      onChange={handleChange}
                      value={values.email}
                    />
                    <span className="text-danger errormsg">{errors.email}</span>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md="2">
                  <Form.Label className="mb-0">
                    GST Applicability
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                </Col>
                <Col md="3 mt-2">
                  <Form.Group className="mb-2 d-flex">
                    <Form.Check
                      type="radio"
                      label="Yes"
                      className="pr-3 checkbox-text"
                      name="gstApplicable"
                      id="GSTYes"
                      onClick={() => {
                        setFieldValue("gstApplicable", "yes");
                      }}
                      value="yes"
                      checked={values.gstApplicable == "yes" ? true : false}
                    />
                    <Form.Check
                      className="ms-2 checkbox-text"
                      type="radio"
                      label="No"
                      name="gstApplicable"
                      id="GSTNo"
                      defaultChecked
                      onClick={() => {
                        setFieldValue("gstApplicable", "no");
                        setFieldValue("gstIn", "");
                        setFieldValue("gstType", "");
                      }}
                      value="no"

                      checked={values.gstApplicable && values.gstApplicable == "yes"
                        ? false
                        : true

                      }
                    />
                  </Form.Group>
                  <span className="text-danger errormsg">
                    {errors.gstApplicable}
                  </span>
                </Col>
                <Col md="2">
                  <Form.Label>Currency</Form.Label>
                </Col>
                <Col md="2">
                  <Form.Group className="">
                    <Select
                      className="selectTo"
                      styles={ledger_select}
                      closeMenuOnSelect={true}
                      components={{ ClearIndicator }}
                      onChange={(v) => {
                        setFieldValue("currency", v);
                      }}
                      name="currency"
                      id="currency"
                      value={values.currency}
                      options={Currencyopt}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                {values.gstApplicable === "yes" ? (
                  <>
                    <Col md="2" className="mb-3">
                      <Form.Label>
                        GSTIN
                        <span className="text-danger">*</span>
                      </Form.Label>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <Form.Control
                          className="text-box"
                          type="text"
                          placeholder="GSTIN"
                          name="gstIn"
                          id="gstIn"
                          onChange={handleChange}
                          maxLength={15}
                          value={values.gstIn && values.gstIn.toUpperCase()}
                          //   isValid={touched.gstIn && !errors.gstIn}
                          //   isInvalid={!!errors.gstIn}
                        />
                      </Form.Group>
                      <span className="text-danger errormsg">
                        {errors.gstIn}
                      </span>
                    </Col>

                    <Col md="2">
                      <Form.Label>
                        GST Type
                        <span className="text-danger">*</span>
                      </Form.Label>
                    </Col>
                    <Col md="3">
                      <Form.Group className="">
                        <Select
                          className="selectTo"
                          styles={ledger_select}
                          closeMenuOnSelect={true}
                          components={{ ClearIndicator }}
                          onChange={(v) => {
                            setFieldValue("gstType", v);
                          }}
                          name="gstType"
                          id="gstType"
                          value={values.gstType}
                          options={GSTopt}
                        />
                        <span className="text-danger errormsg">
                          {errors.gstType}
                        </span>
                      </Form.Group>
                    </Col>
                    <Row>
                      <Col md="2">
                        <Form.Label>Applicable Date</Form.Label>
                      </Col>

                      <Col md="2" className="ms-1">
                        <MyTextDatePicker
                          innerRef={(input) => {
                            // this.invoiceDateRef.current = input;
                          }}
                          className="text-box "
                          name="gstApplicableDate"
                          id="gstApplicableDate"
                          placeholder="DD/MM/YYYY"
                          dateFormat="DD/MM/YYYY"
                          value={values.gstApplicableDate}
                          onChange={handleChange}
                          onBlur={(e) => {
                            if (
                              e.target.value != null &&
                              e.target.value != ""
                            ) {
                              console.warn(
                                "sid:: isValid",
                                moment(e.target.value, "DD-MM-YYYY").isValid()
                              );
                              if (
                                moment(
                                  e.target.value,
                                  "DD-MM-YYYY"
                                ).isValid() == true
                              ) {
                                let cDate = moment(dt, "DD-MM-YYYY").toDate();
                                let expDate = moment(
                                  e.target.value,
                                  "DD-MM-YYYY"
                                ).toDate();
                                console.log(cDate <= expDate);
                                if (cDate.getTime() >= expDate.getTime()) {
                                  console.log(e.target.value);
                                  setFieldValue(
                                    "gstApplicableDate",
                                    e.target.value
                                  );
                                } else {
                                  console.log(
                                    "date is greater than current date"
                                  );
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Applicable date can't be greater than Current Date",
                                    is_button_show: true,
                                  });
                                  setFieldValue("gstApplicableDate", "");
                                }
                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: "Invalid Applicable date",
                                  is_button_show: true,
                                });
                                setFieldValue("gstApplicableDate", "");
                              }
                            } else {
                              setFieldValue("gstApplicableDate", "");
                            }
                          }}
                        />
                        <span className="text-danger errormsg">
                          {errors.gstApplicableDate}
                        </span>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2} className="ms-1">
                        <Form.Label>GST trasnsfer date</Form.Label>
                      </Col>
                      <Col md={2} className="ms-1">
                        <MyTextDatePicker
                          innerRef={(input) => {
                            //   this.invoiceDateRef.current = input;
                          }}
                          className="text-box "
                          name="gstTransferDate"
                          id="gstTransferDate"
                          placeholder="DD/MM/YYYY"
                          dateFormat="DD/MM/YYYY"
                          value={values.gstTransferDate}
                          onChange={handleChange}
                          onBlur={(e) => {
                            if (
                              e.target.value != null &&
                              e.target.value != ""
                            ) {
                              console.warn(
                                "sid:: isValid",
                                moment(e.target.value, "DD-MM-YYYY").isValid()
                              );
                              if (
                                moment(
                                  e.target.value,
                                  "DD-MM-YYYY"
                                ).isValid() == true
                              ) {
                                setFieldValue(
                                  "gstTransferDate",
                                  e.target.value
                                );
                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: "Invalid transfer date",
                                  is_button_show: true,
                                });
                                setFieldValue("gstTransferDate", "");
                              }
                            } else {
                              setFieldValue("gstTransferDate", "");
                            }
                          }}
                        />
                      </Col>
                    </Row>
                  </>
                ) : (
                  ""
                )}
              </Row>
            </Col>
          </Row>

          {/* <Row className="mb-2">
            <Col md="1">
              <Form.Label>Pincode</Form.Label>
            </Col>
            <Col md="1">
              <Form.Group>
                <Form.Control
                  className="text-box"
                  type="text"
                  placeholder="Pincode"
                  name="pincode"
                  id="pincode"
                  onKeyPress={(e) => {
                    OnlyEnterNumbers(e);
                  }}
                  onChange={handleChange}
                  value={values.pincode}
                  maxLength={6}
                />
                <span className="text-danger errormsg">{errors.pincode}</span>
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Row>
                <Col lg={2}>
                  <Form.Label>Email</Form.Label>
                </Col>
                <Col lg={10}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Email"
                      name="email"
                      id="email"
                      onChange={handleChange}
                      value={values.email}
                    />
                    <span className="text-danger errormsg">{errors.email}</span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md="1">
              <Form.Label>Mobile No.</Form.Label>
            </Col>
            <Col md="1">
              <Form.Group>
                <Form.Control
                  className="text-box"
                  type="text"
                  placeholder="Mobile No"
                  name="mobileNumber"
                  id="mobileNumber"
                  onKeyPress={(e) => {
                    OnlyEnterNumbers(e);
                  }}
                  onChange={(e) => {
                    let mob = e.target.value;
                    setFieldValue("mobileNumber", mob);
                    setFieldValue("whatsappNumber", mob);
                  }}
                  value={values.mobileNumber}
                  maxLength={10}
                />
                <span className="text-danger errormsg">
                  {errors.mobileNumber}
                </span>
              </Form.Group>
            </Col>

            <Col md="1">
              <Form.Label>Whatsapp No.</Form.Label>
            </Col>
            <Col md="1">
              <Form.Group>
                <Form.Control
                  className="text-box"
                  type="text"
                  placeholder="Whatsapp No."
                  name="whatsappNumber"
                  id="whatsappNumber"
                  onKeyPress={(e) => {
                    OnlyEnterNumbers(e);
                  }}
                  onChange={handleChange}
                  value={values.whatsappNumber}
                  maxLength={10}
                />
                <span className="text-danger errormsg">
                  {errors.whatsappNumber}
                </span>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Row>
                <Col md={4}>
                  <Form.Label>Place</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="Place"
                      name="place"
                      onKeyPress={(e) => {
                        OnlyAlphabets(e);
                      }}
                      id="place"
                      onChange={handleChange}
                      value={values.place}
                      maxLength={10}
                    />
                    <span className="text-danger errormsg">{errors.place}</span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md="1">
              <Form.Label>
                Country
                <span className="text-danger">*</span>
              </Form.Label>
            </Col>
            <Col md="1">
              <Form.Group className="">
                <Select
                  className="selectTo"
                  styles={ledger_select}
                  closeMenuOnSelect={true}
                  components={{ ClearIndicator }}
                  onChange={(v) => {
                    setFieldValue("countryId", v);
                  }}
                  name="countryId"
                  id="countryId"
                  value={values.countryId}
                  options={countryOpt}
                />
                <span className="text-danger errormsg">{errors.countryId}</span>
              </Form.Group>
            </Col>

            <Col lg={3}>
              <Row>
                <Col lg={2}>
                  <Form.Label>
                    State
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col lg={10}>
                  <Form.Group className="">
                    <Select
                      className="selectTo"
                      styles={ledger_select}
                      closeMenuOnSelect={true}
                      components={{ ClearIndicator }}
                      onChange={(v) => {
                        setFieldValue("stateId", v);
                      }}
                      name="stateId"
                      id="stateId"
                      value={values.stateId}
                      options={stateOpt}
                    />
                    <span className="text-danger errormsg">
                      {errors.stateId}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md={2}>
              <Row>
                <Col md={4}>
                  <Form.Label>District</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="District"
                      name="district"
                      id="district"
                      onKeyPress={(e) => {
                        OnlyAlphabets(e);
                      }}
                      onChange={handleChange}
                      value={values.district}
                      maxLength={10}
                    />
                    <span className="text-danger errormsg">
                      {errors.district}
                    </span>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md="1">
              <Form.Label>Website </Form.Label>
            </Col>
            <Col md="2">
              <Form.Group>
                <Form.Control
                  className="text-box"
                  type="text"
                  placeholder="Website"
                  aria-describedby="inputGroupPrepend"
                  name="website"
                  id="website"
                  onChange={handleChange}
                  value={values.website}
                />
              </Form.Group>
            </Col>

            <Col md="1">
              <Form.Label className="mb-0">GST Applicability</Form.Label>
            </Col>
            <Col md="1">
              <Form.Group className="mb-2 d-flex">
                <Form.Check
                  type="radio"
                  label="Yes"
                  className="pr-3"
                  name="gstApplicable"
                  id="GSTYes"
                  onClick={() => {
                    setFieldValue("gstApplicable", "yes");
                  }}
                  value="yes"
                  checked={values.gstApplicable == "yes" ? true : false}
                />
                <Form.Check
                  className="ms-2"
                  type="radio"
                  label="No"
                  name="gstApplicable"
                  id="GSTNo"
                  onClick={() => {
                    setFieldValue("gstApplicable", "no");
                    setFieldValue("gstIn", "");
                    setFieldValue("gstType", "");
                  }}
                  value="no"
                  checked={values.gstApplicable == "no" ? true : false}
                />
              </Form.Group>
              <span className="text-danger errormsg">
                {errors.gstApplicable}
              </span>
            </Col>
          </Row>

          <Row className="mb-2">
            {values.gstApplicable === "yes" ? (
              <>
                <Col md="1" className="mb-3">
                  <Form.Label>
                    GSTIN
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col md="2">
                  <Form.Group>
                    <Form.Control
                      className="text-box"
                      type="text"
                      placeholder="GSTIN"
                      name="gstIn"
                      id="gstIn"
                      onChange={handleChange}
                      maxLength={15}
                      value={values.gstIn && values.gstIn.toUpperCase()}
                      //   isValid={touched.gstIn && !errors.gstIn}
                      //   isInvalid={!!errors.gstIn}
                    />
                  </Form.Group>
                  <span className="text-danger errormsg">{errors.gstIn}</span>
                </Col>
                <Col md={2}>
                  <Row>
                    <Col md={6}>
                      <Form.Label>GST transfer date</Form.Label>
                    </Col>
                    <Col md={6}>
                      <MyTextDatePicker
                        innerRef={(input) => {
                          //   this.invoiceDateRef.current = input;
                        }}
                        className="text-box "
                        name="gstTransferDate"
                        id="gstTransferDate"
                        placeholder="DD/MM/YYYY"
                        dateFormat="DD/MM/YYYY"
                        value={values.gstTransferDate}
                        onChange={handleChange}
                        onBlur={(e) => {
                          if (e.target.value != null && e.target.value != "") {
                            console.warn(
                              "sid:: isValid",
                              moment(e.target.value, "DD-MM-YYYY").isValid()
                            );
                            if (
                              moment(e.target.value, "DD-MM-YYYY").isValid() ==
                              true
                            ) {
                              setFieldValue("gstTransferDate", e.target.value);
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: "Invalid Transfer date",
                                is_button_show: true,
                              });
                              setFieldValue("gstTransferDate", "");
                            }
                          } else {
                            setFieldValue("gstTransferDate", "");
                          }
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col md="1">
                  <Form.Label>Applicable Date</Form.Label>
                </Col>

                <Col md="1">
                  <MyTextDatePicker
                    innerRef={(input) => {
                      // this.invoiceDateRef.current = input;
                    }}
                    className="text-box "
                    name="gstApplicableDate"
                    id="gstApplicableDate"
                    placeholder="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    value={values.gstApplicableDate}
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
                            setFieldValue("gstApplicableDate", e.target.value);
                          } else {
                            console.log("date is greater than current date");
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Applicable date can't be greater than Current Date",
                              is_button_show: true,
                            });
                            setFieldValue("gstApplicableDate", "");
                          }
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Invalid Applicable date",
                            is_button_show: true,
                          });
                          setFieldValue("gstApplicableDate", "");
                        }
                      } else {
                        setFieldValue("gstApplicableDate", "");
                      }
                    }}
                  />
                  <span className="text-danger errormsg">
                    {errors.gstApplicableDate}
                  </span>
                </Col>

                <Col md="1">
                  <Form.Label>
                    GST Type
                    <span className="text-danger">*</span>
                  </Form.Label>
                </Col>
                <Col md="2">
                  <Form.Group className="">
                    <Select
                      className="selectTo"
                      styles={ledger_select}
                      closeMenuOnSelect={true}
                      components={{ ClearIndicator }}
                      onChange={(v) => {
                        setFieldValue("gstType", v);
                      }}
                      name="gstType"
                      id="gstType"
                      value={values.gstType}
                      options={GSTopt}
                    />
                    <span className="text-danger errormsg">
                      {errors.gstType}
                    </span>
                  </Form.Group>
                </Col>
              </>
            ) : (
              ""
            )}

            <Col md="1">
              <Form.Label>Currency</Form.Label>
            </Col>
            <Col md="1">
              <Form.Group className="">
                <Select
                  className="selectTo"
                  styles={ledger_select}
                  closeMenuOnSelect={true}
                  components={{ ClearIndicator }}
                  onChange={(v) => {
                    setFieldValue("currency", v);
                  }}
                  name="currency"
                  id="currency"
                  value={values.currency}
                  options={Currencyopt}
                />
              </Form.Group>
            </Col>
          </Row> */}
        </Col>
      </Row>
    </>
  );
}
