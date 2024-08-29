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
} from "@/services/api_functions";
import search from "@/assets/images/search_icon@3x.png";


import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import refresh from "@/assets/images/refresh.png";
import {
  EMAILREGEXP,
  SUPPORTED_FORMATS,
  numericRegExp,
  getValue,
  getSelectValue,
  AuthenticationCheck,
  MyDatePicker,
  ledger_select,
  GSTINREX,
  MyTextDatePicker,
  ShowNotification,
  MyNotifications,
} from "@/helpers";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

import Step1 from "@/Pages/Company/tabs/Step1";
import Step2 from "@/Pages/Company/tabs/Step2";
import Step3 from "@/Pages/Company/tabs/Step3";

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

export default class Company extends React.Component {
  constructor() {
    super();
    this.transFormRef = React.createRef();
    this.invoiceDateRef = React.createRef();

    this.state = {
      step: 1,
      toggle: false,
      opendiv: false,
      opInstituteList: [],
      opBranchList: [],
      data: [],
      stateOpt: [],
      countryOpt: [],
      GSTopt: [],
      orgData: [],
      tabVisible: false,
      showPassword: false,
      userControlData: [],

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
        tradeOfBusiness: "",
        companyLogo: "",
        pincode: "",
        email: "",
        mobileNumber: "",
        whatsappNumber: "",
        place: "",
        countryId: "",
        stateId: "",
        district: "",
        website: "",
        gstApplicable: "no",
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
      .catch((error) => { });
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
        // this.ref.current.setFieldValue("currency", Currencyopt[0]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  togglePasswordVisiblity = (status) => {
    this.setState({ showPassword: status });
  };

  listGetCompany = () => {
    get_companies_super_admin()
      .then((response) => {
        // console.log('response', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          this.setState({ data: data, orgData: res.responseObject }, () => { });
        }
      })
      .catch((error) => {
        this.setState({ opCompanyList: [] });
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
  /**** validation for Company Dulication *****/
  validateCompanyDuplicate = (company_name) => {
    console.log("C Name:", company_name);
    let reqData = new FormData();
    reqData.append("companyName", company_name);
    validateCompany(reqData)
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
          //this.reloadPage();
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
        gstApplicable: "no",
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
  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };
  handleSearch = (vi) => {
    console.log({ vi });
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        (v.companyName != null &&
          v.companyCode != null &&
          v.companyName.toLowerCase().includes(vi.toLowerCase())) ||
        v.companyCode.toLowerCase().includes(vi.toLowerCase()) ||
        v.fullName.toLowerCase().includes(vi.toLowerCase())
      // v.mobile.includes(vi.mobile)
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
      this.listGetCompany();
      this.listGSTTypes();
      this.setInitValues();
      this.getAllMasterAppConfig();

      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValues);
    }
  }

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValues);
  }

  setEditData = (v) => {
    const { stateOpt, countryOpt, prop_data, isDataSet, GSTopt } = this.state;
    console.log("v->", v);
    let reqData = new FormData();
    reqData.append("id", v.id);
    reqData.append("userId", v.userId);
    getCompanyById(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let p = moment(d.gstApplicableDate, "YYYY-MM-DD").toDate();

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
            sameAsAddress: d.sameAsAddress ? d.sameAsAddress : false,
            tradeOfBusiness: d.tradeOfBusiness ? d.tradeOfBusiness : "",
            pincode: d.pincode ? d.pincode : "",
            mobileNumber: d.mobileNumber ? d.mobileNumber : "",
            whatsappNumber: d.whatsappNumber ? d.whatsappNumber : "",
            place: d.place ? d.place : "",
            email: d.email ? d.email : "",
            website: d.website ? d.website : "",
            countryId: d.countryId
              ? getSelectValue(countryOpt, d.countryId)
              : "",
            stateId: d.stateId ? getSelectValue(stateOpt, d.stateId) : "",
            currency: d.currency ? getValue(Currencyopt, d.currency) : "",
            gstApplicable: d.gstApplicable === false ? "no" : "yes",
            multiBranch: d.multiBranch === false ? "no" : "yes",
            district: d.district ? d.district : "",
            gstIn: d.gstIn ? d.gstIn : "",
            gstType: d.gstType ? getSelectValue(GSTopt, d.gstType) : "",
            route: d.route ? d.route : "",
            gstApplicableDate: d.gstApplicableDate
              ? moment(
                new Date(moment(d.gstApplicableDate, "YYYY-MM-DD").toDate())
              ).format("DD/MM/YYYY")
              : "",

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
            contactNumber: d.contactNumber ? d.contactNumber : "",
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
            password: "",
            manageOutlets: "",
            Search: "",
          };
          console.log("initVal.emailId", initVal.emailId);
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
              CompanyInitVal: initVal,
              opendiv: true,
            },
            () => { }
          );
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

  goToNextPage = (values) => {
    this.setState({ CompanyInitVal: values, step: this.state.step + 1 });
  };

  render() {
    const VALIDATION = {
      1: Yup.object().shape({
        companyName: Yup.string().trim().required("Company name is required"),
        countryId: Yup.object().nullable().required("Country is required"),
        stateId: Yup.object().nullable().required("State is required"),
        multiBranch: Yup.string().required("Select Option"),
        // gstApplicable: Yup.string().required("Select Option"),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        gstIn: Yup.string().when("gstApplicable", {
          is: (gstApplicable) => gstApplicable === "no",
          then: Yup.string().notRequired(),
          otherwise: Yup.string()
            .trim()
            .matches(GSTINREX, "Enter Valid GSTIN")
            .required("GST IN is required"),
        }),
        gstType: Yup.object().when("gstApplicable", {
          is: (gstApplicable) => gstApplicable === "no",
          then: Yup.object().notRequired(),
          otherwise: Yup.object().nullable().required("GST Type is required"),
        }),

        companyLogo: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.mixed()
              .test(
                "fileType",
                "Upload JPG,JPEG,PNG with MAX. 5MB sizes",
                (value) => SUPPORTED_FORMATS.includes(value.type)
              )
              .test("fileSize", "File size should be less than 5MB", (v) => {
                const size = 1024 * 1024 * 5;
                return v && v.size <= size;
              });
          }
          return Yup.mixed().notRequired("");
        }),
      }),
      2: Yup.object().shape({
        companyName: Yup.string().trim().required("Company name is required"),
        countryId: Yup.object().nullable().required("Country is required"),
        stateId: Yup.object().nullable().required("State is required"),
        multiBranch: Yup.string().required("Select Option"),
        // gstApplicable: Yup.string().required("Select Option"),
        email: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .trim()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        gstIn: Yup.string().when("gstApplicable", {
          is: (gstApplicable) => gstApplicable === "no",
          then: Yup.string(),
          otherwise: Yup.string().trim().required("GST IN is required"),
        }),
        gstType: Yup.object().when("gstApplicable", {
          is: (gstApplicable) => gstApplicable === "no",
          then: Yup.object(),
          otherwise: Yup.object().nullable().required("GST Type is required"),
        }),
        companyLogo: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.mixed()
              .test(
                "fileType",
                "Upload JPG,JPEG,PNG with MAX. 5MB sizes",
                (value) => SUPPORTED_FORMATS.includes(value.type)
              )
              .test("fileSize", "File size should be less than 5MB", (v) => {
                const size = 1024 * 1024 * 5;
                return v && v.size <= size;
              });
          }
          return Yup.mixed().notRequired("");
        }),

        fullName: Yup.string().trim().required("Full name is required"),
        contactNumber: Yup.string()
          .matches(numericRegExp, "Enter valid mobile number")
          .required("Mobile number is required"),
        emailId: Yup.lazy((v) => {
          if (v != undefined) {
            return Yup.string()
              .matches(EMAILREGEXP, "Enter valid email id")
              .required("Email is required");
          }
          return Yup.string().notRequired();
        }),
        gender: Yup.string().trim().required("Gender is required"),
        password: Yup.string().when("id", {
          is: (id) => id && id !== "",
          then: Yup.string().notRequired(),
          otherwise: Yup.string().trim().required("Password is required"),
        }),
        // password: Yup.mixed().when("id", {
        //   is: (id) => {
        //     id && id!==""
        //     console.log("id", id);
        //     return false;
        //   },
        //   then: Yup.string().notRequired(),
        //   otherwise: Yup.string().trim().required("Password is required"),
        // }),
        // password: Yup.string().trim().required("Password is required"),
        usercode: Yup.string().trim().required("Username is required"),
      }),
    };

    const {
      data,
      stateOpt,
      opendiv,
      countryOpt,
      GSTopt,
      CompanyInitVal,
      toggle,
      tabVisible,
      step,
      showPassword,
      userControlData,
    } = this.state;

    return (
      <div className="company-form-style">
        <Collapse in={opendiv}>
          <div className="main-div mb-2 m-0">
            <h4 className="form-header">Company</h4>
            <Formik
              validateOnChange={false}
              // validateOnBlur={false}
              enableReinitialize={true}
              initialValues={CompanyInitVal}
              innerRef={this.ref}
              validationSchema={VALIDATION[step]}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                if (values.id == "" && step < 3) {
                  setSubmitting(false);
                  this.goToNextPage(values);
                } else {
                  let msg =
                    values.id === ""
                      ? "Do you want to save"
                      : "Do you want to update";
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
                          v !== "stateId" &&
                          v !== "countryId" &&
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

                      requestData.append(
                        "gstApplicable",
                        values.gstApplicable && values.gstApplicable === "yes"
                          ? true
                          : false
                      );
                      requestData.append(
                        "isMultiBranch",
                        values.multiBranch && values.multiBranch === "yes"
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
                          values.sameAsAddress
                        );
                      }
                      if (values.gstApplicable === "yes") {
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

                      requestData.append("stateId", values.stateId.value);
                      requestData.append("countryId", values.countryId.value);
                      if (values.currency !== "") {
                        requestData.append("currency", values.currency.value);
                      }
                      for (let [name, value] of requestData) {
                        console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                      }

                      if (values.id === "") {
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
                              resetForm();
                              this.pageReload();
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
                  className="form-style"
                >
                  <div className="card-height m-0 mb-2">
                    {/* {JSON.stringify(values)} */}
                    {/* {JSON.stringify(errors)} */}

                    <Row>
                      <Col>
                        <Tabs
                          // defaultActiveKey="company"
                          id="uncontrolled-tab-example"
                          className="mb-2"
                          style={{ background: "#F3F4F8" }}
                          activeKey={step}
                          onSelect={(k) => {
                            this.setState({ step: parseInt(k) });
                          }}
                        >
                          <Tab eventKey="1" title="Company Details">
                            <Step1
                              handleChange={handleChange}
                              setFieldValue={setFieldValue}
                              values={values}
                              errors={errors}
                              countryOpt={countryOpt}
                              stateOpt={stateOpt}
                              GSTopt={GSTopt}
                              Currencyopt={Currencyopt}
                            />
                          </Tab>
                          {values.id == "" ? (
                            tabVisible == true ? (
                              <Tab eventKey="2" title="Admin Details">
                                <Step2
                                  handleChange={handleChange}
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  errors={errors}
                                  countryOpt={countryOpt}
                                  stateOpt={stateOpt}
                                  GSTopt={GSTopt}
                                  touched={touched}
                                  showPassword={showPassword}
                                />
                              </Tab>
                            ) : (
                              <Tab eventKey="2" title="Admin Details" disabled>
                                <Step2
                                  handleChange={handleChange}
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  errors={errors}
                                  countryOpt={countryOpt}
                                  stateOpt={stateOpt}
                                  GSTopt={GSTopt}
                                  touched={touched}
                                />
                              </Tab>
                            )
                          ) : (
                            <></>
                          )}
                          {/* {values.id == "" ? (<> */}
                          {values.id == "" ? (
                            tabVisible == true ? (
                              <Tab eventKey="3" title="User Control">
                                <Step3
                                  handleChange={handleChange}
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  userControlData={userControlData}
                                  errors={errors}
                                  countryOpt={countryOpt}
                                  stateOpt={stateOpt}
                                  GSTopt={GSTopt}
                                  touched={touched}
                                  handleSelectionChange={this.handleSelectionChange.bind(
                                    this
                                  )}
                                  handleLabelChange={this.handleLabelChange.bind(
                                    this
                                  )}
                                  SelectionChangeCheck={this.SelectionChangeCheck.bind(
                                    this
                                  )}
                                />
                              </Tab>
                            ) : (
                              <Tab eventKey="3" title="User Control" disabled>
                                <Step3
                                  handleChange={handleChange}
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  userControlData={userControlData}
                                  errors={errors}
                                  countryOpt={countryOpt}
                                  stateOpt={stateOpt}
                                  GSTopt={GSTopt}
                                  touched={touched}
                                  handleSelectionChange={this.handleSelectionChange.bind(
                                    this
                                  )}
                                  handleLabelChange={this.handleLabelChange.bind(
                                    this
                                  )}
                                  SelectionChangeCheck={this.SelectionChangeCheck.bind(
                                    this
                                  )}
                                />
                              </Tab>
                            )
                          ) : (
                            <></>
                          )}
                          {/* // }</>) : (<></>)} */}

                          {/* {values.id == "" ?
                            (<Tab eventKey="3" title="User Control">
                              <Step3
                                handleChange={handleChange}
                                setFieldValue={setFieldValue}
                                values={values}
                                userControlData={userControlData}
                                errors={errors}
                                countryOpt={countryOpt}
                                stateOpt={stateOpt}
                                GSTopt={GSTopt}
                                touched={touched}
                                handleSelectionChange={this.handleSelectionChange.bind(
                                  this
                                )}
                                handleLabelChange={this.handleLabelChange.bind(
                                  this
                                )}
                                SelectionChangeCheck={this.SelectionChangeCheck.bind(
                                  this
                                )}
                              />
                            </Tab>
                            ) : (<></>)} */}
                        </Tabs>
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md="12" className="btn_align ">
                        {/* {step == 2 && Object.keys(errors).length > 0 ? (
                          <>
                            <div className="text-center mb-2"></div>
                            <div className={"alert alert-danger"}>
                              {/* {JSON.stringify(errors)} */}
                        {/* Please fill-up below fields
                              {/* <br /> */}
                        {/* {Object.values(errors).map((v) => {
                                return <p>{v}</p>;
                                // return <p>{errors[v]}</p>;
                              })}
                            </div>
                          </>
                        ) : (
                          ""
                        )}  */}
                        {step != 1 && (
                          <>
                            <Button
                              className="mainbtn2 create-btn mr-4 btn"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                if (step != 1) {
                                  this.setState({ step: step - 1 });
                                }
                              }}
                            >
                              Back
                            </Button>
                          </>
                        )}
                        {values.id == "" && step != 3 && (
                          <Button
                            type="submit"
                            className="mainbtn1 create-btn text-white"
                            style={{ borderRadius: "4px" }}
                            onClick={(e) => {
                              if (values > 0) {
                                this.setState({ tabVisible: true });
                              }
                            }}
                          >
                            Next
                          </Button>
                        )}

                        {/* {step != 3 && (
                          <Button
                            type="submit"
                            className="mainbtn1 create-btn text-white"
                            onClick={(e) => {
                              if (values > 0) {
                                this.setState({ tabVisible: true });
                              }
                            }}
                          >
                            Next
                          </Button>
                        )} */}
                        {/* {JSON.stringify(isSubmitting)} */}
                        {values.id == "" ? (
                          step === 3 ? (
                            <Button
                              className="submit-btn me-2"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {values.id == "" ? "Submit" : "Update"}
                            </Button>
                          ) : (
                            <></>
                          )
                        ) : (
                          <>
                            {" "}
                            <Button
                              className="submit-btn me-2"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {values.id == "" ? "Submit" : "Update"}
                            </Button>
                          </>
                        )}

                        <Button
                          className="cancel-btn"
                          variant="secondary"
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
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Collapse>
        <div className="cust_table">
          <Row className="py-2 mx-0">
            <Col md="3">

              {/* <Form.Group className=" mt-1" controlId="formBasicSearch">
                  <Form.Control
                    type="text"
                    name="Search"
                    id="Search"
                    onChange={(e) => {
                      this.handleSearch(e.target.value);
                    }}
                    placeholder="Search"
                    className="search-box"
                  />
                  <Form.Text>
                    <img className="srch_box" src={search} alt="" />
                  </Form.Text> */}
              {/* <Button type="submit">x</Button> */}
              {/* </Form.Group> */}

              <InputGroup className="mb-2  mdl-text">
                <Form.Control
                  type="text"
                  name="Search"
                  id="Search"
                  onChange={(e) => {
                    this.handleSearch(e.target.value);
                  }}
                  placeholder="Search"
                  className="mdl-text-box"
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col md="9" className="mt-2 btn_align mainbtn_create">
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
                </Button>
              )}
            </Col>
          </Row>

          <div className="tbl-list-style">
            <Table size="sm" hover className="tbl-font">
              <thead>
                <tr>
                  {/* <th>Sr.</th> */}
                  <th>Company Name</th>
                  <th>Company Admin Name</th>
                  <th>Company Code</th>
                  <th>Registered Address</th>
                  <th>Corporate Address</th>
                  <th>Mobile No.</th>
                </tr>
              </thead>
              <tbody className="tabletrcursor">
                {data.length > 0 ? (
                  data.map((v, i) => {
                    return (
                      <tr
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          this.setEditData(v);
                        }}
                      >
                        {/* <td>{i + 1}</td> */}
                        <td>{v.companyName}</td>
                        <td>{v.fullName}</td>
                        <td>{v.companyCode}</td>
                        <td>{v.registeredAddress}</td>
                        <td>{v.corporateAddress}</td>
                        <td>{v.mobile}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {/* )} */}
        </div>
      </div>
    );
  }
}
