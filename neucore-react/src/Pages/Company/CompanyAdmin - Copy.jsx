import React, { Component } from "react";

import { Button, Col, Row, Form, Table, Collapse } from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  get_companies_super_admin,
  createCompanyUser,
  get_c_admin_users,
  get_user_by_id,
  updateInstituteUser,
  get_c_admins,
} from "@/services/api_functions";
import Select from "react-select";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  customStyles,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

export default class CompanyAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      data: [],
      CompanyInitVal: {
        id: "",
        companyId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "CADMIN",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      userRole: "CADMIN",
    };
    this.ref = React.createRef();
  }
  listGetCompany = (status = false) => {
    get_companies_super_admin()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let Opt = [];
          if (d.length > 0) {
            Opt = d.map(function (values) {
              return { value: values.id, label: values.companyName };
            });
          }
          this.setState({ opCompanyList: Opt }, () => {
            let instituteId = getValue(
              Opt,
              authenticationService.currentUserValue.instituteId
            );
            this.ref.current.setFieldValue("instituteId", instituteId);
          });
        }
      })
      .catch((error) => {
        this.setState({ opInstituteList: [] });
        console.log("error", error);
      });
  };

  listUsers = () => {
    get_c_admins()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            this.setState({ data: data });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listGetCompany();
      this.listUsers();
      this.setInitValue();
      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValue);
    }
  }

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValue);
  }

  setInitValue = () => {
    this.ref.current.resetForm();
    this.setState({
      opendiv: false,
      opCompanyList: [],
      data: [],
      CompanyInitVal: {
        id: "",
        companyId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "CADMIN",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      userRole: "CADMIN",
    });
  };
  setUpdateData = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    get_user_by_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let userData = res.responseObject;
          let companyInitVal = {
            id: userData.id,
            companyId: getValue(this.state.opCompanyList, userData.companyId),
            fullName: userData.fullName,
            mobileNumber: userData.mobileNumber,
            userRole: this.state.userRole,
            email: userData.email != "NA" ? userData.email : "",
            gender: userData.gender,
            usercode: userData.usercode,
          };
          console.log("companyInitVal ", companyInitVal);
          this.setState({ CompanyInitVal: companyInitVal, opendiv: true });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  validationSchema = () => {
    if (this.state.CompanyInitVal.id == "") {
      return Yup.object().shape({
        companyId: Yup.object().required("Select company"),
        fullName: Yup.string().trim().required("Full name is required"),
        mobileNumber: Yup.string()
          .trim()
          .matches(numericRegExp, "Enter valid mobile number")
          .required("Mobile number is required"),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        gender: Yup.string().trim().required("Gender is required"),
        password: Yup.string().trim().required("Password is required"),
        usercode: Yup.string().trim().required("Usercode is required"),
      });
    } else {
      return Yup.object().shape({
        companyId: Yup.object().required("select company"),
        fullName: Yup.string().trim().required("Full Name is required"),
        mobileNumber: Yup.string()
          .trim()
          .matches(numericRegExp, "Enter valid mobile number")
          .required("Mobile Number is required"),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        gender: Yup.string().trim().required("gender is required"),
        // password: Yup.string().trim().required("password is required"),
        usercode: Yup.string().trim().required("usercode is required"),
      });
    }
  };

  pageReload = () => {
    this.componentDidMount();
  };
  render() {
    const { opCompanyList, opendiv, data, CompanyInitVal } = this.state;
    return (
      <div className="">
        <Collapse in={opendiv}>
          <div
            id="example-collapse-text"
            className=" "
            style={{ margin: "1%" }}
          >
            <div className="main-div mb-2 m-0 company-from">
              <h4 className="form-header">Create Company User</h4>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                enableReinitialize={true}
                initialValues={CompanyInitVal}
                innerRef={this.ref}
                validationSchema={this.validationSchema()}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  console.log("value", values);
                  let keys = Object.keys(CompanyInitVal);
                  let requestData = new FormData();
                  keys.map((v) => {
                    if (values[v] != "" && v != "companyId") {
                      requestData.append(v, values[v]);
                    }
                  });
                  requestData.append("companyId", values.companyId.value);
                  setSubmitting(true);
                  if (values.id == "") {
                    createCompanyUser(requestData)
                      .then((response) => {
                        setSubmitting(false);
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          //   ShowNotification("Success", res.message);
                          resetForm();

                          this.pageReload();
                        } else {
                          //   ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                        console.log("error", error);
                        // ShowNotification(
                        //   "Error",
                        //   "Not allowed duplicate user code "
                        // );
                      });
                  } else {
                    updateInstituteUser(requestData)
                      .then((response) => {
                        setSubmitting(false);
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          resetForm();

                          this.pageReload();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                        console.log("error", error);
                      });
                  }
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
                  <Form onSubmit={handleSubmit} className="form-style">
                    <div className="mb-2 m-0 company-from">
                      <Row className="mt-4 row-border">
                        <Col md="12" className="mb-4">
                          <h5 className="title-style">User Details</h5>
                          <Row className="row-inside">
                            <Col md="3">
                              <Form.Group className="">
                                <Form.Label>Company Name</Form.Label>
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={customStyles}
                                  onChange={(v) => {
                                    if (v != null) {
                                      setFieldValue("companyId", v);
                                    } else {
                                      setFieldValue("companyId", "");
                                    }
                                  }}
                                  name="companyId"
                                  options={opCompanyList}
                                  value={values.companyId}
                                  invalid={errors.companyId ? true : false}
                                />
                                <span className="text-danger errormsg">
                                  {errors.companyId && errors.companyId}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="3">
                              <Form.Group>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Full Name"
                                  name="fullName"
                                  id="fullName"
                                  onChange={handleChange}
                                  value={values.fullName}
                                  isValid={touched.fullName && !errors.fullName}
                                  isInvalid={!!errors.fullName}
                                />
                                <span className="text-danger errormsg">
                                  {errors.fullName}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="3">
                              <Form.Group>
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder=" Mobile No"
                                  name="mobileNumber"
                                  id="mobileNumber"
                                  onChange={handleChange}
                                  value={values.mobileNumber}
                                  isValid={
                                    touched.mobileNumber && !errors.mobileNumber
                                  }
                                  isInvalid={!!errors.mobileNumber}
                                  maxLength={10}
                                />
                                <span className="text-danger errormsg">
                                  {errors.mobileNumber}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="3">
                              <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Email"
                                  name="email"
                                  id="email"
                                  onChange={handleChange}
                                  value={values.email}
                                  isValid={touched.email && !errors.email}
                                  isInvalid={!!errors.email}
                                />
                                <span className="text-danger errormsg">
                                  {errors.email}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mt-4 row-inside">
                            <Col md="2">
                              <Form.Group>
                                <Form.Label className="mb-0">Gender</Form.Label>
                              </Form.Group>
                              <Form.Group className="gender1 custom-control-inline radiotag">
                                <Form.Check
                                  type="radio"
                                  label="Male"
                                  className="pr-3"
                                  name="gender"
                                  id="gender1"
                                  value="male"
                                  onChange={handleChange}
                                  checked={
                                    values.gender == "male" ? true : false
                                  }
                                />
                                <Form.Check
                                  type="radio"
                                  label="Female"
                                  name="gender"
                                  id="gender2"
                                  value="female"
                                  className=""
                                  onChange={handleChange}
                                  checked={
                                    values.gender == "female" ? true : false
                                  }
                                />
                              </Form.Group>
                              <span className="text-danger errormsg">
                                {errors.gender && "Please select gender."}
                              </span>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>User Code</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="User Code"
                                  name="usercode"
                                  id="usercode"
                                  onChange={handleChange}
                                  value={values.usercode}
                                  isValid={touched.usercode && !errors.usercode}
                                  isInvalid={!!errors.usercode}
                                />
                                <span className="text-danger errormsg">
                                  {errors.usercode}
                                </span>
                              </Form.Group>
                            </Col>
                            {values.id == "" && (
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label>Password</Form.Label>
                                  <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    id="password"
                                    onChange={handleChange}
                                    value={values.password}
                                    isValid={
                                      touched.password && !errors.password
                                    }
                                    isInvalid={!!errors.password}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.password}
                                  </span>
                                </Form.Group>
                              </Col>
                            )}
                            {!values.id == "" && <Col md="3"></Col>}
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col md="12" className="mt-4  btn_align">
                          <Button
                            className="submit-btn"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {values.id == "" ? "Save" : "Update"}
                          </Button>
                          <Button
                            className="cancel-btn"
                            variant="secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              this.pageReload();
                            }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Collapse>
        <div className="wrapper_div">
          <div className="cust_table">
            <Row style={{ padding: "8px" }}>
              <Col md="3">
                <div className="">
                  <Form>
                    <Form.Group className="mt-1" controlId="formBasicSearch">
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        className="search-box"
                      />
                    </Form.Group>
                  </Form>
                </div>
              </Col>
              <Col md="9" className="mt-2 btn_align mainbtn_create">
                {!opendiv && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ opendiv: !opendiv });
                    }}
                    aria-controls="example-collapse-text"
                    aria-expanded={opendiv}
                  >
                    Create
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      class="bi bi-plus-square-dotted svg-style"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>
                  </Button>
                )}

                <Button
                  className="ml-2 refresh-btn"
                  type="button"
                  onClick={() => {
                    this.pageReload();
                  }}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
            <div className="table_wrapper p-2">
              <Table hover size="sm" className="tbl-font">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Company Name</th>
                    <th>Full Name</th>
                    <th>Mobile Number</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>UserCode</th>
                  </tr>
                </thead>
                <tbody className="tabletrcursor">
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            this.setUpdateData(v.id);
                          }}
                        >
                          <td>{i + 1}</td>
                          <td>{v.companyName}</td>
                          <td>{v.fullName}</td>
                          <td>{v.mobileNumber}</td>
                          <td>{v.email != "NA" ? v.email : ""}</td>
                          <td>{v.gender}</td>
                          <td>{v.usercode}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
