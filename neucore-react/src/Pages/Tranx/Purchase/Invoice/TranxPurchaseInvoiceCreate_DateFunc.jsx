import React, { Component } from "react";

import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";

import {
  MyTextDatePicker,
  getSelectValue,
  AuthenticationCheck,
  eventBus,
  MyNotifications,
  purchaseSelect,
  fnTranxCalculation,
  calculatePercentage,
  isUserControlExist,
  OnlyEnterNumbers,
  allEqual,
  isUserControl,
  OnlyEnterAmount,
  getValue,
} from "@/helpers";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import search from "@/assets/images/search_icon@3x.png";
import {
  getPurchaseAccounts,
  getLastPurchaseInvoiceNo,
  createPurchaseInvoice,
  getAdditionalLedgers,
  authenticationService,
  getProductFlavourList,
  get_Product_batch,
  listTranxDebitesNotes,
  getValidatePurchaseInvoice,
  checkInvoiceDateIsBetweenFY,
  get_supplierlist_by_productid,
  updateProductStock,
  getPurchaseInvoiceBill,
  transaction_ledger_list,
} from "@/services/api_functions";
import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import MdlLedgerIndirectExp from "@/Pages/Tranx/CMP/MdlLedgerIndirectExp";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel } from "@fortawesome/free-solid-svg-icons";

class TranxPurchaseInvoiceCreate extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.taxbatchRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.mfgDateRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.inputRef1 = React.createRef();
    this.state = {
      invoice_data: {
        filterListSales: "SC",
        filterListCreate: "SC",
        selectedSupplier: "",
        pi_sr_no: "",
        pi_no: "",
        pi_transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        pi_invoice_dt: moment(new Date()).format("DD/MM/YYYY"),
        purchaseId: "",
        image: "",
        supplierCodeId: "",
        supplierNameId: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
        debitnoteNo: "",
        newReference: "true",
        purchase_discount: 0,
        purchase_discount_amt: 0,
        total_purchase_discount_amt: 0,
        total_base_amt: 0,
        total_b_amt: 0,
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
        gstId: "",
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
      productId: "",
      ledgerId: "",
      setLedgerId: false,
      setProductId: false,
      setProductRowIndex: -1,

      batchHideShow: true,
      isBranch: false,
      purchaseAccLst: [],
      costingInitVal: "",
      supplierCodeLst: [],
      lstGst: [],

      ledgerModal: false,
      ledgerModalIndExp: false,
      ledgerModalIndExp1: false,
      ledgerModalIndExp2: false,
      ledgerModalIndExp3: false,
      ledgerData: "",
      ledgerDataIndExp: "",
      selectedLedger: "",
      selectedLedgerIndExp: "",
      rows: [],
      rowIndex: -1,
      selectProductModal: false,
      selectedProduct: "",
      productData: "",
      add_button_flag: false,
      product_supplier_lst: [],
      lstBrand: [],
      productLst: [],
      rowDelDetailsIds: [],
      selectSerialModal: false,
      serialNoLst: [],
      newBatchModal: false,
      batchInitVal: "",
      b_details_id: 0,
      isBatch: false,
      batchData: [],
      is_expired: false,
      tr_id: "",
      batch_data_selected: "",
      product_hover_details: "",
      isRoundOffCheck: true,
      showLedgerDiv: false,
      selectedLedgerNo: 1,
      lstAdditionalLedger: [],
      orglstAdditionalLedger: [],
      // showLedgerDiv: false,
      addchgElement1: "",
      addchgElement2: "",
      gstId: "",
      selectedPendingOrder: [],
      selectedPendingChallan: [],
      additionalChargesTotal: 0,
      costingMdl: false,
      costingInitVal: "",
      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",

      from_source: "tranx_purchase_invoice_create",

      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",

      ledgerList: [],
      orgLedgerList: [],
      adjustbillshow: false,
      billLst: [],
      selectedBillsdebit: [],
      billAmount: "",
      errorArrayBorder: "",
    };
  }

  transaction_ledger_listFun = () => {
    let requestData = new FormData();
    requestData.append("search", "");
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        console.log("res---->", res.list);
        if (res.responseStatus == 200) {
          this.setState({
            ledgerList: res.list,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id, ...v };
          });
          this.setState({ purchaseAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.unique_code.toUpperCase().includes("PUAC")
            );
            const { prop_data } = this.props.block;
            console.log("prop_data", prop_data);

            if (v != null && v != undefined && prop_data.invoice_data != null) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["purchaseId"] = v[0];
              this.setState({ invoice_data: init_d });
            } else if (
              v != null &&
              v != undefined &&
              !prop_data.hasOwnProperty("invoice_data")
            ) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["purchaseId"] = v[0];
              this.setState({ invoice_data: init_d });
              console.log("invoice_data", init_d);
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  /**** Check Invoice date between Fiscal year *****/
  checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
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
              title: "Invoice date not valid as per Current Date",
              msg: "Do you want continue with invoice date",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => {
                if (invoiceDate != "") {
                  setTimeout(() => {
                    this.inputRef1.current.focus();
                  }, 500);
                }
              },
              handleFailFn: () => {
                // setFieldValue("pi_invoice_dt", "");
                // eventBus.dispatch("page_change", {
                //   from: "tranx_purchase_invoice_create",
                //   to: "tranx_purchase_invoice_list",
                //   isNewTab: false,
                // });
                setTimeout(() => {
                  document.getElementById("pi_invoice_dt").focus();
                }, 500);
                // this.reloadPage();
              },
            },
            () => {}
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setLastPurchaseSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data } = this.state;
          invoice_data["pi_sr_no"] = res.count;
          // invoice_data["pi_no"] = res.count;

          this.setState({ invoice_data: invoice_data });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  /***** Validations of Purchase Invoice for Duplicate Invoice Numbers */
  validatePurchaseInvoice = (invoice_no, supplier_id) => {
    //console.log("Invoice Input", invoice_no, supplier_id);
    let reqData = new FormData();
    reqData.append("supplier_id", supplier_id);
    reqData.append("bill_no", invoice_no);
    getValidatePurchaseInvoice(reqData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            // is_button_show: true,
            is_timeout: true,
            delay: 1500,
          });
          //this.reloadPage();
          if (this.myRef.current) {
            // this.myRef.current.setFieldValue("pi_no", "");
            setTimeout(() => {
              document.getElementById("pi_no").focus();
            }, 1000);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  /**** Validation of FSSAI and DRUG Expriry of suppliers *****/

  handlePropsData = (prop_data) => {
    if (prop_data.invoice_data) {
      this.setState(
        {
          invoice_data: prop_data.invoice_data,
          rows: prop_data.rows,
          productId: prop_data.productId,
          ledgerId: prop_data.ledgerId,
        },
        () => {
          this.setState({
            productId: prop_data.productId,
            ledgerId: prop_data.ledgerId,
            setLedgerId: true,
            setProductId: true,
            setProductRowIndex: prop_data.rowIndex,
          });
        }
      );
    } else {
      // this.setState({ invoice_data: prop_data });
    }
  };

  getInvoiceBillsLstPrint = (id) => {
    console.log("id Invoice----", id);
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "create");
    reqData.append("source", "purchase_invoice");
    getPurchaseInvoiceBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        console.log("responseData ---->>>", responseData);
        eventBus.dispatch("callprint", {
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.product_details,
        });

        eventBus.dispatch("page_change", {
          to: "tranx_purchase_invoice_list",
          isNewTab: false,
        });
      }
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setLastPurchaseSerialNo();
      this.lstPurchaseAccounts();
      this.initRow();
      this.lstAdditionalLedgers();

      let { prop_data } = this.props.block;
      console.log("prop_data", prop_data);
      this.handlePropsData(prop_data);

      this.transaction_ledger_listFun();
    }
  }

  ledgerModalStateChange = (ele, val) => {
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else {
      this.setState({ [ele]: val });
    }
  };

  ledgerIndExpModalStateChange = (ele, val) => {
    if (ele == "ledgerModalIndExp" && val == true) {
      this.setState({ ledgerDataIndExp: "", [ele]: val });
    }
    // else if (ele == "ledgerDataIndExp2" && val == true) {
    //   this.setState({ ledgerDataIndExp: "", [ele]: val });
    // } else if (ele == "ledgerDataIndExp3" && val == true) {
    //   this.setState({ ledgerDataIndExp: "", [ele]: val });
    // }
    else {
      this.setState({ [ele]: val });
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
        inventoryId: 0,
        selectedProduct: "",
        productId: "",
        levelaId: "",
        levelbId: "",
        levelcId: "",
        unitCount: "",
        unitId: "",
        unit_conv: 0,
        qty: "",
        free_qty: 0,
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
        costing: 0,
        costing_with_tax: 0,
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

  productModalStateChange = (obj, callTrxCal = false) => {
    this.setState(obj, () => {
      if (callTrxCal) {
        this.handleTranxCalculation();
      }
    });
    if (obj.costingMdl == false) {
      let id = parseInt(this.state.rows.length) - 1;
      if (document.getElementById("TPICAddBtn-" + id) != null) {
        setTimeout(() => {
          document.getElementById("TPICAddBtn-" + id).focus();
        }, 250);
      }
    }
  };

  get_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    requestData.append("productId", product_id);
    get_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        let onlyfive = [];
        if (res.responseStatus == 200) {
          let idc = res.data;
          if (idc.length <= 10) {
            for (let i = 0; i < idc.length; i++) {
              onlyfive.push(idc[i]);
            }
          } else {
            var count = 1;
            onlyfive = idc.filter((e) => {
              if (count <= 10) {
                count++;
                return e;
              }
              return null;
            });
          }

          this.setState({
            product_supplier_lst: onlyfive,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ product_supplier_lst: [] });
      });
  };

  getProductPackageLst = (product_id, rowIndex = -1) => {
    let reqData = new FormData();
    let { rows, lstBrand } = this.state;
    let findProductPackges = getSelectValue(lstBrand, product_id);
    if (findProductPackges) {
      //console.log("findProductPackges ", findProductPackges);
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
            //console.log("fPackageLst =-> ", fPackageLst);
            this.setState({ lstBrand: fPackageLst }, () => {
              let findProductPackges = getSelectValue(
                this.state.lstBrand,
                product_id
              );
              //console.log("findProductPackges =-> ", findProductPackges);
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
                  {
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
          console.log("error", error);
          this.setState({ lstBrand: [] });
          // //console.log("error", error);
        });
    }
  };

  handleUnitChange = (ele, value, rowIndex) => {
    let { rows } = this.state;
    if (value == "" && ele == "qty") {
      value = 0;
    }
    console.log("ele->", rows, ele, parseFloat(value));

    if (ele == "dis_per" && parseFloat(value) > parseFloat(100)) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Discount is exceeding 100%",
        is_button_show: true,
      });
      rows[rowIndex][ele] = 0;
    } else {
      rows[rowIndex][ele] = value;
    }

    if (ele == "rate") {
      if (
        parseFloat(rows[rowIndex]["b_rate"]) != 0 &&
        parseFloat(value) > parseFloat(rows[rowIndex]["b_rate"])
      ) {
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Pur.rate should be less than MRP",
          is_button_show: true,
        });
        rows[rowIndex][ele] = 0;
      } else {
        rows[rowIndex][ele] = value;
      }
    }

    if (ele == "unitId") {
      if (rows[rowIndex]["is_batch"] === true && ele == "unitId") {
        this.handleRowStateChange(
          rows,
          rows[rowIndex]["is_batch"], // true,
          rowIndex
        );
      } else {
        //console.log("UNITID");
        this.handleRowStateChange(rows, false, rowIndex);
      }
    } else if (
      ele == "qty" &&
      isUserControlExist("is_network_system", this.props.userControl) === true
    ) {
      this.updateProductStockFun(rowIndex, rows);
    } else {
      this.handleRowStateChange(rows);
    }
  };

  updateProductStockFun = (rowIndex = -1, rows) => {
    const { invoice_data } = this.state;
    console.log("rows >>>>>>>>>> ", rowIndex, rows[rowIndex]);
    let formData = new FormData();
    formData.append("productId", rows[rowIndex]["productId"]);
    formData.append("inventoryId", rows[rowIndex]["inventoryId"]);

    if (rows[rowIndex]["levelaId"] != null && rows[rowIndex]["levelaId"] != "")
      formData.append("levelAId", rows[rowIndex]["levelaId"]["value"]);
    if (rows[rowIndex]["levelbId"] != null && rows[rowIndex]["levelbId"] != "")
      formData.append("levelBId", rows[rowIndex]["levelbId"]["value"]);
    if (rows[rowIndex]["levelcId"] != null && rows[rowIndex]["levelcId"] != "")
      formData.append("levelCId", rows[rowIndex]["levelcId"]["value"]);
    if (rows[rowIndex]["unitId"] != null && rows[rowIndex]["unitId"] != "")
      formData.append("unitId", rows[rowIndex]["unitId"]["value"]);
    if (rows[rowIndex]["b_no"] != null && rows[rowIndex]["b_no"] != "")
      formData.append("batchNo", rows[rowIndex]["b_no"]);
    formData.append(
      "qty",
      rows[rowIndex]["qty"] != "" ? rows[rowIndex]["qty"] : 0
    );

    formData.append("tranxType", "PRS");
    formData.append("tranxAction", "CR");
    formData.append(
      "tranxDate",
      moment(invoice_data.pi_invoice_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );

    updateProductStock(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          rows[rowIndex]["inventoryId"] = res.inventoryId;
          this.handleRowStateChange(rows);

          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
        } else {
          this.handleRowStateChange(rows);

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
  getProductBatchList = (rowIndex = -1, source = "batch") => {
    const { rows, invoice_data, lstBrand } = this.state;

    let product_id = rows[rowIndex]["productId"];
    let level_a_id = rows[rowIndex]["levelaId"]["value"];
    let level_b_id = rows[rowIndex]["levelbId"]["value"];
    let level_c_id = rows[rowIndex]["levelcId"]["value"];
    let unit_id = rows[rowIndex]["unitId"]["value"];

    let isfound = false;
    let productData = getSelectValue(lstBrand, product_id);
    let batchOpt = [];

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
        moment(invoice_value.pi_invoice_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
      );

      invoice_data["costing"] = "";

      invoice_data["costingWithTax"] = "";
      let res = [];
      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          //console.log("get_Product_batch =>", response);
          if (response.responseStatus == 200) {
            res = response.data;
            //console.log("res ", res);

            invoice_data["costing"] = response.costing;
            invoice_data["costingWithTax"] = response.costingWithTax;
            this.setState(
              {
                invoice_data: invoice_data,
                batchData: res,
              },
              () => {
                this.getInitBatchValue(rowIndex, source);
              }
            );
            //console.log("res->batchData  : ", res);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      this.setState(
        {
          batchData: batchOpt,
        },
        () => {
          this.getInitBatchValue(rowIndex, source);
        }
      );
    }
  };

  getInitBatchValue = (rowIndex = -1, source) => {
    let { rows } = this.state;
    // console.log("rows[rowIndex][total_amt]", rows[rowIndex]["total_amt"]);
    // console.log("rows[rowIndex][qty]", rows[rowIndex]["qty"]);
    let totalqty =
      (isNaN(parseInt(rows[rowIndex]["qty"]))
        ? 0
        : parseInt(rows[rowIndex]["qty"])) +
      (isNaN(parseInt(rows[rowIndex]["free_qty"]))
        ? 0
        : parseInt(rows[rowIndex]["free_qty"]));

    let costingcal = parseFloat(rows[rowIndex]["total_amt"]) / totalqty;

    let costingwithtaxcal =
      costingcal + parseFloat(rows[rowIndex]["total_igst"]) / totalqty;
    let initVal = "";
    if (rowIndex != -1) {
      initVal = {
        productName: rows[rowIndex]["productName"]
          ? rows[rowIndex]["productName"]
          : "",
        b_no: rows[rowIndex]["b_no"],
        b_rate: rows[rowIndex]["b_rate"],
        sales_rate: rows[rowIndex]["sales_rate"],
        rate_a: rows[rowIndex]["rate_a"],
        rate_b: rows[rowIndex]["rate_b"],
        costing: costingcal,
        costingWithTax: costingwithtaxcal,
        rate_c: rows[rowIndex]["rate_c"],
        min_margin: rows[rowIndex]["min_margin"],
        margin_per: rows[rowIndex]["margin_per"],
        // b_purchase_rate: rows[rowIndex]["b_purchase_rate"]!=0?rows[rowIndex]["b_purchase_rate"]:rows[rowIndex]["rate"],
        b_purchase_rate: rows[rowIndex]["rate"],

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
        serialNo: "",
      };
    } else {
      let firstDiscCol = rows[rowIndex]["dis_per"];
      let secondDiscCol = rows[rowIndex]["dis_per2"];

      initVal = {
        productName: rows[rowIndex]["productName"]
          ? rows[rowIndex]["productName"]
          : "",
        b_no: 0,
        b_rate: 0,
        rate_a: 0,
        sales_rate: 0,
        costing: costingcal,
        cost_with_tax: 0,
        margin_per: 0,
        min_margin: 0,
        manufacturing_date: "",
        dummy_date: new Date(),
        b_purchase_rate:
          rows[rowIndex]["rate"] != null ? rows[rowIndex]["rate"] : "",
        b_expiry: "",
        b_details_id: 0,
        serialNo: "",
      };
    }
    let IsBatch = rows[rowIndex]["is_batch"];
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

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    this.setState({ rows: rowValue }, () => {
      if (showBatch == true && rowIndex >= 0) {
        this.setState({ rowIndex: rowIndex }, () => {
          this.getProductBatchList(rowIndex);
        });
      }
      this.handleTranxCalculation();
    });
  };

  handleTranxCalculation = (elementFrom = "") => {
    // !Most IMP̥
    let { rows, additionalChargesTotal } = this.state;

    let ledger_disc_amt = 0;
    let ledger_disc_per = 0;
    let takeDiscountAmountInLumpsum = false;
    let isFirstDiscountPerCalculate = false;
    let addChgLedgerAmt1 = 0;
    let addChgLedgerAmt2 = 0;
    let addChgLedgerAmt3 = 0;

    if (this.myRef.current) {
      let {
        purchase_discount,
        purchase_discount_amt,
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
      } = this.myRef.current.values;
      ledger_disc_per = purchase_discount;
      ledger_disc_amt = purchase_discount_amt;

      addChgLedgerAmt1 = additionalChgLedgerAmt1;
      addChgLedgerAmt2 = additionalChgLedgerAmt2;
      addChgLedgerAmt3 = additionalChgLedgerAmt3;

      let UserisFirstDiscountPerCalculate = isUserControl(
        "is_discount_first_calculation",
        this.props.userControl
      );
      let UsertakeDiscountAmountInLumpsum = isUserControl(
        "is_discount_amount_per_unit",
        this.props.userControl
      );
      takeDiscountAmountInLumpsum = UsertakeDiscountAmountInLumpsum;
      isFirstDiscountPerCalculate = UserisFirstDiscountPerCalculate;
    }

    let resTranxFn = fnTranxCalculation({
      elementFrom: elementFrom,
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
    //console.log({ resTranxFn });
    let {
      base_amt,
      total_purchase_discount_amt,
      total_taxable_amt,
      total_tax_amt,
      gst_row,
      total_final_amt,
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
      parseFloat(total_purchase_discount_amt).toFixed(2)
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
      Math.abs(parseFloat(roffamt).toFixed(2))
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

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      inventoryId: "",
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
    rows = [...rows, new_row];
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TPICProductId-" + id).focus();
      }, 1000);
    });
  };
  handleRemoveRow = (rowIndex = -1) => {
    let { rows, rowDelDetailsIds } = this.state;

    //console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = rows.filter((v, i) => i === rowIndex);

    if (deletedRow) {
      deletedRow.map((uv, ui) => {
        if (!rowDelDetailsIds.includes(uv.details_id)) {
          rowDelDetailsIds.push(uv.details_id);
        }
      });
    }

    rows = rows.filter((v, i) => i != rowIndex);
    this.handleClearProduct(rows);
  };
  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
    });
  };

  openSerialNo = (rowIndex) => {
    // console.log("rowIndex", rowIndex);
    let { rows } = this.state;
    let serialNoLst = rows[rowIndex]["serialNo"];
    // console.log("serialNoLst", serialNoLst);

    if (serialNoLst.length == 0) {
      serialNoLst = Array(6)
        .fill("")
        .map((v) => {
          return { serial_detail_id: 0, serial_no: v };
        });
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

  lstAdditionalLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
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
            //console.log({ fOpt });
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

  handleCGSTChange = (ele, value, rowIndex) => {
    //console.log("ele", { ele, value, rowIndex });
    let { taxcal, cgstData } = this.state;
    //console.log("amt", value);
    const newData = taxcal;
    //console.log("newData", newData);

    newData.cgst[rowIndex].amt = value;
    // newData.sgst[rowIndex].amt = value1;
    // let igstData = value + value1;
    // newData.igst[rowIndex].amt = igstData;

    //console.log("newData", newData.cgst[rowIndex].amt);
    //console.log("newData---", newData, this.state.taxcal);

    let igstData =
      parseFloat(newData.sgst[rowIndex].amt) + parseFloat(cgstData);

    newData.igst[rowIndex].amt = igstData;

    this.setState({ taxcal: newData, cgstData: newData.cgst[rowIndex].amt });
    let totaltaxAmt = newData.igst.reduce((prev, next) => prev + next.amt, 0);
    let totalAmt = this.myRef.current.values.total_taxable_amt;

    let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);
    let roundoffamt = Math.round(billAmt);
    let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxAmt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      Math.abs(parseFloat(roffamt).toFixed(2))
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(billAmt)).toFixed(2)
    );
  };

  handleSGSTChange = (ele, value, rowIndex) => {
    //console.log("ele", { ele, value, rowIndex });
    let { taxcal, sgstData, cgstData } = this.state;
    //console.log("amt", value);
    const newData = taxcal;
    //console.log("newData", newData);

    newData.sgst[rowIndex].amt = value;
    //console.log("newData", newData.sgst[rowIndex].amt);
    //console.log("newData---", newData, this.state.taxcal);
    let igstData =
      parseFloat(newData.sgst[rowIndex].amt) + parseFloat(cgstData);

    newData.igst[rowIndex].amt = igstData;

    this.setState({ taxcal: newData, sgstData: newData.sgst[rowIndex].amt });
    let totaltaxAmt = newData.igst.reduce((prev, next) => prev + next.amt, 0);
    let totalAmt = this.myRef.current.values.total_taxable_amt;

    //console.log("totaltaxAmt--totalAmt-", totaltaxAmt, totalAmt);

    let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);
    let roundoffamt = Math.round(billAmt);
    let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

    // console.log(
    //   "totaltaxAmt--totalAmt-",
    //   totaltaxAmt,
    //   totalAmt,
    //   billAmt,
    //   roffamt
    // );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxAmt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      Math.abs(parseFloat(roffamt).toFixed(2))
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(billAmt)).toFixed(2)
    );
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

  handleRoundOffCheck = (value) => {
    this.setState({ isRoundOffCheck: value });
    let { taxcal } = this.state;

    if (value == true) {
      let totaltaxAmt = taxcal.igst.reduce((prev, next) => prev + next.amt, 0);
      let totalAmt = this.myRef.current.values.total_taxable_amt;

      let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);

      let roundoffamt = Math.round(billAmt);
      let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

      this.myRef.current.setFieldValue(
        "total_tax_amt",
        parseFloat(totaltaxAmt)
      );
      this.myRef.current.setFieldValue(
        "roundoff",
        Math.abs(parseFloat(roffamt).toFixed(2))
      );
      this.myRef.current.setFieldValue("bill_amount", roundoffamt);
    } else {
      let totaltaxAmt = taxcal.igst.reduce((prev, next) => prev + next.amt, 0);
      let totalAmt = this.myRef.current.values.total_taxable_amt;

      let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);

      let roundoffamt = 0;

      this.myRef.current.setFieldValue(
        "total_tax_amt",
        parseFloat(totaltaxAmt).toFixed(2)
      );
      this.myRef.current.setFieldValue(
        "roundoff",
        Math.abs(parseFloat(roundoffamt).toFixed(2))
      );
      this.myRef.current.setFieldValue("bill_amount", billAmt);
    }
  };

  handleFetchData = (sundry_creditor_id) => {
    let reqData = new FormData();
    reqData.append("sundry_creditor_id", sundry_creditor_id);
    listTranxDebitesNotes(reqData)
      .then((response) => {
        let res = response.data;
        let data = res.list;
        if (data.length == 0) {
          this.callCreateInvoice();
        } else if (data.length > 0) {
          this.setState({ billLst: data }, () => {
            if (data.length > 0) {
              console.log("billLst", this.state.billLst);
              this.setState({ adjustbillshow: true });
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  callCreateInvoice = () => {
    let { invoice_data, additionalChargesTotal, rows, isRoundOffCheck } =
      this.state;
    let invoiceValues = this.myRef.current.values;

    let requestData = new FormData();
    // !Invoice Data
    console.log("invoiceValues----->", invoiceValues);
    requestData.append(
      "invoice_date",
      moment(invoice_data.pi_invoice_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );

    requestData.append("newReference", false);
    requestData.append("invoice_no", invoice_data.pi_no);
    requestData.append("purchase_id", invoice_data.purchaseId.value);
    requestData.append("purchase_sr_no", invoiceValues.pi_sr_no);
    requestData.append(
      "transaction_date",
      moment(invoice_data.pi_transaction_dt, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    requestData.append("supplier_code_id", invoice_data.selectedSupplier.id);
    requestData.append("isRoundOffCheck", isRoundOffCheck);

    // !Invoice Data
    requestData.append("roundoff", invoiceValues.roundoff);
    if (invoiceValues.narration && invoiceValues.narration != "") {
      requestData.append("narration", invoiceValues.narration);
    }

    requestData.append("totalamt", invoiceValues.totalamt);
    requestData.append(
      "total_purchase_discount_amt",
      isNaN(parseFloat(invoiceValues.total_purchase_discount_amt))
        ? 0
        : parseFloat(invoiceValues.total_purchase_discount_amt)
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

    requestData.append(
      "gstNo",
      invoice_data.gstId !== "" ? invoice_data.gstId.label : ""
    );
    requestData.append("totalcgst", totalcgst);
    requestData.append("totalsgst", totalsgst);
    requestData.append("totaligst", totaligst);

    requestData.append(
      "tcs",
      invoiceValues.tcs && invoiceValues.tcs != "" ? invoiceValues.tcs : 0
    );

    requestData.append(
      "purchase_discount",
      invoiceValues.purchase_discount && invoiceValues.purchase_discount != ""
        ? invoiceValues.purchase_discount
        : 0
    );

    requestData.append(
      "purchase_discount_amt",
      invoiceValues.purchase_discount_amt &&
        invoiceValues.purchase_discount_amt != ""
        ? invoiceValues.purchase_discount_amt
        : 0
    );

    requestData.append(
      "total_purchase_discount_amt",
      invoiceValues.total_purchase_discount_amt &&
        invoiceValues.total_purchase_discount_amt != ""
        ? invoiceValues.total_purchase_discount_amt
        : 0
    );
    if (this.state.selectedPendingOrder.length > 0) {
      requestData.append(
        "reference_po_ids",
        this.state.selectedPendingOrder.join(",")
      );
    }

    if (this.state.selectedPendingChallan.length > 0) {
      requestData.append(
        "reference_pc_ids",
        this.state.selectedPendingChallan.join(",")
      );
    }

    //console.log("row in create", rows);

    let frow = [];
    rows.map((v, i) => {
      if (v.productId != "") {
        let newObj = {
          productId: v.productId ? v.productId : "",
          inventoryId: v.inventoryId ? v.inventoryId : 0,
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
          is_serial: v.is_serial,
          b_details_id: v.b_details_id != "" ? v.b_details_id : 0,
          b_no: v.b_no != "" ? v.b_no : 0,
          b_rate: v.b_rate != "" ? v.b_rate : 0,
          b_purchase_rate: v.b_purchase_rate != "" ? v.b_purchase_rate : 0,
          b_expiry: v.b_expiry ? moment(v.b_expiry).format("yyyy-MM-DD") : "",
          sales_rate: v.sales_rate != "" ? v.sales_rate : 0,
          rate_a: v.rate_a,
          rate_b: v.rate_b,
          rate_c: v.rate_c,
          costing: v.costing,
          costing_with_tax: v.costing_with_tax,
          min_margin: v.min_margin,
          margin_per: v.margin_per,
          manufacturing_date: v.manufacturing_date
            ? moment(v.manufacturing_date).format("yyyy-MM-DD")
            : "",
          isBatchNo: v.b_no,
          reference_type: v.reference_type,
          reference_id: v.reference_id != "" ? v.reference_id : 0,
          serialNo: v.serialNo
            ? v.serialNo.filter((vi) => vi.serial_no != "")
            : [],
        };
        //console.log("newObj >>>> ", newObj);
        frow.push(newObj);
        //console.log("frow ----------- ", frow);
      }
    });
    // console.log("frow =->", frow);

    var filtered = frow.filter(function (el) {
      return el && el != null;
    });
    //console.log("filtered----->", filtered);
    requestData.append("row", JSON.stringify(filtered));
    requestData.append("additionalChargesTotal", additionalChargesTotal);
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

    if (invoiceValues.total_qty !== "") {
      requestData.append(
        "total_qty",
        invoiceValues.total_qty !== "" ? parseInt(invoiceValues.total_qty) : 0
      );
    }
    if (invoiceValues.total_free_qty !== "") {
      requestData.append(
        "total_free_qty",
        invoiceValues.total_free_qty !== "" ? invoiceValues.total_free_qty : 0
      );
    }

    // !Total Qty*Rate
    requestData.append(
      "total_row_gross_amt",
      invoiceValues.total_row_gross_amt
    );
    requestData.append("total_base_amt", invoiceValues.total_base_amt);
    // !Discount
    requestData.append(
      "total_invoice_dis_amt",
      invoiceValues.total_invoice_dis_amt
    );
    // !Taxable Amount
    requestData.append("taxable_amount", invoiceValues.total_taxable_amt);
    // !Taxable Amount
    requestData.append("total_tax_amt", invoiceValues.total_tax_amt);
    // !Bill Amount
    requestData.append("bill_amount", invoiceValues.bill_amount);

    if (
      authenticationService.currentUserValue.state &&
      invoice_data &&
      invoice_data.gstId != "" &&
      parseInt(invoice_data.gstId.state) !=
        parseInt(authenticationService.currentUserValue.state)
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

      requestData.append("taxCalculation", JSON.stringify(taxCal));
      requestData.append("taxFlag", true);
    }
    if (invoiceValues.image != "") {
      requestData.append("image", invoiceValues.image);
    }
    // for (const pair of requestData.entries()) {
    //   console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    // }
    createPurchaseInvoice(requestData)
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
          // // resetForm();
          // this.initRow();

          eventBus.dispatch("page_change", {
            from: "tranx_purchase_invoice_create",
            to: "tranx_purchase_invoice_list",
            isNewTab: false,
          });

          // MyNotifications.fire(
          //   {
          //     show: true,
          //     icon: "confirm",
          //     title: "Confirm",
          //     msg: "Do you want Print",
          //     is_button_show: false,
          //     is_timeout: false,
          //     delay: 0,
          //     handleSuccessFn: () => {
          //       // this.getInvoiceBillsLstPrint(invoiceValues.pi_no);
          //       eventBus.dispatch("page_change", "tranx_purchase_invoice_list");
          //     },
          //     handleFailFn: () => {
          //       eventBus.dispatch("page_change", "tranx_purchase_invoice_list");
          //     },
          //   },
          //   () => {
          //     console.warn("return_data");
          //   }
          // );
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

  getLedgerByCode(code) {
    let { ledgerList } = this.state;
    // console.warn("ledgerList->>>>>>>>>>", ledgerList);

    let ledgerData = ledgerList.filter(
      (v) => v.code.toLowerCase() == code.toLowerCase()
    );
    // console.warn(code);
    // console.warn("ledgerData->>>", ledgerData);
    if (ledgerData.length > 0) {
      if (this.myRef.current) {
        this.myRef.current.setFieldValue(
          "supplierNameId",
          ledgerData[0].ledger_name
        );
        let opt =
          ledgerData && ledgerData[0].gstDetails
            ? ledgerData[0].gstDetails.map((vi) => {
                return { label: vi.gstNo, value: vi.id, ...vi };
              })
            : "";
        this.setState({ lstGst: opt }, () => {
          if (opt.length > 0 && ledgerData) {
            this.myRef.current.setFieldValue(
              "gstId",
              getSelectValue(opt, ledgerData[0].gstDetails[0].id)
            );
          }
        });
      }
    } else {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Warning",
          msg: "invalid ledger code",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            this.ledgerModalStateChange("ledgerModal", true);
          },
          handleFailFn: () => {},
        },
        () => {
          console.warn("return_data");
        }
      );
      document.getElementById("supplierNameId").focus();
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("supplierNameId", "");
      }
      // this.ledgerModalStateChange("ledgerModal", true);
      // alert("invalid ledger code");
    }
  }
  handleBillselectionDebit = (id, index, status) => {
    debugger;

    let { billLst, selectedBillsdebit, billAmount } = this.state;
    // //console.log({ id, index, status });
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
    let remTotalDebitAmt = billAmount;
    f_billLst = f_billLst.map((v, i) => {
      if (remTotalDebitAmt > 0) {
        if (f_selectedBills.includes(v.debit_note_no)) {
          let pamt = 0;
          if (parseFloat(remTotalDebitAmt) > parseFloat(v.Total_amt)) {
            remTotalDebitAmt = remTotalDebitAmt - parseFloat(v.Total_amt);
            pamt = parseFloat(v.Total_amt);
          } else {
            pamt = remTotalDebitAmt;
            remTotalDebitAmt = 0;
          }
          v["debit_paid_amt"] = pamt;
          v["debit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(pamt);
        } else {
          v["debit_paid_amt"] = 0;
          v["debit_remaining_amt"] = parseFloat(v.Total_amt);
        }
      } else {
        if (f_selectedBills.includes(v.debit_note_no)) {
          v["debit_paid_amt"] = parseFloat(v.Total_amt);
          v["debit_remaining_amt"] =
            parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
        } else {
          v["debit_paid_amt"] = 0;
          v["debit_remaining_amt"] = parseFloat(v.Total_amt);
        }
      }

      return v;
    });

    this.setState({
      isAllCheckeddebit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsdebit: f_selectedBills,
      billLst: f_billLst,
    });
  };
  handleBillsSelectionAllDebit = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.debit_note_no);
      // //console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = parseFloat(v.Total_amt);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

        return v;
      });
    } else {
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBillsdebit: lstSelected,
      billLst: fBills,
    });
  };

  handleBillPayableAmtChange = (value, index) => {
    // //console.log({ value, index });
    const { billLst, debitBills } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // //console.log('v', v);
      // //console.log('payable_amt', v['payable_amt']);
      if (i == index) {
        v["debit_paid_amt"] = parseFloat(value);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
  };

  render() {
    let {
      invoice_data,
      isBranch,
      purchaseAccLst,
      lstGst,
      ledgerData,
      ledgerDataIndExp,
      ledgerModal,
      ledgerModalIndExp,
      ledgerModalIndExp1,
      ledgerModalIndExp2,
      ledgerModalIndExp3,
      selectedLedger,
      selectedLedgerIndExp,
      rows,
      rowIndex,
      selectProductModal,
      selectedProduct,
      productData,
      add_button_flag,
      product_supplier_lst,
      productLst,
      selectSerialModal,
      serialNoLst,
      newBatchModal,
      batchInitVal,
      b_details_id,
      isBatch,
      batchData,
      is_expired,
      tr_id,
      batch_data_selected,
      product_hover_details,
      taxcal,
      isRoundOffCheck,
      showLedgerDiv,
      selectedLedgerNo,
      lstAdditionalLedger,
      addchgElement1,
      addchgElement2,
      gstId,
      costingInitVal,
      costingMdl,
      batchHideShow,
      errorArrayBorder,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      from_source,
      setProductRowIndex,
      setProductId,
      productId,
      ledgerId,
      setLedgerId,
      adjustbillshow,
      billLst,
      isAllCheckeddebit,
      selectedBillsdebit,
      billAmount,
    } = this.state;
    // console.log("rows", rows);
    return (
      <>
        <div
          className="purchaseinvoice"
          style={{ overflowY: "hidden", overflowX: "hidden" }}
        >
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            // validationSchema={Yup.object().shape({
            //   // gstId: Yup.object().nullable().required("GST No is required"),
            //   pi_invoice_dt: Yup.string().required("Invoice Date is Required"),
            //   // supplierCodeId: Yup.object()
            //   //   .nullable()
            //   //   .required("Supplier Code is Required"),
            //   purchaseId: Yup.object()
            //     .nullable()
            //     .required("Purchase Account is Required"),
            //   pi_no: Yup.string().required("Invoice No is Required"),
            //   supplierNameId: Yup.string()
            //     .trim()
            //     .required("Supplier Name is Required"),
            // })}
            initialValues={invoice_data}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              this.setState({ billAmount: values.bill_amount });
              // console.log("values ->>>>>>>>>>>>>", values);
              // console.log("rows", rows);

              //! validation required start
              let errorArray = [];
              if (values.supplierCodeId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.supplierNameId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.pi_no == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.pi_invoice_dt == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  console.warn("rows->>>>>>>>>>>>>>", rows);
                  let productName = [];
                  let unitId = [];
                  let batchNo = [];
                  let qty = [];
                  let rate = [];
                  {
                    rows &&
                      rows.map((v, i) => {
                        if (v.productId) {
                          productName.push("");
                        } else {
                          productName.push("Y");
                        }

                        if (v.unitId) {
                          unitId.push("");
                        } else {
                          unitId.push("Y");
                        }

                        if (v.is_batch) {
                          if (v.b_no) {
                            batchNo.push("");
                          } else {
                            batchNo.push("Y");
                          }
                        } else {
                          batchNo.push("");
                        }

                        if (v.qty) {
                          qty.push("");
                        } else {
                          qty.push("Y");
                        }

                        if (v.rate) {
                          rate.push("");
                        } else {
                          rate.push("Y");
                        }
                      });
                  }

                  this.setState(
                    {
                      productNameData: productName,
                      unitIdData: unitId,
                      batchNoData: batchNo,
                      qtyData: qty,
                      rateData: rate,
                    },
                    () => {
                      if (
                        allEqual(productName) &&
                        allEqual(unitId) &&
                        allEqual(batchNo) &&
                        allEqual(qty) &&
                        allEqual(rate)
                      ) {
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
                              let { selectedSupplier } = values;
                              if (selectedSupplier) {
                                this.handleFetchData(selectedSupplier.id);
                              }
                            },
                            handleFailFn: () => {},
                          },
                          () => {
                            console.warn("return_data");
                          }
                        );

                        this.setState({
                          invoice_data: values,
                        });
                      }
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
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <Form
                onSubmit={handleSubmit}
                noValidate
                // style={{ overflowX: "hidden", overflowY: "hidden" }}
                autoComplete="off"
                className="frm-tnx-purchase-invoice"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    e.preventDefault();
                  }
                }}
              >
                <>
                  <div className="div-style">
                    <div>
                      <Row className="mx-0 inner-div-style">
                        <Row className="pe-0">
                          {isBranch == true && (
                            <Col lg={2} md={2} sm={2} xs={2}>
                              <Row>
                                {/* // If company has multiple branch then enable only branch */}
                                {/* selection otherwise hide it as per Pavan's sir told on solapur visit */}

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
                                    isDisabled
                                    options={purchaseAccLst}
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
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Form.Label>Tranx Date</Form.Label>
                              </Col>

                              <Col lg={7} md={7} sm={7} xs={7}>
                                <MyTextDatePicker
                                  autoFocus="true"
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  className="tnx-pur-inv-date-style "
                                  name="pi_transaction_dt"
                                  id="pi_transaction_dt"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.pi_transaction_dt}
                                  onChange={handleChange}
                                  readOnly={true}
                                  // onBlur={(e) => {
                                  //   //console.log("e ", e);
                                  //   if (
                                  //     e.target.value != null &&
                                  //     e.target.value != ""
                                  //   ) {
                                  //     if (
                                  //       moment(
                                  //         e.target.value,
                                  //         "DD-MM-YYYY"
                                  //       ).isValid() == true
                                  //     ) {
                                  //       setFieldValue(
                                  //         "pi_transaction_dt",
                                  //         e.target.value
                                  //       );
                                  //       this.checkInvoiceDateIsBetweenFYFun(
                                  //         e.target.value,
                                  //         setFieldValue
                                  //       );
                                  //     }
                                  //   } else {
                                  //     MyNotifications.fire({
                                  //       show: true,
                                  //       icon: "error",
                                  //       title: "Error",
                                  //       msg: "Invalid invoice date",
                                  //       is_button_show: true,
                                  //     });
                                  //     this.invoiceDateRef.current.focus();
                                  //     setFieldValue("pi_transaction_dt", "");
                                  //   }
                                  //   // if (values.supplierCodeId != "") {
                                  //   //   this.ledgerModalStateChange(
                                  //   //     "selectedLedger",
                                  //   //     values.selectedSupplier
                                  //   //   );
                                  //   //   this.ledgerModalStateChange(
                                  //   //     "ledgerModal",
                                  //   //     true
                                  //   //   );
                                  //   // } else {
                                  //   //   this.ledgerModalStateChange(
                                  //   //     "ledgerModal",
                                  //   //     true
                                  //   //   );
                                  //   // }
                                  //   // document
                                  //   //   .getElementById("supplierCodeId")
                                  //   //   .focus();
                                  // }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>Code</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  placeholder="Ledger Code"
                                  name="supplierCodeId"
                                  id="supplierCodeId"
                                  onChange={handleChange}
                                  value={values.supplierCodeId}
                                  className="tnx-pur-inv-text-box"
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (e.key === "Tab") {
                                      // e.preventDefault();

                                      if (e.target.value.trim() != "") {
                                        this.getLedgerByCode(
                                          values.supplierCodeId
                                        );
                                      } else if (
                                        e.target.value.trim() == "" &&
                                        values.supplierNameId == ""
                                      ) {
                                        this.ledgerModalStateChange(
                                          "ledgerModal",
                                          true
                                        );
                                        this.ledgerModalStateChange(
                                          "selectedLedger",
                                          values.selectedSupplier
                                        );
                                      }
                                    }
                                  }}
                                />

                                {/* <span className="text-danger errormsg">
                                  {errors.supplierNameId
                                    ? "Supplier Code is Required"
                                    : ""}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3} className="p-0">
                                <Form.Label>
                                  Ledger Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={9} md={9} sm={9} xs={9}>
                                <Form.Control
                                  // type="button"
                                  type="text"
                                  placeholder="Ledger Name"
                                  name="supplierNameId"
                                  id="supplierNameId"
                                  disabled={
                                    values.pi_transaction_dt !== ""
                                      ? false
                                      : true
                                  }
                                  onChange={handleChange}
                                  onClick={(e) => {
                                    e.preventDefault();

                                    if (values.supplierCodeId != "") {
                                      this.ledgerModalStateChange(
                                        "selectedLedger",
                                        values.selectedSupplier
                                      );
                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                    } else {
                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                    }
                                  }}
                                  value={values.supplierNameId}
                                  className={`${
                                    values.supplierNameId == "" &&
                                    errorArrayBorder[1] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box text-start"
                                      : "tnx-pur-inv-text-box text-start"
                                  }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value) {
                                      this.setErrorBorder(1, "");
                                    } else {
                                      this.setErrorBorder(1, "Y");
                                      // document
                                      //   .getElementById("supplierNameId")
                                      //   .focus();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    )
                                      e.preventDefault();
                                  }}
                                  readOnly
                                />

                                {/* <span className="text-danger errormsg">
                                  {errors.supplierNameId}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>Supplier GSTIN</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Select
                                  className="selectTo"
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  styles={purchaseSelect}
                                  options={lstGst}
                                  name="gstId"
                                  id="gstId"
                                  onChange={(v) => {
                                    setFieldValue("gstId", v);
                                    this.setState({ gstId: v });
                                  }}
                                  value={values.gstId}
                                />
                                <span className="text-danger errormsg">
                                  {errors.gstId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={5} md={5} sm={5} xs={5} className="p-0">
                                <Form.Label>Purchase Serial</Form.Label>
                              </Col>
                              <Col lg={7} md={7} sm={7} xs={7}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Invoice sr No. "
                                  name="pi_sr_no"
                                  id="pi_sr_no"
                                  onChange={handleChange}
                                  value={values.pi_sr_no}
                                  isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  isInvalid={!!errors.pi_sr_no}
                                  disabled
                                  readOnly
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_sr_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-1 pe-0">
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={5} md={5} sm={5} xs={5} className="">
                                <Form.Label>
                                  Invoice No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={7} md={7} sm={7} xs={7}>
                                <Form.Control
                                  type="text"
                                  placeholder="Invoice No."
                                  name="pi_no"
                                  id="pi_no"
                                  onChange={handleChange}
                                  value={values.pi_no}
                                  isValid={touched.pi_no && !errors.pi_no}
                                  isInvalid={!!errors.pi_no}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   if (
                                  //     values.selectedSupplier &&
                                  //     values.selectedSupplier != ""
                                  //   ) {
                                  //     this.validatePurchaseInvoice(
                                  //       values.pi_no,
                                  //       values.selectedSupplier.id
                                  //     );
                                  //   }
                                  // }}

                                  className={`${
                                    values.pi_no == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    console.log("values", values);

                                    if (e.target.value) {
                                      this.setErrorBorder(2, "");
                                      this.validatePurchaseInvoice(
                                        values.pi_no,
                                        values.selectedSupplier.id
                                      );
                                      // setFieldValue("pi_no", "");
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      // setFieldValue("pi_no", "");
                                      document.getElementById("pi_no").focus();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    )
                                      e.preventDefault();

                                    if (e.keyCode == 18) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.pi_no}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>
                                  Invoice Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      values.pi_invoice_dt === "__/__/____"
                                    ) {
                                      e.preventDefault();
                                    }
                                    if (e.keyCode == 18) {
                                      e.preventDefault();
                                    }

                                    // if (e.shiftKey && e.key === "Tab") {
                                    //   let datchco = e.target.value.trim();
                                    //   console.log("datchco", datchco);
                                    //   let checkdate = moment(
                                    //     e.target.value
                                    //   ).format("DD/MM/YYYY");
                                    //   console.log("checkdate", checkdate);
                                    //   if (
                                    //     datchco != "__/__/____" &&
                                    //     // checkdate == "Invalid date"
                                    //     datchco.includes("_")
                                    //   ) {
                                    //     MyNotifications.fire({
                                    //       show: true,
                                    //       icon: "error",
                                    //       title: "Error",
                                    //       msg: "Please Enter Correct Date. ",
                                    //       is_timeout: true,
                                    //       delay: 1500,
                                    //     });
                                    //     setTimeout(() => {
                                    //       document
                                    //         .getElementById("pi_invoice_dt")
                                    //         .focus();
                                    //     }, 1000);
                                    //   }
                                    // } else if (e.key === "Tab") {
                                    //   let datchco = e.target.value.trim();
                                    //   console.log("datchco", datchco);
                                    //   let checkdate = moment(
                                    //     e.target.value
                                    //   ).format("DD/MM/YYYY");
                                    //   console.log("checkdate", checkdate);
                                    //   if (
                                    //     datchco != "__/__/____" &&
                                    //     // checkdate == "Invalid date"
                                    //     datchco.includes("_")
                                    //   ) {
                                    //     MyNotifications.fire({
                                    //       show: true,
                                    //       icon: "error",
                                    //       title: "Error",
                                    //       msg: "Please Enter Correct Date. ",
                                    //       is_timeout: true,
                                    //       delay: 1500,
                                    //     });
                                    //     setTimeout(() => {
                                    //       document
                                    //         .getElementById("pi_invoice_dt")
                                    //         .focus();
                                    //     }, 1000);
                                    //   }
                                    // }
                                  }}
                                >
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.invoiceDateRef.current = input;
                                    }}
                                    // className="tnx-pur-inv-date-style"
                                    // tabIndex="-1"
                                    name="pi_invoice_dt"
                                    id="pi_invoice_dt"
                                    placeholder="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    value={values.pi_invoice_dt}
                                    onChange={handleChange}
                                    // onBlur={(e) => {
                                    //   console.log("e ", e);
                                    //   console.log(
                                    //     "e.target.value ",
                                    //     e.target.value
                                    //   );
                                    //   if (
                                    //     e.target.value != null &&
                                    //     e.target.value !== ""
                                    //   ) {
                                    //     const enteredDate = moment(
                                    //       e.target.value,
                                    //       "DD-MM-YYYY"
                                    //     );
                                    //     const currentDate = moment();

                                    //     if (enteredDate.isAfter(currentDate)) {
                                    //       MyNotifications.fire({
                                    //         show: true,
                                    //         icon: "confirm",
                                    //         title: "confirm",
                                    //         msg: "Entered date is greater than current date",
                                    //         // is_button_show: true,
                                    //         handleSuccessFn: () => {},
                                    //         handleFailFn: () => {
                                    //           setFieldValue("pi_invoice_dt", "");
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_purchase_invoice_create"
                                    //           );
                                    //           // this.reloadPage();
                                    //         },
                                    //       });
                                    //     } else if (
                                    //       enteredDate.isBefore(currentDate)
                                    //     ) {
                                    //       MyNotifications.fire({
                                    //         show: true,
                                    //         icon: "confirm",
                                    //         title: "confirm",
                                    //         msg: "Entered date is smaller than current date",
                                    //         // is_button_show: true,
                                    //         handleSuccessFn: () => {},
                                    //         handleFailFn: () => {
                                    //           setFieldValue("pi_invoice_dt", "");
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_purchase_invoice_create"
                                    //           );
                                    //           // this.reloadPage();
                                    //         },
                                    //       });
                                    //     } else {
                                    //       setFieldValue(
                                    //         "pi_invoice_dt",
                                    //         e.target.value
                                    //       );
                                    //       this.checkInvoiceDateIsBetweenFYFun(
                                    //         e.target.value,
                                    //         setFieldValue
                                    //       );
                                    //     }
                                    //   } else {
                                    //     setFieldValue("pi_invoice_dt", "");
                                    //   }
                                    // }}
                                    className={`${
                                      values.pi_invoice_dt == "" &&
                                      errorArrayBorder[3] == "Y"
                                        ? "border border-danger tnx-pur-inv-date-style"
                                        : "tnx-pur-inv-date-style"
                                    }`}
                                    onBlur={(e) => {
                                      e.preventDefault();

                                      console.log("e ", e);
                                      console.log(
                                        "e.target.value ",
                                        e.target.value
                                      );
                                      if (
                                        e.target.value != null &&
                                        e.target.value !== ""
                                      ) {
                                        this.setErrorBorder(3, "");
                                        let d = new Date();
                                        d.setMilliseconds(0);
                                        d.setHours(0);
                                        d.setMinutes(0);
                                        d.setSeconds(0);
                                        const enteredDate = moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        );
                                        const currentDate = moment(d);

                                        if (enteredDate.isAfter(currentDate)) {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "confirm",
                                            title: "confirm",
                                            msg: "Entered date is greater than current date",
                                            // is_button_show: true,
                                            handleSuccessFn: () => {},
                                            handleFailFn: () => {
                                              // setFieldValue(
                                              //   "pi_invoice_dt",
                                              //   ""
                                              // );
                                              // eventBus.dispatch(
                                              //   "page_change",
                                              //   "tranx_purchase_invoice_create"
                                              // );
                                              // this.reloadPage();
                                            },
                                          });
                                          setFieldValue(
                                            "pi_invoice_dt",
                                            e.target.value
                                          );
                                          this.checkInvoiceDateIsBetweenFYFun(
                                            e.target.value,
                                            setFieldValue
                                          );
                                        } else if (
                                          enteredDate.isBefore(currentDate)
                                        ) {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "confirm",
                                            title: "confirm",
                                            msg: "Entered date is smaller than current date",
                                            // is_button_show: true,
                                            handleSuccessFn: () => {
                                              if (enteredDate != "") {
                                                setTimeout(() => {
                                                  this.inputRef1.current.focus();
                                                }, 500);
                                              }
                                            },
                                            handleFailFn: () => {
                                              // setFieldValue(
                                              //   "pi_invoice_dt",
                                              //   ""
                                              // );
                                              setTimeout(() => {
                                                document
                                                  .getElementById(
                                                    "pi_invoice_dt"
                                                  )
                                                  .focus();
                                              }, 500);

                                              // eventBus.dispatch("page_change", {
                                              //   from: "tranx_purchase_invoice_create",
                                              //   to: "tranx_purchase_invoice_list",
                                              //   isNewTab: false,
                                              // });
                                              // this.reloadPage();
                                            },
                                          });
                                        } else {
                                          setFieldValue(
                                            "pi_invoice_dt",
                                            e.target.value
                                          );
                                          this.checkInvoiceDateIsBetweenFYFun(
                                            e.target.value,
                                            setFieldValue
                                          );
                                        }
                                      } else {
                                        this.setErrorBorder(3, "Y");
                                        // document
                                        //   .getElementById("pi_invoice_dt")
                                        //   .focus();
                                      }
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger errormsg">
                                  {errors.pi_invoice_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          {/* <Col>
                        <Button
                          className="plus-btn"
                          onClick={(e) => {
                            this.handleTaxRoundOFFCalculation();
                          }}

                        >
                          Tax With Round Off
                        </Button>
                      </Col> */}

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={3} md={3} sm={3} xs={3} className="p-0">
                                <Form.Label>Purchase A/C</Form.Label>
                              </Col>
                              <Col lg={6} md={6} sm={6} xs={6}>
                                <Select
                                  ref={this.inputRef1}
                                  className="selectTo"
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  styles={purchaseSelect}
                                  isClearable={true}
                                  options={purchaseAccLst}
                                  name="purchaseId"
                                  id="purchaseId"
                                  onChange={(v) => {
                                    setFieldValue("purchaseId", v);
                                  }}
                                  value={values.purchaseId}
                                />
                                <span className="text-danger errormsg">
                                  {errors.purchaseId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>Upload Image</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group controlId="formGridEmail">
                                  <Form.Control
                                    type="file"
                                    placeholder=""
                                    className="tnx-pur-inv-text-box"
                                    name="image"
                                    onChange={(e) => {
                                      setFieldValue("image", e.target.files[0]);
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={2} className="my-auto">
                            <label
                              className="custom-file-label custombrowseclass"
                              htmlFor="image"
                            >
                              {values.image ? "FILE SELECTED" : ""}
                            </label>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>
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
                    productNameData={productNameData}
                    unitIdData={unitIdData}
                    batchNoData={batchNoData}
                    qtyData={qtyData}
                    rateData={rateData}
                    productId="TPICProductId-"
                    addBtnId="TPICAddBtn-"
                  />
                  <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={3}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">HSN:</span>
                          <span className="span-value">
                            {product_hover_details.hsn}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Tax Type:</span>
                          <span className="span-value">
                            {product_hover_details.tax_type}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4} className="for_padding">
                      <Row>
                        <Col lg={6} className="my-auto colset">
                          <span className="span-lable">Batch Expiry:</span>
                          <span className="span-value">
                            {batch_data_selected.expiry_date
                              ? batch_data_selected.expiry_date
                              : product_hover_details.batch_expiry}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">M.R.P.:</span>
                          <span className="span-value">
                            {product_hover_details.mrp}
                          </span>
                          <span className="custom_hr_style">|</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <Row>
                        <Col lg={6} className="my-auto">
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
                    <Col lg={2}>
                      <Row>
                        <Col lg={12} className="my-auto">
                          <span className="span-lable">Package:</span>
                          <span className="span-value">
                            {product_hover_details.packing}
                          </span>
                        </Col>
                        {/* <Col lg={6}>
                          <span className="span-lable">Barcode:</span>
                          <span className="span-value">
                            {product_hover_details.barcode}
                          </span>
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

                  <Row className="mx-0 btm-data-invoice">
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
                      className="pe-0"
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
                        <Col lg={3} className="mt-2 for_padding">
                          <Form.Control
                            placeholder="Dis."
                            className="tnx-pur-inv-text-box px-1 text-end"
                            id="purchase_discount"
                            name="purchase_discount"
                            onChange={(e) => {
                              setFieldValue(
                                "purchase_discount",
                                e.target.value
                              );

                              let ledger_disc_amt = calculatePercentage(
                                values.total_row_gross_amt1,
                                parseFloat(e.target.value)
                              );
                              if (isNaN(ledger_disc_amt) === true)
                                ledger_disc_amt = "";
                              setFieldValue(
                                "purchase_discount_amt",
                                ledger_disc_amt !== ""
                                  ? parseFloat(ledger_disc_amt).toFixed(2)
                                  : ""
                              );

                              setTimeout(() => {
                                this.handleTranxCalculation();
                              }, 100);
                            }}
                            onKeyPress={(e) => {
                              OnlyEnterAmount(e);
                            }}
                            value={values.purchase_discount}
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
                        <Col lg={5} className="mt-2">
                          <Form.Control
                            placeholder="Dis."
                            className="tnx-pur-inv-text-box text-end"
                            id="purchase_discount_amt"
                            name="purchase_discount_amt"
                            onChange={(e) => {
                              setFieldValue(
                                "purchase_discount_amt",
                                e.target.value
                              );

                              let ledger_disc_per =
                                (parseFloat(e.target.value) * 100) /
                                parseFloat(values.total_row_gross_amt1);
                              if (isNaN(ledger_disc_per) === true)
                                ledger_disc_per = "";
                              setFieldValue(
                                "purchase_discount",
                                ledger_disc_per !== ""
                                  ? parseFloat(ledger_disc_per).toFixed(2)
                                  : ""
                              );

                              setTimeout(() => {
                                this.handleTranxCalculation();
                              }, 100);
                            }}
                            value={values.purchase_discount_amt}
                            onKeyPress={(e) => {
                              OnlyEnterAmount(e);
                            }}
                          />
                        </Col>
                      </Row>
                      {/* <TGSTFooter
                        values={values}
                        taxcal={taxcal}
                        authenticationService={authenticationService}
                        handleCGSTChange={this.handleCGSTChange.bind(this)}
                        handleSGSTChange={this.handleSGSTChange.bind(this)}
                      /> */}

                      <CmpTGSTFooter
                        values={values}
                        taxcal={taxcal}
                        gstId={gstId}
                        handleCGSTChange={this.handleCGSTChange.bind(this)}
                        handleSGSTChange={this.handleSGSTChange.bind(this)}
                      />
                      <Row>
                        <Row>
                          <Col lg={12}>
                            <span className="tnx-pur-inv-span-text">
                              Total Qty:
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {values.total_qty}
                            </span>
                          </Col>
                        </Row>

                        {/* <Col lg={1}>
                          <p style={{ color: "#B6762B" }}>|</p>
                        </Col> */}
                        <Row className="mt-1">
                          <Col lg={12}>
                            <span className="tnx-pur-inv-span-text">
                              Free Qty:
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {isNaN(values.total_free_qty) === true
                                ? 0
                                : values.total_free_qty}
                            </span>
                          </Col>
                        </Row>
                        <Row className="my-auto">
                          <Col lg={1} className="pe-0">
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className="pl-0 mt-1"
                            >
                              <Form.Check
                                id="isRoundOff"
                                name="isRoundOff"
                                className="Roff"
                                type="checkbox"
                                checked={
                                  isRoundOffCheck === true ? true : false
                                }
                                onChange={(e) => {
                                  this.handleRoundOffCheck(e.target.checked);
                                }}
                                label=""
                              />
                            </Form.Group>
                          </Col>

                          <Col lg={11}>
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {parseFloat(values.roundoff).toFixed(2)}
                            </span>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={2}
                      xs={2}
                      className="for_padding text-end"
                    >
                      {/* {JSON.stringify(showLedgerDiv)} */}
                      {
                        // showLedgerDiv === true ? (
                        // <div
                        //   className={`small-tbl   ${
                        //     selectedLedgerNo === 1
                        //       ? "addLedger1"
                        //       : selectedLedgerNo === 2
                        //       ? "addLedger2"
                        //       : "addLedger3"
                        //   }`}
                        // >
                        //   <Table hover style={{ position: "sticky" }}>
                        //     <thead>
                        //       <tr>
                        //         <th>Name</th>
                        //         <th>Unique Code</th>
                        //       </tr>
                        //     </thead>
                        //     <tbody>
                        //       {lstAdditionalLedger.map((v, i) => {
                        //         return (
                        //           <tr
                        //             onClick={(e) => {
                        //               e.preventDefault();
                        //               if (this.myRef.current != null) {
                        //                 this.myRef.current.setFieldValue(
                        //                   addchgElement1,
                        //                   v.name
                        //                 );
                        //                 this.myRef.current.setFieldValue(
                        //                   addchgElement2,
                        //                   v.id
                        //                 );
                        //                 this.addLedgerModalFun();
                        //               }
                        //             }}
                        //             style={{
                        //               background:
                        //                 v.id === values[addchgElement2]
                        //                   ? "#f8f4d3"
                        //                   : "",
                        //             }}
                        //           >
                        //             <td className="text-center">{v.name}</td>
                        //             <td className="text-center">
                        //               {v.unique_code}
                        //             </td>
                        //           </tr>
                        //         );
                        //       })}
                        //     </tbody>
                        //   </Table>
                        // </div>
                        // <Modal show={showLedgerDiv}>
                        //   <Modal.Header>
                        //     <Modal.Title>Indirect Expenses List</Modal.Title>
                        //   </Modal.Header>
                        //   <Modal.Body>
                        //     <InputGroup className="mb-2  mdl-text">
                        //       <Form.Control
                        //         // autoFocus="true"
                        //         placeholder="Search"
                        //         aria-label="Search"
                        //         aria-describedby="basic-addon1"
                        //         className="mdl-text-box"
                        //         onChange={(v) => {
                        //           this.searchLedger(v.target.value);
                        //         }}
                        //       />
                        //       <InputGroup.Text className="int-grp">
                        //         <img className="srch_box" src={search} alt="" />
                        //       </InputGroup.Text>
                        //     </InputGroup>
                        //     <Table hover style={{ position: "sticky" }}>
                        //       <thead>
                        //         <tr>
                        //           <th>Name</th>
                        //           <th>Unique Code</th>
                        //         </tr>
                        //       </thead>
                        //       <tbody>
                        //         {lstAdditionalLedger.map((v, i) => {
                        //           return (
                        //             <tr
                        //               onClick={(e) => {
                        //                 e.preventDefault();
                        //                 if (this.myRef.current != null) {
                        //                   this.myRef.current.setFieldValue(
                        //                     addchgElement1,
                        //                     v.name
                        //                   );
                        //                   this.myRef.current.setFieldValue(
                        //                     addchgElement2,
                        //                     v.id
                        //                   );
                        //                   this.addLedgerModalFun();
                        //                 }
                        //               }}
                        //               style={{
                        //                 background:
                        //                   v.id === values[addchgElement2]
                        //                     ? "#f8f4d3"
                        //                     : "",
                        //               }}
                        //             >
                        //               <td className="text-center">{v.name}</td>
                        //               <td className="text-center">
                        //                 {v.unique_code}
                        //               </td>
                        //             </tr>
                        //           );
                        //         })}
                        //       </tbody>
                        //     </Table>
                        //   </Modal.Body>
                        // </Modal>
                      }

                      <Table className="tnx-pur-inv-btm-amt-tbl">
                        <tbody>
                          <tr>
                            <td className="py-0" style={{ cursor: "pointer" }}>
                              <InputGroup className="  mdl-text d-flex">
                                <Form.Control
                                  placeholder="Ledger 1"
                                  className="tnx-pur-inv-text-box mt-2"
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  name="additionalChgLedgerName1"
                                  id="additionalChgLedgerName1"
                                  onChange={(v) => {
                                    setFieldValue(
                                      "additionalChgLedgerName1",
                                      v.target.value
                                    );
                                    setFieldValue("additionalChgLedger1", "");
                                    // this.searchLedger(v.target.value);
                                  }}
                                  // onChange={handleChange}
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    if (values.additionalChgLedgerName1 == "") {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp1",
                                        true,
                                        "additionalChgLedgerName1"
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp1",
                                        false,
                                        "additionalChgLedgerName1"
                                      );
                                    }
                                  }}
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.setState(
                                  //       { selectedLedgerNo: 1 },
                                  //       () => {
                                  //         this.addLedgerModalFun(
                                  //           true,
                                  //           "additionalChgLedgerName1",
                                  //           "additionalChgLedger1"
                                  //         );
                                  //       }
                                  //     );
                                  //   }, 100);
                                  // }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ ledgerModalIndExp1: true });

                                    if (values.additionalChgLedgerName1 != "") {
                                      this.ledgerIndExpModalStateChange(
                                        "selectedLedgerIndExp",
                                        values.selectedSupplier
                                      );
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  value={values.additionalChgLedgerName1}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.addLedgerModalFun();
                                  //   }, 200);
                                  // }}
                                />
                                {values.additionalChgLedgerName1 != "" ? (
                                  <InputGroup.Text
                                    style={{
                                      position: "absolute",
                                      margin: "10px 87px",
                                    }}
                                    className="int-grp"
                                    id="basic-addon1"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        values.additionalChgLedgerName1 != ""
                                      ) {
                                        setFieldValue(
                                          "additionalChgLedgerName1",
                                          ""
                                        );
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCancel} />
                                  </InputGroup.Text>
                                ) : (
                                  ""
                                )}
                              </InputGroup>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Add. amt"
                                className="tnx-pur-inv-text-box mt-2 text-end"
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
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
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
                              <InputGroup className="  mdl-text d-flex">
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
                                    // this.searchLedger(v.target.value);
                                  }}
                                  // onChange={handleChange}
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    if (values.additionalChgLedgerName2 == "") {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp2",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp2",
                                        false
                                      );
                                    }
                                  }}
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.setState(
                                  //       { selectedLedgerNo: 2 },
                                  //       () => {
                                  //         this.addLedgerModalFun(
                                  //           true,
                                  //           "additionalChgLedgerName2",
                                  //           "additionalChgLedger2"
                                  //         );
                                  //       }
                                  //     );
                                  //   }, 150);
                                  // }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ ledgerModalIndExp2: true });

                                    if (values.additionalChgLedgerName2 != "") {
                                      this.ledgerIndExpModalStateChange(
                                        "selectedLedgerIndExp",
                                        values.selectedSupplier
                                      );
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  value={values.additionalChgLedgerName2}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.addLedgerModalFun();
                                  //   }, 100);
                                  // }}
                                />
                                {values.additionalChgLedgerName2 != "" ? (
                                  <InputGroup.Text
                                    style={{
                                      position: "absolute",
                                      margin: "10px 87px",
                                    }}
                                    className="int-grp"
                                    id="basic-addon1"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        values.additionalChgLedgerName2 != ""
                                      ) {
                                        setFieldValue(
                                          "additionalChgLedgerName2",
                                          ""
                                        );
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCancel} />
                                  </InputGroup.Text>
                                ) : (
                                  ""
                                )}
                              </InputGroup>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Add. amt"
                                className="tnx-pur-inv-text-box mt-1 text-end"
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
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
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
                              <InputGroup className="  mdl-text d-flex">
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
                                    // this.searchLedger(v.target.value);
                                  }}
                                  // onChange={handleChange}
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    if (values.additionalChgLedgerName3 == "") {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp3",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp3",
                                        false
                                      );
                                    }
                                  }}
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.setState(
                                  //       { selectedLedgerNo: 3 },
                                  //       () => {
                                  //         this.addLedgerModalFun(
                                  //           true,
                                  //           "additionalChgLedgerName3",
                                  //           "additionalChgLedger3"
                                  //         );
                                  //       }
                                  //     );
                                  //   }, 150);
                                  // }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ ledgerModalIndExp3: true });

                                    if (values.additionalChgLedgerName3 != "") {
                                      this.ledgerIndExpModalStateChange(
                                        "selectedLedgerIndExp",
                                        values.selectedSupplier
                                      );
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    }
                                  }}
                                  value={values.additionalChgLedgerName3}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.addLedgerModalFun();
                                  //   }, 100);
                                  // }}
                                />
                                {values.additionalChgLedgerName3 != "" ? (
                                  <InputGroup.Text
                                    style={{
                                      position: "absolute",
                                      margin: "10px 87px",
                                    }}
                                    className="int-grp"
                                    id="basic-addon1"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        values.additionalChgLedgerName3 != ""
                                      ) {
                                        setFieldValue(
                                          "additionalChgLedgerName3",
                                          ""
                                        );
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCancel} />
                                  </InputGroup.Text>
                                ) : (
                                  ""
                                )}
                              </InputGroup>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Add. amt"
                                className="tnx-pur-inv-text-box mt-1 mb-1 text-end"
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
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
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
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_purchase_invoice_create",
                                    to: "tranx_purchase_invoice_list",
                                    isNewTab: false,
                                  });
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
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_invoice_create",
                                      to: "tranx_purchase_invoice_list",
                                      isNewTab: false,
                                    });
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
        </div>
        {/* Adjustment Bill Amount */}
        <Modal
          show={adjustbillshow}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ adjustbillshow: false })}
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Settlement of Bills
            </Modal.Title>

            <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.setState({ adjustbillshow: false })}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button>
          </Modal.Header>

          <Modal.Body className="purchaseumodal p-2 ">
            <div className="purchasescreen">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={invoice_data}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let invoiceValues = this.myRef.current.values;
                  // //console.log(
                  //   "Adjust invoiceValues--------->",
                  //   invoiceValues
                  // );
                  let requestData = new FormData();
                  requestData.append("debitNoteReference", values.newReference);
                  let row = billLst.filter((v) => v.Total_amt != "");
                  if (values.newReference == "true") {
                    let bills = [];
                    row.map((v) => {
                      bills.push({
                        debitNoteId: v.id,
                        debitNotePaidAmt: v.debit_paid_amt,
                        debitNoteRemaningAmt: v.debit_remaining_amt,
                        debitNoteTotalAmt: v.Total_amt,
                        source: v.source,
                      });
                    });
                    requestData.append("bills", JSON.stringify(bills));
                  }

                  requestData.append(
                    "invoice_date",
                    moment(invoice_data.pi_invoice_dt, "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )
                  );
                  requestData.append("newReference", false);
                  requestData.append("invoice_no", invoice_data.pi_no);
                  requestData.append(
                    "purchase_id",
                    invoice_data.purchaseId.value
                  );
                  requestData.append("purchase_sr_no", invoiceValues.pi_sr_no);
                  requestData.append(
                    "transaction_date",
                    moment(invoice_data.pi_transaction_dt, "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )
                  );
                  requestData.append(
                    "supplier_code_id",
                    invoice_data.selectedSupplier.id
                  );
                  // !Invoice Data
                  requestData.append("roundoff", invoiceValues.roundoff);
                  if (
                    invoiceValues.narration &&
                    invoiceValues.narration != ""
                  ) {
                    requestData.append("narration", invoiceValues.narration);
                  }

                  requestData.append("totalamt", invoiceValues.totalamt);
                  requestData.append(
                    "total_purchase_discount_amt",
                    isNaN(parseFloat(invoiceValues.total_purchase_discount_amt))
                      ? 0
                      : parseFloat(invoiceValues.total_purchase_discount_amt)
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

                  requestData.append(
                    "gstNo",
                    invoice_data.gstId !== "" ? invoice_data.gstId.label : ""
                  );
                  requestData.append("totalcgst", totalcgst);
                  requestData.append("totalsgst", totalsgst);
                  requestData.append("totaligst", totaligst);

                  requestData.append(
                    "tcs",
                    invoiceValues.tcs && invoiceValues.tcs != ""
                      ? invoiceValues.tcs
                      : 0
                  );

                  requestData.append(
                    "purchase_discount",
                    invoiceValues.purchase_discount &&
                      invoiceValues.purchase_discount != ""
                      ? invoiceValues.purchase_discount
                      : 0
                  );

                  requestData.append(
                    "purchase_discount_amt",
                    invoiceValues.purchase_discount_amt &&
                      invoiceValues.purchase_discount_amt != ""
                      ? invoiceValues.purchase_discount_amt
                      : 0
                  );

                  requestData.append(
                    "total_purchase_discount_amt",
                    invoiceValues.total_purchase_discount_amt &&
                      invoiceValues.total_purchase_discount_amt != ""
                      ? invoiceValues.total_purchase_discount_amt
                      : 0
                  );
                  if (this.state.selectedPendingOrder.length > 0) {
                    requestData.append(
                      "reference_po_ids",
                      this.state.selectedPendingOrder.join(",")
                    );
                  }

                  if (this.state.selectedPendingChallan.length > 0) {
                    requestData.append(
                      "reference_pc_ids",
                      this.state.selectedPendingChallan.join(",")
                    );
                  }

                  // //console.log("row in create", rows);

                  let frow = [];
                  rows.map((v, i) => {
                    if (v.productId != "") {
                      let newObj = {
                        productId: v.productId ? v.productId : "",
                        inventoryId: v.inventoryId ? v.inventoryId : 0,
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
                      // //console.log("newObj >>>> ", newObj);
                      frow.push(newObj);
                      // //console.log("frow ----------- ", frow);
                    }
                  });
                  // //console.log("frow =->", frow);

                  var filtered = frow.filter(function (el) {
                    return el && el != null;
                  });
                  // //console.log("filtered", filtered);
                  requestData.append("row", JSON.stringify(filtered));
                  requestData.append(
                    "additionalChargesTotal",
                    this.state.additionalChargesTotal
                  );
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

                  if (
                    authenticationService.currentUserValue.state &&
                    invoice_data &&
                    invoice_data.supplierNameId &&
                    invoice_data.supplierNameId.state !=
                      authenticationService.currentUserValue.state
                  ) {
                    let taxCal = {
                      igst: this.state.taxcal.igst,
                    };

                    requestData.append("taxFlag", false);
                    requestData.append(
                      "taxCalculation",
                      JSON.stringify(taxCal)
                    );
                  } else {
                    let taxCal = {
                      cgst: this.state.taxcal.cgst,
                      sgst: this.state.taxcal.sgst,
                    };

                    requestData.append(
                      "taxCalculation",
                      JSON.stringify(taxCal)
                    );
                    requestData.append("taxFlag", true);
                  }
                  for (const pair of requestData.entries()) {
                    //console.log(`key => ${pair[0]}, value =>${pair[1]}`);
                  }
                  createPurchaseInvoice(requestData)
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
                        // resetForm();
                        this.initRow();
                        this.setState({ adjustbillshow: false });

                        eventBus.dispatch(
                          "page_change",
                          "tranx_purchase_invoice_list"
                        );
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
                    .catch((error) => {});
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
                    {/* {JSON.stringify(invoice_data)} */}
                    <Row className="mb-3">
                      <Col md="2">
                        <Form.Group className="gender nightshiftlabel">
                          <Form.Label>
                            <input
                              name="newReference"
                              type="radio"
                              value="true"
                              checked={
                                values.newReference === "true" ? true : false
                              }
                              onChange={handleChange}
                              className="mr-3"
                            />
                            <span className="ml-3">&nbsp;&nbsp;YES</span>
                          </Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="nightshiftlabel">
                          <Form.Label className="ml-3">
                            <input
                              name="newReference"
                              type="radio"
                              value="false"
                              onChange={handleChange}
                              checked={
                                values.newReference === "false" ? true : false
                              }
                              className="mr-3"
                            />
                            <span className="ml-3">&nbsp;&nbsp;NO</span>
                          </Form.Label>

                          <span className="text-danger">
                            {errors.newReference && "Select Option"}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                    {values.newReference === "true" && (
                      <div className="">
                        <Table className="serialnotbl additionachargestbl  table-bordered">
                          <thead>
                            <tr>
                              <th className="">
                                <Form.Group
                                  controlId="formBasicCheckbox"
                                  className="ml-1 mb-1 pmt-allbtn"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    checked={
                                      isAllCheckeddebit === true ? true : false
                                    }
                                    onChange={(e) => {
                                      this.handleBillsSelectionAllDebit(
                                        e.target.checked
                                      );
                                    }}
                                  />
                                </Form.Group>
                              </th>
                              <th>Debit Note No</th>
                              <th> Debit Note Date</th>
                              <th>Total amount</th>
                              <th style={{ width: "23%" }}>Paid Amt</th>
                              <th>Remaining Amt</th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              borderTop: "2px solid transparent",
                              textAlign: "center",
                            }}
                          >
                            {billLst.map((v, i) => {
                              return (
                                <tr>
                                  <td style={{ width: "5%" }}>
                                    <Form.Group
                                      controlId="formBasicCheckbox1"
                                      className="ml-1 pmt-allbtn"
                                    >
                                      <Form.Check
                                        type="checkbox"
                                        checked={selectedBillsdebit.includes(
                                          v.debit_note_no
                                        )}
                                        onChange={(e) => {
                                          this.handleBillselectionDebit(
                                            v.debit_note_no,
                                            i,
                                            e.target.checked
                                          );
                                        }}
                                        // disabled={
                                        //   this.state.billAmount ==
                                        //     this.handleBillselectionDebit() &&
                                        //     selectedBillsdebit.includes(
                                        //       v.debit_note_no
                                        //     ) != true
                                        //     ? true
                                        //     : false
                                        // }
                                      />
                                    </Form.Group>
                                  </td>
                                  <td>{v.debit_note_no}</td>

                                  <td>
                                    {moment(v.debit_note_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </td>

                                  <td>{v.Total_amt}</td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      onChange={(e) => {
                                        e.preventDefault();

                                        this.handleBillPayableAmtChange(
                                          e.target.value,
                                          i
                                        );
                                      }}
                                      value={v.debit_paid_amt}
                                      className="paidamttxt"
                                    />
                                  </td>
                                  <td>
                                    {parseFloat(v.debit_remaining_amt).toFixed(
                                      2
                                    )
                                      ? v.debit_remaining_amt
                                      : 0}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="bb-total">
                            <tr>
                              <td colSpan={2} className="bb-t">
                                {" "}
                                <b>Total</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </td>
                              <td></td>
                              <td>
                                {billLst.length > 0 &&
                                  billLst.reduce(function (prev, next) {
                                    return parseFloat(
                                      parseFloat(prev) +
                                        parseFloat(
                                          next.Total_amt ? next.Total_amt : 0
                                        )
                                    ).toFixed(2);
                                  }, 0)}
                              </td>
                              <td>
                                {" "}
                                {billLst.length > 0 &&
                                  billLst.reduce(function (prev, next) {
                                    return parseFloat(
                                      parseFloat(prev) +
                                        parseFloat(
                                          next.debit_paid_amt
                                            ? next.debit_paid_amt
                                            : 0
                                        )
                                    ).toFixed(2);
                                  }, 0)}
                              </td>
                              <td>
                                {" "}
                                {billLst.length > 0 &&
                                  billLst.reduce(function (prev, next) {
                                    return parseFloat(
                                      parseFloat(prev) +
                                        parseFloat(
                                          next.debit_remaining_amt
                                            ? next.debit_remaining_amt
                                            : 0
                                        )
                                    ).toFixed(2);
                                  }, 0)}
                              </td>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    )}

                    <Row className="m-2">
                      <Col md={12}>
                        <Button
                          className="successbtn-style  float-end"
                          type="submit"
                        >
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
        {/* Ledger Modal Starts */}
        <MdlLedger
          ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
          ledgerModal={ledgerModal}
          ledgerData={ledgerData}
          selectedLedger={selectedLedger}
          userControl={this.props.userControl}
          rows={rows}
          invoice_data={this.myRef.current ? this.myRef.current.values : ""}
          from_source={from_source}
          ledgerId={ledgerId}
          setLedgerId={setLedgerId}
        />
        {/* Ledger Modal Ends */}

        {/* IndirectExp Ledger Modal Starts */}
        <MdlLedgerIndirectExp
          ledgerIndExpModalStateChange={this.ledgerIndExpModalStateChange.bind(
            this
          )}
          ledgerModalIndExp={ledgerModalIndExp}
          ledgerModalIndExp1={ledgerModalIndExp1}
          ledgerModalIndExp2={ledgerModalIndExp2}
          ledgerModalIndExp3={ledgerModalIndExp3}
          ledgerDataIndExp={ledgerDataIndExp}
          selectedLedgerIndExp={selectedLedgerIndExp}
          userControl={this.props.userControl}
          rows={rows}
          invoice_data={this.myRef.current ? this.myRef.current.values : ""}
          from_source={from_source}
        />
        {/*  Ledger Modal Ends */}

        {/* IndirectExp Product Modal Starts */}
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
          from_source={from_source}
          invoice_data={this.myRef.current ? this.myRef.current.values : ""}
          productId={productId}
          setProductId={setProductId}
          setProductRowIndex={setProductRowIndex}
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
            this.myRef.current ? this.myRef.current.values.selectedSupplier : ""
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
            this.myRef.current ? this.myRef.current.values.selectedSupplier : ""
          }
        />
        {/* Costing No Modal Ends */}
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
)(TranxPurchaseInvoiceCreate);
