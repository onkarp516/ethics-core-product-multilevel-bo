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
  EMAILREGEXP,
  GSTINREX,
  eventBus,
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
  validateCompanyUpdate,
  getAllMasterAppConfig,
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

export default class NewCompanyEdit extends React.Component {
  constructor(props) {
    super(props);

    const curDate = new Date();
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

    this.state = {
      countryOpt: [],
      GSTopt: [],
      orgData: [],
      userControlData: [],
      showPassword: false,
      gstshow: false,
      isEditDataSet: false,
      tabVisible: false,
      data: [],
      edit_data: "",
      checkAddress: false,
      areaOpt: [],
      corporateareaOpt: [],
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
        sameAsAddress: false,
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
      },
      errorArrayBorder: "",

      oldPinCode: "",
      oldCorPinCode: "",
    };
  }
  gstFieldshow = (status) => {
    this.setState({ gstApplicable: status });
  };

  togglePasswordVisiblity = (status) => {
    this.setState({ showPassword: status });
  };
  pageReload = () => {
    this.componentDidMount();
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
          this.ref.current.setFieldValue("gstType", opt[0]);
        }
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

  setEditData = () => {
    let {
      edit_data,
      countryOpt,
      prop_data,
      isDataSet,
      GSTopt,
      isEditDataSet,
      checkAddress,
      areaOpt,
      corporateareaOpt,
    } = this.state;

    let reqData = new FormData();
    reqData.append("id", edit_data.id);
    reqData.append("userId", edit_data.userId);
    getCompanyById(reqData)
      .then((response) => {
        let res = response.data;
        // console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // console.log("d--", d);
          let p = moment(d.gstApplicableDate, "YYYY-MM-DD").toDate();
          // this.getPincodeData(d.pincode);
          let opt = [];
          if (d.area != "") {
            opt = d.area_list.map((v) => {
              return { value: v.area_id, label: v.area_name };
            });
            // console.log("areaOpt--->", areaOpt);
            this.setState({ areaOpt: opt });
          }
          let corporateopt = [];
          if (d.corporatearea != "") {
            corporateopt = d.corporate_area_list.map((vi) => {
              return {
                value: vi.corporate_area_id,
                label: vi.corporate_area_name,
              };
            });
            // console.log("corporateareaOpt--->", corporateopt);
            this.setState({ corporateareaOpt: corporateopt });
          }

          let initVal = {
            id: d.companyId,
            userId: d.userId,
            companyName: d.companyName ? d.companyName : "",
            companyCode: d.companyCode ? d.companyCode : "",
            licenseNo: d.licenseNo ? d.licenseNo : "",
            // licenseExpiryDate: d.licenseExpiryDate ? d.licenseExpiryDate : "",
            foodLicenseNo: d.foodLicenseNo ? d.foodLicenseNo : "",
            // foodLicenseExpiryDate: d.foodLicenseExpiryDate
            //   ? moment(
            //       new Date(
            //         moment(d.foodLicenseExpiryDate, "YYYY-MM-DD").toDate()
            //       )
            //     ).format("DD/MM/YYYY")
            //   : "",
            foodLicenseExpiryDate:
              d.foodLicenseExpiryDate != ""
                ? moment(
                  new Date(
                    moment(d.foodLicenseExpiryDate, "YYYY-MM-DD").toDate()
                  )
                ).format("DD/MM/YYYY")
                : "",
            manufacturingLicenseNo: d.manufacturingLicenseNo
              ? d.manufacturingLicenseNo
              : "",
            manufacturingLicenseExpiry: d.manufacturingLicenseExpiry
              ? moment(
                new Date(
                  moment(d.manufacturingLicenseExpiry, "YYYY-MM-DD").toDate()
                )
              ).format("DD/MM/YYYY")
              : "",
            natureOfBusiness: d.natureOfBusiness ? d.natureOfBusiness : "",
            registeredAddress: d.registeredAddress ? d.registeredAddress : "",
            corporateAddress: d.corporateAddress ? d.corporateAddress : "",
            corporatePincode: d.corporatePincode ? d.corporatePincode : "",
            sameAsAddress: d.sameAsAddress ? d.sameAsAddress : false,
            tradeOfBusiness: d.tradeOfBusiness ? d.tradeOfBusiness : "",
            pincode: d.pincode ? d.pincode : "",
            mobileNumber: d.mobileNumber ? d.mobileNumber : "",
            whatsappNumber: d.whatsappNumber ? d.whatsappNumber : "",
            // place: d.place ? d.place : "",
            email: d.email ? d.email : "",
            website: d.website ? d.website : "",
            countryId:
              d.countryId != ""
                ? getSelectValue(countryOpt, parseInt(d.countryId))
                : "",
            // stateId: d.stateId ? getSelectValue(stateOpt, d.stateId) : "",
            currency: d.currency ? getSelectValue(Currencyopt, d.currency) : "",
            gstApplicable: d.gstApplicable === false ? false : true,
            multiBranch: d.multiBranch === false ? false : true,
            // district: d.district ? d.district : "",
            gstIn: d.gstIn ? d.gstIn : d.stateCode,
            gstType: d.gstType ? getSelectValue(GSTopt, d.gstType) : "",
            route: d.route ? d.route : "",
            gstApplicableDate: d.gstApplicableDate
              ? moment(
                new Date(moment(d.gstApplicableDate, "YYYY-MM-DD").toDate())
              ).format("DD/MM/YYYY")
              : "",

            corporatecity: d.corporatecity ? d.corporatecity : "",
            corporatestateName: d.corporatestate ? d.corporatestate : "",

            city: d.city ? d.city : "",
            stateName: d.state ? d.state : "",
            stateCode: d.stateCode ? d.stateCode : "",
            uploadImage: d.uploadImage ? d.uploadImage : "",
            corporatestate: d.corporatestate ? d.corporatestate : "",

            licenseExpiryDate: d.licenseExpiryDate
              ? moment(
                new Date(moment(d.licenseExpiryDate, "YYYY-MM-DD").toDate())
              ).format("DD/MM/YYYY")
              : "",
            gstTransferDate: d.gstTransferDate
              ? moment(
                new Date(moment(d.gstTransferDate, "YYYY-MM-DD").toDate())
              ).format("DD/MM/YYYY")
              : "",
            fullName: d.fullName ? d.fullName : "",
            // contactNumber: d.contactNumber ? d.contactNumber : "",
            userRole: "CADMIN",
            userDob: d.userDob
              ? moment(
                new Date(moment(d.userDob, "YYYY-MM-DD").toDate())
              ).format("DD/MM/YYYY")
              : "",
            userDoa: d.userDoa
              ? moment(
                new Date(moment(d.userDoa, "YYYY-MM-DD").toDate())
              ).format("DD/MM/YYYY")
              : "",
            emailId: d.emailId ? d.emailId : "",
            gender: d.gender ? d.gender : "",
            usercode: d.usercode ? d.usercode : "",
            // areaId: d.area != "" ? getSelectValue(areaOpt, d.area) : "",
            // corporateareaId: d.corporatearea != "" ? getSelectValue(corporateareaOpt, d.corporatearea) : "",
            password: "",
            manageOutlets: "",
            Search: "",
          };
          // console.log("initVal.emailId", initVal);
          // initVal["areaId"] = d.areaId ? d.areaId : "";
          if (d.area != "") {
            initVal["areaId"] =
              d.area != "" ? getSelectValue(areaOpt, d.area) : "";
          }
          if (d.corporatearea != "") {
            initVal["corporateareaId"] =
              d.corporatearea != ""
                ? getSelectValue(corporateopt, d.corporatearea)
                : "";
          }

          if (d.gstApplicable == true) {
            initVal["gstIn"] = d.gstIn ? d.gstIn : "";
            // initVal["gstApplicableDate"] = d.gstApplicableDate
            //   ? new Date(d.gstApplicableDate)
            //   : "";
            initVal["gstApplicableDate"] =
              d.gstApplicableDate != ""
                ? moment(new Date(p)).format("DD/MM/YYYY")
                : "";
            initVal["gstType"] = d.gstType
              ? GSTopt.find((v) => v.value == d.gstType)
              : "";

            // console.log(
            //   "initVal[gstApplicableDate] ",
            //   initVal["gstApplicableDate"]
            // );
          }

          // console.log("initVal>>>>>>>>>>>>>>>>", initVal);
          this.setState(
            {
              oldPinCode: d.pincode ? d.pincode : "",
              isEditDataSet: true,
              CompanyInitVal: initVal,
              stateCodeData: d.gstIn ? d.gstIn.substring(0, 2) : d.stateCode,
            },
            () => { }
          );
        } else {
          this.setState({ isEditDataSet: true });
        }
        // console.log("response", response);
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
        userRole: "CADMIN",
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
      .catch((error) => { });
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
          // setFieldValue("pincode", "");
          if (this.ref.current.values.sameAsAddress == true) {
            this.ref.current.setFieldValue("corporateareaId", "");
            this.ref.current.setFieldValue("corporatestateName", "  ");
            this.ref.current.setFieldValue("corporatestateCode", "");
            this.ref.current.setFieldValue("corporatecity", "");
            // this.ref.current.setFieldValue("corporatePincode", "");
          }

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
  componentDidMount() {
    if (AuthenticationCheck()) {
      // this.lstState();
      // this.lstCountry();
      // this.listGetCompany();
      this.listGSTTypes();
      this.setInitValues();
      this.getAllMasterAppConfig();
      const { prop_data } = this.props.block;
      // console.log("propdatas", { prop_data });
      this.lstCountry();
      // if ("source" in prop_data) {
      this.setState({ edit_data: prop_data.prop_data });

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

  componentDidUpdate() {
    const { GSTopt, edit_data, isEditDataSet } = this.state;
    // console.log(
    //   "GSTopt, edit_data, isEditDataSet ",
    //   GSTopt,
    //   edit_data,
    //   isEditDataSet
    // );

    if (GSTopt.length > 0 && isEditDataSet == false && edit_data != "") {
      // console.log("componentDidUpdate call", GSTopt.length);
      this.setEditData();
    }
  }

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
      .catch((error) => { });
  };

  handleSelectionChange = (slug, value) => {
    // console.log("slug", slug);
    console.log("value", value);
    let { userControlData } = this.state;
    // console.log("userControlData", userControlData);
    // let fObj = userControlData.find((v) => v.slug == slug);
    // if (fObj) {
    //   fObj.value = value;
    // }

    // let fUserControlData = [...userControlData, fObj];
    userControlData = userControlData.map((v) => {
      if (v.slug == slug) {
        v.value = value;
      }

      return v;
    });

    this.setState({ userControlData: userControlData }, () => {
      // console.log("userControlData", userControlData);
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
          FCompanyInitVal["currency"] = Currencyopt[0];
          this.setState({ CompanyInitVal: FCompanyInitVal });
        });
        this.ref.current.setFieldValue("currency", Currencyopt[0]);
      })
      .catch((error) => {
        console.log("error", error);
      });
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
          // console.log("Area--->", opt);
          let gstOldValue = "";
          if (document.getElementById("gstIn") != null) {
            gstOldValue = document.getElementById("gstIn").value;
            // console.warn("gstOldValue->>>>>>>>>", gstOldValue.substring(2));
          }

          if (oldPinCode != pincode)
            this.ref.current.setFieldValue("areaId", opt[0]);

          // console.log(
          //   "this.ref.current.sameAsAddress==true",
          //   this.ref.current.values
          // );
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
  getCorporatePincodeData = (pincode, setFieldValue) => {
    let { oldCorPinCode } = this.state;
    let reqData = new FormData();
    reqData.append("pincode", pincode);
    getPincodeData(reqData)
      .then((response) => {
        let res = response.data;
        // console.log("res-->", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          setFieldValue("corporatecity", res.responseObject[0].district);
          setFieldValue("corporatestateName", res.responseObject[0].state);
          setFieldValue("corporatestateCode", res.responseObject[0].stateCode);
          let opt = d.map((v) => {
            return { label: v.area, value: v.id };
          });
          // this.ref.current.setFieldValue("corporateareaId", opt[0]);
          // @prathmesh @select area from list and click on same as address then same area can't be auto selected start
          if (this.ref.current.values.sameAsAddress == true) {
            // this.ref.current.setFieldValue("corporateareaId", opt[0]);
          } else {
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

  // @Vinit @validation for company name
  validateCompanyDuplicate = (id, companyName) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("companyName", companyName);
    validateCompanyUpdate(reqData)
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
          // setFieldValue("companyName", "");
          setTimeout(() => {
            document.getElementById("companyName").focus();
          }, 1300);
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

  render() {
    const {
      handleSelectionChange,
      handleLabelChange,
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
      gstApplicable,
      userControlData,
      areaOpt,
      corporateareaOpt,
      errorArrayBorder,
      previewImage,
      stateCodeData,
    } = this.state;
    return (
      <div>
        <div className="newcompanycreate">
          <Formik
            innerRef={this.ref}
            enableReinitialize={true}
            initialValues={CompanyInitVal}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //! validation required start

              let errorArray = [];
              if (values.companyName.trim() == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.pincode.trim() == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.gstApplicable) {
                if (values.gstIn == "") {
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

              //! validation required end

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  // debugger;
                  MyNotifications.fire({
                    show: true,
                    icon: "confirm",
                    title: "Confirm",
                    msg: "Do you want to Update ?",
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
                          // v !== "stateId" &&
                          v !== "countryId" &&
                          v !== "currency" &&
                          v !== "gstType" &&
                          v !== "gstApplicableDate" &&
                          v !== "licenseExpiryDate" &&
                          v !== "foodLicenseExpiryDate" &&
                          v !== "manufacturingLicenseExpiry" &&
                          v !== "gstTransferDate" &&
                          v !== "userDob" &&
                          v !== "userDoa" &&
                          v !== "areaId" &&
                          v !== "corporateareaId"
                        ) {
                          requestData.append(v, values[v]);
                        }
                      });

                      requestData.append(
                        "gstApplicable",
                        values.gstApplicable && values.gstApplicable === true
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
                      // requestData.append(
                      //   "userControlData",
                      //   JSON.stringify(userControlData)
                      // );

                      // requestData.append("stateId", values.stateId.value);
                      requestData.append("countryId", values.countryId.value);
                      requestData.append("stateCode", values.stateCode);
                      requestData.append("uploadImage", values.uploadImage);
                      // if (values.uploadImage != "") {
                      //   requestData.append("uploadImage", values.uploadImage);
                      // }
                      requestData.append("city", values.city);
                      requestData.append("corporatecity", values.corporatecity);
                      requestData.append(
                        "corporatestateCode",
                        values.corporatestateCode
                      );
                      // requestData.append("countryId", values.countryId.value);
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
                        // console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                      }

                      updateCompany(requestData)
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
                              delay: 500,
                            });
                            resetForm();
                            this.pageReload();
                            this.componentDidMount();
                            // eventBus.dispatch("page_change", "companyList");
                            eventBus.dispatch("page_change", {
                              from: "newCompanyEdit",
                              to: "companyList",
                              prop_data: {
                                editId: this.state.edit_data.id,
                                rowId: this.props.block.prop_data.rowId,
                              },
                            });
                          }
                        })
                        .catch((error) => {
                          setSubmitting(false);
                          // MyNotifications.fire({
                          //   show: true,
                          //   icon: "error",
                          //   title: "Error",
                          //   msg: "Error While Updating Outlet",
                          //   is_timeout: true,
                          //   delay: 1000,
                          // });
                        });
                    },
                    handleFailFn: () => {
                      setSubmitting(false);
                    },
                  });
                }
              });
            }}
            validateOnChange={false}
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
                              className="co_text_box ps-1 pe-1"
                              type="text"
                              autoComplete="companyCode"
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
                                  // e.preventDefault();
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
                        <Col lg="2" className="">
                          <Form.Label>
                            Name <span className="text-danger">*</span>
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
                              className={`${values.companyName == "" &&
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
                                  // e.preventDefault();
                                  if (e.target.value.trim()) {
                                    this.validateCompanyDuplicate(
                                      values.id,
                                      values.companyName
                                    );
                                    this.setErrorBorder(0, "");
                                    this.handleKeyDown(e, "Manufaturer");
                                  } else e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  if (e.target.value.trim()) {
                                    this.validateCompanyDuplicate(
                                      values.id,
                                      values.companyName
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
                                // e.preventDefault();
                                this.handleKeyDown(e, "natureOfBusiness");
                              } else if (e.keyCode === 13) {
                                this.handleKeyDown(e, "natureOfBusiness");
                              }
                            }}
                          >
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
                              onKeyDown={(e) => {
                                this.handleKeyDown(e, "natureOfBusiness");
                              }}
                            />
                            <Form.Check
                              type="radio"
                              label="Distributor"
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
                              label="Manufacturer"
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
                              autoComplete="natureOfBusiness"
                              className="co_text_box"
                              placeholder="Nature Of Business"
                              id="natureOfBusiness"
                              name="natureOfBusiness"
                              value={values.natureOfBusiness}
                              onChange={handleChange}
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
                                  // e.preventDefault();
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
                          <Form.Label>Update Image</Form.Label>
                        </Col>
                        <Col lg="8" className="pe-4">
                          <Form.Group controlId="formGridEmail">
                            <Form.Control
                              type="file"
                              className="password-style"
                              id="uploadImage"
                              name="uploadImage"
                              // onChange={(e) => {
                              //   setFieldValue("uploadImage", e.target.files[0]);
                              // }}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                } else if (e.keyCode == 9) {
                                  // e.preventDefault();
                                  this.handleKeyDown(e, "registeredAddress");
                                } else if (e.keyCode == 13)
                                  this.handleKeyDown(e, "registeredAddress");
                              }}
                              onChange={(e) => {
                                const selectedImage = e.target.files[0];
                                setFieldValue("uploadImage", selectedImage);
                                if (selectedImage) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    this.setState({
                                      selectedImage,
                                      previewImage: e.target.result,
                                    });
                                  };
                                  reader.readAsDataURL(selectedImage);
                                }
                              }}
                            />

                            {/* {JSON.stringify(values.uploadImage)} */}
                          </Form.Group>
                          <label
                            className="custom-file-label custombrowseclass"
                            htmlFor="uploadImage"
                          >
                            {values.uploadImage ? "FILE SELECTED" : ""}
                          </label>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
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
                                  autoComplete="registeredAddress"
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
                                      // e.preventDefault();
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
                                    Pincode{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                </Col>
                                <Col lg="6" md={6} sm={6} xs={6}>
                                  <Form.Group>
                                    <Form.Control
                                      // className="co_text_box"
                                      placeholder="Pincode"
                                      type="text"
                                      autoComplete="pincode"
                                      id="pincode"
                                      name="pincode"
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

                                          setFieldValue(
                                            "corporateareaId",
                                            getSelectValue(
                                              areaOpt,
                                              values.areaId.value
                                            )
                                          );
                                        }
                                      }}
                                      value={values.pincode}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      maxLength={6}
                                      className={`${values.pincode == "" &&
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
                                    {/* <span className="text-danger errormsg">
                                      {errors.pincode}
                                    </span> */}
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
                                      className="selectTo"
                                      placeholder="Area"
                                      styles={companystyle}
                                      name="areaId"
                                      options={areaOpt}
                                      onChange={(v) => {
                                        if (v != null) {
                                          setFieldValue("areaId", v);
                                          // setFieldValue(
                                          //   "gstIn",
                                          //   areaOpt[0].stateCode
                                          // );
                                          if (values.sameAsAddress == true) {
                                            setFieldValue("corporateareaId", v);
                                          }
                                        } else {
                                          setFieldValue("areaId", "");
                                        }
                                      }}
                                      value={values.areaId}
                                      ref={this.regAreaRef}
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
                            <Col lg="3" md={3} sm={3} xs={3}>
                              <Row>
                                <Col lg="2" className="p-0">
                                  {" "}
                                  <Form.Label>City</Form.Label>
                                </Col>
                                <Col lg={10} className="p-0">
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
                            <Col lg="4" md={4} sm={4} xs={4}>
                              <Row>
                                <Col lg="6" md={6} sm={6} xs={6}>
                                  <Form.Label>State</Form.Label>
                                </Col>
                                <Col
                                  lg="6"
                                  md={6}
                                  sm={6}
                                  xs={6}
                                  className="ps-0"
                                >
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
                                    className="pin_style"
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
                                <Col lg={4} className="">
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
                                      name="countryId"
                                      styles={companystyle}
                                      options={countryOpt}
                                      value={values.countryId}
                                      ref={this.regCountryRef}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(
                                            e,
                                            "sameAsAddress"
                                          );
                                        }
                                        else if (e.keyCode == 9) {
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
                                  {/* </Col>
                                  </Row> */}
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

                        <div className="d-flex">
                          {/* {JSON.stringify(values.sameAsAddress)} */}
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
                                this.getCorporatePincodeData(
                                  values.pincode,
                                  setFieldValue
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
                                setFieldValue(
                                  "sameAsAddress",
                                  e.target.checked
                                );
                                setFieldValue(
                                  "corporateareaId",
                                  getSelectValue(areaOpt, "")
                                );
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
                                // e.preventDefault();
                                if (values.sameAsAddress === true)
                                  this.handleKeyDown(e, "licenseNo");
                                if (values.sameAsAddress === false)
                                  this.handleKeyDown(e, "corporateAddress");
                              }
                            }}
                            checked={
                              values.sameAsAddress === true ? true : false
                            }
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
                                  autoComplete="corporateAddress"
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
                                      // e.preventDefault();
                                      this.handleKeyDown(e, "corporatePincode");
                                    }
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.corporateAddress}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg="4" md={4} sm={4} xs={4}>
                              <Row>
                                <Col lg="6">
                                  <Form.Label>Pincode</Form.Label>
                                </Col>
                                <Col lg="6">
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      className="co_text_box"
                                      placeholder="Pincode"
                                      autoComplete="corporatePincode"
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
                            <Col lg="5" md={5} sm={5} xs={5}>
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
                                      onChange={(v) => {
                                        if (v != null) {
                                          setFieldValue("corporateareaId", v);
                                        } else {
                                          setFieldValue("corporateareaId", "");
                                        }
                                      }}
                                      options={corporateareaOpt}
                                      value={values.corporateareaId}
                                      ref={this.corpAreaRef}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          this.corpCountryRef.current?.focus();
                                        }
                                      }}
                                      invalid={
                                        errors.corporateareaId ? true : false
                                      }
                                      isDisabled={
                                        values.sameAsAddress === true
                                          ? true
                                          : false
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg="3" md={3} sm={3} xs={3}>
                              <Row>
                                <Col lg="2">
                                  <Form.Label>City</Form.Label>
                                </Col>
                                <Col lg="10">
                                  <Form.Control
                                    type="text"
                                    id="corporatecity"
                                    name="corporatecity"
                                    value={values.corporatecity}
                                    readOnly
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      width: "max-content",
                                    }}
                                    tabIndex="-1"
                                    className="p-1 pin_style"
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg="4" md={4} sm={4} xs={4}>
                              <Row>
                                <Col lg="6">
                                  <Form.Label>State</Form.Label>
                                </Col>
                                <Col lg="6">
                                  <Form.Control
                                    type="text"
                                    id="corporatestateName"
                                    name="corporatestateName"
                                    value={values.corporatestateName}
                                    readOnly
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      width: "max-content",
                                    }}
                                    tabIndex="-1"
                                    className="pin_style"
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
                                  <Form.Group className="">
                                    <Select
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      styles={companystyle}
                                      options={countryOpt}
                                      value={values.countryId}
                                      ref={this.corpCountryRef}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(e, "licenseNo");
                                        }
                                      }}
                                      invalid={errors.countryId ? true : false}
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
                                autoComplete="licenseNo"
                                id="licenseNo"
                                name="licenseNo"
                                onChange={handleChange}
                                value={values.licenseNo}
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
                              autoComplete="licenseExpiryDate"
                              id="licenseExpiryDate"
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
                                  // e.preventDefault();
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
                                autoComplete="foodLicenseNo"
                                name="foodLicenseNo"
                                value={values.foodLicenseNo}
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

                                  if (e.keyCode == 13) {
                                    this.handleKeyDown(
                                      e,
                                      "foodLicenseExpiryDate"
                                    );
                                  }
                                }}
                                onChange={handleChange}
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
                              autoComplete="foodLicenseExpiryDate"
                              name="foodLicenseExpiryDate"
                              id="foodLicenseExpiryDate"
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
                                  // e.preventDefault();
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
                            // @vinit@Focus issue so removed from OnBlur and add code in OnKeydown
                            // onBlur={(e) => { }}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="4">
                        <Row>
                          <Col lg="3" className="p-0">
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
                                autoComplete="manufacturingLicenseNo"
                                onChange={handleChange}
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

                                  if (e.keyCode == 13) {
                                    this.handleKeyDown(
                                      e,
                                      "manufacturingLicenseExpiry"
                                    );
                                  }
                                }}
                                value={values.manufacturingLicenseNo}
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
                                  // e.preventDefault();
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
                                className="co_text_box"
                                placeholder="Website"
                                type="text"
                                onChange={handleChange}
                                name="website"
                                autoComplete="website"
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

                                  if (e.keyCode == 13) {
                                    this.handleKeyDown(e, "email");
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
                                autoComplete="emailId1"
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
                                    // e.preventDefault();
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
                                    // e.preventDefault();
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
                                autoComplete="whatsappNumber"
                                onChange={handleChange}
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
                                onBlur={(e) => { }}
                                value={values.whatsappNumber}
                                maxLength={10}
                                minLength={10}
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
                                value={values.currency}
                                options={Currencyopt}
                                styles={companystyle}
                                ref={this.currencyRef}
                                // onKeyDown={(e) => {
                                //   this.handleKeyDown(e, "gstApplicable");
                                // }}
                                // @prathmesh @gstn enter validation start
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode == 9) {
                                  } else if (e.keyCode == 9) {
                                    // e.preventDefault();
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
                    {values.gstIn != "" && GSTINREX.test(values.gstIn) ? (
                      <>
                        <Col lg="3" className="GST_col_width">
                          <Row className="">
                            <Col lg="8">
                              <Form.Label className="">
                                GST Applicable
                              </Form.Label>
                            </Col>
                            <Col lg="4" className="mt-1">
                              <Form.Check
                                disabled
                                checked={
                                  values.gstApplicable == true ? true : false // @prathmesh @checked & disable functionality
                                }
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    if (values.gstApplicable == true) {
                                      this.handleKeyDown(e, "gstIn");
                                    } else {
                                      this.handleKeyDown(e, "multiBranch");
                                    }
                                  }
                                }}
                                onChange={(e) => {
                                  // console.log(
                                  //   "Is Checked:--->",
                                  //   e.target.checked
                                  // );
                                  this.gstFieldshow(e.target.checked);
                                  setFieldValue(
                                    "gstApplicable",
                                    e.target.checked
                                  );
                                }}
                                value={values.gstApplicable}
                                className="ms-auto my-auto"
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
                          <Row className="">
                            <Col lg="8">
                              <Form.Label className="">
                                GST Applicable
                              </Form.Label>
                            </Col>
                            <Col lg="4" className="mt-1">
                              <Form.Check
                                checked={
                                  values.gstApplicable == true ? true : false // @prathmesh @checked & disable functionality
                                }
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
                                  // console.log(
                                  //   "Is Checked:--->",
                                  //   e.target.checked
                                  // );
                                  this.gstFieldshow(e.target.checked);
                                  setFieldValue(
                                    "gstApplicable",
                                    e.target.checked
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    if (values.gstApplicable == true) {
                                      this.handleKeyDown(e, "gstIn");
                                    } else {
                                      this.handleKeyDown(e, "multiBranch");
                                    }
                                  }
                                }}
                                value={values.gstApplicable}
                                className="ms-auto my-auto"
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
                      <Col lg="6" className="gst_true">
                        <Row>
                          <Col lg="1">
                            <Form.Label>
                              GSTIN
                              <span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col lg="3">
                            <Form.Group>
                              <Form.Control
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
                                autoComplete="gstIn"
                                value={
                                  values.gstIn && values.gstIn.toUpperCase()
                                }
                                className={`${values.gstIn == "" &&
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
                                      this.selectRefA.current?.focus();
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
                                      this.selectRefA.current?.focus();
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
                              GST Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col lg="3" className="pe-4">
                            <Form.Group
                              style={{ borderRadius: "4px" }}
                              className={`${values.gstType == "" &&
                                errorArrayBorder[3] == "Y"
                                ? "border border-danger selectTo"
                                : "selectTo"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode === 9) {
                                } else if (e.keyCode === 9) {
                                  // e.preventDefault();
                                  this.handleKeyDown(e, "gstApplicableDate");
                                } else if (e.keyCode === 13) {
                                  this.handleKeyDown(e, "gstApplicableDate");
                                }
                              }}
                            >
                              <Select
                                ref={this.selectRefA}
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
                                  // e.preventDefault();
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
                    <Col lg="3" className=" ">
                      <Row>
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
                              // console.log("Is Checked:--->", e.target.checked);
                              this.gstFieldshow(e.target.checked);
                              setFieldValue("multiBranch", e.target.checked);
                            }}
                            checked={
                              values.multiBranch == true
                                ? true
                                : false || values.multiBranch == true
                                  ? true
                                  : false
                            }
                            value={values.multiBranch}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.handleKeyDown(e, "submit");
                              }
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
                </div>

                <Row className="style-btn">
                  <Col lg={12} className="text-end">
                    <Button
                      className="successbtn-style"
                      type="submit"
                      id="submit"
                      onClick={(e) => {
                        this.validateCompanyDuplicate(
                          values.id,
                          values.companyName,
                          setFieldValue
                        );
                        e.preventDefault();
                        this.ref.current.handleSubmit();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          this.validateCompanyDuplicate(
                            values.id,
                            values.companyName,
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
                      Update
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
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
                              // eventBus.dispatch("page_change", "companyList");
                              eventBus.dispatch("page_change", {
                                from: "newCompanyEdit",
                                to: "companyList",
                                isNewTab: false,
                                isCancel: true,

                                prop_data: {
                                  editId: this.state.edit_data.id,
                                  rowId: this.props.block.prop_data.rowId,
                                },
                              });
                            },
                            handleFailFn: () => { },
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
                              msg: "Do you want to cancel",
                              is_button_show: false,
                              is_timeout: false,
                              delay: 0,
                              handleSuccessFn: () => {
                                // eventBus.dispatch("page_change", "companyList");
                                eventBus.dispatch("page_change", {
                                  from: "newCompanyEdit",
                                  to: "companyList",
                                  prop_data: {
                                    editId: this.state.edit_data.id,
                                    rowId: this.props.block.prop_data.rowId,
                                  },
                                });
                              },
                              handleFailFn: () => { },
                            },
                            () => {
                              // console.warn("return_data");
                            }
                          );
                        } else {
                          this.handleKeyDown(e, "branchCode");
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
