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
import { connect } from "react-redux";

import mousetrap, { bind } from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";
import Select from "react-select";
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";

import TGSTFooter from "../../Components/TGSTFooter";
import {
  getSundryDebtors,
  //getLastSalesInvoiceNo,
  getLastCounterSalesNo,
  getSalesAccounts,
  getProduct,
  updateCounterSales,
  getAdditionalLedgers,
  authenticationService,
  getSundryDebtorsIdClient,
  listTranxCreditNotes,
  getInvoiceBill,
  getcounterCustomer,
  getProductFlavourList,
  get_Product_batch,
  checkInvoiceDateIsBetweenFY,
  get_counter_sales_product_fpu_by_id,
  getCounterSalesWithId,
  transaction_product_list,
  transaction_product_details,
  transaction_batch_details,
  delete_Product_list,
  getSalesInvoiceSupplierListByProductId,
} from "@/services/api_functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CMPTranxRow from "../../Components/CMPTranxRow";
import {
  MyTextDatePicker,
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  CheckIsRegisterdCompany,
  purchaseSelect,
  fnTranxCalculationForCS,
  isActionExist,
  isFreeQtyExist,
  isMultiDiscountExist,
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  unitDD,
  flavourDD,
  INRformat,
} from "@/helpers";

import TableDelete from "@/assets/images/deleteIcon.png";
import add_icon from "@/assets/images/add_icon.svg";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";

import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";

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
class CounterSaleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.paymentRef = React.createRef();
    this.counterRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.state = {
      isEditDataSet: false,
      show: false,
      showPrint: false,
      opendiv: false,
      hidediv: true,

      salesAccLst: [],
      lstBrand: [],
      supplierNameLst: [],
      selectedBillsdebit: [],
      billLst: [],
      adjusmentbillmodal: false,
      supplierCodeLst: [],
      invoiceedit: false,
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      Clietdetailmodal: false,
      clientinfo: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      outstanding_sales_return_amt: 0,
      lstPackages: [],
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      customerData: "",
      invoiceData: "",
      invoiceDetails: "",
      is_button_show: false,
      supplierData: "",
      paymetmodel: false,
      copt: "",
      saleVal: "",
      initVal: {
        sales_sr_no: 1,

        //bill_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        bill_dt: new Date(),
        clientCodeId: "",
        clientNameId: "",

        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
        sales_discount: 0,
        sales_discount_amt: 0,
        total_sales_discount_amt: 0,
        total_base_amt: 0,
        total_tax_amt: 0,
        total_taxable_amt: 0,
        total_dis_amt: 0,
        total_dis_per: 0,
        totalcgstper: 0,
        totalsgstper: 0,
        totaligstper: 0,
        sales_disc_ledger: "",
        total_discount_proportional_amt: 0,
        total_additional_charges_proportional_amt: 0,
      },

      invoice_data: {
        sales_sr_no: "",
        bill_no: "",
        clientName: "",
        clientMobile: "",
        creditnoteNo: "",
        newReference: "",
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        salesAccId: "",
        clientCodeId: "",
        clientNameId: "",
        gstId: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
        sales_discount: 0,
        sales_discount_amt: 0,
        total_purchase_discount_amt: 0,
        total_base_amt: 0,
        total_tax_amt: 0,
        total_taxable_amt: 0,
        total_dis_amt: 0,
        total_dis_per: 0,
        totalcgstper: 0,
        totalsgstper: 0,
        totaligstper: 0,
        sales_disc_ledger: "",
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

      lstFlavours: [],
      flavour_index: 0,
      batchData: "",
      is_expired: false,
      b_details_id: 0,
      isBatch: false,
      batchInitVal: "",
      tr_id: "",
      selectSerialModal: false,
      batch_data_selected: "",
      batchHideShow: true,
      serialNoLst: [],
      rowDelDetailsIds: [],
      productData: "",
      selectProductModal: false,
      levelOpt: [],
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      product_supplier_lst: [],

      delAdditionalCahrgesLst: [],
      product_hover_details: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      add_button_flag: true,
      costingInitVal: "",
      costingMdl: false,
      transactionTableStyle: "counter_sale",
    };
  }

  handleMstState = (rows) => {
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TSCSEProductId-" + id).focus();
      }, 1000);
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  getProductFlavorpackageUnitbyids = (invoice_id) => {
    let reqData = new FormData();
    reqData.append("id", invoice_id);
    get_counter_sales_product_fpu_by_id(reqData)
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
          this.setState({ lstBrand: Opt }, () => {});
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstPackages: [] }, () => {});
      });
  };

  getProductPackageLst = (product_id, rowIndex = -1) => {
    let reqData = new FormData();
    console.warn("rahul getProductPackageLst::", rowIndex);
    let { rows, lstBrand } = this.state;
    console.warn("rahul lstBrand::", lstBrand);
    let findProductPackges = getSelectValue(lstBrand, product_id);
    console.warn("rahul findProductPackges:: ", findProductPackges);

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
              // if (findProductPackges && rowIndex != -1) {
              //   rows[rowIndex]["prod_id"] = findProductPackges;
              //   rows[rowIndex]["levelaId"] = findProductPackges["levelAOpt"][0];

              //   if (
              //     findProductPackges["levelAOpt"][0]["levelBOpt"].length >= 1
              //   ) {
              //     rows[rowIndex]["levelbId"] =
              //       findProductPackges["levelAOpt"][0]["levelBOpt"][0];

              //     if (
              //       findProductPackges["levelAOpt"][0]["levelBOpt"][0][
              //         "levelCOpt"
              //       ].length >= 1
              //     ) {
              //       rows[rowIndex]["levelcId"] =
              //         findProductPackges["levelAOpt"][0]["levelBOpt"][0][
              //           "levelCOpt"
              //         ][0];
              //     }
              //     {
              //       rows[rowIndex]["unitId"] =
              //         findProductPackges["levelAOpt"][0]["levelBOpt"][0][
              //           "levelCOpt"
              //         ][0]["unitOpt"][0];
              //     }
              //   }

              //   rows[rowIndex]["isLevelA"] = true;
              //   // rows[rowIndex]["isGroup"] = levelData.isGroup;
              //   // rows[rowIndex]["isCategory"] = levelData.isCategory;
              //   // rows[rowIndex]["isSubCategory"] = levelData.isSubcategory;
              //   // rows[rowIndex]["isPackage"] = levelData.isPackage;

              //   // setTimeout(() => {
              //   //   var allElements =
              //   //     document.getElementsByClassName("unitClass");
              //   //   for (var i = 0; i < allElements.length; i++) {
              //   //     document.getElementsByClassName("unitClass")[
              //   //       i
              //   //     ].style.border = "1px solid";
              //   //   }
              //   // }, 1);
              // }
              if (findProductPackges && rowIndex != -1) {
                rows[rowIndex]["prod_id"] = findProductPackges;
                if (findProductPackges["levelAOpt"].length >= 1) {
                  rows[rowIndex]["levelaId"] =
                    findProductPackges["levelAOpt"][0];
                  if (
                    findProductPackges["levelAOpt"][0]["levelBOpt"].length >= 1
                  ) {
                    rows[rowIndex]["levelbId"] =
                      findProductPackges["levelAOpt"][0]["levelBOpt"][0];

                    if (
                      findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                        "levelCOpt"
                      ].length >= 0
                    ) {
                      rows[rowIndex]["levelcId"] =
                        findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                          "levelCOpt"
                        ][0];
                    }

                    rows[rowIndex]["unitId"] =
                      findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                        "levelCOpt"
                      ][0]["unitOpt"][0];
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
  openSerialNo = (rowIndex) => {
    // console.log("rowIndex", rowIndex);
    let { rows } = this.state;
    let serialNoLst = rows[rowIndex]["serialNo"];
    // console.log("serialNoLst", serialNoLst);

    if (serialNoLst.length == 0) {
      serialNoLst = Array(6).fill("");
    }
    this.setState({
      selectSerialModal: true,
      rowIndex: rowIndex,
      serialNoLst: serialNoLst,
    });
  };
  openBatchNo = (rowIndex) => {
    let { rows } = this.state;
    this.handleRowStateChange(
      rows,
      rows[rowIndex]["is_batch"], // true,
      rowIndex
    );
  };

  productModalStateChange = (obj, callTrxCal = false) => {
    this.setState(obj, () => {
      if (callTrxCal) {
        this.handleTranxCalculation();
      }
    });
    if (obj.costingMdl == false) {
      let id = parseInt(this.state.rows.length) - 1;
      if (document.getElementById("TSCSEAddBtn-" + id) != null) {
        setTimeout(() => {
          document.getElementById("TSCSEAddBtn-" + id).focus();
        }, 200);
      }
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
  getInitBatchValue = (rowIndex = -1, source) => {
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
    console.log("initVal", initVal);
    let IsBatch = rows[rowIndex]["is_batch"];
    console.log(" IsBatch ", IsBatch);

    if (IsBatch == true && source == "batch") {
      this.setState({
        rowIndex: rowIndex,
        batchInitVal: initVal,
        newBatchModal: true,
        isBatch: IsBatch,
        tr_id: "",
      });
    } else if (IsBatch == true && source == "costing") {
      this.setState({
        rowIndex: rowIndex,
        costingInitVal: initVal,
        costingMdl: true,
        isBatch: IsBatch,
        tr_id: "",
      });
    }
  };

  handleLstPackage = (lstPackages) => {
    this.setState({ lstPackages: lstPackages });
  };

  handleLstFlavour = (lstFlavours) => {
    this.setState({ lstFlavours: lstFlavours });
  };
  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;
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
  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
  };
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges, delAdditionalCahrgesLst } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;

        if (value == undefined || value == null) {
          v["amt"] = "";

          let details_id = v["additional_charges_details_id"];
          if (details_id !== 0) {
            if (!delAdditionalCahrgesLst.includes(details_id)) {
              delAdditionalCahrgesLst.push(details_id);
            }
          }
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

  handleAdditionalChargesHide = () => {
    this.setState({ additionchargesyes: false }, () => {
      this.handleTranxCalculation();
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
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
      } = this.myRef.current.values;

      ledger_disc_per = sales_discount;
      ledger_disc_amt = sales_discount_amt;

      addChgLedgerAmt1 = additionalChgLedgerAmt1;
      addChgLedgerAmt2 = additionalChgLedgerAmt2;
      addChgLedgerAmt3 = additionalChgLedgerAmt3;

      takeDiscountAmountInLumpsum = true;
      isFirstDiscountPerCalculate = false;
    }

    let resTranxFn = fnTranxCalculationForCS({
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

  setLastCounterSalesNo = () => {
    // ;
    let reqData = new FormData();
    reqData.append("sale_type", "counter_sale");
    console.log("Counter Number:", reqData);
    getLastCounterSalesNo()
      .then((response) => {
        let res = response.data;
        console.log("res-lastsalesno----->", res);
        if (res.responseStatus === 200) {
          const { initVal } = this.state;
          initVal["sales_sr_no"] = res.count;
          initVal["bill_no"] = res.serialNo;
          this.setState({ initVal: res });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  counterCustomer = () => {
    getcounterCustomer()
      .then((response) => {
        let cres = response.data;
        console.log("cres------->", cres);
        if (cres.responseStatus == 200) {
          // let copt = cres.map((c, i) => {
          //   return { label: c.name, value: c.id };
          // });
          this.setState({ copt: cres.data });
          // console.log("copt------->",copt);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstSalesAccounts = () => {
    getSalesAccounts()
      .then((response) => {
        let res = response.data;
        //console.log("Result:", res);
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id, ...v };
          });
          this.setState({ salesAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.unique_code.toUpperCase().includes("SLAC")
            );

            const { prop_data } = this.props.block;
            console.log("prop_data", prop_data);
            if (v != null && v != undefined && prop_data.invoice_data != null) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["salesAccId"] = v[0];
              this.setState({ invoice_data: init_d });
            }
            // this.myRef.current.setFieldValue("salesAccId", v[0]);
            else if (
              v != null &&
              v != undefined &&
              !prop_data.hasOwnProperty("invoice_data")
            ) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["salesAccId"] = v[0];
              this.setState({ invoice_data: init_d });
              console.log("invoice_data", init_d);
            }
            // this.myRef.current.setFieldValue("salesAccId", v[0]);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleLstPackage = (lstPackages) => {
    this.setState({ lstPackages: lstPackages });
  };

  handleLstFlavour = (lstFlavours) => {
    this.setState({ lstFlavours: lstFlavours });
  };
  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
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
              return { value: values.id, label: values.name };
            });
            let fOpt = Opt.filter(
              (v) => v.label.trim().toLowerCase() != "round off"
            );
            // console.log({ fOpt });
            this.setState({ lstAdditionalLedger: fOpt });
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
                stateCode = v.gstDetails[0]["state"];
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
                stateCode = v.gstDetails[0]["state"];
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

  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
  };

  handleClientDetails = (status) => {
    let { invoice_data } = this.state;
    console.log({ invoice_data });
    if (status === true) {
      let reqData = new FormData();
      let sun_id = invoice_data.clientNameId && invoice_data.clientNameId.value;
      reqData.append("sundry_debtors_id", sun_id);
      getSundryDebtorsIdClient(reqData)
        .then((response) => {
          console.log("res", response);
          let res = response.data;
          if (res.responseStatus === 200) {
            this.setState({ clientinfo: res });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    this.setState({ Clietdetailmodal: status });
  };

  handleClientForm = () => {
    this.handleClientDetails(true);
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

  getLevelsOpt = (element, rowIndex, parent) => {
    let { rows } = this.state;
    return rows[rowIndex] && rows[rowIndex][parent]
      ? rows[rowIndex][parent][element]
      : [];
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

  getFloatUnitElement = (ele, rowIndex) => {
    let { rows } = this.state;
    return rows[rowIndex][ele]
      ? parseFloat(rows[rowIndex][ele]).toFixed(2)
      : "";
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

  handleBillselectionCredit = (id, index, status) => {
    let { billLst, selectedBillsdebit } = this.state;
    // console.log({ id, index, status });
    let f_selectedBills = selectedBillsdebit;
    let f_billLst = billLst;
    if (status == true) {
      if (selectedBillsdebit.length > 0) {
        if (!selectedBillsdebit.includes(id)) {
          f_selectedBills = [...f_selectedBills, id];
        }
      } else {
        f_selectedBills = [...f_selectedBills, id];
      }
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);
    }
    f_billLst = f_billLst.map((v, i) => {
      if (f_selectedBills.includes(v.credit_note_no)) {
        v["credit_paid_amt"] = parseFloat(v.Total_amt);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
      } else {
        v["credit_paid_amt"] = 0;
        v["credit_remaining_amt"] = parseFloat(v.Total_amt);
      }

      return v;
    });

    this.setState({
      isAllCheckedCredit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsdebit: f_selectedBills,
      billLst: f_billLst,
    });
  };
  handleBillsSelectionAllCredit = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.credit_note_no);
      console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["credit_paid_amt"] = parseFloat(v.Total_amt);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
        // v['debit_paid_amt'] = isNaN(parseFloat(v.Total_amt))
        //   ? parseFloat(v.Total_amt)
        //   : 0;
        // v['debit_remaining_amt'] = isNaN(
        //   parseFloat(v['Total_amt']) - parseFloat(v.Total_amt)
        // )
        //   ? parseFloat(v['Total_amt']) - parseFloat(v.Total_amt)
        //   : 0;

        return v;
      });

      console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        v["credit_paid_amt"] = 0;
        v["credit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;
      });
    }
    this.setState({
      isAllCheckedCredit: status,
      selectedBillsdebit: lstSelected,
      billLst: fBills,
    });
  };

  handlePropData = (prop_data) => {
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

  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "tranx_sales_countersale_edit",
      to: "tranx_sales_countersale_list",
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.transaction_product_listFun();
      // this.counterCustomer();
      this.initRow();

      mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);

      const { prop_data } = this.props.block;
      console.log("prop_data ", { prop_data });
      this.setState({ source: prop_data, salesEditData: prop_data }, () => {
        if (prop_data.id) {
          this.getProductFlavorpackageUnitbyids(prop_data.id);
        }

        this.handlePropData(prop_data);
      });
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

  setSalesInvoiceEditData = () => {
    console.log("is sales Edit");
    console.log("Id in setSalesEdidt", this.state.salesEditData.id);
    let formData = new FormData();
    formData.append("id", this.state.salesEditData.id);
    getCounterSalesWithId(formData)
      .then((response) => {
        let res = response.data;
        console.log("Sale Invoice Edit data", res);
        if (res.responseStatus === 200) {
          let { row } = res;
          const { productLst, lstBrand } = this.state;
          console.log({ productLst });

          let initInvoiceData = {
            id: res.id,
            sales_sr_no: res.counterSaleSrNo,
            clientName: res.customerName,
            clientMobile: res.mobileNumber,
            bill_no: res.counterSaleNo,
            transaction_dt: moment(
              new Date(moment(res.billDate, "YYYY-MM-DD").toDate())
            ).format("DD/MM/YYYY"),
          };

          console.log("initinvoiceData", initInvoiceData, lstBrand);
          let initRowData = [];
          if (row.length > 0) {
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
                v.levelaId = getSelectValue(productOpt.levelAOpt, "");
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
              v["dis_per_cal"] = 0;
              v["dis_amt_cal"] = 0;
              v["total_amt"] = v.total_amt != "" ? v.total_amt : 0;
              v["total_base_amt"] = 0;
              v["gst"] = 0;
              v["igst"] = 0;
              v["cgst"] = 0;
              v["sgst"] = 0;
              v["total_igst"] = 0;
              v["total_cgst"] = 0;
              v["total_sgst"] = 0;
              v["final_amt"] = v.final_amt != "" ? v.final_amt : 0;
              v["free_qty"] =
                v.free_qty != "" && v.free_qty != null ? v.free_qty : 0;
              v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
              v["row_dis_amt"] = v.row_dis_amt != "" ? v.row_dis_amt : 0;
              v["gross_amt"] = 0;
              v["add_chg_amt"] = 0;
              v["gross_amt1"] = 0;
              v["invoice_dis_amt"] = 0;
              v["net_amt"] = v.final_amt != "" ? v.final_amt : 0;
              v["taxable_amt"] = v.total_amt != "" ? v.total_amt : 0;

              v["final_discount_amt"] = 0;
              v["discount_proportional_cal"] = 0;
              v["additional_charges_proportional_cal"] = 0;
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

          console.log("row---===>", initRowData);

          initInvoiceData["narration"] = res.narrations;
          console.log("initinvoiceData", initInvoiceData);
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
            },
            () => {
              setTimeout(() => {
                this.handleTranxCalculation();
              }, 25);
            }
          );
        }
      })
      .catch((error) => {});
  };

  componentDidUpdate() {
    if (AuthenticationCheck()) {
      let {
        isEditDataSet,
        salesEditData,
        productLst,
        lstPackages,
      } = this.state;
      console.log({
        isEditDataSet,
        salesEditData,
      });
      if (
        productLst.length > 0 &&
        isEditDataSet == false &&
        salesEditData != ""
      ) {
        console.log("is did update");
        this.setSalesInvoiceEditData();
      }
    }
  }
  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+h", this.handleClientForm);
  }

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

  /**
   *
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  handleChangeArrayElement = (element, value, index, setFieldValue) => {
    console.log({ element, value, index });
    let { rows } = this.state;

    // checkelement[element] = value;
    /**
     * @description Calculate product level calculation
     */
    let frows = rows.map((v, i) => {
      if (i == index) {
        v[element] = value;
        index = i;

        if (element == "productId" && value != null && value != undefined) {
          if (CheckIsRegisterdCompany() == true) {
            v["igst"] = value.igst;
            v["gst"] = value.igst;
            v["cgst"] = value.cgst;
            v["sgst"] = value.sgst;
          } else {
            v["igst"] = 0;
            v["gst"] = 0;
            v["cgst"] = 0;
            v["sgst"] = 0;
          }
          if (value.isSerialNumber == true) {
            let serialnoarray = [];
            for (let index = 0; index < 100; index++) {
              serialnoarray.push({ no: "" });
            }
            v["serialNo"] = serialnoarray;
            this.setState({
              serialnopopupwindow: true,
              serialnoshowindex: i,
              serialnoarray: serialnoarray,
            });
          }

          v["productDetails"] = v["productDetails"].map((vi) => {
            if (CheckIsRegisterdCompany() == true) {
              vi["igst"] = value.igst;
              vi["gst"] = value.igst;
              vi["cgst"] = value.cgst;
              vi["sgst"] = value.sgst;
            } else {
              vi["igst"] = 0;
              vi["gst"] = 0;
              vi["cgst"] = 0;
              vi["sgst"] = 0;
            }
            return vi;
          });
        }

        return v;
      } else {
        return v;
      }
    });
    console.log("frows==----->>>>>>>", frows);
    this.setState({ rows: frows }, () => {
      if (
        element === "productId" &&
        value !== "" &&
        value !== undefined &&
        value !== null
      ) {
        this.setState({ transaction_detail_index: index }, () => {
          console.log("in  if statement of getProductPackageLst ");
          this.getProductPackageLst(value.value);
        });
      }
      this.handleAdditionalChargesSubmit();
    });
  };

  finalInvoiceAmt = () => {
    let returnValues = this.myRef.current.values;
    // requestData.append('totalamt', returnValues.totalamt);
    let totalamt = returnValues.totalamt;
    return totalamt;
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i === index;
    });
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleUnitLstOpt = (productId) => {
    // console.log("productId", productId);
    if (productId !== undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    // console.log("productId", productId);
    if (productId !== undefined && productId) {
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
      if (i === index) {
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
    // console.log({ rows, serialnoshowindex });
    if (serialnoshowindex != -1) {
      let rdata = rows.find((v, i) => i == serialnoshowindex);

      return serialnoarray.map((vi, ii) => {
        return (
          <tr>
            <td>{ii + 1}</td>
            <td>
              <Form.Group>
                <Form.ControlconfirmAction
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    // console.log(e.target.value);
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
  confirmAction = () => {
    // eventBus.dispatch("page_change", {
    //   // from: "tranx_sales_invoice_list",
    //   to: "biradar",
    //   isNewTab: false,
    // });

    let confirmAction = window.confirm("Are you sure you want to print");
    console.log("Confirm Action", confirmAction);
    this.setState({ showPrint: true });

    // <p className="title">{title}</p>
    // <p className="msg">{msg}</p>
    // {
    //   icon == "confirm" && (
    //     <>
    //       <Button
    //         className="sub-button"
    //         type="submit"
    //         onClick={(e) => {
    //           e.preventDefault();
    //           this.getInvoiceBillsLst(is_button_show);

    //           // this.handleHide();
    //         }}
    //       >
    //         Yes
    //       </Button>
    //       <Button
    //         className="sub-button btn-danger"
    //         type="submit"
    //         onClick={(e) => {
    //           e.preventDefault();
    //           eventBus.dispatch("page_change", {
    //             from: "tranx_sales_invoice_create",
    //             to: "tranx_sales_invoice_list",
    //             isNewTab: false,
    //           });
    //           this.handleHide();
    //         }}
    //       >
    //         No
    //       </Button>

    //     </>
    //   );
    // }
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

  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        details_id: 0,
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

  get_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    getSalesInvoiceSupplierListByProductId(requestData)
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

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      details_id: 0,
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
      total_base_amt: 0,

      row_dis_amt: 0,
      gross_amt: 0,
      add_chg_amt: 0,
      gross_amt1: 0,
      invoice_dis_amt: 0,
      total_amt: 0,
      net_amt: 0,

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
    console.warn({ new_row });
    rows = [...rows, new_row];
    this.handleMstState(rows);
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

  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
    });
  };

  /**
   * @description Calculate the formula discount + Additional charges
   */

  finalInvoiceAmt = () => {
    let returnValues = this.myRef.current.values;
    // requestData.append('totalamt', returnValues.totalamt);
    let totalamt = returnValues.totalamt;
    return totalamt;
  };

  handleAdditionalChargesSubmit = (discamtval = -1, type = "") => {
    const { rows, additionalChargesTotal } = this.state;
    // console.log({ discamtval, type });

    if (discamtval == "") {
      discamtval = 0;
    }
    if (type != "" && discamtval >= 0) {
      if (type == "sales_discount") {
        this.myRef.current.setFieldValue(
          "sales_discount",
          discamtval != "" ? discamtval : 0
        );
      } else {
        this.myRef.current.setFieldValue(
          "sales_discount_amt",
          discamtval != "" ? discamtval : 0
        );
      }
    }
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      if (v["productId"] != "") {
        let baseamt = 0;
        let i_totalamt = 0;
        v["productDetails"] = v.productDetails.map((vi) => {
          if (vi["qty"] != "" && vi["rate"] != "") {
            vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
          } else {
            vi["base_amt"] = 0;
          }
          vi["total_amt"] = vi["base_amt"];
          vi["total_b_amt"] = vi["base_amt"];

          vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
          baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
          if (vi["dis_amt"] != "" && vi["dis_amt"] > 0) {
            vi["total_amt"] =
              parseFloat(vi["total_amt"]) - parseFloat(vi["dis_amt"]);
            vi["total_b_amt"] =
              parseFloat(vi["total_b_amt"]) - parseFloat(vi["dis_amt"]);
            vi["dis_amt_cal"] = vi["dis_amt"];
          }
          if (vi["dis_per"] != "" && vi["dis_per"] > 0) {
            let per_amt = calculatePercentage(vi["total_amt"], vi["dis_per"]);
            vi["dis_per_cal"] = per_amt;
            vi["total_b_amt"] = vi["total_b_amt"] - per_amt;

            vi["total_amt"] = vi["total_amt"] - per_amt;
          }
          i_totalamt = parseFloat(i_totalamt) + parseFloat(vi["total_amt"]);

          return vi;
        });
        v["base_amt"] = baseamt;
        v["total_amt"] = i_totalamt;
        totalamt = parseFloat(totalamt) + i_totalamt;
      }
      return v;
    });

    // console.log("row_disc", { row_disc });
    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *purchase Discount ledger selected
     */
    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (type != "" && discamtval >= 0) {
          if (type == "purchase_discount") {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              let peramt = calculatePercentage(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                peramt,
                vi["total_amt"]
              );
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(totalamt, peramt, vi["total_amt"]);

              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;

            if (
              this.myRef.current.values.sales_discount_amt > 0 &&
              this.myRef.current.values.sales_discount_amt != ""
            ) {
              let disc_total_amt = 0;
              let disc_prop_cal = 0;
              v["productDetails"] = v.productDetails.map((vi) => {
                vi["total_amt"] =
                  vi["total_amt"] -
                  calculatePrValue(
                    totalamt,
                    parseFloat(this.myRef.current.values.sales_discount_amt),
                    vi["total_amt"]
                  );
                vi["discount_proportional_cal"] = calculatePrValue(
                  totalamt,
                  parseFloat(discamtval),
                  vi["total_amt"]
                );
                disc_prop_cal =
                  parseFloat(disc_prop_cal) +
                  parseFloat(vi["discount_proportional_cal"]);
                disc_total_amt =
                  parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
                return vi;
              });

              v["total_amt"] = disc_total_amt;
              v["discount_proportional_cal"] = disc_prop_cal;
            }
          } else {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(
                  totalamt,
                  parseFloat(discamtval),
                  vi["total_amt"]
                );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;

            if (
              this.myRef.current.values.purchase_discount > 0 &&
              this.myRef.current.values.purchase_discount != ""
            ) {
              let disc_total_amt = 0;
              let disc_prop_cal = 0;
              v["productDetails"] = v.productDetails.map((vi) => {
                let peramt = calculatePercentage(
                  totalamt,
                  parseFloat(this.myRef.current.values.purchase_discount),
                  vi["total_amt"]
                );
                vi["discount_proportional_cal"] = calculatePrValue(
                  totalamt,
                  peramt,
                  vi["total_amt"]
                );
                vi["total_amt"] =
                  vi["total_amt"] -
                  calculatePrValue(totalamt, peramt, vi["total_amt"]);

                disc_prop_cal =
                  parseFloat(disc_prop_cal) +
                  parseFloat(vi["discount_proportional_cal"]);
                disc_total_amt =
                  parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
                return vi;
              });

              v["total_amt"] = disc_total_amt;
              v["discount_proportional_cal"] = disc_prop_cal;
            }
          }
        } else {
          if (
            this.myRef.current.values.purchase_discount > 0 &&
            this.myRef.current.values.purchase_discount != ""
          ) {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              let peramt = calculatePercentage(
                totalamt,
                parseFloat(this.myRef.current.values.purchase_discount),
                vi["total_amt"]
              );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                peramt,
                vi["total_amt"]
              );
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(totalamt, peramt, vi["total_amt"]);

              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;
          }
          if (
            this.myRef.current.values.sales_discount_amt > 0 &&
            this.myRef.current.values.sales_discount_amt != ""
          ) {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(
                  totalamt,
                  parseFloat(this.myRef.current.values.sales_discount_amt),
                  vi["total_amt"]
                );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;
          }
        }
        ntotalamt = parseFloat(ntotalamt) + parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("ntotalamt", { ntotalamt });
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      let add_total_amt = 0;
      let add_prop_cal = 0;
      if (v["productId"] != "") {
        v["productDetails"] = v.productDetails.map((vi) => {
          vi["total_amt"] = parseFloat(
            vi["total_amt"] +
              calculatePrValue(
                ntotalamt,
                additionalChargesTotal,
                vi["total_amt"]
              )
          ).toFixed(2);
          vi["additional_charges_proportional_cal"] = calculatePrValue(
            ntotalamt,
            additionalChargesTotal,
            vi["total_amt"]
          );
          add_total_amt =
            parseFloat(add_total_amt) + parseFloat(vi["total_amt"]);
          add_prop_cal =
            parseFloat(add_prop_cal) +
            parseFloat(vi["additional_charges_proportional_cal"]);
          return vi;
        });
        v["total_amt"] = parseFloat(add_total_amt).toFixed(2);
        v["additional_charges_proportional_cal"] = parseFloat(
          add_prop_cal
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
        let i_total_igst = 0;
        let i_total_cgst = 0;
        let i_total_sgst = 0;
        let i_final_amt = 0;
        let i_total_sales_discount_amt = 0;
        let i_total_discount_proportional_amt = 0;
        let i_total_additional_charges_proportional_amt = 0;
        let i_base_amt = 0;
        let i_total_amt = 0;
        v["productDetails"] = v.productDetails.map((vi) => {
          vi["igst"] = v["productId"]["igst"];
          vi["gst"] = v["productId"]["igst"];
          vi["cgst"] = v["productId"]["cgst"];
          vi["sgst"] = v["productId"]["sgst"];
          vi["total_igst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["igst"])
          ).toFixed(2);
          vi["total_cgst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["cgst"])
          ).toFixed(2);
          vi["total_sgst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["sgst"])
          ).toFixed(2);

          vi["final_amt"] = parseFloat(
            parseFloat(vi["total_amt"]) + parseFloat(vi["total_igst"])
          ).toFixed(2);
          // console.log("vi final_amt", vi["final_amt"]);
          i_total_amt = i_total_amt + parseFloat(vi["total_amt"]);
          i_total_igst =
            parseFloat(i_total_igst) + parseFloat(vi["total_igst"]);
          i_total_cgst =
            parseFloat(i_total_cgst) + parseFloat(vi["total_cgst"]);
          i_total_sgst =
            parseFloat(i_total_sgst) + parseFloat(vi["total_sgst"]);
          i_final_amt = parseFloat(i_final_amt) + parseFloat(vi["final_amt"]);
          i_total_sales_discount_amt =
            parseFloat(i_total_sales_discount_amt) +
            parseFloat(vi["discount_proportional_cal"]);
          i_total_discount_proportional_amt =
            parseFloat(i_total_discount_proportional_amt) +
            parseFloat(vi["discount_proportional_cal"]);
          i_total_additional_charges_proportional_amt =
            parseFloat(i_total_additional_charges_proportional_amt) +
            parseFloat(vi["additional_charges_proportional_cal"]);

          // let baseamt = parseFloat(vi["base_amt"]);
          // if (vi["dis_amt"] != "" && vi["dis_amt"] > 0) {
          //   baseamt = baseamt - parseFloat(vi["dis_amt_cal"]);
          // }
          // if (vi["dis_per"] != "" && vi["dis_per"] > 0) {
          //   baseamt = baseamt - parseFloat(vi["dis_per_cal"]);
          // }
          i_base_amt = i_base_amt + parseFloat(vi["total_b_amt"]);

          return vi;
        });
        // console.log("i_final_amt", i_final_amt);
        v["total_igst"] = parseFloat(i_total_igst).toFixed(2);
        v["total_cgst"] = parseFloat(i_total_cgst).toFixed(2);
        v["total_sgst"] = parseFloat(i_total_sgst).toFixed(2);
        v["total_b_amt"] = parseFloat(i_base_amt).toFixed(2);

        v["final_amt"] = parseFloat(i_final_amt).toFixed(2);
        famt = parseFloat(parseFloat(famt) + parseFloat(i_final_amt)).toFixed(
          2
        );

        totalqtyH += parseInt(v["qtyH"] != "" ? v["qtyH"] : 0);
        totalqtyM += parseInt(v["qtyM"] != "" ? v["qtyM"] : 0);
        totalqtyL += parseInt(v["qtyL"] != "" ? v["qtyL"] : 0);
        totaligstamt += parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt += parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt += parseFloat(v["total_sgst"]).toFixed(2);
        total_sales_discount_amt =
          parseFloat(total_sales_discount_amt) +
          parseFloat(i_total_sales_discount_amt);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(i_total_discount_proportional_amt);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(i_total_additional_charges_proportional_amt);
        // additional_charges_proportional_cal
        totalbaseamt = parseFloat(
          parseFloat(totalbaseamt) + parseFloat(v["total_b_amt"])
        ).toFixed(2);

        totaltaxableamt = parseFloat(
          parseFloat(totaltaxableamt) + parseFloat(i_total_amt)
        ).toFixed(2);
        totaltaxamt = parseFloat(
          parseFloat(totaltaxamt) + parseFloat(v["total_igst"])
        ).toFixed(2);
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
                  d_gst: v.productId.igst,
                  gst: v.productId.igst,
                  amt: parseFloat(v.total_igst),
                };
                taxIgst = [...taxIgst, innerIgstCal];
              }
            } else {
              let innerIgstCal = {
                d_gst: v.productId.igst,
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
              // console.log("innerTax", innerTax);
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
                  d_gst: v.productId.igst,
                  gst: v.productId.cgst,
                  amt: parseFloat(v.total_cgst),
                };
                taxCgst = [...taxCgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                d_gst: v.productId.igst,
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
                  d_gst: v.productId.igst,

                  gst: v.productId.sgst,
                  amt: parseFloat(v.total_sgst),
                };
                taxSgst = [...taxSgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                d_gst: v.productId.igst,

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
    // console.log("famt", famt);
    let roundoffamt = Math.round(famt);

    let roffamt = parseFloat(roundoffamt - famt).toFixed(2);

    this.myRef.current.setFieldValue("totalqtyH", totalqtyH);
    this.myRef.current.setFieldValue("totalqtyM", totalqtyM);
    this.myRef.current.setFieldValue("totalqtyL", totalqtyL);

    // this.myRef.current.setFieldValue("totalqty", totalqty);
    this.myRef.current.setFieldValue(
      "total_sales_discount_amt",
      parseFloat(total_sales_discount_amt).toFixed(2)
    );
    // ``;
    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );

    this.myRef.current.setFieldValue("roundoff", roffamt);
    this.myRef.current.setFieldValue(
      "total_base_amt",
      parseFloat(totalbaseamt).toFixed(2)
    );
    // this.myRef.current.setFieldValue(
    //   "total_b_amt",
    //   parseFloat(t_r_baseamt).toFixed(2)
    // );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(totaltaxableamt).toFixed(2)
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
      "totaligst",
      parseFloat(totaligstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      parseFloat(roundoffamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    // this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
    this.setState(
      { rows: frow, additionchargesyes: false, taxcal: taxState },
      () => {
        // if (this.state.rows.length != 30) {
        //   this.initRow(30 - this.state.rows.length);
        // }
        if (this.state.additionalCharges.length != 5) {
          this.initAdditionalCharges(5 - this.state.additionalCharges.length);
        }
      }
    );
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
        // if (v['qtyH'] != '' && v['rateH'] != '') {
        //   v['base_amt_H'] = parseInt(v['qtyH']) * parseFloat(v['rateH']);
        // }
        // if (v['qtyM'] != '' && v['rateM'] != '') {
        //   v['base_amt_M'] = parseInt(v['qtyM']) * parseFloat(v['rateM']);
        // }
        // if (v['qtyL'] != '' && v['rateL'] != '') {
        //   v['base_amt_L'] = parseInt(v['qtyL']) * parseFloat(v['rateL']);
        // }

        // v['base_amt'] = v['base_amt_H'] + v['base_amt_M'] + v['base_amt_L'];
        let baseamt = 0;
        v["units"] = v.units.map((vi) => {
          if (vi["qty"] != "" && vi["rate"] != "") {
            vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
          } else {
            vi["base_amt"] = 0;
          }

          vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
          baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
          return vi;
        });

        v["base_amt"] = baseamt;

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

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
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
        total_sales_discount_amt =
          parseFloat(total_sales_discount_amt) +
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
    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_sales_discount_amt",
      parseFloat(total_sales_discount_amt).toFixed(2)
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
    // this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });

    this.setState(
      { rows: frow, additionchargesyes: false, taxcal: taxState },
      () => {
        // if (this.state.rows.length != 30) {
        //   this.initRow(30 - this.state.rows.length);
        // }
        if (this.state.additionalCharges.length != 5) {
          this.initAdditionalCharges(5 - this.state.additionalCharges.length);
        }
      }
    );
  };

  handleTranxModal = (status) => {
    this.setState({ transaction_mdl_show: status });
    if (status == false) {
      this.handleAdditionalChargesSubmit();
    }
  };
  handleBillPayableAmtChange = (value, index) => {
    console.log({ value, index });
    const { billLst } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);

      // console.log('payable_amt', v['payable_amt']);
      if (i == index) {
        v["credit_paid_amt"] = parseFloat(value);
        v["credit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
  };

  handleFetchData = (sundry_debtors_id) => {
    // ;
    const { billLst } = this.state;
    let reqData = new FormData();

    reqData.append("sundry_debtors_id", sundry_debtors_id);
    listTranxCreditNotes(reqData)
      .then((response) => {
        let res = response.data;
        console.log({ res });
        // ;
        let data = res.list;
        if (data.length == 0) {
          console.log("Else.....>", data);
          this.callCreateInvoice();
        } else if (data.length > 0) {
          this.setState({ billLst: data }, () => {
            if (data.length > 0) {
              this.setState({ adjusmentbillmodal: true });
            }
          });
        }
      })
      .catch((error) => {});
  };

  callCreateInvoice = () => {
    console.log("callCreateInvoice CreateInvoice");
    //;
    const {
      invoice_data,
      additionalCharges,
      additionalChargesTotal,
      rows,
      initVal,
      supplierNameLst,
      salesAccLst,
      copt,
      rowDelDetailsIds,
      delAdditionalCahrgesLst,
    } = this.state;
    let invoiceValues = this.myRef.current.values;
    let paymentvalues = this.paymentRef.current.values;
    console.log("before API Call==-->>>", { invoiceValues, initVal });

    let requestData = new FormData();
    console.log({ salesAccLst });

    // !Invoice Data
    {
      requestData.append("id", invoice_data.id);
      requestData.append("sales_sr_no", invoiceValues.sales_sr_no);
      requestData.append(
        "bill_dt",
        moment(invoiceValues.transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
      );
      requestData.append("paymentMode", paymentvalues.paymentReference);
      console.log("paymentvalues", paymentvalues);

      requestData.append("bill_no", invoiceValues.bill_no);

      requestData.append("customer_name", invoiceValues.clientName);
      requestData.append("mobile_number", invoiceValues.clientMobile);
      // !Invoice Data
      requestData.append("roundoff", invoiceValues.roundoff);
      requestData.append("narration", invoiceValues.narration);
      requestData.append("total_base_amt", invoiceValues.total_base_amt);
      requestData.append("totalamt", invoiceValues.totalamt);

      let frow = [];
      rows.map((v, i) => {
        if (v.productId != "") {
          let newObj = {
            details_id: v.details_id ? v.details_id : 0,
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
            invoice_dis_amt: v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0,
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
            b_purchase_rate: v.b_purchase_rate != "" ? v.b_purchase_rate : 0,
            b_expiry: v.b_expiry ? moment(v.b_expiry).format("yyyy-MM-DD") : "",
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
          // console.log("newObj >>>> ", newObj);
          frow.push(newObj);
          // console.log("frow ----------- ", frow);
        }
      });

      var filtered = frow.filter(function (el) {
        return el != null;
      });

      requestData.append("row", JSON.stringify(filtered));

      let filterRowDetail = [];
      if (rowDelDetailsIds.length > 0) {
        filterRowDetail = rowDelDetailsIds.map((v) => {
          return { del_id: v };
        });
      }
      console.log("filterRowDetail", filterRowDetail);
      requestData.append("rowDelDetailsIds", JSON.stringify(filterRowDetail));

      if (invoiceValues.total_qty !== "") {
        requestData.append(
          "totalqty",
          invoiceValues.total_qty !== "" ? parseInt(invoiceValues.total_qty) : 0
        );
      }
      if (invoiceValues.total_free_qty !== "") {
        requestData.append(
          "total_free_qty",
          invoiceValues.total_free_qty !== "" ? invoiceValues.total_free_qty : 0
        );
      }
      requestData.append("total_base_amt", invoiceValues.total_base_amt);
      // !Discount
      requestData.append(
        "total_invoice_dis_amt",
        invoiceValues.total_invoice_dis_amt
      );
      // !Taxable Amount
      requestData.append("taxable_amount", invoiceValues.total_taxable_amt);
      // !Bill Amount
      requestData.append("bill_amount", invoiceValues.bill_amount);

      updateCounterSales(requestData)
        .then((response) => {
          console.log("in create");
          let res = response.data;
          if (res.responseStatus === 200) {
            MyNotifications.fire(
              {
                show: true,
                icon: "confirm",
                title: "Confirm",
                msg: "Do you want Print",
                is_button_show: false,
                is_timeout: false,
                delay: 0,
                handleSuccessFn: () => {
                  this.getInvoiceBillsLstPrint(initVal.serialNo);
                },
                handleFailFn: () => {
                  eventBus.dispatch(
                    "page_change",
                    "tranx_sales_countersale_list"
                  );
                },
              },
              () => {
                console.warn("return_data");
              }
            );
            this.setState({ paymetmodel: false });
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
    }
  };

  handleImage = () => {
    let { icon } = this.state;
    switch (icon) {
      case "success":
        return <img alt="" src={success_icon} />;
        break;
      case "warning":
        return <img alt="" src={warning_icon} />;
        break;
      case "error":
        return <img alt="" src={error_icon} />;
        break;
      case "confirm":
        return <img alt="" src={confirm_icon} />;
        break;
      default:
        return <img alt="" src={success_icon} />;
        break;
    }
  };

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "create");
    getInvoiceBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        console.log("responseData ---->>>", responseData);
        eventBus.dispatch("callprint", {
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.invoice_details.product_details,
        });

        eventBus.dispatch("page_change", {
          // from: "tranx_sales_invoice_create",
          to: "tranx_sales_countersale_list",
          isNewTab: false,
        });
      }
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

  handleLstBrand = (lstBrand) => {
    this.setState({ lstBrand: lstBrand });
  };
  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
  };
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  render() {
    const {
      adjusmentbillmodal,
      initVal,
      lstBrand,
      copt,
      selectedBillsdebit,
      billLst,
      isAllCheckedCredit,
      outstanding_sales_return_amt,
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
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      Clietdetailmodal,
      clientinfo,
      taxcal,
      showPrint,
      is_button_show,
      paymetmodel,
      batchModalShow,
      batchInitVal,
      batchData,
      isBatch,
      is_expired,
      tr_id,
      rowDelDetailsIds,

      newBatchModal,
      selectProductModal,
      selectedProduct,
      productData,
      rowIndex,
      levelOpt,
      batchDetails,
      product_supplier_lst,
      product_hover_details,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
      add_button_flag,
      selectSerialModal,
      batch_data_selected,
      batchHideShow,
      serialNoLst,
      costingInitVal,
      costingMdl,
      b_details_id,
      transactionTableStyle,
    } = this.state;
    // console.log(rows);
    return (
      <>
        <div className="purchase-tranx" style={{ overflow: "hidden" }}>
          {/* <h6>Purchase Invoice</h6> */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={invoice_data}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to Submit",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    console.log({ outstanding_sales_return_amt });
                    this.setState({ paymetmodel: true });
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
                noValidate
                autoComplete="off"
                className="frm-tnx-purchase-invoice"
              >
                <>
                  <div className="div-style">
                    <div>
                      <Row className="mx-0 inner-div-style">
                        <Row>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className=" pe-0 my-auto"
                              >
                                <Form.Label>Counter Sr. No.</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  // autoFocus="true"
                                  className="tnx-pur-inv-text-box"
                                  placeholder=" Sr No. "
                                  name="sales_sr_no"
                                  disabled
                                  id="sales_sr_no"
                                  onChange={handleChange}
                                  value={values.sales_sr_no}
                                  isValid={
                                    touched.sales_sr_no && !errors.sales_sr_no
                                  }
                                  isInvalid={!!errors.sales_sr_no}
                                  readOnly={true}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sales_sr_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto p-0"
                              >
                                <Form.Label>Counter Date</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  disabled
                                  className="tnx-pur-inv-date-style"
                                  name="transaction_dt"
                                  placeholderText="DD/MM/YYYY"
                                  id="transaction_dt"
                                  value={values.transaction_dt}
                                ></Form.Control>

                                <span className="text-danger errormsg">
                                  {errors.transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Row>
                              <Col
                                lg={3}
                                md={3}
                                sm={3}
                                xs={3}
                                className="my-auto px-0"
                              >
                                <Form.Label> Client Name</Form.Label>
                              </Col>

                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Control
                                  className="tnx-pur-inv-text-box"
                                  type="text"
                                  placeholder="Client name"
                                  name="clientName"
                                  autoFocus={true}
                                  id="clientName"
                                  onChange={handleChange}
                                  value={values.clientName}
                                  isValid={
                                    touched.clientName && !errors.clientName
                                  }
                                  isInvalid={!!errors.clientName}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.clientName}
                                </Form.Control.Feedback>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto pe-0"
                              >
                                <Form.Label> Counter Sale No.</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  className="tnx-pur-inv-text-box"
                                  type="text"
                                  autoComplete="off"
                                  placeholder="Counter Sale No."
                                  name="bill_no"
                                  id="bill_no"
                                  onChange={handleChange}
                                  value={values.bill_no}
                                  isValid={touched.bill_no && !errors.bill_no}
                                  isInvalid={!!errors.bill_no}
                                  /*  onInput={(e) => {
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  }} */
                                />
                                <span className="text-danger errormsg">
                                  {errors.bill_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row className="mt-1">
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto pe-2"
                              >
                                <Form.Label> Client Mobile</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  className="tnx-pur-inv-text-box"
                                  type="text"
                                  placeholder="Client Mobile"
                                  name="clientMobile"
                                  id="clientMobile"
                                  onChange={handleChange}
                                  value={values.clientMobile}
                                  isValid={
                                    touched.clientMobile && !errors.clientMobile
                                  }
                                  isInvalid={!!errors.clientMobile}
                                  onKeyDown={(e) => {
                                    // if (e.shiftKey && e.key === "Tab") {
                                    // } else if (
                                    //   e.key === "Tab" &&
                                    //   !e.target.value.trim()
                                    // )
                                    //   e.preventDefault();

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
                                            .getElementById("clientMobile")
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
                                            .getElementById("clientMobile")
                                            .focus();
                                        }, 1000);
                                      }
                                    }
                                  }}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.clientMobile}
                                </Form.Control.Feedback>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>
                  {/* {JSON.stringify(
                    getUserControlData("is_level_a", this.props.userControl)
                  )}
                  {JSON.stringify(
                    getUserControlData("is_level_b", this.props.userControl)
                  )}
                  {JSON.stringify(
                    getUserControlData("is_level_c", this.props.userControl)
                  )} */}{" "}
                  <CmpTRow
                    productModalStateChange={this.productModalStateChange.bind(
                      this
                    )}
                    get_supplierlist_by_productidFun={this.get_supplierlist_by_productidFun.bind(
                      this
                    )}
                    handleUnitChange={this.handleUnitChange.bind(this)}
                    handleAddRow={this.handleAddRow.bind(this)}
                    handleRemoveRow={this.handleRemoveRow.bind(this)}
                    openSerialNo={this.openSerialNo.bind(this)}
                    openBatchNo={this.openBatchNo.bind(this)}
                    getProductBatchList={this.getProductBatchList.bind(this)}
                    add_button_flag={add_button_flag}
                    rows={rows}
                    batchHideShow={batchHideShow}
                    productLst={productLst}
                    transactionTableStyle={transactionTableStyle}
                    productId="TSCSEProductId-"
                    addBtnId="TSCSEAddBtn-"
                  />
                  <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={4}>
                      <Row>
                        <Col lg={6} className="my-auto">
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
                    <Col lg={4}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Batch Expiry:</span>
                          {product_hover_details.batch_expiry ? (
                            <span className="span-value">
                              {/* {product_hover_details.batch_expiry} */}
                              {moment(
                                product_hover_details.batch_expiry
                              ).format("DD-MM-YYYY") === "Invalid date"
                                ? ""
                                : moment(
                                    product_hover_details.batch_expiry
                                  ).format("DD/MM/YYYY")}
                            </span>
                          ) : (
                            <></>
                          )}

                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">M.R.P.:</span>
                          <span className="span-value">
                            {/* {product_hover_details.mrp} */}
                            {INRformat.format(product_hover_details.mrp)}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Profit:</span>
                          {/* <span className="span-value">-</span> */}
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6}>
                          <span className="span-lable">Barcode:</span>
                          <span className="span-value">
                            {product_hover_details.barcode}
                          </span>
                          {/* <span className="custom_hr_style">|</span> */}
                        </Col>
                      </Row>
                    </Col>
                    {/* <Col lg={2}>
                      <Row>
                        <Col lg={12} className="my-auto">
                          <span className="span-lable">Package:</span>
                          <span className="span-value">
                            {product_hover_details.packing}
                          </span>
                        </Col>
                        // <Col lg={6} className="my-auto">
                        //   <span className="span-lable">Tax Type:</span>
                        //   <span className="span-value">{product_hover_details.tax_type}</span>
                        //   <span className="custom_hr_style">|</span>
                        // </Col>
                      </Row>
                    </Col> */}

                    {/* <Col lg={{ span: 1, offset: 2 }}>
                      <span className="span-lable">Gross Total</span>
                    </Col>
                    <Col lg={1}>
                      <span className="span-value">
                        {parseFloat(values.totalamt).toFixed(2)}
                      </span>
                    </Col> */}
                  </Row>
                  <Row className="mx-0 btm-data-saleOrder">
                    <Col lg={8} md={8} sm={8} xs={8}>
                      <Row className="mt-2 pb-2">
                        <Col lg={1} md={1} sm={1} xs={1} className="my-auto">
                          <Form.Label>Narrations</Form.Label>
                        </Col>
                        <Col sm={11}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Narration"
                            className="tnx-pur-inv-text-box"
                            id="narration"
                            onChange={handleChange}
                            name="narration"
                            value={values.narration}
                            onInput={(e) => {
                              e.target.value = this.getDataCapitalised(
                                e.target.value
                              );
                            }}
                          />
                        </Col>
                      </Row>
                      <div className="tnx-pur-inv-info-table">
                        <Table responsive>
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
                                    <td>
                                      {/* {v.mrp} */}
                                      {INRformat.format(v.mrp)}
                                    </td>
                                    <td>{v.quantity}</td>
                                    <td>
                                      {/* {v.rate} */}
                                      {INRformat.format(v.rate)}
                                    </td>
                                    <td>
                                      {/* {v.cost} */}
                                      {INRformat.format(v.cost)}
                                    </td>
                                    <td>{v.dis_per}</td>
                                    <td>
                                      {/* {v.dis_amt} */}
                                      {INRformat.format(v.dis_per)}
                                    </td>
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
                      style={{ borderLeft: "1px solid #D9D9D9" }}
                    >
                      <Row>
                        <Col lg={6} className="for_remove_padding">
                          <span className="tnx-pur-inv-span-text">
                            Total Qty:
                          </span>
                          <span className="errormsg">{values.total_qty}</span>
                        </Col>
                        <Col lg={6} className="for_remove_padding">
                          <span className="tnx-pur-inv-span-text">
                            R.Off(+/-):
                          </span>
                          <span className="errormsg">
                            {/* {parseFloat(values.roundoff).toFixed(2)} */}
                            {INRformat.format(values.roundoff)}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Table className="tnx-pur-inv-btm-amt-tbl">
                        <tbody>
                          <tr>
                            <td className="py-0">Gross Total</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_base_amt).toFixed(2)} */}
                              {INRformat.format(values.total_base_amt)}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Discount</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_invoice_dis_amt).toFixed(
                                2
                              )} */}
                              {INRformat.format(values.total_invoice_dis_amt)}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">Total</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_taxable_amt).toFixed(2)} */}
                              {INRformat.format(values.total_taxable_amt)}
                              {/* 99999.99 */}
                            </td>
                          </tr>
                          <tr>
                            <th>Bill Amount</th>
                            <th className="text-end">
                              {/* {parseFloat(values.bill_amount).toFixed(2)} */}
                              {INRformat.format(values.bill_amount)}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="btm-row-size">
                        <Button
                          className="successbtn-style"
                          type="submit"
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              this.myRef.current.handleSubmit();
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
                                  eventBus.dispatch(
                                    "page_change",
                                    "tranx_sales_countersale_list"
                                  );
                                },
                                handleFailFn: () => {},
                              },
                              () => {
                                console.warn("return_data");
                              }
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
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
                                    eventBus.dispatch(
                                      "page_change",
                                      "tranx_sales_countersale_list"
                                    );
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
                      </p>
                      {/* {JSON.stringify(selectedLedgerNo)} */}
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
          <Modal
            show={invoiceedit}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ invoiceedit: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Sales Invoice
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <div className="purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={invoice_data}
                  validationSchema={Yup.object().shape({
                    sales_sr_no: Yup.string()
                      .trim()
                      .required("Purchase no is required"),
                    transaction_dt: Yup.string().required(
                      "Transaction date is required"
                    ),
                    salesAccId: Yup.object().required("select sales account"),
                    bill_no: Yup.string()
                      .trim()
                      .required("bill no is required"),
                    bill_dt: Yup.string().required("Bill dt is required"),
                    // clientCodeId: Yup.object().required("select client code"),
                    clientNameId: Yup.object().required("select client name"),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    // console.log('values', values);
                    this.setState({
                      invoice_data: values,
                      invoiceedit: false,
                    });
                    // this.props.history.push({
                    //   pathname: '/SalesInvoiceCreate',
                    //   state: values,
                    // });
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
                      {/* {JSON.stringify(invoice_data)} */}
                      <Row>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>
                              Sales Sr. No.{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>{" "}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="pl-2"
                              placeholder=" "
                              name="sales_sr_no"
                              id="sales_sr_no"
                              onChange={handleChange}
                              value={values.sales_sr_no}
                              isValid={
                                touched.sales_sr_no && !errors.sales_sr_no
                              }
                              isInvalid={!!errors.sales_sr_no}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.sales_sr_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Bill Date{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              className="pl-2"
                              name="bill_dt"
                              id="bill_dt"
                              onChange={handleChange}
                              value={values.bill_dt}
                              isValid={touched.bill_dt && !errors.bill_dt}
                              isInvalid={!!errors.bill_dt}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.bill_dt}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Bill{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Bill No."
                              name="bill_no"
                              id="bill_no"
                              onChange={handleChange}
                              value={values.bill_no}
                              isValid={touched.bill_no && !errors.bill_no}
                              isInvalid={!!errors.bill_no}
                              readOnly
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.bill_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group className="">
                            <Form.Label>
                              Sales A/c.{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Select
                              className="selectTo"
                              styles={customStyles}
                              isClearable
                              options={salesAccLst}
                              borderRadius="0px"
                              colors="#729"
                              name="salesAccId"
                              onChange={(v) => {
                                setFieldValue("salesAccId", v);
                              }}
                              value={values.salesAccId}
                            />

                            <span className="text-danger errormsg">
                              {errors.salesAccId}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col md="4">
                          <Form.Group className="">
                            <Form.Label>
                              Client Name{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Select
                              className="selectTo"
                              styles={customStyles}
                              isClearable
                              options={supplierNameLst}
                              borderRadius="0px"
                              colors="#729"
                              name="clientNameId"
                              onChange={(v) => {
                                // if (v != null) {
                                //   setFieldValue(
                                //     "clientCodeId",
                                //     getSelectValue(supplierCodeLst, v.value)
                                //   );
                                // }
                                setFieldValue("clientNameId", v);
                              }}
                              value={values.clientNameId}
                            />

                            <span className="text-danger errormsg">
                              {errors.clientNameId}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group className="">
                            <Form.Label>
                              Client Name{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Select
                              className="selectTo"
                              styles={customStyles}
                              isClearable
                              options={supplierNameLst}
                              borderRadius="0px"
                              colors="#729"
                              name="clientNameId"
                              onChange={(v) => {
                                // if (v != null) {
                                //   setFieldValue(
                                //     "clientCodeId",
                                //     getSelectValue(supplierCodeLst, v.value)
                                //   );
                                // }
                                setFieldValue("clientNameId", v);
                              }}
                              value={values.clientNameId}
                            />

                            <span className="text-danger errormsg">
                              {errors.clientNameId}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col md="4" className="btn_align mt-4">
                          <Button className="createbtn mt-2" type="submit">
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </div>
            </Modal.Body>
          </Modal>

          <Modal
            //show={serialnopopupwindow}
            show={Clietdetailmodal}
            size="sm"
            className="mt-5 mainmodal"
            onHide={() => {
              this.handleClientDetails(false);
            }}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Client Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2">
              {/* <pre>{JSON.stringify(clientinfo, undefined, 2)}</pre> */}

              <div className="purchasescreen">
                {clientinfo && (
                  <Table bordered>
                    <thead>
                      <th> Name </th>
                      <th>Address </th>
                      <th>Contact No </th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {clientinfo &&
                            clientinfo.data &&
                            clientinfo.data.sundry_debtors_name}
                        </td>
                        <td>
                          {clientinfo &&
                            clientinfo.data &&
                            clientinfo.data.address}
                        </td>
                        <td>
                          {clientinfo &&
                            clientinfo.data &&
                            clientinfo.data.mobile}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer className="p-1">
              <Button
                //className="createbtn seriailnobtn"
                onClick={() => {
                  this.handleClientDetails(false);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Payment Modal */}
          <Modal
            show={paymetmodel}
            size="lg"
            className="mt-5 invoice-mdl-style"
            onHide={() => this.setState({ paymetmodel: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              // closeVariant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Payment Mode
              </Modal.Title>
            </Modal.Header>

            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              innerRef={this.paymentRef}
              enableReinitialize={true}
              initialValues={{
                creditnoteNo: "",
                paymentReference: "",
                bank_payment_type: "",
                bank_payment_no: "",
              }}
              validationSchema={Yup.object().shape({
                paymentReference: Yup.string().required("Select Option"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("values", values);
                this.callCreateInvoice();
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
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className="purchaseumodal p-4 p-invoice-modal ">
                    <Row>
                      <Col md="2">
                        <Form.Group className="gender nightshiftlabel">
                          <Form.Label>
                            <input
                              name="paymentReference"
                              type="radio"
                              value="cash"
                              checked={
                                values.paymentReference === "cash"
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              className="mr-3"
                            />
                            <span className="ms-2">Cash</span>
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="nightshiftlabel">
                          <Form.Label className="ml-3">
                            <input
                              name="paymentReference"
                              type="radio"
                              value="online"
                              onChange={handleChange}
                              checked={
                                values.paymentReference === "online"
                                  ? true
                                  : false
                              }
                              className="mr-3"
                            />
                            <span className="ms-2">Online</span>
                          </Form.Label>

                          <span className="text-danger">
                            {errors.paymentReference && "Select Option"}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      className="create-btn float-end mt-2 mb-2"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>

          {/* Show Print Modal */}
          <Modal
            show={showPrint}
            size="md"
            // className={`${icon}-alert`}
            onHide={() => {
              this.setState({ show: false });
            }}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <CloseButton
                variant="black"
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleHide();
                }}
              />
            </Modal.Header>
            <Modal.Body className="text-center">
              {this.handleImage()}
              {/* <p className="title">{title}</p>
              <p className="msg">{msg}</p> */}
              {this.state.icon === "confirm" && (
                <>
                  <Button
                    className="sub-button"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.getInvoiceBillsLstPrint(is_button_show);

                      // this.handleHide();
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    className="sub-button btn-danger"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();

                      eventBus.dispatch(
                        "page_change",
                        "tranx_sales_countersale_list"
                      );
                    }}
                  >
                    No
                  </Button>
                </>
              )}
              {isNaN(is_button_show) !== false && is_button_show == true && (
                <Button
                  className="sub-button"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleHide();
                  }}
                >
                  Ok
                </Button>
              )}
            </Modal.Body>
          </Modal>

          {/* Product Modal Starts */}
          <MdlProduct
            productModalStateChange={this.productModalStateChange.bind(this)}
            get_supplierlist_by_productidFun={this.get_supplierlist_by_productidFun.bind(
              this
            )}
            getProductPackageLst={this.getProductPackageLst.bind(this)}
            rows={rows}
            rowIndex={rowIndex}
            selectProductModal={selectProductModal}
            selectedProduct={selectedProduct}
            productData={productData}
            userControl={this.props.userControl}
          />
          {/* Product Modal Ends */}

          {/* Serial No Modal Starts */}
          <MdlSerialNo
            productModalStateChange={this.productModalStateChange.bind(this)}
            selectSerialModal={selectSerialModal}
            rows={rows}
            rowIndex={rowIndex}
            serialNoLst={serialNoLst}
          />
          {/* Serial No Modal Ends */}

          {/* Batch No Modal Starts */}

          <MdlBatchNo
            productModalStateChange={this.productModalStateChange.bind(this)}
            newBatchModal={newBatchModal}
            rows={rows}
            rowIndex={rowIndex}
            batchInitVal={batchInitVal}
            b_details_id={b_details_id}
            isBatch={isBatch}
            batchData={batchData}
            is_expired={is_expired}
            tr_id={tr_id}
            batch_data_selected={batch_data_selected}
            selectedSupplier={
              this.myRef.current
                ? this.myRef.current.values.selectedSupplier
                : ""
            }
          />
          {/* Batch No Modal Ends */}

          {/* Costing  Modal Starts */}

          <MdlCosting
            productModalStateChange={this.productModalStateChange.bind(this)}
            costingMdl={costingMdl}
            costingInitVal={costingInitVal}
            rows={rows}
            rowIndex={rowIndex}
            b_details_id={b_details_id}
            isBatch={isBatch}
            batchData={batchData}
            is_expired={is_expired}
            tr_id={tr_id}
            batch_data_selected={batch_data_selected}
            selectedSupplier={
              this.myRef.current
                ? this.myRef.current.values.selectedSupplier
                : ""
            }
          />
          {/* Costing No Modal Ends */}
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

export default connect(mapStateToProps, mapActionsToProps)(CounterSaleEdit);
