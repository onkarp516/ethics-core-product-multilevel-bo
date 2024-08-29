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
  InputGroup,
} from "react-bootstrap";
import search from "@/assets/images/search_icon@3x.png";

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
  getBranchBySelectionCompany,
  getSysActions,
  getRolePermissionList,
  getRolePermissionById,
  validateUsers,
} from "@/services/api_functions";
import Select from "react-select";
import save_icon from "@/assets/images/save_icon.svg";
import {
  EMAILREGEXP,
  MobileRegx,
  ShowNotification,
  getValue,
  getSelectValue,
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
  getUserAccessPermission,
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

export default class UserCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      opBranchList: [],
      opRoleList: [],
      opRolePermissionList: [],
      data: [],
      InitVal: {
        id: "",
        companyId: "",
        roleId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "USER",
        email: "",
        gender: "",
        usercode: "",
        password: "",
        showPassword: false,
      },
      userRole: "USER",
      sysPermission: [],
      orgSysPermission: [],
      userPermission: [],
      actionsOptions: [],

      errorArrayBorder: "",
    };
    this.ref = React.createRef();
    this.selectRef = React.createRef();
    this.radioRef = React.createRef();
    this.inputRefs = [];
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
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getRoleList = () => {
    getRolePermissionList()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          let Opt = [];
          if (data.length > 0) {
            Opt = data.map(function (values) {
              return {
                value: values.id,
                label: values.roleName,
              };
            });
            this.setState({ opRoleList: Opt, orgData: data });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
          fdata = fdata.sort((a, b) => (a.id < b.id ? -1 : 1));
          // console.log("fdata", JSON.stringify(fdata, undefined, 2));
          let userPer = fdata.map((v) => {
            // console.log("v", v);
            let inner_modules =
              v.level &&
              v.level.map((vi) => {
                let action_inner = vi.actions.filter((va) => parseInt(va));
                return {
                  mapping_id: parseInt(vi.id),
                  actions: action_inner,
                };
              });

            let obj = {
              id: parseInt(v.id),
              name: v.name,
              modules: inner_modules,
            };
            return obj;
          });
          // console.log("userPer", userPer);
          this.setState({
            sysPermission: fdata,
            orgSysPermission: fdata,
            // userPermission: userPer,
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
            // let companyId = getValue(
            //   Opt,
            //   authenticationService.currentUserValue.companyId
            // );
            // const getValue = (opts, val) => opts.find((o) => o.value === val);

            let companyId = this.state.opCompanyList.find(
              (o) =>
                o.value === authenticationService.currentUserValue.companyId
            );
            // console.log("companyId", companyId);
            this.ref.current.setFieldValue("companyId", companyId);
          });
        }
      })
      .catch((error) => {
        this.setState({ opCompanyList: [] });
        console.log("error", error);
      });
  };

  listGetBranch = (id) => {
    // console.log("id of company=>", id.value);
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

  togglePasswordVisiblity = (status) => {
    this.setState({ showPassword: status });
  };

  // lstLapsPigmy = (id) => {
  //   let formData = new FormData();
  //   formData.append("id", id.value);
  //   axios({
  //     url: "http://localhost:8084/get_lapse_pigmy_list",
  //     method: "POST",
  //     headers: getHeader(),
  //     data: formData,
  //   })
  //     .then((response) => {
  //       if (response.data.responseStatus == 200) {
  //         this.setState({
  //           pigmyListTable: response.data.responseObject,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };

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
      let f = sysPermission.find((v) => parseInt(v.id) == parseInt(parent_id));
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
        // fuserPermissions.push(d);
        fuserPermissions = [...fuserPermissions, d];

        if (userPermission.length > 0) {
          filterUserPermission = userPermission.filter(
            (v) => parseInt(v.id) != parseInt(f.id)
          );
        }
        fuserPermissions = [...fuserPermissions, ...filterUserPermission];
      } else {
        if (userPermission.length > 0) {
          filterUserPermission = userPermission.filter(
            (v) => parseInt(v.id) != parseInt(f.id)
          );
        }
        fuserPermissions = filterUserPermission;
      }

      this.setState({ userPermission: fuserPermissions });
    } else if (action_id == 0) {
      if (status == true) {
        let f = sysPermission.find(
          (v) => parseInt(v.id) == parseInt(parent_id)
        );
        if (userPermission.length == 0) {
          let check = f.level.find(
            (v) => parseInt(v.value) == parseInt(child_id)
          );
          let modules = [];
          if (check) {
            // modules.push({ mappin g_id: check.id, actions: check.actions });
            modules = [
              ...modules,
              { mapping_id: check.id, actions: check.actions },
            ];
          }
          let d = {
            id: f.id,
            name: f.name,
            modules: modules,
          };
          // fuserPermissions.push(d);
          fuserPermissions = [...fuserPermissions, d];
        } else {
          // !IMP
          fuserPermissions = [...userPermission];
          let checkinner = userPermission.find(
            (v) => parseInt(v.id) == parseInt(parent_id)
          );
          if (checkinner) {
            let modules = [];
            // !IMP
            modules = checkinner.modules.filter(
              (v) => parseInt(v.mapping_id) != parseInt(child_id)
            );

            let Syscheck = f.level.find(
              (v) => parseInt(v.value) == parseInt(child_id)
            );

            if (Syscheck) {
              // modules.push({
              //   mapping_id: Syscheck.id,
              //   actions: Syscheck.actions,
              // });
              modules = [
                ...modules,
                {
                  mapping_id: Syscheck.id,
                  actions: Syscheck.actions,
                },
              ];
            }
            let d = {
              id: f.id,
              name: f.name,
              modules: modules,
            };

            if (userPermission.length > 0) {
              filterUserPermission = userPermission.filter(
                (v) => parseInt(v.id) != parseInt(parent_id)
              );
            }
            fuserPermissions = [
              //! ...fuserPermissions,
              ...filterUserPermission,
              d,
            ];
          } else {
            let check = f.level.find(
              (v) => parseInt(v.value) == parseInt(child_id)
            );
            let modules = [];
            if (check) {
              // modules.push({ mapping_id: check.id, actions: check.actions });
              modules = [
                ...modules,
                { mapping_id: check.id, actions: check.actions },
              ];
            }
            let d = {
              id: f.id,
              name: f.name,
              modules: modules,
            };
            if (userPermission.length > 0) {
              filterUserPermission = userPermission.filter(
                (v) => parseInt(v.id) != parseInt(parent_id)
              );
            }
            fuserPermissions = [
              // !...fuserPermissions,
              ...filterUserPermission,
              d,
            ];
          }
        }
      } else {
        let checkinner = userPermission.find(
          (v) => parseInt(v.id) == parseInt(parent_id)
        );
        if (checkinner) {
          let check = checkinner.modules.filter(
            (v) => parseInt(v.mapping_id) !== parseInt(child_id)
          );
          let incheck = {
            id: checkinner.id,
            name: checkinner.name,
            modules: check,
          };
          let fcheckinner = userPermission.filter(
            (v) => parseInt(v.id) !== parseInt(parent_id)
          );
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
              (v) => parseInt(v.mapping_id) == parseInt(child_id)
            );
            if (check) {
              let actions = [...check.actions, action_id];
              check.actions = actions;
              let fcheck = checkinner.modules.filter(
                (v) => parseInt(v.mapping_id) !== parseInt(child_id)
              );
              scheck = [...fcheck, check];
              let incheck = {
                id: checkinner.id,
                name: checkinner.name,
                modules: scheck,
              };
              let fcheckinner = userPermission.filter(
                (v) => parseInt(v.id) !== parseInt(parent_id)
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];
              this.setState({ userPermission: fuserPermissions });
            } else {
              let f = sysPermission.find(
                (v) => parseInt(v.id) == parseInt(parent_id)
              );
              let check = f.level.find(
                (v) => parseInt(v.value) == parseInt(child_id)
              );
              let modules = [...checkinner.modules];
              // modules.push({ mapping_id: check.id, actions: [action_id] });
              modules = [
                ...modules,
                { mapping_id: check.id, actions: [action_id] },
              ];
              let incheck = {
                id: f.id,
                name: f.name,
                modules: modules,
              };
              let fcheckinner = userPermission.filter(
                (v) => parseInt(v.id) !== parseInt(parent_id)
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];

              this.setState({ userPermission: fuserPermissions });
            }
          } else {
            let f = sysPermission.find(
              (v) => parseInt(v.id) == parseInt(parent_id)
            );
            if (f) {
              let check = f.level.find(
                (v) => parseInt(v.value) == parseInt(child_id)
              );
              let modules = [];
              if (check) {
                // modules.push({ mapping_id: check.id, actions: [action_id] });
                modules = [
                  ...modules,
                  { mapping_id: check.id, actions: [action_id] },
                ];
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
          let checkinner = userPermission.find(
            (v) => parseInt(v.id) == parseInt(parent_id)
          );
          let scheck = [];
          if (checkinner) {
            let check = checkinner.modules.find(
              (v) => parseInt(v.mapping_id) == parseInt(child_id)
            );
            if (check) {
              let actions = check.actions.filter(
                (v) => parseInt(v) != parseInt(action_id)
              );
              // let actions = [...check.actions, action_id];
              check.actions = actions;
              let fcheck = checkinner.modules.filter(
                (v) => parseInt(v.mapping_id) !== parseInt(child_id)
              );

              scheck = [...fcheck, check];
              let incheck = {
                id: checkinner.id,
                name: checkinner.name,
                modules: scheck,
              };
              let fcheckinner = userPermission.filter(
                (v) => parseInt(v.id) !== parseInt(parent_id)
              );
              fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];
              this.setState({ userPermission: fuserPermissions });
            }
          }
        }
      } else {
        if (status == true) {
          let f = sysPermission.find(
            (v) => parseInt(v.id) == parseInt(parent_id)
          );
          if (f) {
            let check = f.level.find(
              (v) => parseInt(v.value) == parseInt(child_id)
            );
            let modules = [];
            if (check) {
              // modules.push({ mapping_id: check.id, actions: [action_id] });
              modules = [
                ...modules,
                { mapping_id: check.id, actions: [action_id] },
              ];
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
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "user_mngt_create",
      to: "user_mgnt_list",
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // this.listSysPermission();
      this.setInitValue();
      this.listGetCompany();
      this.getRoleList();
      // this.listGetBranch();
      this.lstSysActionsOptions();
      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValue);
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
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
    let { opCompanyList } = this.state;
    // console.log(
    //   " authenticationService.currentUserValue.companyId ",
    //   authenticationService.currentUserValue.companyId,
    //   opCompanyList
    // );
    this.ref.current.resetForm();
    this.ref.current.setFieldValue(
      "companyId",
      getSelectValue(
        opCompanyList,
        parseInt(authenticationService.currentUserValue.companyId)
      )
    );
    this.setState({
      opendiv: false,
      data: [],
      InitVal: {
        id: "",
        companyId: "",
        companyId: "",
        roleId: "",
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
        roleId: Yup.object().required("User Role is required"),
        mobileNumber: Yup.string()
          .nullable()
          .matches(MobileRegx, "Enter valid mobile number"),
        // .required("Mobile number is required"),
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
          .required("Username is required"),
      });
    } else {
      return Yup.object().shape({
        companyId: Yup.object().required("select company"),
        fullName: Yup.string().trim().required("Full Name is required"),
        mobileNumber: Yup.string()
          .trim()
          .matches(MobileRegx, "Enter valid mobile number"),
        // .required("Mobile Number is required"),
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
        usercode: Yup.string().trim().required("Username is required"),
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

  getRolPermissionsByRoleId = (v = 0) => {
    // console.log("RoleId->", v);
    let requestData = new FormData();
    requestData.append("id", v);
    getRolePermissionById(requestData)
      .then((response) => {
        let res = response.data;
        let fdata = [];
        if (res.responseStatus == 200) {
          let data = res.level;
          // console.log("Response : ", data);
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
          fdata = fdata.sort((a, b) => (a.id < b.id ? -1 : 1));

          let userPer = fdata.map((v) => {
            // console.log("v", v);
            let inner_modules =
              v.level &&
              v.level.map((vi) => {
                let action_inner = vi.actions.filter((va) => parseInt(va));
                return {
                  mapping_id: parseInt(vi.id),
                  actions: action_inner,
                };
              });

            let obj = {
              id: parseInt(v.id),
              name: v.name,
              modules: inner_modules,
            };
            return obj;
          });
          this.setState({
            sysPermission: fdata,
            orgSysPermission: fdata,
            userPermission: userPer,
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

  checkModuleActions = (id, actions) => {
    let actAction = actions.map((v) => parseInt(v));
    return actAction.includes(id);
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
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  focusNextElement(e, nextIndex = null) {
    var form = e.target.form;
    var cur_index =
      nextIndex != null
        ? nextIndex
        : Array.prototype.indexOf.call(form, e.target);
    let ind = cur_index + 1;
    for (let index = ind; index <= form.elements.length; index++) {
      if (form.elements[index]) {
        if (
          !form.elements[index].readOnly &&
          !form.elements[index].disabled &&
          form.elements[index].id != ""
        ) {
          form.elements[index].focus();
          break;
        } else {
          this.focusNextElement(e, index);
        }
      } else {
        this.focusNextElement(e, index);
      }
    }
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
      opRoleList,
      showPassword,
      userRole,
      errorArrayBorder,
      id,
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
              // validationSchema={this.validationSchema()}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // console.log("values----", values);

                //! validation required start
                let errorArray = [];
                if (values.roleId == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }

                if (values.fullName.trim() == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }

                if (values.gender == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }

                if (values.usercode.trim() == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }

                if (values.password.trim() == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }

                this.setState({ errorArrayBorder: errorArray }, () => {
                  if (allEqual(errorArray)) {
                    let requestData = new FormData();
                    let keys = Object.keys(InitVal);
                    keys.map((v) => {
                      if (
                        values[v] != "" &&
                        v != "companyId" &&
                        v != "roleId" &&
                        v != "branchId"
                      ) {
                        requestData.append(v, values[v]);
                      }
                    });
                    requestData.append("companyId", values.companyId.value);
                    requestData.append("roleId", values.roleId.value);
                    requestData.append("userRole", userRole);
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
                      // console.log(pair[0] + ", " + pair[1]);
                    }
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

                              eventBus.dispatch("page_change", {
                                from: "user_mgnt_create",
                                to: "user_mgnt_list",
                                isNewTab: false,
                                isCancel: true,
                                prop_data: {
                                  userId: true,
                                },
                              });
                            } else {
                              //   ShowNotification("Error", res.message);
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: res.message,
                                is_button_show: true,
                                isNewTab: false,
                                isCancel: true,
                              });
                              eventBus.dispatch("page_change", {
                                from: "user_mgnt_create",
                                to: "user_mgnt_list",
                                prop_data: {
                                  userId: true,
                                },
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
                      },
                      handleFailFn: () => {
                        setSubmitting(false);
                        //   eventBus.dispatch("page_change", {
                        //     from: "user_mgnt_create",
                        //     to: "user_mgnt_list",
                        //     prop_data:{
                        //        userId:id,
                        //     }
                        // });
                      },
                    });
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
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div>
                    {/* {JSON.stringify(values)} */}
                    <Row>
                      <Col md="12">
                        <Card className="detailsstyle">
                          <Card.Body>
                            <p className="cardheading">User Details:</p>
                            <Row>
                              <Col md="1 px-0">
                                <Form.Label>
                                  Company Name
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.handleKeyDown(e, "roleId");
                                    }
                                  }}
                                >
                                  <Select
                                    id="companyId"
                                    name="companyId"
                                    className="selectTo"
                                    // styles={categorySelectTo}
                                    styles={ledger_select}
                                    placeholder="Select"
                                    isDisabled={true}
                                    options={opCompanyList}
                                    onChange={(v) => {
                                      if (v != null) {
                                        setFieldValue("companyId", v);
                                        setFieldValue("branchId", "");
                                        // this.setState({ opBranchList: [] });
                                        this.listGetBranch(v);
                                      } else {
                                        setFieldValue("companyId", "");
                                      }
                                    }}
                                    value={values.companyId}
                                  // ref={(input) => (this.inputRefs[0] = input)}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.companyId && errors.companyId}
                                </span>
                              </Col>

                              <Col md="1">
                                <Form.Label>
                                  User Role
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group
                                  className={`${errorArrayBorder[0] == "Y"
                                    ? "border border-danger selectTo"
                                    : "selectTo"
                                    }`}
                                  style={{ borderRadius: "4px" }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.roleId) {
                                      this.setErrorBorder(0, "");
                                    } else {
                                      this.setErrorBorder(0, "Y");
                                      // this.selectRef.current?.focus();
                                    }
                                  }}
                                // onKeyDown={(e) => {
                                //   if (e.shiftKey && e.key === "Tab") {
                                //   } else if (
                                //     e.key === "Tab" &&
                                //     !values.roleId
                                //   )
                                //     e.preventDefault();
                                // }}
                                >
                                  <Select
                                    ref={this.selectRef}
                                    // ref={(input) => (this.inputRefs[1] = input)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Tab" && !values.roleId) {
                                        e.preventDefault();
                                      } else if (
                                        e.keyCode == 13 &&
                                        values.roleId != ""
                                      ) {
                                        this.handleKeyDown(e, "fullName");
                                      }
                                    }}
                                    id="roleId"
                                    autoComplete="off"
                                    name="roleId"
                                    // className="selectTo"
                                    // styles={categorySelectTo}
                                    styles={ledger_select}
                                    placeholder="Select"
                                    options={opRoleList}
                                    onChange={(v) => {
                                      if (v != null) {
                                        setFieldValue("roleId", v);
                                        this.getRolPermissionsByRoleId(v.value);
                                      } else {
                                        setFieldValue("roleId", "");
                                        this.setState({
                                          opRolePermissionList: [],
                                        });
                                      }
                                    }}
                                    autoFocus
                                    value={values.roleId}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.roleId && errors.roleId}
                                </span>
                              </Col>

                              <Col md="1">
                                <Form.Label>
                                  Full Name
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    // onKeyDown={(e) => {
                                    //   if (e.key === "Tab" && !e.target.value)
                                    //     e.preventDefault();
                                    // }}
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter Full Name"
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                      OnlyAlphabets(e);
                                    }}
                                    onInput={(e) => {
                                      e.target.value = this.getDataCapitalised(
                                        e.target.value
                                      );
                                    }}
                                    value={values.fullName}
                                    className={`${errorArrayBorder[1] == "Y"
                                      ? "border border-danger text-box"
                                      : "text-box"
                                      }`}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      if (e.target.value.trim()) {
                                        this.setErrorBorder(1, "");
                                      } else {
                                        this.setErrorBorder(1, "Y");
                                        document
                                          .getElementById("fullName")
                                          .focus();
                                      }
                                    }}
                                    // onKeyDown={(e) => {
                                    //   if (e.shiftKey && e.key === "Tab") {
                                    //   } else if (
                                    //     e.key === "Tab" &&
                                    //     !e.target.value
                                    //   )
                                    //     e.preventDefault();
                                    // }}
                                    // ref={(input) => (this.inputRefs[2] = input)}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.handleKeyDown(e, "mobileNumber");
                                      }
                                      // else if (e.keyCode == 32) {
                                      //   e.preventDefault();
                                      // }
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.fullName && errors.fullName}
                                </span>
                              </Col>
                              <Col md="1">
                                <Form.Label>
                                  Mobile No.
                                  {/* <span className="text-danger">*</span> */}
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    type="text"
                                    className="text-box"
                                    placeholder="Enter Mobile No."
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                      OnlyEnterNumbers(e);
                                    }}
                                    // ref={(input) => (this.inputRefs[3] = input)}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 18) {
                                        e.preventDefault();
                                      }
                                      if (e.shiftKey && e.key === "Tab") {
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
                                      } else if (
                                        e.key === "Tab" ||
                                        e.keyCode == 13
                                      ) {
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
                                          this.handleKeyDown(e, "email");
                                        }
                                      }
                                    }}
                                    onBlur={(e) => { }}
                                    maxLength={10}
                                    value={values.mobileNumber}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.mobileNumber && errors.mobileNumber}
                                </span>
                              </Col>
                            </Row>

                            <Row className="mt-2">
                              <Col md="1" className="px-0">
                                <Form.Label>E-mail</Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    id="email"
                                    name="email"
                                    type="text"
                                    className="text-box"
                                    placeholder="Enter E-mail"
                                    onChange={handleChange}
                                    // ref={(input) => (this.inputRefs[4] = input)}
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
                                            msg: "Please Enter Valid Email Id. ",
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          setTimeout(() => {
                                            document
                                              .getElementById("email")
                                              .focus();
                                          }, 1000);
                                        }
                                      } else if (
                                        e.key === "Tab" ||
                                        e.keyCode == 13
                                      ) {
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
                                            document
                                              .getElementById("email")
                                              .focus();
                                          }, 1000);
                                        } else {
                                          this.handleKeyDown(e, "male");
                                        }
                                      }
                                    }}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                    }}
                                    value={values.email}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.email && errors.email}
                                </span>
                              </Col>

                              <Col md="1">
                                <Form.Label>
                                  Gender<span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form
                                  style={{ width: "fit-content" }}
                                  className={`${errorArrayBorder[2] == "Y"
                                    ? "border border-danger"
                                    : ""
                                    }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.gender) {
                                      this.setErrorBorder(2, "");
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      // this.radioRef.current?.focus();
                                    }
                                  }}
                                  // onKeyDown={(e) => {
                                  //   if (e.target.value === "") { }
                                  //   else { this.handleKeyDown(e, "usercode") }
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      (e.key === "Tab" && !values.gender) ||
                                      (e.keyCode == 13 && !values.gender)
                                    ) {
                                      e.preventDefault();
                                      this.radioRef.current?.focus();
                                    } else if (
                                      (e.key === "Tab" && values.gender) ||
                                      (e.keyCode == 13 && values.gender)
                                    ) {
                                      this.handleKeyDown(e, "usercode");
                                    }
                                  }}
                                >
                                  {["radio"].map((type) => (
                                    <div key={`inline-${type}`}>
                                      <Form.Check
                                        id="male"
                                        inline
                                        ref={this.radioRef}
                                        // ref={(input) => (this.inputRefs[5] = input)}
                                        label="Male"
                                        name="gender"
                                        type={type}
                                        // id={`inline-${type}-1`}
                                        value="male"
                                        onChange={handleChange}
                                        checked={
                                          values.gender == "male" ? true : false
                                        }

                                      // style={{
                                      //   fontFamily: "Inter",
                                      //   fontStyle: "normal",
                                      //   fontWeight: 500,
                                      //   fontSize: "14px",
                                      //   lineHeight: "17px",
                                      //   alignItems: "center",
                                      //   letterSpacing: "-0.02em",
                                      //   color: "#000000",
                                      //   // height: "12px",

                                      //   // fontFamily: "Lato",
                                      //   // fontStyle: "normal",
                                      //   // fontWeight: "400",
                                      //   // fontSize: "13px",
                                      //   // //lineHeight: "12px",
                                      //   // /* identical to box height, or 92% */

                                      //   // color: "#2F3033",

                                      //   /* Inside auto layout */

                                      //   flex: "none",
                                      //   order: "1",
                                      //   flexGrow: "0",
                                      // }}
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
                                        id="female"
                                      // id={`inline-${type}-1`}
                                      />
                                    </div>
                                  ))}
                                </Form>
                                <span className="text-danger">
                                  {errors.gender && errors.gender}
                                </span>
                              </Col>

                              <Col md="1">
                                <Form.Label>
                                  Username
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <Form.Control
                                    // onKeyDown={(e) => {
                                    //   if (e.key === "Tab" && !e.target.value)
                                    //     e.preventDefault();
                                    // }}
                                    autoComplete="off"
                                    id="usercode"
                                    name="usercode"
                                    type="text"
                                    placeholder="Enter Username"
                                    onChange={handleChange}
                                    value={values.usercode}
                                    className={`${errorArrayBorder[3] == "Y"
                                      ? "border border-danger text-box"
                                      : "text-box"
                                      }`}
                                    // onBlur={(e) => {
                                    //   e.preventDefault();
                                    //   // if (
                                    //   //   e.target.value.trim() &&
                                    //   //   e.target.value.trim() != "" &&
                                    //   //   values.password == ""
                                    //   // ) {
                                    //   //   this.validateUserDuplicate(
                                    //   //     values.usercode,
                                    //   //     setFieldValue
                                    //   //   );
                                    //   // } else {
                                    //   //   document
                                    //   //     .getElementById("usercode")
                                    //   //     .focus();
                                    //   // }
                                    //   if (e.target.value.trim()) {
                                    //     this.setErrorBorder(3, "");
                                    //     // this.validateUserDuplicate(
                                    //     //   values.usercode,
                                    //     //   setFieldValue
                                    //     // );
                                    //   } else {
                                    //     this.setErrorBorder(3, "Y");
                                    //     document
                                    //       .getElementById("usercode")
                                    //       .focus();
                                    //   }
                                    // }}

                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.keyCode === 9) {
                                        if (e.target.value.trim())
                                          this.setErrorBorder(3, "");
                                        else {
                                          this.setErrorBorder(3, "Y");
                                        }

                                      } else if (e.key === "Tab") {
                                        if (
                                          e.target.value.trim() &&
                                          e.target.value.trim() != ""

                                        ) {
                                          this.setErrorBorder(3, "");
                                          this.validateUserDuplicate(
                                            values.usercode,
                                            setFieldValue
                                          );
                                          this.handleKeyDown(e, "password");
                                        } else {
                                          e.preventDefault();

                                        }
                                      }
                                      else if (e.keyCode === 13) {
                                        if (
                                          e.target.value.trim() &&
                                          e.target.value.trim() != ""


                                        ) {
                                          this.setErrorBorder(3, "");
                                          this.validateUserDuplicate(
                                            values.usercode,
                                            setFieldValue
                                          );
                                          this.handleKeyDown(e, "password");
                                        } else {
                                          e.preventDefault();
                                          // document
                                          //   .getElementById("usercode")
                                          //   .focus();
                                        }
                                      }
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.usercode && errors.usercode}
                                </span>
                              </Col>
                              <Col md="1">
                                <Form.Label>
                                  Password
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col md="2">
                                <Form.Group>
                                  <InputGroup>
                                    <Form.Control
                                      // onKeyDown={(e) => {
                                      //   if (e.key === "Tab" && !e.target.value)
                                      //     e.preventDefault();
                                      // }}
                                      autoComplete="off"
                                      type="text"
                                      style={{
                                        webkitTextSecurity:
                                          showPassword != "" ? "disc" : "unset",
                                        // border: "1px solid #dcdcdc",
                                      }}
                                      id="password"
                                      name="password"
                                      placeholder="Enter password"
                                      onChange={handleChange}
                                      value={values.password}
                                      className={`${errorArrayBorder[4] == "Y"
                                        ? "border border-danger pass-text"
                                        : "pass-text"
                                        }`}


                                      onKeyDown={(e) => {

                                        if (e.shiftKey && e.keyCode === 9) {
                                          if (e.target.value.trim())
                                            this.setErrorBorder(4, "");
                                          else {
                                            this.setErrorBorder(4, "Y");
                                          }
                                        } else if (e.keyCode == 9) {
                                          if (e.target.value !== "") {
                                            this.setErrorBorder(4, "");
                                            this.focusNextElement(e);
                                          } else {
                                            e.preventDefault();
                                          }
                                        }
                                        else if (e.keyCode == 13) {
                                          if (e.target.value !== "") {
                                            this.setErrorBorder(4, "");
                                            this.focusNextElement(e);
                                          } else {
                                            e.preventDefault();
                                          }
                                        }
                                      }}
                                    />
                                    <InputGroup.Text className="pass-icon">
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
                    <Row className="px-2 mt-2">
                      <Col md="12" className="mb-2">
                        <Row>
                          <Col md="2">
                            <p className="cardheading mb-0">
                              Access Permissions:
                            </p>
                          </Col>
                          <Col md="7"></Col>
                          {/* <Col md="3">
                            <Form.Group>
                            
                              <InputGroup className="mdl-text">
                                <Form.Control
                                  placeholder="Search"
                                  aria-label="Search"
                                  aria-describedby="basic-addon1"
                                  className="mdl-text-box"
                                  autoComplete="nope"
                                  // onChange={(e) => {
                                  //   this.transaction_product_listFun(e.target.value);
                                  // }}
                                />
                                <InputGroup.Text
                                  className="int-grp"
                                  id="basic-addon1"
                                >
                                  <img
                                    className="srch_box"
                                    src={search}
                                    alt=""
                                  />
                                </InputGroup.Text>
                              </InputGroup>
                            </Form.Group>
                          </Col> */}

                          {/* <Col md="2">
                            <Form.Group>
                              <Select
                                // className="selectTo selectdd-style"
                                className="selectTo"
                                // styles={categorySelectTo}
                                styles={ledger_select}
                                placeholder="Select Type"
                              />
                            </Form.Group>
                          </Col> */}
                        </Row>
                      </Col>
                    </Row>
                    <div className="px-1 tblht">
                      <Table bordered className="usertblbg tblresponsive">
                        <thead style={{ position: "sticky", top: "0" }}>
                          <tr style={{ borderWidth: "0px" }}>
                            <th
                              style={{
                                borderBottom: "2px solid transparent",
                                backgroundColor: "#fff4df",
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
                                      backgroundColor: "#fff4df",
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
                                    {vi && vi.label != "" && (
                                      <>
                                        <Form.Group
                                          className="d-flex my-auto p-1"
                                          id={`FG-check-api-${ii}`}
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 13)
                                              this.focusNextElement(e);
                                          }}
                                        >
                                          <Form.Check
                                            type={"switch"}
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
                                      </>
                                    )}
                                  </td>
                                  {/* This Map Used for Insert Data of child Under Master */}
                                  {actionsOptions &&
                                    actionsOptions.length > 0 &&
                                    actionsOptions.map((v, i) => {
                                      return (
                                        <td
                                          style={{
                                            background: "#e6f2f8",
                                            width: "10%",
                                          }}
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
                                            <Form.Group
                                              className="d-flex my-auto p-1 ms-4"
                                              id={`FG-check-api-${ii}-${iii}`}
                                              onKeyDown={(e) => {
                                                if (e.keyCode == 13)
                                                  this.focusNextElement(e);
                                              }}
                                            >
                                              <Form.Check
                                                type={"switch"}
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
                                        {/* This Map Used For Load Actions of Child With Check Box Control */}
                                        {actionsOptions &&
                                          actionsOptions.map((va, vai) => {
                                            return (
                                              <td>
                                                {this.checkModuleActions(
                                                  va.id,
                                                  vii.actions
                                                ) && (
                                                    <Form.Group
                                                      className="d-flex"
                                                      id={`FG-check-api-${vai}`}
                                                      onKeyDown={(e) => {
                                                        if (e.keyCode == 13)
                                                          this.focusNextElement(
                                                            e
                                                          );
                                                      }}
                                                    >
                                                      <Form.Check
                                                        className="mx-auto"
                                                        type={"switch"}
                                                        id={`check-api-${vai}`}
                                                      >
                                                        <Form.Check.Input
                                                          type={"checkbox"}
                                                          defaultChecked={false}
                                                          name="inner_level"
                                                          checked={this.getActionOptionChecked(
                                                            vi.id,
                                                            vii.id,
                                                            va.id
                                                          )}
                                                          onChange={(e) => {
                                                            this.handleUserSelection(
                                                              vi.id,
                                                              vii.id,
                                                              va.id,
                                                              e.target.checked
                                                            );
                                                          }}
                                                          value={va}
                                                        />
                                                        <Form.Check.Label>
                                                          {/* {vii.label} */}
                                                        </Form.Check.Label>
                                                      </Form.Check>
                                                    </Form.Group>
                                                  )}
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
                    <Row className="p-1 text-end">
                      <Col md="12 mt-2">
                        <Button
                          className="successbtn-style"
                          type="submit"
                          id="submit"
                          onClick={(e) => {
                            if (values.id === "") {
                              this.validateUserDuplicate(
                                values.usercode,
                                setFieldValue
                              );
                            }
                            e.preventDefault();
                            this.ref.current.handleSubmit();
                          }}
                          // ref={(input) => (this.inputRefs[8] = input)}
                          onKeyDown={(e) => {
                            if (values.id === "") {
                              this.validateUserDuplicate(
                                values.usercode,
                                setFieldValue
                              );
                            }
                            if (e.keyCode === 32) {
                              e.preventDefault();
                            } else if (e.keyCode === 13) {
                              this.ref.current.handleSubmit();
                            } else {
                              this.handleKeyDown(e, "cancel");
                            }
                          }}
                        >
                          {/* <img
                              src={save_icon}
                              className="me-2"
                              style={{
                                height: "15px",
                                width: "15px",
                                // marginTop: "-10px",
                              }}
                            /> */}
                          Submit
                        </Button>
                        <Button
                          variant="secondary"
                          className="cancel-btn ms-2"
                          id="cancel"
                          onClick={(e) => {
                            e.preventDefault();

                            MyNotifications.fire(
                              {
                                show: true,
                                icon: "confirm",
                                title: "Confirm",
                                msg: "Do you want to Cancel",
                                is_button_show: false,
                                is_timeout: false,
                                delay: 0,
                                handleSuccessFn: () => {
                                  eventBus.dispatch("page_change", {
                                    from: "user_mgnt_create",
                                    to: "user_mgnt_list",
                                    isNewTab: false,
                                    isCancel: true,
                                  });
                                },
                                handleFailFn: () => { },
                              },
                              () => {
                                // console.warn("return_data");
                              }
                            );
                          }}
                          // ref={(input) => (this.inputRefs[9] = input)}
                          onKeyDown={(e) => {
                            if (e.keyCode === 32) {
                              e.preventDefault();
                            } else if (e.keyCode === 13) {
                              MyNotifications.fire(
                                {
                                  show: true,
                                  icon: "confirm",
                                  title: "Confirm",
                                  msg: "Do you want to Cancel",
                                  is_button_show: false,
                                  is_timeout: false,
                                  delay: 0,
                                  handleSuccessFn: () => {
                                    eventBus.dispatch("page_change", {
                                      from: "user_mgnt_create",
                                      to: "user_mgnt_list",
                                      isNewTab: false,
                                      isCancel: true,
                                    });
                                  },
                                  handleFailFn: () => { },
                                },
                                () => {
                                  // console.warn("return_data");
                                }
                              );
                            } else {
                              this.handleKeyDown(e, "companyId");
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
      </div>
    );
  }
}
