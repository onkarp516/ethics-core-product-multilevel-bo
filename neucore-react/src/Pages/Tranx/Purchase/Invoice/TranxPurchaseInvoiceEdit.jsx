import React, { Component } from "react";
import ReactDOM from "react-dom"; //@neha On Escape key press and On outside Modal click Modal will Close

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
  CloseButton,
  InputGroup,
  Alert,
  Tab,
  Nav,
} from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import add_icon from "@/assets/images/add_icon.svg";

import {
  MyTextDatePicker,
  getSelectValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  TRAN_NO,
  purchaseSelect,
  isActionExist,
  fnTranxCalculationRoundDecimalPlaces,
  fnTranxCalculationTaxRoundOff,
  getValue,
  isUserControl,
  calculatePercentage,
  isFreeQtyExist,
  isMultiDiscountExist,
  getUserControlLevel,
  getUserControlData,
  isUserControlExist,
  unitDD,
  flavourDD,
  OnlyEnterNumbers,
  allEqual,
  OnlyEnterAmount,
  INRformat,
  addDataLock,
  removeDataLock,
  checkDataLockExist,
  ShowNotification,
  roundDigit,
  configDecimalPlaces,
} from "@/helpers";

import {
  getPurchaseAccounts,
  getLastPurchaseInvoiceNo,
  getAdditionalLedgers,
  authenticationService,
  getProductFlavourList,
  get_Product_batch,
  listTranxDebitesNotes,
  getValidatePurchaseInvoice,
  ValidatePurchaseInvoiceUpdate,
  checkInvoiceDateIsBetweenFY,
  get_supplierlist_by_productid,
  updateProductStock,
  getProductFlavorpackageUnitbyid,
  getPurchaseInvoiceById,
  editPurchaseInvoice,
  getPurchaseInvoiceBill,
  transaction_ledger_list,
  removeInstance,
  transaction_batch_details,
  transaction_product_details,
  transaction_ledger_details,
} from "@/services/api_functions";
import MdlLedger from "@/Pages/Tranx/CMP/MdlLedger";
import MdlLedgerIndirectExp from "@/Pages/Tranx/CMP/MdlLedgerIndirectExp";
import CmpTRow from "@/Pages/Tranx/CMP/CmpTRow";
import MdlProduct from "@/Pages/Tranx/CMP/MdlProduct";
import MdlSerialNo from "@/Pages/Tranx/CMP/MdlSerialNo";
import MdlBatchNo from "@/Pages/Tranx/CMP/MdlBatchNo";
import MdlCosting from "@/Pages/Tranx/CMP/MdlCosting";
import CmpTGSTFooter from "@/Pages/Tranx/CMP/CmpTGSTFooter";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
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

class TranxPurchaseInvoiceEdit extends Component {
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
    this.customModalRef = React.createRef(); //neha @Ref is created & used at MDLLedger Component Below
    this.SelecteRefGSTIN = React.createRef();

    this.inputLedgerNameRef = React.createRef();

    this.state = {
      isEdit: false,
      currentTab: "second", //@prathmesh @batch info & product info tab active
      isTextBox: false,
      opType: "edit", // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab

      ledgerType: "SC",
      updatedLedgerType: "SC",
      invoice_data: {
        filterListSales: "SC",
        filterListCreate: "SC",
        selectedSupplier: "",
        pi_sr_no: "",
        pi_no: "",
        pi_transaction_dt: moment(new Date()).format("DD/MM/YYYY"),
        pi_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        tcs: 0,
        debitnoteNo: "",
        newReference: "true",
        purchase_discount: "",
        purchase_discount_amt: "",
        total_purchase_discount_amt: 0,
        total_base_amt: 0,
        total_b_amt: 0,
        total_tax_amt: 0,
        total_taxable_amt: 0,
        total_dis_amt: "",
        total_dis_per: "",
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
        tcs_amt: "",
        tcs_per: "",
        tcs_mode: "",
      },
      isBranch: false,
      isAdditionalCharges: false,
      transactionType: "purchase_edit",
      batchHideShow: true,
      productId: "",
      setProductId: false,
      setProductRowIndex: -1,
      ledgerId: "",
      setLedgerId: false,
      purchaseAccLst: [],
      supplierCodeLst: [],
      lstGst: [],
      ledgerInputData: "",
      ledgerModal: false,
      ledgerModalIndExp: false,
      ledgerModalIndExp1: false,
      ledgerModalIndExp2: false,
      ledgerModalIndExp3: false,
      ledgerData: "",
      ledgerDataIndExp: "",
      selectedLedger: "",
      currentLedgerData: "",
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
      showLedgerDiv: false,
      addchgElement1: "",
      addchgElement2: "",
      gstId: "",
      selectedPendingOrder: [],
      selectedPendingChallan: [],
      additionalChargesTotal: 0,
      costingMdl: false,
      costingInitVal: "",
      isEditDataSet: false,
      isLedgerSelectSet: false,
      delAdditionalCahrgesLst: [],
      isRowProductSet: false,
      editBillList: [],
      productNameData: "",
      unitIdData: "",
      batchNoData: "",
      qtyData: "",
      rateData: "",
      additionalCharges: "",
      sourceUnder: "purchase",
      from_source: "tranx_purchase_invoice_edit",
      errorArrayBorder: "",
      invoice_id: "",
      ledgerList: [],
      orgLedgerList: [],
      isAllCheckeddebit: false,
      billLst: [],
      selectedBillsdebit: [],
      billAmount: "",
      // datalockSlug: "",
      // source: "",
      // ledgerType: "",
      batchDetails: "",
      isIndirectLedgerSelectSet: false,
      key_set: "",
      productDetailsId: "",
      batchDetailsId: "",
      ledgerDetailsId: "",
      additionalDelDetailsIds: [],
      selectedOptions: [], // Store selected options in an array
      tcs_mode: "",

      ledgerNameFlag: false, // ! for focus
    };
  }
  // @prathmesh @batch info & product info tab active start
  isInputFocused = () => {
    return this.inputLedgerNameRef.current === document.activeElement;
  };
  // @prathmesh @batch info & product info tab active end

  initAdditionalCharges = () => {
    // additionalCharges
    let lst = [];
    for (let index = 0; index < 1; index++) {
      let data = {
        additional_charges_details_id: 0,
        ledgerId: "",
        amt: "",
      };
      lst.push(data);
    }
    this.setState({ additionalCharges: lst });
  };

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("res---->", res.list);
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

              current_balance: v.current_balance,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
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

              current_balance: v.current_balance,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
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
            // console.log("prop_data", prop_data);

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
              // console.log("invoice_data", init_d);
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  /**** Check Invoice date between Fiscal year *****/
  // checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
  //   let requestData = new FormData();
  //   requestData.append(
  //     "invoiceDate",
  //     moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
  //   );
  //   checkInvoiceDateIsBetweenFY(requestData)
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus != 200) {
  //         MyNotifications.fire({
  //           show: true,
  //           icon: "error",
  //           title: "Error",
  //           msg: "Invoice date not valid as per FY",
  //           is_button_show: true,
  //         });
  //         setFieldValue("pi_invoice_dt", "");
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
        // console.log("res", response);
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
              delay: 1500,
              // handleSuccessFn: () => {},
              // handleFailFn: () => {
              //   setFieldValue("pi_invoice_dt", "");
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
            // document.getElementById("pi_invoice_dt").focus();
            this.invoiceDateRef.current.focus();
          }, 2000);
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
        //         // setFieldValue("pi_invoice_dt", "");
        //         // eventBus.dispatch(
        //         //   "page_change",
        //         //   "tranx_purchase_invoice_create"
        //         // );

        //         setTimeout(() => {
        //           document.getElementById("pi_invoice_dt").focus();
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
        //         // setFieldValue("pi_invoice_dt", "");
        //         // eventBus.dispatch("page_change", {
        //         //   from: "tranx_purchase_invoice_create",
        //         //   to: "tranx_purchase_invoice_list",
        //         //   isNewTab: false,
        //         // });

        //         setTimeout(() => {
        //           document.getElementById("pi_invoice_dt").focus();
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
  setLastPurchaseSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { invoice_data } = this.state;
          invoice_data["pi_sr_no"] = res.count;

          this.setState({ invoice_data: invoice_data });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  /***** Validations of Purchase Invoice for Duplicate Invoice Numbers */
  validatePurchaseInvoice = (invoice_no, supplier_id, purchaseEditData) => {
    // console.log("Id--> ", purchaseEditData);
    let reqData = new FormData();
    reqData.append("supplier_id", supplier_id);
    reqData.append("bill_no", invoice_no);
    reqData.append("invoice_id", purchaseEditData);
    ValidatePurchaseInvoiceUpdate(reqData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,

            // is_timeout: true,
            // delay: 1000,
          });
          //this.reloadPage();
          if (this.myRef.current) {
            this.myRef.current.setFieldValue("pi_no", "");
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  /**** Validation of FSSAI and DRUG Expriry of suppliers *****/

  getProductFlavorpackageUnitbyids = (invoice_id) => {
    console.log("invoice_id", invoice_id);
    let reqData = new FormData();
    reqData.append("id", invoice_id);
    getProductFlavorpackageUnitbyid(reqData)
      .then((response) => {
        // console.log("response", response);
        if (response.data.responseStatus == 200) {
          let Opt = response.data.productIds.map((v) => {
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

          this.setState({ lstBrand: Opt }, () => {});
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstBrand: [] }, () => {});
      });
  };

  handlePropsData = (prop_data) => {
    this.setState({
      ledgerModalIndExp: prop_data.ledgerModalIndExp,
      ledgerModalIndExp1: true,
      ledgerModalIndExp2: true,
      ledgerModalIndExp3: true,
    });
    if (prop_data.invoice_data) {
      this.setState(
        {
          invoice_data: prop_data.invoice_data,
          rows: prop_data.rows,
          productId: prop_data.productId,
          ledgerId: prop_data.ledgerId,
          additionalChargesId: prop_data.additionalChargesId,
          setProductRowIndex: prop_data.rowIndex,
        },
        () => {
          this.setState(
            {
              productId: prop_data.productId,
              ledgerId: prop_data.ledgerId,
              additionalChargesId: prop_data.additionalChargesId,
              setAdditionalChargesId: true,
              setAdditionalChargesIndex: prop_data.setAdditionalChargesIndex,
              setLedgerId: true,
              setProductId: true,
              setProductRowIndex: prop_data.rowIndex,
            },
            () => {
              setTimeout(() => {
                //@Vinit @Focusing the previous tab were we left
                if (prop_data.isProduct == "productMdl") {
                  document
                    .getElementById(
                      "TPIEProductId-particularsname-" + prop_data.rowIndex
                    )
                    ?.focus();
                } else if (this.inputLedgerNameRef.current) {
                  this.inputLedgerNameRef.current.focus();
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

  getInvoiceBillsLstPrint = (id) => {
    // console.log("id Invoice----", id);
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "create");
    reqData.append("source", "purchase_invoice");
    getPurchaseInvoiceBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        // console.log("responseData ---->>>", responseData);
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
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@neha @On outside click modal will close

      this.lstPurchaseAccounts();
      this.initRow();
      this.lstAdditionalLedgers();
      this.initAdditionalCharges();
      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
      this.transaction_ledger_listFun();
      const { prop_data } = this.props.block;
      this.setState({ ldview: prop_data.ldview });
      this.setState(
        {
          source: prop_data,
          purchaseEditData: prop_data.prop_data,
          isEdit: prop_data.edit,
        },
        () => {
          if (this.state.purchaseEditData.id && prop_data.edit == true) {
            this.getProductFlavorpackageUnitbyids(
              this.state.purchaseEditData.id
            );
          } else {
            this.handlePropsData(prop_data.prop_data);
          }
        }
      );
    }
  }
  //@neha @On outside Modal click Modal will Close
  handleClickOutside = (event) => {
    const modalNode = ReactDOM.findDOMNode(this.customModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ ledgerModal: false });
    }
  };
  // alt key button disabled start
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @neha On outside Modal click Modal will Close

    window.removeEventListener("keydown", this.handleAltKeyDisable);
  }
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ ledgerModal: false });
    }
  };
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
    let {
      purchaseAccLst,
      lstAdditionalLedger,
      isEditDataSet,
      purchaseEditData,
      lstBrand,
      isEdit,
    } = this.state;

    if (
      purchaseAccLst.length > 0 &&
      lstBrand.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      isEditDataSet == false &&
      purchaseEditData != "" &&
      isEdit == true
    ) {
      this.setPurchaseInvoiceEditData();
    }
  }

  setPurchaseInvoiceEditData = () => {
    let { id } = this.state.purchaseEditData;
    let formData = new FormData();
    formData.append("id", id);

    getPurchaseInvoiceById(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let {
            invoice_data,
            row,
            additional_charges,
            narration,
            bills,
            additionalCharges,
          } = res;

          let { purchaseAccLst, lstAdditionalLedger, lstBrand, editBillList } =
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
          // console.log("res.debitNoteReference", res.debitNoteReference);
          let d = moment(invoice_data.transaction_dt, "YYYY-MM-DD").toDate();
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
            pi_sr_no: invoice_data.purchase_sr_no,

            pi_transaction_dt:
              invoice_data.transaction_dt != ""
                ? moment(new Date(d)).format("DD/MM/YYYY")
                : "",
            gstNo: invoice_data.gstNo,
            newReference: res.debitNoteReference == true ? "true" : "false",

            purchaseId: getSelectValue(
              purchaseAccLst,
              invoice_data.purchase_account_ledger_id
            ),
            pi_no: invoice_data.invoice_no,
            pi_invoice_dt:
              invoice_data.invoice_dt != ""
                ? moment(
                    new Date(
                      moment(invoice_data.invoice_dt, "YYYY-MM-DD").toDate()
                    )
                  ).format("DD/MM/YYYY")
                : "",
            // supplierCodeId: invoice_data.supplierId,
            // supplierNameId: invoice_data.supplierId,
            EditsupplierId: invoice_data.supplierId,
            supplierCodeId: "",
            supplierNameId: "",
            roundoff: invoice_data.roundoff != "" ? invoice_data.roundoff : 0,
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
            // filterListSales:
            //   "SC" !=
            //   this.state.ledgerList.filter(
            //     (v) => v.id === res.invoice_data.supplierId
            //   )[0].type
            //     ? "SC"
            //     : "SD",
            // filterListCreate: "SC",
            // filterListSales: this.state.ledgerList.filter(
            //   (v) => v.id === res.invoice_data.supplierId
            // )[0].type,
            // filterListSales: "SC" != "SC" ? "SC" : "SD",
            tcs_mode: res.tcs_mode ? res.tcs_mode : "",
            tcs_per: res.tcs_per,
            tcs_amt: res.tcs_amt,
          };

          let initRowData = [];
          if (row.length > 0) {
            initRowData = row.map((v, i) => {
              // debugger;
              let productOpt = getSelectValue(lstBrand, parseInt(v.product_id));
              // console.log("productOpt",productOpt);
              let unit_id = {
                gst: v.gst != "" ? v.gst : 0,
                igst: v.igst != "" ? v.igst : 0,
                cgst: v.cgst != "" ? v.cgst : 0,
                sgst: v.sgst != "" ? v.sgst : 0,
              };
              //               let selectedProduct = {
              //                 barcode: null,
              // brand: v.brand,
              // cgst: v.cgst,
              // code:""
              // current_stock: 0,
              // hsn: ""
              // id: v.
              // igst: 18
              // is_batch: true
              // is_inventory: true
              // is_negative: false
              // is_serial: false
              // packing: ""
              // product_name: "20GM PLASTIC BOTTLES"
              // sgst: 9
              // tax_per: 18
              // tax_type: "Taxable"
              // unit: "PCS"
              //               }
              v["selectedProduct"] = v.selectedProduct;
              // v["productName"] = selectedProduct.product_name;
              // if (
              //   transactionType == "sales_edit" ||
              //   transactionType == "purchase_edit" ||
              //   transactionType == "debit_note" ||
              //   transactionType == "credit_note"
              // ) {
              //   v["rate"] = v["rate"];
              // } else if (transactionType == "sales_invoice") {
              //   v["rate"] = selectedProduct.sales_rate;
              // } else {
              //   if (selectedProduct.is_batch == false) {
              //     v["rate"] = selectedProduct.purchaserate;
              //   }
              // }

              // v["productId"] = selectedProduct.id;
              v["is_level_a"] = getUserControlData(
                "is_level_a",
                this.props.userControl
              )
                ? true
                : false;
              v["is_level_b"] = getUserControlData(
                "is_level_b",
                this.props.userControl
              )
                ? true
                : false;
              v["is_level_c"] = getUserControlData(
                "is_level_c",
                this.props.userControl
              )
                ? true
                : false;
              v["is_batch"] = v.is_batch;
              v["is_serial"] = v.is_serial;
              v["packing"] = v.packing;

              v["unit_id"] = unit_id;

              v["prod_id"] = productOpt ? productOpt : "";
              v["productName"] = v.product_name ? v.product_name : "";
              v["productId"] = v.product_id ? v.product_id : "";
              v["details_id"] =
                v.details_id && v.details_id != "" ? v.details_id : 0;
              v["inventoryId"] = v.inventoryId != "" ? v.inventoryId : 0;

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
              v["unitId"] = v.unitId
                ? getSelectValue(v.levelcId.unitOpt, parseInt(v.unitId))
                : "";
              // console.log("v unitId => i",unitId,i);
              // v["unit_id"] = "";
              v["qty"] = v.qty != "" ? v.qty : "";
              v["rate"] = v.rate != "" ? v.rate : 0;
              v["base_amt"] = v.base_amt && v.base_amt != "" ? v.base_amt : 0;
              v["unit_conv"] = v.unit_conv != "" ? v.unit_conv : 0;
              v["packing"] = v.packing != "" ? v.packing : "";
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
              v["final_amt"] =
                v.final_amt && v.final_amt != "" ? v.final_amt : 0;
              v["free_qty"] =
                v.free_qty != "" && v.free_qty != null ? v.free_qty : 0;
              v["dis_per2"] = v.dis_per2 != "" ? v.dis_per2 : 0;
              v["row_dis_amt"] = v.row_dis_amt != "" ? v.row_dis_amt : 0;
              v["gross_amt"] = v.gross_amt != "" ? v.gross_amt : 0;
              v["add_chg_amt"] = v.add_chg_amt != "" ? v.add_chg_amt : 0;
              v["gross_amt1"] = v.gross_amt1 != "" ? v.gross_amt1 : 0;
              v["invoice_dis_amt"] =
                v.invoice_dis_amt != "" ? v.invoice_dis_amt : 0;
              v["net_amt"] = v.final_amt && v.final_amt != "" ? v.final_amt : 0;
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
              v["b_detailsId"] = v.b_detailsId != "" ? v.b_detailsId : "";
              v["org_b_details_id"] = v.b_detailsId != "" ? v.b_detailsId : "";
              v["is_batch"] = v.is_batch != "" ? v.is_batch : "";

              return v;
            });
          }

          let additionalChargesData = [];

          // console.log("additionalCharges", res.additionalCharges);
          if (additionalCharges.length > 0) {
            additionalChargesData = additionalCharges.map((vi, ii) => {
              vi["additional_charges_details_id"] =
                vi.additional_charges_details_id;
              vi["orgLedgerId"] = vi.ledgerId;
              //vi["ledgerId"] = "";
              vi["amt"] = vi.amt;

              return vi;
            });
          }
          if (initInvoiceData.gstNo != "")
            initInvoiceData["gstId"] = getValue(opt, initInvoiceData.gstNo);
          else initInvoiceData["gstId"] = opt[0];

          initInvoiceData["tcs"] = res.tcs;
          initInvoiceData["narration"] = res.narration;
          initInvoiceData["roundoff"] = res.invoice_data.roundoff;

          if (additionalChargesData.length == 0) {
            this.initAdditionalCharges();
          }
          this.setState(
            {
              tcs_mode: initInvoiceData.tcs_mode,
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              additionalChargesTotal: totalAdditionalCharges,
              lstGst: opt,
              isLedgerSelectSet: true,
              isRoundOffCheck: res.invoice_data.isRoundOffCheck,
              editBillList: bills,
              add_button_flag: true,
              // isRowProductSet: true,
              additionalCharges: additionalChargesData,
              isAdditionalCharges:
                additionalChargesData.length > 0 ? true : false,
              productDetailsId: initRowData[0]["productId"],
              batchDetailsId: initRowData[0]["b_details_id"],
              ledgerDetailsId: invoice_data.id,
              isRoundOffCheck: res.invoice_data.roundoff == 0 ? true : true,
            },
            () => {
              // console.log("After set rows =-> ", this.state.rows);
              //TODO: Add slug to datalock
              // if (this.state.datalockSlug != "") {
              //   if (!checkDataLockExist(this.state.datalockSlug)) {
              //     addDataLock(this.state.datalockSlug)
              //   }
              // }

              // setTimeout(() => {

              // }, 2500);

              setTimeout(() => {
                if (res.invoice_data.roundoff == 0) {
                  this.handleTranxCalculation("roundoff", !false);
                } else {
                  this.handleTranxCalculation("roundoff", !true);
                }
              }, 2500);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error _______________________ ", error);
      });
  };

  ledgerModalStateChange = (ele, val) => {
    if (ele == "ledgerModal" && val == true) {
      this.setState({ ledgerData: "", [ele]: val });
    } else if (ele == "ledgerModal" && val == false) {
      this.setState({ [ele]: val }, () => {
        if (this.state.ledgerNameFlag)
          if (this.state.lstGst.length > 1) {
            this.SelecteRefGSTIN.current.focus();
          } else {
            document.getElementById("pi_no").focus();
          }
        else document.getElementById("pi_transaction_dt").focus();
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
    if (currentLedgerData != "") {
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
          // console.warn("selectedLEdger index " + index);
          document.getElementById("LedgerMdlTr_" + index)?.focus();
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

  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
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
        free_qty: 0,
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
      if (callTrxCal === true) {
        this.handleTranxCalculation();
      }
    });
    if (obj.costingMdl && obj.costingMdl == false) {
      let id = parseInt(this.state.rows.length) - 1;
      if (document.getElementById("TPIEAddBtn-" + id) != null) {
        setTimeout(() => {
          document.getElementById("TPIEAddBtn-" + id)?.focus();
        }, 250);
      }
    }
    if (obj.isProduct && obj.isProduct == "productMdl") {
      setTimeout(() => {
        document
          .getElementById("TPIEProductId-particularsname-" + obj.rowIndex)
          ?.focus();
      }, 250);
      this.setState({ currentTab: "second" }); //@prathmesh @batch info & product info tab active
    }

    // if (obj.isBatchMdl == "batchMdl") {
    // setTimeout(() => {
    //   document
    //     .getElementById("TPIEProductId-batchNo-" + obj.rowIndex)
    //     .focus();
    // }, 250);
    // }
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
    //console.log("ele->", ele, parseFloat(value));

    if (ele == "dis_per" && parseFloat(value) > parseFloat(100)) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Discount is exceeding 100%",
        //  is_timeout: true,
        //  delay: 1000,
        is_button_show: true,
      });
      //console.log("discount is greater than 99");
      // this.myRef.current.setFieldValue("dis_per", 0);
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
          msg: "Rate less than MRP",
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
      this.handleRowStateChange(rows, false, rowIndex);
    }
  };

  updateProductStockFun = (rowIndex = -1, rows) => {
    const { invoice_data } = this.state;
    // console.log("rows >>>>>>>>>> ", rowIndex, rows[rowIndex]);
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
    // console.log("rows--", rows[rowIndex]["productId"]);
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
              console.log("batchData=-=-=-=-", res);
              return v;
            });

            this.setState(
              {
                invoice_data: invoice_data,
                batchData: res,
              },
              () => {
                this.getInitBatchValue(rowIndex, source);
              }
            );
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      if (batchOpt.length > 0) {
        batchOpt = batchOpt.map((v) => {
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
      }

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
    let totalqty =
      (isNaN(parseInt(rows[rowIndex]["qty"]))
        ? 0
        : parseInt(rows[rowIndex]["qty"])) +
      (isNaN(parseInt(rows[rowIndex]["free_qty"]))
        ? 0
        : parseInt(rows[rowIndex]["free_qty"]));

    let costingcal = roundDigit(
      parseFloat(rows[rowIndex]["total_amt"]) / totalqty,
      configDecimalPlaces
    );

    let costingwithtaxcal = roundDigit(
      parseFloat(costingcal) +
        parseFloat(rows[rowIndex]["total_igst"]) / totalqty,
      configDecimalPlaces,
      configDecimalPlaces
    );
    let initVal = "";
    if (rowIndex != -1) {
      initVal = {
        productName: rows[rowIndex]["productName"]
          ? rows[rowIndex]["productName"]
          : "",
        b_no: rows[rowIndex]["b_no"],
        b_rate: rows[rowIndex]["b_rate"],
        sales_rate: rows[rowIndex]["sales_rate"],
        rate_a: rows[rowIndex]["rate_a"] > 0 ? rows[rowIndex]["rate_a"] : "",
        rate_b: rows[rowIndex]["rate_b"] > 0 ? rows[rowIndex]["rate_b"] : "",
        costing: costingcal,
        costingWithTax: costingwithtaxcal,
        rate_c: rows[rowIndex]["rate_c"] > 0 ? rows[rowIndex]["rate_c"] : "",
        min_margin: rows[rowIndex]["min_margin"],
        margin_per:
          rows[rowIndex]["margin_per"] > 0 ? rows[rowIndex]["margin_per"] : "",
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
        rate_a: "",
        sales_rate: "",
        costing: costingcal,
        cost_with_tax: 0,
        margin_per: "",
        min_margin: "",
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

  handleRowStateChange = (rowValue, showBatch = false, rowIndex = -1) => {
    this.setState({ rows: rowValue }, () => {
      this.setState({ rowIndex: rowIndex }, () => {
        this.getProductBatchList(rowIndex);
      });

      this.handleTranxCalculation();
    });
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
    // console.log("roffamt", roffamt);
    if (this.myRef.current) {
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
    }

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };

    this.setState({
      rows: gst_row,
      taxcal: taxState,
    });
  };

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      details_id: 0,
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
    rows = [...rows, new_row];
    this.setState({ rows: rows }, () => {
      let id = parseInt(rows.length) - 1;
      setTimeout(() => {
        document.getElementById("TPIEProductId-particularsname-" + id).focus();
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
    // debugger

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
    //     parseFloat(roundoffamt).toFixed(2)
    //   );
    //   this.myRef.current.setFieldValue("bill_amount", billAmt);
    // }
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
          // console.log("data--", data);
          let bills = [];
          let databills = [];
          let { editBillList } = this.state;
          let f_selectedBills = [];
          let selectedBillsObj = [];
          editBillList.map((v, i) => {
            bills.push(v.id);
          });
          data.map((v, i) => {
            databills.push(v.id);
          });

          data.map((v, i) => {
            if (!bills.includes(v.id)) {
              // f_selectedBills = v.debitNoteId;
              // f_selectedBills.push(v.debit_note_no);
              editBillList.push(v);
            }
          });

          editBillList.map((v, i) => {
            if (bills.includes(v.id)) {
              // f_selectedBills = v.debitNoteId;
              f_selectedBills.push(v.debit_note_no);
            }
          });

          this.setState(
            {
              billLst: editBillList,
              isAllCheckeddebit:
                data.length == f_selectedBills.length ? true : false,
              selectedBillsdebit: f_selectedBills,
            },
            () => {
              if (data.length > 0) {
                this.setState({ adjustbillshow: true });
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  callCreateInvoice = () => {
    const {
      invoice_data,
      additionalChargesTotal,
      rows,
      rowDelDetailsIds,
      delAdditionalCahrgesLst,
      isRoundOffCheck,
      additionalCharges,
    } = this.state;

    let invoiceValues = this.myRef.current.values;
    invoiceValues.tcs_mode = this.state.tcs_mode;

    let requestData = new FormData();
    // !Invoice Data
    requestData.append("id", invoice_data.id);
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
    // !Invoice Data
    requestData.append("isRoundOffCheck", isRoundOffCheck);

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

    // requestData.append(
    //   "tcs",
    //   invoiceValues.tcs && invoiceValues.tcs != "" ? invoiceValues.tcs : 0
    // );
    requestData.append(
      "tcs_per",
      invoiceValues.tcs_per && invoiceValues.tcs_per != ""
        ? invoiceValues.tcs_per
        : 0
    );
    requestData.append(
      "tcs_amt",
      invoiceValues.tcs_amt && invoiceValues.tcs_amt != ""
        ? invoiceValues.tcs_amt
        : 0
    );
    requestData.append(
      "tcs_mode",
      invoiceValues.tcs_mode && invoiceValues.tcs_mode != ""
        ? invoiceValues.tcs_mode
        : ""
    ); //modified by ashwin

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

    let frow = [];
    rows.map((v, i) => {
      if (v.productId != "") {
        let newObj = {
          details_id: v.details_id !== "" ? v.details_id : 0,
          inventoryId: v.inventoryId != "" ? v.inventoryId : 0,
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
          org_b_details_id:
            v.org_b_details_id != v.b_details_id ? v.org_b_details_id : 0,
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
          serialNo: v.serialNo
            ? v.serialNo.filter((vi) => vi.serial_no != "")
            : [],
          reference_type: v.reference_type,
          reference_id: v.reference_id != "" ? v.reference_id : 0,
        };
        frow.push(newObj);
      }
    });

    var filtered = frow.filter(function (el) {
      return el != null;
    });

    // console.log("additionalCharges", additionalCharges);
    let filteradditionalCharges = additionalCharges.map((v) => {
      return {
        additional_charges_details_id: v.additional_charges_details_id,
        ledgerId: v.ledgerId.id,
        amt: v.amt,
      };
    });

    requestData.append("row", JSON.stringify(filtered));
    // console.log("filteradditionalCharges", filteradditionalCharges);
    if (filteradditionalCharges != "" && filteradditionalCharges) {
      requestData.append(
        "additionalCharges",
        JSON.stringify(filteradditionalCharges)
      );
    }

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
    let filterRowDetail = [];
    if (rowDelDetailsIds.length > 0) {
      filterRowDetail = rowDelDetailsIds.map((v) => {
        return { del_id: v };
      });
    }

    let filterACRowDetail = [];
    if (delAdditionalCahrgesLst.length > 0) {
      filterACRowDetail = delAdditionalCahrgesLst.map((v) => {
        return { del_id: v };
      });
    }
    requestData.append("rowDelDetailsIds", JSON.stringify(filterRowDetail));
    requestData.append("acDelDetailsIds", JSON.stringify(filterACRowDetail));

    // for (const pair of requestData.entries()) {
    //   console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    // }

    editPurchaseInvoice(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          // debugger;
          // MyNotifications.fire({
          //   show: true,
          //   icon: "success",
          //   title: "Success",
          //   msg: res.message,
          //   is_timeout: true,
          //   delay: 1000,
          // });
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
          //       eventBus.dispatch("page_change", "tranx_sales_invoice_list");
          //     },
          //     handleFailFn: () => {
          //       eventBus.dispatch("page_change", "tranx_purchase_invoice_list");
          //     },
          //   },
          //   () => {
          //     console.warn("return_data");
          //   }
          // );
          // resetForm();
          this.initRow();
          if ("ledgerId" in this.state.source != "") {
            eventBus.dispatch("page_change", {
              from: "tranx_purchase_invoice_edit",
              to: "ledgerdetails",
              // prop_data: this.state.source["ledgerId"],
              prop_data: {
                prop_data: this.state.source["ledgerId"],
                ldview: this.props.block.prop_data.ldview,
              },
              isNewTab: false,
            });
            // this.setState({ source: "" });
          } else {
            eventBus.dispatch("page_change", {
              from: "tranx_purchase_invoice_edit",
              to: "tranx_purchase_invoice_list",
              prop_data: {
                editId: this.state.purchaseEditData.id,
                rowId: this.props.block.prop_data.rowId,
              },
              isNewTab: false,
              isCancel: true,
            });
            // eventBus.dispatch("page_change", "tranx_purchase_invoice_list");
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
            document.getElementById("supplierNameId").focus();
          },
          handleFailFn: () => {},
        },
        () => {
          // console.warn("return_data");
        }
      );
      if (this.myRef.current) {
        this.myRef.current.setFieldValue("supplierNameId", "");
      }
      // this.ledgerModalStateChange("ledgerModal", true);
      // alert("invalid ledger code");
    }
  }
  handleBillselectionDebit = (id, index, status) => {
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
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // CancelAPICall = () => {
  //   if (checkDataLockExist(this.state.datalockSlug)) {
  //     removeDataLock(this.state.datalockSlug);
  //     let reqData = new FormData();
  //     reqData.append("key", this.state.datalockSlug)
  //     removeInstance(reqData).then((response) => {
  //       console.log("response", response);
  //       console.log("this.state.source.from_page", this.state.source.from_page)
  //       if (this.state.source != "") {
  //         eventBus.dispatch("page_change", {
  //           from: "tranx_purchase_invoice_edit",
  //           // to: this.state.source.from_page,
  //           to: "tranx_purchase_invoice_list",

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
  //           "tranx_purchase_invoice_list"
  //         );
  //       }
  //     }).catch(
  //       (error) => {
  //         console.log("error", error);
  //         if (this.state.source != "") {
  //           eventBus.dispatch("page_change", {
  //             from: "tranx_purchase_invoice_edit",
  //             // to: this.state.source.from_page,
  //             to: "tranx_purchase_invoice_list",
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
  //             "tranx_purchase_invoice_list"
  //           );
  //         }
  //       }
  //     )
  //   }

  // }

  transaction_product_detailsFun = (product_id = 0) => {
    let requestData = new FormData();
    requestData.append("product_id", product_id);
    transaction_product_details(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("res--product", res);
        if (res.responseStatus == 200) {
          this.setState({
            productData: res.result,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  transaction_batch_detailsFun = (batchNo = 0) => {
    let requestData = new FormData();
    let { rows } = this.props;

    requestData.append("batchNo", batchNo.batch_no);
    requestData.append("id", batchNo.b_details_id);

    // requestData.append("id", batchNo.b_details_id);
    transaction_batch_details(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("batchDetails>>>>>>>>>>>>>>>>>>>", res);
        if (res.responseStatus == 200) {
          this.setState({
            batchDetails: res.response,
            filterbatchDetails: res.response,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  transaction_ledger_detailsFun = (ledger_id = 0) => {
    let requestData = new FormData();
    requestData.append("ledger_id", ledger_id);
    transaction_ledger_details(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("ledgerDataDetails", res.result);
        if (res.responseStatus == 200) {
          this.setState({ ledgerData: res.result });
          // let { ledgerModalStateChange } = this.props;
          // ledgerModalStateChange("ledgerData", res.result);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleAddAdditionalCharges = () => {
    let { additionalCharges } = this.state;
    let data = {
      details_id: "",
      ledgerId: "",
      amt: "",
    };
    additionalCharges = [...additionalCharges, data];
    this.setState({ additionalCharges: additionalCharges });
  };

  handleRemoveAddtionalChargesRow = (rowIndex = -1) => {
    let { additionalCharges, additionalDelDetailsIds } = this.state;

    //console.log("rows", rows, rowIndex, rowDelDetailsIds);
    if (additionalCharges.length > 1) {
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
    }
  };
  handleClearProduct1 = (frows) => {
    //for additional charges
    this.setState({ additionalCharges: frows }, () => {
      this.handleTranxCalculation();
    });
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

  setledgerInputData(propValue, flag) {
    this.setState(
      { ledgerInputData: propValue, isTextBox: flag, ledgerModal: true },
      () => {
        this.myRef.current.setFieldValue("supplierNameId", propValue);
      }
    );
  }

  handleOptionClick = (option) => {
    this.setState(
      (prevState) => ({
        tcs_mode: prevState.tcs_mode === option ? null : option,
      }),
      () => {}
    );
  };

  handleKeyPress = (event, option) => {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault(); // Prevent the default space bar scrolling behavior
      this.handleOptionClick(option);
    }
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
    let {
      currentTab, //@prathmesh @batch info & product info tab
      isTextBox,
      invoice_data,
      isBranch,
      purchaseAccLst,
      lstGst,
      ledgerData,
      ledgerDataIndExp,
      updatedLedgerType,
      ledgerType,
      ledgerModal,
      ledgerModalIndExp,
      ledgerModalIndExp1,
      ledgerModalIndExp2,
      ledgerModalIndExp3,
      selectedLedger,
      currentLedgerData,
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
      isLedgerSelectSet,
      isRowProductSet,
      validate_sales_invoicesFun,
      batchHideShow,
      transactionType,
      errorArrayBorder,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      setProductRowIndex,
      setProductId,
      productId,
      from_source,
      purchaseEditData,
      ledgerId,
      setLedgerId,
      adjustbillshow,
      isAllCheckeddebit,
      billLst,
      selectedBillsdebit,
      billAmount,
      editBillList,
      // ledgerType,
      batchDetails,
      isIndirectLedgerSelectSet,
      key_set,
      ledgerInputData,
      additionalCharges,
      additionalChargesTotal,
      sourceUnder,
      opType, // @vinit@Passing as prop in CmpTRow  and MDLLedgerfor Focusing previous Tab
      isAdditionalCharges, //use of to set additional ledger
      productDetailsId,
      batchDetailsId,
      ledgerDetailsId,
      ldview,
    } = this.state;
    // console.log("CMPTROW rows", rows);
    const isFocused = this.isInputFocused(); //@prathmesh @batch info & product info tab active
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
            validationSchema={Yup.object().shape({
              // // gstId: Yup.object().nullable().required("GST No is required"),
              // pi_invoice_dt: Yup.string().required("Invoice Date is Required"),
              // // supplierCodeId: Yup.object()
              // //   .nullable()
              // //   .required("Supplier Code is Required"),
              // purchaseId: Yup.object()
              //   .nullable()
              //   .required("Purchase Account is Required"),
              // pi_no: Yup.string().required("Invoice No is Required"),
              // supplierNameId: Yup.string()
              //   .trim()
              //   .required("Supplier Name is Required"),
            })}
            initialValues={invoice_data}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              values.tcs_mode = this.state.tcs_mode;
              // console.log("values ->>>>>>>>>>>>>", values);
              // console.log("rows", rows);

              //! validation required start
              let errorArray = [];
              // if (values.supplierCodeId == "") {
              //   errorArray.push("Y");
              // } else {
              errorArray.push("");
              // }

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

              if (
                values.pi_invoice_dt == "" ||
                values.pi_invoice_dt == "__/__/____"
              ) {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
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
                              let { selectedSupplier } = values;
                              if (selectedSupplier) {
                                // debugger;
                                this.handleFetchData(selectedSupplier.id);
                              }
                            },
                            handleFailFn: () => {},
                          },
                          () => {
                            // console.warn("return_data");
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
                  if (e.keyCode == 13) {
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
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.focusNextElement(e);
                                      }
                                    }}
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
                                  onBlur={(e) => {
                                    //console.log("e ", e);
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
                                          "pi_transaction_dt",
                                          e.target.value
                                        );
                                        /*  this.checkInvoiceDateIsBetweenFYFun(
                                          e.target.value,
                                          setFieldValue
                                        ); */
                                      }
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid invoice date",
                                        is_button_show: true,
                                      });
                                      this.invoiceDateRef.current.focus();
                                      setFieldValue("pi_transaction_dt", "");
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
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
                                            "pi_transaction_dt",
                                            e.target.value
                                          );
                                          /*  this.checkInvoiceDateIsBetweenFYFun(
                                            e.target.value,
                                            setFieldValue
                                          ); */
                                          this.focusNextElement(e);
                                        }
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Invalid invoice date",
                                          is_button_show: true,
                                        });
                                        this.invoiceDateRef.current.focus();
                                        setFieldValue("pi_transaction_dt", "");
                                        e.preventDefault();
                                      }
                                    }
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.pi_transaction_dt}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          {/* <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                <Form.Label>Code</Form.Label>
                              </Col>

                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Form.Control
                                  type="text"
                                  // type="text"
                                  placeholder="Ledger Code"
                                  name="supplierCodeId"
                                  id="supplierCodeId"
                                  // disabled={
                                  //   values.pi_transaction_dt !== ""
                                  //     ? false
                                  //     : true
                                  // }
                                  onChange={handleChange}
                                  //   onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalised(
                                  //     e.target.value
                                  //   );
                                  // }} 
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   if (values.supplierCodeId != "") {
                                  //     this.ledgerModalStateChange(
                                  //       "selectedLedger",
                                  //       values.selectedSupplier
                                  //     );
                                  //     this.ledgerModalStateChange(
                                  //       "ledgerModal",
                                  //       true
                                  //     );
                                  //   } else {
                                  //     this.ledgerModalStateChange(
                                  //       "ledgerModal",
                                  //       true
                                  //     );
                                  //   }
                                  // }}
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
                                      }
                                    }
                                  }}
                                  value={values.supplierCodeId}
                                  className="tnx-pur-inv-text-box"
                                />

                               
                              </Col>
                            </Row>
                          </Col> */}
                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                                <Form.Label>
                                  Ledger Name{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>
                              <Col lg={10} md={10} sm={10} xs={10}>
                                <Form.Control
                                  ref={this.inputLedgerNameRef}
                                  // type="button"
                                  type="text"
                                  placeholder="Ledger Name"
                                  name="supplierNameId"
                                  id="supplierNameId"
                                  // disabled={
                                  //   values.pi_transaction_dt !== ""
                                  //     ? false
                                  //     : true
                                  // }
                                  // onInput={(e) => {
                                  //   e.target.value = this.getDataCapitalised(
                                  //     e.target.value
                                  //   );
                                  //   console.log(
                                  //     "ledgerInputData---",
                                  //     e.target.value
                                  //   );
                                  //   this.setState({
                                  //     ledgerInputData:
                                  //       e.target.value.toLowerCase(),
                                  //   });
                                  //   // this.filterData(e.target.value);
                                  // }}
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    e.preventDefault();

                                    this.setledgerInputData(
                                      e.target.value,
                                      true
                                    );
                                  }}
                                  //@prathmesh @ledger info show on mouser hover start
                                  onMouseOver={(e) => {
                                    e.preventDefault();
                                    e.preventDefault();
                                    if (
                                      values.selectedSupplier != "" &&
                                      values.selectedSupplier != null &&
                                      values.selectedSupplier != undefined
                                    ) {
                                      this.ledgerModalStateChange(
                                        "selectedLedger",
                                        values.selectedSupplier
                                      );
                                      this.transaction_ledger_detailsFun(
                                        values.selectedSupplier.id
                                      );
                                    }
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
                                    } else if (e.shiftKey && e.key === "Tab") {
                                    } else if (e.key === "Tab") {
                                      e.preventDefault();
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
                                          this.ledgerFilterData();
                                        }
                                      );
                                    } else if (e.keyCode == 40) {
                                      this.setState({ ledgerNameFlag: true });
                                      if (ledgerModal == true)
                                        document
                                          .getElementById("LedgerMdlTr_0")
                                          ?.focus();
                                    }
                                  }}
                                  //readOnly
                                  // value={values.supplierNameId}
                                  // readOnly={true}
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
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
                                  <Select
                                    ref={this.SelecteRefGSTIN}
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
                                </Form.Group>
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
                                  // readOnly={true}
                                  isClearable={false}
                                  onChange={handleChange}
                                  /*  onInput={(e) => {
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  }} */
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
                                  // onKeyDown={(e) => {
                                  //   if (e.key === "Tab" && !e.target.value)
                                  //     e.preventDefault();
                                  // }}

                                  className={`${
                                    values.pi_no == "" &&
                                    errorArrayBorder[2] == "Y"
                                      ? "border border-danger tnx-pur-inv-text-box"
                                      : "tnx-pur-inv-text-box"
                                  }`}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (e.target.value) {
                                      this.setErrorBorder(2, "");
                                      this.validatePurchaseInvoice(
                                        values.pi_no,
                                        values.selectedSupplier.id,
                                        purchaseEditData.id
                                      );
                                    } else {
                                      this.setErrorBorder(2, "Y");
                                      // document.getElementById("pi_no").focus();
                                    }
                                  }}
                                  // onKeyDown={(e) => {
                                  //   if (e.shiftKey && e.key === "Tab") {
                                  //   } else if (
                                  //     e.key === "Tab" &&
                                  //     !e.target.value
                                  //   )
                                  //     e.preventDefault();
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13 && e.target.value) {
                                      this.validatePurchaseInvoice(
                                        values.pi_no,
                                        values.selectedSupplier.id,
                                        purchaseEditData.id
                                      );
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">
                                  {errors.pi_no}
                                </span> */}
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={5} md={5} sm={5} xs={5}>
                            <Row>
                              <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                                <Form.Label>
                                  Invoice Date{" "}
                                  <label style={{ color: "red" }}>*</label>{" "}
                                </Form.Label>
                              </Col>

                              <Col lg={3} md={3} sm={3} xs={3}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                    } else if (
                                      e.key === "Tab" &&
                                      values.pi_invoice_dt === "__/__/____"
                                    ) {
                                      e.preventDefault();
                                    } else if (
                                      e.keyCode == 13 &&
                                      values.pi_invoice_dt
                                    ) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.invoiceDateRef.current = input;
                                    }}
                                    // className="tnx-pur-inv-date-style"
                                    name="pi_invoice_dt"
                                    id="pi_invoice_dt"
                                    placeholder="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    value={values.pi_invoice_dt}
                                    onChange={handleChange}
                                    className={`${
                                      values.pi_invoice_dt == "" &&
                                      errorArrayBorder[3] == "Y"
                                        ? "border border-danger tnx-pur-inv-date-style"
                                        : "tnx-pur-inv-date-style"
                                    }`}
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
                                    //     this.setErrorBorder(3, "");
                                    //     let d = new Date();
                                    //     d.setMilliseconds(0);
                                    //     d.setHours(0);
                                    //     d.setMinutes(0);
                                    //     d.setSeconds(0);
                                    //     const enteredDate = moment(
                                    //       e.target.value,
                                    //       "DD-MM-YYYY"
                                    //     );
                                    //     const currentDate = moment(d);

                                    //     if (enteredDate.isAfter(currentDate)) {
                                    //       MyNotifications.fire({
                                    //         show: true,
                                    //         icon: "confirm",
                                    //         title: "confirm",
                                    //         msg:
                                    //           "Entered date is greater than current date",
                                    //         // is_button_show: true,
                                    //         handleSuccessFn: () => {},
                                    //         handleFailFn: () => {
                                    //           setFieldValue(
                                    //             "pi_invoice_dt",
                                    //             ""
                                    //           );
                                    //           eventBus.dispatch(
                                    //             "page_change",
                                    //             "tranx_purchase_invoice_create"
                                    //           );
                                    //           // this.reloadPage();
                                    //         },
                                    //       });
                                    //       // } else if (
                                    //       //   enteredDate.isBefore(currentDate)
                                    //       // ) {
                                    //       //   MyNotifications.fire({
                                    //       //     show: true,
                                    //       //     icon: "confirm",
                                    //       //     title: "confirm",
                                    //       //     msg: "Entered date is smaller than current date",
                                    //       //     // is_button_show: true,
                                    //       //     handleSuccessFn: () => { },
                                    //       //     handleFailFn: () => {
                                    //       //       setFieldValue(
                                    //       //         "pi_invoice_dt",
                                    //       //         ""
                                    //       //       );
                                    //       //       eventBus.dispatch(
                                    //       //         "page_change",
                                    //       //         "tranx_purchase_invoice_create"
                                    //       //       );
                                    //       //       // this.reloadPage();
                                    //       //     },
                                    //       //   });
                                    //       // } else {
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
                                    //     this.setErrorBorder(3, "Y");
                                    //     // document
                                    //     //   .getElementById("pi_invoice_dt")
                                    //     //   .focus();
                                    //   }
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
                                    //         "pi_invoice_dt",
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
                                    //       setFieldValue("pi_invoice_dt", "");
                                    //     }
                                    //   } else {
                                    //     setFieldValue("pi_invoice_dt", "");
                                    //   }
                                    // }}
                                    onKeyDown={(e) => {
                                      if (
                                        (e.shiftKey == true &&
                                          e.keyCode == 9) ||
                                        e.keyCode == 9
                                      ) {
                                        if (e.target.value) {
                                          // @prathmesh @DD/MM type then current year auto show start
                                          let datchco = e.target.value.trim();
                                          let repl = datchco.replace(/_/g, "");

                                          if (repl.length === 6) {
                                            const currentYear =
                                              new Date().getFullYear();
                                            let position = 6;
                                            repl = repl.split("");
                                            repl.splice(
                                              position,
                                              0,
                                              currentYear
                                            );
                                            let finle = repl.join("");
                                            // console.log("finfinfinfin", finle);
                                            e.target.value = finle;
                                            setFieldValue(
                                              "pi_invoice_dt",
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
                                              "pi_invoice_dt",
                                              e.target.value
                                            );
                                            this.checkInvoiceDateIsBetweenFYFun(
                                              e.target.value,
                                              "pi_invoice_dt"
                                            );
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid invoice date",
                                              is_button_show: true,
                                            });
                                            setTimeout(() => {
                                              this.invoiceDateRef.current.focus();
                                              setFieldValue(
                                                "pi_invoice_dt",
                                                ""
                                              );
                                            }, 500);
                                          }
                                        } else {
                                          setFieldValue("pi_invoice_dt", "");
                                        }
                                      } else if (e.keyCode == 13) {
                                        if (e.target.value) {
                                          // @prathmesh @DD/MM type then current year auto show start
                                          let datchco = e.target.value.trim();
                                          let repl = datchco.replace(/_/g, "");

                                          if (repl.length === 6) {
                                            const currentYear =
                                              new Date().getFullYear();
                                            let position = 6;
                                            repl = repl.split("");
                                            repl.splice(
                                              position,
                                              0,
                                              currentYear
                                            );
                                            let finle = repl.join("");
                                            // console.log("finfinfinfin", finle);
                                            e.target.value = finle;
                                            setFieldValue(
                                              "pi_invoice_dt",
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
                                              "pi_invoice_dt",
                                              e.target.value
                                            );
                                            this.checkInvoiceDateIsBetweenFYFun(
                                              e.target.value,
                                              "pi_invoice_dt"
                                            );
                                            this.focusNextElement(e);
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid invoice date",
                                              is_button_show: true,
                                            });
                                            setTimeout(() => {
                                              this.invoiceDateRef.current.focus();
                                              setFieldValue(
                                                "pi_invoice_dt",
                                                ""
                                              );
                                            }, 500);
                                          }
                                        } else {
                                          setFieldValue("pi_invoice_dt", "");
                                          e.preventDefault();
                                        }
                                      }
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger errormsg">
                                  {errors.pi_invoice_dt}
                                </span>
                              </Col>
                              {/* </Row>
                          </Col>
                         

                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Row> */}
                              <Col lg={2} md={2} sm={2} xs={2} className="p-0">
                                <Form.Label>Purchase A/C</Form.Label>
                              </Col>
                              <Col lg={5} md={5} sm={5} xs={5}>
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
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
                                </Form.Group>
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
                                <Form.Group
                                  controlId="formGridEmail"
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
                                  <Form.Control
                                    type="file"
                                    placeholder=""
                                    className="tnx-pur-inv-text-box"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>
                  <CmpTRow
                    isRowProductSet={isRowProductSet}
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
                    productData={productData}
                    batchNoData={batchNoData}
                    qtyData={qtyData}
                    rateData={rateData}
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
                    productId="TPIEProductId-"
                    addBtnId="TPICAddBtn-"
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
                    productDetailsId={productDetailsId}
                    batchDetailsId={batchDetailsId}
                  />
                  {/* <Row className="tnx-pur-inv-description-style mx-0">
                    <Col lg={2}>
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
                          {batch_data_selected.expiry_date ? (
                            <span className="span-value">
                              {batch_data_selected.expiry_date
                                ? moment(
                                  batch_data_selected.expiry_date
                                ).format("DD-MM-YYYY") === "Invalid date"
                                  ? ""
                                  : moment(
                                    batch_data_selected.expiry_date
                                  ).format("DD/MM/YYYY")
                                : moment(
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
                        // <Col lg={6}>
                        //   <span className="span-lable">Barcode:</span>
                        //   <span className="span-value">
                        //     {product_hover_details.barcode}
                        //   </span>
                        // </Col>
                      </Row>
                    </Col> 
                     <Col lg={{ span: 1, offset: 2 }}>
                      <span className="span-lable">Gross Total</span>
                    </Col>
                    <Col lg={1}>
                      <span className="span-value">
                        {parseFloat(values.totalamt).toFixed(2)}
                      </span>
                    </Col> 
                  </Row> */}

                  <Row className="mx-0 btm-data-invoice">
                    <Col lg={8} md={8} sm={8} xs={8}>
                      <Row className="row-top-padding">
                        <Tab.Container
                          id="left-tabs-example"
                          // @prathmesh @batch info & product info tab active start

                          activeKey={currentTab}
                          // activeKey={
                          //   ledgerModal === true || isFocused === true
                          //     ? "first"
                          //     : productData !== ""
                          //     ? "second"
                          //     : "second"
                          // }
                          defaultActiveKey="second"
                          // @prathmesh @batch info & product info tab active end
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
                                  id="TPIE_Ledger_Tab"
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
                                  id="TPIE_Product_Tab"
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
                                        .getElementById("TPIE_Ledger_Tab")
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

                          <Tab.Content style={{ paddingTop: "5px" }}>
                            <Tab.Pane eventKey="first">
                              <Row className="mt-2">
                                <Col lg={12}>
                                  <Row className="tnx-pur-inv-description-style ">
                                    <Col
                                      lg={3}
                                      style={{
                                        borderRight: "1px solid #EAD8B1",
                                      }}
                                    >
                                      <h6 className="title-style">
                                        Ledger Info:
                                      </h6>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          GST No :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {ledgerData.gst_number}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Area :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {ledgerData.area}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Bank :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
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
                                        <span className="span-lable">
                                          Transport:
                                        </span>
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
                                        <span className="span-lable">
                                          FSSAI:
                                        </span>
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
                                        <span className="span-lable">
                                          Route:
                                        </span>
                                        <span className="span-value">
                                          {/* {product_hover_details.tax_type} */}
                                          {ledgerData.route}
                                        </span>
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <Row className="mt-2">
                                <Col lg={9} className="pe-0">
                                  <Row className="tnx-pur-inv-description-style">
                                    <Col
                                      lg={6}
                                      className="pe-"
                                      style={{
                                        borderRight: "1px solid #EAD8B1",
                                      }}
                                    >
                                      <h6 className="title-style">
                                        Product Info:
                                      </h6>
                                      <div className="d-flex">
                                        {" "}
                                        <span className="span-lable">
                                          Brand :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {productData.brand}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Group :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {productData.group}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Category :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {productData.category}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Supplier :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
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
                                        <span className="span-lable">
                                          HSN :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {/* {product_hover_details.hsn} */}
                                          {productData.hsn}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Tax Type :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {/* {product_hover_details.tax_type} */}
                                          {productData.tax_type}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Tax% :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {productData.tax_per}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Margin% :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {productData.margin_per}
                                        </span>
                                      </div>
                                    </Col>
                                    <Col lg={3} className="col-top-margin pe-0">
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Cost :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {productData.cost}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Shelf ID :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {/* {product_hover_details.hsn} */}
                                          {productData.shelf_id}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Min Stock :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {[productData.min_stocks]}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Max Stock :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {productData.max_stocks}
                                        </span>
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={3}>
                                  <Row className="tnx-pur-inv-description-style">
                                    <Col lg={12}>
                                      <h6 className="title-style">
                                        Batch Info:
                                      </h6>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Name :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {batchDetails != ""
                                            ? batchDetails.supplierName
                                            : ""}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Bill no :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
                                          {batchDetails != ""
                                            ? batchDetails.billNo
                                            : ""}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="span-lable">
                                          Bill Date :
                                        </span>
                                        <span className="span-value">
                                          &nbsp;&nbsp;
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
                      </Row>

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
                          className="my-auto pe-0"
                        >
                          <Form.Label>Dis.%</Form.Label>
                        </Col>
                        <Col lg={3} className="mt-2 for_padding">
                          <Form.Control
                            placeholder="0"
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
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) this.focusNextElement(e);
                            }}
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
                            placeholder="0.00"
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
                              if (e.keyCode == 13) this.focusNextElement(e);
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
                              {/* {INRformat.format(values.total_qty)} */}
                            </span>
                          </Col>
                        </Row>

                        {/* <Col lg={1}>
                          <p style={{ color: "#B6762B" }}>|</p>
                        </Col> */}

                        <Row>
                          <Col lg={12} className="mt-1">
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

                        <Row className="mt-1">
                          <Col lg={1} className="pe-0">
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className="pl-0"
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

                          <Col lg={11}>
                            <span className="tnx-pur-inv-span-text">
                              R.Off(+/-):
                            </span>
                            <span className="tnx-pur-inv-span-placeholder ">
                              {/* {parseFloat(values.roundoff).toFixed(2)} */}
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
                      className="for_padding text-end p-0"
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
                                    <td className="text-center">{v.name}</td>
                                    <td className="text-center">
                                      {v.unique_code}
                                    </td>
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
                            <td
                              className="py-0 ps-1"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="d-flex mt-2">
                                <Form.Label className="my-auto ">
                                  Add.Charges
                                </Form.Label>
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
                                {/* </InputGroup> */}
                                <Button
                                  id="TPIEaddCharges"
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
                                    } else if (e.keyCode == 13)
                                      this.focusNextElement(e);
                                  }}
                                >
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="ledger-btn "
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
                            </td>
                            <td className="p-0 text-end">
                              <Form.Control
                                placeholder="Add. amt"
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
                                style={{ marginLeft: "-10px", width: "110%" }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) this.focusNextElement(e);
                                }}
                              />
                            </td>
                          </tr>

                          <tr>
                            <td className="p-0 ps-1">
                              {/* @neha @Tcs Tds Radio button true false  */}
                              <Row>
                                <Col lg="8">
                                  <Form.Group
                                    style={{ width: "fit-content" }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13)
                                        this.focusNextElement(e);
                                    }}
                                  >
                                    <Row>
                                      <Col lg="6">
                                        <Form.Check
                                          type="radio"
                                          id="mode1"
                                          name="tcs_mode"
                                          label="TDS"
                                          value="tds"
                                          autoComplete="off"
                                          onChange={handleChange}
                                          checked={
                                            this.state.tcs_mode === "tds"
                                          }
                                          // checked={
                                          //   values.tcs_mode === "tds"
                                          //     ? true
                                          //     : false
                                          // }
                                          onClick={() =>
                                            this.handleOptionClick("tds")
                                          }
                                          onKeyDown={(e) =>
                                            this.handleKeyPress(e, "tds")
                                          }
                                          tabIndex="0"
                                        />
                                      </Col>
                                      <Col lg="6">
                                        <Form.Check
                                          type="radio"
                                          name="tcs_mode"
                                          id="mode2"
                                          label="TCS"
                                          value="tcs"
                                          autoComplete="off"
                                          onChange={handleChange}
                                          checked={
                                            this.state.tcs_mode === "tcs"
                                          }
                                          // checked={
                                          //   values.tcs_mode === "tcs"
                                          //     ? true
                                          //     : false
                                          // }
                                          onClick={() =>
                                            this.handleOptionClick("tcs")
                                          }
                                          onKeyDown={(e) =>
                                            this.handleKeyPress(e, "tcs")
                                          }
                                          tabIndex="0"
                                        />
                                      </Col>
                                    </Row>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </td>
                            <td className="p-0 text-end ps-1">
                              <Row>
                                <Col lg="5" md="5" className="pe-0 ps-0">
                                  <InputGroup>
                                    <div className="d-flex">
                                      <Form.Control
                                        placeholder=""
                                        className="tnx-pur-inv-text-box mt-1 text-end px-1"
                                        id="tcs_per"
                                        name="tcs_per"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "tcs_per",
                                            e.target.value
                                          );
                                        }}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          // console.log("name ", e.target);
                                          if (
                                            e.target.name
                                              .trim()
                                              .toLowerCase() == "tcs_per"
                                          ) {
                                            //  setTimeout(() => {
                                            this.handleTranxCalculation(
                                              "tcs_per"
                                            );
                                            // }, 100);
                                          }
                                        }}
                                        value={values.tcs_per}
                                        onKeyPress={(e) => {
                                          OnlyEnterAmount(e);
                                        }}
                                        // readOnly={
                                        //   parseInt(values.tcs_per) > 0
                                        //     ? false
                                        //     : true
                                        // }
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13)
                                            if (
                                              e.target.name
                                                .trim()
                                                .toLowerCase() == "tcs_per"
                                            ) {
                                              //  setTimeout(() => {
                                              this.handleTranxCalculation(
                                                "tcs_per"
                                              );
                                              this.focusNextElement(e);
                                              // }, 100);
                                            }
                                        }}
                                      />
                                      <span className="my-auto">%</span>
                                    </div>
                                  </InputGroup>
                                </Col>
                                <Col lg="7" md="7" className="ps-0 pe-1">
                                  <InputGroup>
                                    <div className="d-flex">
                                      <Form.Control
                                        placeholder="Amt."
                                        className="tnx-pur-inv-text-box mt-1 text-end px-1"
                                        id="tcs_amt"
                                        name="tcs_amt"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "tcs_amt",
                                            e.target.value
                                          );
                                          // setTimeout(() => {
                                          //   this.handleTranxCalculation("tcs_amt");
                                          // }, 100);
                                        }}
                                        onBlur={(e) => {
                                          e.preventDefault();
                                          // console.log("name ", e.target);
                                          if (
                                            e.target.name
                                              .trim()
                                              .toLowerCase() == "tcs_amt"
                                          ) {
                                            //  setTimeout(() => {
                                            this.handleTranxCalculation(
                                              "tcs_amt"
                                            );
                                            // }, 100);
                                          }
                                        }}
                                        value={values.tcs_amt}
                                        onKeyPress={(e) => {
                                          OnlyEnterAmount(e);
                                        }}
                                        // readOnly={
                                        //   parseInt(values.tcs_amt) > 0
                                        //     ? false
                                        //     : true
                                        // }
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13)
                                            if (
                                              e.target.name
                                                .trim()
                                                .toLowerCase() == "tcs_amt"
                                            ) {
                                              //  setTimeout(() => {
                                              this.handleTranxCalculation(
                                                "tcs_amt"
                                              );
                                              this.focusNextElement(e);
                                              // }, 100);
                                            }
                                        }}
                                      />
                                      <span className="my-auto">₹</span>
                                    </div>
                                  </InputGroup>
                                </Col>
                              </Row>
                            </td>
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
                            <td className="p-0 text-end"></td>
                          </tr>
                          <tr>
                            <td className="py-0">
                              <InputGroup className="  mdl-text d-flex">
                                <Form.Control
                                  disabled
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
                                    } else if (e.keyCode == 13) {
                                      this.focusNextElement(e);
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
                                disabled
                                placeholder="Add. amt"
                                className="tnx-pur-inv-text-box my-1 text-end"
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
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  }
                                }}
                              />
                            </td>
                          </tr>

                          <tr>
                            <th>Bill Amount</th>
                            <th className="text-end">
                              {/* {parseFloat(values.bill_amount).toFixed(2)} */}
                              {isNaN(values.bill_amount)
                                ? INRformat.format(0)
                                : INRformat.format(values.bill_amount)}
                              {/* 123456789.99 */}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                      <p className="btm-row-size">
                        <Button
                          id="TPIE_submit_btn"
                          className="successbtn-style"
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
                                  // this.CancelAPICall();
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_purchase_invoice_edit",
                                    to: "tranx_purchase_invoice_list",
                                    isNewTab: false,
                                  });
                                  if ("ledgerId" in this.state.source != "") {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_invoice_edit",
                                      to: "ledgerdetails",
                                      // prop_data: this.state.source["ledgerId"],
                                      prop_data: {
                                        prop_data:
                                          this.state.source["ledgerId"],
                                        ldview:
                                          this.props.block.prop_data.ldview,
                                      },
                                      isNewTab: false,
                                      isCancel: true,
                                    });
                                    // this.setState({ source: "" });
                                  } else {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_invoice_edit",
                                      to: "tranx_purchase_invoice_list",
                                      prop_data: {
                                        editId: this.state.purchaseEditData.id,
                                        rowId: this.props.block.prop_data.rowId,
                                      },
                                      isNewTab: false,
                                      isCancel: true,
                                    });
                                    // eventBus.dispatch(
                                    //   "page_change",
                                    //   "tranx_purchase_invoice_list"
                                    // );
                                  }
                                },
                                handleFailFn: () => {},
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
                                  msg: "Do you want to Cancel",
                                  is_button_show: false,
                                  is_timeout: false,
                                  delay: 0,
                                  handleSuccessFn: () => {
                                    // eventBus.dispatch("page_change", {
                                    //   from: "tranx_purchase_invoice_edit",
                                    //   to: "tranx_purchase_invoice_list",
                                    //   isNewTab: false,
                                    // });
                                    if ("ledgerId" in this.state.source != "") {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_purchase_invoice_edit",
                                        to: "ledgerdetails",
                                        prop_data:
                                          this.state.source["ledgerId"],

                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                      //   // this.setState({ source: "" });
                                    } else {
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "tranx_purchase_invoice_list"
                                      // );
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_purchase_invoice_edit",
                                        to: "tranx_purchase_invoice_list",
                                        prop_data: {
                                          editId:
                                            this.state.purchaseEditData.id,
                                          rowId:
                                            this.props.block.prop_data.rowId,
                                        },
                                        isNewTab: false,
                                        isCancel: true,
                                      });
                                    }
                                  },
                                  handleFailFn: () => {},
                                },
                                () => {
                                  // console.warn("return_data");
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
                    // <Col md="8"></Col>
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
          selectedLedger={selectedLedger}
          currentLedgerData={currentLedgerData}
          invoice_data={invoice_data}
          userControl={this.props.userControl}
          isLedgerSelectSet={isLedgerSelectSet}
          from_source={from_source}
          ledgerId={ledgerId}
          setLedgerId={setLedgerId}
          rows={rows}
          transaction_ledger_detailsFun={this.transaction_ledger_detailsFun.bind(
            this
          )}
          ledgerType={ledgerType} // @prathmesh @ledger filter added
          updatedLedgerType={updatedLedgerType} // @prathmesh @ledger filter added
          ledgerInputData={ledgerInputData}
          isTextBox={isTextBox}
          searchInputId="supplierNameId"
          setledgerInputDataFun={this.setledgerInputData.bind(this)}
          sourceUnder={sourceUnder} //@Sneha @used for direct set sundry creditor slug in ledger create
          opType={opType} // @vinit @Passing as prop in CmpTRow and MDLLedger for Focusing previous Tab
          // ledgerType={ledgerType}
          ledgerDetailsId={ledgerDetailsId} //use for load and set ledger details data when we perform edit operation
        />
        {/* Ledger Modal Ends */}

        {/* IndirectExp Ledger Modal Starts */}
        <MdlLedgerIndirectExp
          ledgerModalStateChange={this.ledgerModalStateChange.bind(this)}
          ledgerIndExpModalStateChange={this.ledgerIndExpModalStateChange.bind(
            this
          )}
          ledgerList={
            this.props.block.prop_data.ledgerList
              ? this.props.block.prop_data.ledgerList
              : ""
          }
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
          isAdditionalCharges={isAdditionalCharges}
          handleRemoveAddtionalChargesRow={this.handleRemoveAddtionalChargesRow.bind(
            this
          )}
          initAdditionalCharges={this.initAdditionalCharges.bind(this)}
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
          from_source={from_source}
          invoice_data={this.myRef.current ? this.myRef.current.values : ""}
          productId={productId}
          setProductId={setProductId}
          setProductRowIndex={setProductRowIndex}
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
          getProductBatchList={this.getProductBatchList.bind(this)}
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
        /> */}
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
                  // console.log(
                  //   "Adjust invoiceValues--------->",
                  //   invoiceValues,
                  //   invoice_data
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
                  requestData.append("id", invoice_data.id);
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
                        details_id: v.details_id != "" ? v.details_id : 0,
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
                    invoice_data.supplierCodeId &&
                    invoice_data.supplierCodeId.state !=
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
                  editPurchaseInvoice(requestData)
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

                        // eventBus.dispatch(
                        //   "page_change",
                        //   "tranx_purchase_invoice_list"
                        // );
                        eventBus.dispatch("page_change", {
                          from: "tranx_purchase_invoice_edit",
                          to: "tranx_purchase_invoice_list",
                          isCancel: true,
                          prop_data: {
                            editId: this.state.purchaseEditData.id,
                            rowId: this.props.block.prop_data.rowId,
                          },
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
)(TranxPurchaseInvoiceEdit);
