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
  validateUsersUpdate,
  validateCadminUpdate,
  getDisableUser,
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
      focusId: "",
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
    get_companies_super_admin()
      .then((response) => {
        let { focusId } = this.state;
        // debugger;
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
            let companyId =
              authenticationService.currentUserValue.hasOwnProperty("companyId")
                ? this.state.opCompanyList.find(
                  (o) =>
                    o.value ===
                    authenticationService.currentUserValue.companyId
                )
                : "";

            if (companyId != "")
              this.ref.current.setFieldValue("companyId", companyId);
          });
          setTimeout(() => {
            if (focusId) {
              document
                .getElementById("CompanyATr_" + this.state.focusId)
                .focus();
            } else {
              this.selectRefA.current?.focus();
            }
          }, 1500);
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
  // validateUserDuplicate = (user_code, setFieldValue) => {
  //   let reqData = new FormData();
  //   reqData.append("userCode", user_code);
  //   validateUsers(reqData)
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 409) {
  //         MyNotifications.fire({
  //           show: true,
  //           icon: "warning",
  //           title: "Warning",
  //           msg: res.message,
  //           is_timeout: true,
  //           delay: 1500,
  //         });
  //         // setFieldValue("usercode", "");
  //         setTimeout(() => {
  //           document.getElementById("usercode").focus();
  //         }, 1000);
  //         //this.reloadPage();
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

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
            delay: 1000,
          });
          // setFieldValue("usercode", "");

          setTimeout(() => {
            document.getElementById("usercode").focus();
          }, 1300);
          //this.reloadPage();
        } else {
          setTimeout(() => {
            document.getElementById("password").focus();
          }, 100);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  //@Vinit@Duplicate User Not Allowed
  validateUserUpdateDuplicate = (id, usercode, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("userCode", usercode);
    validateCadminUpdate(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          // setFieldValue("usercode", "");
          setTimeout(() => {
            document.getElementById("usercode").focus();
          }, 1300);
          //this.reloadPage();
        } else {
          setTimeout(() => {
            document.getElementById("password").focus();
          }, 100);
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

  handleKeyDown = (e, index) => {
    // debugger;
    if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    }
    if (e.keyCode === 37) {
      // const prevIndex = (index - 1) % this.inputRefs.length;
      // if (prevIndex === -1) {
      //   this.inputRefs[index].focus();
      // } else {
      //   this.inputRefs[prevIndex].focus();
      // }
    }
    if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index).focus();
      // const index = (38) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    }
    if (e.altKey && e.keyCode === 67) {
      const index = "cancel";
      document.getElementById(index).focus();
      // const index = (39) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    }
  };

  handlesetFieldValue = (setFieldValue, key, value) => {
    setFieldValue(key, value.trim());
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listGetCompany();
      this.listUsers();
      this.setInitValue();
      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValue);

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
      let { showPassword } = this.state;
      this.setState({ showPassword: false }, () => {
        this.togglePasswordVisiblity(); //for hide the EYE icon on clear and submit click
      });
    }
  }

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValue);
    // alt key button disabled start
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    // alt key button disabled end
  }

  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end

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
        showPassword: false,
      },
      userRole: "CADMIN",
      errorArrayBorder: "",
    });
  };
  setUpdateData = (id, index) => {
    let formData = new FormData();
    formData.append("id", id);
    get_user_by_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let userData = res.responseObject;

          let companyInitVal = {
            id: userData.id,
            companyId:
              userData.companyId != ""
                ? getSelectValue(this.state.opCompanyList, userData.companyId)
                : "",
            // companyId: getValue(this.state.opCompanyList, userData.companyId),
            fullName: userData.fullName,
            mobileNumber: userData.mobileNumber,
            userRole: this.state.userRole,
            email: userData.email != "NA" ? userData.email : "",
            gender: userData.gender,
            usercode: userData.usercode,
            password: userData.password,
          };

          this.setState({
            CompanyInitVal: companyInitVal,
            opendiv: true,
            focusId: index,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  pageReload = () => {
    this.componentDidMount();
    this.setInitValue();
    this.ref.current.resetForm();
  };

  togglePasswordVisiblity = (status) => {
    this.setState({ showPassword: status });
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    // console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        (v.companyName != null &&
          v.companyName.toLowerCase().includes(vi.toLowerCase())) ||
        (v.fullName != null &&
          v.fullName.toLowerCase().includes(vi.toLowerCase())) ||
        (v.mobileNumber != null && v.mobileNumber.toString().includes(vi)) ||
        (v.email != null && v.email.toLowerCase().includes(vi.toLowerCase())) ||
        (v.gender != null &&
          v.gender.toLowerCase().includes(vi.toLowerCase())) ||
        (v.username != null &&
          v.username.toLowerCase().includes(vi.toLowerCase()))

      //     (v.companyName != null &&  v.fullName != null && v.usercode != null && v.mobileNumber != null  &&
      //       v.username != null &&  v.companyName.toLowerCase().includes(vi.toLowerCase()))    ||
      //       v.username != null  ? v.username.toLowerCase().includes(vi.toLowerCase()) : '' ||
      //       v.fullName != null ? v.fullName.toLowerCase().includes(vi.toLowerCase()) : '' ||
      //     v.usercode.toLowerCase().includes(vi.toLowerCase())  || v.mobileNumber != null ? v.mobileNumber.includes(vi) : ''
      //     // ||   // v.gender.includes(vi)
      // );
    );
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
    let { ledgerModalStateChange, transactionType, invoice_data, ledgerData } =
      this.props;
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
      }
    }
  }
  handleCompany = (e, id) => {
    let reqData = new FormData();
    reqData.append("isEnable", e);
    reqData.append("id", id);
    getDisableUser(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          // console.log("res", res);
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: res.message,
            is_timeout: true,
            delay: 1500,
          });
        }
        this.listUsers();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
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
      <div className="ledger-group-style">
        {/* <Collapse in={opendiv}> */}
        <div className="main-div m-0">
          <h4 className="form-header">Company Admin</h4>
          <Formik
            validateOnChange={false}
            // validateOnBlur={false}
            enableReinitialize={true}
            initialValues={CompanyInitVal}
            innerRef={this.ref}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //! validation required start

              let errorArray = [];
              if (values.companyId == null || values.companyId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
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
                  // console.log("value--------", values);
                  let keys = Object.keys(CompanyInitVal);
                  let requestData = new FormData();
                  keys.map((v) => {
                    if (values[v] != "" && v != "companyId") {
                      requestData.append(v, values[v]);
                    }
                  });
                  requestData.append(
                    "companyId",
                    values.companyId ? values.companyId.value : ""
                  );
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
                              this.ref.current.resetForm();

                              this.pageReload();
                              this.setState({ focusId: data.length }, () => {
                                // setTimeout(() => {
                                //   this.selectRefA.current?.focus();
                                // }, 1500);
                              });
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
                                  delay: 500,
                                });
                                this.ref.current.resetForm();

                                this.pageReload();
                                // setTimeout(() => {
                                //   this.selectRefA.current?.focus();
                                // }, 1000);
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
                        // console.warn("return_data");
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
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
                spellcheck="false"
              >
                <Row
                  style={{ background: "#CEE7F1" }}
                  className="row_padding pb-1"

                >
                  <Row className="">
                    <Col md={3} lg={3} sm={3} xs={3}>
                      <Row>
                        <Col md={4} lg={4} sm={4} xs={4} className="pe-0 ">
                          <Form.Label>
                            Company Name
                            <span className="text-danger">*</span>
                          </Form.Label>
                        </Col>
                        <Col md={8} lg={8} sm={8} xs={8}>
                          <Form.Group
                            className={`${errorArrayBorder[0] == "Y"
                                ? "border border-danger selectTo"
                                : "selectTo"
                              }`}
                            style={{ borderRadius: "4px" }}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.keyCode == 9) {
                                if (!values.companyId) {
                                  e.preventDefault();
                                  this.setErrorBorder(0, "Y");
                                } else {
                                  this.setErrorBorder(0, "");
                                }
                              } else if (e.key === "Tab") {
                                if (!values.companyId) {
                                  e.preventDefault();
                                } else {
                                  this.setErrorBorder(0, "");
                                }
                              } else if (e.keyCode == 13) {
                                if (!values.companyId) e.preventDefault();
                                else {
                                  this.setErrorBorder(0, "");
                                  this.handleKeyDown(e, "fullName");
                                }
                              }
                            }}
                          // isInvalid={!!errors.companyId}
                          >
                            <Select
                              ref={this.selectRefA}
                              isClearable={true}
                              // className="selectTo"
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
                              autoComplete="fullName"
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
                              onKeyDown={(e) => {
                                if (e.keyCode == 13 || e.keyCode == 9) {
                                  this.handlesetFieldValue(
                                    setFieldValue,
                                    "fullName",
                                    e.target.value
                                  );
                                  this.handleKeyDown(e, "mobileNumber");
                                }
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3} className="pe-0">
                          <Form.Label>Mobile No.</Form.Label>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}>
                          <Form.Group>
                            <Form.Control
                              autoComplete="mobileNumber"
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
                                if (e.shiftKey && e.key === "Tab") {
                                  let mob = e.target.value.trim();
                                  // console.log("length--", mob.length);
                                  if (mob != "" && mob.length < 10) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter 10 Digit Number. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("mobileNumber")
                                        .focus();
                                    }, 1000);
                                  }
                                } else if (e.keyCode === 9) {
                                  let mob = e.target.value.trim();
                                  // console.log("length--", mob.length);
                                  if (mob != "" && mob.length < 10) {
                                    // console.log(
                                    //   "length--",
                                    //   "plz enter 10 digit no."
                                    // );
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter 10 Digit Number. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("mobileNumber")
                                        .focus();
                                    }, 1000);
                                  }
                                } else if (e.keyCode === 13) {
                                  let mob = e.target.value.trim();
                                  // console.log("length--", mob.length);
                                  if (mob != "" && mob.length < 10) {
                                    // console.log(
                                    //   "length--",
                                    //   "plz enter 10 digit no."
                                    // );
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter 10 Digit Number. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("mobileNumber")
                                        .focus();
                                    }, 1000);
                                  } else {
                                    this.handleKeyDown(e, "gender1");
                                  }
                                }
                              }}
                              value={values.mobileNumber}
                              isValid={
                                touched.mobileNumber && !errors.mobileNumber
                              }
                              isInvalid={!!errors.mobileNumber}
                              maxLength={10}
                            />
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
                        <Col lg={9} md={9} sm={9} xs={9} className="my-auto">
                          <Form.Group
                            // className="gender1 gender-style radiotag d-flex"
                            style={{
                              display: "flex",
                              width: "fit-content",
                            }}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.key === "Tab") {
                              } else if (e.keyCode == 9 || e.keyCode == 13) {
                                this.handleKeyDown(e, "email");
                              }
                            }}
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
                              checked={values.gender == "male" ? true : false}
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
                              checked={values.gender == "female" ? true : false}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-1">
                    <Col md="3">
                      <Row>
                        <Col md={4} lg={4} sm={4} xs={4}>
                          <Form.Label>E-mail</Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Group>
                            <Form.Control
                              autoComplete="email1"
                              type="text"
                              placeholder="E-mail"
                              name="email"
                              className="text-box"
                              id="email"
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (
                                  e.shiftKey ||
                                  e.keyCode == 9 ||
                                  e.keyCode == 13
                                ) {
                                  this.handlesetFieldValue(
                                    setFieldValue,
                                    "email",
                                    e.target.value
                                  );
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
                                      msg: "Please Enter Valid Email Id. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document.getElementById("email").focus();
                                    }, 1000);
                                  }
                                } else if (e.keyCode === 9) {
                                  let email_val = e.target.value.trim();
                                  if (
                                    email_val != "" &&
                                    !EMAILREGEXP.test(email_val)
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Valid Email Id. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document.getElementById("email").focus();
                                    }, 1000);
                                  }
                                } else if (e.keyCode === 13) {
                                  let email_val = e.target.value.trim();
                                  if (
                                    email_val != "" &&
                                    !EMAILREGEXP.test(email_val)
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Valid Email Id. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document.getElementById("email").focus();
                                    }, 1000);
                                  } else {
                                    this.handleKeyDown(e, "usercode");
                                  }
                                }
                              }}
                              value={values.email}
                              isValid={touched.email && !errors.email}
                              isInvalid={!!errors.email}
                            />
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
                              autoComplete="usercode"
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
                              className={`${errorArrayBorder[1] == "Y"
                                  ? "border border-danger text-box"
                                  : "text-box"
                                }`}
                              onKeyDown={(e) => {
                                if (
                                  e.shiftKey ||
                                  e.keyCode == 9 ||
                                  e.keyCode == 13
                                ) {
                                  this.handlesetFieldValue(
                                    setFieldValue,
                                    "usercode",
                                    e.target.value
                                  );
                                }

                                if (e.shiftKey && e.keyCode == 9) {
                                  if (values.usercode == "") {
                                    this.setErrorBorder(1, "Y");
                                  } else {
                                    this.setErrorBorder(1, "");
                                  }
                                } else if (e.keyCode == 9) {
                                  if (values.id === "") {
                                    if (
                                      e.target.value.trim() &&
                                      e.target.value.trim() != ""
                                    ) {
                                      this.validateUserDuplicate(
                                        values.usercode,
                                        setFieldValue
                                      );
                                      this.setErrorBorder(1, "");
                                    } else {
                                      e.preventDefault();
                                    }
                                  } else {
                                    if (e.target.value != "") {
                                      e.preventDefault();
                                      this.validateUserUpdateDuplicate(
                                        values.id,
                                        values.usercode,
                                        setFieldValue
                                      );
                                      this.setErrorBorder(1, "");
                                      document
                                        .getElementById("password")
                                        .focus();
                                    } else {
                                      e.preventDefault();
                                    }
                                  }
                                } else if (e.keyCode == 13) {
                                  if (values.id === "") {
                                    if (
                                      e.target.value.trim() &&
                                      e.target.value.trim() != ""
                                    ) {
                                      this.validateUserDuplicate(
                                        values.usercode,
                                        setFieldValue
                                      );
                                      this.setErrorBorder(1, "");
                                    } else {
                                      e.preventDefault();
                                    }
                                  } else {
                                    if (e.target.value != "") {
                                      this.validateUserUpdateDuplicate(
                                        values.id,
                                        values.usercode,
                                        setFieldValue
                                      );
                                      this.setErrorBorder(1, "");
                                      this.handleKeyDown(e, "password");
                                    }
                                  }
                                }
                              }}
                            />
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
                                autoComplete="password"
                                placeholder="Password"
                                name="password"
                                id="password"
                                // className="password-style"
                                onChange={handleChange}
                                value={values.password}
                                invalid={errors.password ? true : false}
                                className={`${errorArrayBorder[2] == "Y"
                                    ? "border border-danger password-style"
                                    : "password-style"
                                  }`}
                                onKeyDown={(e) => {
                                  if (
                                    e.shiftKey ||
                                    e.keyCode == 9 ||
                                    e.keyCode == 13
                                  ) {
                                    this.handlesetFieldValue(
                                      setFieldValue,
                                      "password",
                                      e.target.value
                                    );
                                  }

                                  if (e.shiftKey && e.keyCode == 9) {
                                    if (values.password == "") {
                                      this.setErrorBorder(2, "Y");
                                    } else {
                                      this.setErrorBorder(2, "");
                                    }
                                  } else if (e.key === "Tab") {
                                    if (e.target.value.trim() === "") {
                                      e.preventDefault();
                                    } else {
                                      this.setErrorBorder(2, "");
                                    }
                                  } else if (e.keyCode == 13) {
                                    if (e.target.value.trim() === "") {
                                      e.preventDefault();
                                    } else {
                                      this.setErrorBorder(2, "");
                                      this.handleKeyDown(e, "submit");
                                    }
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
                        id="submit"
                        // disabled={isSubmitting}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.ref.current.handleSubmit();
                          }
                        }}
                      // onClick={(e) => {
                      //   if (values.id === "") {
                      //     {
                      //       this.validateUserDuplicate(
                      //         values.usercode,
                      //         setFieldValue
                      //       );
                      //     }
                      //   } else {
                      //     if (values.id !== "") {
                      //       {
                      //         this.validateUserUpdateDuplicate(
                      //           values.id,
                      //           values.usercode,
                      //           setFieldValue
                      //         );
                      //       }
                      //     }
                      //   }
                      // }}
                      >
                        {values.id == "" ? "Submit" : "Update"}
                      </Button>
                      <Button
                        className="cancel-btn ms-2"
                        type="button"
                        id="cancel"
                        variant="secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          this.pageReload();
                          this.setState({ focusId: "" });
                          this.selectRefA.current?.focus();
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.pageReload();
                            this.setState({ focusId: "" });
                            this.selectRefA.current?.focus();
                            this.handleKeyDown(e, "companyId");
                          }
                        }}
                      >
                        {values.id == "" ? "Clear" : "Clear"}
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
        {/* </Collapse> */}

        <div className="cust_table pt-0">
          <Row className="py-1 mx-0"
            onKeyDown={(e) => {
              if (e.keyCode === 40) {
                document.getElementById("CompanyATr_0")?.focus();
              }
            }}>
            <Col md="3">
              <InputGroup className="mb-1  mdl-text">
                <Form.Control
                  type="text"
                  name="Search"
                  id="Search"
                  onChange={(e) => {
                    this.handleSearch(e.target.value);
                  }}
                  placeholder="Search"
                  className="mdl-text-box"
                  autoComplete="Search"
                  style={{ borderRight: "0px" }}
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      document.getElementById("CompanyATr_0").focus();
                    }
                  }}
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>

          <div className="hsn-tbl-list-style1">
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
                  {/* <th>Status</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody
                className="tabletrcursor prouctTableTr"
                style={{ borderTop: "2px solid transparent" }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.shiftKey && e.keyCode == 9) {
                    document.getElementById("Search").focus();
                  }
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
                        id={`CompanyATr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          this.setUpdateData(v.id, i);
                          this.selectRefA.current?.focus();
                        }}
                      >
                        <td style={{ width: "5%" }}>{i + 1}</td>
                        <td>{v.companyName}</td>
                        <td>{v.fullName}</td>
                        <td>{v.mobileNumber}</td>
                        <td>{v.email != "NA" ? v.email : ""}</td>
                        <td>{v.gender}</td>
                        <td>{v.usercode}</td>
                        <td>
                          <Form.Check
                            type="switch"
                            className="ms-1 my-auto"
                            onClick={this.handleSwitchClick}
                            onChange={(e) => {
                              let val = e.target.checked;
                              // console.log("Is Checked:--->", e.target.checked);
                              this.handleCompany(val, v.id);
                              // this.gstFieldshow(e.target.checked);
                              // setFieldValue(
                              //   "isSwitch",
                              //   e.target.checked
                              // );
                            }}
                            checked={v.isSwitch == true ? true : false}
                            name="isSwitch"
                            id="isSwitch"
                            value={v.isSwitch}
                          />
                        </td>
                        {/* <td> */}
                        {/* <img
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
                          /> */}
                        {/* <Form.Select
                            size="sm"
                            className="custom-select"
                            style={{ boxShadow: "none" }}
                          >
                            <option>Active</option>
                            <option>Deactive</option>
                          </Form.Select> */}
                        {/* </td> */}
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
    );
  }
}
