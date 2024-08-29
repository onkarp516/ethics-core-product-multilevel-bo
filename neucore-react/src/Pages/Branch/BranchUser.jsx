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
  getSysActions,
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
  OnlyEnterNumbers,
  MyNotifications,
  ledger_select,
  OnlyAlphabets,
  customStylesWhite,
  categorySelectTo,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

export default class BranchUser extends Component {
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
      actionsOptions: [],
    };
    this.ref = React.createRef();
  }

  lstSysActionsOptions = () => {
    getSysActions()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          let opt = data.map((v) => {
            return { label: v.name, value: v.id, ...v };
          });
          if (opt.length > 0) {
            this.setState({ actionsOptions: opt });
          }
        }
      })
      .catch((error) => { });
  };

  listSysPermission = () => {
    getSysAllPermissions()
      .then((response) => {
        let res = response.data;
        let fdata = [];
        if (res.responseStatus == 200) {
          let data = res.level;
          data.map((v) => {
            let check = fdata.find((vi) => vi.id == v.id);
            let d;
            if (check) {
              d = {
                id: v.id,
                level: [
                  ...check.level,
                  {
                    id: v.level.id,
                    actions: v.level.actions,
                    name: v.level.name,
                    value: v.level.id,
                    label: v.level.name,
                  },
                ],
                name: v.name,
                value: v.id,
                label: v.name,
              };
              fdata = fdata.filter((vi) => vi.id != v.id);
            } else {
              d = {
                id: v.id,
                level: [
                  {
                    id: v.level.id,
                    actions: v.level.actions,
                    name: v.level.name,
                    value: v.level.id,
                    label: v.level.name,
                  },
                ],
                name: v.name,
                value: v.id,
                label: v.name,
              };
            }
            fdata = [...fdata, d];
          });
          // console.log("fdata", fdata);
          this.setState({
            sysPermission: fdata,
            orgSysPermission: fdata,
          });
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

  handleUserSelection = (
    parent_id,
    child_id = 0,
    action_id = 0,
    status = false
  ) => {
    let { userPermission, sysPermission } = this.state;
    let filterUserPermission = [];
    let fuserPermissions = [];
    if (child_id == 0 && action_id == 0) {
      let f = sysPermission.find((v) => v.id == parent_id);
      if (status == true) {
        let modules = [];
        if (f.level) {
          modules = f.level.map((vi) => {
            return { mapping_id: vi.id, actions: vi.actions };
          });
        }
        let d = {
          id: f.id,
          name: f.name,
          modules: modules,
        };
        fuserPermissions.push(d);

        if (userPermission.length > 0) {
          filterUserPermission = userPermission.filter((v) => v.id != f.id);
        }
        fuserPermissions = [...fuserPermissions, ...filterUserPermission];
      } else {
        if (userPermission.length > 0) {
          filterUserPermission = userPermission.filter((v) => v.id != f.id);
        }
        fuserPermissions = filterUserPermission;
      }

      this.setState({ userPermission: fuserPermissions });
    } else if (action_id == 0) {
      if (status == true) {
        let f = sysPermission.find((v) => v.id == parent_id);
        if (userPermission.length == 0) {
          let check = f.level.find((v) => v.value == child_id);
          let modules = [];
          if (check) {
            modules.push({ mapping_id: check.id, actions: check.actions });
          }
          let d = {
            id: f.id,
            name: f.name,
            modules: modules,
          };
          fuserPermissions.push(d);
        } else {
          let checkinner = userPermission.find((v) => v.id == parent_id);
          if (checkinner) {
            let modules = [];
            modules = checkinner.modules;
            let Syscheck = f.level.find((v) => v.value == child_id);
            if (Syscheck) {
              modules.push({
                mapping_id: Syscheck.id,
                actions: Syscheck.actions,
              });
            }
            let d = {
              id: f.id,
              name: f.name,
              modules: modules,
            };
            if (userPermission.length > 0) {
              filterUserPermission = userPermission.filter(
                (v) => v.id != parent_id
              );
            }
            fuserPermissions = [
              ...fuserPermissions,
              ...filterUserPermission,
              d,
            ];
          } else {
            let check = f.level.find((v) => v.value == child_id);
            let modules = [];
            if (check) {
              modules.push({ mapping_id: check.id, actions: check.actions });
            }
            let d = {
              id: f.id,
              name: f.name,
              modules: modules,
            };
            if (userPermission.length > 0) {
              filterUserPermission = userPermission.filter(
                (v) => v.id != parent_id
              );
            }
            fuserPermissions = [
              ...fuserPermissions,
              ...filterUserPermission,
              d,
            ];
          }
        }
      } else {
        let checkinner = userPermission.find((v) => v.id == parent_id);
        if (checkinner) {
          let check = checkinner.modules.filter(
            (v) => v.mapping_id !== child_id
          );
          let incheck = {
            id: checkinner.id,
            name: checkinner.name,
            modules: check,
          };
          let fcheckinner = userPermission.filter((v) => v.id !== parent_id);
          fuserPermissions = [...fcheckinner, incheck];
        }
      }

      this.setState({ userPermission: fuserPermissions });
    } else {
      if (userPermission.length > 0) {
        if (status == true) {
          let checkinner = userPermission.find((v) => v.id == parent_id);
          let scheck = [];
          if (checkinner) {
            let check = checkinner.modules.find(
              (v) => v.mapping_id == child_id
            );
            if (check) {
              let actions = [...check.actions, action_id];
              check.actions = actions;
              let fcheck = checkinner.modules.filter(
                (v) => v.mapping_id !== child_id
              );
              scheck = [...fcheck, check];
              let incheck = {
                id: checkinner.id,
                name: checkinner.name,
                modules: scheck,
              };
              let fcheckinner = userPermission.filter(
                (v) => v.id !== parent_id
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];
              this.setState({ userPermission: fuserPermissions });
            } else {
              let f = sysPermission.find((v) => v.id == parent_id);
              let check = f.level.find((v) => v.value == child_id);
              let modules = [...checkinner.modules];
              modules.push({ mapping_id: check.id, actions: [action_id] });
              let incheck = {
                id: f.id,
                name: f.name,
                modules: modules,
              };
              let fcheckinner = userPermission.filter(
                (v) => v.id !== parent_id
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];

              this.setState({ userPermission: fuserPermissions });
            }
          } else {
            let f = sysPermission.find((v) => v.id == parent_id);
            if (f) {
              let check = f.level.find((v) => v.value == child_id);
              let modules = [];
              if (check) {
                modules.push({ mapping_id: check.id, actions: [action_id] });
              }
              if (check) {
                let d = {
                  id: f.id,
                  name: f.name,
                  modules: modules,
                };
                fuserPermissions = [d];
              }
              fuserPermissions = [...fuserPermissions, ...userPermission];
              this.setState({ userPermission: fuserPermissions });
            }
          }
        } else {
          let checkinner = userPermission.find((v) => v.id == parent_id);
          let scheck = [];
          if (checkinner) {
            let check = checkinner.modules.find(
              (v) => v.mapping_id == child_id
            );
            if (check) {
              let actions = check.actions.filter(
                (v) => parseInt(v) != parseInt(action_id)
              );
              // let actions = [...check.actions, action_id];
              check.actions = actions;
              let fcheck = checkinner.modules.filter(
                (v) => v.mapping_id !== child_id
              );

              scheck = [...fcheck, check];
              let incheck = {
                id: checkinner.id,
                name: checkinner.name,
                modules: scheck,
              };
              let fcheckinner = userPermission.filter(
                (v) => v.id !== parent_id
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];
              this.setState({ userPermission: fuserPermissions });
            }
          }
        }
      } else {
        if (status == true) {
          let f = sysPermission.find((v) => v.id == parent_id);
          if (f) {
            let check = f.level.find((v) => v.value == child_id);
            let modules = [];
            if (check) {
              modules.push({ mapping_id: check.id, actions: [action_id] });
            }
            if (check) {
              let d = {
                id: f.id,
                name: f.name,
                modules: modules,
              };
              fuserPermissions = [d];
            }
            this.setState({ userPermission: fuserPermissions });
          }
        } else {
          this.setState({ userPermission: [] });
        }
      }
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listSysPermission();
      this.listGetCompany();
      this.listGetBranch();
      this.setInitValue();
      this.lstSysActionsOptions();
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
        fullName: Yup.string()
          .nullable()
          .trim()
          .required("Full name is required"),
        mobileNumber: Yup.string()
          .nullable()
          .trim()
          .matches(numericRegExp, "Enter valid mobile number")
          .required("Mobile number is required"),
        //BranchName: Yup.object().required("Select branch "),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        // email: Yup.string().nullable().required("Email is required"),
        gender: Yup.string().nullable().trim().required("Gender is required"),
        password: Yup.string()
          .nullable()
          .trim()
          .required("Password is required"),
        usercode: Yup.string()
          .nullable()
          .trim()
          .required("Usercode is required"),
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

  isParentChecked = (parent_id) => {
    let { sysPermission, userPermission } = this.state;
    let res = false;

    let sysParentExist = sysPermission.find((v) => v.id === parent_id);
    let userParentExist = userPermission.find((v) => v.id === parent_id);
    if (sysParentExist && userParentExist) {
      let resArr = [];
      if (sysParentExist.level.length == userParentExist.modules.length) {
        userParentExist.modules.map((v) => {
          let r = this.isChildchecked(parent_id, v.mapping_id);
          resArr.push(r);
        });
      }
      if (resArr.length > 0 && !resArr.includes(false)) {
        res = true;
      }
    }
    return res;
  };

  isChildchecked = (parent_id, child_id) => {
    let { sysPermission, userPermission } = this.state;
    let res = false;
    let sysParentExist = sysPermission.find((v) => v.id === parent_id);

    let userParentExist = userPermission.find((v) => v.id === parent_id);

    if (sysParentExist && userParentExist) {
      let sysChildExist = sysParentExist.level.find((v) => v.id === child_id);
      let userChildExist = userParentExist.modules.find(
        (v) => v.mapping_id === child_id
      );
      if (sysChildExist && userChildExist) {
        if (sysChildExist.actions.length == userChildExist.actions.length) {
          res = true;
        }
      }
    }

    return res;
  };

  getActionOptionChecked(parent_id, child_id, action_id) {
    let { userPermission } = this.state;
    let res = false;
    let parentExist = userPermission.find((v) => v.id == parent_id);
    if (parentExist) {
      let childExist = parentExist.modules.find(
        (vi) => vi.mapping_id == child_id
      );
      if (childExist) {
        let childInnerExist = childExist.actions.find(
          (v) => parseInt(v) == parseInt(action_id)
        );
        if (childInnerExist) {
          res = true;
        }
      }
    }
    // console.log({ parent_id, child_id, action_id });
    return res;
  }

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
      actionsOptions,
    } = this.state;

    // console.log("userPermission Render==-->", userPermission);
    // console.log("userPermission Render==-->", JSON.stringify(userPermission));
    return (
      <div className="">
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
                // console.log("values", values);
                let requestData = new FormData();
                let keys = Object.keys(InitVal);
                keys.map((v) => {
                  if (values[v] != "" && v != "companyId" && v != "branchId") {
                    requestData.append(v, values[v]);
                  }
                });
                requestData.append("companyId", values.companyId.value);

                if (values.branchId && values.branchId != "") {
                  requestData.append("branchId", values.branchId.value);
                }
                // requestData.append("fullName", values.fullName);
                // requestData.append("mobileNumber", values.mobileNumber);
                // requestData.append("email", values.email);
                // requestData.append("gender", values.gender);
                // requestData.append("usercode", values.usercode);
                // requestData.append("password", values.password);

                let fuserPermissions = [];
                if (
                  this.state.userPermission &&
                  this.state.userPermission.length > 0
                ) {
                  this.state.userPermission.map((v) => {
                    fuserPermissions.push(...v.modules);
                  });
                }
                requestData.append(
                  "user_permissions",
                  JSON.stringify(fuserPermissions)
                );
                // console.log("response user per---", requestData);
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
                                      fontFamily: "Inter",
                                      fontStyle: "normal",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      lineHeight: "17px",
                                      alignItems: "center",
                                      letterSpacing: "-0.02em",
                                      color: "#000000",
                                    }}
                                  >
                                    Company Name
                                  </Form.Label>
                                  <Select
                                    id="companyId"
                                    name="companyId"
                                    className="selectTo"
                                    // styles={categorySelectTo}
                                    styles={ledger_select}
                                    placeholder="Select"

                                    options={opCompanyList}
                                    onChange={(v) => {
                                      if (v != null) {
                                        setFieldValue("companyId", v);
                                      } else {
                                        setFieldValue("companyId", "");
                                      }
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
                                      fontFamily: "Inter",
                                      fontStyle: "normal",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      lineHeight: "17px",
                                      alignItems: "center",
                                      letterSpacing: "-0.02em",
                                      color: "#000000",
                                    }}
                                  >
                                    Branch Name
                                  </Form.Label>
                                  <Select
                                    id="branchId"
                                    name="branchId"
                                    className="selectTo"
                                    styles={ledger_select}
                                    // styles={categorySelectTo}
                                    placeholder="Select"
                                    options={opBranchList}
                                    onChange={(v) => {
                                      if (v != null) {
                                        setFieldValue("branchId", v);
                                      } else {
                                        setFieldValue("branchId", "");
                                      }
                                    }}
                                    value={values.branchId}
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
                                      fontFamily: "Inter",
                                      fontStyle: "normal",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      lineHeight: "17px",
                                      alignItems: "center",
                                      letterSpacing: "-0.02em",
                                      color: "#000000",
                                    }}
                                  >
                                    Full Name
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="text-box"
                                    placeholder="Enter Full Name"
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                      OnlyAlphabets(e);
                                    }}
                                    value={values.fullName}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.fullName && errors.fullName}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      fontFamily: "Inter",
                                      fontStyle: "normal",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      lineHeight: "17px",
                                      alignItems: "center",
                                      letterSpacing: "-0.02em",
                                      color: "#000000",
                                    }}
                                  >
                                    Mobile No
                                  </Form.Label>
                                  <Form.Control
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    type="text"
                                    className="text-box"
                                    placeholder="Enter Mob No"
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                      OnlyEnterNumbers(e);
                                    }}
                                    maxLength={10}
                                    value={values.mobileNumber}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.mobileNumber && errors.mobileNumber}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      fontFamily: "Inter",
                                      fontStyle: "normal",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      lineHeight: "17px",
                                      alignItems: "center",
                                      letterSpacing: "-0.02em",
                                      color: "#000000",
                                    }}
                                  >
                                    Email
                                  </Form.Label>
                                  <Form.Control
                                    id="email"
                                    name="email"
                                    type="text"
                                    className="text-box"
                                    placeholder="Enter email"
                                    onChange={handleChange}
                                    value={values.email}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.email && errors.email}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Label
                                  style={{
                                    fontFamily: "Inter",
                                    fontStyle: "normal",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    lineHeight: "17px",
                                    alignItems: "center",
                                    letterSpacing: "-0.02em",
                                    color: "#000000",
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
                                        value="male"
                                        onChange={handleChange}
                                        checked={
                                          values.gender == "male" ? true : false
                                        }
                                        style={{
                                          fontFamily: "Inter",
                                          fontStyle: "normal",
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          lineHeight: "17px",
                                          alignItems: "center",
                                          letterSpacing: "-0.02em",
                                          color: "#000000",
                                          // height: "12px",

                                          // fontFamily: "Lato",
                                          // fontStyle: "normal",
                                          // fontWeight: "400",
                                          // fontSize: "13px",
                                          // //lineHeight: "12px",
                                          // /* identical to box height, or 92% */

                                          // color: "#2F3033",

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
                                        value="female"
                                        onChange={handleChange}
                                        checked={
                                          values.gender == "female"
                                            ? true
                                            : false
                                        }
                                        id={`inline-${type}-2`}
                                        style={{
                                          fontFamily: "Inter",
                                          fontStyle: "normal",
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          lineHeight: "17px",
                                          alignItems: "center",
                                          letterSpacing: "-0.02em",
                                          color: "#000000",
                                          // height: "12px",

                                          // fontFamily: "Lato",
                                          // fontStyle: "normal",
                                          // fontWeight: "400",
                                          // fontSize: "13px",
                                          // //lineHeight: "12px",
                                          // /* identical to box height, or 92% */

                                          // color: "#2F3033",

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
                                      fontFamily: "Inter",
                                      fontStyle: "normal",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      lineHeight: "17px",
                                      alignItems: "center",
                                      letterSpacing: "-0.02em",
                                      color: "#000000",
                                    }}
                                  >
                                    User Code
                                  </Form.Label>
                                  <Form.Control
                                    id="usercode"
                                    name="usercode"
                                    type="text"
                                    className="text-box"
                                    placeholder="Enter user code"
                                    onChange={handleChange}
                                    value={values.usercode}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.usercode && errors.usercode}
                                </span>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Label
                                    style={{
                                      fontFamily: "Inter",
                                      fontStyle: "normal",
                                      fontWeight: 500,
                                      fontSize: "14px",
                                      lineHeight: "17px",
                                      alignItems: "center",
                                      letterSpacing: "-0.02em",
                                      color: "#000000",
                                    }}
                                  >
                                    Password
                                  </Form.Label>
                                  <Form.Control
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="text-box"
                                    placeholder="Enter password"
                                    onChange={handleChange}
                                    value={values.password}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.password && errors.password}
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
                                className="text-box"
                              />
                            </Form.Group>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Select
                                // className="selectTo selectdd-style"
                                className="selectTo"
                                // styles={categorySelectTo}
                                styles={ledger_select}
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
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#d6fcdc",
                              }}
                            >
                              Particulars
                            </th>
                            {/* This Th-Map For Table header like Create,Edit,View */}
                            {actionsOptions &&
                              actionsOptions.length > 0 &&
                              actionsOptions.map((v, i) => {
                                return (
                                  <th
                                    className="text-center"
                                    style={{
                                      borderBottom: "2px solid transparent",
                                      backgroundColor: "#d6fcdc",
                                    }}
                                  >
                                    {v.label}
                                  </th>
                                );
                              })}
                          </tr>
                        </thead>
                        <tbody className="bg-white tblbtmline ">
                          {/* This Map for Insert Data Into Table Content Parent Names like ->Master With Check Box */}
                          {sysPermission.map((vi, ii) => {
                            return (
                              <>
                                <tr>
                                  <td
                                    className="text-center"
                                    style={{ background: "#e6f2f8" }}
                                  >
                                    {vi && (
                                      <Form.Group className="d-flex">
                                        <Form.Check
                                          type={"checkbox"}
                                          id={`check-api-${ii}`}
                                        >
                                          <Form.Check.Input
                                            type={"checkbox"}
                                            defaultChecked={false}
                                            name="level1"
                                            checked={this.isParentChecked(
                                              vi.id
                                            )}
                                            onChange={(e) => {
                                              this.handleUserSelection(
                                                vi.id,
                                                0,
                                                0,
                                                e.target.checked
                                              );
                                            }}
                                          //   value={this.getActionSelectionOption(
                                          //     values,
                                          //     v.value
                                          //   )}
                                          />
                                          <Form.Check.Label
                                            style={{
                                              color: "#00a0f5",
                                              textDecoration: "underline",
                                            }}
                                          >
                                            {vi.label}
                                          </Form.Check.Label>
                                        </Form.Check>
                                      </Form.Group>
                                    )}
                                  </td>
                                  {/* This Map Used for Insert Data of child Under Master */}
                                  {actionsOptions &&
                                    actionsOptions.length > 0 &&
                                    actionsOptions.map((v, i) => {
                                      return (
                                        <td
                                          style={{ background: "#e6f2f8" }}
                                        ></td>
                                      );
                                    })}
                                </tr>
                                {vi.level &&
                                  vi.level.map((vii, iii) => {
                                    return (
                                      <tr>
                                        <td className="text-center">
                                          {vii && (
                                            <Form.Group className="d-flex">
                                              <Form.Check
                                                type={"checkbox"}
                                                id={`check-api-${ii}-${iii}`}
                                              >
                                                <Form.Check.Input
                                                  type={"checkbox"}
                                                  defaultChecked={false}
                                                  name="level1"
                                                  checked={this.isChildchecked(
                                                    vi.id,
                                                    vii.id
                                                  )}
                                                  onChange={(e) => {
                                                    this.handleUserSelection(
                                                      vi.id,
                                                      vii.id,
                                                      0,
                                                      e.target.checked
                                                    );
                                                  }}
                                                  value={vii.id}
                                                />
                                                <Form.Check.Label>
                                                  {vii.label}
                                                </Form.Check.Label>
                                              </Form.Check>
                                            </Form.Group>
                                          )}
                                        </td>
                                        {/* This Map Used For Load Actions of Child With Check Box Controle */}
                                        {vii.actions &&
                                          vii.actions.map((val, ind) => {
                                            return (
                                              <td className="text-center">
                                                <Form.Group className="d-flex">
                                                  <Form.Check
                                                    type={"checkbox"}
                                                    id={`check-api-${ii}-${iii}-${ind}`}
                                                  >
                                                    <Form.Check.Input
                                                      type={"checkbox"}
                                                      defaultChecked={false}
                                                      name="inner_level"
                                                      checked={this.getActionOptionChecked(
                                                        vi.id,
                                                        vii.id,
                                                        val
                                                      )}
                                                      onChange={(e) => {
                                                        this.handleUserSelection(
                                                          vi.id,
                                                          vii.id,
                                                          val,
                                                          e.target.checked
                                                        );
                                                      }}
                                                      value={val}
                                                    />
                                                    <Form.Check.Label>
                                                      {/* {vii.label} */}
                                                    </Form.Check.Label>
                                                  </Form.Check>
                                                </Form.Group>
                                              </td>
                                            );
                                          })}
                                      </tr>
                                    );
                                  })}
                              </>
                            );
                          })}
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
                            variant="secondary"
                            className="cancel-btn me-2"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch(
                                "page_change",
                                "user_access_mngt"
                              );
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="successbtn-style ms-2"
                            type="submit"
                          >
                            <img
                              src={save_icon}
                              className="me-2"
                              style={{
                                height: "15px",
                                width: "15px",
                                // marginTop: "-10px",
                              }}
                            />
                            Save
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
