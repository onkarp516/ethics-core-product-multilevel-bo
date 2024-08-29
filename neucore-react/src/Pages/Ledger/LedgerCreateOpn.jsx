import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  ButtonGroup,
  FormControl,
  CloseButton,
  Modal,
  Table,
  Tabs,
  Tab,
  Card,
} from "react-bootstrap";
import { Formik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import Add from "@/assets/images/add_blue_circle@3x.png";
import phone from "@/assets/images/phone_icon.png";
import whatsapp from "@/assets/images/whatsapp_icon.png";
import Delete from "@/assets/images/delete.png";
import { faL, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import {
  getUnderList,
  getBalancingMethods,
  getIndianState,
  getIndiaCountry,
  createLedger,
  getGSTTypes,
  createAssociateGroup,
  updateAssociateGroup,
  getValidateLedgermMaster,
  getoutletappConfig,
  getAreaMasterOutlet,
  getSalesmanMasterOutlet,
  createSalesmanMaster,
  createAreaMaster,
  validate_pincode,
} from "@/services/api_functions";
import moment from "moment";
import {
  ShowNotification,
  getRandomIntInclusive,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  eventBus,
  customStylesForJoin,
  ifsc_code_regex,
  pan,
  MyNotifications,
  MobileRegx,
  GSTINREX,
  pincodeReg,
  EMAILREGEXP,
  ledger_select,
  onlydigitsRegExp,
  FSSAIno,
  bankAccountNumber,
  getSelectValue,
  OnlyEnterNumbers,
  OnlyEnterAmount,
  OnlyAlphabets,
  MyTextDatePicker,
  isUserControl,
  allEqual,
  isActionExist,
  getSelectLabel,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getValue } from "../../helpers/constants";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import { connect } from "react-redux";

const taxOpt = [
  { value: "central_tax", label: "Central Tax" },
  { value: "state_tax", label: "State Tax" },
  { value: "integrated_tax", label: "Integrated Tax" },
];

const ledger_type_options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
  // more options...
];
const balanceType = [
  { label: "Dr", value: "1" },
  { label: "Cr", value: "2" },
  // more options...
];
const licencesType = [
  // { label: "Licence No", value: 1 },
  { label: "FSSAI No", value: 1, slug_name: "fssai_number" },
  { label: "Drug License No", value: 2, slug_name: "drug_number" },
  { label: "Mfg. Licence No", value: 3, slug_name: "mfg_number" },
  // more options...
];
const applicable_from_options = [
  { label: "Credit Bill Date", value: "creditBill" },
  { label: "Lr Bill Date", value: "lrBill" },
];

const sales_rate_options = [
  { label: "Sales Rate A", value: 1 },
  { label: "Sales Rate B", value: 2 },
  { label: "Sales Rate C", value: 3 },
];
const ledger_options = [
  { label: "Public", value: false },
  { label: "Private", value: true },
];
class LedgerCreate extends React.Component {
  constructor(props) {
    super(props);
    const curDate = new Date();
    this.myRef = React.createRef();
    this.openingBalRef = React.createRef();
    this.deleref = React.createRef();
    this.invNoRef = React.createRef();
    this.state = {
      isInputDisabled: true,
      salesMaster: false,
      areaMaster: false,
      show: false,
      principleList: [],
      undervalue: [],
      balancingOpt: [],
      stateOpt: [],
      countryOpt: [],
      GSTTypeOpt: [],
      gstList: [],
      dt: moment(curDate).format("DD/MM/YYYY"),
      bankList: [],
      deptList: [],
      shippingList: [],
      billingList: [],
      licensesList: [],
      salesmanList: [],
      cityOpt: [],
      appConfig: [],
      paidBal: 0,
      isSourceUnderSet: false,
      // taxable:false,
      opeBalType: "",
      ledgerSelType: "",
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
        opening_balance: 0,
        is_private: "",
        salesmanId: "",
        ledger_name: "",
        stateId: "",
        areaId: "",
        isGST: "",
        gstin: "",

        // isTaxation:false,
      },

      initVal: {
        id: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        mobile_number: "",
        address: "",
        pincode: "",
        dob: "",
      },
      initValArea: {
        id: "",
        area_name: "",
        area_code: "",
        pincode: "",
      },
      source: "",
      areaId: "",
      areaLst: [],
      salesmanLst: [],

      errorArrayBorder: "",
      balanceList: [],
      balanceInitVal: {
        id: "",
        invoice_no: "",
        invoice_date: "",
        due_date: "",
        bill_amt: "",
        type: "",
        invoice_paid_amt: "",
        invoice_bal_amt: 0,
        // due_days: 0,
        due_days: "",
      },
      openingBal: "",
      invoiceBillAmt: 0,
      invoicePaidBal: 0,
      invoiceBalAmt: 0,
      opnBalModalShow: false,
    };
    this.selectRef = React.createRef();
    this.selectRefBalanceType = React.createRef();
    this.selectRefGST = React.createRef();
    this.pincodeMdlRef = React.createRef();
    this.selectRefLedTyp = React.createRef();
    this.gstRef = React.createRef();
    this.gstBtnRef = React.createRef();
    this.nameInput = React.createRef();
  }

  setInitValue = () => {
    let initValue = {
      associates_id: "",
      associates_group_name: "",
      ledger_name: "",
      stateId: "",
      isGST: "",
      gstin: "",
      underId: "",
      opening_balance: "",
      is_private: getSelectValue(ledger_options, false),
      salesrate: getValue(sales_rate_options, "Sales Rate A"),
    };
    this.setState({ initValue: initValue });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleModal = (status) => {
    if (status == true) {
      let initValue = {
        associates_id: "",
        associates_group_name: "",
        ledger_name: "",
        stateId: "",
        underId: "",
        opening_balance: 0,
        is_private: "",
      };
      this.setState({ initValue: initValue }, () => {
        this.setState({ show: status });
      });
    } else {
      this.setState({ show: status });
    }
  };

  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let Opt = d.map((v, i) => {
            let innerOpt = {};
            if (v.associates_name != "") {
              innerOpt["value"] =
                v.principle_id +
                "_" +
                v.sub_principle_id +
                "_" +
                v.associates_id;
              innerOpt["label"] = v.associates_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            } else if (v.subprinciple_name != "") {
              innerOpt["value"] = v.principle_id + "_" + v.sub_principle_id;
              innerOpt["label"] = v.subprinciple_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            } else {
              innerOpt["value"] = v.principle_id;
              innerOpt["label"] = v.principle_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            }
            return innerOpt;
          });
          this.setState({ undervalue: Opt });
        }
      })
      .catch((error) => {
        this.setState({ undervalue: [] });
      });
  };
  listGSTTypes = () => {
    getGSTTypes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            console.log("res--->", d);
            return { label: v.gstType, value: v.id };
          });
          const { initValue } = this.state;
          console.log("initValue", { initValue });
          let initObj = initValue;

          console.log(initObj["registraion_type"]);
          this.setState({ initValue: initObj, GSTTypeOpt: opt }, () => {
            initObj["registraion_type"] = opt[0];
          });
          console.log("GSTTypeOpt------>", opt[0].label);
        }
      })
      .catch((error) => { });
  };
  lstBalancingMethods = () => {
    getBalancingMethods()
      .then(
        (response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let opt = res.response.map((v, i) => {
              return { value: v.balancing_id, label: v.balance_method };
            });
            const { initValue } = this.state;
            console.log("initValue", { initValue });
            let initObj = initValue;
            initObj["opening_balancing_method"] = opt[0];
            console.log("opening_balancing_method", { initObj });
            this.setState({ initValue: initObj, balancingOpt: opt });
          }
        },
        () => {
          this.myRef.current.setFieldValue("opening_balancing_method", "");
        }
      )
      .catch((error) => { });
  };
  lstState = () => {
    getIndianState()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            return { label: v.stateName, value: v.id };
          });
          this.setState({ stateOpt: opt });
        }
      })
      .catch((error) => { });
  };
  getoutletappConfigData = () => {
    getoutletappConfig()
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.settings.map((v) => {
            return { key: v.key, label: v.label, value: v.value };
          });
          this.setState({ appConfig: opt });
        }
      })
      .catch((error) => { });
  };
  ValidateLedgermMaster = (
    underId,
    principle_id,
    principle_group_id,
    ledger_name,
    supplier_code
  ) => {
    if (principle_id != undefined) {
      console.log("Validate", underId, ledger_name, supplier_code);
      let reqData = new FormData();
      reqData.append("ledger_name", ledger_name);
      if (supplier_code && supplier_code != "") {
        reqData.append("ledger_code", supplier_code);
      }

      reqData.append("principle_id", principle_group_id);
      if (principle_id && principle_id != "") {
        reqData.append("principle_group_id", principle_id);
      }

      getValidateLedgermMaster(reqData)
        .then((response) => {
          let res = response.data;
          console.log("res validate", res);
          if (res.responseStatus == 409) {
            if (
              (ledger_name && ledger_name != "") ||
              (supplier_code && supplier_code != "") ||
              (principle_group_id &&
                principle_group_id != "" &&
                principle_id &&
                principle_id != "")
            ) {
              MyNotifications.fire({
                show: true,
                icon: "error",
                title: "Error",
                msg: res.message,
                // is_button_show: true,
                is_timeout: true,
                delay: 1500,
              });
              setTimeout(() => {
                document.getElementById("ledger_name").focus();
              }, 1000);
            }
            this.myRef.current.setFieldValue("supplier_code", "");
            // this.myRef.current.setFieldValue("ledger_name", "");
          }
        })
        .catch((error) => { });
    }
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
  lstAreaMaster = (isNew = false) => {
    getAreaMasterOutlet()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v, i) => {
            return { label: v.areaName, value: v.id };
          });
          this.setState({ areaLst: opt }, () => { });
          if (isNew) {
            this.myRef.current.setFieldValue("areaId", opt[opt.length - 1]);
          }
        }
      })
      .catch((error) => { });
  };
  lstSalesmanMaster = (isNew = false) => {
    getSalesmanMasterOutlet()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v, i) => {
            return { label: v.firstName + " " + v.lastName, value: v.id };
          });
          // if (opt.length == 0) opt.unshift({ value: "0", label: "Add New" });
          // else opt.unshift({ value: opt.length, label: "Add New" });
          console.log("lstSalesmanMaster>>>", opt.length);
          this.setState({ salesmanLst: opt }, () => { });
          if (isNew) {
            this.myRef.current.setFieldValue("salesmanId", opt[opt.length - 1]);
          }
        }
      })
      .catch((error) => { });
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "ledgercreate",
      to: "ledgerlist",
    });
  };

  OpenLedgerList = (e) => {
    eventBus.dispatch("page_change", "ledgerlist");
  };
  handleKeyPress = (event) => {
    console.log("event", event);
    if (event.altKey && event.key == "l") {
      event.preventDefault();
      this.OpenLedgerList();
    }
  };
  validatePincode = (pincode, setFieldValue) => {
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
            delay: 1500,
          });
          // setFieldValue("pincode", "");
          setTimeout(() => {
            document.getElementById("pincode").focus();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    if (AuthenticationCheck()) {
      this.lstUnders();
      this.lstBalancingMethods();
      this.lstState();
      this.lstCountry();
      this.listGSTTypes();
      this.setInitValue();
      this.getoutletappConfigData();
      this.lstAreaMaster();
      this.lstSalesmanMaster();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

      let x = (x) => { };
      const { prop_data } = this.props.block;
      console.log("ledger prop_data", prop_data);

      this.setState({ source: prop_data.prop_data }, () => {
        // this.handlePropdata();
      });

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }

  componentDidUpdate() {
    let { source, undervalue, isSourceUnderSet } = this.state;
    if (
      source &&
      source != "" &&
      undervalue.length > 0 &&
      isSourceUnderSet == false
    ) {
      this.handlePropdata();
    }
  }

  handlePropdata = () => {
    let { source, undervalue } = this.state;
    console.log("source=-> ", source, undervalue);
    console.log("sales_rate_options=-> ", ledger_options, sales_rate_options);
    if (source.sourceUnder == "purchase") {
      let underId = undervalue.find(
        (v) => v.ledger_form_parameter_slug == "sundry_creditors"
      );
      console.log("underId", underId);
      let initValue = {
        associates_id: "",
        associates_group_name: "",
        ledger_name: "",
        stateId: "",
        isGST: "",
        gstin: "",
        underId: underId,
        opening_balance: 0,
        is_private: getSelectValue(ledger_options, false),
        salesrate: getValue(sales_rate_options, "Sales Rate A"),
      };
      this.setState({ initValue: initValue, isSourceUnderSet: true });
    } else if (source.sourceUnder == "sale") {
      let underId = undervalue.find(
        (v) => v.ledger_form_parameter_slug == "sundry_debtors"
      );
      console.log("underId", underId);
      let initValue = {
        associates_id: "",
        associates_group_name: "",
        ledger_name: "",
        stateId: "",
        isGST: "",
        gstin: "",
        underId: underId,
        opening_balance: 0,
        is_private: getSelectValue(ledger_options, false),
        salesrate: getValue(sales_rate_options, "Sales Rate A"),
      };
      this.setState({ initValue: initValue, isSourceUnderSet: true });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
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

  setLedgerCode = () => {
    let supplier_code = getRandomIntInclusive(1, 1000);
    this.myRef.current.setFieldValue("supplier_code", supplier_code);
  };
  handleFetchGstData = (values, setFieldValue) => {
    console.log("values====>", values);
    console.log("in handleFetch Gst data");
    let gstObj = {
      id: values.id != 0 ? values.id : 0,
      registraion_type:
        values.registraion_type != "" ? values.registraion_type : "",
      gstin: values.gstin != "" ? values.gstin : "",
      dateofregistartion:
        values.dateofregistartion != "" ? values.dateofregistartion : "",
      pan_no: values.pan_no != "" ? values.pan_no : 0,
      index: values.index,
    };
    if (gstObj.registraion_type != "") {
      setFieldValue("registraion_type", gstObj.registraion_type);
    }
    if (gstObj.gstin != "") {
      setFieldValue("gstin", gstObj.gstin);
    }

    if (gstObj.dateofregistartion != "") {
      setFieldValue("dateofregistartion", gstObj.dateofregistartion);
    }
    if (gstObj.pan_no != "") {
      setFieldValue("pan_no", gstObj.pan_no);
    }

    setFieldValue(
      "gst_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );
    setFieldValue("index", gstObj.index);
  };

  handleFetchShippingData = (values, setFieldValue) => {
    console.log("in shiping", values);
    // if (isclear == 0) {
    let shipObj = {
      // id: values.id != 0 ? values.id : 0,
      // details_id: values.details_id != 0 ? values.details_id : 0,
      district: values.district != "" ? values.district : "",
      shipping_address:
        values.shipping_address != "" ? values.shipping_address : "",
      index: values.index,
    };
    console.log({ shipObj });
    setFieldValue("district", shipObj.district);
    // if (shipObj.id != "") {
    //   setFieldValue("sid", shipObj.id);
    // }
    setFieldValue("shipping_address", shipObj.shipping_address);
    setFieldValue("index", shipObj.index);

    // setFieldValue(
    //   "shipping_detail_id",
    //   values.details_id != 0 ? values.details_id : 0
    // );
    // });
    // } else {
    //   setFieldValue("shipping_address", "");
    //   setFieldValue("sid", "");
    //   setFieldValue("district", "");
    // }
  };
  handleFetchBillingData = (values, setFieldValue) => {
    console.log("in shiping", values);
    let billAddObj = {
      b_district: values.b_district != "" ? values.b_district : "",
      billing_address:
        values.billing_address != "" ? values.billing_address : "",
      index: values.index,
    };
    console.log({ billAddObj });
    setFieldValue("b_district", billAddObj.b_district);

    setFieldValue("billing_address", billAddObj.billing_address);
    setFieldValue("index", billAddObj.index);
  };

  handleFetchDepartmentData = (values, setFieldValue) => {
    console.log("in handleFetch department data", values);
    let { deptList } = this.state;
    let deptObj = {
      id: values.id != 0 ? values.id : 0,
      dept: values.dept,

      contact_no: values.contact_no,

      contact_person: values.contact_person,
      email: values.email,
      index: values.index,
    };

    if (deptObj.dept != "") {
      setFieldValue("dept", deptObj.dept);
    }

    if (deptObj.contact_no != "") {
      setFieldValue("contact_no", deptObj.contact_no);
    }
    if (deptObj.contact_person != "") {
      setFieldValue("contact_person", deptObj.contact_person);
    }
    if (deptObj.email != "") {
      setFieldValue("email", deptObj.email);
    }
    setFieldValue("index", deptObj.index);
    setFieldValue(
      "dept_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );

    // deptList = deptList.filter((v, i) => i != index);

    // this.setState({ deptList: deptList });
  };
  handleFetchBankData = (values, setFieldValue) => {
    console.log("in handleFetch Bank data", values);
    let bankObj = {
      id: values.id,
      bank_name: values.bank_name != null ? values.bank_name : "",
      bank_account_no:
        values.bank_account_no != null ? values.bank_account_no : "",
      bank_ifsc_code:
        values.bank_ifsc_code != null ? values.bank_ifsc_code : "",
      bank_branch: values.bank_branch != null ? values.bank_branch : "",
      index: values.index,
    };
    console.log("bankObj", bankObj);
    if (bankObj.bank_name != "") {
      setFieldValue("bank_name", bankObj.bank_name);
    }
    if (bankObj.bank_account_no != "") {
      setFieldValue("bank_account_no", bankObj.bank_account_no);
    }
    if (bankObj.bank_ifsc_code != "") {
      setFieldValue("bank_ifsc_code", bankObj.bank_ifsc_code);
    }

    if (bankObj.bank_branch != "") {
      setFieldValue("bank_branch", bankObj.bank_branch);
    }
    setFieldValue("index", bankObj.index);

    setFieldValue(
      "bank_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );
  };

  addGSTRow = (values, setFieldValue) => {
    console.log("values", values);
    let gstObj = {
      id: values.id,
      registraion_type: values.registraion_type,
      gstin: values.gstin.toUpperCase(),
      dateofregistartion: values.dateofregistartion,
      pan_no: values.pan_no,
      index: values.index,
    };
    console.log("gstObj", gstObj);
    const { gstList } = this.state;
    if (GSTINREX.test(gstObj.gstin)) {
      if (pan.test(gstObj.pan_no)) {
        let old_lst = gstList;
        let is_updated = false;
        let obj = old_lst.filter((value) => {
          return (
            value.registraion_type.value === gstObj.registraion_type.value &&
            value.gstin === gstObj.gstin &&
            value.dateofregistartion === gstObj.dateofregistartion
            // value.pan_no === gstObj.pan_no
          );
        });
        console.log("obj", obj);
        let final_state = [];
        if (obj.length == 0) {
          final_state = old_lst.map((item) => {
            // if (item.gstin === gstObj.gstin) {
            if (item.index === gstObj.index) {
              is_updated = true;
              const updatedItem = gstObj;
              return updatedItem;
            }
            return item;
          });
          if (is_updated == false) {
            final_state = [...gstList, gstObj];
          }
          console.log({ final_state });

          this.setState({ gstList: final_state }, () => {
            setFieldValue("registraion_type", this.state.GSTTypeOpt[0]);
            setFieldValue("gstin", "");
            setFieldValue("dateofregistartion", "");
            setFieldValue("pan_no", "");
            setFieldValue("index", undefined);
          });
        } else {
          console.log("already exists in row");
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: "Gst Details are Already Exist !",
            is_button_show: false,
          });
        }
      } else {
        MyNotifications.fire({
          show: true,
          icon: "error",
          title: "Error",
          msg: "PAN NO is Not Valid ",
          is_button_show: false,
        });
      }
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "GSTIN is not Valid!",
        is_button_show: false,
      });
    }
  };
  // handle click event of the Remove button
  removeGstRow = (index) => {
    const { gstList } = this.state;
    const list = [...gstList];
    list.splice(index, 1);
    this.setState({ gstList: list });
  };
  removeBalanceList = (index) => {
    const { balanceList } = this.state;
    const list = [...balanceList];
    list.splice(index, 1);
    this.setState({ balanceList: list });
  };

  handleFetchLicensesData = (values, setFieldValue) => {
    console.log("in handleFetch License data", values);
    let licensesObj = {
      id: values.id,
      licences_type: values.licences_type != null ? values.licences_type : "",
      licenses_num: values.licenses_num != null ? values.licenses_num : "",
      licenses_exp: values.licenses_exp != null ? values.licenses_exp : "",
      index: values.index,
    };
    console.log("licensesObj", licensesObj);
    if (licensesObj.licences_type != "") {
      setFieldValue("licences_type", licensesObj.licences_type);
    }
    if (licensesObj.licenses_num != "") {
      setFieldValue("licenses_num", licensesObj.licenses_num);
    }
    if (licensesObj.licenses_exp != "") {
      setFieldValue("licenses_exp", licensesObj.licenses_exp);
    }

    setFieldValue("index", licensesObj.index);
  };

  addLicensesRow = (values, setFieldValue) => {
    console.log("values", values);
    let licensesObj = {
      id: values.id,
      licences_type: values.licences_type,
      licenses_num: values.licenses_num,
      licenses_exp: values.licenses_exp,
      index: values.index,
    };
    console.log({ licensesObj });
    const { licensesList } = this.state;
    let old_lst = licensesList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.licences_type === licensesObj.licences_type &&
        value.licenses_num === licensesObj.licenses_num &&
        value.licenses_exp === licensesObj.licenses_exp
      );
    });
    let final_state = [];
    if (obj.length == 0) {
      final_state = old_lst.map((item) => {
        if (item.index == licensesObj.index) {
          is_updated = true;
          const updatedItem = licensesObj;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...licensesList, licensesObj];
      }
      console.log({ final_state });
      this.setState({ licensesList: final_state }, () => {
        setFieldValue("licences_type", "");
        setFieldValue("licenses_num", "");
        setFieldValue("licenses_exp", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Licenses Details are Already Exist !",
        is_button_show: false,
      });
    }
  };
  removeLicensesRow = (index) => {
    const { licensesList } = this.state;
    const list = [...licensesList];
    list.splice(index, 1);
    this.setState({ licensesList: list });
  };

  handleFetchSalesmanData = (values, setFieldValue) => {
    console.log("in handleFetch License data", values);
    let salesmanObj = {
      id: values.id,
      salesmanId: values.salesmanId != null ? values.salesmanId : "",
      areaId: values.areaId != null ? values.areaId : "",
      route: values.route != null ? values.route : "",
      index: values.index,
    };
    console.log("salesmanObj", salesmanObj);
    if (salesmanObj.salesmanId != "") {
      setFieldValue("salesmanId", salesmanObj.salesmanId);
    }
    if (salesmanObj.areaId != "") {
      setFieldValue("areaId", salesmanObj.areaId);
    }
    if (salesmanObj.route != "") {
      setFieldValue("route", salesmanObj.route);
    }

    setFieldValue("index", salesmanObj.index);
  };

  addSalesmanRow = (values, setFieldValue) => {
    console.log("values", values);
    let salesmanObj = {
      id: values.id,
      salesmanId: values.salesmanId,
      areaId: values.areaId,
      route: values.route,
      index: values.index,
    };
    console.log({ salesmanObj });
    const { salesmanList } = this.state;
    let old_lst = salesmanList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.salesmanId === salesmanObj.salesmanId &&
        value.areaId === salesmanObj.areaId &&
        value.route === salesmanObj.route
      );
    });
    let final_state = [];
    if (obj.length == 0) {
      final_state = old_lst.map((item) => {
        if (item.index == salesmanObj.index) {
          is_updated = true;
          const updatedItem = salesmanObj;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...salesmanList, salesmanObj];
      }
      console.log({ final_state });
      this.setState({ salesmanList: final_state }, () => {
        setFieldValue("salesmanId", "");
        setFieldValue("areaId", "");
        setFieldValue("route", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "salesman Details are Already Exist !",
        is_button_show: false,
      });
    }
  };
  removeSalesmanRow = (index) => {
    const { salesmanList } = this.state;
    const list = [...salesmanList];
    list.splice(index, 1);
    this.setState({ salesmanList: list });
  };

  //   let shipObj = {
  //     district: values.district,
  //     shipping_address: values.shipping_address,
  //     index: values.index,
  //   };

  //   let { shippingList } = this.state;

  //   let old_lst = shippingList;
  //   let is_updated = false;

  //   let obj = old_lst.filter((value) => {
  //     return (
  //       value.district === shipObj.district,
  //       value.shipping_address === shipObj.shipping_address
  //     );
  //   });
  //   console.log("obj", obj);
  //   let final_state = [];
  //   if (obj.length == 0) {
  //     if (values.index == -1) {
  //       final_state = old_lst.map((item) => {
  //         // if (item.id != 0 && item.id === shipObj.id) {
  //         is_updated = true;
  //         const updatedItem = shipObj;
  //         return updatedItem;
  //         // }
  //         return item;
  //       });
  //       console.log("is_updated ", is_updated);
  //       if (is_updated == false) {
  //         final_state = [...shippingList, shipObj];
  //       }
  //       console.log({ final_state });
  //     } else {
  //       final_state = old_lst.map((item, i) => {
  //         if (i == values.index) {
  //           return shipObj;
  //         } else {
  //           return item;
  //         }
  //       });
  //     }
  //   } else {
  //     console.log("already exists in row");
  //     MyNotifications.fire({
  //       show: true,
  //       icon: "warning",
  //       title: "Warning",
  //       msg: "Shipping Details are Already Exist !",
  //       is_button_show: false,
  //     });
  //   }

  //   if (is_updated == false) {
  //     final_state = [...shippingList, shipObj];
  //   }
  //   this.setState({ shippingList: final_state }, () => {
  //     setFieldValue("district", "");
  //     setFieldValue("shipping_address", "");
  //   });
  // };

  // handle click event of the Remove button
  addShippingRow = (values, setFieldValue) => {
    console.log("values", values);
    let shipObj = {
      id: values.id,
      district: values.district,
      shipping_address: values.shipping_address,
      index: values.index,
    };

    console.log("ShippingRow---.", shipObj);
    const { shippingList } = this.state;
    let old_lst = shippingList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.district === shipObj.district &&
        value.shipping_address === shipObj.shipping_address
      );
    });
    console.log("obj", obj);
    let final_state = [];

    if (obj.length == 0) {
      final_state = old_lst.map((item, i) => {
        if (item.index == shipObj.index) {
          is_updated = true;
          const newObj = shipObj;
          return newObj;
        }
        return item;
      });

      if (is_updated == false) {
        final_state = [...shippingList, shipObj];
      }
      console.log({ final_state });
      this.setState({ shippingList: final_state }, () => {
        setFieldValue("sid", "");
        setFieldValue("district", "");
        setFieldValue("shipping_address", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Shipping Details are Already Exist !",
        is_button_show: false,
      });
    }
  };

  removeShippingRow = (index) => {
    console.log("index-->", index);
    const { shippingList } = this.state;
    const list = [...shippingList];
    list.splice(index, 1);
    this.setState({ shippingList: list });
  };

  addBillingRow = (values, setFieldValue) => {
    console.log(values);
    let billAddObj = {
      b_district: values.b_district,
      billing_address: values.billing_address,
      index: values.index,
    };

    console.log("Billing Row---.", billAddObj);
    const { billingList } = this.state;
    let old_lst = billingList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.b_district === billAddObj.b_district &&
        value.billing_address === billAddObj.billing_address
      );
    });
    console.log("obj", obj);
    let final_state = [];

    if (obj.length == 0) {
      final_state = old_lst.map((item, i) => {
        if (item.index == billAddObj.index) {
          is_updated = true;
          const newObj = billAddObj;
          return newObj;
        }
        return item;
      });

      if (is_updated == false) {
        final_state = [...billingList, billAddObj];
      }
      console.log({ final_state });
      this.setState({ billingList: final_state }, () => {
        setFieldValue("sid", "");
        setFieldValue("b_district", "");
        setFieldValue("billing_address", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Billing Details are Already Exist !",
        is_button_show: false,
      });
    }
  };

  // handle click event of the Remove button
  removeBillingRow = (index) => {
    const { billingList } = this.state;
    const list = [...billingList];
    list.splice(index, 1);
    this.setState({ billingList: list });
  };

  addDeptRow = (values, setFieldValue) => {
    let deptObj = {
      id: values.id,
      dept: values.dept,
      contact_person: values.contact_person,
      contact_no: values.contact_no,
      email: values.email,
      index: values.index,
    };

    console.log("DeptObj", { deptObj });
    const { deptList } = this.state;

    // if (EMAILREGEXP.test(deptObj.email)) {
    //   if (MobileRegx.test(deptObj.contact_no)) {
    let old_lst = deptList;
    let is_updated = false;

    let obj = old_lst.filter((value) => {
      return (
        value.dept === deptObj.dept &&
        value.contact_person === deptObj.contact_person &&
        value.email === deptObj.email &&
        value.contact_no === deptObj.contact_no
      );
    });
    let final_state = [];
    if (obj.length == 0) {
      final_state = old_lst.map((item) => {
        if (item.index == deptObj.index) {
          is_updated = true;
          const updatedItem = deptObj;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...deptList, deptObj];
      }
      console.log({ final_state });
      this.setState({ deptList: final_state }, () => {
        setFieldValue("dept", "");
        setFieldValue("contact_person", "");
        setFieldValue("contact_no", "");
        setFieldValue("email", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Department Details are Already Exist !",
        is_button_show: false,
      });
    }
    //   } else {
    //     MyNotifications.fire({
    //       show: true,
    //       icon: "error",
    //       title: "Error",
    //       msg: "Mobile No is not valid !",
    //       is_button_show: false,
    //     });
    //   }
    // } else {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "error",
    //     title: "Error",
    //     msg: "Email id is not valid !",
    //     is_button_show: false,
    //   });
    // }
  };

  checkExpiryDate = (setFieldValue, expirydate = 0, ele) => {
    console.log(typeof expirydate);
    console.log("ele--->", ele);
    console.warn("sid :: expirydate", expirydate);
    console.warn("sid:: isValid", moment(expirydate, "DD-MM-YYYY").isValid());
    if (moment(expirydate, "DD-MM-YYYY").isValid() == true) {
      let currentDate = new Date().getTime();
      console.log("currentDate", currentDate);
      // let expdate = new Date(expirydate).getTime();
      let expdate = moment(expirydate, "DD/MM/YYYY").toDate();

      console.warn("--> expirydate", expdate.getTime());
      let etime = expdate.getTime();
      console.log("etime", etime);

      if (ele == "dateofregistartion" || ele == "date_of_registartion") {
        if (currentDate >= etime) {
          // setFieldValue("dateofregistartion", etime);
          console.log("Its Correct");
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "Registration Date Should be Less than Current Date",
            // is_button_show: true,
            is_timeout: true,
            delay: 1500,
          });
          // setFieldValue(ele, "");
          if (ele == "dateofregistartion") {
            setTimeout(() => {
              document.getElementById("dateofregistartion").focus();
            }, 1000);
          } else if (ele == "date_of_registartion") {
            setTimeout(() => {
              document.getElementById("date_of_registartion").focus();
            }, 1000);
          }
        }
      } else {
        if (currentDate >= etime) {
          // MyNotifications.fire(
          // {
          //   show: true,
          //   icon: "confirm",
          //   title: "Expiry date not valid ",
          //   msg: "Do you want continue with this Expiry Date",
          //   is_button_show: false,
          //   is_timeout: false,
          //   delay: 0,
          //   handleSuccessFn: () => {
          //     console.warn("sid:: continue invoice");
          //   },
          //   handleFailFn: () => {
          //     console.warn("sid:: exit from invoice or reload page");
          //     this.handlefail();
          //   },
          // },
          // () => {
          //   console.warn("sid :: return_data");
          // }

          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "Expiry Date Should be Grater than Current Date",
            // is_button_show: true,
            is_timeout: true,
            delay: 1500,
          });
          // @prathmesh @license date validation
          if (ele == "licenses_exp") {
            setTimeout(() => {
              document.getElementById("licenses_exp").focus();
            }, 1000);
          }
          // setFieldValue(ele, "");
          // }
          // );
        } else {
          console.log("Correct Date-->", expirydate);
        }
      }
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Expiry date not valid",
        // is_button_show: true,
        is_timeout: true,
        delay: 1500,
      });
      // setFieldValue(ele, "");
    }
  };
  handlefail = () => {
    console.log("close Called");
  };

  // handle click event of the Remove button
  removeDeptRow = (index) => {
    const { deptList } = this.state;
    const list = [...deptList];
    list.splice(index, 1);
    this.setState({ deptList: list });
  };

  addBankRow = (values, setFieldValue) => {
    let bankObj = {
      id: values.id,
      bank_name: values.bank_name,
      bank_account_no: values.bank_account_no,
      bank_ifsc_code: values.bank_ifsc_code,
      bank_branch: values.bank_branch,
      index: values.index,
    };

    console.log({ bankObj });
    const { bankList } = this.state;
    // if (bankAccountNumber.test(bankObj.bank_account_no)) {
    // if (ifsc_code_regex.test(bankObj.bank_ifsc_code)) {
    let old_lst = bankList;
    let is_updated = false;

    let obj = old_lst.filter((value) => {
      return (
        value.bank_name === bankObj.bank_name &&
        value.bank_account_no === bankObj.bank_account_no &&
        value.bank_ifsc_code === bankObj.bank_ifsc_code &&
        value.bank_branch === bankObj.bank_branch
      );
    });
    let final_state = [];
    if (obj.length == 0) {
      final_state = old_lst.map((item) => {
        // if (item.bank_account_no === bankObj.bank_account_no) {
        if (item.index == bankObj.index) {
          is_updated = true;
          const updatedItem = bankObj;
          return updatedItem;
        }
        return item;
      });
      if (is_updated == false) {
        final_state = [...bankList, bankObj];
      }
      console.log({ final_state });
      this.setState({ bankList: final_state }, () => {
        setFieldValue("bank_name", "");
        setFieldValue("bank_account_no", "");
        setFieldValue("bank_ifsc_code", "");
        setFieldValue("bank_branch", "");
        setFieldValue("index", undefined);
      });
    } else {
      console.log("already exists in row");
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Bank Details are Already Exist !",
        is_button_show: false,
      });
    }
    // } else {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "error",
    //     title: "Error",
    //     msg: "IFSC Code is not valid !",
    //     is_button_show: false,
    //   });
    // }
    // } else {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "error",
    //     title: "Error",
    //     msg: "Account No is not valid!",
    //     is_button_show: false,
    //   });
    // }
  };
  removeBankRow = (index) => {
    const { bankList } = this.state;
    const list = [...bankList];
    list.splice(index, 1);
    this.setState({ bankList: list });
  };
  extract_pan_from_GSTIN = (gstinffield, setFieldValue) => {
    //;
    let pan = gstinffield.substring(2, 12);
    console.log("Pan From Gstin", pan);
    setFieldValue("pan_no", pan);
  };

  clearGSTData = (setFieldValue) => {
    setFieldValue("gstin", "");
    setFieldValue("bid", "");
    setFieldValue("dateofregistartion", "");
    setFieldValue("pan_no", "");

    setFieldValue("gst_detail_id", "");
    setFieldValue("index", -1);
  };
  clearDeptDetails = (setFieldValue) => {
    setFieldValue("index", -1);
    setFieldValue("did", "");
    setFieldValue("dept", "");
    setFieldValue("contact_person", "");
    setFieldValue("contact_no", "");
    setFieldValue("email", "");
    setFieldValue("depart_details_id", "");
  };

  clearShippingBillingData = (setFieldValue) => {
    setFieldValue("index", -1);
    setFieldValue("sid", "");
    setFieldValue("bid", "");
    setFieldValue("b_district", "");
    setFieldValue("district", "");
    setFieldValue("shipping_address", "");
    setFieldValue("billing_address", "");
  };

  clearBankData = (setFieldValue) => {
    setFieldValue("index", -1);
    // setFieldValue("sid", "");
    // setFieldValue("bid", "");
    setFieldValue("bank_name", "");
    setFieldValue("bank_account_no", "");
    setFieldValue("bank_ifsc_code", "");
    setFieldValue("bank_branch", "");
  };

  // handleSwitchClick = () => {
  //   this.setState(prevState => ({
  //     isInputDisabled: !prevState.isInputDisabled,
  //     isVisible: !prevState.isVisible,
  //   }));
  // }

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
      Array.from(Array(index + 1), (v) => {
        errorArrayData.push(value);
      });
    }

    this.setState({ errorArrayBorder: errorArrayData });
  }
  // sales master start
  getDataCapitalisedSalesmaster = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  validatePincode = (pincode, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("pincode", pincode);
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
          setTimeout(() => {
            document.getElementById("pincode").focus();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // sales master end

  // area master start
  getDataCapitalisedArea = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  // area master end
  handleOpeningBalOpen = () => {
    let { balancerows, productSetChange } = this.state;

    let balanceInitVal = {
      id: 0,
      invoice_no: "",
      invoice_date: "",
      due_date: "",
      bill_amt: 0,
      type: "",
      invoice_paid_amt: 0,
      invoice_bal_amt: 0,
      due_days: 0,
      // isOpeningbalance: false,
    };

    let balanceList = balancerows["balanceList"];
    this.setState({
      // index: idx,
      balanceInitVal: balanceInitVal,
      opnBalModalShow: true,
      balanceList: balanceList,
      errorArrayBorder: "",
    });
  };
  setElementValue = (ele, val) => {
    let { balancerows, productSetChange } = this.state;
    balancerows[ele] = val;
    this.setState({ balancerows: balancerows });
  };

  getElementValue = (ele) => {
    let { balancerows } = this.state;
    return balancerows[ele] ? balancerows[ele] : "";
  };

  addOpeningBalRow = (values) => {
    console.log("valuessss in fun===>>>>>>>", values);
    let { balancerows, invoiceBalAmt } = this.state;
    // console.log("opeBalType============>>>>>>>>>>>>>", this.state.opeBalType);
    let balObj = {
      id: values.id,
      invoice_no: values.invoice_no,
      invoice_date: values.invoice_date ? moment(values.invoice_date).format("YYYY-MM-DD") : "",
      due_date: values.due_date ? moment(values.due_date).format("YYYY-MM-DD") : "",
      due_days: values.due_days,
      bill_amt: values.bill_amt,
      invoice_paid_amt: values.invoice_paid_amt,
      invoice_bal_amt: this.finalInvoiceRemainingAmt(),
      type: values.type,
    };
    const { balanceList, openingBal, paidBal } = this.state;
    let old_lst = balanceList;
    let final_state = [];
    if (balObj.invoice_no) {


      // old_lst.map((v, i) => {
      //   if (v.invoice_no === balObj.invoice_no) {
      //     console.log("id condition", v.invoice_no, balObj.invoice_no)
      //     MyNotifications.fire(
      //       {
      //         show: true,
      //         icon: "warning",
      //         title: "Warning",
      //         msg: "Do you want to Submit",
      //         is_button_show: true,
      //         is_timeout: false,
      //         delay: 0,
      //       },
      //       () => {
      //         console.warn("return_data");
      //       }
      //     );
      //   } else {
      //     console.log("in else condi");
      //     final_state = [...balanceList, balObj];
      //   }

      // })
      final_state = [...balanceList, balObj];
      // }

      this.setState(
        {
          balanceList: final_state,
          balancerows: balancerows,
          invoiceBillAmt: 0,
          invoicePaidBal: 0,
          // type: "",
        },
        () => {
          if (this.openingBalRef.current) {
            this.openingBalRef.current.setFieldValue("id", "");
            this.openingBalRef.current.setFieldValue("invoice_no", "");
            this.openingBalRef.current.setFieldValue("invoice_date", "");
            this.openingBalRef.current.setFieldValue("due_date", "");
            this.openingBalRef.current.setFieldValue("due_days", 0);
            this.openingBalRef.current.setFieldValue("bill_amt", 0);
            this.openingBalRef.current.setFieldValue("invoice_paid_amt", 0);
            this.openingBalRef.current.setFieldValue("invoice_bal_amt", 0);
            this.openingBalRef.current.setFieldValue("type", "");
          }
        }
      );
    }
    let opnBal = parseInt(openingBal);
    let selType = balObj.type;
    let paidAmt = 0;
    console.log("selType", selType);

    console.log("in finalBillpaidBal:::::", this.finalBillpaidBal());
    console.log(" in else cond", invoiceBalAmt);
    let invAmt = balObj.invoice_bal_amt
    paidAmt = parseInt(this.finalBillpaidBal()) + invAmt;

    // }
    console.log("opnBal=========>>>>>>>>", opnBal);
    console.log("paidAmt=========>>>>>>>>", paidAmt);
    console.log("paidAmt > opnBal =========>>>>>>>>", paidAmt > opnBal);
    // debugger;
    if (paidAmt > opnBal) {
      // debugger;
      console.warn(
        " paidAmt > opnBal  condition executed <<<<<<",
        paidAmt > opnBal
      );
      MyNotifications.fire(
        {
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Balance Amount is greater than Opening Amount",
          is_button_show: true,
          is_timeout: false,
          delay: 0,
        },
        () => {
          console.warn("return_data");
        }
      );
      this.setState(
        {
          balanceList: old_lst,
          balancerows: balancerows,
        },
        () => {
          if (this.openingBalRef.current) {
            this.openingBalRef.current.setFieldValue("id", 0);
            this.openingBalRef.current.setFieldValue("invoice_no", "");
            this.openingBalRef.current.setFieldValue("invoice_date", "");
            this.openingBalRef.current.setFieldValue("due_date", "");
            this.openingBalRef.current.setFieldValue("due_days", 0);
            this.openingBalRef.current.setFieldValue("bill_amt", 0);
            this.openingBalRef.current.setFieldValue("invoice_paid_amt", 0);
            this.openingBalRef.current.setFieldValue("invoice_bal_amt", 0);
            this.openingBalRef.current.setFieldValue("type", "");
          }
        }
      );
    } else {
      console.warn(
        " ELSE <<<<<<<<<<< paidAmt > opnBal =========>>>>>>>>",
        paidAmt > opnBal
      );
    }
  };

  finalBillpaidBal = () => {
    // debugger;
    const { balanceList, openingBal } = this.state;
    let ledType = this.state.opeBalType;
    let drPaidAmount = 0;
    let crPaidAmount = 0;
    let opnBal = openingBal;
    console.log("balanceList::::::::::", balanceList);
    console.log("ledType::::::::::", ledType);

    balanceList.map((next) => {
      if (next.type.label == "Dr" && ledType == "dr") {
        if (opnBal > next.invoice_bal_amt)
          if ("invoice_bal_amt" in next) {
            drPaidAmount =
              parseInt(drPaidAmount) +
              parseFloat(next.invoice_bal_amt ? next.invoice_bal_amt : "");
          }
        console.log("drPaidAmount=============", drPaidAmount);
        // return drPaidAmount;
      } else if (next.type.label == "Cr" && ledType == "cr") {
        if (opnBal > next.invoice_bal_amt)
          if ("invoice_bal_amt" in next) {
            crPaidAmount =
              parseInt(crPaidAmount) +
              parseFloat(next.invoice_bal_amt ? next.invoice_bal_amt : "");
          }

        console.log("crPaidAmount=============", crPaidAmount);
        // return crPaidAmount;
      }
    });
    if (drPaidAmount != 0) {
      return drPaidAmount;
    } else {
      return crPaidAmount;
    }
  };

  finalRemaningAmt = () => {
    let paidAmt = this.state.openingBal;
    let selectedAmt = this.finalBillpaidBal();

    if (paidAmt != 0) {
      return isNaN(parseFloat(paidAmt) - parseFloat(selectedAmt))
        ? ""
        : parseFloat(paidAmt) - parseFloat(selectedAmt);
    } else {
      return "";
    }
  };

  finalInvoiceRemainingAmt = () => {
    let billAmt = this.state.invoiceBillAmt;
    let paidAmt = this.state.invoicePaidBal ? this.state.invoicePaidBal : 0;
    console.log("billAmt:::::::", billAmt);
    console.log("paidAmt:::::::", paidAmt);
    let remAmt = "";

    if (billAmt > 0 || paidAmt > 0) {
      if (billAmt > paidAmt) {
        remAmt = isNaN(parseFloat(billAmt) - parseFloat(paidAmt))
          ? 0
          : parseFloat(billAmt) - parseFloat(paidAmt);
        console.log("in if conditions:::::::::");
      } else {
        MyNotifications.fire(
          {
            show: true,
            icon: "warning",
            title: "Warning",
            msg: "Paid Amount is greater than Bill Amount",
            is_button_show: true,
            is_timeout: false,
            delay: 0,
          },
          () => {
            console.warn("return_data");
          }
        );
      }
    } else {
      remAmt = "";
      console.log("in else conditions:::::::::");
    }
    return remAmt;
  };

  clearOpeningBalData = (setFieldValue) => {
    if (this.openingBalRef.current) {
      this.openingBalRef.current.setFieldValue("index", -1);
      this.openingBalRef.current.setFieldValue("id", "");
      this.openingBalRef.current.setFieldValue("invoice_no", "");
      this.openingBalRef.current.setFieldValue("invoice_date", "");
      this.openingBalRef.current.setFieldValue("due_date", "");
      this.openingBalRef.current.setFieldValue("due_days", "");
      this.openingBalRef.current.setFieldValue("bill_amt", "");
      this.openingBalRef.current.setFieldValue("invoice_paid_amt", "");
      this.openingBalRef.current.setFieldValue("invoice_bal_amt", "");
      this.openingBalRef.current.setFieldValue("type", "");
      this.setState({ invoiceBalAmt: 0, invoiceBillAmt: 0, invoicePaidBal: 0 });
    }
  };

  openingBalanceUpdate = (values, setFieldValue) => {
    console.log("Balance========>>>>>>>>>>>>>>", values);
    let balanceInitVal = {
      id: values.id,
      invoice_no: values.invoice_no != "" ? values.invoice_no : "",
      invoice_date:
        values.invoice_date != ""
          ? moment(values.invoice_date).format("DD-MM-YYYY")
          : "",
      due_date:
        values.due_date != ""
          ? moment(values.due_date).format("DD-MM-YYYY")
          : "",
      due_days: values.due_days != 0 ? values.due_days : "",
      bill_amt: values.bill_amt != 0 ? values.bill_amt : "",
      invoice_paid_amt:
        values.invoice_paid_amt != 0 ? values.invoice_paid_amt : "",
      invoice_bal_amt:
        values.invoice_bal_amt != 0 ? values.invoice_bal_amt : "",
      type:
        values.type != 0
          ? getSelectLabel(balanceType, values.type.label.toLowerCase())
          : "",
    };

    this.setState({
      balanceInitVal: balanceInitVal,
      invoiceBillAmt: balanceInitVal.bill_amt,
      invoicePaidBal: balanceInitVal.invoice_paid_amt,
      // balanceList: balanceInitVal,
    });
    console.log("values---open", values);
    console.log("values---open", this.state.balanceList);
    setFieldValue("invoice_no", values.invoice_no);
    setFieldValue("invoice_date", values.invoice_date);
    setFieldValue("due_date", values.due_date);
    setFieldValue("due_days", values.due_days);
    setFieldValue("bill_amt", values.bill_amt);
    setFieldValue("invoice_paid_amt", values.invoice_paid_amt);
    setFieldValue("invoice_bal_amt", values.invoice_bal_amt);
    setFieldValue("type", values.b_purchase_rate);
  };

  duplicateInvoiceNo = (invoiceDate, invoiceNo) => {
    const { balanceList } = this.state;
    let date = moment(invoiceDate).format("YYYY-MM-DD");
    balanceList.map((next) => {
      if (date === next.invoice_date && next.invoice_no === invoiceNo) {
        MyNotifications.fire(
          {
            show: true,
            icon: "warning",
            title: "Warning",
            msg: "Invoice already exist",
            is_button_show: true,
            is_timeout: false,
            delay: 0,
          },
          () => {
            console.warn("return_data");

          }

        );
        if (this.openingBalRef.current) {
          this.openingBalRef.current.setFieldValue("invoice_no", "");
          this.openingBalRef.current.setFieldValue("invoice_date", "");
        }
      }
    })
  }

  render() {
    let { from_source } = this.props;
    const {
      isInputDisabled,
      isVisible,
      show,
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      GSTTypeOpt,
      dt,
      cityOpt,
      initValue,
      gstList,
      licensesList,
      salesmanList,
      options,
      deptList,
      shippingList,
      billingList,
      bankList,
      appConfig,
      areaLst,
      salesmanLst,
      errorArrayBorder,
      salesMaster,
      areaMaster,
      initVal,
      initValArea,
      opnBalModalShow,
      balanceInitVal,
      balancerows,
      balanceList,
      openingBal,
      // balanceType,
      invoiceBillAmt,
      invoicePaidBal,
      isSourceUnderSet,
    } = this.state;
    const validate = (values) => {
      const errors = {};
      let { underId } = values;
      let { ledger_form_parameter_slug } = underId;
      switch (ledger_form_parameter_slug) {
        case "sundry_debtors":
          if (!values.mailing_name) {
            errors.mailing_name = "required";
          }
          if (!values.ledger_name) {
            errors.ledger_name = "required";
          }

          // if (!values.ledger_name) {
          //   errors.ledger_name = "required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.ledger_name)) {
          //   errors.ledger_name = "Invalid Ledger Name.";
          // }
          if (!values.is_private) {
            errors.is_private = "required";
          }

          // if (!values.address) {
          //   errors.address = "Required";
          // }

          if (!values.city) {
            errors.city = "required";
          }
          // if (!values.salesrate) {
          //   errors.salesrate = "sales rate required";
          // }
          console.log("values.gstList.length->", values);
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "PAN Required";
          // }
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid PAN No";
          // }
          // console.log(typeof values.credit_days);
          if (parseInt(values.credit_days) > 0) {
            console.log("values.applicable_from", values.applicable_from);
            if (!values.applicable_from) {
              errors.applicable_from = "required";
            }
          }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.gstin == ""
          // ) {
          //   errors.gstin = "Required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.registraion_type == ""
          // ) {
          //   errors.registraion_type = "Required";
          // }
          // if (!values.opening_balance) {
          //   errors.opening_balance = "opening balance is required";
          // }

          // if (!values.pincode) {
          //   errors.pincode = "Required";
          // } else if (!/^[1-9][0-9]{5}$/i.test(values.pincode)) {
          //   errors.email_id = "pincode is invalid";
          // }
          if (!values.stateId) {
            errors.stateId = "required";
          }
          if (!values.countryId) {
            errors.countryId = "required";
          }

          // if (!values.isTaxation) {
          //   errors.isTaxation = "Required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == false &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "Required";
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid Pan no";
          // }
          if (values.email && values.email == "") {
            errors.email = "Invalid email address";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.phone_no) {
            errors.phone_no = "Required";
          } else if (
            !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
              values.phone_no
            )
          ) {
            errors.phone_no = "Invalid Mobile No.";
          }
          // if (!values.mailing_name) {
          //   errors.mailing_name = "Mailing name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.mailing_name)) {
          //   errors.mailing_name = "Invalid Mailing Name.";
          // }
          // if (!values.contact_person) {
          //   errors.contact_person = "Contact name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.contact_person)) {
          //   errors.contact_person = "Invalid Contact Name.";
          // }
          // if (!values.contact_no) {
          //   errors.contact_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.contact_no
          //   )
          // ) {
          //   errors.contact_no = "Invalid Mobile No.";
          // }
          // if (!values.gstin.length(15)) {
          //   errors.gstin = "Invalid GST NO";
          // }
          break;
        case "sundry_creditors":
          // if (!values.ledger_name) {
          //   errors.ledger_name = "Ledger name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.ledger_name)) {
          //   errors.ledger_name = "Invalid Ledger Name.";
          // }
          // if (!values.supplier_code) {
          //   errors.supplier_code = "Supplier Code is required";
          // }
          // if (!values.is_private) {
          //   errors.is_private = "Ledger Type is required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "PAN required";
          // }
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid PAN No";
          // }

          if (
            values.isTaxation &&
            values.isTaxation.value == true &&
            values.registraion_type == ""
          ) {
            errors.registraion_type = "Registration Type required";
          }
          // } else if (
          //   !values.registraion_type == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.registraion_type)
          // ) {
          //   errors.registraion_type = "Type required";
          // }

          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.gstin == ""
          // ) {
          //   errors.gstin = "required";
          // }
          // } else if (
          //   !values.gstin == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.gstin)
          // ) {
          //   errors.gstin = "Type required";
          // }

          // if (!values.opening_balance_type) {
          //   errors.opening_balance_type = "Selection is required";
          // }
          // if (!values.address) {
          //   errors.address = "Address field is required";
          // }
          // if (!values.pincode) {
          //   errors.pincode = "Required";
          // } else if (!/^[1-9][0-9]{5}$/i.test(values.pincode)) {
          //   errors.email_id = "pincode is invalid";
          // }
          if (!values.ledger_name) {
            errors.ledger_name = "required";
          }
          if (!values.stateId) {
            errors.stateId = "required";
          }

          if (!values.countryId) {
            errors.countryId = "required";
          }
          if (!values.city) {
            errors.city = "required";
          }
          // if (!values.credit_days) {
          //   errors.credit_days = "Required";
          // }
          // if (!values.opening_balance) {
          //   errors.opening_balance = "Opening balance required";
          // }
          // if (!values.isTaxation) {
          //   errors.isTaxation = "Required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == false &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "Required";
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid Pan no";
          // }
          // if (
          //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email_id)
          // ) {
          //   errors.email_id = "Invalid email address";
          // }
          // if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          //   errors.email = "Invalid email address";
          // }
          // if (values.email && values.email == "") {
          //   errors.email = "Invalid email address";
          // } else if (
          //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          // ) {
          //   errors.email = "Invalid email address";
          // }
          // if (/^[0-9\b]+$/.test(values.phone_no)) {
          //   errors.phone_no = "Invalid Mobile No.";
          // }
          // if (!values.phone_no) {
          //   errors.phone_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.phone_no
          //   )
          // ) {
          //   errors.phone_no = "Invalid Mobile No.";
          // }
          // if (!values.mailing_name) {
          //   errors.mailing_name = "Mailing name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.mailing_name)) {
          //   errors.mailing_name = "Invalid Mailing Name.";
          // }
          // if (!values.contact_person) {
          //   errors.contact_person = "Contact name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.contact_person)) {
          //   errors.contact_person = "Invalid Contact Name.";
          // }
          // if (!values.contact_no) {
          //   errors.contact_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.contact_no
          //   )
          // ) {
          //   errors.contact_no = "Invalid Mobile No.";
          // }
          break;
        case "bank_account":
          if (!values.ledger_name) {
            errors.ledger_name = "required";
          }
          if (!values.is_private) {
            errors.is_private = "required";
          }
          // if (!values.opening_balance) {
          //   errors.opening_balance = "Selection is required";
          // }
          // if (!values.pincode) {
          //   errors.pincode = "Required";
          // } else if (!/^[1-9][0-9]{5}$/i.test(values.pincode)) {
          //   errors.email_id = "pincode is invalid";
          // }
          // if (!values.bank_account_no) {
          //   errors.bank_account_no = "required";
          // }
          // if (!values.bank_name) {
          //   errors.bank_name = "required";
          // }
          // if (!values.bank_branch) {
          //   errors.bank_branch = "required";
          // }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.gstin == ""
          // ) {
          //   errors.gstin = "required";
          // } else if (
          //   !values.gstin == "" &&
          //   !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(
          //     values.gstin
          //   )
          // ) {
          //   errors.gstin = "Invalid GSTIN no";
          // }
          // if (values.bank_ifsc_code == "") {
          //   errors.bank_ifsc_code = "Required";
          // } else if (
          //   !values.bank_ifsc_code == "" &&
          //   !/^[A-Za-z]{4}[0-9]{7}$/i.test(values.bank_ifsc_code)
          // ) {
          //   errors.bank_ifsc_code = "Invalid IFSC CODE";
          // }
          // if (!values.stateId) {
          //   errors.stateId = "Required";
          // }
          // if (!values.countryId) {
          //   errors.countryId = "Required";
          // }
          // if (!values.opening_balance_type) {
          //   errors.opening_balance_type = "Selection is required";
          // }
          // if (!values.phone_no) {
          //   errors.phone_no = "Required";
          // } else if (
          //   !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          //     values.phone_no
          //   )
          // ) {
          //   errors.phone_no = "Invalid Mobile No.";
          // }
          // if (!values.isTaxation) {
          //   errors.isTaxation = "Required";
          // }
          // if (
          //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email_id)
          // ) {
          //   errors.email_id = "Invalid email address";
          // }
          break;
        case "duties_taxes":
          if (!values.ledger_name) {
            errors.ledger_name = "Ledger name is required";
          }
          if (!values.tax_type) {
            errors.tax_type = "Tax type is required";
          }
          if (!values.is_private) {
            errors.is_private = "Ledger type is required";
          }
          break;
        case "assets":
          {
            if (!values.ledger_name) {
              errors.ledger_name = "Ledger name is required";
            }
          }
          if (!values.is_private) {
            errors.is_private = "Ledger type is required";
          }
          // if (!values.opening_balance) {
          //   errors.opening_balance = "Opening balance required";
          // }
          break;
        case "others":
          {
            if (!values.ledger_name) {
              errors.ledger_name = "Ledger name is required";
            }
          }
          if (!values.is_private) {
            errors.is_private = "Ledger type is required";
          }
      }
      return errors;
    };

    return (
      <div>
        <div id="example-collapse-text" className="new_ledger_create_style p-0">
          <div className="main-div mb-2 m-0">
            {/* <h4 className="form-header">Create Ledger</h4> */}
            {/* {JSON.stringify(initValue, undefined, 2)} */}
            <Formik
              validateOnChange={false}
              innerRef={this.myRef}
              enableReinitialize={true}
              initialValues={initValue}
              // validate={validate}
              validationSchema={Yup.object().shape({})}
              onSubmit={(values, { resetForm }) => {
                if (values.ledger_name) {
                  values.ledger_name = values.ledger_name.trim();
                  let stateIdFlag = true;
                  if (
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "sundry_debtors"
                  ) {
                    console.log("inside if ==>>");

                    if (values.stateId == "") {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Select State. ",
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        // document.getElementById("stateIdSel").focus();
                        this.selectRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    }

                    if (values.isGST === true) {
                      if (values.gstin == "" && gstList.length == 0) {
                        // alert("Please Add GST Row. ");
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add / Disable GST Row ",
                          // is_button_show: true,
                          is_timeout: true,
                          delay: 1000,
                        });
                        setTimeout(() => {
                          this.gstRef.current?.focus();
                        }, 1000);
                        stateIdFlag = false;
                      } else if (values.gstin !== "") {
                        if (gstList.length == 0) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Please Add GST Row / Clear. ",
                            is_button_show: true,
                            // is_timeout: true,
                            // delay: 1000,
                          });
                          // setTimeout(() => {
                          //   this.gstBtnRef.current?.focus();
                          // }, 1000);
                          stateIdFlag = false;
                        } else if (gstList.length > 0) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Please Add GST Row / Clear. ",
                            is_button_show: true,
                            // is_timeout: true,
                            // delay: 1000,
                          });
                          // setTimeout(() => {
                          //   this.gstBtnRef.current?.focus();
                          // }, 1000);
                          stateIdFlag = false;
                        }
                      }
                    }
                  } else if (
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "sundry_creditors"
                  ) {
                    console.log("inside if ==>>");

                    if (values.stateId == "") {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Select State. ",
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        // document.getElementById("stateIdSel").focus();
                        this.selectRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    }

                    if (values.isGST === true) {
                      if (values.gstin == "" && gstList.length == 0) {
                        // alert("Please Add GST Row. ");
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add / Disable GST Row ",
                          // is_button_show: true,
                          is_timeout: true,
                          delay: 1000,
                        });
                        setTimeout(() => {
                          this.gstRef.current?.focus();
                        }, 1000);
                        stateIdFlag = false;
                      } else if (values.gstin !== "") {
                        if (gstList.length == 0) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Please Add GST Row / Clear. ",
                            is_button_show: true,
                            // is_timeout: true,
                            // delay: 1000,
                          });
                          // setTimeout(() => {
                          //   this.gstBtnRef.current?.focus();
                          // }, 1000);
                          stateIdFlag = false;
                        } else if (gstList.length > 0) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Please Add GST Row / Clear. ",
                            is_button_show: true,
                            // is_timeout: true,
                            // delay: 1000,
                          });
                          // setTimeout(() => {
                          //   this.gstBtnRef.current?.focus();
                          // }, 1000);
                          stateIdFlag = false;
                        }
                      }
                    }
                  }

                  if (stateIdFlag == true) {
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to Submit",
                        is_button_show: false,
                        is_timeout: false,
                        handleSuccessFn: () => {
                          const formData = new FormData();
                          if (
                            values.underId &&
                            values.underId.under_prefix != null
                          ) {
                            formData.append(
                              "under_prefix",
                              values.underId ? values.underId.under_prefix : ""
                            );
                          }
                          if (
                            values.underId &&
                            values.underId.associates_id != null
                          ) {
                            formData.append(
                              "associates_id",
                              values.underId ? values.underId.associates_id : ""
                            );
                          }
                          console.log(
                            "slug>>>",
                            values.underId.ledger_form_parameter_slug.toLowerCase()
                          );
                          // !sundry Debtors
                          if (
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_debtors"
                          ) {
                            console.log("inside if ==>>");

                            // validation start
                            // // //! validation required start
                            // let errorArray = [];
                            // if (values.underId == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // // if (
                            // //   values.supplier_code == "" ||
                            // //   values.supplier_code == undefined
                            // // ) {
                            // //   errorArray.push("Y");
                            // // } else {
                            // //   errorArray.push("");
                            // // }

                            // if (
                            //   values.ledger_name == "" ||
                            //   values.ledger_name == undefined
                            // ) {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // if (values.stateId == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // if (values.registraion_type == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // if (values.phone_no == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // if (values.email_id == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }
                            // validation end

                            // console.warn("errorArray->>>>>>>>>>>>>", errorArray);
                            // this.setState({ errorArrayBorder: errorArray }, () => {
                            //   if (allEqual(errorArray)) {
                            if (values.ledger_name != null) {
                              formData.append(
                                "ledger_name",
                                values.ledger_name ? values.ledger_name : ""
                              );
                            }
                            if (values.supplier_code != null) {
                              formData.append(
                                "supplier_code",
                                values.supplier_code
                              );
                            }
                            if (values.route != null) {
                              formData.append("route", values.route);
                            }
                            if (
                              values.underId &&
                              values.underId.sub_principle_id != null
                            ) {
                              formData.append(
                                "principle_group_id",
                                values.underId.sub_principle_id
                                  ? values.underId.sub_principle_id
                                  : ""
                              );
                            }
                            if (
                              values.underId &&
                              values.underId.principle_id != null
                            ) {
                              formData.append(
                                "principle_id",
                                values.underId.principle_id
                                  ? values.underId.principle_id
                                  : ""
                              );
                            }

                            if (
                              values.tradeOfBusiness != null &&
                              values.tradeOfBusiness != "" &&
                              values.tradeOfBusiness != undefined
                            ) {
                              formData.append(
                                "businessType",
                                values.tradeOfBusiness
                              );
                            }
                            if (
                              values.natureOfBusiness != null &&
                              values.natureOfBusiness != "" &&
                              values.natureOfBusiness != undefined
                            ) {
                              formData.append(
                                "businessTrade",
                                values.natureOfBusiness
                              );
                            }

                            if (
                              values.licenseNo != null &&
                              values.licenseNo != ""
                            ) {
                              formData.append("licenseNo", values.licenseNo);
                            }
                            if (
                              values.license_expiry != null &&
                              values.license_expiry != ""
                            ) {
                              let fexp = moment(
                                values.license_expiry,
                                "DD/MM/YYYY"
                              ).toDate();
                              formData.append(
                                "licenseExpiryDate",
                                moment(new Date(fexp)).format("yyyy-MM-DD")
                              );
                            }

                            if (values.fssai != null) {
                              formData.append("fssai", values.fssai);
                            }
                            if (
                              values.fssai_expiry != null &&
                              values.fssai_expiry != ""
                            ) {
                              let fexp = moment(
                                values.fssai_expiry,
                                "DD/MM/YYYY"
                              ).toDate();
                              formData.append(
                                "foodLicenseExpiryDate",
                                moment(new Date(fexp)).format("yyyy-MM-DD")
                              );
                            }

                            if (values.drug_license_no != null) {
                              formData.append(
                                "drug_license_no",
                                values.drug_license_no
                              );
                            }
                            if (
                              values.drug_expiry != null &&
                              values.drug_expiry != ""
                            ) {
                              let dexp = moment(
                                values.drug_expiry,
                                "DD/MM/YYYY"
                              ).toDate();
                              formData.append(
                                "drug_expiry",
                                moment(new Date(dexp)).format("yyyy-MM-DD")
                              );
                            }

                            if (
                              values.mfg_license_no != null &&
                              values.mfg_license_no != ""
                            ) {
                              formData.append(
                                "manufacturingLicenseNo",
                                values.mfg_license_no
                              );
                            }
                            if (
                              values.mfg_expiry != null &&
                              values.mfg_expiry != ""
                            ) {
                              let dexp = moment(
                                values.mfg_expiry,
                                "DD/MM/YYYY"
                              ).toDate();
                              formData.append(
                                "manufacturingLicenseExpiry",
                                moment(new Date(dexp)).format("yyyy-MM-DD")
                              );
                            }

                            if (values.dob != null && values.dob != "") {
                              let dexp = moment(
                                values.dob,
                                "DD/MM/YYYY"
                              ).toDate();
                              formData.append(
                                "dob",
                                moment(new Date(dexp)).format("yyyy-MM-DD")
                              );
                            }
                            if (values.doa != null && values.doa != "") {
                              let dexp = moment(
                                values.doa,
                                "DD/MM/YYYY"
                              ).toDate();
                              formData.append(
                                "anniversary",
                                moment(new Date(dexp)).format("yyyy-MM-DD")
                              );
                            }

                            if (
                              values.underId &&
                              values.underId.ledger_form_parameter_id != null
                            ) {
                              formData.append(
                                "underId",
                                values.underId.ledger_form_parameter_id
                                  ? values.underId.ledger_form_parameter_id
                                  : ""
                              );
                            }
                            if (values.mailing_name != null) {
                              formData.append(
                                "mailing_name",
                                values.mailing_name
                              );
                            }
                            formData.append(
                              "opening_bal_type",
                              values.opening_balance_type
                                ? values.opening_balance_type == "dr"
                                  ? "Dr"
                                  : "Cr"
                                : "Dr"
                            );

                            let openingBal = "";
                            if (values.opening_balance_type == "dr") {
                              // debugger;
                              if (values.opening_balance > 0) {
                                openingBal = values.opening_balance * -1;
                              }
                            } else {
                              openingBal = values.opening_balance;
                            }
                            console.log(
                              "balance List ============>>>>>>>>>>>"
                              // JSON.stringify(balanceList)
                            );
                            if (balanceList.length > 0) {
                              console.log(
                                "balance List ============>>>>>>>>>>>"
                                // JSON.stringify(balanceList)
                              );
                              formData.append(
                                "opening_bal_invoice_list",
                                JSON.stringify(balanceList)
                              );
                            }
                            formData.append("opening_bal", openingBal);

                            if (values.opening_balancing_method != null) {
                              formData.append(
                                "balancing_method",
                                values.opening_balancing_method.value
                              );
                            }
                            if (values.address != null) {
                              formData.append("address", values.address);
                            }
                            if (values.stateId != null) {
                              formData.append(
                                "state",
                                values.stateId
                                  ? values.stateId != ""
                                    ? values.stateId.value
                                    : 0
                                  : 0
                              );
                            }
                            if (
                              values.countryId != "" &&
                              values.countryId != null
                            ) {
                              formData.append(
                                "country",
                                values.countryId
                                  ? values.countryId != ""
                                    ? values.countryId.value
                                    : 0
                                  : 0
                              );
                            }
                            if (values.pincode != null) {
                              formData.append("pincode", values.pincode);
                            }
                            if (values.city != null) {
                              formData.append("city", values.city);
                            }
                            if (values.email_id && values.email_id != null) {
                              formData.append("email", values.email_id);
                            }
                            // if (values.phone_no != null) {
                            //   formData.append("mobile_no", values.phone_no);
                            // }
                            if (
                              values.phone_no != "" &&
                              values.phone_no != null
                            ) {
                              formData.append("mobile_no", values.phone_no);
                            }
                            if (values.whatsapp_no != null) {
                              formData.append(
                                "whatsapp_no",
                                values.whatsapp_no ? values.whatsapp_no : 0
                              );
                            }
                            if (values.date_of_registartion != null) {
                              formData.append(
                                "reg_date",
                                values.date_of_registartion
                                  ? moment(values.date_of_registartion).format(
                                    "YYYY-MM-DD"
                                  )
                                  : ""
                              );
                            }
                            // if(values.isCredit==true){
                            if (
                              values.isCredit != null &&
                              values.isCredit != ""
                            ) {
                              formData.append("isCredit", values.isCredit);
                            } else {
                              formData.append("isCredit", false);
                            }

                            if (
                              values.credit_days != null &&
                              values.credit_days != "" &&
                              values.credit_days != undefined
                            ) {
                              formData.append(
                                "credit_days",
                                values.credit_days
                              );
                              if (values.applicable_from != null) {
                                formData.append(
                                  "applicable_from",
                                  values.applicable_from.label
                                );
                              }
                            }

                            if (
                              values.credit_bills != null &&
                              values.credit_bills != "" &&
                              values.credit_bills != undefined
                            ) {
                              formData.append(
                                "creditNumBills",
                                values.credit_bills
                              );
                            }

                            if (
                              values.credit_values != null &&
                              values.credit_values != "" &&
                              values.credit_values != undefined
                            ) {
                              formData.append(
                                "creditBillValue",
                                values.credit_values
                              );
                            }
                            // }
                            if (values.salesrate != null) {
                              formData.append(
                                "salesrate",
                                values.salesrate.value
                              );
                            }
                            if (values.salesmanId != null) {
                              // formData.append("salesman", values.salesman);
                              formData.append(
                                "salesmanId",
                                values.salesmanId.value
                              );
                            }
                            if (values.areaId != null) {
                              //formData.append("area", values.area);
                              formData.append("area", values.areaId.value);
                            }
                            if (values.fssai != null) {
                              formData.append("fssai", values.fssai);
                            }

                            // if (values.isTaxation != null) {
                            //   formData.append("taxable", values.isTaxation);
                            // }

                            if (
                              values.isGST != null &&
                              values.isGST != "" &&
                              values.isGST != undefined
                            ) {
                              formData.append("isGST", values.isGST);
                            } else {
                              formData.append("isGST", false);
                            }
                            if (values.pan_no != null) {
                              formData.append("pan_no", values.pan_no);
                            }

                            let gstdetails = [];
                            // if (values.isTaxation == true) {
                            // if (values.registraion_type != null) {
                            //   formData.append(
                            //     "registration_type",
                            //     values.registraion_type.value
                            //   );
                            // }
                            // console.log("gst", JSON.stringify(gstList));

                            gstdetails = gstList.map((v, i) => {
                              let obj = {};
                              obj["gstin"] = v.gstin;
                              if (
                                v.registraion_type != null &&
                                v.registraion_type != ""
                              ) {
                                obj["registration_type"] =
                                  v.registraion_type.value;
                              }
                              if (
                                v.dateofregistartion != "" &&
                                v.dateofregistartion != null
                              ) {
                                let pandateofregistration = moment(
                                  v.dateofregistartion,
                                  "DD/MM/YYYY"
                                ).toDate();
                                obj["dateofregistartion"] = moment(
                                  new Date(pandateofregistration)
                                ).format("yyyy-MM-DD");
                              }
                              // obj["dateofregistartion"] = moment(
                              //   v.dateofregistartion
                              // ).format("YYYY-MM-DD");

                              if (v.pan_no != "") obj["pancard"] = v.pan_no;

                              return obj;
                            });
                            // }

                            formData.append(
                              "gstdetails",
                              JSON.stringify(gstdetails)
                            );

                            let billingDetails = billingList.map((v, i) => {
                              return {
                                district: v.b_district,
                                billing_address: v.billing_address,
                              };
                            });

                            formData.append(
                              "billingDetails",
                              JSON.stringify(billingDetails)
                            );

                            if (values.isLicense != null) {
                              formData.append("isLicense", values.isLicense);
                            } else {
                              formData.append("isLicense", false);
                            }

                            // if(values.isLicense==true){
                            let licensesDetails = licensesList.map((v, i) => {
                              return {
                                licences_type: v.licences_type,
                                licenses_num: v.licenses_num,
                                licenses_exp: v.licenses_exp
                                  ? moment(v.licenses_exp).format("YYYY-MM-DD")
                                  : "",
                              };
                            });

                            formData.append(
                              "licensesDetails",
                              JSON.stringify(licensesDetails)
                            );
                            // }

                            if (values.isBankDetails != null) {
                              formData.append(
                                "isBankDetails",
                                values.isBankDetails
                              );
                            } else {
                              formData.append("isBankDetails", false);
                            }

                            formData.append(
                              "bankDetails",
                              JSON.stringify(bankList)
                            );

                            if (values.salesmanDetails != null) {
                              formData.append(
                                "salesmanDetails",
                                values.salesmanDetails
                              );
                            } else {
                              formData.append("salesmanDetails", false);
                            }

                            let salesmanDetails = salesmanList.map((v, i) => {
                              return {
                                salesmanId: v.salesmanId,
                                areaId: v.areaId,
                                route: v.route,
                              };
                            });

                            formData.append(
                              "salesmanDetails",
                              JSON.stringify(salesmanDetails)
                            );

                            if (values.isShippingDetails != null) {
                              formData.append(
                                "isShippingDetails",
                                values.isShippingDetails
                              );
                            } else {
                              formData.append("isShippingDetails", false);
                            }

                            let shippingDetails = shippingList.map((v, i) => {
                              return {
                                shipping_address: v.shipping_address,
                                district: v.district.value,
                              };
                            });

                            // if(values.isShippingDetails==true)
                            // {
                            formData.append(
                              "shippingDetails",
                              JSON.stringify(shippingDetails)
                            );
                            // }

                            if (values.isDepartment != null) {
                              formData.append(
                                "isDepartment",
                                values.isDepartment
                              );
                            } else {
                              formData.append("isDepartment", false);
                            }

                            // if(values.isDepartment==true)
                            // {
                            let deptDetails = [];
                            deptDetails = deptList.map((v, i) => {
                              let obj = {
                                dept: v.dept,
                                contact_person: v.contact_person,
                                contact_no: v.contact_no,
                              };

                              if (v.email != "") obj["email"] = v.email;

                              return obj;
                            });
                            formData.append(
                              "deptDetails",
                              JSON.stringify(deptDetails)
                            );
                            // }
                            //   }
                            // });
                          }

                          console.log("this.state ", this.state);

                          if (
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_creditors"
                          ) {
                            // validation start
                            // //! validation required start
                            // let errorArray = [];
                            // if (values.underId == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // // if (
                            // //   values.supplier_code == "" ||
                            // //   values.supplier_code == undefined
                            // // ) {
                            // //   errorArray.push("Y");
                            // // } else {
                            // //   errorArray.push("");
                            // // }

                            // if (
                            //   values.ledger_name == "" ||
                            //   values.ledger_name == undefined
                            // ) {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // if (values.stateId == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // if (values.registraion_type == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // if (values.phone_no == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }

                            // if (values.email_id == "") {
                            //   errorArray.push("Y");
                            // } else {
                            //   errorArray.push("");
                            // }
                            // validation end

                            // console.warn("errorArray->>>>>>>>>>>>>", errorArray);
                            // this.setState({ errorArrayBorder: errorArray }, () => {
                            //   if (allEqual(errorArray)) {
                            if (values.ledger_name != null) {
                              formData.append(
                                "ledger_name",
                                values.ledger_name ? values.ledger_name : ""
                              );
                            }
                            if (values.supplier_code != null) {
                              formData.append(
                                "supplier_code",
                                values.supplier_code
                              );
                            }
                            if (
                              values.underId.sub_principle_id &&
                              values.underId.sub_principle_id != ""
                            ) {
                              formData.append(
                                "principle_group_id",
                                values.underId.sub_principle_id
                              );
                            }
                            if (
                              values.underId.principle_id &&
                              values.underId.principle_id != ""
                            ) {
                              formData.append(
                                "principle_id",
                                values.underId.principle_id
                              );
                            }

                            if (
                              values.underId.ledger_form_parameter_id &&
                              values.underId.ledger_form_parameter_id != ""
                            ) {
                              formData.append(
                                "underId",
                                values.underId.ledger_form_parameter_id
                              );
                            }
                            if (values.mailing_name != null) {
                              formData.append(
                                "mailing_name",
                                values.mailing_name
                              );
                            }

                            formData.append(
                              "opening_bal_type",
                              values.opening_balance_type
                                ? values.opening_balance_type == "dr"
                                  ? "Dr"
                                  : "Cr"
                                : "Dr"
                            );
                            if (balanceList.length > 0) {
                              console.log(
                                "balance List ============>>>>>>>>>>>"
                                // JSON.stringify(balanceList)
                              );
                              formData.append(
                                "opening_bal_invoice_list",
                                JSON.stringify(balanceList)
                              );
                            }
                            let openingBal = 0;
                            if (values.opening_balance_type == "dr") {
                              // debugger;
                              if (values.opening_balance > 0) {
                                openingBal = values.opening_balance * -1;
                              }
                            } else {
                              openingBal = values.opening_balance;
                            }
                            formData.append("opening_bal", openingBal);

                            if (values.opening_balancing_method != null) {
                              formData.append(
                                "balancing_method",
                                values.opening_balancing_method.value
                              );
                            }

                            if (values.address != null) {
                              formData.append("address", values.address);
                            }

                            if (
                              values.stateId != "" &&
                              values.stateId != null
                            ) {
                              formData.append(
                                "state",
                                values.stateId
                                  ? values.stateId != ""
                                    ? values.stateId.value
                                    : 0
                                  : 0
                              );
                            }

                            if (
                              values.countryId != "" &&
                              values.countryId != null
                            ) {
                              formData.append(
                                "country",
                                values.countryId
                                  ? values.countryId != ""
                                    ? values.countryId.value
                                    : 0
                                  : 0
                              );
                            }

                            if (values.pincode != null) {
                              formData.append("pincode", values.pincode);
                            }

                            if (values.city != null) {
                              formData.append("city", values.city);
                            }
                            if (
                              values.email_id != "" &&
                              values.email_id != null
                            ) {
                              formData.append("email", values.email_id);
                            }

                            // formData.append(
                            //   "mobile_no",
                            //   values.phone_no ? values.phone_no : ""
                            // );
                            if (
                              values.phone_no != "" &&
                              values.phone_no != null
                            ) {
                              formData.append("mobile_no", values.phone_no);
                            }
                            formData.append(
                              "whatsapp_no",
                              values.whatsapp_no ? values.whatsapp_no : 0
                            );
                            if (values.date_of_registartion != null) {
                              formData.append(
                                "reg_date",
                                values.date_of_registartion
                                  ? moment(values.date_of_registartion).format(
                                    "YYYY-MM-DD"
                                  )
                                  : ""
                              );
                            }

                            if (values.tcs == "true") {
                              formData.append(
                                "tcs_applicable_date",
                                moment(values.tcs_applicable_date).format(
                                  "YYYY-MM-DD"
                                )
                              );
                            }
                            if (
                              values.tradeOfBusiness != null &&
                              values.tradeOfBusiness != "" &&
                              values.tradeOfBusiness != undefined
                            ) {
                              formData.append(
                                "businessType",
                                values.tradeOfBusiness
                              );
                            }
                            if (
                              values.natureOfBusiness != null &&
                              values.natureOfBusiness != "" &&
                              values.natureOfBusiness != undefined
                            ) {
                              formData.append(
                                "businessTrade",
                                values.natureOfBusiness
                              );
                            }

                            if (
                              values.isCredit != null &&
                              values.isCredit != ""
                            ) {
                              formData.append("isCredit", values.isCredit);
                            } else {
                              formData.append("isCredit", false);
                            }

                            if (
                              values.credit_days != null &&
                              values.credit_days != "" &&
                              values.credit_days != undefined
                            ) {
                              formData.append(
                                "credit_days",
                                values.credit_days
                              );
                              if (values.applicable_from != null) {
                                formData.append(
                                  "applicable_from",
                                  values.applicable_from.label
                                );
                              }
                            }

                            if (
                              values.credit_bills != null &&
                              values.credit_bills != "" &&
                              values.credit_bills != undefined
                            ) {
                              formData.append(
                                "creditNumBills",
                                values.credit_bills
                              );
                            }

                            if (
                              values.credit_values != null &&
                              values.credit_values != "" &&
                              values.credit_values != undefined
                            ) {
                              formData.append(
                                "creditBillValue",
                                values.credit_values
                              );
                            }

                            if (
                              values.licenseNo != null &&
                              values.licenseNo != ""
                            ) {
                              formData.append("licenseNo", values.licenseNo);
                            }
                            if (
                              values.license_expiry != null &&
                              values.license_expiry != ""
                            ) {
                              let fexp = moment(
                                values.license_expiry,
                                "DD/MM/YYYY"
                              ).toDate();
                              formData.append(
                                "licenseExpiryDate",
                                moment(new Date(fexp)).format("yyyy-MM-DD")
                              );
                            }

                            if (
                              values.isGST != null &&
                              values.isGST != "" &&
                              values.isGST != undefined
                            ) {
                              formData.append("isGST", values.isGST);
                            } else {
                              formData.append("isGST", false);
                            }

                            if (values.pan_no != null) {
                              formData.append("pan_no", values.pan_no);
                            }

                            let gstdetails = [];

                            // if (values.isTaxation == true) {
                            gstdetails = gstList.map((v, i) => {
                              let obj = {};
                              obj["gstin"] = v.gstin;
                              if (
                                v.registraion_type != null &&
                                v.registraion_type != ""
                              ) {
                                obj["registration_type"] =
                                  v.registraion_type.value;
                              }

                              if (
                                v.dateofregistartion != "" &&
                                v.dateofregistartion != null
                              ) {
                                let pandateofregistration = moment(
                                  v.dateofregistartion,
                                  "DD/MM/YYYY"
                                ).toDate();
                                obj["dateofregistartion"] = moment(
                                  new Date(pandateofregistration)
                                ).format("yyyy-MM-DD");
                              }

                              if (v.pan_no != "") obj["pancard"] = v.pan_no;

                              return obj;
                            });
                            // }

                            console.log({ gstdetails });

                            formData.append(
                              "gstdetails",
                              JSON.stringify(gstdetails)
                            );

                            if (values.isLicense != null) {
                              formData.append("isLicense", values.isLicense);
                            } else {
                              formData.append("isLicense", false);
                            }

                            // if(values.isLicense==true){
                            let licensesDetails = licensesList.map((v, i) => {
                              return {
                                licences_type: v.licences_type,
                                licenses_num: v.licenses_num,
                                licenses_exp: v.licenses_exp
                                  ? moment(v.licenses_exp).format("YYYY-MM-DD")
                                  : "",
                              };
                            });

                            formData.append(
                              "licensesDetails",
                              JSON.stringify(licensesDetails)
                            );
                            // }

                            if (values.isShippingDetails != null) {
                              formData.append(
                                "isShippingDetails",
                                values.isShippingDetails
                              );
                            } else {
                              formData.append("isShippingDetails", false);
                            }

                            let shippingDetails = shippingList.map((v, i) => {
                              return {
                                shipping_address: v.shipping_address,
                                district: v.district.value,
                              };
                            });

                            // if(values.isShippingDetails==true)
                            // {
                            formData.append(
                              "shippingDetails",
                              JSON.stringify(shippingDetails)
                            );
                            // }
                            if (values.isDepartment != null) {
                              formData.append(
                                "isDepartment",
                                values.isDepartment
                              );
                            } else {
                              formData.append("isDepartment", false);
                            }

                            // if(values.isDepartment==true)
                            // {
                            let deptDetails = [];
                            deptDetails = deptList.map((v, i) => {
                              let obj = {
                                dept: v.dept,
                                contact_person: v.contact_person,
                                contact_no: v.contact_no,
                              };

                              if (v.email != "") obj["email"] = v.email;

                              return obj;
                            });
                            formData.append(
                              "deptDetails",
                              JSON.stringify(deptDetails)
                            );

                            // }
                            if (values.isBankDetails != null) {
                              formData.append(
                                "isBankDetails",
                                values.isBankDetails
                              );
                            } else {
                              formData.append("isBankDetails", false);
                            }

                            formData.append(
                              "bankDetails",
                              JSON.stringify(bankList)
                            );

                            // if (values.bank_name != null) {
                            //   formData.append("bank_name", values.bank_name);
                            // }
                            // if (values.bank_account_no != null) {
                            //   formData.append("bank_account_no", values.bank_account_no);
                            // }
                            // if (values.bank_ifsc_code != null) {
                            //   formData.append("bank_ifsc_code", values.bank_ifsc_code);
                            // }
                            // if (values.bank_branch != null) {
                            //   formData.append("bank_branch", values.bank_branch);
                            // }
                            //   }
                            // });
                          }
                          if (
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "bank_account"
                          ) {
                            if (values.ledger_name != null) {
                              formData.append(
                                "ledger_name",
                                values.ledger_name ? values.ledger_name : ""
                              );
                            }
                            if (
                              values.underId.sub_principle_id &&
                              values.underId.sub_principle_id != ""
                            ) {
                              formData.append(
                                "principle_group_id",
                                values.underId.sub_principle_id
                              );
                            }
                            if (
                              values.underId.principle_id &&
                              values.underId.principle_id != ""
                            ) {
                              formData.append(
                                "principle_id",
                                values.underId.principle_id
                              );
                            }
                            if (
                              values.underId.ledger_form_parameter_id &&
                              values.underId.ledger_form_parameter_id != ""
                            ) {
                              formData.append(
                                "underId",
                                values.underId.ledger_form_parameter_id
                              );
                            }
                            formData.append(
                              "opening_bal_type",
                              values.opening_balance_type
                                ? values.opening_balance_type == "dr"
                                  ? "Dr"
                                  : "Cr"
                                : "Dr"
                            );
                            formData.append(
                              "opening_bal",
                              values.opening_balance
                                ? values.opening_balance
                                : 0
                            );
                            formData.append(
                              "balancing_method",
                              values.opening_balancing_method.value
                            );
                            // if (values.address != null) {
                            //   formData.append("address", values.address);
                            // }

                            // if (values.stateId != "" && values.stateId != null) {
                            //   formData.append(
                            //     "state",
                            //     values.stateId
                            //       ? values.stateId != ""
                            //         ? values.stateId.value
                            //         : 0
                            //       : 0
                            //   );
                            // }

                            // if (values.countryId != "" && values.countryId != null) {
                            //   formData.append(
                            //     "country",
                            //     values.countryId
                            //       ? values.countryId != ""
                            //         ? values.countryId.value
                            //         : 0
                            //       : 0
                            //   );
                            // }
                            // if (values.pincode != null) {
                            //   formData.append("pincode", values.pincode);
                            // }

                            // if (values.email_id != "" && values.email_id) {
                            //   formData.append("email", values.email_id);
                            // }
                            // if (values.phone_no != null)
                            //   formData.append("mobile_no", values.phone_no);

                            if (values.isTaxation != null) {
                              formData.append(
                                "taxable",
                                values.isTaxation.value
                              );
                            }

                            // if (values.isTaxation.value == true) {
                            formData.append(
                              "gstin",
                              values.gstin && values.gstin != ""
                                ? values.gstin
                                : ""
                            );
                            // formData.append(
                            //   "registration_type",
                            //   values.registraion_type.value
                            // );
                            // formData.append("pancard_no", values.pan_no);
                            // formData.append(
                            //   "dateofregistartion",
                            //   moment(values.dateofregistartion).format("YYYY-MM-DD")
                            // );
                            // }

                            if (values.bank_name != null) {
                              formData.append("bank_name", values.bank_name);
                            }
                            if (values.bank_account_no != null) {
                              formData.append(
                                "account_no",
                                values.bank_account_no
                              );
                            }
                            if (values.bank_ifsc_code != null) {
                              formData.append(
                                "ifsc_code",
                                values.bank_ifsc_code
                              );
                            }
                            if (values.bank_branch != null) {
                              formData.append(
                                "bank_branch",
                                values.bank_branch
                              );
                            }
                          }

                          if (
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "duties_taxes"
                          ) {
                            if (values.ledger_name != null) {
                              formData.append(
                                "ledger_name",
                                values.ledger_name
                              );
                            }

                            if (
                              values.underId.sub_principle_id &&
                              values.underId.sub_principle_id != ""
                            ) {
                              formData.append(
                                "principle_group_id",
                                values.underId.sub_principle_id
                              );
                            }
                            if (
                              values.underId.principle_id &&
                              values.underId.principle_id != ""
                            ) {
                              formData.append(
                                "principle_id",
                                values.underId.principle_id
                              );
                            }
                            formData.append(
                              "opening_bal_type",
                              values.opening_balance_type
                                ? values.opening_balance_type == "dr"
                                  ? "Dr"
                                  : "Cr"
                                : "Dr"
                            );
                            formData.append(
                              "opening_bal",
                              values.opening_balance
                                ? values.opening_balance
                                : 0
                            );
                            if (
                              values.underId.ledger_form_parameter_id &&
                              values.underId.ledger_form_parameter_id != ""
                            ) {
                              formData.append(
                                "underId",
                                values.underId.ledger_form_parameter_id
                              );
                            }
                            if (values.tax_type != null) {
                              formData.append(
                                "tax_type",
                                values.tax_type.value
                              );
                            }
                          }
                          if (
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "assets"
                          ) {
                            if (values.ledger_name != null) {
                              formData.append(
                                "ledger_name",
                                values.ledger_name
                              );
                            }

                            if (
                              values.underId.sub_principle_id &&
                              values.underId.sub_principle_id != ""
                            ) {
                              formData.append(
                                "principle_group_id",
                                values.underId.sub_principle_id
                              );
                            }
                            if (
                              values.underId.principle_id &&
                              values.underId.principle_id != ""
                            ) {
                              formData.append(
                                "principle_id",
                                values.underId.principle_id
                              );
                            }
                            if (
                              values.underId.ledger_form_parameter_id &&
                              values.underId.ledger_form_parameter_id != ""
                            ) {
                              formData.append(
                                "underId",
                                values.underId.ledger_form_parameter_id
                              );
                            }
                            formData.append(
                              "opening_bal_type",
                              values.opening_balance_type
                                ? values.opening_balance_type == "dr"
                                  ? "Dr"
                                  : "Cr"
                                : "Dr"
                            );
                            formData.append(
                              "opening_bal",
                              values.opening_balance
                                ? values.opening_balance
                                : 0
                            );
                          }

                          if (
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "others"
                          ) {
                            if (values.ledger_name != null) {
                              formData.append(
                                "ledger_name",
                                values.ledger_name
                              );
                            }
                            if (
                              values.underId.sub_principle_id &&
                              values.underId.sub_principle_id != ""
                            ) {
                              formData.append(
                                "principle_group_id",
                                values.underId.sub_principle_id
                              );
                            }
                            if (
                              values.underId.principle_id &&
                              values.underId.principle_id != ""
                            ) {
                              formData.append(
                                "principle_id",
                                values.underId.principle_id
                              );
                            }
                            formData.append(
                              "opening_bal_type",
                              values.opening_balance_type
                                ? values.opening_balance_type == "dr"
                                  ? "Dr"
                                  : "Cr"
                                : "Dr"
                            );
                            formData.append(
                              "opening_bal",
                              values.opening_balance
                                ? values.opening_balance
                                : 0
                            );
                            if (values.opening_balancing_method != null) {
                              formData.append(
                                "balancing_method",
                                values.opening_balancing_method.value
                              );
                            }

                            if (
                              values.underId.ledger_form_parameter_id &&
                              values.underId.ledger_form_parameter_id != ""
                            ) {
                              formData.append(
                                "underId",
                                values.underId.ledger_form_parameter_id
                              );
                            }
                            if (values.address != null) {
                              formData.append("address", values.address);
                            }
                            if (
                              values.stateId != "" &&
                              values.stateId != null
                            ) {
                              formData.append(
                                "state",
                                values.stateId
                                  ? values.stateId != ""
                                    ? values.stateId.value
                                    : 0
                                  : 0
                              );
                            }

                            if (
                              values.countryId != "" &&
                              values.countryId != null
                            ) {
                              formData.append(
                                "country",
                                values.countryId
                                  ? values.countryId != ""
                                    ? values.countryId.value
                                    : 0
                                  : 0
                              );
                            }
                            if (values.pincode != null) {
                              formData.append("pincode", values.pincode);
                            }
                            if (values.city != null) {
                              formData.append("city", values.city);
                            }
                            if (values.phone_no != null) {
                              formData.append("mobile_no", values.phone_no);
                            }
                          }
                          formData.append(
                            "slug",
                            values.underId.ledger_form_parameter_slug.toLowerCase()
                          );
                          formData.append(
                            "is_private",
                            values.is_private.value
                          );
                          // formData.append("bankDetails", JSON.stringify(bankList));

                          for (let [name, value] of formData) {
                            console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                          }
                          createLedger(formData)
                            .then((response) => {
                              let res = response.data;
                              if (res.responseStatus == 200) {
                                MyNotifications.fire(
                                  {
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1000,
                                  }

                                  //eventBus.dispatch("page_change", "ledgerlist")
                                );

                                // if (this.state.source != "") {
                                // @vinit @ condition for prop_data for focusing previous tab
                                if (
                                  this.state.source &&
                                  this.state.source != ""
                                ) {
                                  if (this.state.source.opType === "create") {
                                    eventBus.dispatch("page_change", {
                                      from: "ledgercreate",
                                      to: this.state.source.from_page,
                                      prop_data: {
                                        ...this.state.source,
                                        ledgerId: parseInt(res.data),
                                      },
                                      isNewTab: false,
                                    });
                                    this.setState({ source: "" });
                                  } else if (
                                    this.state.source.opType === "edit"
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "ledgercreate",
                                      to: this.state.source.from_page,
                                      prop_data: {
                                        prop_data: {
                                          ...this.state.source,
                                          ledgerId: parseInt(res.data),
                                        },
                                      },
                                      isNewTab: false,
                                    });
                                    this.setState({ source: "" });
                                  } else {
                                    eventBus.dispatch("page_change", {
                                      from: "ledgercreate",
                                      to: "ledgerlist",
                                      isNewTab: false,
                                      isCancel: true,
                                      prop_data: {
                                        ledgerId: parseInt(res.data),
                                      },
                                    });
                                  }
                                } else {
                                  eventBus.dispatch("page_change", {
                                    from: "ledgercreate",
                                    to: "ledgerlist",
                                    isNewTab: false,
                                    isCancel: true,
                                    prop_data: {
                                      ledgerId: parseInt(res.data),
                                    },
                                  });
                                }
                                resetForm();

                                this.setLedgerCode();
                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: response.message,
                                  is_button_show: true,
                                });
                              }
                            })
                            .catch((error) => { });
                        },
                        handleFailFn: () => { },
                      },

                      () => {
                        console.warn("return_data");
                      }
                    );
                  }
                } else {
                  // alert("Enter ledger_name ");
                  if (values.ledger_name == "") {
                    MyNotifications.fire({
                      show: true,
                      icon: "error",
                      title: "Error",
                      msg: "Please Enter Ledger Name. ",
                      is_timeout: true,
                      delay: 1000,
                    });
                    setTimeout(() => {
                      document.getElementById("ledger_name").focus();
                    }, 1000);
                  }
                  // else if (values.stateId == "") {
                  //   MyNotifications.fire({
                  //     show: true,
                  //     icon: "error",
                  //     title: "Error",
                  //     msg: "Please Select State. ",
                  //     is_timeout: true,
                  //     delay: 1500,
                  //   });
                  //   setTimeout(() => {
                  //     // document.getElementById("stateIdSel").focus();
                  //     this.selectRef.current?.focus();
                  //   }, 1000);
                  // }
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                submitForm,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  {/* {JSON.stringify(values.underId)} */}
                  <Row className="top_bar">
                    <Card className="top_card_style">
                      <Card.Body>
                        <Row>
                          <Col lg={2}>
                            <Row>
                              <Col lg={4} className="my-auto">
                                <Form.Label>Ledger Type </Form.Label>
                              </Col>
                              <Col lg={8} className="lFbP">
                                <Form.Group className="">
                                  <Select
                                    ref={this.selectRefLedTyp}
                                    autoFocus="true"
                                    className="selectTo"
                                    onChange={(v) => {
                                      setFieldValue("underId", v);
                                      if (v.sub_principle_id) {
                                        if (v.sub_principle_id == 5) {
                                          setFieldValue(
                                            "opening_balance_type",
                                            "cr"
                                          );
                                          setFieldValue("tds", "false");
                                          setFieldValue("tcs", "false");
                                          setFieldValue(
                                            "applicable_from",
                                            applicable_from_options[0]
                                          );
                                          this.setState({
                                            ledgerSelType: "creditors",
                                          });
                                          // this.lstBalancingMethods();
                                          // setFieldValue(
                                          //   "isTaxation",
                                          //   ledger_type_options[1]
                                          // );
                                          setFieldValue("pan_no", "");
                                        } else if (v.sub_principle_id == 1) {
                                          setFieldValue(
                                            "opening_balance_type",
                                            "dr"
                                          );
                                          setFieldValue("tds", "false");
                                          setFieldValue("tcs", "false");
                                          setFieldValue(
                                            "applicable_from",
                                            applicable_from_options[0]
                                          );
                                          // this.lstBalancingMethods();
                                          // setFieldValue(
                                          //   "isTaxation",
                                          //   ledger_type_options[1]
                                          // );
                                          setFieldValue("pan_no", "");
                                          this.setState({
                                            ledgerSelType: "debtors",
                                          });
                                        }
                                      }
                                    }}
                                    name="underId"
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      this.ValidateLedgermMaster(
                                        values.underId,
                                        values.underId.sub_principle_id,
                                        values.underId.principle_id,
                                        values.ledger_name,
                                        values.supplier_code
                                      );
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 18) {
                                        e.preventDefault();
                                      }

                                      if (e.shiftKey && e.key === "Tab") {
                                        if (values.underId == "") {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Please Select Ledger Type. ",
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          setTimeout(() => {
                                            this.selectRefLedTyp.current?.focus();
                                          }, 500);
                                        }
                                      } else if (e.key === "Tab") {
                                        if (values.underId == "") {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Please Select Ledger Type. ",
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          setTimeout(() => {
                                            this.selectRefLedTyp.current?.focus();
                                          }, 500);
                                        }
                                      }
                                    }}
                                    // styles={customStyles}
                                    styles={ledger_select}
                                    options={undervalue}
                                    value={values.underId}
                                    invalid={errors.underId ? true : false}
                                  />

                                  <span className="text-danger">
                                    {errors.underId}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          {values.underId &&
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_creditors" && (
                              <>
                                <Col lg={2}>
                                  <Row>
                                    <Col lg={2} className="my-auto">
                                      <Form.Label>Code</Form.Label>
                                    </Col>
                                    <Col lg={10}>
                                      <Form.Group>
                                        <Form.Control
                                          autoFocus="true"
                                          autoComplete="off"
                                          type="text"
                                          placeholder="Code"
                                          name="supplier_code"
                                          className="text-box"
                                          // className={`${
                                          //   errorArrayBorder[1] == "Y"
                                          //     ? "border border-danger text-box"
                                          //     : "text-box"
                                          // }`}
                                          onChange={handleChange}
                                          value={values.supplier_code}
                                          onBlur={(e) => {
                                            e.preventDefault();
                                            // if (
                                            //   values.ledger_name != "" &&
                                            //   values.ledger_name != undefined
                                            // ) {
                                            //   setFieldValue(
                                            //     "mailing_name",
                                            //     values.ledger_name
                                            //   );
                                            // }
                                            if (e.target.value) {
                                              // this.setErrorBorder(1, "");
                                              this.ValidateLedgermMaster(
                                                values.underId,
                                                values.underId.sub_principle_id,
                                                values.underId.principle_id,
                                                values.ledger_name,
                                                values.supplier_code
                                              );
                                            } else {
                                              // this.setErrorBorder(1, "Y");
                                            }
                                          }}
                                          isValid={
                                            touched.supplier_code &&
                                            !errors.supplier_code
                                          }
                                          isInvalid={!!errors.supplier_code}
                                        // onKeyDown={(e) => {
                                        //   if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.supplier_code}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </>
                            )}
                          {values.underId &&
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_debtors" && (
                              <>
                                <Col lg={2}>
                                  <Row>
                                    <Col lg={2} className="my-auto">
                                      <Form.Label>Code</Form.Label>
                                    </Col>
                                    <Col lg={10}>
                                      <Form.Group>
                                        <Form.Control
                                          autoFocus="true"
                                          autoComplete="off"
                                          type="text"
                                          placeholder="Code"
                                          name="supplier_code"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.supplier_code}
                                          // onBlur={(v) => {
                                          //   v.preventDefault();
                                          //   // if (
                                          //   //   values.ledger_name != "" &&
                                          //   //   values.ledger_name != undefined
                                          //   // ) {
                                          //   //   setFieldValue(
                                          //   //     "mailing_name",
                                          //   //     values.ledger_name
                                          //   //   );
                                          //   // }
                                          //   this.ValidateLedgermMaster(
                                          //     values.underId,
                                          //     values.underId.sub_principle_id,
                                          //     values.underId.principle_id,
                                          //     values.ledger_name,
                                          //     values.supplier_code
                                          //   );
                                          // }}

                                          // className={`${
                                          //   errorArrayBorder[1] == "Y"
                                          //     ? "border border-danger text-box"
                                          //     : "text-box"
                                          // }`}
                                          onBlur={(e) => {
                                            e.preventDefault();
                                            if (e.target.value) {
                                              // this.setErrorBorder(1, "");
                                              this.ValidateLedgermMaster(
                                                values.underId,
                                                values.underId.sub_principle_id,
                                                values.underId.principle_id,
                                                values.ledger_name,
                                                values.supplier_code
                                              );
                                            } else {
                                              // this.setErrorBorder(1, "Y");
                                            }
                                          }}
                                          // onKeyDown={(e) => {
                                          //   if (
                                          //     e.key === "Tab" &&
                                          //     !e.target.value
                                          //   )
                                          //     e.preventDefault();
                                          // }}
                                          isValid={
                                            touched.supplier_code &&
                                            !errors.supplier_code
                                          }
                                          isInvalid={!!errors.supplier_code}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.supplier_code}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </>
                            )}
                          <Col lg={3} className="">
                            <Row>
                              <Col lg={2} className="my-auto normalP">
                                <Form.Label>Name </Form.Label>
                                <span className="text-danger">*</span>
                              </Col>
                              <Col lg={10}>
                                <Form.Group>
                                  <Form.Control
                                    // autoFocus="true"
                                    type="text"
                                    placeholder="Name"
                                    name="ledger_name"
                                    id="ledger_name"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    onBlur={(v) => {
                                      v.preventDefault();

                                      if (
                                        values.ledger_name.trim() != "" &&
                                        values.ledger_name.trim() != undefined
                                      ) {
                                        // this.setErrorBorder(0, "");
                                        setFieldValue(
                                          "mailing_name",
                                          values.ledger_name
                                        );
                                      } else {
                                        document
                                          .getElementById("ledger_name")
                                          .focus();
                                      }
                                      // else {
                                      // this.setErrorBorder(0, "Y");
                                      // alert("Enter Name");
                                      // }
                                      // else {
                                      //   MyNotifications.fire({
                                      //     show: true,
                                      //     icon: "error",
                                      //     title: "Error",
                                      //     msg: "Please Enter Name ",
                                      //     is_button_show: false,
                                      //   });
                                      // }
                                      this.ValidateLedgermMaster(
                                        values.underId,
                                        values.underId.sub_principle_id,
                                        values.underId.principle_id,
                                        values.ledger_name,
                                        values.supplier_code
                                      );
                                    }}
                                    // onInput={(e) => {
                                    //   e.target.value = this.getDataCapitalised(
                                    //     e.target.value
                                    //   );
                                    // }}
                                    value={values.ledger_name}
                                    autofocus
                                    isValid={
                                      touched.ledger_name && !errors.ledger_name
                                    }
                                    isInvalid={!!errors.ledger_name}
                                    // className={`${
                                    //   errorArrayBorder[0] == "Y"
                                    //     ? "border border-danger text-box"
                                    //     : "text-box"
                                    // }`}
                                    className="text-box"
                                    onKeyDown={(e) => {
                                      if (e.key === "Tab" && !e.target.value)
                                        e.preventDefault();
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          {values.underId &&
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_creditors" && (
                              <>
                                <Col lg={2} className="noP lnoP">
                                  <Row>
                                    <Col lg={6} className="my-auto">
                                      <Form.Label>Balancing Method </Form.Label>
                                    </Col>
                                    <Col lg={6}>
                                      <Form.Group className="">
                                        <Select
                                          className="selectTo"
                                          onChange={(v) => {
                                            setFieldValue(
                                              "opening_balancing_method",
                                              v
                                            );
                                          }}
                                          name="opening_balancing_method"
                                          // styles={customStyles}
                                          styles={ledger_select}
                                          options={balancingOpt}
                                          value={
                                            values.opening_balancing_method
                                          }
                                          invalid={
                                            errors.opening_balancing_method
                                              ? true
                                              : false
                                          }
                                        //styles={customStyles}
                                        />
                                        <span className="text-danger">
                                          {errors.opening_balancing_method}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </>
                            )}
                          {values.underId &&
                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                            "sundry_debtors" && (
                              <>
                                <Col lg={2} className="noP">
                                  <Row>
                                    <Col lg={6} className="my-auto">
                                      <Form.Label>Balancing Method </Form.Label>
                                    </Col>
                                    <Col lg={6}>
                                      <Form.Group className="">
                                        <Select
                                          className="selectTo"
                                          onChange={(v) => {
                                            setFieldValue(
                                              "opening_balancing_method",
                                              v
                                            );
                                          }}
                                          name="opening_balancing_method"
                                          // styles={customStyles}
                                          styles={ledger_select}
                                          options={balancingOpt}
                                          value={
                                            values.opening_balancing_method
                                          }
                                          invalid={
                                            errors.opening_balancing_method
                                              ? true
                                              : false
                                          }
                                        //styles={customStyles}
                                        />
                                        <span className="text-danger">
                                          {errors.opening_balancing_method}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </>
                            )}
                          <Col lg={3}>
                            <Row>
                              <Col lg={3} className="my-auto normalP">
                                <Form.Label>Opening Bal. </Form.Label>
                              </Col>
                              <Col lg={6}>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    placeholder="0"
                                    name="opening_balance"
                                    className="text-box text-end"
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                      OnlyEnterAmount(e);
                                    }}
                                    value={values.opening_balance}
                                    isValid={
                                      touched.opening_balance &&
                                      !errors.opening_balance
                                    }
                                    isInvalid={!!errors.opening_balance}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.opening_balance_type}
                                  </Form.Control.Feedback>
                                  <span className="text-danger errormsg">
                                    {errors.opening_balance &&
                                      errors.opening_balance}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col lg={3} className="ps-0">
                                <Form.Group className="">
                                  <Form.Select
                                    ref={this.selectRefBalanceType}
                                    as="select"
                                    className="selectTo"
                                    styles={ledger_select}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "opening_balance_type",
                                        e.target.value
                                      );
                                      console.log(
                                        "opening_balance_type====",
                                        e.target.value
                                      );

                                      // this.setState({
                                      //   opeBalType: e.target.value,
                                      // });
                                    }}
                                    onBlur={(e) => {
                                      let balMethod = 0;
                                      if (
                                        values.opening_balancing_method != null
                                      ) {
                                        balMethod =
                                          values.opening_balancing_method;
                                        console.log(
                                          "balancing method =====:::::::::",
                                          values.opening_balance
                                        );
                                        if (
                                          (values.opening_balance > 0 &&
                                            balMethod.label == "Bill by Bill" &&
                                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                            "sundry_debtors") ||
                                          // values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                          // "sundry_creditors"
                                          // @prathmesh @bill by bill condition for creditors
                                          (values.opening_balance > 0 &&
                                            balMethod.label == "Bill by Bill" &&
                                            values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                            "sundry_creditors")
                                        ) {
                                          this.setState({
                                            opnBalModalShow: true,
                                            openingBal: values.opening_balance,
                                            opeBalType: e.target.value,
                                          });
                                        }
                                      }
                                    }}
                                    name="opening_balance_type"
                                    // className="select-text-box"
                                    value={values.opening_balance_type}
                                  >
                                    <option value="dr">Dr</option>
                                    <option value="cr">Cr</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Row>
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "sundry_creditors" && (
                      <>
                        <div className="middle_card_main">
                          <Card className="middle_card">
                            <Card.Body>
                              <Row>
                                <Col lg={4}>
                                  <Row>
                                    <Col lg={3} className="my-auto">
                                      <Form.Label>Registered Name</Form.Label>
                                    </Col>
                                    <Col lg={9}>
                                      <Form.Group>
                                        <Form.Control
                                          // autoFocus="true"
                                          type="text"
                                          placeholder="Registered Name"
                                          name="mailing_name"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.mailing_name}
                                          isValid={
                                            touched.mailing_name &&
                                            !errors.mailing_name
                                          }
                                          isInvalid={!!errors.mailing_name}
                                        />
                                        {/* <span className="text-danger errormsg">
                                          {errors.mailing_name}
                                        </span> */}
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={6}>
                                  <Row>
                                    <Col lg={1} className="my-auto">
                                      <Form.Label>Address</Form.Label>
                                    </Col>
                                    <Col lg={11}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Address"
                                          name="address"
                                          autoComplete="true"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.address}
                                          isValid={
                                            touched.address && !errors.address
                                          }
                                          isInvalid={!!errors.address}
                                          onInput={(e) => {
                                            e.target.value = this.getDataCapitalised(
                                              e.target.value
                                            );
                                          }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.address}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={2} className="">
                                  <Row>
                                    <Col lg={3} className="my-auto fLp">
                                      <Form.Label>State</Form.Label>
                                      <span className="text-danger">*</span>
                                    </Col>
                                    <Col lg={9}>
                                      <Form.Group
                                        className={`${errorArrayBorder[1] == "Y"
                                          ? "border border-danger "
                                          : ""
                                          }`}
                                        id="stateIdSel"
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          if (values.stateId) {
                                            this.setErrorBorder(1, "");
                                          } else {
                                            this.setErrorBorder(1, "Y");
                                            // document
                                            //   .getElementById("stateId")
                                            //   .focus();
                                            this.selectRef.current?.focus();
                                          }
                                        }}
                                      >
                                        <Select
                                          className="selectTo"
                                          // className={`${
                                          //   errorArrayBorder[1] == "Y"
                                          //     ? "border border-danger selectTo"
                                          //     : "selectTo"
                                          // }`}
                                          onChange={(v) => {
                                            setFieldValue("stateId", v);
                                          }}
                                          name="stateId"
                                          id="stateId"
                                          styles={ledger_select}
                                          options={stateOpt}
                                          value={values.stateId}
                                          invalid={
                                            errors.stateId ? true : false
                                          }
                                          ref={this.selectRef}

                                        // onKeyDown={(e) => {
                                        //   if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        />
                                        {/* <span className="text-danger">
                                          {errors.stateId}
                                        </span> */}
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col lg={1}>
                                  <Row>
                                    <Col lg={4} className="my-auto">
                                      <Form.Label>Pin</Form.Label>
                                    </Col>
                                    <Col lg={8} className="fRp">
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Pin"
                                          autoComplete="true"
                                          name="pincode"
                                          id="pincode"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.pincode}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          onBlur={(e) => {
                                            e.preventDefault();
                                            let pincode_val = e.target.value.trim();
                                            if (pincode_val !== "") {
                                              this.validatePincode(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            }
                                          }}
                                          maxLength={6}
                                          isValid={
                                            touched.pincode && !errors.pincode
                                          }
                                          isInvalid={!!errors.pincode}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.pincode}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} className="my-auto">
                                  <Row>
                                    <Col lg={1}>
                                      <img
                                        src={phone}
                                        alt=""
                                        className="ledger_small_icons"
                                      />
                                    </Col>
                                    <Col lg={5}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Enter"
                                          name="phone_no"
                                          id="phone_no"
                                          autoComplete="true"
                                          className="text-box"
                                          // className={`${
                                          //   values.phone_no == "" &&
                                          //   errorArrayBorder[3] == "Y"
                                          //     ? "border border-danger text-box"
                                          //     : "text-box"
                                          // }`}
                                          // onChange={handleChange}
                                          onChange={(e) => {
                                            let mob = e.target.value;
                                            setFieldValue("phone_no", mob);
                                            setFieldValue("whatsapp_no", mob);
                                          }}
                                          value={values.phone_no}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          isValid={
                                            touched.phone_no && !errors.phone_no
                                          }
                                          isInvalid={!!errors.phone_no}
                                          maxLength={10}
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 18) {
                                              e.preventDefault();
                                            }

                                            if (e.shiftKey && e.key === "Tab") {
                                              let mob = e.target.value.trim();
                                              console.log(
                                                "length--",
                                                mob.length
                                              );
                                              if (
                                                mob != "" &&
                                                mob.length < 10
                                              ) {
                                                console.log(
                                                  "length--",
                                                  "plz enter 10 digit no."
                                                );
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter 10 Digit Number. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById("phone_no")
                                                    .focus();
                                                }, 1000);
                                              }
                                            } else if (e.key === "Tab") {
                                              let mob = e.target.value.trim();
                                              console.log(
                                                "length--",
                                                mob.length
                                              );
                                              if (
                                                mob != "" &&
                                                mob.length < 10
                                              ) {
                                                console.log(
                                                  "length--",
                                                  "plz enter 10 digit no."
                                                );
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter 10 Digit Number. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById("phone_no")
                                                    .focus();
                                                }, 1000);
                                              }
                                            }
                                          }}
                                          onBlur={(e) => {
                                            e.preventDefault();
                                            // if (e.target.value) {
                                            // this.setErrorBorder(2, "");
                                            // } else {
                                            // this.setErrorBorder(2, "Y");
                                            // document
                                            //   .getElementById("phone_no")
                                            //   .focus();
                                            // }
                                          }}
                                        // onKeyDown={(e) => {
                                        //   if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.phone_no}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    <Col lg={1}>
                                      <img
                                        src={whatsapp}
                                        alt=""
                                        className="ledger_small_icons"
                                      />
                                    </Col>
                                    <Col lg={5}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Enter"
                                          name="whatsapp_no"
                                          id="whatsapp_no"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.whatsapp_no}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 18) {
                                              e.preventDefault();
                                            }
                                            if (e.shiftKey && e.key === "Tab") {
                                              let mob = e.target.value.trim();
                                              console.log(
                                                "length--",
                                                mob.length
                                              );
                                              if (
                                                mob != "" &&
                                                mob.length < 10
                                              ) {
                                                console.log(
                                                  "length--",
                                                  "plz enter 10 digit no."
                                                );
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter 10 Digit Number. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById(
                                                      "whatsapp_no"
                                                    )
                                                    .focus();
                                                }, 1000);
                                              }
                                            } else if (e.key === "Tab") {
                                              let mob = e.target.value.trim();
                                              console.log(
                                                "length--",
                                                mob.length
                                              );
                                              if (
                                                mob != "" &&
                                                mob.length < 10
                                              ) {
                                                console.log(
                                                  "length--",
                                                  "plz enter 10 digit no."
                                                );
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter 10 Digit Number. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById(
                                                      "whatsapp_no"
                                                    )
                                                    .focus();
                                                }, 1000);
                                              }
                                            }
                                          }}
                                          onBlur={(e) => { }}
                                          isValid={
                                            touched.whatsapp_no &&
                                            !errors.whatsapp_no
                                          }
                                          isInvalid={!!errors.whatsapp_no}
                                          maxLength={10}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.whatsapp_no}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3}>
                                  <Row>
                                    <Col lg={2} className="my-auto">
                                      <Form.Label>E-mail</Form.Label>
                                    </Col>
                                    <Col lg={10}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          autoComplete="true"
                                          placeholder="E-mail"
                                          name="email_id"
                                          id="email_id"
                                          className="text-box"
                                          // className={`${
                                          //   errorArrayBorder[4] == "Y"
                                          //     ? "border border-danger text-box"
                                          //     : "text-box"
                                          // }`}
                                          onChange={handleChange}
                                          value={values.email_id}
                                          isValid={
                                            touched.email_id && !errors.email_id
                                          }
                                          isInvalid={!!errors.email_id}
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
                                                  msg:
                                                    "Please Enter Valid Email Id. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById("email_id")
                                                    .focus();
                                                }, 1000);
                                              }
                                            } else if (e.key === "Tab") {
                                              let email_val = e.target.value.trim();
                                              if (
                                                email_val != "" &&
                                                !EMAILREGEXP.test(email_val)
                                              ) {
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter Valid Email Id. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById("email_id")
                                                    .focus();
                                                }, 1000);
                                              }
                                            }
                                          }}
                                          onBlur={(e) => {
                                            e.preventDefault();
                                          }}
                                        // onKeyDown={(e) => {
                                        //   if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.email_id}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={2}>
                                  <Row>
                                    <Col lg={4} className="my-auto ">
                                      <Form.Label>Reg. No.</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Registration No."
                                          name="licenseNo"
                                          className="text-box"
                                          id="licenseNo"
                                          onChange={handleChange}
                                          value={values.licenseNo}
                                        />
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={2} className="">
                                  <Row>
                                    <Col lg={3} className="my-auto normalP fLp">
                                      <Form.Label>Reg. Date</Form.Label>
                                    </Col>
                                    <Col lg={9}>
                                      <MyTextDatePicker
                                        id="date_of_registartion"
                                        name="date_of_registartion"
                                        placeholder="DD/MM/YYYY"
                                        className="form-control"
                                        value={values.date_of_registartion}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          }

                                          if (e.shiftKey && e.key === "Tab") {
                                            let datchco = e.target.value.trim();
                                            console.log("datchco", datchco);
                                            let checkdate = moment(
                                              e.target.value
                                            ).format("DD/MM/YYYY");
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
                                                msg:
                                                  "Please Enter Correct Date. ",
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              setTimeout(() => {
                                                document
                                                  .getElementById(
                                                    "date_of_registartion"
                                                  )
                                                  .focus();
                                              }, 1000);
                                            }
                                          } else if (e.key === "Tab") {
                                            let datchco = e.target.value.trim();
                                            console.log("datchco", datchco);
                                            let checkdate = moment(
                                              e.target.value
                                            ).format("DD/MM/YYYY");
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
                                                msg:
                                                  "Please Enter Correct Date. ",
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              setTimeout(() => {
                                                document
                                                  .getElementById(
                                                    "date_of_registartion"
                                                  )
                                                  .focus();
                                              }, 1000);
                                            }
                                          }
                                        }}
                                        onBlur={(e) => {
                                          console.log("e ", e);
                                          console.log(
                                            "e.target.value ",
                                            e.target.value
                                          );
                                          if (
                                            e.target.value != null &&
                                            e.target.value != ""
                                          ) {
                                            setFieldValue(
                                              "date_of_registartion",
                                              e.target.value
                                            );
                                            this.checkExpiryDate(
                                              setFieldValue,
                                              e.target.value,
                                              "date_of_registartion"
                                            );
                                          } else {
                                            // setFieldValue(
                                            //   "date_of_registartion",
                                            //   ""
                                            // );
                                          }
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col
                                  lg={6}
                                  style={{ borderRight: "1px solid" }}
                                >
                                  <Row>
                                    <Col lg={2} className="d-flex">
                                      <Form.Label>Credit</Form.Label>
                                      <Form.Check
                                        type="switch"
                                        className="ms-1 my-auto"
                                        onClick={this.handleSwitchClick}
                                        onChange={(e) => {
                                          console.log(
                                            "Is Checked:--->",
                                            e.target.checked
                                          );
                                          // this.gstFieldshow(e.target.checked);
                                          setFieldValue(
                                            "isCredit",
                                            e.target.checked
                                          );
                                        }}
                                        name="isCredit"
                                        id="isCredit"
                                        value={
                                          values.isCredit == true ? true : false
                                        }
                                      />
                                    </Col>
                                    {values.isCredit == true ? (
                                      <>
                                        <Col lg={2} className="fLp">
                                          <Row>
                                            <Col lg={4}>
                                              <Form.Label>Days</Form.Label>
                                            </Col>
                                            <Col lg={8}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Days"
                                                  name="credit_days"
                                                  id="credit_days"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.credit_days}
                                                  maxLength={3}
                                                  onKeyPress={(e) => {
                                                    OnlyEnterNumbers(e);
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.credit_days}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>

                                        {/* <Col lg={2}> */}
                                        {parseInt(values.credit_days) > 0 ? (
                                          <Col lg={4} className="noP">
                                            <Row>
                                              <Col md={5}>
                                                <Form.Label className="mb-2">
                                                  Applicable From
                                                </Form.Label>{" "}
                                              </Col>
                                              <Col md={7}>
                                                <Form.Group className="mb-2">
                                                  <Select
                                                    // disabled={isInputDisabled}
                                                    isClearable={true}
                                                    styles={ledger_select}
                                                    className="selectTo"
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        "applicable_from",
                                                        e
                                                      );
                                                    }}
                                                    options={
                                                      applicable_from_options
                                                    }
                                                    name="applicable_from"
                                                    id="applicable_from"
                                                    value={
                                                      values.applicable_from
                                                    }
                                                    invalid={
                                                      errors.applicable_from
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                  <span className="text-danger">
                                                    {errors.applicable_from}
                                                  </span>
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                        ) : (
                                          <></>
                                        )}
                                        {/* </Col> */}
                                        <Col lg={2} className="normalP">
                                          <Row>
                                            <Col lg={4}>
                                              <Form.Label>Bills</Form.Label>
                                            </Col>
                                            <Col lg={8}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Bills"
                                                  name="credit_bills"
                                                  id="credit_bills"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.credit_bills}
                                                  maxLength={3}
                                                  onKeyPress={(e) => {
                                                    OnlyEnterNumbers(e);
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.credit_bills}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={2}>
                                          <Row>
                                            <Col lg={4} className="fLp">
                                              <Form.Label>Values</Form.Label>
                                            </Col>
                                            <Col lg={8} className="normalrP">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Values"
                                                  name="credit_values"
                                                  id="credit_values"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.credit_values}
                                                  onKeyPress={(e) => {
                                                    OnlyEnterNumbers(e);
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.credit_values}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </Col>
                                <Col lg={6}>
                                  <Row>
                                    <Col lg={6}>
                                      <Row>
                                        <Col lg={2} className="d-flex">
                                          <Form.Label>Trade</Form.Label>
                                        </Col>
                                        <Col lg={10}>
                                          <Form.Group className="d-flex">
                                            <Form.Check
                                              type="radio"
                                              label="Retailer"
                                              className="cpt"
                                              id="Retailer"
                                              name="tradeOfBusiness"
                                              value="retailer"
                                              checked={
                                                values.tradeOfBusiness ==
                                                  "retailer"
                                                  ? true
                                                  : false
                                              }
                                              onChange={handleChange}
                                            />
                                            <Form.Check
                                              className="ms-2 cpt"
                                              type="radio"
                                              label="Manufaturer"
                                              id="Manufaturer"
                                              name="tradeOfBusiness"
                                              value="manufacturer"
                                              checked={
                                                values.tradeOfBusiness ==
                                                  "manufacturer"
                                                  ? true
                                                  : false
                                              }
                                              onChange={handleChange}
                                            />
                                            <Form.Check
                                              className="ms-2 cpt"
                                              type="radio"
                                              label="Distributor"
                                              id="distributor"
                                              name="tradeOfBusiness"
                                              value="distributor"
                                              checked={
                                                values.tradeOfBusiness ==
                                                  "distributor"
                                                  ? true
                                                  : false
                                              }
                                              onChange={handleChange}
                                            />
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col lg={6}>
                                      <Row>
                                        <Col lg={4}>
                                          <Form.Label>
                                            Business Nature
                                          </Form.Label>
                                        </Col>
                                        <Col lg={8}>
                                          <Form.Group>
                                            <Form.Control
                                              type="text"
                                              placeholder="Business Nature"
                                              name="natureOfBusiness"
                                              className="text-box"
                                              id="natureOfBusiness"
                                              onChange={handleChange}
                                              value={values.natureOfBusiness}
                                              onInput={(e) => {
                                                e.target.value = this.getDataCapitalised(
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                          <Row className="middleGapTop">
                            <Col lg={6} className="column_heightC">
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">GST</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    // label={values.isGST == true ? "Yes" : "No"}
                                    checked={
                                      values.isGST === true ? true : false
                                    }
                                    // disabled={gstList.length > 0 ? true : false}
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "gstList:--->",
                                        gstList.length
                                      );
                                      // this.gstFieldshow(e.target.checked);

                                      if (gstList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "Please Remove GST List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          gstList:
                                            e.target.checked === false
                                              ? []
                                              : gstList,
                                        });
                                        setFieldValue(
                                          "isGST",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isGST"
                                    id="isGST"
                                    value={values.isGST == true ? true : false}
                                  />
                                  {/* {JSON.stringify(values.isGST)} */}
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      <Col lg={6} className="normalrP">
                                        {values.isGST == true ? (
                                          <>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Type</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group
                                                  // className={`${
                                                  //   errorArrayBorder[2] == "Y"
                                                  //     ? "border border-danger "
                                                  //     : ""
                                                  // }`}
                                                  onBlur={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                      values.registraion_type
                                                    ) {
                                                      // this.setErrorBorder(
                                                      //   4,
                                                      //   ""
                                                      // );
                                                    } else {
                                                      // this.setErrorBorder(
                                                      //   4,
                                                      //   "Y"
                                                      // );
                                                      // document
                                                      //   .getElementById("registraion_type")
                                                      //   .focus();
                                                      this.selectRefGST.current?.focus();
                                                    }
                                                  }}
                                                >
                                                  <Select
                                                    className="selectTo"
                                                    styles={ledger_select}
                                                    // disabled={isInputDisabled}
                                                    onChange={(v) => {
                                                      // alert(
                                                      //   v.label === "Registered"
                                                      // );
                                                      setFieldValue(
                                                        "registraion_type",
                                                        v
                                                      );
                                                    }}
                                                    name="registraion_type"
                                                    options={GSTTypeOpt}
                                                    // selected={GSTTypeOpt[0]}
                                                    value={
                                                      values.registraion_type
                                                    }
                                                    invalid={
                                                      errors.registraion_type
                                                        ? true
                                                        : false
                                                    }
                                                    ref={this.selectRefGST}
                                                    maxDate={new Date()}
                                                  />
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>
                                                  Reg. Date
                                                </Form.Label>
                                              </Col>
                                              <Col
                                                lg={4}
                                                className="fRp normalP"
                                              >
                                                <MyTextDatePicker
                                                  id="dateofregistartion"
                                                  name="dateofregistartion"
                                                  placeholder="DD/MM/YYYY"
                                                  className="form-control"
                                                  // disabled={isInputDisabled}
                                                  value={
                                                    values.dateofregistartion
                                                  }
                                                  onChange={handleChange}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 18) {
                                                      e.preventDefault();
                                                    }

                                                    if (
                                                      e.shiftKey &&
                                                      e.key === "Tab"
                                                    ) {
                                                      let datchco = e.target.value.trim();
                                                      console.log(
                                                        "datchco",
                                                        datchco
                                                      );
                                                      let checkdate = moment(
                                                        e.target.value
                                                      ).format("DD/MM/YYYY");
                                                      console.log(
                                                        "checkdate",
                                                        checkdate
                                                      );
                                                      if (
                                                        datchco !=
                                                        "__/__/____" &&
                                                        // checkdate ==
                                                        //   "Invalid date"
                                                        datchco.includes("_")
                                                      ) {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Correct Date. ",
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "dateofregistartion"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    } else if (
                                                      e.key === "Tab"
                                                    ) {
                                                      let datchco = e.target.value.trim();
                                                      console.log(
                                                        "datchco",
                                                        datchco
                                                      );
                                                      let checkdate = moment(
                                                        e.target.value
                                                      ).format("DD/MM/YYYY");
                                                      console.log(
                                                        "checkdate",
                                                        checkdate
                                                      );
                                                      if (
                                                        datchco !=
                                                        "__/__/____" &&
                                                        // checkdate ==
                                                        //   "Invalid date"
                                                        datchco.includes("_")
                                                      ) {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Correct Date. ",
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "dateofregistartion"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    console.log("e ", e);
                                                    console.log(
                                                      "e.target.value ",
                                                      e.target.value
                                                    );
                                                    if (
                                                      e.target.value != null &&
                                                      e.target.value != ""
                                                    ) {
                                                      setFieldValue(
                                                        "dateofregistartion",
                                                        e.target.value
                                                      );
                                                      this.checkExpiryDate(
                                                        setFieldValue,
                                                        e.target.value,
                                                        "dateofregistartion"
                                                      );
                                                    } else {
                                                      // setFieldValue(
                                                      //   "dateofregistartion",
                                                      //   ""
                                                      // );
                                                    }
                                                  }}
                                                />
                                                <span className="text-danger errormsg">
                                                  {errors.dateofregistartion}
                                                </span>
                                              </Col>
                                            </Row>
                                          </>
                                        ) : (
                                          <Row>
                                            <Col lg={1} className="my-auto">
                                              <Form.Label>PAN</Form.Label>
                                            </Col>
                                            <Col lg={5}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // readOnly
                                                  // disabled={isInputDisabled}
                                                  placeholder="PAN Number"
                                                  name="pan_no"
                                                  id="pan_no"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={
                                                    values.pan_no &&
                                                    values.pan_no.toUpperCase()
                                                  }
                                                  isValid={
                                                    touched.pan_no &&
                                                    !errors.pan_no
                                                  }
                                                  isInvalid={!!errors.pan_no}
                                                  maxLength={10}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.pan_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        )}
                                      </Col>

                                      {values.isGST == true && (
                                        <>
                                          <Col lg={6}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>GSTIN</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fRp BnoP">
                                                <Form.Group>
                                                  <Form.Control
                                                    ref={this.gstRef}
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder="GSTIN"
                                                    name="gstin"
                                                    maxLength={15}
                                                    className="text-box"
                                                    id="gstin"
                                                    onChange={handleChange}
                                                    value={
                                                      values.gstin &&
                                                      values.gstin.toUpperCase()
                                                    }
                                                    isValid={
                                                      touched.gstin &&
                                                      !errors.gstin
                                                    }
                                                    isInvalid={!!errors.gstin}
                                                    onBlur={(e) => {
                                                      e.preventDefault();

                                                      if (
                                                        values.gstin != "" &&
                                                        values.gstin !=
                                                        undefined
                                                      ) {
                                                        this.extract_pan_from_GSTIN(
                                                          values.gstin,
                                                          setFieldValue
                                                        );
                                                        if (
                                                          GSTINREX.test(
                                                            values.gstin
                                                          )
                                                        ) {
                                                          return values.gstin;
                                                        } else {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "GSTIN is not Valid!",
                                                            is_button_show: false,
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            this.gstRef.current?.focus();
                                                          }, 1000);
                                                        }
                                                      } else {
                                                        this.gstRef.current?.focus();
                                                        setFieldValue(
                                                          "pan_no",
                                                          ""
                                                        );
                                                      }
                                                    }}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.gstin}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={1}
                                                className="my-auto normalP"
                                              >
                                                <Form.Label>PAN</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fRp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // readOnly
                                                    // disabled={isInputDisabled}
                                                    placeholder="PAN Number"
                                                    name="pan_no"
                                                    id="pan_no"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={
                                                      values.pan_no &&
                                                      values.pan_no.toUpperCase()
                                                    }
                                                    isValid={
                                                      touched.pan_no &&
                                                      !errors.pan_no
                                                    }
                                                    isInvalid={!!errors.pan_no}
                                                    maxLength={10}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.pan_no}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col lg={1} className="normalP">
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                      values.gstin != "" &&
                                                      values.gstin != null
                                                    ) {
                                                      let gstObj = {
                                                        gstin:
                                                          values.gstin != null
                                                            ? values.gstin
                                                            : "",
                                                        dateofregistartion:
                                                          values.dateofregistartion !=
                                                            null
                                                            ? values.dateofregistartion
                                                            : "",
                                                        pan_no:
                                                          values.pan_no != null
                                                            ? values.pan_no
                                                            : "",
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : gstList.length,
                                                        registraion_type:
                                                          values.registraion_type !=
                                                            null
                                                            ? values.registraion_type
                                                            : "",
                                                      };
                                                      this.addGSTRow(
                                                        gstObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Enter GST Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      if (
                                                        values.gstin != "" &&
                                                        values.gstin != null
                                                      ) {
                                                        let gstObj = {
                                                          gstin:
                                                            values.gstin != null
                                                              ? values.gstin
                                                              : "",
                                                          dateofregistartion:
                                                            values.dateofregistartion !=
                                                              null
                                                              ? values.dateofregistartion
                                                              : "",
                                                          pan_no:
                                                            values.pan_no !=
                                                              null
                                                              ? values.pan_no
                                                              : "",
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : gstList.length,
                                                          registraion_type:
                                                            values.registraion_type !=
                                                              null
                                                              ? values.registraion_type
                                                              : "",
                                                        };
                                                        this.addGSTRow(
                                                          gstObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter GST Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    ref={this.gstBtnRef}
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                            <Row className="mb-2">
                                              <Col md="4" className="">
                                                <Form.Control
                                                  type="text"
                                                  placeholder="index"
                                                  name="index"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  hidden
                                                  value={values.index}
                                                />
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      )}
                                    </Row>
                                  </div>
                                  {/* {JSON.stringify(gstList)} */}
                                  {gstList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        {/* <thead>
                                        <tr>
                                          <th>Sr.</th>                                          
                                          <th>Registration Date</th>
                                          <th>GST No.</th>
                                          <th>PAN No.</th>
                                          <th className="text-center">
                                            -
                                          </th>
                                        </tr>
                                      </thead> */}
                                        {/* {JSON.stringify(gstList)} */}
                                        <tbody>
                                          {gstList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "sneha",
                                                    i,
                                                    "v",
                                                    v
                                                  );
                                                  let gstObj = {
                                                    id: v.id,
                                                    registraion_type:
                                                      v.registraion_type,
                                                    gstin: v.gstin,
                                                    dateofregistartion:
                                                      v.dateofregistartion,

                                                    pan_no: v.pan_no,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchGstData(
                                                    gstObj,
                                                    setFieldValue
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "24%" }}>
                                                  {v.registraion_type.label}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                  {v.dateofregistartion}
                                                </td>
                                                <td>{v.gstin.toUpperCase()}</td>
                                                <td>{v.pan_no}</td>
                                                <td className="text-center">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeGstRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">License</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    checked={
                                      values.isLicense === true ? true : false
                                    }
                                    onChange={(e) => {
                                      let val = e.target.checked;
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "licensesList:--->",
                                        licensesList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // if (licensesList.length > 0) {
                                      //   MyNotifications.fire(
                                      //     {
                                      //       show: true,
                                      //       icon: "confirm",
                                      //       title: "Confirm",
                                      //       msg: "Do you want to disable",
                                      //       is_button_show: false,
                                      //       is_timeout: false,
                                      //       delay: 0,
                                      //       handleSuccessFn: () => {
                                      //         this.setState({
                                      //           licensesList:
                                      //             val === false
                                      //               ? []
                                      //               : licensesList,
                                      //         });
                                      //       },
                                      //       handleFailFn: () => {},
                                      //     },
                                      //     () => {
                                      //       console.warn("return_data");
                                      //     }
                                      //   );
                                      // }
                                      // setFieldValue(
                                      //   "isLicense",
                                      //   e.target.checked
                                      // );
                                      if (licensesList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "Please Remove License List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          licensesList:
                                            e.target.checked === false
                                              ? []
                                              : licensesList,
                                        });
                                        setFieldValue(
                                          "isLicense",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isLicense"
                                    id="isLicense"
                                    value={values.isLicense}
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isLicense == true ? (
                                        <>
                                          <Col lg={8}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Type</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group className="">
                                                  <Select
                                                    className="selectTo"
                                                    styles={ledger_select}
                                                    // disabled={isInputDisabled}
                                                    options={licencesType}
                                                    onChange={(v) => {
                                                      setFieldValue(
                                                        "licences_type",
                                                        v
                                                      );
                                                    }}
                                                    name="licences_type"
                                                    value={values.licences_type}
                                                    invalid={
                                                      errors.licences_type
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>Number</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder=" Number"
                                                    name="licenses_num"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.licenses_num}
                                                    isValid={
                                                      touched.licenses_num &&
                                                      !errors.licenses_num
                                                    }
                                                    isInvalid={
                                                      !!errors.licenses_num
                                                    }
                                                  />
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={4} className="fLp">
                                            <Row>
                                              <Col lg={4} className="my-auto">
                                                <Form.Label>
                                                  Expiry Date
                                                </Form.Label>
                                              </Col>
                                              <Col lg={6} className="fRp">
                                                <MyTextDatePicker
                                                  id="licenses_exp"
                                                  name="licenses_exp"
                                                  placeholder="DD/MM/YYYY"
                                                  className="form-control"
                                                  // disabled={isInputDisabled}
                                                  value={values.licenses_exp}
                                                  onChange={handleChange}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 18) {
                                                      e.preventDefault();
                                                    }

                                                    if (
                                                      e.shiftKey &&
                                                      e.key === "Tab"
                                                    ) {
                                                      let datchco = e.target.value.trim();
                                                      console.log(
                                                        "datchco",
                                                        datchco
                                                      );
                                                      let checkdate = moment(
                                                        e.target.value
                                                      ).format("DD/MM/YYYY");
                                                      console.log(
                                                        "checkdate",
                                                        checkdate
                                                      );
                                                      if (
                                                        datchco !=
                                                        "__/__/____" &&
                                                        // checkdate ==
                                                        //   "Invalid date"
                                                        datchco.includes("_")
                                                      ) {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Correct Date. ",
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "licenses_exp"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    } else if (
                                                      e.key === "Tab"
                                                    ) {
                                                      let datchco = e.target.value.trim();
                                                      console.log(
                                                        "datchco",
                                                        datchco
                                                      );
                                                      let checkdate = moment(
                                                        e.target.value
                                                      ).format("DD/MM/YYYY");
                                                      console.log(
                                                        "checkdate",
                                                        checkdate
                                                      );
                                                      if (
                                                        datchco !=
                                                        "__/__/____" &&
                                                        // checkdate ==
                                                        //   "Invalid date"
                                                        datchco.includes("_")
                                                      ) {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Correct Date. ",
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "licenses_exp"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    console.log("e ", e);
                                                    console.log(
                                                      "e.target.value ",
                                                      e.target.value
                                                    );
                                                    if (
                                                      e.target.value != null &&
                                                      e.target.value != ""
                                                    ) {
                                                      setFieldValue(
                                                        "licenses_exp",
                                                        e.target.value
                                                      );
                                                      this.checkExpiryDate(
                                                        setFieldValue,
                                                        e.target.value,
                                                        "licenses_exp"
                                                      );
                                                    } else {
                                                      // setFieldValue(
                                                      //   "licenses_exp",
                                                      //   ""
                                                      // );
                                                    }
                                                  }}
                                                />
                                              </Col>

                                              <Col
                                                lg={2}
                                                className="text-end fRp"
                                              >
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    console.log(
                                                      "valuesLicesnces",
                                                      values
                                                    );
                                                    if (
                                                      values.licences_type !=
                                                      "" &&
                                                      values.licences_type !=
                                                      null
                                                    ) {
                                                      let licensesObj = {
                                                        licences_type:
                                                          values.licences_type !=
                                                            null
                                                            ? values.licences_type
                                                            : "",
                                                        licenses_num:
                                                          values.licenses_num !=
                                                            null
                                                            ? values.licenses_num
                                                            : "",
                                                        licenses_exp:
                                                          values.licenses_exp !=
                                                            null
                                                            ? values.licenses_exp
                                                            : "",
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : licensesList.length,
                                                      };
                                                      this.addLicensesRow(
                                                        licensesObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Enter Licenses Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      e.preventDefault();
                                                      if (
                                                        values.licences_type !=
                                                        "" &&
                                                        values.licences_type !=
                                                        null
                                                      ) {
                                                        let licensesObj = {
                                                          licences_type:
                                                            values.licences_type !=
                                                              null
                                                              ? values.licences_type
                                                              : "",
                                                          licenses_num:
                                                            values.licenses_num !=
                                                              null
                                                              ? values.licenses_num
                                                              : "",
                                                          licenses_exp:
                                                            values.licenses_exp !=
                                                              null
                                                              ? values.licenses_exp
                                                              : "",
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : licensesList.length,
                                                        };
                                                        this.addLicensesRow(
                                                          licensesObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Licenses Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {/* {JSON.stringify(licensesList)} */}
                                  {licensesList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {licensesList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "sneha",
                                                    i,
                                                    "v",
                                                    v
                                                  );
                                                  let licensesObj = {
                                                    id: v.id,
                                                    licences_type:
                                                      v.licences_type,
                                                    licenses_num:
                                                      v.licenses_num,
                                                    licenses_exp:
                                                      v.licenses_exp,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchLicensesData(
                                                    licensesObj,
                                                    setFieldValue,
                                                    i
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "33%" }}>
                                                  {v.licences_type.label}
                                                </td>
                                                <td style={{ width: "34%" }}>
                                                  {v.licenses_num}
                                                </td>
                                                <td>{v.licenses_exp}</td>
                                                <td className="text-center">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeLicensesRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">Department</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    checked={
                                      values.isDepartment === true
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "deptList:--->",
                                        deptList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // this.setState({
                                      //   deptList:
                                      //     e.target.checked === false
                                      //       ? []
                                      //       : deptList,
                                      // });
                                      // setFieldValue(
                                      //   "isDepartment",
                                      //   e.target.checked
                                      // );
                                      if (deptList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg:
                                            "Please Remove Department List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          deptList:
                                            e.target.checked === false
                                              ? []
                                              : deptList,
                                        });
                                        setFieldValue(
                                          "isDepartment",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isDepartment"
                                    id="isDepartment"
                                    value={
                                      values.isDepartment == true ? true : false
                                    }
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isDepartment == true ? (
                                        <>
                                          <Col lg={6}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Dept</Form.Label>
                                              </Col>
                                              <Col lg={4} className="normalP">
                                                <Form.Group className="">
                                                  <Form.Control
                                                    className="text-box"
                                                    type="text"
                                                    autoComplete="off"
                                                    // disabled={isInputDisabled}
                                                    placeholder="Department"
                                                    name="dept"
                                                    onInput={(e) => {
                                                      e.target.value = this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                    }}
                                                    onChange={handleChange}
                                                    value={values.dept}
                                                    isValid={
                                                      touched.dept &&
                                                      !errors.dept
                                                    }
                                                    isInvalid={!!errors.dept}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.dept}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>Name</Form.Label>
                                              </Col>
                                              <Col lg={4} className="normalP">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    placeholder="Contact Person"
                                                    name="contact_person"
                                                    autoComplete="off"
                                                    className="text-box"
                                                    onInput={(e) => {
                                                      e.target.value = this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                    }}
                                                    // disabled={isInputDisabled}
                                                    onChange={handleChange}
                                                    value={
                                                      values.contact_person
                                                    }
                                                    isValid={
                                                      touched.contact_person &&
                                                      !errors.contact_person
                                                    }
                                                    isInvalid={
                                                      !!errors.contact_person
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.contact_person}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={6}>
                                            <Row>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>E-mail</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    placeholder=" E-mail"
                                                    name="email"
                                                    id="email"
                                                    autoComplete="off"
                                                    className="text-box"
                                                    // disabled={isInputDisabled}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => {
                                                      if (e.keyCode == 18) {
                                                        e.preventDefault();
                                                      }

                                                      if (
                                                        e.shiftKey &&
                                                        e.key === "Tab"
                                                      ) {
                                                        let email_val = e.target.value.trim();
                                                        if (
                                                          email_val != "" &&
                                                          !EMAILREGEXP.test(
                                                            email_val
                                                          )
                                                        ) {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "Please Enter Valid Email Id. ",
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "email"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                      } else if (
                                                        e.key === "Tab"
                                                      ) {
                                                        let email_val = e.target.value.trim();
                                                        if (
                                                          email_val != "" &&
                                                          !EMAILREGEXP.test(
                                                            email_val
                                                          )
                                                        ) {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "Please Enter Valid Email Id. ",
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "email"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={(e) => {
                                                      e.preventDefault();
                                                    }}
                                                    value={values.email}
                                                    isValid={
                                                      touched.email &&
                                                      !errors.email
                                                    }
                                                    isInvalid={!!errors.email}
                                                  />
                                                  {/* <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                  </Form.Control.Feedback> */}
                                                </Form.Group>
                                              </Col>
                                              <Col lg={1} className="fLp">
                                                <img
                                                  src={phone}
                                                  alt=""
                                                  className="ledger_small_icons"
                                                />
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    placeholder=" Enter"
                                                    name="contact_no"
                                                    id="contact_no"
                                                    className="text-box"
                                                    // disabled={isInputDisabled}
                                                    onChange={handleChange}
                                                    value={values.contact_no}
                                                    onKeyPress={(e) => {
                                                      OnlyEnterNumbers(e);
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (e.keyCode == 18) {
                                                        e.preventDefault();
                                                      }

                                                      if (
                                                        e.shiftKey &&
                                                        e.key === "Tab"
                                                      ) {
                                                        let mob = e.target.value.trim();
                                                        console.log(
                                                          "length--",
                                                          mob.length
                                                        );
                                                        if (
                                                          mob != "" &&
                                                          mob.length < 10
                                                        ) {
                                                          console.log(
                                                            "length--",
                                                            "plz enter 10 digit no."
                                                          );
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "Please Enter 10 Digit Number. ",
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "contact_no"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                      } else if (
                                                        e.key === "Tab"
                                                      ) {
                                                        let mob = e.target.value.trim();
                                                        console.log(
                                                          "length--",
                                                          mob.length
                                                        );
                                                        if (
                                                          mob != "" &&
                                                          mob.length < 10
                                                        ) {
                                                          console.log(
                                                            "length--",
                                                            "plz enter 10 digit no."
                                                          );
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "Please Enter 10 Digit Number. ",
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "contact_no"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={(e) => { }}
                                                    isValid={
                                                      touched.contact_no &&
                                                      !errors.contact_no
                                                    }
                                                    isInvalid={
                                                      !!errors.contact_no
                                                    }
                                                    maxLength={10}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.contact_no}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>

                                              <Col
                                                lg={1}
                                                className="text-end noP"
                                              >
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();

                                                    if (
                                                      values.dept != "" &&
                                                      values.dept != null &&
                                                      values.contact_person !=
                                                      "" &&
                                                      values.contact_person !=
                                                      null
                                                    ) {
                                                      let deptObj = {
                                                        dept:
                                                          values.dept != null
                                                            ? values.dept
                                                            : "",
                                                        contact_no:
                                                          values.contact_no !=
                                                            null
                                                            ? values.contact_no
                                                            : "",
                                                        contact_person:
                                                          values.contact_person !=
                                                            null
                                                            ? values.contact_person
                                                            : "",
                                                        email:
                                                          values.email != null
                                                            ? values.email
                                                            : "",
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : deptList.length,
                                                      };
                                                      this.addDeptRow(
                                                        deptObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Enter Department Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      if (
                                                        values.dept != "" &&
                                                        values.dept != null &&
                                                        values.contact_person !=
                                                        "" &&
                                                        values.contact_person !=
                                                        null
                                                      ) {
                                                        let deptObj = {
                                                          dept:
                                                            values.dept != null
                                                              ? values.dept
                                                              : "",
                                                          contact_no:
                                                            values.contact_no !=
                                                              null
                                                              ? values.contact_no
                                                              : "",
                                                          contact_person:
                                                            values.contact_person !=
                                                              null
                                                              ? values.contact_person
                                                              : "",
                                                          email:
                                                            values.email != null
                                                              ? values.email
                                                              : "",
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : deptList.length,
                                                        };
                                                        this.addDeptRow(
                                                          deptObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Department Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {deptList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        {/* <thead>
                                        <tr>
                                          <th>Sr.</th>
                                          <th>Dept. Name</th>
                                          <th>Contact Person</th>
                                          <th>Contact No.</th>
                                          <th colSpan={2}>
                                            Email
                                          </th>
                                        </tr>
                                      </thead> */}
                                        <tbody>
                                          {deptList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "si--------d",
                                                    i,
                                                    "v",
                                                    v
                                                  );

                                                  let deptObj = {
                                                    id: v.id,
                                                    dept: v.dept,

                                                    contact_no: v.contact_no,

                                                    contact_person:
                                                      v.contact_person,
                                                    email: v.email,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchDepartmentData(
                                                    deptObj,
                                                    setFieldValue,
                                                    i
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "24%" }}>
                                                  {v.dept}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                  {v.contact_person}
                                                </td>
                                                <td style={{ width: "26%" }}>
                                                  {v.email}
                                                </td>
                                                <td>{v.contact_no}</td>
                                                <td className="text-center">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeDeptRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col lg={6} className="column_heightC">
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">Bank Details</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    checked={
                                      values.isBankDetails === true
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "bankList:--->",
                                        bankList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // this.setState({
                                      //   bankList:
                                      //     e.target.checked === false
                                      //       ? []
                                      //       : bankList,
                                      // });
                                      // setFieldValue(
                                      //   "isBankDetails",
                                      //   e.target.checked
                                      // );
                                      if (bankList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "Please Remove Bank List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          bankList:
                                            e.target.checked === false
                                              ? []
                                              : bankList,
                                        });
                                        setFieldValue(
                                          "isBankDetails",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isBankDetails"
                                    id="isBankDetails"
                                    value={
                                      values.isBankDetails == true
                                        ? true
                                        : false
                                    }
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isBankDetails == true ? (
                                        <>
                                          <Col lg={6}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Bank</Form.Label>
                                              </Col>
                                              <Col lg={4}>
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder="Bank Name"
                                                    name="bank_name"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.bank_name}
                                                    onKeyPress={(e) => {
                                                      OnlyAlphabets(e);
                                                    }}
                                                    isValid={
                                                      touched.bank_name &&
                                                      !errors.bank_name
                                                    }
                                                    isInvalid={
                                                      !!errors.bank_name
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.bank_name}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={1}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>A/C</Form.Label>
                                              </Col>
                                              <Col lg={5}>
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder=" Number"
                                                    name="bank_account_no"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={
                                                      values.bank_account_no
                                                    }
                                                    onKeyPress={(e) => {
                                                      OnlyEnterNumbers(e);
                                                    }}
                                                    isValid={
                                                      touched.bank_account_no &&
                                                      !errors.bank_account_no
                                                    }
                                                    isInvalid={
                                                      !!errors.bank_account_no
                                                    }
                                                    maxLength={14}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.bank_account_no}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={6}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>IFSC</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder=" IFSC Code"
                                                    name="bank_ifsc_code"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={
                                                      values.bank_ifsc_code &&
                                                      values.bank_ifsc_code.toUpperCase()
                                                    }
                                                    isValid={
                                                      touched.bank_ifsc_code &&
                                                      !errors.bank_ifsc_code
                                                    }
                                                    maxLength={11}
                                                    isInvalid={
                                                      !!errors.bank_ifsc_code
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.bank_ifsc_code}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>Branch</Form.Label>
                                              </Col>
                                              <Col lg={3} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder=" Branch"
                                                    name="bank_branch"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.bank_branch}
                                                    isValid={
                                                      touched.bank_branch &&
                                                      !errors.bank_branch
                                                    }
                                                    isInvalid={
                                                      !!errors.bank_branch
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.bank_branch}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={1}
                                                className="text-end noP"
                                              >
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    if (
                                                      values.bank_name != "" &&
                                                      values.bank_name !=
                                                      null &&
                                                      values.bank_account_no !=
                                                      "" &&
                                                      values.bank_account_no !=
                                                      null &&
                                                      values.bank_ifsc_code !=
                                                      "" &&
                                                      values.bank_ifsc_code !=
                                                      null &&
                                                      values.bank_branch !=
                                                      "" &&
                                                      values.bank_branch != null
                                                    ) {
                                                      let bankObj = {
                                                        bank_name:
                                                          values.bank_name !=
                                                            null
                                                            ? values.bank_name
                                                            : "",
                                                        bank_account_no:
                                                          values.bank_account_no !=
                                                            null
                                                            ? values.bank_account_no
                                                            : "",
                                                        bank_ifsc_code:
                                                          values.bank_ifsc_code !=
                                                            null
                                                            ? values.bank_ifsc_code
                                                            : "",
                                                        bank_branch:
                                                          values.bank_branch !=
                                                            null
                                                            ? values.bank_branch
                                                            : "",
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : bankList.length,
                                                      };
                                                      this.addBankRow(
                                                        bankObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Submit All Bank Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    // if(e.shiftKey && e.key === "tab"){
                                                    // }
                                                    // else if(e.key === "tab"){
                                                    //   this.deleref.current?.focus();
                                                    //   document.getElementById(`delete1`).focus()
                                                    // }
                                                    // else{ this.deleref.current?.focus()}
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      if (
                                                        values.bank_name !=
                                                        "" &&
                                                        values.bank_name != null
                                                      ) {
                                                        let bankObj = {
                                                          bank_name:
                                                            values.bank_name !=
                                                              null
                                                              ? values.bank_name
                                                              : "",
                                                          bank_account_no:
                                                            values.bank_account_no !=
                                                              null
                                                              ? values.bank_account_no
                                                              : "",
                                                          bank_ifsc_code:
                                                            values.bank_ifsc_code !=
                                                              null
                                                              ? values.bank_ifsc_code
                                                              : "",
                                                          bank_branch:
                                                            values.bank_branch !=
                                                              null
                                                              ? values.bank_branch
                                                              : "",
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : bankList.length,
                                                        };
                                                        this.addBankRow(
                                                          bankObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Submit All Bank Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {bankList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {bankList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log("sneha", v);
                                                  let bankObj = {
                                                    id: v.id,
                                                    bank_name:
                                                      v.bank_name != null
                                                        ? v.bank_name
                                                        : "",
                                                    bank_account_no:
                                                      v.bank_account_no != null
                                                        ? v.bank_account_no
                                                        : "",
                                                    bank_ifsc_code:
                                                      v.bank_ifsc_code != null
                                                        ? v.bank_ifsc_code
                                                        : "",
                                                    bank_branch:
                                                      v.bank_branch != null
                                                        ? v.bank_branch
                                                        : "",
                                                    index: v.index,
                                                  };
                                                  this.handleFetchBankData(
                                                    bankObj,
                                                    setFieldValue,
                                                    i
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "25%" }}>
                                                  {" "}
                                                  {v.bank_name}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                  {" "}
                                                  {v.bank_account_no}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                  {v.bank_ifsc_code}
                                                </td>
                                                <td>{v.bank_branch}</td>
                                                <td className="text-end">
                                                  {/* <Button
                                                    style={{
                                                      marginTop: "-12px",
                                                    }}
                                                    className=""
                                                    variant=""
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeBankRow(i);
                                                    }}
                                                  > */}
                                                  <img
                                                    src={Delete}
                                                    id="delete1"
                                                    alt=""
                                                    // ref={this.deleref}
                                                    className="table_delete_icon"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeBankRow(i);
                                                    }}
                                                  />
                                                  {/* </Button> */}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">Shipping Details</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    checked={
                                      values.isShippingDetails === true
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "shippingList:--->",
                                        shippingList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // this.setState({
                                      //   shippingList:
                                      //     e.target.checked === false
                                      //       ? []
                                      //       : shippingList,
                                      // });
                                      // setFieldValue(
                                      //   "isShippingDetails",
                                      //   e.target.checked
                                      // );
                                      if (shippingList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "Please Remove Shipping List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          shippingList:
                                            e.target.checked === false
                                              ? []
                                              : shippingList,
                                        });
                                        setFieldValue(
                                          "isShippingDetails",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isShippingDetails"
                                    id="isShippingDetails"
                                    value={
                                      values.isShippingDetails == true
                                        ? true
                                        : false
                                    }
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isShippingDetails == true ? (
                                        <>
                                          <Col lg={8}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Address</Form.Label>
                                              </Col>
                                              <Col lg={10}>
                                                <Form.Group className="">
                                                  <Form.Control
                                                    type="text"
                                                    autoComplete="true"
                                                    onInput={(e) => {
                                                      e.target.value = this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                    }}
                                                    // disabled={isInputDisabled}
                                                    className="text-box"
                                                    name="shipping_address"
                                                    onChange={handleChange}
                                                    value={
                                                      values.shipping_address
                                                    }
                                                    isValid={
                                                      touched.shipping_address &&
                                                      !errors.shipping_address
                                                    }
                                                    isInvalid={
                                                      !!errors.shipping_address
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.shipping_address}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={4} className="fLp">
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>State</Form.Label>
                                              </Col>
                                              <Col lg={8} className="fRp">
                                                <Form.Group>
                                                  {/* <Form.Control
                                                type="text"
                                                disabled={isInputDisabled}                                                
                                                name="district"
                                                className="text-box"
                                                onChange={handleChange}
                                                value={values.district}
                                                isValid={
                                                  touched.district &&
                                                  !errors.district
                                                }
                                                isInvalid={!!errors.district}
                                                onKeyPress={(e) => {
                                                  OnlyAlphabets(e);
                                                }}
                                              /> */}
                                                  <Select
                                                    className="selectTo"
                                                    styles={ledger_select}
                                                    // disabled={isInputDisabled}
                                                    onChange={(v) => {
                                                      setFieldValue(
                                                        "district",
                                                        v
                                                      );
                                                    }}
                                                    name="district"
                                                    options={stateOpt}
                                                    value={values.district}
                                                    invalid={
                                                      errors.district
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                  <span className="text-danger">
                                                    {errors.district}
                                                  </span>
                                                </Form.Group>
                                              </Col>

                                              <Col
                                                lg={2}
                                                className="text-end fRp"
                                              >
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    console.log(
                                                      "values.index",
                                                      values.index
                                                    );
                                                    if (
                                                      values.district != "" &&
                                                      values.district != null &&
                                                      values.shipping_address !=
                                                      "" &&
                                                      values.shipping_address !=
                                                      null
                                                    ) {
                                                      let shipObj = {
                                                        district:
                                                          values.district,
                                                        shipping_address:
                                                          values.shipping_address,

                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : shippingList.length,
                                                      };
                                                      this.addShippingRow(
                                                        shipObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Enter Shipping Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      if (
                                                        values.district != "" &&
                                                        values.district !=
                                                        null &&
                                                        values.shipping_address !=
                                                        "" &&
                                                        values.shipping_address !=
                                                        null
                                                      ) {
                                                        let shipObj = {
                                                          district:
                                                            values.district,
                                                          shipping_address:
                                                            values.shipping_address,

                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : shippingList.length,
                                                        };
                                                        this.addShippingRow(
                                                          shipObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Shipping Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {/* {JSON.stringify(shippingList)} */}
                                  {shippingList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {shippingList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log("sid", i, "v", v);

                                                  let shipObj = {
                                                    id: v.id,
                                                    district: v.district,
                                                    shipping_address:
                                                      v.shipping_address,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchShippingData(
                                                    shipObj,
                                                    setFieldValue
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "67%" }}>
                                                  {v.shipping_address}
                                                </td>
                                                <td>{v.district.label}</td>

                                                <td className="text-end">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeShippingRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>

                          <Row
                            className="btm-button-row"
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: "0",
                            }}
                          >
                            <Col md="12" className="text-end pe-4">
                              <Button
                                className="newSubmitBtn"
                                type="submit"
                                onKeyDown={(e) => {
                                  if (e.keyCode === 32) {
                                    e.preventDefault();
                                  } else if (e.keyCode === 13) {
                                    this.myRef.current.handleSubmit();
                                  }
                                }}
                              >
                                Submit
                              </Button>
                              <Button
                                variant="secondary newCancelBtn ms-2"
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
                                        // if (this.state.source != "") {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: this.state.source.from_page,
                                        //     prop_data: {
                                        //       rows: this.state.source.rows,
                                        //       invoice_data: this.state.source
                                        //         .invoice_data,
                                        //       ...this.state.source,
                                        //     },
                                        //     isNewTab: false,
                                        //   });
                                        //   this.setState({ source: "" });
                                        // } else {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: "ledgerlist",
                                        //     isNewTab: false,
                                        //     isCancel: true,
                                        //   });
                                        // }
                                        // @vinit @ condition for prop_data for focusing previous tab
                                        if (
                                          this.state.source &&
                                          this.state.source != ""
                                        ) {
                                          if (
                                            this.state.source.opType ===
                                            "create"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else if (
                                            this.state.source.opType === "edit"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data: this.state
                                                    .source.invoice_data,
                                                  ...this.state.source,
                                                },
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
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
                                          // if (this.state.source != "") {
                                          //   eventBus.dispatch("page_change", {
                                          //     from: "ledgercreate",
                                          //     to: this.state.source.from_page,
                                          //     prop_data: {
                                          //       rows: this.state.source.rows,
                                          //       invoice_data: this.state.source
                                          //         .invoice_data,
                                          //       ...this.state.source,
                                          //     },
                                          //     isNewTab: false,
                                          //   });
                                          //   this.setState({ source: "" });
                                          // } else {
                                          //   eventBus.dispatch("page_change", {
                                          //     from: "ledgercreate",
                                          //     to: "ledgerlist",
                                          //     isNewTab: false,
                                          //     isCancel: true,
                                          //   });
                                          // }
                                          // @vinit @ condition for prop_data for focusing previous tab
                                          if (
                                            this.state.source &&
                                            this.state.source != ""
                                          ) {
                                            if (
                                              this.state.source.opType ===
                                              "create"
                                            ) {
                                              eventBus.dispatch("page_change", {
                                                from: "ledgercreate",
                                                to: this.state.source.from_page,
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data: this.state
                                                    .source.invoice_data,
                                                  ...this.state.source,
                                                },
                                                isNewTab: false,
                                              });
                                              this.setState({ source: "" });
                                            } else if (
                                              this.state.source.opType ===
                                              "edit"
                                            ) {
                                              eventBus.dispatch("page_change", {
                                                from: "ledgercreate",
                                                to: this.state.source.from_page,
                                                prop_data: {
                                                  prop_data: {
                                                    rows: this.state.source
                                                      .rows,
                                                    invoice_data: this.state
                                                      .source.invoice_data,
                                                    ...this.state.source,
                                                  },
                                                },
                                                isNewTab: false,
                                              });
                                              this.setState({ source: "" });
                                            } else {
                                              eventBus.dispatch("page_change", {
                                                from: "ledgercreate",
                                                to: "ledgerlist",
                                                isNewTab: false,
                                                isCancel: true,
                                              });
                                            }
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        },
                                        handleFailFn: () => { },
                                      },
                                      () => {
                                        console.warn("return_data");
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
                      </>
                    )}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "sundry_debtors" && (
                      <>
                        <div className="middle_card_main">
                          <Card className="middle_card">
                            <Card.Body>
                              <Row>
                                <Col lg={4}>
                                  <Row>
                                    <Col lg={3} className="my-auto">
                                      <Form.Label>Registered Name</Form.Label>
                                    </Col>
                                    <Col lg={9}>
                                      <Form.Group>
                                        <Form.Control
                                          // autoFocus="true"
                                          type="text"
                                          placeholder="Registered Name"
                                          name="mailing_name"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.mailing_name}
                                          isValid={
                                            touched.mailing_name &&
                                            !errors.mailing_name
                                          }
                                          isInvalid={!!errors.mailing_name}
                                          onInput={(e) => {
                                            e.target.value = this.getDataCapitalised(
                                              e.target.value
                                            );
                                          }}
                                        />
                                        {/* <span className="text-danger errormsg">
                                          {errors.mailing_name}
                                        </span> */}
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={6}>
                                  <Row>
                                    <Col lg={1} className="my-auto">
                                      <Form.Label>Address</Form.Label>
                                    </Col>
                                    <Col lg={11}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          autoComplete="true"
                                          placeholder="Address"
                                          name="address"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.address}
                                          onInput={(e) => {
                                            e.target.value = this.getDataCapitalised(
                                              e.target.value
                                            );
                                          }}
                                          isValid={
                                            touched.address && !errors.address
                                          }
                                          isInvalid={!!errors.address}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.address}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={2} className="fLp">
                                  <Row>
                                    <Col lg={3} className="my-auto">
                                      <Form.Label>State</Form.Label>
                                      <span className="text-danger">*</span>
                                    </Col>
                                    <Col lg={9}>
                                      <Form.Group
                                        className={`${errorArrayBorder[1] == "Y"
                                          ? "border border-danger "
                                          : ""
                                          }`}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          if (values.stateId) {
                                            this.setErrorBorder(1, "");
                                          } else {
                                            this.setErrorBorder(1, "Y");
                                            // document
                                            //   .getElementById("stateId")
                                            //   .focus();
                                            this.selectRef.current?.focus();
                                          }
                                        }}
                                      >
                                        <Select
                                          className="selectTo"
                                          styles={ledger_select}
                                          options={stateOpt}
                                          onChange={(v) => {
                                            setFieldValue("stateId", v);
                                          }}
                                          name="stateId"
                                          id="stateId"
                                          value={values.stateId}
                                          invalid={
                                            errors.stateId ? true : false
                                          }
                                          ref={this.selectRef}
                                        />
                                        {/* <span className="text-danger">
                                          {errors.stateId}
                                        </span> */}
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col lg={1}>
                                  <Row>
                                    <Col lg={4} className="my-auto">
                                      <Form.Label>Pin</Form.Label>
                                    </Col>
                                    <Col lg={8} className="fRp">
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Pin"
                                          name="pincode"
                                          id="pincode"
                                          autoComplete="off"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.pincode}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          onBlur={(e) => {
                                            e.preventDefault();
                                            let pincode_val = e.target.value.trim();
                                            if (pincode_val !== "") {
                                              this.validatePincode(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            }
                                          }}
                                          maxLength={6}
                                          isValid={
                                            touched.pincode && !errors.pincode
                                          }
                                          isInvalid={!!errors.pincode}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.pincode}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} className="my-auto">
                                  <Row>
                                    <Col lg={1}>
                                      <img
                                        src={phone}
                                        alt=""
                                        className="ledger_small_icons"
                                      />
                                    </Col>
                                    <Col lg={5}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Enter"
                                          name="phone_no"
                                          id="phone_no"
                                          autoComplete="off"
                                          className="text-box"
                                          // onChange={handleChange}
                                          onChange={(e) => {
                                            let mob = e.target.value;
                                            setFieldValue("phone_no", mob);
                                            setFieldValue("whatsapp_no", mob);
                                          }}
                                          value={values.phone_no}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 18) {
                                              e.preventDefault();
                                            }

                                            if (e.shiftKey && e.key === "Tab") {
                                              let mob = e.target.value.trim();
                                              console.log(
                                                "length--",
                                                mob.length
                                              );
                                              if (
                                                mob != "" &&
                                                mob.length < 10
                                              ) {
                                                console.log(
                                                  "length--",
                                                  "plz enter 10 digit no."
                                                );
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter 10 Digit Number. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById("phone_no")
                                                    .focus();
                                                }, 1000);
                                              }
                                            } else if (e.key === "Tab") {
                                              let mob = e.target.value.trim();
                                              console.log(
                                                "length--",
                                                mob.length
                                              );
                                              if (
                                                mob != "" &&
                                                mob.length < 10
                                              ) {
                                                console.log(
                                                  "length--",
                                                  "plz enter 10 digit no."
                                                );
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter 10 Digit Number. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById("phone_no")
                                                    .focus();
                                                }, 1000);
                                              }
                                            }
                                          }}
                                          onBlur={(e) => { }}
                                          isValid={
                                            touched.phone_no && !errors.phone_no
                                          }
                                          isInvalid={!!errors.phone_no}
                                          maxLength={10}
                                        // onKeyDown={(e) => {
                                        //   if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.phone_no}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    <Col lg={1}>
                                      <img
                                        src={whatsapp}
                                        alt=""
                                        className="ledger_small_icons"
                                      />
                                    </Col>
                                    <Col lg={5}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Enter"
                                          autoComplete="off"
                                          name="whatsapp_no"
                                          id="whatsapp_no"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.whatsapp_no}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 18) {
                                              e.preventDefault();
                                            }

                                            if (e.shiftKey && e.key === "Tab") {
                                              let mob = e.target.value.trim();
                                              console.log(
                                                "length--",
                                                mob.length
                                              );
                                              if (
                                                mob != "" &&
                                                mob.length < 10
                                              ) {
                                                console.log(
                                                  "length--",
                                                  "plz enter 10 digit no."
                                                );
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter 10 Digit Number. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById(
                                                      "whatsapp_no"
                                                    )
                                                    .focus();
                                                }, 1000);
                                              }
                                            } else if (e.key === "Tab") {
                                              let mob = e.target.value.trim();
                                              console.log(
                                                "length--",
                                                mob.length
                                              );
                                              if (
                                                mob != "" &&
                                                mob.length < 10
                                              ) {
                                                console.log(
                                                  "length--",
                                                  "plz enter 10 digit no."
                                                );
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter 10 Digit Number. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById(
                                                      "whatsapp_no"
                                                    )
                                                    .focus();
                                                }, 1000);
                                              }
                                            }
                                          }}
                                          onBlur={(e) => { }}
                                          isValid={
                                            touched.whatsapp_no &&
                                            !errors.whatsapp_no
                                          }
                                          isInvalid={!!errors.whatsapp_no}
                                          maxLength={10}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.whatsapp_no}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3}>
                                  <Row>
                                    <Col lg={2} className="my-auto">
                                      <Form.Label>E-mail</Form.Label>
                                    </Col>
                                    <Col lg={10}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="E-mail"
                                          autoComplete="off"
                                          name="email_id"
                                          id="email_id"
                                          className="text-box"
                                          onChange={handleChange}
                                          value={values.email_id}
                                          isValid={
                                            touched.email_id && !errors.email_id
                                          }
                                          isInvalid={!!errors.email_id}
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
                                                  msg:
                                                    "Please Enter Valid Email Id. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById("email_id")
                                                    .focus();
                                                }, 1000);
                                              }
                                            } else if (e.key === "Tab") {
                                              let email_val = e.target.value.trim();
                                              if (
                                                email_val != "" &&
                                                !EMAILREGEXP.test(email_val)
                                              ) {
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Please Enter Valid Email Id. ",
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                setTimeout(() => {
                                                  document
                                                    .getElementById("email_id")
                                                    .focus();
                                                }, 1000);
                                              }
                                            }
                                          }}
                                          onBlur={(e) => {
                                            e.preventDefault();
                                          }}
                                        // onKeyDown={(e) => {
                                        //   if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value
                                        //   )
                                        //     e.preventDefault();
                                        // }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {errors.email_id}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={2}>
                                  <Row>
                                    <Col lg={4} className="my-auto">
                                      <Form.Label>Reg. No.</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          placeholder="Registration No."
                                          name="licenseNo"
                                          className="text-box"
                                          id="licenseNo"
                                          onChange={handleChange}
                                          value={values.licenseNo}
                                        />
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={2} className="fLp">
                                  <Row>
                                    <Col lg={3} className="my-auto">
                                      <Form.Label>Reg. Date</Form.Label>
                                    </Col>
                                    <Col lg={9}>
                                      <MyTextDatePicker
                                        id="date_of_registartion"
                                        name="date_of_registartion"
                                        placeholder="DD/MM/YYYY"
                                        className="form-control"
                                        value={values.date_of_registartion}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          }
                                          if (e.shiftKey && e.key === "Tab") {
                                            let datchco = e.target.value.trim();
                                            console.log("datchco", datchco);
                                            let checkdate = moment(
                                              e.target.value
                                            ).format("DD/MM/YYYY");
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
                                                msg:
                                                  "Please Enter Correct Date. ",
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              setTimeout(() => {
                                                document
                                                  .getElementById(
                                                    "date_of_registartion"
                                                  )
                                                  .focus();
                                              }, 1000);
                                            }
                                          } else if (e.key === "Tab") {
                                            let datchco = e.target.value.trim();
                                            console.log("datchco", datchco);
                                            let checkdate = moment(
                                              e.target.value
                                            ).format("DD/MM/YYYY");
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
                                                msg:
                                                  "Please Enter Correct Date. ",
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              setTimeout(() => {
                                                document
                                                  .getElementById(
                                                    "date_of_registartion"
                                                  )
                                                  .focus();
                                              }, 1000);
                                            }
                                          }
                                        }}
                                        onBlur={(e) => {
                                          console.log("e ", e);
                                          console.log(
                                            "e.target.value ",
                                            e.target.value
                                          );
                                          if (
                                            e.target.value != null &&
                                            e.target.value != ""
                                          ) {
                                            setFieldValue(
                                              "date_of_registartion",
                                              e.target.value
                                            );
                                            this.checkExpiryDate(
                                              setFieldValue,
                                              e.target.value,
                                              "date_of_registartion"
                                            );
                                          } else {
                                            // setFieldValue(
                                            //   "date_of_registartion",
                                            //   ""
                                            // );
                                          }
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col
                                  lg={6}
                                  style={{ borderRight: "1px solid" }}
                                >
                                  <Row>
                                    <Col lg={2} className="d-flex">
                                      <Form.Label>Credit</Form.Label>
                                      <Form.Check
                                        type="switch"
                                        className="ms-1 my-auto"
                                        onClick={this.handleSwitchClick}
                                        onChange={(e) => {
                                          console.log(
                                            "Is Checked:--->",
                                            e.target.checked
                                          );
                                          // this.gstFieldshow(e.target.checked);
                                          setFieldValue(
                                            "isCredit",
                                            e.target.checked
                                          );
                                        }}
                                        name="isCredit"
                                        id="isCredit"
                                        value={
                                          values.isCredit == true ? true : false
                                        }
                                      />
                                    </Col>
                                    {values.isCredit == true ? (
                                      <>
                                        <Col lg={2} className="fLp">
                                          <Row>
                                            <Col lg={4}>
                                              <Form.Label>Days</Form.Label>
                                            </Col>
                                            <Col lg={8}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Days"
                                                  name="credit_days"
                                                  id="credit_days"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.credit_days}
                                                  maxLength={3}
                                                  onKeyPress={(e) => {
                                                    OnlyEnterNumbers(e);
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.credit_days}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        {/* <Col lg={2}> */}
                                        {parseInt(values.credit_days) > 0 ? (
                                          <Col lg={4} className="noP">
                                            <Row>
                                              <Col md={5}>
                                                <Form.Label className="mb-2">
                                                  Applicable From
                                                </Form.Label>{" "}
                                              </Col>
                                              <Col md={7}>
                                                <Form.Group className="mb-2">
                                                  <Select
                                                    // disabled={isInputDisabled}
                                                    isClearable={true}
                                                    styles={ledger_select}
                                                    className="selectTo"
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        "applicable_from",
                                                        e
                                                      );
                                                    }}
                                                    options={
                                                      applicable_from_options
                                                    }
                                                    name="applicable_from"
                                                    id="applicable_from"
                                                    value={
                                                      values.applicable_from
                                                    }
                                                    invalid={
                                                      errors.applicable_from
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                  <span className="text-danger">
                                                    {errors.applicable_from}
                                                  </span>
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                        ) : (
                                          <></>
                                        )}
                                        {/* </Col> */}
                                        <Col lg={2} className="normalP">
                                          <Row>
                                            <Col lg={4}>
                                              <Form.Label>Bills</Form.Label>
                                            </Col>
                                            <Col lg={8}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Bills"
                                                  name="credit_bills"
                                                  id="credit_bills"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.credit_bills}
                                                  maxLength={3}
                                                  onKeyPress={(e) => {
                                                    OnlyEnterNumbers(e);
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.credit_bills}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={2}>
                                          <Row>
                                            <Col lg={4} className="fLp">
                                              <Form.Label>Values</Form.Label>
                                            </Col>
                                            <Col lg={8} className="normalrP">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Values"
                                                  name="credit_values"
                                                  id="credit_values"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.credit_values}
                                                  onKeyPress={(e) => {
                                                    OnlyEnterNumbers(e);
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.credit_values}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    <Col lg={5} className="mt-2">
                                      {isUserControl(
                                        "is_multi_rates",
                                        this.props.userControl
                                      ) ? (
                                        <Row>
                                          <Col lg={3}>
                                            <Form.Label>Sales Rate</Form.Label>
                                          </Col>
                                          <Col lg={7}>
                                            <Form.Group className="">
                                              <Select
                                                className="selectTo"
                                                id="salesrate"
                                                onChange={(e) => {
                                                  setFieldValue("salesrate", e);
                                                }}
                                                options={sales_rate_options}
                                                name="salesrate"
                                                styles={ledger_select}
                                                value={values.salesrate}
                                              />
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      ) : (
                                        <></>
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={6}>
                                  <Row>
                                    <Col lg={6}>
                                      <Row>
                                        <Col lg={2} className="d-flex">
                                          <Form.Label>Trade</Form.Label>
                                        </Col>
                                        <Col lg={10}>
                                          <Row>
                                            <Col lg={3}>
                                              <Form.Check // prettier-ignore
                                                className="cpt"
                                                type="radio"
                                                id="Retailer"
                                                label="Retailer"
                                                name="tradeOfBusiness"
                                                value="retailer"
                                                checked={
                                                  values.tradeOfBusiness ==
                                                    "retailer"
                                                    ? true
                                                    : false
                                                }
                                                onChange={handleChange}
                                              />
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Check // prettier-ignore
                                                className="cpt"
                                                type="radio"
                                                id="Manufaturer"
                                                label="Manufacturer"
                                                name="tradeOfBusiness"
                                                value="manufacturer"
                                                checked={
                                                  values.tradeOfBusiness ==
                                                    "manufacturer"
                                                    ? true
                                                    : false
                                                }
                                                onChange={handleChange}
                                              />
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Check // prettier-ignore
                                                className="cpt"
                                                type="radio"
                                                id="distributor"
                                                label="Distributor"
                                                name="tradeOfBusiness"
                                                value="distributor"
                                                checked={
                                                  values.tradeOfBusiness ==
                                                    "distributor"
                                                    ? true
                                                    : false
                                                }
                                                onChange={handleChange}
                                              />
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col lg={6}>
                                      <Row>
                                        <Col lg={4}>
                                          <Form.Label>
                                            Business Nature
                                          </Form.Label>
                                        </Col>
                                        <Col lg={8}>
                                          <Form.Group>
                                            <Form.Control
                                              type="text"
                                              autoComplete="off"
                                              placeholder="Business Nature"
                                              className="text-box"
                                              name="natureOfBusiness"
                                              id="natureOfBusiness"
                                              onChange={handleChange}
                                              value={values.natureOfBusiness}
                                              onInput={(e) => {
                                                e.target.value = this.getDataCapitalised(
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                          <Row className="middleGapTop">
                            <Col lg={6} className="column_heightD">
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">GST</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    // label={values.isGST == true ? "Yes" : "No"}
                                    checked={
                                      values.isGST === true ? true : false
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "gstList:--->",
                                        gstList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // this.setState({
                                      //   gstList:
                                      //     e.target.checked === false
                                      //       ? []
                                      //       : gstList,
                                      // });
                                      // setFieldValue("isGST", e.target.checked);
                                      if (gstList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "Please Remove GST List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          gstList:
                                            e.target.checked === false
                                              ? []
                                              : gstList,
                                        });
                                        setFieldValue(
                                          "isGST",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isGST"
                                    id="isGST"
                                    value={values.isGST == true ? true : false}
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      <Col lg={6} className="normalrP">
                                        {values.isGST == true ? (
                                          <>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Type</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group
                                                  // className={`${
                                                  //   errorArrayBorder[2] == "Y"
                                                  //     ? "border border-danger "
                                                  //     : ""
                                                  // }`}
                                                  onBlur={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                      values.registraion_type
                                                    ) {
                                                      // this.setErrorBorder(
                                                      //   4,
                                                      //   ""
                                                      // );
                                                    } else {
                                                      // this.setErrorBorder(
                                                      //   4,
                                                      //   "Y"
                                                      // );
                                                      // document
                                                      //   .getElementById("registraion_type")
                                                      //   .focus();
                                                      this.selectRefGST.current?.focus();
                                                    }
                                                  }}
                                                >
                                                  <Select
                                                    className="selectTo"
                                                    styles={ledger_select}
                                                    // disabled={isInputDisabled}
                                                    onChange={(v) => {
                                                      setFieldValue(
                                                        "registraion_type",
                                                        v
                                                      );
                                                    }}
                                                    name="registraion_type"
                                                    options={GSTTypeOpt}
                                                    value={
                                                      values.registraion_type
                                                    }
                                                    invalid={
                                                      errors.registraion_type
                                                        ? true
                                                        : false
                                                    }
                                                    ref={this.selectRefGST}
                                                    maxDate={new Date()}
                                                  />
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>
                                                  Reg. Date
                                                </Form.Label>
                                              </Col>
                                              <Col
                                                lg={4}
                                                className="fRp normalP"
                                              >
                                                <MyTextDatePicker
                                                  id="dateofregistartion"
                                                  name="dateofregistartion"
                                                  placeholder="DD/MM/YYYY"
                                                  className="form-control"
                                                  // disabled={isInputDisabled}
                                                  value={
                                                    values.dateofregistartion
                                                  }
                                                  onChange={handleChange}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 18) {
                                                      e.preventDefault();
                                                    }

                                                    if (
                                                      e.shiftKey &&
                                                      e.key === "Tab"
                                                    ) {
                                                      let datchco = e.target.value.trim();
                                                      console.log(
                                                        "datchco",
                                                        datchco
                                                      );
                                                      let checkdate = moment(
                                                        e.target.value
                                                      ).format("DD/MM/YYYY");
                                                      console.log(
                                                        "checkdate",
                                                        checkdate
                                                      );
                                                      if (
                                                        datchco !=
                                                        "__/__/____" &&
                                                        // checkdate ==
                                                        //   "Invalid date"
                                                        datchco.includes("_")
                                                      ) {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Correct Date. ",
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "dateofregistartion"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    } else if (
                                                      e.key === "Tab"
                                                    ) {
                                                      let datchco = e.target.value.trim();
                                                      console.log(
                                                        "datchco",
                                                        datchco
                                                      );
                                                      let checkdate = moment(
                                                        e.target.value
                                                      ).format("DD/MM/YYYY");
                                                      console.log(
                                                        "checkdate",
                                                        checkdate
                                                      );
                                                      if (
                                                        datchco !=
                                                        "__/__/____" &&
                                                        // checkdate ==
                                                        //   "Invalid date"
                                                        datchco.includes("_")
                                                      ) {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Correct Date. ",
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "dateofregistartion"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    console.log("e ", e);
                                                    console.log(
                                                      "e.target.value ",
                                                      e.target.value
                                                    );
                                                    if (
                                                      e.target.value != null &&
                                                      e.target.value != ""
                                                    ) {
                                                      setFieldValue(
                                                        "dateofregistartion",
                                                        e.target.value
                                                      );
                                                      this.checkExpiryDate(
                                                        setFieldValue,
                                                        e.target.value,
                                                        "dateofregistartion"
                                                      );
                                                    } else {
                                                      // setFieldValue(
                                                      //   "dateofregistartion",
                                                      //   ""
                                                      // );
                                                    }
                                                  }}
                                                />
                                                <span className="text-danger errormsg">
                                                  {errors.dateofregistartion}
                                                </span>
                                              </Col>
                                            </Row>
                                          </>
                                        ) : (
                                          <Row>
                                            <Col lg={1} className="my-auto">
                                              <Form.Label>PAN</Form.Label>
                                            </Col>
                                            <Col lg={5}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // readOnly
                                                  // disabled={isInputDisabled}
                                                  placeholder="PAN Number"
                                                  name="pan_no"
                                                  id="pan_no"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={
                                                    values.pan_no &&
                                                    values.pan_no.toUpperCase()
                                                  }
                                                  isValid={
                                                    touched.pan_no &&
                                                    !errors.pan_no
                                                  }
                                                  isInvalid={!!errors.pan_no}
                                                  maxLength={10}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.pan_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        )}
                                      </Col>

                                      {values.isGST == true && (
                                        <>
                                          <Col lg={6}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>GSTIN</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fRp BnoP">
                                                <Form.Group>
                                                  <Form.Control
                                                    ref={this.gstRef}
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder="GSTIN"
                                                    name="gstin"
                                                    maxLength={15}
                                                    className="text-box"
                                                    id="gstin"
                                                    onChange={handleChange}
                                                    value={
                                                      values.gstin &&
                                                      values.gstin.toUpperCase()
                                                    }
                                                    isValid={
                                                      touched.gstin &&
                                                      !errors.gstin
                                                    }
                                                    isInvalid={!!errors.gstin}
                                                    onBlur={(e) => {
                                                      e.preventDefault();

                                                      if (
                                                        values.gstin != "" &&
                                                        values.gstin !=
                                                        undefined
                                                      ) {
                                                        this.extract_pan_from_GSTIN(
                                                          values.gstin,
                                                          setFieldValue
                                                        );
                                                        if (
                                                          GSTINREX.test(
                                                            values.gstin
                                                          )
                                                        ) {
                                                          return values.gstin;
                                                        } else {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "GSTIN is not Valid!",
                                                            is_button_show: false,
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            this.gstRef.current?.focus();
                                                          }, 1000);
                                                        }
                                                      } else {
                                                        this.gstRef.current?.focus();
                                                        setFieldValue(
                                                          "pan_no",
                                                          ""
                                                        );
                                                      }
                                                    }}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.gstin}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={1}
                                                className="my-auto normalP"
                                              >
                                                <Form.Label>PAN</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fRp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    autoComplete="off"
                                                    // readOnly
                                                    // disabled={isInputDisabled}
                                                    placeholder="PAN Number"
                                                    name="pan_no"
                                                    id="pan_no"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={
                                                      values.pan_no &&
                                                      values.pan_no.toUpperCase()
                                                    }
                                                    isValid={
                                                      touched.pan_no &&
                                                      !errors.pan_no
                                                    }
                                                    isInvalid={!!errors.pan_no}
                                                    maxLength={10}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.pan_no}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col lg={1} className="normalP">
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                      values.gstin != "" &&
                                                      values.gstin != null
                                                    ) {
                                                      let gstObj = {
                                                        gstin:
                                                          values.gstin != null
                                                            ? values.gstin
                                                            : "",
                                                        dateofregistartion:
                                                          values.dateofregistartion !=
                                                            null
                                                            ? values.dateofregistartion
                                                            : "",
                                                        pan_no:
                                                          values.pan_no != null
                                                            ? values.pan_no
                                                            : "",
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : gstList.length,
                                                        registraion_type:
                                                          values.registraion_type !=
                                                            null
                                                            ? values.registraion_type
                                                            : "",
                                                      };
                                                      this.addGSTRow(
                                                        gstObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Enter GST Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      e.preventDefault();
                                                      if (
                                                        values.gstin != "" &&
                                                        values.gstin != null
                                                      ) {
                                                        let gstObj = {
                                                          gstin:
                                                            values.gstin != null
                                                              ? values.gstin
                                                              : "",
                                                          dateofregistartion:
                                                            values.dateofregistartion !=
                                                              null
                                                              ? values.dateofregistartion
                                                              : "",
                                                          pan_no:
                                                            values.pan_no !=
                                                              null
                                                              ? values.pan_no
                                                              : "",
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : gstList.length,
                                                          registraion_type:
                                                            values.registraion_type !=
                                                              null
                                                              ? values.registraion_type
                                                              : "",
                                                        };
                                                        this.addGSTRow(
                                                          gstObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter GST Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      )}
                                    </Row>
                                  </div>
                                  {/* {JSON.stringify(gstList)} */}
                                  {gstList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {gstList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "sneha",
                                                    i,
                                                    "v",
                                                    v
                                                  );
                                                  let gstObj = {
                                                    id: v.id,
                                                    registraion_type:
                                                      v.registraion_type,
                                                    gstin: v.gstin,
                                                    dateofregistartion:
                                                      v.dateofregistartion,

                                                    pan_no: v.pan_no,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchGstData(
                                                    gstObj,
                                                    setFieldValue
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "24%" }}>
                                                  {v.registraion_type.label}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                  {v.dateofregistartion}
                                                </td>
                                                <td>{v.gstin.toUpperCase()}</td>
                                                <td>{v.pan_no}</td>
                                                <td className="text-center">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeGstRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">License</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    checked={
                                      values.isLicense === true ? true : false
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "licensesList:--->",
                                        licensesList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // this.setState({
                                      //   licensesList:
                                      //     e.target.checked === false
                                      //       ? []
                                      //       : licensesList,
                                      // });
                                      // setFieldValue(
                                      //   "isLicense",
                                      //   e.target.checked
                                      // );
                                      if (licensesList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "Please Remove License List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          licensesList:
                                            e.target.checked === false
                                              ? []
                                              : licensesList,
                                        });
                                        setFieldValue(
                                          "isLicense",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isLicense"
                                    id="isLicense"
                                    value={
                                      values.isLicense == true ? true : false
                                    }
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isLicense == true ? (
                                        <>
                                          <Col lg={8}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Type</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group className="">
                                                  <Select
                                                    className="selectTo"
                                                    styles={ledger_select}
                                                    // disabled={isInputDisabled}
                                                    options={licencesType}
                                                    onChange={(v) => {
                                                      setFieldValue(
                                                        "licences_type",
                                                        v
                                                      );
                                                    }}
                                                    name="licences_type"
                                                    value={values.licences_type}
                                                    invalid={
                                                      errors.licences_type
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>Number</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    autoComplete="off"
                                                    // disabled={isInputDisabled}
                                                    placeholder=" Number"
                                                    name="licenses_num"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.licenses_num}
                                                    isValid={
                                                      touched.licenses_num &&
                                                      !errors.licenses_num
                                                    }
                                                    isInvalid={
                                                      !!errors.licenses_num
                                                    }
                                                  />
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={4} className="fLp">
                                            <Row>
                                              <Col lg={4} className="my-auto">
                                                <Form.Label>
                                                  Expiry Date
                                                </Form.Label>
                                              </Col>
                                              <Col lg={6} className="fRp">
                                                <MyTextDatePicker
                                                  id="licenses_exp"
                                                  name="licenses_exp"
                                                  placeholder="DD/MM/YYYY"
                                                  className="form-control"
                                                  // disabled={isInputDisabled}
                                                  value={values.licenses_exp}
                                                  onChange={handleChange}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 18) {
                                                      e.preventDefault();
                                                    }
                                                    if (
                                                      e.shiftKey &&
                                                      e.key === "Tab"
                                                    ) {
                                                      let datchco = e.target.value.trim();
                                                      console.log(
                                                        "datchco",
                                                        datchco
                                                      );
                                                      let checkdate = moment(
                                                        e.target.value
                                                      ).format("DD/MM/YYYY");
                                                      console.log(
                                                        "checkdate",
                                                        checkdate
                                                      );
                                                      if (
                                                        datchco !=
                                                        "__/__/____" &&
                                                        // checkdate ==
                                                        //   "Invalid date"
                                                        datchco.includes("_")
                                                      ) {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Correct Date. ",
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "licenses_exp"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    } else if (
                                                      e.key === "Tab"
                                                    ) {
                                                      let datchco = e.target.value.trim();
                                                      console.log(
                                                        "datchco",
                                                        datchco
                                                      );
                                                      let checkdate = moment(
                                                        e.target.value
                                                      ).format("DD/MM/YYYY");
                                                      console.log(
                                                        "checkdate",
                                                        checkdate
                                                      );
                                                      if (
                                                        datchco !=
                                                        "__/__/____" &&
                                                        // checkdate ==
                                                        //   "Invalid date"
                                                        datchco.includes("_")
                                                      ) {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Correct Date. ",
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "licenses_exp"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    console.log("e ", e);
                                                    console.log(
                                                      "e.target.value ",
                                                      e.target.value
                                                    );
                                                    if (
                                                      e.target.value != null &&
                                                      e.target.value != ""
                                                    ) {
                                                      setFieldValue(
                                                        "licenses_exp",
                                                        e.target.value
                                                      );
                                                      this.checkExpiryDate(
                                                        setFieldValue,
                                                        e.target.value,
                                                        "licenses_exp"
                                                      );
                                                    } else {
                                                      // setFieldValue(
                                                      //   "licenses_exp",
                                                      //   ""
                                                      // );
                                                    }
                                                  }}
                                                />
                                              </Col>

                                              <Col
                                                lg={2}
                                                className="text-end fRp"
                                              >
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                      values.licences_type !=
                                                      "" &&
                                                      values.licences_type !=
                                                      null
                                                    ) {
                                                      let licensesObj = {
                                                        licences_type:
                                                          values.licences_type !=
                                                            null
                                                            ? values.licences_type
                                                            : "",
                                                        licenses_num:
                                                          values.licenses_num !=
                                                            null
                                                            ? values.licenses_num
                                                            : "",
                                                        licenses_exp:
                                                          values.licenses_exp !=
                                                            null
                                                            ? values.licenses_exp
                                                            : "",
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : licensesList.length,
                                                      };
                                                      this.addLicensesRow(
                                                        licensesObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Enter Licenses Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      if (
                                                        values.licences_type !=
                                                        "" &&
                                                        values.licences_type !=
                                                        null
                                                      ) {
                                                        let licensesObj = {
                                                          licences_type:
                                                            values.licences_type !=
                                                              null
                                                              ? values.licences_type
                                                              : "",
                                                          licenses_num:
                                                            values.licenses_num !=
                                                              null
                                                              ? values.licenses_num
                                                              : "",
                                                          licenses_exp:
                                                            values.licenses_exp !=
                                                              null
                                                              ? values.licenses_exp
                                                              : "",
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : licensesList.length,
                                                        };
                                                        this.addLicensesRow(
                                                          licensesObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Licenses Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {licensesList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {licensesList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "sneha",
                                                    i,
                                                    "v",
                                                    v
                                                  );
                                                  let licensesObj = {
                                                    id: v.id,
                                                    licences_type:
                                                      v.licences_type,
                                                    licenses_num:
                                                      v.licenses_num,
                                                    licenses_exp:
                                                      v.licenses_exp,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchLicensesData(
                                                    licensesObj,
                                                    setFieldValue,
                                                    i
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "33%" }}>
                                                  {v.licences_type.label}
                                                </td>
                                                <td style={{ width: "34%" }}>
                                                  {v.licenses_num}
                                                </td>
                                                <td>{v.licenses_exp}</td>
                                                <td className="text-center">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeLicensesRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">Department</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    checked={
                                      values.isDepartment === true
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "deptList:--->",
                                        deptList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // this.setState({
                                      //   deptList:
                                      //     e.target.checked === false
                                      //       ? []
                                      //       : deptList,
                                      // });
                                      // setFieldValue(
                                      //   "isDepartment",
                                      //   e.target.checked
                                      // );
                                      if (deptList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg:
                                            "Please Remove Department List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          deptList:
                                            e.target.checked === false
                                              ? []
                                              : deptList,
                                        });
                                        setFieldValue(
                                          "isDepartment",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isDepartment"
                                    id="isDepartment"
                                    value={
                                      values.isDepartment == true ? true : false
                                    }
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isDepartment == true ? (
                                        <>
                                          <Col lg={6}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Dept</Form.Label>
                                              </Col>
                                              <Col lg={4} className="normalP">
                                                <Form.Group className="">
                                                  <Form.Control
                                                    className="text-box"
                                                    autoComplete="off"
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder="Department"
                                                    name="dept"
                                                    onInput={(e) => {
                                                      e.target.value = this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                    }}
                                                    onChange={handleChange}
                                                    value={values.dept}
                                                    isValid={
                                                      touched.dept &&
                                                      !errors.dept
                                                    }
                                                    isInvalid={!!errors.dept}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.dept}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>Name</Form.Label>
                                              </Col>
                                              <Col lg={4} className="normalP">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    placeholder="Contact Person"
                                                    name="contact_person"
                                                    autoComplete="off"
                                                    className="text-box"
                                                    onInput={(e) => {
                                                      e.target.value = this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                    }}
                                                    // disabled={isInputDisabled}
                                                    onChange={handleChange}
                                                    value={
                                                      values.contact_person
                                                    }
                                                    isValid={
                                                      touched.contact_person &&
                                                      !errors.contact_person
                                                    }
                                                    isInvalid={
                                                      !!errors.contact_person
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.contact_person}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={6}>
                                            <Row>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>E-mail</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    placeholder=" E-mail"
                                                    name="email"
                                                    id="email"
                                                    autoComplete="off"
                                                    className="text-box"
                                                    // disabled={isInputDisabled}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => {
                                                      if (e.keyCode == 18) {
                                                        e.preventDefault();
                                                      }

                                                      if (
                                                        e.shiftKey &&
                                                        e.key === "Tab"
                                                      ) {
                                                        let email_val = e.target.value.trim();
                                                        if (
                                                          email_val != "" &&
                                                          !EMAILREGEXP.test(
                                                            email_val
                                                          )
                                                        ) {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "Please Enter Valid Email Id. ",
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "email"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                      } else if (
                                                        e.key === "Tab"
                                                      ) {
                                                        let email_val = e.target.value.trim();
                                                        if (
                                                          email_val != "" &&
                                                          !EMAILREGEXP.test(
                                                            email_val
                                                          )
                                                        ) {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "Please Enter Valid Email Id. ",
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "email"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={(e) => {
                                                      e.preventDefault();
                                                    }}
                                                    value={values.email}
                                                    isValid={
                                                      touched.email &&
                                                      !errors.email
                                                    }
                                                    isInvalid={!!errors.email}
                                                  />
                                                  {/* <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                  </Form.Control.Feedback> */}
                                                </Form.Group>
                                              </Col>
                                              <Col lg={1} className="fLp">
                                                <img
                                                  src={phone}
                                                  alt=""
                                                  className="ledger_small_icons"
                                                />
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    placeholder=" Enter"
                                                    name="contact_no"
                                                    id="contact_no"
                                                    autoComplete="off"
                                                    className="text-box"
                                                    // disabled={isInputDisabled}
                                                    onChange={handleChange}
                                                    value={values.contact_no}
                                                    onKeyPress={(e) => {
                                                      OnlyEnterNumbers(e);
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (e.keyCode == 18) {
                                                        e.preventDefault();
                                                      }
                                                      if (
                                                        e.shiftKey &&
                                                        e.key === "Tab"
                                                      ) {
                                                        let mob = e.target.value.trim();
                                                        console.log(
                                                          "length--",
                                                          mob.length
                                                        );
                                                        if (
                                                          mob != "" &&
                                                          mob.length < 10
                                                        ) {
                                                          console.log(
                                                            "length--",
                                                            "plz enter 10 digit no."
                                                          );
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "Please Enter 10 Digit Number. ",
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "contact_no"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                      } else if (
                                                        e.key === "Tab"
                                                      ) {
                                                        let mob = e.target.value.trim();
                                                        console.log(
                                                          "length--",
                                                          mob.length
                                                        );
                                                        if (
                                                          mob != "" &&
                                                          mob.length < 10
                                                        ) {
                                                          console.log(
                                                            "length--",
                                                            "plz enter 10 digit no."
                                                          );
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg:
                                                              "Please Enter 10 Digit Number. ",
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            document
                                                              .getElementById(
                                                                "contact_no"
                                                              )
                                                              .focus();
                                                          }, 1000);
                                                        }
                                                      }
                                                    }}
                                                    onBlur={(e) => { }}
                                                    isValid={
                                                      touched.contact_no &&
                                                      !errors.contact_no
                                                    }
                                                    isInvalid={
                                                      !!errors.contact_no
                                                    }
                                                    maxLength={10}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.contact_no}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>

                                              <Col
                                                lg={1}
                                                className="text-end noP"
                                              >
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();

                                                    if (
                                                      values.dept != "" &&
                                                      values.dept != null &&
                                                      values.contact_person !=
                                                      "" &&
                                                      values.contact_person !=
                                                      null
                                                    ) {
                                                      let deptObj = {
                                                        dept:
                                                          values.dept != null
                                                            ? values.dept
                                                            : "",
                                                        contact_no:
                                                          values.contact_no !=
                                                            null
                                                            ? values.contact_no
                                                            : "",
                                                        contact_person:
                                                          values.contact_person !=
                                                            null
                                                            ? values.contact_person
                                                            : "",
                                                        email:
                                                          values.email != null
                                                            ? values.email
                                                            : "",
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : deptList.length,
                                                      };
                                                      this.addDeptRow(
                                                        deptObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Enter Department Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      if (
                                                        values.dept != "" &&
                                                        values.dept != null &&
                                                        values.contact_person !=
                                                        "" &&
                                                        values.contact_person !=
                                                        null
                                                      ) {
                                                        let deptObj = {
                                                          dept:
                                                            values.dept != null
                                                              ? values.dept
                                                              : "",
                                                          contact_no:
                                                            values.contact_no !=
                                                              null
                                                              ? values.contact_no
                                                              : "",
                                                          contact_person:
                                                            values.contact_person !=
                                                              null
                                                              ? values.contact_person
                                                              : "",
                                                          email:
                                                            values.email != null
                                                              ? values.email
                                                              : "",
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : deptList.length,
                                                        };
                                                        this.addDeptRow(
                                                          deptObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Department Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {deptList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {deptList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "si--------d",
                                                    i,
                                                    "v",
                                                    v
                                                  );

                                                  let deptObj = {
                                                    dept: v.dept,
                                                    id: v.id,

                                                    contact_no: v.contact_no,

                                                    contact_person:
                                                      v.contact_person,
                                                    email: v.email,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchDepartmentData(
                                                    deptObj,
                                                    setFieldValue,
                                                    i
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "24%" }}>
                                                  {v.dept}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                  {v.contact_person}
                                                </td>
                                                <td style={{ width: "26%" }}>
                                                  {v.email}
                                                </td>
                                                <td>{v.contact_no}</td>
                                                <td className="text-center">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeDeptRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col lg={6} className="column_heightD">
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">Bank Details</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    checked={
                                      values.isBankDetails === true
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "bankList:--->",
                                        bankList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // this.setState({
                                      //   bankList:
                                      //     e.target.checked === false
                                      //       ? []
                                      //       : bankList,
                                      // });
                                      // setFieldValue(
                                      //   "isBankDetails",
                                      //   e.target.checked
                                      // );
                                      if (bankList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "Please Remove Bank List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          bankList:
                                            e.target.checked === false
                                              ? []
                                              : bankList,
                                        });
                                        setFieldValue(
                                          "isBankDetails",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isBankDetails"
                                    id="isBankDetails"
                                    value={
                                      values.isBankDetails == true
                                        ? true
                                        : false
                                    }
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isBankDetails == true ? (
                                        <>
                                          <Col lg={6}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Bank</Form.Label>
                                              </Col>
                                              <Col lg={4}>
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder="Bank Name"
                                                    name="bank_name"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.bank_name}
                                                    onKeyPress={(e) => {
                                                      OnlyAlphabets(e);
                                                    }}
                                                    isValid={
                                                      touched.bank_name &&
                                                      !errors.bank_name
                                                    }
                                                    isInvalid={
                                                      !!errors.bank_name
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.bank_name}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={1}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>A/C</Form.Label>
                                              </Col>
                                              <Col lg={5}>
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder=" Number"
                                                    name="bank_account_no"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={
                                                      values.bank_account_no
                                                    }
                                                    onKeyPress={(e) => {
                                                      OnlyEnterNumbers(e);
                                                    }}
                                                    isValid={
                                                      touched.bank_account_no &&
                                                      !errors.bank_account_no
                                                    }
                                                    isInvalid={
                                                      !!errors.bank_account_no
                                                    }
                                                    maxLength={14}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.bank_account_no}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={6}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>IFSC</Form.Label>
                                              </Col>
                                              <Col lg={4} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder=" IFSC Code"
                                                    name="bank_ifsc_code"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={
                                                      values.bank_ifsc_code &&
                                                      values.bank_ifsc_code.toUpperCase()
                                                    }
                                                    isValid={
                                                      touched.bank_ifsc_code &&
                                                      !errors.bank_ifsc_code
                                                    }
                                                    maxLength={11}
                                                    isInvalid={
                                                      !!errors.bank_ifsc_code
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.bank_ifsc_code}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={2}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>Branch</Form.Label>
                                              </Col>
                                              <Col lg={3} className="fLp">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    // disabled={isInputDisabled}
                                                    placeholder=" Branch"
                                                    name="bank_branch"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.bank_branch}
                                                    isValid={
                                                      touched.bank_branch &&
                                                      !errors.bank_branch
                                                    }
                                                    isInvalid={
                                                      !!errors.bank_branch
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.bank_branch}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                              <Col
                                                lg={1}
                                                className="text-end noP"
                                              >
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    if (
                                                      values.bank_name != "" &&
                                                      values.bank_name !=
                                                      null &&
                                                      values.bank_account_no !=
                                                      "" &&
                                                      values.bank_account_no !=
                                                      null &&
                                                      values.bank_ifsc_code !=
                                                      "" &&
                                                      values.bank_ifsc_code !=
                                                      null &&
                                                      values.bank_branch !=
                                                      "" &&
                                                      values.bank_branch != null
                                                    ) {
                                                      let bankObj = {
                                                        bank_name:
                                                          values.bank_name !=
                                                            null
                                                            ? values.bank_name
                                                            : "",
                                                        bank_account_no:
                                                          values.bank_account_no !=
                                                            null
                                                            ? values.bank_account_no
                                                            : "",
                                                        bank_ifsc_code:
                                                          values.bank_ifsc_code !=
                                                            null
                                                            ? values.bank_ifsc_code
                                                            : "",
                                                        bank_branch:
                                                          values.bank_branch !=
                                                            null
                                                            ? values.bank_branch
                                                            : "",
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : bankList.length,
                                                      };
                                                      this.addBankRow(
                                                        bankObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Submit All Bank Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      if (
                                                        values.bank_name !=
                                                        "" &&
                                                        values.bank_name != null
                                                      ) {
                                                        let bankObj = {
                                                          bank_name:
                                                            values.bank_name !=
                                                              null
                                                              ? values.bank_name
                                                              : "",
                                                          bank_account_no:
                                                            values.bank_account_no !=
                                                              null
                                                              ? values.bank_account_no
                                                              : "",
                                                          bank_ifsc_code:
                                                            values.bank_ifsc_code !=
                                                              null
                                                              ? values.bank_ifsc_code
                                                              : "",
                                                          bank_branch:
                                                            values.bank_branch !=
                                                              null
                                                              ? values.bank_branch
                                                              : "",
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : bankList.length,
                                                        };
                                                        this.addBankRow(
                                                          bankObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Submit All Bank Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {bankList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {bankList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log("sneha", v);
                                                  let bankObj = {
                                                    id: v.id,
                                                    bank_name:
                                                      v.bank_name != null
                                                        ? v.bank_name
                                                        : "",
                                                    bank_account_no:
                                                      v.bank_account_no != null
                                                        ? v.bank_account_no
                                                        : "",
                                                    bank_ifsc_code:
                                                      v.bank_ifsc_code != null
                                                        ? v.bank_ifsc_code
                                                        : "",
                                                    bank_branch:
                                                      v.bank_branch != null
                                                        ? v.bank_branch
                                                        : "",
                                                    index: v.index,
                                                  };
                                                  this.handleFetchBankData(
                                                    bankObj,
                                                    setFieldValue,
                                                    i
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "25%" }}>
                                                  {" "}
                                                  {v.bank_name}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                  {" "}
                                                  {v.bank_account_no}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                  {v.bank_ifsc_code}
                                                </td>
                                                <td>{v.bank_branch}</td>
                                                <td className="text-end">
                                                  {/* <Button
                                                    style={{
                                                      marginTop: "-12px",
                                                    }}
                                                    className=""
                                                    variant=""
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeBankRow(i);
                                                    }}
                                                  > */}
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeBankRow(i);
                                                    }}
                                                  />
                                                  {/* </Button> */}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">Salesman</h3>
                                  {values.salesmanId ||
                                    values.areaId ||
                                    values.route ? (
                                    <Form.Check
                                      // label={
                                      //   values.isSalesman == true
                                      //     ? "true"
                                      //     : "false"
                                      // }
                                      disabled
                                      type="switch"
                                      className="ms-1"
                                      onClick={this.handleSwitchClick}
                                      onChange={(e) => {
                                        console.log(
                                          "Is Checked:--->",
                                          e.target.checked
                                        );
                                        // this.gstFieldshow(e.target.checked);
                                        setFieldValue(
                                          "isSalesman",
                                          e.target.checked
                                        );
                                      }}
                                      name="isSalesman"
                                      id="isSalesman"
                                      value={
                                        values.isSalesman == true ? true : false
                                      }
                                    />
                                  ) : (
                                    <Form.Check
                                      // label={
                                      //   values.isSalesman == true
                                      //     ? "true"
                                      //     : "false"
                                      // }
                                      type="switch"
                                      className="ms-1"
                                      onClick={this.handleSwitchClick}
                                      onChange={(e) => {
                                        console.log(
                                          "Is Checked:--->",
                                          e.target.checked
                                        );
                                        // this.gstFieldshow(e.target.checked);
                                        setFieldValue(
                                          "isSalesman",
                                          e.target.checked
                                        );
                                      }}
                                      name="isSalesman"
                                      id="isSalesman"
                                      value={
                                        values.isSalesman == true ? true : false
                                      }
                                    />
                                  )}
                                  {/* <Form.Check
                                    // label={
                                    //   values.isSalesman == true
                                    //     ? "true"
                                    //     : "false"
                                    // }
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      // this.gstFieldshow(e.target.checked);
                                      setFieldValue(
                                        "isSalesman",
                                        e.target.checked
                                      );
                                    }}
                                    name="isSalesman"
                                    id="isSalesman"
                                    value={
                                      values.isSalesman == true ? true : false
                                    }
                                  /> */}
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isSalesman == true ? (
                                        <>
                                          <Col lg={9}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>
                                                  Salesman
                                                </Form.Label>
                                              </Col>
                                              <Col lg={3}>
                                                <Form.Group className="">
                                                  <Select
                                                    className="selectTo"
                                                    // disabled={isInputDisabled}
                                                    components={{
                                                      IndicatorSeparator: () =>
                                                        null,
                                                    }}
                                                    // styles={purchaseSelect}
                                                    isClearable={true}
                                                    options={salesmanLst}
                                                    name="salesmanId"
                                                    id="salesmanId"
                                                    onChange={(v) => {
                                                      setFieldValue(
                                                        "salesmanId",
                                                        v
                                                      );
                                                      // setFieldValue(
                                                      //   "salesmanId",
                                                      //   ""
                                                      // );
                                                      if (
                                                        isActionExist(
                                                          "salasman",
                                                          "create",
                                                          this.props
                                                            .userPermissions
                                                        )
                                                      ) {
                                                        if (v != "") {
                                                          if (
                                                            v.label ===
                                                            "Add New"
                                                          ) {
                                                            // alert("new click");
                                                            let data = {
                                                              from_data:
                                                                "ledgercreate",
                                                              values: values,
                                                            };
                                                            eventBus.dispatch(
                                                              "page_change",
                                                              {
                                                                from: from_source,
                                                                to:
                                                                  "salasman-master",
                                                                prop_data: data,
                                                                isNewTab: false,
                                                              }
                                                            );
                                                            console.log(
                                                              "data------------",
                                                              data
                                                            );
                                                          } else
                                                            setFieldValue(
                                                              "salesmanId",
                                                              v
                                                            );
                                                        }
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Permission is denied!",
                                                          is_button_show: true,
                                                        });
                                                      }
                                                    }}
                                                    value={values.salesmanId}
                                                    styles={ledger_select}
                                                  />
                                                </Form.Group>
                                              </Col>
                                              <Col lg={1} className="my-auto">
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.setState({
                                                      salesMaster: true,
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                              <Col lg={1} className="my-auto">
                                                <Form.Label>Area</Form.Label>
                                              </Col>
                                              <Col lg={4}>
                                                <Form.Group>
                                                  <Select
                                                    className="selectTo"
                                                    // disabled={isInputDisabled}
                                                    components={{
                                                      IndicatorSeparator: () =>
                                                        null,
                                                    }}
                                                    // styles={purchaseSelect}
                                                    isClearable={true}
                                                    options={areaLst}
                                                    name="areaId"
                                                    id="areaId"
                                                    onChange={(v) => {
                                                      setFieldValue(
                                                        "areaId",
                                                        v
                                                      );
                                                    }}
                                                    value={values.areaId}
                                                    styles={ledger_select}
                                                  />
                                                </Form.Group>
                                              </Col>
                                              <Col lg={1} className="my-auto">
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    this.setState({
                                                      areaMaster: true,
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={3}>
                                            <Row>
                                              <Col
                                                lg={3}
                                                className="my-auto fLp"
                                              >
                                                <Form.Label>Route</Form.Label>
                                              </Col>
                                              <Col lg={8} className="sFbP">
                                                <Form.Group>
                                                  <Form.Control
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder="Enter Route"
                                                    name="route"
                                                    className="text-box"
                                                    onChange={handleChange}
                                                    value={values.route}
                                                    onInput={(e) => {
                                                      e.target.value = this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                    }}
                                                  />
                                                </Form.Group>
                                              </Col>

                                              {/* <Col lg={2} className="text-end">
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                      values.salesmanId != "" &&
                                                      values.salesmanId != null
                                                    ) {
                                                      let salesmanObj = {
                                                        salesmanId:
                                                          values.salesmanId !=
                                                          null
                                                            ? values.salesmanId
                                                            : "",
                                                        areaId:
                                                          values.areaId != null
                                                            ? values.areaId
                                                            : "",
                                                        route:
                                                          values.route != null
                                                            ? values.route
                                                            : "",
                                                        index:
                                                          values.index !==
                                                          undefined
                                                            ? values.index
                                                            : salesmanList.length,
                                                      };
                                                      this.addSalesmanRow(
                                                        salesmanObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Salesman Details ",
                                                        is_button_show: false,
                                                      });
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col> */}
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {salesmanList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {salesmanList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "sneha",
                                                    i,
                                                    "v",
                                                    v
                                                  );
                                                  let salesmanObj = {
                                                    id: v.id,
                                                    salesmanId: v.salesmanId,
                                                    areaId: v.areaId,
                                                    route: v.route,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchSalesmanData(
                                                    salesmanObj,
                                                    setFieldValue
                                                  );
                                                }}
                                              >
                                                <td>{v.salesmanId.label}</td>
                                                <td>{v.areaId}</td>
                                                <td>{v.route}</td>
                                                <td className="text-center">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeSalesmanRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                              <Card className="bottom_card_style">
                                <Card.Header className="d-flex">
                                  <h3 className="my-auto">Shipping Details</h3>
                                  <Form.Check
                                    type="switch"
                                    className="ms-1"
                                    onClick={this.handleSwitchClick}
                                    checked={
                                      values.isShippingDetails === true
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        "Is Checked:--->",
                                        e.target.checked
                                      );
                                      console.log(
                                        "shippingList:--->",
                                        shippingList.length
                                      );
                                      // // this.gstFieldshow(e.target.checked);
                                      // this.setState({
                                      //   shippingList:
                                      //     e.target.checked === false
                                      //       ? []
                                      //       : shippingList,
                                      // });
                                      // setFieldValue(
                                      //   "isShippingDetails",
                                      //   e.target.checked
                                      // );
                                      if (shippingList.length > 0) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: "Please Remove Shipping List. ",
                                          // is_timeout: true,
                                          // delay: 1500,
                                          is_button_show: true,
                                        });
                                      } else {
                                        this.setState({
                                          shippingList:
                                            e.target.checked === false
                                              ? []
                                              : shippingList,
                                        });
                                        setFieldValue(
                                          "isShippingDetails",
                                          e.target.checked
                                        );
                                      }
                                    }}
                                    name="isShippingDetails"
                                    id="isShippingDetails"
                                    value={
                                      values.isShippingDetails == true
                                        ? true
                                        : false
                                    }
                                  />
                                </Card.Header>
                                <Card.Body>
                                  <div className="card_sub_header">
                                    <Row>
                                      {values.isShippingDetails == true ? (
                                        <>
                                          <Col lg={8}>
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>Address</Form.Label>
                                              </Col>
                                              <Col lg={10}>
                                                <Form.Group className="">
                                                  <Form.Control
                                                    type="text"
                                                    autoComplete="off"
                                                    onInput={(e) => {
                                                      e.target.value = this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                    }}
                                                    // disabled={isInputDisabled}
                                                    className="text-box"
                                                    name="shipping_address"
                                                    onChange={handleChange}
                                                    value={
                                                      values.shipping_address
                                                    }
                                                    isValid={
                                                      touched.shipping_address &&
                                                      !errors.shipping_address
                                                    }
                                                    isInvalid={
                                                      !!errors.shipping_address
                                                    }
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                    {errors.shipping_address}
                                                  </Form.Control.Feedback>
                                                </Form.Group>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col lg={4} className="fLp">
                                            <Row>
                                              <Col lg={2} className="my-auto">
                                                <Form.Label>State</Form.Label>
                                              </Col>
                                              <Col lg={8} className="fRp">
                                                <Form.Group>
                                                  <Select
                                                    className="selectTo"
                                                    styles={ledger_select}
                                                    // disabled={isInputDisabled}
                                                    onChange={(v) => {
                                                      setFieldValue(
                                                        "district",
                                                        v
                                                      );
                                                    }}
                                                    name="district"
                                                    options={stateOpt}
                                                    value={values.district}
                                                    invalid={
                                                      errors.district
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                  <span className="text-danger">
                                                    {errors.district}
                                                  </span>
                                                </Form.Group>
                                              </Col>

                                              <Col
                                                lg={2}
                                                className="text-end fRp"
                                              >
                                                <Button
                                                  className="rowPlusBtn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    console.log(
                                                      "values.index",
                                                      values.index
                                                    );
                                                    if (
                                                      values.district != "" &&
                                                      values.district != null &&
                                                      values.shipping_address !=
                                                      "" &&
                                                      values.shipping_address !=
                                                      null
                                                    ) {
                                                      let shipObj = {
                                                        district:
                                                          values.district,
                                                        shipping_address:
                                                          values.shipping_address,
                                                        index:
                                                          values.index !==
                                                            undefined
                                                            ? values.index
                                                            : shippingList.length,
                                                      };
                                                      this.addShippingRow(
                                                        shipObj,
                                                        setFieldValue
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg:
                                                          "Please Enter Shipping Details ",
                                                        // is_button_show: false,
                                                        is_timeout: true,
                                                        delay: 1500,
                                                      });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 32) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.keyCode === 13
                                                    ) {
                                                      if (
                                                        values.district != "" &&
                                                        values.district !=
                                                        null &&
                                                        values.shipping_address !=
                                                        "" &&
                                                        values.shipping_address !=
                                                        null
                                                      ) {
                                                        let shipObj = {
                                                          district:
                                                            values.district,
                                                          shipping_address:
                                                            values.shipping_address,
                                                          index:
                                                            values.index !==
                                                              undefined
                                                              ? values.index
                                                              : shippingList.length,
                                                        };
                                                        this.addShippingRow(
                                                          shipObj,
                                                          setFieldValue
                                                        );
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "Please Enter Shipping Details ",
                                                          // is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="plus-color"
                                                  />
                                                </Button>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </Row>
                                  </div>
                                  {shippingList.length > 0 && (
                                    <div className="bottom_card_table">
                                      <Table hover>
                                        <tbody>
                                          {shippingList.map((v, i) => {
                                            return (
                                              <tr
                                                onDoubleClick={(e) => {
                                                  e.preventDefault();
                                                  console.log("sid", i, "v", v);

                                                  let shipObj = {
                                                    id: v.id,
                                                    district: v.district,
                                                    shipping_address:
                                                      v.shipping_address,
                                                    index: v.index,
                                                  };
                                                  this.handleFetchShippingData(
                                                    shipObj,
                                                    setFieldValue
                                                  );
                                                }}
                                              >
                                                <td style={{ width: "67%" }}>
                                                  {v.shipping_address}
                                                </td>
                                                <td>{v.district.label}</td>

                                                <td className="text-end">
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeShippingRow(i);
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>

                          <Row
                            className="btm-button-row"
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: "0",
                            }}
                          >
                            <Col md="12" className="text-end pe-4">
                              <Button
                                className="newSubmitBtn"
                                type="submit"
                                onKeyDown={(e) => {
                                  if (e.keyCode === 32) {
                                    e.preventDefault();
                                  } else if (e.keyCode === 13) {
                                    this.myRef.current.handleSubmit();
                                  }
                                }}
                              >
                                Submit
                              </Button>
                              <Button
                                variant="secondary newCancelBtn ms-2"
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
                                        // @vinit @ condition for prop_data for focusing previous tab
                                        if (
                                          this.state.source &&
                                          this.state.source != ""
                                        ) {
                                          if (
                                            this.state.source.opType ===
                                            "create"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else if (
                                            this.state.source.opType === "edit"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data: this.state
                                                    .source.invoice_data,
                                                  ...this.state.source,
                                                },
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
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
                                          // if (this.state.source != "") {
                                          //   eventBus.dispatch("page_change", {
                                          //     from: "ledgercreate",
                                          //     to: this.state.source.from_page,
                                          //     prop_data: {
                                          //       rows: this.state.source.rows,
                                          //       invoice_data: this.state.source
                                          //         .invoice_data,
                                          //       ...this.state.source,
                                          //     },
                                          //     isNewTab: false,
                                          //   });
                                          //   this.setState({ source: "" });
                                          // }
                                          // @vinit @ condition for prop_data for focusing previous tab
                                          if (
                                            this.state.source &&
                                            this.state.source != ""
                                          ) {
                                            if (
                                              this.state.source.opType ===
                                              "create"
                                            ) {
                                              eventBus.dispatch("page_change", {
                                                from: "ledgercreate",
                                                to: this.state.source.from_page,
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data: this.state
                                                    .source.invoice_data,
                                                  ...this.state.source,
                                                },
                                                isNewTab: false,
                                              });
                                              this.setState({ source: "" });
                                            } else if (
                                              this.state.source.opType ===
                                              "edit"
                                            ) {
                                              eventBus.dispatch("page_change", {
                                                from: "ledgercreate",
                                                to: this.state.source.from_page,
                                                prop_data: {
                                                  prop_data: {
                                                    rows: this.state.source
                                                      .rows,
                                                    invoice_data: this.state
                                                      .source.invoice_data,
                                                    ...this.state.source,
                                                  },
                                                },
                                                isNewTab: false,
                                              });
                                              this.setState({ source: "" });
                                            } else {
                                              eventBus.dispatch("page_change", {
                                                from: "ledgercreate",
                                                to: "ledgerlist",
                                                isNewTab: false,
                                                isCancel: true,
                                              });
                                            }
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        },
                                        handleFailFn: () => { },
                                      },
                                      () => {
                                        console.warn("return_data");
                                      }
                                    );
                                  }
                                }}
                              >
                                Cancel {/* sundry_debtors cancel button */}
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </>
                    )}
                  {/* Bank account start  **/}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "bank_account" && (
                      <div className=" form-style">
                        <div
                          className="middle_card_main"
                          style={{ height: "auto" }}
                        >
                          <Card className="middle_card">
                            <Card.Body>
                              <Row>
                                <Col>
                                  <h5 className="Mail-title ms-2">
                                    Taxation Details
                                  </h5>
                                </Col>
                              </Row>
                              <Row>
                                {/* <Col md={10}> */}
                                <Row className="m-0">
                                  <Col md={1}>
                                    <Form.Label>
                                      Taxation Available{" "}
                                      {/* <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span> */}
                                    </Form.Label>{" "}
                                  </Col>
                                  <Col md={2}>
                                    <Form.Group>
                                      <Select
                                        // styles={customStyles}
                                        styles={ledger_select}
                                        className="selectTo"
                                        onChange={(e) => {
                                          setFieldValue("isTaxation", e);
                                        }}
                                        options={ledger_type_options}
                                        name="isTaxation"
                                        value={values.isTaxation}
                                      />
                                    </Form.Group>
                                  </Col>
                                  {values.isTaxation &&
                                    values.isTaxation.value == true && (
                                      <>
                                        <Col lg={3}>
                                          <Row>
                                            <Col lg={2}>
                                              <Form.Label>GSTIN</Form.Label>
                                            </Col>
                                            <Col lg={10}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder="GSTIN"
                                                  name="gstin"
                                                  className="text-box"
                                                  id="gstin"
                                                  onChange={handleChange}
                                                  onBlur={(e) => {
                                                    e.preventDefault();
                                                    if (values.gstin != "") {
                                                      if (
                                                        GSTINREX.test(
                                                          values.gstin
                                                        )
                                                      ) {
                                                        return values.gstin;
                                                      } else {
                                                        MyNotifications.fire({
                                                          show: true,
                                                          icon: "error",
                                                          title: "Error",
                                                          msg:
                                                            "GSTIN is not Valid!",
                                                          is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          document
                                                            .getElementById(
                                                              "gstin"
                                                            )
                                                            .focus();
                                                        }, 1000);
                                                      }
                                                    }
                                                  }}
                                                  value={
                                                    values.gstin &&
                                                    values.gstin.toUpperCase()
                                                  }
                                                  isValid={
                                                    touched.gstin &&
                                                    !errors.gstin
                                                  }
                                                  isInvalid={!!errors.gstin}
                                                  maxLength={15}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.gstin}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    )}
                                </Row>
                                {/* </Col> */}
                              </Row>
                            </Card.Body>
                          </Card>
                        </div>

                        {/* <hr /> */}
                        <div
                          className="middle_card_main"
                          style={{ height: "65vh" }}
                        >
                          <Card className="middle_card">
                            <Card.Body>
                              <Row className="mt-2 mx-0">
                                <Row>
                                  <Col>
                                    <h5 className="Mail-title">Bank Details</h5>
                                  </Col>
                                </Row>

                                {/* <Col md={10}> */}
                                <Row className="mb-2">
                                  <Col md={1}>
                                    <Form.Label>Bank Name </Form.Label>
                                  </Col>
                                  <Col md={2}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Bank Name"
                                        name="bank_name"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.bank_name}
                                        onKeyPress={(e) => {
                                          OnlyAlphabets(e);
                                        }}
                                        isValid={
                                          touched.bank_name && !errors.bank_name
                                        }
                                        isInvalid={!!errors.bank_name}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.bank_name}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col md={1}>
                                    <Form.Label>Account Number </Form.Label>
                                  </Col>
                                  <Col md={2}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Account Number"
                                        name="bank_account_no"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.bank_account_no}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        isValid={
                                          touched.bank_account_no &&
                                          !errors.bank_account_no
                                        }
                                        maxLength={14}
                                        isInvalid={!!errors.bank_account_no}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.bank_account_no}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col lg={3}>
                                    <Row>
                                      <Col lg={3}>
                                        <Form.Label>IFSC Code </Form.Label>
                                      </Col>
                                      <Col lg={8}>
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            placeholder="IFSC Code"
                                            name="bank_ifsc_code"
                                            className="text-box"
                                            onChange={handleChange}
                                            value={
                                              values.bank_ifsc_code &&
                                              values.bank_ifsc_code.toUpperCase()
                                            }
                                            isValid={
                                              touched.bank_ifsc_code &&
                                              !errors.bank_ifsc_code
                                            }
                                            maxLength={11}
                                            isInvalid={!!errors.bank_ifsc_code}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            {errors.bank_ifsc_code}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  </Col>
                                  {/* </Row>
                              <Row> */}
                                  <Col md={1}>
                                    <Form.Label>Branch </Form.Label>
                                  </Col>
                                  <Col md={2}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Branch"
                                        name="bank_branch"
                                        onKeyPress={(e) => {
                                          OnlyAlphabets(e);
                                        }}
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.bank_branch}
                                        isValid={
                                          touched.bank_branch &&
                                          !errors.bank_branch
                                        }
                                        isInvalid={!!errors.bank_branch}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors.bank_branch}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  {/* <Col md={8} className="text-end"> */}
                                  {/* <Button
                                      className="create-btn successbtn-style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (
                                          values.bank_name != "" &&
                                          values.bank_name != null &&
                                          values.bank_account_no != "" &&
                                          values.bank_account_no != null &&
                                          values.bank_ifsc_code != "" &&
                                          values.bank_ifsc_code != null &&
                                          values.bank_branch != "" &&
                                          values.bank_branch != null
                                        ) {
                                          let bankObj = {
                                            bank_name:
                                              values.bank_name != null
                                                ? values.bank_name
                                                : "",
                                            bank_account_no:
                                              values.bank_account_no != null
                                                ? values.bank_account_no
                                                : "",
                                            bank_ifsc_code:
                                              values.bank_ifsc_code != null
                                                ? values.bank_ifsc_code
                                                : "",
                                            bank_branch:
                                              values.bank_branch != null
                                                ? values.bank_branch
                                                : "",
                                          };
                                          this.addBankRow(bankObj, setFieldValue);
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Please Submit All Bank Details ",
                                            is_button_show: false,
                                          });
                                        }
                                      }}
                                    >
                                      ADD ROW
                                    </Button>
                                  </Col> */}
                                </Row>
                                {/* {bankList.length > 0 && (
                                  <Row className="mt-2">
                                    <Col md={12}>
                                      <div className="">
                                        <Table
                                          hover
                                          size="sm"
                                          style={{ fontSize: "13px" }}
                                          //responsive
                                        >
                                          <thead>
                                            <tr>
                                              <th>Sr.</th>
                                              <th>Bank Name</th>
                                              <th>Account Number</th>
                                              <th>IFSC Code</th>
                                              <th>Branch</th>
                                              <th className="text-center">-</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {bankList.map((v, i) => {
                                              return (
                                                <tr>
                                                  <td>{i + 1}</td>
                                                  <td>{v.bank_name}</td>
                                                  <td>{v.bank_account_no}</td>
                                                  <td>{v.bank_ifsc_code}</td>
                                                  <td>{v.bank_branch}</td>
                                                  <td className="text-center">
                                                    <Button
                                                      style={{
                                                        marginTop: "-12px",
                                                      }}
                                                      className="mainbtnminus"
                                                      variant=""
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        this.removeDeptRow(i);
                                                      }}
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faTrash}
                                                      />
                                                    </Button>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </Table>
                                      </div>
                                    </Col>
                                  </Row>
                                )} */}
                                {/* </Col> */}
                              </Row>
                            </Card.Body>
                          </Card>
                        </div>

                        {/* <hr /> */}
                        <Row
                          className="btm-button-row"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                          }}
                        >
                          <Col md="12" className="text-end pe-4">
                            <Button
                              className="newSubmitBtn"
                              type="submit"
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.myRef.current.handleSubmit();
                                }
                              }}
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary newCancelBtn ms-2"
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
                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgercreate",
                                      //     to: this.state.source.from_page,
                                      //     prop_data: {
                                      //       rows: this.state.source.rows,
                                      //       invoice_data: this.state.source
                                      //         .invoice_data,
                                      //       ...this.state.source,
                                      //     },
                                      //     isNewTab: false,
                                      //   });
                                      //   this.setState({ source: "" });
                                      // } else {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgercreate",
                                      //     to: "ledgerlist",
                                      //     isNewTab: false,
                                      //     isCancel: true,
                                      //   });
                                      // }
                                      // @vinit @ condition for prop_data for focusing previous tab
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data: this.state.source
                                                .invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgercreate",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
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
                                        // if (this.state.source != "") {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: this.state.source.from_page,
                                        //     prop_data: {
                                        //       rows: this.state.source.rows,
                                        //       invoice_data: this.state.source
                                        //         .invoice_data,
                                        //       ...this.state.source,
                                        //     },
                                        //     isNewTab: false,
                                        //   });
                                        //   this.setState({ source: "" });
                                        // } else {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: "ledgerlist",
                                        //     isNewTab: false,
                                        //     isCancel: true,
                                        //   });
                                        // }
                                        // @vinit @ condition for prop_data for focusing previous tab
                                        if (
                                          this.state.source &&
                                          this.state.source != ""
                                        ) {
                                          if (
                                            this.state.source.opType ===
                                            "create"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else if (
                                            this.state.source.opType === "edit"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data: this.state
                                                    .source.invoice_data,
                                                  ...this.state.source,
                                                },
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      },
                                      handleFailFn: () => { },
                                    },
                                    () => {
                                      console.warn("return_data");
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
                    )}
                  {/* Bank account end */}
                  {/* duties and taxes start  **/}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "duties_taxes" && (
                      <>
                        <div className="middle_card_main">
                          <Card className="middle_card">
                            <Card.Body>
                              <Row>
                                <Col md="12">
                                  <Row>
                                    <Col md={1}>
                                      <Form.Label>
                                        Tax Type{" "}
                                        {/* <span className="pt-1 pl-1 req_validation">
                                        *
                                      </span> */}
                                      </Form.Label>
                                    </Col>
                                    <Col md="2">
                                      <Form.Group className="">
                                        <Select
                                          autoFocus="true"
                                          className="selectTo"
                                          onChange={(v) => {
                                            setFieldValue("tax_type", v);
                                          }}
                                          name="tax_type"
                                          // styles={customStyles}
                                          styles={ledger_select}
                                          options={taxOpt}
                                          value={values.tax_type}
                                          invalid={
                                            errors.tax_type ? true : false
                                          }
                                        //styles={customStyles}
                                        />
                                        <span className="text-danger">
                                          {errors.tax_type}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </div>

                        <Row
                          className="btm-button-row"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                          }}
                        >
                          <Col md="12" className="text-end pe-4">
                            <Button
                              className="newSubmitBtn"
                              type="submit"
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.myRef.current.handleSubmit();
                                }
                              }}
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary newCancelBtn ms-2"
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
                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgercreate",
                                      //     to: this.state.source.from_page,
                                      //     prop_data: {
                                      //       rows: this.state.source.rows,
                                      //       invoice_data: this.state.source
                                      //         .invoice_data,
                                      //       ...this.state.source,
                                      //     },
                                      //     isNewTab: false,
                                      //   });
                                      //   this.setState({ source: "" });
                                      // } else {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgercreate",
                                      //     to: "ledgerlist",
                                      //     isNewTab: false,
                                      //     isCancel: true,
                                      //   });
                                      // }
                                      // @vinit @ condition for prop_data for focusing previous tab
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data: this.state.source
                                                .invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgercreate",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
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
                                        // if (this.state.source != "") {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: this.state.source.from_page,
                                        //     prop_data: {
                                        //       rows: this.state.source.rows,
                                        //       invoice_data: this.state.source
                                        //         .invoice_data,
                                        //       ...this.state.source,
                                        //     },
                                        //     isNewTab: false,
                                        //   });
                                        //   this.setState({ source: "" });
                                        // } else {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: "ledgerlist",
                                        //     isNewTab: false,
                                        //     isCancel: true,
                                        //   });
                                        // }
                                        // @vinit @ condition for prop_data for focusing previous tab
                                        if (
                                          this.state.source &&
                                          this.state.source != ""
                                        ) {
                                          if (
                                            this.state.source.opType ===
                                            "create"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else if (
                                            this.state.source.opType === "edit"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data: this.state
                                                    .source.invoice_data,
                                                  ...this.state.source,
                                                },
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      },
                                      handleFailFn: () => { },
                                    },
                                    () => {
                                      console.warn("return_data");
                                    }
                                  );
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}
                  {/* duties and taxes end  */}
                  {/* Other start ***/}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "others" && (
                      <div className="duties">
                        <Row
                          className="btm-button-row"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                          }}
                        >
                          <Col md="12" className="text-end pe-4">
                            <Button
                              className="newSubmitBtn"
                              type="submit"
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.myRef.current.handleSubmit();
                                }
                              }}
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary newCancelBtn ms-2"
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
                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgercreate",
                                      //     to: this.state.source.from_page,
                                      //     prop_data: {
                                      //       rows: this.state.source.rows,
                                      //       invoice_data: this.state.source
                                      //         .invoice_data,
                                      //       ...this.state.source,
                                      //     },
                                      //     isNewTab: false,
                                      //   });
                                      //   this.setState({ source: "" });
                                      // } else {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgercreate",
                                      //     to: "ledgerlist",
                                      //     isNewTab: false,
                                      //     isCancel: true,
                                      //   });
                                      // }
                                      // @vinit @ condition for prop_data for focusing previous tab
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data: this.state.source
                                                .invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgercreate",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
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
                                        // if (this.state.source != "") {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: this.state.source.from_page,
                                        //     prop_data: {
                                        //       rows: this.state.source.rows,
                                        //       invoice_data: this.state.source
                                        //         .invoice_data,
                                        //       ...this.state.source,
                                        //     },
                                        //     isNewTab: false,
                                        //   });
                                        //   this.setState({ source: "" });
                                        // } else {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: "ledgerlist",
                                        //     isNewTab: false,
                                        //     isCancel: true,
                                        //   });
                                        // }
                                        // @vinit @ condition for prop_data for focusing previous tab
                                        if (
                                          this.state.source &&
                                          this.state.source != ""
                                        ) {
                                          if (
                                            this.state.source.opType ===
                                            "create"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else if (
                                            this.state.source.opType === "edit"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data: this.state
                                                    .source.invoice_data,
                                                  ...this.state.source,
                                                },
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      },
                                      handleFailFn: () => { },
                                    },
                                    () => {
                                      console.warn("return_data");
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
                    )}
                  {/* Other end */}
                  {/* Assets start  **/}
                  {values.underId &&
                    values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "assets" && (
                      <>
                        <Row
                          className="btm-button-row"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                          }}
                        >
                          <Col md="12" className="text-end pe-4">
                            <Button
                              className="newSubmitBtn"
                              type="submit"
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.myRef.current.handleSubmit();
                                }
                              }}
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary newCancelBtn ms-2"
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
                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgercreate",
                                      //     to: this.state.source.from_page,
                                      //     prop_data: {
                                      //       rows: this.state.source.rows,
                                      //       invoice_data: this.state.source
                                      //         .invoice_data,
                                      //       ...this.state.source,
                                      //     },
                                      //     isNewTab: false,
                                      //   });
                                      //   this.setState({ source: "" });
                                      // } else {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgercreate",
                                      //     to: "ledgerlist",
                                      //     isNewTab: false,
                                      //     isCancel: true,
                                      //   });
                                      // }
                                      // @vinit @ condition for prop_data for focusing previous tab
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data: this.state.source
                                                .invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgercreate",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
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
                                        // if (this.state.source != "") {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: this.state.source.from_page,
                                        //     prop_data: {
                                        //       rows: this.state.source.rows,
                                        //       invoice_data: this.state.source
                                        //         .invoice_data,
                                        //       ...this.state.source,
                                        //     },
                                        //     isNewTab: false,
                                        //   });
                                        //   this.setState({ source: "" });
                                        // } else {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgercreate",
                                        //     to: "ledgerlist",
                                        //     isNewTab: false,
                                        //     isCancel: true,
                                        //   });
                                        // }
                                        // @vinit @ condition for prop_data for focusing previous tab
                                        if (
                                          this.state.source &&
                                          this.state.source != ""
                                        ) {
                                          if (
                                            this.state.source.opType ===
                                            "create"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data: this.state.source
                                                  .invoice_data,
                                                ...this.state.source,
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else if (
                                            this.state.source.opType === "edit"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data: this.state
                                                    .source.invoice_data,
                                                  ...this.state.source,
                                                },
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgercreate",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgercreate",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      },
                                      handleFailFn: () => { },
                                    },
                                    () => {
                                      console.warn("return_data");
                                    }
                                  );
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}

                  {values.underId == "" && (
                    <Row
                      className="mx-0 btm-rows-btn"
                      style={{ position: "absolute", bottom: "0", right: "0" }}
                    >
                      <Col className="text-end">
                        <Button
                          variant="secondary newCancelBtn mx-2 me-2"
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
                                  // if (this.state.source != "") {
                                  //   eventBus.dispatch("page_change", {
                                  //     from: "ledgercreate",
                                  //     to: this.state.source.from_page,
                                  //     prop_data: {
                                  //       rows: this.state.source.rows,
                                  //       invoice_data: this.state.source
                                  //         .invoice_data,
                                  //       ...this.state.source,
                                  //     },
                                  //     isNewTab: false,
                                  //   });
                                  //   this.setState({ source: "" });
                                  // } else {
                                  //   eventBus.dispatch("page_change", {
                                  //     from: "ledgercreate",
                                  //     to: "ledgerlist",
                                  //     isNewTab: false,
                                  //     isCancel: true,
                                  //   });
                                  // }
                                  // @vinit @ condition for prop_data for focusing previous tab
                                  if (
                                    this.state.source &&
                                    this.state.source != ""
                                  ) {
                                    if (this.state.source.opType === "create") {
                                      eventBus.dispatch("page_change", {
                                        from: "ledgercreate",
                                        to: this.state.source.from_page,
                                        prop_data: {
                                          rows: this.state.source.rows,
                                          invoice_data: this.state.source
                                            .invoice_data,
                                          ...this.state.source,
                                        },
                                        isNewTab: false,
                                      });
                                      this.setState({ source: "" });
                                    } else if (
                                      this.state.source.opType === "edit"
                                    ) {
                                      eventBus.dispatch("page_change", {
                                        from: "ledgercreate",
                                        to: this.state.source.from_page,
                                        prop_data: {
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data: this.state.source
                                              .invoice_data,
                                            ...this.state.source,
                                          },
                                        },
                                        isNewTab: false,
                                      });
                                      this.setState({ source: "" });
                                    } else {
                                      eventBus.dispatch("page_change", {
                                        from: "ledgercreate",
                                        to: "ledgerlist",
                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                    }
                                  } else {
                                    eventBus.dispatch("page_change", {
                                      from: "ledgercreate",
                                      to: "ledgerlist",
                                      isNewTab: false,
                                      isCancel: true,
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
                                    // if (this.state.source != "") {
                                    //   eventBus.dispatch("page_change", {
                                    //     from: "ledgercreate",
                                    //     to: this.state.source.from_page,
                                    //     prop_data: {
                                    //       rows: this.state.source.rows,
                                    //       invoice_data: this.state.source
                                    //         .invoice_data,
                                    //       ...this.state.source,
                                    //     },
                                    //     isNewTab: false,
                                    //   });
                                    //   this.setState({ source: "" });
                                    // } else {
                                    //   eventBus.dispatch("page_change", {
                                    //     from: "ledgercreate",
                                    //     to: "ledgerlist",
                                    //     isNewTab: false,
                                    //     isCancel: true,
                                    //   });
                                    // }
                                    // @vinit @ condition for prop_data for focusing previous tab
                                    if (
                                      this.state.source &&
                                      this.state.source != ""
                                    ) {
                                      if (
                                        this.state.source.opType === "create"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgercreate",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data: this.state.source
                                              .invoice_data,
                                            ...this.state.source,
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else if (
                                        this.state.source.opType === "edit"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgercreate",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data: this.state.source
                                                .invoice_data,
                                              ...this.state.source,
                                            },
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgercreate",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    } else {
                                      eventBus.dispatch("page_change", {
                                        from: "ledgercreate",
                                        to: "ledgerlist",
                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                    }
                                  },
                                  handleFailFn: () => { },
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  )}
                  {/* Assets end  */}
                </Form>
              )}
            </Formik>
          </div>
          <Modal
            show={show}
            size="lg"
            className="groupnewmodal mt-5 mainmodal"
            onHide={() => this.handleModal(false)}
            dialogClassName="modal-400w"
            aria-labelledby="contained-modal-title-vcenter"
          //centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Associate Group
              </Modal.Title>
              <CloseButton
                variant="white"
                className="float-end"
                onClick={this.handleClose}
              //  onClick={() => this.handelPurchaseacModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className=" p-2 p-invoice-modal">
              <Formik
                innerRef={this.pincodeMdlRef}
                initialValues={initValue}
                enableReinitialize={true}
                validateOnChange={true}
                validateOnBlur={false}
                validationSchema={Yup.object().shape({
                  associates_group_name: Yup.string()
                    .trim()
                    .required("Account group name is required"),
                  underId: Yup.object().required("select Under"),
                  // bank_ifsc_code: Yup.string()
                  //   .trim()
                  //   .matches(ifsc_code_regex, "IFSC code is not valid"),
                  phone_no: Yup.string()
                    .trim()
                    .matches(MobileRegx, "Enter Valid Mobile No."),

                  pincode: Yup.string()
                    .trim()
                    .matches(pincodeReg, "pin code is not valid"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // debugger;
                  let requestData = new FormData();
                  requestData.append(
                    "associates_group_name",
                    values.associates_group_name
                  );
                  requestData.append(
                    "principle_id",
                    values.underId ? values.underId.principle_id : ""
                  );
                  requestData.append(
                    "sub_principle_id",
                    values.underId
                      ? values.underId.sub_principle_id
                        ? values.underId.sub_principle_id
                        : ""
                      : ""
                  );
                  requestData.append(
                    "under_prefix",
                    values.underId ? values.underId.under_prefix : ""
                  );
                  // requestData.append("underId");
                  if (values.associates_id == "") {
                    createAssociateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          this.lstUnders();
                          this.handleModal(false);
                          resetForm();
                          this.setInitValue();
                          this.lstAssociateGroups();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => { });
                  } else {
                    requestData.append("associates_id", values.associates_id);
                    updateAssociateGroup(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          ShowNotification("Success", res.message);
                          this.lstUnders();
                          this.handleModal(false);
                          resetForm();
                          this.setInitValue();
                          this.lstAssociateGroups();
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => { });
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
                      if (e.keyCode === 13) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="institute-head company-from">
                      <Row>
                        <Col md="4">
                          <Form.Group className="">
                            <Form.Label>
                              Under Id{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>{" "}
                            </Form.Label>
                            <Select
                              isClearable={true}
                              styles={customStyles}
                              className="selectTo"
                              onChange={(v) => {
                                setFieldValue("underId", v);
                              }}
                              name="underId"
                              options={undervalue}
                              value={values.underId}
                              invalid={errors.underId ? true : false}
                            />
                            <span className="text-danger">
                              {errors.underId}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="5">
                          <Form.Group>
                            <Form.Label>
                              Associate Group Name{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Associate Group Name"
                              name="associates_group_name"
                              id="associates_group_name"
                              onChange={handleChange}
                              value={values.associates_group_name}
                              isValid={
                                touched.associates_group_name &&
                                !errors.associates_group_name
                              }
                              isInvalid={!!errors.associates_group_name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.associates_group_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md="1">
                          <div>
                            <Form.Label style={{ color: "#fff" }}>
                              Blank
                              <br />
                            </Form.Label>
                          </div>
                          <Button
                            className="submit-btn "
                            type="submit"
                            onKeyDown={(e) => {
                              if (e.keyCode === 32) {
                                e.preventDefault();
                              } else if (e.keyCode === 13) {
                                this.pincodeMdlRef.current.handleSubmit();
                              }
                            }}
                          >
                            {values.associates_id == "" ? "Submit" : "Update"}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>

          {/* SalesMan master */}
          <Modal
            show={salesMaster}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="modal-style"
            onHide={() => this.setState({ salesMaster: false })}
            dialogClassName="modal-400w"
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Add SalesMan</Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.setState({ salesMaster: false })}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-invoice-modal p-0">
              <Formik
                // validateOnChange={false}
                // validateOnBlur={false}
                initialValues={initVal}
                // enableReinitialize={true}
                // validationSchema={Yup.object().shape({
                //   packageName: Yup.string()
                //     .nullable()
                //     .trim()
                //     // .matches(alphaNumericRex, "Enter alpha-numeric")
                //     .required("Package name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  MyNotifications.fire(
                    {
                      show: true,
                      icon: "confirm",
                      title: "Confirm",
                      msg: "Do you want to submit",
                      is_button_show: false,
                      is_timeout: false,
                      delay: 0,
                      handleSuccessFn: () => {
                        let requestData = new FormData();
                        requestData.append("firstName", values.first_name);
                        requestData.append("lastName", values.last_name);
                        requestData.append("middleName", values.middle_name);
                        requestData.append(
                          "mobileNumber",
                          values.mobile_number
                        );
                        requestData.append("pincode", values.pincode);
                        requestData.append("address", values.address);
                        requestData.append(
                          "dob",
                          values.dob
                            ? moment(values.dob, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )
                            : ""
                        );
                        createSalesmanMaster(requestData)
                          .then((response) => {
                            let res = response.data;
                            if (res.responseStatus == 200) {
                              // MyNotifications.fire({
                              //   show: true,
                              //   icon: "success",
                              //   title: "Success",
                              //   msg: res.message,
                              //   is_timeout: true,
                              //   delay: 1000,
                              // });
                              // resetForm();
                              this.setState({ salesMaster: false });
                              this.lstSalesmanMaster(true);
                              // this.getMstPackageOptions(true);
                              // this.pageReload();
                            } else if (res.responseStatus == 409) {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: res.message,
                                is_timeout: true,
                                delay: 1500,
                                // is_button_show: true,
                              });
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: res.message,
                                is_timeout: true,
                                delay: 1500,
                                // is_button_show: true,
                              });
                            }
                          })
                          .catch((error) => { });
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
                  setFieldValue,
                }) => (
                  <Form
                    onSubmit={handleSubmit}
                    className="form-style p-0"
                    autoComplete="off"
                  >
                    <Modal.Body
                      className=" border-0"
                      style={{ background: "#E6F2F8" }}
                    >
                      <Row>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>First Name</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  autoComplete="off"
                                  autoFocus={true}
                                  type="text"
                                  placeholder="First Name"
                                  name="first_name"
                                  id="first_name"
                                  className="text-box"
                                  value={values.first_name}
                                  onChange={handleChange}
                                  ref={(input) => {
                                    this.nameInput = input;
                                  }}
                                  onInput={(e) => {
                                    e.target.value = this.getDataCapitalisedSalesmaster(
                                      e.target.value
                                    );
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Middle Name</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  value={values.middle_name}
                                  type="text"
                                  placeholder="Middle Name"
                                  name="middle_name"
                                  className="text-box"
                                  id="middle_name"
                                  onChange={handleChange}
                                  onInput={(e) => {
                                    e.target.value = this.getDataCapitalisedSalesmaster(
                                      e.target.value
                                    );
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              {" "}
                              <Form.Label>Last Name</Form.Label>
                            </Col>
                            <Col lg={8}>
                              {" "}
                              <Form.Group>
                                <Form.Control
                                  value={values.last_name}
                                  type="text"
                                  autoComplete="off"
                                  placeholder="Last Name"
                                  name="last_name"
                                  className="text-box"
                                  id="last_name"
                                  onChange={handleChange}
                                  onInput={(e) => {
                                    e.target.value = this.getDataCapitalisedSalesmaster(
                                      e.target.value
                                    );
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              {" "}
                              <Form.Label>Mobile No. </Form.Label>
                            </Col>
                            <Col lg={8}>
                              {" "}
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  autoComplete="off"
                                  placeholder="Mobile Number"
                                  name="mobile_number"
                                  className="text-box"
                                  id="mobile_number"
                                  value={values.mobile_number}
                                  maxLength={10}
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
                                            .getElementById("mobile_number")
                                            .focus();
                                        }, 1000);
                                      }
                                    } else if (e.key === "Tab") {
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
                                            .getElementById("mobile_number")
                                            .focus();
                                        }, 1000);
                                      }
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Address </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  autoComplete="off"
                                  placeholder="Address"
                                  name="address"
                                  className="text-box"
                                  id="address"
                                  value={values.address}
                                  onChange={handleChange}
                                  onInput={(e) => {
                                    e.target.value = this.getDataCapitalisedSalesmaster(
                                      e.target.value
                                    );
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              {" "}
                              <Form.Label>Pincode </Form.Label>
                            </Col>
                            <Col lg={8}>
                              {" "}
                              <Form.Group>
                                <Form.Control
                                  autoComplete="off"
                                  type="text"
                                  placeholder="Pincode"
                                  name="pincode"
                                  className="text-box"
                                  id="pincode"
                                  value={values.pincode}
                                  maxLength={6}
                                  onChange={handleChange}
                                  onKeyPress={(e) => {
                                    OnlyEnterNumbers(e);
                                  }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value != "") {
                                      this.validatePincode(
                                        e.target.value,
                                        setFieldValue
                                      );
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col lg={4}>
                          <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Label>Date of Birth </Form.Label>
                            </Col>
                            <Col lg={5} md={5} sm={5} xs={5}>
                              <Form.Group>
                                <MyTextDatePicker
                                  style={{ borderRadius: "none" }}
                                  className="form-control px-1 text-box"
                                  name="dob"
                                  autoComplete="off"
                                  id="dob"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.dob}
                                  onChange={handleChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button className="successbtn-style" type="submit">
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn ms-2"
                        // className="mdl-cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ salesMaster: false });
                        }}
                      >
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
          {/* Area master */}
          <Modal
            show={areaMaster}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="modal-style"
            onHide={() => this.setState({ areaMaster: false })}
            dialogClassName="modal-400w"
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Add Area </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.setState({ areaMaster: false })}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-invoice-modal p-0">
              <Formik
                // validateOnChange={false}
                // validateOnBlur={false}
                initialValues={initValArea}
                // enableReinitialize={true}
                // validationSchema={Yup.object().shape({
                //   packageName: Yup.string()
                //     .nullable()
                //     .trim()
                //     // .matches(alphaNumericRex, "Enter alpha-numeric")
                //     .required("Package name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  MyNotifications.fire(
                    {
                      show: true,
                      icon: "confirm",
                      title: "Confirm",
                      msg: "Do you want to submit",
                      is_button_show: false,
                      is_timeout: false,
                      delay: 0,
                      handleSuccessFn: () => {
                        let requestData = new FormData();
                        requestData.append("areaName", values.area_name);
                        requestData.append("areaCode", values.area_code);
                        requestData.append("pincode", values.pincode);
                        createAreaMaster(requestData)
                          .then((response) => {
                            let res = response.data;
                            if (res.responseStatus == 200) {
                              // MyNotifications.fire({
                              //   show: true,
                              //   icon: "success",
                              //   title: "Success",
                              //   msg: res.message,
                              //   is_timeout: true,
                              //   delay: 1000,
                              // });
                              // resetForm();
                              this.lstAreaMaster(true);
                              this.setState({ areaMaster: false });
                              // this.getMstPackageOptions(true);
                              // this.pageReload();
                            } else if (res.responseStatus == 409) {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: res.message,
                                is_timeout: true,
                                delay: 1500,
                                // is_button_show: true,
                              });
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: res.message,
                                is_timeout: true,
                                delay: 1500,
                                // is_button_show: true,
                              });
                            }
                          })
                          .catch((error) => { });
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
                  setFieldValue,
                }) => (
                  <Form
                    onSubmit={handleSubmit}
                    className="form-style p-0"
                    autoComplete="off"
                  >
                    <Modal.Body
                      className=" border-0"
                      style={{ background: "#E6F2F8" }}
                    >
                      <Row>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Area Name</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  autoComplete="off"
                                  autoFocus={true}
                                  type="text"
                                  placeholder="Area Name"
                                  name="area_name"
                                  id="area_name"
                                  onInput={(e) => {
                                    e.target.value = this.getDataCapitalisedArea(
                                      e.target.value
                                    );
                                  }}
                                  ref={(input) => {
                                    this.nameInput = input;
                                  }}
                                  value={values.area_name}
                                  className="text-box"
                                  onChange={handleChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Area Code</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Area Code"
                                  name="area_code"
                                  className="text-box"
                                  id="area_code"
                                  onChange={handleChange}
                                  value={values.area_code}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4}>
                          <Row>
                            <Col lg={4}>
                              {" "}
                              <Form.Label>Pincode</Form.Label>
                            </Col>
                            <Col lg={8}>
                              {" "}
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Pincode"
                                  name="pincode"
                                  className="text-box"
                                  id="pincode"
                                  onChange={handleChange}
                                  value={values.pincode}
                                  maxLength={6}
                                  onKeyPress={(e) => {
                                    OnlyEnterNumbers(e);
                                  }}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value != "") {
                                      this.validatePincode(
                                        e.target.value,
                                        setFieldValue
                                      );
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button className="successbtn-style" type="submit">
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn ms-2"
                        // className="mdl-cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ areaMaster: false });
                        }}
                      >
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </div>
        {/* Opening balance modal */}
        <Modal
          show={opnBalModalShow}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="opening-balance-style"
          onHide={() => {
            this.setState({ index: -1, batchList: [] }, () => {
              this.setState({ opnBalModalShow: false, openingBal: 0 });
            });
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="name-header">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="name-title"
            >
              Opening Balance
            </Modal.Title>

            <CloseButton
              className="pull-right"
              onClick={() => {
                setTimeout(() => {
                  this.selectRefBalanceType.current.focus();
                }, 1000);
                this.setState({ index: -1 }, () => {
                  this.setState({
                    opnBalModalShow: false,
                    openingBal: 0,
                    paidAmt: 0,
                    balanceAmt: 0,
                  });
                });
              }}
            />
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="">
              <div className="m-0 mb-2">
                <Formik
                  innerRef={this.openingBalRef}
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={balanceInitVal}
                  onSubmit={(values) => {
                    let errorArray = [];
                    this.setState({ errorArrayBorder: errorArray }, () => {
                      if (allEqual(errorArray)) {
                        console.log("values", values);
                        this.addOpeningBalRow(values);
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
                    <Form onSubmit={handleSubmit} noValidate autoComplete="off">
                      <div className="mb-2">
                        <Row>

                          <div className="openingBalance">
                            <Row className="mx-0">
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="tbl-color"
                              >
                                <Table className="colored_label mb-0 ">
                                  <tbody
                                    style={{ borderBottom: "0px transparent" }}
                                  >
                                    <tr>
                                      <td>Opening Balance:</td>
                                      <td>
                                        {" "}
                                        <p className="colored_sub_text mb-0">
                                          {openingBal}
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="tbl-color"
                              >
                                <Table className="colored_label mb-0">
                                  <tbody
                                    style={{ borderBottom: "0px transparent" }}
                                  >
                                    <tr>
                                      <td>Sum of Balance:</td>
                                      <td>
                                        {" "}
                                        <p className="colored_sub_text mb-0">
                                          {/* {values ? values.b_no : ""} */}
                                          {this.finalBillpaidBal()}
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="tbl-color"
                              >
                                <Table className="colored_label mb-0 ">
                                  <tbody
                                    style={{ borderBottom: "0px transparent" }}
                                  >
                                    <tr>
                                      <td>Remaining Amt.:</td>
                                      <td>
                                        {" "}
                                        <p className="colored_sub_text mb-0">
                                          {/* {values ? values.b_rate : ""} */}
                                          {/* {isNaN(values.b_rate)
                                    ? INRformat.format(0)
                                    : INRformat.format(values.b_rate)} */}
                                          {this.finalRemaningAmt()}
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                          </div>
                          <div>
                            <div className="div-text">
                              <Row>
                                <Col lg={3}>
                                  <Row>
                                    <Col lg={4}>
                                      <Form.Label>Invoice No</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <Form.Group>
                                        <Form.Control
                                          autoComplete="off"
                                          type="text"
                                          placeholder="Invoice No."
                                          name="invoice_no"
                                          id="invoice_no"
                                          value={values.invoice_no}
                                          onChange={(e) => {
                                            e.preventDefault();
                                            let v = e.target.value;
                                            setFieldValue("invoice_no", v);

                                          }} onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          className={`${values.invoice_no == "" &&
                                            errorArrayBorder[0] == "v"
                                            ? "border border-danger open-text-box text-end"
                                            : "open-text-box text-end "
                                            }`}
                                          onBlur={(e) => {
                                            e.preventDefault();
                                            if (e.target.value.trim()) {
                                              this.setErrorBorder(
                                                0,
                                                "",
                                                "errorArrayBorder"
                                              );
                                              // this.calculateCosting();
                                            } else {
                                              this.setErrorBorder(
                                                0,
                                                "v",
                                                "errorArrayBorder"
                                              );
                                              // this.calculateCosting();
                                            }
                                          }}
                                          disabled={
                                            parseInt(values.openingBal) ==
                                            parseInt(values.paidBal)
                                          }
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            )
                                              e.preventDefault();



                                          }}
                                        />
                                        <span className="text-danger errormsg">
                                          {errors.invoice_no}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3}>
                                  <Row>
                                    <Col lg={4}>
                                      <Form.Label>Invoice Date</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <MyTextDatePicker
                                        id="invoice_date"
                                        name="invoice_date"
                                        placeholder="DD/MM/YYYY"
                                        className="open-date"
                                        value={values.invoice_date}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          }
                                          if (e.shiftKey && e.key === "Tab") {
                                            let datchco = e.target.value.trim();
                                            console.log("datchco", datchco);
                                            let checkdate = moment(
                                              e.target.value
                                            ).format("DD/MM/YYYY");
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
                                                msg:
                                                  "Please Enter Correct Date. ",
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              setTimeout(() => {
                                                document
                                                  .getElementById(
                                                    "invoice_date"
                                                  )
                                                  .focus();
                                              }, 1000);
                                            }
                                            // @prathmesh @date validation start
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
                                                let curdate = new Date();

                                                let mfgDate = new Date(
                                                  moment(
                                                    e.target.value,
                                                    "DD/MM/YYYY"
                                                  ).toDate()
                                                );
                                                let curdatetime = curdate.getTime();
                                                let mfgDateTime = mfgDate.getTime();
                                                if (
                                                  curdatetime >= mfgDateTime
                                                ) {
                                                  setFieldValue(
                                                    "invoice_date",
                                                    e.target.value
                                                  );
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg:
                                                      "Invoice Date Should not be Greater than todays date",
                                                    is_timeout: true,
                                                    delay: 1500,
                                                  });
                                                  setTimeout(() => {
                                                    document
                                                      .getElementById(
                                                        "invoice_date"
                                                      )
                                                      .focus();
                                                  }, 1000);
                                                }
                                              }
                                              // else {
                                              //   MyNotifications.fire({
                                              //     show: true,
                                              //     icon: "error",
                                              //     title: "Error",
                                              //     msg: "Invalid date",
                                              //     is_timeout: true,
                                              //     delay: 1500,
                                              //   });
                                              //   setTimeout(() => {
                                              //     document
                                              //       .getElementById(
                                              //         "invoice_date"
                                              //       )
                                              //       .focus();
                                              //   }, 1000);
                                              // }
                                            }
                                          } else if (e.key === "Tab") {
                                            let datchco = e.target.value.trim();
                                            console.log("datchco", datchco);
                                            let checkdate = moment(
                                              e.target.value
                                            ).format("DD/MM/YYYY");
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
                                                msg:
                                                  "Please Enter Correct Date. ",
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              setTimeout(() => {
                                                document
                                                  .getElementById(
                                                    "invoice_date"
                                                  )
                                                  .focus();
                                              }, 1000);
                                            }
                                            // @prathmesh @date validation start
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
                                                let curdate = new Date();

                                                let mfgDate = new Date(
                                                  moment(
                                                    e.target.value,
                                                    "DD/MM/YYYY"
                                                  ).toDate()
                                                );
                                                let curdatetime = curdate.getTime();
                                                let mfgDateTime = mfgDate.getTime();
                                                if (
                                                  curdatetime >= mfgDateTime
                                                ) {
                                                  setFieldValue(
                                                    "invoice_date",
                                                    e.target.value
                                                  );
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg:
                                                      "Invoice Date Should not be Greater than todays date",
                                                    is_timeout: true,
                                                    delay: 1500,
                                                  });
                                                  setTimeout(() => {
                                                    document
                                                      .getElementById(
                                                        "invoice_date"
                                                      )
                                                      .focus();
                                                  }, 1000);
                                                }
                                              }
                                              // else {
                                              //   MyNotifications.fire({
                                              //     show: true,
                                              //     icon: "error",
                                              //     title: "Error",
                                              //     msg: "Invalid date",
                                              //     is_timeout: true,
                                              //     delay: 1500,
                                              //   });
                                              //   setTimeout(() => {
                                              //     document
                                              //       .getElementById(
                                              //         "invoice_date"
                                              //       )
                                              //       .focus();
                                              //   }, 1000);
                                              // }
                                            }
                                          }
                                          this.duplicateInvoiceNo(e.target.value, values.invoice_no);

                                        }}
                                        onBlur={(e) => {
                                          console.log("e ", e);
                                          console.log(
                                            "e.target.value ",
                                            e.target.value
                                          );
                                          if (
                                            e.target.value != null &&
                                            e.target.value != ""
                                          ) {
                                            setFieldValue(
                                              "invoice_date",
                                              e.target.value
                                            );
                                            // this.checkExpiryDate(
                                            //   setFieldValue,
                                            //   e.target.value,
                                            //   "invoice_date"
                                            // );
                                          } else {
                                            // setFieldValue(
                                            //   "invoice_date",
                                            //   ""
                                            // );
                                          }
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3} className="mt-1">
                                  <Row>
                                    <Col lg={5}>
                                      <Form.Label>Due Date</Form.Label>
                                    </Col>
                                    <Col lg={7}>
                                      <MyTextDatePicker
                                        id="due_date"
                                        name="due_date"
                                        placeholder="DD/MM/YYYY"
                                        className="open-date"
                                        onChange={handleChange}
                                        value={values.due_date}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          }

                                          if (e.shiftKey && e.key === "Tab") {
                                            let datchco = e.target.value.trim();
                                            console.log("datchco", datchco);
                                            let checkdate = moment(
                                              e.target.value
                                            ).format("DD/MM/YYYY");
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
                                                msg:
                                                  "Please Enter Correct Date. ",
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              setTimeout(() => {
                                                document
                                                  .getElementById("due_date")
                                                  .focus();
                                              }, 1000);
                                            }
                                            // @prathmesh @date validation start
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
                                                let mfgDate = "";
                                                if (values.invoice_date != "") {
                                                  mfgDate = new Date(
                                                    moment(
                                                      values.invoice_date,
                                                      " DD-MM-yyyy"
                                                    ).toDate()
                                                  );
                                                  // let currentDate = new Date();
                                                  // let curdatetime = currentDate.getTime();
                                                  let expDate = new Date(
                                                    moment(
                                                      e.target.value,
                                                      "DD/MM/YYYY"
                                                    ).toDate()
                                                  );
                                                  if (
                                                    mfgDate.getTime() <
                                                    expDate.getTime()
                                                    // && curdatetime <= expDate.getTime()
                                                  ) {
                                                    setFieldValue(
                                                      "due_date",
                                                      e.target.value
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg:
                                                        "Expiry date should be greater Invoice Date",
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                    setTimeout(() => {
                                                      document
                                                        .getElementById(
                                                          "due_date"
                                                        )
                                                        .focus();
                                                    }, 1000);
                                                  }
                                                } else {
                                                  setFieldValue(
                                                    "due_date",
                                                    e.target.value
                                                  );
                                                }
                                              }
                                              // else {
                                              //   MyNotifications.fire({
                                              //     show: true,
                                              //     icon: "error",
                                              //     title: "Error",
                                              //     msg: "Invalid date",
                                              //     is_timeout: true,
                                              //     delay: 1500,
                                              //   });
                                              //   setTimeout(() => {
                                              //     document
                                              //       .getElementById("due_date")
                                              //       .focus();
                                              //   }, 1000);
                                              // }
                                            }
                                          } else if (e.key === "Tab") {
                                            let datchco = e.target.value.trim();
                                            console.log("datchco", datchco);
                                            let checkdate = moment(
                                              e.target.value
                                            ).format("DD/MM/YYYY");
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
                                                msg:
                                                  "Please Enter Correct Date. ",
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              setTimeout(() => {
                                                document
                                                  .getElementById("due_date")
                                                  .focus();
                                              }, 1000);
                                            }
                                            // @prathmesh @date validation start
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
                                                let mfgDate = "";
                                                if (values.invoice_date != "") {
                                                  mfgDate = new Date(
                                                    moment(
                                                      values.invoice_date,
                                                      " DD-MM-yyyy"
                                                    ).toDate()
                                                  );
                                                  // let currentDate = new Date();
                                                  // let curdatetime = currentDate.getTime();
                                                  let expDate = new Date(
                                                    moment(
                                                      e.target.value,
                                                      "DD/MM/YYYY"
                                                    ).toDate()
                                                  );
                                                  if (
                                                    mfgDate.getTime() <
                                                    expDate.getTime()
                                                    // && curdatetime <= expDate.getTime()
                                                  ) {
                                                    setFieldValue(
                                                      "due_date",
                                                      e.target.value
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg:
                                                        "Expiry date should be greater Invoice Date",
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                    setTimeout(() => {
                                                      document
                                                        .getElementById(
                                                          "due_date"
                                                        )
                                                        .focus();
                                                    }, 1000);
                                                  }
                                                } else {
                                                  setFieldValue(
                                                    "due_date",
                                                    e.target.value
                                                  );
                                                }
                                              }
                                              // else {
                                              //   MyNotifications.fire({
                                              //     show: true,
                                              //     icon: "error",
                                              //     title: "Error",
                                              //     msg: "Invalid date",
                                              //     is_timeout: true,
                                              //     delay: 1500,
                                              //   });
                                              //   setTimeout(() => {
                                              //     document
                                              //       .getElementById("due_date")
                                              //       .focus();
                                              //   }, 1000);
                                              // }
                                            }
                                          }
                                        }}
                                        onBlur={(e) => {
                                          console.log("e ", e);
                                          console.log(
                                            "e.target.value ",
                                            e.target.value
                                          );
                                          if (
                                            e.target.value != null &&
                                            e.target.value != ""
                                          ) {
                                            setFieldValue(
                                              "due_date",
                                              e.target.value
                                            );
                                          } else {
                                          }
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3} className="mt-1">
                                  <Row>
                                    <Col lg={4}>
                                      <Form.Label>Due Days</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <Form.Group>
                                        <Form.Control
                                          autoComplete="off"
                                          // autoFocus="true"
                                          type="text"
                                          placeholder="0"
                                          name="due_days"
                                          id="due_days"
                                          onChange={handleChange}
                                          value={values.due_days}
                                          // className="text-box"
                                          className={`${values.due_days == "" &&
                                            errorArrayBorder[1] == "v"
                                            ? "border border-danger open-text-box text-end"
                                            : "open-text-box text-end"
                                            }`}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            )
                                              e.preventDefault();
                                          }}
                                        />
                                        <span className="text-danger errormsg">
                                          {errors.due_days}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mb-1">
                                <Col lg={3} className="mt-1">
                                  <Row>
                                    <Col lg={4}>
                                      <Form.Label>Bill Amount</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <Form.Group>
                                        <Form.Control
                                          autoComplete="off"
                                          // autoFocus="true"
                                          type="text"
                                          placeholder="0"
                                          name="bill_amt"
                                          id="bill_amt"
                                          // onChange={handleChange}
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            console.log(
                                              "bill amt v-----------",
                                              v
                                            );

                                            this.setState({
                                              invoiceBillAmt: v,
                                            });
                                            console.log({ invoiceBillAmt });
                                            setFieldValue("bill_amt", v);
                                          }}
                                          // onBlur={(e) => {
                                          //   if (e.target.value != 0) {
                                          //     this.setState({
                                          //       invoiceBillAmt: e.target.value,
                                          //     });
                                          //     console.log({ invoiceBillAmt });
                                          //   }
                                          // }}
                                          value={values.bill_amt}
                                          // className="text-box"
                                          className={`${values.bill_amt == "" &&
                                            errorArrayBorder[1] == "v"
                                            ? "border border-danger open-text-box text-end"
                                            : "open-text-box text-end"
                                            }`}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            )
                                              e.preventDefault();
                                          }}
                                        />
                                        <span className="text-danger errormsg">
                                          {errors.bill_amt}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3} className="mt-1">
                                  <Row>
                                    <Col lg={4}>
                                      <Form.Label>Paid Amount</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <Form.Group>
                                        <Form.Control
                                          autoComplete="off"
                                          // autoFocus="true"
                                          type="text"
                                          placeholder="0"
                                          name="invoice_paid_amt"
                                          id="invoice_paid_amt"
                                          className="open-text-box"
                                          // onChange={handleChange}
                                          onChange={(e) => {
                                            e.preventDefault();
                                            let v = e.target.value;
                                            console.log(
                                              "paid amt v-----------",
                                              v
                                            );

                                            this.setState({
                                              invoicePaidBal: v,
                                            });
                                            setFieldValue(
                                              "invoice_paid_amt",
                                              v
                                            );
                                          }}
                                          // onBlur={(e) => {
                                          //   if (e.target.value != 0) {
                                          //     this.setState({
                                          //       invoicePaidBal: e.target.value,
                                          //     });
                                          //   }
                                          //   // this.finalBillpaidBal();
                                          // }}
                                          value={values.invoice_paid_amt}
                                        />
                                        <span className="text-danger errormsg">
                                          {errors.invoice_paid_amt}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3} className="mt-1">
                                  <Row>
                                    <Col lg={5}>
                                      <Form.Label>Balance Amount</Form.Label>
                                    </Col>
                                    <Col lg={7}>
                                      <Form.Group>
                                        <Form.Control
                                          autoComplete="off"
                                          // autoFocus="true"
                                          type="text"
                                          placeholder="0"
                                          name="invoice_bal_amt"
                                          id="invoice_bal_amt"
                                          // onBlur={(e) => {
                                          //   e.preventDefault();
                                          //   // let v = this.finalInvoiceRemainingAmt();
                                          //   let v = e.target.value;
                                          //   setFieldValue("invoice_bal_amt", v);
                                          //   console.log(
                                          //     "v===============>>>>>>>",
                                          //     v
                                          //   );
                                          //   if (v != "") {
                                          //     this.setState({ invoiceBalAmt: v });
                                          //   } else {
                                          //     this.setState({ invoiceBalAmt: 0 });
                                          //   }
                                          // }}
                                          value={this.finalInvoiceRemainingAmt()}
                                          // className="text-box"
                                          className={`${values.invoice_bal_amt == "" &&
                                            errorArrayBorder[1] == "v"
                                            ? "border border-danger open-text-box text-end"
                                            : "open-text-box text-end"
                                            }`}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            )
                                              e.preventDefault();
                                          }}
                                        />
                                        <span className="text-danger errormsg">
                                          {errors.invoice_bal_amt}
                                        </span>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3} className="mt-1">
                                  <Row>
                                    <Col lg={4}>
                                      <Form.Label>Type</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <Form.Group className="">
                                        <Select
                                          className="selectTo"
                                          styles={ledger_select}
                                          onChange={(e) => {
                                            setFieldValue("type", e);
                                          }}
                                          options={balanceType}
                                          name="type"
                                          // className="select-text-box"
                                          value={values.type}
                                        />
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </Row>
                        <Row>
                          <Col md="12" className="btn_align m-2 pe-4">
                            <Button
                              className="submit-btn successbtn-style me-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                this.openingBalRef.current.handleSubmit();
                              }}
                              onKeyDown={(e) => {
                                console.warn("e.keyCode ", e.keyCode);
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  e.preventDefault();
                                  this.openingBalRef.current.handleSubmit();
                                }
                              }}
                            >
                              {values.id == "" ? "Add" : "Update"}
                            </Button>
                            <Button
                              variant="secondary cancel-btn"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                resetForm();
                                this.clearOpeningBalData();
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.clearOpeningBalData();
                                }
                              }}
                              className="ms-2"
                            >
                              Clear
                            </Button>
                          </Col>
                        </Row>
                        <div className="openingBalance-table">
                          <Table
                            // striped
                            // bordered
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th>Invoice No</th>
                                <th>Invoice Amt.</th>
                                <th>Type</th>
                                <th>Bill Date</th>
                                <th>Paid Amt.</th>
                                <th>Balance </th>
                                <th>Due Date</th>
                                <th>Due Days</th>
                                <th>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {balanceList &&
                                balanceList.map((v, i) => {
                                  return (
                                    <tr
                                      onDoubleClick={(e) => {
                                        this.openingBalanceUpdate(
                                          v,
                                          setFieldValue
                                        );
                                        // this.finalBillpaidBal();
                                      }}
                                    >
                                      <td>{v.invoice_no}</td>
                                      <td>{v.bill_amt}</td>
                                      <td>{v.type.label}</td>
                                      <td>{v.invoice_date}</td>
                                      <td>{v.invoice_paid_amt}</td>
                                      <td>{v.invoice_bal_amt}</td>
                                      <td>{v.due_date}</td>
                                      <td>{v.due_days}</td>
                                      <td className="text-center">
                                        <img
                                          src={Delete}
                                          alt=""
                                          className="opendelete"
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            this.removeBalanceList(i);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col md="12 mb-2" className="btn_align">
                <Button
                  className="submit-btn successbtn-style me-2"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ opnBalModalShow: false });
                  }}
                  disabled={
                    parseInt(this.state.openingBal) ==
                      this.finalBillpaidBal() ? false : true
                  }

                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      this.setState({
                        opnBalModalShow: false,
                      });
                    }
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="secondary cancel-btn ms-2"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ balanceList: [], opnBalModalShow: false });
                    setTimeout(() => {
                      this.selectRefBalanceType.current.focus();
                    }, 1000);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      this.setState({
                        balanceList: [],
                        opnBalModalShow: false,
                      });
                    }
                  }}
                  className="ms-2"
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </div >
    );
  }
}

// {/* <style>
//   {`
//     input[type="text"][disabled] {
//       background: #e9ecef !important;
//     }
//   `}
// </style> */}

const mapStateToProps = ({ userPermissions, userControl }) => {
  return { userPermissions, userControl };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
      setUserControl,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(LedgerCreate);
