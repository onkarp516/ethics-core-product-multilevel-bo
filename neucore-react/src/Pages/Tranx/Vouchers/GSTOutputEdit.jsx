import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
} from "react-bootstrap";
import search from "@/assets/images/search_icon@3x.png";
import { Formik } from "formik";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import Select from "react-select";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import delete_icon2 from "@/assets/images/delete_icon2.png";
import add_icon from "@/assets/images/add_icon.svg";
import TGSTFooter from "../Components/TGSTFooter";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import * as Yup from "yup";

import {
  transaction_ledger_list,
  transaction_ledger_details,
  vouchers_ledger_list,
  getAllHSN,
  get_taxOutlet,
  createTax,
  createHSN,
  getPaymentModes,
  createGstInput,
  getGstInputById,
} from "@/services/api_functions";

import {
  eventBus,
  MyNotifications,
  isActionExist,
  getValue,
  productDropdown,
  AuthenticationCheck,
  MyDatePicker,
  getSelectValue,
  calculatePercentage,
} from "@/helpers";

const typeoption = [
  { label: "Services", value: "Services" },
  { label: "Goods", value: "Goods" },
];
export default class GSTOutputEdit extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      initVal: {
        transaction_dt: moment().format("YYYY-MM-DD"),
        no_manual: 1,
        partyName: "",
        postingAcc: "",
      },
      initValTax: {
        id: "",
        gst_per: "",
        sratio: "50%",
        igst: "",
        cgst: "",
        sgst: "",
      },
      HSNinitVal: {
        id: "",
        hsnNumber: "",
        igst: "",
        cgst: "",
        sgst: "",
        description: "",
        type: "",
      },
      ledgerList: [],
      voucherList: [],
      optHSNList: [],
      optTaxList: [],
      paymentOpt: [],
      rows: [],
      gstEditData: "",
      isEditDataSet: false,
      ledgerData: "",
      voucherData: "",
      ledgerModal: false,
      ledgerPostingModal: false,
      HSNshow: false,
      taxModalShow: false,
      selectedLedger: "",
      col_total: "",
      grandTotal: "",
      taxcal: { igst: [], cgst: [], sgst: [] },
      // supplierCodeLst: [],
      lstGst: [],
      add_button_flag: true,
    };
  }

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            ledgerList: res.list,
          });
        }
      })
      .catch(() => {});
  };

  transaction_ledger_detailsFun = (ledger_id = 0) => {
    let requestData = new FormData();
    requestData.append("ledger_id", ledger_id);
    transaction_ledger_details(requestData)
      .then((response) => {
        console.log("transaction_ledger_detailsFun : ", ledger_id, response);
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            ledgerData: res.result,
          });
        }
      })
      .catch(() => {});
  };

  voucher_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    vouchers_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            voucherList: res.list,
          });
        }
      })
      .catch(() => {});
  };

  ledgerModalFun = (status) => {
    this.setState({ ledgerData: "", ledgerModal: status });
  };

  ledgerPostingModalFun = (status) => {
    this.setState({ ledgerData: "", ledgerPostingModal: status });
  };

  handleHSNModalShow = (status) => {
    this.setState({
      HSNshow: status,
    });
  };

  handleTaxModalShow = (status) => {
    this.setState({
      taxModalShow: status,
    });
  };

  HSNshow = (value) => {
    this.setState({ HSNshow: value }, () => {
      if (value == false)
        this.setState({
          HSNinitVal: {
            id: "",
            hsnNumber: "",
            igst: "",
            cgst: "",
            sgst: "",
            description: "",
            type: getValue(typeoption, "Goods"),
          },
        });
    });
  };

  taxModalShow = (value) => {
    this.setState({ taxModalShow: value }, () => {
      if (value == false)
        this.setState({
          initValTax: {
            id: "",
            gst_per: "",
            sratio: "50%",
            igst: "",
            cgst: "",
            sgst: "",
          },
        });
    });
  };

  lstHSN = (id = "") => {
    getAllHSN()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.hsnno,
              hsndesc: data.hsndesc,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });

          if (options.length == 0)
            options.unshift({
              value: "0",
              label: "Add New",
              hsndesc: "",
              igst: "",
              cgst: "",
              sgst: "",
            });
          else
            options.unshift({
              value: options.length + 1,
              label: "Add New",
              hsndesc: "",
              igst: "",
              cgst: "",
              sgst: "",
            });
          this.setState({ optHSNList: options }, () => {
            // if (id != "") {
            //   let optSelected = getValue(options, parseInt(id));
            //   this.myRef.current.setFieldValue("hsnNo", optSelected);
            // }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstTAX = (id = "") => {
    get_taxOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.gst_per,
              sratio: data.ratio,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });

          if (options.length == 0)
            options.unshift({
              value: "0",
              label: "Add New",
              sratio: "",
              igst: "",
              cgst: "",
              sgst: "",
            });
          else
            options.unshift({
              value: options.length + 1,
              label: "Add New",
              sratio: "",
              igst: "",
              cgst: "",
              sgst: "",
            });

          this.setState({ optTaxList: options }, () => {
            if (id != "") {
              let optSelected = getSelectValue(
                this.state.optTaxList,
                parseInt(id)
              );
              if (optSelected != "") {
                this.myRef.current.setFieldValue("taxMasterId", optSelected);
              }
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "gst_output_edit",
      to: "gst_output_list",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.initRow();
      this.transaction_ledger_listFun();
      this.voucher_ledger_listFun();
      this.lstTAX();
      this.lstHSN();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.lstModeOfPayment();
      const { prop_data } = this.props.block;
      console.warn("rahul::prop_data", prop_data);
      this.setState({ gstEditData: prop_data }, () => {
        if (prop_data.id) {
          //   this.getGstInputbyids(prop_data.id);
        }

        this.handlePropsData(prop_data);
      });
    }
  }

  componentDidUpdate() {
    const { optTaxList, optHSNList, paymentOpt, isEditDataSet, gstEditData } =
      this.state;
    console.warn("rahul::componentDidUpdate", {
      optTaxList,
      optHSNList,
      paymentOpt,
      isEditDataSet,
      gstEditData,
    });
    if (
      optTaxList.length > 0 &&
      optHSNList.length > 0 &&
      paymentOpt.length > 0 &&
      gstEditData.length > 0 &&
      isEditDataSet == false &&
      gstEditData != ""
    ) {
      console.warn("rahul::setGSTInputEditData");
      this.setGSTInputEditData();
    } else {
    }
  }

  setGSTInputEditData = () => {
    const { id } = this.state.gstEditData;
    let formData = new FormData();
    formData.append("id", id);
    getGstInputById(formData);
    //   .then((response) => {
    //     let res = response.data;
    //     if (res.responseStatus == 200) {
    //       let { invoice_data, row, additional_charges, narration } = res;
    //       console.log("invoice_data--->", invoice_data);
    //       console.log("row--->", row);
    //       // console.log("additional_charges--->", additional_charges);

    //       let {
    //         purchaseAccLst,
    //         supplierNameLst,
    //         supplierCodeLst,
    //         productLst,
    //         lstAdditionalLedger,
    //         lstBrand,
    //       } = this.state;

    //       // console.warn(
    //       //   "rahul::supplierCodeLst",
    //       //   supplierCodeLst,
    //       //   supplierNameLst,
    //       //   lstAdditionalLedger
    //       // );

    //       let additionLedger1 = "";
    //       let additionLedger2 = "";
    //       let additionLedger3 = "";
    //       let totalAdditionalCharges = 0;
    //       let additionLedgerAmt1 = 0;
    //       let additionLedgerAmt2 = 0;
    //       let additionLedgerAmt3 = "";
    //       let discountInPer = res.discountInPer;
    //       let discountInAmt = res.discountInAmt;

    //       let d = moment(invoice_data.transaction_dt, "YYYY-MM-DD").toDate();
    //       let opt = [];
    //       if (res.additionLedger1 > 0) {
    //         additionLedger1 = res.additionLedger1 ? res.additionLedger1 : "";
    //         additionLedgerAmt1 = res.additionLedgerAmt1;
    //         totalAdditionalCharges =
    //           parseFloat(totalAdditionalCharges) +
    //           parseFloat(res.additionLedgerAmt1);
    //       }
    //       if (res.additionLedger2 > 0) {
    //         additionLedger2 = res.additionLedger2 ? res.additionLedger2 : "";
    //         additionLedgerAmt2 = res.additionLedgerAmt2;
    //         totalAdditionalCharges =
    //           parseFloat(totalAdditionalCharges) +
    //           parseFloat(res.additionLedgerAmt2);
    //       }
    //       if (res.additionLedger3 > 0) {
    //         additionLedger3 = res.additionLedger3 ? res.additionLedger3 : "";
    //         additionLedgerAmt3 = res.additionLedgerAmt3;
    //       }

    //       let initInvoiceData = {
    //         id: invoice_data.id,
    //         pi_sr_no: invoice_data.purchase_sr_no,

    //         pi_transaction_dt:
    //           invoice_data.transaction_dt != ""
    //             ? moment(new Date(d)).format("DD/MM/YYYY")
    //             : "",
    //         gstNo: invoice_data.gstNo,
    //         purchaseId: getSelectValue(
    //           purchaseAccLst,
    //           invoice_data.purchase_account_ledger_id
    //         ),
    //         pi_no: invoice_data.invoice_no,
    //         pi_invoice_dt:
    //           invoice_data.invoice_dt != ""
    //             ? moment(
    //               new Date(
    //                 moment(invoice_data.invoice_dt, "YYYY-MM-DD").toDate()
    //               )
    //             ).format("DD/MM/YYYY")
    //             : "",
    //         supplierCodeId: invoice_data.supplierId
    //           ? getSelectValue(supplierCodeLst, invoice_data.supplierId)
    //           : "",
    //         supplierNameId: invoice_data.supplierId
    //           ? getSelectValue(supplierNameLst, invoice_data.supplierId)[
    //           "label"
    //           ]
    //           : "",

    //         transport_name:
    //           invoice_data.transport_name != null
    //             ? invoice_data.transport_name
    //             : "",
    //         reference:
    //           invoice_data.reference != null ? invoice_data.reference : "",
    //         purchase_discount: discountInPer,
    //         purchase_discount_amt: discountInAmt,
    //         additionalChgLedger1: additionLedger1,
    //         additionalChgLedger2: additionLedger2,
    //         additionalChgLedger3: additionLedger3,
    //         additionalChgLedgerAmt1: additionLedgerAmt1,
    //         additionalChgLedgerAmt2: additionLedgerAmt2,
    //         additionalChgLedgerAmt3: additionLedgerAmt3,
    //         additionalChgLedgerName1: res.additionLedgerAmt1
    //           ? getSelectValue(lstAdditionalLedger, res.additionLedger1)[
    //           "label"
    //           ]
    //           : "",
    //         additionalChgLedgerName2: res.additionLedgerAmt2
    //           ? getSelectValue(lstAdditionalLedger, res.additionLedger2)[
    //           "label"
    //           ]
    //           : "",
    //         additionalChgLedgerName3: res.additionLedgerAmt3
    //           ? getSelectValue(lstAdditionalLedger, res.additionLedger3)[
    //           "label"
    //           ]
    //           : "",
    //       };
    //       console.log("initInvoiceData >>>>>>>>><<<<", initInvoiceData);

    //       if (
    //         initInvoiceData.supplierCodeId &&
    //         initInvoiceData.supplierCodeId != ""
    //       ) {
    //         opt = initInvoiceData.supplierCodeId.gstDetails.map((v, i) => {
    //           return {
    //             label: v.gstNo,
    //             value: v.id,
    //           };
    //         });
    //       }

    //       console.log("Rowsssss------->", row);
    //       let initRowData = [];
    //       if (row.length > 0) {
    //         initRowData = row.map((v, i) => {
    //           let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
    //           console.log("productOpt ", productOpt);
    //           let unit_id = {
    //             gst: v.gst != "" ? v.gst : 0,
    //             igst: v.igst != "" ? v.igst : 0,
    //             cgst: v.cgst != "" ? v.cgst : 0,
    //             sgst: v.sgst != "" ? v.sgst : 0,
    //           };

    //           // v["levelAOpt"] = v.levelAOpt.map(function (values) {
    //           //   return { value: values.levela_id, label: values.levela_name };
    //           // });

    //           v["prod_id"] = productOpt ? productOpt : "";
    //           v["productName"] = v.product_name ? v.product_name : "";
    //           v["productId"] = v.product_id ? v.product_id : "";
    //           v["details_id"] = v.details_id != "" ? v.details_id : 0;
    //           v["inventoryId"] = v.inventoryId != "" ? v.inventoryId : 0;

    //           if (v.level_a_id == "") {
    //             v.levelaId = getSelectValue(productOpt.brandOpt, "");
    //           } else if (v.level_a_id) {
    //             v.levelaId = getSelectValue(
    //               productOpt.levelAOpt,
    //               v.level_a_id !== "" ? parseInt(v.level_a_id) : ""
    //             );
    //           }

    //           if (v.level_b_id == "") {
    //             v.levelbId = getSelectValue(v.levelaId.levelBOpt, "");
    //           } else if (v.level_b_id) {
    //             v.levelbId = getSelectValue(
    //               v.levelaId.levelBOpt,
    //               v.level_b_id !== "" ? parseInt(v.level_b_id) : ""
    //             );
    //           }

    //           if (v.level_c_id == "") {
    //             v.levelcId = getSelectValue(v.levelbId.levelCOpt, "");
    //           } else if (v.level_c_id) {
    //             v.levelcId = getSelectValue(
    //               v.levelbId.levelCOpt,
    //               v.level_c_id !== "" ? parseInt(v.level_c_id) : ""
    //             );
    //           }
    //           console.log("v.levelcId.unitOpt   >>>", v.levelcId.unitOpt);
    //           v["unitId"] = v.unitId
    //             ? getSelectValue(v.levelcId.unitOpt, parseInt(v.unitId))
    //             : "";
    //           v["unit_id"] = unit_id;
    //           v["qty"] = v.qty != "" ? v.qty : "";
    //           v["rate"] = v.rate != "" ? v.rate : 0;
    //           v["base_amt"] = v.base_amt != "" ? v.base_amt : 0;
    //           v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : 0;
    //           v["dis_amt"] = v.dis_amt;
    //           v["dis_per"] = v.dis_per;
    //           v["dis_per_cal"] = v.dis_per_cal != "" ? v.dis_per_cal : 0;
    //           v["dis_amt_cal"] = v.dis_amt_cal != "" ? v.dis_amt_cal : 0;
    //           v["total_amt"] = v.total_amt != "" ? v.total_amt : 0;
    //           v["total_base_amt"] =
    //             v.total_base_amt != "" ? v.total_base_amt : 0;
    //           v["gst"] = v.gst != "" ? v.gst : 0;
    //           v["igst"] = v.igst != "" ? v.igst : 0;
    //           v["cgst"] = v.cgst != "" ? v.cgst : 0;
    //           v["sgst"] = v.sgst != "" ? v.sgst : 0;
    //           v["total_igst"] = v.total_igst != "" ? v.total_igst : 0;
    //           v["total_cgst"] = v.total_cgst != "" ? v.total_cgst : 0;
    //           v["total_sgst"] = v.total_sgst > 0 ? v.total_sgst : 0;
    //           v["final_amt"] = v.final_amt != "" ? v.final_amt : 0;
    //           v["free_qty"] =
    //             v.free_qty != "" && v.free_qty != null ? v.free_qty : 0;
    //           v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
    //           v["row_dis_amt"] = v.row_dis_amt != "" ? v.row_dis_amt : 0;
    //           v["gross_amt"] = v.gross_amt != "" ? v.gross_amt : 0;
    //           v["add_chg_amt"] = v.add_chg_amt != "" ? v.add_chg_amt : 0;
    //           v["gross_amt1"] = v.gross_amt1 != "" ? v.gross_amt1 : 0;
    //           v["invoice_dis_amt"] =
    //             v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0;
    //           v["net_amt"] = v.final_amt != "" ? v.final_amt : 0;
    //           v["taxable_amt"] = v.total_amt != "" ? v.total_amt : 0;

    //           v["final_discount_amt"] =
    //             v.final_discount_amt != "" ? v.final_discount_amt : 0;
    //           v["discount_proportional_cal"] =
    //             v.discount_proportional_cal != ""
    //               ? v.discount_proportional_cal
    //               : 0;
    //           v["additional_charges_proportional_cal"] =
    //             v.additional_charges_proportional_cal != ""
    //               ? v.additional_charges_proportional_cal
    //               : 0;
    //           v["b_no"] = v.batch_no != "" ? v.batch_no : "";
    //           v["b_rate"] = v.b_rate != "" ? v.b_rate : 0;
    //           v["rate_a"] = v.min_rate_a != "" ? v.min_rate_a : 0;
    //           v["rate_b"] = v.min_rate_b != "" ? v.min_rate_b : 0;
    //           v["rate_c"] = v.min_rate_c != "" ? v.min_rate_c : 0;
    //           v["max_discount"] = v.max_discount != "" ? v.max_discount : 0;
    //           v["min_discount"] = v.min_discount != "" ? v.min_discount : 0;
    //           v["min_margin"] = v.min_margin != "" ? v.min_margin : 0;
    //           v["manufacturing_date"] =
    //             v.manufacturing_date != "" ? v.manufacturing_date : "";
    //           v["b_purchase_rate"] =
    //             v.purchase_rate != "" ? v.purchase_rate : 0;
    //           v["b_expiry"] = v.b_expiry != "" ? v.b_expiry : "";
    //           v["b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : "";
    //           v["is_batch"] = v.is_batch != "" ? v.is_batch : "";

    //           return v;
    //         });
    //       }
    //       console.warn("rahul::opt ", opt);

    //       if (initInvoiceData.gstNo != "")
    //         initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
    //       else initInvoiceData["gstId"] = opt[0];

    //       initInvoiceData["tcs"] = res.tcs;
    //       initInvoiceData["narration"] = res.narration;

    //       console.log("initRowData", initRowData, initInvoiceData);
    //       this.setState(
    //         {
    //           invoice_data: initInvoiceData,
    //           rows: initRowData,
    //           isEditDataSet: true,
    //           additionalChargesTotal: totalAdditionalCharges,
    //           lstGst: opt,
    //         },
    //         () => {
    //           setTimeout(() => {
    //             this.handleTranxCalculation();
    //           }, 25);
    //         }
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("error _______________________ ", error);
    //   });
  };

  lstModeOfPayment = () => {
    getPaymentModes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          console.log("payment modes:", data);
          let Opt = data.map(function (values) {
            return { value: values.id, label: values.payment_mode };
          });
          this.setState({ paymentOpt: Opt });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        productId: "",
        name: "",
        hsn: "",
        tax: "",
        amount: "",
        qty: "",
        gross_amt: 0,
        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
      };
      lst.push(data);
    }

    if (len != null) {
      let Initrows = [...this.state.rows, ...lst];
      this.setState({ rows: Initrows });
    } else {
      this.setState({ rows: lst });
    }
  };
  handleMstState = (rows) => {
    this.setState({ rows: rows });
  };

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      productId: "",
      name: "",
      hsn: "",
      tax: "",
      amount: "",
      qty: "",
      gross_amt: 0,
      gst: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      total_igst: 0,
      total_cgst: 0,
      total_sgst: 0,
      final_amt: 0,
    };
    console.warn({ new_row });
    rows = [...rows, new_row];
    this.handleMstState(rows);
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    console.log("elementCheck", element, index, elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleRemoveRow = (rowIndex = -1) => {
    let { rows, rowDelDetailsIds, taxcal } = this.state;
    // debugger;
    console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = rows.filter((v, i) => i === rowIndex);
    console.warn("rahul::deletedRow ", deletedRow, rowDelDetailsIds);

    // if (deletedRow) {
    //   deletedRow.map((uv, ui) => {
    //     if (!rowDelDetailsIds.includes(uv.details_id)) {
    //       rowDelDetailsIds.push(uv.details_id);
    //     }
    //   });
    // }

    rows = rows.filter((v, i) => i != rowIndex);
    // let igst = taxcal.igst.filter((v, i) => i != rowIndex);
    // let cgst = taxcal.cgst.filter((v, i) => i != rowIndex);
    // let sgst = taxcal.sgst.filter((v, i) => i != rowIndex);
    // let taxState = { cgst: cgst, sgst: sgst, igst: igst };

    console.warn("rahul::rows ", rows);
    // this.setState({ rows: rows, taxcal: taxState });
    this.setState({ rows: rows }, () => {
      this.handleUnitChange();
    });

    // rows.map((v, i) => {
    //   this.handleUnitChange("tax",v,i);
    // });
    // this.handleTranxCalculation();
    // this.handleGstCalculations();
  };

  handleUnitChange = (ele, value, rowIndex) => {
    let { rows } = this.state;
    // let amtWithTax = 0;
    console.log("(ele, value, rowIndex) ", ele, rowIndex, value, rows);
    if (ele != undefined && value != undefined && rowIndex != undefined) {
      rows[rowIndex][ele] = value;
      if (ele == "tax") {
        rows[rowIndex]["gst"] = value.igst;
        rows[rowIndex]["igst"] = value.igst;
        rows[rowIndex]["sgst"] = value.sgst;
        rows[rowIndex]["cgst"] = value.cgst;
      }
      this.setState({ rows: rows });
    }
    this.handleTranxCalculation();
  };

  handleTranxCalculation = () => {
    // !Most IMP̥
    let { rows } = this.state;
    // ! Row level Discount Calculation
    rows.map((uv, i) => {
      let base_amt = parseInt(uv.qty) * parseFloat(uv.amount);
      uv.base_amt = isNaN(base_amt) ? 0 : parseFloat(base_amt);
      let tax = isNaN(base_amt)
        ? 0
        : (parseFloat(base_amt) * parseInt(uv.tax.label)) / 100;
      console.log("tax:>>>", tax, base_amt);
      uv["total_amt"] = parseFloat(base_amt);
      uv["grand_total"] = parseFloat(base_amt) + tax;
      uv["total_igst"] = parseFloat(
        calculatePercentage(base_amt, uv["igst"])
      ).toFixed(2);
      uv["total_cgst"] = parseFloat(
        calculatePercentage(base_amt, uv["cgst"])
      ).toFixed(2);
      uv["total_sgst"] = parseFloat(
        calculatePercentage(base_amt, uv["sgst"])
      ).toFixed(2);
      return uv;
    });
    let gstResult = this.handleGstCalculations();

    let { taxIgst, taxCgst, taxSgst } = gstResult;

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };

    this.setState({
      taxcal: taxState,
    });
    let amtWithTax = 0;
    let colTotal = 0;
    rows.map((uv) => {
      colTotal += uv.total_amt;
      amtWithTax += uv.grand_total;
    });
    this.setState({ col_total: colTotal, grandTotal: amtWithTax });
    this.myRef.current.setFieldValue(
      "col_total",
      parseFloat(amtWithTax).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "col_total",
      parseFloat(amtWithTax).toFixed(2)
    );
  };

  handleGstCalculations = () => {
    let { rows } = this.state;
    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    rows.map((uv, i) => {
      console.log("rows : ", uv);
      // !IGST Calculation
      if (uv.igst > 0) {
        if (taxIgst.length > 0) {
          let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
          if (innerIgstTax != undefined) {
            let innerIgstCal = taxIgst.filter((vi) => {
              console.log("Calculation:", vi);
              if (vi.gst == uv.igst) {
                vi["amt"] =
                  parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]);
              }
              return vi;
            });
            taxIgst = [...innerIgstCal];
          } else {
            let innerIgstCal = {
              d_gst: uv.igst,

              gst: uv.igst,
              amt: parseFloat(uv.total_igst),
            };
            taxIgst = [...taxIgst, innerIgstCal];
          }
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,
            gst: uv.igst,
            amt: parseFloat(uv.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      }

      // !CGST Calculation
      if (uv.cgst > 0) {
        if (taxCgst.length > 0) {
          let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
          if (innerCgstTax != undefined) {
            let innerCgstCal = taxCgst.filter((vi) => {
              if (vi.gst == uv.cgst) {
                vi["amt"] =
                  parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]);
              }
              return vi;
            });
            taxCgst = [...innerCgstCal];
          } else {
            let innerCgstCal = {
              d_gst: uv.igst,

              gst: uv.cgst,
              amt: parseFloat(uv.total_cgst),
            };
            taxCgst = [...taxCgst, innerCgstCal];
          }
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: parseFloat(uv.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      }

      // !SGST Calculation
      if (uv.sgst > 0) {
        if (taxSgst.length > 0) {
          let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
          if (innerCgstTax != undefined) {
            let innerCgstCal = taxSgst.filter((vi) => {
              if (vi.gst == uv.sgst) {
                vi["amt"] =
                  parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]);
              }
              return vi;
            });
            taxSgst = [...innerCgstCal];
          } else {
            let innerCgstCal = {
              d_gst: uv.igst,

              gst: uv.sgst,
              amt: parseFloat(uv.total_sgst),
            };
            taxSgst = [...taxSgst, innerCgstCal];
          }
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: parseFloat(uv.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      }
    });
    return {
      taxIgst,
      taxCgst,
      taxSgst,
    };
  };
  checkLastRow = (ri, n, product, amount, qty) => {
    if (ri === n && product != null && amount !== "" && qty !== "") return true;
    return false;
  };

  render() {
    let {
      initVal,
      rows,
      ledgerModal,
      ledgerPostingModal,
      additionalCharges,
      ledgerList,
      voucherList,
      ledgerData,
      selectedLedger,
      taxcal,
      col_total,
      grandTotal,
      HSNshow,
      taxModalShow,
      optTaxList,
      optHSNList,
      initValTax,
      HSNinitVal,
      paymentOpt,
      add_button_flag,
    } = this.state;
    return (
      <div className="gst_form_style">
        {/* <h6>Purchase Invoice</h6> */}

        <div className="cust_table">
          <Formik
            validateOnChange={false}
            // validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              partyName: Yup.string().trim().required("Party Name is required"),
              postingAcc: Yup.string()
                .trim()
                .required("Posting A/C is required"),
              // transaction_dt: Yup.string().trim().required("Date is required"),
              // no_manual: Yup.object().required("Select HSN"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log("inside onSubmit >>>", values, rows);
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to save",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    let requestData = new FormData();
                    requestData.append(
                      "transaction_dt",
                      moment(values.transaction_dt, "DD/MM/YYYY").format(
                        "YYYY-MM-DD"
                      )
                    );
                    requestData.append("col_total", values.col_total);
                    requestData.append("narration", values.narration);
                    requestData.append("no_manual", values.no_manual);
                    requestData.append("partyName", values.partyName);
                    requestData.append(
                      "payment_mode",
                      values.payment_mode.label
                    );
                    requestData.append("postingAcc", values.postingAcc);
                    requestData.append("rows", JSON.stringify(rows));

                    console.log("before API Call==-->>>", values.col_total);

                    createGstInput(requestData)
                      .then((response) => {
                        console.log("in create");
                        let res = response.data;
                        if (res.responseStatus === 200) {
                          MyNotifications.fire({
                            show: true,
                            icon: "success",
                            title: "Success",
                            msg: res.message,
                            is_timeout: true,
                            delay: 1000,
                          });
                          // eventBus.dispatch("page_change", "tranx_sales_invoice_list");
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
                noValidate
                // className="common-form-style form-style"
                style={{ overflowY: "hidden", overflowX: "hidden" }}
              >
                <div className="institute-head p-2 header-style">
                  <Row>
                    <Col className="my-auto" md={1} lg={1} sm={1}>
                      <Form.Label>
                        Date :
                        {/* <span className="pt-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md={1} lg={2} sm={1}>
                      <Form.Control
                        type="date"
                        name="transaction_dt"
                        id="transaction_dt"
                        onChange={handleChange}
                        value={values.transaction_dt}
                        isValid={
                          touched.transaction_dt && !errors.transaction_dt
                        }
                        isInvalid={!!errors.transaction_dt}
                        // readOnly={true}
                        className="date-style mt-1"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.transaction_dt}
                      </Form.Control.Feedback>
                    </Col>
                    <Col className="my-auto" md={1} lg={1} sm={1}>
                      <Form.Label className="pt-0">
                        No. Manual:
                        {/* <span className="pt-1 pl-1 req_validation">
                          *
                        </span>:{" "} */}
                      </Form.Label>
                    </Col>
                    <Col md={2} lg={2} sm={2}>
                      <Form.Control
                        type="text"
                        className="mt-1"
                        placeholder=" "
                        name="no_manual"
                        id="no_manual"
                        onChange={handleChange}
                        value={values.no_manual}
                        isValid={touched.no_manual && !errors.no_manual}
                        isInvalid={!!errors.no_manual}
                      />
                    </Col>
                    <Col className="my-auto" md={1} lg={1} sm={1}>
                      <Form.Label className="pt-0">
                        Party Name:
                        {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md={1} lg={2} sm={1}>
                      <Form.Control
                        style={{
                          textAlign: "left",
                          paddingRight: "10px",
                          background: "#ffffff",
                          // /readonly,
                        }}
                        name="partyName"
                        id="partyName"
                        onClick={(e) => {
                          e.preventDefault();
                          this.ledgerModalFun(true);
                        }}
                        placeholder="Party Name"
                        className="mb-0 mt-1"
                        value={values.partyName}
                      />
                      <span className="text-danger errormsg">
                        {errors.partyName}
                      </span>
                    </Col>
                    <Col className="my-auto" md={1} lg={1} sm={1}>
                      <Form.Label className="pt-0">
                        Posting A/c:
                        {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md={1} lg={2} sm={1}>
                      <Form.Control
                        style={{
                          textAlign: "left",
                          paddingRight: "10px",
                          background: "#ffffff",
                          // /readonly,
                        }}
                        name="postingAcc"
                        id="postingAcc"
                        onClick={(e) => {
                          e.preventDefault();
                          this.ledgerPostingModalFun(true);
                        }}
                        placeholder="Posting Account"
                        className="mb-0 mt-1"
                        value={values.postingAcc}
                      />
                      <span className="text-danger errormsg">
                        {errors.postingAcc}
                      </span>
                    </Col>
                  </Row>
                </div>
                {/* right side menu start */}
                {/* right side menu end */}
                <div
                  className="tbl-body-style-new table-th-width-style"
                  // style={{ maxHeight: "60vh", height: "60vh" }}
                >
                  <Table size="sm" className="tbl-font mt-2">
                    <thead>
                      <tr>
                        <th className="th1" style={{ textAlign: "center" }}>
                          Sr. No.
                        </th>
                        <th className="th2" style={{ textAlign: "center" }}>
                          Particulars
                        </th>
                        <th
                          className="th3"
                          style={{ textAlign: "center" }}
                          //   className="pl-4"
                        >
                          HSN
                        </th>
                        <th
                          className="th4"
                          style={{ textAlign: "center" }}
                          //   className="pl-4"
                        >
                          Quantity
                        </th>
                        <th
                          className="th5"
                          style={{ textAlign: "center" }}
                          //   className="pl-4"
                        >
                          Amount
                        </th>
                        <th className="th6" style={{ textAlign: "center" }}>
                          Tax
                        </th>
                        <th
                          className="th7"
                          style={{ textAlign: "center" }}
                          //   className="pl-4"
                        ></th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: "2px solid transparent" }}>
                      {/* {JSON.stringify(rows)} */}
                      {rows &&
                        rows.length > 0 &&
                        rows.map((vi, ii) => {
                          return (
                            <tr className="entryrow">
                              <td className="td1">
                                {parseInt(ii) + 1}
                                {/* {JSON.stringify(vi)} */}
                              </td>
                              <td
                                className="td2"
                                style={{
                                  background: "#f5f5f5",
                                }}
                              >
                                <Form.Control
                                  id={`name-${ii}`}
                                  name={`name-${ii}`}
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleUnitChange("name", v, ii);
                                  }}
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("name", ii)}
                                  // value={rows[ii]["name"]}
                                />
                              </td>
                              <td className="td3" style={{}}>
                                <Select
                                  className="selectTo"
                                  isClearable
                                  styles={productDropdown}
                                  placeholder="HSN"
                                  id={`hsn-${ii}`}
                                  name={`hsn-${ii}`}
                                  onChange={(v) => {
                                    // setFieldValue("hsn", "");
                                    if (v != "") {
                                      if (v.label === "Add New") {
                                        this.HSNshow(true);
                                      } else {
                                        // setFieldValue("hsn", v);
                                        // let v = e.target.value;
                                        console.log("fron hsn", values);
                                        this.handleUnitChange("hsn", v, ii);
                                      }
                                    }
                                  }}
                                  options={optHSNList}
                                  value={rows[ii]["hsn"]}
                                />
                                <span className="text-danger errormsg">
                                  {errors.hsn}
                                </span>
                                {/* <Form.Control
                                id={`hsn-${ii}`}
                                name={`hsn-${ii}`}
                                type="text"
                                onChange={(e) => {
                                  let v = e.target.value;
                                  this.handleUnitChange("hsn", v, ii);
                                }}
                                style={{ textAlign: "center" }}
                                // value={rows[ii]["hsn"]}
                                value={this.setElementValue("hsn", ii)}
                                // readOnly={
                                //   this.setElementValue("type", ii) == "dr"
                                //     ? false
                                //     : true
                                // }
                              /> */}
                              </td>
                              <td className="td4" style={{}}>
                                <Form.Control
                                  id={`qty-${ii}`}
                                  name={`qty-${ii}`}
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleUnitChange("qty", v, ii);
                                  }}
                                  style={{ textAlign: "center" }}
                                  // value={rows[ii]["qty"]}
                                  value={this.setElementValue("qty", ii)}
                                  // readOnly={
                                  //   this.setElementValue("type", ii) == "cr"
                                  //     ? false
                                  //     : true
                                  // }
                                />
                              </td>
                              <td className="td5" style={{}}>
                                <Form.Control
                                  id={`amount-${ii}`}
                                  name={`amount-${ii}`}
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleUnitChange("amount", v, ii);
                                  }}
                                  style={{ textAlign: "center" }}
                                  // value={rows[ii]["amount"]}
                                  value={this.setElementValue("amount", ii)}
                                  // readOnly={
                                  //   this.setElementValue("type", ii) == "dr"
                                  //     ? false
                                  //     : true
                                  // }
                                />
                              </td>
                              <td className="td6" style={{}}>
                                <Select
                                  className="selectTo"
                                  isClearable
                                  styles={productDropdown}
                                  placeholder="Tax"
                                  id={`tax-${ii}`}
                                  name={`tax-${ii}`}
                                  onChange={(v) => {
                                    setFieldValue("tax", "");
                                    if (v != "") {
                                      // console.log({ v });
                                      if (v.label === "Add New") {
                                        this.taxModalShow(true);
                                      } else {
                                        // setFieldValue("tax", v);
                                        // let v = e.target.value;
                                        this.handleUnitChange("tax", v, ii);
                                      }
                                    }
                                  }}
                                  options={optTaxList}
                                  value={rows[ii]["tax"]}
                                />
                                <span className="text-danger errormsg">
                                  {errors.tax}
                                </span>
                                {/* <Form.Control
                                id={`tax-${ii}`}
                                name={`tax-${ii}`}
                                type="text"
                                onChange={(e) => {
                                  let v = e.target.value;
                                  this.handleUnitChange(
                                    "tax",
                                    v,
                                    ii
                                  );
                                }}
                                style={{ textAlign: "center" }}
                                // value={rows[ii]["tax"]}
                                value={this.setElementValue("tax", ii)}
                                // readOnly={
                                //   this.setElementValue("type", ii) == "cr"
                                //     ? false
                                //     : true
                                // }
                              /> */}
                              </td>
                              <td
                                className="td7"
                                style={{ textAlign: "center" }}
                              >
                                {rows.length > 1 && (
                                  <Button
                                    className="btn_img_style"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.handleRemoveRow(ii);
                                      this.setState({ add_button_flag: true });
                                    }}
                                  >
                                    <img
                                      isDisabled={
                                        rows.length === 0 ? true : false
                                      }
                                      src={delete_icon2}
                                      alt=""
                                      className="btnimg"
                                    />
                                  </Button>
                                )}
                                {this.checkLastRow(
                                  ii,
                                  rows.length - 1,
                                  vi,
                                  rows[ii]["qty"],
                                  rows[ii]["amount"]
                                ) && (
                                  <Button
                                    className="btn_img_style"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.handleAddRow();
                                      this.setState({
                                        add_button_flag: !add_button_flag,
                                      });
                                    }}
                                    isDisabled={
                                      vi && vi.productId && vi.productId != ""
                                        ? true
                                        : false
                                    }
                                  >
                                    <img src={add_icon} alt="" />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <thead>
                      <tr style={{ background: "#dde2ed" }}>
                        <td
                          colSpan={4}
                          className=" total-amt fw-bold fs-6"
                          style={{
                            textAlign: "right",
                          }}
                        >
                          {" "}
                          Total
                        </td>

                        <td colSpan={2} className="total-add-amt">
                          <Form.Control
                            id="col_total"
                            name="col_total"
                            style={{
                              textAlign: "left",
                              // width: "8%",
                              background: "transparent",
                              border: "none",
                            }}
                            type="text"
                            placeholder=""
                            value={col_total}
                            readonly
                          />
                        </td>
                      </tr>
                    </thead>
                  </Table>
                </div>
                <Row className="mb-2 btm-data">
                  <Col lg={7}>
                    <Row className="mt-2">
                      <Col lg={2}>
                        <Form.Label className="text-label fw-bold fs-6">
                          Narration:
                        </Form.Label>
                      </Col>
                      <Col lg={10}>
                        <Form.Control
                          as="textarea"
                          placeholder="Enter Narration"
                          style={{ height: "72px", resize: "none" }}
                          className="text-box"
                          id="narration"
                          onChange={handleChange}
                          // rows={5}
                          // cols={25}
                          name="narration"
                          value={values.narration}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={3}>
                    <Row className="mt-2">
                      <Col lg={9}>
                        <TGSTFooter
                          values={values}
                          taxcal={taxcal}
                          // authenticationService={authenticationService}
                        />
                        {/* <Table className="gst-tbl-width">
                          <tbody>
                            <tr>
                              <td className="py-0 fw-bold gst-labels text-center">
                                IGST
                              </td>
                              <td className="p-0 text-end gst-labels">
                                {parseFloat("9999.99").toFixed(2)}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-0 fw-bold gst-labels text-center">
                                CGST
                              </td>
                              <td className="p-0 text-end gst-labels">
                                {parseFloat("9999.99").toFixed(2)}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-0 fw-bold gst-labels text-center">
                                SGST
                              </td>
                              <td className="p-0 text-end gst-labels">
                                {parseFloat("9999.99").toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </Table> */}
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={2} className="footer-gst-tbl-style">
                    <Row className="px-2">
                      <Table className="btm-amt-tbl" style={{ width: "333px" }}>
                        <tbody>
                          <tr>
                            <td className="py-0">Total Amount</td>
                            <td className="p-0 text-end">
                              {grandTotal == "" || isNaN(grandTotal)
                                ? "0.00"
                                : parseFloat(grandTotal).toFixed(2)}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">MOP</td>
                            <td className="p-0 ">
                              <Select
                                placeholder="Pay Mode"
                                isClearable
                                className="selectTo mb-2"
                                styles={productDropdown}
                                options={paymentOpt}
                                name="payment_mode"
                                id="payment_mode"
                                onChange={(v) => {
                                  setFieldValue("payment_mode", "");
                                  if (v != null) {
                                    setFieldValue("payment_mode", v);
                                  }
                                }}
                                value={values.payment_mode}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col className="text-end">
                    <Button className="successbtn-style" type="submit">
                      Submit
                    </Button>

                    <Button
                      className="cancel-btn ms-2"
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
                              eventBus.dispatch("page_change", {
                                from: "gst_output_edit",
                                to: "gst_output_list",
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
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>

                {/* <div className="summery mx-2 p-2 invoice-btm-style">
                  <Row>
                    <Col md="10">
                      <div className="summerytag narrationdiv">
                        <fieldset>
                          <legend>Narration :</legend>
                          <Form.Group>
                            <Form.Control
                              as="textarea"
                              rows={7}
                              cols={25}
                              name="narration"
                              onChange={handleChange}
                              style={{ width: "100%" }}
                              className="purchace-text"
                              value={values.narration}
                              //placeholder="Narration"
                            />
                          </Form.Group>
                        </fieldset>
                      </div>
                    </Col>
                    <Col md="2" className="text-center">
                      <ButtonGroup className="pt-4">
                        <Button variant="primary submit-btn mt-4" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn mx-2"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", {
                              from: "voucher_payment",
                              to: "voucher_paymentlist",
                              isNewTab: false,
                            });
                          }}
                          className="mt-4"
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="9"></Col>
                  </Row>
                </div> */}
              </Form>
            )}
          </Formik>
          {/* ledgr Name Modal */}
          <Modal show={ledgerModal} size="xl" className="mt-5 modal-width">
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Select Ledger
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.ledgerModalFun(false);
                }}
              />
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <Row>
                <Col lg={6}>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      onChange={(e) => {
                        this.transaction_ledger_listFun(e.target.value);
                      }}
                    />
                    <InputGroup.Text className="input_gruop" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col lg={{ span: 1, offset: 4 }}>
                  <Button
                    className="successbtn-style"
                    onClick={(e) => {
                      e.preventDefault();

                      if (
                        isActionExist(
                          "gst-output",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        let data = {
                          rows: rows,
                          additionalCharges: additionalCharges,
                          invoice_data:
                            this.myRef != null && this.myRef.current
                              ? this.myRef.current.values
                              : "",
                          from_page: "gst_input",
                        };
                        eventBus.dispatch("page_change", {
                          from: "gst_input",
                          to: "ledgercreate",
                          prop_data: data,
                          isNewTab: false,
                        });
                      } else {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Permission is denied!",
                          is_button_show: true,
                        });
                      }
                    }}
                  >
                    + Add
                  </Button>
                </Col>
              </Row>
              <div className="productModalStyle">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Ledger Name</th>
                      <th>City</th>
                      <th>Contact No.</th>
                      <th>Current Balance</th>
                      <th></th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerList.map((v) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log("selectedLedger : ", v);
                            this.setState(
                              { selectedLedger: v, partyName: v.ledger_name },
                              () => {
                                this.transaction_ledger_detailsFun(v.id);
                                if (v != "") {
                                  if (this.myRef.current) {
                                    let opt = [];
                                    if (v != null) {
                                      opt = v.gstDetails.map((v) => {
                                        return {
                                          label: v.gstNo,
                                          value: v.id,
                                        };
                                      });
                                      console.log("opt", opt);
                                    }
                                    this.myRef.current.setFieldValue(
                                      "partyName",
                                      v != "" ? v.ledger_name : ""
                                    );
                                  }
                                  this.setState({
                                    ledgerModal: false,
                                    selectedLedger: "",
                                  });
                                }
                              }
                            );
                          }}
                        >
                          <td>{v.code}</td>
                          <td>{v.ledger_name}</td>
                          <td>{v.city}</td>
                          <td>{v.contact_number}</td>
                          <td>{v.current_balance}</td>
                          <td>{v.balance_type}</td>
                          <td>
                            <img
                              src={TableEdit}
                              alt=""
                              className="table_icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-output",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  let source = {
                                    rows: rows,
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page: "gst_input",
                                  };

                                  let data = {
                                    source: source,
                                    // id: v.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "gst_input",
                                    to: "ledgeredit",
                                    prop_data: data,
                                    isNewTab: false,
                                  });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                            />
                            <img
                              src={TableDelete}
                              alt=""
                              className="table_icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-output",
                                    "delete",
                                    this.props.userPermissions
                                  )
                                ) {
                                  MyNotifications.fire(
                                    {
                                      show: true,
                                      icon: "confirm",
                                      title: "Confirm",
                                      msg: "Do you want to Delete",
                                      is_button_show: false,
                                      is_timeout: false,
                                      delay: 0,
                                      handleSuccessFn: () => {
                                        // this.deleteledgerFun(v.id);
                                      },
                                      handleFailFn: () => {},
                                    },
                                    () => {
                                      console.warn("return_data");
                                    }
                                  );
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div className="ledger_details_style">
                <Row className="mx-1">
                  <Col lg={4} className="colored_table">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          GST No.:
                        </Form.Label>
                      </Col>
                      <Col lg={8} className="sub_col_style">
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.gst_number : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Licence No.:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {ledgerData != "" ? ledgerData.license_number : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          FSSAI:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {ledgerData != "" ? ledgerData.fssai_number : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4} className="colored_table">
                    <Row>
                      <Col lg={5}>
                        <Form.Label className="colored_label mt-2">
                          Contact Person:
                        </Form.Label>
                      </Col>
                      <Col lg={7}>
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.contact_name : ""}
                        </p>
                      </Col>
                      <Col lg={5}>
                        <Form.Label className="colored_label mt-2">
                          Area:
                        </Form.Label>
                      </Col>
                      <Col lg={7}>
                        <p className="colored_sub_text">
                          {ledgerData != "" ? ledgerData.area : ""}
                        </p>
                      </Col>
                      <Col lg={5}>
                        <Form.Label className="colored_label mt-2">
                          Route:
                        </Form.Label>
                      </Col>
                      <Col lg={7}>
                        <p className="colored_sub_text">
                          {ledgerData != "" ? ledgerData.route : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4} className="colored_table">
                    <Row>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Credit Days:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.credit_days : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Transport:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.route : ""}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <Form.Label className="colored_label mt-2">
                          Bank:
                        </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <p className="colored_sub_text">
                          {" "}
                          {ledgerData != "" ? ledgerData.bank_name : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              {/* <Row>
                <Col md="12 mt-2" className="btn_align">
                  <Button
                    className="submit-btn successbtn-style me-2"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log({ selectedLedger });
                      if (selectedLedger != "") {
                        if (this.myRef.current) {
                          let opt = [];
                          if (selectedLedger != null) {
                            opt = selectedLedger.gstDetails.map((v) => {
                              return {
                                label: v.gstNo,
                                value: v.id,
                              };
                            });
                            console.log("opt", opt);
                            // this.setState({
                            //   lstGst: opt,
                            // });
                          }
                          this.myRef.current.setFieldValue(
                            "partyName",
                            selectedLedger != ""
                              ? selectedLedger.ledger_name
                              : ""
                          );
                        }
                        // console.log("invoice_data", { invoice_data });
                        this.setState({
                          ledgerModal: false,
                          //   invoice_data: invoice_data,
                          selectedLedger: "",
                        });
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ selectedLedger: "" }, () => {
                        this.ledgerModalFun(false);
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row> */}
            </Modal.Body>
          </Modal>

          {/* Posting A/c Modal */}
          <Modal
            show={ledgerPostingModal}
            size="xl"
            className="mt-5 modal-width"
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Select Ledger
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.ledgerPostingModalFun(false);
                }}
              />
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <Row>
                <Col lg={6}>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      onChange={(e) => {
                        this.voucher_ledger_listFun(e.target.value);
                      }}
                    />
                    <InputGroup.Text className="input_gruop" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col lg={{ span: 1, offset: 4 }}>
                  <Button
                    className="successbtn-style"
                    onClick={(e) => {
                      e.preventDefault();

                      if (
                        isActionExist(
                          "gst-output",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        let data = {
                          rows: rows,
                          additionalCharges: additionalCharges,
                          invoice_data:
                            this.myRef != null && this.myRef.current
                              ? this.myRef.current.values
                              : "",
                          from_page: "gst_input",
                        };
                        eventBus.dispatch("page_change", {
                          from: "gst_input",
                          to: "ledgercreate",
                          prop_data: data,
                          isNewTab: false,
                        });
                      } else {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: "Permission is denied!",
                          is_button_show: true,
                        });
                      }
                    }}
                  >
                    + Add
                  </Button>
                </Col>
              </Row>
              <div className="productModalStyle">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Ledger Name</th>
                      <th>City</th>
                      <th>Contact No.</th>
                      <th>Current Balance</th>
                      <th></th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voucherList.map((v) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log({ v });
                            this.setState(
                              { selectedLedger: v, postingAcc: v.ledger_name },
                              () => {
                                if (v != "") {
                                  if (this.myRef.current) {
                                    let opt = [];
                                    if (v != null) {
                                      opt = v.gstDetails.map((v) => {
                                        return {
                                          label: v.gstNo,
                                          value: v.id,
                                        };
                                      });
                                      console.log("opt", opt);
                                    }
                                    this.myRef.current.setFieldValue(
                                      "postingAcc",
                                      v != "" ? v.ledger_name : ""
                                    );
                                  }
                                  // console.log("invoice_data", { invoice_data });
                                  this.setState({
                                    ledgerPostingModal: false,
                                    //   invoice_data: invoice_data,
                                    selectedLedger: "",
                                  });
                                }
                              }
                            );
                          }}
                        >
                          <td>{v.code}</td>
                          <td>{v.ledger_name}</td>
                          <td>{v.city}</td>
                          <td>{v.contact_number}</td>
                          <td>{v.current_balance}</td>
                          <td>{v.balance_type}</td>
                          <td>
                            <img
                              src={TableEdit}
                              alt=""
                              className="table_icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-output",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  let source = {
                                    rows: rows,
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page: "gst_input",
                                  };

                                  let data = {
                                    source: source,
                                    id: v.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "gst_input",
                                    to: "ledgeredit",
                                    prop_data: data,
                                    isNewTab: false,
                                  });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                            />
                            <img
                              src={TableDelete}
                              alt=""
                              className="table_icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-output",
                                    "delete",
                                    this.props.userPermissions
                                  )
                                ) {
                                  MyNotifications.fire(
                                    {
                                      show: true,
                                      icon: "confirm",
                                      title: "Confirm",
                                      msg: "Do you want to Delete",
                                      is_button_show: false,
                                      is_timeout: false,
                                      delay: 0,
                                      handleSuccessFn: () => {
                                        // this.deleteledgerFun(v.id);
                                      },
                                      handleFailFn: () => {},
                                    },
                                    () => {
                                      console.warn("return_data");
                                    }
                                  );
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {/* <Row>
                <Col md="12 mt-2" className="btn_align">
                  <Button
                    className="submit-btn successbtn-style me-2"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log({ selectedLedger });
                      if (selectedLedger != "") {
                        if (this.myRef.current) {
                          let opt = [];
                          if (selectedLedger != null) {
                            opt = selectedLedger.gstDetails.map((v, i) => {
                              return {
                                label: v.gstNo,
                                value: v.id,
                              };
                            });
                            console.log("opt", opt);
                            // this.setState({
                            //   lstGst: opt,
                            // });
                          }
                          console.log("lstGst", lstGst);
                          this.myRef.current.setFieldValue(
                            "posting_acc",
                            selectedLedger != ""
                              ? selectedLedger.ledger_name
                              : ""
                          );
                        }
                        // console.log("invoice_data", { invoice_data });
                        this.setState({
                          ledgerPostingModal: false,
                          //   invoice_data: invoice_data,
                          selectedLedger: "",
                        });
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ selectedLedger: "" }, () => {
                        this.ledgerPostingModalFun(false);
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row> */}
            </Modal.Body>
          </Modal>

          {/* Tax modal */}
          <Modal
            show={taxModalShow}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ show: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Tax
              </Modal.Title>
              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.handleTaxModalShow(false)}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <div className="">
                <div className="m-0 mb-2">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    enableReinitialize={true}
                    initialValues={initValTax}
                    validationSchema={Yup.object().shape({
                      gst_per: Yup.string()
                        .trim()
                        .required("HSN number is required"),
                      igst: Yup.string().trim().required("Igst is required"),
                      cgst: Yup.string().trim().required("Cgst is required"),
                      sgst: Yup.string().trim().required("Sgst is required"),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      let requestData = new FormData();
                      if (values.id != "") {
                        requestData.append("id", values.id);
                      }
                      requestData.append("gst_per", values.gst_per);
                      requestData.append("sratio", values.sratio);
                      requestData.append("igst", values.igst);
                      requestData.append("cgst", values.cgst);
                      requestData.append("sgst", values.sgst);
                      requestData.append(
                        "applicable_date",
                        moment(values.applicable_date).format("yyyy-MM-DD")
                      );
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to submit",
                          is_button_show: false,
                          is_timeout: false,
                          handleSuccessFn: () => {
                            createTax(requestData)
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
                                  this.handleTaxModalShow(false);
                                  this.pageReload();
                                  // resetForm();
                                } else if (res.responseStatus == 409) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
                                  });
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
                          },
                          handleFailFn: () => {},
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
                      isSubmitting,
                      resetForm,
                      setFieldValue,
                    }) => (
                      <Form onSubmit={handleSubmit} noValidate>
                        <div className="mb-2">
                          <Row className="mb-3">
                            <Col md={2}>
                              <Form.Label>GST %</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  autoFocus="true"
                                  type="text"
                                  placeholder="GST %"
                                  name="gst_per"
                                  id="gst_per"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    this.handleGstChange(
                                      e.target.value,
                                      "gst_per",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.gst_per}
                                  isValid={touched.gst_per && !errors.gst_per}
                                  isInvalid={!!errors.gst_per}
                                />
                                <span className="text-danger errormsg">
                                  {errors.gst_per}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Label>IGST</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="IGST"
                                  name="igst"
                                  id="igst"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    this.handleGstChange(
                                      e.target.value,
                                      "igst",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.igst}
                                  isValid={touched.igst && !errors.igst}
                                  isInvalid={!!errors.igst}
                                />
                                <span className="text-danger errormsg">
                                  {errors.igst}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Label>CGST</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="CGST"
                                  name="cgst"
                                  id="cgst"
                                  onChange={(e) => {
                                    this.handleGstChange(
                                      e.target.value,
                                      "cgst",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.cgst}
                                  isValid={touched.cgst && !errors.cgst}
                                  isInvalid={!!errors.cgst}
                                />
                                <span className="text-danger errormsg">
                                  {errors.cgst}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mb-2">
                            <Col md={2}>
                              <Form.Label>SGST</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="SGST"
                                  name="sgst"
                                  id="sgst"
                                  onChange={(e) => {
                                    this.handleGstChange(
                                      e.target.value,
                                      "sgst",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.sgst}
                                  isValid={touched.sgst && !errors.sgst}
                                  isInvalid={!!errors.sgst}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sgst}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={2} className="p-0">
                              <Form.Label>
                                Applicable Date
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <MyDatePicker
                                  name="applicable_date"
                                  placeholderText="DD/MM/YYYY"
                                  id="applicable_date"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue("applicable_date", date);
                                  }}
                                  selected={values.applicable_date}
                                  maxDate={new Date()}
                                  className="newdate"
                                />
                                {/* <span className="text-danger errormsg">{errors.bill_dt}</span> */}
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12 mt-1" className="btn_align">
                              <Button
                                className="submit-btn successbtn-style"
                                type="submit"
                              >
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.taxModalShow(false);
                                }}
                              >
                                Cancel
                              </Button>
                            </Col>
                            {/* <Col md="12" className="btn_align">
                            <Button
                              variant="secondary cancel-btn"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                this.taxModalShow(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </Col> */}
                          </Row>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {/* HSN modal */}
          <Modal
            show={HSNshow}
            size="lg"
            className="brandnewmodal mt-5 mainmodal"
            onHide={() => this.handleFlavourModalShow(false)}
            dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
              // closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                HSN
              </Modal.Title>
              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.handleHSNModalShow(false)}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={HSNinitVal}
              validationSchema={Yup.object().shape({
                hsnNumber: Yup.string()
                  .trim()
                  .required("HSN number is required"),
                // description: Yup.string()
                //   .trim()
                //   .required("HSN description is required"),
                type: Yup.object().required("Select type").nullable(),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let keys = Object.keys(values);
                let requestData = new FormData();

                keys.map((v) => {
                  if (v != "type") {
                    requestData.append(v, values[v] ? values[v] : "");
                  } else if (v == "type") {
                    requestData.append("type", values.type.value);
                  }
                });
                MyNotifications.fire(
                  {
                    show: true,
                    icon: "confirm",
                    title: "Confirm",
                    msg: "Do you want to submit",
                    is_button_show: false,
                    is_timeout: false,
                    handleSuccessFn: () => {
                      createHSN(requestData)
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
                            // this.handleModalStatus(false);
                            // ShowNotification("Success", res.message);
                            // this.lstHSN(res.responseObject);
                            resetForm();
                            // this.props.handleRefresh(true);
                            this.handleHSNModalShow(false);
                            this.pageReload();
                          } else if (res.responseStatus == 409) {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
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
                        });
                    },
                    handleFailFn: () => {},
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
                isSubmitting,
                resetForm,
                setFieldValue,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  className="form-style"
                  noValidate
                  autoComplete="off"
                >
                  <Row className="mb-2">
                    <Col md={1}>
                      <Form.Label>HSN</Form.Label>
                    </Col>
                    <Col md="2">
                      <Form.Group>
                        <Form.Control
                          autoFocus="true"
                          type="text"
                          placeholder="HSN No"
                          name="hsnNumber"
                          id="hsnNumber"
                          onChange={handleChange}
                          value={values.hsnNumber}
                          // isValid={touched.hsnNumber && !errors.hsnNumber}
                          // isInvalid={!!errors.hsnNumber}
                        />
                        {/* <span className="text-danger errormsg"> */}
                        <span className="text-danger errormsg">
                          {errors.hsnNumber}
                        </span>
                        {/* </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Label>HSN Description</Form.Label>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="HSN Description"
                          name="description"
                          id="description"
                          onChange={handleChange}
                          value={values.description}
                          // isValid={touched.description && !errors.description}
                          // isInvalid={!!errors.description}
                        />
                        {/* <span className="text-danger errormsg"> */}
                        <span className="text-danger errormsg"></span>
                        {/* </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>
                    <Col md={1}>
                      <Form.Label>Type</Form.Label>
                    </Col>
                    <Col md="3">
                      <Form.Group className="">
                        <Select
                          className="selectTo"
                          id="type"
                          placeholder="Select Type"
                          styles={productDropdown}
                          // styles={createPro}
                          isClearable
                          options={typeoption}
                          name="type"
                          onChange={(value) => {
                            setFieldValue("type", value);
                          }}
                          value={values.type}
                        />
                        <span className="text-danger errormsg">
                          {errors.type}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} className="pt-1 btn_align">
                      <Button
                        className="submit-btn successbtn-style"
                        type="submit"
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.HSNshow(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Modal>
        </div>
      </div>
    );
  }
}
