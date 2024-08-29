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
  authenticationService,
  createCompany,
  getIndianState,
  getIndiaCountry,
  get_companies_super_admin,
  getGSTTypes,
  getBranchById,
  updateBranchById,
  getBranchesByCompany,
  createBranch,
  get_branches_superAdmin,
  validateBranch,
} from "@/services/api_functions";
import search from "@/assets/images/search_icon@3x.png";

import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  EMAILREGEXP,
  numericRegExp,
  urlRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  ledger_select,
  OnlyEnterNumbers,
  categorySelectTo,
  MyTextDatePicker,
  getSelectValue,
  MyNotifications,
} from "@/helpers";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import refresh from "@/assets/images/refresh.png";

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

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

const Currencyopt = [{ label: "INR", value: "INR" }];

export default class Branch extends React.Component {
  constructor() {
    super();
    this.brachRef = React.createRef();

    this.state = {
      toggle: false,
      opendiv: false,
      opInstituteList: [],
      opBranchList: [],
      opCompanyList: [],
      data: [],
      stateOpt: [],
      countryOpt: [],
      GSTopt: [],
      BranchInitVal: {
        id: "",
        companyId: "",
        companyName: "",
        branchName: "",
        branchCode: "",
        role: "",
        registeredAddress: "",
        corporateAddress: "",
        pincode: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
        website: "",
        gstApplicable: "no",
        panCard: "",
        gstIn: "",
        gstType: "",
        gstApplicableDate: "",
        country_id: "",
        state_id: "",
        currency: "",

      },
    };
    this.ref = React.createRef();
  }

  lstState = () => {
    getIndianState()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // console.log("response state", response);
          let opt = d.map((v) => {
            return { label: v.stateName, value: v.id };
          });
          this.setState({ stateOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        // console.log("country res", response);
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt });
        this.ref.current.setFieldValue("country_id", opt[0]);
        this.ref.current.setFieldValue("currency", Currencyopt[0]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  listGetBranch = (status = false) => {
    get_branches_superAdmin()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              data: res.responseObject,
              orgData: res.responseObject,
            },
            () => {
              this.brachRef.current.setFieldValue("search", "");
            }
          );
          //   let d = res.responseObject;
          //   let Opt = [];
          //   if (d.length > 0) {
          //     Opt = d.map(function (values) {
          //       return { value: values.id, label: values.branchName };
          //     });
          //   }
          //   this.setState({ data: Opt }, () => {
          //     // let instituteId = getValue(
          //     //   Opt,
          //     //   authenticationService.currentUserValue.instituteId
          //     // );
          //     // this.ref.current.setFieldValue("instituteId", instituteId);
          //   });
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
      });
  };
  /**** validation for Branch Dulication *****/
  validateBranchDuplicate = (branch_name, company_id, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("branchName", branch_name);
    reqData.append("outletId", company_id);
    validateBranch(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "warn",
            title: "Warning",
            msg: res.message,
            is_timeout: true,
            delay: 1500,
          });
          setFieldValue("branchName", "");

          //this.reloadPage();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  listGSTTypes = () => {
    getGSTTypes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            return { label: v.gstType, value: v.id };
          });
          this.setState({ GSTopt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  setInitValues = () => {
    this.ref.current.resetForm();
    this.setState({
      toggle: false,
      opendiv: false,
      BranchInitVal: {
        id: "",
        companyId: "",
        branchName: "",
        branchCode: "",
        role: "",
        registeredAddress: "",
        corporateAddress: "",
        pincode: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
        website: "",
        gstApplicable: "no",
        panCard: "",
        gstIn: "",
        gstType: "",
        gstApplicableDate: "",
        country_id: "",
        state_id: "",
        currency: "",
      },
    });
  };
  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };
  handleSearch = (vi) => {
    // debugger;
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        v.companyName.toLowerCase().includes(vi.toLowerCase()) ||
        v.branchName.toLowerCase().includes(vi.toLowerCase()) ||
        v.registeredAddress.toLowerCase().includes(vi.toLowerCase()) ||
        v.corporateAddress.toLowerCase().includes(vi.toLowerCase()) ||
        v.branchCode.toLowerCase().includes(vi.toLowerCase())
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
      this.lstState();
      this.lstCountry();
      this.listGetBranch();
      this.listGetCompany();
      this.listGSTTypes();
      this.setInitValues();
      // mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValues);
    }
  }

  componentWillUnmount() {
    // mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValues);
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
  };
  setEditData = (companyId) => {
    const {
      stateOpt,
      countryOpt,
      prop_data,
      isDataSet,
      GSTopt,
      opCompanyList,
    } = this.state;
    let reqData = new FormData();
    reqData.append("id", companyId);
    getBranchById(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          console.log("d---------->", d);
          let BranchInitVal = {
            id: d.id,
            companyId: d.companyId
              ? getSelectValue(opCompanyList, d.companyId)
              : "",
            companyName: d.companyName ? d.companyName : "",
            branchName: d.branchName ? d.branchName : "",
            branchCode: d.branchCode ? d.branchCode : "",
            registeredAddress: d.registeredAddress ? d.registeredAddress : "",
            corporateAddress: d.corporateAddress ? d.corporateAddress : "",
            pincode: d.pincode ? d.pincode : "",
            mobileNumber: d.mobileNumber ? d.mobileNumber : "",
            whatsappNumber: d.whatsappNumber ? d.whatsappNumber : "",
            email: d.email ? (d.email != "NA" ? d.email : "") : "",
            website: d.website ? (d.website != "NA" ? d.website : "") : "",
            country_id: d.country_id
              ? getSelectValue(countryOpt, d.country_id)
              : "",
            state_id: d.state_id ? getSelectValue(stateOpt, d.state_id) : "",
            currency: d.currency ? getSelectValue(Currencyopt, d.currency) : "",
            manageOutlets: d.manageOutlets == true ? "yes" : "no",
            gstApplicable: d.gstApplicable == false ? "no" : "yes",
            panCard: "",
            gstIn: "",
            gstType: "",
            gstApplicableDate: "",
          };
          if (d.gstApplicable == true) {
            BranchInitVal["gstIn"] = d.gstIn ? d.gstIn : "";
            BranchInitVal["gstApplicableDate"] = d.gstApplicableDate
              ? new Date(d.gstApplicableDate)
              : "";
            BranchInitVal["gstType"] = d.gstType
              ? getSelectValue(GSTopt, d.gstType)
              : "";
          }

          this.setState({
            toggle: d.gstApplicable,
            BranchInitVal: BranchInitVal,
            opendiv: true,
          });
        }
        console.log("response", response);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      data,
      stateOpt,
      opendiv,
      countryOpt,
      GSTopt,
      BranchInitVal,
      toggle,
      opCompanyList,
      CompanyInitVal,
    } = this.state;
    // const validate = (values) => {
    //   debugger;
    //   const errors = {};
    //   if (!values.companyId) {
    //     errors.companyId = "Required";
    //   }
    //   if (!values.country_id) {
    //     errors.country_id = "Required";
    //   }
    //   if (!values.state_id) {
    //     errors.state_id = "Required";
    //   }
    //   if (!values.branchName) {
    //     errors.branchName = "Required";
    //   }
    //   if (!values.branchCode) {
    //     errors.branchCode = "Required";
    //   }
    //   if (!values.registeredAddress) {
    //     errors.registeredAddress = "Required";
    //   }
    //   if (!values.corporateAddress) {
    //     errors.corporateAddress = "Required";
    //   }
    //   // if (!values.email) {
    //   //   errors.email = "Required";
    //   // } else if (EMAILREGEXP.test(values.email)) {
    //   //   errors.email = "Invalide Email Address";
    //   // }
    //   //  else if (values.email) {
    //   //   errors.email = "Not required";
    //   // }
    //   // if(!values.gstIn)
    // };
    return (
      <div>
        <div style={{ height: "86vh", overflow: "auto" }}>
          <Collapse in={opendiv}>
            <div
              id="example-collapse-text"
              className="common-form-style mt-2 p-2"
            >
              <div className="main-div mb-2 m-0">
                <h4 className="form-header">Create Branch</h4>
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={BranchInitVal}
                  innerRef={this.ref}
                  // validate={validate}
                  validationSchema={Yup.object().shape({
                    companyId: Yup.object()
                      .nullable()
                      .required("Select Company"),
                    country_id: Yup.object()
                      .nullable()
                      .required("Select Country"),
                    state_id: Yup.object().nullable().required("Select State"),
                    branchName: Yup.string()
                      .trim()
                      .required("Branch name is required"),
                    // branchCode: Yup.string()
                    //   .trim()
                    //   .required("Branch code is required"),

                    // registeredAddress: Yup.string()
                    //   .trim()
                    //   .required("Registered address is required"),
                    // corporateAddress: Yup.string()
                    //   .trim()
                    //   .required("Corporate address is required"),
                    // pincode: Yup.string().trim().required("Pincode is required"),
                    // mobileNumber: Yup.lazy((v) => {
                    //   if (v != undefined) {
                    //     return Yup.string()
                    //       .trim()
                    //       .matches(numericRegExp, "Enter valid mobile number")
                    //       .required("Mobile Number is required");
                    //   }
                    // }),
                    // whatsappNumber: Yup.string()
                    //   .trim()
                    //   .matches(numericRegExp, "Enter valid mobile number")
                    //   .required("Whatsapp number is required"),
                    // whatsappNumber: Yup.lazy((v) => {
                    //   if (v != undefined) {
                    //     return Yup.string()
                    //       .trim()
                    //       .matches(numericRegExp, "Enter valid mobile number")
                    //       .required("Whatsapp number is required");
                    //   }
                    // }),
                    mobileNumber: Yup.lazy((v) => {
                      if (v != undefined) {
                        return Yup.string()
                          .trim()
                          .matches(numericRegExp, "Enter valid Mobile Number")
                          .required("Mobile Number is required");
                      }
                      return Yup.string().notRequired();
                    }),
                    whatsappNumber: Yup.lazy((v) => {
                      if (v != undefined) {
                        return Yup.string()
                          .trim()
                          .matches(
                            numericRegExp,
                            "Enter valid Whatsapp Number "
                          )
                          .required("Whatsapp Number is required");
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
                    //   .matches(EMAILREGEXP, "Enter valid email id contains @")
                    //   .required("Enter email id"),
                    panCard: Yup.lazy((v) => {
                      if (v != undefined) {
                        return Yup.string().required("Website is required");
                      }
                      return Yup.string().notRequired();
                    }),
                    gstIn: Yup.string().when("gstApplicable", {
                      is: (v) => {
                        if (v && v == "yes") return true;
                        return false;
                      },
                      then: Yup.string().required("GSTIN is required"),
                    }),

                    gstType: Yup.object()
                      .nullable()
                      .when("gstApplicable", {
                        is: (v) => {
                          if (v && v == "yes") return true;
                          return false;
                        },
                        then: Yup.object()
                          .nullable()
                          .required("GST Type is required"),
                      }),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    // debugger;
                    console.log("values", values);
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to save",
                        is_button_show: false,
                        is_timeout: false,
                        handleSuccessFn: () => {
                          let keys = Object.keys(BranchInitVal);
                          // console.log('keys', keys);
                          let requestData = new FormData();
                          keys.map((v) => {
                            // console.log("v", v, "values", values[v]);
                            if (
                              values[v] != "" &&
                              v != "state_id" &&
                              v != "country_id" &&
                              v != "currency" &&
                              v != "gstType" &&
                              v != "gstApplicableDate" &&
                              v != "companyId"
                            ) {
                              requestData.append(v, values[v]);
                            }
                          });
                          //   keys.map((v) => {
                          //     if (values[v] != "" && v != "companyId") {
                          //       requestData.append(v, values[v]);
                          //     }
                          //   });
                          console.log("values", values);
                          console.log("CompayId", values.companyId.value);
                          requestData.append(
                            "companyId",
                            values.companyId.value
                          );
                          //   requestData.append(
                          //     "companyId",
                          //     authenticationService.currentUserValue &&
                          //       authenticationService.currentUserValue.companyId
                          //   );

                          requestData.append(
                            "gstApplicable",
                            toggle == true ? "yes" : "no"
                          );
                          if (toggle == true) {
                            requestData.append("gstType", values.gstType.value);

                            if (values.gstApplicableDate != "") {
                              requestData.append(
                                "gstApplicableDate",
                                moment(values.gstApplicableDate).format(
                                  "yyyy-MM-DD"
                                )
                              );
                            }
                          }

                          requestData.append("state_id", values.state_id.value);
                          requestData.append(
                            "country_id",
                            values.country_id.value
                          );
                          if (values.website == "") {
                            requestData.append("website", "");
                          }
                          requestData.append("currency", values.currency.value);
                          // setSubmitting(true);
                          // for (let [name, value] of requestData) {
                          //   console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                          // }

                          if (values.id == "") {
                            createBranch(requestData)
                              .then((response) => {
                                resetForm();
                                // setSubmitting(false);
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
                                console.log("error", error);
                              });
                          } else {
                            updateBranchById(requestData)
                              .then((response) => {
                                // debugger;
                                resetForm();
                                // setSubmittin/g(false);
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
                                console.log("error", error);
                              });
                          }
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
                    isSubmitting,
                    resetForm,
                    setFieldValue,
                  }) => (
                    <Form
                      onSubmit={handleSubmit}
                      className="form-style"
                      autoComplete="off"
                    >
                      {/* {JSON.stringify(errors)} */}
                      <div className="common-form-style m-0 mb-2">
                        <Row className="mt-4">
                          <Col lg={12} className="mb-2">
                            <h5 className="title-style">Institute Details</h5>

                            <Row className="row-inside">
                              <Col lg={3} md={4} sm={5} xs={5}>
                                <Row>
                                  <Col
                                    lg={4}
                                    md={5}
                                    sm={5}
                                    xs={5}
                                    className="for_padding"
                                  >
                                    <Form.Label className="my_lbl">
                                      Company Name
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={7} sm={7} xs={7}>
                                    <Form.Group className="createnew">
                                      <Select
                                        autoFocus={true}
                                        isClearable={true}
                                        // className="selectTo selectdd-style"
                                        className="selectTo"
                                        // styles={categorySelectTo}
                                        styles={ledger_select}
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
                                        invalid={
                                          errors.companyId ? true : false
                                        }
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.companyId}
                                      </span>
                                      {/* <Form.Control.Feedback type="invalid">
                                  {errors.companyId}
                                </Form.Control.Feedback> */}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={4} sm={4} xs={4}>
                                <Row>
                                  <Col lg={4} md={4} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      Branch Name
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={8} sm={8} xs={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder=" Branch Name"
                                        name="branchName"
                                        id="branchName"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.branchName}
                                        isValid={
                                          values.branchName
                                            ? touched.branchName &&
                                            !errors.branchName
                                            : ""
                                        }
                                        isInvalid={!!errors.branchName}
                                        autofocus
                                        //validateBranch
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          this.validateBranchDuplicate(
                                            values.branchName,
                                            values.companyId.value,
                                            setFieldValue
                                          );
                                          // alert("On Blur Call");
                                        }}
                                      />
                                      {/* <Form.Control.Feedback type="invalid"> */}
                                    </Form.Group>
                                    <span className="text-danger errormsg">
                                      {errors.branchName}
                                    </span>
                                    {/* </Form.Control.Feedback> */}
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={4} sm={4} xs={4}>
                                <Row>
                                  <Col lg={4} md={4} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      Branch Code
                                      {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={8} sm={8} xs={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder=" Branch Code"
                                        name="branchCode"
                                        id="branchCode"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.branchCode}
                                        // isValid={
                                        //   touched.branchName && !errors.branchCode
                                        // }
                                        isValid={
                                          values.branchCode
                                            ? touched.branchName &&
                                            !errors.branchCode
                                            : ""
                                        }
                                        isInvalid={!!errors.branchCode}
                                      />
                                      {/* <Form.Control.Feedback type="invalid"> */}
                                      <span className="text-danger errormsg">
                                        {errors.branchCode}
                                      </span>
                                      {/* </Form.Control.Feedback> */}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="row-inside mt-3">
                              <Col lg={3} md={4} sm={4} xs={4}>
                                <Row>
                                  <Col lg={4} md={5} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      Register Address
                                      {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={7} sm={8} xs={8}>
                                    <Form.Group>
                                      <Form.Control
                                        as="textarea"
                                        rows={3}
                                        style={{
                                          height: "50px",
                                          resize: "none",
                                        }}
                                        className="text-box border"
                                        name="registeredAddress"
                                        placeholder=" Registered Address"
                                        id="registeredAddress"
                                        onChange={handleChange}
                                        value={values.registeredAddress}
                                        isValid={
                                          values.registeredAddress
                                            ? touched.registeredAddress &&
                                            !errors.registeredAddress
                                            : ""
                                        }
                                        isInvalid={!!errors.registeredAddress}
                                      />
                                      {/* <Form.Control.Feedback type="invalid"> */}
                                      <span className="text-danger errormsg">
                                        {errors.registeredAddress}
                                      </span>
                                      {/* </Form.Control.Feedback> */}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>

                              <Col lg={3} md={4} sm={4} xs={4}>
                                <Row>
                                  <Col lg={4} md={4} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      Corporate Address
                                      {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={8} sm={8} xs={8}>
                                    <Form.Group>
                                      <Form.Control
                                        as="textarea"
                                        rows={3}
                                        style={{
                                          height: "50px",
                                          resize: "none",
                                        }}
                                        className="text-box border"
                                        name="corporateAddress"
                                        id="corporateAddress"
                                        placeholder=" Corporate Address"
                                        onChange={handleChange}
                                        value={values.corporateAddress}
                                        isValid={
                                          values.corporateAddress
                                            ? touched.corporateAddress &&
                                            !errors.corporateAddress
                                            : ""
                                        }
                                        isInvalid={!!errors.corporateAddress}
                                      />
                                      {/* <Form.Control.Feedback type="invalid"> */}
                                      <span className="text-danger errormsg">
                                        {errors.corporateAddress}
                                      </span>
                                      {/* </Form.Control.Feedback> */}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col md="12">
                            <h5 className="title-style">Correspondence</h5>

                            <Row className="row-inside">
                              {/* <Col md="5">
                                <Row className="cmygst1"> */}
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Row>
                                  <Col lg={3} md={3} sm={3} xs={3}>
                                    <Form.Label className="my_lbl">
                                      Email<span className="text-danger"></span>
                                    </Form.Label>
                                  </Col>
                                  <Col lg={9} ms={9} sm={9} xs={9}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder=" Email"
                                        name="email"
                                        className="text-box"
                                        id="email"
                                        // placeholder="email"
                                        onChange={handleChange}
                                        value={values.email}
                                        isValid={
                                          values.email
                                            ? touched.email && !errors.email
                                            : ""
                                        }
                                        isInvalid={!!errors.email}
                                      />
                                      {/* <Form.Control.Feedback type="invalid"> */}
                                      <span className="text-danger errormsg">
                                        {errors.email}
                                      </span>
                                      {/* </Form.Control.Feedback> */}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2} md={2} sm={2} xs={2}>
                                <Row>
                                  <Col lg={4} md={5} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      Mobile No.
                                    </Form.Label>
                                  </Col>

                                  <Col md={7} lg={8} sm={8} xs={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder=" Mobile No"
                                        name="mobileNumber"
                                        className="text-box"
                                        id="mobileNumber"
                                        // placeholder="mobileNumber"
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                          let mob = e.target.value;
                                          setFieldValue("mobileNumber", mob);
                                          setFieldValue("whatsappNumber", mob);
                                        }}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        value={values.mobileNumber}
                                        isValid={
                                          values.mobileNumber
                                            ? touched.mobileNumber &&
                                            !errors.mobileNumber
                                            : ""
                                        }
                                        isInvalid={!!errors.mobileNumber}
                                        maxLength={10}
                                      />
                                      {/* <Form.Control.Feedback type="invalid"> */}
                                      <span className="text-danger errormsg">
                                        {errors.mobileNumber}
                                      </span>
                                      {/* </Form.Control.Feedback> */}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>

                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Row>
                                  <Col
                                    lg={4}
                                    md={5}
                                    sm={4}
                                    xs={4}
                                    className="pe-0"
                                  >
                                    <Form.Label className="my_lbl">
                                      Whatsapp No.
                                    </Form.Label>
                                  </Col>
                                  <Col md={7} lg={8} sm={8} xs={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder=" Whatsapp No."
                                        name="whatsappNumber"
                                        className="text-box"
                                        id="whatsappNumber"
                                        // placeholder="whatsappNumber"
                                        onChange={handleChange}
                                        // onChange={(e) => {
                                        //   let mob = e.target.value;
                                        //   setFieldValue("whatsappNumber", mob);
                                        // }}
                                        value={values.whatsappNumber}
                                        isValid={
                                          values.whatsappNumber
                                            ? touched.whatsappNumber &&
                                            !errors.whatsappNumber
                                            : ""
                                        }
                                        isInvalid={!!errors.whatsappNumber}
                                        maxLength={10}
                                      />
                                      {/* <Form.Control.Feedback type="invalid"> */}
                                      <span className="text-danger errormsg">
                                        {errors.whatsappNumber}
                                      </span>
                                      {/* </Form.Control.Feedback> */}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2} md={3} sm={3} xs={3}>
                                <Row>
                                  <Col lg={4} md={4} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      Currency
                                    </Form.Label>
                                  </Col>
                                  <Col md={8} lg={8} sm={8} xs={8}>
                                    <Form.Group className="">
                                      <Select
                                        className="selectTo"
                                        styles={ledger_select}
                                        closeMenuOnSelect={true}
                                        components={{ ClearIndicator }}
                                        // styles={{
                                        //   clearIndicator: ClearIndicatorStyles,
                                        // }}
                                        // defaultValue={[colourOptions[4], colourOptions[5]]}
                                        // isMulti
                                        onChange={(v) => {
                                          //   console.log(e);
                                          setFieldValue("currency", v);
                                        }}
                                        name="currency"
                                        value={values.currency}
                                        options={Currencyopt}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            {/* <Col md="6"></Col> */}
                            {/* </Row> */}
                            {/* </Col>
                              <Col md="7">
                                <Row className="cmygst"> */}
                            <Row className="row-inside mt-3">
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Row>
                                  <Col lg={3} md={3} sm={3} xs={3}>
                                    <Form.Label className="my_lbl">
                                      Website
                                    </Form.Label>
                                  </Col>
                                  <Col md={9} lg={9} sm={9} xs={9}>
                                    <Form.Group>
                                      <Form.Control
                                        className="text-box"
                                        type="text"
                                        placeholder=" Website"
                                        aria-describedby="inputGroupPrepend"
                                        name="website"
                                        id="website"
                                        onChange={handleChange}
                                        value={values.website}
                                        isValid={
                                          values.website
                                            ? touched.website && !errors.website
                                            : ""
                                        }
                                        isInvalid={!!errors.website}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2} md={3} sm={3} xs={3}>
                                <Row>
                                  <Col lg={4} md={4} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      Pincode
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={8} sm={8} xs={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder=" Pincode"
                                        name="pincode"
                                        id="pincode"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.pincode}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        isValid={
                                          values.pincode
                                            ? touched.pincode && !errors.pincode
                                            : ""
                                        }
                                        isInvalid={!!errors.pincode}
                                        maxLength={6}
                                      />
                                      {/* <Form.Control.Feedback type="invalid"> */}
                                      <span className="text-danger errormsg">
                                        {errors.pincode}
                                      </span>
                                      {/* </Form.Control.Feedback> */}
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Row>
                                  <Col lg={4} md={4} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      State
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={8} sm={8} xs={8}>
                                    <Form.Group className="">
                                      <Select
                                        // className="selectTo selectdd-style"
                                        // styles={categorySelectTo}
                                        closeMenuOnSelect={true}
                                        className="selectTo"
                                        styles={ledger_select}
                                        components={{ ClearIndicator }}
                                        onChange={(v) => {
                                          setFieldValue("state_id", v);
                                        }}
                                        name="state_id"
                                        value={values.state_id}
                                        options={stateOpt}
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.state_id && errors.state_id}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2} md={3} sm={3} xs={3}>
                                <Row>
                                  <Col lg={4} md={4} sm={4} xs={4}>
                                    <Form.Label className="my_lbl">
                                      Country
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={8} sm={8} xs={8}>
                                    <Form.Group className="">
                                      <Select
                                        className="selectTo"
                                        styles={ledger_select}
                                        closeMenuOnSelect={true}
                                        components={{ ClearIndicator }}
                                        onFocus={() => {
                                          this.setState({ hideDp: true });
                                        }}
                                        onChange={(v) => {
                                          if (v != null) {
                                            setFieldValue("country_id", v);
                                          } else {
                                            setFieldValue("country_id", "");
                                          }
                                        }}
                                        name="country_id"
                                        value={values.country_id}
                                        options={countryOpt}
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.country_id && errors.country_id}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-3 row-inside">
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Row>
                                  <Col lg={4} md={4} sm={4} xs={4}>
                                    <Form.Label className="my_lbl mb-0">
                                      GST Applicability
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} md={7} sm={8} xs={8}>
                                    <Form.Group className="mb-2 d-flex">
                                      <Form.Check
                                        inline
                                        type="radio"
                                        label="Yes"
                                        className="pr-3"
                                        name="gstApplicable"
                                        id="GSTYes"
                                        onClick={() => {
                                          this.setState({
                                            toggle: true,
                                          });
                                          setFieldValue("gstApplicable", "yes");
                                        }}
                                        value="yes"
                                        checked={
                                          values.gstApplicable == "yes"
                                            ? true
                                            : false
                                        }
                                      />{" "}
                                      <Form.Check
                                        type="radio"
                                        label="No"
                                        name="gstApplicable"
                                        id="GSTNo"
                                        onClick={() => {
                                          this.setState({
                                            toggle: false,
                                          });
                                          setFieldValue("gstApplicable", "no");
                                        }}
                                        value="no"
                                        checked={
                                          values.gstApplicable == "no"
                                            ? true
                                            : false
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              {toggle == true ? (
                                <>
                                  <Col lg={2} md={3} sm={2} xs={2}>
                                    <Row>
                                      <Col lg={4} md={4} sm={4} xs={4}>
                                        <Form.Label className="my_lbl">
                                          GST Type
                                          <span className="text-danger">*</span>
                                        </Form.Label>
                                      </Col>
                                      <Col lg={8} md={8} sm={8} xs={8}>
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
                                            value={values.gstType}
                                            options={GSTopt}
                                          />
                                          <span className="text-danger errormsg">
                                            {errors.gstType}
                                          </span>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col lg={3} md={3} sm={3} xs={3}>
                                    <Row>
                                      <Col lg={4} md={4} sm={4} xs={4}>
                                        <Form.Label className="my_lbl">
                                          GSTIN
                                          <span className="text-danger">*</span>
                                        </Form.Label>
                                      </Col>
                                      <Col lg={8} md={8} sm={8} xs={8}>
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            placeholder=" GSTIN"
                                            name="gstIn"
                                            className="text-box"
                                            id="gstIn"
                                            onChange={handleChange}
                                            value={values.gstIn && values.gstIn.toUpperCase()

                                            }
                                            isValid={
                                              touched.gstIn && !errors.gstIn
                                            }
                                            isInvalid={!!errors.gstIn}
                                            style={{
                                              border: "1px solid #ced4da",
                                            }}
                                          />
                                          <span className="text-danger errormsg">
                                            {errors.gstIn}
                                          </span>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col lg={2} md={2} sm={2} xs={2}>
                                    <Row>
                                      <Col lg={7} md={7} sm={7} xs={7}>
                                        <Form.Label className="my_lbl">
                                          Applicable From Date
                                        </Form.Label>
                                      </Col>
                                      <Col lg={5} md={5} sm={5} xs={5}>
                                        <MyTextDatePicker
                                          className="tnx-pur-inv-date-style "
                                          name="gstApplicableDate"
                                          id="gstApplicableDate"
                                          placeholder="DD/MM/YYYY"
                                          dateFormat="dd/MM/yyyy"
                                          value={values.gstApplicableDate}
                                          onChange={handleChange}
                                        />
                                      </Col>
                                    </Row>
                                  </Col>
                                </>
                              ) : (
                                ""
                              )}
                            </Row>
                          </Col>
                        </Row>

                        {/* <h5>Formation</h5> */}
                        <Row className="mt-5">
                          <Col md="12" className="btn_align ">
                            <Button
                              className="successbtn-style ms-2"
                              type="submit"
                            >
                              {values.id == "" ? "Submit" : "Update"}
                            </Button>
                            <Button
                              variant="secondary"
                              className="cancel-btn me-2"
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
                                      this.pageReload();
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
                            {/* <Button
                            className="successbtn-style"
                            type="submit"
                            // disabled={isSubmitting}
                          >
                            {values.id == "" ? "Submit" : "Update"}
                          </Button> */}
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
            {/* <h6>Group</h6> */}

            <div className="cust_table p-2">
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
                    <Row className="p-2">
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
                        <InputGroup className="mb-3 mdl-text">
                          <Form.Control
                            placeholder="Search"
                            // aria-label="Search"
                            // aria-describedby="basic-addon1"
                            // style={{ borderRight: "none" }}
                            className="mdl-text-box"
                            onChange={(e) => {
                              let v = e.target.value;
                              console.log({ v });
                              setFieldValue("search", v);
                              this.handleSearch(v);
                            }}
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
                      <Col md="6" lg={6} sm={6} xs={6}></Col>
                      <Col
                        md="3"
                        lg={3}
                        sm={3}
                        xs={3}
                        className="mt-2 btn_align mainbtn_create"
                      >
                        {/* {this.state.hide == 'true'} */}
                        {!opendiv && (
                          <Button
                            className="create-btn mr-2"
                            onClick={(e) => {
                              e.preventDefault();
                              this.setState({ opendiv: !opendiv });
                            }}
                            aria-controls="example-collapse-text"
                            aria-expanded={opendiv}
                          // onClick={this.open}
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
                        // this.props.handleRefresh(true);
                      }}
                    >
                      <img src={refresh} alt="icon" />
                    </Button> */}
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
              {/* {data.length > 0 && ( */}

              {/* )} */}
            </div>

            <div className="table_wrapper p-2">
              <Table size="sm" hover className="tbl-font">
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "2px solid transparent",
                        backgroundColor: "rgb(214, 252, 220)",
                      }}
                    >
                      Sr.
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid transparent",
                        backgroundColor: "rgb(214, 252, 220)",
                      }}
                    >
                      Company Name
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid transparent",
                        backgroundColor: "rgb(214, 252, 220)",
                      }}
                    >
                      Branch Name
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid transparent",
                        backgroundColor: "rgb(214, 252, 220)",
                      }}
                    >
                      Branch Code
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid transparent",
                        backgroundColor: "rgb(214, 252, 220)",
                      }}
                    >
                      Registered Address
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid transparent",
                        backgroundColor: "rgb(214, 252, 220)",
                      }}
                    >
                      Corporate Address
                    </th>
                  </tr>
                </thead>
                {/* {JSON.stringify(data, 2, undefined)} */}
                <tbody className="tabletrcursor">
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            this.setEditData(v.id);
                          }}
                        >
                          <td>{i + 1}</td>
                          <td>{v.companyName}</td>
                          <td>{v.branchName}</td>
                          <td>{v.branchCode}</td>
                          <td>{v.registeredAddress}</td>
                          <td>{v.corporateAddress}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
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
