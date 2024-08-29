import React from "react";
import ReactDOM from "react-dom"; //@neha On Escape key press and On outside Modal click Modal will Close

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  CloseButton,
  Tab,
  Nav,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import moment from "moment";
import Select from "react-select";
import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import MdlLedgerIndirectExp from "@/Pages/Tranx/CMP/MdlLedgerIndirectExp";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import {
  getSundryDebtors,
  getSalesAccounts,
  getProduct,
  getAdditionalLedgers,
  authenticationService,
  getSundryDebtorsIdClient,
  checkLedgerDrugAndFssaiExpiryByLedgerId,
  editSaleChallan,
  get_Product_batch,
  getSalesChallanProductFpuById,
  getProductFlavourList,
  getSaleChallanById,
  checkInvoiceDateIsBetweenFY,
  transaction_ledger_list,
  transaction_product_list,
  transaction_ledger_details,
  get_supplierlist_by_productid,
  transaction_product_details,
  transaction_batch_details,
  delete_ledger,
  delete_Product_list,
  get_sales_challan_supplierlist_by_productid,
  quantityVerificationById,
  getSalesmanMasterOutlet,
} from "@/services/api_functions";

import {
  getSelectValue,
  calculatePercentage,
  calculatePrValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  purchaseSelect,
  fnTranxCalculation,
  isActionExist,
  MyTextDatePicker,
  getValue,
  isFreeQtyExist,
  isMultiDiscountExist,
  getUserControlLevel,
  getUserControlData,
  isUserControl,
  unitDD,
  flavourDD,
  allEqual,
  INRformat,
  OnlyEnterNumbers,
  OnlyEnterAmount,
  fnTranxCalculationRoundDecimalPlaces,
  roundDigit,
  configDecimalPlaces,
} from "@/helpers";
import { setUserControl } from "@/redux/userControl/Action";

import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import CMPTranxRow from "../../Components/CMPTranxRow";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import add from "@/assets/images/add.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import TGSTFooter from "../../Components/TGSTFooter";

import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";

import delete_icon from "@/assets/images/delete_icon.svg";
import add_icon from "@/assets/images/add_icon.svg";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
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

class TranxSalesChallanEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.inputLedgerNameRef = React.createRef();

    this.inputRef1 = React.createRef();
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.clientGSTINRef = React.createRef();
    this.salesAccRef = React.createRef();

    this.state = {
      isTextBox: false,
      ledgerNameFlag: false, //! for focus
      currentTab: "second", //@prathmesh @batch info & product info tab active
      transactionTableStyle: "salesssss",
      add_button_flag: true,
      product_supplier_lst: [],
      isBranch: false,
      batchHideShow: false,
      show: false,
      opendiv: false,
      hidediv: true,
      //invoice_data: "",
      salesAccLst: [],
      serialNoLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      invoiceedit: false,
      Clietdetailmodal: false,
      clientinfo: [],
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,
      selectSerialModal: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      lstBrand: [],
      taxcal: { igst: [], cgst: [], sgst: [] },
      salesEditData: "",
      isEditDataSet: false,
      rowDelDetailsIds: [],
      batchData: "",
      is_expired: false,
      b_details_id: 0,
      isBatch: false,
      batchInitVal: "",
      tr_id: "",
      salesmanLst: [],
      ledgerInputData: "",
      ledgerType: "SD",
      updatedLedgerType: "SD",
      invoice_data: {
        scbill_no: "",
        selectedSupplier: "",
        salesAccId: "",
        sc_sr_no: "",
        supplierCodeId: "",
        supplierNameId: "",
        bill_dt: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        salesmanId: "",
        transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        tcs: 0,
        sales_discount: "",
        sales_discount_amt: "",
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
      ledgerId: "",
      setLedgerId: false,
      from_source: "tranx_sales_challan_edit",

      productId: "",
      setProductId: false,
      setProductRowIndex: -1,
      lstGst: [],
      delAdditionalCahrgesLst: [],
      isLedgerSelectSet: false,
      productData: "",
      ledgerModal: false,
      ledgerModalIndExp: false,
      ledgerModalIndExp1: false,
      ledgerModalIndExp2: false,
      ledgerModalIndExp3: false,
      ledgerNameModal: false,
      newBatchModal: false,
      selectProductModal: false,
      ledgerList: [],
      currentLedgerData: "",
      orgLedgerList: [],
      levelOpt: [],
      ledgerData: "",
      ledgerDataIndExp: "",
      selectedLedger: "",
      selectedLedgerIndExp: "",
      selectedProduct: "",
      batchData: [],
      batchDetails: "",
      showLedgerDiv: false,
      selectedLedgerNo: 1,
      addchgElement1: "",
      addchgElement2: "",
      orglstAdditionalLedger: [],
      product_hover_details: "",
      levelA: "",
      levelB: "",
      levelC: "",
      ABC_flag_value: "",
      isRowProductSet: false,
      saleRateType: "sale",

      transactionType: "sales_edit",
      batch_data_selected: "",
      costingMdl: false,
      costingInitVal: "",
      errorArrayBorder: "",
      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",
      isRoundOffCheck: true,
      sourceUnder: "sale",
      opType: "edit", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
      additionalCharges: [],
      additionalDelDetailsIds: [],
      additionalChargesId: "",
      setAdditionalChargesId: false,
    };
    this.selectRef = React.createRef();
    this.radioRef = React.createRef();
  }

  // @prathmesh @batch info & product info tab active start
  isInputFocused = () => {
    return this.inputLedgerNameRef.current === document.activeElement;
  };
  // @prathmesh @batch info & product info tab active end

  lstAdditionalLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name, ...values };
            });
            let fOpt = Opt.filter(
              (v) => v.label.trim().toLowerCase() !== "round off"
            );
            this.setState({
              lstAdditionalLedger: fOpt,
              orglstAdditionalLedger: fOpt,
            });
          }
        }
      })
      .catch((error) => {});
  };

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    this.setState({ rows: rowValue }, () => {
      this.setState(
        {
          rowIndex: rowIndex,
        },
        () => {
          this.getProductBatchList(rowIndex);
        }
      );

      this.handleTranxCalculation();
    });
  };

  getLevelsOpt = (element, rowIndex, parent) => {
    let { rows } = this.state;
    return rows[rowIndex] && rows[rowIndex][parent]
      ? rows[rowIndex][parent][element]
      : [];
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
          let { ledgerModalStateChange } = this.props;
          ledgerModalStateChange("ledgerData", res.result);
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
    requestData.append("batchNo", batchNo.batch_no);
    requestData.append("id", batchNo.b_details_id);
    // requestData.append("id", batchNo.id);
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

  openSerialNo = (rowIndex) => {
    // debugger
    //console.log("rowIndex-->>", rowIndex);
    let { rows } = this.state;
    let serialNoLst = rows[rowIndex]["serialNo"];
    // console.log("serialNoLst", serialNoLst);

    if (serialNoLst && serialNoLst.length == 0) {
      serialNoLst = Array(6)
        .fill("")
        .map((v) => {
          return { serial_detail_id: 0, serial_no: v };
        });
    } else if (serialNoLst == undefined) {
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

  handleLstBrand = (lstBrand) => {
    this.setState({ lstBrand: lstBrand });
  };

  getProductPackageLst = (product_id, rowIndex = -1) => {
    let reqData = new FormData();
    let { rows, lstBrand } = this.state;
    let findProductPackges = getSelectValue(lstBrand, product_id);
    console.warn("rahul::findProductPackges ", findProductPackges);
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
              .length >= 0
          ) {
            rows[rowIndex]["levelcId"] =
              findProductPackges["levelAOpt"][0]["levelBOpt"][0][
                "levelCOpt"
              ][0];
          }
          rows[rowIndex]["unitId"] =
            findProductPackges["levelAOpt"][0]["levelBOpt"][0]["levelCOpt"][0][
              "unitOpt"
            ][0];
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
          console.log("error", error);
        });
    }
  };

  openBatchNo = (rowIndex) => {
    let { rows } = this.state;
    this.handleRowStateChange(
      rows,
      rows[rowIndex]["is_batch"], // true,
      rowIndex
    );
  };

  getProductFlavorpackageUnitbyids = (invoice_id) => {
    let reqData = new FormData();
    reqData.append("id", invoice_id);
    getSalesChallanProductFpuById(reqData)
      .then((res) => res.data)
      .then((response) => {
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

  handleLstPackage = (lstPackages) => {
    this.setState({ lstPackages: lstPackages });
  };
  ledgerModalStateChange = (ele, val) => {
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        // this.inputLedgerNameRef.current.focus();
        if (this.state.ledgerNameFlag) {
          if (this.state.lstGst.length > 1 && this.clientGSTINRef.current) {
            this.clientGSTINRef.current.focus();
          } else if (this.salesAccRef.current) {
            this.salesAccRef.current.focus();
          }
        } else {
          document.getElementById("transaction_dt").focus();
        }
      });
    } else {
      this.setState({ [ele]: val });
    }
  };
  ledgerFilterData = () => {
    let {
      orgLedgerList,
      updatedLedgerType,
      currentLedgerData,
      ledgerInputData,
    } = this.state;

    // console.warn(
    //   "{ orgLedgerList, updatedLedgerType, currentLedgerData, ledgerInputData }::",
    //   { updatedLedgerType, currentLedgerData }
    // );
    if (currentLedgerData != "" && currentLedgerData != undefined) {
      let filterData = [];
      orgLedgerList != "" &&
        orgLedgerList.map((v) => {
          if (
            v.ledger_name
              .toLowerCase()
              .includes(ledgerInputData.toLowerCase()) ||
            (v.code != null &&
              v.code.toLowerCase().includes(ledgerInputData.toLowerCase()))
          ) {
            filterData.push(v);
          }
        });
      if (updatedLedgerType === "SC") {
        filterData = filterData.filter((v) => v.type == "SC");
      } else if (updatedLedgerType === "SD") {
        filterData = filterData.filter((v) => v.type == "SD");
      }
      // console.warn("filterData::", filterData);
      const index = filterData.findIndex((object) => {
        return object.id === currentLedgerData.id;
      });
      if (index >= 0) {
        setTimeout(() => {
          console.warn("selectedLEdger index " + index);
          document.getElementById("LedgerMdlTr_" + index).focus();
        }, 200);
      }
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
            this.setState({ lstDisLedger: fOpt });
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
            //console.log("prop_data", prop_data);
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
              //console.log("invoice_data", init_d);
            }
            // this.myRef.current.setFieldValue("salesAccId", v[0]);
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleClientDetails = (status) => {
    let { invoice_data } = this.state;
    //console.log({ invoice_data });
    if (status == true) {
      let reqData = new FormData();
      let sun_id =
        invoice_data.supplierNameId && invoice_data.supplierNameId.value;
      reqData.append("sundry_debtors_id", sun_id);
      getSundryDebtorsIdClient(reqData)
        .then((response) => {
          //console.log("res", response);
          let res = response.data;
          if (res.responseStatus == 200) {
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

  lstProduct = () => {
    getProduct()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let opt = data.map((v) => {
            return {
              label: v.productName,
              value: v.id,
              isBatchNo: v.isBatchNo,
            };
          });
          this.setState({ productLst: opt });
        }
      })
      .catch((error) => {});
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
        dis_amt: "",
        dis_per: "",
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
        b_no: "",
        b_rate: 0,
        rate_a: 0,
        costing: 0,
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
  // initAdditionalCharges = (len = null) => {
  //   // additionalCharges
  //   let lst = [];
  //   let condition = 5;
  //   if (len != null) {
  //     condition = len;
  //   }
  //   for (let index = 0; index < condition; index++) {
  //     let data = {
  //       additional_charges_details_id: 0,
  //       ledger_id: "",
  //       amt: "",
  //     };
  //     lst.push(data);
  //   }
  //   if (len != null) {
  //     let addLst = [...this.state.additionalCharges, ...lst];
  //     this.setState({ additionalCharges: addLst });
  //   } else {
  //     this.setState({ additionalCharges: lst });
  //   }
  // };

  initAdditionalCharges = (len = 0) => {
    // additionalCharges
    let lst = [];
    if (len > 0) {
      len = len;
    } else {
      len = 5;
    }
    for (let index = 0; index < len; index++) {
      let data = {
        ledgerId: "",
        amt: "",
      };
      lst.push(data);
    }
    this.setState({ additionalCharges: lst });
  };

  //update

  setSalesChallanEditData = () => {
    const { id } = this.state.salesEditData;
    let formData = new FormData();
    formData.append("id", id);
    getSaleChallanById(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data, additional_charges, row, narration } = res;
          const {
            salesAccLst,
            supplierNameLst,
            supplierCodeLst,
            productLst,
            lstAdditionalLedger,
            lstBrand,
            salesmanLst,
          } = this.state;

          /*   console.log({
            supplierNameLst,
            supplierCodeLst,
          }); */
          //console.log("res challan", res);

          let additionLedger1 = "";
          let additionLedger2 = "";
          let additionLedger3 = "";
          let totalAdditionalCharges = 0;
          let additionLedgerAmt1 = 0;
          let additionLedgerAmt2 = 0;
          let additionLedgerAmt3 = "";
          let discountInPer = res.discountInPer;
          let discountInAmt = res.discountInAmt;

          let d = moment(invoice_data.bill_date, "YYYY-MM-DD").toDate();
          let opt = [];
          if (res.additionLedger1 > 0) {
            additionLedger1 = res.additionLedger1 ? res.additionLedger1 : "";
            additionLedgerAmt1 = res.additionLedgerAmt1;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt1);
          }
          if (res.additionLedger2 > 0) {
            additionLedger2 = res.additionLedger2 ? res.additionLedger2 : "";
            additionLedgerAmt2 = res.additionLedgerAmt2;
            totalAdditionalCharges =
              parseFloat(totalAdditionalCharges) +
              parseFloat(res.additionLedgerAmt2);
          }
          if (res.additionLedger3 > 0) {
            additionLedger3 = res.additionLedger3 ? res.additionLedger3 : "";
            additionLedgerAmt3 = res.additionLedgerAmt3;
          }

          let initInvoiceData = {
            id: invoice_data.id,
            sc_sr_no: invoice_data.sales_sr_no,
            scbill_no: invoice_data.sc_bill_no,
            narration: invoice_data.narration,
            transaction_dt:
              invoice_data.bill_date != ""
                ? moment(new Date(d)).format("DD/MM/YYYY")
                : "",
            gstNo: invoice_data.gstNo,
            salesAccId: getSelectValue(
              salesAccLst,
              invoice_data.sales_account_id
            ),
            EditsupplierId: invoice_data.debtor_id,
            supplierCodeId: "",
            supplierNameId: "",

            // supplierCodeId: invoice_data.debtor_id ? invoice_data.debtor_id : "",

            // supplierNameId: invoice_data.debtor_name
            //   ? getValue(supplierNameLst, invoice_data.debtor_name)
            //   : "",

            salesmanId:
              invoice_data.salesmanId != ""
                ? getSelectValue(salesmanLst, parseInt(invoice_data.salesmanId))
                : "",

            transport_name:
              invoice_data.transport_name != null
                ? invoice_data.transport_name
                : "",
            reference:
              invoice_data.reference != null ? invoice_data.reference : "",

            purchase_discount: discountInPer,
            purchase_discount_amt: discountInAmt,
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
          };

          if (
            initInvoiceData.supplierNameId &&
            initInvoiceData.supplierNameId != ""
          ) {
            opt = initInvoiceData.supplierNameId.gstDetails.map((v, i) => {
              return {
                label: v.gstNo,
                value: v.id,
              };
            });
          }
          this.myRef.current.setFieldValue("narration", narration);

          //console.log("initInvoiceData", initInvoiceData);
          let initRowData = [];
          if (row.length >= 0) {
            //console.log("Rowsssss------->", row);
            initRowData = row.map((v, i) => {
              //console.log("rahul::v", v);
              let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
              //console.log("productOpt", productOpt);

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

              //console.log("v.levelcId.unitOpt   >>>", v.levelcId.unitOpt);
              v["unitId"] = v.unitId
                ? getSelectValue(v.levelcId.unitOpt, parseInt(v.unitId))
                : "";
              v["unit_id"] = unit_id;
              v["qty"] = v.qty != "" ? v.qty : "";
              v["rate"] = v.rate != "" ? v.rate : 0;
              v["base_amt"] = v.base_amt != "" ? v.base_amt : 0;
              v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : 0;
              v["packing"] = v.pack_name != "" ? v.pack_name : "";
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
              v["b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : 0;
              v["is_batch"] = v.is_batch != "" ? v.is_batch : "";

              return v;
            });
          }
          //console.log("row---===>", initRowData);

          if (initInvoiceData.gstNo != "")
            initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
          else initInvoiceData["gstId"] = opt[0];

          initInvoiceData["tcs"] = res.tcs;
          initInvoiceData["narration"] = res.narration;
          console.warn("rahul::initInvoiceData ", initInvoiceData);
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              isRoundOffCheck: res.invoice_data.isRoundOffCheck,
              additionalChargesTotal: totalAdditionalCharges,
              lstGst: opt,
              isLedgerSelectSet: true,
            },
            () => {
              setTimeout(() => {
                // this.setState({
                //   isRowProductSet: true,
                //   isLedgerSelectSet: true,
                // });
                // this.handleTranxCalculation();
                if (res.invoice_data.roundoff == 0) {
                  this.setState({ isRoundOffCheck: false }, () => {
                    this.handleTranxCalculation("roundoff", !false);
                  });
                } else {
                  this.setState({ isRoundOffCheck: true }, () => {
                    this.handleTranxCalculation("roundoff", !true);
                  });
                }
              }, 25);
            }
          );
        }
      })
      .catch((error) => {});
  };

  handleMstState = (rows) => {
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TSCEProductId-particularsname-" + id).focus();
      }, 1000);
    });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  setSupplierData = (clientId = "", setFieldValue) => {
    console.warn("rahul :: clientId", clientId);

    let requestData = new FormData();
    requestData.append("ledgerId", clientId && clientId.value);
    checkLedgerDrugAndFssaiExpiryByLedgerId(requestData)
      .then((response) => {
        //console.log("res", response);
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
              handleSuccessFn: () => {
                console.warn("rahul:: continue invoice");
              },
              handleFailFn: () => {
                console.warn("rahul:: exit from invoice or reload page");
                this.reloadPage();
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

    let opt = [];
    opt = clientId.gstDetails.map((v, i) => {
      return {
        label: v.gstin,
        value: v.id,
      };
    });
    console.warn("rahul::opt ", opt);
    this.setState({ lstGst: opt }, () => {
      if (opt.length > 0) setFieldValue("gstId", opt[0]);
    });
  };

  // checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
  //   console.warn("rahul :: invoiceDate", invoiceDate);
  //   let requestData = new FormData();
  //   requestData.append(
  //     "invoiceDate",
  //     moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
  //   );
  //   checkInvoiceDateIsBetweenFY(requestData)
  //     .then((response) => {
  //       console.log("res", response);
  //       let res = response.data;
  //       if (res.responseStatus != 200) {
  //         MyNotifications.fire(
  //           {
  //             show: true,
  //             icon: "confirm",
  //             title: "Challan date not valid as per FY",
  //             msg: "Do you want continue with challan date",
  //             is_button_show: false,
  //             is_timeout: false,
  //             delay: 0,
  //             handleSuccessFn: () => {
  //               console.warn("rahul:: continue invoice");
  //             },
  //             handleFailFn: () => {
  //               console.warn("rahul:: exit from invoice or reload page");
  //               this.invoiceDateRef.current.focus();
  //               setFieldValue("transaction_dt", "");
  //             },
  //           },
  //           () => {
  //             console.warn("rahul :: return_data");
  //           }
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };
  checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
    let requestData = new FormData();
    requestData.append(
      "invoiceDate",
      moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
    );
    checkInvoiceDateIsBetweenFY(requestData)
      .then((response) => {
        //console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "warning",
              title: "Warning",
              msg: "Invoice date not valid as per Fiscal year",
              // msg: " ",
              is_button_show: false,
              is_timeout: true,
              delay: 1200,
              // handleSuccessFn: () => {},
              // handleFailFn: () => {
              //   setFieldValue("transaction_dt", "");
              //   eventBus.dispatch("page_change", {
              //     from: "tranx_purchase_invoice_create",
              //     to: "tranx_purchase_invoice_list",
              //     isNewTab: false,
              //   });
              //   // this.reloadPage();
              // },
            },
            () => {}
          );
          setTimeout(() => {
            this.invoiceDateRef.current.focus();
          }, 2000);
        } else {
          setTimeout(() => {
            document.getElementById("supplierNameId").focus();
          }, 100);
        }
        // else {
        //   let d = new Date();
        //   d.setMilliseconds(0);
        //   d.setHours(0);
        //   d.setMinutes(0);
        //   d.setSeconds(0);
        //   const enteredDate = moment(invoiceDate, "DD-MM-YYYY");
        //   const currentDate = moment(d);
        //   if (enteredDate.isAfter(currentDate)) {
        //     MyNotifications.fire({
        //       show: true,
        //       icon: "confirm",
        //       title: "confirm",
        //       msg: "Entered date is greater than current date",
        //       // is_button_show: true,
        //       handleSuccessFn: () => {
        //         if (enteredDate != "") {
        //           setTimeout(() => {
        //             this.inputRef1.current.focus();
        //           }, 500);
        //         }
        //       },
        //       handleFailFn: () => {
        //         // setFieldValue("transaction_dt", "");
        //         // eventBus.dispatch(
        //         //   "page_change",
        //         //   "tranx_purchase_invoice_create"
        //         // );

        //         setTimeout(() => {
        //           document.getElementById("transaction_dt").focus();
        //         }, 500);
        //         // this.reloadPage();
        //       },
        //     });
        //   } else if (enteredDate.isBefore(currentDate)) {
        //     MyNotifications.fire({
        //       show: true,
        //       icon: "confirm",
        //       title: "confirm",
        //       msg: "Entered date is smaller than current date",
        //       // is_button_show: true,
        //       handleSuccessFn: () => {
        //         if (enteredDate != "") {
        //           setTimeout(() => {
        //             this.inputRef1.current.focus();
        //           }, 500);
        //         }
        //       },
        //       handleFailFn: () => {
        //         // setFieldValue("transaction_dt", "");
        //         // eventBus.dispatch("page_change", {
        //         //   from: "tranx_purchase_invoice_create",
        //         //   to: "tranx_purchase_invoice_list",
        //         //   isNewTab: false,
        //         // });

        //         setTimeout(() => {
        //           document.getElementById("transaction_dt").focus();
        //         }, 500);
        //         // this.reloadPage();
        //       },
        //     });
        //   }
        // }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // handlePropsData = (prop_data) => {
  //   if (prop_data.mdl_additionalcharges) {
  //     this.setState({
  //       additionchargesyes: true,
  //     });
  //   }

  //   if (prop_data.invoice_data) {
  //     this.setState({
  //       invoice_data: prop_data.invoice_data,
  //       rows: prop_data.rows,
  //     });
  //   } else {
  //     this.setState({ invoice_data: prop_data });
  //   }
  // };

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
    // console.log({ element, value, index });
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
          v["igst"] = value.igst;
          v["gst"] = value.igst;
          v["cgst"] = value.cgst;
          v["sgst"] = value.sgst;
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
            vi["igst"] = value.igst;
            vi["gst"] = value.igst;
            vi["cgst"] = value.cgst;
            vi["sgst"] = value.sgst;

            return vi;
          });
        }

        return v;
      } else {
        return v;
      }
    });
    this.setState({ rows: frows, lstPackages: [] }, () => {
      if (
        element == "productId" &&
        value != "" &&
        value != undefined &&
        value != null
      ) {
        this.setState({ transaction_detail_index: index }, () => {
          this.getProductPackageLst(value.value);
          //   console.log("in  if statement of getProductPackageLst ");
        });
      }
      this.handleAdditionalChargesSubmit();
    });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });

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
    //console.log("serial no", rows);
    //console.log({ element, index });
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
    // //console.log({ rows, serialnoshowindex });
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
                    // //console.log(e.target.value);
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
    // //console.log({ element, index, value });

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

  handleRemoveAddtionalChargesRow = (rowIndex = -1) => {
    let { additionalCharges, additionalDelDetailsIds } = this.state;

    ////console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = additionalCharges.filter((v, i) => i === rowIndex);

    if (deletedRow) {
      deletedRow.map((uv, ui) => {
        if (!additionalDelDetailsIds.includes(uv.details_id)) {
          additionalDelDetailsIds.push(uv.details_id);
        }
      });
    }

    additionalCharges = additionalCharges.filter((v, i) => i != rowIndex);
    this.handleClearProduct1(additionalCharges);
  };
  handleClearProduct1 = (frows) => {
    this.setState({ additionalCharges: frows }, () => {
      this.handleTranxCalculation();
    });
  };
  // handleClearProduct = (frows) => {
  //   this.setState({ additionalCharges: frows }, () => {
  //     this.handleTranxCalculation();
  //   });
  // };

  handleAdditionalChargesHide = () => {
    this.setState({ ledgerModalIndExp: false }, () => {
      this.handleTranxCalculation();
    });
  };

  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
    });
  };

  handleCGSTChange = (ele, value, rowIndex) => {
    ////console.log("ele", { ele, value, rowIndex });
    let { taxcal, cgstData } = this.state;
    ////console.log("amt", value);
    const newData = taxcal;
    ////console.log("newData", newData);

    newData.cgst[rowIndex].amt = value;
    // newData.sgst[rowIndex].amt = value1;
    // let igstData = value + value1;
    // newData.igst[rowIndex].amt = igstData;

    ////console.log("newData", newData.cgst[rowIndex].amt);
    ////console.log("newData---", newData, this.state.taxcal);

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
      parseFloat(roffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(billAmt)).toFixed(2)
    );
  };

  handleSGSTChange = (ele, value, rowIndex) => {
    ////console.log("ele", { ele, value, rowIndex });
    let { taxcal, sgstData, cgstData } = this.state;
    ////console.log("amt", value);
    const newData = taxcal;
    ////console.log("newData", newData);

    newData.sgst[rowIndex].amt = value;
    ////console.log("newData", newData.sgst[rowIndex].amt);
    ////console.log("newData---", newData, this.state.taxcal);
    let igstData =
      parseFloat(newData.sgst[rowIndex].amt) + parseFloat(cgstData);

    newData.igst[rowIndex].amt = igstData;

    this.setState({ taxcal: newData, sgstData: newData.sgst[rowIndex].amt });
    let totaltaxAmt = newData.igst.reduce((prev, next) => prev + next.amt, 0);
    let totalAmt = this.myRef.current.values.total_taxable_amt;

    ////console.log("totaltaxAmt--totalAmt-", totaltaxAmt, totalAmt);

    let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);
    let roundoffamt = Math.round(billAmt);
    let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

    // //console.log(
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
      parseFloat(roffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      parseFloat(Math.round(billAmt)).toFixed(2)
    );
  };
  handleTranxCalculation = (elementFrom = "", isCal = false) => {
    // !Most IMP̥
    let { rows, additionalChargesTotal, isRoundOffCheck } = this.state;

    let ledger_disc_amt = 0;
    let ledger_disc_per = 0;
    let takeDiscountAmountInLumpsum = false;
    let isFirstDiscountPerCalculate = false;
    let addChgLedgerAmt1 = 0;
    let addChgLedgerAmt2 = 0;
    let addChgLedgerAmt3 = 0;
    let inp_tcs_per = 0;
    let inp_tcs_amt = 0;

    if (this.myRef.current) {
      let {
        purchase_discount,
        purchase_discount_amt,
        additionalChgLedgerAmt1,
        additionalChgLedgerAmt2,
        additionalChgLedgerAmt3,
        tcs_per,
        tcs_amt,
      } = this.myRef.current.values;

      inp_tcs_per = tcs_per;
      inp_tcs_amt = tcs_amt;
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

    let resTranxFn = fnTranxCalculationRoundDecimalPlaces({
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
      tcs_per: inp_tcs_per,
      tcs_amt: inp_tcs_amt,
      configDecimalPlaces: configDecimalPlaces,
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
      tcs_per_cal,
      tcs_amt_cal,
    } = resTranxFn;

    let roundoffamt = 0;
    let roffamt = 0;
    // let roundoffamt = Math.round(total_final_amt);
    // let roffamt = parseFloat(roundoffamt - total_final_amt).toFixed(2);
    if (
      (elementFrom.toLowerCase() == "roundoff" && isCal == true) ||
      isRoundOffCheck == false
    ) {
      roundoffamt = roundDigit(total_final_amt, configDecimalPlaces);
      roffamt = 0;
      bill_amount = roundDigit(bill_amount, configDecimalPlaces);
    } else {
      roundoffamt = Math.round(total_final_amt);
      bill_amount = Math.round(parseFloat(bill_amount));
      roffamt = roundDigit(roundoffamt - total_final_amt, configDecimalPlaces);
    }

    this.myRef.current.setFieldValue(
      "tcs_per",
      isNaN(parseFloat(tcs_per_cal))
        ? 0
        : roundDigit(tcs_per_cal, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "tcs_amt",
      isNaN(parseFloat(tcs_amt_cal))
        ? 0
        : roundDigit(tcs_amt_cal, configDecimalPlaces)
    );

    this.myRef.current.setFieldValue(
      "total_base_amt",
      isNaN(parseFloat(base_amt))
        ? 0
        : roundDigit(base_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      roundDigit(total_purchase_discount_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt1",
      roundDigit(total_row_gross_amt1, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt",
      roundDigit(total_row_gross_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_row_gross_amt",
      roundDigit(total_row_gross_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      roundDigit(total_taxable_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_tax_amt",
      roundDigit(total_tax_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      roundDigit(Math.abs(roffamt), configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      roundDigit(roundoffamt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "bill_amount",
      roundDigit(bill_amount, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_invoice_dis_amt",
      roundDigit(total_invoice_dis_amt, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_qty",
      roundDigit(total_qty, configDecimalPlaces)
    );
    this.myRef.current.setFieldValue(
      "total_free_qty",
      roundDigit(total_free_qty, configDecimalPlaces)
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
    //console.log("(ele, value, rowIndex) ", ele, value, rowIndex, { rows });

    // if (value == "" && ele == "qty") {
    //   value = 0;
    // }
    rows[rowIndex][ele] = value;

    if (ele == "dis_per" && parseFloat(value) > parseFloat(100)) {
      rows[rowIndex][ele] = "";
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Discount is exceeding 100%",
        is_button_show: true,
      });
    } else if (ele == "rate") {
      if (
        parseFloat(rows[rowIndex]["b_rate"]) != 0 &&
        parseFloat(value) > parseFloat(rows[rowIndex]["b_rate"])
      ) {
        rows[rowIndex][ele] = "";
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Sale rate should be less than MRP",
          is_button_show: true,
        });
      }
    } else if (ele == "qty") {
      if (
        parseFloat(rows[rowIndex]["qty"]) == 0 &&
        !isFreeQtyExist("is_free_qty", this.props.userControl)
      ) {
        rows[rowIndex][ele] = "";
      } else if (
        parseFloat(rows[rowIndex]["is_negative"]) == false &&
        parseFloat(rows[rowIndex]["qty"]) >
          parseFloat(rows[rowIndex]["closing_stock"])
      ) {
        rows[rowIndex][ele] = "";
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Quantity is greater than current stock",
          is_button_show: true,
        });
      }
    }

    if (ele == "unitId") {
      if (rows[rowIndex]["is_batch"] === true && ele == "unitId") {
        this.handleRowStateChange(
          rows,
          rows[rowIndex]["is_batch"], // true,
          rowIndex
        );
      }
    } else {
      this.handleRowStateChange(rows, false, rowIndex);
    }
  };

  handleRoundOffchange = (v) => {
    // //console.log("roundoff", v);
    const { rows, additionalChargesTotal } = this.state;
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      // //console.log("v", v.final_amt);
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

        // v['base_amt'] = v['base_amt_H'] + v['base_amt_M'] + v['base_amt_L'];
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

    // //console.log("totalamt", totalamt);
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

    // //console.log("ntotalamt", ntotalamt);
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
    let total_purchase_discount_amt = 0;

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
        // //console.log("final_amt", v["final_amt"]);
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

    this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.myRef.current.setFieldValue("totalamt", parseFloat(famt).toFixed(2));
    this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });

    this.setState(
      { rows: frow, additionchargesyes: false, taxcal: taxState },
      () => {
        // if (this.state.rows.length != 10) {
        //   this.initRow(10 - this.state.rows.length);
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

  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
  };

  getProductBatchList = (rowIndex, source = "batch") => {
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
    //console.log("productData", productData);
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
              batchOpt =
                unitdata.batchOpt && unitdata.batchOpt.length > 0
                  ? unitdata.batchOpt.map((v) => {
                      v["expiry_date"] =
                        v["expiry_date"] && v["expiry_date"] != ""
                          ? moment(v["expiry_date"], "YYYY-MM-DD").format(
                              "DD/MM/YYYY"
                            )
                          : "";
                      v["manufacturing_date"] =
                        v["manufacturing_date"] && v["manufacturing_date"] != ""
                          ? moment(
                              v["manufacturing_date"],
                              "YYYY-MM-DD"
                            ).format("DD/MM/YYYY")
                          : "";
                      return v;
                    })
                  : [];
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
            res = res.map((v) => {
              v["expiry_date"] =
                v["expiry_date"] && v["expiry_date"] != ""
                  ? moment(v["expiry_date"], "YYYY-MM-DD").format("DD/MM/YYYY")
                  : "";
              v["manufacturing_date"] =
                v["manufacturing_date"] && v["manufacturing_date"] != ""
                  ? moment(v["manufacturing_date"], "YYYY-MM-DD").format(
                      "DD/MM/YYYY"
                    )
                  : "";
              return v;
            });

            this.setState(
              {
                batchData: res,
                invoice_data: invoice_data,
              },
              () => {
                this.getInitBatchValue(rowIndex, source);
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
          this.getInitBatchValue(rowIndex, source);
        }
      );
    }
    // let id = parseInt(this.state.rows.length) - 1;
    // if (document.getElementById("TSCCAddBtn-" + id) != null) {
    //   setTimeout(() => {
    //     document.getElementById("TSCCAddBtn-" + id).focus();
    //   });
    // }
  };

  getInitBatchValue = (rowIndex = -1, source) => {
    let { rows } = this.state;
    let costingcal = rows[rowIndex]["total_amt"] / rows[rowIndex]["qty"];
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
        b_purchase_rate: rows[rowIndex]["rate"],
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

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      details_id: 0,
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
      free_qty: "",
      rate: "",
      base_amt: 0,
      dis_amt: "",
      dis_per: "",
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
      b_no: "",
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

    //console.log("rows", rows, rowIndex, rowDelDetailsIds);
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
  searchLedger = (search = "") => {
    //console.log({ search });
    let { orglstAdditionalLedger, element1, element2 } = this.state;
    let orglstAdditionalLedger_F = [];
    if (search.length > 0) {
      orglstAdditionalLedger_F = orglstAdditionalLedger.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.unique_code.toLowerCase().includes(search.toLowerCase())
      );

      //console.log({ orglstAdditionalLedger });
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
  productModalStateChange = (obj, callTrxCal = false) => {
    this.setState(obj, () => {
      if (callTrxCal) {
        this.handleTranxCalculation();
      }
    });

    if (obj.isProduct == "productMdl") {
      setTimeout(() => {
        document
          .getElementById("TSCEProductId-particularsname-" + obj.rowIndex)
          .focus();
      }, 250);
      this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
    }

    if (obj.isBatchMdl == "batchMdl") {
      setTimeout(() => {
        // document
        //   .getElementById("TSCEProductId-batchNo-" + obj.rowIndex)  //commented due to focus on qty field after batch select
        //   .focus();
      }, 250);
    }
  };
  ledgerNameModalFun = (status) => {
    this.setState({ ledgerNameModal: [status] });
  };
  NewBatchModalFun = (status) => {
    this.setState({ newBatchModal: status });
  };
  SelectProductModalFun = (status, row_index = -1) => {
    this.setState({ selectProductModal: status, rowIndex: row_index });
  };

  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "tranx_sales_challan_edit",
      to: "tranx_sales_challan_list",
    });
  };

  handleAddAdditionalCharges = () => {
    let { additionalCharges } = this.state;
    let data = {
      ledgerId: "",
      amt: "",
    };
    additionalCharges = [...additionalCharges, data];
    this.setState({ additionalCharges: additionalCharges });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      this.lstSalesAccounts();
      this.initRow();
      this.initAdditionalCharges();

      // this.transaction_product_listFun();
      this.transaction_ledger_listFun();

      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.lstSalesmanMaster();

      mousetrap.bindGlobal("ctrl+h", this.handleClientForm);
      const { prop_data } = this.props.block;
      console.warn("first", prop_data);
      this.setState(
        { source: prop_data, salesEditData: prop_data.prop_data },
        () => {
          //console.log("source", this.state.source);
          if (prop_data.prop_data.id) {
            this.getProductFlavorpackageUnitbyids(prop_data.prop_data.id);
          }

          this.handlePropsData(prop_data);
        }
      );
      this.getUserControlLevelFromRedux();

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }
  //@neha @On outside Modal click Modal will Close
  handleClickOutside = (event) => {
    const modalNode = ReactDOM.findDOMNode(this.customModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ ledgerModal: false });
    }
  };

  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
    //console.log("getUserControlLevelFromRedux : ", level);
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

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close

    mousetrap.unbindGlobal("ctrl+h", this.handleClientForm);
    // alt key button disabled start
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    // alt key button disabled end
  }
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };

  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end

  handlePropsData = (prop_data) => {
    if (prop_data.mdl_additionalcharges) {
      this.setState({
        additionchargesyes: true,
      });
    }
    if (prop_data.prop_data.invoice_data) {
      console.warn("prop_data.isproduct", prop_data);
      this.setState(
        {
          invoice_data: prop_data.prop_data.invoice_data,
          // rows: prop_data.prop_data.rows,
          additionalChargesId: prop_data.additionalChargesId,
          rows: prop_data.prop_data.rows,
          productId: prop_data.prop_data.productId,
          ledgerId: prop_data.prop_data.ledgerId,
          setProductRowIndex: prop_data.prop_data.rowIndex,
        },
        () => {
          this.setState(
            {
              ledgerId: prop_data.prop_data.ledgerId,
              setLedgerId: true,
              productId: prop_data.prop_data.productId,
              setProductId: true,
              setProductRowIndex: prop_data.prop_data.rowIndex,
              additionalChargesId: prop_data.additionalChargesId,
              setAdditionalChargesId: true,
              setAdditionalChargesIndex: prop_data.setAdditionalChargesIndex,
            },
            () => {
              // setTimeout(() => {
              //   this.inputRef1.current.focus();
              // }, 1500);
              setTimeout(() => {
                //@Vinit @Focusing the previous tab were we left
                // debugger;
                if (prop_data.isProduct == "productMdl") {
                  document
                    .getElementById(
                      "TSCEProductId-particularsname-" + prop_data.rowIndex
                    )
                    .focus();
                  // document.getElementById("TSIEProductId-" + prop_data.prop_data.rowIndex).focus();
                } else {
                  this.inputLedgerNameRef.current.focus();
                  // document.getElementById("TSIEProductId-" + prop_data.prop_data.rowIndex).focus();
                }
              }, 1500);
            }
          );
        }
      );
    } else {
      // this.setState({ invoice_data: prop_data });
    }
  };

  componentDidUpdate() {
    if (AuthenticationCheck()) {
      const {
        supplierNameLst,
        supplierCodeLst,
        salesAccLst,
        lstAdditionalLedger,
        isEditDataSet,
        salesEditData,
        productLst,
        lstDisLedger,
        lstBrand,
      } = this.state;
      if (
        // supplierNameLst.length > 0 &&
        // supplierCodeLst.length > 0 &&
        salesAccLst.length > 0 &&
        lstAdditionalLedger.length > 0 &&
        lstBrand.length > 0 &&
        // productLst.length > 0 &&
        isEditDataSet == false &&
        salesEditData != ""
      ) {
        this.setSalesChallanEditData();
      }
    }
  }

  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
  };
  get_sales_challan_supplierlist_by_productidFun = (product_id = 0) => {
    let requestData = new FormData();
    //console.log("prooduct id", product_id);
    requestData.append("productId", product_id);
    get_sales_challan_supplierlist_by_productid(requestData)
      .then((response) => {
        let res = response.data;
        let onlyfive = [];
        //console.log("Supplier data-", res);
        if (res.responseStatus == 200) {
          let idc = res.data;

          // onlyfive = idc.filter((e) => {
          //   return null;
          if (idc.length <= 10) {
            for (let i = 0; i < idc.length; i++) {
              onlyfive.push(idc[i]);
            }
            //console.log("lessthan equal to five", onlyfive);
          } else {
            var count = 1;
            onlyfive = idc.filter((e) => {
              if (count <= 10) {
                count++;
                return e;
              }
              return null;
            });
            //console.log("greater than five", onlyfive);
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
  qtyVerificationById = (
    productId,
    levelaId,
    levelbId = "",
    levelcId = "",
    unitId,
    batchId,
    qty,
    rowIndex = -1
  ) => {
    /* console.log(
      "verify----",
      productId,
      levelaId,
      levelbId,
      levelcId,
      unitId,
      batchId,
      qty
    ); */
    let { rows } = this.state;
    let requestData = new FormData();
    requestData.append("product_id", productId);
    requestData.append("levelAId", levelaId != "" ? levelaId.value : "");

    requestData.append("levelBId", levelbId != "" ? levelbId.value : "");
    requestData.append("levelCId", levelcId != "" ? levelcId.value : "");
    requestData.append("unitId", unitId.value);
    requestData.append("batchId", batchId != "" ? batchId.value : "");
    requestData.append("qty", qty);

    quantityVerificationById(requestData).then((response) => {
      //console.log("res : ", response);
      let res = response.data;
      //console.log("res validate", res);
      if (res.responseStatus == 409) {
        rows[rowIndex]["qty"] = "";
        this.setState({ rows: rows }, () => {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,
          });
        });
      }
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
  lstSalesmanMaster = () => {
    getSalesmanMasterOutlet()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let opt = res.responseObject.map((v, i) => {
            return { label: v.firstName + " " + v.lastName, value: v.id };
          });
          this.setState({ salesmanLst: opt }, () => {});
        }
      })
      .catch((error) => {});
  };
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  handleRoundOffCheck = (value) => {
    this.setState({ isRoundOffCheck: value }, () => {
      this.handleTranxCalculation("roundoff", !value);
    });
    // let { taxcal } = this.state;

    // if (value == true) {
    //   let totaltaxAmt = taxcal.igst.reduce((prev, next) => prev + next.amt, 0);
    //   let totalAmt = this.myRef.current.values.total_taxable_amt;

    //   let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);

    //   let roundoffamt = Math.round(billAmt);
    //   let roffamt = parseFloat(roundoffamt - billAmt).toFixed(2);

    //   this.myRef.current.setFieldValue(
    //     "total_tax_amt",
    //     parseFloat(totaltaxAmt)
    //   );
    //   this.myRef.current.setFieldValue(
    //     "roundoff",
    //     Math.abs(parseFloat(roffamt).toFixed(2))
    //   );
    //   this.myRef.current.setFieldValue("bill_amount", roundoffamt);
    // } else {
    //   let totaltaxAmt = taxcal.igst.reduce((prev, next) => prev + next.amt, 0);
    //   let totalAmt = this.myRef.current.values.total_taxable_amt;

    //   let billAmt = parseFloat(totalAmt) + parseFloat(totaltaxAmt);

    //   let roundoffamt = 0;

    //   this.myRef.current.setFieldValue(
    //     "total_tax_amt",
    //     parseFloat(totaltaxAmt).toFixed(2)
    //   );
    //   this.myRef.current.setFieldValue(
    //     "roundoff",
    //     Math.abs(parseFloat(roundoffamt).toFixed(2))
    //   );
    //   this.myRef.current.setFieldValue("bill_amount", billAmt);
    // }
  };

  setledgerInputData(propValue, flag) {
    this.setState(
      { ledgerInputData: propValue, isTextBox: flag, ledgerModal: true },
      () => {
        this.myRef.current.setFieldValue("supplierNameId", propValue);
      }
    );
  }

  // @harish @ focusToNextElement onKeyDown == 13
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
      currentTab, //@prathmesh @batch info & product info tab
      isTextBox,
      ledgerInputData,
      add_button_flag,
      product_supplier_lst,
      isBranch,
      gstId,
      invoice_data,
      batchHideShow,
      isLedgerSelectSet,
      invoiceedit,
      salesAccLst,
      supplierNameLst,
      lstAdditionalLedger,
      currentLedgerData,
      updatedLedgerType,
      ledgerType,
      supplierCodeLst,
      rows,
      productLst,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      additionalChargesTotal,
      Clietdetailmodal,
      clientinfo,
      lstGst,
      lstBrand,
      taxcal,
      rowDelDetailsIds,
      batchModalShow,
      is_expired,
      b_details_id,
      batchInitVal,
      isBatch,
      batchData,
      tr_id,
      delAdditionalCahrgesLst,
      batch_data_selected,
      ledgerModal,
      ledgerModalIndExp,
      ledgerModalIndExp1,
      ledgerModalIndExp2,
      ledgerModalIndExp3,
      ledgerNameModal,
      newBatchModal,
      selectProductModal,
      ledgerList,
      ledgerData,
      ledgerDataIndExp,
      selectedLedger,
      selectedLedgerIndExp,
      selectedProduct,
      productData,
      rowIndex,
      levelOpt,
      batchDetails,
      showLedgerDiv,
      addchgElement1,
      addchgElement2,
      selectedLedgerNo,
      orglstAdditionalLedger,
      product_hover_details,
      levelA,
      levelB,
      levelC,
      ABC_flag_value,
      isRowProductSet,
      transactionType,
      costingMdl,
      costingInitVal,
      errorArrayBorder,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      serialNoLst,
      selectSerialModal,
      ledgerId,
      setLedgerId,
      from_source,
      productId,
      setProductId,
      setProductRowIndex,
      salesmanLst,
      saleRateType,
      isRoundOffCheck,
      transactionTableStyle,
      sourceUnder,
      opType, // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
      setAdditionalChargesId,
      additionalChargesId,
    } = this.state;

    const isFocused = this.isInputFocused(); //@prathmesh @batch info & product info tab active

    return (
      <>
        <div className="purchase-tranx">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={invoice_data}
            enableReinitialize={true}
            // validationSchema={Yup.object().shape({
            //   // salesAccId: Yup.object().nullable().required("Required"),
            //   // supplierCodeId: Yup.string().trim().required("select client code"),
            //   // supplierNameId: Yup.object()
            //   //   .nullable()
            //   //   .required("Client Name is Required"),
            //   transaction_dt: Yup.string().required("Challan Date is Required"),
            //   scbill_no: Yup.string()
            //     .trim()
            //     .required("Challan No. is Required"),
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let errorArray = [];
              if (values.transaction_dt == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.supplierNameId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.scbill_no == "") {
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
                            msg: "Do you want to Update ?",
                            is_button_show: false,
                            is_timeout: false,
                            delay: 0,
                            handleSuccessFn: () => {
                              let requestData = new FormData();
                              //console.log({ values, invoice_data });
                              requestData.append("id", invoice_data.id);
                              // !Invoice Data
                              requestData.append(
                                "bill_dt",
                                moment(
                                  new Date(
                                    moment(
                                      values.transaction_dt,
                                      "DD/MM/YYYY"
                                    ).toDate()
                                  )
                                ).format("YYYY-MM-DD")
                              );
                              requestData.append("bill_no", values.scbill_no);
                              requestData.append(
                                "sales_acc_id",
                                invoice_data.salesAccId.value
                              );
                              requestData.append(
                                "sales_sr_no",
                                invoice_data.sc_sr_no
                              );
                              requestData.append(
                                "debtors_id",
                                invoice_data.selectedSupplier.id
                              );
                              requestData.append(
                                "gstNo",
                                values.gstId !== "" ? values.gstId.label : ""
                              );
                              if (values.narration && values.narration !== "") {
                                requestData.append(
                                  "narration",
                                  values.narration
                                );
                              }
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
                              // !Invoice Data
                              requestData.append(
                                "isRoundOffCheck",
                                isRoundOffCheck
                              );

                              requestData.append("roundoff", values.roundoff);
                              requestData.append(
                                "total_base_amt",
                                values.total_base_amt
                              );
                              requestData.append("totalamt", values.totalamt);
                              requestData.append(
                                "taxable_amount",
                                values.total_taxable_amt
                              );
                              requestData.append("totalcgst", totalcgst);
                              requestData.append("totalsgst", totalsgst);
                              requestData.append("totaligst", totaligst);
                              requestData.append(
                                "totalqty",
                                values.totalqty && values.totalqty != ""
                                  ? values.totalqty
                                  : 0
                              );
                              requestData.append(
                                "tcs",
                                values.tcs && values.tcs != "" ? values.tcs : 0
                              );
                              requestData.append(
                                "sales_discount",
                                values.purchase_discount &&
                                  values.purchase_discount != ""
                                  ? values.purchase_discount
                                  : 0
                              );

                              requestData.append(
                                "total_sales_discount_amt",
                                values.total_purchase_discount_amt &&
                                  values.total_purchase_discount_amt != ""
                                  ? values.total_purchase_discount_amt
                                  : 0
                              );

                              requestData.append(
                                "sales_discount_amt",
                                values.purchase_discount_amt &&
                                  values.purchase_discount_amt != ""
                                  ? values.purchase_discount_amt
                                  : 0
                              );
                              let frow = rows.map((v, i) => {
                                if (v.productId != "") {
                                  v.productId = v.productId ? v.productId : "";
                                  v.details_id = v.details_id
                                    ? v.details_id
                                    : 0;
                                  v["unit_conv"] = v.unitId
                                    ? v.unitId.unitConversion
                                    : "";
                                  v["unitId"] = v.unitId ? v.unitId.value : "";
                                  v["levelaId"] = v.levelaId
                                    ? v.levelaId.value
                                    : "";
                                  v["levelbId"] = v.levelbId
                                    ? v.levelbId.value
                                    : "";
                                  v["levelcId"] = v.levelcId
                                    ? v.levelcId.value
                                    : "";

                                  v["is_multi_unit"] = v.is_multi_unit;
                                  v["rate"] = v.rate;
                                  v["dis_amt"] =
                                    v.dis_amt != "" ? v.dis_amt : 0;
                                  v["dis_per"] =
                                    v.dis_per != "" ? v.dis_per : 0;
                                  v["dis_per2"] =
                                    v.dis_per2 != "" ? v.dis_per2 : 0;
                                  v["rate_a"] = v.rate_a;
                                  v["rate_b"] = v.rate_b;
                                  v["rate_c"] = v.rate_c;
                                  v["margin_per"] = v.margin_per;
                                  v["min_margin"] = v.min_margin;
                                  v["b_details_id"] =
                                    v.b_details_id != "" ? v.b_details_id : 0;
                                  v["b_expiry"] =
                                    v.b_expiry != ""
                                      ? moment(v.b_expiry).format("yyyy-MM-DD")
                                      : "";
                                  v["manufacturing_date"] =
                                    v.manufacturing_date != ""
                                      ? moment(v.manufacturing_date).format(
                                          "yyyy-MM-DD"
                                        )
                                      : "";
                                  v["is_batch"] = v.is_batch;
                                  v["isBatchNo"] = v.b_no;
                                  v["igst"] = v.igst != "" ? v.igst : 0;
                                  v["cgst"] = v.cgst != "" ? v.cgst : 0;
                                  v["sgst"] = v.sgst != "" ? v.sgst : 0;
                                  return v;
                                }
                              });
                              //console.log("frow", frow);
                              /*  console.log(
                                "additionalCharges",
                                additionalCharges
                              ); */

                              var filtered = frow.filter(function (el) {
                                return el != null;
                              });
                              requestData.append(
                                "row",
                                JSON.stringify(filtered)
                              );

                              requestData.append(
                                "additionalChargesTotal",
                                additionalChargesTotal
                              );
                              requestData.append("sale_type", "sales_invoice");

                              if (
                                values.additionalChgLedger1 !== "" &&
                                values.additionalChgLedgerAmt1 !== ""
                              ) {
                                requestData.append(
                                  "additionalChgLedger1",
                                  values.additionalChgLedger1 !== ""
                                    ? values.additionalChgLedger1
                                    : ""
                                );
                                requestData.append(
                                  "addChgLedgerAmt1",
                                  values.additionalChgLedgerAmt1 !== ""
                                    ? values.additionalChgLedgerAmt1
                                    : 0
                                );
                              }
                              if (
                                values.additionalChgLedger2 !== "" &&
                                values.additionalChgLedgerAmt2 !== ""
                              ) {
                                requestData.append(
                                  "additionalChgLedger2",
                                  values.additionalChgLedger2 !== ""
                                    ? values.additionalChgLedger2
                                    : ""
                                );
                                requestData.append(
                                  "addChgLedgerAmt2",
                                  values.additionalChgLedgerAmt2 !== ""
                                    ? values.additionalChgLedgerAmt2
                                    : 0
                                );
                              }
                              if (
                                values.additionalChgLedger3 !== "" &&
                                values.additionalChgLedgerAmt3 !== ""
                              ) {
                                requestData.append(
                                  "additionalChgLedger3",
                                  values.additionalChgLedger3 !== ""
                                    ? values.additionalChgLedger3
                                    : ""
                                );
                                requestData.append(
                                  "addChgLedgerAmt3",
                                  values.additionalChgLedgerAmt3 !== ""
                                    ? values.additionalChgLedgerAmt3
                                    : 0
                                );
                              }

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
                                // console.log("taxCal", taxCal);
                                requestData.append(
                                  "taxCalculation",
                                  JSON.stringify(taxCal)
                                );
                                requestData.append("taxFlag", true);
                              }

                              if (values.total_qty !== "") {
                                requestData.append(
                                  "total_qty",
                                  values.total_qty !== ""
                                    ? parseInt(values.total_qty)
                                    : 0
                                );
                              }
                              if (values.total_free_qty !== "") {
                                requestData.append(
                                  "total_free_qty",
                                  values.total_free_qty !== ""
                                    ? values.total_free_qty
                                    : 0
                                );
                              }

                              // !Total Qty*Rate
                              requestData.append(
                                "total_row_gross_amt",
                                values.total_row_gross_amt
                              );
                              requestData.append(
                                "total_base_amt",
                                values.total_base_amt
                              );
                              // !Discount
                              requestData.append(
                                "total_invoice_dis_amt",
                                values.total_invoice_dis_amt
                              );
                              // !Taxable Amount
                              requestData.append(
                                "taxable_amount",
                                values.total_taxable_amt
                              );
                              // !Taxable Amount
                              requestData.append(
                                "total_tax_amt",
                                values.total_tax_amt
                              );
                              // !Bill Amount
                              requestData.append(
                                "bill_amount",
                                values.bill_amount
                              );

                              let filterRowDetail = [];
                              if (rowDelDetailsIds.length > 0) {
                                filterRowDetail = rowDelDetailsIds.map((v) => {
                                  return { del_id: v };
                                });
                              }
                              requestData.append(
                                "rowDelDetailsIds",
                                JSON.stringify(filterRowDetail)
                              );

                              editSaleChallan(requestData)
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
                                      from: "tranx_sales_challan_edit",
                                      to: "tranx_sales_challan_list",
                                      // prop_data: {
                                      //   editId: this.state.salesEditData.id,
                                      //   rowId: this.props.block.prop_data.rowId,
                                      // },
                                      isNewTab: false,
                                      isCancel: true,
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
                            },
                            handleFailFn: () => {},
                          },
                          () => {
                            console.warn("return_data");
                          }
                        );
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
                style={{ overflowX: "hidden", overflowY: "hidden" }}
                autoComplete="off"
                className="frm-tnx-purchase-invoice"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <>
                  {/* {JSON.stringify(errors)} */}
                  <div className="div-style">
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
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    isClearable
                                    options={salesAccLst}
                                    isDisabled
                                    name="purchaseId"
                                    onChange={(v) => {
                                      setFieldValue("branchId", v);
                                    }}
                                    autoComplete="true"
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
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto"
                              >
                                <Form.Label>
                                  Challan Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Tab" &&
                                      values.transaction_dt === "__/__/____"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                >
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.invoiceDateRef.current = input;
                                    }}
                                    autoFocus="true"
                                    // className="tnx-pur-inv-date-style "
                                    name="transaction_dt"
                                    id="transaction_dt"
                                    placeholder="DD/MM/YYYY"
                                    value={values.transaction_dt}
                                    onChange={handleChange}
                                    autoComplete="true"
                                    className={`${
                                      values.transaction_dt == "" &&
                                      errorArrayBorder[0] == "Y"
                                        ? "border border-danger tnx-pur-inv-date-style"
                                        : "tnx-pur-inv-date-style"
                                    }`}
                                    // onBlur={(e) => {
                                    //   e.preventDefault();

                                    //   console.log("e ", e);
                                    //   console.log(
                                    //     "e.target.value ",
                                    //     e.target.value
                                    //   );
                                    //   if (
                                    //     e.target.value != null &&
                                    //     e.target.value != ""
                                    //   ) {
                                    //     this.setErrorBorder(0, "");
                                    //     console.warn(
                                    //       "rahul:: isValid",
                                    //       moment(
                                    //         e.target.value,
                                    //         "DD-MM-YYYY"
                                    //       ).isValid()
                                    //     );
                                    //     if (
                                    //       moment(
                                    //         e.target.value,
                                    //         "DD-MM-YYYY"
                                    //       ).isValid() == true
                                    //     ) {
                                    //       setFieldValue(
                                    //         "transaction_dt",
                                    //         e.target.value
                                    //       );
                                    //       this.checkInvoiceDateIsBetweenFYFun(
                                    //         e.target.value,
                                    //         setFieldValue
                                    //       );
                                    //     } else {
                                    //       MyNotifications.fire({
                                    //         show: true,
                                    //         icon: "error",
                                    //         title: "Error",
                                    //         msg: "Invalid invoice date",
                                    //         is_button_show: true,
                                    //       });
                                    //       this.invoiceDateRef.current.focus();
                                    //       setFieldValue("transaction_dt", "");
                                    //     }
                                    //   } else {
                                    //     setFieldValue("transaction_dt", "");
                                    //     this.setErrorBorder(0, "Y");
                                    //   }
                                    //   // } else {
                                    //   //   document
                                    //   //     .getElementById("transaction_dt")
                                    //   //     .focus();
                                    //   // }
                                    // }}
                                    // onBlur={(e) => {
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
                                    //         "transaction_dt",
                                    //         e.target.value
                                    //       );
                                    //       this.checkInvoiceDateIsBetweenFYFun(
                                    //         e.target.value,
                                    //         setFieldValue
                                    //       );
                                    //     } else {
                                    //       MyNotifications.fire({
                                    //         show: true,
                                    //         icon: "error",
                                    //         title: "Error",
                                    //         msg: "Invalid invoice date",
                                    //         is_button_show: true,
                                    //       });
                                    //       this.invoiceDateRef.current.focus();
                                    //       setFieldValue("transaction_dt", "");
                                    //     }
                                    //   } else {
                                    //     setFieldValue("transaction_dt", "");
                                    //   }
                                    // }}
                                    onKeyDown={(e) => {
                                      if (
                                        (e.shiftKey == true &&
                                          e.keyCode == 9) ||
                                        e.keyCode == 9 ||
                                        e.keyCode == 13
                                      ) {
                                        if (e.target.value) {
                                          // @prathmesh @DD/MM type then current year auto show start
                                          let datchco = e.target.value.trim();
                                          let repl = datchco.replace(/_/g, "");

                                          if (repl.length === 6) {
                                            const currentYear = new Date().getFullYear();
                                            let position = 6;
                                            repl = repl.split("");
                                            repl.splice(
                                              position,
                                              0,
                                              currentYear
                                            );
                                            let finle = repl.join("");
                                            //console.log("finfinfinfin", finle);
                                            e.target.value = finle;
                                            setFieldValue(
                                              "transaction_dt",
                                              finle
                                            );
                                          }
                                          //current year auto show end
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
                                            // this.focusNextElement(e);
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
                                      }
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger errormsg">
                                  {errors.transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="px-0 my-auto"
                              >
                                <Form.Label>
                                  Client Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={10} md={10} sm={10} xs={10}>
                                <Form.Control
                                  ref={this.inputLedgerNameRef}
                                  type="text"
                                  // className="tnx-pur-inv-text-box text-start"
                                  placeholder=" Client Name "
                                  name="supplierNameId"
                                  id="supplierNameId"
                                  // onChange={handleChange}
                                  autoComplete="true"
                                  className={`${
                                    values.supplierNameId == "" &&
                                    errorArrayBorder[1] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box text-start"
                                      : "tnx-pur-inv-text-box text-start"
                                  }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value.trim()) {
                                      this.setErrorBorder(1, "");
                                    } else {
                                      if (
                                        values.selectedSupplier != "" &&
                                        values.selectedSupplier != null
                                      ) {
                                        setFieldValue(
                                          "supplierNameId",
                                          values.selectedSupplier.ledger_name
                                        );
                                      }
                                      this.setErrorBorder(1, "Y");
                                    }
                                  }}
                                  onChange={(e) => {
                                    e.preventDefault();

                                    this.setledgerInputData(
                                      e.target.value,
                                      true,
                                      setFieldValue
                                    );
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (values.selectedSupplier != "") {
                                      this.setState(
                                        {
                                          currentLedgerData:
                                            values.selectedSupplier,
                                          ledgerNameFlag: true,
                                        },
                                        () => {
                                          this.ledgerFilterData();
                                        }
                                      );
                                      this.ledgerModalStateChange(
                                        "selectedLedger",
                                        values.selectedSupplier
                                      );

                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                    } else {
                                      this.setState({
                                        currentLedgerData: "",
                                        ledgerNameFlag: true,
                                      });
                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                    }
                                    this.setState({ currentTab: "first" }); //@prathmesh @batch info & product info tab active
                                  }}
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    this.setState({ currentTab: "first" });
                                  }}
                                  value={values.supplierNameId}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.ledgerModalStateChange(
                                        "ledgerModal",
                                        true
                                      );
                                      this.setState(
                                        {
                                          currentLedgerData:
                                            values.selectedSupplier,
                                          ledgerNameFlag: true,
                                        },
                                        () => {
                                          // console.log(
                                          //   "values.supplierNameId::",
                                          //   values.supplierNameId
                                          // );
                                          this.ledgerFilterData();
                                        }
                                      );
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value.trim()
                                    ) {
                                      e.preventDefault();
                                    } else if (e.key === "Alt") {
                                      e.preventDefault();
                                    } else if (e.keyCode == 40) {
                                      this.setState({ ledgerNameFlag: true });
                                      //! this condition for down button press 1409
                                      if (ledgerModal == true)
                                        document
                                          .getElementById("LedgerMdlTr_0")
                                          .focus();
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.supplierNameId}
                                </span> */}
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
                                className="my-auto"
                              >
                                <Form.Label>Client GST</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.clientGSTINRef}
                                    className="selectTo"
                                    components={{
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    options={lstGst}
                                    name="gstId"
                                    onChange={(v) => {
                                      setFieldValue("gstId", v);
                                    }}
                                    autoComplete="true"
                                    value={values.gstId}
                                  />
                                </Form.Group>

                                <span className="text-danger errormsg">
                                  {touched.gstId && errors.gstId}
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
                                className="my-auto"
                              >
                                <Form.Label>Sales A/C</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8} className="pe-0">
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.salesAccRef}
                                    className="selectTo"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={purchaseSelect}
                                    isClearable
                                    options={salesAccLst}
                                    name="salesAccId"
                                    onChange={(v) => {
                                      setFieldValue("salesAccId", v);
                                    }}
                                    autoComplete="true"
                                    value={values.salesAccId}
                                  />
                                </Form.Group>

                                <span className="text-danger errormsg">
                                  {errors.salesAccId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto"
                              >
                                <Form.Label>Challan Sr. No.</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="Challan Sr"
                                  name="sc_sr_no"
                                  id="sc_sr_no"
                                  disabled
                                  isClearable={false}
                                  readOnly={true}
                                  onChange={handleChange}
                                  autoComplete="true"
                                  value={values.sc_sr_no}
                                  isValid={touched.sc_sr_no && !errors.sc_sr_no}
                                  isInvalid={!!errors.sc_sr_no}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sc_sr_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="my-auto p-0"
                              >
                                <Form.Label>
                                  Challan No.{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Control
                                  // className="tnx-pur-inv-text-box"
                                  type="text"
                                  placeholder="Challan No."
                                  name="scbill_no"
                                  id="scbill_no"
                                  isClearable={true}
                                  onChange={handleChange}
                                  autoComplete="true"
                                  className={`${
                                    values.scbill_no == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  /*    onInput={(e) => {
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  }} */
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value.trim()) {
                                      this.setErrorBorder(2, "");
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      // document
                                      //   .getElementById("scbill_no")
                                      //   .focus();
                                    }
                                  }}
                                  value={values.scbill_no}
                                  isValid={
                                    touched.scbill_no && !errors.scbill_no
                                  }
                                  isInvalid={!!errors.scbill_no}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      !e.target.value
                                    ) {
                                      e.preventDefault();
                                    } else if (
                                      e.keyCode == 13 &&
                                      e.target.value
                                    ) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.scbill_no}
                                </span> */}
                              </Col>
                              {/* </Row>
                          </Col>

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row> */}
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="my-auto"
                              >
                                <Form.Label>Salesman</Form.Label>
                              </Col>

                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Select
                                  className="selectTo"
                                  // disabled={isInputDisabled}
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  styles={purchaseSelect}
                                  isClearable={true}
                                  options={salesmanLst}
                                  name="salesmanId"
                                  id="salesmanId"
                                  onChange={(v) => {
                                    setFieldValue("salesmanId", v);
                                  }}
                                  value={values.salesmanId}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg="3" md="3" sm="3" xs="3">
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto"
                              >
                                <Form.Label>Delivery Type</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Select
                                  className="selectTo"
                                  // disabled={isInputDisabled}
                                  // components={{
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  styles={purchaseSelect}
                                  isClearable={true}
                                  // options={salesmanLst}
                                  name="salesmanId"
                                  id="salesmanId"
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                      this.setState({ currentTab: "second" });
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
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
                    batchHideShow={true}
                    productLst={productLst}
                    productNameData={productNameData}
                    unitIdData={unitIdData}
                    productData={productData}
                    batchNoData={batchNoData}
                    qtyData={qtyData}
                    rateData={rateData}
                    productId="TSCEProductId-"
                    addBtnId="TSCEAddBtn-"
                    getProductPackageLst={this.getProductPackageLst.bind(this)}
                    selectProductModal={selectProductModal}
                    selectedProduct={selectedProduct}
                    userControl={this.props.userControl}
                    from_source={from_source}
                    invoice_data={
                      this.myRef.current ? this.myRef.current.values : ""
                    }
                    productIdRow={productId}
                    setProductId={setProductId}
                    setProductRowIndex={setProductRowIndex}
                    rowIndex={rowIndex}
                    newBatchModal={newBatchModal}
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
                    transaction_batch_detailsFun={this.transaction_batch_detailsFun.bind(
                      this
                    )}
                    transaction_product_detailsFun={this.transaction_product_detailsFun.bind(
                      this
                    )}
                    opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
                  />

                  {/* <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={4}>
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
                    <Col lg={4}>
                      <Row>
                        <Col lg={6} className="my-auto">
                          <span className="span-lable">Batch Expiry:</span>
                          {product_hover_details.batch_expiry ? (
                            <span className="span-value">
                           
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
                        
                          <span className="custom_hr_style">|</span>
                        </Col>
                        <Col lg={6}>
                          <span className="span-lable">Barcode:</span>
                          <span className="span-value">
                            {product_hover_details.barcode}
                          </span>
                          
                        </Col>
                      </Row>
                    </Col>
              
                  </Row> */}
                  <Row className="mx-0 btm-data">
                    <Col
                      lg={8}
                      md={8}
                      sm={8}
                      xs={8}
                      style={{ paddingTop: "5px" }}
                    >
                      <Tab.Container
                        id="left-tabs-example"
                        // @prathmesh @batch info & product info tab active start
                        // activeKey={
                        //   ledgerModal === true || isFocused === true
                        //     ? "first"
                        //     : productData !== ""
                        //       ? "second"
                        //       : "second"
                        // }
                        activeKey={currentTab}
                        // @prathmesh @batch info & product info tab active end
                        defaultActiveKey="second" // @prathmesh @product info tab active
                      >
                        <Nav variant="pills" className="flex-row">
                          <Nav.Item>
                            <Nav.Link
                              eventKey="first"
                              className="me-2 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ currentTab: "first" }); //@prathmesh @batch info & product info tab active
                              }}
                              tabIndex={-1}
                            >
                              <Button
                                id="TSCE_Ledger_Tab"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    currentTab: "first",
                                  });
                                }}
                                className={`${
                                  currentTab == "first"
                                    ? "nav-link active"
                                    : "nav-link"
                                }`}
                                onFocus={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    currentTab: "first",
                                  });
                                }}
                                onKeyDown={(e) => {
                                  // if (e.keyCode == 13) {
                                  //   this.focusNextElement(e);
                                  // } else
                                  if (e.shiftKey && e.keyCode == 9) {
                                  } else if (
                                    e.keyCode == 9 ||
                                    e.keyCode == 13 ||
                                    e.keyCode == 39
                                  ) {
                                    e.preventDefault();
                                    this.focusNextElement(e);
                                    this.setState({ currentTab: "second" });
                                  }
                                }}
                              >
                                Ledger
                              </Button>
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              className="p-0"
                              eventKey="second"
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
                              }}
                              tabIndex={-1}
                            >
                              <Button
                                id="TSCE_Product_Tab"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    currentTab: "second",
                                  });
                                }}
                                className={`${
                                  currentTab == "second"
                                    ? "nav-link active"
                                    : "nav-link"
                                }`}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode == 9) {
                                    this.setState({ currentTab: "first" });
                                  } else if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  } else if (e.keyCode == 37) {
                                    document
                                      .getElementById("TSCE_Ledger_Tab")
                                      .focus();
                                    this.setState({ currentTab: "first" });
                                  }
                                }}
                              >
                                Product
                              </Button>
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>

                        <Tab.Content style={{ paddingTop: "15px" }}>
                          <Tab.Pane eventKey="first">
                            <Row className="tnx-pur-inv-description-style ">
                              <Col
                                lg={3}
                                style={{
                                  borderRight: "1px solid #EAD8B1",
                                }}
                              >
                                <h6 className="title-style">Ledger Info:</h6>
                                <div className="d-flex">
                                  <span className="span-lable">GST No:</span>
                                  <span className="span-value">
                                    {ledgerData.gst_number}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Area:</span>
                                  <span className="span-value">
                                    {ledgerData.area}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Bank:</span>
                                  <span className="span-value">
                                    {ledgerData.bank_name}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span
                                    className="span-lable"
                                    style={{ color: "transparent" }}
                                  >
                                    {" "}
                                    .
                                  </span>
                                  <span className="span-value"></span>
                                </div>
                              </Col>
                              <Col
                                lg={3}
                                style={{
                                  borderRight: "1px solid #EAD8B1",
                                }}
                              >
                                <div className="d-flex">
                                  <span className="span-lable">
                                    Contact Person:
                                  </span>
                                  <span className="span-value">
                                    {ledgerData.contact_name}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Transport:</span>
                                  <span className="span-value">
                                    {/* {product_hover_details.hsn} */}
                                    {/* {ledgerData.area} */}
                                  </span>
                                </div>
                              </Col>
                              <Col
                                lg={3}
                                style={{
                                  borderRight: "1px solid #EAD8B1",
                                }}
                              >
                                <div className="d-flex">
                                  <span className="span-lable">
                                    Credit Days:
                                  </span>
                                  <span className="span-value">
                                    {ledgerData.credit_days}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">FSSAI:</span>
                                  <span className="span-value">
                                    {/* {product_hover_details.tax_type} */}
                                    {ledgerData.fssai_number}
                                  </span>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="d-flex">
                                  <span className="span-lable">
                                    License No:
                                  </span>
                                  <span className="span-value">
                                    {ledgerData.license_number}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <span className="span-lable">Route:</span>
                                  <span className="span-value">
                                    {/* {product_hover_details.tax_type} */}
                                    {ledgerData.route}
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          </Tab.Pane>
                          <Tab.Pane eventKey="second">
                            <Row>
                              <Col lg={8} className="">
                                <Row className="tnx-pur-inv-description-style">
                                  <Col
                                    lg={6}
                                    className="pe-0"
                                    style={{
                                      borderRight: "1px solid #EAD8B1",
                                    }}
                                  >
                                    <h6 className="title-style">
                                      Product Info:
                                    </h6>
                                    <div className="d-flex">
                                      {" "}
                                      <span className="span-lable">Brand:</span>
                                      <span className="span-value">
                                        {productData.brand}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">Group:</span>
                                      <span className="span-value">
                                        {productData.group}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Category:
                                      </span>
                                      <span className="span-value">
                                        {productData.category}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Supplier:
                                      </span>
                                      <span className="span-value">
                                        {productData.supplier}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col
                                    lg={3}
                                    style={{
                                      borderRight: "1px solid #EAD8B1",
                                    }}
                                    className="col-top-margin pe-0"
                                  >
                                    <div className="d-flex">
                                      <span className="span-lable">HSN:</span>
                                      <span className="span-value">
                                        {/* {product_hover_details.hsn} */}
                                        {productData.hsn}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Tax Type:
                                      </span>
                                      <span className="span-value">
                                        {/* {product_hover_details.tax_type} */}
                                        {productData.tax_type}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">Tax%:</span>
                                      <span className="span-value">
                                        {productData.tax_per}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Margin%:
                                      </span>
                                      <span className="span-value">
                                        {productData.margin_per}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col lg={3} className="col-top-margin pe-0">
                                    <div className="d-flex">
                                      <span className="span-lable">Cost:</span>
                                      <span className="span-value">
                                        {productData.cost}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Shelf ID:
                                      </span>
                                      <span className="span-value">
                                        {/* {product_hover_details.hsn} */}
                                        {productData.shelf_id}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Min Stock:
                                      </span>
                                      <span className="span-value">
                                        {[productData.min_stocks]}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Max Stock:
                                      </span>
                                      <span className="span-value">
                                        {productData.max_stocks}
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4}>
                                <Row className="tnx-pur-inv-description-style">
                                  <Col lg={12}>
                                    <h6 className="title-style">Batch Info:</h6>
                                    <div className="d-flex">
                                      <span className="span-lable">Name:</span>
                                      <span className="span-value">
                                        {batchDetails != ""
                                          ? batchDetails.supplierName
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Bill no:
                                      </span>
                                      <span className="span-value">
                                        {batchDetails != ""
                                          ? batchDetails.billNo
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="span-lable">
                                        Bill Date:
                                      </span>
                                      <span className="span-value">
                                        {batchDetails != ""
                                          ? moment(
                                              batchDetails.billDate
                                            ).format("DD/MM/YYYY")
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="d-flex">
                                      <span
                                        className="span-lable"
                                        style={{ color: "transparent" }}
                                      >
                                        {" "}
                                        .
                                      </span>
                                      <span className="span-value"></span>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Tab.Pane>
                        </Tab.Content>
                      </Tab.Container>
                      <Row className="p-2">
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
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) this.focusNextElement(e);
                            }}
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
                                      {INRformat.format(v.dis_amt)}
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
                      className="pe-0"
                      style={{ borderLeft: "1px solid #D9D9D9" }}
                    >
                      <Row className="pe-2">
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
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
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
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      {/* <TGSTFooter
                        values={values}
                        taxcal={taxcal}
                        authenticationService={authenticationService}
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
                          <Col lg={12} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              Total Qty:
                            </span>
                            <span className="errormsg">{values.total_qty}</span>
                          </Col>
                        </Row>

                        <Row className="tMS">
                          <Col lg={12} className="for_remove_padding">
                            <span className="tnx-pur-inv-span-text">
                              Free Qty:
                            </span>
                            <span className="errormsg">
                              {isNaN(values.total_free_qty) === true
                                ? 0
                                : values.total_free_qty}
                            </span>
                          </Col>
                        </Row>
                        <Row className="tMS">
                          <Col lg={1} className="pe-0">
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className="pl-0 mt-1"
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) this.focusNextElement(e);
                              }}
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
                          <Col lg={11} className="">
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):
                            </span>
                            <span className="errormsg">
                              {/* {Math.abs(parseFloat(values.roundoff).toFixed(2))} */}
                              {INRformat.format(values.roundoff)}
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
                      className="btm-tbl-padding"
                    >
                      {/* {Json.stringify(showLedgerDiv)} */}
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
                                      /*   console.log(
                                        "v ",
                                        v,
                                        addchgElement1,
                                        addchgElement2,
                                        this.myRef.current
                                      ); */
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
                            <td className="py-0" style={{ cursor: "pointer" }}>
                              <div className="d-flex">
                                {/* <InputGroup className="  mdl-text d-flex">
                                  <Form.Control
                                    placeholder="Add.Charges"
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
                                    onFocus={(e) => {
                                      e.preventDefault();
                                      if (
                                        values.additionalChgLedgerName1 == ""
                                      ) {
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
                                      this.setState({
                                        ledgerModalIndExp1: true,
                                      });

                                      if (
                                        values.additionalChgLedgerName1 != ""
                                      ) {
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
                                  {values.additionalChgLedgerName1 != "" &&
                                    (parseInt(values.additionalChgLedgerAmt1) ===
                                      0 ||
                                      values.additionalChgLedgerAmt1 === "") ? (
                                    <InputGroup.Text
                                      style={{
                                        position: "absolute",
                                        margin: "12px 105px",
                                        padding: "4px",
                                        background: "aliceblue",
                                        color: "red",
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
                                          setFieldValue(
                                            "additionalChgLedgerAmt1",
                                            ""
                                          );

                                          setTimeout(() => {
                                            document
                                              .getElementById(
                                                "additionalChgLedgerName1"
                                              )
                                              .focus();
                                          }, 200);
                                        }
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                    </InputGroup.Text>
                                  ) : (
                                    ""
                                  )}
                                </InputGroup> */}
                                <Form.Label className="my-auto lebleclass">
                                  Add Charges{" "}
                                </Form.Label>
                                <div
                                  className="btn_img_style mt-2"
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
                                >
                                  <Button
                                    id="TSCE_addCharges_btn"
                                    className="btn_img_style"
                                    onKeyDown={(e) => {
                                      // e.preventDefault();
                                      if (e.keyCode === 32) {
                                        this.setState({
                                          ledgerModalIndExp1: true,
                                        });

                                        if (
                                          values.additionalChgLedgerName1 != ""
                                        ) {
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
                                      } else if (e.keyCode == 13) {
                                        this.focusNextElement(e);
                                      }
                                    }}
                                  >
                                    <img
                                      src={add_icon}
                                      alt=""
                                      className="btnimg"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          ledgerModalIndExp1: true,
                                        });

                                        if (
                                          values.additionalChgLedgerName1 != ""
                                        ) {
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
                                    />
                                  </Button>
                                </div>
                              </div>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Total Additional"
                                className="tnx-pur-inv-text-box mt-2 text-end"
                                id="additionalChargesTotal"
                                name="additionalChargesTotal"
                                onChange={(e) => {
                                  setFieldValue(
                                    "additionalChargesTotal",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={additionalChargesTotal.toFixed(2)}
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                readOnly={
                                  parseInt(additionalChargesTotal) > 0
                                    ? false
                                    : true
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            {/* <td className="py-0"> */}
                            {/* <InputGroup className="  mdl-text d-flex">
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
                                {values.additionalChgLedgerName2 != "" &&
                                (parseInt(values.additionalChgLedgerAmt2) ===
                                  0 ||
                                  values.additionalChgLedgerAmt2 === "") ? (
                                  <InputGroup.Text
                                    style={{
                                      position: "absolute",
                                      margin: "8px 105px",
                                      padding: "4px",
                                      background: "aliceblue",
                                      color: "red",
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
                                        setFieldValue(
                                          "additionalChgLedgerAmt2",
                                          ""
                                        );

                                        setTimeout(() => {
                                          document
                                            .getElementById(
                                              "additionalChgLedgerName2"
                                            )
                                            .focus();
                                        }, 200);
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </InputGroup.Text>
                                ) : (
                                  ""
                                )}
                              </InputGroup> */}
                            {/* <Row>
                                <Col lg="6">
                                  <Form.Group style={{ width: "fit-content" }}>
                                    <Form.Check
                                      type="radio"
                                      id="mode1"
                                      name="mode"
                                      label="TDS"
                                      value="tds"
                                      autoComplete="off"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col lg="6">
                                  <Form.Group style={{ width: "fit-content" }}>
                                    <Form.Check
                                      type="radio"
                                      name="mode"
                                      id="mode2"
                                      label="TCS"
                                      value="tcs"
                                      autoComplete="off"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row> */}
                            {/* @neha @Tcs Tds Radio button true false  */}
                            {/* <Row>
                                <Col lg="12">
                                  <Form.Group style={{ width: "fit-content" }}>
                                    <Row>
                                      <Col lg="6">
                                        <Form.Check
                                          type="radio"
                                          id="mode1"
                                          name="mode"
                                          label="TDS"
                                          value="tds"
                                          autoComplete="off"
                                        />
                                      </Col>
                                      <Col lg="6">
                                        <Form.Check
                                          type="radio"
                                          name="mode"
                                          id="mode2"
                                          label="TCS"
                                          value="tcs"
                                          autoComplete="off"
                                        />
                                      </Col>
                                    </Row>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Total TDS/TCS"
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
                                readOnly={
                                  parseInt(values.additionalChgLedger2) > 0
                                    ? false
                                    : true
                                }
                              />
                            </td> */}
                          </tr>
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
                            <td className="py-0">Tax</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_tax_amt).toFixed(2)} */}
                              {INRformat.format(values.total_tax_amt)}
                              {/* 9999.99 */}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Cess</td>
                            <td className="p-0 text-end">
                              {/* {parseFloat(values.total_tax_amt).toFixed(2)} */}
                              {/* 9999.99 */}
                              {INRformat.format(values.total_tax_amt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <InputGroup className="  mdl-text d-flex">
                                <Form.Control
                                  placeholder="Ledger 1"
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
                                    if (e.keyCode == 32) {
                                      this.ledgerIndExpModalStateChange(
                                        "ledgerModalIndExp",
                                        true
                                      );
                                    } else if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                  value={values.additionalChgLedgerName3}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   setTimeout(() => {
                                  //     this.addLedgerModalFun();
                                  //   }, 100);
                                  // }}
                                />
                                {values.additionalChgLedgerName3 != "" &&
                                (parseInt(values.additionalChgLedgerAmt3) ===
                                  0 ||
                                  values.additionalChgLedgerAmt3 === "") ? (
                                  <InputGroup.Text
                                    style={{
                                      position: "absolute",
                                      margin: "8px 105px",
                                      padding: "4px",
                                      background: "aliceblue",
                                      color: "red",
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
                                        setFieldValue(
                                          "additionalChgLedgerAmt3",
                                          ""
                                        );

                                        setTimeout(() => {
                                          document
                                            .getElementById(
                                              "additionalChgLedgerName3"
                                            )
                                            .focus();
                                        }, 200);
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </InputGroup.Text>
                                ) : (
                                  ""
                                )}
                              </InputGroup>
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Dis."
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
                              {/* {parseFloat(values.bill_amount).toFixed(2)} */}
                              {INRformat.format(values.bill_amount)}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="btm-row-size">
                        <Button
                          id="TSCE_submit_btn"
                          className="successbtn-style"
                          type="submit"
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              this.myRef.current.handleSubmit();
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
                                msg: "Do you want to Cancel",
                                is_button_show: false,
                                is_timeout: false,
                                delay: 0,
                                handleSuccessFn: () => {
                                  // eventBus.dispatch(
                                  //   "page_change",
                                  //   "tranx_sales_challan_list"
                                  // );
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_sales_challan_edit",
                                    to: "tranx_sales_challan_list",
                                    prop_data: {
                                      editId: this.state.salesEditData.id,
                                      rowId: this.props.block.prop_data.rowId,
                                    },
                                    isNewTab: false,
                                    isCancel: true,
                                  });
                                },
                                handleFailFn: () => {
                                  eventBus.dispatch(
                                    "page_change",
                                    "tranx_sales_challan_create"
                                  );
                                },
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
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "tranx_sales_challan_list"
                                    // );
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_challan_edit",
                                      to: "tranx_sales_challan_list",
                                      prop_data: {
                                        editId: this.state.salesEditData.id,
                                        rowId: this.props.block.prop_data.rowId,
                                      },
                                      isCancel: true,
                                      isNewTab: false,
                                    });
                                  },
                                  handleFailFn: () => {
                                    eventBus.dispatch(
                                      "page_change",
                                      "tranx_sales_challan_create"
                                    );
                                  },
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
                    {/* <Col md="2" className="px-0">
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
                  
                    <Col md="2" className="text-end">
                      <img src={question} className="svg-style ms-1"></img>
                    </Col> */}
                    <Col md="12" className="my-auto">
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
                </>
              </Form>
            )}
          </Formik>
        </div>
        {/* Ledger Modal Starts */}
        <MdlLedger
          ref={this.customModalRef} //@neha @on click outside modal will close
          ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
          ledgerModal={ledgerModal}
          ledgerData={ledgerData}
          tranxRef={this.myRef}
          selectedLedger={selectedLedger}
          invoice_data={invoice_data}
          isLedgerSelectSet={isLedgerSelectSet}
          from_source={from_source}
          ledgerId={ledgerId}
          currentLedgerData={currentLedgerData}
          setLedgerId={setLedgerId}
          rows={rows}
          ledgerInputData={ledgerInputData}
          isTextBox={isTextBox}
          searchInputId="supplierNameId"
          setledgerInputDataFun={this.setledgerInputData.bind(this)}
          transactionTableStyle={transactionTableStyle}
          ledgerType={ledgerType} // @prathmesh @ledger filter added
          updatedLedgerType={updatedLedgerType} // @prathmesh @ledger filter added
          transaction_ledger_detailsFun={this.transaction_ledger_detailsFun.bind(
            this
          )}
          sourceUnder={sourceUnder}
          opType={opType} // @vinit@Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
        />
        {/* Ledger Modal Ends */}

        {/* IndirectExp Ledger Modal Starts */}
        <MdlLedgerIndirectExp
          ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
          ledgerIndExpModalStateChange={this.ledgerIndExpModalStateChange.bind(
            this
          )}
          handleRemoveAddtionalChargesRow={this.handleRemoveAddtionalChargesRow.bind(
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
          additionalCharges={additionalCharges}
          setAdditionalCharges={this.setAdditionalCharges.bind(this)}
          handleAdditionalCharges={this.handleAdditionalCharges.bind(this)}
          handleAdditionalChargesHide={this.handleAdditionalChargesHide.bind(
            this
          )}
          handleAddAdditionalCharges={this.handleAddAdditionalCharges.bind(
            this
          )}
          // handleRemoveAddtionalChargesRow={this.handleRemoveAddtionalChargesRow.bind(
          //   this
          // )}
          opType={opType} // @vinit @used for previous tab focus
          additionalChargesId={additionalChargesId}
          setAdditionalChargesId={setAdditionalChargesId}
        />
        {/* IndirectExp Ledger Modal Ends */}

        {/* Product Modal Starts */}
        {/* <MdlProduct
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
          isRowProductSet={isRowProductSet}
          transactionType={transactionType}
          productId={productId}
          setProductId={setProductId}
          setProductRowIndex={setProductRowIndex}
          from_source={from_source}
          invoice_data={this.myRef.current ? this.myRef.current.values : ""}
          saleRateType={saleRateType}
        /> */}
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
        {/* <MdlBatchNo
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
          transactionType={transactionType}
        /> */}
        {/* Batch No Modal Ends */}

        {/* Costing  Modal Starts */}

        {/* <MdlCosting
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
        /> */}
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
)(TranxSalesChallanEdit);
