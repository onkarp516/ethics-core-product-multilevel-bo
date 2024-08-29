import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  Card,
  ButtonGroup,
} from "react-bootstrap";
import {
  authenticationService,
  getRolePermissionList,
  getSysAllPermissions,
  getSysActions,
  getRoleById,
  updateRole,
  validateUserRoleUpdate,
} from "@/services/api_functions";
import { Formik } from "formik";
import * as Yup from "yup";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import delete_icon from "@/assets/images/delete_icon3.png";
import Select from "react-select";
import save_icon from "@/assets/images/save_icon.svg";
import search from "@/assets/images/search_icon@3x.png";

import {
  EMAILREGEXP,
  numericRegExp,
  urlRegExp,
  ShowNotification,
  getValue,
  getSelectValue,
  AuthenticationCheck,
  MyDatePicker,
  ledger_select,
  MyTextDatePicker,
  MyNotifications,
  isActionExist,
  eventBus,
  OnlyAlphabets,
  LoadingComponent,
  getUserAccessPermission,
  allEqual,
} from "@/helpers";
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

export default class RoleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditDataSet: false,
      RoleEditData: "",
      RoleInitval: {
        id: "",
        roleName: "",
        brannchId: "",
        companyId: "",
      },
      showloader: true,
      // userRole: "USER",
      sysPermission: [],
      orgSysPermission: [],
      userPermission: [],
      opRoleList: [],
      actionsOptions: [],
      errorArrayBorder: "",
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
      .catch((error) => {});
  };

  listSysPermission = () => {
    getSysAllPermissions()
      .then((response) => {
        let res = response.data;
        let fdata = [];
        if (res.responseStatus == 200) {
          let data = res.level;
          data.map((v, i) => {
            let check = fdata.find((vi) => vi.id == v.id);
            let d;
            if (check) {
              // console.log("check i ==>>", JSON.stringify(check), i);
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
          fdata = fdata.sort((a, b) => (a.id < b.id ? -1 : 1));
          // console.log("accessPermission fData", JSON.stringify(fdata, undefined, 2));

          // console.log("fdata==-> ", fdata);
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
  setRoleInitVal = () => {
    this.setState({
      RoleInitval: {
        id: "",
        roleName: "",
        brannchId: "",
        companyId: "",
      },
    });
  };

  listgetRolewithPermission = () => {
    getRolePermissionList().then((response) => {
      let res = response.data;
      if (res.responseStatus == 200) {
        let d = res.responseObject;
        let Opt = [];
        if (d.length > 0) {
          this.setState({ opCompanyList: Opt });
        }
      }
    });
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

  // handleUserSelection = (
  //   parent_id,
  //   child_id = 0,
  //   action_id = 0,
  //   status = false
  // ) => {
  //   let { userPermission, sysPermission } = this.state;
  //   let filterUserPermission = [];
  //   let fuserPermissions = [];
  //   if (child_id == 0 && action_id == 0) {
  //     let f = sysPermission.find((v) => v.id == parent_id);
  //     if (status == true) {
  //       let modules = [];
  //       if (f.level) {
  //         modules = f.level.map((vi) => {
  //           return { mapping_id: vi.id, actions: vi.actions };
  //         });
  //       }
  //       let d = {
  //         id: f.id,
  //         name: f.name,
  //         modules: modules,
  //       };
  //       fuserPermissions.push(d);

  //       if (userPermission.length > 0) {
  //         filterUserPermission = userPermission.filter((v) => v.id != f.id);
  //       }
  //       fuserPermissions = [...fuserPermissions, ...filterUserPermission];
  //     } else {
  //       if (userPermission.length > 0) {
  //         filterUserPermission = userPermission.filter((v) => v.id != f.id);
  //       }
  //       fuserPermissions = filterUserPermission;
  //     }

  //     this.setState({ userPermission: fuserPermissions });
  //   } else if (action_id == 0) {
  //     if (status == true) {
  //       let f = sysPermission.find((v) => v.id == parent_id);
  //       if (userPermission.length == 0) {
  //         let check = f.level.find((v) => v.value == child_id);
  //         let modules = [];
  //         if (check) {
  //           modules.push({ mapping_id: check.id, actions: check.actions });
  //         }
  //         let d = {
  //           id: f.id,
  //           name: f.name,
  //           modules: modules,
  //         };
  //         fuserPermissions.push(d);
  //       } else {
  //         let checkinner = userPermission.find((v) => v.id == parent_id);
  //         if (checkinner) {
  //           let modules = [];
  //           modules = checkinner.modules;
  //           let Syscheck = f.level.find((v) => v.value == child_id);
  //           if (Syscheck) {
  //             modules.push({
  //               mapping_id: Syscheck.id,
  //               actions: Syscheck.actions,
  //             });
  //           }
  //           let d = {
  //             id: f.id,
  //             name: f.name,
  //             modules: modules,
  //           };
  //           if (userPermission.length > 0) {
  //             filterUserPermission = userPermission.filter(
  //               (v) => v.id != parent_id
  //             );
  //           }
  //           fuserPermissions = [
  //             ...fuserPermissions,
  //             ...filterUserPermission,
  //             d,
  //           ];
  //         } else {
  //           let check = f.level.find((v) => v.value == child_id);
  //           let modules = [];
  //           if (check) {
  //             modules.push({ mapping_id: check.id, actions: check.actions });
  //           }
  //           let d = {
  //             id: f.id,
  //             name: f.name,
  //             modules: modules,
  //           };
  //           if (userPermission.length > 0) {
  //             filterUserPermission = userPermission.filter(
  //               (v) => v.id != parent_id
  //             );
  //           }
  //           fuserPermissions = [
  //             ...fuserPermissions,
  //             ...filterUserPermission,
  //             d,
  //           ];
  //         }
  //       }
  //     } else {
  //       let checkinner = userPermission.find((v) => v.id == parent_id);
  //       if (checkinner) {
  //         let check = checkinner.modules.filter(
  //           (v) => v.mapping_id !== child_id
  //         );
  //         let incheck = {
  //           id: checkinner.id,
  //           name: checkinner.name,
  //           modules: check,
  //         };
  //         let fcheckinner = userPermission.filter((v) => v.id !== parent_id);
  //         fuserPermissions = [...fcheckinner, incheck];
  //       }
  //     }

  //     this.setState({ userPermission: fuserPermissions });
  //   } else {
  //     if (userPermission.length > 0) {
  //       if (status == true) {
  //         let checkinner = userPermission.find((v) => v.id == parent_id);
  //         let scheck = [];
  //         if (checkinner) {
  //           let check = checkinner.modules.find(
  //             (v) => v.mapping_id == child_id
  //           );
  //           if (check) {
  //             let actions = [...check.actions, action_id];
  //             check.actions = actions;
  //             let fcheck = checkinner.modules.filter(
  //               (v) => v.mapping_id !== child_id
  //             );
  //             scheck = [...fcheck, check];
  //             let incheck = {
  //               id: checkinner.id,
  //               name: checkinner.name,
  //               modules: scheck,
  //             };
  //             let fcheckinner = userPermission.filter(
  //               (v) => v.id !== parent_id
  //             );
  //             fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];
  //             this.setState({ userPermission: fuserPermissions });
  //           } else {
  //             let f = sysPermission.find((v) => v.id == parent_id);
  //             let check = f.level.find((v) => v.value == child_id);
  //             let modules = [...checkinner.modules];
  //             modules.push({ mapping_id: check.id, actions: [action_id] });
  //             let incheck = {
  //               id: f.id,
  //               name: f.name,
  //               modules: modules,
  //             };
  //             let fcheckinner = userPermission.filter(
  //               (v) => v.id !== parent_id
  //             );
  //             fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];

  //             this.setState({ userPermission: fuserPermissions });
  //           }
  //         } else {
  //           let f = sysPermission.find((v) => v.id == parent_id);
  //           if (f) {
  //             let check = f.level.find((v) => v.value == child_id);
  //             let modules = [];
  //             if (check) {
  //               modules.push({ mapping_id: check.id, actions: [action_id] });
  //             }
  //             if (check) {
  //               let d = {
  //                 id: f.id,
  //                 name: f.name,
  //                 modules: modules,
  //               };
  //               fuserPermissions = [d];
  //             }
  //             fuserPermissions = [...fuserPermissions, ...userPermission];
  //             this.setState({ userPermission: fuserPermissions });
  //           }
  //         }
  //       } else {
  //         let checkinner = userPermission.find((v) => v.id == parent_id);
  //         let scheck = [];
  //         if (checkinner) {
  //           let check = checkinner.modules.find(
  //             (v) => v.mapping_id == child_id
  //           );
  //           if (check) {
  //             let actions = check.actions.filter(
  //               (v) => parseInt(v) != parseInt(action_id)
  //             );
  //             // let actions = [...check.actions, action_id];
  //             check.actions = actions;
  //             let fcheck = checkinner.modules.filter(
  //               (v) => v.mapping_id !== child_id
  //             );

  //             scheck = [...fcheck, check];
  //             let incheck = {
  //               id: checkinner.id,
  //               name: checkinner.name,
  //               modules: scheck,
  //             };
  //             let fcheckinner = userPermission.filter(
  //               (v) => v.id !== parent_id
  //             );
  //             fuserPermissions = [...fuserPermissions, ...fcheckinner, incheck];
  //             this.setState({ userPermission: fuserPermissions });
  //           }
  //         }
  //       }
  //     } else {
  //       if (status == true) {
  //         let f = sysPermission.find((v) => v.id == parent_id);
  //         if (f) {
  //           let check = f.level.find((v) => v.value == child_id);
  //           let modules = [];
  //           if (check) {
  //             modules.push({ mapping_id: check.id, actions: [action_id] });
  //           }
  //           if (check) {
  //             let d = {
  //               id: f.id,
  //               name: f.name,
  //               modules: modules,
  //             };
  //             fuserPermissions = [d];
  //           }
  //           this.setState({ userPermission: fuserPermissions });
  //         }
  //       } else {
  //         this.setState({ userPermission: [] });
  //       }
  //     }
  //   }
  // };

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

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listSysPermission();
      this.lstSysActionsOptions();
      this.setRoleInitVal();
      const { prop_data } = this.props.block;
      // console.log("prop_data--->", prop_data);

      this.setState({ RoleEditData: prop_data.prop_data });

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }

  // alt key button disabled start
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleAltKeyDisable);
  }
  // alt key button disabled end

  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end

  componentDidUpdate() {
    const { sysPermission, orgSysPermission, isEditDataSet, RoleEditData } =
      this.state;
    // console.log(sysPermission, orgSysPermission, isEditDataSet);
    if (
      orgSysPermission.length > 0 &&
      sysPermission.length > 0 &&
      isEditDataSet == false &&
      RoleEditData != ""
    ) {
      this.getRoleWithPermissionById();
    }
  }

  getRoleWithPermissionById = () => {
    const { RoleEditData } = this.state;
    let requestData = new FormData();
    requestData.append("id", RoleEditData.id);
    getRoleById(requestData)
      .then((res) => res.data)
      .then((response) => {
        if (response.responseStatus == 200) {
          let data = response.responseObject;
          let initVal = {
            id: data.id,
            roleName: data.roleName,
          };
          // console.log(
          //   "initVal->",
          //   this.state.orgSysPermission,
          //   data.permissions
          // );
          let userPer = getUserAccessPermission(
            this.state.orgSysPermission,
            data.permissions
          );
          // console.log("userPer>>>>", userPer);
          this.setState(
            {
              RoleInitval: initVal,
              isEditDataSet: true,
              userPermission: userPer,
              orgUserPermission: userPer,
            },
            () => {
              // console.log("RoleInitval", this.state.RoleInitval);
            }
          );
        }
      });
  };
  pageReload = () => {
    this.componentDidMount();
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

  //@Vinit@Duplicate User Not Allowed
  validateUserRoleUpdateDuplicate = (id, roleName, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("roleName", roleName);
    validateUserRoleUpdate(reqData)
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
            document.getElementById("roleName").focus();
          }, 1300);
          //this.reloadPage();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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

  focusPrevElement(e, prevIndex = null) {
    var form = e.target.form;
    var cur_index =
      prevIndex != null
        ? prevIndex
        : Array.prototype.indexOf.call(form, e.target);
    let ind = cur_index - 1;
    for (let index = ind; index <= form.elements.length; index--) {
      if (form.elements[index]) {
        if (
          !form.elements[index].readOnly &&
          !form.elements[index].disabled &&
          form.elements[index].id != ""
        ) {
          form.elements[index].focus();
          break;
        } else {
          this.focusPrevElement(e, index);
        }
      } else {
        this.focusPrevElement(e, index);
      }
    }
  }
  render() {
    const {
      opRoleList,
      RoleInitval,
      showloader,
      actionsOptions,
      sysPermission,
      errorArrayBorder,
    } = this.state;

    return (
      <div>
        <div
          id="example-collapse-text"
          className="usercreatestyle"
          style={{ overflow: "hidden" }}
        >
          <div className="m-0">
            {/* <h4 className="form-header">Create User</h4> */}
            <Formik
              validateOnChange={false}
              // validateOnBlur={false}
              enableReinitialize={true}
              initialValues={RoleInitval}
              innerRef={this.ref}
              // validationSchema={Yup.object().shape({})}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                //! validation required start

                let errorArray = [];
                if (values.roleName.trim() == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }

                //! validation required end
                this.setState({ errorArrayBorder: errorArray }, () => {
                  if (allEqual(errorArray)) {
                    // console.log("values", values);
                    let requestData = new FormData();
                    let keys = Object.keys(RoleInitval);
                    keys.map((v) => {
                      if (values[v] != "") {
                        requestData.append(v, values[v]);
                      }
                    });

                    let fuserPermissions = [];
                    if (
                      this.state.userPermission &&
                      this.state.userPermission.length > 0
                    ) {
                      this.state.userPermission.map((v) => {
                        fuserPermissions.push(...v.modules);
                      });
                    }

                    let forguserPermissions = [];
                    if (
                      this.state.orgUserPermission &&
                      this.state.orgUserPermission.length > 0
                    ) {
                      this.state.orgUserPermission.map((v) => {
                        forguserPermissions.push(...v.modules);
                      });
                    }

                    requestData.append(
                      "role_permissions",
                      JSON.stringify(fuserPermissions)
                    );

                    let permissionId = [
                      ...new Set(fuserPermissions.map((v) => v.mapping_id)),
                    ];
                    let setPermissionIds = [
                      ...new Set(forguserPermissions.map((v) => v.mapping_id)),
                    ];

                    let diffPermission = setPermissionIds.filter(
                      (v) => !permissionId.includes(parseInt(v))
                    );
                    requestData.append(
                      "del_role_permissions",
                      JSON.stringify(diffPermission)
                    );

                    // Display the key/value pairs
                    for (var pair of requestData.entries()) {
                      // console.log(pair[0] + ", " + pair[1]);
                    }
                    MyNotifications.fire({
                      show: true,
                      icon: "confirm",
                      title: "Confirm",
                      msg: "Do you want to Update ?",
                      is_button_show: false,
                      is_timeout: false,
                      delay: 0,
                      handleSuccessFn: () => {
                        updateRole(requestData)
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
                              // eventBus.dispatch("page_change", "rolelist");
                              eventBus.dispatch("page_change", {
                                from: "roleedit",
                                to: "rolelist",
                                prop_data: {
                                  editId: this.state.RoleEditData.id,
                                  rowId: this.props.block.prop_data.rowId,
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
                  spellcheck="false"
                >
                  <div>
                    <Row>
                      <Col md="12">
                        <Card className="detailsstyle-Role">
                          <Card.Body>
                            <p className="cardheading mb-0">
                              User Role Details:
                            </p>
                            <Row className="mt-2">
                              <Col lg="1" className="text-end my-auto">
                                <Form.Label className="form_label">
                                  Role
                                  <span className="text-danger">*</span>
                                </Form.Label>
                              </Col>
                              <Col lg={2}>
                                <Form.Group>
                                  <Form.Control
                                    autoFocus={true}
                                    type="text"
                                    id="roleName"
                                    name="roleName"
                                    // className="text-box"
                                    placeholder="Enter Role"
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                      OnlyAlphabets(e);
                                    }}
                                    autoComplete="roleName"
                                    // }}
                                    className={`${
                                      errorArrayBorder[0] == "Y"
                                        ? "border border-danger text-box"
                                        : "text-box"
                                    }`}
                                    value={values.roleName}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 9) {
                                        e.preventDefault();
                                        if (
                                          e.target.value.trim() &&
                                          e.target.value.trim() != ""
                                        ) {
                                          setFieldValue(
                                            "roleName",
                                            values.roleName.trim()
                                          );
                                          this.setErrorBorder(0, "");
                                          this.focusNextElement(e);
                                        } else {
                                          document
                                            .getElementById("roleName")
                                            .focus();
                                        }
                                      } else if (e.keyCode === 13) {
                                        if (
                                          e.target.value.trim() &&
                                          e.target.value.trim() != ""
                                        ) {
                                          setFieldValue(
                                            "roleName",
                                            values.roleName.trim()
                                          );
                                          this.setErrorBorder(0, "");
                                          this.focusNextElement(e);
                                        } else {
                                          document
                                            .getElementById("roleName")
                                            .focus();
                                        }
                                      }
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.roleName && errors.roleName}
                                </span>
                              </Col>

                              {/* <Col md="8"> */}
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
                              {/* </Col> */}
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
                          {/* <Col md="7"></Col>
                          <Col md="3">
                            <InputGroup className="mb-2  mdl-text">
                              <Form.Control
                                type="text"
                                name="Search"
                                id="Search"
                                // onChange={(e) => {
                                //   this.handleSearch(e.target.value);
                                // }}
                                placeholder="Search"
                                className="mdl-text-box"
                              />
                              <InputGroup.Text
                                className="int-grp"
                                id="basic-addon1"
                              >
                                <img className="srch_box" src={search} alt="" />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col> */}
                          {/* <Col md="2">
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
                          </Col> */}
                        </Row>
                      </Col>
                    </Row>
                    <div className="px-2 tblht">
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
                                      width: "180px",
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
                                      <Form.Group
                                        className="d-flex"
                                        onKeyDown={(e) => {
                                          if (e.shiftKey && e.keyCode == 9) {
                                            e.preventDefault();
                                            this.focusPrevElement(e);
                                          } else if (
                                            e.keyCode == 13 ||
                                            e.keyCode == 9
                                          ) {
                                            e.preventDefault();
                                            this.focusNextElement(e);
                                          }
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
                                              textDecoration: "underline",
                                            }}
                                            className="checkBox_style"
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
                                            <Form.Group
                                              className="d-flex ms-4"
                                              onKeyDown={(e) => {
                                                if (
                                                  e.shiftKey &&
                                                  e.keyCode == 9
                                                ) {
                                                  e.preventDefault();
                                                  this.focusPrevElement(e);
                                                } else if (
                                                  e.keyCode == 13 ||
                                                  e.keyCode == 9
                                                ) {
                                                  e.preventDefault();
                                                  this.focusNextElement(e);
                                                }
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
                                        {/* This Map Used For Load Actions of Child With Check Box Controle */}
                                        {/* {vii.actions &&
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
                                                    </Form.Check.Label>
                                                  </Form.Check>
                                                </Form.Group>
                                              </td>
                                            );
                                          })} */}

                                        {vii.actions &&
                                          vii.actions.map((val, ind) => {
                                            return (
                                              <td className="text-center">
                                                <Form.Group
                                                  className="d-flex justify-content-center"
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.shiftKey &&
                                                      e.keyCode == 9
                                                    ) {
                                                      e.preventDefault();
                                                      this.focusPrevElement(e);
                                                    } else if (
                                                      e.keyCode == 13 ||
                                                      e.keyCode == 9
                                                    ) {
                                                      e.preventDefault();
                                                      this.focusNextElement(e);
                                                    }
                                                  }}
                                                >
                                                  <Form.Check
                                                    type={"switch"}
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
                    <Row className="mt-2 mb-1 me-2">
                      <Col md="12" className="text-end">
                        {/* <ButtonGroup
                          className="float-end"
                          aria-label="Basic example"
                        > */}
                        <Button
                          id="roleE_submit_btn"
                          className="successbtn-style"
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            this.ref.current.handleSubmit();
                            // eventBus.dispatch("page_change", {
                            //   from: "roleedit",
                            //   to: "rolelist",
                            //   prop_data: {
                            //     editId: this.state.RoleEditData.id,
                            //     rowId: this.props.block.prop_data.rowId,
                            //   },
                            // });
                          }}
                          onKeyDown={(e) => {
                            if (e.keyCode == 32) {
                              e.preventDefault();
                            } else if (e.keyCode === 13) {
                              this.ref.current.handleSubmit();
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
                          Update
                        </Button>
                        <Button
                          variant="secondary"
                          className="cancel-btn ms-2"
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
                                  // eventBus.dispatch("page_change", "rolelist");
                                  eventBus.dispatch("page_change", {
                                    from: "roleedit",
                                    to: "rolelist",
                                    prop_data: {
                                      editId: this.state.RoleEditData.id,
                                      rowId: this.props.block.prop_data.rowId,
                                    },
                                    isCancel: true,
                                  });
                                },
                                handleFailFn: () => {},
                              },
                              () => {
                                // console.warn("return_data");
                              }
                            );
                          }}
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
                                      from: "role",
                                      to: "rolelist",
                                      prop_data: {
                                        editId: this.state.RoleEditData.id,
                                        rowId: this.props.block.prop_data.rowId,
                                      },

                                      isNewTab: false,
                                      isCancel: true,
                                    });
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  // console.warn("return_data");
                                }
                              );
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
