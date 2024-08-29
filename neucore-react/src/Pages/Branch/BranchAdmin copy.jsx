import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  InputGroup,
  InputGroupText,
} from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  get_companies_super_admin,
  get_companies_data,
  createCompanyUser,
  get_c_admin_users,
  get_user_by_id,
  updateInstituteUser,
  createBranchUser,
  getBranchesByCompany,
  get_b_admins,
  getBranchBySelectionCompany,
  validateUsers,
  validateBranchAdmin,
} from "@/services/api_functions";
import Select from "react-select";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";

import {
  faEye,
  faEyedropper,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  customStyles,
  categorySelectTo,
  OnlyAlphabets,
  OnlyEnterNumbers,
  ledger_select,
  getSelectValue,
  MyNotifications,
  allEqual,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

const user_options = [
  { label: "Admin", value: "BADMIN" },
  { label: "User", value: "USER" },
  // more options...
];

export default class BranchAdmin extends Component {
  constructor(props) {
    super(props);
    this.brachRef = React.createRef();

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

      errorArrayBorder: "",
    };
    this.ref = React.createRef();
    this.selectRef = React.createRef();
    this.selectRefA = React.createRef();
    this.radioRef = React.createRef();
  }
  validateUserDuplicate = (user_code, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("userCode", user_code);
    // reqData.append("outletId", outlet_id);
    // reqData.append("branchId", branch_id);
    validateBranchAdmin(reqData)
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
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // listGetBranch = (status = false) => {
  //   getBranchesByCompany()
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         let d = res.responseObject;
  //         let Opt = [];
  //         if (d.length > 0) {
  //           Opt = d.map(function (values) {
  //             return { value: values.id, label: values.branchName };
  //           });
  //         }
  //         console.log("Branch  Opt", Opt);
  //         this.setState({ opBranchList: Opt }, () => {
  //           // let instituteId = getValue(
  //           //   Opt,
  //           //   authenticationService.currentUserValue.instituteId
  //           // );
  //           // this.ref.current.setFieldValue("instituteId", instituteId);
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       this.setState({ opInstituteList: [] });
  //       console.log("error", error);
  //     });
  // };
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
          console.log("Company list : ", Opt);
          this.setState({ opCompanyList: Opt }, () => {
            let companyId = this.state.opCompanyList.find(
              (o) =>
                o.value === authenticationService.currentUserValue.companyId
            );
            console.log("companyId", companyId);
            this.ref.current.setFieldValue("companyId", companyId);
            this.listGetBranch(companyId);
          });
        }
      })
      .catch((error) => {
        this.setState({ opInstituteList: [] });
        console.log("error", error);
      });
  };

  listUsers = () => {
    get_b_admins()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            this.setState({ data: data, orgData: res.responseObject }, () => {
              this.brachRef.current.setFieldValue("search", "");
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  togglePasswordVisiblity = (status) => {
    this.setState({ showPassword: status });
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };
  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
      (v.fullName != null && v.fullName.toLowerCase().includes(vi.toLowerCase())) ||
      (  v.companyName != null && v.companyName.toLowerCase().includes(vi.toLowerCase())  ) ||
      ( v.mobileNumber != ""  &&  v.mobileNumber.toString().includes(vi.toString().toLowerCase()) ) ||
      (  v.email != null && v.email.toLowerCase().includes(vi.toLowerCase())) ||
      (  v.gender != null &&  v.gender.toLowerCase().includes(vi.toLowerCase())) ||
      (  v.username  != null && v.username.toLowerCase().includes(vi.toLowerCase()))
        
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

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listUsers();
      this.listGetCompany();
      // this.listGetBranch();
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
    let { opCompanyList } = this.state;

    this.ref.current.resetForm();
    // this.ref.current.setFieldValue(
    //   "companyId",
    //   getSelectValue(
    //     opCompanyList,
    //     parseInt(authenticationService.currentUserValue.companyId)
    //   )
    // );
    this.setState({
      opendiv: false,
      //opCompanyList: [],
      data: [],
      BranchInitVal: {
        id: "",
        companyId: "",
        branchId: "",
        role: "",
        fullName: "",
        mobileNumber: "",
        userRole: "BADMIN",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      errorArrayBorder: "",
    });
  };
  setUpdateData = (id) => {
    const {
      opBranchList,
      countryOpt,
      prop_data,
      isDataSet,
      GSTopt,
      opCompanyList,
      user_options,
    } = this.state;
    let formData = new FormData();
    formData.append("id", id);
    get_user_by_id(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let userData = res.responseObject;
          console.log("userData------>", userData);
          let branchInitVal = {
            id: userData.id,
            companyId: userData.companyId
              ? getSelectValue(opCompanyList, userData.companyId)
              : "",
            branchId: userData.branchId
              ? getSelectValue(opBranchList, userData.branchId)
              : "",
            userRole: userData.userRole,
            // branchId: getSelectValue(opBranchList, userData.branchId),
            // role: getSelectValue(user_options, userData.role),
            fullName: userData.fullName,
            // role: userData.role,
            mobileNumber:
              userData.mobileNumber != "NA" ? userData.mobileNumber : "",
            // userRole: getSelectValue(this.state.userRole),
            email:
              userData.email != "NA" && userData.email != null
                ? userData.email
                : "",
            gender: userData.gender,
            usercode: userData.usercode,
            password: userData.password,
          };
          console.log("companyInitVal ", branchInitVal);
          this.setState({ BranchInitVal: branchInitVal, opendiv: true });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  validationSchema = () => {
    if (this.state.BranchInitVal.id == "") {
      return Yup.object().shape({
        companyId: Yup.object().nullable().required("Select Company"),
        branchId: Yup.object().nullable().required("Select Branch"),
        // role: Yup.object().nullable().required("Select Role"),

        fullName: Yup.string().trim().required("Full name is required"),
        // mobileNumber: Yup.string()
        //   .trim()
        //   .matches(numericRegExp, "Enter valid mobile number")
        //   .required("Mobile number is required"),
        mobileNumber: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(numericRegExp, "Enter valid Mobile Number")
              .required("Mobile Number is required");
          }
          return Yup.string().notRequired();
        }),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        // email: Yup.string()
        //   .trim()
        //   .matches(EMAILREGEXP, "Enter valid Email Id")
        //   .required("Enter Email Id"),
        gender: Yup.string().trim().required("Gender is required"),
        password: Yup.string().trim().required("Password is required"),
        usercode: Yup.string().trim().required("Username is required"),
      });
    } else {
      return Yup.object().shape({
        companyId: Yup.object().required("Select Company"),
        branchId: Yup.object().required("Select Branch"),
        // role: Yup.object().required("Select Role"),
        fullName: Yup.string().trim().required("Full Name is required"),
        // mobileNumber: Yup.string()
        //   .trim()
        //   .matches(numericRegExp, "Enter valid mobile number")
        //   .required("Mobile Number is required"),
        mobileNumber: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .nullable()
              .matches(numericRegExp, "Enter valid Mobile Number")
              .required("Mobile Number is required");
          }
          return Yup.string().notRequired();
        }),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        // email: Yup.string()
        //   .trim()
        //   .matches(EMAILREGEXP, "Enter valid Email Id")
        //   .required("Enter Email Id"),
        gender: Yup.string().trim().required("gender is required"),
        // password: Yup.string().trim().required("password is required"),
        usercode: Yup.string().trim().required("usercode is required"),
      });
    }
  };
  listGetBranch = (id) => {
    console.log("id of company=>", id.value);
    this.setState({ opBranchList: [] }, () => {
      let formData = new FormData();
      formData.append("id", id.value);
      getBranchBySelectionCompany(formData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let d = res.responseObject;
            let Opt = [];
            if (d.length > 0) {
              Opt = d.map(function (values) {
                return { value: values.id, label: values.branchName };
              });
            }
            console.log("Branch List : ", Opt);
            this.setState({ opBranchList: Opt }, () => {
              // let instituteId = getValue(
              //   Opt,
              //   authenticationService.currentUserValue.instituteId
              // );
              // this.ref.current.setFieldValue("instituteId", instituteId);
            });
          }
        })
        .catch((error) => {
          this.setState({ opInstituteList: [] });
          console.log("error", error);
        });
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  // ! function set border to required fields
  setErrorBorder(index, value) {
    let { errorArrayBorder } = this.state;
    let errorArrayData = [];
    if (errorArrayBorder.length > 0) {
      errorArrayData = errorArrayBorder;
      if (errorArrayBorder.length >= index) {
        errorArrayData.splice(index, 1, value);
      } else {
        Array.from(Array(index), (v) => {
          errorArrayData.push(value);
        });
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
      opendiv,
      data,
      BranchInitVal,
      opBranchList,
      showPassword,
      errorArrayBorder,
    } = this.state;
    return (
      <div>
        <div style={{ overflow: "auto", overflowX: "hidden" }} className="">
          <Collapse in={opendiv}>
            <div>
              <div className="main-div mb-2 m-0">
                <h4 className="form-header">Branch Admin Details</h4>
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={BranchInitVal}
                  innerRef={this.ref}
                  // validationSchema={this.validationSchema()}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    // debugger;
                    console.log("value", values);

                    //! validation required start
                    let errorArray = [];
                    // if (values.companyId == "") {
                    //   errorArray.push("Y");
                    // } else {
                    //   errorArray.push("");
                    // }

                    if (values.branchId == "") {
                      errorArray.push("Y");
                    } else {
                      errorArray.push("");
                    }

                    if (values.fullName == "") {
                      errorArray.push("Y");
                    } else {
                      errorArray.push("");
                    }

                    if (values.gender == "") {
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
                        let keys = Object.keys(BranchInitVal);
                        let requestData = new FormData();
                        keys.map((v) => {
                          if (
                            values[v] != "" &&
                            v != "branchId" &&
                            v != "companyId"
                          ) {
                            requestData.append(v, values[v]);
                          }
                        });
                        // requestData.append("userRole", values.userRole);
                        requestData.append("companyId", values.companyId.value);
                        requestData.append("branchId", values.branchId.value);
                        // requestData.append("password", values.password);
                        setSubmitting(true);
                        if (values.id == "") {
                          MyNotifications.fire(
                            {
                              show: true,
                              icon: "confirm",
                              title: "Confirm",
                              msg: "Do you want to Submit",
                              is_button_show: false,
                              is_timeout: false,
                              delay: 0,
                              handleSuccessFn: () => {
                                createBranchUser(requestData)
                                  .then((response) => {
                                    // setSubmitting(false);
                                    let res = response.data;
                                    if (res.responseStatus == 200) {
                                      resetForm();
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "success",
                                        title: "Success",
                                        msg: res.message,
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      this.pageReload();
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
                                  .catch((error) => {
                                    setSubmitting(false);
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
                            },
                            () => {
                              console.warn("return_data");
                            }
                          );
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
                                        msg: res.message,
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
                                        msg: res.message,
                                        is_button_show: true,
                                      });
                                    }
                                  })
                                  .catch((error) => {
                                    // setSubmitting(false);
                                    requestData.append(
                                      "branchId",
                                      values.branchId.value
                                    );
                                    console.log("error", error);
                                  });
                              },
                              handleFailFn: () => {
                                setSubmitting(false);
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: "Error While Updating Branch Admin",
                                  is_timeout: true,
                                  delay: 1000,
                                });
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
                      style={{ background: "#fff" }}
                      autoComplete="nope"
                      onKeyDown={(e) => {
                        if (e.keyCode == 13) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="mb-2 common-form-style">
                        <Row className="mt-3">
                          <Col md="12" className="mb-2">
                            <h5 className="Mail-title"></h5>
                            <Row className="row-inside">
                              <Col lg={1} className=" for_padding">
                                <Form.Label className="my_lbl">
                                  Company Name
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group
                                  // className="createnew"
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   if (!values.companyId) {
                                  //     this.selectRefA.current?.focus();
                                  //   }
                                  // }}

                                  className={`${values.companyId == "" &&
                                    errorArrayBorder[0] == "Y"
                                    ? "border border-danger createnew"
                                    : "createnew"
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
                                  onKeyDown={(e) => {
                                    if (e.key === "Tab" && !values.companyId)
                                      e.preventDefault();
                                  }}
                                  style={{ borderRadius: "4px" }}
                                >
                                  <Select
                                    ref={this.selectRefA}
                                    className="selectTo"
                                    styles={ledger_select}
                                    // className="selectTo selectdd-style"
                                    // styles={categorySelectTo}
                                    isDisabled={true}
                                    onChange={(v) => {
                                      if (v != null) {
                                        setFieldValue("companyId", v);
                                        this.listGetBranch(v);
                                      } else {
                                        setFieldValue("companyId", "");
                                        setFieldValue("branchId", "");
                                        this.setState({
                                          opBranchList: [],
                                        });
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
                              <Col lg={1}>
                                <Form.Label className="my_lbl">
                                  Branch Name
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group
                                  className={`${values.branchId == "" &&
                                    errorArrayBorder[1] == "Y"
                                    ? "border border-danger "
                                    : ""
                                    }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.branchId) {
                                      this.setErrorBorder(1, "");
                                    } else {
                                      this.setErrorBorder(1, "Y");
                                      // this.selectRef.current?.focus();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !values.branchId
                                    )
                                      e.preventDefault();
                                  }}
                                  style={{ borderRadius: "4px" }}
                                >
                                  <Select
                                    ref={this.selectRef}
                                    isClearable={true}
                                    autoFocus={true}
                                    className="selectTo"
                                    styles={ledger_select}
                                    // className="selectTo selectdd-style"
                                    // styles={categorySelectTo}
                                    onChange={(v) => {
                                      if (v != null) {
                                        setFieldValue("branchId", v);
                                      } else {
                                        setFieldValue("branchId", "");
                                      }
                                    }}
                                    name="branchId"
                                    options={opBranchList}
                                    value={values.branchId}
                                    invalid={errors.branchId ? true : false}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.branchId && errors.branchId}
                                  </span>
                                </Form.Group>
                              </Col>
                              {/* <Col lg={1}>
                              <Form.Label className="my_lbl">
                                Role<span className="text-danger">*</span>
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Select
                                  isClearable={true}
                                  className="selectTo"
                                  styles={ledger_select}
                                  // className="selectTo selectdd-style"
                                  // styles={categorySelectTo}
                                  // onChange={(e) => {
                                  //   setFieldValue("role", e);
                                  // }}
                                  onChange={(v) => {
                                    if (v != null) {
                                      setFieldValue("role", v);
                                    } else {
                                      setFieldValue("role", "");
                                    }
                                  }}
                                  options={user_options}
                                  name="role"
                                  value={values.role}
                                  invalid={errors.role ? true : false}
                                />
                                <span className="text-danger errormsg">
                                  {errors.role}
                                </span>
                              </Form.Group>
                            </Col> */}
                              <Col lg={1}>
                                <Form.Label className="my_lbl">
                                  Full Name
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="nope"
                                    // onKeyDown={(e) => {
                                    //   if (e.key === "Tab" && !e.target.value)
                                    //     e.preventDefault();
                                    // }}
                                    type="text"
                                    placeholder="Full Name"
                                    name="fullName"
                                    id="fullName"
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                      OnlyAlphabets(e);
                                    }}
                                    value={values.fullName}
                                    // isValid={
                                    //   touched.fullName && !errors.fullName
                                    // }
                                    isInvalid={!!errors.fullName}
                                    className={`${values.fullName == "" &&
                                      errorArrayBorder[2] == "Y"
                                      ? "border border-danger text-box"
                                      : "text-box"
                                      }`}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      if (e.target.value) {
                                        this.setErrorBorder(2, "");
                                      } else {
                                        this.setErrorBorder(2, "Y");
                                        document
                                          .getElementById("fullName")
                                          .focus();
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.fullName}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col lg={1}>
                                <Form.Label className="my_lbl mb-0">
                                  Gender<span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col lg={2}>
                                <Form.Group
                                  style={{
                                    width: "fit-content",
                                    display: "flex",
                                  }}
                                  className={`${values.gender == "" &&
                                    errorArrayBorder[3] == "Y"
                                    ? "border border-danger gender1 custom-control-inline radiotag"
                                    : "gender1 custom-control-inline radiotag"
                                    }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.gender) {
                                      this.setErrorBorder(3, "");
                                    } else {
                                      this.setErrorBorder(3, "Y");
                                      // this.radioRef.current?.focus();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !values.gender
                                    )
                                      e.preventDefault();
                                  }}
                                >
                                  <Form.Check
                                    ref={this.radioRef}
                                    type="radio"
                                    label="Male"
                                    className="pr-3 my_lbl me-2"
                                    name="gender"
                                    id="gender1"
                                    value="male"
                                    onChange={handleChange}
                                    checked={
                                      values.gender == "male" ? true : false
                                    }
                                  />
                                  <Form.Check
                                    // ref={this.radioRef}
                                    style={{
                                      height: "14px",
                                      left: "0%",
                                      right: "0%",
                                      top: "0px",
                                    }}
                                    type="radio"
                                    label="Female"
                                    name="gender"
                                    id="gender2"
                                    value="female"
                                    className="my_lbl"
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
                            </Row>
                            <Row className="mt-2 row-inside">
                              <Col lg={1}>
                                <Form.Label className="my_lbl">
                                  Mobile No.
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="nope"
                                    className="text-box"
                                    type="text"
                                    placeholder=" Mobile No"
                                    onKeyPress={(e) => {
                                      OnlyEnterNumbers(e);
                                    }}
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
                                    name="mobileNumber"
                                    id="mobileNumber"
                                    onChange={handleChange}
                                    value={values.mobileNumber}
                                    // isValid={
                                    //   touched.mobileNumber &&
                                    //   !errors.mobileNumber
                                    // }
                                    isInvalid={!!errors.mobileNumber}
                                    maxLength={10}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.mobileNumber}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col lg={1}>
                                <Form.Label className="my_lbl">
                                  E-mail
                                </Form.Label>
                              </Col>

                              <Col md="2">
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="nope"
                                    className="text-box"
                                    type="text"
                                    placeholder="E-mail"
                                    name="email"
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
                                    // isValid={touched.email && !errors.email}
                                    isInvalid={!!errors.email}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.email}
                                  </span>
                                </Form.Group>
                              </Col>

                              <Col lg={1}>
                                <Form.Label className="my_lbl">
                                  Username<span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Control
                                    // onKeyDown={(e) => {
                                    //   if (e.key === "Tab" && !e.target.value)
                                    //     e.preventDefault();
                                    // }}
                                    autoComplete="nope"
                                    type="text"
                                    placeholder="Username"
                                    name="usercode"
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
                                    className={`${values.usercode == "" &&
                                      errorArrayBorder[4] == "Y"
                                      ? "border border-danger text-box"
                                      : "text-box"
                                      }`}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      if (e.target.value) {
                                        this.setErrorBorder(4, "");
                                        this.validateUserDuplicate(
                                          values.usercode,
                                          values.companyId.value,
                                          values.branchId.value,
                                          setFieldValue
                                        );
                                      } else {
                                        this.setErrorBorder(4, "Y");
                                        document
                                          .getElementById("usercode")
                                          .focus();
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
                                  <span className="text-danger errormsg">
                                    {errors.usercode}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col md="3">
                                <Row>
                                  <Col lg={4}>
                                    <Form.Label className="my_lbl">
                                      Password
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    {/* <Form.Group> */}
                                    <InputGroup>
                                      <Form.Control
                                        // onKeyDown={(e) => {
                                        //   if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        autoComplete="nope"
                                        type="text"
                                        style={{
                                          webkitTextSecurity:
                                            showPassword != ""
                                              ? "disc"
                                              : "unset",
                                          border: "1px solid #dcdcdc",
                                        }}
                                        placeholder="Password"
                                        name="password"
                                        id="password"
                                        onChange={handleChange}
                                        value={values.password}
                                        invalid={errors.password ? true : false}
                                        className={`${values.password == "" &&
                                          errorArrayBorder[5] == "Y"
                                          ? "border border-danger "
                                          : ""
                                          }`}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          if (e.target.value) {
                                            this.setErrorBorder(5, "");
                                          } else {
                                            this.setErrorBorder(5, "Y");
                                            // document
                                            //   .getElementById("password")
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
                                    </InputGroup>
                                    <span className="text-danger errormsg">
                                      {errors.password}
                                    </span>
                                    {/* </Form.Group> */}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12" className="btn_align">
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
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Collapse>
          <div className="ledger-group-style">
            <div className="cust_table">
              <Row>
                {/* <Col md="3"> */}
                {/* <div className=""> */}
                {/* <Form>
                    <Form.Group className="mt-1" controlId="formBasicSearch">
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        className="search-box"
                      />
                    </Form.Group>
                  </Form> */}
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  innerRef={this.brachRef}
                  initialValues={{ search: "" }}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                    // groupName: Yup.string().trim().required("Group name is required"),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => { }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    resetForm,
                  }) => (
                    // {!opendiv && (
                    <Form>
                      <Row>
                        <Col md="3">
                          {/* <Form>
                      <Form.Group className="mt-1" controlId="formBasicSearch">
                        <Form.Control
                          type="text"
                          placeholder="Search"
                          className="search-box"
                          id="search"
                          name="search"
                          onChange={(e) => {
                            let v = e.target.value;
                            console.log({ v });
                            setFieldValue("search", v);
                            this.handleSearch(v);
                          }}
                          value={values.search}
                        />
                        <Button type="submit">x</Button>
                      </Form.Group>
                    </Form> */}
                          <InputGroup className="mb-2 mdl-text">
                            <Form.Control
                              placeholder="Search"
                              // aria-label="Search"
                              // aria-describedby="basic-addon1"
                              // style={{ borderRight: "none" }}
                              className="mdl-text-box"
                              autoFocus="true"
                              onChange={(e) => {
                                let v = e.target.value;
                                console.log({ v });
                                setFieldValue("search", v);
                                this.handleSearch(v);
                              }}
                              autoComplete="nope"
                              value={values.search}
                            />
                            <InputGroup.Text
                              className="int-grp"
                              id="basic-addon1"
                              style={{ border: "1px solid #fff" }}
                            >
                              <img className="srch_box" src={search} alt="" />
                            </InputGroup.Text>
                          </InputGroup>
                        </Col>

                        <Col md="9" className="text-end">
                          {!opendiv && (
                            <Button
                              className="create-btn mr-2"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ opendiv: !opendiv }, () => {
                                  setTimeout(() => {
                                    this.selectRef.current?.focus();
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
                      class="bi bi-plus-square-dotted svg-style"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg> */}
                            </Button>
                          )}

                          {/* <Button
                  className="ml-2 btn-refresh"
                  type="button"
                  onClick={() => {
                    this.pageReload();
                  }}
                >
                  <img src={refresh} alt="icon" />
                </Button> */}
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
                {/* </div> */}
                {/* </Col> */}
              </Row>
              <div className="tbl-list-style1 tbl-body-style">
                <Table size="sm" className="tbl-font">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>Sr. No.</th>
                      <th>Company Name</th>
                      <th>Full Name</th>
                      <th>Mobile Number</th>
                      <th>E-mail</th>
                      <th>Gender</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody
                    style={{ borderTop: "2px solid transparent" }}
                    className="tabletrcursor prouctTableTr"
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
                            <td style={{ width: "5%", lineHeight: "30px" }}>
                              {i + 1}
                            </td>
                            <td style={{ lineHeight: "30px" }}>
                              {v.companyName}
                            </td>
                            <td style={{ lineHeight: "30px" }}>{v.fullName}</td>
                            <td style={{ lineHeight: "30px" }}>
                              {v.mobileNumber != "NA" ? v.mobileNumber : ""}
                            </td>
                            <td style={{ lineHeight: "30px" }}>
                              {v.email != "NA" ? v.email : ""}
                            </td>
                            <td style={{ lineHeight: "30px" }}>{v.gender}</td>
                            <td style={{ lineHeight: "30px" }}>{v.usercode}</td>
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
                  <thead className="tbl-footer mb-2">
                    <tr>
                      <th
                        colSpan={7}
                        className=""
                        style={{ borderTop: " 2px solid transparent" }}
                      >
                        {Array.from(Array(1), (v) => {
                          return (
                            <tr>
                              {/* <th>&nbsp;</th> */}
                              <th>Total Branch Admin List :</th>
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
      </div>
    );
  }
}
