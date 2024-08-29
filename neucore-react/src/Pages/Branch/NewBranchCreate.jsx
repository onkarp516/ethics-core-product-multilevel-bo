import { Formik } from "formik";
import * as Yup from "yup";

import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  Tabs,
  Tab,
  Modal,
} from "react-bootstrap";
import {
  ledger_select,
  MyTextDatePicker,
  MyNotifications,
  truncateString,
  OnlyAlphabets,
  OnlyEnterNumbers,
  AuthenticationCheck,
  companystyle,
  getSelectValue,
  getValue,
  eventBus,
  EMAILREGEXP,
  GSTINREX,
  allEqual,
} from "@/helpers";
import moment from "moment";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import Select from "react-select";
import {
  faEye,
  faEyedropper,
  faEyeSlash,
  faHouse,
  faCirclePlus,
  faPen,
  faFloppyDisk,
  faTrash,
  faXmark,
  faCalculator,
  faGear,
  faRightFromBracket,
  faPrint,
  faArrowUpFromBracket,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  authenticationService,
  createCompany,
  getIndianState,
  getIndiaCountry,
  get_companies_super_admin,
  get_companies_data,
  getGSTTypes,
  getCompanyById,
  updateCompany,
  validateCompany,
  getAllMasterAppConfig,
  validateUsers,
  getPincodeData,
  updateBranchById,
  createBranch,
  validateBranch,
  validate_pincode,
} from "@/services/api_functions";
import mousetrap from "mousetrap";
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
const Currencyopt = [{ label: "INR", value: "INR" }];

const level_a_validation = (idx, uclst) => {
  if (uclst[idx]["value"] === "1" && uclst[idx]["label"] !== "") return false;
  return true;
};

const level_a_b_validation = (idx_a, idx_b, uclst) => {
  if (
    uclst[idx_a]["value"] === "1" &&
    uclst[idx_a]["label"] !== "" &&
    uclst[idx_b]["value"] === "1" &&
    uclst[idx_b]["label"] !== ""
  ) {
    return false;
  }
  return true;
};

export default class NewBranchCreate extends React.Component {
  constructor(props) {
    super(props);
    this.transFormRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.ref = React.createRef();
    this.inputRefs = [];
    this.regAreaRef = React.createRef();
    this.corpAreaRef = React.createRef();
    this.regCountryRef = React.createRef();
    this.corpCountryRef = React.createRef();
    this.currencyRef = React.createRef();
    this.gsttypeRef = React.createRef();

    const curDate = new Date();
    this.state = {
      countryOpt: [],
      GSTopt: [],
      orgData: [],
      userControlData: [],
      showPassword: false,
      gstshow: false,
      tabVisible: false,
      data: [],
      areaOpt: [],
      corporateareaOpt: [],
      checkAddress: false,
      dt: moment(curDate).format("DD/MM/YYYY"),
      stateCodeData: [],
      opCompanyList: [],
      BranchInitVal: {
        id: "",
        companyId: "",
        companyName: "",
        branchName: "",
        branchCode: "",
        licenseNo: "",
        licenseExpiryDate: "",
        foodLicenseNo: "",
        foodLicenseExpiryDate: "",
        manufacturingLicenseNo: "",
        manufacturingLicenseExpiry: "",
        natureOfBusiness: "",
        registeredAddress: "",
        multiBranch: "",
        corporateAddress: "",
        corporatePincode: "",
        tradeOfBusiness: "",
        sameAsAddress: "",
        pincode: "",
        email: "",
        mobileNumber: "",
        whatsappNumber: "",
        place: "",
        countryId: "",
        stateId: "",
        stateCode: "",
        district: "",
        website: "",
        gstApplicable: false,
        gstIn: "",
        gstType: "",
        gstApplicableDate: "",
        currency: "",
        route: "",
        gstTransferDate: "",

        fullName: "",
        contactNumber: "",
        userRole: "BADMIN",
        userDob: "",
        userDoa: "",
        emailId: "",
        gender: "",
        usercode: "",
        password: "",
        areaId: "",
        corporateareaId: "",
        oldPinCode: "",
      },
      showErorrModal: false,
      errorArrayBorder: "",
    };
    this.selectRef = React.createRef();
    this.selectRef1 = React.createRef();
    this.radioRef = React.createRef();
    this.BranchNameRef = React.createRef();
    this.RetailerRef = React.createRef();
    this.NOFRef = React.createRef();
    this.uploadRef = React.createRef();
    this.AddressRef = React.createRef();
    this.pincodeRef = React.createRef();
    this.sameAddRef = React.createRef();
    this.AddressRef1 = React.createRef();
    this.pincodeRef1 = React.createRef();
    this.licensRef = React.createRef();
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
  }
  gstFieldshow = (status) => {
    this.setState({ gstApplicable: status });
  };
  pageReload = () => {
    this.componentDidMount();
  };

  togglePasswordVisiblity = (status) => {
    this.setState({ showPassword: status });
  };
  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        let { initValue } = this.state;
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt }, () => {
          initValue["countryId"] = opt[0];
          this.setState({ initValue: initValue });
        });
      })
      .catch((error) => {});
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
      step: 1,
      BranchInitVal: {
        id: "",
        companyId: "",
        companyName: "",
        branchName: "",
        branchCode: "",
        licenseNo: "",
        licenseExpiryDate: "",
        foodLicenseNo: "",
        foodLicenseExpiryDate: "",
        manufacturingLicenseNo: "",
        manufacturingLicenseExpiry: "",
        natureOfBusiness: "",
        registeredAddress: "",
        sameAsAddress: false,
        companyLogo: "",
        multiBranch: "",
        corporateAddress: "",
        corporatePincode: "",
        tradeOfBusiness: "",
        pincode: "",
        email: "",
        mobileNumber: "",
        whatsappNumber: "",
        place: "",
        countryId: "",
        stateId: "",
        district: "",
        website: "",
        gstApplicable: false,
        gstIn: "",
        gstType: "",
        gstApplicableDate: "",
        currency: "",
        route: "",
        gstTransferDate: "",

        fullName: "",
        contactNumber: "",
        userRole: "BADMIN",
        userDob: "",
        userDoa: "",
        emailId: "",
        gender: "",
        usercode: "",
        password: "",
        manageOutlets: "",
        Search: "",
      },
    });
  };
  listGetCompany = (status = false) => {
    get_companies_data()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let Opt = [];
          if (d.length > 0) {
            Opt = d.map(function (values) {
              return {
                value: authenticationService.currentUserValue.companyId,
                label: authenticationService.currentUserValue.CompanyName,
              };
            });
          }
          this.setState({ opCompanyList: Opt }, () => {
            let companyId = getSelectValue(
              this.state.opCompanyList,
              authenticationService.currentUserValue.companyId
            );

            // let companyId = this.state.opCompanyList.find(
            //   (o) =>
            //     o.value === authenticationService.currentUserValue.companyId
            // );
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
  validatePincode = (pincode, type) => {
    let reqData = new FormData();
    reqData.append("pincode", pincode);
    console.log("pincode", pincode);
    validate_pincode(reqData)
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
          // setFieldValue("pincode", "");
          if (this.ref.current.values.sameAsAddress == true) {
            this.ref.current.setFieldValue("corporateareaId", "");
            this.ref.current.setFieldValue("corporatestateName", "  ");
            this.ref.current.setFieldValue("corporatestateCode", "");
            this.ref.current.setFieldValue("corporatecity", "");
            this.ref.current.setFieldValue("corporatePincode", "");
          }
          if (type) {
            setTimeout(() => {
              document.getElementById("corporatePincode").focus();
            }, 500);
          } else {
            setTimeout(() => {
              document.getElementById("pincode").focus();
            }, 500);
          }
        } else {
          if (type) {
            setTimeout(() => {
              this.corpAreaRef.current?.focus();
            }, 100);
          } else {
            setTimeout(() => {
              this.regAreaRef.current?.focus();
            }, 100);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  validatePincodeCorp = (pincode, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("pincode", pincode);
    console.log("pincode", pincode);
    validate_pincode(reqData)
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
          // setFieldValue("pincode", "");
          // if (this.ref.current.values.sameAsAddress == true) {
          //   this.ref.current.setFieldValue("corporateareaId", "");
          //   this.ref.current.setFieldValue("corporatestateName", "  ");
          //   this.ref.current.setFieldValue("corporatestateCode", "");
          //   this.ref.current.setFieldValue("corporatecity", "");
          //   this.ref.current.setFieldValue("corporatePincode", "");
          // }
          setTimeout(() => {
            document.getElementById("corporatePincode").focus();
          }, 500);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // this.lstState();
      // this.lstCountry();
      this.listGSTTypes();
      this.setInitValues();
      this.getAllMasterAppConfig();
      this.lstCountry();
      this.listGetCompany();

      // mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      // mousetrap.bindGlobal("ctrl+c", this.setInitValues);

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

  getAllMasterAppConfig = () => {
    getAllMasterAppConfig()
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          // console.log("result : ", result);
          let res = result.responseObject;

          console.log("getAllMasterAppConfig", res);
          let opt = res.map((v) => {
            return {
              id: v.id,
              display_name: v.display_name,
              slug: v.slug,
              is_label: v.is_label,
              value: 0,
              label: "",
            };
          });
          this.setState({
            userControlData: opt,
          });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: result.message,
            is_button_show: true,
          });
          // ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };
  getPincodeData = (pincode, setFieldValue) => {
    let { oldPinCode } = this.state;
    let reqData = new FormData();
    reqData.append("pincode", pincode);
    getPincodeData(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          setFieldValue("city", res.responseObject[0].district);
          setFieldValue("stateName", res.responseObject[0].state);
          setFieldValue("stateCode", res.responseObject[0].stateCode);
          let opt = d.map((v) => {
            return { value: v.id, label: v.area, stateCode: v.stateCode };
          });
          let gstOldValue = "";
          if (document.getElementById("gstIn") != null) {
            gstOldValue = document.getElementById("gstIn").value;
          }
          /*    this.setState({ areaOpt: opt }, () => {
            setFieldValue("gstIn", opt[0].stateCode + gstOldValue.substring(2));
          }); */
          if (oldPinCode != pincode)
            this.ref.current.setFieldValue("areaId", opt[0]);

          if (this.ref.current.values.sameAsAddress == true) {
            if (oldPinCode != pincode)
              this.ref.current.setFieldValue("corporateareaId", opt[0]);
            this.ref.current.setFieldValue(
              "corporatestateName",
              res.responseObject[0].state
            );
            this.ref.current.setFieldValue(
              "corporatestateCode",
              res.responseObject[0].stateCode
            );
            this.ref.current.setFieldValue(
              "corporatecity",
              res.responseObject[0].district
            );
          }

          this.setState(
            {
              oldPinCode: pincode,
              areaOpt: opt,
              corporateareaOpt: opt,
              stateCodeData: opt[0].stateCode,
            },
            () => {
              setFieldValue(
                "gstIn",
                opt[0].stateCode + gstOldValue.substring(2)
              );
            }
          );
        } else {
          setFieldValue("city", " ");
          setFieldValue("stateName", "");
          setFieldValue("stateCode", "");
          setFieldValue("areaId", "");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  getCorporateAreaList() {
    this.setState({ corporateareaOpt: this.state.areaOpt });
  }
  getCorporatePincodeData = (pincode, setFieldValue) => {
    // debugger;
    let reqData = new FormData();
    reqData.append("pincode", pincode);
    getPincodeData(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          setFieldValue("corporatecity", res.responseObject[0].district);
          setFieldValue("corporatestateName", res.responseObject[0].state);
          setFieldValue("corporatestateCode", res.responseObject[0].stateCode);
          let opt = d.map((v) => {
            return { label: v.area, value: v.id };
          });
          this.setState({ corporateareaOpt: opt });
          // this.ref.current.setFieldValue("corporateareaId", opt[0]);
          // this.ref.current.setFieldValue("corporateareaId", opt[0]);
          // @prathmesh @select area from list and click on same as address then same area can't be auto selected start
          if (this.ref.current.values.sameAsAddress == true) {
          } else {
            this.ref.current.setFieldValue("corporateareaId", opt[0]);
          }
          // end
        } else {
          setFieldValue("corporatecity", " ");
          setFieldValue("corporatestateName", "");
          setFieldValue("corporatestateCode", "");
          setFieldValue("corporateareaId", "");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // handleSelectionChange = (slug, value) => {
  //   console.log("slug", slug);
  //   console.log("value", value);
  //   let { userControlData } = this.state;
  //   console.log("userControlData", userControlData);
  //   // let fObj = userControlData.find((v) => v.slug == slug);
  //   // if (fObj) {
  //   //   fObj.value = value;
  //   // }

  //   // let fUserControlData = [...userControlData, fObj];
  //   userControlData = userControlData.map((v) => {
  //     if (v.slug == slug) {
  //       v.value = value;
  //     }

  //     return v;
  //   });

  //   this.setState({ userControlData: userControlData }, () => {
  //     console.log("userControlData", userControlData);
  //   });
  // };

  handleSelectionChange = (slug, value, index) => {
    // console.log("slug", slug);
    // console.log("value", value);
    let { userControlData } = this.state;
    // console.log("userControlData", userControlData);
    // let fObj = userControlData.find((v) => v.slug == slug);
    // if (fObj) {
    //   fObj.value = value;
    // }

    // let fUserControlData = [...userControlData, fObj];

    // console.warn('Index ->>>>>', userControlData[index - 1]['is_label'])
    // console.warn('Index ->>>>>', userControlData[index - 1]['label'])
    // console.warn('Index ->>>>>', userControlData[index]['is_label'])
    // console.warn('before Value ->>>>>', userControlData[index]["value"])
    // console.warn('before Label ->>>>>', userControlData[index]["label"])

    userControlData = userControlData.map((v) => {
      if (v.slug == slug) {
        // if (
        //   userControlData[index - 1] != undefined &&
        //   userControlData[index + 1] != undefined
        // ) {
        if (userControlData[index]["is_label"]) {
          // debugger;
          // if (userControlData[index - 1]["is_label"]) {
          if (userControlData[index - 1]["is_label"]) {
            if (userControlData[index]["label"]) {
              v.value = 1;
            } else if (
              userControlData[index + 1]["is_label"] &&
              userControlData[index + 1]["value"] == 1
            ) {
              v.value = 1;
            } else if (
              userControlData[index - 1]["label"] &&
              userControlData[index - 1]["value"] == 1
            ) {
              v.value = value;
            } else {
              v.value = 0;
            }
          } else if (userControlData[index]["label"]) {
            v.value = 1;
          } else if (userControlData[index + 1]["label"]) {
            v.value = 1;
          } else if (userControlData[index + 1]["value"]) {
            v.value = 1;
          } else {
            v.value = value;
          }
        }
        //  else if (userControlData[index]["is_label"]) {
        //   v.value = 1;
        // } else if (userControlData[index + 1]["value"] == 1) {
        //   v.value = 1;
        // }
        else {
          v.value = value;
        }
        // } else {
        //   v.value = value;
        // }

        // v.value = value;
      }

      return v;
    });

    this.setState({ userControlData: userControlData }, () => {
      // console.log("userControlData", userControlData);
      // console.warn('Value ->>>>>', userControlData[index]["value"])
      // console.warn('Label ->>>>>', userControlData[index]["label"])
    });
  };

  handleLabelChange = (slug, value) => {
    let { userControlData } = this.state;
    userControlData = userControlData.map((v) => {
      if (v.slug == slug) {
        v.label = value;
      }

      return v;
    });

    this.setState({ userControlData: userControlData }, () => {
      console.log("userControlData", userControlData);
    });
  };

  SelectionChangeCheck = (slug) => {
    // console.log("slug", slug);
    let { userControlData } = this.state;

    let fObj = userControlData.find((v) => v.slug == slug);
    // console.log("fObj", fObj);
    if (fObj) {
      if (parseInt(fObj.value) == 1) {
        return true;
      }
    }
    return false;
  };

  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        let { BranchInitVal } = this.state;
        // console.log("country res", response);
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt }, () => {
          let FCompanyInitVal = { ...BranchInitVal };
          FCompanyInitVal["countryId"] = opt[0];
          FCompanyInitVal["currency"] = Currencyopt[0];
          this.setState({ BranchInitVal: FCompanyInitVal });
        });
        this.ref.current.setFieldValue("currency", Currencyopt[0]);
        this.ref.current.setFieldValue("countryId", opt[0]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  handleAddress = (status, address, pincode, setFieldValue) => {
    this.setState(
      {
        checkAddress: status,
      },
      () => {
        if (this.state.checkAddress === true) {
          setFieldValue("corporateAddress", address);
          setFieldValue("corporatePincode", pincode);
        } else {
          setFieldValue("corporateAddress", "");
          setFieldValue("corporatePincode", "");
        }
      }
    );
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
            icon: "warning",
            title: "Warning",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          // setFieldValue("branchName", "");
          setTimeout(() => {
            document.getElementById("branchName").focus();
          }, 1300);
          //this.reloadPage();
        } else {
          document.getElementById("Manufaturer").focus();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

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
    // if (e.keyCode === 37) {
    //   document.getElementById(index).focus();
    //   // const prevIndex = (index - 1) % this.inputRefs.length;
    //   // if (prevIndex === -1) {
    //   //   this.inputRefs[index].focus();
    //   // } else {
    //   //   this.inputRefs[prevIndex].focus();
    //   // }
    // }
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

  // handleSetFieldValue(setFieldValue, key, value) {
  //   setFieldValue(key, value.trim());
  // }

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
      handleSelectionChange,
      handleLabelChange,
      data,
      stateOpt,
      opendiv,
      countryOpt,
      GSTopt,
      BranchInitVal,
      toggle,
      tabVisible,
      dt,
      showPassword,
      userControlData,
      gstshow,
      checkAddress,
      areaOpt,
      corporateareaOpt,
      stateCodeData,
      opCompanyList,
      showErorrModal,
      errorArrayBorder,
    } = this.state;

    let onchangeerrorArray = [];
    return (
      <div>
        <div className="branchcreate">
          <Formik
            innerRef={this.ref}
            initialValues={BranchInitVal}
            validationSchema={Yup.object().shape({})}
            validateOnChange={false}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // if (values.id == "" && step < 3) {
              //   setSubmitting(false);
              //   this.goToNextPage(values);
              // } else {

              // ! Validation Start
              // debugger;
              //  if(values.branchCode.trim() && values.branchName.trim() && values.usercode.trim() && values.password.trim()){
              //   values.branchCode= values.branchCode.trim();
              //   values.branchName = values.branchName.trim();
              //   values.usercode = values.usercode.trim();
              //   values.password = values.password.trim();
              let errorArray = [];
              if (values.companyId == "") {
                // if (!errorArray)
                errorArray.push("Y");
                // errorArray.splice(0, 0, "Branch name is required");
                // errorArray.splice(0, 0, "Branch name is required");
              } else {
                errorArray.push("");
              }

              if (values.branchName.trim() == "") {
                // if (!errorArray)
                errorArray.push("Y");
                // errorArray.splice(0, 0, "Branch name is required");
                // errorArray.splice(0, 0, "Branch name is required");
              } else {
                errorArray.push("");
              }

              if (values.tradeOfBusiness == "") {
                // if (!errorArray)
                errorArray.push("Y");
                // errorArray.splice(0, 0, "Branch name is required");
                // errorArray.splice(0, 0, "Branch name is required");
              } else {
                errorArray.push("");
              }

              if (values.pincode == "") {
                // if (!errorArray)
                errorArray.push("Y");
                // errorArray.splice(0, 0, "Branch name is required");
                // errorArray.splice(0, 0, "Branch name is required");
              } else {
                errorArray.push("");
              }

              if (values.gstApplicable) {
                if (values.gstIn.trim() == "") {
                  errorArray.push("Y");
                  // errorArray.splice(0, 0, "Branch name is required");
                  // errorArray.splice(0, 0, "Branch name is required");
                } else {
                  errorArray.push("");
                }

                if (values.tradeOfBusiness == "") {
                  // if (!errorArray)
                  errorArray.push("Y");
                  // errorArray.splice(0, 0, "Branch name is required");
                  // errorArray.splice(0, 0, "Branch name is required");
                } else {
                  errorArray.push("");
                }

                if (values.usercode.trim() == "") {
                  errorArray.push("Y");
                  //   if (!errorArray.includes("User Name is required"))
                  //     errorArray.splice(1, 0, "User Name is required");
                } else {
                  errorArray.push("");
                  //   errorArray.splice(1, 1);
                }

                if (values.password.trim() == "") {
                  errorArray.push("Y");
                  //   if (!errorArray.includes("Password is required"))
                  //     errorArray.splice(2, 0, "Password is required");
                } else {
                  errorArray.push("");
                  //   errorArray.splice(2, 1);
                }

                if (values.gstType == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }
              } else {
                errorArray.push("");
                errorArray.push("");
              }

              if (values.usercode == "") {
                errorArray.push("Y");
                //   if (!errorArray.includes("User Name is required"))
                //     errorArray.splice(1, 0, "User Name is required");
              } else {
                errorArray.push("");
                //   errorArray.splice(1, 1);
              }

              if (values.password == "") {
                errorArray.push("Y");
                //   if (!errorArray.includes("Password is required"))
                //     errorArray.splice(2, 0, "Password is required");
              } else {
                errorArray.push("");
                //   errorArray.splice(2, 1);
              }

              // ! Validation end
              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  let msg =
                    values.id === ""
                      ? "Do you want to Submit"
                      : "Do you want to Update ?";
                  MyNotifications.fire({
                    show: true,
                    icon: "confirm",
                    title: "Confirm",
                    msg: msg,
                    is_button_show: false,
                    is_timeout: false,
                    delay: 0,
                    handleSuccessFn: () => {
                      setSubmitting(true);
                      let keys = Object.keys(BranchInitVal);
                      // console.log("keys", keys);
                      console.log("values--->", values);
                      console.log(
                        " authenticationService.currentUserValue --->",
                        authenticationService.currentUserValue
                      );
                      let requestData = new FormData();

                      keys.map((v) => {
                        console.log("v", v, "values", values[v]);
                        if (
                          values[v] !== "" &&
                          values[v] !== undefined &&
                          // v !== "stateId" &&
                          v !== "countryId" &&
                          v !== "companyId" &&
                          v !== "currency" &&
                          v !== "gstType" &&
                          v !== "gstApplicableDate" &&
                          v !== "licenseExpiryDate" &&
                          v !== "foodLicenseExpiryDate" &&
                          v !== "manufacturingLicenseExpiry" &&
                          v !== "gstTransferDate" &&
                          v !== "userDob" &&
                          v !== "userDoa"
                        ) {
                          requestData.append(v, values[v]);
                        }
                      });
                      requestData.append("companyId", values.companyId.value);

                      console.log("values.gstApplicable", values.gstApplicable);
                      requestData.append(
                        "gstApplicable",
                        values.gstApplicable && values.gstApplicable == true
                          ? true
                          : false
                      );
                      requestData.append(
                        "isMultiBranch",
                        values.multiBranch && values.multiBranch === true
                          ? true
                          : false
                      );
                      if (values.licenseExpiryDate != "") {
                        requestData.append(
                          "licenseExpiryDate",
                          moment(values.licenseExpiryDate, "DD/MM/YYYY").format(
                            "YYYY-MM-DD"
                          )
                        );
                      }

                      if (values.foodLicenseExpiryDate != "") {
                        requestData.append(
                          "foodLicenseExpiryDate",
                          moment(
                            values.foodLicenseExpiryDate,
                            "DD/MM/YYYY"
                          ).format("YYYY-MM-DD")
                        );
                      }
                      if (values.manufacturingLicenseExpiry != "") {
                        requestData.append(
                          "manufacturingLicenseExpiry",
                          moment(
                            values.manufacturingLicenseExpiry,
                            "DD/MM/YYYY"
                          ).format("YYYY-MM-DD")
                        );
                      }
                      if (values.gstTransferDate != "") {
                        requestData.append(
                          "gstTransferDate",
                          moment(values.gstTransferDate, "DD/MM/YYYY").format(
                            "YYYY-MM-DD"
                          )
                        );
                      }
                      if (values.userDob != "") {
                        requestData.append(
                          "userDob",
                          moment(values.userDob, "DD/MM/YYYY").format(
                            "YYYY-MM-DD"
                          )
                        );
                      }
                      if (values.userDoa != "") {
                        requestData.append(
                          "userDoa",
                          moment(values.userDoa, "DD/MM/YYYY").format(
                            "YYYY-MM-DD"
                          )
                        );
                      }
                      if (values.sameAsAddress != "") {
                        requestData.append(
                          "sameAsAddress",
                          this.state.checkAddress
                        );
                      }
                      if (values.gstApplicable === true) {
                        requestData.append("gstType", values.gstType.value);
                        requestData.append("gstIn", values.gstIn);

                        if (values.gstApplicableDate != "") {
                          requestData.append(
                            "gstApplicableDate",
                            moment(
                              values.gstApplicableDate,
                              "DD/MM/YYYY"
                            ).format("YYYY-MM-DD")
                          );
                        }
                      }
                      requestData.append(
                        "userControlData",
                        JSON.stringify(userControlData)
                      );

                      requestData.append("stateCode", values.stateCode);
                      requestData.append("city", values.city);
                      requestData.append("corporatecity", values.corporatecity);
                      requestData.append(
                        "corporatestateCode",
                        values.corporatestateCode
                      );
                      requestData.append("countryId", values.countryId.value);
                      if (values.areaId != "" && values.areaId != null) {
                        requestData.append(
                          "area",
                          values.areaId
                            ? values.areaId != ""
                              ? values.areaId.value
                              : 0
                            : 0
                        );
                      }
                      if (
                        values.corporateareaId != "" &&
                        values.corporateareaId != null
                      ) {
                        requestData.append(
                          "corporatearea",
                          values.corporateareaId
                            ? values.corporateareaId != ""
                              ? values.corporateareaId.value
                              : 0
                            : 0
                        );
                      }

                      if (values.currency != "") {
                        requestData.append("currency", values.currency.value);
                      }
                      for (let [name, value] of requestData) {
                        console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                      }
                      console.log("requestData", requestData);
                      console.log("values---->", values);

                      if (values.id === "") {
                        createBranch(requestData)
                          .then((response) => {
                            resetForm();
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

                              eventBus.dispatch("page_change", {
                                from: "newBranchCreate",
                                to: "newBranchList",
                                isNewTab: false,
                                isCancel: true,
                              });
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: "Error While Creating Outlet",
                                is_timeout: true,
                                delay: 1000,
                              });
                            }
                          })
                          .catch((error) => {
                            setSubmitting(false);
                            console.log("error", error);
                          });
                      } else {
                        updateBranchById(requestData)
                          .then((response) => {
                            resetForm();
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
                                msg: "Error While Updating Outlet",
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
                              msg: "Error While Updating Outlet",
                              is_timeout: true,
                              delay: 1000,
                            });
                          });
                      }
                    },
                    handleFailFn: () => {
                      setSubmitting(false);
                    },
                  });
                }
              });

              // }
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
                <div className="co-inner-div">
                  {/* <h5 className="heding justify-content-center">
                  Company Information
                </h5> */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <div
                      className="my-auto"
                      style={{
                        // flex: 1,
                        height: "1px",
                        backgroundColor: "rgb(181 174 174)",
                      }}
                    />

                    <div>
                      <p
                        style={{ textAlign: "center", marginBottom: "0" }}
                        className="px-2 heding"
                      >
                        Company Information
                      </p>
                    </div>

                    <div
                      className="my-auto"
                      style={{
                        flex: 1,
                        height: "1px",
                        backgroundColor: " #D9D9D9",
                      }}
                    />
                  </div>
                  <Row className="pb-1">
                    <Col lg="3">
                      {" "}
                      <Row>
                        <Col lg="4" className="pe-0">
                          <Form.Label>
                            Company Name<span className="text-danger">*</span>
                          </Form.Label>
                        </Col>
                        <Col lg="8" className="ps-3">
                          <Form.Group>
                            <Select
                              autoFocus={true}
                              isClearable={true}
                              isDisabled={true}
                              className="selectTo"
                              styles={companystyle}
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
                              // ref={(input) => (this.inputRefs[0] = input)}
                            />
                            <span className="text-danger errormsg">
                              {errors.companyId}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg="2">
                      {" "}
                      <Row>
                        <Col lg="6" className="pe-0">
                          <Form.Label>Branch Code</Form.Label>
                        </Col>
                        <Col lg="6">
                          <Form.Group>
                            <Form.Control
                              autoComplete="off"
                              className="co_text_box ps-1 pe-1"
                              type="text"
                              autoFocus={true}
                              name="branchCode"
                              id="branchCode"
                              placeholder="Branch Code"
                              onChange={handleChange}
                              value={values.branchCode}
                              // onKeyDown={(e) => {
                              //   if (
                              //     e.shiftKey ||
                              //     e.keyCode == 9 ||
                              //     e.keyCode == 13
                              //   ) {
                              //     setFieldValue("branchCode", e.target.value);
                              //   }
                              //   if (e.shiftKey && e.key === "Tab") {
                              //     e.preventDefault();
                              //   } else if (e.key === "Tab") {
                              //     if (e.target.value.trim()) {
                              //       e.preventDefault();
                              //       this.BranchNameRef.current?.focus();
                              //     } else {
                              //       e.preventDefault();
                              //     }
                              //   } else if (e.keyCode == 13) {
                              //     if (e.target.value.trim())
                              //       this.handleKeyDown(e, "branchName");
                              //     else e.preventDefault();
                              //   }
                              // }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 9 || e.keyCode === 13) {
                                  setFieldValue("branchCode", e.target.value);
                                }
                                if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "branchName");
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  this.handleKeyDown(e, "branchName");
                                }
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.branchCode}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="4">
                      <Row>
                        {" "}
                        <Col lg="3">
                          <Form.Label>
                            Branch Name<span className="text-danger">*</span>
                          </Form.Label>
                        </Col>
                        <Col md="9" className="pe-4">
                          <Form.Group>
                            <Form.Control
                              autoComplete="off"
                              type="text"
                              ref={this.BranchNameRef}
                              name="branchName"
                              id="branchName"
                              value={values.branchName}
                              onChange={handleChange}
                              className={`${
                                errorArrayBorder[1] == "Y"
                                  ? "border border-danger co_text_box"
                                  : "co_text_box"
                              }`}
                              placeholder="Branch Name"
                              onKeyDown={(e) => {
                                if (
                                  e.shiftKey ||
                                  e.keyCode == 9 ||
                                  e.keyCode == 13
                                ) {
                                  setFieldValue("branchName", e.target.value);
                                }

                                if (e.shiftKey && e.key === "Tab") {
                                  if (e.target.value.trim()) {
                                    this.setErrorBorder(1, "");
                                    // this.validateBranchDuplicate(
                                    //   values.branchName,
                                    //   values.companyId.value,
                                    //   setFieldValue
                                    // );
                                  } else {
                                    this.setErrorBorder(1, "Y");
                                  }
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  if (e.target.value.trim()) {
                                    this.setErrorBorder(1, "");
                                    this.validateBranchDuplicate(
                                      values.branchName,
                                      values.companyId.value,
                                      setFieldValue
                                    );
                                  } else {
                                    e.preventDefault();
                                  }
                                } else if (e.keyCode == 13) {
                                  if (e.target.value.trim()) {
                                    this.setErrorBorder(1, "");
                                    this.validateBranchDuplicate(
                                      values.branchName,
                                      values.companyId.value,
                                      setFieldValue
                                    );
                                  } else {
                                    e.preventDefault();
                                  }
                                }
                              }}
                              onInput={(e) => {
                                e.target.value = this.getDataCapitalised(
                                  e.target.value
                                );
                              }}

                              // style={{border:errorArray[0]=='Y'?'1px solid red':''}}
                            />
                            <span className="text-danger errormsg">
                              {errors.branchName}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg="3" className="ps-0">
                      <Row>
                        <Col lg="3">
                          {" "}
                          <Form.Label>
                            Trade<span className="text-danger">*</span>
                          </Form.Label>
                        </Col>
                        <Col lg="9" className="ps-0">
                          {" "}
                          <Form.Group
                            id="trade"
                            style={{ width: "fit-content" }}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.keyCode === 9) {
                                if (values.tradeOfBusiness) {
                                  this.setErrorBorder(2, "");
                                } else {
                                  this.setErrorBorder(2, "Y");
                                }
                              } else if (e.keyCode === 9) {
                                e.preventDefault();
                                if (values.tradeOfBusiness) {
                                  this.NOFRef.current?.focus();
                                  this.setErrorBorder(2, "");
                                } else e.preventDefault();
                              } else if (e.keyCode == 13) {
                                if (values.tradeOfBusiness) {
                                  this.handleKeyDown(e, "natureOfBusiness");
                                  this.setErrorBorder(2, "");
                                } else e.preventDefault();
                              }
                            }}
                            className={`${
                              errorArrayBorder[2] == "Y"
                                ? "border border-danger d-flex label_style"
                                : "d-flex label_style"
                            }`}
                          >
                            <Form.Check
                              // ref={this.radioRef}
                              type="radio"
                              label="Manufacturer"
                              id="Manufaturer"
                              name="tradeOfBusiness"
                              value="manufacturer"
                              checked={
                                values.tradeOfBusiness == "manufacturer"
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                            />
                            <Form.Check
                              // ref={this.radioRef}
                              type="radio"
                              label="Distributor"
                              id="distributor"
                              name="tradeOfBusiness"
                              value="distributor"
                              checked={
                                values.tradeOfBusiness == "distributor"
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                            />
                            <Form.Check
                              ref={this.RetailerRef}
                              // ref={(input) => (this.inputRefs[3] = input)}
                              type="radio"
                              label="Retailer"
                              id="Retailer"
                              name="tradeOfBusiness"
                              value="retailer"
                              checked={
                                values.tradeOfBusiness == "retailer"
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-1">
                    <Col lg="3">
                      <Row>
                        <Col lg="4" className="pe-0">
                          <Form.Label>Nature Of Business</Form.Label>
                        </Col>
                        <Col md="8" className="ps-3">
                          <Form.Group>
                            <Form.Control
                              type="text"
                              ref={this.NOFRef}
                              autoComplete="nope"
                              className="co_text_box"
                              placeholder="Nature Of Business"
                              id="natureOfBusiness"
                              name="natureOfBusiness"
                              value={values.natureOfBusiness}
                              onChange={handleChange}
                              onInput={(e) => {
                                e.target.value = this.getDataCapitalised(
                                  e.target.value
                                );
                              }}
                              // ref={(input) => (this.inputRefs[4] = input)}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.key === "Tab") {
                                } else if (e.key === "Tab") {
                                  e.preventDefault();
                                  setFieldValue(
                                    "natureOfBusiness",
                                    e.target.value.trim()
                                  );
                                  this.uploadRef.current?.focus();
                                } else if (e.keyCode == 13) {
                                  setFieldValue(
                                    "natureOfBusiness",
                                    e.target.value.trim()
                                  );
                                  this.handleKeyDown(e, "uploadImage");
                                }
                              }}
                              // onKeyDown={(e) => {
                              //   this.handleKeyDown(e, "uploadImage");
                              // }}
                            />
                            <span className="text-danger errormsg">
                              {errors.natureOfBusiness}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="3">
                      <Row>
                        <Col lg="4" className=" ">
                          <Form.Label>Upload Image</Form.Label>
                        </Col>
                        <Col lg="8" className="">
                          <Form.Group>
                            <Form.Control
                              id="uploadImage"
                              type="file"
                              ref={this.uploadRef}
                              className="password-style"
                              // ref={(input) => (this.inputRefs[5] = input)}
                              // onKeyDown={(e) => {
                              //   this.handleKeyDown(e, "registeredAddress");
                              // }}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.key === "Tab") {
                                } else if (e.key === "Tab") {
                                  e.preventDefault();
                                  this.AddressRef.current?.focus();
                                } else if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "registeredAddress");
                                }
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      {/* <h5 className="heding mb-3 justify-content-center">
                      Registered Address
                    </h5> */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          className="my-auto"
                          style={{
                            // flex: 1,
                            height: "1px",
                            backgroundColor: "  #D9D9D9",
                          }}
                        />

                        <div>
                          <p
                            style={{ textAlign: "center", marginBottom: "0" }}
                            className="px-2 heding"
                          >
                            Registered Address
                          </p>
                        </div>

                        <div
                          className="my-auto"
                          style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: " #D9D9D9",
                          }}
                        />
                      </div>
                      <Row>
                        {" "}
                        <Col lg="12">
                          {" "}
                          <Row>
                            <Col lg="2">
                              <Form.Label> Address </Form.Label>
                            </Col>
                            <Col lg="10" className="pe-4">
                              <Form.Group>
                                <Form.Control
                                  autoComplete="off"
                                  ref={this.AddressRef}
                                  className="co_text_box"
                                  placeholder="Address"
                                  type="text"
                                  name="registeredAddress"
                                  id="registeredAddress"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "registeredAddress",
                                      e.target.value
                                    );
                                    setFieldValue(
                                      "corporateAddress",

                                      values.sameAsAddress === true
                                        ? e.target.value
                                        : ""
                                    );
                                  }}
                                  onInput={(e) => {
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  }}
                                  value={values.registeredAddress}
                                  // ref={(input) => (this.inputRefs[6] = input)}
                                  // onKeyDown={(e) => {
                                  //   this.handleKeyDown(e, "pincode");
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (e.key === "Tab") {
                                      e.preventDefault();
                                      setFieldValue(
                                        "registeredAddress",
                                        e.target.value.trim()
                                      );
                                      setFieldValue(
                                        "corporateAddress",

                                        values.sameAsAddress === true
                                          ? e.target.value.trim()
                                          : ""
                                      );
                                      this.pincodeRef.current?.focus();
                                    } else if (e.keyCode == 13) {
                                      setFieldValue(
                                        "registeredAddress",
                                        e.target.value.trim()
                                      );
                                      setFieldValue(
                                        "corporateAddress",

                                        values.sameAsAddress === true
                                          ? e.target.value.trim()
                                          : ""
                                      );
                                      this.handleKeyDown(e, "pincode");
                                    }
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.registeredAddress}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg="4" md={4} sm={4} xs={4}>
                              <Row>
                                <Col
                                  lg="6"
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  // className="pt-1"
                                >
                                  <Form.Label>
                                    Pincode{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                </Col>
                                <Col lg="6" md={6} sm={6} xs={6}>
                                  <Form.Group>
                                    <Form.Control
                                      autoComplete="off"
                                      // onKeyDown={(e) => {
                                      //   if (e.key === "Tab" && !e.target.value)
                                      //     e.preventDefault();
                                      // }}
                                      className={`${
                                        errorArrayBorder[3] == "Y"
                                          ? "border border-danger co_text_box"
                                          : "co_text_box"
                                      }`}
                                      placeholder="Pincode"
                                      type="text"
                                      id="pincode"
                                      name="pincode"
                                      ref={this.pincodeRef}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "pincode",
                                          e.target.value
                                        );
                                        if (values.sameAsAddress == true) {
                                          setFieldValue(
                                            "corporatePincode",
                                            e.target.value
                                          );

                                          // setFieldValue(
                                          //   "corporateareaId",
                                          //   getSelectValue(
                                          //     areaOpt,
                                          //     values.areaId.value
                                          //   )
                                          // );
                                        }
                                      }}
                                      // onBlur={(e) => {
                                      //   e.preventDefault();
                                      //   if (e.target.value) {
                                      //     this.setErrorBorder(3, "");
                                      //     this.getPincodeData(
                                      //       e.target.value,
                                      //       setFieldValue
                                      //     );
                                      //     this.validatePincode(
                                      //       e.target.value,
                                      //       setFieldValue
                                      //     );
                                      //   } else {
                                      //     this.setErrorBorder(3, "Y");
                                      //     // onchangeerrorArray.splice(3, 0, "Y");
                                      //     document
                                      //       .getElementById("pincode")
                                      //       .focus();
                                      //   }
                                      // }}
                                      value={values.pincode}
                                      maxLength={6}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      // ref={(input) => (this.inputRefs[7] = input)}
                                      // onKeyDown={(e) => { this.handleKeyDown(e, 1) }}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                          if (e.target.value) {
                                            this.setErrorBorder(3, "");
                                          } else {
                                            this.setErrorBorder(3, "Y");
                                          }
                                        } else if (e.keyCode == 9) {
                                          e.preventDefault();
                                          if (e.target.value) {
                                            this.setErrorBorder(3, "");
                                            this.getPincodeData(
                                              e.target.value,
                                              setFieldValue
                                            );
                                            this.validatePincode(
                                              e.target.value,
                                              false
                                            );
                                          } else {
                                            e.preventDefault();
                                          }
                                        }
                                        {
                                          if (e.keyCode === 13) {
                                            if (e.target.value) {
                                              this.setErrorBorder(3, "");
                                              this.validatePincode(
                                                e.target.value,
                                                false
                                              );
                                              this.getPincodeData(
                                                e.target.value,
                                                setFieldValue
                                              );
                                              this.regAreaRef.current?.focus();
                                            } else {
                                              e.preventDefault();
                                            }
                                          }
                                        }
                                      }}
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.pincode}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg="5" md={5} sm={5} xs={5}>
                              <Row>
                                <Col lg={4}>
                                  {" "}
                                  <Form.Label>Area</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Form.Group>
                                    <Select
                                      id="areaId"
                                      ref={this.regAreaRef}
                                      className="selectTo"
                                      placeholder="Area"
                                      styles={companystyle}
                                      name="areaId"
                                      options={areaOpt}
                                      onChange={(v) => {
                                        if (v != null) {
                                          setFieldValue("areaId", v);
                                          if (values.sameAsAddress == true) {
                                            setFieldValue("corporateareaId", v);
                                          }
                                        } else {
                                          setFieldValue("areaId", "");
                                        }
                                      }}
                                      value={values.areaId}
                                      invalid={errors.areaId ? true : false}
                                      // ref={(input) => (this.inputRefs[8] = input)}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          this.regCountryRef.current?.focus();
                                        }
                                      }}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>

                            {/* {values.areaId != "" ? ( */}

                            <Col lg="3" md={3} sm={3} xs={3} className="p-0">
                              <Row>
                                <Col lg={2}>
                                  {" "}
                                  <Form.Label>City</Form.Label>
                                </Col>
                                <Col lg="10">
                                  <Form.Control
                                    autoComplete="nope"
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={values.city}
                                    readOnly
                                    tabIndex="-1"
                                    className="p-1 pin_style"
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg="4" className="">
                              <Row>
                                <Col lg="6">
                                  <Form.Label className="">State</Form.Label>
                                </Col>
                                <Col lg="6" className="ps-0">
                                  <Form.Control
                                    autoComplete="nope"
                                    type="text"
                                    id="stateName"
                                    name="stateName"
                                    value={values.stateName}
                                    readOnly
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      width: "max-content",
                                    }}
                                    tabIndex="-1"
                                    className="pe-1 pin_style"
                                  />

                                  <Form.Control
                                    type="text"
                                    id="stateCode"
                                    name="stateCode"
                                    value={values.stateCode}
                                    className="d-none"
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg="5">
                              <Row>
                                <Col lg={4} className="ps-3">
                                  <Form.Label>Country</Form.Label>
                                </Col>

                                <Col lg={8}>
                                  <Form.Group className="">
                                    {/* <Form.Control
                                          type="text"
                                          id="countryId"
                                          name="countryId"
                                          placeholder="India"
                                          readOnly
                                          tabIndex="-1"
                                          className="p-1 pin_style"
                                          options={countryOpt}
                                          value={values.countryId}
                                          invalid={errors.countryId ? true : false}
                                        />
                                        <span className="text-danger">
                                          {errors.countryId}
                                        </span> */}
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      id="countryId"
                                      name="countryId"
                                      styles={companystyle}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                      ref={this.regCountryRef}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13)
                                          this.handleKeyDown(
                                            e,
                                            "sameAsAddress"
                                          );
                                      }}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                  {/* </Col>
                                  </Row> */}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          {/* ) : (
                              ""
                            )} */}
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="6" className="ps-0">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          className="my-auto"
                          style={{
                            // flex: 1,
                            height: "1px",
                            backgroundColor: "  #D9D9D9",
                          }}
                        />
                        {/* {JSON.stringify(values.sameAsAddress)} */}
                        <div className="d-flex">
                          <p
                            style={{ textAlign: "center", marginBottom: "0" }}
                            className="px-2 heding"
                          >
                            Corporate Address{" "}
                          </p>
                          <Form.Check
                            label="Same as address"
                            className="checkbox-label"
                            name="sameAsAddress"
                            id="sameAsAddress"
                            ref={this.sameAddRef}
                            // checked={
                            //   this.state.checkAddress === true ? true : false
                            // }
                            onChange={(e) => {
                              // console.log("vv---", values);
                              setFieldValue(
                                "sameAsAddress",
                                !values.sameAsAddress
                              );
                              if (!values.sameAsAddress === true) {
                                setFieldValue(
                                  "corporateAddress",
                                  values.registeredAddress
                                );
                                // this.getCorporatePincodeData(
                                //   values.pincode,
                                //   setFieldValue
                                // );

                                setFieldValue(
                                  "corporatePincode",
                                  values.pincode
                                );
                                setFieldValue("corporatecity", values.city);
                                setFieldValue(
                                  "corporatestateName",
                                  values.stateName
                                );
                                setFieldValue(
                                  "corporatestateCode",
                                  values.stateCode
                                );
                                setFieldValue(
                                  "sameAsAddress",
                                  e.target.checked
                                );
                                setFieldValue(
                                  "corporateareaId",
                                  getSelectValue(areaOpt, values.areaId.value)
                                );
                                // console.log(
                                //   "values.areaId.label",
                                //   values.areaId.value
                                // );
                              } else {
                                setFieldValue("corporateAddress", "");
                                setFieldValue("corporatePincode", "");
                                setFieldValue("corporatecity", "");
                                setFieldValue("corporatestateName", "");
                                setFieldValue("corporatestateCode");
                                setFieldValue("corporateareaId", "");

                                // setFieldValue(
                                //   "sameAsAddress",
                                //   e.target.checked
                                // );
                                // setFieldValue(
                                //   "corporateareaId",
                                //   getSelectValue(areaOpt, "")
                                // );
                              }
                            }}
                            // onInput={(e) => {
                            //   e.target.value = this.getDataCapitalised(
                            //     e.target.value
                            //   );
                            // }}
                            value={values.sameAsAddress}
                            // ref={(input) => (this.inputRefs[10] = input)}
                            // onKeyDown={(e) => {
                            //   this.handleKeyDown(e, "corporateAddress");
                            // }}
                            onKeyDown={(e) => {
                              // this.handleKeyDown(e, "licenseNo");
                              if (e.shiftKey && e.keyCode == 9) {
                              } else if (e.keyCode == 13) {
                                if (values.sameAsAddress == true)
                                  this.handleKeyDown(e, "licenseNo");
                                if (values.sameAsAddress == false)
                                  this.handleKeyDown(e, "corporateAddress");
                              } else if (e.keyCode == 9) {
                                e.preventDefault();
                                if (values.sameAsAddress == true)
                                  this.handleKeyDown(e, "licenseNo");
                                if (values.sameAsAddress == false)
                                  this.handleKeyDown(e, "corporateAddress");
                              }
                            }}
                            // onKeyDown = {(e)=>{
                            //   if(this.state.checkAddress == true){
                            //     if(e.shiftKey && e.key === "tab"){

                            //     }
                            //     else if(e.key === "tab"){
                            //     this.licensRef.current?.focus();
                            //     }
                            //     else{
                            //       this.handleKeyDown(e, "licenseNo");
                            //     }
                            //   }
                            //   else{
                            //     if(e.shiftKey && e.key === "tab"){

                            //     }
                            //     else if(e.key === "tab"){
                            //     this.AddressRef1.current?.focus();
                            //     }
                            //     this.handleKeyDown(e, "corporateAddress");
                            //   }

                            // }}
                          />
                        </div>

                        <div
                          className="my-auto"
                          style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: " #D9D9D9",
                          }}
                        />
                      </div>
                      <Row>
                        {" "}
                        <Col lg="12">
                          {" "}
                          <Row>
                            <Col lg="2">
                              <Form.Label> Address</Form.Label>
                            </Col>
                            <Col lg="10">
                              <Form.Group>
                                <Form.Control
                                  autoComplete="nope"
                                  type="text"
                                  ref={this.AddressRef1}
                                  className="co_text_box"
                                  placeholder="Address"
                                  name="corporateAddress"
                                  id="corporateAddress"
                                  onChange={handleChange}
                                  value={values.corporateAddress}
                                  // ref={(input) => (this.inputRefs[11] = input)}
                                  onKeyDown={(e) => {
                                    // this.handleKeyDown(e, "corporatePincode");
                                    if (
                                      (e.shiftKey && e.keyCode == 9) ||
                                      e.keyCode == 9 ||
                                      e.keyCode == 13
                                    ) {
                                      setFieldValue(
                                        "corporateAddress",
                                        e.target.value
                                      );
                                    }
                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 13) {
                                      this.handleKeyDown(e, "corporatePincode");
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      this.handleKeyDown(e, "corporatePincode");
                                    }
                                  }}
                                  disabled={
                                    values.sameAsAddress === true ? true : false
                                  }
                                />
                                <span className="text-danger errormsg">
                                  {errors.corporateAddress}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mt-2 d-flex">
                            <Col lg="4" md="4" sm="4" xs="4">
                              <Row>
                                <Col
                                  lg="6"
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  // className="pt-1"
                                >
                                  <Form.Label>Pincode</Form.Label>
                                </Col>
                                <Col lg="6" md={6} sm={6} xs={6}>
                                  <Form.Group>
                                    <Form.Control
                                      autoComplete="nope"
                                      type="text"
                                      className="co_text_box"
                                      placeholder="Pincode"
                                      id="corporatePincode"
                                      name="corporatePincode"
                                      value={values.corporatePincode}
                                      onChange={handleChange}
                                      maxLength={6}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      disabled={
                                        values.sameAsAddress === true
                                          ? true
                                          : false
                                      }
                                      onBlur={(e) => {
                                        e.preventDefault();
                                        this.getCorporatePincodeData(
                                          e.target.value,
                                          setFieldValue
                                        );
                                        if (e.target.value != "") {
                                          this.validatePincodeCorp(
                                            e.target.value,
                                            setFieldValue
                                          );
                                        } else {
                                          document
                                            .getElementById("corporatePincode")
                                            .focus();
                                        }
                                      }}
                                      // ref={(input) => (this.inputRefs[12] = input)}
                                      // onKeyDown={(e) => {
                                      //   if (e.keyCode === 13) {
                                      //     this.corpAreaRef.current?.focus();
                                      //   }
                                      // }}
                                      onKeyDown={(e) => {
                                        if (values.sameAsAddress == true)
                                          if (e.shiftKey && e.key === 9) {
                                          } else if (e.key === 9) {
                                            e.preventDefault();
                                            if (e.target.value != "") {
                                              this.validatePincode(
                                                e.target.value,
                                                true
                                              );
                                              this.getCorporatePincodeData(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            } else {
                                              this.corpAreaRef.current?.focus();
                                            }
                                          } else if (e.keyCode == 13) {
                                            if (e.target.value.trim() != "") {
                                              this.validatePincode(
                                                e.target.value,
                                                true
                                              );
                                              this.getCorporatePincodeData(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            } else {
                                              this.corpAreaRef.current?.focus();
                                            }
                                          } else if (e.keyCode == 13) {
                                            this.corpAreaRef.current?.focus();
                                          }
                                      }}
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.corporatePincode}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg="5" md="5" sm="5" xs="5">
                              <Row>
                                <Col lg={4}>
                                  {" "}
                                  <Form.Label>Area</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Form.Group>
                                    <Select
                                      // ref={this.selectRef}
                                      id="areaId"
                                      className="selectTo"
                                      placeholder="Area"
                                      styles={companystyle}
                                      name="corporateareaId"
                                      isDisabled={
                                        values.sameAsAddress === true
                                          ? true
                                          : false
                                      }
                                      onChange={(v) => {
                                        if (v != null) {
                                          setFieldValue("corporateareaId", v);
                                        } else {
                                          setFieldValue("corporateareaId", "");
                                        }
                                      }}
                                      options={corporateareaOpt}
                                      value={values.corporateareaId}
                                      invalid={
                                        errors.corporateareaId ? true : false
                                      }
                                      // ref={(input) => (this.inputRefs[13] = input)}
                                      ref={this.corpAreaRef}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          this.corpCountryRef.current?.focus();
                                        }
                                      }}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>

                            {/* {JSON.stringify(values.corporateareaId)} */}

                            {/* {values.corporateareaId != "" ? ( */}

                            <Col lg="3" md={3} sm={3} xs={3} className="p-0">
                              <Row>
                                <Col lg={2}>
                                  {" "}
                                  <Form.Label>City</Form.Label>
                                </Col>
                                <Col lg="10">
                                  <Form.Control
                                    autoComplete="nope"
                                    type="text"
                                    id="corporatecity"
                                    name="corporatecity"
                                    value={values.corporatecity}
                                    readOnly
                                    tabIndex="-1"
                                    className="p-1 pin_style"
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg="4" md="4" sm="4" xs="4">
                              <Row>
                                <Col lg="6">
                                  <Form.Label className="">State</Form.Label>
                                </Col>
                                <Col lg="6" className="ps-0">
                                  <Form.Control
                                    autoComplete="nope"
                                    type="text"
                                    id="corporatestateName"
                                    name="corporatestateName"
                                    value={values.corporatestateName}
                                    readOnly
                                    tabIndex="-1"
                                    className="pin_style"
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      width: "max-content",
                                    }}
                                  />

                                  <Form.Control
                                    type="text"
                                    id="corporatestateCode"
                                    name="corporatestateCode"
                                    value={values.corporatestateCode}
                                    className="d-none"
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col lg="5">
                              <Row>
                                <Col lg={4} className="">
                                  <Form.Label>Country</Form.Label>
                                </Col>

                                <Col lg={8}>
                                  <Form.Group className="" id="countryId">
                                    {/* <Form.Control
                                          type="text"
                                          id="countryId"
                                          name="countryId"
                                          placeholder="India"
                                          readOnly
                                          tabIndex="-1"
                                          className="p-1 pin_style"
                                          options={countryOpt}
                                          value={values.countryId}
                                          invalid={errors.countryId ? true : false}
                                        />
                                        <span className="text-danger">
                                          {errors.countryId}
                                        </span> */}
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      styles={companystyle}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                      // ref={(input) => (this.inputRefs[14] = input)}
                                      ref={this.corpCountryRef}
                                      onKeyDown={(e) => {
                                        this.handleKeyDown(e, "licenseNo");
                                      }}
                                      isDisabled={
                                        values.sameAsAddress === true
                                          ? true
                                          : false
                                      }
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                  {/* </Col>
                                  </Row> */}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          {/* ) : (
                              ""
                            )} */}
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    {/* <h5 className="heding justify-content-center">
                    Company Information
                  </h5> */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        className="my-auto"
                        style={{
                          // flex: 1,
                          height: "1px",
                          backgroundColor: " #D9D9D9",
                        }}
                      />

                      <div>
                        <p
                          style={{ textAlign: "center", marginBottom: "0" }}
                          className="px-2 heding"
                        >
                          License Information
                        </p>
                      </div>

                      <div
                        className="my-auto"
                        style={{
                          flex: 1,
                          height: "1px",
                          backgroundColor: " #D9D9D9",
                        }}
                      />
                    </div>
                    <Row>
                      <Col lg="2">
                        <Row>
                          <Col lg="6" className="pe-0">
                            <Form.Label>License No.</Form.Label>
                          </Col>
                          <Col lg="6" className="">
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                className="co_text_box ps-1 pe-1"
                                placeholder="License No."
                                type="text"
                                id="licenseNo"
                                name="licenseNo"
                                // ref={this.licensRef}
                                onChange={handleChange}
                                value={values.licenseNo}
                                // ref={(input) => (this.inputRefs[15] = input)}
                                onKeyDown={(e) => {
                                  this.handleKeyDown(e, "licenseExpiryDate");
                                }}
                              />
                              <span className="text-danger errormsg">
                                {errors.licenseNo}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="2">
                        <Row>
                          <Col lg="6" className="pe-0">
                            <Form.Label>Expiry Date</Form.Label>
                          </Col>
                          <Col lg="6">
                            <MyTextDatePicker
                              className="co_date"
                              placeholder="DD/MM/YYYY"
                              name="licenseExpiryDate"
                              id="licenseExpiryDate"
                              value={values.licenseExpiryDate}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.keyCode == 18) {
                                  e.preventDefault();
                                }
                                // @vinit@Number of Expiry Days PopUp from Currentdate
                                if (e.key === "Enter" || e.key === "Tab") {
                                  if (
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid() == true
                                  ) {
                                    let currentDate = moment(
                                      dt,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    let expiryDate = moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    let daysDifference =
                                      (expiryDate.getTime() -
                                        currentDate.getTime()) /
                                      86400000;
                                    if (
                                      currentDate.getTime() <=
                                        expiryDate.getTime() &&
                                      daysDifference <= 90
                                    ) {
                                      // alert("Hello")
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: ` Expiry of Your Lisence in ${daysDifference} Days`,
                                        is_timeout: false,
                                        is_button_show: true,
                                        // delay: 2000,
                                      });
                                    }
                                  }
                                }

                                if (e.shiftKey && e.key === "Tab") {
                                  // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      let cDate = moment(
                                        dt,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      let expDate = moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      console.log(cDate <= expDate);
                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        console.log(e.target.value);
                                        setFieldValue(
                                          "licenseExpiryDate",
                                          e.target.value
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg:
                                            "Expiry Date should be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        // setFieldValue("licenseExpiryDate", "");
                                        setTimeout(() => {
                                          document
                                            .getElementById("licenseExpiryDate")
                                            .focus();
                                        }, 1300);
                                      }
                                    }
                                  }

                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("licenseExpiryDate")
                                        .focus();
                                    }, 1000);
                                  }
                                } else if (
                                  e.key === "Tab" ||
                                  e.key === "Enter"
                                ) {
                                  // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      let cDate = moment(
                                        dt,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      let expDate = moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      console.log(cDate <= expDate);
                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        console.log(e.target.value);
                                        setFieldValue(
                                          "licenseExpiryDate",
                                          e.target.value
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg:
                                            "Expiry Date should be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        // setFieldValue("licenseExpiryDate", "");
                                        setTimeout(() => {
                                          document
                                            .getElementById("licenseExpiryDate")
                                            .focus();
                                        }, 1300);
                                      }
                                    }
                                  }
                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1000,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("licenseExpiryDate")
                                        .focus();
                                    }, 1300);
                                  } else {
                                    this.handleKeyDown(e, "foodLicenseNo");
                                  }
                                } else {
                                  this.handleKeyDown(e, "foodLicenseNo");
                                }
                              }}
                              // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                              // onBlur={(e) => { }}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="2">
                        <Row>
                          <Col lg="4" className="pe-0 ps-1">
                            <Form.Label>FSSAI No.</Form.Label>
                          </Col>
                          <Col lg="8">
                            <Form.Group>
                              <Form.Control
                                autoComplete="nope"
                                type="text"
                                className="co_text_box"
                                placeholder="FSSAI No."
                                id="foodLicenseNo"
                                name="foodLicenseNo"
                                value={values.foodLicenseNo}
                                onChange={handleChange}
                                // ref={(input) => (this.inputRefs[17] = input)}
                                onKeyDown={(e) => {
                                  this.handleKeyDown(
                                    e,
                                    "foodLicenseExpiryDate"
                                  );
                                }}
                              />
                              <span className="text-danger errormsg">
                                {errors.foodLicenseNo}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="2">
                        <Row>
                          <Col lg="6">
                            <Form.Label>Expiry Date</Form.Label>
                          </Col>
                          <Col lg="6">
                            <MyTextDatePicker
                              className="co_date"
                              placeholder="DD/MM/YYYY"
                              dateFormat="DD/MM/YYYY"
                              name="foodLicenseExpiryDate"
                              id="foodLicenseExpiryDate"
                              value={values.foodLicenseExpiryDate}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.keyCode == 18) {
                                  e.preventDefault();
                                }

                                // @vinit@Number of Expiry Days PopUp from Currentdate
                                if (e.key === "Enter" || e.key === "Tab") {
                                  if (
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid() == true
                                  ) {
                                    let currentDate = moment(
                                      dt,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    let expiryDate = moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    let daysDifference =
                                      (expiryDate.getTime() -
                                        currentDate.getTime()) /
                                      86400000;
                                    if (
                                      currentDate.getTime() <=
                                        expiryDate.getTime() &&
                                      daysDifference <= 90
                                    ) {
                                      // alert("Hello")
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: ` Expiry of Your Lisence in ${daysDifference} Days`,
                                        is_timeout: false,
                                        is_button_show: true,
                                        // delay: 2000,
                                      });
                                    }
                                  }
                                }

                                if (e.shiftKey && e.key === "Tab") {
                                  // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      let cDate = moment(
                                        dt,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      let expDate = moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      console.log(cDate <= expDate);
                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        console.log(e.target.value);
                                        setFieldValue(
                                          "foodLicenseExpiryDate",
                                          e.target.value
                                        );
                                      } else {
                                        console.log(
                                          "date is less than current date"
                                        );
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg:
                                            "Expiry Date should be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById(
                                              "foodLicenseExpiryDate"
                                            )
                                            .focus();
                                        }, 1300);
                                      }
                                    }
                                  }

                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1000,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("foodLicenseExpiryDate")
                                        .focus();
                                    }, 1300);
                                  }
                                } else if (
                                  e.key === "Tab" ||
                                  e.key === "Enter"
                                ) {
                                  // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      let cDate = moment(
                                        dt,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      let expDate = moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      console.log(cDate <= expDate);
                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        console.log(e.target.value);
                                        setFieldValue(
                                          "foodLicenseExpiryDate",
                                          e.target.value
                                        );
                                      } else {
                                        console.log(
                                          "date is less than current date"
                                        );
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg:
                                            "Expiry Date should be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById(
                                              "foodLicenseExpiryDate"
                                            )
                                            .focus();
                                        }, 1300);
                                      }
                                    }
                                  }

                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1000,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("foodLicenseExpiryDate")
                                        .focus();
                                    }, 1300);
                                  } else {
                                    this.handleKeyDown(
                                      e,
                                      "manufacturingLicenseNo"
                                    );
                                  }
                                } else {
                                  this.handleKeyDown(
                                    e,
                                    "manufacturingLicenseNo"
                                  );
                                }
                              }}
                              // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                              // onBlur={(e) => {}}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="4">
                        <Row>
                          <Col lg="3" className="p-0 ">
                            <Form.Label>MFG License No.</Form.Label>
                          </Col>
                          <Col lg="4">
                            <Form.Group>
                              <Form.Control
                                autoComplete="nope"
                                className="co_text_box"
                                placeholder="MFG License No."
                                id="manufacturingLicenseNo"
                                name="manufacturingLicenseNo"
                                type="text"
                                onChange={handleChange}
                                value={values.manufacturingLicenseNo}
                                // ref={(input) => (this.inputRefs[19] = input)}
                                onKeyDown={(e) => {
                                  this.handleKeyDown(
                                    e,
                                    "manufacturingLicenseExpiry"
                                  );
                                }}
                              />
                            </Form.Group>
                          </Col>
                          {/* </Row>
                      </Col>

                      <Col lg="2">
                        <Row> */}
                          <Col lg="2" className="p-0">
                            <Form.Label>Expiry Date</Form.Label>
                          </Col>
                          <Col lg="3">
                            <MyTextDatePicker
                              className="co_date"
                              name="manufacturingLicenseExpiry"
                              id="manufacturingLicenseExpiry"
                              placeholder="DD/MM/YYYY"
                              dateFormat="DD/MM/YYYY"
                              value={values.manufacturingLicenseExpiry}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.keyCode == 18) {
                                  e.preventDefault();
                                }

                                // @vinit@Number of Expiry Days PopUp from Currentdate
                                if (e.key === "Enter" || e.key === "Tab") {
                                  if (
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid() == true
                                  ) {
                                    let currentDate = moment(
                                      dt,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    let expiryDate = moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    let daysDifference =
                                      (expiryDate.getTime() -
                                        currentDate.getTime()) /
                                      86400000;
                                    if (
                                      currentDate.getTime() <=
                                        expiryDate.getTime() &&
                                      daysDifference <= 90
                                    ) {
                                      // alert("Hello")
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: ` Expiry of Your Lisence in ${daysDifference} Days`,
                                        is_timeout: false,
                                        is_button_show: true,
                                        // delay: 2000,
                                      });
                                    }
                                  }
                                }

                                // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                if (e.shiftKey && e.key === "Tab") {
                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById(
                                          "manufacturingLicenseExpiry"
                                        )
                                        .focus();
                                    }, 1000);
                                  }
                                } else if (
                                  e.key === "Tab" ||
                                  e.key === "Enter"
                                ) {
                                  // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      let cDate = moment(
                                        dt,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      let expDate = moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).toDate();
                                      console.log(cDate <= expDate);
                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        console.log(e.target.value);
                                        setFieldValue(
                                          "manufacturingLicenseExpiry",
                                          e.target.value
                                        );
                                      } else {
                                        console.log(
                                          "date is less than current date"
                                        );
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg:
                                            "Expiry Date should be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById(
                                              "manufacturingLicenseExpiry"
                                            )
                                            .focus();
                                        }, 1300);
                                      }
                                    }
                                  }

                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1000,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById(
                                          "manufacturingLicenseExpiry"
                                        )
                                        .focus();
                                    }, 1300);
                                  } else {
                                    this.handleKeyDown(e, "website");
                                  }
                                } else {
                                  this.handleKeyDown(e, "website");
                                }
                              }}
                              // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                              // onBlur={(e) => {}}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Row>

                  <Row>
                    {/* <h5 className="heding justify-content-center">Other</h5> */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        className="my-auto"
                        style={{
                          // flex: 1,
                          height: "1px",
                          backgroundColor: " #D9D9D9",
                        }}
                      />

                      <div>
                        <p
                          style={{ textAlign: "center", marginBottom: "0" }}
                          className="px-2 heding"
                        >
                          Other
                        </p>
                      </div>

                      <div
                        className="my-auto"
                        style={{
                          flex: 1,
                          height: "1px",
                          backgroundColor: " #D9D9D9",
                        }}
                      />
                    </div>
                    <Row>
                      <Col lg="3">
                        <Row>
                          <Col lg="4">
                            <Form.Label>Website</Form.Label>
                          </Col>
                          <Col lg="8">
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                className="co_text_box"
                                placeholder="Website"
                                type="text"
                                onChange={handleChange}
                                name="website"
                                id="website"
                                value={values.website}
                                // ref={(input) => (this.inputRefs[21] = input)}
                                onKeyDown={(e) => {
                                  this.handleKeyDown(e, "email");
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="3">
                        <Row>
                          <Col lg="3">
                            <Form.Label>E-mail</Form.Label>
                          </Col>
                          <Col lg="9">
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                className="co_text_box"
                                placeholder="E-mail"
                                type="text"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 18) {
                                    e.preventDefault();
                                  }

                                  if (e.shiftKey && e.key === "Tab") {
                                    let email_val = e.target.value.trim();
                                    console.log(
                                      "EMAILREGEXP.test(email_val)",
                                      EMAILREGEXP.test(email_val)
                                    );
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
                                    e.key === "Enter"
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
                                    } else if (e.keyCode === 13) {
                                      this.handleKeyDown(e, "mobileNumber");
                                    }
                                  }
                                }}
                                onBlur={(e) => {
                                  e.preventDefault();
                                }}
                                value={values.email}
                              />
                              <span className="text-danger errormsg">
                                {errors.email}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="2">
                        <Row>
                          <Col lg="6">
                            <Form.Label>Mobile No.</Form.Label>
                          </Col>
                          <Col lg="6">
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                className="co_text_box ps-1 pe-1"
                                placeholder="Mobile No."
                                id="mobileNumber"
                                name="mobileNumber"
                                type="text"
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                onChange={(e) => {
                                  let mob = e.target.value;
                                  setFieldValue("mobileNumber", mob);
                                  setFieldValue("whatsappNumber", mob);
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
                                    e.key === "Enter"
                                  ) {
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
                                        msg: "Please Enter 10 Digit Number. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("mobileNumber")
                                          .focus();
                                      }, 1000);
                                    } else if (e.keyCode === 13) {
                                      this.handleKeyDown(e, "whatsappNumber");
                                    }
                                  }
                                }}
                                onBlur={(e) => {}}
                                value={values.mobileNumber}
                                maxLength={10}
                              />
                              <span className="text-danger errormsg">
                                {errors.mobileNumber}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="4">
                        <Row>
                          <Col lg="3" className="p-0">
                            <Form.Label>Whatsapp No.</Form.Label>
                          </Col>
                          <Col lg="4" className="ps-3">
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                className="co_text_box"
                                placeholder="Whatsapp No."
                                name="whatsappNumber"
                                id="whatsappNumber"
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
                                        msg: "Please Enter 10 Digit Number. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("whatsappNumber")
                                          .focus();
                                      }, 1000);
                                    }
                                  } else if (
                                    e.key === "Tab" ||
                                    e.key === "Enter"
                                  ) {
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
                                        msg: "Please Enter 10 Digit Number. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("mobileNumber")
                                          .focus();
                                      }, 1000);
                                    } else if (e.keyCode === 13) {
                                      this.currencyRef.current?.focus();
                                    }
                                  }
                                }}
                                onBlur={(e) => {}}
                                value={values.whatsappNumber}
                                maxLength={10}
                              />
                              <span className="text-danger errormsg">
                                {errors.whatsappNumber}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col lg="2" className="p-0">
                            <Form.Label>Currency</Form.Label>
                          </Col>
                          <Col lg="3">
                            <Form.Group>
                              <Select
                                className="selectTo"
                                placeholder="Currency"
                                closeMenuOnSelect={true}
                                components={{ ClearIndicator }}
                                onChange={(v) => {
                                  setFieldValue("currency", v);
                                }}
                                name="currency"
                                id="currency"
                                value={values.currency}
                                options={Currencyopt}
                                styles={companystyle}
                                // ref={(input) => (this.inputRefs[25] = input)}
                                ref={this.currencyRef}
                                onKeyDown={(e) => {
                                  console.log(
                                    "values.gstApplicable------>",
                                    values.gstApplicable
                                  );
                                  if (values.gstApplicable == false) {
                                    this.handleKeyDown(e, "gstApplicable");
                                  } else if (
                                    values.gstApplicable == true &&
                                    values.gstIn == ""
                                  ) {
                                    this.handleKeyDown(e, "gstApplicable");
                                  } else {
                                    this.handleKeyDown(e, "gstIn");
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Row>
                  <Row className="mt-1">
                    {values.gstIn != "" && GSTINREX.test(values.gstIn) ? (
                      <>
                        <Col lg="3" className="GST_col_width">
                          <Row className="mt-2">
                            <Col lg="8">
                              <Form.Label className="">
                                GST Applicable
                              </Form.Label>
                            </Col>
                            <Col lg="4" className="mt-1">
                              <Form.Check
                                disabled
                                label={
                                  values.gstApplicable == true ? "Yes" : "No"
                                }
                                type="switch"
                                // className="gst-checkbox"
                                id="gstApplicable"
                                name="gstApplicable"
                                // checked={
                                //   values.gstApplicable == true ? true : false
                                // }
                                onChange={(e) => {
                                  console.log(
                                    "Is Checked:--->",
                                    e.target.checked
                                  );
                                  this.gstFieldshow(e.target.checked);
                                  setFieldValue(
                                    "gstApplicable",
                                    e.target.checked
                                  );
                                }}
                                value={values.gstApplicable}
                                className="ms-auto my-auto"
                                // innerRef={(input) => (this.inputRefs[26] = input)}
                                onKeyDown={(e) => {
                                  if (values.gstApplicable == true) {
                                    this.handleKeyDown(e, "gstIn");
                                  } else {
                                    this.handleKeyDown(e, "multiBranch");
                                  }
                                }}
                              />

                              <span className="text-danger errormsg">
                                {errors.multiBranch}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col lg="3" className="GST_col_width">
                          <Row className="mt-2">
                            <Col lg="8">
                              <Form.Label className="">
                                GST Applicable
                              </Form.Label>
                            </Col>
                            <Col lg="4" className="mt-1">
                              <Form.Check
                                label={
                                  values.gstApplicable == true ? "Yes" : "No"
                                }
                                type="switch"
                                // className="gst-checkbox"
                                id="gstApplicable"
                                name="gstApplicable"
                                // checked={
                                //   values.gstApplicable == true ? true : false
                                // }
                                onChange={(e) => {
                                  console.log(
                                    "Is Checked:--->",
                                    e.target.checked
                                  );
                                  this.gstFieldshow(e.target.checked);
                                  setFieldValue(
                                    "gstApplicable",
                                    e.target.checked
                                  );
                                }}
                                value={values.gstApplicable}
                                className="ms-auto my-auto"
                                onKeyDown={(e) => {
                                  if (values.gstApplicable == true) {
                                    this.handleKeyDown(e, "gstIn");
                                  } else {
                                    this.handleKeyDown(e, "multiBranch");
                                  }
                                }}
                              />

                              <span className="text-danger errormsg">
                                {errors.multiBranch}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    )}
                    {values.gstApplicable == true ? (
                      <Col lg="6" className="mt-2 gst_true">
                        <Row>
                          <Col lg="1">
                            <Form.Label>
                              GSTIN<span className="text-danger">*</span>
                            </Form.Label>
                          </Col>

                          <Col lg="3">
                            <Form.Group>
                              <Form.Control
                                autoComplete="nope"
                                className={`${
                                  errorArrayBorder[4] == "Y"
                                    ? "border border-danger co_text_box"
                                    : "co_text_box"
                                }`}
                                placeholder="GSTIN"
                                name="gstIn"
                                id="gstIn"
                                // onChange={handleChange}
                                onChange={(e) => {
                                  let data = e.target.value;
                                  let gstStateCode = data.substring(0, 1);
                                  if (data.length < 2) {
                                    setFieldValue("gstIn", stateCodeData);
                                  } else {
                                    if (gstStateCode == stateCodeData) {
                                      console.log("gstStateCode", gstStateCode);
                                      setFieldValue("gstIn", data);
                                    } else {
                                      document.getElementById("gstIn").focus();
                                      setFieldValue("gstIn", data);
                                    }
                                  }
                                }}
                                maxLength={15}
                                value={
                                  values.gstIn && values.gstIn.toUpperCase()
                                }
                                // onBlur={(e) => {
                                //   e.preventDefault();
                                //   if (values.gstIn != "") {
                                //     if (GSTINREX.test(values.gstIn)) {
                                //       return values.gstIn;
                                //     } else {
                                //       MyNotifications.fire({
                                //         show: true,
                                //         icon: "error",
                                //         title: "Error",
                                //         msg: "GSTIN is not Valid!",
                                //         is_button_show: false,
                                //       });
                                //     }
                                //   }
                                //   if (e.target.value) {
                                //     this.setErrorBorder(4, "");
                                //   } else {
                                //     this.setErrorBorder(4, "Y");
                                //     document.getElementById("gstIn").focus();
                                //   }
                                // }}

                                onKeyDown={(e) => {
                                  let data = e.target.value;
                                  let gstStateCode = data.substring(0, 2);
                                  if (e.shiftKey && e.keyCode == 9) {
                                    if (e.target.value.trim() === "")
                                      this.setErrorBorder(4, "");
                                    else {
                                      if (GSTINREX.test(values.gstIn)) {
                                        return true;
                                      } else {
                                        this.setErrorBorder(4, "Y");
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "GSTIN is not Valid!",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById("gstIn")
                                            .focus();
                                        }, 1000);
                                      }
                                    }
                                  } else if (e.keyCode == 13) {
                                    if (e.target.value.trim() === "") {
                                      this.setErrorBorder(4, "Y");
                                    } else if (
                                      e.target.value.trim() !== "" &&
                                      GSTINREX.test(e.target.value.trim()) &&
                                      gstStateCode == stateCodeData
                                    ) {
                                      this.setErrorBorder(4, "");
                                      this.gsttypeRef.current?.focus();
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "warning",
                                        title: "Warning",
                                        msg: "GSTIN is not Valid!",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("gstIn")
                                          .focus();
                                      }, 1000);
                                    }
                                  } else if (e.keyCode == 9) {
                                    e.preventDefault();
                                    if (e.target.value.trim() === "") {
                                      this.setErrorBorder(4, "Y");
                                    } else if (
                                      e.target.value.trim() !== "" &&
                                      GSTINREX.test(e.target.value.trim()) &&
                                      gstStateCode == stateCodeData
                                    ) {
                                      this.setErrorBorder(4, "");
                                      this.gsttypeRef.current?.focus();
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "warning",
                                        title: "Warning",
                                        msg: "GSTIN is not Valid!",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("gstIn")
                                          .focus();
                                      }, 1000);
                                    }
                                  }
                                }}
                              />
                            </Form.Group>
                            {/* <span className="text-danger errormsg">
                              {errors.gstIn}
                            </span> */}
                          </Col>
                          <Col lg="1" className="p-0 col-width">
                            <Form.Label>
                              GST Type<span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col lg="3" className="pe-4">
                            <Form.Group
                              className={`${
                                errorArrayBorder[5] == "Y"
                                  ? "border border-danger selectTo"
                                  : "selectTo"
                              }`}
                              // onBlur={(e) => {
                              //   e.preventDefault();
                              //   if (!values.gstType) {
                              //     this.selectRef.current?.focus();
                              //   }
                              // }}
                              style={{ borderRadius: "4px" }}
                              // onBlur={(e) => {
                              //   e.preventDefault();
                              //   if (values.gstType) {
                              //     this.setErrorBorder(5, "");
                              //   } else {
                              //     this.setErrorBorder(5, "Y");
                              //     // this.selectRef1.current?.focus();
                              //   }
                              // }}
                              // onKeyDown={(e) => {
                              //   if (e.shiftKey && e.key === "Tab") {
                              //   } else if (e.key === "Tab" && !values.gstType)
                              //     e.preventDefault();
                              // }}
                            >
                              <Select
                                ref={this.gsttypeRef}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode === 9) {
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    this.handleKeyDown(e, "gstApplicableDate");
                                  } else if (e.keyCode === 13) {
                                    this.handleKeyDown(e, "gstApplicableDate");
                                  }

                                  // if (values.gstApplicable == true) {
                                  //   this.handleKeyDown(e, "gstApplicableDate");
                                  // }
                                }}
                                className="selectTo"
                                placeholder="GST Type"
                                closeMenuOnSelect={true}
                                components={{ ClearIndicator }}
                                onChange={(v) => {
                                  setFieldValue("gstType", v);
                                }}
                                name="gstType"
                                id="gstType"
                                value={values.gstType}
                                options={GSTopt}
                                styles={companystyle}
                              />
                              <span className="text-danger errormsg">
                                {errors.gstType}
                              </span>
                            </Form.Group>
                          </Col>

                          <Col lg="2" className=" ps-0">
                            <Form.Label>Applicable Date</Form.Label>
                          </Col>
                          <Col lg="1" className="date_col ps-0">
                            {" "}
                            <MyTextDatePicker
                              className="co_date"
                              name="gstApplicableDate"
                              id="gstApplicableDate"
                              placeholder="DD/MM/YYYY"
                              dateFormat="DD/MM/YYYY"
                              value={values.gstApplicableDate}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.keyCode == 18) {
                                  e.preventDefault();
                                }
                                if (e.shiftKey && e.key === "Tab") {
                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("gstApplicableDate")
                                        .focus();
                                    }, 1000);
                                  }
                                } else if (e.key === "Tab") {
                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("gstApplicableDate")
                                        .focus();
                                    }, 1000);
                                  }
                                } else {
                                  if (values.gstApplicable == true) {
                                    this.handleKeyDown(e, "multiBranch");
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                if (
                                  e.target.value != null &&
                                  e.target.value != ""
                                ) {
                                  console.warn(
                                    "sid:: isValid",
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid()
                                  );
                                  if (
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid() == true
                                  ) {
                                    let cDate = moment(
                                      dt,
                                      "DD-MM-YYYY"
                                    ).toDate();
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
                                        msg:
                                          "Applicable date can't be greater than Current Date",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      // setFieldValue("gstApplicableDate", "");
                                      setTimeout(() => {
                                        document
                                          .getElementById("gstApplicableDate")
                                          .focus();
                                      }, 1000);
                                    }
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Invalid Applicable date",
                                      // is_button_show: true,
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    // setFieldValue("gstApplicableDate", "");
                                    setTimeout(() => {
                                      document
                                        .getElementById("gstApplicableDate")
                                        .focus();
                                    }, 1000);
                                  }
                                } else {
                                  // setFieldValue("gstApplicableDate", "");
                                }
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.gstApplicableDate}
                            </span>
                          </Col>

                          {/* <Col lg="2" className="GST_col_width p-0">
                            <Form.Label>GST Transfer Date</Form.Label>
                          </Col>
                          <Col lg="1" className="date_col ps-0">
                            {" "}
                            <MyTextDatePicker
                              className="co_date"
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
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid()
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
                          </Col> */}
                        </Row>
                      </Col>
                    ) : (
                      ""
                    )}

                    {/* <Row className="mt-1"> */}
                    <Col lg="2">
                      <Row className="mt-2">
                        <Col md="6">
                          <Form.Label>Multi Branch</Form.Label>
                        </Col>
                        <Col md="6" className="mt-1">
                          <Form.Check
                            type="switch"
                            name="multiBranch"
                            id="multiBranch"
                            label={values.multiBranch == true ? "Yes" : "No"}
                            onChange={(e) => {
                              console.log("Is Checked:--->", e.target.checked);
                              this.gstFieldshow(e.target.checked);
                              setFieldValue("multiBranch", e.target.checked);
                            }}
                            value={values.multiBranch}
                            onKeyDown={(e) => {
                              this.handleKeyDown(e, "fullName");
                            }}
                          />

                          {/* <Form.Group className="d-flex label_style">
                            <Form.Check
                              type="radio"
                              label="Yes"
                              className="pr-3 "
                              name="multiBranch"
                              id="BranchYes"
                              onClick={() => {
                                setFieldValue("multiBranch", "yes");
                              }}
                              value="yes"
                              checked={
                                values.multiBranch == "yes" ? true : false
                              }
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
                              checked={
                                values.multiBranch == "no" ? true : false
                              }
                            />
                          </Form.Group> */}
                          <span className="text-danger errormsg">
                            {errors.multiBranch}
                          </span>
                        </Col>
                      </Row>
                    </Col>

                    {/* </Row> */}
                  </Row>

                  <Row>
                    {/* <h5 className="heding justify-content-center">
                    Admin Details
                  </h5> */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        className="my-auto"
                        style={{
                          // flex: 1,
                          height: "1px",
                          backgroundColor: " #D9D9D9",
                        }}
                      />

                      <div>
                        <p
                          style={{ textAlign: "center", marginBottom: "0" }}
                          className="px-2 heding"
                        >
                          Admin Details
                        </p>
                      </div>

                      <div
                        className="my-auto"
                        style={{
                          flex: 1,
                          height: "1px",
                          backgroundColor: " #D9D9D9",
                        }}
                      />
                    </div>
                    <Row>
                      <Col lg="3">
                        <Row>
                          <Col lg="4" className="pe-0">
                            {" "}
                            <Form.Label>Full Name</Form.Label>
                          </Col>
                          <Col lg="8">
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                placeholder="Full Name"
                                name="fullName"
                                className="co_text_box"
                                id="fullName"
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
                                // ref={(input) => (this.inputRefs[31] = input)}
                                onKeyDown={(e) => {
                                  this.handleKeyDown(e, "emailId");
                                }}
                              />
                              <span className="text-danger errormsg">
                                {errors.fullName}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="3">
                        <Row>
                          <Col lg="3">
                            <Form.Label>E-mail</Form.Label>
                          </Col>
                          <Col lg="9">
                            <Form.Control
                              autoComplete="off"
                              className="co_text_box"
                              placeholder="E-mail"
                              id="emailId"
                              name="emailId"
                              type="text"
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
                                      msg: "Please Enter Valid Email Id. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("emailId")
                                        .focus();
                                    }, 1000);
                                  }
                                } else if (
                                  e.key === "Tab" ||
                                  e.key === "Enter"
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
                                      document.getElementById("email").focus();
                                    }, 1000);
                                  } else if (e.keyCode === 13) {
                                    this.handleKeyDown(e, "contactNumber");
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                e.preventDefault();
                              }}
                              value={values.emailId}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="2">
                        <Row>
                          <Col lg="6">
                            <Form.Label>Mobile No.</Form.Label>
                          </Col>
                          <Col lg="6">
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                placeholder="Mobile No."
                                className="co_text_box ps-1 pe-1"
                                name="contactNumber"
                                id="contactNumber"
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                maxLength={10}
                                onChange={handleChange}
                                // ref={(input) => (this.inputRefs[33] = input)}
                                // onKeyDown={(e) => { this.handleKeyDown(e, 1) }}
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
                                        msg: "Please Enter 10 Digit Number. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("contactNumber")
                                          .focus();
                                      }, 1000);
                                    }
                                  } else if (
                                    e.key === "Tab" ||
                                    e.key === "Enter"
                                  ) {
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
                                        msg: "Please Enter 10 Digit Number. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("mobileNumber")
                                          .focus();
                                      }, 1000);
                                    } else if (e.keyCode === 13) {
                                      this.handleKeyDown(e, "userDob");
                                    }
                                  }
                                }}
                                onBlur={(e) => {}}
                                value={values.contactNumber}
                              />
                              <span className="text-danger errormsg">
                                {errors.contactNumber}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg="2">
                        <Row>
                          <Col lg="6" className="p-0">
                            <Form.Label>Birth Date</Form.Label>
                          </Col>
                          <Col lg="6">
                            <MyTextDatePicker
                              className="co_date"
                              name="userDob"
                              id="userDob"
                              placeholder="DD/MM/YYYY"
                              dateFormat="DD/MM/YYYY"
                              value={values.userDob}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.keyCode == 18) {
                                  e.preventDefault();
                                }
                                if (e.shiftKey && e.key === "Tab") {
                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("userDob")
                                        .focus();
                                    }, 1000);
                                  }
                                } else if (e.key === "Tab") {
                                  let datchco = e.target.value.trim();
                                  console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    // checkdate == "Invalid date"
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("userDob")
                                        .focus();
                                    }, 1000);
                                  }
                                } else {
                                  this.handleKeyDown(e, "gender1");
                                }
                              }}
                              onBlur={(e) => {
                                if (
                                  e.target.value != null &&
                                  e.target.value != ""
                                ) {
                                  console.warn(
                                    "sid:: isValid",
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid()
                                  );
                                  if (
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid() == true
                                  ) {
                                    let cDate = moment(
                                      dt,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    let expDate = moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    console.log(cDate <= expDate);
                                    if (cDate.getTime() >= expDate.getTime()) {
                                      console.log(e.target.value);
                                      setFieldValue("userDob", e.target.value);
                                    } else {
                                      console.log(
                                        "date is greater than current date"
                                      );
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg:
                                          "Birth date can't be greater than Current Date",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      // setFieldValue("userDob", "");
                                      setTimeout(() => {
                                        document
                                          .getElementById("userDob")
                                          .focus();
                                      }, 1000);
                                    }
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Invalid birth date",
                                      // is_button_show: true,
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    // setFieldValue("userDob", "");
                                    setTimeout(() => {
                                      document
                                        .getElementById("userDob")
                                        .focus();
                                    }, 1000);
                                  }
                                } else {
                                  // setFieldValue("userDob", "");
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="2">
                        <Row>
                          <Col lg="3">
                            {" "}
                            <Form.Label>Gender</Form.Label>
                          </Col>
                          <Col lg="9">
                            {" "}
                            <Form.Group
                              className="d-flex label_style"
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.key === "Tab") {
                                } else if (
                                  (e.key === "Tab" && !values.gender) ||
                                  (e.key === "Enter" && !values.gender)
                                ) {
                                  e.preventDefault();
                                  this.usernameRef.current?.focus();
                                } else {
                                  this.handleKeyDown(e, "usercode");
                                }
                              }}
                            >
                              <Form.Check
                                ref={this.radioRef}
                                type="radio"
                                label="Male"
                                name="gender"
                                id="gender1"
                                value="male"
                                onChange={handleChange}
                                checked={values.gender == "male" ? true : false}
                                // ref={values.gstApplicable === false ? (input) => (this.inputRefs[32] = input) : (input) => (this.inputRefs[35] = input)}
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
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col lg="3">
                        <Row>
                          <Col lg="4">
                            <Form.Label>
                              Username<span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col lg="8">
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                className={`${
                                  errorArrayBorder[6] == "Y"
                                    ? "border border-danger co_text_box"
                                    : "co_text_box"
                                }`}
                                placeholder="Username"
                                id="usercode"
                                name="usercode"
                                ref={this.usernameRef}
                                onChange={handleChange}
                                value={values.usercode}
                                // onBlur={(e) => {
                                //   e.preventDefault();
                                //   this.validateUserDuplicate(
                                //     values.usercode,
                                //     setFieldValue
                                //   );
                                //   // alert("On Blur Call");
                                // }}
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
                                //     this.setErrorBorder(6, "");
                                //   } else {
                                //     this.setErrorBorder(6, "Y");
                                //     document.getElementById("usercode").focus();
                                //   }
                                // }}
                                // ref={(input) => (this.inputRefs[36] = input)}
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    setFieldValue("usercode", e.target.value);
                                  }
                                  if (e.shiftKey && e.keyCode === 9) {
                                    if (e.target.value.trim())
                                      this.setErrorBorder(6, "");
                                    else {
                                      this.setErrorBorder(6, "Y");
                                    }
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    if (e.target.value.trim() !== "") {
                                      this.setErrorBorder(6, "");
                                      this.validateUserDuplicate(
                                        values.usercode,
                                        setFieldValue
                                      );
                                      this.handleKeyDown(e, "password");
                                    }
                                  } else if (e.keyCode === 13) {
                                    if (e.target.value.trim() !== "") {
                                      this.setErrorBorder(6, "");
                                      this.validateUserDuplicate(
                                        values.usercode,
                                        setFieldValue
                                      );
                                      this.handleKeyDown(e, "password");
                                    } else e.preventDefault();
                                  }
                                }}
                              />
                              <span className="text-danger errormsg">
                                {errors.usercode}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="3">
                        <Row>
                          <Col lg="3">
                            <Form.Label>
                              Password<span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col lg="9">
                            <Form.Group>
                              <InputGroup>
                                <Form.Control
                                  autoComplete="nope"
                                  // onKeyDown={(e) => {
                                  //   if (e.key === "Tab" && !e.target.value)
                                  //     e.preventDefault();
                                  // }}
                                  // className="password-style"
                                  className={`${
                                    errorArrayBorder[7] == "Y"
                                      ? "border border-danger "
                                      : ""
                                  }`}
                                  placeholder="Password"
                                  type="text"
                                  style={{
                                    webkitTextSecurity:
                                      showPassword != "" ? "unset" : " disc",
                                    // border: "none",
                                    paddingLeft: "6px",
                                  }}
                                  name="password"
                                  id="password"
                                  onChange={handleChange}
                                  value={values.password}
                                  ref={this.passwordRef}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();

                                  //   if (e.target.value.trim()) {
                                  //     this.setErrorBorder(7, "");
                                  //   } else {
                                  //     this.setErrorBorder(7, "Y");
                                  //     // document
                                  //     //   .getElementById("password")
                                  //     //   .focus();
                                  //   }
                                  // }}
                                  // onKeyDown={(e) => {
                                  //   if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (
                                  //     e.key === "Tab" &&
                                  //     !e.target.value
                                  //   )
                                  //     e.preventDefault();
                                  // }}
                                  // ref={(input) => (this.inputRefs[37] = input)}

                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                      if (e.target.value.trim() === "") {
                                        this.setErrorBorder(7, "Y");
                                      } else {
                                        this.setErrorBorder(7, "");
                                      }
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      if (e.target.value === "") {
                                      } else {
                                        this.setErrorBorder(7, "");
                                        document
                                          .getCompanyById("pwd_eye")
                                          .focus();
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (e.target.value === "") {
                                        e.preventDefault();
                                      } else {
                                        this.setErrorBorder(7, "");
                                        document
                                          .getElementById("pwd_eye")
                                          .focus();
                                      }
                                    }
                                  }}
                                />
                                {/* <InputGroup.Text style={{ border: "none" }}>
                                  {showPassword != "" ? (
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
                                </InputGroup.Text> */}
                                <Button
                                  className="pwd_eye"
                                  id="pwd_eye"
                                  style={{
                                    border: "2px solid transparent ",
                                    background: "#e8ecef",
                                    height: "31px",
                                    paddingTop: "2px",
                                    boxShadow: "none",
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.togglePasswordVisiblity(!showPassword);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode === 9) {
                                    } else if (e.keyCode === 9) {
                                      e.preventDefault();
                                      this.focusNextElement(e);
                                    } else if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  {showPassword != "" ? (
                                    <FontAwesomeIcon
                                      icon={faEye}
                                      style={{
                                        border: "none",
                                        color: "#212121",
                                      }}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faEyeSlash}
                                      style={{
                                        border: "none",
                                        color: "#212121",
                                      }}
                                    />
                                  )}
                                </Button>
                              </InputGroup>
                              <span className="text-danger errormsg">
                                {errors.password}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Row>

                  <Row>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        className="my-auto"
                        style={{
                          // flex: 1,
                          height: "1px",
                          backgroundColor: "  #D9D9D9",
                        }}
                      />

                      <div>
                        <p
                          style={{ textAlign: "center", marginBottom: "0" }}
                          className="px-2 heding"
                        >
                          User Control
                        </p>
                      </div>

                      <div
                        className="my-auto"
                        style={{
                          flex: 1,
                          height: "1px",
                          backgroundColor: " #D9D9D9",
                        }}
                      />
                    </div>
                  </Row>
                  <Row>
                    <Col lg="12" className=" my-auto mt-1 ms-2">
                      <div className="d-flex">
                        {/* {JSON.stringify(userControlData)} */}
                        {userControlData.length > 0 ? (
                          userControlData.map((v, i) => {
                            return (
                              // <Row className="pe-0 mx-0">

                              <div className="Control_style d-flex me-2">
                                <Form.Check
                                  type="switch"
                                  label={v.display_name}
                                  name={v.slug}
                                  id={`${v.slug}-${i}-yes`}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      this.handleSelectionChange(v.slug, 1, i);
                                    } else {
                                      this.handleSelectionChange(v.slug, 0, i);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                  checked={this.SelectionChangeCheck(v.slug)}
                                  // ref={(input) => (this.inputRefs[38] = input)}
                                  // onKeyDown={(e) => { this.handleKeyDown(e, 38) }}
                                />
                                {v.is_label && parseInt(v.value) == 1 && (
                                  <>
                                    {v.slug === "is_level_a" && (
                                      <Form.Control
                                        autoComplete="off"
                                        autoFocus="true"
                                        className="control_text_box"
                                        placeholder="Enter"
                                        name={`${v.slug}-label`}
                                        id={`${v.slug}-label`}
                                        onChange={(e) => {
                                          this.handleLabelChange(
                                            v.slug,
                                            e.target.value
                                          );
                                        }}
                                        value={v.label}
                                        onKeyDown={(e) => {
                                          if (e.shiftKey && e.key === "Tab") {
                                          } else if (
                                            e.key === "Tab" &&
                                            !e.target.value.trim()
                                          ) {
                                            e.preventDefault();
                                          } else if (e.keyCode == 13) {
                                            if (!e.target.value.trim())
                                              e.preventDefault();
                                            else this.focusNextElement(e);
                                          }
                                        }}
                                        // onKeyDown={(e) => {
                                        //   if (e.shiftKey && e.key === "Tab") {
                                        //   } else if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value.trim()
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        // ref={(input) => (this.inputRefs[38] = input)}
                                        // onKeyDown={(e) => { this.handleKeyDown(e, 38) }}
                                      />
                                    )}

                                    {v.slug === "is_level_b" && v.value === 1 && (
                                      <Form.Control
                                        autoComplete="nope"
                                        type="text"
                                        autoFocus="true"
                                        className="control_text_box"
                                        placeholder="Enter"
                                        name={`${v.slug}-label`}
                                        id={`${v.slug}-label`}
                                        onChange={(e) => {
                                          this.handleLabelChange(
                                            v.slug,
                                            e.target.value
                                          );
                                        }}
                                        value={v.label}
                                        // onKeyDown={(e) => {
                                        //   if (e.shiftKey && e.key === "Tab") {
                                        //   } else if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value.trim()
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        onKeyDown={(e) => {
                                          if (e.shiftKey && e.key === "Tab") {
                                          } else if (
                                            e.key === "Tab" &&
                                            !e.target.value.trim()
                                          ) {
                                            e.preventDefault();
                                          } else if (e.keyCode == 13) {
                                            if (!e.target.value.trim())
                                              e.preventDefault();
                                            else this.focusNextElement(e);
                                          }
                                        }}
                                      />
                                    )}
                                    {v.slug === "is_level_c" && v.value === 1 && (
                                      <Form.Control
                                        autoComplete="nope"
                                        type="text"
                                        autoFocus="true"
                                        className="control_text_box"
                                        placeholder="Enter"
                                        name={`${v.slug}-label`}
                                        id={`${v.slug}-label`}
                                        onChange={(e) => {
                                          this.handleLabelChange(
                                            v.slug,
                                            e.target.value
                                          );
                                        }}
                                        value={v.label}
                                        // onKeyDown={(e) => {
                                        //   if (e.shiftKey && e.key === "Tab") {
                                        //   } else if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value.trim()
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        onKeyDown={(e) => {
                                          if (e.shiftKey && e.key === "Tab") {
                                          } else if (
                                            e.key === "Tab" &&
                                            !e.target.value.trim()
                                          ) {
                                            e.preventDefault();
                                          } else if (e.keyCode == 13) {
                                            if (!e.target.value.trim())
                                              e.preventDefault();
                                            else this.focusNextElement(e);
                                          }
                                        }}
                                      />
                                    )}
                                  </>
                                )}
                              </div>

                              // </Row>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                <Row className="style-btn">
                  <Col lg={12} className="text-end">
                    <Button
                      id="submit"
                      className="successbtn-style"
                      type="submit"
                      // ref={(input) => (this.inputRefs[38] = input)}
                      // onKeyDown={(e) => { this.handleKeyDown(e, 38) }}

                      onKeyDown={(e) => {
                        // this.handleKeyDown(e, 38)

                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.ref.current.handleSubmit();
                          if (e.target.value === "") {
                          } else {
                            this.handleKeyDown(e, "cancel");
                          }
                        }
                      }}
                      // onKeyDown={(e) => {
                      //   if (values.gstApplicable == false) {
                      //     this.handleKeyDown(e, 35)
                      //     this.ref.current.handleSubmit();
                      //   } else {
                      //     this.handleKeyDown(e, 38)
                      //     this.ref.current.handleSubmit();
                      //   }
                      // }}
                    >
                      Submit
                    </Button>
                    <Button
                      id="cancel"
                      variant="secondary cancel-btn ms-2"
                      onClick={(e) => {
                        e.preventDefault();
                        // console.log("reset");
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
                                from: "newBranchCreate",
                                to: "newBranchList",
                                isNewTab: false,
                                isCancel: true,
                              });
                            },
                            handleFailFn: () => {},
                          },
                          () => {
                            console.warn("return_data");
                          }
                        );
                      }}
                      // ref={(input) => (this.inputRefs[39] = input)}
                      // onKeyDown={(e) => { this.handleKeyDown(e, 1) }}
                      onKeyDown={(e) => {
                        // this.handleKeyDown(e, 39)
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
                                  from: "newBranchCreate",
                                  to: "newBranchList",
                                  isNewTab: false,
                                  isCancel: true,
                                });
                              },
                              handleFailFn: () => {},
                            },
                            () => {
                              console.warn("return_data");
                            }
                          );
                        } else {
                          this.handleKeyDown(e, "branchCode");
                        }
                      }}
                      // onKeyDown={(e) => {
                      //   if (values.gstApplicable == false) {
                      //     this.handleKeyDown(e, 35)
                      //     this.ref.current.handleSubmit();
                      //   } else {
                      //     this.handleKeyDown(e, 38)
                      //     this.ref.current.handleSubmit();
                      //   }
                      // }}
                      ref={
                        values.gstApplicable === false
                          ? (input) => (this.inputRefs[36] = input)
                          : (input) => (this.inputRefs[39] = input)
                      }
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
        <Row className="mx-0 btm-rows-btn1">
          {/* <Col md="2" className="px-0">
            <Form.Label className="btm-label">
              <img src={keyboard} className="svg-style mt-0 mx-2"></img>
              New entry: <span className="shortkey">Ctrl + N</span>
            </Form.Label>
          </Col>
          <Col md="8">
            <Form.Label className="btm-label">
              Duplicate: <span className="shortkey">Ctrl + D</span>
            </Form.Label>
          </Col>
          
          <Col md="2" className="text-end">
            <img src={question} className="svg-style ms-1"></img>
          </Col> */}
          <Col md="12" className="my-auto">
            {/* <Row>
              <Col md="2" className="">
                <Row>
                  <Col md="6">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faHouse}
                        className="svg-style icostyle mt-0 mx-2"
                      />

                      <span className="shortkey">Ctrl+A</span>
                    </Form.Label>
                  </Col>
                  <Col md="6">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faCirclePlus}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">F2</span>
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
              <Col md="2" className="">
                <Row>
                  <Col md="6" className="">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faPen}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">Ctrl+E</span>
                    </Form.Label>
                  </Col>
                  <Col md="6">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faFloppyDisk}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">Ctrl+S</span>
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
              <Col md="2" className="">
                <Row>
                  <Col md="6">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">Ctrl+D</span>
                    </Form.Label>
                  </Col>
                  <Col md="6" className="">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">Ctrl+C</span>
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
              <Col md="2" className="">
                <Row>
                  <Col md="6">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faCalculator}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">Alt+C</span>
                    </Form.Label>
                  </Col>
                  <Col md="6">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faGear}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">F11</span>
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
              <Col md="2" className="">
                <Row>
                  <Col md="6">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">Ctrl+Z</span>
                    </Form.Label>
                  </Col>
                  <Col md="6" className="">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faPrint}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">Ctrl+P</span>
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
              <Col md="2" className="">
                <Row>
                  <Col md="6" className="">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faArrowUpFromBracket}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">Export</span>
                    </Form.Label>
                  </Col>
                  <Col md="6">
                    <Form.Label className="btm-label d-flex">
                      <FontAwesomeIcon
                        icon={faCircleQuestion}
                        className="svg-style icostyle mt-0 mx-2"
                      />
                      <span className="shortkey">F1</span>
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
            </Row> */}
          </Col>
        </Row>

        {/*  Validation Modal start */}
        <Modal
          show={showErorrModal}
          onHide={(e) => {
            this.setState({ showErorrModal: false });
          }}
          centered
        >
          <Modal.Header closeButton style={{ background: "#ffc1c1" }}>
            <Modal.Title>Error Msg</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorArrayBorder != "" && errorArrayBorder.length > 0 ? (
              <Table>
                {errorArrayBorder.map((v) => {
                  return (
                    <tr className="border-0">
                      <td className="text-danger fs-5">{v}</td>
                    </tr>
                  );
                })}
              </Table>
            ) : (
              ""
            )}
          </Modal.Body>
          {/* <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                this.setState({ showErorrModal: false });
              }}
            >
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
        {/*  Validation Modal end */}
      </div>
    );
  }
}
