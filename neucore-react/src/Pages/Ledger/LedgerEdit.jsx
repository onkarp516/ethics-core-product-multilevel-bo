import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  ButtonGroup,
  FormControl,
  Table,
  Tabs,
  Card,
  Tab,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { Formik } from "formik";
import delete_icon from "@/assets/images/delete_icon3.png";

import Select from "react-select";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import phone from "@/assets/images/phone_icon.png";
import whatsapp from "@/assets/images/whatsapp_icon.png";
import Delete from "@/assets/images/delete.png";
import * as Yup from "yup";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Add from "@/assets/images/add_blue_circle@3x.png";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import {
  getUnderList,
  getBalancingMethods,
  getIndianState,
  getIndiaCountry,
  getLedgersById,
  editLedger,
  getGSTTypes,
  getValidateLedgermMaster,
  getoutletappConfig,
  getAreaMasterOutlet,
  getSalesmanMasterOutlet,
  // removeInstance,
  validate_pincode,
  createSalesmanMaster,
  createAreaMaster,
} from "@/services/api_functions";
import moment, { deprecationHandler } from "moment";
import {
  ShowNotification,
  getRandomIntInclusive,
  getSelectValue,
  eventBus,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  ifsc_code_regex,
  pan,
  MyNotifications,
  MobileRegx,
  GSTINREX,
  pincodeReg,
  EMAILREGEXP,
  bankAccountNumber,
  ledger_select,
  alphaNumericRegExp,
  MOBILEREGEXP,
  PINCODEREGEXP,
  alphaRegExp,
  getValue,
  OnlyAlphabets,
  OnlyEnterAmount,
  OnlyEnterNumbers,
  MyTextDatePicker,
  isUserControl,
  allEqual,
  getSelectLabel,
  handleDataCapitalised,
  handlesetFieldValue,
  // addDataLock,
  // removeDataLock,
  // checkDataLockExist
} from "@/helpers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser as faSolidUser,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const taxOpt = [
  { value: "central_tax", label: "Central Tax" },
  { value: "state_tax", label: "State Tax" },
  { value: "integrated_tax", label: "Integrated Tax" },
];
const applicable_from_options = [
  { label: "Credit Bill Date", value: "creditBill" },
  { label: "Lr Bill Date", value: "lrBill" },
];

const licencesType = [
  // { label: "Licence No", value: 1 },
  { label: "FSSAI No", value: "fssai_number", slug_name: "fssai_number" },
  { label: "Drug License No", value: "drug_number", slug_name: "drug_number" },
  { label: "Mfg. Licence No", value: "mfg_number", slug_name: "mfg_number" },
  // more options...
];

const balanceType = [
  { label: "Dr", value: "1" },
  { label: "Cr", value: "2" },
  // more options...
];

const ledger_options = [
  { label: "Public", value: false },
  { label: "Private", value: true },
  // more options...
];

const sales_rate_options = [
  { label: "Sales Rate A", value: 1 },
  { label: "Sales Rate B", value: 2 },
  { label: "Sales Rate C", value: 3 },
];

const ledger_type_options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
  // more options...
];
const Balancing_method_options = [
  { label: "Bill Date", value: "billDate" },
  { label: "Delivery Date", value: "deliveryDate" },
  // more options...
];

class LedgerEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.pincodeMdlRef = React.createRef();
    this.openingBalRef = React.createRef();
    this.pincodeRef = React.createRef();
    this.invoiceRef = React.createRef();
    this.selectRefSalesRate = React.createRef();
    this.SelectRefTaxation = React.createRef();
    this.selectRefTaxType = React.createRef();
    this.selectRefApplForm = React.createRef();
    this.selectRefdistrict = React.createRef();
    this.selectRefSalesMan = React.createRef();
    this.selectRefArea = React.createRef();
    this.typeRef = React.createRef();

    this.state = {
      salesMaster: false,
      salesmanId1: "",
      areaMaster: false,
      principleList: [],
      undervalue: [],
      balancingOpt: [],
      stateOpt: [],
      countryOpt: [],
      edit_data: "",
      GSTTypeOpt: [],
      filter_data: "",
      deptRList: [],
      licensesList: [],
      gstList: [],
      rList: [],
      rSList: [],
      rBList: [],
      rOList: [],
      bankList: [],
      deptList: [],
      shippingList: [],
      billingList: [],
      invoceRemAmt: 0,
      removeGstList: [],
      removeDeptList: [],
      removeShippingList: [],
      removeBillingList: [],
      removebankList: [],
      removelicensesList: [],
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
        opening_balance: 0,
        ledger_name: "",
        stateId: "",
        areaId: "",
        isGST: "",
        gstin: "",
        is_private: "",
      },

      initValS: {
        id: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        mobile_number: "",
        address: "",
        pincode: "",
        dob: "",
      },
      initVal: {
        id: "",
        bId: 0,
        district: "",
        shipping_address: "",
        ledger_name: "",
        underId: "",
        associates_id: "",
        associates_group_name: "",
        supplier_code: getRandomIntInclusive(1, 1000),
        opening_balance: 0,
        is_private: "false",
        gst_detail_id: "",
        shipping_detail_id: "",
        billing_details_id: "",
        depart_details_id: "",
        salesmanId: "",
        areaId: "",
        stateId: "",
        isGST: "",
        gstin: "",
      },
      initValArea: {
        id: "",
        area_name: "",
        area_code: "",
        pincode: "",
      },
      isEditDataSet: false,
      source: "",
      areaLst: [],
      salesmanLst: [],
      balanceInitVal: {
        id: 0,
        invoice_no: "",
        invoice_date: "",
        due_date: "",
        bill_amt: "",
        type: "",
        invoice_paid_amt: "",
        invoice_bal_amt: 0,
        due_days: "",
      },

      errorArrayBorder: "",
      balanceList: [],
      removeBalanceList: [],
      openingBal: 0,
      invoiceBillAmt: 0,
      invoicePaidBal: 0,
      invoiceBalAmt: 0,
      opnBalModalShow: false,
      // datalockSlug: ""
    };
    this.selectRef = React.createRef();
    this.selectRefBalanceType = React.createRef();
    this.selectRefGST = React.createRef();
    this.gstRef = React.createRef();
    this.addressRef = React.createRef();
    this.nameRef = React.createRef();
    this.deptRef = React.createRef();
    this.bankRef = React.createRef();
    this.shippingRef = React.createRef();
    this.licenseTypeRef = React.createRef();
  }
  listGSTTypes = () => {
    getGSTTypes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.map((v) => {
            return { label: v.gstType, value: v.id };
          });
          const { initValue } = this.state;

          let initObj = initValue;

          this.setState({ initValue: initObj, GSTTypeOpt: opt }, () => {
            initObj["registraion_type"] = opt[0];
          });
        }
      })
      .catch((error) => {});
  };

  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let Opt = res.responseObject.map((v, i) => {
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
        console.log("error", error);
        this.setState({ undervalue: [] });
      });
  };
  lstBalancingMethods = () => {
    getBalancingMethods()
      .then((response) => {
        let res = response.data;
        let opt = [];
        if (res.responseStatus == 200) {
          opt = res.response.map((v, i) => {
            return { value: v.balancing_id, label: v.balance_method };
          });
          const { initVal } = this.state;

          let initObj = initVal;
          initObj["opening_balancing_method"] = opt[0];
          this.setState({ initVal: initObj, balancingOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstState = () => {
    getIndianState()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v) => {
            return { label: v.stateName, value: v.id };
          });
          this.setState({ stateOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstCountry = () => {
    getIndiaCountry()
      .then((response) => {
        let opt = [];
        let res = { label: response.data.name, value: response.data.id };
        opt.push(res);
        this.setState({ countryOpt: opt });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setInitVal = () => {
    let initVal = {
      id: "",
      associates_id: "",
      associates_group_name: "",
      ledger_name: "",
      underId: "",
      district: "",
      shipping_address: "",
      stateId: "",
      isGST: "",
      gstin: "",
      supplier_code: getRandomIntInclusive(1, 1000),
      opening_balance: 0,
      is_private: "false",
    };
    this.setState({ initVal: initVal });
  };
  ValidateLedgermMaster = (
    underId,
    principle_id,
    principle_group_id,
    ledger_name,
    supplier_code
  ) => {
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
              is_button_show: true,
            });
          }
        }
      })
      .catch((error) => {});
  };
  getLedgerDetails = () => {
    let { edit_data, undervalue, GSTTypeOpt, areaLst, salesmanLst } =
      this.state;
    let formData = new FormData();
    formData.append("id", edit_data);

    getLedgersById(formData)
      .then((response) => {
        let data = response.data;
        let { salesmanId1 } = this.state;
        let gstdetails = [];
        let deptList = [];
        let shippingDetails = [];
        let billingDetails = [];
        let bankDetails = [];
        let licensesDetails = [];
        let opnBalanceList = [];
        // console.log("salesmanId", data.response.salesmanId  );
        this.setState({ salesmanId1: data.response.salesmanId });

        let initVal = {
          id: "",
          ledger_name: "",
          district: "",
          shipping_address: "",
          underId: "",
          supplier_code: getRandomIntInclusive(1, 1000),
          is_private: ledger_options[0],
          stateId: "",
          isGST: "",
          gstin: "",
        };
        if (data.responseStatus == 200) {
          data = data.response;
          let underOptID;
          if (data.under_prefix_separator == "P") {
            underOptID = getSelectValue(undervalue, data.principle_id);
          } else if (data.under_prefix_separator == "PG") {
            underOptID = getSelectValue(
              undervalue,
              data.principle_id + "_" + data.sub_principle_id
            );
          } else if (data.under_prefix_separator == "AG") {
            underOptID = getSelectValue(
              undervalue,
              data.principle_id +
                "_" +
                data.sub_principle_id +
                "_" +
                data.under_id
            );
          }
          if (data.ledger_form_parameter_slug == "assets") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,

              underId: underOptID,
              is_private: getSelectValue(ledger_options, data.is_private),

              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
            };
          } else if (data.ledger_form_parameter_slug == "sundry_creditors") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              address: data.address,
              date_of_registartion:
                data.reg_date != ""
                  ? moment(data.reg_date).format("DD/MM/YYYY")
                  : "",
              opening_balancing_method:
                data.balancing_method && data.balancing_method != null
                  ? getSelectValue(
                      this.state.balancingOpt,
                      data.balancing_method
                    )
                  : getSelectValue(this.state.balancingOpt, 1),
              tradeOfBusiness: data.businessType,
              natureOfBusiness: data.businessTrade,
              mailing_name: data.mailing_name,
              supplier_code: data.supplier_code,
              pincode: data.pincode != 0 ? data.pincode : "",
              city: data.city,
              email_id: data.email != "NA" ? data.email : "",
              phone_no: data.mobile_no,
              whatsapp_no: data.whatsapp_no,
              // salesrate: data.sales_rate,
              credit_days: data.credit_days,
              applicable_from:
                data.applicable_from != null
                  ? getValue(applicable_from_options, data.applicable_from)
                  : "",
              credit_bills: data.creditNumBills,
              credit_values: data.creditBillValue,

              dob: data.dob != "" ? moment(data.dob).format("DD/MM/YYYY") : "",
              doa:
                data.anniversary != ""
                  ? moment(data.anniversary).format("DD/MM/YYYY")
                  : "",
              licenseNo: data.licenseNo,
              license_expiry:
                data.licenseExpiryDate != ""
                  ? moment(data.licenseExpiryDate, "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )
                  : "",
              isGST: data.isGST != "" ? data.isGST : false,
              gstin: "",
              isLicense: data.isLicense,
              isShippingDetails: data.isShippingDetails,
              isDepartment: data.isDepartment,
              isBankDetails: data.isBankDetails,
              isCredit: data.isCredit,

              tds: String(data.tds),
              tcs: String(data.tcs),
              bank_name: data.bank_name,
              // bank_account_no: data.account_no,
              bank_branch: data.bank_branch,
              // bank_ifsc_code: data.ifsc_code,
              is_private: getSelectValue(ledger_options, data.is_private),
            };

            if (data.deptDetails.length > 0) {
              deptList = data.deptDetails.map((v, i) => {
                return {
                  did: v.id,
                  dept: v.dept,
                  contact_person: v.contact_person,
                  contact_no: v.contact_no,
                  email: v.email != "NA" ? v.email : "",
                };
              });
            }

            if (data.shippingDetails.length > 0) {
              shippingDetails = data.shippingDetails.map((v, i) => {
                return {
                  sid: v.id,
                  // details_id: v.details_id,
                  district:
                    v.district !== ""
                      ? getSelectValue(
                          this.state.stateOpt,
                          parseInt(v.district)
                        ).value
                      : "",
                  shipping_address: v.shipping_address,
                };
              });
            }

            if (data.bankDetails.length > 0) {
              bankDetails = data.bankDetails.map((v, i) => {
                return {
                  bid: v.id,
                  bank_name: v.bank_name,
                  bank_account_no: v.bank_account_no,
                  bank_ifsc_code: v.bank_ifsc_code,
                  bank_branch: v.bank_branch,
                };
              });
            }

            if (data.licensesDetails.length > 0) {
              licensesDetails = data.licensesDetails.map((v, i) => {
                return {
                  lid: v.id,
                  licences_type: getSelectValue(
                    licencesType,
                    v.licences_type.slug_name
                  ),
                  licenses_num: v.licenses_num,
                  licenses_exp:
                    v.licenses_exp != "NA" && v.licenses_exp
                      ? moment(v.licenses_exp).format("DD/MM/YYYY")
                      : "",
                };
              });
            }

            if (data.billingDetails.length > 0) {
              billingDetails = data.billingDetails.map((v, i) => {
                return {
                  id: v.id,
                  b_district: v.district,
                  billing_address: v.billing_address,
                };
              });
            }

            if (data.opening_bal_invoice_list.length > 0) {
              opnBalanceList = data.opening_bal_invoice_list.map((v, i) => {
                return {
                  id: v.id,
                  invoice_no: v.invoice_no,
                  // invoice_date: v.invoice_date
                  //   ? moment(v.invoice_date, "DD-MM-YYYY").toDate
                  //   : "",
                  invoice_date:
                    v.invoice_date != "NA" && v.invoice_date
                      ? moment(v.invoice_date, "YYYY-MM-DD").format(
                          "DD/MM/YYYY"
                        )
                      : "",
                  due_date:
                    v.due_date != "NA" && v.due_date
                      ? moment(v.due_date, "YYYY-MM-DD").format("DD/MM/YYYY")
                      : "",
                  bill_amt: v.bill_amt,
                  due_days: v.due_days,
                  invoice_bal_amt: v.invoice_bal_amt,
                  invoice_paid_amt: v.invoice_paid_amt,
                  // type: v.type,
                  type: v.type.label,
                  // type:
                  //   v.type != ""
                  //     ? getSelectValue(balanceType, v.type.value)
                  //     : "",
                };
              });
            }

            if (data.isGST) {
              if (data.gstdetails.length > 0) {
                gstdetails = data.gstdetails.map((v, i) => {
                  return {
                    id: v.id,
                    gstin: v.gstin,
                    // registraion_type: getSelectValue(GSTTypeOpt,v.registration_type),
                    registraion_type:
                      v.registraion_type != ""
                        ? getSelectValue(GSTTypeOpt, v.registraion_type)
                        : "",

                    dateofregistartion:
                      v.dateOfRegistration != "NA" && v.dateOfRegistration
                        ? moment(v.dateOfRegistration).format("DD/MM/YYYY")
                        : "",
                    pan_no_old: v.pancard != "NA" ? v.pancard : "",
                    pan_no: v.gstin.substring(2, 12),
                  };
                });
              }
            } else {
              initVal["pan_no"] = data.pancard_no;
            }

            initVal["tds_applicable_date"] =
              data.tds_applicable_date != "NA"
                ? new Date(data.tds_applicable_date)
                : "";

            initVal["tcs_applicable_date"] =
              data.tcs_applicable_date != "NA"
                ? new Date(data.tcs_applicable_date)
                : "";
          } else if (data.ledger_form_parameter_slug == "sundry_debtors") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              is_private: getSelectValue(ledger_options, data.is_private),
              route: data.route,
              areaId: getSelectValue(areaLst, parseInt(data.area)),

              district: "",
              shipping_address: "",
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              address: data.address,
              date_of_registartion:
                data.reg_date != ""
                  ? moment(data.reg_date).format("DD/MM/YYYY")
                  : "",
              opening_balancing_method: getSelectValue(
                this.state.balancingOpt,
                data.balancing_method
              ),

              isSalesman: salesmanId1 != "" ? true : false,
              salesmanId: getSelectValue(
                salesmanLst,
                parseInt(data.salesmanId)
              ),
              salesrate:
                data.sales_rate != null
                  ? getSelectValue(
                      sales_rate_options,
                      parseInt(data.sales_rate)
                    )
                  : "",
              applicable_from:
                data.applicable_from != null
                  ? getValue(applicable_from_options, data.applicable_from)
                  : "",

              tradeOfBusiness: data.businessType,
              natureOfBusiness: data.businessTrade,
              isGST: data.isGST != "" ? data.isGST : false,
              gstin: "",
              isLicense: data.isLicense,
              isShippingDetails: data.isShippingDetails,
              isDepartment: data.isDepartment,
              isBankDetails: data.isBankDetails,
              isCredit: data.isCredit,

              mailing_name: data.mailing_name,
              supplier_code: data.supplier_code,
              // pincode: data.pincode,
              pincode: data.pincode != 0 ? data.pincode : "",
              city: data.city,
              email_id: data.email != "NA" ? data.email : "",
              phone_no: data.mobile_no,
              whatsapp_no: data.whatsapp_no,
              credit_days: data.credit_days,
              credit_bills: data.creditNumBills,
              credit_values: data.creditBillValue,

              dob: data.dob != "" ? moment(data.dob).format("DD/MM/YYYY") : "",
              doa:
                data.anniversary != ""
                  ? moment(data.anniversary).format("DD/MM/YYYY")
                  : "",
              licenseNo: data.licenseNo,
              license_expiry:
                data.licenseExpiryDate != ""
                  ? moment(data.licenseExpiryDate).format("DD/MM/YYYY")
                  : "",

              tds: String(data.tds),
              tcs: String(data.tcs),
              bank_name: data.bank_name,
              // bank_account_no: data.account_no,
              bank_branch: data.bank_branch,
              // bank_ifsc_code: data.ifsc_code,
            };

            if (data.deptDetails.length > 0) {
              deptList = data.deptDetails.map((v, i) => {
                return {
                  did: v.id,
                  details_id: v.details_id,
                  dept: v.dept,
                  contact_person: v.contact_person,
                  contact_no: v.contact_no,
                  email: v.email,
                };
              });
            }

            if (data.opening_bal_invoice_list.length > 0) {
              opnBalanceList = data.opening_bal_invoice_list.map((v, i) => {
                return {
                  id: v.id,
                  invoice_no: v.invoice_no,
                  invoice_date:
                    v.invoice_date != "NA" && v.invoice_date
                      ? moment(v.invoice_date, "YYYY-MM-DD").format(
                          "DD/MM/YYYY"
                        )
                      : "",
                  due_date:
                    v.due_date != "NA" && v.due_date
                      ? moment(v.due_date, "YYYY-MM-DD").format("DD/MM/YYYY")
                      : "",
                  bill_amt: v.bill_amt,
                  due_days: v.due_days,
                  invoice_bal_amt: v.invoice_bal_amt,
                  invoice_paid_amt: v.invoice_paid_amt,
                  // type: v.type,
                  type: v.type.label,
                  // type: getSelectValue(v.type, v.type.label),
                  //  type: getSelectValue(balanceType, v.type.label),
                };
              });
            }

            if (data.licensesDetails.length > 0) {
              licensesDetails = data.licensesDetails.map((v, i) => {
                return {
                  lid: v.id,
                  licences_type: getSelectValue(
                    licencesType,
                    v.licences_type.slug_name
                  ),
                  licenses_num: v.licenses_num,
                  licenses_exp:
                    v.licenses_exp != "NA" && v.licenses_exp
                      ? moment(v.licenses_exp).format("DD/MM/YYYY")
                      : "",
                };
              });
            }

            if (data.shippingDetails.length > 0) {
              shippingDetails = data.shippingDetails.map((v, i) => {
                return {
                  sid: v.id,
                  // details_id: v.details_id,
                  district:
                    v.district !== ""
                      ? getSelectValue(
                          this.state.stateOpt,
                          parseInt(v.district)
                        ).value
                      : "",
                  shipping_address: v.shipping_address,
                };
              });
            }

            // if (data.bankDetails.length > 0) {
            //   bankDetails = data.bankDetails.map((v, i) => {
            //     return {
            //       bid: v.id,
            //       bankName: v.bank_name,
            //       account_no: v.bank_account_no,
            //       ifsc: v.bank_ifsc_code,
            //       bank_branch: v.bank_branch,
            //     };
            //   });
            // }
            if (data.bankDetails.length > 0) {
              bankDetails = data.bankDetails.map((v, i) => {
                return {
                  bid: v.id,
                  bank_name: v.bank_name,
                  bank_account_no: v.bank_account_no,
                  bank_ifsc_code: v.bank_ifsc_code,
                  bank_branch: v.bank_branch,
                };
              });
            }

            if (data.billingDetails.length > 0) {
              billingDetails = data.billingDetails.map((v, i) => {
                return {
                  id: v.id,
                  details_id: v.details_id,
                  b_district: v.district,
                  billing_address: v.billing_address,
                };
              });
            }

            if (data.isGST) {
              if (data.gstdetails.length > 0) {
                gstdetails = data.gstdetails.map((v, i) => {
                  return {
                    id: v.id,
                    gstin: v.gstin,

                    registraion_type:
                      v.registraion_type != ""
                        ? getSelectValue(GSTTypeOpt, v.registraion_type)
                        : "",
                    // registration_type:v.registration_type,

                    dateofregistartion:
                      v.dateOfRegistration != "NA" && v.dateOfRegistration
                        ? moment(v.dateOfRegistration).format("DD/MM/YYYY")
                        : "",
                    pan_no_old: v.pancard != "NA" ? v.pancard : "",
                    pan_no: v.gstin.substring(2, 12),
                  };
                });
              }
            } else {
              initVal["pan_no"] = data.pancard_no;
            }
          } else if (data.ledger_form_parameter_slug == "others") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              address: data.address,
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              pincode: data.pincode,
              // phone_no: data.mobile_no,
              is_private: getSelectValue(ledger_options, data.is_private),
            };
          } else if (data.ledger_form_parameter_slug == "duties_taxes") {
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              tax_type: getSelectValue(taxOpt, data.tax_type),
              is_private: getSelectValue(ledger_options, data.is_private),
            };
          } else if (data.ledger_form_parameter_slug == "bank_account") {
            let underIdOp = data.principle_id + "_" + data.sub_principle_id;
            initVal = {
              id: data.id,
              ledger_name: data.ledger_name,
              underId: underOptID,
              opening_balance: data.opening_bal,
              opening_balance_type: data.opening_bal_type.toLowerCase(),
              stateId: getSelectValue(this.state.stateOpt, data.state),
              countryId: getSelectValue(this.state.countryOpt, data.country),
              is_private: getSelectValue(ledger_options, data.is_private),

              // address: data.address,
              opening_balancing_method: getSelectValue(
                this.state.balancingOpt,
                data.balancing_method
              ),
              mailing_name: data.mailing_name,
              pincode: data.pincode,
              email_id: data.email,
              // phone_no: data.mobile_no,
              isTaxation: getSelectValue(ledger_type_options, data.taxable),

              taxable: getSelectValue(ledger_type_options, data.taxable),

              bank_name: data.bank_name !== "NA" ? data.bank_name : "",
              bank_account_no: data.account_no != "NA" ? data.account_no : "",
              bank_ifsc_code: data.ifsc_code != "NA" ? data.ifsc_code : "",
              bank_branch: data.bank_branch,
            };
            if (data.bankDetails.length > 0) {
              bankDetails = data.bankDetails.map((v, i) => {
                return {
                  id: v.id,
                  bank_name: v.bank_name !== "NA" ? v.bank_name : "",
                  bank_account_no:
                    v.bank_account_no != "NA" ? v.bank_account_no : "",
                  bank_ifsc_code:
                    v.bank_ifsc_code != "NA" ? v.bank_ifsc_code : "",
                  bank_branch: v.bank_branch,
                };
              });
            }
            if (data.taxable) {
              // dateofregistartion: data.dateofregistartion,
              initVal["gstin"] = data.gstin;
            }
          }

          // initVal["is_private"] =
          //   data.is_private != null
          //     ? getValue(ledger_options, data.is_private)
          //     : "";

          this.setState(
            {
              isEditDataSet: true,
              initVal: initVal,
              gstList: gstdetails,
              deptList: deptList,
              shippingList: shippingDetails,
              billingList: billingDetails,
              bankList: bankDetails,
              licensesList: licensesDetails,
              balanceList: opnBalanceList,
              opeBalType: data.opening_bal_type.toLowerCase(),

              // datalockSlug: "ledgerMaster_" + initVal.id
            },
            () => {
              // //TODO: Add slug to datalock
              // if (this.state.datalockSlug != "") {
              //   if (!checkDataLockExist(this.state.datalockSlug)) {
              //     addDataLock(this.state.datalockSlug)
              //   }
              // }
            }
          );
        }
        // else if (data.responseStatus == 409) {
        //   // ShowNotification("Error", data.message);
        //   MyNotifications.fire({
        //     show: true,
        //     icon: "error",
        //     title: "Error",
        //     msg: data.message,
        //     is_timeout: true,
        //     delay: 3000,
        //   });
        //   setTimeout(() => {
        //     eventBus.dispatch("page_change", {
        //       to: "ledgerlist",
        //       from: "ledgeredit",
        //       isNewTab: false,
        //     });
        //   }, 2000);
        // } else {
        //   this.setState({ isEditDataSet: true });
        //   ShowNotification("Error", data.responseStatus);
        // }
      })
      .catch((error) => {});
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
  handleFetchGstData = (values, setFieldValue, index = -1) => {
    // if(values.dateofregistartion !=null && values.dateofregistartion!="")
    // {
    //   let gstpandate=moment(values.dateofregistartion,"DD/MM/YYYY").toDate();
    // }
    let gstObj = {
      id: values.id != 0 ? values.id : 0,
      // registraion_type: values.registraion_type != "" ? values.registraion_type : "",
      // registraion_type:getSelectValue(this.state.GSTTypeOpt,values.registration_type),
      registraion_type: values.registraion_type,
      registration_type: values.registration_type,
      gstin: values.gstin != "" ? values.gstin : "",
      dateofregistartion:
        values.dateofregistartion != "" ? values.dateofregistartion : "",

      pan_no: values.pan_no != "" ? values.pan_no : 0,
      index: index,
    };

    if (gstObj.registraion_type != "") {
      setFieldValue("registraion_type", gstObj.registraion_type);
    }
    if (gstObj.gstin != "") {
      setFieldValue("gstin", gstObj.gstin);
    }

    if (gstObj.id != "") {
      setFieldValue("bid", gstObj.id);
    }
    let finalpandate = "";
    // if (gstObj.dateofregistartion != null && gstObj.dateofregistartion != "") {
    //   // finalpandate = moment(gstObj.dateofregistartion, "DD/MM/YYYY").toDate();
    // }
    if (gstObj.dateofregistartion != "") {
      // console.warn("gstObj.dateofregistartion ", gstObj.dateofregistartion);
      setFieldValue("dateofregistartion", gstObj.dateofregistartion);
    }
    if (gstObj.pan_no != "") {
      setFieldValue("pan_no", gstObj.pan_no);
    }
    if (gstObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }

    setFieldValue(
      "gst_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );
    // gstList = gstList.filter((v, i) => i != index);
    // this.setState({ gstList: gstList });
    // } else {
    //   setFieldValue("gstin", "");
    //   setFieldValue("bid", "");
    //   setFieldValue("dateofregistartion", "");
    //   setFieldValue("pan_no", "");

    //   setFieldValue("gst_detail_id", "");
    // }
  };

  handleFetchDepartmentData = (values, setFieldValue, index = -1) => {
    // let { deptList } = this.state;
    let deptObj = {
      did: values.id != 0 ? values.id : 0,

      dept: values.dept,

      contact_no: values.contact_no != "" ? values.contact_no : "",

      contact_person: values.contact_person != "" ? values.contact_person : "",
      email: values.email != "" ? values.email : "",
      index: index,
    };

    if (deptObj.dept != "") {
      setFieldValue("dept", deptObj.dept);
    }
    if (deptObj.id != "") {
      setFieldValue("did", deptObj.did);
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

    if (deptObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }

    setFieldValue(
      "dept_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );

    // deptList = deptList.filter((v, i) => i != index);

    // this.setState({ deptList: deptList });
  };
  handleFetchBankData = (values, setFieldValue, index = -1) => {
    // let { bankList } = this.state;
    let bankObj = {
      bid: values.id != 0 ? values.id : 0,
      bank_name: values.bank_name != null ? values.bank_name : "",
      bank_account_no:
        values.bank_account_no != null ? values.bank_account_no : "",
      bank_ifsc_code:
        values.bank_ifsc_code != null ? values.bank_ifsc_code : "",
      bank_branch: values.bank_branch != null ? values.bank_branch : "",
      index: index,
    };

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
    if (bankObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }
    if (bankObj.id != "") {
      setFieldValue("bid", bankObj.bid);
    }

    setFieldValue(
      "bank_detail_id",
      values.details_id != 0 ? values.details_id : 0
    );
    // bankList = bankList.filter((v, i) => i != index);

    // this.setState({ bankList: bankList });
  };

  addGSTRow = (values, setFieldValue, index = -1) => {
    let gstObj = {
      id: values.id != 0 ? values.id : 0,
      gstin: values.gstin.toUpperCase(),

      dateofregistartion: values.dateofregistartion,
      // dateofregistartion: moment(values.dateofregistartion).toDate(),

      pan_no: values.pan_no,
      registraion_type: values.registraion_type,
      // registration_type: values.registraion_type.value,
      index: values.index,
    };

    let { gstList } = this.state;
    if (GSTINREX.test(gstObj.gstin)) {
      if (pan.test(gstObj.pan_no)) {
        let old_lst = gstList;
        let is_updated = false;
        let obj = old_lst.filter((value) => {
          return (
            value.registraion_type.value === gstObj.registraion_type.value &&
            value.gstin === gstObj.gstin &&
            value.dateofregistartion === gstObj.dateofregistartion
          );
        });

        let final_state = [];
        if (obj.length == 0) {
          if (values.index == -1) {
            final_state = old_lst.map((item) => {
              if (item.id != 0 && item.id === gstObj.id) {
                is_updated = true;
                const updatedItem = gstObj;
                return updatedItem;
              }
              return item;
            });
            if (is_updated == false) {
              final_state = [...gstList, gstObj];
            }
          } else {
            final_state = old_lst.map((item, i) => {
              if (i == values.index) {
                return gstObj;
              } else {
                return item;
              }
            });
          }

          this.setState({ gstList: final_state }, () => {
            setFieldValue("bid", "");
            setFieldValue("registraion_type", "");
            setFieldValue("gstin", "");
            setFieldValue("dateofregistartion", "");
            setFieldValue("pan_no", "");
            setFieldValue("index", -1);
          });
        } else if (values.index != -1) {
          final_state = old_lst.map((item, i) => {
            if (i == values.index) {
              return gstObj;
            } else {
              return item;
            }
          });

          this.setState({ gstList: final_state }, () => {
            setFieldValue("bid", "");
            setFieldValue("registraion_type", "");
            setFieldValue("gstin", "");
            setFieldValue("dateofregistartion", "");
            setFieldValue("pan_no", "");
            setFieldValue("index", -1);
          });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: "GST Details are Already Exist !",
            // is_button_show: false,
            is_timeout: true,
            delay: 1500,
          });
        }
      } else {
        MyNotifications.fire({
          show: true,
          icon: "error",
          title: "Error",
          msg: "PAN NO is not Valid!",
          // is_button_show: false,
          is_timeout: true,
          delay: 1500,
        });
      }
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "GSTIN is Not Valid ",
        // is_button_show: false,
        is_timeout: true,
        delay: 1500,
      });
    }
  };

  // handle click event of the Remove button
  removeGstRow = (index) => {
    let { gstList, rList } = this.state;
    // const list = [...gstList];
    // list.splice(index, 1);

    // rList = [...rList, list[1]];
    let list = gstList.filter((v, i) => i != index);
    let robj = gstList.find((v, i) => i == index);
    rList = [...rList, robj];

    this.setState({ gstList: list, rList: rList }, () => {
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("index", -1);
        this.myRef.current.setFieldValue("bid", "");
      }
    });
  };

  handleFetchLicensesData = (values, setFieldValue, index = -1) => {
    let licensesObj = {
      lid: values.id != 0 ? values.id : 0,
      licences_type: values.licences_type != null ? values.licences_type : "",
      licenses_num: values.licenses_num != null ? values.licenses_num : "",
      licenses_exp: values.licenses_exp != null ? values.licenses_exp : "",
      index: index,
    };

    if (licensesObj.licences_type != "") {
      setFieldValue("licences_type", licensesObj.licences_type);
    }
    if (licensesObj.licenses_num != "") {
      setFieldValue("licenses_num", licensesObj.licenses_num);
    }
    if (licensesObj.licenses_exp != "") {
      setFieldValue("licenses_exp", licensesObj.licenses_exp);
    }

    // setFieldValue("index", licensesObj.index);
    if (licensesObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }
    if (licensesObj.lid != "") {
      setFieldValue("lid", licensesObj.lid);
    }
    // setFieldValue(
    //   "bank_detail_id",
    //   values.details_id != 0 ? values.details_id : 0
    // );
  };

  addLicensesRow = (values, setFieldValue) => {
    let licensesObj = {
      lid: values.id != 0 ? values.id : 0,
      licences_type: values.licences_type,
      licenses_num: values.licenses_num,
      licenses_exp: values.licenses_exp,
      index: values.index,
    };
    let { licensesList } = this.state;
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
      if (values.index == -1) {
        final_state = old_lst.map((item) => {
          if (item.lid != 0 && item.lid === licensesObj.lid) {
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
      } else {
        final_state = old_lst.map((item, i) => {
          if (i == values.index) {
            return licensesObj;
          } else {
            return item;
          }
        });
      }

      this.setState({ licensesList: final_state }, () => {
        setFieldValue("lid", "");
        setFieldValue("licences_type", "");
        setFieldValue("licenses_num", "");
        setFieldValue("licenses_exp", "");
        setFieldValue("index", -1);
      });
    } else if (values.index != -1) {
      final_state = old_lst.map((item, i) => {
        if (i == values.index) {
          return licensesObj;
        } else {
          return item;
        }
      });

      this.setState({ licensesList: final_state }, () => {
        setFieldValue("lid", "");
        setFieldValue("licences_type", "");
        setFieldValue("licenses_num", "");
        setFieldValue("licenses_exp", "");
        setFieldValue("index", -1);
      });
    } else {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Licenses Details are Already Exist !",
        // is_button_show: false,
        is_timeout: true,
        delay: 1500,
      });
    }
  };
  removeLicensesRow = (index) => {
    // const { licensesList } = this.state;
    // const list = [...licensesList];
    // list.splice(index, 1);
    // this.setState({ licensesList: list });

    let { licensesList, removelicensesList } = this.state;
    let list = licensesList.filter((v, i) => i != index);
    let robj = licensesList.find((v, i) => i == index);
    removelicensesList = [...removelicensesList, robj];
    this.setState(
      { licensesList: list, removelicensesList: removelicensesList },
      () => {
        if (this.myRef.current) {
          this.myRef.current.setFieldValue("index", -1);
          this.myRef.current.setFieldValue("lid", "");
        }
      }
    );
  };

  removeBankRow = (index) => {
    let { bankList, removebankList } = this.state;
    let list = bankList.filter((v, i) => i != index);
    let robj = bankList.find((v, i) => i == index);
    removebankList = [...removebankList, robj];
    this.setState({ bankList: list, removebankList: removebankList }, () => {
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("index", -1);
        this.myRef.current.setFieldValue("bid", "");
      }
    });
  };

  handleFetchShippingData = (values, setFieldValue, index = -1) => {
    // if (isclear == 0) {
    let shipObj = {
      sid: values.id != 0 ? values.id : 0,
      // details_id: values.details_id != 0 ? values.details_id : 0,
      district:
        values.district != ""
          ? getSelectValue(this.state.stateOpt, values.district)
          : "",
      shipping_address:
        values.shipping_address != "" ? values.shipping_address : "",
      index: index,
    };

    setFieldValue("district", shipObj.district);
    if (shipObj.id != "") {
      setFieldValue("sid", shipObj.sid);
    }
    setFieldValue("shipping_address", shipObj.shipping_address);
    if (shipObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }
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

  // checkExpiryDate = (setFieldValue, expirydate = 0, ele) => {

  //   console.warn("sid :: expirydate", expirydate);
  //   console.warn("sid:: isValid", moment(expirydate, "DD-MM-YYYY").isValid());
  //   if (moment(expirydate, "DD-MM-YYYY").isValid() == true) {
  //     let currentDate = new Date().getTime();
  //     // let expdate = new Date(expirydate).getTime();
  //     let expdate = moment(expirydate, "DD/MM/YYYY").toDate();

  //     console.warn("--> expirydate", expdate.getTime());
  //     let etime = expdate.getTime();
  //     if (ele == "dateofregistartion" || ele == "date_of_registartion") {
  //       if (currentDate >= etime) {
  //         // setFieldValue("dateofregistartion", etime);
  //
  //       } else {
  //         MyNotifications.fire({
  //           show: true,
  //           icon: "error",
  //           title: "Error",
  //           msg: "Registration Date Should be Less than Current Date",
  //           // is_button_show: true,
  //           is_timeout: true,
  //           delay: 1500,
  //         });
  //         // setFieldValue(ele, "");
  //         if (ele == "dateofregistartion") {
  //           setTimeout(() => {
  //             document.getElementById("dateofregistartion").focus();
  //           }, 1000);
  //         } else if (ele == "date_of_registartion") {
  //           setTimeout(() => {
  //             document.getElementById("date_of_registartion").focus();
  //           }, 1000);
  //         }
  //       }
  //     } else {
  //       if (currentDate >= etime) {
  //         // MyNotifications.fire(
  //         // {
  //         //   show: true,
  //         //   icon: "confirm",
  //         //   title: "Expiry date not valid ",
  //         //   msg: "Do you want continue with this Expiry Date",
  //         //   is_button_show: false,
  //         //   is_timeout: false,
  //         //   delay: 0,
  //         //   handleSuccessFn: () => {
  //         //     console.warn("sid:: continue invoice");
  //         //   },
  //         //   handleFailFn: () => {
  //         //     console.warn("sid:: exit from invoice or reload page");
  //         //     this.handlefail();
  //         //   },
  //         // },
  //         // () => {
  //         //   console.warn("sid :: return_data");
  //         // }

  //         MyNotifications.fire({
  //           show: true,
  //           icon: "error",
  //           title: "Error",
  //           msg: "Expiry Date Should be Grater than Current Date",
  //           // is_button_show: true,
  //           is_timeout: true,
  //           delay: 1500,
  //         });
  //         // @prathmesh @license date validation
  //         if (ele == "licenses_exp") {
  //           setTimeout(() => {
  //             document.getElementById("licenses_exp").focus();
  //           }, 1000);
  //         }
  //         // setFieldValue(ele, "");
  //         // }
  //         // );
  //       } else {
  //         console.log("Correct Date-->", expirydate);
  //       }
  //     }
  //   } else {
  //     MyNotifications.fire({
  //       show: true,
  //       icon: "error",
  //       title: "Error",
  //       msg: "Expiry date not valid",
  //       // is_button_show: true,
  //       is_timeout: true,
  //       delay: 1500,
  //     });
  //     // setFieldValue(ele, "");
  //   }
  // };

  checkExpiryDate = (setFieldValue, expirydate = 0, ele) => {
    if (moment(expirydate, "DD-MM-YYYY").isValid() == true) {
      let currentDate = new Date().getTime();

      // let expdate = new Date(expirydate).getTime();
      let expdate = moment(expirydate, "DD/MM/YYYY").toDate();

      let etime = expdate.getTime();

      if (ele == "dateofregistartion" || ele == "date_of_registartion") {
        if (currentDate >= etime) {
          // setFieldValue("dateofregistartion", etime);
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
            }, 2000);
          } else if (ele == "date_of_registartion") {
            setTimeout(() => {
              document.getElementById("date_of_registartion").focus();
            }, 2000);
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
            }, 2000);
          } else if (ele == "dateofregistartion") {
            setTimeout(() => {
              document.getElementById("dateofregistartion").focus();
            }, 2000);
          } else if (ele == "date_of_registartion") {
            setTimeout(() => {
              document.getElementById("date_of_registartion").focus();
            }, 2000);
          }
          // setFieldValue(ele, "");
          // }
          // );
        } else {
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
      if (ele == "licenses_exp") {
        setTimeout(() => {
          document.getElementById("licenses_exp").focus();
        }, 2000);
      } else if (ele == "dateofregistartion") {
        setTimeout(() => {
          document.getElementById("dateofregistartion").focus();
        }, 2000);
      } else if (ele == "date_of_registartion") {
        setTimeout(() => {
          document.getElementById("date_of_registartion").focus();
        }, 2000);
      }
      // setFieldValue(ele, "");
    }
  };
  addShippingRow = (values, setFieldValue) => {
    let shipObj = {
      sid: values.id != 0 ? values.id : 0,
      district: values.district.value,
      shipping_address: values.shipping_address,
      index: values.index,
    };

    const { shippingList } = this.state;
    let old_lst = shippingList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.district === shipObj.district &&
        value.shipping_address === shipObj.shipping_address
      );
    });

    let final_state = [];
    if (obj.length == 0) {
      if (values.index == -1) {
        final_state = old_lst.map((item) => {
          if (item.sid != 0 && item.sid === shipObj.sid) {
            is_updated = true;
            const updatedItem = shipObj;
            return updatedItem;
          }
          return item;
        });
        if (is_updated == false) {
          final_state = [...shippingList, shipObj];
        }
      } else {
        final_state = old_lst.map((item, i) => {
          if (i == values.index) {
            return shipObj;
          } else {
            return item;
          }
        });
      }

      // if (obj.length == 0) {
      //   final_state = old_lst.map((item, i) => {
      //     if (item.index === shipObj.index) {
      //       is_updated = true;
      //       const newObj = shipObj;
      //       return newObj;
      //     }
      //     return item;
      //   });

      // if (is_updated == false) {
      //   final_state = [...shippingList, shipObj];
      // }

      this.setState({ shippingList: final_state }, () => {
        setFieldValue("sid", "");
        setFieldValue("district", "");
        setFieldValue("shipping_address", "");
        setFieldValue("index", -1);
      });
    } else if (values.index != -1) {
      final_state = old_lst.map((item, i) => {
        if (i == values.index) {
          return shipObj;
        } else {
          return item;
        }
      });

      console.log({ final_state });
      this.setState({ shippingList: final_state }, () => {
        setFieldValue("sid", "");
        setFieldValue("district", "");
        setFieldValue("shipping_address", "");
        setFieldValue("index", -1);
      });
    } else {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Shipping Details are Already Exist !",
        // is_button_show: false,
        is_timeout: true,
        delay: 1500,
      });
    }
  };

  // handle click event of the Remove button
  removeShippingRow = (index) => {
    // const list = [...shippingList];
    // list.splice(index, 1);

    let { shippingList, rSList } = this.state;
    let list = shippingList.filter((v, i) => i != index);
    let sobj = shippingList.find((v, i) => i == index);
    rSList = [...rSList, sobj];
    this.setState({ shippingList: list, rSList: rSList }, () => {
      console.log("shiplist removed->", this.state.rSList);
    });
  };

  handleFetchBillingData = (values, setFieldValue, index = -1) => {
    let billAddObj = {
      id: values.id != 0 ? values.id : 0,
      details_id: values.details_id != 0 ? values.details_id : 0,
      b_district: values.b_district,
      billing_address: values.billing_address,
      index: index,
    };

    setFieldValue("b_district", billAddObj.b_district);
    setFieldValue("billing_address", billAddObj.billing_address);
    if (billAddObj.id != "") {
      setFieldValue("bid", billAddObj.id);
    }
    if (billAddObj.index != -1) {
      setFieldValue("index", index);
    } else {
      setFieldValue("index", -1);
    }

    // setFieldValue(
    //   "billing_details_id",
    //   values.details_id != 0 ? values.details_id : 0
    // );
    // });
  };

  addBillingRow = (values, setFieldValue) => {
    console.log(values);
    let billAddObj = {
      id: values.id != 0 ? values.id : 0,
      // details_id: values.details_id != 0 ? values.details_id : 0,
      b_district: values.b_district,
      billing_address: values.billing_address,
    };

    const { billingList } = this.state;

    let old_lst = billingList;
    let is_updated = false;
    let obj = old_lst.filter((value) => {
      return (
        value.b_district === billAddObj.b_district &&
        value.billing_address === billAddObj.billing_address
      );
    });

    let final_state = [];
    if (obj.length == 0) {
      if (values.index == -1) {
        final_state = old_lst.map((item) => {
          if (item.id != 0 && item.id === billAddObj.id) {
            is_updated = true;
            const updatedItem = billAddObj;
            return updatedItem;
          }

          return item;
        });

        if (is_updated == false) {
          final_state = [...billingList, billAddObj];
        }
      } else {
        final_state = old_lst.map((item, i) => {
          if (i == values.index) {
            return billAddObj;
          } else {
            return item;
          }
        });
      }

      this.setState({ billingList: final_state }, () => {
        setFieldValue("bid", "");
        setFieldValue("b_district", "");
        setFieldValue("billing_address", "");
        setFieldValue("billing_details_id", "");
      });
    } else {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Billing Details are Already Exist !",
        // is_button_show: false,
        is_timeout: true,
        delay: 1500,
      });
    }
  };

  // handle click event of the Remove button
  removeBillingRow = (index) => {
    let { billingList, rBList } = this.state;
    let list = billingList.filter((v, i) => i != index);
    let bobj = billingList.find((v, i) => i == index);
    rBList = [...rBList, bobj];
    // const list = [...billingList];
    // list.splice(index, 1);
    this.setState({ billingList: list, rBList: rBList }, () => {
      console.log("billing list removed->", this.state.rBList);
    });
  };

  addDeptRow = (values, setFieldValue) => {
    let deptObj = {
      did: values.id != 0 ? values.id : 0,
      dept: values.dept,
      contact_person: values.contact_person,
      contact_no: values.contact_no,
      email: values.email,
      index: values.index,
    };

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
      if (values.index == -1) {
        final_state = old_lst.map((item) => {
          if (item.did != 0 && item.did === deptObj.did) {
            is_updated = true;
            const updatedItem = deptObj;
            return updatedItem;
          }
          return item;
        });
        if (is_updated == false) {
          final_state = [...deptList, deptObj];
        }
      } else {
        final_state = old_lst.map((item, i) => {
          if (i == values.index) {
            return deptObj;
          } else {
            return item;
          }
        });
      }
      this.setState({ deptList: final_state }, () => {
        setFieldValue("did", "");
        setFieldValue("dept", "");
        setFieldValue("contact_person", "");
        setFieldValue("contact_no", "");
        setFieldValue("email", "");
        setFieldValue("index", -1);
      });
    } else if (values.index != -1) {
      final_state = old_lst.map((item, i) => {
        if (i == values.index) {
          return deptObj;
        } else {
          return item;
        }
      });

      this.setState({ deptList: final_state }, () => {
        setFieldValue("did", "");
        setFieldValue("dept", "");
        setFieldValue("contact_person", "");
        setFieldValue("contact_no", "");
        setFieldValue("email", "");
        setFieldValue("index", -1);
      });
    } else {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Department Details are Already Exist !",
        // is_button_show: false,
        is_timeout: true,
        delay: 1500,
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

  removeDeptRow = (index) => {
    let { deptList, deptRList } = this.state;
    let list = deptList.filter((v, i) => i != index);
    let dobj = deptList.find((v, i) => i == index);
    deptRList = [...deptRList, dobj];
    // list.splice(index, 1);
    this.setState({ deptList: list, deptRList: deptRList }, () => {
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("index", -1);
        this.myRef.current.setFieldValue("did", "");
      }
    });
  };
  setInitValue = () => {
    let initValue = {
      associates_id: "",
      associates_group_name: "",
      underId: "",
      opening_balance: 0,
      ledger_name: "",
      stateId: "",
      isGST: "",
      gstin: "",
      is_private: getSelectValue(ledger_options, false),
      salesrate: getValue(sales_rate_options, "Sales Rate A"),
    };
    this.setState({ initValue: initValue });
  };
  getoutletappConfigData = () => {
    getoutletappConfig()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let d = res.responseObject;
          let opt = d.settings.map((v) => {
            return { key: v.key, label: v.label, value: v.value };
          });
          this.setState({ appConfig: opt });
        }
      })
      .catch((error) => {});
  };

  lstAreaMaster = (isNew = false) => {
    getAreaMasterOutlet()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v, i) => {
            return { label: v.areaName, value: v.id };
          });
          this.setState({ areaLst: opt }, () => {});
          if (isNew) {
            this.myRef.current.setFieldValue("areaId", opt[opt.length - 1]);
          }
        }
      })
      .catch((error) => {});
  };
  lstSalesmanMaster = (isNew = false) => {
    getSalesmanMasterOutlet()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v, i) => {
            return { label: v.firstName + " " + v.lastName, value: v.id };
          });
          this.setState({ salesmanLst: opt }, () => {});
          if (isNew) {
            this.myRef.current.setFieldValue("salesmanId", opt[opt.length - 1]);
          }
        }
      })
      .catch((error) => {});
  };
  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "ledgeredit",
      to: "ledgerlist",
    });
  };

  OpenLedgerList = (e) => {
    eventBus.dispatch("page_change", "ledgerlist");
  };
  OpenLedgerCreate = (e) => {
    eventBus.dispatch("page_change", "ledgercreate");
  };
  handleKeyPress = (event) => {
    if (event.altKey && event.key == "l") {
      event.preventDefault();
      this.OpenLedgerList();
    } else if (event.key === "F2") {
      this.OpenLedgerCreate();
    }
  };

  handleKeyDown = (e, index) => {
    if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    } else if (e.altKey && e.keyCode === 83) {
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

  getDataCapitalisedSalesmaster = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // area master start
  getDataCapitalisedArea = (str) => {
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
            this.pincodeRef.current.focus();
            // document.getElementById("pincode").focus();
          }, 2000);
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
      this.lstAreaMaster();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.lstSalesmanMaster();
      // this.setInitValue();
      // this.getoutletappConfigData();

      const { prop_data } = this.props.block;
      console.log({ prop_data });

      // if ("source" in prop_data) {
      if (prop_data.hasOwnProperty("source")) {
        this.setState({ source: prop_data.source, edit_data: prop_data.id });
      } else {
        this.setState({
          edit_data: prop_data.prop_data,
          filter_data: prop_data.prop_data.filter_list,
        });
      }

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }

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

  componentDidUpdate() {
    const {
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      GSTTypeOpt,
      edit_data,
      isEditDataSet,
    } = this.state;

    if (
      undervalue.length > 0 &&
      balancingOpt.length > 0 &&
      stateOpt.length > 0 &&
      countryOpt.length > 0 &&
      GSTTypeOpt.length > 0 &&
      isEditDataSet == false &&
      edit_data != ""
    ) {
      this.getLedgerDetails();
    }
  }
  addBankRow = (values, setFieldValue) => {
    let bankObj = {
      bid: values.id != 0 ? values.id : 0,
      bank_name: values.bank_name,
      bank_account_no: values.bank_account_no,
      bank_ifsc_code: values.bank_ifsc_code,
      bank_branch: values.bank_branch,
      index: values.index,
    };

    console.log(bankObj);
    let { bankList } = this.state;
    if (bankAccountNumber.test(bankObj.bank_account_no)) {
      // if (ifsc_code_regex.test(bankObj.bank_ifsc_code)) {
      let old_lst = bankList;
      let is_updated = false;

      let obj = old_lst.filter((value) => {
        return value.bank_account_no === bankObj.bank_account_no;
      });

      let final_state = [];
      if (obj.length == 0) {
        if (values.index == -1) {
          final_state = old_lst.map((item) => {
            if (item.id != 0 && item.id === bankObj.bid) {
              is_updated = true;
              const updatedItem = bankObj;
              return updatedItem;
            }
            return item;
          });

          if (is_updated == false) {
            final_state = [...bankList, bankObj];
          }
        } else {
          final_state = old_lst.map((item, i) => {
            if (i == values.index) {
              return bankObj;
            } else {
              return item;
            }
          });
        }

        this.setState({ bankList: final_state }, () => {
          setFieldValue("bid", "");
          setFieldValue("bank_name", "");
          setFieldValue("bank_account_no", "");
          setFieldValue("bank_ifsc_code", "");
          setFieldValue("bank_branch", "");
          setFieldValue("index", -1);
        });
      } else if (obj.index == -1) {
        final_state = old_lst.map((item, i) => {
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

        this.setState({ bankList: final_state }, () => {
          setFieldValue("bid", "");
          setFieldValue("bank_name", "");
          setFieldValue("bank_account_no", "");
          setFieldValue("bank_ifsc_code", "");
          setFieldValue("bank_branch", "");
          setFieldValue("index", -1);
        });
      } else if (values.index != -1) {
        final_state = old_lst.map((item, i) => {
          if (i == values.index) {
            return bankObj;
          } else {
            return item;
          }
        });

        this.setState({ bankList: final_state }, () => {
          setFieldValue("bid", "");
          setFieldValue("bank_name", "");
          setFieldValue("bank_account_no", "");
          setFieldValue("bank_ifsc_code", "");
          setFieldValue("bank_branch", "");
          setFieldValue("index", -1);
        });
      } else {
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Bank Details are Already Exist !",
          // is_button_show: false,
          is_timeout: true,
          delay: 1500,
        });
      }
      // } else {
      //   MyNotifications.fire({
      //     show: true,
      //     icon: "error",
      //     title: "Error",
      //     msg: "IFSC is not valid !",
      //     // is_button_show: false,
      //     is_timeout: true,
      //     delay: 1500,
      //   });
      // }
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "AccountNo is not valid !",
        // is_button_show: false,
        is_timeout: true,
        delay: 1500,
      });
    }
  };
  extract_pan_from_GSTIN = (gstinffield, setFieldValue) => {
    if (gstinffield.length >= 15) {
      let pan = gstinffield.substring(2, 12);
      setFieldValue("pan_no", pan);
    } else if (gstinffield.length == 0) {
      setFieldValue("pan_no", "");
    }
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
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  // FUNCTION  FOR REMOVE INSTANCE
  // CancelAPICall = () => {
  //   if (checkDataLockExist(this.state.datalockSlug)) {
  //     removeDataLock(this.state.datalockSlug);
  //     let reqData = new FormData();
  //     reqData.append("key", this.state.datalockSlug)
  //     removeInstance(reqData).then((response) => {
  //       console.log("respose", response);
  //       if (this.state.source != "") {
  //         eventBus.dispatch("page_change", {
  //           from: "ledgeredit",
  //           to: this.state.source.from_page,
  //           prop_data: {
  //             rows: this.state.source.rows,
  //             invoice_data:
  //               this.state.source.invoice_data,
  //             ...this.state.source,
  //           },
  //           isNewTab: false,
  //         });
  //         this.setState({ source: "", datalockSlug: "" });
  //       } else {
  //         eventBus.dispatch(
  //           "page_change",
  //           "ledgerlist"
  //         );
  //       }
  //     }).catch(
  //       (error) => {
  //         console.log("error", error);
  //         if (this.state.source != "") {
  //           eventBus.dispatch("page_change", {
  //             from: "ledgeredit",
  //             to: this.state.source.from_page,
  //             prop_data: {
  //               rows: this.state.source.rows,
  //               invoice_data:
  //                 this.state.source.invoice_data,
  //               ...this.state.source,
  //             },
  //             isNewTab: false,
  //           });
  //           this.setState({ source: "" });
  //         } else {
  //           eventBus.dispatch(
  //             "page_change",
  //             "ledgerlist"
  //           );
  //         }
  //       }
  //     )
  //   }

  // }

  addOpeningBalRow = (values) => {
    let { balancerows, invoiceBalAmt } = this.state;

    let balObj = {
      id: values.id,
      invoice_no: values.invoice_no,
      invoice_date: values.invoice_date
        ? moment(values.invoice_date, "DD-MM-YYYY").format("YYYY-MM-DD")
        : "",
      due_date: values.due_date
        ? moment(values.due_date, "DD-MM-YYYY").format("YYYY-MM-DD")
        : "",
      due_days: values.due_days,
      bill_amt: values.bill_amt,
      invoice_paid_amt: values.invoice_paid_amt,
      invoice_bal_amt: this.finalInvoiceRemainingAmt(),
      type: values.type.label,
    };
    const { balanceList, openingBal, paidBal } = this.state;
    let old_lst = balanceList;
    let final_state = [];
    if (balObj.invoice_no) {
      let is_updated = false;

      // let final_state = old_lst.map((item) => {
      //   if (item.invoice_no === balObj.invoice_no) {
      //     is_updated = true;
      //     const updatedItem = balObj;
      //     return updatedItem;
      //   }
      //   return item;
      // });
      // if (is_updated == false) {
      //   final_state = [...balanceList, balObj];
      // }
      final_state = [...balanceList, balObj];

      this.setState(
        {
          balanceList: final_state,
          balancerows: balancerows,
          invoiceBillAmt: 0,
          invoicePaidBal: 0,
          type: "",
        },
        () => {
          if (this.openingBalRef.current) {
            this.openingBalRef.current.setFieldValue("id", "");
            this.openingBalRef.current.setFieldValue("invoice_no", "");
            this.openingBalRef.current.setFieldValue("invoice_date", "");
            this.openingBalRef.current.setFieldValue("due_date", "");
            this.openingBalRef.current.setFieldValue("due_days", "");
            this.openingBalRef.current.setFieldValue("bill_amt", "");
            this.openingBalRef.current.setFieldValue("invoice_paid_amt", "");
            this.openingBalRef.current.setFieldValue("invoice_bal_amt", 0);
            // this.openingBalRef.current.setFieldValue("type", "");
          }
        }
      );
    }
    let opnBal = parseInt(openingBal);
    let selType = balObj.type.label;
    let paidAmt = 0;

    // if (ledType == "debtors" && selType == "Dr") {

    let invAmt = balObj.invoice_bal_amt;
    paidAmt = parseInt(this.finalBillpaidBal()) + invAmt;
    // }
    // debugger;
    if (paidAmt > opnBal) {
      MyNotifications.fire(
        {
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Balance Amount is greater than Opening Amount",
          // is_button_show: true,
          is_timeout: true,
          delay: 1500,
        },
        () => {
          console.warn("return_data");
        }
      );
      this.setState(
        {
          balanceList: old_lst,
          balancerows: balancerows,
          invoceRemAmt: 0,
        },
        () => {
          if (this.openingBalRef.current) {
            this.openingBalRef.current.setFieldValue("id", 0);
            this.openingBalRef.current.setFieldValue(
              "invoice_no",
              values.invoice_no
            );
            this.openingBalRef.current.setFieldValue(
              "invoice_date",
              values.invoice_date
            );
            this.openingBalRef.current.setFieldValue(
              "due_date",
              values.due_date
            );
            this.openingBalRef.current.setFieldValue(
              "due_days",
              values.due_days
            );
            this.openingBalRef.current.setFieldValue(
              "bill_amt",
              values.bill_amt
            );
            this.openingBalRef.current.setFieldValue(
              "invoice_paid_amt",
              values.invoice_paid_amt
            );
            this.openingBalRef.current.setFieldValue(
              "invoice_bal_amt",
              values.invoice_bal_amt
            );
            // this.openingBalRef.current.setFieldValue("type", "");
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

    balanceList.map((next) => {
      if (next.type == "Dr" && ledType == "dr") {
        if (opnBal >= next.invoice_bal_amt)
          if ("invoice_bal_amt" in next) {
            drPaidAmount =
              parseInt(drPaidAmount) +
              parseFloat(next.invoice_bal_amt ? next.invoice_bal_amt : 0);
          }

        // return drPaidAmount;
      } else if (next.type == "Cr" && ledType == "cr") {
        if (opnBal >= next.invoice_bal_amt)
          if ("invoice_bal_amt" in next) {
            crPaidAmount =
              parseInt(crPaidAmount) +
              parseFloat(next.invoice_bal_amt ? next.invoice_bal_amt : 0);
          }

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
        ? 0
        : parseFloat(paidAmt) - parseFloat(selectedAmt);
    } else {
      return 0;
    }
  };

  finalInvoiceRemainingAmt = () => {
    let billAmt = this.state.invoiceBillAmt;
    let paidAmt = this.state.invoicePaidBal ? this.state.invoicePaidBal : 0;

    let remAmt = 0;

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
      remAmt = 0;
    }
    // this.setState({ invoceRemAmt: remAmt });

    return remAmt;
  };
  openingBalanceUpdate = (values, setFieldValue) => {
    let balanceInitVal = {
      id: values.id,
      invoice_no: values.invoice_no != "" ? values.invoice_no : "",
      invoice_date:
        values.invoice_date != ""
          ? moment(values.invoice_date, "DD/MM/YYYY").format("DD-MM-YYYY")
          : "",
      due_date:
        values.due_date != ""
          ? moment(values.due_date, "DD/MM/YYYY").format("DD-MM-YYYY")
          : "",
      due_days: values.due_days != 0 ? values.due_days : "",
      bill_amt: values.bill_amt != 0 ? values.bill_amt : "",
      invoice_paid_amt:
        values.invoice_paid_amt != 0 ? values.invoice_paid_amt : "",
      invoice_bal_amt:
        values.invoice_bal_amt != 0 ? values.invoice_bal_amt : "",
      type:
        values.type != 0
          ? getSelectLabel(balanceType, values.type.toLowerCase())
          : "",
    };

    this.setState({
      balanceInitVal: balanceInitVal,
      invoiceBillAmt: balanceInitVal.bill_amt,
      invoicePaidBal: balanceInitVal.invoice_paid_amt,
      // balanceList: balanceInitVal,
    });

    setFieldValue("invoice_no", values.invoice_no);
    setFieldValue("invoice_date", values.invoice_date);
    setFieldValue("due_date", values.due_date);
    setFieldValue("due_days", values.due_days);
    setFieldValue("bill_amt", values.bill_amt);
    setFieldValue("invoice_paid_amt", values.invoice_paid_amt);
    setFieldValue("invoice_bal_amt", values.invoice_bal_amt);
    setFieldValue("type", values.b_purchase_rate);
  };

  removeOpeningBalRow = (index) => {
    // const list = [...shippingList];
    // list.splice(index, 1);

    let { balanceList, rOList } = this.state;
    let list = balanceList.filter((v, i) => i != index);
    let sobj = balanceList.find((v, i) => i == index);
    rOList = [...rOList, sobj];
    this.setState({ balanceList: list, rOList: rOList }, () => {
      console.log("shiplist removed->", this.state.rOList);
    });
  };

  clearOpeningBalData = (setFieldValue) => {
    if (this.openingBalRef.current) {
      this.openingBalRef.current.setFieldValue("index", -1);
      this.openingBalRef.current.setFieldValue("id", 0);
      this.openingBalRef.current.setFieldValue("invoice_no", "");
      this.openingBalRef.current.setFieldValue("invoice_date", "");
      this.openingBalRef.current.setFieldValue("due_date", "");
      this.openingBalRef.current.setFieldValue("due_days", "");
      this.openingBalRef.current.setFieldValue("bill_amt", "");
      this.openingBalRef.current.setFieldValue("invoice_paid_amt", "");
      this.openingBalRef.current.setFieldValue("invoice_bal_amt", 0);
      // this.openingBalRef.current.setFieldValue("type", "");
      this.setState({ invoiceBalAmt: 0, invoiceBillAmt: 0, invoicePaidBal: 0 });
    }
  };

  duplicateInvoiceNo = (invoiceDate, invoiceNo) => {
    const { balanceList } = this.state;
    let date = moment(invoiceDate).format("DD/MM/YYYY");
    // date = moment(date).format("DD/MM/YYYY");
    // let date = invoiceDate;
    // let date = moment(invoiceDate).format("YYYY-MM-DD");
    balanceList.map((next) => {
      console.warn(moment(next.invoice_date).format("DD/MM/YYYY"));
      if (
        date === moment(next.invoice_date).format("DD/MM/YYYY") &&
        next.invoice_no === invoiceNo
      ) {
        MyNotifications.fire(
          {
            show: true,
            icon: "warning",
            title: "Warning",
            msg: "Invoice already exist",
            // is_button_show: false,
            is_timeout: true,
            delay: 1000,
          },
          () => {}
        );
        setTimeout(() => {
          this.invoiceRef.current?.focus();
        }, 1500);
        if (this.openingBalRef.current) {
          this.openingBalRef.current.setFieldValue("invoice_no", invoiceNo);
          this.openingBalRef.current.setFieldValue("invoice_date", invoiceDate);
        }
      }
    });
  };
  handleTableRow(event, setFieldValue) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let { ledgerModalStateChange, transactionType, invoice_data, ledgerData } =
      this.props;
    const k = event.keyCode;
    if (k === 40) {
      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));

        let index = JSON.parse(cuurentProduct.getAttribute("tabIndex"));
        this.openingBalanceUpdate(selectedLedger);
        // this.openingBalanceUpdate(
        //   selectedLedger, setFieldValue
        // );
      }
    }
  }

  render() {
    const {
      undervalue,
      balancingOpt,
      stateOpt,
      countryOpt,
      initVal,
      initValS,
      GSTTypeOpt,
      bankList,
      gstList,
      deptList,
      shippingList,
      billingList,
      rList,
      rBList,
      rSList,
      deptRList,
      licensesList,
      removeGstList,
      removeDeptList,
      removeShippingList,
      removeBillingList,
      removebankList,
      removelicensesList,
      areaLst,
      salesmanLst,
      errorArrayBorder,
      salesMaster,
      areaMaster,
      initValArea,
      opnBalModalShow,
      balanceInitVal,
      balanceList,
      openingBal,
      removeBalanceList,
      rOList,
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

          //  if (this.state.gstList.length <= 0) {
          // if (
          //   values.isTaxation
          //   // values.isTaxation.value == true
          //   // values.pan_no == ""
          // ) {
          //   errors.pan_no = "PAN required";
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid PAN No";
          // }
          //  }

          // if (

          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.registraion_type == ""
          // ) {
          //   errors.registraion_type = "Type required";
          // } else if (
          //   !values.registraion_type == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.registraion_type)
          // ) {
          //   errors.registraion_type = "Type required";
          // }

          // if (
          //   values.isTaxation &&
          //   // values.isTaxation.value == true &&
          //   values.gstin == ""
          //   // this.state.gstList.length < 0
          // ) {
          //   errors.gstin = "Type required";
          // } else if (
          //   !values.gstin == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.gstin)
          // ) {
          //   errors.gstin = "Type required";
          // }

          // console.log(typeof values.credit_days);
          if (parseInt(values.credit_days) > 0) {
            if (!values.applicable_from) {
              errors.applicable_from = "required";
            }
          }
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
          if (!values.ledger_name) {
            errors.ledger_name = "required";
          }

          // if (!values.ledger_name) {
          //   errors.ledger_name = "Ledger name is required";
          // } else if (!/^(([a-zA-Z\s]))+$/.test(values.ledger_name)) {
          //   errors.ledger_name = "Invalid Ledger Name.";
          // }
          // if (!values.supplier_code) {
          //   errors.supplier_code = "required";
          // }
          if (!values.is_private) {
            errors.is_private = " required";
          }
          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.pan_no == ""
          // ) {
          //   errors.pan_no = "PAN required";
          // } else if (
          //   !values.pan_no == "" &&
          //   !/^([A-Z]){5}\d{4}([A-Z]){1}/i.test(values.pan_no)
          // ) {
          //   errors.pan_no = "Invalid PAN No";
          // }

          // if (
          //   values.isTaxation &&
          //   values.isTaxation.value == true &&
          //   values.registraion_type == ""
          // ) {
          //   errors.registraion_type = "Type required";
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
          //   errors.gstin = "Type required";
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
          if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email_id)
          ) {
            errors.email_id = "Invalid email address";
          }
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Invalid email address";
          }
          if (/^[0-9\b]+$/.test(values.phone_no)) {
            errors.phone_no = "Invalid Mobile No.";
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
      <div id="example-collapse-text" className="new_ledger_create_style p-0">
        <div className="main-div mb-2 m-0 px-2">
          {/* <h4 className="form-header">Update Ledger</h4> */}
          <Formik
            // validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={initVal}
            innerRef={this.myRef}
            // validate={validate}
            validationSchema={Yup.object().shape({})}
            onSubmit={(values, { resetForm }) => {
              if (values.ledger_name.trim()) {
                let stateIdFlag = true;
                if (
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                  "sundry_debtors"
                ) {
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
                          // is_button_show: true,
                          is_timeout: true,
                          delay: 1500,
                        });
                        // setTimeout(() => {
                        //   this.gstBtnRef.current?.focus();
                        // }, 1000);
                        stateIdFlag = false;
                      }
                      // else if (gstList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add GST Row / Clear. ",
                      //     // is_button_show: true,
                      //     is_timeout: true,
                      //     delay: 1500,
                      //   });
                      //   // setTimeout(() => {
                      //   //   this.gstBtnRef.current?.focus();
                      //   // }, 1000);
                      //   stateIdFlag = false;
                      // }
                    }
                  }

                  if (values.isLicense === true) {
                    if (values.licenses_num == "" && licensesList.length == 0) {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Add / Disable License Row ",
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        this.licenseTypeRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    } else if (values.licenses_num !== "") {
                      if (licensesList.length == 0) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add License Row / Clear. ",
                          is_button_show: true,
                          // is_timeout: true,
                          // delay: 1000,
                        });
                        stateIdFlag = false;
                      }
                      // else if (licensesList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add GST Row / Clear. ",
                      //     is_button_show: true,
                      //     // is_timeout: true,
                      //     // delay: 1000,
                      //   });
                      //   stateIdFlag = false;
                      // }
                    }
                  }

                  if (values.isDepartment === true) {
                    if (values.dept == "" && deptList.length == 0) {
                      // alert("Please Add GST Row. ");
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Add / Disable Department Row ",
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        this.deptRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    } else if (values.dept !== "") {
                      if (deptList.length == 0) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add GST Department / Clear. ",
                          is_button_show: true,
                          // is_timeout: true,
                          // delay: 1000,
                        });
                        // setTimeout(() => {
                        //   this.gstBtnRef.current?.focus();
                        // }, 1000);
                        stateIdFlag = false;
                      }
                      // else if (deptList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add GST Department / Clear. ",
                      //     is_button_show: true,
                      //     // is_timeout: true,
                      //     // delay: 1000,
                      //   });
                      //   // setTimeout(() => {
                      //   //   this.gstBtnRef.current?.focus();
                      //   // }, 1000);
                      //   stateIdFlag = false;
                      // }
                    }
                  }

                  if (values.isBankDetails === true) {
                    if (values.bank_name == "" && bankList.length == 0) {
                      // alert("Please Add GST Row. ");
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Add / Disable Bank Row ",
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        this.bankRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    } else if (values.bank_name !== "") {
                      if (bankList.length == 0) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add Bank Row / Clear. ",
                          is_button_show: true,
                          // is_timeout: true,
                          // delay: 1000,
                        });
                        stateIdFlag = false;
                      }
                      // else if (bankList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add Bank Row / Clear. ",
                      //     is_button_show: true,
                      //     // is_timeout: true,
                      //     // delay: 1000,
                      //   });
                      //   stateIdFlag = false;
                      // }
                    }
                  }

                  if (values.isShippingDetails === true) {
                    if (
                      values.shipping_address == "" &&
                      shippingList.length == 0
                    ) {
                      // alert("Please Add GST Row. ");
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Add / Disable Shipping Row ",
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        this.shippingRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    } else if (values.shipping_address !== "") {
                      if (shippingList.length == 0) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add Shipping Row / Clear. ",
                          is_button_show: true,
                          // is_timeout: true,
                          // delay: 1000,
                        });
                        stateIdFlag = false;
                      }
                      //  else if (shippingList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add Shipping Row / Clear. ",
                      //     is_button_show: true,
                      //     // is_timeout: true,
                      //     // delay: 1000,
                      //   });
                      //   stateIdFlag = false;
                      // }
                    }
                  }
                } else if (
                  values.underId.ledger_form_parameter_slug.toLowerCase() ==
                  "sundry_creditors"
                ) {
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
                          // is_button_show: true,
                          is_timeout: true,
                          delay: 1000,
                        });
                        // setTimeout(() => {
                        //   this.gstBtnRef.current?.focus();
                        // }, 1000);
                        stateIdFlag = false;
                      }
                      // else if (gstList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add GST Row / Clear. ",
                      //     // is_button_show: true,
                      //     is_timeout: true,
                      //     delay: 1000,
                      //   });
                      //   // setTimeout(() => {
                      //   //   this.gstBtnRef.current?.focus();
                      //   // }, 1000);
                      //   stateIdFlag = false;
                      // }
                    }
                  }

                  if (values.isLicense === true) {
                    if (values.licenses_num == "" && licensesList.length == 0) {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Add / Disable License Row ",
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        this.licenseTypeRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    } else if (values.licenses_num !== "") {
                      if (licensesList.length == 0) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add License Row / Clear. ",
                          is_button_show: true,
                          // is_timeout: true,
                          // delay: 1000,
                        });
                        stateIdFlag = false;
                      }
                      // else if (licensesList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add GST Row / Clear. ",
                      //     is_button_show: true,
                      //     // is_timeout: true,
                      //     // delay: 1000,
                      //   });
                      //   stateIdFlag = false;
                      // }
                    }
                  }

                  if (values.isDepartment === true) {
                    if (values.dept == "" && deptList.length == 0) {
                      // alert("Please Add GST Row. ");
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Add / Disable Department Row ",
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        this.deptRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    } else if (values.dept !== "") {
                      if (deptList.length == 0) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add GST Department / Clear. ",
                          is_button_show: true,
                          // is_timeout: true,
                          // delay: 1000,
                        });
                        // setTimeout(() => {
                        //   this.gstBtnRef.current?.focus();
                        // }, 1000);
                        stateIdFlag = false;
                      }
                      //  else if (deptList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add GST Department / Clear. ",
                      //     is_button_show: true,
                      //     // is_timeout: true,
                      //     // delay: 1000,
                      //   });
                      //   // setTimeout(() => {
                      //   //   this.gstBtnRef.current?.focus();
                      //   // }, 1000);
                      //   stateIdFlag = false;
                      // }
                    }
                  }

                  if (values.isBankDetails === true) {
                    if (values.bank_name == "" && bankList.length == 0) {
                      // alert("Please Add GST Row. ");
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Add / Disable Bank Row ",
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        this.bankRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    } else if (values.bank_name !== "") {
                      if (bankList.length == 0) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add Bank Row / Clear. ",
                          is_button_show: true,
                          // is_timeout: true,
                          // delay: 1000,
                        });
                        stateIdFlag = false;
                      }
                      // else if (bankList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add Bank Row / Clear. ",
                      //     is_button_show: true,
                      //     // is_timeout: true,
                      //     // delay: 1000,
                      //   });
                      //   stateIdFlag = false;
                      // }
                    }
                  }

                  if (values.isShippingDetails === true) {
                    if (
                      values.shipping_address == "" &&
                      shippingList.length == 0
                    ) {
                      // alert("Please Add GST Row. ");
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Please Add / Disable Shipping Row ",
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1000,
                      });
                      setTimeout(() => {
                        this.shippingRef.current?.focus();
                      }, 1000);
                      stateIdFlag = false;
                    } else if (values.shipping_address !== "") {
                      if (shippingList.length == 0) {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Please Add Shipping Row / Clear. ",
                          is_button_show: true,
                          // is_timeout: true,
                          // delay: 1000,
                        });
                        stateIdFlag = false;
                      }
                      // else if (shippingList.length > 0) {
                      //   MyNotifications.fire({
                      //     show: true,
                      //     icon: "error",
                      //     title: "Error",
                      //     msg: "Please Add Shipping Row / Clear. ",
                      //     is_button_show: true,
                      //     // is_timeout: true,
                      //     // delay: 1000,
                      //   });
                      //   stateIdFlag = false;
                      // }
                    }
                  }
                }
                if (stateIdFlag == true) {
                  MyNotifications.fire(
                    {
                      show: true,
                      icon: "confirm",
                      title: "Confirm",
                      msg: "Do you want to Update ?",
                      is_button_show: false,
                      is_timeout: false,
                      handleSuccessFn: () => {
                        const formData = new FormData();
                        formData.append("id", values.id);

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
                        if (
                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_debtors"
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
                          if (values.doa != null && undefined) {
                            formData.append("doa", values.doa);
                          }
                          if (values.route != null) {
                            formData.append("route", values.route);
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
                          if (values.supplier_code != null) {
                            formData.append(
                              "supplier_code",
                              values.supplier_code
                            );
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
                          let opnremovedlist = [];
                          opnremovedlist = rOList.map((v) => v.id);
                          console.log("Removed Ship List->", rOList);
                          formData.append(
                            "removeOpeningList",
                            JSON.stringify(opnremovedlist)
                          );

                          if (balanceList.length > 0) {
                            let opnDetails = balanceList.map((v, i) => {
                              let obj = {};
                              if (v.id != "" && v.id != null) {
                                obj["id"] = v.id;
                              } else {
                                obj["id"] = 0;
                              }
                              obj["bill_amt"] = v.bill_amt;
                              obj["due_days"] = v.due_days;
                              obj["invoice_bal_amt"] = v.invoice_bal_amt;
                              obj["invoice_no"] = v.invoice_no;
                              obj["invoice_paid_amt"] = v.invoice_paid_amt;
                              obj["type"] = v.type;
                              obj["invoice_date"] = v.invoice_date
                                ? moment(v.invoice_date).format("YYYY-MM-DD")
                                : "";
                              obj["due_date"] = v.due_date
                                ? moment(v.due_date).format("YYYY-MM-DD")
                                : "";
                              return obj;
                            });

                            console.log(
                              "balance List ============>>>>>>>>>>>",
                              JSON.stringify(opnDetails)
                            );
                            formData.append(
                              "opening_bal_invoice_list",
                              JSON.stringify(opnDetails)
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
                          if (values.pincode != null && values.pincode != "") {
                            formData.append("pincode", values.pincode);
                          }
                          if (values.city != null) {
                            formData.append("city", values.city);
                          }
                          if (values.email_id && values.email_id != null) {
                            formData.append("email", values.email_id);
                          }
                          if (values.phone_no && values.phone_no != null) {
                            formData.append("mobile_no", values.phone_no);
                          }
                          if (
                            values.whatsapp_no &&
                            values.whatsapp_no != null
                          ) {
                            formData.append("whatsapp_no", values.whatsapp_no);
                          }
                          if (values.date_of_registartion != null) {
                            formData.append(
                              "reg_date",
                              values.date_of_registartion
                                ? moment(
                                    values.date_of_registartion,
                                    "DD/MM/YYYY"
                                  ).format("YYYY-MM-DD")
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
                            formData.append("credit_days", values.credit_days);
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
                          if (values.salesrate && values.salesrate != null) {
                            formData.append(
                              "salesrate",
                              values.salesrate.value
                            );
                          }
                          if (values.fssai != null) {
                            formData.append("fssai", values.fssai);
                          }
                          if (values.isGST != null) {
                            formData.append("isGST", values.isGST);
                          } else {
                            formData.append("isGST", false);
                          }

                          if (values.pan_no != null) {
                            formData.append("pan_no", values.pan_no);
                          }

                          let gstdetails = [];
                          // if (values.isGST == true) {
                          // if (values.registraion_type != null) {
                          //   formData.append(
                          //     "registration_type",
                          //     values.registraion_type.value
                          //   );
                          // }
                          console.log("gst", JSON.stringify(gstList));

                          gstdetails = gstList.map((v, i) => {
                            let obj = {};
                            if (v.id != "" && v.id != null) {
                              obj["bid"] = v.id;
                            } else {
                              obj["bid"] = 0;
                            }
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
                          let gstremoveddetails = [];

                          gstremoveddetails = rList.map((v) => v.id);
                          console.log("RLIST ------>", rList);

                          console.log("GSTDETAILS", gstremoveddetails);
                          // gstList

                          // formData.append("gstdetails", JSON.stringify(gstdetails));
                          formData.append(
                            "removeGstList",
                            JSON.stringify(gstremoveddetails)
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
                          let billingremovedlist = [];
                          billingremovedlist = rBList.map((v) => v.id);
                          console.log("Removed billing", billingremovedlist);
                          formData.append(
                            "removeBillingList",
                            JSON.stringify(billingremovedlist)
                          );

                          if (values.isLicense != null) {
                            formData.append("isLicense", values.isLicense);
                          } else {
                            formData.append("isLicense", false);
                          }

                          let licensesDetails = licensesList.map((v, i) => {
                            let obj = {};
                            if (v.lid != "" && v.lid != null) {
                              obj["lid"] = v.lid;
                            } else {
                              obj["lid"] = 0;
                            }
                            obj["licences_type"] = v.licences_type;
                            obj["licenses_num"] = v.licenses_num;
                            obj["licenses_exp"] = v.licenses_exp
                              ? moment(v.licenses_exp, "DD/MM/YYYY").format(
                                  "YYYY-MM-DD"
                                )
                              : "";
                            return obj;
                          });

                          formData.append(
                            "licensesDetails",
                            JSON.stringify(licensesDetails)
                          );

                          let licensesRemovedlist = [];
                          licensesRemovedlist = removelicensesList.map(
                            (v) => v.lid
                          );
                          console.log(
                            "Licenses Removed---->",
                            licensesRemovedlist,
                            removelicensesList
                          );
                          formData.append(
                            "removelicensesList",
                            JSON.stringify(licensesRemovedlist)
                          );

                          if (values.isShippingDetails != null) {
                            formData.append(
                              "isShippingDetails",
                              values.isShippingDetails
                            );
                          } else {
                            formData.append("isShippingDetails", false);
                          }

                          // if(values.isShippingDetails==true)
                          // {
                          let shippingDetail = [];

                          shippingDetail = shippingList.map((v, i) => {
                            let obj = {};
                            if (v.sid != "" && v.sid != null) {
                              obj["sid"] = v.sid;
                            } else {
                              obj["sid"] = 0;
                            }
                            obj["district"] = parseInt(v.district);

                            if (v.shipping_address != "")
                              obj["shipping_address"] = v.shipping_address;
                            console.log("obj", obj);
                            return obj;
                          });

                          console.log("shippingDetail", shippingDetail);
                          formData.append(
                            "shippingDetails",
                            JSON.stringify(shippingDetail)
                          );
                          // }
                          let shipremovedlist = [];
                          shipremovedlist = rSList.map((v) => v.sid);
                          console.log("Removed Ship List->", rSList);
                          formData.append(
                            "removeShippingList",
                            JSON.stringify(shipremovedlist)
                          );

                          console.log("bankList", JSON.stringify(bankList));
                          if (values.isBankDetails != null) {
                            formData.append(
                              "isBankDetails",
                              values.isBankDetails
                            );
                          } else {
                            formData.append("isBankDetails", false);
                          }
                          // if(values.isBankDetails==true)
                          // {
                          formData.append(
                            "bankDetails",
                            JSON.stringify(bankList)
                          );
                          // }
                          let bankRemovedlist = [];
                          bankRemovedlist = removebankList.map((v) => v.bid);
                          console.log(
                            "Bank Removed billing",
                            bankRemovedlist,
                            removebankList
                          );
                          formData.append(
                            "removeBankList",
                            JSON.stringify(bankRemovedlist)
                          );

                          if (values.isDepartment != null) {
                            formData.append(
                              "isDepartment",
                              values.isDepartment
                            );
                          } else {
                            formData.append("isDepartment", false);
                          }
                          // if(values.isDepartment==true)
                          //   {
                          let deptDetails = [];
                          deptDetails = deptList.map((v, i) => {
                            console.log("v--dept details", v);
                            let obj = {};
                            if (v.did != "" && v.did != null) {
                              obj["did"] = v.did;
                            } else {
                              obj["did"] = 0;
                            }
                            obj["dept"] = v.dept;
                            obj["contact_person"] = v.contact_person;
                            obj["contact_no"] = v.contact_no;

                            if (v.email != "") obj["email"] = v.email;

                            return obj;
                          });
                          formData.append(
                            "deptDetails",
                            JSON.stringify(deptDetails)
                          );
                          console.log(
                            "deptDetails",
                            JSON.stringify(deptDetails)
                          );
                          // }
                          let deptRemovedList = [];
                          deptRemovedList = deptRList.map((v) => v.did);
                          console.log("Removed Dept List->", deptRList);
                          formData.append(
                            "removeDeptList",
                            JSON.stringify(deptRemovedList)
                          );
                          //   }
                          // });
                        }

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

                          let opnremovedlist = [];
                          opnremovedlist = rOList.map((v) => v.id);
                          console.log("Removed Ship List->", rOList);
                          formData.append(
                            "removeOpeningList",
                            JSON.stringify(opnremovedlist)
                          );
                          if (balanceList.length > 0) {
                            let opnDetails = balanceList.map((v, i) => {
                              let obj = {};
                              if (v.id != "" && v.id != null) {
                                obj["id"] = v.id;
                              } else {
                                obj["id"] = 0;
                              }
                              obj["bill_amt"] = v.bill_amt;
                              obj["due_days"] = v.due_days;
                              obj["invoice_bal_amt"] = v.invoice_bal_amt;
                              obj["invoice_no"] = v.invoice_no;
                              obj["invoice_paid_amt"] = v.invoice_paid_amt;
                              obj["type"] = v.type;
                              obj["invoice_date"] = v.invoice_date
                                ? moment(v.invoice_date).format("YYYY-MM-DD")
                                : "";
                              obj["due_date"] = v.due_date
                                ? moment(v.due_date).format("YYYY-MM-DD")
                                : "";
                              return obj;
                            });

                            console.log(
                              "balance List ============>>>>>>>>>>>",
                              JSON.stringify(opnDetails)
                            );
                            formData.append(
                              "opening_bal_invoice_list",
                              JSON.stringify(opnDetails)
                            );
                          }
                          let openingBal = 0;
                          if (values.opening_balance_type == "dr") {
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

                          if (values.stateId != "" && values.stateId != null) {
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

                          if (values.pincode != null && values.pincode != "") {
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
                          if (
                            values.whatsapp_no != "" &&
                            values.whatsapp_no != null
                          )
                            formData.append("whatsapp_no", values.whatsapp_no);

                          formData.append(
                            "reg_date",
                            values.date_of_registartion
                              ? moment(
                                  values.date_of_registartion,
                                  "DD/MM/YYYY"
                                ).format("YYYY-MM-DD")
                              : ""
                          );

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
                            formData.append("credit_days", values.credit_days);
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
                          // if (
                          //   values.license_expiry != null &&
                          //   values.license_expiry != ""
                          // ) {
                          //   let fexp = moment(
                          //     values.license_expiry,
                          //     "DD/MM/YYYY"
                          //   ).toDate();
                          //   formData.append(
                          //     "licenseExpiryDate",
                          //     moment(new Date(fexp)).format("yyyy-MM-DD")
                          //   );
                          // }

                          if (values.isGST != null) {
                            formData.append("isGST", values.isGST);
                          }
                          if (values.pan_no != null) {
                            formData.append("pan_no", values.pan_no);
                          }

                          let gstdetails = [];
                          console.log("gst", JSON.stringify(gstList));

                          gstdetails = gstList.map((v, i) => {
                            let obj = {};
                            if (v.id != "" && v.id != null) {
                              obj["bid"] = v.id;
                            } else {
                              obj["bid"] = 0;
                            }
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

                          console.log("gstdetails", { gstdetails });

                          formData.append(
                            "gstdetails",
                            JSON.stringify(gstdetails)
                          );
                          let gstremoveddetails = [];

                          gstremoveddetails = rList.map((v) => v.id);
                          console.log("RLIST ------>", rList);

                          console.log("GSTDETAILS", gstremoveddetails);
                          // gstList

                          // formData.append("gstdetails", JSON.stringify(gstdetails));
                          formData.append(
                            "removeGstList",
                            JSON.stringify(gstremoveddetails)
                          );

                          let billingDetails = billingList.map((v, i) => {
                            let obj = {};
                            if (v.id != "" && v.id != null) {
                              obj["id"] = v.id;
                            } else {
                              obj["id"] = 0;
                            }
                            obj["district"] = v.district;
                            obj["billing_address"] = v.billing_address;
                            return obj;
                          });

                          formData.append(
                            "billingDetails",
                            JSON.stringify(billingDetails)
                          );
                          let billingremovedlist = [];
                          billingremovedlist = rBList.map((v) => v.id);
                          console.log("Removed billing", billingremovedlist);
                          formData.append(
                            "removeBillingList",
                            JSON.stringify(billingremovedlist)
                          );

                          if (values.isLicense != null) {
                            formData.append("isLicense", values.isLicense);
                          } else {
                            formData.append("isLicense", false);
                          }
                          let licensesDetails = licensesList.map((v, i) => {
                            let obj = {};
                            if (v.lid != "" && v.lid != null) {
                              obj["lid"] = v.lid;
                            } else {
                              obj["lid"] = 0;
                            }
                            obj["licences_type"] = v.licences_type;
                            obj["licenses_num"] = v.licenses_num;
                            obj["licenses_exp"] = v.licenses_exp
                              ? moment(v.licenses_exp, "DD/MM/YYYY").format(
                                  "YYYY-MM-DD"
                                )
                              : "";
                            return obj;
                          });

                          formData.append(
                            "licensesDetails",
                            JSON.stringify(licensesDetails)
                          );

                          let licensesRemovedlist = [];
                          licensesRemovedlist = removelicensesList.map(
                            (v) => v.lid
                          );
                          console.log(
                            "Licenses Removed---->",
                            licensesRemovedlist,
                            removelicensesList
                          );
                          formData.append(
                            "removelicensesList",
                            JSON.stringify(licensesRemovedlist)
                          );

                          if (values.isShippingDetails != null) {
                            formData.append(
                              "isShippingDetails",
                              values.isShippingDetails
                            );
                          } else {
                            formData.append("isShippingDetails", false);
                          }
                          let shippingDetail = [];
                          // if(values.isShippingDetails==true)
                          //   {
                          shippingDetail = shippingList.map((v, i) => {
                            let obj = {};
                            if (v.sid != "" && v.sid != null) {
                              obj["sid"] = v.sid;
                            } else {
                              obj["sid"] = 0;
                            }
                            obj["district"] = parseInt(v.district);

                            if (v.shipping_address != "")
                              obj["shipping_address"] = v.shipping_address;
                            console.log("obj", obj);
                            return obj;
                          });
                          console.log("shippingDetail", shippingDetail);
                          formData.append(
                            "shippingDetails",
                            JSON.stringify(shippingDetail)
                          );
                          // }
                          let shipremovedlist = [];
                          shipremovedlist = rSList.map((v) => v.sid);
                          console.log("Removed Ship List->", rSList);
                          formData.append(
                            "removeShippingList",
                            JSON.stringify(shipremovedlist)
                          );

                          if (values.isDepartment != null) {
                            formData.append(
                              "isDepartment",
                              values.isDepartment
                            );
                          } else {
                            formData.append("isDepartment", false);
                          }

                          let deptDetails = [];
                          // if(values.isDepartment==true)
                          //   {
                          deptDetails = deptList.map((v, i) => {
                            let obj = {};
                            if (v.did != "" && v.did != null) {
                              obj["did"] = v.did;
                            } else {
                              obj["did"] = 0;
                            }
                            obj["dept"] = v.dept;
                            obj["contact_person"] = v.contact_person;
                            obj["contact_no"] = v.contact_no;

                            if (v.email != "") obj["email"] = v.email;

                            return obj;
                          });
                          formData.append(
                            "deptDetails",
                            JSON.stringify(deptDetails)
                          );
                          // }
                          let deptRemovedList = [];
                          deptRemovedList = deptRList.map((v) => v.did);
                          console.log("Removed Dept List->", deptRList);
                          formData.append(
                            "removeDeptList",
                            JSON.stringify(deptRemovedList)
                          );

                          console.log(
                            "deptDetails",
                            JSON.stringify(deptDetails)
                          );
                          console.log("bankList", JSON.stringify(bankList));

                          if (values.isBankDetails != null) {
                            formData.append(
                              "isBankDetails",
                              values.isBankDetails
                            );
                          } else {
                            formData.append("isBankDetails", false);
                          }
                          // if(values.isBankDetails==true)
                          // {
                          formData.append(
                            "bankDetails",
                            JSON.stringify(bankList)
                          );
                          // }
                          let bankRemovedlist = [];
                          bankRemovedlist = removebankList.map((v) => v.bid);
                          console.log(
                            "Bank Removed billing",
                            bankRemovedlist,
                            removebankList
                          );
                          formData.append(
                            "removeBankList",
                            JSON.stringify(bankRemovedlist)
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
                          // formData.append("mailing_name", values.mailing_name);

                          formData.append(
                            "opening_bal_type",
                            values.opening_balance_type
                              ? values.opening_balance_type == "dr"
                                ? "Dr"
                                : "Cr"
                              : "Dr"
                          );
                          if (values.isTaxation != null) {
                            formData.append("taxable", values.isTaxation.value);
                          }

                          if (values.isTaxation.value == true) {
                            formData.append("gstin", values.gstin);
                          }
                          formData.append(
                            "opening_bal",
                            values.opening_balance ? values.opening_balance : 0
                          );
                          // formData.append(
                          //   "balancing_method",
                          //   values.opening_balancing_method.value
                          // );
                          if (values.address != null) {
                            formData.append("address", values.address);
                          }

                          if (values.stateId != "" && values.stateId != null) {
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
                          if (values.pincode != null && values.pincode != "") {
                            formData.append("pincode", values.pincode);
                          }
                          if (values.city != null) {
                            formData.append("city", values.city);
                          }

                          if (values.email_id != "" && values.email_id) {
                            formData.append("email", values.email_id);
                          }
                          if (values.phone_no != null)
                            formData.append("mobile_no", values.phone_no);

                          if (values.isTaxation != null) {
                            formData.append("taxable", values.isTaxation.value);
                          }
                          if (values.isTaxation == "true") {
                            formData.append("gstin", values.gstin);
                            // formData.append(
                            //   "registration_type",
                            //   values.registraion_type.value
                            // );
                            // formData.append("pancard_no", values.pan_no);
                            // formData.append(
                            //   "dateofregistartion",
                            //   moment(values.dateofregistartion).format("YYYY-MM-DD")
                            // );
                          }

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
                            formData.append("ifsc_code", values.bank_ifsc_code);
                          }
                          if (values.bank_branch != null) {
                            formData.append("bank_branch", values.bank_branch);
                          }
                        }

                        if (
                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "duties_taxes"
                        ) {
                          if (values.ledger_name != null) {
                            formData.append("ledger_name", values.ledger_name);
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
                          if (values.tax_type != null) {
                            formData.append("tax_type", values.tax_type.value);
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
                            values.opening_balance ? values.opening_balance : 0
                          );
                        }
                        if (
                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "assets"
                        ) {
                          if (values.ledger_name != null) {
                            formData.append("ledger_name", values.ledger_name);
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
                        }

                        if (
                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "others"
                        ) {
                          if (values.ledger_name != null) {
                            formData.append("ledger_name", values.ledger_name);
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
                          let openingBal = 0;
                          if (values.opening_balance_type == "dr") {
                            if (values.opening_balance > 0) {
                              openingBal = values.opening_balance * -1;
                            }
                          } else {
                            openingBal = values.opening_balance;
                          }
                          formData.append("opening_bal", openingBal);

                          if (values.address != null) {
                            formData.append("address", values.address);
                          }
                          if (values.stateId != "" && values.stateId != null) {
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
                          if (values.pincode != null && values.pincode != "") {
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
                          values.is_private != null ? values.is_private : false
                        );

                        for (let [name, value] of formData) {
                          console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                        }

                        editLedger(formData)
                          .then((response) => {
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
                              // this.initRow();
                              // eventBus.dispatch("page_change", {
                              //   from: "ledgeredit",
                              //   to: "ledgerlist",
                              // });

                              if (
                                this.state.source &&
                                this.state.source != ""
                              ) {
                                if (this.state.source.opType === "create") {
                                  eventBus.dispatch("page_change", {
                                    from: "ledgeredit",
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
                                    from: "ledgeredit",
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
                                    from: "ledgeredit",
                                    to: "ledgerlist",
                                    isNewTab: false,
                                    isCancel: true,
                                  });
                                }
                              } else {
                                // eventBus.dispatch("page_change", "ledgerlist");
                                eventBus.dispatch("page_change", {
                                  from: "ledgeredit",
                                  to: "ledgerlist",
                                  prop_data: {
                                    editId: this.state.edit_data.id,
                                    rowId: this.props.block.prop_data.rowId,
                                    selectedFilter:
                                      this.props.block.prop_data.selectedFilter,
                                    searchValue:
                                      this.props.block.prop_data.searchValue,
                                  },
                                  isCancel: true,
                                });
                              }
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
                            console.log("error", error);
                          });
                      },
                      handleFailFn: () => {},
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
                {/* {JSON.stringify(errors)} */}
                {/* {JSON.stringify(values)} */}

                <Row className="top_bar">
                  <Card className="top_card_style">
                    <Card.Body>
                      <Row>
                        <Col lg={2}>
                          <Row>
                            <Col lg={4} className="my-auto">
                              <Form.Label>
                                Ledger Type{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group
                                className=""
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    if (values.underId == "") {
                                      this.selectRefLedTyp.current?.focus();
                                    } else {
                                      this.handleKeyDown(
                                        e,
                                        values.underId != ""
                                          ? values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                            "sundry_creditors"
                                            ? "supplier_code_sundry_creditors"
                                            : values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                              "sundry_debtors"
                                            ? "supplier_code_sundry_debtors"
                                            : "ledger_name"
                                          : "underId"
                                      );
                                    }
                                  }
                                }}
                              >
                                <Select
                                  ref={this.selectRefLedTyp}
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
                                        setFieldValue(
                                          "isTaxation",
                                          ledger_type_options[1]
                                        );
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
                                        setFieldValue(
                                          "isTaxation",
                                          ledger_type_options[1]
                                        );
                                        setFieldValue("pan_no", "");
                                      }
                                    }
                                  }}
                                  name="underId"
                                  // styles={customStyles}
                                  styles={ledger_select}
                                  options={undervalue}
                                  value={values.underId}
                                  invalid={errors.underId ? true : false}
                                />
                                {/* <p className="displaygroup pl-4 mb-0">
                          {values.underId
                            ? values.underId.associates_id
                              ? values.underId.sub_principle_id
                                ? values.underId.subprinciple_name
                                : values.underId.principle_name
                              : values.underId.principle_name
                            : values.underId.principle_name}
                        </p> */}
                                <span className="text-danger">
                                  {errors.underId}
                                </span>
                              </Form.Group>
                            </Col>
                            {/*  */}
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
                                        type="text"
                                        autoFocus="true"
                                        placeholder="Code"
                                        id="supplier_code_sundry_creditors"
                                        name="supplier_code"
                                        className="text-box"
                                        // className={`${
                                        //   errorArrayBorder[1] == "Y"
                                        //     ? "border border-danger text-box"
                                        //     : "text-box"
                                        // }`}
                                        onChange={handleChange}
                                        value={values.supplier_code}
                                        isValid={
                                          touched.supplier_code &&
                                          !errors.supplier_code
                                        }
                                        isInvalid={!!errors.supplier_code}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          if (e.target.value) {
                                            // this.setErrorBorder(1, "");
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
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            this.handleKeyDown(
                                              e,
                                              "ledger_name"
                                            );
                                          }
                                        }}
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
                                    <Form.Label>
                                      Code{" "}
                                      {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                  </Col>
                                  <Col lg={10}>
                                    <Form.Group>
                                      <Form.Control
                                        autoFocus="true"
                                        type="text"
                                        placeholder="Code"
                                        id="supplier_code_sundry_debtors"
                                        name="supplier_code"
                                        className="text-box"
                                        // className={`${
                                        //   errorArrayBorder[1] == "Y"
                                        //     ? "border border-danger text-box"
                                        //     : "text-box"
                                        // }`}
                                        onChange={handleChange}
                                        value={values.supplier_code}
                                        isValid={
                                          touched.supplier_code &&
                                          !errors.supplier_code
                                        }
                                        isInvalid={!!errors.supplier_code}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          if (e.target.value) {
                                            // this.setErrorBorder(1, "");
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
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            this.handleKeyDown(
                                              e,
                                              "ledger_name"
                                            );
                                          }
                                        }}
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
                        <Col lg={3}>
                          <Row>
                            <Col lg={3} className="my-auto">
                              <Form.Label>Name </Form.Label>
                              <span className="text-danger">*</span>
                            </Col>
                            <Col lg={9}>
                              <Form.Group>
                                <Form.Control
                                  autoFocus="true"
                                  type="text"
                                  placeholder="Ledger Name"
                                  name="ledger_name"
                                  id="ledger_name"
                                  // className={`${
                                  //   errorArrayBorder[0] == "Y"
                                  //     ? "border border-danger text-box"
                                  //     : "text-box"
                                  // }`}
                                  className="text-box"
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
                                      // this.setErrorBorder(0, "Y");
                                      document
                                        .getElementById("ledger_name")
                                        .focus();
                                    }
                                    v.target.value = handleDataCapitalised(
                                      v.target.value
                                    );
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "ledger_name",
                                      v.target.value
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
                                  onKeyDown={(e) => {
                                    if (e.key === "Tab" && !e.target.value)
                                      e.preventDefault();
                                    else if (e.keyCode == 13) {
                                      if (values.ledger_name)
                                        // this.selectRefBalanceType.current?.focus()
                                        values.underId != ""
                                          ? values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                            "sundry_creditors"
                                            ? this.selectRefBalanceType.current?.focus()
                                            : values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                              "sundry_debtors"
                                            ? this.selectRefBalanceType.current?.focus()
                                            : document
                                                .getElementById(
                                                  "opening_balance"
                                                )
                                                .focus()
                                          : document
                                              .getElementById("ledger_name")
                                              .focus();
                                      // );
                                    }
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
                              <Col lg={2}>
                                <Row>
                                  <Col md={6} className="my-auto">
                                    <Form.Label>Balancing Method </Form.Label>
                                  </Col>
                                  <Col md={6}>
                                    <Form.Group
                                      className=""
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(
                                            e,
                                            "opening_balance"
                                          );
                                        }
                                      }}
                                    >
                                      <Select
                                        ref={this.selectRefBalanceType}
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
                                        value={values.opening_balancing_method}
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
                              <Col lg={2}>
                                <Row>
                                  <Col lg={6} className="my-auto">
                                    <Form.Label>Balancing Method </Form.Label>
                                  </Col>
                                  <Col lg={6}>
                                    <Form.Group
                                      className=""
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(
                                            e,
                                            "opening_balance"
                                          );
                                        }
                                      }}
                                    >
                                      <Select
                                        ref={this.selectRefBalanceType}
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
                                        value={values.opening_balancing_method}
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
                            <Col lg={3} className="my-auto">
                              <Form.Label>Opening Bal. </Form.Label>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="">
                                <InputGroup className="jointdropdown">
                                  <FormControl
                                    ref={this.selectRefBalanceType}
                                    placeholder="0"
                                    aria-label="Opening Balance"
                                    aria-describedby="basic-addon2"
                                    name="opening_balance"
                                    id="opening_balance"
                                    onChange={handleChange}
                                    className="text-box text-end"
                                    value={
                                      values.opening_balance === 0
                                        ? ""
                                        : values.opening_balance
                                    }
                                    isValid={
                                      touched.opening_balance &&
                                      !errors.opening_balance
                                    }
                                    isInvalid={!!errors.opening_balance}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        // if (values.opening_balance > 0)
                                        this.handleKeyDown(
                                          e,
                                          "opening_balance_type"
                                        );
                                        // else e.preventDefault();
                                      }
                                    }}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.opening_balance_type}
                                  </Form.Control.Feedback>
                                </InputGroup>
                                <span className="text-danger errormsg">
                                  {errors.opening_balance &&
                                    errors.opening_balance}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col lg={3} className="ps-0">
                              <Form.Select
                                as="select"
                                // styles={ledger_select}
                                onChange={(e) => {
                                  setFieldValue(
                                    "opening_balance_type",
                                    e.target.value
                                  );
                                }}
                                onBlur={(e) => {
                                  let balMethod = 0;
                                  if (values.opening_balancing_method != null) {
                                    balMethod = values.opening_balancing_method;
                                    console.log(
                                      "balancing method =====:::::::::",
                                      balMethod
                                    );
                                    if (
                                      (values.opening_balance != 0 &&
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
                                      balanceInitVal["type"] = getSelectLabel(
                                        balanceType,
                                        e.target.value
                                      );
                                      this.setState({
                                        opnBalModalShow: true,
                                        openingBal: values.opening_balance,
                                        opeBalType: e.target.value,
                                      });
                                    }
                                  }
                                }}
                                name="opening_balance_type"
                                id="opening_balance_type"
                                className="select-text-box"
                                value={values.opening_balance_type}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    if (
                                      values.opening_balance > 0 &&
                                      values.hasOwnProperty(
                                        "opening_balancing_method"
                                      ) &&
                                      values.opening_balancing_method.label ==
                                        "Bill by Bill"
                                    ) {
                                      if (
                                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                        "sundry_debtors"
                                      ) {
                                        let { balanceInitVal } = this.state;
                                        balanceInitVal["type"] = getSelectLabel(
                                          balanceType,
                                          e.target.value
                                        );
                                        this.setState({
                                          opnBalModalShow: true,
                                          balanceInitVal: balanceInitVal,
                                          openingBal: values.opening_balance,
                                          opeBalType: e.target.value,
                                        });
                                        this.handleKeyDown(
                                          e,
                                          "mailing_name_sundry_debtors"
                                        );
                                      } else if (
                                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                        "sundry_creditors"
                                      ) {
                                        let { balanceInitVal } = this.state;
                                        balanceInitVal["type"] = getSelectLabel(
                                          balanceType,
                                          e.target.value
                                        );
                                        this.setState({
                                          opnBalModalShow: true,
                                          balanceInitVal: balanceInitVal,
                                          openingBal: values.opening_balance,
                                          opeBalType: e.target.value,
                                        });
                                        this.handleKeyDown(
                                          e,
                                          "mailing_name_sundry_creditors"
                                        );
                                      } else {
                                        if (
                                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                          "sundry_debtors"
                                        ) {
                                          this.handleKeyDown(
                                            e,
                                            "mailing_name_sundry_debtors"
                                          );
                                        } else if (
                                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                          "sundry_creditors"
                                        ) {
                                          this.handleKeyDown(
                                            e,
                                            "mailing_name_sundry_creditors"
                                          );
                                        } else if (
                                          values.underId &&
                                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                            "bank_account"
                                        )
                                          this.SelectRefTaxation.current?.focus();
                                        else if (
                                          values.underId &&
                                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                            "duties_taxes"
                                        )
                                          this.selectRefTaxType.current?.focus();
                                        else if (
                                          values.underId &&
                                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                            "assets"
                                        )
                                          this.handleKeyDown(
                                            e,
                                            "assets_submit_btn"
                                          );
                                        else if (
                                          values.underId &&
                                          values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                            "others"
                                        )
                                          this.handleKeyDown(
                                            e,
                                            "others_submit_btn"
                                          );
                                      }
                                    } else {
                                      if (
                                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                        "sundry_debtors"
                                      ) {
                                        this.handleKeyDown(
                                          e,
                                          "mailing_name_sundry_debtors"
                                        );
                                      } else if (
                                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                        "sundry_creditors"
                                      ) {
                                        this.handleKeyDown(
                                          e,
                                          "mailing_name_sundry_creditors"
                                        );
                                      } else if (
                                        values.underId &&
                                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                          "bank_account"
                                      )
                                        this.SelectRefTaxation.current?.focus();
                                      else if (
                                        values.underId &&
                                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                          "duties_taxes"
                                      )
                                        this.selectRefTaxType.current?.focus();
                                      else if (
                                        values.underId &&
                                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                          "assets"
                                      )
                                        this.handleKeyDown(
                                          e,
                                          "assets_submit_btn"
                                        );
                                      else if (
                                        values.underId &&
                                        values.underId.ledger_form_parameter_slug.toLowerCase() ==
                                          "others"
                                      )
                                        this.handleKeyDown(
                                          e,
                                          "others_submit_btn"
                                        );
                                    }
                                  }
                                }}
                              >
                                <option value="dr">Dr</option>
                                <option value="cr">Cr</option>
                              </Form.Select>
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
                                        ref={this.nameRef}
                                        type="text"
                                        placeholder="Registered Name"
                                        id="mailing_name_sundry_creditors"
                                        name="mailing_name"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.mailing_name}
                                        isValid={
                                          touched.mailing_name &&
                                          !errors.mailing_name
                                        }
                                        isInvalid={!!errors.mailing_name}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            this.handleKeyDown(e, "address");
                                          }
                                        }}
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.mailing_name}
                                      </span>
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
                                        // ref={this.addressRef}
                                        type="text"
                                        placeholder="Address"
                                        id="address"
                                        name="address"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.address}
                                        isValid={
                                          touched.address && !errors.address
                                        }
                                        // onInput={(e) => {
                                        //   e.target.value = this.getDataCapitalised(
                                        //     e.target.value
                                        //   );
                                        // }}
                                        isInvalid={!!errors.address}
                                        onKeyDown={(e) => {
                                          if (
                                            e.keyCode == 13 ||
                                            e.keyCode == 9
                                          ) {
                                            e.target.value =
                                              this.getDataCapitalised(
                                                e.target.value
                                              );
                                            this.selectRef.current?.focus();
                                          }
                                        }}
                                        onBlur={(e) => {
                                          e.target.value =
                                            handleDataCapitalised(
                                              e.target.value
                                            );
                                          handlesetFieldValue(
                                            setFieldValue,
                                            "address",
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
                              <Col lg={2}>
                                <Row>
                                  <Col lg={3} className="my-auto pe-0">
                                    <Form.Label>State</Form.Label>
                                    <span className="text-danger">*</span>
                                  </Col>
                                  <Col lg={9}>
                                    <Form.Group
                                      // className={`${errorArrayBorder[1] == "Y"
                                      //   ? "border border-danger "
                                      //   : ""
                                      //   }`}
                                      onBlur={(e) => {
                                        e.preventDefault();
                                        if (values.stateId) {
                                          // this.setErrorBorder(1, "");
                                        } else {
                                          // this.setErrorBorder(1, "Y");
                                          // document
                                          //   .getElementById("stateId")
                                          //   .focus();
                                          // this.selectRef.current?.focus();
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13 || e.keyCode == 9) {
                                          if (values.stateId != "")
                                            this.handleKeyDown(e, "pincode");
                                          else {
                                            e.preventDefault();
                                            this.selectRef.current?.focus();
                                          }
                                        }
                                      }}
                                    >
                                      <Select
                                        className="selectTo"
                                        onChange={(v) => {
                                          setFieldValue("stateId", v);
                                        }}
                                        name="stateId"
                                        id="stateId"
                                        ref={this.selectRef}
                                        styles={ledger_select}
                                        options={stateOpt}
                                        value={values.stateId}
                                        invalid={errors.stateId ? true : false}
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
                                  <Col lg={8}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Pin"
                                        name="pincode"
                                        id="pincode"
                                        ref={this.pincodeRef}
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.pincode}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        // onBlur={(e) => {
                                        //   e.preventDefault();
                                        //   let pincode_val = e.target.value.trim();
                                        //   if (pincode_val !== "") {
                                        //     this.validatePincode(
                                        //       e.target.value,
                                        //       setFieldValue
                                        //     );
                                        //   }
                                        // }}
                                        maxLength={6}
                                        isValid={
                                          touched.pincode && !errors.pincode
                                        }
                                        isInvalid={!!errors.pincode}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            let pincode_val =
                                              e.target.value.trim();
                                            if (pincode_val !== "") {
                                              this.validatePincode(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            }
                                            this.handleKeyDown(e, "phone_no");
                                          } else if (
                                            e.shiftKey == true &&
                                            e.keyCode == 9
                                          ) {
                                            let pincode_val =
                                              e.target.value.trim();
                                            if (pincode_val !== "") {
                                              this.validatePincode(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            }
                                          } else if (e.keyCode == 9) {
                                            let pincode_val =
                                              e.target.value.trim();
                                            if (pincode_val !== "") {
                                              this.validatePincode(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            }
                                          }
                                        }}
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
                                        // onBlur={(e) => {
                                        //   e.preventDefault();
                                        //   if (values.phone_no) {
                                        //     // this.setErrorBorder(3, "");
                                        //   } else {
                                        //     // this.setErrorBorder(3, "Y");
                                        //     // document
                                        //     //   .getElementById("phone_no")
                                        //     //   .focus();
                                        //   }
                                        // }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          } else if (
                                            e.shiftKey &&
                                            e.key === "Tab"
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
                                                  .getElementById("phone_no")
                                                  .focus();
                                              }, 1000);
                                            }
                                          } else if (
                                            e.key === "Tab" ||
                                            e.keyCode == 13
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
                                                  .getElementById("phone_no")
                                                  .focus();
                                              }, 1000);
                                            } else {
                                              this.handleKeyDown(
                                                e,
                                                "whatsapp_no"
                                              );
                                            }
                                          }
                                        }}
                                        onBlur={(e) => {}}
                                        // onKeyDown={(e) => {
                                        //   if (
                                        //     e.key === "Tab" &&
                                        //     !e.target.value
                                        //   )
                                        //     e.preventDefault();
                                        // }}
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
                                        value={
                                          values.whatsapp_no === "0"
                                            ? ""
                                            : values.whatsapp_no
                                        }
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        maxLength={10}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          } else if (
                                            e.shiftKey &&
                                            e.key === "Tab"
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
                                                  .getElementById("whatsapp_no")
                                                  .focus();
                                              }, 1000);
                                            }
                                          } else if (
                                            e.key === "Tab" ||
                                            e.keyCode == 13
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
                                                  .getElementById("whatsapp_no")
                                                  .focus();
                                              }, 1000);
                                            } else {
                                              this.handleKeyDown(e, "email_id");
                                            }
                                          }
                                        }}
                                        onBlur={(e) => {}}
                                        isValid={
                                          touched.whatsapp_no &&
                                          !errors.whatsapp_no
                                        }
                                        isInvalid={!!errors.whatsapp_no}
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
                                    <Form.Label>Email</Form.Label>
                                  </Col>
                                  <Col lg={10}>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        placeholder="Email"
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
                                          } else if (
                                            e.shiftKey &&
                                            e.key === "Tab"
                                          ) {
                                            let email_val =
                                              e.target.value.trim();
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
                                                  .getElementById("email_id")
                                                  .focus();
                                              }, 1000);
                                            }
                                          } else if (
                                            e.key === "Tab" ||
                                            e.keyCode == 13
                                          ) {
                                            let email_val =
                                              e.target.value.trim();
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
                                                  .getElementById("email_id")
                                                  .focus();
                                              }, 1000);
                                            } else {
                                              this.handleKeyDown(
                                                e,
                                                "licenseNo"
                                              );
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
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            this.handleKeyDown(
                                              e,
                                              "date_of_registartion"
                                            );
                                          }
                                        }}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={2}>
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
                                        } else if (
                                          e.shiftKey &&
                                          e.key === "Tab"
                                        ) {
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
                                              msg: "Please Enter Correct Date. ",
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
                                        } else if (
                                          e.key === "Tab" ||
                                          e.keyCode == 13
                                        ) {
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
                                              msg: "Please Enter Correct Date. ",
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
                                          } else {
                                            setFieldValue(
                                              "date_of_registartion",
                                              e.target.value
                                            );
                                            // this.checkExpiryDate(
                                            //   setFieldValue,
                                            //   e.target.value,
                                            //   "date_of_registartion"
                                            // );

                                            this.handleKeyDown(e, "isCredit");
                                          }
                                        }
                                      }}
                                      onBlur={(e) => {
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
                              <Col lg={6} style={{ borderRight: "1px solid" }}>
                                <Row>
                                  {/* {JSON.stringify(values.isCredit)} */}
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
                                      checked={
                                        values.isCredit == true ? true : false
                                      }
                                      value={
                                        values.isCredit == true ? true : false
                                      }
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          e.preventDefault();
                                          if (values.isCredit == true)
                                            this.handleKeyDown(
                                              e,
                                              "credit_days"
                                            );
                                          else
                                            this.handleKeyDown(e, "Retailer");
                                        }
                                      }}
                                    />
                                  </Col>
                                  {values.isCredit == true ? (
                                    <>
                                      <Col lg={2}>
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
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13)
                                                    if (
                                                      values.credit_days > 0
                                                    ) {
                                                      this.selectRefApplForm.current?.focus();
                                                    } else {
                                                      this.handleKeyDown(
                                                        e,
                                                        "credit_bills"
                                                      );
                                                    }
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
                                        <Col lg={4}>
                                          <Row>
                                            <Col md={5}>
                                              <Form.Label className="mb-2">
                                                Applicable From
                                              </Form.Label>{" "}
                                            </Col>
                                            <Col md={7}>
                                              <Form.Group
                                                className="mb-2"
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "credit_bills"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.selectRefApplForm}
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
                                                  value={values.applicable_from}
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
                                      <Col lg={2}>
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
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "credit_values"
                                                    );
                                                  }
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
                                          <Col lg={4}>
                                            <Form.Label>Values</Form.Label>
                                          </Col>
                                          <Col lg={8}>
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
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "Retailer"
                                                    );
                                                  }
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
                                        <Form.Group
                                          className="mt-1 d-flex"
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 13) {
                                              this.handleKeyDown(
                                                e,
                                                "natureOfBusiness"
                                              );
                                            }
                                          }}
                                        >
                                          <Form.Check
                                            type="radio"
                                            label="Retailer"
                                            className="pr-3"
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
                                            className="ms-2"
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
                                          <Form.Check
                                            className="ms-2"
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
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col lg={6}>
                                    <Row>
                                      <Col lg={4}>
                                        <Form.Label>Business Nature</Form.Label>
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
                                              e.target.value =
                                                this.getDataCapitalised(
                                                  e.target.value
                                                );
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.keyCode == 13) {
                                                this.handleKeyDown(e, "isGST");
                                              }
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    setFieldValue(
                                      "registraion_type",
                                      getSelectValue(GSTTypeOpt, 1)
                                    );

                                    // // this.gstFieldshow(e.target.checked);
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
                                      setFieldValue("isGST", e.target.checked);
                                    }
                                  }}
                                  name="isGST"
                                  id="isGST"
                                  checked={values.isGST == true ? true : false}
                                  value={values.isGST == true ? true : false}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (values.isGST == true)
                                        this.selectRefGST.current?.focus();
                                      else this.handleKeyDown(e, "pan_no");
                                    }
                                  }}
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
                                            <Col lg={4}>
                                              <Form.Group
                                                // className={`${
                                                //   errorArrayBorder[2] == "Y"
                                                //     ? "border border-danger "
                                                //     : ""
                                                // }`}
                                                onBlur={(e) => {
                                                  e.preventDefault();
                                                  if (values.registraion_type) {
                                                    // this.setErrorBorder(2, "");
                                                  } else {
                                                    // this.setErrorBorder(2, "Y");
                                                    // document
                                                    //   .getElementById("registraion_type")
                                                    //   .focus();
                                                    this.selectRefGST.current?.focus();
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    if (
                                                      values.registraion_type !=
                                                      ""
                                                    ) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "dateofregistartion"
                                                      );
                                                    } else
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
                                                  defaultValue={GSTTypeOpt[0]}
                                                  value={
                                                    values.registraion_type
                                                  }
                                                  invalid={
                                                    errors.registraion_type
                                                      ? true
                                                      : false
                                                  }
                                                  ref={this.selectRefGST}
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>Reg. Date</Form.Label>
                                            </Col>
                                            <Col lg={4} className="fRp normalP">
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
                                                // onKeyDown={(e) => {
                                                //   if (e.keyCode == 18) {
                                                //     e.preventDefault();
                                                //   } else if (
                                                //     e.shiftKey &&
                                                //     e.key === "Tab"
                                                //   ) {
                                                //     let datchco = e.target.value.trim();
                                                //     console.log(
                                                //       "datchco",
                                                //       datchco
                                                //     );
                                                //     let checkdate = moment(
                                                //       e.target.value
                                                //     ).format("DD/MM/YYYY");
                                                //     console.log(
                                                //       "checkdate",
                                                //       checkdate
                                                //     );
                                                //     if (
                                                //       datchco != "__/__/____" &&
                                                //       // checkdate ==
                                                //       //   "Invalid date"
                                                //       datchco.includes("_")
                                                //     ) {
                                                //       MyNotifications.fire({
                                                //         show: true,
                                                //         icon: "error",
                                                //         title: "Error",
                                                //         msg:
                                                //           "Please Enter Correct Date. ",
                                                //         is_timeout: true,
                                                //         delay: 1500,
                                                //       });
                                                //       setTimeout(() => {
                                                //         document
                                                //           .getElementById(
                                                //             "dateofregistartion"
                                                //           )
                                                //           .focus();
                                                //       }, 1000);
                                                //     }
                                                //   } else if (
                                                //     e.key === "Tab" ||
                                                //     e.keyCode == 13
                                                //   ) {
                                                //     let datchco = e.target.value.trim();
                                                //     console.log(
                                                //       "datchco",
                                                //       datchco
                                                //     );
                                                //     let checkdate = moment(
                                                //       e.target.value
                                                //     ).format("DD/MM/YYYY");
                                                //     console.log(
                                                //       "checkdate",
                                                //       checkdate
                                                //     );
                                                //     if (
                                                //       datchco != "__/__/____" &&
                                                //       // checkdate ==
                                                //       //   "Invalid date"
                                                //       datchco.includes("_")
                                                //     ) {
                                                //       MyNotifications.fire({
                                                //         show: true,
                                                //         icon: "error",
                                                //         title: "Error",
                                                //         msg:
                                                //           "Please Enter Correct Date. ",
                                                //         is_timeout: true,
                                                //         delay: 1500,
                                                //       });
                                                //       setTimeout(() => {
                                                //         document
                                                //           .getElementById(
                                                //             "dateofregistartion"
                                                //           )
                                                //           .focus();
                                                //       }, 1000);
                                                //     } else {
                                                //       setFieldValue(
                                                //         "date_of_registartion",
                                                //         e.target.value
                                                //       );
                                                //       this.checkExpiryDate(
                                                //         setFieldValue,
                                                //         e.target.value,
                                                //         "date_of_registartion"
                                                //       );
                                                //     }
                                                //   } else {
                                                //     e.preventDefault();
                                                //     if (values.isGST == true)
                                                //       this.gstRef.current?.focus();
                                                //     else {
                                                //       this.handleKeyDown(
                                                //         e,
                                                //         "isLicense"
                                                //       );
                                                //     }
                                                //   }
                                                // }}
                                                onKeyDown={(e) => {
                                                  if (
                                                    e.shiftKey &&
                                                    e.key === "Tab"
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
                                                    // console.log(
                                                    //   "datchco",
                                                    //   datchco
                                                    // );
                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");
                                                    // this.checkExpiryDate(
                                                    //   setFieldValue,
                                                    //   e.target.value,
                                                    //   "dateofregistartion"
                                                    // );
                                                    // console.log(
                                                    //   "checkdate",
                                                    //   checkdate
                                                    // );
                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "dateofregistartion"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    }
                                                  } else if (
                                                    // e.key === "Tab" ||
                                                    e.keyCode == 13
                                                  ) {
                                                    // e.preventDefault();
                                                    let datchco =
                                                      e.target.value.trim();
                                                    e.preventDefault();
                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");

                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "dateofregistartion"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    } else {
                                                      if (values.isGST == true)
                                                        this.gstRef.current?.focus();
                                                      else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "isLicense"
                                                        );
                                                      }
                                                    }
                                                  } else if (e.keyCode == 13) {
                                                    let datchco =
                                                      e.target.value.trim();

                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");
                                                    // this.checkExpiryDate(
                                                    //   setFieldValue,
                                                    //   e.target.value,
                                                    //   "dateofregistartion"
                                                    // );
                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "dateofregistartion"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    } else {
                                                      if (values.isGST == true)
                                                        this.gstRef.current?.focus();
                                                      else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "isLicense"
                                                        );
                                                      }
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
                                          <Col lg={4}>
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
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    if (values.isGST == true)
                                                      this.gstRef.current?.focus();
                                                    else
                                                      this.handleKeyDown(
                                                        e,
                                                        "isLicense"
                                                      );
                                                  }
                                                }}
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
                                                      values.gstin != undefined
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
                                                          msg: "GSTIN is not Valid!",
                                                          is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          this.gstRef.current?.focus();
                                                        }, 1000);
                                                      }
                                                    } else {
                                                      // this.gstRef.current?.focus();
                                                      setFieldValue(
                                                        "pan_no",
                                                        ""
                                                      );
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
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
                                                          this.handleKeyDown(
                                                            e,
                                                            "pan_no"
                                                          );
                                                          return values.gstin;
                                                        } else {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg: "GSTIN is not Valid!",
                                                            is_button_show: false,
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            this.gstRef.current?.focus();
                                                          }, 1000);
                                                        }
                                                      } else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "pan_no"
                                                        );
                                                        // this.gstRef.current?.focus();
                                                        setFieldValue(
                                                          "pan_no",
                                                          ""
                                                        );
                                                      }
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.gstin}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto">
                                              <Form.Label>PAN</Form.Label>
                                            </Col>
                                            <Col lg={4}>
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
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "rowPlusBtn4"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.pan_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1}>
                                              <Form.Control
                                                type="text"
                                                placeholder="index"
                                                name="index"
                                                className="text-box"
                                                onChange={handleChange}
                                                hidden
                                                value={values.index}
                                              />
                                              <Button
                                                id="rowPlusBtn4"
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    values.gstin != "" &&
                                                    values.gstin != null
                                                  ) {
                                                    let gstObj = {
                                                      id:
                                                        values.bid != null
                                                          ? values.bid
                                                          : "",
                                                      gstin:
                                                        values.gstin != null
                                                          ? values.gstin
                                                          : "",
                                                      dateofregistartion:
                                                        values.dateofregistartion !=
                                                          null &&
                                                        values.dateofregistartion !=
                                                          "NA" &&
                                                        values.dateofregistartion
                                                          ? values.dateofregistartion
                                                          : "",
                                                      pan_no:
                                                        values.pan_no != null
                                                          ? values.pan_no
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
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
                                                      msg: "Please Enter GST Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "isLicense"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
                                                    e.preventDefault();
                                                    if (
                                                      values.gstin != "" &&
                                                      values.gstin != null
                                                    ) {
                                                      let gstObj = {
                                                        id:
                                                          values.bid != null
                                                            ? values.bid
                                                            : "",
                                                        gstin:
                                                          values.gstin != null
                                                            ? values.gstin
                                                            : "",
                                                        dateofregistartion:
                                                          values.dateofregistartion !=
                                                            null &&
                                                          values.dateofregistartion !=
                                                            "NA" &&
                                                          values.dateofregistartion
                                                            ? values.dateofregistartion
                                                            : "",
                                                        pan_no:
                                                          values.pan_no != null
                                                            ? values.pan_no
                                                            : "",
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
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
                                                      this.handleKeyDown(
                                                        e,
                                                        "isLicense"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter GST Details ",
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
                                                console.log("sneha", i, "v", v);
                                                let gstObj = {
                                                  id: v.id,
                                                  registraion_type:
                                                    v.registraion_type,

                                                  // registraion_type: v.registration_type!=''?getSelectValue(GSTTypeOpt,v.registration_type):'',
                                                  // registration_type:v.registration_type,
                                                  gstin: v.gstin,
                                                  dateofregistartion:
                                                    v.dateofregistartion,

                                                  pan_no: v.pan_no,
                                                  // index:
                                                  //   v.index,
                                                };
                                                this.handleFetchGstData(
                                                  gstObj,
                                                  setFieldValue,
                                                  i
                                                );
                                              }}
                                            >
                                              <td style={{ width: "24%" }}>
                                                {/* {v.registration_type!=''? getSelectValue(GSTTypeOpt,v.registration_type).label:''} */}
                                                {v.registraion_type.label}
                                              </td>
                                              <td style={{ width: "25%" }}>
                                                {v.dateofregistartion}
                                              </td>
                                              <td>{v.gstin.toUpperCase()}</td>
                                              <td>{v.pan_no}</td>
                                              <td className="text-center">
                                                <Button
                                                  className="btn_img_ledger"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      e.preventDefault();
                                                      this.removeGstRow(i);
                                                    }
                                                  }}
                                                >
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeGstRow(i);
                                                    }}
                                                  />
                                                </Button>
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // // this.gstFieldshow(e.target.checked);
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
                                  checked={
                                    values.isLicense == true ? true : false
                                  }
                                  value={
                                    values.isLicense == true ? true : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (values.isLicense == true) {
                                        this.licenseTypeRef.current?.focus();
                                      } else {
                                        this.handleKeyDown(e, "isDepartment");
                                      }
                                    }
                                  }}
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
                                            <Col lg={4}>
                                              <Form.Group
                                                className=""
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "licenses_num"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.licenseTypeRef}
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
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Number</Form.Label>
                                            </Col>
                                            <Col lg={4}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Number"
                                                  id="licenses_num"
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
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "licenses_exp"
                                                      );
                                                    }
                                                  }}
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col lg={4}>
                                          <Row>
                                            <Col lg={4} className="my-auto">
                                              <Form.Label>
                                                Expiry Date
                                              </Form.Label>
                                            </Col>
                                            <Col lg={6}>
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
                                                  } else if (
                                                    e.shiftKey &&
                                                    e.key === "Tab"
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
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
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "licenses_exp"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    }
                                                  } else if (
                                                    e.key === "Tab" ||
                                                    e.keyCode == 13
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
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
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "licenses_exp"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    }
                                                  } else {
                                                    this.handleKeyDown(
                                                      e,
                                                      "rowPlusBtn"
                                                    );
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

                                            <Col lg={2} className="text-end">
                                              <Button
                                                id="rowPlusBtn"
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  console.log(
                                                    "before add Row values",
                                                    JSON.stringify(values)
                                                  );
                                                  if (
                                                    values.licences_type !=
                                                      "" &&
                                                    values.licences_type != null
                                                  ) {
                                                    let licensesObj = {
                                                      id:
                                                        values.lid != null
                                                          ? values.lid
                                                          : "",
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
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
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
                                                      msg: "Please Enter Licenses Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "isDepartment"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
                                                    e.preventDefault();
                                                    if (
                                                      values.licences_type !=
                                                        "" &&
                                                      values.licences_type !=
                                                        null
                                                    ) {
                                                      let licensesObj = {
                                                        id:
                                                          values.lid != null
                                                            ? values.lid
                                                            : "",
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
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
                                                      };
                                                      this.addLicensesRow(
                                                        licensesObj,
                                                        setFieldValue
                                                      );
                                                      this.handleKeyDown(
                                                        e,
                                                        "isDepartment"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Licenses Details ",
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
                                                console.log("sneha", i, "v", v);
                                                let licensesObj = {
                                                  id: v.lid,
                                                  licences_type:
                                                    v.licences_type,
                                                  licenses_num: v.licenses_num,
                                                  licenses_exp: v.licenses_exp,
                                                  index: i,
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
                                                <Button
                                                  className="btn_img_ledger"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 13) {
                                                      e.preventDefault();
                                                      this.removeLicensesRow(i);
                                                    }
                                                  }}
                                                >
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeLicensesRow(i);
                                                    }}
                                                  />
                                                </Button>
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // // this.gstFieldshow(e.target.checked);
                                    // setFieldValue(
                                    //   "isDepartment",
                                    //   e.target.checked
                                    // );
                                    if (deptList.length > 0) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "warning",
                                        title: "Warning",
                                        msg: "Please Remove Department List. ",
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
                                  checked={
                                    values.isDepartment == true ? true : false
                                  }
                                  value={
                                    values.isDepartment == true ? true : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (values.isDepartment == true) {
                                        this.deptRef.current?.focus();
                                      } else {
                                        this.handleKeyDown(e, "isBankDetails");
                                      }
                                    }
                                  }}
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
                                                  ref={this.deptRef}
                                                  className="text-box"
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Department"
                                                  name="dept"
                                                  onChange={handleChange}
                                                  value={values.dept}
                                                  isValid={
                                                    touched.dept && !errors.dept
                                                  }
                                                  onInput={(e) => {
                                                    e.target.value =
                                                      this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                  }}
                                                  isInvalid={!!errors.dept}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "contact_person"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.dept}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>Name</Form.Label>
                                            </Col>
                                            <Col lg={4} className="normalP">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder="Contact Person"
                                                  id="contact_person"
                                                  name="contact_person"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  value={values.contact_person}
                                                  isValid={
                                                    touched.contact_person &&
                                                    !errors.contact_person
                                                  }
                                                  onInput={(e) => {
                                                    e.target.value =
                                                      this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                  }}
                                                  isInvalid={
                                                    !!errors.contact_person
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "email"
                                                      );
                                                    }
                                                  }}
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
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>E-mail</Form.Label>
                                            </Col>
                                            <Col lg={4} className="fLp">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=" E-mail"
                                                  name="email"
                                                  id="email"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 18) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.shiftKey &&
                                                      e.key === "Tab"
                                                    ) {
                                                      let email_val =
                                                        e.target.value.trim();
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
                                                          msg: "Please Enter Valid Email Id. ",
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
                                                      e.key === "Tab" ||
                                                      e.keyCode == 13
                                                    ) {
                                                      let email_val =
                                                        e.target.value.trim();
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
                                                          msg: "Please Enter Valid Email Id. ",
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
                                                      } else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "contact_no"
                                                        );
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
                                                    } else if (
                                                      e.shiftKey &&
                                                      e.key === "Tab"
                                                    ) {
                                                      let mob =
                                                        e.target.value.trim();
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
                                                          msg: "Please Enter 10 Digit Number. ",
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
                                                      e.key === "Tab" ||
                                                      e.keyCode == 13
                                                    ) {
                                                      let mob =
                                                        e.target.value.trim();
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
                                                          msg: "Please Enter 10 Digit Number. ",
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
                                                      } else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "rowPlusBtn1"
                                                        );
                                                      }
                                                    }
                                                  }}
                                                  onBlur={(e) => {}}
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

                                            <Col lg={1} className="text-end">
                                              <Button
                                                id="rowPlusBtn1"
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
                                                      id:
                                                        values.did != null
                                                          ? values.did
                                                          : "",
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
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
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
                                                      msg: "Please Enter Department Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "isBankDetails"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
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
                                                        id:
                                                          values.did != null
                                                            ? values.did
                                                            : "",
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
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
                                                      };
                                                      this.addDeptRow(
                                                        deptObj,
                                                        setFieldValue
                                                      );

                                                      this.handleKeyDown(
                                                        e,
                                                        "isBankDetails"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Department Details ",
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
                                                  "sneha dpt",
                                                  i,
                                                  "v",
                                                  v
                                                );

                                                let deptObj = {
                                                  id: v.did,
                                                  dept: v.dept,

                                                  contact_no: v.contact_no,

                                                  contact_person:
                                                    v.contact_person,
                                                  email: v.email,
                                                  index: i,
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
                                                <Button
                                                  className="btn_img_ledger"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      e.preventDefault();
                                                      this.removeDeptRow(i);
                                                    }
                                                  }}
                                                >
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
                                                </Button>
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // // this.gstFieldshow(e.target.checked);
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
                                  checked={
                                    values.isBankDetails == true ? true : false
                                  }
                                  value={
                                    values.isBankDetails == true ? true : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (values.isBankDetails == true)
                                        this.handleKeyDown(e, "bank_name");
                                      else
                                        this.handleKeyDown(
                                          e,
                                          "isShippingDetails"
                                        );
                                    }
                                  }}
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
                                                  ref={this.bankRef}
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Bank Name"
                                                  name="bank_name"
                                                  id="bank_name"
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
                                                  isInvalid={!!errors.bank_name}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "bank_account_no"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_name}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto fLp">
                                              <Form.Label>A/C</Form.Label>
                                            </Col>
                                            <Col lg={5}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Number"
                                                  name="bank_account_no"
                                                  id="bank_account_no"
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
                                                  isInvalid={
                                                    !!errors.bank_account_no
                                                  }
                                                  maxLength={14}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "bank_ifsc_code"
                                                      );
                                                    }
                                                  }}
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
                                                  id="bank_ifsc_code"
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
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "bank_branch"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_ifsc_code}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>Branch</Form.Label>
                                            </Col>
                                            <Col lg={3} className="fLp">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Branch"
                                                  name="bank_branch"
                                                  id="bank_branch"
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
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "rowPlusBtn2"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_branch}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="noP">
                                              <Button
                                                id="rowPlusBtn2"
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();

                                                  if (
                                                    values.bank_name != "" &&
                                                    values.bank_name != null &&
                                                    values.bank_account_no !=
                                                      "" &&
                                                    values.bank_account_no !=
                                                      null &&
                                                    values.bank_ifsc_code !=
                                                      "" &&
                                                    values.bank_ifsc_code !=
                                                      null &&
                                                    values.bank_branch != "" &&
                                                    values.bank_branch != null
                                                  ) {
                                                    let bankObj = {
                                                      bank_name:
                                                        values.bank_name != null
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
                                                      id:
                                                        values.bid != null
                                                          ? values.bid
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
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
                                                      msg: "Please Submit All Bank Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "isShippingDetails"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
                                                    e.preventDefault();
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
                                                        id:
                                                          values.bid != null
                                                            ? values.bid
                                                            : "",
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
                                                      };
                                                      this.addBankRow(
                                                        bankObj,
                                                        setFieldValue
                                                      );
                                                      this.handleKeyDown(
                                                        e,
                                                        "isShippingDetails"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Submit All Bank Details ",
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
                                                  id: v.bid,
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
                                                <Button
                                                  style={{
                                                    marginTop: "-12px",
                                                  }}
                                                  className="btn_img_ledger"
                                                  variant=""
                                                  type="button"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      e.preventDefault();
                                                      this.removeBankRow(i);
                                                    }
                                                  }}
                                                >
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeBankRow(i);
                                                    }}
                                                  />
                                                </Button>
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // // this.gstFieldshow(e.target.checked);
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
                                  checked={
                                    values.isShippingDetails == true
                                      ? true
                                      : false
                                  }
                                  value={
                                    values.isShippingDetails == true
                                      ? true
                                      : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (values.isShippingDetails == true)
                                        this.handleKeyDown(
                                          e,
                                          "shipping_address"
                                        );
                                      else
                                        this.handleKeyDown(e, "cr_submit_btn");
                                    }
                                  }}
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
                                                  ref={this.shippingRef}
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  className="text-box"
                                                  name="shipping_address"
                                                  id="shipping_address"
                                                  onChange={handleChange}
                                                  value={
                                                    values.shipping_address
                                                  }
                                                  isValid={
                                                    touched.shipping_address &&
                                                    !errors.shipping_address
                                                  }
                                                  onInput={(e) => {
                                                    e.target.value =
                                                      this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                  }}
                                                  isInvalid={
                                                    !!errors.shipping_address
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.selectRefdistrict.current?.focus();
                                                    }
                                                  }}
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
                                              <Form.Group
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "rowPlusBtn3"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.selectRefdistrict}
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
                                                id="rowPlusBtn3"
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
                                                      id:
                                                        values.sid != null
                                                          ? values.sid
                                                          : "",
                                                      district:
                                                        values.district != null
                                                          ? values.district
                                                          : "",
                                                      shipping_address:
                                                        values.shipping_address !=
                                                        null
                                                          ? values.shipping_address
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
                                                    };
                                                    console.log(
                                                      "addShip shipObj <<<<<<<<<<<<< ",
                                                      shipObj
                                                    );
                                                    this.addShippingRow(
                                                      shipObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Shipping Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "cr_submit_btn"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
                                                    e.preventDefault();
                                                    if (
                                                      values.district != "" &&
                                                      values.district != null &&
                                                      values.shipping_address !=
                                                        "" &&
                                                      values.shipping_address !=
                                                        null
                                                    ) {
                                                      let shipObj = {
                                                        id:
                                                          values.sid != null
                                                            ? values.sid
                                                            : "",
                                                        district:
                                                          values.district !=
                                                          null
                                                            ? values.district
                                                            : "",
                                                        shipping_address:
                                                          values.shipping_address !=
                                                          null
                                                            ? values.shipping_address
                                                            : "",
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
                                                      };
                                                      console.log(
                                                        "addShip shipObj <<<<<<<<<<<<< ",
                                                        shipObj
                                                      );
                                                      this.addShippingRow(
                                                        shipObj,
                                                        setFieldValue
                                                      );
                                                      this.handleKeyDown(
                                                        e,
                                                        "cr_submit_btn"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Shipping Details ",
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
                                                  district: v.district,
                                                  id: v.sid,
                                                  shipping_address:
                                                    v.shipping_address,
                                                  index: i,
                                                };
                                                this.handleFetchShippingData(
                                                  shipObj,
                                                  setFieldValue,
                                                  i
                                                );
                                              }}
                                            >
                                              <td style={{ width: "67%" }}>
                                                {v.shipping_address}
                                              </td>
                                              {/* <td>{v.district !='' ? JSON.stringify(v.district):'' }</td> */}
                                              <td>
                                                {
                                                  getSelectValue(
                                                    stateOpt,
                                                    v.district
                                                  ).label
                                                }
                                              </td>

                                              <td className="text-end">
                                                <Button
                                                  className="btn_img_ledger"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      e.preventDefault();
                                                      this.removeShippingRow(i);
                                                    }
                                                  }}
                                                >
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
                                                </Button>
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
                              id="cr_submit_btn"
                              className="submit-btn"
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                this.myRef.current.handleSubmit();
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.myRef.current.handleSubmit();
                                }
                              }}
                            >
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
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      // this.CancelAPICall();

                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgeredit",
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
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data:
                                                  this.state.source
                                                    .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        // eventBus.dispatch(
                                        //   "page_change",
                                        //   "ledgerlist"
                                        // );
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          prop_data: {
                                            editId: this.state.edit_data.id,
                                            rowId:
                                              this.props.block.prop_data.rowId,
                                            selectedFilter:
                                              this.props.block.prop_data
                                                .selectedFilter,
                                            searchValue:
                                              this.props.block.prop_data
                                                .searchValue,
                                          },
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    },
                                    handleFailFn: () => {},
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
                                        // eventBus.dispatch(
                                        //   "page_change",
                                        //   "ledgerlist"
                                        // );

                                        // this.CancelAPICall();

                                        // if (this.state.source != "") {
                                        //   eventBus.dispatch("page_change", {
                                        //     from: "ledgeredit",
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
                                        if (
                                          this.state.source &&
                                          this.state.source != ""
                                        ) {
                                          if (
                                            this.state.source.opType ===
                                            "create"
                                          ) {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgeredit",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data:
                                                  this.state.source
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
                                              from: "ledgeredit",
                                              to: this.state.source.from_page,
                                              prop_data: {
                                                prop_data: {
                                                  rows: this.state.source.rows,
                                                  invoice_data:
                                                    this.state.source
                                                      .invoice_data,
                                                  ...this.state.source,
                                                },
                                              },
                                              isNewTab: false,
                                            });
                                            this.setState({ source: "" });
                                          } else {
                                            eventBus.dispatch("page_change", {
                                              from: "ledgeredit",
                                              to: "ledgerlist",
                                              isNewTab: false,
                                              isCancel: true,
                                            });
                                          }
                                        } else {
                                          // eventBus.dispatch(
                                          //   "page_change",
                                          //   "ledgerlist"
                                          // );
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: "ledgerlist",
                                            prop_data: {
                                              editId: this.state.edit_data.id,
                                              rowId:
                                                this.props.block.prop_data
                                                  .rowId,
                                              selectedFilter:
                                                this.props.block.prop_data
                                                  .selectedFilter,
                                              searchValue:
                                                this.props.block.prop_data
                                                  .searchValue,
                                            },
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      },
                                      handleFailFn: () => {},
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
                                        ref={this.nameRef}
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Registered Name"
                                        id="mailing_name_sundry_debtors"
                                        name="mailing_name"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.mailing_name}
                                        isValid={
                                          touched.mailing_name &&
                                          !errors.mailing_name
                                        }
                                        onInput={(e) => {
                                          e.target.value =
                                            this.getDataCapitalised(
                                              e.target.value
                                            );
                                        }}
                                        isInvalid={!!errors.mailing_name}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            this.handleKeyDown(e, "address");
                                          }
                                        }}
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.mailing_name}
                                      </span>
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
                                        // ref={this.addressRef}
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Address"
                                        name="address"
                                        id="address"
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.address}
                                        isValid={
                                          touched.address && !errors.address
                                        }
                                        // onInput={(e) => {
                                        //   e.target.value = this.getDataCapitalised(
                                        //     e.target.value
                                        //   );
                                        // }}
                                        isInvalid={!!errors.address}
                                        onKeyDown={(e) => {
                                          if (
                                            e.keyCode == 13 ||
                                            e.keyCode == 9
                                          ) {
                                            e.target.value =
                                              this.getDataCapitalised(
                                                e.target.value
                                              );
                                            this.selectRef.current?.focus();
                                          }
                                        }}
                                        onBlur={(e) => {
                                          e.target.value =
                                            handleDataCapitalised(
                                              e.target.value
                                            );
                                          handlesetFieldValue(
                                            setFieldValue,
                                            "address",
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
                              <Col lg={2} className="fLp">
                                <Row>
                                  <Col lg={3} className="my-auto pe-0">
                                    <Form.Label>State</Form.Label>
                                    <span className="text-danger">*</span>
                                  </Col>
                                  <Col lg={9}>
                                    <Form.Group
                                      // className={`${errorArrayBorder[1] == "Y"
                                      //   ? "border border-danger "
                                      //   : ""
                                      //   }`}
                                      onBlur={(e) => {
                                        e.preventDefault();
                                        if (values.stateId) {
                                          // this.setErrorBorder(1, "");
                                        } else {
                                          // this.setErrorBorder(1, "Y");
                                          // document
                                          //   .getElementById("stateId")
                                          //   .focus();
                                          this.selectRef.current?.focus();
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13 || e.keyCode == 9) {
                                          if (values.stateId != "")
                                            this.handleKeyDown(e, "pincode");
                                          else {
                                            e.preventDefault();
                                            this.selectRef.current?.focus();
                                          }
                                        }
                                      }}
                                    >
                                      <Select
                                        className="selectTo"
                                        onChange={(v) => {
                                          setFieldValue("stateId", v);
                                        }}
                                        name="stateId"
                                        autoComplete="off"
                                        id="stateId"
                                        styles={ledger_select}
                                        options={stateOpt}
                                        value={values.stateId}
                                        invalid={errors.stateId ? true : false}
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
                                        autoComplete="off"
                                        name="pincode"
                                        id="pincode"
                                        ref={this.pincodeRef}
                                        className="text-box"
                                        onChange={handleChange}
                                        value={values.pincode}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        // onBlur={(e) => {
                                        //   e.preventDefault();
                                        //   let pincode_val = e.target.value.trim();
                                        //   if (pincode_val !== "") {
                                        //     this.validatePincode(
                                        //       e.target.value,
                                        //       setFieldValue
                                        //     );
                                        //   }
                                        // }}
                                        maxLength={6}
                                        isValid={
                                          touched.pincode && !errors.pincode
                                        }
                                        isInvalid={!!errors.pincode}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            let pincode_val =
                                              e.target.value.trim();
                                            if (pincode_val !== "") {
                                              this.validatePincode(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            }
                                            this.handleKeyDown(e, "phone_no");
                                          } else if (
                                            e.shiftKey == true &&
                                            e.keyCode == 9
                                          ) {
                                            let pincode_val =
                                              e.target.value.trim();
                                            if (pincode_val !== "") {
                                              this.validatePincode(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            }
                                          } else if (e.keyCode == 9) {
                                            let pincode_val =
                                              e.target.value.trim();
                                            if (pincode_val !== "") {
                                              this.validatePincode(
                                                e.target.value,
                                                setFieldValue
                                              );
                                            }
                                          }
                                        }}
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
                                        autoComplete="off"
                                        placeholder="Enter"
                                        name="phone_no"
                                        id="phone_no"
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
                                        // onBlur={(e) => {
                                        //   e.preventDefault();
                                        //   if (values.phone_no) {
                                        //     // this.setErrorBorder(3, "");
                                        //   } else {
                                        //     // this.setErrorBorder(3, "Y");
                                        //     // document
                                        //     //   .getElementById("phone_no")
                                        //     //   .focus();
                                        //   }
                                        // }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          } else if (
                                            e.shiftKey &&
                                            e.key === "Tab"
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
                                                  .getElementById("phone_no")
                                                  .focus();
                                              }, 1000);
                                            }
                                          } else if (
                                            // e.key === "Tab" ||
                                            e.keyCode == 13
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
                                                  .getElementById("phone_no")
                                                  .focus();
                                              }, 1000);
                                            } else {
                                              this.handleKeyDown(
                                                e,
                                                "whatsapp_no"
                                              );
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
                                                  .getElementById("phone_no")
                                                  .focus();
                                              }, 1000);
                                            }
                                          }
                                        }}
                                        onBlur={(e) => {}}
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
                                        maxLength={10}
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          } else if (
                                            e.shiftKey &&
                                            e.key === "Tab"
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
                                                  .getElementById("whatsapp_no")
                                                  .focus();
                                              }, 1000);
                                            }
                                          } else if (
                                            e.key === "Tab" ||
                                            e.keyCode == 13
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
                                                  .getElementById("whatsapp_no")
                                                  .focus();
                                              }, 1000);
                                            } else {
                                              this.handleKeyDown(e, "email_id");
                                            }
                                          }
                                        }}
                                        onBlur={(e) => {}}
                                        isValid={
                                          touched.whatsapp_no &&
                                          !errors.whatsapp_no
                                        }
                                        isInvalid={!!errors.whatsapp_no}
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
                                        autoComplete="off"
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
                                          } else if (
                                            e.shiftKey &&
                                            e.key === "Tab"
                                          ) {
                                            let email_val =
                                              e.target.value.trim();
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
                                                  .getElementById("email_id")
                                                  .focus();
                                              }, 1000);
                                            }
                                          } else if (
                                            e.key === "Tab" ||
                                            e.keyCode == 13
                                          ) {
                                            let email_val =
                                              e.target.value.trim();
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
                                                  .getElementById("email_id")
                                                  .focus();
                                              }, 1000);
                                            } else {
                                              this.handleKeyDown(
                                                e,
                                                "licenseNo"
                                              );
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
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            this.handleKeyDown(
                                              e,
                                              "date_of_registartion"
                                            );
                                          }
                                        }}
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
                                        } else if (
                                          e.shiftKey &&
                                          e.key === "Tab"
                                        ) {
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
                                              msg: "Please Enter Correct Date. ",
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
                                        } else if (
                                          e.key === "Tab" ||
                                          e.keyCode == 13
                                        ) {
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
                                              msg: "Please Enter Correct Date. ",
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
                                          } else {
                                            setFieldValue(
                                              "date_of_registartion",
                                              e.target.value
                                            );
                                            // this.checkExpiryDate(
                                            //   setFieldValue,
                                            //   e.target.value,
                                            //   "date_of_registartion"
                                            // );

                                            this.handleKeyDown(e, "isCredit");
                                          }
                                        }
                                      }}
                                      onBlur={(e) => {
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
                              <Col lg={6} style={{ borderRight: "1px solid" }}>
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
                                      checked={
                                        values.isCredit == true ? true : false
                                      }
                                      value={
                                        values.isCredit == true ? true : false
                                      }
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          values.isCredit == true
                                            ? this.handleKeyDown(
                                                e,
                                                "credit_days"
                                              )
                                            : // : isUserControl(
                                              //   "is_multi_rates",
                                              //   this.props.userControl
                                              // )
                                              //   ? this.selectRefSalesRate.current?.focus()
                                              this.handleKeyDown(e, "Retailer");
                                        }
                                      }}
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
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    values.credit_days > 0
                                                      ? this.selectRefApplForm.current?.focus()
                                                      : this.handleKeyDown(
                                                          e,
                                                          "credit_bills"
                                                        );
                                                  }
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
                                              <Form.Group
                                                className="mb-2"
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "credit_bills"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.selectRefApplForm}
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
                                                  value={values.applicable_from}
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
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "credit_values"
                                                    );
                                                  }
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
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    isUserControl(
                                                      "is_multi_rates",
                                                      this.props.userControl
                                                    )
                                                      ? this.selectRefSalesRate.current?.focus()
                                                      : this.handleKeyDown(
                                                          e,
                                                          "Retailer"
                                                        );
                                                  }
                                                }}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {errors.credit_values}
                                              </Form.Control.Feedback>
                                            </Form.Group>
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col lg={4}>
                                        {isUserControl(
                                          "is_multi_rates",
                                          this.props.userControl
                                        ) ? (
                                          <Row>
                                            <Col lg={3}>
                                              <Form.Label>
                                                Sales Rate
                                              </Form.Label>
                                            </Col>
                                            <Col lg={7}>
                                              <Form.Group
                                                className=""
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "Retailer"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.selectRefSalesRate}
                                                  className="selectTo"
                                                  id="salesrate"
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      "salesrate",
                                                      e
                                                    );
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
                                        <Row
                                          onKeyDown={(e) => {
                                            if (e.keyCode == 13) {
                                              this.handleKeyDown(
                                                e,
                                                "natureOfBusiness"
                                              );
                                            }
                                          }}
                                        >
                                          <Col lg={3}>
                                            <Form.Check // prettier-ignore
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
                                          <Col lg={4}>
                                            <Form.Check // prettier-ignore
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
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col lg={6}>
                                    <Row>
                                      <Col lg={4}>
                                        <Form.Label>Business Nature</Form.Label>
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
                                              e.target.value =
                                                this.getDataCapitalised(
                                                  e.target.value
                                                );
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.keyCode == 13) {
                                                this.handleKeyDown(e, "isGST");
                                              }
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    setFieldValue(
                                      "registraion_type",
                                      getSelectValue(GSTTypeOpt, 1)
                                    );
                                    // // this.gstFieldshow(e.target.checked);
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
                                      setFieldValue("isGST", e.target.checked);
                                    }
                                  }}
                                  name="isGST"
                                  id="isGST"
                                  checked={values.isGST == true ? true : false}
                                  value={values.isGST == true ? true : false}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      values.isGST == true
                                        ? this.selectRefGST.current?.focus()
                                        : this.handleKeyDown(e, "pan_no");
                                    }
                                  }}
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
                                                  if (values.registraion_type) {
                                                    // this.setErrorBorder(2, "");
                                                  } else {
                                                    // this.setErrorBorder(2, "Y");
                                                    // document
                                                    //   .getElementById("registraion_type")
                                                    //   .focus();
                                                    this.selectRefGST.current?.focus();
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    if (
                                                      values.registraion_type
                                                    ) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "dateofregistartion"
                                                      );
                                                    } else {
                                                      this.selectRefGST.current?.focus();
                                                    }
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
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>Reg. Date</Form.Label>
                                            </Col>
                                            <Col lg={4} className="fRp normalP">
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
                                                // onKeyDown={(e) => {
                                                //   if (e.keyCode == 18) {
                                                //     e.preventDefault();
                                                //   } else if (
                                                //     e.shiftKey &&
                                                //     e.key === "Tab"
                                                //   ) {
                                                //     let datchco = e.target.value.trim();
                                                //     console.log(
                                                //       "datchco",
                                                //       datchco
                                                //     );
                                                //     let checkdate = moment(
                                                //       e.target.value
                                                //     ).format("DD/MM/YYYY");
                                                //     console.log(
                                                //       "checkdate",
                                                //       checkdate
                                                //     );
                                                //     if (
                                                //       datchco != "__/__/____" &&
                                                //       // checkdate ==
                                                //       //   "Invalid date"
                                                //       datchco.includes("_")
                                                //     ) {
                                                //       MyNotifications.fire({
                                                //         show: true,
                                                //         icon: "error",
                                                //         title: "Error",
                                                //         msg:
                                                //           "Please Enter Correct Date. ",
                                                //         is_timeout: true,
                                                //         delay: 1500,
                                                //       });
                                                //       setTimeout(() => {
                                                //         document
                                                //           .getElementById(
                                                //             "dateofregistartion"
                                                //           )
                                                //           .focus();
                                                //       }, 1000);
                                                //     }
                                                //   } else if (
                                                //     e.key === "Tab" ||
                                                //     e.keyCode == 13
                                                //   ) {
                                                //     let datchco = e.target.value.trim();
                                                //     console.log(
                                                //       "datchco",
                                                //       datchco
                                                //     );
                                                //     let checkdate = moment(
                                                //       e.target.value
                                                //     ).format("DD/MM/YYYY");
                                                //     console.log(
                                                //       "checkdate",
                                                //       checkdate
                                                //     );
                                                //     if (
                                                //       datchco != "__/__/____" &&
                                                //       // checkdate ==
                                                //       //   "Invalid date"
                                                //       datchco.includes("_")
                                                //     ) {
                                                //       MyNotifications.fire({
                                                //         show: true,
                                                //         icon: "error",
                                                //         title: "Error",
                                                //         msg:
                                                //           "Please Enter Correct Date. ",
                                                //         is_timeout: true,
                                                //         delay: 1500,
                                                //       });
                                                //       setTimeout(() => {
                                                //         document
                                                //           .getElementById(
                                                //             "dateofregistartion"
                                                //           )
                                                //           .focus();
                                                //       }, 1000);
                                                //     } else {
                                                //       setFieldValue(
                                                //         "date_of_registartion",
                                                //         e.target.value
                                                //       );
                                                //       this.checkExpiryDate(
                                                //         setFieldValue,
                                                //         e.target.value,
                                                //         "date_of_registartion"
                                                //       );
                                                //     }
                                                //   } else {
                                                //     e.preventDefault();
                                                //     values.isGST == true
                                                //       ? this.gstRef.current?.focus()
                                                //       : this.handleKeyDown(
                                                //           e,
                                                //           "isLicense"
                                                //         );
                                                //   }
                                                // }}
                                                onKeyDown={(e) => {
                                                  if (
                                                    e.shiftKey &&
                                                    e.key === "Tab"
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
                                                    // console.log(
                                                    //   "datchco",
                                                    //   datchco
                                                    // );
                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");
                                                    // console.log(
                                                    //   "checkdate",
                                                    //   checkdate
                                                    // );
                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "dateofregistartion"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    }
                                                  } else if (e.key === "Tab") {
                                                    let datchco =
                                                      e.target.value.trim();
                                                    e.preventDefault();
                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");
                                                    // this.checkExpiryDate(
                                                    //   setFieldValue,
                                                    //   e.target.value,
                                                    //   "dateofregistartion"
                                                    // );

                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "dateofregistartion"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    } else {
                                                      if (values.isGST == true)
                                                        this.gstRef.current?.focus();
                                                      else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "isLicense"
                                                        );
                                                      }
                                                    }
                                                  } else if (e.keyCode == 13) {
                                                    e.preventDefault();
                                                    let datchco =
                                                      e.target.value.trim();

                                                    let checkdate = moment(
                                                      e.target.value
                                                    ).format("DD/MM/YYYY");

                                                    // this.checkExpiryDate(
                                                    //   setFieldValue,
                                                    //   e.target.value,
                                                    //   "dateofregistartion"
                                                    // );
                                                    if (
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "dateofregistartion"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    } else {
                                                      if (values.isGST == true)
                                                        this.gstRef.current?.focus();
                                                      else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "isLicense"
                                                        );
                                                      }
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
                                          <Col lg={4}>
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
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    values.isGST == true
                                                      ? this.gstRef.current?.focus()
                                                      : this.handleKeyDown(
                                                          e,
                                                          "isLicense"
                                                        );
                                                  }
                                                }}
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
                                                      values.gstin != undefined
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
                                                          msg: "GSTIN is not Valid!",
                                                          is_button_show: false,
                                                          is_timeout: true,
                                                          delay: 1500,
                                                        });
                                                        setTimeout(() => {
                                                          this.gstRef.current?.focus();
                                                        }, 1000);
                                                      }
                                                    } else {
                                                      // this.gstRef.current?.focus();
                                                      setFieldValue(
                                                        "pan_no",
                                                        ""
                                                      );
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
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
                                                          this.handleKeyDown(
                                                            e,
                                                            "pan_no"
                                                          );
                                                          return values.gstin;
                                                        } else {
                                                          MyNotifications.fire({
                                                            show: true,
                                                            icon: "error",
                                                            title: "Error",
                                                            msg: "GSTIN is not Valid!",
                                                            is_button_show: false,
                                                            is_timeout: true,
                                                            delay: 1500,
                                                          });
                                                          setTimeout(() => {
                                                            this.gstRef.current?.focus();
                                                          }, 1000);
                                                        }
                                                      } else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "pan_no"
                                                        );
                                                        // this.gstRef.current?.focus();
                                                        setFieldValue(
                                                          "pan_no",
                                                          ""
                                                        );
                                                      }
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
                                                  autoComplete="off"
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
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "rowPlusBtn5"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.pan_no}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="normalP">
                                              <Form.Control
                                                type="text"
                                                placeholder="index"
                                                name="index"
                                                className="text-box"
                                                onChange={handleChange}
                                                hidden
                                                value={values.index}
                                              />
                                              <Button
                                                id="rowPlusBtn5"
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    values.gstin != "" &&
                                                    values.gstin != null
                                                  ) {
                                                    let gstObj = {
                                                      id:
                                                        values.bid != null
                                                          ? values.bid
                                                          : "",
                                                      gstin:
                                                        values.gstin != null
                                                          ? values.gstin
                                                          : "",
                                                      dateofregistartion:
                                                        values.dateofregistartion !=
                                                          null &&
                                                        values.dateofregistartion !=
                                                          "NA" &&
                                                        values.dateofregistartion
                                                          ? values.dateofregistartion
                                                          : "",
                                                      pan_no:
                                                        values.pan_no != null
                                                          ? values.pan_no
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
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
                                                      msg: "Please Enter GST Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "isLicense"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
                                                    e.preventDefault();
                                                    if (
                                                      values.gstin != "" &&
                                                      values.gstin != null
                                                    ) {
                                                      let gstObj = {
                                                        id:
                                                          values.bid != null
                                                            ? values.bid
                                                            : "",
                                                        gstin:
                                                          values.gstin != null
                                                            ? values.gstin
                                                            : "",
                                                        dateofregistartion:
                                                          values.dateofregistartion !=
                                                            null &&
                                                          values.dateofregistartion !=
                                                            "NA" &&
                                                          values.dateofregistartion
                                                            ? values.dateofregistartion
                                                            : "",
                                                        pan_no:
                                                          values.pan_no != null
                                                            ? values.pan_no
                                                            : "",
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
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
                                                      this.handleKeyDown(
                                                        e,
                                                        "isLicense"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter GST Details ",
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
                                                console.log("sneha", i, "v", v);
                                                let gstObj = {
                                                  id: v.id,
                                                  registraion_type:
                                                    v.registraion_type,
                                                  gstin: v.gstin,
                                                  dateofregistartion:
                                                    v.dateofregistartion,

                                                  pan_no: v.pan_no,
                                                  // index:
                                                  //   v.index,
                                                };
                                                this.handleFetchGstData(
                                                  gstObj,
                                                  setFieldValue,
                                                  i
                                                );
                                              }}
                                            >
                                              <td style={{ width: "24%" }}>
                                                {/* {v.registration_type!=''? getSelectValue(GSTTypeOpt,v.registration_type).label:''} */}
                                                {v.registraion_type.label}
                                              </td>
                                              <td style={{ width: "25%" }}>
                                                {v.dateofregistartion}
                                              </td>
                                              <td>{v.gstin.toUpperCase()}</td>
                                              <td>{v.pan_no}</td>
                                              <td className="text-center">
                                                <Button
                                                  className="btn_img_ledger"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      e.preventDefault();
                                                      this.removeGstRow(i);
                                                    }
                                                  }}
                                                >
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
                                                </Button>
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // // this.gstFieldshow(e.target.checked);
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
                                  checked={
                                    values.isLicense == true ? true : false
                                  }
                                  value={
                                    values.isLicense == true ? true : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      values.isLicense == true
                                        ? this.licenseTypeRef.current?.focus()
                                        : this.handleKeyDown(e, "isDepartment");
                                    }
                                  }}
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
                                              <Form.Group
                                                className=""
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "licenses_num"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.licenseTypeRef}
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
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>Number</Form.Label>
                                            </Col>
                                            <Col lg={4} className="fLp">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Number"
                                                  name="licenses_num"
                                                  id="licenses_num"
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
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "licenses_exp"
                                                      );
                                                    }
                                                  }}
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
                                                  } else if (
                                                    e.shiftKey &&
                                                    e.key === "Tab"
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
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
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "licenses_exp"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    }
                                                  } else if (
                                                    e.key === "Tab" ||
                                                    e.keyCode == 13
                                                  ) {
                                                    let datchco =
                                                      e.target.value.trim();
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
                                                      datchco != "__/__/____" &&
                                                      // checkdate ==
                                                      //   "Invalid date"
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
                                                            "licenses_exp"
                                                          )
                                                          .focus();
                                                      }, 1000);
                                                    } else {
                                                      this.handleKeyDown(
                                                        e,
                                                        "rowPlusBtn6"
                                                      );
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
                                                id="rowPlusBtn6"
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  if (
                                                    values.licences_type !=
                                                      "" &&
                                                    values.licences_type != null
                                                  ) {
                                                    let licensesObj = {
                                                      id:
                                                        values.lid != null
                                                          ? values.lid
                                                          : "",
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
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
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
                                                      msg: "Please Enter Licenses Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "isDepartment"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
                                                    e.preventDefault();
                                                    if (
                                                      values.licences_type !=
                                                        "" &&
                                                      values.licences_type !=
                                                        null
                                                    ) {
                                                      let licensesObj = {
                                                        id:
                                                          values.lid != null
                                                            ? values.lid
                                                            : "",
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
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
                                                      };
                                                      this.addLicensesRow(
                                                        licensesObj,
                                                        setFieldValue
                                                      );
                                                      this.handleKeyDown(
                                                        e,
                                                        "isDepartment"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Licenses Details ",
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
                                                console.log("sneha", i, "v", v);
                                                let licensesObj = {
                                                  id: v.lid,
                                                  licences_type:
                                                    v.licences_type,
                                                  licenses_num: v.licenses_num,
                                                  licenses_exp: v.licenses_exp,
                                                  index: i,
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
                                                <Button
                                                  className="btn_img_ledger"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode === 13) {
                                                      e.preventDefault();
                                                      this.removeLicensesRow(i);
                                                    }
                                                  }}
                                                >
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
                                                </Button>
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // // this.gstFieldshow(e.target.checked);
                                    // setFieldValue(
                                    //   "isDepartment",
                                    //   e.target.checked
                                    // );
                                    if (deptList.length > 0) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "warning",
                                        title: "Warning",
                                        msg: "Please Remove Department List. ",
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
                                  checked={
                                    values.isDepartment == true ? true : false
                                  }
                                  value={
                                    values.isDepartment == true ? true : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      values.isDepartment == true
                                        ? this.deptRef.current?.focus()
                                        : this.handleKeyDown(
                                            e,
                                            "isBankDetails"
                                          );
                                    }
                                  }}
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
                                                  ref={this.deptRef}
                                                  className="text-box"
                                                  type="text"
                                                  autoComplete="off"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Department"
                                                  name="dept"
                                                  onChange={handleChange}
                                                  value={values.dept}
                                                  isValid={
                                                    touched.dept && !errors.dept
                                                  }
                                                  onInput={(e) => {
                                                    e.target.value =
                                                      this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                  }}
                                                  isInvalid={!!errors.dept}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "contact_person"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.dept}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>Name</Form.Label>
                                            </Col>
                                            <Col lg={4} className="normalP">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  autoComplete="off"
                                                  placeholder="Contact Person"
                                                  name="contact_person"
                                                  id="contact_person"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  value={values.contact_person}
                                                  isValid={
                                                    touched.contact_person &&
                                                    !errors.contact_person
                                                  }
                                                  onInput={(e) => {
                                                    e.target.value =
                                                      this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                  }}
                                                  isInvalid={
                                                    !!errors.contact_person
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "email"
                                                      );
                                                    }
                                                  }}
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
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>E-mail</Form.Label>
                                            </Col>
                                            <Col lg={4} className="fLp">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  autoComplete="off"
                                                  placeholder=" E-mail"
                                                  name="email"
                                                  id="email"
                                                  className="text-box"
                                                  // disabled={isInputDisabled}
                                                  onChange={handleChange}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 18) {
                                                      e.preventDefault();
                                                    } else if (
                                                      e.shiftKey &&
                                                      e.key === "Tab"
                                                    ) {
                                                      let email_val =
                                                        e.target.value.trim();
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
                                                          msg: "Please Enter Valid Email Id. ",
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
                                                      e.key === "Tab" ||
                                                      e.keyCode == 13
                                                    ) {
                                                      let email_val =
                                                        e.target.value.trim();
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
                                                          msg: "Please Enter Valid Email Id. ",
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
                                                      } else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "contact_no"
                                                        );
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
                                                  autoComplete="off"
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
                                                    } else if (
                                                      e.shiftKey &&
                                                      e.key === "Tab"
                                                    ) {
                                                      let mob =
                                                        e.target.value.trim();
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
                                                          msg: "Please Enter 10 Digit Number. ",
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
                                                      e.key === "Tab" ||
                                                      e.keyCode == 13
                                                    ) {
                                                      let mob =
                                                        e.target.value.trim();
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
                                                          msg: "Please Enter 10 Digit Number. ",
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
                                                      } else {
                                                        this.handleKeyDown(
                                                          e,
                                                          "rowPlusBtn7"
                                                        );
                                                      }
                                                    }
                                                  }}
                                                  onBlur={(e) => {}}
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
                                                id="rowPlusBtn7"
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
                                                      id:
                                                        values.did != null
                                                          ? values.did
                                                          : "",
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
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
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
                                                      msg: "Please Enter Department Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "isBankDetails"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
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
                                                        id:
                                                          values.did != null
                                                            ? values.did
                                                            : "",
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
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
                                                      };
                                                      this.addDeptRow(
                                                        deptObj,
                                                        setFieldValue
                                                      );
                                                      this.handleKeyDown(
                                                        e,
                                                        "isBankDetails"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Department Details ",
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
                                                  "sneha dpt",
                                                  i,
                                                  "v",
                                                  v
                                                );

                                                let deptObj = {
                                                  dept: v.dept,
                                                  id: v.did,
                                                  contact_no: v.contact_no,

                                                  contact_person:
                                                    v.contact_person,
                                                  email: v.email,
                                                  index: i,
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
                                                <Button
                                                  className="btn_img_ledger"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      e.preventDefault();
                                                      this.removeDeptRow(i);
                                                    }
                                                  }}
                                                >
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
                                                </Button>
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
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // // this.gstFieldshow(e.target.checked);
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
                                  checked={
                                    values.isBankDetails == true ? true : false
                                  }
                                  value={
                                    values.isBankDetails == true ? true : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      values.isBankDetails == true
                                        ? this.bankRef.current?.focus()
                                        : this.handleKeyDown(e, "isSalesman");
                                    }
                                  }}
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
                                                  ref={this.bankRef}
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder="Bank Name"
                                                  id="bank_name"
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
                                                  isInvalid={!!errors.bank_name}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "bank_account_no"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_name}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto fLp">
                                              <Form.Label>A/C</Form.Label>
                                            </Col>
                                            <Col lg={5}>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Number"
                                                  name="bank_account_no"
                                                  id="bank_account_no"
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
                                                  isInvalid={
                                                    !!errors.bank_account_no
                                                  }
                                                  maxLength={14}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "bank_ifsc_code"
                                                      );
                                                    }
                                                  }}
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
                                                  id="bank_ifsc_code"
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
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "bank_branch"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_ifsc_code}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={2} className="my-auto fLp">
                                              <Form.Label>Branch</Form.Label>
                                            </Col>
                                            <Col lg={3} className="fLp">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  // disabled={isInputDisabled}
                                                  placeholder=" Branch"
                                                  name="bank_branch"
                                                  id="bank_branch"
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
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "rowPlusBtn8"
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  {errors.bank_branch}
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="noP">
                                              <Button
                                                id="rowPlusBtn8"
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();

                                                  if (
                                                    values.bank_name != "" &&
                                                    values.bank_name != null &&
                                                    values.bank_account_no !=
                                                      "" &&
                                                    values.bank_account_no !=
                                                      null &&
                                                    values.bank_ifsc_code !=
                                                      "" &&
                                                    values.bank_ifsc_code !=
                                                      null &&
                                                    values.bank_branch != "" &&
                                                    values.bank_branch != null
                                                  ) {
                                                    let bankObj = {
                                                      bank_name:
                                                        values.bank_name != null
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
                                                      id:
                                                        values.bid != null
                                                          ? values.bid
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
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
                                                      msg: "Please Submit All Bank Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "isSalesman"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
                                                    e.preventDefault();
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
                                                        id:
                                                          values.bid != null
                                                            ? values.bid
                                                            : "",
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
                                                      };
                                                      this.addBankRow(
                                                        bankObj,
                                                        setFieldValue
                                                      );
                                                      this.handleKeyDown(
                                                        e,
                                                        "isSalesman"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Submit All Bank Details ",
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
                                {/* {JSON.stringify(bankList)} */}
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
                                                  id: v.bid,
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
                                                <Button
                                                  style={{
                                                    marginTop: "-12px",
                                                  }}
                                                  className="btn_img_ledger"
                                                  variant=""
                                                  type="button"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      e.preventDefault();
                                                      this.removeBankRow(i);
                                                    }
                                                  }}
                                                >
                                                  <img
                                                    src={Delete}
                                                    alt=""
                                                    className="table_delete_icon"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      this.removeBankRow(i);
                                                    }}
                                                  />
                                                </Button>
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
                                <Form.Check
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
                                  checked={
                                    values.isSalesman == true ? true : false
                                  }
                                  value={
                                    values.isSalesman == true ? true : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      values.isSalesman == true
                                        ? this.selectRefSalesMan.current?.focus()
                                        : this.handleKeyDown(
                                            e,
                                            "isShippingDetails"
                                          );
                                    }
                                  }}
                                />
                              </Card.Header>
                              <Card.Body>
                                <div className="card_sub_header">
                                  <Row>
                                    {values.isSalesman == true ? (
                                      <>
                                        <Col lg={9}>
                                          <Row>
                                            <Col lg={2} className="my-auto">
                                              <Form.Label>Salesman</Form.Label>
                                            </Col>
                                            <Col lg={3}>
                                              <Form.Group
                                                className=""
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "rowPlusBtn9"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.selectRefSalesMan}
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
                                                  }}
                                                  value={values.salesmanId}
                                                  styles={ledger_select}
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto">
                                              <Button
                                                id="rowPlusBtn9"
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  this.setState({
                                                    salesMaster: true,
                                                  });
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.selectRefArea.current?.focus();
                                                  }
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
                                              <Form.Group
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "rowPlusBtn10"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.selectRefArea}
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
                                                    setFieldValue("areaId", v);
                                                  }}
                                                  value={values.areaId}
                                                  styles={ledger_select}
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col lg={1} className="my-auto">
                                              <Button
                                                id="rowPlusBtn10"
                                                className="rowPlusBtn"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  this.setState({
                                                    areaMaster: true,
                                                  });
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "route"
                                                    );
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

                                        <Col lg={3}>
                                          <Row>
                                            <Col lg={3} className="my-auto fLp">
                                              <Form.Label>Route</Form.Label>
                                            </Col>
                                            <Col lg={8} className="sFbP">
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  autoComplete="off"
                                                  placeholder="Enter Route"
                                                  name="route"
                                                  id="route"
                                                  className="text-box"
                                                  onChange={handleChange}
                                                  value={values.route}
                                                  onInput={(e) => {
                                                    e.target.value =
                                                      this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "isShippingDetails"
                                                      );
                                                    }
                                                  }}
                                                />
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Row>
                                </div>
                              </Card.Body>
                            </Card>
                            <Card className="bottom_card_style">
                              <Card.Header className="d-flex">
                                <h3 className="my-auto">Shipping Details</h3>
                                <Form.Check
                                  type="switch"
                                  className="ms-1"
                                  onClick={this.handleSwitchClick}
                                  onChange={(e) => {
                                    console.log(
                                      "Is Checked:--->",
                                      e.target.checked
                                    );
                                    // // this.gstFieldshow(e.target.checked);
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
                                  checked={
                                    values.isShippingDetails == true
                                      ? true
                                      : false
                                  }
                                  value={
                                    values.isShippingDetails == true
                                      ? true
                                      : false
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      values.isShippingDetails == true
                                        ? this.shippingRef.current?.focus()
                                        : this.handleKeyDown(
                                            e,
                                            "dr_submit_btn"
                                          );
                                    }
                                  }}
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
                                                  ref={this.shippingRef}
                                                  type="text"
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
                                                  onInput={(e) => {
                                                    e.target.value =
                                                      this.getDataCapitalised(
                                                        e.target.value
                                                      );
                                                  }}
                                                  isInvalid={
                                                    !!errors.shipping_address
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      this.selectRefdistrict.current?.focus();
                                                    }
                                                  }}
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
                                              <Form.Group
                                                onKeyDown={(e) => {
                                                  if (e.keyCode == 13) {
                                                    this.handleKeyDown(
                                                      e,
                                                      "rowPlusBtn11"
                                                    );
                                                  }
                                                }}
                                              >
                                                <Select
                                                  ref={this.selectRefdistrict}
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
                                                id="rowPlusBtn11"
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
                                                      id:
                                                        values.sid != null
                                                          ? values.sid
                                                          : "",
                                                      district:
                                                        values.district != null
                                                          ? values.district
                                                          : "",
                                                      shipping_address:
                                                        values.shipping_address !=
                                                        null
                                                          ? values.shipping_address
                                                          : "",
                                                      index: !isNaN(
                                                        parseInt(values.index)
                                                      )
                                                        ? values.index
                                                        : -1,
                                                    };
                                                    console.log(
                                                      "addShip shipObj <<<<<<<<<<<<< ",
                                                      shipObj
                                                    );
                                                    this.addShippingRow(
                                                      shipObj,
                                                      setFieldValue
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Please Enter Shipping Details ",
                                                      // is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.keyCode === 13) {
                                                    // e.preventDefault();
                                                    this.handleKeyDown(
                                                      e,
                                                      "dr_submit_btn"
                                                    );
                                                  }
                                                  if (e.keyCode === 32) {
                                                    e.preventDefault();
                                                    if (
                                                      values.district != "" &&
                                                      values.district != null &&
                                                      values.shipping_address !=
                                                        "" &&
                                                      values.shipping_address !=
                                                        null
                                                    ) {
                                                      let shipObj = {
                                                        id:
                                                          values.sid != null
                                                            ? values.sid
                                                            : "",
                                                        district:
                                                          values.district !=
                                                          null
                                                            ? values.district
                                                            : "",
                                                        shipping_address:
                                                          values.shipping_address !=
                                                          null
                                                            ? values.shipping_address
                                                            : "",
                                                        index: !isNaN(
                                                          parseInt(values.index)
                                                        )
                                                          ? values.index
                                                          : -1,
                                                      };
                                                      console.log(
                                                        "addShip shipObj <<<<<<<<<<<<< ",
                                                        shipObj
                                                      );
                                                      this.addShippingRow(
                                                        shipObj,
                                                        setFieldValue
                                                      );
                                                      this.handleKeyDown(
                                                        e,
                                                        "dr_submit_btn"
                                                      );
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "Please Enter Shipping Details ",
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
                                                  district: v.district,
                                                  id: v.sid,
                                                  shipping_address:
                                                    v.shipping_address,
                                                  index: i,
                                                };
                                                this.handleFetchShippingData(
                                                  shipObj,
                                                  setFieldValue,
                                                  i
                                                );
                                              }}
                                            >
                                              <td style={{ width: "67%" }}>
                                                {v.shipping_address}
                                              </td>
                                              <td>
                                                {
                                                  getSelectValue(
                                                    stateOpt,
                                                    v.district
                                                  ).label
                                                }
                                              </td>

                                              <td className="text-end">
                                                <Button
                                                  className="btn_img_ledger"
                                                  onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                      e.preventDefault();
                                                      this.removeShippingRow(i);
                                                    }
                                                  }}
                                                >
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
                                                </Button>
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
                      </div>

                      {/* sundry debetor form start  */}
                      {/* <div className=" form-style p-0"> */}
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
                            id="dr_submit_btn"
                            className="submit-btn"
                            type="submit"
                            onKeyDown={(e) => {
                              if (e.keyCode === 32) {
                                e.preventDefault();
                              } else if (e.keyCode === 13) {
                                this.myRef.current.handleSubmit();
                              }
                            }}
                          >
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
                                    // this.CancelAPICall()
                                    // if (this.state.source != "") {
                                    //   eventBus.dispatch("page_change", {
                                    //     from: "ledgeredit",
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
                                    if (
                                      this.state.source &&
                                      this.state.source != ""
                                    ) {
                                      if (
                                        this.state.source.opType === "create"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data:
                                              this.state.source.invoice_data,
                                            ...this.state.source,
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else if (
                                        this.state.source.opType === "edit"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: "ledgerlist",
                                        prop_data: {
                                          editId: this.state.edit_data.id,
                                          rowId:
                                            this.props.block.prop_data.rowId,
                                          filter_data:
                                            this.props.block.prop_data
                                              .filter_list,
                                          selectedFilter:
                                            this.props.block.prop_data
                                              .selectedFilter,
                                        },
                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                    }
                                  },
                                  handleFailFn: () => {},
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
                                      //     from: "ledgeredit",
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
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data:
                                                  this.state.source
                                                    .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        // eventBus.dispatch(
                                        //   "page_change",
                                        //   "ledgerlist"
                                        // );
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          prop_data: {
                                            editId: this.state.edit_data.id,
                                            rowId:
                                              this.props.block.prop_data.rowId,
                                            selectedFilter:
                                              this.props.block.prop_data
                                                .selectedFilter,
                                            searchValue:
                                              this.props.block.prop_data
                                                .searchValue,
                                          },
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    },
                                    handleFailFn: () => {},
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
                      {/* </div> */}
                      {/* sundry debetor form end  */}
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
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (values.hasOwnProperty("isTaxation")) {
                                        if (values.isTaxation.value == true)
                                          this.handleKeyDown(e, "gstin");
                                        else this.handleKeyDown(e, "bank_name");
                                      } else this.handleKeyDown(e, "bank_name");
                                      // this.SelectRefTaxation.current?.focus();
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.SelectRefTaxation}
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
                                              maxLength={15}
                                              className="text-box"
                                              id="gstin"
                                              onChange={handleChange}
                                              onBlur={(e) => {
                                                e.preventDefault();
                                                if (values.gstin != "") {
                                                  if (
                                                    GSTINREX.test(values.gstin)
                                                  ) {
                                                    return values.gstin;
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "GSTIN is not Valid!",
                                                      is_button_show: false,
                                                      is_timeout: true,
                                                      delay: 1500,
                                                    });
                                                    setTimeout(() => {
                                                      document
                                                        .getElementById("gstin")
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
                                                touched.gstin && !errors.gstin
                                              }
                                              isInvalid={!!errors.gstin}
                                              onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                  if (values.gstin != "") {
                                                    if (
                                                      GSTINREX.test(
                                                        values.gstin
                                                      )
                                                    ) {
                                                      this.handleKeyDown(
                                                        e,
                                                        "bank_name"
                                                      );
                                                      return values.gstin;
                                                    } else {
                                                      MyNotifications.fire({
                                                        show: true,
                                                        icon: "error",
                                                        title: "Error",
                                                        msg: "GSTIN is not Valid!",
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
                                                  } else {
                                                    this.handleKeyDown(
                                                      e,
                                                      "bank_name"
                                                    );
                                                  }
                                                }
                                              }}
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
                                      autoComplete="off"
                                      placeholder="Bank Name"
                                      name="bank_name"
                                      id="bank_name"
                                      className="text-box"
                                      onChange={handleChange}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                      value={values.bank_name}
                                      isValid={
                                        touched.bank_name && !errors.bank_name
                                      }
                                      isInvalid={!!errors.bank_name}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(
                                            e,
                                            "bank_account_no"
                                          );
                                        }
                                      }}
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
                                      id="bank_account_no"
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
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(
                                            e,
                                            "bank_ifsc_code"
                                          );
                                        }
                                      }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_account_no}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md={1}>
                                  <Form.Label>IFSC Code </Form.Label>
                                </Col>
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      placeholder="IFSC Code"
                                      name="bank_ifsc_code"
                                      id="bank_ifsc_code"
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
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(e, "bank_branch");
                                        }
                                      }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_ifsc_code}
                                    </Form.Control.Feedback>
                                  </Form.Group>
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
                                      id="bank_branch"
                                      className="text-box"
                                      onChange={handleChange}
                                      onKeyPress={(e) => {
                                        OnlyAlphabets(e);
                                      }}
                                      value={values.bank_branch}
                                      isValid={
                                        touched.bank_branch &&
                                        !errors.bank_branch
                                      }
                                      isInvalid={!!errors.bank_branch}
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(
                                            e,
                                            "bank_act_submit_btn"
                                          );
                                        }
                                      }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.bank_branch}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                                <Col md={8} className="text-end">
                                  <Form.Control
                                    type="text"
                                    placeholder="index"
                                    name="index"
                                    className="text-box"
                                    onChange={handleChange}
                                    hidden
                                    value={values.index}
                                  />
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
                                              id: values.bid != null ? values.bid : "",
                                              index: !isNaN(parseInt(values.index))
                                                ? values.index
                                                : -1,
                                            };
                                            this.addBankRow(bankObj, setFieldValue);
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Bank Details ",
                                              is_button_show: false,
                                            });
                                          }
                                        }}
                                      >
                                        ADD ROW
                                      </Button> */}
                                  {/* <Button
                                        className="create-btn me-0 successbtn-style"
                                        onClick={(e) => {
                                          console.log("handle Fetch GST called");
                                          e.preventDefault();
                                          this.clearBankData(setFieldValue);
                                        }}
                                      >
                                        CLEAR
                                      </Button> */}
                                </Col>
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
                                                      };
                                                      this.handleFetchBankData(
                                                        bankObj,
                                                        setFieldValue,
                                                        i
                                                      );
                                                    }}
                                                  >
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
                                                          this.removeBankRow(i);
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
                            id="bank_act_submit_btn"
                            className="submit-btn"
                            type="submit"
                            onKeyDown={(e) => {
                              if (e.keyCode === 32) {
                                e.preventDefault();
                              } else if (e.keyCode === 13) {
                                this.myRef.current.handleSubmit();
                              }
                            }}
                          >
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
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "ledgerlist"
                                    // );
                                    // this.CancelAPICall();
                                    // if (this.state.source != "") {
                                    //   eventBus.dispatch("page_change", {
                                    //     from: "ledgeredit",
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
                                    if (
                                      this.state.source &&
                                      this.state.source != ""
                                    ) {
                                      if (
                                        this.state.source.opType === "create"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data:
                                              this.state.source.invoice_data,
                                            ...this.state.source,
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else if (
                                        this.state.source.opType === "edit"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: "ledgerlist",
                                        prop_data: {
                                          editId: this.state.edit_data.id,
                                          rowId:
                                            this.props.block.prop_data.rowId,
                                          selectedFilter:
                                            this.props.block.prop_data
                                              .selectedFilter,
                                          searchValue:
                                            this.props.block.prop_data
                                              .searchValue,
                                        },
                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                    }
                                  },
                                  handleFailFn: () => {},
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
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );

                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgeredit",
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

                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data:
                                                  this.state.source
                                                    .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        // eventBus.dispatch(
                                        //   "page_change",
                                        //   "ledgerlist"
                                        // );
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          prop_data: {
                                            editId: this.state.edit_data.id,
                                            rowId:
                                              this.props.block.prop_data.rowId,
                                            selectedFilter:
                                              this.props.block.prop_data
                                                .selectedFilter,
                                            searchValue:
                                              this.props.block.prop_data
                                                .searchValue,
                                          },
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    },
                                    handleFailFn: () => {},
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
                                    <Form.Group
                                      className=""
                                      onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                          this.handleKeyDown(
                                            e,
                                            "duties_taxes_submit_btn"
                                          );
                                        }
                                      }}
                                    >
                                      <Select
                                        ref={this.selectRefTaxType}
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
                                        invalid={errors.tax_type ? true : false}
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
                            id="duties_taxes_submit_btn"
                            className="submit-btn"
                            type="submit"
                            onKeyDown={(e) => {
                              if (e.keyCode === 32) {
                                e.preventDefault();
                              } else if (e.keyCode === 13) {
                                this.myRef.current.handleSubmit();
                              }
                            }}
                          >
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
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "ledgerlist"
                                    // );
                                    // this.CancelAPICall();
                                    // if (this.state.source != "") {
                                    //   eventBus.dispatch("page_change", {
                                    //     from: "ledgeredit",
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
                                    if (
                                      this.state.source &&
                                      this.state.source != ""
                                    ) {
                                      if (
                                        this.state.source.opType === "create"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data:
                                              this.state.source.invoice_data,
                                            ...this.state.source,
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else if (
                                        this.state.source.opType === "edit"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: "ledgerlist",
                                        prop_data: {
                                          editId: this.state.edit_data.id,
                                          rowId:
                                            this.props.block.prop_data.rowId,
                                          filter_data:
                                            this.props.block.prop_data
                                              .filter_list,
                                          selectedFilter:
                                            this.props.block.prop_data
                                              .selectedFilter,
                                        },
                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                    }
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
                            }}
                            type="button"
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
                                      //   "ledgerlist"
                                      // );

                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgeredit",
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
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data:
                                                  this.state.source
                                                    .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        // eventBus.dispatch(
                                        //   "page_change",
                                        //   "ledgerlist"
                                        // );
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          prop_data: {
                                            editId: this.state.edit_data.id,
                                            rowId:
                                              this.props.block.prop_data.rowId,
                                            selectedFilter:
                                              this.props.block.prop_data
                                                .selectedFilter,
                                            searchValue:
                                              this.props.block.prop_data
                                                .searchValue,
                                          },
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    },
                                    handleFailFn: () => {},
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
                            id="others_submit_btn"
                            className="submit-btn"
                            type="submit"
                            onKeyDown={(e) => {
                              if (e.keyCode === 32) {
                                e.preventDefault();
                              } else if (e.keyCode === 13) {
                                this.myRef.current.handleSubmit();
                              }
                            }}
                          >
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
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "ledgerlist"
                                    // );
                                    // this.CancelAPICall();
                                    // if (this.state.source != "") {
                                    //   eventBus.dispatch("page_change", {
                                    //     from: "ledgeredit",
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
                                    if (
                                      this.state.source &&
                                      this.state.source != ""
                                    ) {
                                      if (
                                        this.state.source.opType === "create"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data:
                                              this.state.source.invoice_data,
                                            ...this.state.source,
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else if (
                                        this.state.source.opType === "edit"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: "ledgerlist",
                                        prop_data: {
                                          editId: this.state.edit_data.id,
                                          rowId:
                                            this.props.block.prop_data.rowId,
                                          filter_data:
                                            this.props.block.prop_data
                                              .filter_list,
                                          searchValue:
                                            this.props.block.prop_data
                                              .searchValue,
                                          selectedFilter:
                                            this.props.block.prop_data
                                              .selectedFilter,
                                        },
                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                    }
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
                            }}
                            type="button"
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
                                      //   "ledgerlist"
                                      // );

                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgeredit",
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
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data:
                                                  this.state.source
                                                    .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        // eventBus.dispatch(
                                        //   "page_change",
                                        //   "ledgerlist"
                                        // );
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          prop_data: {
                                            editId: this.state.edit_data.id,
                                            rowId:
                                              this.props.block.prop_data.rowId,
                                            selectedFilter:
                                              this.props.block.prop_data
                                                .selectedFilter,
                                            searchValue:
                                              this.props.block.prop_data
                                                .searchValue,
                                          },
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    },
                                    handleFailFn: () => {},
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
                            id="assets_submit_btn"
                            className="submit-btn"
                            type="submit"
                            onKeyDown={(e) => {
                              if (e.keyCode === 32) {
                                e.preventDefault();
                              } else if (e.keyCode === 13) {
                                this.myRef.current.handleSubmit();
                              }
                            }}
                          >
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
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "ledgerlist"
                                    // );
                                    // this.CancelAPICall();
                                    // if (this.state.source != "") {
                                    //   eventBus.dispatch("page_change", {
                                    //     from: "ledgeredit",
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
                                    if (
                                      this.state.source &&
                                      this.state.source != ""
                                    ) {
                                      if (
                                        this.state.source.opType === "create"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            rows: this.state.source.rows,
                                            invoice_data:
                                              this.state.source.invoice_data,
                                            ...this.state.source,
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else if (
                                        this.state.source.opType === "edit"
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: this.state.source.from_page,
                                          prop_data: {
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                          },
                                          isNewTab: false,
                                        });
                                        this.setState({ source: "" });
                                      } else {
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgerlist"
                                      // );
                                      eventBus.dispatch("page_change", {
                                        from: "ledgeredit",
                                        to: "ledgerlist",
                                        prop_data: {
                                          editId: this.state.edit_data.id,
                                          rowId:
                                            this.props.block.prop_data.rowId,
                                          filter_data:
                                            this.props.block.prop_data
                                              .filter_list,
                                        },
                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                    }
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
                            }}
                            type="button"
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
                                      //   "ledgerlist"
                                      // );

                                      // if (this.state.source != "") {
                                      //   eventBus.dispatch("page_change", {
                                      //     from: "ledgeredit",
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
                                      if (
                                        this.state.source &&
                                        this.state.source != ""
                                      ) {
                                        if (
                                          this.state.source.opType === "create"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              ...this.state.source,
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data:
                                                  this.state.source
                                                    .invoice_data,
                                                ...this.state.source,
                                              },
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            from: "ledgeredit",
                                            to: "ledgerlist",
                                            isNewTab: false,
                                            isCancel: true,
                                          });
                                        }
                                      } else {
                                        // eventBus.dispatch(
                                        //   "page_change",
                                        //   "ledgerlist"
                                        // );
                                        eventBus.dispatch("page_change", {
                                          from: "ledgeredit",
                                          to: "ledgerlist",
                                          prop_data: {
                                            editId: this.state.edit_data.id,
                                            rowId:
                                              this.props.block.prop_data.rowId,
                                            selectedFilter:
                                              this.props.block.prop_data
                                                .selectedFilter,
                                            searchValue:
                                              this.props.block.prop_data
                                                .searchValue,
                                          },
                                          isNewTab: false,
                                          isCancel: true,
                                        });
                                      }
                                    },
                                    handleFailFn: () => {},
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
                {/* Assets end  */}
              </Form>
            )}
          </Formik>

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
                initialValues={initValS}
                // enableReinitialize={true}
                // validationSchema={Yup.object().shape({
                //   packageName: Yup.string()
                //     .nullable()
                //     .trim()
                //     // .matches(alphaNumericRex, "Enter alpha-numeric")
                //     .required("Package name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.first_name == "") {
                    errorArray.push("v");
                  } else {
                    errorArray.push("");
                  }
                  if (values.mobile_number == "") {
                    errorArray.push("v");
                  } else {
                    errorArray.push("");
                  }
                  this.setState({ errorArrayBorder: errorArray }, () => {
                    if (allEqual(errorArray)) {
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
                            requestData.append(
                              "middleName",
                              values.middle_name
                            );
                            requestData.append(
                              "mobileNumber",
                              values.mobile_number
                            );
                            requestData.append("pincode", values.pincode);
                            requestData.append(
                              "address",
                              values.address != "" ? values.address : ""
                            );
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
                              .catch((error) => {});
                          },
                          handleFailFn: () => {},
                        },
                        () => {
                          console.warn("return_data");
                        }
                      );
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
                              <Form.Label>
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  autoComplete="true"
                                  autoFocus={true}
                                  type="text"
                                  placeholder="First Name"
                                  name="first_name"
                                  id="first_name"
                                  // className="text-box"
                                  className={`${
                                    values.first_name == "" &&
                                    errorArrayBorder[0] == "v"
                                      ? "border border-danger open-text-box text-box"
                                      : "open-text-box text-box"
                                  }`}
                                  value={values.first_name}
                                  onChange={handleChange}
                                  ref={(input) => {
                                    this.nameInput = input;
                                  }}
                                  // onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalisedSalesmaster(
                                  //     e.target.value
                                  //   );
                                  // }}
                                  // onKeyDown={(e) => {
                                  //   if (e.keyCode === 9 || e.keyCode == 13) {
                                  //     e.preventDefault();
                                  //     if (
                                  //       values.first_name != "" &&
                                  //       values.last_name != null
                                  //     ) {
                                  //       this.handleKeyDown(e, "middle_name");
                                  //     } else {
                                  //       document
                                  //         .getElementById("first_name")
                                  //         .focus();
                                  //     }
                                  //   }
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      e.preventDefault();
                                      if (
                                        values.first_name != "" &&
                                        values.last_name != null
                                      ) {
                                        this.handleKeyDown(e, "middle_name");
                                        e.target.value = handleDataCapitalised(
                                          e.target.value
                                        );
                                        handlesetFieldValue(
                                          setFieldValue,
                                          "first_name",
                                          e.target.value
                                        );
                                      } else {
                                        document
                                          .getElementById("first_name")
                                          ?.focus();
                                      }
                                    } else if (e.key === "Tab") {
                                      e.preventDefault();
                                      if (
                                        values.first_name != "" &&
                                        values.last_name != null
                                      ) {
                                        this.handleKeyDown(e, "middle_name");
                                        e.target.value = handleDataCapitalised(
                                          e.target.value
                                        );
                                        handlesetFieldValue(
                                          setFieldValue,
                                          "first_name",
                                          e.target.value
                                        );
                                      } else {
                                        document
                                          .getElementById("first_name")
                                          ?.focus();
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
                                  // onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalisedSalesmaster(
                                  //     e.target.value
                                  //   );
                                  // }}
                                  // onKeyDown={(e) => {
                                  //   if (e.keyCode == 13) {
                                  //     e.preventDefault();
                                  //     this.handleKeyDown(e, "last_name");
                                  //   }
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      e.preventDefault();
                                      this.handleKeyDown(e, "last_name");
                                      e.target.value = handleDataCapitalised(
                                        e.target.value
                                      );
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "middle_name",
                                        e.target.value
                                      );
                                    } else if (e.key === "Tab") {
                                      this.handleKeyDown(e, "last_name");
                                      e.target.value = handleDataCapitalised(
                                        e.target.value
                                      );
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "middle_name",
                                        e.target.value
                                      );
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
                              {" "}
                              <Form.Label>Last Name</Form.Label>
                            </Col>
                            <Col lg={8}>
                              {" "}
                              <Form.Group>
                                <Form.Control
                                  value={values.last_name}
                                  type="text"
                                  autoComplete="true"
                                  placeholder="Last Name"
                                  name="last_name"
                                  className="text-box"
                                  id="last_name"
                                  onChange={handleChange}
                                  // onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalisedSalesmaster(
                                  //     e.target.value
                                  //   );
                                  // }}
                                  // onKeyDown={(e) => {
                                  //   if (e.keyCode == 13) {
                                  //     e.preventDefault();
                                  //     this.handleKeyDown(e, "mobile_number");
                                  //   }
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      e.preventDefault();
                                      this.handleKeyDown(e, "mobile_number");
                                      e.target.value = handleDataCapitalised(
                                        e.target.value
                                      );
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "last_name",
                                        e.target.value
                                      );
                                    } else if (e.key === "Tab") {
                                      this.handleKeyDown(e, "mobile_number");
                                      e.target.value = handleDataCapitalised(
                                        e.target.value
                                      );
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "last_name",
                                        e.target.value
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
                            <Col lg={4}>
                              {" "}
                              <Form.Label>
                                Mobile No.{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              {" "}
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  autoComplete="true"
                                  placeholder="Mobile Number"
                                  name="mobile_number"
                                  // className="text-box"
                                  className={`${
                                    values.mobile_number == "" &&
                                    errorArrayBorder[1] == "v"
                                      ? "border border-danger open-text-box text-box"
                                      : "open-text-box text-box"
                                  }`}
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
                                    } else if (
                                      // e.key === "Tab" ||
                                      e.keyCode == 13
                                    ) {
                                      e.preventDefault(); //imp for validation of mobile number
                                      let mob = e.target.value.trim();

                                      if (
                                        mob != "" &&
                                        mob.length < 10 &&
                                        mob != null
                                      ) {
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
                                      } else {
                                        this.handleKeyDown(e, "address_sale");
                                      }
                                    }
                                    // else if (
                                    //   e.key === "Tab" ||
                                    //   e.keyCode == 13
                                    // ) {
                                    //   e.preventDefault();
                                    //   let mob = e.target.value.trim();
                                    //   console.log("length--", mob.length);
                                    //   if (
                                    //     (mob != "" && mob.length < 10) ||
                                    //     mob != null
                                    //   ) {
                                    //     console.log(
                                    //       "length--",
                                    //       "plz enter 10 digit no."
                                    //     );
                                    //     MyNotifications.fire({
                                    //       show: true,
                                    //       icon: "error",
                                    //       title: "Error",
                                    //       msg: "Please Enter 10 Digit Number. ",
                                    //       is_timeout: true,
                                    //       delay: 1500,
                                    //     });
                                    //     setTimeout(() => {
                                    //       document
                                    //         .getElementById("mobile_number")
                                    //         .focus();
                                    //     }, 1000);
                                    //   } else {
                                    //     this.handleKeyDown(e, "address_sale");
                                    //   }
                                    // }
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
                                  autoComplete="true"
                                  placeholder="Address"
                                  name="address"
                                  className="text-box"
                                  id="address_sale"
                                  value={values.address}
                                  onChange={handleChange}
                                  onInput={(e) => {
                                    e.target.value =
                                      this.getDataCapitalisedSalesmaster(
                                        e.target.value
                                      );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      e.preventDefault();
                                      this.handleKeyDown(e, "pincode_sale");
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
                              {" "}
                              <Form.Label>Pincode </Form.Label>
                            </Col>
                            <Col lg={8}>
                              {" "}
                              <Form.Group>
                                <Form.Control
                                  autoComplete="true"
                                  type="text"
                                  placeholder="Pincode"
                                  name="pincode"
                                  className="text-box"
                                  id="pincode_sale"
                                  ref={this.pincodeRef}
                                  value={values.pincode}
                                  maxLength={6}
                                  onChange={handleChange}
                                  onKeyPress={(e) => {
                                    OnlyEnterNumbers(e);
                                  }}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   if (e.target.value != "") {
                                  //     this.validatePincode(
                                  //       e.target.value,
                                  //       setFieldValue
                                  //     );
                                  //   }
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 9 || e.keyCode == 13) {
                                      e.preventDefault();
                                      let pincode_val = e.target.value.trim();
                                      if (pincode_val !== "") {
                                        this.validatePincode(
                                          e.target.value,
                                          setFieldValue
                                        );
                                      }
                                      this.handleKeyDown(e, "dob");
                                    } else if (
                                      e.shiftKey == true &&
                                      e.keyCode == 9
                                    ) {
                                      let pincode_val = e.target.value.trim();
                                      if (pincode_val !== "") {
                                        this.validatePincode(
                                          e.target.value,
                                          setFieldValue
                                        );
                                      }
                                    } else if (e.keyCode == 9) {
                                      let pincode_val = e.target.value.trim();
                                      if (pincode_val !== "") {
                                        this.validatePincode(
                                          e.target.value,
                                          setFieldValue
                                        );
                                      }
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
                                  onKeyDown={(e) => {
                                    if (e.key === "Tab" || e.keycode === 13) {
                                      e.preventDefault();
                                      this.handleKeyDown(e, "submitS");
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
                  let errorArray = [];
                  if (values.area_name == "") {
                    errorArray.push("v");
                  } else {
                    errorArray.push("");
                  }
                  if (values.pincode == "") {
                    errorArray.push("v");
                  } else {
                    errorArray.push("");
                  }
                  this.setState({ errorArrayBorder: errorArray }, () => {
                    if (allEqual(errorArray)) {
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
                              .catch((error) => {});
                          },
                          handleFailFn: () => {},
                        },
                        () => {
                          console.warn("return_data");
                        }
                      );
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
                              <Form.Label>
                                Area Name <span className="text-danger">*</span>
                              </Form.Label>
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
                                    e.target.value =
                                      this.getDataCapitalisedArea(
                                        e.target.value
                                      );
                                  }}
                                  ref={(input) => {
                                    this.nameInput = input;
                                  }}
                                  value={values.area_name}
                                  // className="text-box"
                                  className={`${
                                    values.area_name == "" &&
                                    errorArrayBorder[0] == "v"
                                      ? "border border-danger open-text-box text-box"
                                      : "open-text-box text-box"
                                  }`}
                                  onChange={handleChange}
                                  onKeyDown={(e) => {
                                    if (e.key === "Tab" || e.keyCode === 13) {
                                      e.preventDefault();
                                      if (
                                        values.area_name != "" &&
                                        values.area_name != null
                                      )
                                        this.handleKeyDown(e, "area_code");
                                      else
                                        document
                                          .getElementById("area_name")
                                          .focus();
                                    }
                                    // else if (e.keyCode === 9) {
                                    //   e.preventDefault();
                                    //   if (values.area_name != "" && values.area_name != null)
                                    //     this.handleKeyDown(e, "area_code");
                                    //   else
                                    //     document.getElementById("area_name").focus();
                                    // }
                                  }}
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
                                  autoComplete="off"
                                  type="text"
                                  placeholder="Area Code"
                                  name="area_code"
                                  className="text-box"
                                  id="area_code"
                                  onChange={handleChange}
                                  value={values.area_code}
                                  onKeyDown={(e) => {
                                    if (e.key === "Tab") {
                                      // e.preventDefault();
                                      this.handleKeyDown(e, "pincode_area");
                                    } else if (e.keyCode === 13) {
                                      e.preventDefault();
                                      this.handleKeyDown(e, "pincode_area");
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
                              {" "}
                              <Form.Label>
                                Pincode <span className="text-danger">*</span>
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              {" "}
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Pincode"
                                  name="pincode"
                                  // className="text-box"
                                  className={`${
                                    values.pincode == "" &&
                                    errorArrayBorder[1] == "v"
                                      ? "border border-danger open-text-box text-box"
                                      : "open-text-box text-box"
                                  }`}
                                  id="pincode_area"
                                  ref={this.pincodeRef}
                                  onChange={handleChange}
                                  value={values.pincode}
                                  maxLength={6}
                                  onKeyPress={(e) => {
                                    OnlyEnterNumbers(e);
                                  }}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   if (e.target.value != "") {
                                  //     this.validatePincode(
                                  //       e.target.value,
                                  //       setFieldValue
                                  //     );
                                  //   }
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey == true && e.keyCode == 9) {
                                      let pincode_val = e.target.value.trim();
                                      if (pincode_val !== "") {
                                        this.validatePincode(
                                          e.target.value,
                                          setFieldValue
                                        );
                                      }
                                    } else if (e.keyCode == 9) {
                                      let pincode_val = e.target.value.trim();
                                      if (pincode_val !== "") {
                                        this.validatePincode(
                                          e.target.value,
                                          setFieldValue
                                        );
                                      }
                                    } else if (
                                      e.keyCode === 13 ||
                                      e.key == "Tab"
                                    ) {
                                      e.preventDefault();
                                      if (
                                        values.pincode != "" ||
                                        values.pincode != null
                                      ) {
                                        this.handleKeyDown(e, "submit_area");
                                      } else {
                                        document
                                          .getElementById("pincode_area")
                                          .focus();
                                      }
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
                      <Button
                        className="successbtn-style"
                        type="submit"
                        id="submit_area"
                      >
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
              this.setState({ opnBalModalShow: false, openingBal: 0 }, () => {
                if (this.myRef.current.values.underId != "") {
                  if (
                    this.myRef.current.values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "sundry_creditors"
                  ) {
                    document
                      .getElementById("supplier_code_sundry_creditors")
                      .focus();
                  } else if (
                    this.myRef.current.values.underId.ledger_form_parameter_slug.toLowerCase() ==
                    "sundry_debtors"
                  ) {
                    document
                      .getElementById("supplier_code_sundry_debtors")
                      .focus();
                  } else {
                    document.getElementById("ledger_name").focus();
                  }
                } else {
                  document.getElementById("underId").focus();
                }
              });
            });
          }}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
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
              onClick={(e) => {
                e.preventDefault();
                // setTimeout(() => {
                //   this.selectRefBalanceType.current.focus();
                // }, 500);
                this.setState({ index: -1 }, () => {
                  this.setState({
                    opnBalModalShow: false,
                    openingBal: 0,
                    paidAmt: 0,
                    balanceAmt: 0,
                  });
                  this.handleKeyDown(
                    e,
                    this.myRef.current.values.underId != ""
                      ? this.myRef.current.values.underId.ledger_form_parameter_slug.toLowerCase() ==
                        "sundry_creditors"
                        ? "supplier_code_sundry_creditors"
                        : this.myRef.current.values.underId.ledger_form_parameter_slug.toLowerCase() ==
                          "sundry_debtors"
                        ? "supplier_code_sundry_debtors"
                        : "ledger_name"
                      : "underId"
                  );
                });
              }}
            />
            {/* <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handleOpnStockModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button> */}
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
                    if (values.invoice_no == "") {
                      errorArray.push("v");
                    } else {
                      errorArray.push("");
                    }
                    if (values.invoice_date == "") {
                      errorArray.push("v");
                    } else {
                      errorArray.push("");
                    }
                    if (values.bill_amt == "") {
                      errorArray.push("v");
                    } else {
                      errorArray.push("");
                    }
                    if (values.type == null || values.type == "") {
                      errorArray.push("v");
                    } else {
                      errorArray.push("");
                    }
                    this.setState({ errorArrayBorder: errorArray }, () => {
                      if (allEqual(errorArray)) {
                        console.log("values", values);
                        this.addOpeningBalRow(values);
                      }
                    });
                    if (
                      parseInt(this.state.openingBal) == this.finalBillpaidBal()
                    ) {
                      setTimeout(() => {
                        document.getElementById("openwinSub").focus();
                      }, 100);
                    } else
                      setTimeout(() => {
                        document.getElementById("invoice_no").focus();
                      }, 100);
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
                          {/* {JSON.stringify(isOpeningBatch)} */}
                          {/* {JSON.stringify(values)} */}

                          {/* {JSON.stringify(invoiceBillAmt)}
                          {JSON.stringify(invoicePaidBal)} */}
                          {/* <Row>
                            <Col lg={4} md={3} sm={3} xs={3}>
                              <Row>
                                <Col lg={4} md={4} sm={4} xs={4}>
                                  <Form.Label>Opening Balance</Form.Label>
                                </Col>
                                <Col lg={8} md={8} sm={8} xs={8}>
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      placeholder="Opening Bal."
                                      name="openingBal"
                                      id="openingBal"
                                      onChange={(e) => {
                                        e.preventDefault();
                                        let v = e.target.value;
                                        setFieldValue("openingBal", v);
                                      }}
                                      autoFocus={true}
                                      className="text-box text-end"
                                      value={openingBal}
                                      isValid={
                                        touched.openingBal && !errors.openingBal
                                      }
                                      isInvalid={!!errors.openingBal}
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.openingBal}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={4} md={3} sm={3} xs={3}>
                              <Row>
                                <Col
                                  lg={4}
                                  md={4}
                                  sm={4}
                                  xs={4}
                                  className="ps-0"
                                >
                                  <Form.Label>Sum of Balance</Form.Label>
                                </Col>
                                <Col lg={8} md={8} sm={8} xs={8}>
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      placeholder="Paid Bal."
                                      name="paidBal"
                                      id="paidBal"
                                      // onChange={handleChange}
                                      onBlur={(e) => {
                                        e.preventDefault();
                                        let v = e.target.value;
                                        setFieldValue("paidBal", v);
                                        if (v != "") {
                                          this.setState({ paidBal: v });
                                        }
                                        console.log(
                                          "paid amt====::::::::::::::::",
                                          this.state.paidBal
                                        );
                                      }}
                                      className="text-box text-end"
                                      value={this.finalBillpaidBal()}
                                      isValid={
                                        touched.paidBal && !errors.paidBal
                                      }
                                      disabled
                                      isInvalid={!!errors.paidBal}
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.paidBal}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={4} md={3} sm={3} xs={3}>
                              <Row>
                                <Col
                                  lg={4}
                                  md={4}
                                  sm={4}
                                  xs={4}
                                  className="ps-0"
                                >
                                  <Form.Label>Remaining Amt</Form.Label>
                                </Col>
                                <Col lg={8} md={8} sm={8} xs={8}>
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      placeholder="Balance Amt."
                                      name="balanceAmt"
                                      id="balanceAmt"
                                      // onChange={handleChange}
                                      onChange={(e) => {
                                        e.preventDefault();
                                        let v = e.target.value;
                                        if (v != "") {
                                          this.setState({ balanceAmt: v });
                                        } else {
                                          this.setState({ balanceAmt: 0 });
                                        }
                                      }}
                                      disabled
                                      // value={values.balanceAmt}
                                      value={this.finalRemaningAmt()}
                                      isValid={
                                        touched.balanceAmt && !errors.balanceAmt
                                      }
                                      className="text-box text-end"
                                      isInvalid={!!errors.balanceAmt}
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.balanceAmt}
                                    </span>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                          </Row> */}
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
                                          ref={this.invoiceRef}
                                          autoComplete="off"
                                          autoFocus={true}
                                          type="text"
                                          placeholder="Invoice No."
                                          name="invoice_no"
                                          id="invoice_no"
                                          value={values.invoice_no}
                                          onChange={handleChange}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          className={`${
                                            values.invoice_no == "" &&
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
                                            if (e.shiftKey && e.key === "Tab") {
                                            } else if (
                                              e.keyCode == 13 &&
                                              values.invoice_no.trim() != ""
                                            ) {
                                              document
                                                .getElementById("invoice_date")
                                                .focus();
                                            } else if (
                                              e.keyCode == 13 &&
                                              values.invoice_no.trim() == ""
                                            ) {
                                              document
                                                .getElementById("invoice_no")
                                                .focus();
                                            }
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
                                    <Col lg={4} className="p-0">
                                      <Form.Label>Invoice Date</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <MyTextDatePicker
                                        id="invoice_date"
                                        name="invoice_date"
                                        placeholder="DD/MM/YYYY"
                                        // className="open-date"
                                        className={`${
                                          values.invoice_date == "" &&
                                          errorArrayBorder[1] == "v"
                                            ? "border border-danger open-date"
                                            : "open-date"
                                        }`}
                                        value={values.invoice_date}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          } else if (
                                            e.shiftKey &&
                                            e.key === "Tab"
                                          ) {
                                            this.duplicateInvoiceNo(
                                              e.target.value,
                                              values.invoice_no
                                            );
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
                                                msg: "Please Enter Correct Date. ",
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
                                                let curdatetime =
                                                  curdate.getTime();
                                                let mfgDateTime =
                                                  mfgDate.getTime();
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
                                                    msg: "Invoice Date Should not be Greater than todays date",
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
                                            this.duplicateInvoiceNo(
                                              e.target.value,
                                              values.invoice_no
                                            );
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
                                                msg: "Please Enter Correct Date. ",
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
                                            else if (
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
                                                let curdatetime =
                                                  curdate.getTime();
                                                let mfgDateTime =
                                                  mfgDate.getTime();
                                                if (
                                                  curdatetime >= mfgDateTime
                                                ) {
                                                  setFieldValue(
                                                    "invoice_date",
                                                    e.target.value
                                                  );
                                                  this.handleKeyDown(
                                                    e,
                                                    "due_date"
                                                  );
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invoice Date Should not be Greater than todays date",
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
                                          } else if (e.keyCode == 13) {
                                            this.duplicateInvoiceNo(
                                              e.target.value,
                                              values.invoice_no
                                            );
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
                                                msg: "Please Enter Correct Date. ",
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
                                            else if (
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
                                                let curdatetime =
                                                  curdate.getTime();
                                                let mfgDateTime =
                                                  mfgDate.getTime();
                                                if (
                                                  curdatetime >= mfgDateTime
                                                ) {
                                                  setFieldValue(
                                                    "invoice_date",
                                                    e.target.value
                                                  );
                                                  this.handleKeyDown(
                                                    e,
                                                    "due_date"
                                                  );
                                                } else {
                                                  MyNotifications.fire({
                                                    show: true,
                                                    icon: "error",
                                                    title: "Error",
                                                    msg: "Invoice Date Should not be Greater than todays date",
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
                                        }}
                                        // onBlur={(e) => {
                                        //   console.log("e ", e);
                                        //   console.log(
                                        //     "e.target.value ",
                                        //     e.target.value
                                        //   );
                                        //   if (
                                        //     e.target.value != null &&
                                        //     e.target.value != ""
                                        //   ) {
                                        //     setFieldValue(
                                        //       "invoice_date",
                                        //       e.target.value
                                        //     );
                                        //     // this.checkExpiryDate(
                                        //     //   setFieldValue,
                                        //     //   e.target.value,
                                        //     //   "invoice_date"
                                        //     // );
                                        //   } else {
                                        //     // setFieldValue(
                                        //     //   "invoice_date",
                                        //     //   ""
                                        //     // );
                                        //   }
                                        // }}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3} className="mt-1">
                                  <Row>
                                    <Col lg={5} className="p-0">
                                      <Form.Label>Due Date</Form.Label>
                                    </Col>
                                    <Col lg={7}>
                                      <MyTextDatePicker
                                        id="due_date"
                                        name="due_date"
                                        placeholder="DD/MM/YYYY"
                                        className="open-date"
                                        value={values.due_date}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 18) {
                                            e.preventDefault();
                                          } else if (
                                            e.shiftKey &&
                                            e.key === "Tab"
                                          ) {
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
                                                msg: "Please Enter Correct Date. ",
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
                                                      msg: "Expiry date should be greater Invoice Date",
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
                                          } else if (
                                            e.key === "Tab" ||
                                            e.keyCode == 13
                                          ) {
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
                                                msg: "Please Enter Correct Date. ",
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
                                            else if (
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
                                                    this.handleKeyDown(
                                                      e,
                                                      "due_days"
                                                    );
                                                  } else {
                                                    MyNotifications.fire({
                                                      show: true,
                                                      icon: "error",
                                                      title: "Error",
                                                      msg: "Expiry date should be greater Invoice Date",
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
                                                  this.handleKeyDown(
                                                    e,
                                                    "due_days"
                                                  );
                                                }
                                              } else if (
                                                e.target.value == "__/__/____"
                                              ) {
                                                this.handleKeyDown(
                                                  e,
                                                  "due_days"
                                                );
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
                                        // onBlur={(e) => {
                                        //   console.log("e ", e);
                                        //   console.log(
                                        //     "e.target.value ",
                                        //     e.target.value
                                        //   );
                                        //   if (
                                        //     e.target.value != null &&
                                        //     e.target.value != ""
                                        //   ) {
                                        //     setFieldValue(
                                        //       "due_date",
                                        //       e.target.value
                                        //     );
                                        //     // this.checkExpiryDate(
                                        //     //   setFieldValue,
                                        //     //   e.target.value,
                                        //     //   "due_date"
                                        //     // );
                                        //   } else {
                                        //     // setFieldValue(
                                        //     //   "invoice_date",
                                        //     //   ""
                                        //     // );
                                        //   }
                                        // }}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3} className="mt-1">
                                  <Row>
                                    <Col lg={4} className="p-0">
                                      <Form.Label>Due D.</Form.Label>
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
                                          className="open-text-box"
                                          // className={`${values.due_days == "" &&
                                          //   errorArrayBorder[1] == "v"
                                          //   ? "border border-danger open-text-box text-end"
                                          //   : "open-text-box text-end"
                                          //   }`}
                                          onKeyPress={(e) => {
                                            OnlyEnterNumbers(e);
                                          }}
                                          // onKeyDown={(e) => {
                                          //   if (
                                          //     e.key === "Tab" &&
                                          //     !e.target.value.trim()
                                          //   )
                                          //     e.preventDefault();
                                          // }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            ) {
                                              // e.preventDefault();
                                            }
                                            // if (!e.target.value.trim()) { }
                                            else if (e.keyCode == 13) {
                                              this.handleKeyDown(e, "bill_amt");
                                            }
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
                                          onChange={(e) => {
                                            let v = e.target.value;
                                            this.setState({
                                              invoiceBillAmt: v,
                                            });
                                            setFieldValue("bill_amt", v);
                                          }}
                                          // onBlur={(e) => {
                                          //   if (e.target.value != 0) {
                                          //     this.setState({
                                          //       invoiceBillAmt: e.target.value,
                                          //     });
                                          //   }
                                          //   // this.finalInvoiceRemainingAmt(
                                          //   //   e.target.value,
                                          //   //   values.invoice_paid_amt
                                          //   // );
                                          // }}
                                          value={values.bill_amt}
                                          // className="text-box"
                                          className={`${
                                            values.bill_amt == "" &&
                                            errorArrayBorder[2] == "v"
                                              ? "border border-danger open-text-box text-end"
                                              : "open-text-box text-end"
                                          }`}
                                          onKeyPress={(e) => {
                                            OnlyEnterAmount(e);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.shiftKey && e.key === "Tab") {
                                            } else if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            )
                                              e.preventDefault();
                                            else if (
                                              e.keyCode == 9 ||
                                              e.keyCode == 13
                                            )
                                              if (!e.target.value.trim()) {
                                                e.preventDefault();
                                              } else {
                                                this.handleKeyDown(
                                                  e,
                                                  "invoice_paid_amt"
                                                );
                                              }
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
                                    <Col lg={4} className="p-0">
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
                                          onChange={(e) => {
                                            e.preventDefault();
                                            let v = e.target.value;
                                            this.setState({
                                              invoicePaidBal: v,
                                            });
                                            setFieldValue(
                                              "invoice_paid_amt",
                                              v
                                            );
                                          }}
                                          // onBlur={(e) => {
                                          //   if (e.target.value > 0) {
                                          //     this.setState({
                                          //       invoicePaidBal: e.target.value,
                                          //     });
                                          //     this.finalInvoiceRemainingAmt(
                                          //       values.bill_amt,
                                          //       e.target.value
                                          //     );
                                          //   }

                                          //   // setFieldValue(
                                          //   //   "invoice_bal_amt",
                                          //   //   this.state.invoceRemAmt
                                          //   // );
                                          // }}
                                          value={values.invoice_paid_amt}
                                          onKeyDown={(e) => {
                                            if (e.key === "Tab") {
                                              this.finalInvoiceRemainingAmt(
                                                values.bill_amt,
                                                e.target.value
                                              );
                                              // e.preventDefault();
                                            } else if (e.keyCode == 13)
                                              this.handleKeyDown(
                                                e,
                                                "invoice_bal_amt"
                                              );
                                          }}
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
                                    <Col lg={5} className="p-0">
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
                                          //   let v = this.state.invoiceBalAmt;
                                          //   setFieldValue("invoice_bal_amt", v);
                                          //   console.log(
                                          //     "v===============>>>>>>>",
                                          //     this.state.invoiceBalAmt
                                          //   );
                                          //   if (v != "") {
                                          //     this.setState({ invoiceBalAmt: v });
                                          //   } else {
                                          //     this.setState({ invoiceBalAmt: 0 });
                                          //   }
                                          // }}
                                          value={this.finalInvoiceRemainingAmt()}
                                          className="open-text-box"
                                          // className={`${values.invoice_bal_amt == "" &&
                                          //   errorArrayBorder[1] == "v"
                                          //   ? "border border-danger open-text-box text-end"
                                          //   : "open-text-box text-end"
                                          //   }`}
                                          onKeyPress={(e) => {
                                            OnlyEnterAmount(e);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.shiftKey && e.key === "Tab") {
                                            } else if (
                                              e.key === "Tab" &&
                                              !e.target.value.trim()
                                            )
                                              e.preventDefault();
                                            if (e.keyCode === 13) {
                                              this.typeRef.current?.focus();
                                            }
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
                                    <Col lg={4} className="p-0">
                                      <Form.Label>Type</Form.Label>
                                    </Col>
                                    <Col lg={8}>
                                      <Form.Group
                                        className={`${
                                          values.type == "" &&
                                          errorArrayBorder[3] == "v"
                                            ? "border border-danger "
                                            : ""
                                        }`}
                                        style={{ borderRadius: "3px" }}
                                        onKeyDown={(e) => {
                                          if (e.shiftKey && e.key === "Tab") {
                                          } else if (
                                            e.key === "Tab" &&
                                            !values.type
                                          )
                                            e.preventDefault();
                                          else if (e.keyCode == 13)
                                            this.handleKeyDown(e, "submit");
                                          // else if (e.keyCode == 13) {
                                          // }
                                        }}
                                      >
                                        <Select
                                          className="selectTo"
                                          styles={ledger_select}
                                          onChange={(e) => {
                                            setFieldValue("type", e);
                                          }}
                                          options={balanceType}
                                          name="type"
                                          ref={this.typeRef}
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
                              id="submit"
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
                              id="cancel"
                              onClick={(e) => {
                                e.preventDefault();
                                this.clearOpeningBalData();
                                resetForm();
                                // this.clearOpeningStockData();
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  // this.clearOpeningStockData();
                                }
                              }}
                              className="ms-2"
                            >
                              Clear
                            </Button>
                          </Col>
                        </Row>
                        <div className="openingBalance-table">
                          {/* {JSON.stringify(balanceList)} */}
                          <Table
                            // striped
                            // bordered
                            hover
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
                                <th
                                  style={{
                                    textAlign: "center",
                                    width: "7%",
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>

                            <tbody
                              onKeyDown={(e) => {
                                e.preventDefault();
                                if (e.shiftKey && e.keyCode == 9) {
                                  document.getElementById("cancel").focus();
                                } else if (e.keyCode != 9) {
                                  this.handleTableRow(e);
                                }
                              }}
                              className="tabletrcursor prouctTableTr"
                            >
                              {/* {JSON.stringify(balanceList)} */}
                              {balanceList &&
                                balanceList.map((v, i) => {
                                  return (
                                    <tr
                                      value={JSON.stringify(v)}
                                      // id={`CLTr_` + i}
                                      // prId={v.id}
                                      tabIndex={i}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key == "Tab") {
                                        } else if (e.key == "Tab") {
                                          document
                                            .getElementById("openwinSub")
                                            .focus();
                                        } else {
                                          document
                                            .getElementById("openwinSub")
                                            .focus();
                                        }
                                      }}
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
                                      <td>{v.type}</td>
                                      {/* <td>
                                        {moment(v.invoice_date).format(
                                          "DD/MM/YYYY"
                                        ) === "Invalid date"
                                          ? ""
                                          : moment(v.invoice_date).format(
                                            "DD/MM/YYYY"
                                          )}
                                      </td> */}
                                      <td>{v.invoice_date}</td>
                                      <td>{v.invoice_paid_amt}</td>
                                      <td>{v.invoice_bal_amt}</td>
                                      {/* <td>
                                        {moment(v.due_date).format(
                                          "DD/MM/YYYY"
                                        ) === "Invalid date"
                                          ? ""
                                          : moment(v.due_date).format(
                                            "DD/MM/YYYY"
                                          )}
                                      </td> */}
                                      <td>{v.due_date}</td>
                                      <td>{v.due_days}</td>

                                      <td className="text-center">
                                        <img
                                          src={Delete}
                                          className="opendelete"
                                          title="Delete"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            this.removeOpeningBalRow(i);
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
                  id="openwinSub"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ opnBalModalShow: false });
                    setTimeout(() => {
                      this.nameRef.current.focus();
                    }, 500);
                  }}
                  disabled={
                    parseInt(this.state.openingBal) == this.finalBillpaidBal()
                      ? false
                      : true
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
                    this.setState({
                      //  balanceList: [],
                      opnBalModalShow: false,
                    });
                    setTimeout(() => {
                      this.selectRefBalanceType.current.focus();
                    }, 500);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      this.setState({
                        // balanceList: [],
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
      </div>
    );
  }
}
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

export default connect(mapStateToProps, mapActionsToProps)(LedgerEdit);
