import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  InputGroup,
} from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import refresh from "@/assets/images/refresh.png";
import {
  authenticationService,
  get_companies_super_admin,
  createCompanyUser,
  get_c_admin_users,
  get_companies_data,
  delete_user,
  get_user_by_id,
  updateInstituteUser,
  get_c_admins,
  validateUsers,
} from "@/services/api_functions";
import Select from "react-select";
import search from "@/assets/images/search_icon@3x.png";
import delete_icon from "@/assets/images/delete_icon3.png";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  getSelectValue,
  AuthenticationCheck,
  ledger_select,
  isActionExist,
  MyNotifications,
  OnlyAlphabets,
  customStyles,
  OnlyEnterNumbers,
  allEqual,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

import {
  faEye,
  faEyedropper,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class CompanyAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      orgData: [],
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
        showPassword: false,
      },
      userRole: "CADMIN",
      errorArrayBorder: "",
    };
    this.ref = React.createRef();
    this.selectRefA = React.createRef();
    this.radioRef = React.createRef();
  }
  listGetCompany = (status = false) => {
    get_companies_data()
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
            let companyId = this.state.opCompanyList.find(
              (o) =>
                o.value === authenticationService.currentUserValue.companyId
            );
            console.log("companyId", companyId);
            this.ref.current.setFieldValue("companyId", companyId);
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
            this.setState({ data: data, orgData: data });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /**** validation for Company Admin Dulication *****/
  validateUserDuplicate = (user_code, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("userCode", user_code);
    validateUsers(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: res.message,
            is_timeout: true,
            delay: 1500,
          });
          // setFieldValue("usercode", "");
          setTimeout(() => {
            document.getElementById("usercode").focus();
          }, 1000);
          //this.reloadPage();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  deleteadmin = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_user(formData)
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
          // resetForm();
          // this.initRow();
          this.componentDidMount();
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ opCompanyList: [] });
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
      errorArrayBorder: "",
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
            companyId: getSelectValue(
              this.state.opCompanyList,
              userData.companyId
            ),
            // companyId: getValue(this.state.opCompanyList, userData.companyId),
            fullName: userData.fullName,
            mobileNumber: userData.mobileNumber,
            userRole: this.state.userRole,
            email: userData.email != "NA" ? userData.email : "",
            gender: userData.gender,
            usercode: userData.usercode,
            password: userData.password,
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
        // mobileNumber: Yup.string()
        //   .trim()
        //   .matches(numericRegExp, "Enter valid mobile number")
        //   .required("Mobile number is required"),
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
        usercode: Yup.string().trim().required("Username is required"),
      });
    } else {
      return Yup.object().shape({
        companyId: Yup.object().required("select company"),
        fullName: Yup.string().trim().required("Full Name is required"),
        // mobileNumber: Yup.string()
        //   .trim()
        //   .matches(numericRegExp, "Enter valid mobile number")
        //   .required("Mobile Number is required"),
        // email: Yup.lazy((v) => {
        //   if (v != undefined) {
        //     return Yup.string()
        //       .trim()
        //       .matches(EMAILREGEXP, "Enter valid email id")
        //       .required("Email is required");
        //   }
        //   return Yup.string().notRequired();
        // }),
        gender: Yup.string().trim().required("gender is required"),
        // password: Yup.string().trim().required("password is required"),
        usercode: Yup.string().trim().required("usercode is required"),
      });
    }
  };

  pageReload = () => {
    this.componentDidMount();
  };

  togglePasswordVisiblity = (status) => {
    this.setState({ showPassword: status });
  };

  handleSearch = (vi) => {
    console.log({ vi });
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
      (   v.companyName != null && v.companyName.toLowerCase().includes(vi.toLowerCase()))  ||
      (   v.fullName != null && v.fullName.toLowerCase().includes(vi.toLowerCase())) ||
      (v.mobileNumber != null && v.mobileNumber.toString().includes(vi)) ||
      (v.email !=null && v.email.toLowerCase().includes(vi.toLowerCase())) ||
      ( v.gender != null && v.gender.toLowerCase().includes(vi.toLowerCase())) ||
      ( v.username != null  && v.username.toLowerCase().includes(vi.toLowerCase()))
   
      //     (v.companyName != null &&  v.fullName != null && v.usercode != null && v.mobileNumber != null  &&
    //       v.username != null &&  v.companyName.toLowerCase().includes(vi.toLowerCase()))    ||
    //       v.username != null  ? v.username.toLowerCase().includes(vi.toLowerCase()) : '' ||
    //       v.fullName != null ? v.fullName.toLowerCase().includes(vi.toLowerCase()) : '' ||
    //     v.usercode.toLowerCase().includes(vi.toLowerCase())  || v.mobileNumber != null ? v.mobileNumber.includes(vi) : ''
    //     // ||   // v.gender.includes(vi)
    // );
    )
    if (vi.length == 0) {
      this.setState({
        data: orgData,
      });
    } else {
      this.setState({
        data: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

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
  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let {
      ledgerModalStateChange,
      transactionType,
      invoice_data,
      ledgerData,
    } = this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));

        // console.warn("da->>>>>>>>>>>>>>>>>>down", val);

        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
        this.setUpdateData(selectedLedger.id);

        // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
      }
    }
  }
  render() {
    const {
      opCompanyList,
      orgData,
      opendiv,
      data,
      CompanyInitVal,
      showPassword,
      errorArrayBorder,
    } = this.state;
    return (
      <div className="company-form-style">
        <Collapse in={opendiv}>
          <div className="main-div mb-2 m-0">
            <h4 className="form-header">Company Admin</h4>
            <Formik
              validateOnChange={false}
              // validateOnBlur={false}
              enableReinitialize={true}
              initialValues={CompanyInitVal}
              innerRef={this.ref}
              // validationSchema={this.validationSchema()}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                //! validation required start

                let errorArray = [];
                if (values.companyId == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }
                // if (values.fullName == "") {
                //   errorArray.push("Y");
                // } else {
                //   errorArray.push("");
                // }
                // if (values.gender == "") {
                //   errorArray.push("Y");
                // } else {
                //   errorArray.push("");
                // }
                if (values.usercode == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }
                if (values.password == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }

                //! validation required end
                this.setState({ errorArrayBorder: errorArray }, () => {
                  if (allEqual(errorArray)) {
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
                      MyNotifications.fire({
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to Submit",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          createCompanyUser(requestData)
                            .then((response) => {
                              setSubmitting(false);
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
                                //   ShowNotification("Success", res.message);
                                resetForm();

                                this.pageReload();
                              } else {
                                //   ShowNotification("Error", res.message);
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: "Error While Creating Comoany Admin",
                                  is_timeout: true,
                                  delay: 1000,
                                });
                              }
                            })
                            .catch((error) => {
                              setSubmitting(false);
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: "Error While Creating Company Admin",
                                is_timeout: true,
                                delay: 1000,
                              });
                              console.log("error", error);
                              // ShowNotification(
                              //   "Error",
                              //   "Not allowed duplicate user code "
                              // );
                            });
                        },
                        handleFailFn: () => {
                          setSubmitting(false);
                        },
                      });
                    } else {
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to Update ?",
                          is_button_show: false,
                          is_timeout: false,
                          delay: 0,
                          handleSuccessFn: () => {
                            updateInstituteUser(requestData)
                              .then((response) => {
                                setSubmitting(false);
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: "Company Admin updated successfully ",
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                  resetForm();

                                  this.pageReload();
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Error While Updating Company Admin",
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                }
                              })

                              .catch((error) => {
                                setSubmitting(false);
                                console.log("error", error);
                              });
                          },
                          handleFailFn: () => {
                            setSubmitting(false);
                            // this.setState({ opendiv: false });
                          },
                        },
                        () => {
                          console.warn("return_data");
                        }
                      );
                    }
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
                  className="form-style"
                  autoComplete="off"
                >
                  <div className="common-form-style m-0 mb-2">
                    <Row className="mt-2 ms-3">
                      <Col md={12} lg={12} sm={12} xs={12} className="mb-2">
                        <h5 className="Mail-title">User Details</h5>
                        <Row className="">
                          <Col md={3} lg={3} sm={3} xs={3}>
                            <Row>
                              <Col
                                md={4}
                                lg={4}
                                sm={4}
                                xs={4}
                                className="pe-0 ps-1"
                              >
                                <Form.Label>
                                  Company Name
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md={8} lg={8} sm={8} xs={8}>
                                <Form.Group
                                  className={`${
                                    values.companyId == "" &&
                                    errorArrayBorder[0] == "Y"
                                      ? "border border-danger "
                                      : ""
                                  }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.companyId) {
                                      this.setErrorBorder(0, "");
                                    } else {
                                      this.setErrorBorder(0, "Y");
                                      // this.selectRefA.current?.focus();
                                    }
                                  }}
                                  style={{ borderRadius: "4px" }}
                                >
                                  <Select
                                    ref={this.selectRefA}
                                    isClearable={true}
                                    autoComplete="off"
                                    className="selectTo"
                                    autoFocus={true}
                                    styles={ledger_select}
                                    onChange={(v) => {
                                      if (v != null) {
                                        setFieldValue("companyId", v);
                                      } else {
                                        setFieldValue("companyId", "");
                                      }
                                    }}
                                    id="companyId"
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
                            </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3} className="pe-0">
                                <Form.Label>
                                  Full Name
                                  {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="nope"
                                    type="text"
                                    placeholder="Full Name"
                                    name="fullName"
                                    className="text-box"
                                    id="fullName"
                                    onChange={handleChange}
                                    value={values.fullName}
                                    // isValid={
                                    //   touched.fullName && !errors.fullName
                                    // }
                                    isInvalid={!!errors.fullName}
                                    // onKeyDown={(e) => {
                                    //   if (e.key === "Tab" && !e.target.value)
                                    //     e.preventDefault();
                                    // }}
                                    // className={`${
                                    //   values.fullName == "" &&
                                    //   errorArrayBorder[1] == "Y"
                                    //     ? "border border-danger text-box"
                                    //     : "text-box"
                                    // }`}
                                    // onBlur={(e) => {
                                    //   e.preventDefault();
                                    //   if (e.target.value) {
                                    //     this.setErrorBorder(1, "");
                                    //   } else {
                                    //     this.setErrorBorder(1, "Y");
                                    //     document
                                    //       .getElementById("fullName")
                                    //       .focus();
                                    //   }
                                    // }}
                                  />
                                  {/* <span className="text-danger errormsg">
                                    {errors.fullName}
                                  </span> */}
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          {/* <Col md="3">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Full Name"
                                name="fullName"
                                className="text-box"
                                id="fullName"
                                onKeyPress={(e) => {
                                  OnlyAlphabets(e);
                                }}
                                onChange={handleChange}
                                value={values.fullName}
                                isValid={touched.fullName && !errors.fullName}
                                isInvalid={!!errors.fullName}
                              />
                              <span className="text-danger errormsg">
                                {errors.fullName}
                              </span>
                            </Form.Group>
                          </Col> */}
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3} className="pe-0">
                                <Form.Label>Mobile No.</Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="nope"
                                    type="text"
                                    placeholder=" Mobile No"
                                    name="mobileNumber"
                                    className="text-box"
                                    id="mobileNumber"
                                    onKeyPress={(e) => {
                                      OnlyEnterNumbers(e);
                                    }}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 18) {
                                        e.preventDefault();
                                      }
                                      if (e.shiftKey && e.key === "Tab") {
                                        let mob = e.target.value.trim();
                                        console.log("length--", mob.length);
                                        if (mob != "" && mob.length < 10) {
                                          console.log(
                                            "length--",
                                            "plz enter 10 digit no."
                                          );
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg:
                                              "Please Enter 10 Digit Number. ",
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          setTimeout(() => {
                                            document
                                              .getElementById("mobileNumber")
                                              .focus();
                                          }, 1000);
                                        }
                                      } else if (e.key === "Tab") {
                                        let mob = e.target.value.trim();
                                        console.log("length--", mob.length);
                                        if (mob != "" && mob.length < 10) {
                                          console.log(
                                            "length--",
                                            "plz enter 10 digit no."
                                          );
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg:
                                              "Please Enter 10 Digit Number. ",
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          setTimeout(() => {
                                            document
                                              .getElementById("mobileNumber")
                                              .focus();
                                          }, 1000);
                                        }
                                      }
                                    }}
                                    onBlur={(e) => {}}
                                    value={values.mobileNumber}
                                    isValid={
                                      touched.mobileNumber &&
                                      !errors.mobileNumber
                                    }
                                    isInvalid={!!errors.mobileNumber}
                                    maxLength={10}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.mobileNumber}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={2} md={2} sm={2} xs={2}>
                                <Form.Label>
                                  Gender
                                  {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                              </Col>
                              <Col
                                lg={9}
                                md={9}
                                sm={9}
                                xs={9}
                                className="my-auto topmargin"
                              >
                                <Form.Group
                                  // className="gender1 gender-style radiotag d-flex"
                                  style={{
                                    display: "flex",
                                    width: "fit-content",
                                  }}
                                  //   className={`${
                                  //     values.gender == "" &&
                                  //     errorArrayBorder[2] == "Y"
                                  //       ? "border border-danger gender1 custom-control-inline radiotag"
                                  //       : "gender1 custom-control-inline radiotag"
                                  //   }`}
                                  //   onBlur={(e) => {
                                  //     e.preventDefault();
                                  //     if (values.gender) {
                                  //       this.setErrorBorder(2, "");
                                  //     } else {
                                  //       this.setErrorBorder(2, "Y");
                                  //       this.radioRef.current?.focus();
                                  //     }
                                  //   }}
                                >
                                  <Form.Check
                                    ref={this.radioRef}
                                    type="radio"
                                    label="Male"
                                    className="pr-3 pe-2"
                                    name="gender"
                                    id="gender1"
                                    value="male"
                                    onChange={handleChange}
                                    checked={
                                      values.gender == "male" ? true : false
                                    }
                                  />
                                  <Form.Check
                                    ref={this.radioRef}
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
                                  {errors.gender && "Select gender"}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col md="3">
                            <Row>
                              <Col md={4} lg={4} sm={4} xs={4} className="ps-1">
                                <Form.Label>E-mail</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="nope"
                                    type="text"
                                    placeholder="E-mail"
                                    name="email"
                                    className="text-box"
                                    id="email"
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 18) {
                                        e.preventDefault();
                                      }

                                      if (e.shiftKey && e.key === "Tab") {
                                        let email_val = e.target.value.trim();
                                        if (
                                          email_val != "" &&
                                          !EMAILREGEXP.test(email_val)
                                        ) {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg:
                                              "Please Enter Valid Email Id. ",
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          setTimeout(() => {
                                            document
                                              .getElementById("email")
                                              .focus();
                                          }, 1000);
                                        }
                                      } else if (e.key === "Tab") {
                                        let email_val = e.target.value.trim();
                                        if (
                                          email_val != "" &&
                                          !EMAILREGEXP.test(email_val)
                                        ) {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg:
                                              "Please Enter Valid Email Id. ",
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          setTimeout(() => {
                                            document
                                              .getElementById("email")
                                              .focus();
                                          }, 1000);
                                        }
                                      }
                                    }}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                    }}
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
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Label>
                                  Username
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="nope"
                                    type="text"
                                    placeholder="Username"
                                    name="usercode"
                                    // className="text-box"
                                    id="usercode"
                                    onChange={handleChange}
                                    value={values.usercode}
                                    // isValid={
                                    //   touched.usercode && !errors.usercode
                                    // }
                                    isInvalid={!!errors.usercode}
                                    // onBlur={(e) => {
                                    //   e.preventDefault();
                                    //   this.validateUserDuplicate(
                                    //     values.usercode,
                                    //     setFieldValue
                                    //   );
                                    //   // alert("On Blur Call");
                                    // }}
                                    // onKeyDown={(e) => {
                                    //   if (e.key === "Tab" && !e.target.value)
                                    //     e.preventDefault();
                                    // }}
                                    className={`${
                                      values.usercode == "" &&
                                      errorArrayBorder[1] == "Y"
                                        ? "border border-danger text-box"
                                        : "text-box"
                                    }`}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      // if (
                                      //   e.target.value &&
                                      //   e.target.value != "" &&
                                      //   values.password == ""
                                      // ) {
                                      //   this.validateUserDuplicate(
                                      //     values.usercode,
                                      //     setFieldValue
                                      //   );
                                      // } else {
                                      //   document
                                      //     .getElementById("usercode")
                                      //     .focus();
                                      // }
                                      if (e.target.value) {
                                        this.setErrorBorder(1, "");
                                        this.validateUserDuplicate(
                                          values.usercode,
                                          setFieldValue
                                        );
                                      } else {
                                        this.setErrorBorder(1, "Y");
                                        // document
                                        //   .getElementById("usercode")
                                        //   .focus();
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.key === "Tab") {
                                      } else if (
                                        e.key === "Tab" &&
                                        !e.target.value
                                      )
                                        e.preventDefault();
                                    }}
                                  />
                                  {/* <span className="text-danger errormsg">
                                    {errors.usercode}
                                  </span> */}
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>

                          {/* {values.id == "" && ( */}
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Label>
                                  Password
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Group>
                                  <InputGroup>
                                    <Form.Control
                                      type="text"
                                      style={{
                                        webkitTextSecurity:
                                          showPassword != "" ? "disc" : "unset",
                                        // border: "none",
                                      }}
                                      autoComplete="off"
                                      placeholder="Password"
                                      name="password"
                                      id="password"
                                      // className="password-style"
                                      onChange={handleChange}
                                      value={values.password}
                                      invalid={errors.password ? true : false}
                                      // onKeyDown={(e) => {
                                      //   if (e.key === "Tab" && !e.target.value)
                                      //     e.preventDefault();
                                      // }}
                                      className={`${
                                        values.password == "" &&
                                        errorArrayBorder[2] == "Y"
                                          ? "border border-danger password-style "
                                          : " password-style"
                                      }`}
                                      onBlur={(e) => {
                                        e.preventDefault();
                                        if (e.target.value) {
                                          this.setErrorBorder(2, "");
                                        } else {
                                          this.setErrorBorder(2, "Y");
                                          // document
                                          //   .getElementById("password")
                                          //   .focus();
                                        }
                                      }}
                                    />
                                    <InputGroup.Text
                                      style={{
                                        border: "none",
                                        border: " 1px solid #c4cbd2",
                                      }}
                                    >
                                      {showPassword != "" ? (
                                        <FontAwesomeIcon
                                          icon={faEyeSlash}
                                          onClick={() => {
                                            this.togglePasswordVisiblity(
                                              !showPassword
                                            );
                                          }}
                                        />
                                      ) : (
                                        <FontAwesomeIcon
                                          icon={faEye}
                                          onClick={() => {
                                            this.togglePasswordVisiblity(
                                              !showPassword
                                            );
                                          }}
                                        />
                                      )}
                                    </InputGroup.Text>
                                  </InputGroup>
                                  {/* <span className="text-danger errormsg">
                                    {errors.password}
                                  </span> */}
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          {/* )} */}
                          {/* {!values.id == "" && <Col md="3"></Col>} */}
                          <Col
                            md={3}
                            lg={3}
                            sm={3}
                            xs={3}
                            className="btn_align text-end"
                          >
                            <Button
                              className="submit-btn"
                              type="submit"
                              // disabled={isSubmitting}
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  this.ref.current.handleSubmit();
                                }
                              }}
                            >
                              {values.id == "" ? "Submit" : "Update"}
                            </Button>
                            <Button
                              className="cancel-btn ms-2"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                this.pageReload();
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  e.preventDefault();
                                  this.pageReload();
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Collapse>
        <div className="ledger-group-style">
          <div className="cust_table">
            <Row className="py-2 mx-0">
              {/* <Col md="3">
              <div className="">
                <Form>
                  <Form.Group className="mt-1" controlId="formBasicSearch">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      className="search-box"
                      name="Search"
                      id="Search"
                      onChange={(e) => {
                        this.handleSearch(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Form>
              </div>
            </Col> */}
              <Col md="3">
                <InputGroup className="mb-2  mdl-text">
                  <Form.Control
                    type="text"
                    name="Search"
                    id="Search"
                    onChange={(e) => {
                      this.handleSearch(e.target.value);
                    }}
                    placeholder="Search"
                    className="mdl-text-box"
                    autoFocus="true"
                    autoComplete="nope"
                  />
                  <InputGroup.Text className="int-grp" id="basic-addon1">
                    <img className="srch_box" src={search} alt="" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col md="9" className="mt-2 btn_align mainbtn_create">
                {!opendiv && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ opendiv: !opendiv }, () => {
                        setTimeout(() => {
                          this.selectRefA.current?.focus();
                        }, 500);
                      });
                    }}
                    aria-controls="example-collapse-text"
                    aria-expanded={opendiv}
                  >
                    Create
                    {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style pt-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg> */}
                  </Button>
                )}

                {/* <Button
                className="ml-2 btn-refresh"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  this.pageReload();
                }}
              >
                <img src={refresh} alt="icon" />
              </Button> */}
              </Col>
            </Row>

            <div className="tbl-list-style1 tbl-body-style">
              <Table size="sm" className="tbl-font">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Sr.No.</th>
                    <th>Company Name</th>
                    <th>Full Name</th>
                    <th>Mobile Number</th>
                    <th>E-mail</th>
                    <th>Gender</th>
                    <th>Username</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
                </thead>
                <tbody
                  className="tabletrcursor prouctTableTr"
                  style={{ borderTop: "2px solid transparent" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      return (
                        <tr
                          value={JSON.stringify(v)}
                          id={`ledgerTr_` + i}
                          // prId={v.id}
                          tabIndex={i}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            this.setUpdateData(v.id);
                          }}
                        >
                          <td style={{ width: "5%" }}>{i + 1}</td>
                          <td>{v.companyName}</td>
                          <td>{v.fullName}</td>
                          <td>{v.mobileNumber}</td>
                          <td>{v.email != "NA" ? v.email : ""}</td>
                          <td>{v.gender}</td>
                          <td>{v.usercode}</td>
                          <td style={{ width: "5%" }}>
                            <img
                              src={delete_icon}
                              className="del_icon"
                              title="Delete"
                              onClick={(e) => {
                                if (
                                  isActionExist(
                                    "user",
                                    "delete",
                                    this.props.userPermissions
                                  )
                                ) {
                                  MyNotifications.fire(
                                    {
                                      show: true,
                                      icon: "confirm",
                                      title: "Confirm",
                                      msg: "Do you want to Delete",
                                      is_button_show: false,
                                      is_timeout: false,
                                      delay: 0,
                                      handleSuccessFn: () => {
                                        this.deleteadmin(v.id);
                                      },
                                      handleFailFn: () => {},
                                    },
                                    () => {
                                      console.warn("return_data");
                                    }
                                  );
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center">No Data Found</td>
                    </tr>
                  )}
                </tbody>
                <thead className="tbl-footer mb-2">
                  <tr>
                    <th
                      colSpan={8}
                      className=""
                      style={{ borderTop: " 2px solid transparent" }}
                    >
                      {Array.from(Array(1), (v) => {
                        return (
                          <tr>
                            {/* <th>&nbsp;</th> */}
                            <th>Total Company Admin List :</th>
                            <th>{data.length}</th>
                          </tr>
                        );
                      })}
                    </th>
                  </tr>
                </thead>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
