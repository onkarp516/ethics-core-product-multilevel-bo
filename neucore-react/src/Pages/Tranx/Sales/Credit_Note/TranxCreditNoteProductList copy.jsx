import React from "react";
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
import { Formik } from "formik";

import * as Yup from "yup";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import TGSTFooter from "../../Components/TGSTFooter";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import delete_icon from "@/assets/images/delete_icon2.png";
import add_icon from "@/assets/images/add_icon.svg";

import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";

import moment from "moment";
import Select from "react-select";
import {
  getSalesAccounts,
  getSundryDebtors,
  getProduct,
  getAdditionalLedgers,
  authenticationService,
  createSalesReturn,
  getTranxSalesProductListBillNo,
  getTranxCreditNoteListInvoiceBillSC,
  get_Product_batch,
  getProductFlavourList,
  getTranxCreditNoteLast,
  getSalesInvoiceProductFpuById,
  checkLedgerDrugAndFssaiExpiryByLedgerId,
  checkInvoiceDateIsBetweenFY,
  transaction_ledger_list,
  transaction_product_list,
  transaction_ledger_details,
  transaction_product_details,
  transaction_batch_details,
  delete_ledger,
  delete_Product_list,
  get_sales_return_supplierlist_by_productid,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  MyTextDatePicker,
  getSelectValue,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  purchaseSelect,
  fnTranxCalculation,
  getValue,
  isActionExist,
  isMultiDiscountExist,
  isFreeQtyExist,
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  unitDD,
  flavourDD,
} from "@/helpers";
import { setUserControl } from "@/redux/userControl/Action";

const particularsDD = {
  control: (base, state) => ({
    ...base,
    // marginLeft: -25,
    borderRadius: "none",
    // border: "1px solid transparent",
    marginTop: 0,
    height: 32,
    minHeight: 32,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "12px",
    width: 700,
    // letterSpacing: "-0.02em",
    // textDecorationLine: "underline",
    color: "#000000",
    background: "transparent",

    "&:hover": {
      background: "transparent",
      border: "1px solid #dcdcdc !important",
    },
    "&:focus": {
      width: 680,
    },
    // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
    border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
  }),
  dropdownIndicator: (base) => ({
    // background: "black",
    color: " #ADADAD",
    // marginRight: "5px",
    // height: "4.5px",
    // width: "9px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 999,
    fontSize: "12px",
  }),
};

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: "none",
    padding: "0 6px",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
    // borderBottom: '1px solid #ccc',
    // '&:focus': {
    //   borderBottom: '1px solid #1e3989',
    // },
  }),
};

class TranxCreditNoteProductList extends React.Component {
  constructor(props) {
    super(props);
    this.AdjustBillRef = React.createRef();
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();

    this.state = {
      product_supplier_lst: [],
      show: false,
      opendiv: false,
      hidediv: true,
      isBranch: false,
      invoice_data: "",
      salesAccLst: [],
      salesEditData: "",

      supplierNameLst: [],
      supplierCodeLst: [],
      invoiceedit: false,
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      salesReturnData: "",
      salesReturnObject: "",
      isEditDataSet: false,
      rowDelDetailsIds: [],
      invoiceLstSC: [],
      selectedBills: [],
      salesInvoiceRtnLst: [],
      lstBrand: [],
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      outstanding_sales_return_amt: 0,
      initVal: {
        branchId: "",
        salesAccId: "",
        credit_note_sr: 1,
        transaction_dt: moment().format("YYYY-MM-DD"),
        salesId: "",
        invoice_no: "",
        invoice_dt: "",
        to_date: "",
        supplierCodeId: "",
        clientNameId: "",
        sales_return_invoice: "",
        outstanding: "",

        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
        sales_discount: 0,
        sales_discount_amt: 0,
        total_sales_discount_amt: 0,
        total_purchase_discount_amt: 0,
        total_base_amt: 0,
        total_tax_amt: 0,
        total_taxable_amt: 0,
        total_dis_amt: 0,
        total_dis_per: 0,
        totalcgstper: 0,
        totalsgstper: 0,
        totaligstper: 0,
        purchase_disc_ledger: "",
        total_discount_proportional_amt: 0,
        total_additional_charges_proportional_amt: 0,
      },
      adjusmentbillmodal: false,
      batchData: "",
      is_expired: false,
      b_details_id: 0,
      isBatch: false,
      batchInitVal: "",
      tr_id: "",
      invoice_data: {
        credit_note_sr: 1,
        transaction_dt: "",
        salesId: "",
        invoice_no: "",
        invoice_dt: "",
        to_date: "",
        supplierCodeId: "",
        clientNameId: "",
        // sales_return_invoice: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
        sales_discount: 0,
        sales_discount_amt: 0,
        total_sales_discount_amt: 0,
        total_purchase_discount_amt: 0,
        total_base_amt: 0,
        total_tax_amt: 0,
        total_taxable_amt: 0,
        total_dis_amt: 0,
        total_dis_per: 0,
        totalcgstper: 0,
        totalsgstper: 0,
        totaligstper: 0,
        purchase_disc_ledger: "",
        total_discount_proportional_amt: 0,
        total_additional_charges_proportional_amt: 0,

        total_invoice_dis_amt: 0,
        additionalChgLedger1: "",
        additionalChgLedgerAmt1: "",
        additionalChgLedger2: "",
        additionalChgLedgerAmt2: "",
        additionalChgLedger3: "",
        additionalChgLedgerAmt3: "",

        additionalChgLedgerName1: "",
        additionalChgLedgerName2: "",
        additionalChgLedgerName3: "",

        total_qty: 0,
        total_free_qty: 0,
        bill_amount: 0,
        total_row_gross_amt1: 0,
      },

      productData: "",
      ledgerModal: false,
      ledgerNameModal: false,
      newBatchModal: false,
      selectProductModal: false,
      ledgerList: [],
      orgLedgerList: [],
      levelOpt: [],
      ledgerData: "",
      selectedLedger: "",
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      showLedgerDiv: false,
      addchgElement1: "",
      addchgElement2: "",
      orglstAdditionalLedger: [],
      selectedLedgerNo: 1,
      product_hover_details: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
    };
  }

  handeladjusmentbillmodal = (status) => {
    this.setState({ adjusmentbillmodal: status });
  };

  setLastCreditNoteNo = () => {
    getTranxCreditNoteLast()
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          // const { initVal } = this.state;

          // initVal["credit_note_sr"] = res.count;
          // initVal["sales_return_invoice"] = res.salesReturnNo;
          // this.setState({ initVal: initVal });
          // console.log("initVal------>", initVal);
          if (this.myRef.current) {
            this.myRef.current.setFieldValue("credit_note_sr", res.count);
            this.myRef.current.setFieldValue(
              "sales_return_invoice",
              res.salesReturnNo
            );
            this.myRef.current.setFieldValue(
              "transaction_dt",
              moment(new Date()).format("DD/MM/YYYY")
            );
          }
          console.log(
            "this.myRef.current.values------>",
            this.myRef.current.values
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstAdditionalLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name, ...values };
            });
            let fOpt = Opt.filter(
              (v) => v.name.trim().toLowerCase() != "round off"
            );
            console.log({ fOpt });
            this.setState({
              lstAdditionalLedger: fOpt,
              orglstAdditionalLedger: fOpt,
            });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstDiscountLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name };
            });
            let fOpt = Opt.filter(
              (v) => v.label.trim().toLowerCase() != "round off"
            );
            this.setState({ lstDisLedger: Opt });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstSalesAccounts = () => {
    getSalesAccounts()
      .then((response) => {
        // console.log("res", response);
        let res = response.data;
        if (res.responseStatus === 200) {
          let opt = res.list.map((v, i) => {
            return {
              label: v.name,
              value: v.id,
            };
          });
          this.setState({ salesAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.label.toLowerCase().includes("sales a/c")
            );
            console.log("rahul:: lstSalesAccounts", { v }, v[0]);
            if (v != null && v != undefined)
              this.myRef.current.setFieldValue("salesAccId", v[0]);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  lstSundrydebtors = () => {
    getSundryDebtors()
      .then((response) => {
        // console.log("res", response);

        let res = response.data;
        if (res.responseStatus === 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = parseInt(v.gstDetails[0]["state"]);
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.name,
              value: parseInt(v.id),
              code: v.ledger_code,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = parseInt(v.gstDetails[0]["state"]);
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: parseInt(v.id),
              name: v.name,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.stateCode;
            }
            return {
              label: v.ledger_name,
              value: parseInt(v.id),
              code: v.ledger_code,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: parseInt(v.id),
              name: v.ledger_name,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,

            ledgerList: res.list,
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => {});
  };
  transaction_product_listFun = (search = "", barcode = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    requestData.append("barcode", barcode);
    transaction_product_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            productLst: res.list,
          });
        }
      })
      .catch((error) => {});
  };

  transaction_ledger_detailsFun = (ledger_id = 0) => {
    let requestData = new FormData();
    requestData.append("ledger_id", ledger_id);
    transaction_ledger_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            ledgerData: res.result,
          });
        }
      })
      .catch((error) => {});
  };

  transaction_product_detailsFun = (product_id = 0) => {
    let requestData = new FormData();
    requestData.append("product_id", product_id);
    transaction_product_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            productData: res.result,
          });
        }
      })
      .catch((error) => {});
  };

  transaction_batch_detailsFun = (batchNo = 0) => {
    let requestData = new FormData();
    requestData.append("batchNo", batchNo);
    transaction_batch_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            batchDetails: res.response,
          });
        }
      })
      .catch((error) => {});
  };

  handleRemoveRow = (rowIndex = -1) => {
    let { rows, rowDelDetailsIds } = this.state;

    console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = rows.filter((v, i) => i === rowIndex);
    console.warn("rahul::deletedRow ", deletedRow, rowDelDetailsIds);

    if (deletedRow) {
      deletedRow.map((uv, ui) => {
        if (!rowDelDetailsIds.includes(uv.details_id)) {
          rowDelDetailsIds.push(uv.details_id);
        }
      });
    }

    rows = rows.filter((v, i) => i != rowIndex);
    console.warn("rahul::rows ", rows);
    this.handleClearProduct(rows);
  };

  /**
   * @description Initialize Product Row
   */
  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        details_id: "",
        productId: "",
        levelaId: "",
        levelbId: "",
        levelcId: "",
        unitCount: "",
        unitId: "",
        unit_conv: 0,
        qty: "",
        free_qty: "",
        rate: "",
        base_amt: 0,
        dis_amt: 0,
        dis_per: 0,
        dis_per2: 0,
        dis_per_cal: 0,
        dis_amt_cal: 0,
        row_dis_amt: 0,
        gross_amt: 0,
        add_chg_amt: 0,
        gross_amt1: 0,
        invoice_dis_amt: 0,
        total_amt: 0,
        net_amt: 0,
        taxable_amt: 0,
        total_base_amt: 0,
        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
        final_discount_amt: 0,
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,

        // batch_details
        b_no: 0,
        b_rate: 0,
        rate_a: 0,
        rate_b: 0,
        rate_c: 0,
        max_discount: 0,
        min_discount: 0,
        min_margin: 0,
        manufacturing_date: 0,
        dummy_date: 0,
        b_purchase_rate: 0,
        b_expiry: 0,
        b_details_id: 0,
        is_batch: false,

        dis_per_cal: 0,
        dis_amt_cal: 0,
        total_amt: 0,
        total_b_amt: 0,

        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
        serialNo: [],
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
        reference_id: "",
        reference_type: "",
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
  /**
   * @description Initialize Additional Charges
   */
  initAdditionalCharges = (len = null) => {
    // additionalCharges
    let lst = [];
    let condition = 5;
    if (len != null) {
      condition = len;
    }
    for (let index = 0; index < condition; index++) {
      let data = {
        additional_charges_details_id: 0,
        ledger_id: "",
        amt: "",
      };
      lst.push(data);
    }
    if (len != null) {
      let addLst = [...this.state.additionalCharges, ...lst];
      this.setState({ additionalCharges: addLst });
    } else {
      this.setState({ additionalCharges: lst });
    }
  };

  getProductFlavorpackageUnitbyids = () => {
    let reqData = new FormData();
    console.warn(
      "rahul::this.state.salesReturnData ",
      this.state.salesReturnData
    );

    reqData.append("id", this.state.salesReturnData.returnData.id);
    getSalesInvoiceProductFpuById(reqData)
      .then((res) => res.data)
      .then((response) => {
        console.warn("rahul::response", response);
        if (response.responseStatus == 200) {
          let Opt = response.productIds.map((v) => {
            let levela_opt = v.levelAOpt.map((vb) => {
              let levelb_opt = vb.levelBOpts.map((vg) => {
                let levelc_opt = vg.levelCOpts.map((vc) => {
                  let unit_opt = vc.unitOpts.map((z) => {
                    return {
                      label: z.label,
                      value: z.value != "" ? parseInt(z.value) : "",
                      isDisabled: false,
                      ...z,

                      // batchOpt: z.batchOpt,
                    };
                  });
                  return {
                    label: vc.label,
                    value: vc.value != "" ? parseInt(vc.value) : "",
                    isDisabled: false,

                    unitOpt: unit_opt,
                  };
                });
                return {
                  label: vg.label,
                  value: vg.value != "" ? parseInt(vg.value) : "",
                  isDisabled: false,

                  levelCOpt: levelc_opt,
                };
              });
              return {
                label: vb.label,
                value: vb.value != "" ? parseInt(vb.value) : "",
                isDisabled: false,

                levelBOpt: levelb_opt,
              };
            });
            return {
              product_id: v.product_id,
              value: v.value != "" ? parseInt(v.value) : "",
              isDisabled: false,

              // set levels category data
              isLevelA: true,
              isLevelB: true,
              isLevelC: true,

              levelAOpt: levela_opt,
            };
          });

          console.warn("rahul::Opt ==->>> ", Opt);
          this.setState({ lstBrand: Opt });
          this.setPurchaseInvoiceEditData();
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstPackages: [] });
      });
  };

  setPurchaseInvoiceEditData = () => {
    console.log("salesReturnData", this.state.salesReturnData);
    const data = this.state.salesReturnData;

    let formData = new FormData();
    formData.append("sales_invoice_id", data.returnData.id);
    formData.append("source", data.returnData.source);

    getTranxSalesProductListBillNo(formData)
      .then((response) => {
        let res = response.data;
        console.log("Edit response", res);
        if (res.responseStatus == 200) {
          let { invoice_data, row, lstAdditionalLedger } = res;

          const { salesAccLst, supplierNameLst, lstBrand, supplierCodeLst } =
            this.state;
          let additionLedger1 = "";
          let additionLedger2 = "";
          let additionLedger3 = "";
          let totalAdditionalCharges = 0;
          let additionLedgerAmt1 = 0;
          let additionLedgerAmt2 = 0;
          let additionLedgerAmt3 = "";
          let discountInPer = res.discountInPer;
          let discountInAmt = res.discountInAmt;

          console.log({ invoice_data, supplierNameLst });
          let opt = [];

          if (res.additionLedger1 > 0) {
            additionLedger1 = res.additionLedger1 ? res.additionLedger1 : "";
            additionLedgerAmt1 = res.additionLedgerAmt1;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt1);
          }
          if (res.additionLedger2 > 0) {
            additionLedger2 = res.additionLedger2;
            additionLedgerAmt2 = res.additionLedgerAmt2;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt2);
          }
          if (res.additionLedger3 > 0) {
            additionLedger3 = res.additionLedger3;
            additionLedgerAmt3 = res.additionLedgerAmt3;
          }

          let initInvoiceData = {
            id: invoice_data.id,
            sales_return_invoice:
              this.myRef.current.values.sales_return_invoice,
            credit_note_sr: this.myRef.current.values.credit_note_sr,
            invoice_dt:
              invoice_data.invoice_dt != ""
                ? moment(new Date(invoice_data.invoice_dt)).format("DD/MM/YYYY")
                : "",
            invoice_no: invoice_data.invoice_no,
            clientCodeId: invoice_data.supplierId
              ? getSelectValue(supplierCodeLst, invoice_data.supplierId)
              : "",
            clientNameId: invoice_data.supplier_name
              ? invoice_data.supplier_name
              : "",
            gstNo: invoice_data.gstNo,
            salesAccId: getSelectValue(
              salesAccLst,
              invoice_data.sales_account_ledger_id
            ),
            transport_name:
              invoice_data.transport_name != null
                ? invoice_data.transport_name
                : "",
            reference:
              invoice_data.reference != null ? invoice_data.reference : "",

            sales_discount: discountInPer,
            sales_discount_amt: discountInAmt,
            additionalChgLedger1: additionLedger1,
            additionalChgLedger2: additionLedger2,
            additionalChgLedger3: additionLedger3,
            additionalChgLedgerAmt1: additionLedgerAmt1,
            additionalChgLedgerAmt2: additionLedgerAmt2,
            additionalChgLedgerAmt3: additionLedgerAmt3,

            additionalChgLedgerName1: res.additionLedgerAmt1
              ? getSelectValue(lstAdditionalLedger, res.additionLedger1)[
                  "label"
                ]
              : "",
            additionalChgLedgerName2: res.additionLedgerAmt2
              ? getSelectValue(lstAdditionalLedger, res.additionLedger2)[
                  "label"
                ]
              : "",
            additionalChgLedgerName3: res.additionLedgerAmt3
              ? getSelectValue(lstAdditionalLedger, res.additionLedger3)[
                  "label"
                ]
              : "",
            tcs: res.tcs,
            narration: res.narration,
            transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
          };
          console.log("initInvoiceData", initInvoiceData);
          let initRowData = [];
          if (row.length > 0) {
            console.log("Rowsssss------->", row);
            initRowData = row.map((v, i) => {
              console.log("rahul::v", v);
              let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
              console.log("productOpt", productOpt);

              let unit_id = {
                gst: v.gst != "" ? v.gst : 0,
                igst: v.igst != "" ? v.igst : 0,
                cgst: v.cgst != "" ? v.cgst : 0,
                sgst: v.sgst != "" ? v.sgst : 0,
              };

              v["prod_id"] = productOpt ? productOpt : "";
              v["productName"] = v.product_name ? v.product_name : "";
              v["productId"] = v.product_id ? v.product_id : "";
              v["details_id"] = v.details_id != "" ? v.details_id : 0;

              if (v.level_a_id == "") {
                v.levelaId = getSelectValue(productOpt.brandOpt, "");
              } else if (v.level_a_id) {
                v.levelaId = getSelectValue(
                  productOpt.levelAOpt,
                  v.level_a_id !== "" ? parseInt(v.level_a_id) : ""
                );
              }

              if (v.level_b_id == "") {
                v.levelbId = getSelectValue(v.levelaId.levelBOpt, "");
              } else if (v.level_b_id) {
                v.levelbId = getSelectValue(
                  v.levelaId.levelBOpt,
                  v.level_b_id !== "" ? parseInt(v.level_b_id) : ""
                );
              }

              if (v.level_c_id == "") {
                v.levelcId = getSelectValue(v.levelbId.levelCOpt, "");
              } else if (v.level_c_id) {
                v.levelcId = getSelectValue(
                  v.levelbId.levelCOpt,
                  v.level_c_id !== "" ? parseInt(v.level_c_id) : ""
                );
              }

              console.log("v.levelcId.unitOpt   >>>", v.levelcId.unitOpt);
              v["unitId"] = v.unitId
                ? getSelectValue(v.levelcId.unitOpt, parseInt(v.unitId))
                : "";
              v["unit_id"] = unit_id;
              v["qty"] = v.qty != "" ? v.qty : "";
              v["rate"] = v.rate != "" ? v.rate : 0;
              v["base_amt"] = v.base_amt != "" ? v.base_amt : 0;
              v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : 0;
              v["dis_amt"] = v.dis_amt;
              v["dis_per"] = v.dis_per;
              v["dis_per_cal"] = v.dis_per_cal != "" ? v.dis_per_cal : 0;
              v["dis_amt_cal"] = v.dis_amt_cal != "" ? v.dis_amt_cal : 0;
              v["total_amt"] = v.total_amt != "" ? v.total_amt : 0;
              v["total_base_amt"] =
                v.total_base_amt != "" ? v.total_base_amt : 0;
              v["gst"] = v.gst != "" ? v.gst : 0;
              v["igst"] = v.igst != "" ? v.igst : 0;
              v["cgst"] = v.cgst != "" ? v.cgst : 0;
              v["sgst"] = v.sgst != "" ? v.sgst : 0;
              v["total_igst"] = v.total_igst != "" ? v.total_igst : 0;
              v["total_cgst"] = v.total_cgst != "" ? v.total_cgst : 0;
              v["total_sgst"] = v.total_sgst > 0 ? v.total_sgst : 0;
              v["final_amt"] = v.final_amt != "" ? v.final_amt : 0;
              v["free_qty"] =
                v.free_qty != "" && v.free_qty != null ? v.free_qty : 0;
              v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
              v["row_dis_amt"] = v.row_dis_amt != "" ? v.row_dis_amt : 0;
              v["gross_amt"] = v.gross_amt != "" ? v.gross_amt : 0;
              v["add_chg_amt"] = v.add_chg_amt != "" ? v.add_chg_amt : 0;
              v["gross_amt1"] = v.gross_amt1 != "" ? v.gross_amt1 : 0;
              v["invoice_dis_amt"] =
                v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0;
              v["net_amt"] = v.final_amt != "" ? v.final_amt : 0;
              v["taxable_amt"] = v.total_amt != "" ? v.total_amt : 0;

              v["final_discount_amt"] =
                v.final_discount_amt != "" ? v.final_discount_amt : 0;
              v["discount_proportional_cal"] =
                v.discount_proportional_cal != ""
                  ? v.discount_proportional_cal
                  : 0;
              v["additional_charges_proportional_cal"] =
                v.additional_charges_proportional_cal != ""
                  ? v.additional_charges_proportional_cal
                  : 0;
              v["b_no"] = v.batch_no != "" ? v.batch_no : "";
              v["b_rate"] = v.b_rate != "" ? v.b_rate : 0;
              v["rate_a"] = v.min_rate_a != "" ? v.min_rate_a : 0;
              v["rate_b"] = v.min_rate_b != "" ? v.min_rate_b : 0;
              v["rate_c"] = v.min_rate_c != "" ? v.min_rate_c : 0;
              v["max_discount"] = v.max_discount != "" ? v.max_discount : 0;
              v["min_discount"] = v.min_discount != "" ? v.min_discount : 0;
              v["min_margin"] = v.min_margin != "" ? v.min_margin : 0;
              v["manufacturing_date"] =
                v.manufacturing_date != "" ? v.manufacturing_date : "";
              v["b_purchase_rate"] =
                v.purchase_rate != "" ? v.purchase_rate : 0;
              v["b_expiry"] = v.b_expiry != "" ? v.b_expiry : "";
              v["b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : "";
              v["is_batch"] = v.is_batch != "" ? v.is_batch : "";

              return v;
            });
          }
          console.log("initInvoiceData", initInvoiceData);
          console.log("initRowData", initRowData);
          data.returnInitVal["outstanding"] = data.returnData.total_amount;
          this.setState(
            {
              salesReturnObject: this.state.salesReturnData.returnIntiVal,
              invoice_data: initInvoiceData,
              initVal: data.returnInitVal,
              rows: initRowData,
              isEditDataSet: true,
              additionalChargesTotal: totalAdditionalCharges,
            },
            () => {
              setTimeout(() => {
                this.handleTranxCalculation();
              }, 25);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleTranxCalculation = () => {
    // !Most IMP̥
    let { rows, additionalChargesTotal } = this.state;

    // console.log("handleTranxCalculation Row => ", rows);
    let ledger_disc_amt = 0;
    let ledger_disc_per = 0;
    let takeDiscountAmountInLumpsum = false;
    let isFirstDiscountPerCalculate = false;
    let addChgLedgerAmt1 = 0;
    let addChgLedgerAmt2 = 0;
    let addChgLedgerAmt3 = 0;

    if (this.myRef.current) {
      let {
        sales_discount,
        sales_discount_amt,
        clientNameId,
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
      } = this.myRef.current.values;

      ledger_disc_per = sales_discount;
      ledger_disc_amt = sales_discount_amt;

      addChgLedgerAmt1 = additionalChgLedgerAmt1;
      addChgLedgerAmt2 = additionalChgLedgerAmt2;
      addChgLedgerAmt3 = additionalChgLedgerAmt3;

      takeDiscountAmountInLumpsum = clientNameId.takeDiscountAmountInLumpsum;
      isFirstDiscountPerCalculate = clientNameId.isFirstDiscountPerCalculate;
    }

    let resTranxFn = fnTranxCalculation({
      rows: rows,
      ledger_disc_per: ledger_disc_per,
      ledger_disc_amt: ledger_disc_amt,
      additionalChargesTotal: additionalChargesTotal,

      additionalChgLedgerAmt1: addChgLedgerAmt1,
      additionalChgLedgerAmt2: addChgLedgerAmt2,
      additionalChgLedgerAmt3: addChgLedgerAmt3,

      takeDiscountAmountInLumpsum,
      isFirstDiscountPerCalculate,
    });
    console.warn("resTranxFn >>>>>>>>>>>>>>>>", resTranxFn);
    let {
      base_amt,
      total_purchase_discount_amt,
      total_taxable_amt,
      total_tax_amt,
      gst_row,
      total_final_amt,
      gst_total_amt,
      taxIgst,
      taxCgst,
      taxSgst,

      total_invoice_dis_amt,
      total_qty,
      total_free_qty,
      bill_amount,
      total_row_gross_amt,
      total_row_gross_amt1,
    } = resTranxFn;

    let roundoffamt = Math.round(total_final_amt);
    let roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);

    this.myRef.current.setFieldValue(
      "total_base_amt",
      isNaN(parseFloat(base_amt)) ? 0 : parseFloat(base_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      isNaN(parseFloat(total_purchase_discount_amt))
        ? 0
        : parseFloat(total_purchase_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt1",
      parseFloat(total_row_gross_amt1)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt",
      parseFloat(total_row_gross_amt)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(total_taxable_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(total_tax_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      parseFloat(roffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      parseFloat(roundoffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(bill_amount)).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_invoice_dis_amt",
      parseFloat(total_invoice_dis_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_qty",
      parseFloat(total_qty).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_free_qty",
      parseFloat(total_free_qty).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };

    this.setState({
      rows: gst_row,
      taxcal: taxState,
    });
  };

  getFloatUnitElement = (ele, rowIndex) => {
    let { rows } = this.state;
    return rows[rowIndex][ele]
      ? parseFloat(rows[rowIndex][ele]).toFixed(2)
      : "";
  };
  handleNumChange = (ele, value, rowIndex) => {
    let { rows } = this.state;
    if (value == "") {
      rows[rowIndex][ele] = 0;
    } else if (!isNaN(value)) {
      rows[rowIndex][ele] = value;
    }

    this.handleRowStateChange(rows);
  };

  handleUnitChange = (ele, value, rowIndex) => {
    let { rows, showBatch } = this.state;
    console.log("(ele, value, rowIndex) ", ele, value, rowIndex);

    if (value == "" && ele == "qty") {
      value = 0;
    }
    rows[rowIndex][ele] = value;

    if (ele == "unitId") {
      if (rows[rowIndex]["is_batch"] === true && ele == "unitId") {
        this.handleRowStateChange(
          rows,
          rows[rowIndex]["is_batch"], // true,
          rowIndex
        );
      }
    } else {
      this.handleRowStateChange(rows);
    }
  };

  handleRowClick = (v) => {
    console.log("v ", v);

    let { initVal } = this.state;
    let prop_data = {
      returnInitVal: this.myRef.current.values,
      returnData: v,
      invoice_data: v,
    };

    this.setState({ salesReturnData: prop_data, show: false }, () => {
      this.getProductFlavorpackageUnitbyids();
    });
  };
  handleMstState = (rows) => {
    this.setState({ rows: rows });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
  };
  handleLstBrand = (lstBrand) => {
    this.setState({ lstBrand: lstBrand });
  };

  handleRowChange = (
    rows,
    showBatch = false,
    rowIndex = 0,
    transactionDetailIndex = 0
  ) => {
    this.setState({ rows: rows }, () => {
      this.handleAdditionalChargesSubmit();
      if (showBatch == true) {
        this.setState(
          {
            rowIndex: rowIndex,
            transactionDetailIndex: transactionDetailIndex,
          },
          () => {
            // this.getInitBatchValue();
            this.getProductBatchList();
          }
        );
      }
    });
  };

  handlePropsData = (prop_data) => {
    if (prop_data.invoice_data) {
      this.setState({
        invoice_data: prop_data.invoice_data,
        rows: prop_data.rows,
        additionalCharges: prop_data.additionalCharges,
      });
    } else {
      // this.setState({ invoice_data: prop_data });
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setLastCreditNoteNo();
      this.lstSalesAccounts();
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      this.initRow();
      this.transaction_product_listFun();
      this.transaction_ledger_listFun();

      const { prop_data } = this.props.block;
      console.log("prop_data =->>> ", prop_data);
      // this.setState({ invoice_data: prop_data });
      this.handlePropsData(prop_data);
      this.getUserControlLevelFromRedux();
    }
  }

  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
    console.log("getUserControlLevelFromRedux : ", level);
    this.setState({ ABC_flag_value: level });

    if (level == "A") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
    } else if (level == "AB") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
    } else if (level == "ABC") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
      const l_C = getUserControlData("is_level_c", this.props.userControl);
      this.setState({ levelC: l_C });
    }
  };

  componentDidUpdate() {
    const {
      salesAccLst,
      supplierNameLst,
      productLst,
      lstAdditionalLedger,
      isEditDataSet,
      lstBrand,
      salesReturnData,
      lstDisLedger,
      supplierCodeLst,
    } = this.state;

    if (
      salesAccLst.length > 0 &&
      supplierNameLst.length > 0 &&
      supplierCodeLst.length > 0 &&
      productLst.length > 0 &&
      lstBrand.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      isEditDataSet == false &&
      salesReturnData != ""
    ) {
      this.setPurchaseInvoiceEditData();
      // this.setSalesInvoiceEditData();
    }
  }
  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
    });
  };

  /**
   *
   * @param {*} product
   * @param {*} element
   * @description to return place holder according to product unit
   * @returns
   */
  handlePlaceHolder = (product, element) => {
    // console.log({ product, element });
    if (product != "") {
      if (element == "qtyH") {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == "rateH") {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == "qtyM") {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == "rateM") {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == "qtyL") {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
      if (element == "rateL") {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
    }
    return "";
  };

  handleTranxModal = (status) => {
    this.setState({ transaction_mdl_show: status });
    if (status == false) {
      this.handleAdditionalChargesSubmit();
      this.handleTranxCalculation();
    }
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleUnitLstOpt = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt.length;
    }
  };
  handleSerialNoQty = (element, index) => {
    let { rows } = this.state;
    console.log("serial no", rows);
    console.log({ element, index });
    // this.setState({ serialnopopupwindow: true });
  };
  handleSerialNoValue = (index, value) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.map((v, i) => {
      if (i == index) {
        v["no"] = value;
      }
      return v;
    });

    this.setState({ serialnoarray: fn });
  };
  valueSerialNo = (index) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.find((v, i) => i == index);
    return fn ? fn.no : "";
  };
  renderSerialNo = () => {
    let { rows, serialnoshowindex, serialnoarray } = this.state;
    if (serialnoshowindex != -1) {
      let rdata = rows.find((v, i) => i == serialnoshowindex);

      return serialnoarray.map((vi, ii) => {
        return (
          <tr>
            <td>{ii + 1}</td>
            <td>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    this.handleSerialNoValue(ii, e.target.value);
                  }}
                  value={this.valueSerialNo(ii)}
                />
              </Form.Group>
            </td>
          </tr>
        );
      });
    }
  };
  handleSerialNoSubmit = () => {
    let { rows, serialnoshowindex, serialnoarray } = this.state;

    if (serialnoshowindex != -1) {
      let rdata = rows.map((v, i) => {
        if (i == serialnoshowindex) {
          let no = serialnoarray.filter((vi, ii) => {
            if (vi.no != "") {
              return vi.no;
            }
          });
          v["serialNo"] = no;
          v["qtyH"] = no.length;
        }
        return v;
      });
      this.setState({
        rows: rdata,
        serialnoshowindex: -1,
        serialnoarray: [],
        serialnopopupwindow: false,
      });
    }
  };
  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;

        if (value == undefined || value == null) {
          v["amt"] = "";
        }
      }
      return v;
    });
    let totalamt = 0;
    fa.map((v) => {
      if (v.amt != "") {
        totalamt += parseFloat(v.amt);
      }
    });
    this.setState({ additionalCharges: fa, additionalChargesTotal: totalamt });
  };
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleAdditionalChargesHide = () => {
    this.setState({ additionchargesyes: false }, () => {
      this.handleTranxCalculation();
    });
  };

  handleRoundOffchange = (v) => {
    // console.log("roundoff", v);
    const { rows, additionalChargesTotal } = this.state;
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      // console.log("v", v.final_amt);
      if (v["productId"] != "") {
        if (v["qtyH"] != "" && v["rateH"] != "") {
          v["base_amt_H"] = parseInt(v["qtyH"]) * parseFloat(v["rateH"]);
        }
        if (v["qtyM"] != "" && v["rateM"] != "") {
          v["base_amt_M"] = parseInt(v["qtyM"]) * parseFloat(v["rateM"]);
        }
        if (v["qtyL"] != "" && v["rateL"] != "") {
          v["base_amt_L"] = parseInt(v["qtyL"]) * parseFloat(v["rateL"]);
        }

        v["base_amt"] = v["base_amt_H"] + v["base_amt_M"] + v["base_amt_L"];
        v["total_amt"] = v["base_amt"];
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) - parseFloat(v["dis_amt"]);
          v["dis_amt_cal"] = v["dis_amt"];
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          let per_amt = calculatePercentage(v["total_amt"], v["dis_per"]);
          v["dis_per_cal"] = per_amt;
          v["total_amt"] = v["total_amt"] - per_amt;
        }
        totalamt += parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *
     */

    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (
          this.myRef.current.values.sales_discount > 0 &&
          this.myRef.current.values.sales_discount != ""
        ) {
          let peramt = calculatePercentage(
            totalamt,
            this.myRef.current.values.sales_discount,
            v["total_amt"]
          );
          v["discount_proportional_cal"] = calculatePrValue(
            totalamt,
            peramt,
            v["total_amt"]
          );

          v["total_amt"] =
            v["total_amt"] - calculatePrValue(totalamt, peramt, v["total_amt"]);
        }
        if (
          this.myRef.current.values.sales_discount_amt > 0 &&
          this.myRef.current.values.sales_discount_amt != ""
        ) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) -
            calculatePrValue(
              totalamt,
              this.myRef.current.values.sales_discount_amt,
              v["total_amt"]
            );
          v["discount_proportional_cal"] = parseFloat(
            calculatePrValue(
              totalamt,
              this.myRef.current.values.sales_discount_amt,
              v["total_amt"]
            )
          ).toFixed(2);
        }

        ntotalamt += parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("ntotalamt", ntotalamt);
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      if (v["productId"] != "") {
        v["total_amt"] = parseFloat(
          v["total_amt"] +
            calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
        v["additional_charges_proportional_cal"] = parseFloat(
          calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
      }
      return v;
    });

    let famt = 0;
    let totalbaseamt = 0;

    let totaltaxableamt = 0;
    let totaltaxamt = 0;
    let totalcgstamt = 0;
    let totalsgstamt = 0;
    let totaligstamt = 0;
    let total_discount_proportional_amt = 0;
    let total_additional_charges_proportional_amt = 0;
    let total_sales_discount_amt = 0;
    let total_purchase_discount_amt = 0;

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];

    let totalqtyH = 0;
    let totalqtyM = 0;
    let totalqtyL = 0;
    /**
     * GST Calculation
     * **/
    let frow = addCharges.map((v, i) => {
      if (v["productId"] != "") {
        v["total_igst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["igst"])
        ).toFixed(2);
        v["total_cgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["cgst"])
        ).toFixed(2);
        v["total_sgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["sgst"])
        ).toFixed(2);

        v["final_amt"] = parseFloat(
          parseFloat(v["total_amt"]) + parseFloat(v["total_igst"])
        ).toFixed(2);

        totaligstamt =
          parseFloat(totaligstamt) + parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt =
          parseFloat(totalcgstamt) + parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt =
          parseFloat(totalsgstamt) + parseFloat(v["total_sgst"]).toFixed(2);
        // console.log("final_amt", v["final_amt"]);
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v["final_amt"])
        ).toFixed(2);
        // totalbaseamt =
        //   parseFloat(totalbaseamt) + parseFloat(v["base_amt"]).toFixed(2);

        totalbaseamt = parseFloat(
          parseFloat(totalbaseamt) +
            (parseFloat(v["base_amt"]) -
              parseFloat(v["dis_per_cal"] != "" ? v["dis_per_cal"] : 0) -
              parseFloat(v["dis_amt_cal"] != "" ? v["dis_amt_cal"] : 0))
        ).toFixed(2);
        totaltaxableamt =
          parseFloat(totaltaxableamt) + parseFloat(v["total_amt"]).toFixed(2);
        totaltaxamt =
          parseFloat(totaltaxamt) + parseFloat(v["total_igst"]).toFixed(2);
        total_purchase_discount_amt =
          parseFloat(total_purchase_discount_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v["additional_charges_proportional_cal"]);
        // ! Tax Indidual gst % calculation
        if (v.productId != "") {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
                  }
                  return vi;
                });
                taxIgst = [...innerIgstCal];
              } else {
                let innerIgstCal = {
                  gst: v.productId.igst,
                  amt: parseFloat(v.total_igst),
                };
                taxIgst = [...taxIgst, innerIgstCal];
              }
            } else {
              let innerIgstCal = {
                gst: v.productId.igst,
                amt: parseFloat(v.total_igst),
              };
              taxIgst = [...taxIgst, innerIgstCal];
            }
          }
          if (v.productId.cgst > 0) {
            if (taxCgst.length > 0) {
              let innerCgstTax = taxCgst.find(
                (vi) => vi.gst == v.productId.cgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxCgst.filter((vi) => {
                  if (vi.gst == v.productId.cgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
                  }
                  return vi;
                });
                taxCgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.cgst,
                  amt: parseFloat(v.total_cgst),
                };
                taxCgst = [...taxCgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.cgst,
                amt: parseFloat(v.total_cgst),
              };
              taxCgst = [...taxCgst, innerCgstCal];
            }
          }
          if (v.productId.sgst > 0) {
            if (taxSgst.length > 0) {
              let innerCgstTax = taxSgst.find(
                (vi) => vi.gst == v.productId.sgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxSgst.filter((vi) => {
                  if (vi.gst == v.productId.sgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
                  }
                  return vi;
                });
                taxSgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.sgst,
                  amt: parseFloat(v.total_sgst),
                };
                taxSgst = [...taxSgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.sgst,
                amt: parseFloat(v.total_sgst),
              };
              taxSgst = [...taxSgst, innerCgstCal];
            }
          }
        }
      }
      return v;
    });
    let roundoffamt = Math.round(famt);
    this.myRef.current.setFieldValue("totalqtyH", totalqtyH);
    this.myRef.current.setFieldValue("totalqtyM", totalqtyM);
    this.myRef.current.setFieldValue("totalqtyL", totalqtyL);
    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      parseFloat(total_purchase_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue("roundoff", v);
    // let roffamt = parseFloat(roundoffamt - famt).toFixed(2);
    // this.myRef.current.setFieldValue("roundoff", roundoffamt);
    this.myRef.current.setFieldValue(
      "total_base_amt",
      parseFloat(totalbaseamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(totaltaxableamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totaligst",
      parseFloat(totaligstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalcgst",
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalsgst",
      parseFloat(totalsgstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.myRef.current.setFieldValue("totalamt", parseFloat(famt).toFixed(2));
    this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
  };

  handleBillsSelection = (id, status) => {
    let { selectedBills } = this.state;
    if (status == true) {
      if (!selectedBills.includes(id)) {
        selectedBills = [...selectedBills, id];
      }
    } else {
      selectedBills = selectedBills.filter((v) => v != id);
    }
    this.setState({
      selectedBills: selectedBills,
    });
  };

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    console.warn(" rahul rowValue ::", showBatch, rowIndex, rowValue);
    this.setState({ rows: rowValue }, () => {
      if (showBatch == true && rowIndex >= 0) {
        this.setState(
          {
            rowIndex: rowIndex,
          },
          () => {
            console.warn(" rahul getProductBatchList ::");
            this.getProductBatchList(rowIndex);
          }
        );
      }

      this.handleTranxCalculation();
    });
  };

  getLevelsOpt = (element, rowIndex, parent) => {
    let { rows } = this.state;
    return rows[rowIndex] && rows[rowIndex][parent]
      ? rows[rowIndex][parent][element]
      : [];
  };

  deleteledgerFun = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_ledger(formData)
      .then((response) => {
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
          this.transaction_ledger_listFun();
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };

  deleteproduct = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_Product_list(formData)
      .then((response) => {
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
          this.transaction_product_listFun();
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };

  getInitBatchValue = (rowIndex = -1) => {
    let { rows } = this.state;
    let initVal = "";
    console.log("b_no: ", rowIndex, rows);
    if (rowIndex != -1) {
      initVal = {
        b_no: rows[rowIndex]["b_no"],
        b_rate: rows[rowIndex]["b_rate"],
        sales_rate: rows[rowIndex]["sales_rate"],
        rate_a: rows[rowIndex]["rate_a"],
        rate_b: rows[rowIndex]["rate_b"],
        rate_c: rows[rowIndex]["rate_c"],
        min_margin: rows[rowIndex]["min_margin"],
        margin_per: rows[rowIndex]["margin_per"],
        b_purchase_rate: rows[rowIndex]["b_purchase_rate"],
        b_expiry:
          rows[rowIndex]["b_expiry"] != ""
            ? moment(
                new Date(
                  moment(rows[rowIndex]["b_expiry"], "YYYY-MM-DD").toDate()
                )
              ).format("DD/MM/YYYY")
            : "",
        manufacturing_date:
          rows[rowIndex]["manufacturing_date"] != ""
            ? moment(
                new Date(
                  moment(
                    rows[rowIndex]["manufacturing_date"],
                    "YYYY-MM-DD"
                  ).toDate()
                )
              ).format("DD/MM/YYYY")
            : "",
        b_details_id: rows[rowIndex]["b_details_id"],
      };
    } else {
      initVal = {
        b_no: 0,
        b_rate: 0,
        sales_rate: 0,
        costing: 0,
        cost_with_tax: 0,
        rate_a: 0,
        min_margin: 0,
        manufacturing_date: "",
        b_purchase_rate: 0,
        b_expiry: "",
        b_details_id: 0,
        dummy_date: new Date(),
      };
    }
    console.log("initVal ", initVal);
    let IsBatch = rows[rowIndex]["is_batch"];
    console.log(" IsBatch ", IsBatch);

    if (IsBatch == true) {
      this.setState({
        rowIndex: rowIndex,
        batchInitVal: initVal,
        newBatchModal: true,
        isBatch: IsBatch,
        tr_id: "",
      });
    }
  };

  getProductBatchList = (rowIndex) => {
    let { rows, invoice_data, lstBrand } = this.state;
    let product_id = rows[rowIndex]["productId"];
    let level_a_id = rows[rowIndex]["levelaId"]["value"];
    let level_b_id = 0;
    let level_c_id = 0;

    if (
      rows[rowIndex]["levelbId"] != "" &&
      rows[rowIndex]["levelbId"]["value"] != ""
    )
      level_b_id = rows[rowIndex]["levelbId"]["value"];
    if (
      rows[rowIndex]["levelcId"] != "" &&
      rows[rowIndex]["levelcId"]["value"] != ""
    )
      level_c_id = rows[rowIndex]["levelcId"]["value"];

    let unit_id = rows[rowIndex]["unitId"]["value"];

    console.warn({ unit_id });

    let isfound = false;
    let batchOpt = [];
    let productData = getSelectValue(lstBrand, product_id);
    console.log("productData", productData);
    if (productData) {
      let levelAData = "";
      if (level_a_id > 0) {
        levelAData = getSelectValue(productData.levelAOpt, level_a_id);
      } else {
        levelAData = getSelectValue(productData.levelAOpt, "");
      }
      if (levelAData) {
        let levelBData = "";
        if (level_b_id > 0) {
          levelBData = getSelectValue(levelAData.levelBOpt, level_b_id);
        } else {
          levelBData = getSelectValue(levelAData.levelBOpt, "");
        }

        if (levelBData) {
          let levelCData = "";
          if (level_c_id > 0) {
            levelCData = getSelectValue(levelBData.levelCOpt, level_c_id);
          } else {
            levelCData = getSelectValue(levelBData.levelCOpt, "");
          }
          if (levelCData) {
            let unitdata = "";
            if (unit_id > 0) {
              unitdata = getSelectValue(levelCData.unitOpt, unit_id);
            } else {
              unitdata = getSelectValue(levelCData.unitOpt, "");
            }
            if (unitdata && unitdata.batchOpt) {
              isfound = true;
              batchOpt = unitdata.batchOpt;
            }
          }
        }
      }
    }
    if (isfound == false) {
      let invoice_value = this.myRef.current.values;
      let reqData = new FormData();
      reqData.append("product_id", product_id);
      reqData.append("level_a_id", level_a_id);
      if (
        rows[rowIndex]["levelbId"] != "" &&
        rows[rowIndex]["levelbId"]["value"] != ""
      )
        reqData.append("level_b_id", rows[rowIndex]["levelbId"]["value"]);
      if (
        rows[rowIndex]["levelcId"] != "" &&
        rows[rowIndex]["levelcId"]["value"] != ""
      )
        reqData.append("level_c_id", rows[rowIndex]["levelcId"]["value"]);
      reqData.append("unit_id", unit_id);
      reqData.append(
        "invoice_date",
        moment(invoice_value.transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
      );

      invoice_data["costing"] = "";
      invoice_data["costingWithTax"] = "";
      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          if (response.responseStatus == 200) {
            let res = response.data;

            invoice_data["costing"] = response.costing;
            invoice_data["costingWithTax"] = response.costingWithTax;
            this.setState(
              {
                batchData: res,
                invoice_data: invoice_data,
              },
              () => {
                this.getInitBatchValue(rowIndex);
              }
            );
          }
        })
        .catch((error) => {});
    } else {
      this.setState(
        {
          batchData: batchOpt,
        },
        () => {
          this.getInitBatchValue(rowIndex);
        }
      );
    }
  };

  handleLstPackage = (lstPackages) => {
    this.setState({ lstPackages: lstPackages });
  };

  handleLstFlavour = (lstFlavours) => {
    this.setState({ lstFlavours: lstFlavours });
  };

  getProductPackageLst = (product_id, rowIndex = -1) => {
    // debugger;
    let reqData = new FormData();
    let { rows, lstBrand } = this.state;
    let findProductPackges = getSelectValue(lstBrand, product_id);
    if (findProductPackges) {
      console.log("findProductPackges ", findProductPackges);
      if (findProductPackges && rowIndex != -1) {
        rows[rowIndex]["prod_id"] = findProductPackges;
        rows[rowIndex]["levelaId"] = findProductPackges["levelAOpt"][0];

        if (findProductPackges["levelAOpt"][0]["levelBOpt"].length >= 1) {
          rows[rowIndex]["levelbId"] =
            findProductPackges["levelAOpt"][0]["levelBOpt"][0];

          if (
            findProductPackges["levelAOpt"][0]["levelBOpt"][0]["levelCOpt"]
              .length >= 1
          ) {
            rows[rowIndex]["levelcId"] =
              findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                "levelCOpt"
              ][0];
          }
        }

        rows[rowIndex]["isLevelA"] = true;
      }
      this.setState({ rows: rows });
    } else {
      reqData.append("product_id", product_id);

      getProductFlavourList(reqData)
        .then((response) => {
          let responseData = response.data;
          if (responseData.responseStatus == 200) {
            let levelData = responseData.responseObject;
            let data = responseData.responseObject.lst_packages;

            let levelAOpt = data.map((vb) => {
              let levelb_opt = vb.levelBOpts.map((vg) => {
                let levelc_opt = vg.levelCOpts.map((vc) => {
                  let unit_opt = vc.unitOpts.map((z) => {
                    return {
                      label: z.label,
                      value: z.value != "" ? parseInt(z.value) : "",
                      isDisabled: false,
                      ...z,
                    };
                  });
                  return {
                    label: vc.label,
                    value: vc.value != "" ? parseInt(vc.value) : "",
                    isDisabled: false,

                    unitOpt: unit_opt,
                  };
                });
                return {
                  label: vg.label,
                  value: vg.value != "" ? parseInt(vg.value) : "",
                  isDisabled: false,

                  levelCOpt: levelc_opt,
                };
              });
              return {
                label: vb.label,
                value: vb.value != "" ? parseInt(vb.value) : "",
                isDisabled: false,

                levelBOpt: levelb_opt,
              };
            });

            let fPackageLst = [
              ...lstBrand,
              {
                product_id: product_id,
                value: product_id,
                levelAOpt: levelAOpt,
                // set levels category data
                isLevelA: true,
                isLevelB: true,
                isLevelC: true,
              },
            ];
            console.log("fPackageLst =-> ", fPackageLst);
            this.setState({ lstBrand: fPackageLst }, () => {
              let findProductPackges = getSelectValue(
                this.state.lstBrand,
                product_id
              );
              console.log("findProductPackges =-> ", findProductPackges);
              if (findProductPackges && rowIndex != -1) {
                rows[rowIndex]["prod_id"] = findProductPackges;
                rows[rowIndex]["levelaId"] = findProductPackges["levelAOpt"][0];

                if (
                  findProductPackges["levelAOpt"][0]["levelBOpt"].length >= 1
                ) {
                  rows[rowIndex]["levelbId"] =
                    findProductPackges["levelAOpt"][0]["levelBOpt"][0];

                  if (
                    findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                      "levelCOpt"
                    ].length >= 1
                  ) {
                    rows[rowIndex]["levelcId"] =
                      findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                        "levelCOpt"
                      ][0];
                  }
                }

                rows[rowIndex]["isLevelA"] = true;
                // rows[rowIndex]["isGroup"] = levelData.isGroup;
                // rows[rowIndex]["isCategory"] = levelData.isCategory;
                // rows[rowIndex]["isSubCategory"] = levelData.isSubcategory;
                // rows[rowIndex]["isPackage"] = levelData.isPackage;

                // setTimeout(() => {
                //   var allElements =
                //     document.getElementsByClassName("unitClass");
                //   for (var i = 0; i < allElements.length; i++) {
                //     document.getElementsByClassName("unitClass")[
                //       i
                //     ].style.border = "1px solid";
                //   }
                // }, 1);
              }
              this.setState({ rows: rows });
            });
          } else {
            this.setState({ lstBrand: [] });
          }
        })
        .catch((error) => {
          this.setState({ lstBrand: [] });
          // console.log("error", error);
        });
    }
  };

  setSupplierData = (supplierId = "", setFieldValue) => {
    console.warn("warn :: supplierId", supplierId);
    let requestData = new FormData();
    requestData.append("ledgerId", supplierId && supplierId.value);
    checkLedgerDrugAndFssaiExpiryByLedgerId(requestData)
      .then((response) => {
        console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "confirm",
              title: `${res.message} expired...`,
              msg: "Do you want continue with invoice",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => {},
              handleFailFn: () => {
                this.reloadPage();
              },
            },
            () => {}
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });

    let opt = [];
    opt = supplierId.gstDetails.map((v, i) => {
      return {
        label: v.gstin,
        value: v.id,
      };
    });
    this.setState({ lstGst: opt }, () => {
      if (opt.length > 0) setFieldValue("gstId", opt[0]);
    });
  };

  handleSubmitSCList = (value) => {
    console.log("value--->", value);
    // this.setState({ initVal: value });

    let reqData = new FormData();
    reqData.append("sundry_debtors_id", value);
    getTranxCreditNoteListInvoiceBillSC(reqData)
      .then((response) => {
        let res = response.data;
        let lst = res.data;

        if (res.responseStatus == 200) {
          this.setState({
            invoiceLstSC: lst,
            selected_values: value,
            show: true,
          });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "warn",
            title: "Warning",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          // this.setState({
          //   invoiceLstSC: lst,
          //   show: true,
          // });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleBillList = (v) => {
    console.log("SR List----->", v);

    this.setState({ show: true, bill_value: v }, () => {
      this.handleSubmitSCList(v.clientNameId);
    });
  };
  checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
    console.warn("rahul :: invoiceDate", invoiceDate);
    let requestData = new FormData();
    requestData.append(
      "invoiceDate",
      moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
    );
    checkInvoiceDateIsBetweenFY(requestData)
      .then((response) => {
        console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "confirm",
              title: "Invoice date not valid as per FY",
              msg: "Do you want continue with invoice date",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => {
                console.warn("rahul:: continue invoice");
              },
              handleFailFn: () => {
                console.warn("rahul:: exit from invoice or reload page");
                this.invoiceDateRef.current.focus();
                setFieldValue("transaction_dt", "");
                // this.reloadPage();
              },
            },
            () => {
              console.warn("rahul :: return_data");
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  searchLedger = (search = "") => {
    console.log({ search });
    let { orglstAdditionalLedger, element1, element2 } = this.state;
    let orglstAdditionalLedger_F = [];
    if (search.length > 0) {
      orglstAdditionalLedger_F = orglstAdditionalLedger.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.unique_code.toLowerCase().includes(search.toLowerCase())
      );

      console.log({ orglstAdditionalLedger });
      this.setState({
        lstAdditionalLedger: orglstAdditionalLedger_F,
      });
    } else {
      this.setState({
        lstAdditionalLedger:
          orglstAdditionalLedger_F.length > 0
            ? orglstAdditionalLedger_F
            : orglstAdditionalLedger,
      });
    }
  };

  ledgerModalFun = (status) => {
    this.setState({ ledgerData: "", ledgerModal: status });
  };
  addLedgerModalFun = (status = false, element1 = "", element2 = "") => {
    let { orglstAdditionalLedger } = this.state;
    this.setState(
      {
        ledgerData: "",
        showLedgerDiv: status,
        addchgElement1: element1,
        addchgElement2: element2,
      },
      () => {
        if (status === false) {
          this.setState({ lstAdditionalLedger: orglstAdditionalLedger });
        }
      }
    );
    // this.setState({ ledgerNameModal: [status] });
  };
  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
  };

  get_sales_return_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    get_sales_return_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        let onlyfive = [];
        // console.log("Supplier data-", res);
        if (res.responseStatus == 200) {
          let idc = res.data;

          // onlyfive = idc.filter((e) => {
          //   return null;
          if (idc.length <= 10) {
            for (let i = 0; i < idc.length; i++) {
              onlyfive.push(idc[i]);
            }
            console.log("lessthan equal to five", onlyfive);
          } else {
            var count = 1;
            onlyfive = idc.filter((e) => {
              if (count <= 10) {
                count++;
                return e;
              }
              return null;
            });
            console.log("greater than five", onlyfive);
          }
          this.setState({
            product_supplier_lst: onlyfive,
          });
        }
      })
      .catch((error) => {
        this.setState({ product_supplier_lst: [] });
      });
  };
  transaction_product_Hover_detailsFun = (product_id = 0) => {
    if (product_id != 0) {
      let obj = this.state.productLst.find((v) => v.id === product_id);
      if (obj) {
        this.setState({ product_hover_details: obj });
        return obj;
      }
    }
    return null;
  };

  render() {
    const {
      product_supplier_lst,
      invoice_data,
      invoiceedit,
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      productLst,
      serialnopopupwindow,
      additionchargesyes,
      lstDisLedger,
      lstGst,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      rowDelDetailsIds,
      initVal,
      invoiceLstSC,
      salesReturnData,
      adjusmentbillmodal,
      lstBrand,
      show,
      batchModalShow,
      is_expired,
      batchInitVal,
      isBatch,
      batchData,
      tr_id,
      isBranch,
      ledgerModal,
      ledgerNameModal,
      newBatchModal,
      selectProductModal,
      ledgerList,
      ledgerData,
      selectedLedger,
      selectedProduct,
      productData,
      rowIndex,
      levelOpt,
      batchDetails,
      showLedgerDiv,
      addchgElement1,
      addchgElement2,
      orglstAdditionalLedger,
      selectedLedgerNo,
      product_hover_details,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
    } = this.state;
    return (
      <>
        <div className="purchase-tranx">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={invoice_data}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              invoice_dt: Yup.string().required("Party Date is Required"),
              clientNameId: Yup.string()
                .trim()
                .required("Client Name is Required"),
              // salesAccId: Yup.object().nullable().required("Required"),
              // transaction_dt: Yup.string().trim().required("Required"),
              invoice_no: Yup.string().trim().required("Party No. is Required"),
            })}
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
                    this.setState({ adjusmentbillmodal: true });
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
              bill_value,
            }) => (
              <Form
                onSubmit={handleSubmit}
                noValidate
                style={{ overflowX: "hidden", overflowY: "hidden" }}
                autoComplete="off"
                className="frm-tnx-purchase-invoice"
              >
                <>
                  {/* {JSON.stringify(values)}
                  {JSON.stringify(errors)} */}
                  <div className="div-style p-3">
                    <div>
                      <Row className="mx-0 inner-div-style">
                        <Row>
                          {isBranch == true && (
                            <Col lg={2} md={2} sm={2} xs={2}>
                              <Row>
                                <Col
                                  lg={4}
                                  md={4}
                                  sm={4}
                                  xs={4}
                                  className="my-auto"
                                >
                                  <Form.Label>Branch</Form.Label>
                                </Col>

                                <Col lg={8} md={8} sm={8} xs={8}>
                                  <Select
                                    className="selectTo"
                                    components={{
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    isClearable
                                    options={salesAccLst}
                                    isDisabled
                                    name="branchId"
                                    onChange={(v) => {
                                      setFieldValue("branchId", v);
                                    }}
                                    value={values.branchId}
                                  />

                                  <span className="text-danger errormsg">
                                    {errors.branchId}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          )}

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Tranx Date</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  autoFocus="true"
                                  className="tnx-pur-inv-date-style "
                                  name="transaction_dt"
                                  id="transaction_dt"
                                  placeholder="DD/MM/YYYY"
                                  value={values.transaction_dt}
                                  onChange={handleChange}
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
                                      console.warn(
                                        "rahul:: isValid",
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
                                          "transaction_dt",
                                          e.target.value
                                        );
                                        this.checkInvoiceDateIsBetweenFYFun(
                                          e.target.value,
                                          setFieldValue
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Invalid invoice date",
                                          is_button_show: true,
                                        });
                                        this.invoiceDateRef.current.focus();
                                        setFieldValue("transaction_dt", "");
                                      }
                                    } else {
                                      setFieldValue("transaction_dt", "");
                                    }
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Label>
                                  Client Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box text-start"
                                  placeholder="Client Name"
                                  name="clientNameId"
                                  id="clientNameId"
                                  readOnly
                                  onChange={handleChange}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.ledgerModalFun(true);
                                  }}
                                  value={
                                    values.clientNameId != ""
                                      ? values.clientNameId
                                      : ""
                                  }
                                  disabled={
                                    values.transaction_dt != "" ? false : true
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Tab" && !e.target.value)
                                      e.preventDefault();
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.clientNameId}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Client GSTIN</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="GSTIN"
                                  name="gstNo"
                                  id="gstNo"
                                  readOnly
                                  onChange={handleChange}
                                  value={values.gstNo}
                                />
                                <span className="text-danger errormsg">
                                  {errors.gstNo}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Sales A/C</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Select
                                  className="selectTo"
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  styles={purchaseSelect}
                                  // isClearable
                                  options={salesAccLst}
                                  name="salesAccId"
                                  id="salesAccId"
                                  onChange={(v) => {
                                    setFieldValue("salesAccId", v);
                                  }}
                                  value={values.salesAccId}
                                />

                                <span className="text-danger errormsg">
                                  {errors.salesAccId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>Credit Note No</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Credit Note No. "
                                  name="credit_note_sr"
                                  id="credit_note_sr"
                                  readOnly
                                  onChange={handleChange}
                                  value={values.credit_note_sr}
                                />
                                <span className="text-danger errormsg">
                                  {errors.credit_note_sr}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Label>
                                  Party D/N No{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Party D/N No "
                                  name="invoice_no"
                                  id="invoice_no"
                                  onChange={handleChange}
                                  value={values.invoice_no}
                                  onKeyDown={(e) => {
                                    if (e.key === "Tab" && !e.target.value)
                                      e.preventDefault();
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.invoice_no}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4}>
                                <Form.Label>
                                  Party D/N Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={6} md={6} sm={6} xs={6}>
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  className="tnx-pur-inv-date-style"
                                  name="invoice_dt"
                                  id="invoice_dt"
                                  placeholder="DD/MM/YYYY"
                                  value={values.invoice_dt}
                                  onChange={handleChange}
                                  readOnly
                                />
                                <span className="text-danger errormsg">
                                  {errors.invoice_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>
                  <div class="outer-wrapper">
                    <div class="table-wrapper">
                      <div className="tnx-pur-inv-tbl-style">
                        <Table responsive bordered>
                          <thead
                            style={{
                              border: "1px solid #A8ADB3",
                            }}
                          >
                            <tr>
                              <th className="py-1 sr_no_width">Sr. No.</th>

                              <th className="particulars_width">Particulars</th>

                              {ABC_flag_value == "A" ||
                              ABC_flag_value == "AB" ||
                              ABC_flag_value == "ABC" ? (
                                <th
                                  className={`${
                                    ABC_flag_value == "A"
                                      ? "Level_A"
                                      : ABC_flag_value == "AB"
                                      ? "Level_AB"
                                      : ABC_flag_value == "ABC"
                                      ? "Level_ABC"
                                      : "Level_no"
                                  }`}
                                >
                                  {isUserControl(
                                    "is_level_a",
                                    this.props.userControl
                                  )
                                    ? levelA["label"]
                                    : ""}
                                </th>
                              ) : (
                                ""
                              )}

                              {ABC_flag_value == "AB" ||
                              ABC_flag_value == "ABC" ? (
                                <th
                                  className={`${
                                    ABC_flag_value == "AB"
                                      ? "Level_AB"
                                      : ABC_flag_value == "ABC"
                                      ? "Level_ABC"
                                      : "Level_no"
                                  }`}
                                >
                                  {isUserControl(
                                    "is_level_b",
                                    this.props.userControl
                                  )
                                    ? levelB["label"]
                                    : ""}
                                </th>
                              ) : (
                                ""
                              )}

                              {ABC_flag_value == "ABC" ? (
                                <th
                                  className={`${
                                    ABC_flag_value == "ABC"
                                      ? "Level_ABC"
                                      : "Level_no"
                                  }`}
                                >
                                  {isUserControl(
                                    "is_level_c",
                                    this.props.userControl
                                  )
                                    ? levelC["label"]
                                    : ""}
                                </th>
                              ) : (
                                ""
                              )}

                              <th className="py-1 unit_width">Unit</th>

                              <th className="batch_width">Batch No</th>

                              <th className="qty_width">Quantity</th>

                              {isFreeQtyExist(
                                "is_free_qty",
                                this.props.userControl
                              ) && <th className="free_width">Free</th>}

                              <th className="rate_width">Rate</th>

                              <th className="gross_width">Gross Amount</th>

                              <th className="py-1 dis1_width">
                                1-Dis.
                                <br />%
                              </th>

                              {isMultiDiscountExist(
                                "is_multi_discount",
                                this.props.userControl
                              ) && (
                                <th className="py-1 dis2_width">
                                  2-Dis.
                                  <br />%
                                </th>
                              )}
                              <th className="py-1 disR_width">
                                Disc.
                                <br />₹
                              </th>

                              <th className="py-1 tax_width">
                                Tax
                                <br />%
                              </th>

                              <th className="netAmt_width">Net Amount</th>

                              <th className="add_del_btn_width"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows &&
                              rows.length > 0 &&
                              rows.map((vi, ri) => {
                                return (
                                  <tr
                                    style={{
                                      borderbottom: "1px solid #D9D9D9",
                                    }}
                                    onMouseOver={(e) => {
                                      if (rows[ri]["productId"] !== "") {
                                        this.transaction_product_Hover_detailsFun(
                                          vi.productId
                                        );
                                      }
                                    }}
                                  >
                                    <td className="sr-no-style">
                                      {parseInt(ri) + 1}
                                    </td>
                                    <td
                                      onMouseOver={(e) => {
                                        e.preventDefault();
                                        if (rows[ri]["productId"] !== "") {
                                          this.get_sales_return_supplierlist_by_productidFun(
                                            vi.productId
                                          );
                                        }
                                      }}
                                    >
                                      <Form.Control
                                        type="button"
                                        id={`productName-${ri}`}
                                        name={`productName-${ri}`}
                                        className="tnx-pur-inv-prod-style text-start"
                                        placeholder=""
                                        styles={particularsDD}
                                        colors="#729"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.SelectProductModalFun(true, ri);
                                        }}
                                        value={rows[ri]["productName"]}
                                        readOnly
                                      />
                                    </td>

                                    {ABC_flag_value == "A" ||
                                    ABC_flag_value == "AB" ||
                                    ABC_flag_value == "ABC" ? (
                                      <td>
                                        <Select
                                          isDisabled={
                                            rows[ri]["is_level_a"] === true
                                              ? false
                                              : true
                                          }
                                          id={`levelaId-${ri}`}
                                          name={`levelaId-${ri}`}
                                          className="prd-dd-style "
                                          menuPlacement="auto"
                                          components={{
                                            // DropdownIndicator: () => null,
                                            IndicatorSeparator: () => null,
                                          }}
                                          placeholder=""
                                          styles={flavourDD}
                                          options={this.getLevelsOpt(
                                            "levelAOpt",
                                            ri,
                                            "prod_id"
                                          )}
                                          colors="#729"
                                          onChange={(
                                            value,
                                            triggeredAction
                                          ) => {
                                            rows[ri]["levelaId"] = value;
                                            // this.getLevelbOpt(
                                            //   ri,
                                            //   rows[ri]["productId"],
                                            //   value
                                            // );
                                          }}
                                          value={rows[ri]["levelaId"]}
                                        />
                                      </td>
                                    ) : (
                                      ""
                                    )}

                                    {ABC_flag_value == "AB" ||
                                    ABC_flag_value == "ABC" ? (
                                      <td>
                                        <Select
                                          isDisabled={
                                            rows[ri]["is_level_b"] === true
                                              ? false
                                              : true
                                          }
                                          id={`levelbId-${ri}`}
                                          name={`levelbId-${ri}`}
                                          className="prd-dd-style "
                                          menuPlacement="auto"
                                          components={{
                                            // DropdownIndicator: () => null,
                                            IndicatorSeparator: () => null,
                                          }}
                                          placeholder=""
                                          styles={flavourDD}
                                          options={this.getLevelsOpt(
                                            "levelBOpt",
                                            ri,
                                            "levelaId"
                                          )}
                                          colors="#729"
                                          onChange={(
                                            value,
                                            triggeredAction
                                          ) => {
                                            rows[ri]["levelbId"] = value;
                                            // this.getLevelcOpt(
                                            //   ri,
                                            //   rows[ri]["productId"],
                                            //   rows[ri]["levelaId"],
                                            //   value
                                            // );
                                          }}
                                          value={rows[ri]["levelbId"]}
                                        />
                                      </td>
                                    ) : (
                                      ""
                                    )}
                                    {ABC_flag_value == "ABC" ? (
                                      <td>
                                        <Select
                                          isDisabled={
                                            rows[ri]["is_level_c"] === true
                                              ? false
                                              : true
                                          }
                                          id={`levelbId-${ri}`}
                                          name={`levelbId-${ri}`}
                                          className="prd-dd-style "
                                          menuPlacement="auto"
                                          components={{
                                            IndicatorSeparator: () => null,
                                          }}
                                          placeholder=""
                                          styles={flavourDD}
                                          options={this.getLevelsOpt(
                                            "levelCOpt",
                                            ri,
                                            "levelbId"
                                          )}
                                          colors="#729"
                                          onChange={(
                                            value,
                                            triggeredAction
                                          ) => {
                                            rows[ri]["levelcId"] = value;
                                          }}
                                          value={rows[ri]["levelcId"]}
                                        />
                                      </td>
                                    ) : (
                                      ""
                                    )}

                                    <td>
                                      <Select
                                        id={`unitId-${ri}`}
                                        name={`unitId-${ri}`}
                                        className="prd-dd-style "
                                        menuPlacement="auto"
                                        components={{
                                          // DropdownIndicator: () => null,
                                          IndicatorSeparator: () => null,
                                        }}
                                        placeholder=""
                                        styles={unitDD}
                                        options={this.getLevelsOpt(
                                          "unitOpt",
                                          ri,
                                          "levelcId"
                                        )}
                                        onChange={(value, triggeredAction) => {
                                          // rows[ri]["unit_id"] = value;
                                          console.log("unitId", { value });
                                          this.handleUnitChange(
                                            "unitId",
                                            value,
                                            ri
                                          );
                                        }}
                                        value={rows[ri]["unitId"]}
                                      />
                                    </td>
                                    <td>
                                      <Form.Control
                                        id={`batchNo-${ri}`}
                                        name={`batchNo-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder=""
                                        onInput={(e) => {
                                          e.preventDefault();
                                          this.getProductBatchList(ri);
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.getProductBatchList(ri);
                                        }}
                                        value={rows[ri]["b_no"]}
                                        readOnly
                                        disabled={
                                          rows[ri]["is_batch"] === false
                                            ? true
                                            : false
                                        }
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        id={`qty-${ri}`}
                                        name={`qty-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder="0"
                                        onChange={(e) => {
                                          // rows[ri]["qty"] = e.target.value;
                                          this.handleNumChange(
                                            "qty",
                                            e.target.value,
                                            ri
                                          );
                                        }}
                                        value={rows[ri]["qty"]}
                                      />
                                    </td>

                                    {isFreeQtyExist(
                                      "is_free_qty",
                                      this.props.userControl
                                    ) && (
                                      <td>
                                        <Form.Control
                                          id={`freeQty-${ri}`}
                                          name={`freeQty-${ri}`}
                                          className="table-text-box border-0"
                                          type="text"
                                          placeholder="0"
                                          onChange={(e) => {
                                            this.handleNumChange(
                                              "free_qty",
                                              e.target.value,
                                              ri
                                            );
                                          }}
                                          onBlur={(e) => {
                                            if (
                                              parseInt(rows[ri]["qty"]) <
                                                parseInt(
                                                  rows[ri]["free_qty"]
                                                ) ===
                                              true
                                            ) {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Free Qty should be less than Qty",
                                              });
                                              this.handleNumChange(
                                                "free_qty",
                                                0,
                                                ri
                                              );
                                            }
                                          }}
                                          value={rows[ri]["free_qty"]}
                                        />
                                      </td>
                                    )}
                                    <td>
                                      <Form.Control
                                        id={`rate-${ri}`}
                                        name={`rate-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder="0"
                                        onChange={(e) => {
                                          this.handleNumChange(
                                            "rate",
                                            e.target.value,
                                            ri
                                          );
                                        }}
                                        value={rows[ri]["rate"]}
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        id={`grossAmt-${ri}`}
                                        name={`grossAmt-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder="0"
                                        // value={rows[ri]["total_base_amt"]}
                                        // value={this.getFloatUnitElement(
                                        //   "base_amt",
                                        //   ri
                                        // )}
                                        readOnly
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        id={`dis1Per-${ri}`}
                                        name={`dis1Per-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder="100.00"
                                        onChange={(e) => {
                                          this.handleNumChange(
                                            "dis_per",
                                            e.target.value,
                                            ri
                                          );
                                        }}
                                        value={rows[ri]["dis_per"]}
                                      />
                                    </td>

                                    {isMultiDiscountExist(
                                      "is_multi_discount",
                                      this.props.userControl
                                    ) && (
                                      <td>
                                        <Form.Control
                                          id={`dis2Per-${ri}`}
                                          name={`dis2Per-${ri}`}
                                          className="table-text-box border-0"
                                          type="text"
                                          placeholder="0"
                                          onChange={(e) => {
                                            this.handleNumChange(
                                              "dis_per2",
                                              e.target.value,
                                              ri
                                            );
                                          }}
                                          value={rows[ri]["dis_per2"]}
                                        />
                                      </td>
                                    )}
                                    <td>
                                      <Form.Control
                                        id={`disAmt-${ri}`}
                                        name={`disAmt-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder="0"
                                        onChange={(e) => {
                                          this.handleNumChange(
                                            "dis_amt",
                                            e.target.value,
                                            ri
                                          );
                                        }}
                                        value={rows[ri]["dis_amt"]}
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        id={`tax-${ri}`}
                                        name={`tax-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder="0"
                                        value={rows[ri]["gst"]}
                                        readOnly
                                      />
                                    </td>

                                    <td style={{ backgroundColor: "#D2F6E9" }}>
                                      <Form.Control
                                        id={`netAmt-${ri}`}
                                        name={`netAmt-${ri}`}
                                        className="table-text-box border-0"
                                        type="text"
                                        placeholder="0"
                                        value={this.getFloatUnitElement(
                                          "final_amt",
                                          ri
                                        )}
                                        readOnly
                                      />
                                    </td>

                                    {rows.length > 1 && (
                                      <td>
                                        <img
                                          isDisabled={
                                            rows.length === 0 ? true : false
                                          }
                                          src={TableDelete}
                                          alt=""
                                          onClick={(e) => {
                                            e.preventDefault();
                                            this.handleRemoveRow(ri);
                                          }}
                                          className="btnimg"
                                        />
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={3} md={3}>
                      <Row>
                        <Col lg={6}>
                          <span className="span-lable">HSN:</span>
                          <span className="span-value">
                            {product_hover_details.hsn}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6}>
                          <span className="span-lable">Tax Type:</span>
                          <span className="span-value">
                            {product_hover_details.tax_type}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3} md={3}>
                      <Row>
                        <Col lg={6}>
                          <span className="span-lable">Batch Expiry:</span>
                          <span className="span-value">
                            {product_hover_details.batch_expiry}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6}>
                          <span className="span-lable">M.R.P.:</span>
                          <span className="span-value">
                            {product_hover_details.mrp}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3} md={3}>
                      <Row>
                        <Col lg={6}>
                          <span className="span-lable">Profit:</span>
                          <span className="span-value">-</span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6}>
                          <span className="span-lable">Barcode:</span>
                          <span className="span-value">
                            {product_hover_details.barcode}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Package:</span>
                          <span className="span-value">
                            {product_hover_details.packing}
                          </span>
                        </Col>
                        {/* <Col lg={6} className="my-auto">
                          <span className="span-lable">Tax Type:</span>
                          <span className="span-value">{product_hover_details.tax_type}</span>
                          <span className="custom_hr_style">|</span>
                        </Col> */}
                      </Row>
                    </Col>
                    {/* <Col lg={{ span: 1, offset: 2 }}>
                      <span className="span-lable">Gross Total</span>
                    </Col>
                    <Col lg={1}>
                      <span className="span-value">
                        {parseFloat(values.totalamt).toFixed(2)}
                      </span>
                    </Col> */}
                  </Row>

                  <Row className="mx-0 btm-data">
                    <Col lg={8} md={8} sm={8} xs={8}>
                      <Row className="mt-2 pb-2">
                        <Col lg={1} md={1} sm={1} xs={1} className="my-auto">
                          <Form.Label>Narration</Form.Label>
                        </Col>
                        <Col lg={11} md={11} sm={11} xs={11} className="ps-5">
                          <Form.Control
                            type="text"
                            placeholder="Enter Narration"
                            className="tnx-pur-inv-text-box"
                            id="narration"
                            onChange={handleChange}
                            name="narration"
                            value={values.narration}
                          />
                        </Col>
                      </Row>
                      <div className="tnx-pur-inv-info-table">
                        <Table>
                          <thead>
                            <tr>
                              <th>Supplier Name</th>
                              <th>Inv No</th>
                              <th>Inv Date</th>
                              <th>Batch</th>
                              <th>MRP</th>
                              <th>Qty</th>
                              <th>Rate</th>
                              <th>Cost</th>
                              <th>Dis. %</th>
                              <th>Dis. ₹</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product_supplier_lst.length > 0 ? (
                              product_supplier_lst.map((v, i) => {
                                return (
                                  <tr>
                                    <td>{v.supplier_name}</td>
                                    <td>{v.invoice_no}</td>
                                    <td>
                                      {moment(v.invoice_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>
                                    <td>{v.batch}</td>
                                    <td>{v.mrp}</td>
                                    <td>{v.quantity}</td>
                                    <td>{v.rate}</td>
                                    <td>{v.cost}</td>
                                    <td>{v.dis_per}</td>
                                    <td>{v.dis_amt}</td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={8} className="text-center">
                                  No Data Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={2}
                      xs={2}
                      className="pe-1"
                      style={{ borderLeft: "1px solid #D9D9D9" }}
                    >
                      <Row>
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="my-auto ps-1"
                        >
                          <Form.Label>Dis.%</Form.Label>
                        </Col>
                        <Col
                          lg={3}
                          md={3}
                          sm={3}
                          xs={3}
                          className="mt-2 for_padding"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Dis."
                            className="tnx-pur-inv-text-box px-1"
                            id="sales_discount"
                            name="sales_discount"
                            onChange={(e) => {
                              setFieldValue("sales_discount", e.target.value);

                              let ledger_disc_amt = calculatePercentage(
                                values.total_row_gross_amt1,
                                parseFloat(e.target.value)
                              );
                              if (isNaN(ledger_disc_amt) === true)
                                ledger_disc_amt = "";
                              setFieldValue(
                                "sales_discount_amt",
                                ledger_disc_amt !== ""
                                  ? parseFloat(ledger_disc_amt).toFixed(2)
                                  : ""
                              );

                              setTimeout(() => {
                                this.handleTranxCalculation();
                              }, 100);
                            }}
                            value={values.sales_discount}
                          />
                        </Col>
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="my-auto p-0"
                        >
                          <Form.Label>Dis.₹</Form.Label>
                        </Col>
                        <Col lg={5} md={5} sm={5} xs={5} className="mt-2">
                          <Form.Control
                            type="text"
                            placeholder="Dis."
                            className="tnx-pur-inv-text-box"
                            id="sales_discount_amt"
                            name="sales_discount_amt"
                            onChange={(e) => {
                              setFieldValue(
                                "sales_discount_amt",
                                e.target.value
                              );

                              let ledger_disc_per =
                                (parseFloat(e.target.value) * 100) /
                                parseFloat(values.total_row_gross_amt1);
                              if (isNaN(ledger_disc_per) === true)
                                ledger_disc_per = "";
                              setFieldValue(
                                "sales_discount",
                                ledger_disc_per !== ""
                                  ? parseFloat(ledger_disc_per).toFixed(2)
                                  : ""
                              );

                              setTimeout(() => {
                                this.handleTranxCalculation();
                              }, 100);
                            }}
                            value={values.sales_discount_amt}
                          />
                        </Col>
                      </Row>

                      <TGSTFooter
                        values={values}
                        taxcal={taxcal}
                        authenticationService={authenticationService}
                      />
                      {/* <hr /> */}
                      <Row>
                        <Col lg={5} className="for_remove_padding">
                          <span className="tnx-pur-inv-span-text">
                            Total Qty:{" "}
                          </span>
                          <span className="errormsg">{values.total_qty}</span>
                        </Col>
                        <Row className="tMS">
                          {/* <Col lg={1}>
                            <p style={{ color: "#B6762B" }}>|</p>
                          </Col> */}
                          <Col lg={6} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):{" "}
                            </span>
                            <span className="errormsg">
                              {parseFloat(values.roundoff).toFixed(2)}
                            </span>
                          </Col>
                        </Row>
                        <Row className="tMS">
                          <Col lg={6} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              Free Qty:{" "}
                            </span>
                            <span className="errormsg">
                              {isNaN(values.total_free_qty) === true
                                ? 0
                                : values.total_free_qty}
                            </span>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2} className="px-0">
                      {showLedgerDiv === true ? (
                        <div
                          className={`small-tbl   ${
                            selectedLedgerNo === 1
                              ? "addLedger1"
                              : selectedLedgerNo === 2
                              ? "addLedger2"
                              : "addLedger3"
                          }`}
                        >
                          <Table hover style={{ position: "sticky" }}>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Unique Code</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lstAdditionalLedger.map((v, i) => {
                                return (
                                  <tr
                                    onClick={(e) => {
                                      e.preventDefault();
                                      console.log(
                                        "v ",
                                        v,
                                        addchgElement1,
                                        addchgElement2,
                                        this.myRef.current
                                      );
                                      if (this.myRef.current != null) {
                                        this.myRef.current.setFieldValue(
                                          addchgElement1,
                                          v.name
                                        );
                                        this.myRef.current.setFieldValue(
                                          addchgElement2,
                                          v.id
                                        );
                                        this.addLedgerModalFun();
                                      }
                                    }}
                                    style={{
                                      background:
                                        v.id === values[addchgElement2]
                                          ? "#f8f4d3"
                                          : "",
                                    }}
                                  >
                                    <td>{v.name}</td>
                                    <td>{v.unique_code}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                      ) : (
                        ""
                      )}

                      <Table className="tnx-pur-inv-btm-amt-tbl">
                        <tbody>
                          <tr>
                            <td className="py-1" style={{ cursor: "pointer" }}>
                              <Form.Control
                                placeholder="Ledger 1"
                                className="tnx-pur-inv-text-box mt-1"
                                name="additionalChgLedgerName1"
                                id="additionalChgLedgerName1"
                                onChange={(v) => {
                                  setFieldValue(
                                    "additionalChgLedgerName1",
                                    v.target.value
                                  );
                                  setFieldValue("additionalChgLedger1", "");
                                  this.searchLedger(v.target.value);
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.setState(
                                      { selectedLedgerNo: 1 },
                                      () => {
                                        this.addLedgerModalFun(
                                          true,
                                          "additionalChgLedgerName1",
                                          "additionalChgLedger1"
                                        );
                                      }
                                    );
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerName1}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.addLedgerModalFun();
                                  }, 200);
                                }}
                              />
                            </td>
                            <td className="py-1 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1"
                                id="additionalChgLedgerAmt1"
                                name="additionalChgLedgerAmt1"
                                onChange={(e) => {
                                  setFieldValue(
                                    "additionalChgLedgerAmt1",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerAmt1}
                                readOnly={
                                  parseInt(values.additionalChgLedger1) > 0
                                    ? false
                                    : true
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <Form.Control
                                placeholder="Ledger 2"
                                className="tnx-pur-inv-text-box mt-1"
                                name="additionalChgLedgerName2"
                                id="additionalChgLedgerName2"
                                onChange={(v) => {
                                  setFieldValue(
                                    "additionalChgLedgerName2",
                                    v.target.value
                                  );
                                  setFieldValue("additionalChgLedger2", "");
                                  this.searchLedger(v.target.value);
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.setState(
                                      { selectedLedgerNo: 2 },
                                      () => {
                                        this.addLedgerModalFun(
                                          true,
                                          "additionalChgLedgerName2",
                                          "additionalChgLedger2"
                                        );
                                      }
                                    );
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerName2}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.addLedgerModalFun();
                                  }, 200);
                                }}
                              />
                            </td>
                            <td className="py-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1"
                                id="additionalChgLedgerAmt2"
                                name="additionalChgLedgerAmt2"
                                onChange={(e) => {
                                  setFieldValue(
                                    "additionalChgLedgerAmt2",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerAmt2}
                                readOnly={
                                  parseInt(values.additionalChgLedger2) > 0
                                    ? false
                                    : true
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Gross Total</td>
                            <td className="p-0 text-end">
                              {parseFloat(values.total_base_amt).toFixed(2)}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Discount</td>
                            <td className="p-0 text-end">
                              {parseFloat(values.total_invoice_dis_amt).toFixed(
                                2
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Total</td>
                            <td className="p-0 text-end">
                              {parseFloat(values.total_taxable_amt).toFixed(2)}
                              {/* 99999.99 */}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Tax</td>
                            <td className="p-0 text-end">
                              {parseFloat(values.total_tax_amt).toFixed(2)}
                              {/* 9999.99 */}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <Form.Control
                                placeholder="Ledger 3"
                                className="tnx-pur-inv-text-box mt-1 mb-1"
                                name="additionalChgLedgerName3"
                                id="additionalChgLedgerName3"
                                onChange={(v) => {
                                  setFieldValue(
                                    "additionalChgLedgerName3",
                                    v.target.value
                                  );
                                  setFieldValue("additionalChgLedger3", "");
                                  this.searchLedger(v.target.value);
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.setState(
                                      { selectedLedgerNo: 3 },
                                      () => {
                                        this.addLedgerModalFun(
                                          true,
                                          "additionalChgLedgerName3",
                                          "additionalChgLedger3"
                                        );
                                      }
                                    );
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerName3}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  setTimeout(() => {
                                    this.addLedgerModalFun();
                                  }, 200);
                                }}
                              />
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
                                className="tnx-pur-inv-text-box mt-1 mb-1"
                                id="additionalChgLedgerAmt3"
                                name="additionalChgLedgerAmt3"
                                onChange={(e) => {
                                  setFieldValue(
                                    "additionalChgLedgerAmt3",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={values.additionalChgLedgerAmt3}
                                readOnly={
                                  parseInt(values.additionalChgLedger3) > 0
                                    ? false
                                    : true
                                }
                              />
                            </td>
                          </tr>

                          <tr>
                            <th>Bill Amount</th>
                            <th className="text-end">
                              {parseFloat(values.bill_amount).toFixed(2)}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="btm-row-size">
                        <Button className="successbtn-style" type="submit">
                          Submit
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
                                  eventBus.dispatch(
                                    "page_change",
                                    "tranx_credit_note_list"
                                  );
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
                      </p>
                    </Col>
                  </Row>

                  <Row className="mx-0 btm-rows-btn1">
                    <Col md="2" className="px-0">
                      <Form.Label className="btm-label">
                        <img
                          src={keyboard}
                          className="svg-style mt-0 mx-2"
                        ></img>
                        New entry: <span className="shortkey">Ctrl + N</span>
                      </Form.Label>
                    </Col>
                    <Col md="8">
                      <Form.Label className="btm-label">
                        Duplicate: <span className="shortkey">Ctrl + D</span>
                      </Form.Label>
                    </Col>
                    {/* <Col md="8"></Col> */}
                    <Col md="2" className="text-end">
                      <img src={question} className="svg-style ms-1"></img>
                    </Col>
                  </Row>
                </>
              </Form>
            )}
          </Formik>

          {/* serial no start */}
          <Modal
            show={serialnopopupwindow}
            size="sm"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ serialnopopupwindow: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Serial No.
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <div className="purchasescreen">
                <Form className="serailnoscreoolbar">
                  <Table className="serialnotbl">
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Serial No.</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderSerialNo()}</tbody>
                  </Table>
                </Form>
              </div>
            </Modal.Body>

            <Modal.Footer className="p-1">
              <Button
                className="createbtn seriailnobtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleSerialNoSubmit();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* additional charges */}

          {/* Adjustment and pending bill modal start*/}

          <Modal
            show={adjusmentbillmodal}
            //size="lg"
            className="brandnewmodal mt-5 mainmodal"
            onHide={() => this.setState({ adjusmentbillmodal: false })}
            aria-labelledby="contained-modal-title-vcenter"
            //centere
          >
            <Modal.Header
              // closeButton
              className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                settlement Bills
              </Modal.Title>
              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.handeladjusmentbillmodal(false)}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>

            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              innerRef={this.AdjustBillRef}
              initialValues={{
                newReference: "",
                credit: "",
                refund: "",
                cr: "",
                outstanding:
                  this.myRef.current && this.myRef.current.values.bill_amount,
                outstanding1:
                  this.myRef.current && this.myRef.current.values.bill_amount,
                initVal,
                transaction_dt: moment().format("YYYY-MM-DD"),
              }}
              validationSchema={Yup.object().shape({
                newReference: Yup.string().required("Select Option"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("values", values);
                let invoiceValues = this.myRef.current.values;
                console.log("Invoice----", this.myRef.current.values);
                console.log("invoice_data----", invoice_data);
                let requestData = new FormData();
                requestData.append("type", values.newReference);
                if (values.newReference !== "credit") {
                  requestData.append("value", values.paidAmount);
                } else {
                  requestData.append("value", values.outstanding);
                }

                console.log("salesReturnData", salesReturnData);

                if (salesReturnData.returnData.source == "sales_invoice") {
                  requestData.append(
                    "source",
                    salesReturnData.returnData.source
                  );
                  requestData.append(
                    "sales_invoice_id",
                    salesReturnData.returnData.id
                  );
                } else if (
                  salesReturnData.returnData.source == "sales_challan"
                ) {
                  requestData.append(
                    "source",
                    salesReturnData.returnData.source
                  );
                  requestData.append(
                    "sales_challan_id",
                    salesReturnData.returnData.id
                  );
                }
                console.log("Invoice Values:", invoiceValues);
                // !Invoice Data
                requestData.append(
                  "sales_return_sr_no",
                  invoiceValues.credit_note_sr
                );
                requestData.append("return_invoice_id", invoice_data.id);
                requestData.append(
                  "sales_acc_id",
                  invoiceValues.salesAccId.value
                );

                requestData.append(
                  "sales_return_no",
                  invoiceValues.sales_return_invoice
                );

                requestData.append(
                  "transaction_dt",
                  moment(invoiceValues.transaction_dt, "DD/MM/YYYY").format(
                    "YYYY-MM-DD"
                  )
                );
                requestData.append(
                  "debtors_id",
                  invoiceValues.clientCodeId.value
                );
                // !Invoice Data

                let returnValues = this.myRef.current.values;
                console.log("returnValues ", returnValues);
                requestData.append("roundoff", returnValues.roundoff);
                if (returnValues.narration && returnValues.narration != "") {
                  requestData.append("narration", returnValues.narration);
                }

                requestData.append(
                  "total_base_amt",
                  returnValues.total_base_amt
                );
                requestData.append("totalamt", returnValues.totalamt);
                requestData.append(
                  "taxable_amount",
                  returnValues.total_taxable_amt
                );
                let totalcgst = this.state.taxcal.cgst.reduce(
                  (n, p) => n + parseFloat(p.amt),
                  0
                );
                let totalsgst = this.state.taxcal.sgst.reduce(
                  (n, p) => n + parseFloat(p.amt),
                  0
                );
                let totaligst = this.state.taxcal.igst.reduce(
                  (n, p) => n + parseFloat(p.amt),
                  0
                );
                requestData.append("totalcgst", totalcgst);
                requestData.append("totalsgst", totalsgst);
                requestData.append("totaligst", totaligst);
                requestData.append("totalqty", 0);

                requestData.append("gstNo", invoiceValues.gstNo);
                requestData.append("tcs", 0);
                requestData.append(
                  "sales_discount",
                  returnValues.sales_discount
                );
                requestData.append(
                  "sales_discount_amt",
                  invoiceValues.sales_discount_amt &&
                    invoiceValues.sales_discount_amt != ""
                    ? invoiceValues.sales_discount_amt
                    : 0
                );

                requestData.append(
                  "total_sales_discount_amt",
                  invoiceValues.total_purhchase_discount_amt &&
                    invoiceValues.total_purhchase_discount_amt != ""
                    ? invoiceValues.total_purhchase_discount_amt
                    : 0
                );

                let frow = [];
                rows.map((v, i) => {
                  if (v.productId != "") {
                    let newObj = {
                      details_id: v.details_id != "" ? v.details_id : 0,
                      productId: v.productId ? v.productId : "",
                      levelaId: v.levelaId ? v.levelaId.value : "",
                      levelbId: v.levelbId ? v.levelbId.value : "",
                      levelcId: v.levelcId ? v.levelcId.value : "",
                      unitId: v.unitId ? v.unitId.value : "",
                      qty: v.qty ? v.qty : "",
                      free_qty: v.free_qty != "" ? v.free_qty : 0,
                      unit_conv: v.unitId ? v.unitId.unitConversion : "",
                      rate: v.rate,
                      dis_amt: v.dis_amt != "" ? v.dis_amt : 0,
                      dis_per: v.dis_per != "" ? v.dis_per : 0,
                      dis_per2: v.dis_per2 != "" ? v.dis_per2 : 0,
                      row_dis_amt: v.row_dis_amt != "" ? v.row_dis_amt : 0,
                      gross_amt: v.gross_amt != "" ? v.gross_amt : 0,
                      add_chg_amt: v.add_chg_amt != "" ? v.add_chg_amt : 0,
                      gross_amt1: v.gross_amt1 != "" ? v.gross_amt1 : 0,
                      invoice_dis_amt:
                        v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0,
                      dis_per_cal: v.dis_per_cal != "" ? v.dis_per_cal : 0,
                      dis_amt_cal: v.dis_amt_cal != "" ? v.dis_amt_cal : 0,
                      total_amt: v.total_amt != "" ? v.total_amt : 0,
                      igst: v.igst != "" ? v.igst : 0,
                      sgst: v.sgst != "" ? v.sgst : 0,
                      cgst: v.cgst != "" ? v.cgst : 0,
                      total_igst: v.total_igst != "" ? v.total_igst : 0,
                      total_sgst: v.total_sgst != "" ? v.total_sgst : 0,
                      total_cgst: v.total_cgst != "" ? v.total_cgst : 0,
                      final_amt: v.final_amt != "" ? v.final_amt : 0,
                      is_batch: v.is_batch,
                      b_details_id: v.b_details_id != "" ? v.b_details_id : 0,
                      b_no: v.b_no != "" ? v.b_no : 0,
                      b_rate: v.b_rate != "" ? v.b_rate : 0,
                      b_purchase_rate:
                        v.b_purchase_rate != "" ? v.b_purchase_rate : 0,
                      b_expiry: v.b_expiry
                        ? moment(v.b_expiry).format("yyyy-MM-DD")
                        : "",
                      sales_rate: v.sales_rate != "" ? v.sales_rate : 0,
                      rate_a: v.rate_a,
                      rate_b: v.rate_b,
                      rate_c: v.rate_c,
                      min_margin: v.min_margin,
                      margin_per: v.margin_per,
                      manufacturing_date: v.manufacturing_date
                        ? moment(v.manufacturing_date).format("yyyy-MM-DD")
                        : "",
                      isBatchNo: v.b_no,

                      reference_type: v.reference_type,
                      reference_id: v.reference_id != "" ? v.reference_id : 0,
                    };
                    console.log("newObj >>>> ", newObj);
                    frow.push(newObj);
                    console.log("frow ----------- ", frow);
                  }
                });
                var filtered = frow.filter(function (el) {
                  return el != null;
                });

                requestData.append(
                  "additionalChargesTotal",
                  additionalChargesTotal
                );
                requestData.append("row", JSON.stringify(filtered));

                if (
                  invoiceValues.additionalChgLedger1 !== "" &&
                  invoiceValues.additionalChgLedgerAmt1 !== ""
                ) {
                  requestData.append(
                    "additionalChgLedger1",
                    invoiceValues.additionalChgLedger1 !== ""
                      ? invoiceValues.additionalChgLedger1
                      : ""
                  );
                  requestData.append(
                    "addChgLedgerAmt1",
                    invoiceValues.additionalChgLedgerAmt1 !== ""
                      ? invoiceValues.additionalChgLedgerAmt1
                      : 0
                  );
                }
                if (
                  invoiceValues.additionalChgLedger2 !== "" &&
                  invoiceValues.additionalChgLedgerAmt2 !== ""
                ) {
                  requestData.append(
                    "additionalChgLedger2",
                    invoiceValues.additionalChgLedger2 !== ""
                      ? invoiceValues.additionalChgLedger2
                      : ""
                  );
                  requestData.append(
                    "addChgLedgerAmt2",
                    invoiceValues.additionalChgLedgerAmt2 !== ""
                      ? invoiceValues.additionalChgLedgerAmt2
                      : 0
                  );
                }
                if (
                  invoiceValues.additionalChgLedger3 !== "" &&
                  invoiceValues.additionalChgLedgerAmt3 !== ""
                ) {
                  requestData.append(
                    "additionalChgLedger3",
                    invoiceValues.additionalChgLedger3 !== ""
                      ? invoiceValues.additionalChgLedger3
                      : ""
                  );
                  requestData.append(
                    "addChgLedgerAmt3",
                    invoiceValues.additionalChgLedgerAmt3 !== ""
                      ? invoiceValues.additionalChgLedgerAmt3
                      : 0
                  );
                }

                if (
                  authenticationService.currentUserValue.state &&
                  invoice_data &&
                  invoice_data.clientCodeId &&
                  invoice_data.clientCodeId.state !=
                    authenticationService.currentUserValue.state
                ) {
                  let taxCal = {
                    igst: this.state.taxcal.igst,
                  };

                  requestData.append("taxFlag", false);
                  requestData.append("taxCalculation", JSON.stringify(taxCal));
                } else {
                  let taxCal = {
                    cgst: this.state.taxcal.cgst,
                    sgst: this.state.taxcal.sgst,
                  };
                  // console.log("taxCal", taxCal);
                  requestData.append("taxCalculation", JSON.stringify(taxCal));
                  requestData.append("taxFlag", true);
                }

                console.log({ rowDelDetailsIds });
                let filterRowDetail = [];
                if (rowDelDetailsIds.length > 0) {
                  filterRowDetail = rowDelDetailsIds.map((v) => {
                    return { del_id: v };
                  });
                }
                console.log("filterRowDetail", filterRowDetail);
                requestData.append(
                  "rowDelDetailsIds",
                  JSON.stringify(filterRowDetail)
                );

                if (invoiceValues.total_qty !== "") {
                  requestData.append(
                    "total_qty",
                    invoiceValues.total_qty !== ""
                      ? parseInt(invoiceValues.total_qty)
                      : 0
                  );
                }
                if (invoiceValues.total_free_qty !== "") {
                  requestData.append(
                    "total_free_qty",
                    invoiceValues.total_free_qty !== ""
                      ? invoiceValues.total_free_qty
                      : 0
                  );
                }

                // !Total Qty*Rate
                requestData.append(
                  "total_row_gross_amt",
                  invoiceValues.total_row_gross_amt
                );
                requestData.append(
                  "total_base_amt",
                  invoiceValues.total_base_amt
                );
                // !Discount
                requestData.append(
                  "total_invoice_dis_amt",
                  invoiceValues.total_invoice_dis_amt
                );
                // !Taxable Amount
                requestData.append(
                  "taxable_amount",
                  invoiceValues.total_taxable_amt
                );
                // !Taxable Amount
                requestData.append(
                  "total_tax_amt",
                  invoiceValues.total_tax_amt
                );
                // !Bill Amount
                requestData.append("bill_amount", invoiceValues.bill_amount);
                // List key/value pairs
                for (let [name, value] of requestData) {
                  console.log(`Formdata ${name} = ${value}`); // key1 = value1, then key2 = value2
                }

                console.log("submit call");
                createSalesReturn(requestData)
                  .then((response) => {
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
                        from: "tranx_credit_note_product_list",
                        to: "tranx_credit_note_list",
                        isNewTab: false,
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
                    console.log("error", error);
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
                <Form onSubmit={handleSubmit}>
                  <Modal.Body className="purchaseumodal p-invoice-modal ">
                    <div className="purchasescreen pb-2 pt-0 pl-2 pr-2">
                      <Row>
                        <Col md="3">
                          <Form.Group className="gender nightshiftlabel">
                            <Form.Label>
                              <input
                                name="newReference"
                                type="radio"
                                value="cash"
                                checked={
                                  values.newReference === "cash" ? true : false
                                }
                                onChange={handleChange}
                                className="mr-3"
                              />
                              <span className="ml-3">&nbsp;&nbsp;Cash</span>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group className="gender nightshiftlabel">
                            <Form.Label>
                              <input
                                name="newReference"
                                type="radio"
                                value="credit"
                                checked={
                                  values.newReference === "credit"
                                    ? true
                                    : false
                                }
                                onChange={handleChange}
                                className="mr-3"
                              />
                              <span className="ml-3">&nbsp;&nbsp;Credit</span>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group className="nightshiftlabel">
                            <Form.Label className="ml-3">
                              <input
                                name="newReference"
                                type="radio"
                                value="mobilePayment"
                                onChange={handleChange}
                                checked={
                                  values.newReference === "mobilePayment"
                                    ? true
                                    : false
                                }
                                className="mr-3"
                              />
                              <span className="ml-3">
                                &nbsp;&nbsp;Mobile Payment
                              </span>
                            </Form.Label>

                            <span className="text-danger">
                              {errors.newReference && "Select Option"}
                            </span>
                          </Form.Group>
                        </Col>

                        {values.newReference !== "" &&
                          values.newReference !== "credit" && (
                            <Row className="mt-4">
                              <Col lg={4} md={3}>
                                <Form.Group className="gender nightshiftlabel">
                                  <Form.Label>
                                    <Form.Control
                                      placeholder="Paid Amount"
                                      className="text-box"
                                      id="paidAmount"
                                      name="paidAmount"
                                      // onChange={handleChange}
                                      onChange={(e) => {
                                        e.preventDefault();

                                        let val = e.target.value;
                                        setFieldValue("paidAmount", val);
                                        if (
                                          parseFloat(val) >
                                          parseFloat(values.outstanding1)
                                        ) {
                                          setFieldValue("paidAmount", "");
                                          setFieldValue(
                                            "outstanding",
                                            values.outstanding1
                                          );
                                        } else if (
                                          parseFloat(val) > 0 &&
                                          parseFloat(val) <=
                                            parseFloat(values.outstanding1)
                                        ) {
                                          let res =
                                            parseFloat(values.outstanding1) -
                                            parseFloat(val);
                                          setFieldValue(
                                            "outstanding",
                                            parseFloat(res).toFixed(2)
                                          );
                                        } else {
                                          setFieldValue("paidAmount", "");
                                          setFieldValue(
                                            "outstanding",
                                            values.outstanding1
                                          );
                                        }
                                      }}
                                      value={values.paidAmount}
                                    />
                                    Paid Amount
                                  </Form.Label>
                                </Form.Group>
                              </Col>
                              <Col lg={4} md={3}>
                                <Form.Group className="gender nightshiftlabel">
                                  <Form.Label>
                                    <Form.Control
                                      placeholder="Paid Amount"
                                      className="text-box"
                                      id="outstanding"
                                      name="outstanding"
                                      onChange={handleChange}
                                      value={values.outstanding}
                                      readOnly
                                    />
                                    Outstanding
                                  </Form.Label>
                                </Form.Group>
                              </Col>
                            </Row>
                          )}

                        <Col md="12" className="btn_align">
                          <Button
                            className="successbtn-style ms-2"
                            type="submit"
                            style={{
                              borderRadius: "15px",
                              paddingLeft: "20px",
                              paddingRight: "20px",
                            }}
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>
          {/* Adjustment and pending bill modal  end */}

          {/* Bill List */}
          <Modal
            show={show}
            size="lg"
            className="brandnewmodal mt-5  mainmodal"
            onHide={() => this.setState({ show: false })}
            aria-labelledby="contained-modal-title-vcenter"
            animation={false}
          >
            <Modal.Header
              // closeButton
              // closeVariant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Credit Note
              </Modal.Title>
              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.setState({ show: false })}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2">
              <div className="purchasescreen">
                {invoiceLstSC.length > 0 && (
                  <Table hover size="sm" className="tbl-font">
                    <thead style={{ borderbottom: "2px solid transparent" }}>
                      <tr
                        className="text-left"
                        style={{ background: "#ebebeb" }}
                      >
                        {/* <th>Sr.</th> */}
                        <th>Bill No</th>
                        <th>Bill Date</th>
                        <th>Bill Amt</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody style={{ cursor: "pointer" }}>
                      {invoiceLstSC.map((v, i) => {
                        return (
                          <tr
                            onClick={(e) => {
                              e.preventDefault();
                              console.log("v", v);
                              this.handleRowClick(v);
                            }}
                          >
                            {/* <td>{i + 1}</td> */}
                            <td>{v.invoice_no}</td>

                            <td>
                              {moment(v.invoice_date).format("DD/MM/YYYY")}
                            </td>
                            <td>{v.total_amount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </div>
            </Modal.Body>
          </Modal>

          {/* Batch Modal  */}
          <Modal
            show={batchModalShow}
            size="xl"
            className=" mt-5 mainmodal"
            onHide={() => this.handlebatchModalShow(false)}
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header>
              <Modal.Title className="modalhead">Batch Number</Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.handlebatchModalShow(false)}
              />
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={batchInitVal}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({})}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let {
                  rows,
                  rowIndex,
                  brandIndex,
                  categoryIndex,
                  subcategoryIndex,
                  groupIndex,
                  packageIndex,
                  unitIndex,
                  b_details_id,
                  is_expired,
                } = this.state;

                console.warn(
                  "rahul::batch values, is_expired, b_details_id",
                  values,
                  is_expired,
                  b_details_id
                );
                if (is_expired != true) {
                  if (b_details_id != 0) {
                    let salesrate = b_details_id.min_rate_a;

                    if (
                      this.myRef.current.values &&
                      this.myRef.current.values.clientNameId &&
                      parseInt(
                        this.myRef.current.values.clientNameId.salesRate
                      ) == 2
                    ) {
                      salesrate = b_details_id.min_rate_b;
                    } else if (
                      this.myRef.current.values &&
                      this.myRef.current.values.clientNameId &&
                      parseInt(
                        this.myRef.current.values.clientNameId.salesRate
                      ) == 3
                    ) {
                      salesrate = b_details_id.min_rate_c;
                    }

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "rate"
                    ] = salesrate;

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_details_id"
                    ] = b_details_id.id;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_no"
                    ] = b_details_id.batch_no;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_rate"
                    ] = b_details_id.b_rate;

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_purchase_rate"
                    ] = b_details_id.purchase_rate;

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "rate_a"
                    ] = b_details_id.min_rate_a;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "rate_b"
                    ] = b_details_id.min_rate_b;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "rate_c"
                    ] = b_details_id.min_rate_c;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "max_discount"
                    ] = b_details_id.max_discount;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "min_discount"
                    ] = b_details_id.min_discount;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "min_margin"
                    ] = b_details_id.min_margin;

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_expiry"
                    ] =
                      b_details_id.expiry_date != ""
                        ? b_details_id.expiry_date
                        : "";

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "manufacturing_date"
                    ] =
                      b_details_id.manufacturing_date != ""
                        ? b_details_id.manufacturing_date
                        : "";

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "is_batch"
                    ] = isBatch;
                  } else {
                    let salesrate = values.rate_a;

                    if (
                      this.myRef.current.values &&
                      this.myRef.current.values.clientNameId &&
                      parseInt(
                        this.myRef.current.values.clientNameId.salesRate
                      ) == 2
                    ) {
                      salesrate = values.rate_b;
                    } else if (
                      this.myRef.current.values &&
                      this.myRef.current.values.clientNameId &&
                      parseInt(
                        this.myRef.current.values.clientNameId.salesRate
                      ) == 3
                    ) {
                      salesrate = values.rate_c;
                    }

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "rate"
                    ] = salesrate;

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_details_id"
                    ] = values.b_details_id;

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_no"
                    ] = values.b_no;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_rate"
                    ] = values.b_rate;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "rate_a"
                    ] = values.rate_a;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "rate_b"
                    ] = values.rate_b;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "rate_c"
                    ] = values.rate_c;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "max_discount"
                    ] = values.max_discount;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "min_discount"
                    ] = values.min_discount;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "min_margin"
                    ] = values.min_margin;
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_purchase_rate"
                    ] = values.b_purchase_rate;

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_expiry"
                    ] =
                      values.b_expiry != ""
                        ? moment(
                            new Date(
                              moment(values.b_expiry, "DD/MM/YYYY").toDate()
                            )
                          ).format("YYYY-MM-DD")
                        : "";

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "manufacturing_date"
                    ] =
                      values.manufacturing_date != ""
                        ? moment(
                            new Date(
                              moment(
                                values.manufacturing_date,
                                "DD/MM/YYYY"
                              ).toDate()
                            )
                          ).format("YYYY-MM-DD")
                        : "";

                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "is_batch"
                    ] = isBatch;
                  }
                  this.setState(
                    {
                      batchModalShow: false,
                      rowIndex: -1,
                      brandIndex: -1,
                      groupIndex: -1,
                      categoryIndex: -1,
                      subcategoryIndex: -1,
                      packageIndex: -1,
                      unitIndex: -1,
                      b_details_id: 0,
                      isBatch: isBatch,
                    },
                    () => {
                      this.handleRowStateChange(rows);
                    }
                  );
                } else {
                  MyNotifications.fire({
                    show: true,
                    icon: "error",
                    title: "Error",
                    msg: "Batch Expired",
                    is_button_show: true,
                  });
                }
                this.setState(
                  {
                    batchModalShow: false,
                    rowIndex: -1,
                    brandIndex: -1,
                    categoryIndex: -1,
                    subcategoryIndex: -1,
                    flavourIndex: -1,
                    packageIndex: -1,
                    unitIndex: -1,
                    b_details_id: 0,
                    isBatch: isBatch,
                  },
                  () => {
                    this.handleRowStateChange(rows);
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
                isSubmitting,
                resetForm,
              }) => (
                <Form className="" onSubmit={handleSubmit} autoComplete="off">
                  {/* {JSON.stringify(values)} */}
                  <Modal.Body className="p-0">
                    <div className="">
                      <div className="bgstyle">
                        <Row>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Batch No.
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="b_no"
                                  id="b_no"
                                  onChange={handleChange}
                                  value={values.b_no}
                                />
                              </Col>
                            </Form.Group>
                          </Col>

                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Manufacturing Date
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Label>
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.mfgDateRef.current = input;
                                    }}
                                    name="manufacturing_date"
                                    id="manufacturing_date"
                                    placeholder="DD/MM/YYYY"
                                    value={values.manufacturing_date}
                                    onChange={handleChange}
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
                                        if (
                                          moment(
                                            e.target.value,
                                            "DD-MM-YYYY"
                                          ).isValid() == true
                                        ) {
                                          setFieldValue(
                                            "manufacturing_date",
                                            e.target.value
                                          );
                                          // this.checkInvoiceDateIsBetweenFYFun(
                                          //   e.target.value
                                          // );
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Invalid date",
                                            is_button_show: true,
                                          });
                                          this.mfgDateRef.current.focus();
                                          setFieldValue(
                                            "manufacturing_date",
                                            ""
                                          );
                                        }
                                      } else {
                                        setFieldValue("manufacturing_date", "");
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.manufacturing_date}
                                  </span>
                                </Form.Label>
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Expiry Date
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Label>
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.batchdpRef.current = input;
                                    }}
                                    name="b_expiry"
                                    id="b_expiry"
                                    placeholder="DD/MM/YYYY"
                                    value={values.b_expiry}
                                    onChange={handleChange}
                                    onBlur={(e) => {
                                      console.log("e ", e);
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
                                          let mfgDate =
                                            values.manufacturing_date;
                                          if (
                                            mfgDate == "" &&
                                            mfgDate == null
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "First input manufacturing date",
                                              is_button_show: true,
                                            });
                                            this.mfgDateRef.current.focus();
                                            setFieldValue("b_expiry", "");
                                          } else {
                                            mfgDate = new Date(
                                              moment(
                                                values.manufacturing_date
                                              ).format("DD-MM-yyyy")
                                            );

                                            let expDate = new Date(
                                              moment(
                                                e.target.value,
                                                "DD/MM/YYYY"
                                              ).toDate()
                                            );
                                            console.log(
                                              "rahul:: mfgDate, expDate",
                                              mfgDate,
                                              expDate
                                            );
                                            console.warn(
                                              "rahul::compare",
                                              mfgDate < expDate
                                            );

                                            if (mfgDate < expDate) {
                                              setFieldValue(
                                                "b_expiry",
                                                e.target.value
                                              );
                                              // this.checkInvoiceDateIsBetweenFYFun(
                                              //   e.target.value
                                              // );
                                            } else {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Expiry date should be greater MFG date",
                                                is_button_show: true,
                                              });
                                              setFieldValue("b_expiry", "");
                                              this.batchdpRef.current.focus();
                                            }
                                          }
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Invalid date",
                                            is_button_show: true,
                                          });
                                          this.batchdpRef.current.focus();
                                          setFieldValue("b_expiry", "");
                                        }
                                      } else {
                                        setFieldValue("b_expiry", "");
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_expiry}
                                  </span>
                                </Form.Label>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                MRP
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="b_rate"
                                  id="b_rate"
                                  onChange={handleChange}
                                  value={values.b_rate}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Purchase Rate
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="b_purchase_rate"
                                  id="b_purchase_rate"
                                  onChange={handleChange}
                                  value={values.b_purchase_rate}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    this.validatePurchaseRate(
                                      values.b_rate,
                                      values.b_purchase_rate
                                    );
                                  }}

                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Sales Rate A
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_a"
                                  id="rate_a"
                                  onChange={handleChange}
                                  value={values.rate_a}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_a > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_a
                                      );
                                    }
                                  }}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Sales Rate B
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_b"
                                  id="rate_b"
                                  onChange={handleChange}
                                  value={values.rate_b}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_b > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_b
                                      );
                                    }
                                  }}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Sales Rate C
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_c"
                                  id="rate_c"
                                  onChange={handleChange}
                                  value={values.rate_c}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_c > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_c
                                      );
                                    }
                                  }}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Min Margin %
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="min_margin"
                                  id="min_margin"
                                  onChange={handleChange}
                                  value={values.min_margin}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Max Discount %
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="max_discount"
                                  id="max_discount"
                                  onChange={handleChange}
                                  value={values.max_discount}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.max_discount > 0) {
                                      this.validateMaxDiscount(
                                        values.max_discount,
                                        values.b_purchase_rate,
                                        values.rate_a,
                                        values.min_margin
                                      );
                                    }
                                  }}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Min Discount %
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="min_discount"
                                  id="min_discount"
                                  onChange={handleChange}
                                  value={values.min_discount}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </div>
                    <div>
                      {/* {JSON.stringify(batchData)} */}
                      {batchData && batchData.length > 0 && (
                        <>
                          <Table>
                            <thead className="modaltblhead">
                              <tr>
                                <th>Batch no</th>
                                <th>Rate A</th>
                                <th>Rate B</th>
                                <th>Rate C</th>
                                <th>Purchase Rate</th>
                                <th>Max Discount</th>
                                <th>Min Margin</th>
                                <th>MRP</th>
                                <th>Expiry Date</th>
                                <th>Manufacturing Date</th>
                              </tr>
                            </thead>

                            <tbody>
                              {batchData.map((v, i) => {
                                return (
                                  <tr
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({
                                        b_details_id: v,
                                        tr_id: i + 1,
                                        is_expired: v.is_expired,
                                      });
                                    }}
                                    className={`${
                                      is_expired != true
                                        ? tr_id == i + 1
                                          ? "tr-color"
                                          : ""
                                        : ""
                                      // v.is_expired == true ? "bg-danger" : ""
                                    }`}
                                  >
                                    {/* <td>{i + 1}</td> */}
                                    <td>{v.batch_no}</td>
                                    <td>{v.min_rate_a}</td>
                                    <td>{v.min_rate_b}</td>
                                    <td>{v.min_rate_c}</td>
                                    <td>{v.purchase_rate}</td>
                                    <td>{v.max_discount}</td>
                                    <td>{v.min_margin}</td>
                                    <td>{v.mrp}</td>
                                    <td
                                      className={`${
                                        v.is_expired == true
                                          ? "text-danger"
                                          : ""
                                      }`}
                                    >
                                      {v.expiry_date}
                                    </td>
                                    <td>{v.manufacturing_date}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </>
                      )}
                    </div>
                  </Modal.Body>
                  <div className="text-end p-2">
                    <Button className="successbtn-style me-2" type="submit">
                      Submit
                    </Button>

                    <Button
                      variant="secondary"
                      className="cancel-btn"
                      onClick={() => {
                        resetForm();
                        this.setState({
                          batchInitVal: {
                            b_no: 0,
                            b_rate: 0,
                            rate_a: 0,
                            rate_b: 0,
                            rate_c: 0,
                            max_discount: 0,
                            min_discount: 0,
                            min_margin: 0,
                            manufacturing_date: "",
                            b_purchase_rate: 0,
                            b_expiry: "",
                            b_details_id: 0,
                          },
                        });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>

          {/* ledgr Modal */}
          <Modal
            show={ledgerModal}
            size={
              window.matchMedia("(min-width:1360px) and (max-width:1919px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="tnx-pur-inv-mdl-product"
            centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
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

            <Modal.Body className="tnx-pur-inv-mdl-body p-0">
              <Row className="p-3">
                <Col lg={6}>
                  <InputGroup className="mb-2  mdl-text">
                    <Form.Control
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.transaction_ledger_listFun(e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
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
                          "ledger",
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
                          from_page: "tranx_credit_note_product_list",
                        };
                        eventBus.dispatch("page_change", {
                          from: "tranx_credit_note_product_list",
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
              <div className="tnx-pur-inv-ModalStyle">
                <Table bordered>
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
                    {ledgerList.map((v, i) => {
                      return (
                        <tr
                          className={`${
                            JSON.stringify(v) == JSON.stringify(selectedLedger)
                              ? "selected-tr"
                              : ""
                          }`}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log({ selectedLedger });
                            let id = 0;
                            if (selectedLedger != "") {
                              if (this.myRef.current) {
                                let opt = [];
                                if (selectedLedger != null) {
                                  id = selectedLedger.id;
                                  opt = selectedLedger.gstDetails.map(
                                    (v, i) => {
                                      return {
                                        label: v.gstNo,
                                        value: v.id,
                                        state: v.state,
                                      };
                                    }
                                  );
                                  console.log("opt", opt);
                                  this.setState({
                                    lstGst: opt,
                                  });
                                }
                                console.log("lstGst", lstGst, supplierCodeLst);
                                this.myRef.current.setFieldValue(
                                  "clientNameId",
                                  selectedLedger != ""
                                    ? selectedLedger.ledger_name
                                    : ""
                                );
                                this.myRef.current.setFieldValue(
                                  "clientCodeId",
                                  selectedLedger != ""
                                    ? getSelectValue(
                                        supplierCodeLst,
                                        selectedLedger.id
                                      )
                                    : ""
                                );
                                this.myRef.current.setFieldValue(
                                  "salesman",
                                  selectedLedger != ""
                                    ? selectedLedger.sales_man
                                    : ""
                                );
                                this.myRef.current.setFieldValue(
                                  "gstId",
                                  selectedLedger != ""
                                    ? getValue(opt, ledgerData.gst_number)
                                    : ""
                                );
                              }
                              this.setState(
                                {
                                  ledgerModal: false,
                                  // invoice_data: invoice_data,
                                  selectedLedger: "",
                                },
                                () => {
                                  this.handleSubmitSCList(id);
                                }
                              );
                            }
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            console.log({ v });
                            this.setState({ selectedLedger: v }, () => {
                              this.transaction_ledger_detailsFun(v.id);
                            });
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
                              className="mdl-icons"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  isActionExist(
                                    "ledger",
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
                                    from_page: "tranx_credit_note_product_list",
                                  };

                                  let data = {
                                    source: source,
                                    id: v.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_credit_note_product_list",
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
                              className="mdl-icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "ledger",
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
                                        this.deleteledgerFun(v.id);
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
              {/* <div>
                <Table>
                  <tbody className="tbl-color">
                    <tr
                      style={{
                        background: "#F8F0D2",
                        border: "1px solid transparent",
                      }}
                    >
                      <td className="colored_label"> GST No.:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.gst_number : ""}
                      </td>
                      <td className="colored_label">Contact Person:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.contact_name : ""}
                      </td>
                      <td className="colored_label">Credit Days:</td>
                      <td className="sub-col-style1">
                        {ledgerData != "" ? ledgerData.credit_days : ""}
                      </td>
                    </tr>
                    <tr
                      style={{
                        background: "#F8F0D2",
                        border: "1px solid transparent",
                      }}
                    >
                      <td className="colored_label"> Licence No.:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.license_number : ""}
                      </td>
                      <td className="colored_label">Area: </td>
                      <td className="sub-col-style1">
                        {ledgerData != "" ? ledgerData.area : ""}
                      </td>
                      <td className="colored_label"> Transport:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.route : ""}
                      </td>
                    </tr>

                    <tr
                      style={{
                        background: "#F8F0D2",
                        border: "1px solid transparent",
                      }}
                    >
                      <td className="colored_label">FSSAI:</td>
                      <td className="sub-col-style1">
                        {" "}
                        {ledgerData != "" ? ledgerData.fssai_number : ""}
                      </td>
                      <td className="colored_label"> Route:</td>
                      <td className="sub-col-style1">
                        {ledgerData != "" ? ledgerData.route : ""}
                      </td>
                      <td className="colored_label">Bank:</td>
                      <td className="sub-col-style1">
                        {ledgerData != "" ? ledgerData.bank_name : ""}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div> */}
              <div className="ledger_details_style">
                <Row className="mx-1">
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0 ">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>GST No.:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.gst_number : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Licence No.:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {ledgerData != ""
                                ? ledgerData.license_number
                                : ""}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td>FSSAI:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.fssai_number : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>Contact Person:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.contact_name : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Area:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.area : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Route:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.route : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0 ">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>Credit Days:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.credit_days : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Transport:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.route : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Bank:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.bank_name : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>

              <Row>
                <Col md="12 p-3" className="btn_align">
                  {/* <Button
                    className="submit-btn successbtn-style"
                    type="button"

                  >
                    Submit
                  </Button>
                  <Button
                    style={{ marginRight: "8px" }}
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
                  </Button> */}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>

          {/* select Product modal */}
          <Modal
            show={selectProductModal}
            size={
              window.matchMedia("(min-width:1360px) and (max-width:1919px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="tnx-pur-inv-mdl-product"
            centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Select Product
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.SelectProductModalFun(false);
                }}
              />
            </Modal.Header>

            <Modal.Body className="tnx-pur-inv-mdl-body p-0">
              <Row className="p-3">
                <Col lg={6}>
                  <InputGroup className="mb-3 mdl-text">
                    <Form.Control
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.transaction_product_listFun(e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col lg={1} className="mt-2">
                  <Form.Label>Barcode</Form.Label>
                </Col>
                <Col lg={3}>
                  <InputGroup className="mdl-text">
                    <Form.Control
                      autoFocus="true"
                      type="text"
                      placeholder="Enter"
                      name="gst_per"
                      id="gst_per"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.transaction_product_listFun("", e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      <img className="scanner_icon" src={Scanner} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>

                <Col lg={2}>
                  <Button
                    className="successbtn-style"
                    onClick={(e) => {
                      e.preventDefault();

                      if (
                        isActionExist(
                          "product",
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
                          from_page: "tranx_credit_note_product_list",
                        };
                        eventBus.dispatch("page_change", {
                          from: "tranx_credit_note_product_list",
                          to: "newproductcreate",
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
              <div className="tnx-pur-inv-ModalStyle">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Packing</th>
                      <th>Barcode</th>
                      <th>MRP</th>
                      <th>Curr Stock</th>
                      <th>Sale Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productLst.map((pv, pi) => {
                      return (
                        <tr
                          className={`${
                            JSON.stringify(pv) ==
                            JSON.stringify(selectedProduct)
                              ? "selected-tr"
                              : ""
                          }`}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log({ selectedProduct, rowIndex });
                            if (selectedProduct != "") {
                              rows[rowIndex]["productName"] =
                                selectedProduct.product_name;
                              rows[rowIndex]["productId"] = selectedProduct.id;
                              rows[rowIndex]["is_level_a"] =
                                productData.is_level_a;
                              rows[rowIndex]["is_level_b"] =
                                productData.is_level_b;
                              rows[rowIndex]["is_level_c"] =
                                productData.is_level_c;
                              rows[rowIndex]["is_batch"] = productData.is_batch;

                              let unit_id = {
                                gst: productData.igst,
                                igst: productData.igst,
                                cgst: productData.cgst,
                                sgst: productData.sgst,
                              };

                              rows[rowIndex]["unit_id"] = unit_id;
                              // rows[rowIndex]["levelAOpt"] =
                              //   levelOpt.length > 0 ? levelOpt : [];

                              console.log({ rows });

                              this.setState(
                                {
                                  rows: rows,
                                  selectProductModal: false,
                                  levelOpt: [],
                                },
                                () => {
                                  this.getProductPackageLst(
                                    selectedProduct.id,
                                    rowIndex
                                  );
                                }
                              );
                            }
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ selectedProduct: pv }, () => {
                              this.transaction_product_detailsFun(pv.id);
                              this.get_sales_return_supplierlist_by_productidFun(
                                pv.id
                              );
                            });
                          }}
                        >
                          <td>{pv.code}</td>
                          <td>{pv.product_name}</td>
                          <td>{pv.packing}</td>
                          <td>{pv.barcode}</td>
                          <td>{pv.mrp}</td>
                          <td>{pv.current_stock}</td>
                          <td>{pv.sales_rate}</td>
                          <td>
                            <img
                              src={TableEdit}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                if (
                                  isActionExist(
                                    "product",
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
                                    from_page: "tranx_credit_note_product_list",
                                  };

                                  let data = {
                                    source: source,
                                    id: pv.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_credit_note_product_list",
                                    to: "productedit",
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
                              className="mdl-icons"
                              onClick={(e) => {
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
                                      this.deleteproduct(pv.id);
                                    },
                                    handleFailFn: () => {},
                                  },
                                  () => {
                                    console.warn("return_data");
                                  }
                                );
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {/* <Table>
                <tbody className="tbl-color">
                  <tr
                    style={{
                      background: "#F8F0D2",
                      border: "1px solid transparent",
                    }}
                  >
                    <td className="colored_label"> Brand:</td>
                    <td className="sub-col-style1">
                      {" "}
                      {productData != "" ? productData.brand : ""}
                    </td>
                    <td className="colored_label">HSN:</td>
                    <td className="sub-col-style1">
                      {" "}
                      {productData != "" ? productData.hsn : ""}
                    </td>
                    <td className="colored_label">Cost:</td>
                    <td className="sub-col-style1">
                      {productData != "" ? productData.cost : ""}
                    </td>
                  </tr>
                  <tr
                    style={{
                      background: "#F8F0D2",
                      border: "1px solid transparent",
                    }}
                  >
                    <td className="colored_label"> Group:</td>
                    <td className="sub-col-style1">
                      {productData != "" ? productData.group : ""}
                    </td>
                    <td className="colored_label">Tax Type: </td>
                    <td className="sub-col-style1">
                      {productData != "" ? productData.tax_type : ""}
                    </td>
                    <td className="colored_label"> Shelf ID:</td>
                    <td className="sub-col-style1">
                      {" "}
                      {productData != "" ? productData.shelf_id : ""}
                    </td>
                  </tr>

                  <tr
                    style={{
                      background: "#F8F0D2",
                      border: "1px solid transparent",
                    }}
                  >
                    <td className="colored_label">Category:</td>
                    <td className="sub-col-style1">
                      {" "}
                      {productData != "" ? productData.category : ""}
                    </td>
                    <td className="colored_label"> Tax %:</td>
                    <td className="sub-col-style1">
                      {productData != "" ? productData.tax_per : ""}
                    </td>
                    <td className="colored_label">Min Stock:</td>
                    <td className="sub-col-style1">
                      {" "}
                      {productData != "" ? productData.min_stock : ""}
                    </td>
                  </tr>
                  <tr
                    style={{
                      background: "#F8F0D2",
                      border: "1px solid transparent",
                    }}
                  >
                    <td className="colored_label">Supplier:</td>
                    <td className="sub-col-style1">
                      {" "}
                      {productData != "" ? productData.supplier : ""}
                    </td>
                    <td className="colored_label"> Margin %:</td>
                    <td className="sub-col-style1">
                      {productData != "" ? productData.margin_per : ""}
                    </td>
                    <td className="colored_label">Max Stock:</td>
                    <td className="sub-col-style1">
                      {" "}
                      {productData != "" ? productData.max_stock : ""}
                    </td>
                  </tr>
                </tbody>
              </Table> */}
              <div>
                <div className="ledger_details_style">
                  <Row className="mx-1">
                    <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                      <Table className="colored_label mb-0">
                        <tbody style={{ borderBottom: "0px transparent" }}>
                          <tr>
                            <td>Brand:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.brand : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Group:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.group : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Category:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.category : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Supplier:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.supplier : ""}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                      <Table className="colored_label mb-0">
                        <tbody style={{ borderBottom: "0px transparent" }}>
                          <tr>
                            <td>HSN:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.hsn : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Tax Type:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.tax_type : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Tax%:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.tax_per : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Margin%:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != ""
                                  ? productData.margin_per
                                  : ""}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                      <Table className="colored_label mb-0">
                        <tbody style={{ borderBottom: "0px transparent" }}>
                          <tr>
                            <td>Cost:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.cost : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Shelf ID:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {productData != "" ? productData.shelf_id : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Min Stock:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {" "}
                                {productData != "" ? productData.min_stock : ""}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>Max Stock:</td>
                            <td>
                              <p className="colored_sub_text mb-0">
                                {" "}
                                {productData != "" ? productData.max_stock : ""}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
              </div>
              <Row className="p-3">
                <Col md="12 mt-1" className="btn_align">
                  {/* <Button
                    className="submit-btn successbtn-style  me-2"
                    type="button"

                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn"
                    className="me-2"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ selectedProduct: "" }, () => {
                        this.SelectProductModalFun(false);
                      });
                    }}
                  >
                    Cancel
                  </Button> */}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        </div>
      </>
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

export default connect(
  mapStateToProps,
  mapActionsToProps
)(TranxCreditNoteProductList);
