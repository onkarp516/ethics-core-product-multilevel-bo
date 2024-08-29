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
  handlesetFieldValue,
} from "@/helpers";
import moment from "moment";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import Select from "react-select";
import {
  faEye,
  faEyedropper,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  authenticationService,
  createCompany,
  getIndianState,
  getIndiaCountry,
  get_companies_super_admin,
  getGSTTypes,
  getCompanyById,
  updateCompany,
  validateCompany,
  getAllMasterAppConfig,
  validateUsers,
  getPincodeData,
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

export default class NewCompany extends React.Component {
  constructor(props) {
    super(props);
    this.transFormRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.ref = React.createRef();
    this.selectRefA = React.createRef();
    this.regAreaRef = React.createRef();
    this.regCountryRef = React.createRef();
    this.corpCountryRef = React.createRef();
    this.corpAreaRef = React.createRef();
    this.currencyRef = React.createRef();
    this.gsttypeRef = React.createRef();
    this.radioRef = React.createRef();
    this.radioRef1 = React.createRef();

    const curDate = new Date();
    this.state = {
      countryOpt: [],
      GSTopt: [],
      orgData: [],
      userControlData: [],
      showPassword: false,
      cancelStatus: true,
      gstshow: false,
      tabVisible: false,
      data: [],
      areaOpt: [],
      corporateareaOpt: [],
      checkAddress: false,
      dt: moment(curDate).format("DD/MM/YYYY"),
      stateCodeData: [],
      CompanyInitVal: {
        id: "",
        companyName: "",
        companyCode: "",
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
        sameAsAddress: false,
        pincode: "",
        email: "",
        mobileNumber: "",
        whatsappNumber: "",
        place: "",
        countryId: "",
        stateId: "",
        stateCode: "",
        uploadImage: "",
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
        userRole: "CADMIN",
        userDob: "",
        userDoa: "",
        emailId: "",
        gender: "",
        usercode: "",
        password: "",
        areaId: "",
        corporateareaId: "",
      },
      errorArrayBorder: "",

      oldPinCode: "",
      oldCorPinCode: "",
    };
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
  // lstCountry = () => {
  //   getIndiaCountry()
  //     .then((response) => {
  //       let { initValue } = this.state;
  //       let opt = [];
  //       let res = { label: response.data.name, value: response.data.id };
  //       opt.push(res);
  //       this.setState({ countryOpt: opt }, () => {
  //         initValue["countryId"] = opt[0];
  //         this.setState({ initValue: initValue });
  //       });
  //     })
  //     .catch((error) => {});
  // };

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
          this.ref.current.setFieldValue("gstType", opt[0]);
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
      // this.listGetCompany();
      this.listGSTTypes();
      this.getAllMasterAppConfig();
      this.lstCountry();

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

          // console.log("getAllMasterAppConfig", res);
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

          // if (
          //   this.ref.current.values.areaId === "" ||
          //   this.ref.current.values.areaId === null
          // )

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
    let { oldCorPinCode } = this.state;
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

          // @prathmesh @select area from list and click on same as address then same area can't be auto selected start
          if (this.ref.current.values.sameAsAddress == true) {
          } else {
            // if (
            //   this.ref.current.values.corporateareaId === "" ||
            //   this.ref.current.values.corporateareaId === null
            // )

            if (oldCorPinCode != pincode)
              this.ref.current.setFieldValue("corporateareaId", opt[0]);
          }
          // end

          this.setState({ corporateareaOpt: opt, oldCorPinCode: pincode });
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
        if (userControlData[index]["is_label"]) {
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
          } else if (index + 1 == userControlData.length) {
            if (userControlData[index]["label"]) {
              v.value = 1;
            } else {
              v.value = value;
            }
          } else {
            if (userControlData[index + 1]["label"]) {
              v.value = 1;
            } else {
              v.value = value;
            }
          }
        } else {
          v.value = value;
        }
      }

      return v;
    });

    this.setState({ userControlData: userControlData }, () => {
      // console.log("userControlData", userControlData);
      // console.warn('Value ->>>>>', userControlData[index]["value"])
      // console.warn('Label ->>>>>', userControlData[index]["label"])
    });
  };

  handleLabelChange = (slug, value, index) => {
    let { userControlData } = this.state;
    userControlData = userControlData.map((v) => {
      if (v.slug == slug) {
        // if (userControlData[index + 1]["label"] == "") {
        v.label = value;
        // }
      }

      return v;
    });

    this.setState({ userControlData: userControlData }, () => {
      // console.log("userControlData", userControlData);
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
        let { CompanyInitVal } = this.state;
        // console.log("country res", response);
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt }, () => {
          let FCompanyInitVal = { ...CompanyInitVal };
          FCompanyInitVal["countryId"] = opt[0];
          CompanyInitVal["currency"] = opt[0];
          this.setState({ CompanyInitVal: FCompanyInitVal });
        });
        this.ref.current.setFieldValue("currency", Currencyopt[0]);
        this.ref.current.setFieldValue("countryId", opt[0]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  validateUserDuplicate = (user_code, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("userCode", user_code);
    validateUsers(reqData)
      .then((response) => {
        let res = response.data;
        // console.log("usernamecheck", res);
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

  // validation for company name
  validateCompanyDuplicate = (companyName) => {
    let reqData = new FormData();
    reqData.append("companyName", companyName.trim());
    validateCompany(reqData)
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
          setTimeout(() => {
            document.getElementById("companyName").focus();
          }, 1300);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  validatePincode = (pincode, type) => {
    let reqData = new FormData();
    reqData.append("pincode", pincode);
    // console.log("pincode", pincode);
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
            delay: 1500,
          });
          if (this.ref.current.values.sameAsAddress == true) {
            this.ref.current.setFieldValue("corporateareaId", "");
            this.ref.current.setFieldValue("corporatestateName", "  ");
            this.ref.current.setFieldValue("corporatestateCode", "");
            this.ref.current.setFieldValue("corporatecity", "");
            this.ref.current.setFieldValue("corporatePincode", "");
          }
          // @prathmesh @pincode validation focus condtion added
          if (type) {
            setTimeout(() => {
              document.getElementById("corporatePincode").focus();
            }, 1000);
          } else {
            setTimeout(() => {
              document.getElementById("pincode").focus();
            }, 1000);
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

  handleKeyDown = (e, index) => {
    // debugger;
    if (e.keyCode === 13) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    } else if (e.keyCode === 9) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    }
    // if (e.keyCode === 37) {
    //   document.getElementById(index).focus();
    // const prevIndex = (index - 1) % this.inputRefs.length;
    // if (prevIndex === -1) {
    //   this.inputRefs[index].focus();
    // } else {
    //   this.inputRefs[prevIndex].focus();
    // }
    // }
    else if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index).focus();
      // const index = (38) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    } else if (e.altKey && e.keyCode === 67) {
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
      data,
      stateOpt,
      opendiv,
      countryOpt,
      GSTopt,
      CompanyInitVal,
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
      errorArrayBorder,
      previewImage,
    } = this.state;
    return (
      <div>
        <div className="newcompanycreate">
          <Formik
            innerRef={this.ref}
            initialValues={CompanyInitVal}
            validateOnChange={false}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // console.log("values...", values);
              // @prathmesh @onsubmit level condion added
              // let { userControlData } = this.state;
              // let flag = false;
              // userControlData.map((v) => {
              //   // console.warn("userControlData.........", userControlData)
              //   if (v.value == 1 && v.label === "" && v.is_label === true) {
              //     flag = true;
              //   }
              // });
              // if (flag === true) {
              //   MyNotifications.fire({
              //     show: true,
              //     icon: "error",
              //     title: "Error",
              //     msg: "Please Add or Disable Level",
              //     is_button_show: true,
              //     // is_timeout: true,
              //     // delay: 1500,
              //   });
              // } else
              {
                //! validation required start

                let errorArray = [];

                if (values.companyName.trim() == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }

                if (values.pincode == "") {
                  errorArray.push("Y");
                } else {
                  errorArray.push("");
                }
                if (values.gstApplicable) {
                  if (values.gstIn.trim() == "") {
                    errorArray.push("Y");
                  } else {
                    errorArray.push("");
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

                //! validation required end

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
                        let keys = Object.keys(CompanyInitVal);
                        // console.log("keys", keys);
                        // console.log("values--->", values);
                        // console.log(
                        //   " authenticationService.currentUserValue --->",
                        //   authenticationService.currentUserValue
                        // );
                        let requestData = new FormData();

                        keys.map((v) => {
                          // console.log("v", v, "values", values[v]);
                          if (
                            values[v] !== "" &&
                            values[v] !== undefined &&
                            v !== "countryId" &&
                            v !== "currency" &&
                            v !== "gstType" &&
                            v !== "gstApplicableDate" &&
                            v !== "licenseExpiryDate" &&
                            v !== "foodLicenseExpiryDate" &&
                            v !== "manufacturingLicenseExpiry" &&
                            v !== "gstTransferDate" &&
                            v !== "userDob"
                          ) {
                            requestData.append(v, values[v]);
                          }
                        });
                        // console.log(
                        //   "values.gstApplicable",
                        //   values.gstApplicable
                        // );
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
                            moment(
                              values.licenseExpiryDate,
                              "DD/MM/YYYY"
                            ).format("YYYY-MM-DD")
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
                        // requestData.append("uploadImage", values.uploadImage);
                        if (values.uploadImage != "") {
                          requestData.append("uploadImage", values.uploadImage);
                        }
                        requestData.append("city", values.city);
                        requestData.append(
                          "corporatecity",
                          values.corporatecity
                        );
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
                        // for (let [name, value] of requestData) {
                        //   // console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                        // }
                        // console.log("requestData", requestData);
                        // console.log("values---->", values);

                        createCompany(requestData)
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

                              eventBus.dispatch("page_change", {
                                from: "newCompany",
                                to: "companyList",
                                isNewTab: false,
                                isCancel: true,
                                prop_data: {
                                  companyId: parseInt(res.responseObject),
                                },
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
                      },
                      handleFailFn: () => {
                        setSubmitting(false);
                      },
                    });
                  }
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
                  <Row className="">
                    <Col lg="2">
                      {" "}
                      <Row>
                        <Col lg="6" className="pe-0">
                          <Form.Label>Company Code</Form.Label>
                        </Col>
                        <Col lg="6" className="pe-0">
                          <Form.Group>
                            <Form.Control
                              autoFocus="true"
                              autoComplete="companyCode"
                              className="co_text_box ps-1 pe-1"
                              type="text"
                              name="companyCode"
                              id="companyCode"
                              placeholder="Company Code"
                              onChange={handleChange}
                              value={values.companyCode}
                              onKeyDown={(e) => {
                                if (e.keyCode === 9 || e.keyCode === 13) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "companyCode",
                                    e.target.value
                                  );
                                }
                                if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "companyName");
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  this.handleKeyDown(e, "companyName");
                                }
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.companyCode}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg="4">
                      <Row>
                        {" "}
                        <Col lg="2">
                          <Form.Label>
                            Name<span className="text-danger">*</span>
                          </Form.Label>
                        </Col>
                        <Col md="10" className="pe-4">
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name="companyName"
                              id="companyName"
                              autoComplete="companyName"
                              value={values.companyName}
                              onChange={handleChange}
                              // className="co_text_box"
                              placeholder="Name"
                              className={`${
                                errorArrayBorder[0] == "Y"
                                  ? "border border-danger co_text_box"
                                  : "co_text_box"
                              }`}
                              onKeyDown={(e) => {
                                if (
                                  (e.shiftKey && e.keyCode === 9) ||
                                  e.keyCode === 9 ||
                                  e.keyCode === 13
                                ) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "companyName",
                                    e.target.value
                                  );
                                }
                                if (e.shiftKey && e.keyCode == 9) {
                                  if (e.target.value.trim()) {
                                    this.setErrorBorder(0, "");
                                  } else {
                                    this.setErrorBorder(0, "Y");
                                  }
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  if (e.target.value.trim()) {
                                    this.validateCompanyDuplicate(
                                      e.target.value
                                    );
                                    this.setErrorBorder(0, "");
                                    this.handleKeyDown(e, "Manufaturer");
                                  }
                                } else if (e.keyCode === 13) {
                                  if (e.target.value.trim()) {
                                    this.validateCompanyDuplicate(
                                      e.target.value
                                    );
                                    this.setErrorBorder(0, "");
                                    this.handleKeyDown(e, "Manufaturer");
                                  } else e.preventDefault();
                                }
                              }}
                            />
                            {/* <span className="text-danger errormsg">
                              {errors.companyName}
                            </span> */}
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg="3" className="ps-0">
                      <Row>
                        <Col lg="4">
                          {" "}
                          <Form.Label>Trade</Form.Label>
                        </Col>
                        <Col lg="8" className="ps-0">
                          {" "}
                          <Form.Group
                            className="d-flex label_style"
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.keyCode === 9) {
                                this.radioRef1.current?.focus();
                              } else if (e.keyCode === 9) {
                                e.preventDefault();
                                this.handleKeyDown(e, "natureOfBusiness");
                              } else if (e.keyCode === 13) {
                                this.handleKeyDown(e, "natureOfBusiness");
                              }
                            }}
                          >
                            <Form.Check
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
                              type="radio"
                              ref={this.radioRef1}
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
                    <Col lg="3">
                      <Row>
                        <Col lg="5" className="pe-0">
                          <Form.Label>Nature Of Business</Form.Label>
                        </Col>
                        <Col md="7">
                          <Form.Group>
                            <Form.Control
                              type="text"
                              className="co_text_box"
                              placeholder="Nature Of Business"
                              id="natureOfBusiness"
                              name="natureOfBusiness"
                              value={values.natureOfBusiness}
                              onChange={handleChange}
                              autoComplete="natureOfBusiness"
                              onKeyDown={(e) => {
                                if (
                                  (e.shiftKey && e.keyCode === 9) ||
                                  e.keyCode === 9 ||
                                  e.keyCode === 13
                                ) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "natureOfBusiness",
                                    e.target.value
                                  );
                                }
                                if (e.shiftKey && e.keyCode == 9) {
                                } else if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "uploadImage");
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  this.handleKeyDown(e, "uploadImage");
                                }
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.natureOfBusiness}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg="3">
                      <Row>
                        <Col lg="4" className=" ">
                          <Form.Label>Upload Image</Form.Label>
                        </Col>
                        <Col lg="8" className="">
                          <Form.Group controlId="formGridEmail">
                            <Form.Control
                              type="file"
                              className="password-style"
                              id="uploadImage"
                              name="uploadImage"
                              onChange={(e) => {
                                const selectedImage = e.target.files[0];
                                setFieldValue("uploadImage", selectedImage);
                                if (selectedImage) {
                                  const reader = new FileReader();
                                  const allowedFileTypes = [
                                    "image/jpeg",
                                    "image/png",
                                  ];
                                  reader.onload = (e) => {
                                    this.setState({
                                      selectedImage,
                                      previewImage: e.target.result,
                                    });
                                  };
                                  reader.readAsDataURL(selectedImage);
                                  if (
                                    !allowedFileTypes.includes(
                                      selectedImage.type
                                    )
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please select jpg and png file ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setFieldValue("uploadImage", "");
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  this.handleKeyDown(e, "registeredAddress");
                                } else if (e.keyCode == 13)
                                  this.handleKeyDown(e, "registeredAddress");
                              }}
                              accept=".jpeg, .png"
                            />
                            <label
                              className="custom-file-label custombrowseclass"
                              htmlFor="uploadImage"
                            >
                              {values.uploadImage ? "FILE SELECTED" : ""}
                            </label>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="4">
                      {values.uploadImage ? (
                        <>
                          {previewImage && (
                            <img
                              src={previewImage}
                              alt="Preview"
                              style={{ maxWidth: "100%", maxHeight: "75px" }}
                            />
                          )}
                        </>
                      ) : (
                        ""
                      )}
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
                                  className="co_text_box"
                                  placeholder="Address"
                                  type="text" 
                                  autoComplete="registeredAddress"
                                  name="registeredAddress"
                                  id="registeredAddress"
                                  isDisabled={
                                    values.sameAsAddress === true ? true : false
                                  }
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
                                  value={values.registeredAddress}
                                  onKeyDown={(e) => {
                                    if (
                                      (e.shiftKey && e.keyCode === 9) ||
                                      e.keyCode === 9 ||
                                      e.keyCode === 13
                                    ) {
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "registeredAddress",
                                        e.target.value
                                      );

                                      handlesetFieldValue(
                                        setFieldValue,
                                        "corporateAddress",
                                        values.sameAsAddress === true
                                          ? e.target.value.trim()
                                          : ""
                                      );
                                    }

                                    if (e.shiftKey && e.keyCode === 9) {
                                    } else if (e.keyCode == 13) {
                                      this.handleKeyDown(e, "pincode");
                                    } else if (e.keyCode === 9) {
                                      e.preventDefault();
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
                                  className="pt-1"
                                >
                                  <Form.Label>
                                    Pincode
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                </Col>
                                <Col lg="6" md={6} sm={6} xs={6}>
                                  <Form.Group>
                                    <Form.Control
                                      // className="co_text_box"
                                      placeholder="Pincode"
                                      type="text"
                                      id="pincode"
                                      name="pincode"
                                      autoComplete="pincode"
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
                                        }
                                      }}
                                      value={values.pincode}
                                      maxLength={6}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      className={`${
                                        errorArrayBorder[1] == "Y"
                                          ? "border border-danger co_text_box"
                                          : "co_text_box"
                                      }`}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.keyCode === 9) {
                                          if (e.target.value) {
                                            this.setErrorBorder(1, "");
                                          } else {
                                            this.setErrorBorder(1, "Y");
                                            document
                                              .getElementById("pincode")
                                              .focus();
                                          }
                                        } else if (e.keyCode === 9) {
                                          e.preventDefault();
                                          if (e.target.value) {
                                            this.setErrorBorder(1, "");
                                            this.validatePincode(
                                              e.target.value,
                                              false
                                            );

                                            this.getPincodeData(
                                              e.target.value,
                                              setFieldValue
                                            );
                                          } else {
                                            e.preventDefault();
                                            this.setErrorBorder(1, "Y");
                                            document
                                              .getElementById("pincode")
                                              .focus();
                                          }
                                        } else if (e.keyCode === 13) {
                                          if (e.target.value) {
                                            this.setErrorBorder(1, "");
                                            this.validatePincode(
                                              e.target.value,
                                              false
                                            );
                                            this.getPincodeData(
                                              e.target.value,
                                              setFieldValue
                                            );
                                          } else {
                                            this.setErrorBorder(1, "Y");
                                            document
                                              .getElementById("pincode")
                                              .focus();
                                          }
                                        }
                                      }}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg="5" md={5} sm={5} xs={5}>
                              <Row>
                                <Col lg={4}>
                                  <Form.Label>Area</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Form.Group>
                                    <Select
                                      className="selectTo"
                                      ref={this.regAreaRef}
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
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          this.regCountryRef.current?.focus();
                                        }
                                      }}
                                      invalid={errors.areaId ? true : false}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg="3" md={3} sm={3} xs={3} className="p-0">
                              <Row>
                                <Col lg={2}>
                                  {" "}
                                  <Form.Label>City</Form.Label>
                                </Col>
                                <Col lg="10">
                                  <Form.Control
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
                            <Col lg="4" md={4} sm={4} xs={4} className="">
                              <Row>
                                <Col lg="6">
                                  <Form.Label className="">State</Form.Label>
                                </Col>
                                <Col lg="6" className="ps-0">
                                  <Form.Control
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
                            <Col lg="5" md="5" sm="5" xs="5">
                              <Row>
                                <Col lg={4} className="pe-0">
                                  {" "}
                                  <Form.Label>Country</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Form.Group>
                                    <Select
                                      placeholder="Country"
                                      styles={companystyle}
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      options={countryOpt}
                                      value={values.countryId}
                                      ref={this.regCountryRef}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          this.handleKeyDown(
                                            e,
                                            "sameAsAddress"
                                          );
                                        }
                                      }}
                                      invalid={errors.countryId ? true : false}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
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
                            className="checkbox-label form-checked-label"
                            name="sameAsAddress"
                            id="sameAsAddress"
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
                              } else {
                                setFieldValue("corporateAddress", "");
                                setFieldValue("corporatePincode", "");
                                setFieldValue("corporatecity", "");
                                setFieldValue("corporatestateName", "");
                                setFieldValue("corporatestateCode");
                                setFieldValue("corporateareaId", "");
                              }
                            }}
                            value={values.sameAsAddress}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.keyCode === 9) {
                              } else if (e.keyCode === 13) {
                                if (values.sameAsAddress === true)
                                  this.handleKeyDown(e, "licenseNo");
                                if (values.sameAsAddress === false)
                                  this.handleKeyDown(e, "corporateAddress");
                              } else if (e.keyCode === 9) {
                                e.preventDefault();
                                if (values.sameAsAddress === true)
                                  this.handleKeyDown(e, "licenseNo");
                                if (values.sameAsAddress === false)
                                  this.handleKeyDown(e, "corporateAddress");
                              }
                            }}
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
                                  type="text"
                                  className="co_text_box"
                                  placeholder="Address"
                                  name="corporateAddress"
                                  id="corporateAddress"
                                  onChange={handleChange}
                                  value={values.corporateAddress}
                                  disabled={
                                    values.sameAsAddress === true ? true : false
                                  }
                                  onKeyDown={(e) => {
                                    if (
                                      (e.shiftKey && e.keyCode === 9) ||
                                      e.keyCode === 9 ||
                                      e.keyCode === 13
                                    ) {
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "corporateAddress",
                                        e.target.value
                                      );
                                    }

                                    if (e.shiftKey && e.keyCode === 9) {
                                    } else if (e.keyCode == 13) {
                                      this.handleKeyDown(e, "corporatePincode");
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      this.handleKeyDown(e, "corporatePincode");
                                    }
                                  }}
                                  autoComplete="corporateAddress"
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
                                  className="pt-1"
                                >
                                  <Form.Label>Pincode</Form.Label>
                                </Col>
                                <Col lg="6" md={6} sm={6} xs={6}>
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      className="co_text_box"
                                      placeholder="Pincode"
                                      id="corporatePincode"
                                      name="corporatePincode"
                                      value={values.corporatePincode}
                                      onChange={handleChange}
                                      maxLength={6}
                                      autoComplete="corporatePincode"
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      disabled={
                                        values.sameAsAddress === true
                                          ? true
                                          : false
                                      }
                                      onKeyDown={(e) => {
                                        if (values.sameAsAddress === false) {
                                          if (e.shiftKey && e.keyCode === 9) {
                                          } else if (e.keyCode === 9) {
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
                                          } else if (e.keyCode === 13) {
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
                                          }
                                        } else if (e.keyCode === 13) {
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
                            <Col lg="5" md="4" sm="4" xs="4">
                              <Row>
                                <Col lg={4}>
                                  {" "}
                                  <Form.Label>Area</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Form.Group>
                                    <Select
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
                                      ref={this.corpAreaRef}
                                      value={values.corporateareaId}
                                      invalid={
                                        errors.corporateareaId ? true : false
                                      }
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
                            <Col lg="3" md={3} sm={3} xs={3} className="p-0">
                              <Row>
                                <Col lg={2}>
                                  {" "}
                                  <Form.Label>City</Form.Label>
                                </Col>
                                <Col lg="10">
                                  <Form.Control
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

                            <Col lg="5" md="5" sm="5" xs="5">
                              <Row>
                                <Col lg={4} className="">
                                  {" "}
                                  <Form.Label>Country</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Form.Group>
                                    <Select
                                      placeholder="Country"
                                      styles={companystyle}
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      options={countryOpt}
                                      value={values.countryId}
                                      ref={this.corpCountryRef}
                                      invalid={errors.countryId ? true : false}
                                      isDisabled={
                                        values.sameAsAddress === true
                                          ? true
                                          : false
                                      }
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13)
                                          this.handleKeyDown(e, "licenseNo");
                                      }}
                                    />
                                    <span className="text-danger">
                                      {errors.countryId}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
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
                                className="co_text_box ps-1 pe-1"
                                placeholder="License No."
                                type="text"
                                id="licenseNo"
                                name="licenseNo"
                                onChange={handleChange}
                                value={values.licenseNo}
                                autoComplete="licenseNo"
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "licenseNo",
                                      e.target.value
                                    );
                                  }
                                  if (e.shiftKey || e.keyCode === 9) {
                                  } else if (e.keyCode == 13) {
                                    this.handleKeyDown(e, "licenseExpiryDate");
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    this.handleKeyDown(e, "licenseExpiryDate");
                                  }
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
                              autoComplete="licenseExpiryDate"
                              value={values.licenseExpiryDate}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                // @vinit@Number of Expiry Days PopUp from Currentdate
                                if (e.shiftKey && e.keyCode === 9) {
                                  // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                    } else if (
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
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
                                          e.preventDefault();
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: ` Expiry of Your Lisence in ${daysDifference} Days`,
                                            is_timeout: false,
                                            is_button_show: true,
                                            // delay: 2000,
                                          });
                                          document
                                            .getElementById("licenseNo")
                                            .focus();
                                        }
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById("licenseExpiryDate")
                                            .focus();
                                        }, 1300);
                                      }
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date. ",
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("licenseExpiryDate")
                                          .focus();
                                      }, 1300);
                                    }
                                  }
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "foodLicenseNo");
                                    } else if (
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
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
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
                                        this.handleKeyDown(e, "foodLicenseNo");
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById("licenseExpiryDate")
                                            .focus();
                                        }, 1300);
                                      }
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date. ",
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("licenseExpiryDate")
                                          .focus();
                                      }, 1300);
                                    }
                                  }
                                } else if (e.keyCode === 13) {
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "foodLicenseNo");
                                    } else if (
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
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
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
                                        this.handleKeyDown(e, "foodLicenseNo");
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
                                        setTimeout(() => {
                                          document
                                            .getElementById("licenseExpiryDate")
                                            .focus();
                                        }, 1300);
                                      }
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date. ",
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("licenseExpiryDate")
                                          .focus();
                                      }, 1300);
                                    }
                                  }
                                }
                              }}
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
                                type="text"
                                className="co_text_box"
                                placeholder="FSSAI No."
                                id="foodLicenseNo"
                                name="foodLicenseNo"
                                value={values.foodLicenseNo}
                                onChange={handleChange}
                                autoComplete="foodLicenseNo"
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "foodLicenseNo",
                                      e.target.value
                                    );
                                  }
                                  if (e.keyCode == 13)
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
                              autoComplete="foodLicenseExpiryDate"
                              value={values.foodLicenseExpiryDate}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode === 9) {
                                  // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                    } else if (
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
                                            "foodLicenseExpiryDate"
                                          )
                                          .focus();
                                      }, 1300);
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
                                          e.preventDefault();
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: ` Expiry of Your Lisence in ${daysDifference} Days`,
                                            is_timeout: false,
                                            is_button_show: true,
                                            // delay: 2000,
                                          });
                                          document
                                            .getElementById("foodLicenseNo")
                                            .focus();
                                        }
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
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
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
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
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(
                                        e,
                                        "manufacturingLicenseNo"
                                      );
                                    } else if (
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
                                            "foodLicenseExpiryDate"
                                          )
                                          .focus();
                                      }, 1300);
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
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
                                        this.handleKeyDown(
                                          e,
                                          "manufacturingLicenseNo"
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
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
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
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
                                } else if (e.keyCode === 13) {
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(
                                        e,
                                        "manufacturingLicenseNo"
                                      );
                                    } else if (
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
                                            "foodLicenseExpiryDate"
                                          )
                                          .focus();
                                      }, 1300);
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
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
                                        this.handleKeyDown(
                                          e,
                                          "manufacturingLicenseNo"
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
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
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
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
                              }}
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
                                className="co_text_box ps-1"
                                placeholder="MFG License No."
                                id="manufacturingLicenseNo"
                                name="manufacturingLicenseNo"
                                type="text"
                                onChange={handleChange}
                                value={values.manufacturingLicenseNo}
                                autoComplete="manufacturingLicenseNo"
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "manufacturingLicenseNo",
                                      e.target.value
                                    );
                                  }
                                  if (e.keyCode == 13)
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
                          <Col lg="3" className="pe-0">
                            <MyTextDatePicker
                              className="co_date"
                              name="manufacturingLicenseExpiry"
                              id="manufacturingLicenseExpiry"
                              placeholder="DD/MM/YYYY"
                              dateFormat="DD/MM/YYYY"
                              autoComplete="manufacturingLicenseExpiry"
                              value={values.manufacturingLicenseExpiry}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode === 9) {
                                  // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                    } else if (
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
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
                                          e.preventDefault();
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: ` Expiry of Your Lisence in ${daysDifference} Days`,
                                            is_timeout: false,
                                            is_button_show: true,
                                            // delay: 2000,
                                          });
                                          document
                                            .getElementById(
                                              "manufacturingLicenseNo"
                                            )
                                            .focus();
                                        }
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
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
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
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
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "website");
                                    } else if (
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
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
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
                                        this.handleKeyDown(e, "website");
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
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
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
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
                                } else if (e.keyCode === 13) {
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "website");
                                    } else if (
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
                                    } else if (
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

                                      if (
                                        cDate.getTime() <= expDate.getTime()
                                      ) {
                                        let daysDifference =
                                          (expDate.getTime() -
                                            cDate.getTime()) /
                                          86400000;
                                        if (
                                          cDate.getTime() <=
                                            expDate.getTime() &&
                                          daysDifference <= 90
                                        ) {
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
                                        this.handleKeyDown(e, "website");
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Expiry Date should be greater than Current Date",
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
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
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
                              }}
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
                                className="co_text_box"
                                placeholder="Website"
                                type="text"
                                onChange={handleChange}
                                name="website"
                                id="website"
                                value={values.website}
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "website",
                                      e.target.value
                                    );
                                  }
                                  if (e.keyCode == 13)
                                    this.handleKeyDown(e, "email");
                                }}
                                autoComplete="website"
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
                                className="co_text_box"
                                placeholder="E-mail"
                                type="text"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "email",
                                      e.target.value
                                    );
                                  }
                                  if (e.shiftKey && e.keyCode === 9) {
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
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
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
                                      this.handleKeyDown(e, "mobileNumber");
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
                                        document
                                          .getElementById("email")
                                          .focus();
                                      }, 1000);
                                    } else
                                      this.handleKeyDown(e, "mobileNumber");
                                  }
                                }}
                                value={values.email}
                                autoComplete="emailId1"
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
                                className="co_text_box ps-1 pe-1"
                                placeholder="Mobile No."
                                id="mobileNumber"
                                name="mobileNumber"
                                autoComplete="mobileNumber"
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
                                  if (e.shiftKey && e.keyCode === 9) {
                                    let mob = e.target.value.trim();

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
                                    e.preventDefault();
                                    let mob = e.target.value.trim();
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
                                    } else
                                      this.handleKeyDown(e, "whatsappNumber");
                                  } else if (e.keyCode === 13) {
                                    let mob = e.target.value.trim();
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
                                    } else
                                      this.handleKeyDown(e, "whatsappNumber");
                                  }
                                }}
                                value={values.mobileNumber}
                                maxLength={10}
                                minLength={10}
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
                                className="co_text_box"
                                placeholder="Whatsapp No."
                                name="whatsappNumber"
                                id="whatsappNumber"
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode === 9) {
                                    let mob = e.target.value.trim();

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
                                          .getElementById("whatsappNumber")
                                          .focus();
                                      }, 1000);
                                    }
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    let mob = e.target.value.trim();
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
                                    } else this.currencyRef.current?.focus();
                                  } else if (e.keyCode === 13) {
                                    let mob = e.target.value.trim();
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
                                    } else this.currencyRef.current?.focus();
                                  }
                                }}
                                autoComplete="whatsappNumber"
                                onChange={handleChange}
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
                          <Col lg="3" className="pe-0">
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
                                ref={this.currencyRef}
                                value={values.currency}
                                options={Currencyopt}
                                styles={companystyle}
                                // @prathmesh @gstn enter validation start
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode == 9) {
                                  } else if (e.keyCode == 9) {
                                    e.preventDefault();
                                    if (
                                      values.gstIn != "" &&
                                      GSTINREX.test(values.gstIn)
                                    ) {
                                      this.handleKeyDown(e, "gstIn");
                                    } else {
                                      this.handleKeyDown(e, "gstApplicable");
                                    }
                                  } else if (e.keyCode == 13) {
                                    if (
                                      values.gstIn != "" &&
                                      GSTINREX.test(values.gstIn)
                                    ) {
                                      this.handleKeyDown(e, "gstIn");
                                    } else {
                                      this.handleKeyDown(e, "gstApplicable");
                                    }
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Row>
                  <Row className="mt-2">
                    <Col lg="3" className="GST_col_width">
                      <Row className="">
                        <Col lg="8">
                          <Form.Label className="">GST Applicable</Form.Label>
                        </Col>
                        <Col lg="4" className="mt-1">
                          <Form.Check
                            disabled={
                              values.gstIn != "" && GSTINREX.test(values.gstIn)
                                ? true
                                : false
                            }
                            label={values.gstApplicable == true ? "Yes" : "No"}
                            type="switch"
                            // className="gst-checkbox"
                            id="gstApplicable"
                            name="gstApplicable"
                            onChange={(e) => {
                              this.gstFieldshow(e.target.checked);
                              setFieldValue("gstApplicable", e.target.checked);
                            }}
                            value={values.gstApplicable}
                            className="ms-auto my-auto"
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                if (values.gstApplicable == true) {
                                  this.handleKeyDown(e, "gstIn");
                                } else {
                                  this.handleKeyDown(e, "multiBranch");
                                }
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>

                    {values.gstApplicable == true ? (
                      <Col lg="6" className="gst_true">
                        <Row>
                          <Col lg="1">
                            <Form.Label>
                              GSTIN<span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col lg="3">
                            <Form.Group>
                              <Form.Control
                                autoComplete="gstIn"
                                // className="co_text_box"
                                placeholder="GSTIN"
                                name="gstIn"
                                id="gstIn"
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
                                className={`${
                                  errorArrayBorder[2] == "Y"
                                    ? "border border-danger co_text_box"
                                    : "co_text_box"
                                }`}
                                onKeyDown={(e) => {
                                  let data = e.target.value;
                                  let gstStateCode = data.substring(0, 2);

                                  if (e.shiftKey && e.keyCode === 9) {
                                    if (e.target.value.trim() === "")
                                      this.setErrorBorder(2, "");
                                    else {
                                      if (GSTINREX.test(values.gstIn)) {
                                        return true;
                                      } else {
                                        this.setErrorBorder(2, "Y");
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
                                  } else if (e.keyCode === 13) {
                                    if (e.target.value.trim() === "") {
                                      this.setErrorBorder(2, "Y");
                                    } else if (
                                      e.target.value.trim() !== "" &&
                                      GSTINREX.test(e.target.value.trim()) &&
                                      gstStateCode == stateCodeData
                                    ) {
                                      this.setErrorBorder(2, "");
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
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    if (e.target.value.trim() === "") {
                                      this.setErrorBorder(2, "Y");
                                    } else if (
                                      e.target.value.trim() !== "" &&
                                      GSTINREX.test(e.target.value.trim()) &&
                                      gstStateCode == stateCodeData
                                    ) {
                                      this.setErrorBorder(2, "");
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
                          </Col>
                          <Col lg="1" className="p-0 col-width">
                            <Form.Label>
                              GST Type<span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col lg="3" className="pe-4">
                            <Form.Group
                              style={{ borderRadius: "4px" }}
                              className={`${
                                values.gstType == "" &&
                                errorArrayBorder[3] == "Y"
                                  ? "border border-danger selectTo"
                                  : "selectTo"
                              }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode === 9) {
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  this.handleKeyDown(e, "gstApplicableDate");
                                } else if (e.keyCode === 13) {
                                  this.handleKeyDown(e, "gstApplicableDate");
                                }
                              }}
                            >
                              <Select
                                // ref={this.selectRefA}
                                ref={this.gsttypeRef}
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
                              {/* <span className="text-danger errormsg">
                                {errors.gstType}
                              </span> */}
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
                                if (e.shiftKey && e.keyCode === 9) {
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.gsttypeRef.current?.focus();
                                    } else if (
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
                                          .getElementById("gstApplicableDate")
                                          .focus();
                                      }, 1300);
                                    } else if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      this.gsttypeRef.current?.focus();
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("gstApplicableDate")
                                          .focus();
                                      }, 1300);
                                    }
                                  }
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "multiBranch");
                                    } else if (
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
                                          .getElementById("gstApplicableDate")
                                          .focus();
                                      }, 1300);
                                    } else if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      this.handleKeyDown(e, "multiBranch");
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("gstApplicableDate")
                                          .focus();
                                      }, 1300);
                                    }
                                  }
                                } else if (e.keyCode == 13) {
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "multiBranch");
                                    } else if (
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
                                          .getElementById("gstApplicableDate")
                                          .focus();
                                      }, 1300);
                                    } else if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      this.handleKeyDown(e, "multiBranch");
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid Date",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("gstApplicableDate")
                                          .focus();
                                      }, 1300);
                                    }
                                  }
                                }
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.gstApplicableDate}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    ) : (
                      ""
                    )}

                    {/* <Row className="mt-1"> */}
                    <Col lg="3">
                      <Row className="">
                        <Col md="4">
                          <Form.Label>Multi Branch</Form.Label>
                        </Col>
                        <Col md="8" className="mt-1">
                          <Form.Check
                            type="switch"
                            name="multiBranch"
                            id="multiBranch"
                            label={values.multiBranch == true ? "Yes" : "No"}
                            onChange={(e) => {
                              this.gstFieldshow(e.target.checked);
                              setFieldValue("multiBranch", e.target.checked);
                            }}
                            value={values.multiBranch}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.handleKeyDown(e, "fullName");
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                    {/* </Row> */}
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
                                autoComplete="fullName"
                                type="text"
                                placeholder="Full Name"
                                name="fullName"
                                className="co_text_box"
                                id="fullName"
                                onKeyPress={(e) => {
                                  OnlyAlphabets(e);
                                }}
                                onChange={handleChange}
                                value={values.fullName}
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "fullName",
                                      e.target.value
                                    );
                                  }

                                  if (e.shiftKey && e.keyCode === 9) {
                                  } else if (e.keyCode === 13) {
                                    this.handleKeyDown(e, "emailId");
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    this.handleKeyDown(e, "emailId");
                                  }
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
                              autoComplete="emailId"
                              className="co_text_box"
                              placeholder="Email"
                              id="emailId"
                              name="emailId"
                              type="text"
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (
                                  (e.shiftKey && e.keyCode === 9) ||
                                  e.keyCode === 9 ||
                                  e.keyCode === 13
                                ) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "emailId",
                                    e.target.value
                                  );
                                }

                                if (e.shiftKey && e.keyCode === 9) {
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
                                  } else {
                                  }
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
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
                                  } else this.handleKeyDown(e, "contactNumber");
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
                                      document
                                        .getElementById("emailId")
                                        .focus();
                                    }, 1000);
                                  } else this.handleKeyDown(e, "contactNumber");
                                }
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
                                autoComplete="contactNumber"
                                type="text"
                                placeholder="Mobile No."
                                className="co_text_box ps-1 pe-1"
                                name="contactNumber"
                                id="contactNumber"
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode === 9) {
                                    let mob = e.target.value.trim();
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
                                          .getElementById("contactNumber")
                                          .focus();
                                      }, 1000);
                                    }
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    let mob = e.target.value.trim();

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
                                          .getElementById("contactNumber")
                                          .focus();
                                      }, 1000);
                                    } else this.handleKeyDown(e, "userDob");
                                  } else if (e.keyCode === 13) {
                                    let mob = e.target.value.trim();

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
                                          .getElementById("contactNumber")
                                          .focus();
                                      }, 1000);
                                    } else this.handleKeyDown(e, "userDob");
                                  }
                                }}
                                maxLength={10}
                                onChange={handleChange}
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
                                if (e.shiftKey && e.keyCode === 9) {
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "contactNumber");
                                    } else if (
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
                                    } else if (
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
                                      if (
                                        cDate.getTime() >= expDate.getTime()
                                      ) {
                                        this.handleKeyDown(e, "contactNumber");
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Birth date can't be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
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
                                        msg: "Invalid Date",
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("userDob")
                                          .focus();
                                      }, 1000);
                                    }
                                  }
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "gender1");
                                    } else if (
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
                                    } else if (
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
                                      if (
                                        cDate.getTime() >= expDate.getTime()
                                      ) {
                                        this.handleKeyDown(e, "gender1");
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Birth date can't be greater than Current Date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1000,
                                        });
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
                                        msg: "Invalid Date",
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("userDob")
                                          .focus();
                                      }, 1000);
                                    }
                                  }
                                } else if (e.keyCode === 13) {
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    let datchco = e.target.value.trim();
                                    if (datchco === "__/__/____") {
                                      this.handleKeyDown(e, "gender1");
                                    } else if (
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
                                    } else if (
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
                                      if (
                                        cDate.getTime() >= expDate.getTime()
                                      ) {
                                        this.handleKeyDown(e, "gender1");
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Birth date can't be greater than Current Date",
                                          is_timeout: true,
                                          delay: 1000,
                                        });
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
                                        msg: "Invalid Date",
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      setTimeout(() => {
                                        document
                                          .getElementById("userDob")
                                          .focus();
                                      }, 1000);
                                    }
                                  }
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
                                if (e.shiftKey && e.keyCode === 9) {
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  this.handleKeyDown(e, "usercode");
                                } else if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "usercode");
                                }
                              }}
                            >
                              <Form.Check
                                type="radio"
                                ref={this.radioRef}
                                label="Male"
                                name="gender"
                                id="gender1"
                                value="male"
                                checked={values.gender == "male" ? true : false}
                                onChange={handleChange}
                              />
                              <Form.Check
                                type="radio"
                                label="Female"
                                name="gender"
                                id="gender2"
                                value="female"
                                className=""
                                checked={
                                  values.gender == "female" ? true : false
                                }
                                onChange={handleChange}
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
                                autoComplete="usercode"
                                type="text"
                                // className="co_text_box"
                                placeholder="Username"
                                id="usercode"
                                name="usercode"
                                onChange={handleChange}
                                value={values.usercode}
                                className={`${
                                  errorArrayBorder[4] == "Y"
                                    ? "border border-danger co_text_box"
                                    : "co_text_box"
                                }`}
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "usercode",
                                      e.target.value
                                    );
                                  }

                                  if (e.shiftKey && e.keyCode === 9) {
                                    if (e.target.value.trim())
                                      this.setErrorBorder(4, "");
                                    else {
                                      this.setErrorBorder(4, "Y");
                                    }
                                  } else if (e.keyCode === 9) {
                                    e.preventDefault();
                                    if (e.target.value.trim() !== "") {
                                      this.setErrorBorder(4, "");

                                      this.validateUserDuplicate(
                                        values.usercode,
                                        setFieldValue
                                      );

                                      this.handleKeyDown(e, "password");
                                    }
                                  } else if (e.keyCode === 13) {
                                    if (e.target.value.trim() !== "") {
                                      this.setErrorBorder(4, "");
                                      this.validateUserDuplicate(
                                        values.usercode,
                                        setFieldValue
                                      );

                                      this.handleKeyDown(e, "password");
                                    } else e.preventDefault();
                                  }
                                }}
                              />
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
                              <InputGroup className=" ">
                                <Form.Control
                                  autoComplete="password"
                                  // className="password-style"
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
                                  className={`${
                                    errorArrayBorder[5] == "Y"
                                      ? "border border-danger password-style"
                                      : "password-style"
                                  }`}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode === 9) {
                                      if (e.target.value.trim() === "") {
                                        this.setErrorBorder(5, "Y");
                                      } else {
                                        this.setErrorBorder(5, "");
                                      }
                                    } else if (e.keyCode === 9) {
                                      e.preventDefault();
                                      if (e.target.value === "") {
                                      } else {
                                        this.setErrorBorder(5, "");
                                        document
                                          .getElementById("pwd_eye")
                                          .focus();
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (e.target.value === "") {
                                        e.preventDefault();
                                      } else {
                                        this.setErrorBorder(5, "");
                                        document
                                          .getElementById("pwd_eye")
                                          .focus();
                                      }
                                    }
                                  }}
                                />
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
                        {/* {JSON.stringify(userControlData, undefined, 2)} */}
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
                                  checked={this.SelectionChangeCheck(v.slug)}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                                {v.is_label && parseInt(v.value) == 1 && (
                                  <>
                                    {v.slug === "is_level_a" && (
                                      <Form.Control
                                        autoFocus="true"
                                        className="control_text_box levelA"
                                        placeholder="Enter"
                                        name={`${v.slug}-label`}
                                        id={`${v.slug}-label`}
                                        onChange={(e) => {
                                          this.handleLabelChange(
                                            v.slug,
                                            e.target.value,
                                            i
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
                                      />
                                    )}

                                    {v.slug === "is_level_b" &&
                                      v.value === 1 && (
                                        <Form.Control
                                          type="text"
                                          autoFocus="true"
                                          className="control_text_box"
                                          placeholder="Enter"
                                          name={`${v.slug}-label`}
                                          id={`${v.slug}-label`}
                                          onChange={(e) => {
                                            this.handleLabelChange(
                                              v.slug,
                                              e.target.value,
                                              i
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
                                        />
                                      )}
                                    {v.slug === "is_level_c" &&
                                      v.value === 1 && (
                                        <Form.Control
                                          type="text"
                                          autoFocus="true"
                                          className="control_text_box"
                                          placeholder="Enter"
                                          name={`${v.slug}-label`}
                                          id={`${v.slug}-label`}
                                          onChange={(e) => {
                                            this.handleLabelChange(
                                              v.slug,
                                              e.target.value,
                                              i
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
                      className="successbtn-style  me-2"
                      type="button"
                      id="submit"
                      onKeyDown={(e) => {
                        if (e.shiftKey && e.keyCode === 9) {
                        } else if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.ref.current.handleSubmit();
                        }
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        this.ref.current.handleSubmit();
                      }}
                    >
                      Submit
                    </Button>

                    <Button
                      id="cancel"
                      type="button"
                      variant="secondary cancel-btn ms-2"
                      onClick={(e) => {
                        e.preventDefault();
                        MyNotifications.fire({
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to Cancel",
                          is_button_show: false,
                          is_timeout: false,
                          delay: 0,
                          handleSuccessFn: () => {
                            eventBus.dispatch("page_change", {
                              from: "newCompany",
                              to: "companyList",
                              isNewTab: false,
                              isCancel: true,
                              prop_data: {
                                rowId: 0,
                              },
                            });
                          },
                          handleFailFn: () => {},
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          MyNotifications.fire({
                            show: true,
                            icon: "confirm",
                            title: "Confirm",
                            msg: "Do you want to Cancel",
                            is_button_show: false,
                            is_timeout: false,
                            delay: 0,
                            handleSuccessFn: () => {
                              eventBus.dispatch("page_change", {
                                from: "newCompany",
                                to: "companyList",
                                isNewTab: false,
                                isCancel: true,
                                prop_data: {
                                  rowId: 0,
                                },
                              });
                            },
                            handleFailFn: () => {},
                          });
                        }
                      }}
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
          <Col md="2" className="px-0">
            {/* <Form.Label className="btm-label">
              <img src={keyboard} className="svg-style mt-0 mx-2"></img>
              New entry: <span className="shortkey">Ctrl + N</span>
            </Form.Label> */}
          </Col>
          <Col md="8">
            {/* <Form.Label className="btm-label">
              Duplicate: <span className="shortkey">Ctrl + D</span>
            </Form.Label> */}
          </Col>
          {/* <Col md="8"></Col> */}
          <Col md="2" className="text-end">
            {/* <img src={question} className="svg-style ms-1"></img> */}
          </Col>
        </Row>
      </div>
    );
  }
}
