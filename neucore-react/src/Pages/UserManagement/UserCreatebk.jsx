import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  ButtonGroup,
  Card,
} from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  get_companies_super_admin,
  createCompanyUser,
  get_c_admin_users,
  get_user_by_id,
  updateInstituteUser,
  getSysAllPermissions,
  getBranchesByCompany,
} from "@/services/api_functions";
import Select from "react-select";
import save_icon from "@/assets/images/save_icon.svg";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  customStyles,
  eventBus,
  ArraySplitChunkElement,
  MyNotifications,
  customStylesWhite,
  categorySelectTo,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

export default class UserCreatebk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      opBranchList: [],
      data: [],
      InitVal: {
        id: "",
        companyId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "USER",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      userRole: "USER",
      sysPermission: [],
      orgSysPermission: [],
      userPermission: [],
      parent: [
        {
          id: "1",
          name: "Master",
          parent: [
            {
              id: "2",
              name: "Account",
              id: "3",
              name: "Inventory",
              parent: [
                {
                  id: "3",
                  name: "Ledger",
                  actions: [
                    { id: 1, name: "create" },
                    { id: 2, name: "edit" },
                    { id: 3, name: "delete" },
                    { id: 4, name: "list" },
                    { id: 5, name: "view" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      level: [
        {
          id: "1",
          name: "Master",
          level: [
            {
              id: "2",
              name: "Account",
              level: [
                {
                  id: "3",
                  name: "Ledger",
                  actions: [
                    {
                      name: "create",
                      id: "1",
                    },
                    {
                      name: "edit",
                      id: "2",
                    },
                    {
                      name: "delete",
                      id: "3",
                    },
                    {
                      name: "list",
                      id: "4",
                    },
                  ],
                },
                {
                  id: "4",
                  name: "Ledger Group",
                  actions: [
                    {
                      name: "create",
                      id: "1",
                    },
                    {
                      name: "edit",
                      id: "2",
                    },
                    {
                      name: "delete",
                      id: "3",
                    },
                    {
                      name: "list",
                      id: "4",
                      "": {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    this.ref = React.createRef();
  }

  listSysPermission = () => {
    getSysAllPermissions()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.userActions;
          if (data.length > 0) {
            let splitdata = ArraySplitChunkElement(data, 6);
            this.setState({ sysPermission: splitdata, orgSysPermission: data });
          }
        } else {
          this.setState({ sysPermission: [], orgSysPermission: [] });
        }
      })
      .catch((error) => {
        this.setState({ sysPermission: [] });
        console.log("error", error);
      });
  };

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
  listGetBranch = (status = false) => {
    getBranchesByCompany()
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
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  componentDidMount() {
    console.log("This is C User Access Mgt Page");
    if (AuthenticationCheck()) {
      this.listSysPermission();
      this.listGetCompany();
      this.listGetBranch();
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
      InitVal: {
        id: "",
        companyId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "USER",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      userRole: "USER",
    });
  };

  handleActionSelection = (status, mapping_id, action_id) => {
    let { userPermission } = this.state;
    if (status == true) {
      let user = {
        mapping_id: mapping_id,
        actions: [action_id],
      };
      let is_new = true;
      userPermission = userPermission.map((v) => {
        if (v.mapping_id == mapping_id) {
          if (!v.actions.includes(action_id)) {
            let v_action = v.actions;
            v.actions = [...v_action, action_id];
            is_new = false;
          }
        }
        return v;
      });

      if (is_new == true) {
        userPermission = [...userPermission, user];
      }
      this.setState({ userPermission: userPermission });
    } else if (status == false) {
      userPermission = userPermission.map((v) => {
        if (v.mapping_id == mapping_id) {
          if (v.actions.includes(action_id)) {
            let v_action = v.actions;
            v.actions = v_action.filter((vi) => vi != action_id);
          }
        }
        return v;
      });

      this.setState({
        userPermission: userPermission.length > 0 ? userPermission : [],
      });
    }
  };
  handleSelectAllActionSelection = (status, mapping_id) => {
    let { userPermission, orgSysPermission } = this.state;
    if (status == true) {
      let obj = orgSysPermission.find((v) => v.id == mapping_id);
      let action_ids = obj.actions.map((vi) => {
        return vi.id;
      });
      let user = {
        mapping_id: mapping_id,
        actions: action_ids,
      };
      let is_new = true;
      userPermission = userPermission.map((v) => {
        if (v.mapping_id == mapping_id) {
          is_new = false;
        }
        return v;
      });
      if (is_new == true) {
        userPermission = [...userPermission, user];
      }
      this.setState({ userPermission: userPermission });
    } else if (status == false) {
      userPermission = userPermission.filter((v) => v.mapping_id != mapping_id);
      this.setState({
        userPermission: userPermission.length > 0 ? userPermission : [],
      });
    }
  };

  getActionSelectionOption = (mapping_id, action_id) => {
    let { userPermission } = this.state;
    let res = false;
    userPermission.map((v) => {
      if (v.mapping_id == mapping_id) {
        if (v.actions.includes(action_id)) {
          res = true;
        }
      }
    });

    return res;
  };
  getSelectAllOption = (mapping_id) => {
    let { userPermission, orgSysPermission } = this.state;
    let res = false;
    let obj = orgSysPermission.find((v) => v.id == mapping_id);
    let action_ids = obj.actions.map((vi) => {
      return vi.id;
    });

    userPermission.map((v) => {
      if (v.mapping_id == mapping_id) {
        if (action_ids.length == v.actions.length) {
          res = true;
        }
      }
    });

    return res;
  };

  validationSchema = () => {
    if (this.state.InitVal.id == "") {
      return Yup.object().shape({
        companyId: Yup.object().nullable().required("Select company"),
        FullName: Yup.string()
          .nullable()
          .trim()
          .required("Full name is required"),
        MobileNo: Yup.string()
          .nullable()
          .trim()
          .matches(numericRegExp, "Enter valid mobile number")
          .required("Mobile number is required"),
        BranchName: Yup.object().required("Select branch "),
        // Email: Yup.lazy((v) => {
        //   if (v != undefined) {
        //     return Yup.string()
        //       .trim()
        //       .matches(EMAILREGEXP, "Enter valid email id")
        //       .required("Email is required");
        //   }
        //   return Yup.string().notRequired();
        // })
        EmailId: Yup.object().nullable().required("Email is required"),
        gender: Yup.string().nullable().trim().required("Gender is required"),
        Password: Yup.string()
          .nullable()
          .trim()
          .required("Password is required"),
        UserCode: Yup.string()
          .nullable()
          .trim()
          .required("Usercode is required"),
      });
    } else {
      return Yup.object().shape({
        companyId: Yup.object().required("select company"),
        FullName: Yup.string().trim().required("Full Name is required"),
        MobileNo: Yup.string()
          .trim()
          .matches(numericRegExp, "Enter valid mobile number")
          .required("Mobile Number is required"),
        Email: Yup.lazy((v) => {
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
        UserCode: Yup.string().trim().required("usercode is required"),
      });
    }
  };

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      opCompanyList,
      InitVal,
      sysPermission,
      userPermission,
      opBranchList,
      listGetBranch,
      parent,
      level,
    } = this.state;
    return (
      <div className="">
        {/* {JSON.stringify(level)} */}
        <div id="example-collapse-text" className="usercreatestyle">
          <div className="m-0">
            {/* <h4 className="form-header">Create User</h4> */}
            <Formik
              validateOnChange={false}
              // validateOnBlur={false}
              enableReinitialize={true}
              initialValues={InitVal}
              innerRef={this.ref}
              validationSchema={this.validationSchema()}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let keys = Object.keys(InitVal);
                let requestData = new FormData();
                keys.map((v) => {
                  if (values[v] != "" && v != "companyId") {
                    requestData.append(v, values[v]);
                  }
                });
                requestData.append("companyId", values.companyId.value);
                requestData.append("branchId", values.branchId.value);
                requestData.append(
                  "user_permissions",
                  JSON.stringify(this.state.userPermission)
                );
                // Display the key/value pairs
                for (var pair of requestData.entries()) {
                  console.log(pair[0] + ", " + pair[1]);
                }

                if (values.id == "") {
                  createCompanyUser(requestData)
                    .then((response) => {
                      setSubmitting(false);
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        //   ShowNotification("Success", res.message);
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

                        eventBus.dispatch("page_change", "user_mgnt_list");
                      } else {
                        //   ShowNotification("Error", res.message);
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
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: error,
                        is_button_show: true,
                      });
                    });
                } else {
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
                <Form onSubmit={handleSubmit}>
                  <div>
                    <Row>
                      <Col md="12">
                        <Card className="detailsstyle">
                          <Card.Body>
                            <p className="cardheading mb-0">User Details:</p>
                            <Row>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      height: "14px",
                                      left: "0%",
                                      right: "0%",
                                      top: "0px",

                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      lineHeight: "14px",

                                      color: "#85878E",
                                    }}
                                  >
                                    Company Name
                                  </Form.Label>
                                  <Select
                                    id="companyId"
                                    name="companyId"
                                    className="selectTo selectdd-style"
                                    styles={categorySelectTo}
                                    placeholder="Select"
                                    options={opCompanyList}
                                    onChange={(v) => {
                                      setFieldValue("companyId", v);
                                    }}
                                    value={values.companyId}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.companyId && errors.companyId}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      height: "14px",
                                      left: "0%",
                                      right: "0%",
                                      top: "0px",

                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      lineHeight: "14px",

                                      color: "#85878E",
                                    }}
                                  >
                                    Branch Name
                                  </Form.Label>
                                  <Select
                                    id="BranchName"
                                    name="BranchName"
                                    className="selectTo selectdd-style"
                                    styles={categorySelectTo}
                                    placeholder="Select"
                                    options={opBranchList}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.BranchName && errors.BranchName}
                                </span>
                              </Col>
                              <Col md="2">
                                {" "}
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      height: "14px",
                                      left: "0%",
                                      right: "0%",
                                      top: "0px",

                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      lineHeight: "14px",

                                      color: "#85878E",
                                    }}
                                  >
                                    Full Name
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="FullName"
                                    name="FullName"
                                    placeholder="Enter Full Name"
                                    style={{
                                      height: "32px",
                                      left: "0%",
                                      right: "0%",
                                      top: "16px",
                                      background: "#FFFFFF",
                                      border: "1px solid #DDE2ED",
                                      boxShadow:
                                        "0px 1px 1px rgba(0, 0, 0, 0.16)",
                                      borderRadius: "4px",
                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "400",
                                      fontSize: "13px",
                                      lineHeight: "22px",
                                      /* identical to box height, or 169% */
                                      color: "#2F3033",
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.FullName && errors.FullName}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      height: "14px",
                                      left: "0%",
                                      right: "0%",
                                      top: "0px",

                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      lineHeight: "14px",

                                      color: "#85878E",
                                    }}
                                  >
                                    Mobile No
                                  </Form.Label>
                                  <Form.Control
                                    id="MobileNo"
                                    name="MobileNo"
                                    type="text"
                                    placeholder="Enter Mob No"
                                    style={{
                                      height: "32px",
                                      left: "0%",
                                      right: "0%",
                                      top: "16px",
                                      background: "#FFFFFF",
                                      border: "1px solid #DDE2ED",
                                      boxShadow:
                                        "0px 1px 1px rgba(0, 0, 0, 0.16)",
                                      borderRadius: "4px",
                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "400",
                                      fontSize: "13px",
                                      lineHeight: "22px",
                                      /* identical to box height, or 169% */
                                      color: "#2F3033",
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.MobileNo && errors.MobileNo}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      height: "14px",
                                      left: "0%",
                                      right: "0%",
                                      top: "0px",

                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      lineHeight: "14px",

                                      color: "#85878E",
                                    }}
                                  >
                                    Email
                                  </Form.Label>
                                  <Form.Control
                                    id="EmailId"
                                    name="EmailId"
                                    type="text"
                                    value={values.EmailId}
                                    placeholder="Enter email"
                                    style={{
                                      height: "32px",
                                      left: "0%",
                                      right: "0%",
                                      top: "16px",
                                      background: "#FFFFFF",
                                      border: "1px solid #DDE2ED",
                                      boxShadow:
                                        "0px 1px 1px rgba(0, 0, 0, 0.16)",
                                      borderRadius: "4px",
                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "400",
                                      fontSize: "13px",
                                      lineHeight: "22px",
                                      /* identical to box height, or 169% */
                                      color: "#2F3033",
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.EmailId && errors.EmailId}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Label
                                  style={{
                                    height: "14px",
                                    left: "0%",
                                    right: "0%",
                                    top: "0px",

                                    fontFamily: "Lato",
                                    fontStyle: "normal",
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    lineHeight: "14px",

                                    color: "#85878E",
                                  }}
                                >
                                  Gender
                                </Form.Label>
                                <Form>
                                  {["radio"].map((type) => (
                                    <div
                                      key={`inline-${type}`}
                                      className="mb-3"
                                    >
                                      <Form.Check
                                        inline
                                        label="Male"
                                        name="gender"
                                        type={type}
                                        id={`inline-${type}-1`}
                                        onChange={handleChange}
                                        checked={
                                          values.gender == "male" ? true : false
                                        }
                                        style={{
                                          height: "12px",

                                          fontFamily: "Lato",
                                          fontStyle: "normal",
                                          fontWeight: "400",
                                          fontSize: "13px",
                                          //lineHeight: "12px",
                                          /* identical to box height, or 92% */

                                          color: "#2F3033",

                                          /* Inside auto layout */

                                          flex: "none",
                                          order: "1",
                                          flexGrow: "0",
                                        }}
                                      />

                                      <Form.Check
                                        inline
                                        label="Female"
                                        name="gender"
                                        type={type}
                                        onChange={handleChange}
                                        checked={
                                          values.gender == "female"
                                            ? true
                                            : false
                                        }
                                        id={`inline-${type}-2`}
                                        style={{
                                          height: "12px",

                                          fontFamily: "Lato",
                                          fontStyle: "normal",
                                          fontWeight: "400",
                                          fontSize: "13px",
                                          //lineHeight: "12px",
                                          /* identical to box height, or 92% */

                                          color: "#2F3033",

                                          /* Inside auto layout */

                                          flex: "none",
                                          order: "1",
                                          flexGrow: "0",
                                        }}
                                      />
                                      <span className="text-danger">
                                        {errors.gender && errors.gender}
                                      </span>
                                    </div>
                                  ))}
                                </Form>
                              </Col>
                            </Row>
                            <Row>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      height: "14px",
                                      left: "0%",
                                      right: "0%",
                                      top: "0px",

                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      lineHeight: "14px",

                                      color: "#85878E",
                                    }}
                                  >
                                    User Code
                                  </Form.Label>
                                  <Form.Control
                                    id="UserCode"
                                    name="UserCode"
                                    type="text"
                                    placeholder="Enter user code"
                                    style={{
                                      height: "32px",
                                      left: "0%",
                                      right: "0%",
                                      top: "16px",
                                      background: "#FFFFFF",
                                      border: "1px solid #DDE2ED",
                                      boxShadow:
                                        "0px 1px 1px rgba(0, 0, 0, 0.16)",
                                      borderRadius: "4px",
                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "400",
                                      fontSize: "13px",
                                      lineHeight: "22px",
                                      /* identical to box height, or 169% */
                                      color: "#2F3033",
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.UserCode && errors.UserCode}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      height: "14px",
                                      left: "0%",
                                      right: "0%",
                                      top: "0px",

                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      lineHeight: "14px",

                                      color: "#85878E",
                                    }}
                                  >
                                    Password
                                  </Form.Label>
                                  <Form.Control
                                    id="Password"
                                    name="Password"
                                    type="text"
                                    placeholder="Enter password"
                                    style={{
                                      height: "32px",
                                      left: "0%",
                                      right: "0%",
                                      top: "16px",
                                      background: "#FFFFFF",
                                      border: "1px solid #DDE2ED",
                                      boxShadow:
                                        "0px 1px 1px rgba(0, 0, 0, 0.16)",
                                      borderRadius: "4px",
                                      fontFamily: "Lato",
                                      fontStyle: "normal",
                                      fontWeight: "400",
                                      fontSize: "13px",
                                      lineHeight: "22px",
                                      /* identical to box height, or 169% */
                                      color: "#2F3033",
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.Password && errors.Password}
                                </span>
                              </Col>
                              <Col md="8">
                                {/* <ButtonGroup
                                  className="float-end mt-3"
                                  aria-label="Basic example"
                                >
                                  <Button
                                    className="successbtn-style ms-2"
                                    type="submit"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    className="cancel-btn"

                                    // style={{ borderRadius: "20px" }}
                                  >
                                    Cancel
                                  </Button>
                                </ButtonGroup> */}
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <Row className="px-2 mt-4">
                      <Col md="12" className="mb-3">
                        <Row>
                          <Col md="2">
                            <p className="cardheading mb-0">
                              Access Permissions:
                            </p>
                          </Col>
                          <Col md="6"></Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Search"
                                name="productName"
                                style={{
                                  height: "32px",
                                  left: "0%",
                                  right: "0%",
                                  top: "16px",
                                  background: "#FFFFFF",
                                  border: "1px solid #DDE2ED",
                                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
                                  borderRadius: "4px",
                                  fontFamily: "Lato",
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "13px",
                                  lineHeight: "22px",
                                  /* identical to box height, or 169% */
                                  color: "#2F3033",
                                }}
                              />
                            </Form.Group>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Select
                                className="selectTo selectdd-style"
                                styles={categorySelectTo}
                                placeholder="Select Type"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className="px-2 tblht">
                      <Table bordered className="usertblbg tblresponsive">
                        <thead style={{ position: "sticky", top: "0" }}>
                          <tr>
                            <th
                              colSpan={5}
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#dee4eb",
                              }}
                            >
                              Particulars
                            </th>
                            <th
                              className="text-center"
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#dee4eb",
                              }}
                            >
                              Create
                            </th>
                            <th
                              className="text-center"
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#dee4eb",
                              }}
                            >
                              Edit
                            </th>
                            <th
                              className="text-center"
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#dee4eb",
                              }}
                            >
                              Delete
                            </th>
                            <th
                              className="text-center"
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#dee4eb",
                              }}
                            >
                              List
                            </th>
                            <th
                              className="text-center"
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#dee4eb",
                              }}
                            >
                              Export PDF
                            </th>
                            <th
                              className="text-center"
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#dee4eb",
                              }}
                            >
                              Export Excel
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white tblbtmline ">
                          <tr>
                            <td colSpan={5}>
                              {/* <Form>
                                {["checkbox"].map((type) => (
                                  <div
                                    key={`inline-${type}`}
                                    className="multiselect"
                                  >
                                    <Form.Check
                                      inline
                                      label="All"
                                      name="group1"
                                      type={type}
                                      id={`inline-${type}-1`}
                                      className="underline"
                                    />
                                  </div>
                                ))}
                              </Form> */}
                              <Form.Group className="d-flex ">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="multiselect mt-1"
                                >
                                  All
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="mainmenu">
                              {" "}
                              {/* <Form>
                                {["checkbox"].map((type) => (
                                  <div
                                    key={`inline-${type}`}
                                    className="menuselector"
                                  >
                                    <Form.Check
                                      inline
                                      label="Master"
                                      name="group1"
                                      type={type}
                                      id={`inline-${type}-1`}
                                      className="underline"
                                    />
                                  </div>
                                ))}
                              </Form> */}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="menuselector mt-1"
                                >
                                  {" "}
                                  Master
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Associate Group List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              {" "}
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          {/* <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Ledger List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Ledger Create
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Ledger List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Ledger Edit
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Group List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Sub Group List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Category List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Sub Category List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  HSN List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Unit List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="mainmenu">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="menuselector mt-1"
                                >
                                  Transaction
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order Create
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order Edit
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="mainmenu">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="menuselector mt-1"
                                >
                                  Account Entry
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order Create
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order Edit
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="mainmenu">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="menuselector mt-1"
                                >
                                  Reports
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order Create
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order Edit
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="mainmenu">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="menuselector mt-1"
                                >
                                  Utilities
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                            <td className="mainmenu"></td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order List
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order Create
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="ps-5">
                              {" "}
                              <Form.Group className="d-flex">
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="me-2"
                                />
                                <Form.Label
                                  for="inventory"
                                  className="singleselect mt-1"
                                >
                                  {" "}
                                  Purchase Order Edit
                                </Form.Label>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Check
                                  type="checkbox"
                                  fontSize="10px"
                                  className="text-center"
                                />
                              </Form.Group>
                            </td>
                          </tr> */}
                        </tbody>
                      </Table>
                    </div>
                    <Row className="mt-4 mb-4">
                      <Col md="12">
                        <ButtonGroup
                          className="float-end"
                          aria-label="Basic example"
                        >
                          <Button
                            className="successbtn-style ms-2"
                            type="submit"
                          >
                            {/* <FontAwesomeIcon
                            icon={faPlusCircle}
                            className="me-2"
                          /> */}
                            <img
                              src={save_icon}
                              className="me-2"
                              style={{
                                height: "15px",
                                width: "15px",
                                marginTop: "-10px",
                              }}
                            />
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            className="cancel-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "productlist");
                            }}
                            // style={{ borderRadius: "20px" }}
                          >
                            Cancel
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}
