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
  getPincodeData,
  updateBranchById,
  getBranchById,
  validate_pincode,
  validateBranchUpdate,
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

export default class NewBranchEdit extends React.Component {
  constructor(props) {
    super(props);

    const curDate = new Date();
    this.transFormRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.ref = React.createRef();
    this.selectRef = React.createRef();
    this.regAreaRef = React.createRef();
    this.corpAreaRef = React.createRef();
    this.regCountryRef = React.createRef();
    this.corpCountryRef = React.createRef();
    this.currencyRef = React.createRef();
    this.gsttypeRef = React.createRef();
    this.selectRef1 = React.createRef();
    this.radioRef = React.createRef();
    this.radioRef1 = React.createRef();
    this.inputRefs = [];

    this.state = {
      countryOpt: [],
      GSTopt: [],
      orgData: [],
      userControlData: [],
      stateCodeData: [],

      opCompanyList: [],
      showPassword: false,
      gstshow: false,
      isEditDataSet: false,
      tabVisible: false,
      data: [],
      edit_data: "",
      checkAddress: false,
      areaOpt: [],
      corporateareaOpt: [],
      idNew: 0,
      dt: moment(curDate).format("DD/MM/YYYY"),
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
        oldCorPinCode: "",
      },
      errorArrayBorder: "",
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
      opCompanyList,
    } = this.state;
    console.log("v->", edit_data);
    let reqData = new FormData();
    reqData.append("id", edit_data.id);
    // reqData.append("userId", edit_data.userId);
    getBranchById(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res----", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          console.log("d--", d);
          this.setState({ idNew: d.id });
          let p = moment(d.gstApplicableDate, "YYYY-MM-DD").toDate();
          // this.getPincodeData(d.pincode);
          let opt = [];
          if (d.area != "") {
            opt = d.area_list.map((v) => {
              return { value: v.area_id, label: v.area_name };
            });
            console.log("Area--->", opt);
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
            console.log("corporateareaOpt--->", corporateopt);
            this.setState({ corporateareaOpt: corporateopt });
          }

          let initVal = {
            id: d.id,
            // companyId: d.companyName ? d.companyName : "",
            // companyName: d.companyName ? d.companyName : "",
            // companyCode: d.companyCode ? d.companyCode : "",
            branchName: d.branchName ? d.branchName : "",
            branchCode: d.branchCode ? d.branchCode : "",
            licenseNo: d.licenseNo ? d.licenseNo : "",
            branchName: d.branchName ? d.branchName : "",
            branchCode: d.branchCode ? d.branchCode : "",

            // licenseExpiryDate: d.licenseExpiryDate ? d.licenseExpiryDate : "",
            foodLicenseNo: d.foodLicenseNo ? d.foodLicenseNo : "",
            // foodLicenseExpiryDate: d.foodLicenseExpiryDate
            //   ? moment(
            //       new Date(
            //         moment(d.foodLicenseExpiryDate, "YYYY-MM-DD").toDate()
            //       )
            //     ).format("DD/MM/YYYY")
            //   : "",
            // companyId: d.companyId ? getSelectValue(opCompanyList, d.companyId) : "",
            foodLicenseExpiryDate:
              d.foodLicenseExpiryDate != ""
                ? moment(d.foodLicenseExpiryDate).format("DD/MM/YYYY")
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
            currency:
              d.currency != null ? getSelectValue(Currencyopt, d.currency) : "",
            gstApplicable: d.gstApplicable === false ? false : true,
            multiBranch: d.multiBranch === false ? false : true,
            // district: d.district ? d.district : "",
            gstIn: d.gstIn ? d.gstIn : "",
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
            userRole: "BADMIN",
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
          console.log("initVal.emailId", initVal);
          // initVal["areaId"] = d.areaId ? d.areaId : "";
          if (d.area != "") {
            initVal["areaId"] =
              d.area != "" ? getSelectValue(areaOpt, d.area) : "";
          }
          if (d.corporatearea != "") {
            initVal["corporateareaId"] =
              d.corporatearea != ""
                ? getSelectValue(corporateareaOpt, d.corporatearea)
                : "";
          }
          initVal["companyId"] = d.companyId
            ? getSelectValue(opCompanyList, d.companyId)
            : "";

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

            console.log(
              "initVal[gstApplicableDate] ",
              initVal["gstApplicableDate"]
            );
          }

          console.log("initVal>>>>>>>>>>>>>>>>", initVal);
          this.setState(
            {
              isEditDataSet: true,
              BranchInitVal: initVal,
            },
            () => {}
          );
        } else {
          this.setState({ isEditDataSet: true });
        }
        console.log("response", response);
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
          this.setState({ opCompanyList: Opt }, () => {
            let companyId = this.state.opCompanyList.find(
              (o) =>
                o.value === authenticationService.currentUserValue.companyId
            );
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
      this.listGetCompany();
      this.listGSTTypes();
      this.setInitValues();
      this.getAllMasterAppConfig();
      const { prop_data } = this.props.block;
      console.log("propdatas", { prop_data });
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
    console.log(
      "GSTopt, edit_data, isEditDataSet ",
      GSTopt,
      edit_data,
      isEditDataSet
    );

    if (GSTopt.length > 0 && isEditDataSet == false && edit_data != "") {
      console.log("componentDidUpdate call", GSTopt.length);
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

  handleSelectionChange = (slug, value) => {
    console.log("slug", slug);
    console.log("value", value);
    let { userControlData } = this.state;
    console.log("userControlData", userControlData);
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
      console.log("userControlData", userControlData);
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
    console.log("slug", slug);
    let { userControlData } = this.state;

    let fObj = userControlData.find((v) => v.slug == slug);
    console.log("fObj", fObj);
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
        this.ref.current.setFieldValue("countryId", opt[0]);
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
  getCorporatePincodeData = (pincode, setFieldValue) => {
    let { oldCorPinCode } = this.state;
    let reqData = new FormData();
    reqData.append("pincode", pincode);
    getPincodeData(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res-->", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          setFieldValue("corporatecity", res.responseObject[0].district);
          setFieldValue("corporatestateName", res.responseObject[0].state);
          setFieldValue("corporatestateCode", res.responseObject[0].stateCode);
          let opt = d.map((v) => {
            return { label: v.area, value: v.id };
          });

          if (this.ref.current.values.sameAsAddress == true) {
          } else {
            if (oldCorPinCode != pincode) {
              this.ref.current.setFieldValue("corporateareaId", opt[0]);
            }
          }

          this.setState({ corporateareaOpt: opt, oldCorPinCode: pincode });
        } else {
          setFieldValue("corporatecity", "");
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
  validateBranchDuplicate = (branch_name, company_id, setFieldValue) => {
    let { idNew } = this.state;

    let reqData = new FormData();
    reqData.append("branchName", branch_name);
    reqData.append("outletId", company_id);
    reqData.append("id", idNew);
    validateBranchUpdate(reqData)
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
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleKeyDown = (e, index) => {
    // debugger;
    if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    }
    if (e.keyCode === 37) {
      document.getElementById(index).focus();
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

  render() {
    const {
      stateCodeData,
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
      opCompanyList,
      BranchInitVal,
      errorArrayBorder,
    } = this.state;
    return (
      <div>
        <div className="branchcreate">
          <Formik
            enableReinitialize={true}
            innerRef={this.ref}
            initialValues={BranchInitVal}
            validationSchema={Yup.object().shape({
              // branchName: Yup.string()
              //     .trim()
              //     .required("Company name is required"),
              // usercode: Yup.string().trim().required("User Name is required"),
              // password: Yup.string().trim().required("Password is required"),
              // pincode: Yup.string().trim().required("Pincode is required"),
              // email: Yup.lazy((v) => {
              //     if (v != undefined) {
              //         return Yup.string()
              //             .trim()
              //             .matches(EMAILREGEXP, "Enter valid email id");
              //         // .required("Email is required");
              //     }
              //     return Yup.string().notRequired();
              // }),
              // gstIn: Yup.string().when("gstApplicable", {
              //     is: (gstApplicable) => gstApplicable === false,
              //     then: Yup.string().notRequired(),
              //     otherwise: Yup.string()
              //         .trim()
              //         .matches(GSTINREX, "Enter Valid GSTIN")
              //         .required("GSTIN is required"),
              // }),
              // gstType: Yup.object().when("gstApplicable", {
              //     is: (gstApplicable) => gstApplicable === false,
              //     then: Yup.object().notRequired(),
              //     otherwise: Yup.object()
              //         .nullable()
              //         .required("GST Type is required"),
              // }),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // if (values.id == "" && step < 3) {
              //   setSubmitting(false);
              //   this.goToNextPage(values);
              // } else {

              // ! Validation Start

              let errorArray = [];
              // if (values.companyId == "") {
              //   // if (!errorArray)
              //   errorArray.push("Y");
              //   // errorArray.splice(0, 0, "Branch name is required");
              //   // errorArray.splice(0, 0, "Branch name is required");
              // } else {
              //   errorArray.push("");
              // }

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
                          v !== "companyId" &&
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
                              delay: 500,
                            });
                            resetForm();
                            this.pageReload();
                            eventBus.dispatch("page_change", {
                              from: "newbranchedit",
                              to: "newBranchList",
                              prop_data: {
                                editId: this.state.edit_data.id,
                                rowId: this.props.block.prop_data.rowId,
                              },
                              isCancel: true,
                            });
                            // eventBus.dispatch("page_change", "newBranchList");
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Error While Updating Outlet",
                              is_timeout: true,
                              delay: 500,
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
                          <Form.Label>Company Name</Form.Label>
                        </Col>
                        <Col lg="8" className="ps-3">
                          <Form.Group
                          // className={`${values.companyId == "" &&
                          //   errorArrayBorder[0] == "Y"
                          //   ? "border border-danger "
                          //   : ""
                          //   }`}
                          // style={{ borderRadius: "4px" }}
                          // onBlur={(e) => {
                          //   e.preventDefault();
                          //   if (values.companyId) {
                          //     this.setErrorBorder(0, "");
                          //   } else {
                          //     this.setErrorBorder(0, "Y");
                          //     // this.selectRef.current?.focus();
                          //   }
                          // }}
                          >
                            <Select
                              ref={this.selectRef}
                              isDisabled={true}
                              autoFocus={true}
                              isClearable={true}
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
                              id="companyId"
                              options={opCompanyList}
                              value={values.companyId}
                              invalid={errors.companyId ? true : false}
                              // ref={(input) => (this.inputRefs[0] = input)}
                              onKeyDown={(e) =>
                                this.handleKeyDown(e, "branchCode")
                              }
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
                              autoFocus="true"
                              autoComplete="off"
                              className="co_text_box ps-1 pe-1"
                              type="text"
                              name="branchCode"
                              id="branchCode"
                              placeholder="Branch Code"
                              onChange={handleChange}
                              value={values.branchCode}
                              // ref={(input) => (this.inputRefs[1] = input)}
                              // onKeyDown={(e) => this.handleKeyDown(e, 'branchName')}
                              // onInput={(e) => {
                              //   e.target.value = this.getDataCapitalised(
                              //     e.target.value
                              //   );
                              // }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 9 || e.keyCode === 13) {
                                  setFieldValue("companyCode", e.target.value);
                                }
                                if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "branchName");
                                } else if (e.keyCode == 9) {
                                  // e.preventDefault();
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
                        <Col lg="3" className="flp">
                          <Form.Label>
                            Branch Name<span className="text-danger">*</span>
                          </Form.Label>
                        </Col>
                        <Col md="9" className="pe-4">
                          <Form.Group>
                            <Form.Control
                              autoComplete="off"
                              type="text"
                              name="branchName"
                              id="branchName"
                              value={values.branchName}
                              onChange={handleChange}
                              className={`${
                                values.branchName == "" &&
                                errorArrayBorder[0] == "Y"
                                  ? "border border-danger co_text_box"
                                  : "co_text_box"
                              }`}
                              onBlur={(e) => {
                                e.preventDefault();

                                if (e.target.value.trim()) {
                                  this.setErrorBorder(0, "");
                                } else {
                                  this.setErrorBorder(0, "Y");
                                  document.getElementById("branchName").focus();
                                }
                              }}
                              onInput={(e) => {
                                e.target.value = this.getDataCapitalised(
                                  e.target.value
                                );
                              }}
                              // onKeyDown={(e) => {
                              //   if (e.shiftKey && e.key === "Tab") {
                              //   } else if (e.key === "Tab" && !e.target.value)
                              //     e.preventDefault();
                              // }}
                              // ref={(input) => (this.inputRefs[2] = input)}
                              onKeyDown={(e) => {
                                // if (e.target.value === "") {
                                // } else {
                                //   this.handleKeyDown(e, "Retailer");
                                // }
                                if (e.shiftKey && e.key === "Tab") {
                                  this.validateBranchDuplicate(
                                    values.branchName,
                                    values.companyId.value,
                                    setFieldValue
                                  );
                                } else if (e.key === "Tab") {
                                  this.validateBranchDuplicate(
                                    values.branchName,
                                    values.companyId.value,
                                    setFieldValue
                                  );
                                } else {
                                  this.handleKeyDown(e, "Retailer");
                                }
                              }}
                              placeholder="Name"
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
                            style={{ width: "fit-content" }}
                            // onKeyDown={(e) => {
                            //   if (e.shiftKey && e.key === "Tab") {
                            //   } else if (
                            //     e.key === "Tab" &&
                            //     !values.tradeOfBusiness
                            //   ) {
                            //     e.preventDefault();
                            //     this.radioRef.current?.focus();
                            //   }
                            // }}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.key === "Tab") {
                              } else if (
                                e.key === "Enter" &&
                                !values.tradeOfBusiness
                              ) {
                                e.preventDefault();
                                this.radioRef1.current?.focus();
                              } else {
                                this.handleKeyDown(e, "natureOfBusiness");
                              }
                            }}
                            onBlur={(e) => {
                              e.preventDefault();
                              if (values.tradeOfBusiness) {
                                this.setErrorBorder(1, "");
                              } else {
                                this.setErrorBorder(1, "Y");
                                this.radioRef.current?.focus();
                              }
                            }}
                            className={`${
                              values.tradeOfBusiness == "" &&
                              errorArrayBorder[1] == "Y"
                                ? "border border-danger d-flex label_style"
                                : "d-flex label_style"
                            }`}
                          >
                            <Form.Check
                              ref={this.radioRef1}
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
                              autoComplete="off"
                              type="text"
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
                                this.handleKeyDown(e, "uploadImage");
                              }}
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
                          <Form.Label>Update Image</Form.Label>
                        </Col>
                        <Col lg="8" className="pe-4">
                          <Form.Group controlId="formGridEmail">
                            <Form.Control
                              id="uploadImage"
                              type="file"
                              className="password-style"
                              // ref={(input) => (this.inputRefs[5] = input)}
                              onKeyDown={(e) => {
                                this.handleKeyDown(e, "registeredAddress");
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
                                  onKeyDown={(e) => {
                                    if (
                                      (e.shiftKey && e.keyCode == 9) ||
                                      e.keyCode == 9 ||
                                      e.keyCode == 13
                                    ) {
                                      setFieldValue(
                                        "registeredAddress",
                                        e.target.value
                                      );
                                      setFieldValue(
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
                                      className={`${
                                        values.pincode == "" &&
                                        errorArrayBorder[2] == "Y"
                                          ? "border border-danger co_text_box"
                                          : "co_text_box"
                                      }`}
                                      placeholder="Pincode"
                                      type="text"
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
                                      // onBlur={(e) => {
                                      //   e.preventDefault();
                                      //   if (e.target.value) {
                                      //     this.setErrorBorder(2, "");
                                      //     this.getPincodeData(
                                      //       e.target.value,
                                      //       setFieldValue
                                      //     );

                                      //     this.validatePincode(
                                      //       e.target.value,
                                      //       setFieldValue
                                      //     );
                                      //     // onchangeerrorArray.splice(3, 0, "");
                                      //   } else {
                                      //     this.setErrorBorder(2, "Y");
                                      //     // onchangeerrorArray.splice(3, 0, "Y");
                                      //     document
                                      //       .getElementById("pincode")
                                      //       .focus();
                                      //   }
                                      // }}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === 9) {
                                          if (e.target.value) {
                                            this.setErrorBorder(2, "");
                                          } else {
                                            this.setErrorBorder(2, "");
                                            document
                                              .getElementById("pincode")
                                              ?.focus();
                                          }
                                        } else if (e.key === 9) {
                                          e.preventDefault();
                                          if (e.target.value) {
                                            this.setErrorBorder(2, "");
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
                                            this.setErrorBorder(2, "");
                                            document
                                              .getElementById("pincode")
                                              ?.focus();
                                          }
                                        } else if (e.keyCode == 13) {
                                          if (e.target.value) {
                                            this.setErrorBorder(2, "");
                                            this.validatePincode(
                                              e.target.value,
                                              false
                                            );
                                            this.getPincodeData(
                                              e.target.value,
                                              setFieldValue
                                            );
                                          } else {
                                            this.setErrorBorder(2, "Y");
                                            document
                                              .getElementById("pincode")
                                              ?.focus();
                                          }
                                        }
                                      }}
                                      value={values.pincode}
                                      onKeyPress={(e) => {
                                        OnlyEnterNumbers(e);
                                      }}
                                      maxLength={6}
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
                                      invalid={errors.areaId ? true : false}
                                      ref={this.regAreaRef}
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
                            <Col lg="3" md={3} sm={3} xs={3} className="p-0">
                              <Row>
                                <Col lg={2}>
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
                                      boxShadow: "none",
                                    }}
                                    tabIndex="-1"
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
                                      id="countryId"
                                      className="selectTo"
                                      onChange={(v) => {
                                        setFieldValue("countryId", v);
                                      }}
                                      name="countryId"
                                      styles={companystyle}
                                      options={countryOpt}
                                      value={values.countryId}
                                      invalid={errors.countryId ? true : false}
                                      // ref={(input) => (this.inputRefs[9] = input)}
                                      ref={this.regCountryRef}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(
                                            e,
                                            "sameAsAddress"
                                          );
                                        } else if (e.keyCode == 9) {
                                          this.handleKeyDown(
                                            e,
                                            "sameAsAddress"
                                          );
                                        }
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
                            className="checkbox-label"
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
                                setFieldValue("corporatecity", "");
                                setFieldValue("corporatestateName", "");
                                setFieldValue(
                                  "corporateareaId",
                                  getSelectValue(areaOpt, "")
                                );
                              }
                            }}
                            value={values.sameAsAddress}
                            checked={
                              values.sameAsAddress === true ? true : false
                            }
                            // ref={(input) => (this.inputRefs[10] = input)}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.keyCode == 9) {
                              } else if (e.keyCode == 13) {
                                if (values.sameAsAddress == true)
                                  this.handleKeyDown(e, "licenseNo");
                                if (values.sameAsAddress == false)
                                  this.handleKeyDown(e, "corporateAddress");
                              } else if (e.keyCode == 9) {
                                if (values.sameAsAddress == true)
                                  this.handleKeyDown(e, "licenseNo");
                                if (values.sameAsAddress == false)
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
                        <Col lg="12">
                          <Row>
                            <Col lg="2">
                              <Form.Label> Address</Form.Label>
                            </Col>
                            <Col lg="10">
                              <Form.Group>
                                <Form.Control
                                  autoComplete="off"
                                  type="text"
                                  className="co_text_box"
                                  placeholder="Address"
                                  name="corporateAddress"
                                  id="corporateAddress"
                                  onChange={handleChange}
                                  value={values.corporateAddress}
                                  onInput={(e) => {
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  }}
                                  disabled={
                                    values.sameAsAddress === true ? true : false
                                  }
                                  // ref={(input) => (this.inputRefs[11] = input)}
                                  onKeyDown={(e) => {
                                    if (
                                      (e.shiftKey && e.keyCode === 9) ||
                                      e.keyCode === 9 ||
                                      e.keyCode === 13
                                    ) {
                                      setFieldValue(
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
                                      autoComplete="off"
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
                                      // onBlur={(e) => {
                                      //   e.preventDefault();
                                      //   this.getCorporatePincodeData(
                                      //     e.target.value,
                                      //     setFieldValue
                                      //   );
                                      //   if (e.target.value != "") {
                                      //     this.validatePincodeCorp(
                                      //       e.target.value,
                                      //       setFieldValue
                                      //     );
                                      //   } else {
                                      //     document
                                      //       .getElementById("corporatePincode")
                                      //       .focus();
                                      //   }
                                      // }}
                                      disabled={
                                        values.sameAsAddress === true
                                          ? true
                                          : false
                                      }
                                      // ref={(input) => (this.inputRefs[12] = input)}
                                      onKeyDown={(e) => {
                                        if (values.sameAsAddress == false) {
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
                                      id="areaId"
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
                                      invalid={
                                        errors.corporateareaId ? true : false
                                      }
                                      isDisabled={
                                        values.sameAsAddress === true
                                          ? true
                                          : false
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
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      width: "max-content",
                                      boxShadow: "none",
                                    }}
                                    tabIndex="-1"
                                    className="p-1"
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
                                      boxShadow: "none",
                                    }}
                                    tabIndex="-1"
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
                                      id="countryId"
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
                                onChange={handleChange}
                                value={values.licenseNo}
                                // ref={(input) => (this.inputRefs[15] = input)}
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode === 9) ||
                                    e.keyCode === 9 ||
                                    e.keyCode === 13
                                  ) {
                                    setFieldValue("licenseNo", e.target.value);
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
                              // onBlur={(e) => {}}
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
                                autoComplete="off"
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
                                autoComplete="off"
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
                                ref={(input) => (this.inputRefs[22] = input)}
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
                                // ref={(input) => (this.inputRefs[23] = input)}
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
                                // ref={(input) => (this.inputRefs[24] = input)}
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
                      <Col lg="6" className="mt-1 gst_true">
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
                                className={`${
                                  errorArrayBorder[3] == "Y"
                                    ? "border border-danger co_text_box"
                                    : "co_text_box"
                                }`}
                                placeholder="GSTIN"
                                name="gstIn"
                                id="gstIn"
                                autoComplete="off"
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
                                //     // document.getElementById("gstIn").focus();
                                //   }
                                // }}
                                // onKeyDown={(e) => {
                                //   if (e.shiftKey && e.key === "Tab") {
                                //   } else if (e.key === "Tab" && !e.target.value)
                                //     e.preventDefault();
                                // }}
                                // ref={(input) => (this.inputRefs[27] = input)}
                                // onKeyDown={(e) => {
                                //   if (e.shiftKey && e.key === "Tab") {
                                //     if (!e.target.value.trim())
                                //       this.setErrorBorder(3, "Y");
                                //     else {
                                //       this.setErrorBorder(3, "");
                                //       if (GSTINREX.test(values.gstIn)) {
                                //         return values.gstIn;
                                //       } else {
                                //         MyNotifications.fire({
                                //           show: true,
                                //           icon: "warning",
                                //           title: "Warning",
                                //           msg: "GSTIN is not Valid!",
                                //           // is_button_show: true,
                                //           is_timeout: true,
                                //           delay: 1500,
                                //         });
                                //         setTimeout(() => {
                                //           document
                                //             .getElementById("gstIn")
                                //             .focus();
                                //         }, 1000);
                                //       }
                                //     }
                                //   } else if (
                                //     e.key === "Tab" &&
                                //     e.target.value.trim()
                                //   ) {
                                //     this.setErrorBorder(2, "");
                                //     if (GSTINREX.test(values.gstIn)) {
                                //       return values.gstIn;
                                //     } else {
                                //       MyNotifications.fire({
                                //         show: true,
                                //         icon: "warning",
                                //         title: "Warning",
                                //         msg: "GSTIN is not Valid!",
                                //         // is_button_show: true,
                                //         is_timeout: true,
                                //         delay: 1500,
                                //       });
                                //       setTimeout(() => {
                                //         document
                                //           .getElementById("gstIn")
                                //           .focus();
                                //       }, 1000);
                                //     }
                                //   } else if (
                                //     e.key === "Tab" &&
                                //     !e.target.value.trim()
                                //   ) {
                                //     e.preventDefault();
                                //     this.setErrorBorder(2, "Y");
                                //     document.getElementById("gstIn").focus();
                                //   } else {
                                //     if (e.keyCode === 13) {
                                //       this.gsttypeRef.current?.focus();
                                //     }
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
                            <span className="text-danger errormsg">
                              {errors.gstIn}
                            </span>
                          </Col>
                          <Col lg="1" className="p-0 col-width">
                            <Form.Label>
                              GST Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                          </Col>
                          <Col lg="3" className="pe-4">
                            <Form.Group
                              className={`${
                                values.gstType == "" &&
                                errorArrayBorder[4] == "Y"
                                  ? "border border-danger "
                                  : ""
                              }`}
                              // onBlur={(e) => {
                              //   e.preventDefault();
                              //   if (!values.gstType) {
                              //     this.selectRef.current?.focus();
                              //   }
                              // }}
                              onBlur={(e) => {
                                e.preventDefault();
                                if (values.gstType) {
                                  this.setErrorBorder(4, "");
                                } else {
                                  this.setErrorBorder(4, "Y");
                                  // this.selectRef1.current?.focus();
                                }
                              }}
                              style={{ borderRadius: "4px" }}
                            >
                              <Select
                                ref={this.gsttypeRef}
                                onKeyDown={(e) => {
                                  if (values.gstApplicable == true) {
                                    this.handleKeyDown(e, "gstApplicableDate");
                                  }
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
                              // innerRef={(input) => (this.inputRefs[29] = input)}
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
                    <Col lg="3" className=" ">
                      <Row className="mt-2">
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
                              console.log("Is Checked:--->", e.target.checked);
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
                              this.handleKeyDown(e, "submit");
                            }}
                            // ref={values.gstApplicable === false ? (input) => (this.inputRefs[27] = input) : (input) => (this.inputRefs[30] = input)}
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

                  {/* <Row>
                    
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
                          <Col lg="3" className="pe-0">
                            {" "}
                            <Form.Label>Full Name</Form.Label>
                          </Col>
                          <Col lg="9">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Full Name"
                                name="fullName"
                                className="co_text_box"
                                id="fullName"
                                onChange={handleChange}
                                value={values.fullName}
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
                            <Form.Label>Email</Form.Label>
                          </Col>
                          <Col lg="9">
                            <Form.Control
                              className="co_text_box"
                              placeholder="Email"
                              id="emailId"
                              name="emailId"
                              type="text"
                              onChange={handleChange}
                              value={values.emailId}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col lg="2">
                        <Row>
                          <Col lg="3">
                            <Form.Label>Mobile</Form.Label>
                          </Col>
                          <Col lg="9">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Mobile No"
                                className="co_text_box"
                                name="contactNumber"
                                id="contactNumber"
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                onChange={handleChange}
                                value={values.contactNumber}
                                maxLength={10}
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
                          <Col lg="5">
                            <Form.Label>Birth Day</Form.Label>
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
                                        msg: "Birth date can't be greater than Current Date",
                                        is_button_show: true,
                                      });
                                      setFieldValue("userDob", "");
                                    }
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Invalid birth date",
                                      is_button_show: true,
                                    });
                                    setFieldValue("userDob", "");
                                  }
                                } else {
                                  setFieldValue("userDob", "");
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
                            <Form.Group className="d-flex label_style">
                              <Form.Check
                                type="radio"
                                label="Male"
                                name="gender"
                                id="gender1"
                                value="male"
                                onChange={handleChange}
                                checked={values.gender == "male" ? true : false}
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
                          <Col lg="3">
                            <Form.Label>Username</Form.Label>
                          </Col>
                          <Col lg="9">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                className="co_text_box"
                                placeholder="Username"
                                id="usercode"
                                name="usercode"
                                onChange={handleChange}
                                value={values.usercode}
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
                            <Form.Label>Password</Form.Label>
                          </Col>
                          <Col lg="9">
                            <Form.Group>
                              <InputGroup className="  co_text_box">
                                <Form.Control
                                  className="password-style"
                                  placeholder="Password"
                                  type="text"
                                  style={{
                                    webkitTextSecurity:
                                      showPassword != "" ? "disc" : "unset",
                                    border: "none",
                                    paddingLeft: "6px",
                                  }}
                                  name="password"
                                  id="password"
                                  onChange={handleChange}
                                  value={values.password}
                                />
                                <InputGroup.Text style={{ border: "none" }}>
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
                    
                    {userControlData.length > 0 ? (
                      userControlData.map((v, i) => {
                        return (
                          // <Row className="pe-0 mx-0">
                          <Col lg="1" className="col-width my-auto">
                            <div className="Control_style d-flex">
                              <Form.Check
                                type="switch"
                                label={v.display_name}
                                name={v.slug}
                                id={`${v.slug}-${i}-yes`}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    this.handleSelectionChange(v.slug, "1");
                                  } else {
                                    this.handleSelectionChange(v.slug, "0");
                                  }
                                }}
                                checked={this.SelectionChangeCheck(v.slug)}
                              />
                              {v.is_label && parseInt(v.value) == 1 && (
                                <>
                                  {v.slug === "is_level_a" && (
                                    <Form.Control
                                      autoComplete="nope"
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
                                    />
                                  )}

                                  {v.slug === "is_level_b" &&
                                    userControlData[i - 1]["value"] === "1" &&
                                    userControlData[i - 1]["label"] !== "" && (
                                      <Form.Control
                                        type="text"
                                        autoComplete="nope"
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
                                      />
                                    )}
                                  {v.slug === "is_level_c" &&
                                    userControlData[i - 2]["value"] === "1" &&
                                    userControlData[i - 2]["label"] !== "" &&
                                    userControlData[i - 1]["value"] === "1" &&
                                    userControlData[i - 1]["label"] !== "" && (
                                      <Form.Control
                                        type="text"
                                        autoComplete="nope"
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
                                      />
                                    )}
                                </>
                              )}
                            </div>
                          </Col>
                          // </Row>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Row> */}
                </div>

                <Row className="style-btn">
                  <Col lg={12} className="text-end">
                    <Button
                      id="submit"
                      className="successbtn-style"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        this.ref.current.handleSubmit();
                      }}
                      onKeyDown={(e) => {
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
                      id="cancel"
                      variant="secondary cancel-btn ms-2"
                      type="button"
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
                              // eventBus.dispatch("page_change", "newBranchList");
                              eventBus.dispatch("page_change", {
                                from: "newbranchedit",
                                to: "newBranchList",
                                isNewTab: false,
                                isCancel: true,
                                prop_data: {
                                  editId: this.state.edit_data.id,
                                  rowId: this.props.block.prop_data.rowId,
                                },
                              });
                            },
                            handleFailFn: () => {},
                          },
                          () => {
                            console.warn("return_data");
                          }
                        );
                      }}
                      // ref={(input) => (this.inputRefs[32] = input)}
                      // onKeyDown={(e) => { this.handleKeyDown(e, 32) }}
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
                                // eventBus.dispatch(
                                //   "page_change",
                                //   "newBranchList"
                                // );
                                eventBus.dispatch("page_change", {
                                  from: "newbranchedit",
                                  to: "newBranchList",
                                  isNewTab: false,
                                  isCancel: true,
                                  prop_data: {
                                    editId: this.state.edit_data.id,
                                    rowId: this.props.block.prop_data.rowId,
                                  },
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
          <Col md="12" className="my-auto px-0">
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
      </div>
    );
  }
}
