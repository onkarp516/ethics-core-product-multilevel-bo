import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  CloseButton,
  Collapse,
  Card,
  Badge,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select from "react-select";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getPOInvoiceList,
  getLastPOInvoiceNo,
  getLastPurchaseInvoiceNo,
  getLastPOChallanInvoiceNo,
  delete_purchase_order,
  getPurchaseOrderBill,
} from "@/services/api_functions";
import delete_icon from "@/assets/images/delete_icon 3.png";
import print3 from "@/assets/images/print3.png";
import search from "@/assets/images/search_icon@3x.png";
import Edit from "@/assets/images/Edit.png";
import refresh from "@/assets/images/refresh.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import {
  faArrowDown,
  faArrowUp,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  ShowNotification,
  getSelectValue,
  customStyles,
  MyDatePicker,
  eventBus,
  customStylesWhite,
  isActionExist,
  MyNotifications,
  LoadingComponent,
  INRformat,
  MyTextDatePicker,
  AuthenticationCheck
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faCalculator,
  faCirclePlus,
  faCircleQuestion,
  faFloppyDisk,
  faGear,
  faHouse,
  faPen,
  faPrint,
  faArrowUpFromBracket,
  faRightFromBracket,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
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
    borderBottom: "1px solid #ccc",
    "&:focus": {
      borderBottom: "1px solid #1e3989",
    },
  }),
};

class TranxPurchaseOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.po_ref = React.createRef();
    this.po_invoice_ref = React.createRef();
    this.po_challan_ref = React.createRef();
    this.purOrderRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      arrowToggle: true,
      show: false,
      showDiv: false,
      opendiv: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      selectetSCIds: "",
      selectetPOBills: [],
      ConvertIntoChallan: false,
      selectedOrderToInvoice: [],
      orgData: [],
      isAllChecked: false,
      convshow: false,
      convshowInvoice: false,
      ConvertIntoInvoice: false,
      successAlert: false,
      warningAlert: false,
      errorAlert: false,
      confirmAlert: false,
      showloader: false,
      source: "",
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      initVal: {
        po_sr_no: 1,
        po_no: 1,
        po_transaction_dt: moment().format("YYYY-MM-DD"),
        po_invoice_dt: new Date(),
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
      invoiceInitVal: {
        pi_sr_no: 1,
        pi_no: 1,
        pi_transaction_dt: moment().format("YYYY-MM-DD"),
        pi_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
      challanInitVal: {
        pc_sr_no: 1,
        pc_no: 1,
        pc_transaction_dt: moment().format("YYYY-MM-DD"),
        pc_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
    };
  }

  // lstPurchaseAccounts = () => {
  //   getPurchaseAccounts()
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         let opt = res.list.map((v, i) => {
  //           return { label: v.name, value: v.id };
  //         });
  //         this.setState({ purchaseAccLst: opt });
  //       }
  //     })
  //     .catch((error) => {});
  // };
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

  // lstPOInvoice = () => {
  //   this.setState({ showloader: true });
  //   getPOInvoiceList()
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         this.setState(
  //           {
  //             purchaseInvoiceLst: res.data,
  //             orgData: res.data,
  //             // showloader: false,
  //           },
  //           () => {
  //             this.purOrderRef.current.setFieldValue("search", "");
  //           }
  //         );
  //         setTimeout(() => {

  //           if (this.props.block.prop_data.rowId) {
  //             document
  //               .getElementById("TPOLTr_" + this.props.block.prop_data.rowId)
  //               .focus();
  //           } else if (document.getElementById("Search") != null) {
  //             {
  //               document.getElementById("Search").focus();
  //             }
  //           }
  //         }, 1000);
  //       }
  //     })
  //     .catch((error) => {
  //       this.setState({ purchaseInvoiceLst: [] });
  //     });
  // };

  //start of purchase order list with pagination
  lstPOInvoice = () => {
    this.setState({ showloader: true });
    let { currentPage, pageLimit, startDate, endDate, colId, isAsc } =
      this.state;
    let req = {
      pageNo: currentPage,
      pageSize: pageLimit,
      searchText: "",
      sort: '{ "colId": null, "isAsc": true }',
      startDate:
        startDate != null && startDate != ""
          ? moment(startDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
      endDate:
        endDate != null && endDate != ""
          ? moment(endDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
    };
    getPOInvoiceList(req)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              purchaseInvoiceLst:
                res.responseObject.data != null ? res.responseObject.data : [],
              orgData:
                res.responseObject.data != null ? res.responseObject.data : [],
              // showloader: false,
              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
              currentPage:
                res.responseObject != null ? res.responseObject.page : 0,
            },
            () => {
              this.purOrderRef.current.setFieldValue("search", "");
            }
          );
          setTimeout(() => {
            if (this.props.block.prop_data.rowId) {
              document.getElementById("TPOLTr_" + this.props.block.prop_data.rowId).focus();
            } else if (this.props.block.prop_data.rowId == 0) {
              setTimeout(() => {
                document.getElementById("TPOLTr_0").focus();
              }, 300)
            }
            else if (this.props.block.prop_data.isCreate) {
              // alert ("isCreate")
              document.getElementById(`TPOLTr_0`).focus();
            }
            else if (document.getElementById("SearchTPOL") != null) {
              {
                document.getElementById("SearchTPOL").focus();

              }
            }
          }, 1000);
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  //end of purchase order list with pagination
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.lstPOInvoice();
    });
  };

  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.lstPOInvoice();
    });
  };

  // getlstLedgerTranxDetailsReportsPageLoad = (value) => {
  //   let { edit_data, d_start_date, d_end_date } = this.state;
  //   const startDate = moment(
  //     moment(value.d_start_date, "DD/MM/YYYY").toDate()
  //   ).format("YYYY-MM-DD");
  //   const endDate = moment(
  //     moment(value.d_end_date, "DD/MM/YYYY").toDate()
  //   ).format("YYYY-MM-DD");
  //   let reqData = new FormData();
  //   // reqData.append("id", id);
  //   reqData.append("startDate", startDate);
  //   reqData.append("endDate", endDate);
  //   reqData.append("id", edit_data);
  //   getPOInvoiceList(reqData).then((response) => {
  //     let res = response.data;
  //     if (res.responseStatus == 200) {
  //       this.setState(
  //         {
  //           purchaseInvoiceLst: res.data,
  //           orgData: res.data,
  //           showloader: false,
  //         },
  //         () => {
  //           this.purOrderRef.current.setFieldValue("search", "");
  //         }
  //       );
  //     }
  //     console.log("res---->", res);
  //   });
  // };

  setLastPurchaseSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          const { initVal } = this.state;
          initVal["pi_sr_no"] = res.count;
          initVal["pi_no"] = res.serialNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => { });
  };

  handleSearch = (vi) => {
    console.log("vi--------------------------->", vi);
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        (v.invoice_no != null &&
          v.invoice_no.toLowerCase().includes(vi.toLowerCase())) ||
        (v.sundry_creditor_name != null &&
          v.sundry_creditor_name.toLowerCase().includes(vi.toLowerCase())) ||
        (v.tax_amt != null && v.tax_amt.toString().includes(vi)) ||
        (v.taxable_amt != null && v.taxable_amt.toString().includes(vi)) ||
        (v.total_amount != null && v.total_amount.toString().includes(vi)) ||
        moment(v.invoice_date).format("DD-MM-YYYY").includes(vi) ||
        (v.narration != null && v.narration.toLowerCase().includes(vi))
    );
    this.setState({
      purchaseInvoiceLst: orgData_F.length > 0 ? orgData_F : [],
    });
  };
  getLastPurchaseOrderSerialNo = () => {
    getLastPOInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { initVal } = this.state;
          initVal["po_sr_no"] = res.count;
          initVal["po_no"] = res.serialNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => { });
  };

  getLastPurchaseChallanSerialNo = () => {
    getLastPOChallanInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { challanInitVal } = this.state;
          challanInitVal["pc_sr_no"] = res.count;
          challanInitVal["pc_no"] = res.serialNo;
          this.setState({
            opendiv: false,
            ConvertIntoInvoice: false,
            ConvertIntoChallan: true,
            challanInitVal: challanInitVal,
          });
        }
      })
      .catch((error) => { });
  };

  getLastPurchaseInvoiceSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { invoiceInitVal } = this.state;
          invoiceInitVal["pi_sr_no"] = res.count;
          invoiceInitVal["pi_no"] = res.serialNo;
          this.setState({
            opendiv: false,
            ConvertIntoChallan: false,
            ConvertIntoInvoice: true,
            invoiceInitVal: invoiceInitVal,
          });
        }
      })
      .catch((error) => { });
  };

  lstSundryCreditors = () => {
    getSundryCreditors()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.name,
              value: v.id,
              code: v.ledger_code,
              state: stateCode,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: v.id,
              name: v.name,
              state: stateCode,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
          });
        }
      })
      .catch((error) => { });
  };
  deletepurchase = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_purchase_order(formData)
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
          // this.initRow();
          this.componentDidMount();
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 2000,
          });
          // resetForm();
          // this.initRow();
          //this.componentDidMount();
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  handlePurchaseBillsSelection = (id, sundry_creditor_id, status) => {
    let {
      selectetPOBills,
      purchaseInvoiceLst,
      selectetSCIds,
      supplierCodeLst,
      supplierNameLst,
      invoiceInitVal,
      challanInitVal,
    } = this.state;
    let sourcein = this.state.source;
    if (status == true) {
      if (selectetPOBills.length == 0) {
        if (!selectetPOBills.includes(id)) {
          selectetPOBills = [...selectetPOBills, id];
        }

        invoiceInitVal["supplierCodeId"] = getSelectValue(
          supplierCodeLst,
          sundry_creditor_id + ""
        );
        invoiceInitVal["supplierNameId"] = getSelectValue(
          supplierNameLst,
          sundry_creditor_id + ""
        );
        challanInitVal["supplierCodeId"] = getSelectValue(
          supplierCodeLst,
          sundry_creditor_id + ""
        );
        challanInitVal["supplierNameId"] = getSelectValue(
          supplierNameLst,
          sundry_creditor_id + ""
        );
        this.setState({ selectetSCIds: sundry_creditor_id });
      } else {
        if (selectetSCIds == sundry_creditor_id) {
          if (!selectetPOBills.includes(id)) {
            selectetPOBills = [...selectetPOBills, id];
          }
        } else {
          ShowNotification("Error", "You have selected different supplier");
        }
      }
    } else {
      if (selectetSCIds == sundry_creditor_id) {
        if (!selectetPOBills.includes(id)) {
          selectetPOBills = [...selectetPOBills, id];
        } else {
          selectetPOBills = selectetPOBills.filter((v) => v != id);
        }
      }
    }

    this.setState(
      {
        isAllChecked:
          selectetPOBills.length == 0
            ? false
            : selectetPOBills.length === purchaseInvoiceLst.length
              ? true
              : false,
        selectetPOBills: selectetPOBills,
        invoiceInitVal: invoiceInitVal,
        challanInitVal: challanInitVal,
        source: sourcein,
      },
      () => {
        if (this.state.selectetPOBills.length == 0) {
          invoiceInitVal["supplierCodeId"] = "";
          invoiceInitVal["supplierNameId"] = "";
          challanInitVal["supplierCodeId"] = "";
          challanInitVal["supplierNameId"] = "";
          this.setState({
            invoiceInitVal: invoiceInitVal,
            challanInitVal: challanInitVal,
            selectetSCIds: "",
          });
        }
      }
    );
  };

  handlePurchaseBillsSelectionAll = (status) => {
    let { purchaseInvoiceLst, selectetSCIds, invoiceInitVal, challanInitVal } =
      this.state;
    let sourcein = this.state.source;
    let lstSelected = [];
    let selectetsundryId = "";
    if (status == true) {
      purchaseInvoiceLst.map((v) => {
        if (
          v.sundry_creditor_id == selectetSCIds &&
          v.purchase_order_status == "opened"
        ) {
          lstSelected.push(v.id);
        }
      });
      selectetsundryId = selectetSCIds;
    } else {
      invoiceInitVal["supplierCodeId"] = "";
      invoiceInitVal["supplierNameId"] = "";
      challanInitVal["supplierCodeId"] = "";
      challanInitVal["supplierNameId"] = "";
    }

    this.setState(
      {
        isAllChecked: status,
        selectetPOBills: lstSelected,
        selectetSCIds: selectetsundryId,
        invoiceInitVal: invoiceInitVal,
        challanInitVal: challanInitVal,
        source: sourcein,
      },
      () => {
        if (this.state.selectetPOBills.length == 0) {
          this.setState({ selectetSCIds: "" });
        }
      }
    );
  };

  setInitVal = () => {
    this.setState({
      show: false,
      showDiv: false,
      opendiv: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      selectetSCIds: "",
      selectetPOBills: [],
      ConvertIntoChallan: false,
      selectedOrderToInvoice: [],
      isAllChecked: false,
      convshow: false,
      convshowInvoice: false,
      ConvertIntoInvoice: false,
      initVal: {
        po_sr_no: 1,
        po_no: 1,
        po_transaction_dt: moment().format("YYYY-MM-DD"),
        po_invoice_dt: new Date(),
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
      invoiceInitVal: {
        pi_sr_no: 1,
        pi_no: 1,
        pi_transaction_dt: moment().format("YYYY-MM-DD"),
        pi_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
      challanInitVal: {
        pc_sr_no: 1,
        pc_no: 1,
        pc_transaction_dt: moment().format("YYYY-MM-DD"),
        pc_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
      },
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getLastPurchaseOrderSerialNo();
      this.lstPurchaseAccounts();
      this.lstSundryCreditors();
      this.lstPOInvoice();
      const { prop_data } = this.props.block;

      //   let res = prop_data;

      //   if (res != "") {
      //     this.setState(
      //       {
      //         purchaseInvoiceLst: res.data,
      //         orgData: res.data,
      //         source: res.source,
      //       },
      //       () => {
      //         this.purOrderRef.current.setFieldValue("search", "");
      //       }
      //     );
      //   } else {
      //     this.lstPOInvoice();
      //   }
    }
  }

  pageReload = () => {
    this.setInitVal();
    this.componentDidMount();
  };
  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let { ledgerModalStateChange, transactionType, invoice_data, ledgerData } =
      this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));

        // console.warn("da->>>>>>>>>>>>>>>>>>down", val);

        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
        let index = JSON.parse(cuurentProduct.getAttribute("tabIndex"));
        if (
          isActionExist("purchase-order", "edit", this.props.userPermissions)
        ) {
          if (selectedLedger.purchase_order_status == "opened") {
            eventBus.dispatch("page_change", {
              from: "tranx_purchase_order_list",
              to: "tranx_purchase_order_edit",
              // prop_data: selectedLedger,
              prop_data: { prop_data: selectedLedger, rowId: index },
              isNewTab: false,
            });
          } else {
            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: "Order is Closed!",
              is_button_show: true,
            });
          }
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "Permission is denied!",
            is_button_show: true,
          });
        }

        // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
      }
    }
  }

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "list");
    reqData.append("source", "purchase_order");
    getPurchaseOrderBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        console.log("responseData print ---->>>", responseData);
        eventBus.dispatch("callprint", {
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.product_details,
        });

        eventBus.dispatch("page_change", {
          from: "tranx_purchase_order_create",
          to: "tranx_purchase_order_list",
          isNewTab: false,
        });
      }
    });
  };
  handleSort = (columnName) => {
    const { sortedColumn, sortOrder } = this.state;

    if (columnName === sortedColumn) {
      // Toggle sorting order
      this.setState(
        (prevState) => ({
          sortOrder: prevState.sortOrder === "asc" ? "desc" : "asc",
        }),
        () => {
          // Sort the data when the state has been updated
          this.sortData();
        }
      );
    } else {
      // Sort by a new column
      this.setState(
        {
          sortedColumn: columnName,
          sortOrder: "asc",
        },
        () => {
          // Sort the data when the state has been updated
          this.sortData();
        }
      );
    }
  };
  sortData = () => {
    let { purchaseInvoiceLst, sortedColumn, sortOrder } = this.state;

    let sortedData = [...purchaseInvoiceLst];
    if (sortOrder == "asc") {
      sortedData.sort((a, b) => (a[sortedColumn] > b[sortedColumn] ? 1 : -1));
    } else {
      sortedData.sort((a, b) => (a[sortedColumn] < b[sortedColumn] ? 1 : -1));
    }

    this.setState({
      purchaseInvoiceLst: sortedData,
    });
  };

  handleArrowClick = () => {
    this.setState((prevState) => {
      return {
        arrowToggle: !prevState.arrowToggle,
      };
    });
  };

  render() {
    const {
      arrowToggle,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      showloader,
      initVal,
      isAllChecked,
      opendiv,
      selectetPOBills,
      ConvertIntoChallan,
      ConvertIntoInvoice,
      challanInitVal,
      invoiceInitVal,
      selectetSCIds,
      currentPage,
      totalRows,
      pages,
    } = this.state;

    return (
      <>
        <Collapse in={ConvertIntoInvoice}>
          <div id="example-collapse-text" className="common-form-style p-2">
            <div className="main-div ">
              <h4 className="form-header">Convert Into Invoice</h4>
              <Formik
                innerRef={this.po_invoice_ref}
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={invoiceInitVal}
                validationSchema={Yup.object().shape({
                  pi_sr_no: Yup.string()
                    .trim()
                    .required("Invoice serial no is required"),
                  pi_no: Yup.string()
                    .trim()
                    .required("Inovoice no is required"),
                  pi_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("select sales account"),
                  pi_invoice_dt: Yup.string().required("Bill dt is required"),
                  supplierCodeId: Yup.object().required("select client name"),
                  supplierNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  values["selectedCounterSales"] = selectetPOBills;
                  eventBus.dispatch("page_change", {
                    from: "tranx_purchase_order_list",
                    to: "tranx_purchase_order_to_invoice",
                    prop_data: values,
                    isNewTab: false,
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
                    className="form-style"
                  >
                    <Row>
                      <Col md="1" className="p-0 ps-3">
                        <Form.Group>
                          <Form.Label>
                            Invoice Sr. #.
                            <span className="pt-1 pl-1 req_validation">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="pi_sr_no"
                            id="pi_sr_no"
                            onChange={handleChange}
                            value={values.pi_sr_no}
                            isValid={touched.pi_sr_no && !errors.pi_sr_no}
                            isInvalid={!!errors.pi_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pi_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Trans Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            readOnly={true}
                            type="date"
                            name="pi_transaction_dt"
                            id="pi_transaction_dt"
                            onChange={handleChange}
                            value={values.pi_transaction_dt}
                            isValid={
                              touched.pi_transaction_dt &&
                              !errors.pi_transaction_dt
                            }
                            isInvalid={!!errors.pi_transaction_dt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.pi_transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Invoice No.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            readOnly={true}
                            type="text"
                            placeholder="pi_no"
                            name="pi_no"
                            id="pi_no"
                            onChange={handleChange}
                            value={values.pi_no}
                            isValid={touched.pi_no && !errors.pi_no}
                            isInvalid={!!errors.pi_no}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.pi_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1" className="p-0 ps-3">
                        <Form.Group>
                          <Form.Label>
                            Invoice Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <MyDatePicker
                            name="pi_invoice_dt"
                            placeholderText="DD/MM/YYYY"
                            id="pi_invoice_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pi_invoice_dt", date);
                            }}
                            selected={values.pi_invoice_dt}
                            minDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.pi_invoice_dt}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group className="">
                          <Form.Label>
                            Purchase A/c{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStyles}
                            isClearable
                            options={purchaseAccLst}
                            borderRadius="0px"
                            colors="#729"
                            placeholder="Select"
                            name="purchaseId"
                            onChange={(v) => {
                              setFieldValue("purchaseId", v);
                            }}
                            value={values.purchaseId}
                          />

                          <span className="text-danger errormsg">
                            {errors.purchaseId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group className="">
                          <Form.Label>
                            Supplier Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            isDisabled={true}
                            className="selectTo"
                            styles={customStylesWhite}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierNameId"
                            onChange={(v) => {
                              setFieldValue("supplierNameId", v);
                              if (v != null) {
                                setFieldValue(
                                  "supplierCodeId",
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                              } else {
                                setFieldValue("supplierCodeId", "");
                              }
                            }}
                            value={values.supplierNameId}
                          />

                          <span className="text-danger">
                            {errors.supplierNameId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="1" className="p-0">
                        <Form.Group className="">
                          <Form.Label>
                            Supplier Code{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <Select
                            isDisabled={true}
                            className="selectTo"
                            styles={customStylesWhite}
                            isClearable
                            options={supplierCodeLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierCodeId"
                            onChange={(v) => {
                              setFieldValue("supplierCodeId", v);
                              if (v != null) {
                                setFieldValue(
                                  "supplierNameId",
                                  getSelectValue(supplierNameLst, v.value)
                                );
                              } else {
                                setFieldValue("supplierNameId", "");
                              }
                            }}
                            value={values.supplierCodeId}
                          />

                          <span className="text-danger">
                            {errors.supplierCodeId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="3" className="mt-4 btn_align">
                        <Button className="successbtn-style" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            this.po_invoice_ref.current.resetForm();
                            this.setState({
                              ConvertIntoInvoice: !ConvertIntoInvoice,
                            });
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
          </div>
        </Collapse>

        <div className="ledger_form_style">
          <div className="ledger-group-style">
            <div className="cust_table">
              {!opendiv && !ConvertIntoChallan && !ConvertIntoInvoice && (
                <Row className=" ">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    innerRef={this.purOrderRef}
                    initialValues={{ search: "" }}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                      // groupName: Yup.string().trim().required("Group name is required"),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => { }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      setFieldValue,
                      resetForm,
                    }) => (
                      // {!opendiv && (
                      <Form>
                        <Row onKeyDown={(e) => {
                          if (e.keyCode === 40) {
                            e.preventDefault();
                            document.getElementById("TPOLTr_0")?.focus();
                          }
                        }}>
                          <Col md="3">
                            <div className="">
                              {/* <Form>
                              <Form.Group
                                className="search_btn_style mt-1"
                                controlId="formBasicSearch"
                              >
                                <Form.Control
                                  type="text"
                                  placeholder="Search"
                                  className="main_search"
                                  id="search"
                                  name="search"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    console.log({ v });
                                    setFieldValue("search", v);
                                    this.handleSearch(v);
                                  }}
                                  value={values.search}
                                />
                                <Button type="submit">x</Button>
                              </Form.Group>
                            </Form> */}
                              <InputGroup className="mb-2 mdl-text">
                                <Form.Control
                                  placeholder="Search"
                                  // id="SearchTPOL" @mayur id commented
                                  // aria-label="Search"
                                  // aria-describedby="basic-addon1"
                                  // style={{ borderRight: "none" }}
                                  className="mdl-text-box"
                                  autoFocus={true}
                                  onChange={(e) => {
                                    this.handleSearch(e.target.value);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      document.getElementById("d_start_datePOL")?.focus();
                                    }
                                  }}
                                />
                                <InputGroup.Text
                                  className="int-grp"
                                  id="basic-addon1"
                                  style={{ border: "1px solid #fff" }}
                                >
                                  <img
                                    className="srch_box"
                                    src={search}
                                    alt=""
                                  />
                                </InputGroup.Text>
                              </InputGroup>
                            </div>
                          </Col>

                          <Col md="6">
                            <Row>
                              <Col lg={1} className="ps-0">
                                <Form.Label>From Date</Form.Label>
                              </Col>
                              <Col md="3">
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  className="form-control"
                                  name="d_start_date"
                                  id="d_start_datePOL"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.d_start_date}
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
                                        "warn:: isValid",
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
                                          "d_start_date",
                                          e.target.value
                                        );
                                        this.setState(
                                          { startDate: e.target.value },
                                          () => {
                                            this.lstPOInvoice();
                                          }
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Invalid Start date",
                                          is_button_show: true,
                                        });
                                        this.invoiceDateRef.current.focus();
                                        setFieldValue("d_start_date", "");
                                        this.setState(
                                          { startDate: e.target.value },
                                          () => {
                                            this.lstPOInvoice();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_start_date", "");
                                      this.setState(
                                        { startDate: e.target.value },
                                        () => {
                                          this.lstPOInvoice();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      if (
                                        e.target.value != null &&
                                        e.target.value != "" &&
                                        e.target.value != "__/__/____" &&
                                        !e.target.value.includes("_")
                                      ) {
                                        console.warn(
                                          "warn:: isValid",
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
                                            "d_start_date",
                                            e.target.value
                                          );
                                          this.setState(
                                            { startDate: e.target.value },
                                            () => {
                                              this.lstPOInvoice();
                                            }
                                          );
                                          document.getElementById("d_end_datePOL")?.focus();
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Invalid Start date",
                                            is_button_show: true,
                                          });
                                          this.invoiceDateRef.current.focus();
                                          setFieldValue("d_start_date", "");
                                          this.setState(
                                            { startDate: e.target.value },
                                            () => {
                                              this.lstPOInvoice();
                                            }
                                          );
                                        }
                                      } else {
                                        setFieldValue("d_start_date", "");
                                        this.setState(
                                          { startDate: e.target.value },
                                          () => {
                                            this.lstPOInvoice();
                                          }
                                        );
                                        document
                                          .getElementById("d_end_datePOL")
                                          .focus();
                                      }
                                    }
                                  }}
                                />
                              </Col>
                              <Col lg={1}>
                                <Form.Label>To Date</Form.Label>
                              </Col>
                              <Col md="3">
                                <MyTextDatePicker
                                  innerRef={(input) => {
                                    this.invoiceDateRef.current = input;
                                  }}
                                  className="form-control"
                                  name="d_end_date"
                                  id="d_end_datePOL"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.d_end_date}
                                  onChange={handleChange}
                                  onFocus={() => {
                                    this.setState({ hideDp: true });
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
                                      console.warn(
                                        "warn:: isValid",
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
                                          "d_end_date",
                                          e.target.value
                                        );
                                        // this.getlstLedgerTranxDetailsReportsPageLoad(
                                        //   values
                                        // );
                                        this.setState(
                                          { endDate: e.target.value },
                                          () => {
                                            this.lstPOInvoice();
                                          }
                                        );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Invalid End date",
                                          is_button_show: true,
                                        });
                                        this.invoiceDateRef.current.focus();
                                        setFieldValue("d_end_date", "");
                                        this.setState(
                                          { endDate: e.target.value },
                                          () => {
                                            this.lstPOInvoice();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_end_date", "");
                                      // this.lstPOInvoice();
                                      this.setState(
                                        { endDate: e.target.value },
                                        () => {
                                          this.lstPOInvoice();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      e.preventDefault();
                                      if (
                                        e.target.value != null &&
                                        e.target.value != "" &&
                                        e.target.value != "__/__/____" &&
                                        !e.target.value.includes("_")
                                      ) {
                                        console.warn(
                                          "warn:: isValid",
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
                                            "d_end_date",
                                            e.target.value
                                          );
                                          // this.getlstLedgerTranxDetailsReportsPageLoad(
                                          //   values
                                          // );
                                          this.setState(
                                            { endDate: e.target.value },
                                            () => {
                                              this.lstPOInvoice();
                                            }
                                          );
                                          document
                                            .getElementById("TPOL_create_btn")
                                            .focus();
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Invalid End date",
                                            is_button_show: true,
                                          });
                                          this.invoiceDateRef.current.focus();
                                          setFieldValue("d_end_date", "");
                                          this.setState(
                                            { endDate: e.target.value },
                                            () => {
                                              this.lstPOInvoice();
                                            }
                                          );
                                          e.preventDefault();
                                        }
                                      } else {
                                        setFieldValue("d_end_date", "");
                                        // this.lstPOInvoice();
                                        this.setState(
                                          { endDate: e.target.value },
                                          () => {
                                            this.lstPOInvoice();
                                          }
                                        );
                                        document
                                          .getElementById("TPOL_create_btn")
                                          .focus();
                                      }
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>

                          <Col md="3" className=" text-end">
                            {selectetPOBills.length == 0 && !opendiv && (
                              <>
                                {/* <Button
                                className="ml-2 btn-refresh"
                                type="button"
                                onClick={() => {
                                  this.pageReload();
                                }}
                              >
                                <img src={refresh} alt="icon" />
                              </Button> */}
                                <Button
                                  className="create-btn mr-2"
                                  id="TPOL_create_btn"
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   this.setState({ opendiv: !opendiv });
                                  //   this.getLastPurchaseOrderSerialNo();
                                  // }}
                                  onClick={(e) => {
                                    e.preventDefault();

                                    if (
                                      isActionExist(
                                        "purchase-order",
                                        "create",
                                        this.props.userPermissions
                                      )
                                    ) {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_purchase_order_list",
                                        to: "tranx_purchase_order_create",
                                        prop_data: values,
                                        isNewTab: false,
                                      });
                                      this.getLastPurchaseOrderSerialNo();
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
                                  aria-controls="example-collapse-text"
                                  aria-expanded={opendiv}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 32) {
                                      e.preventDefault();
                                    } else if (e.keyCode === 13) {
                                      if (
                                        isActionExist(
                                          "purchase-order",
                                          "create",
                                          this.props.userPermissions
                                        )
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "tranx_purchase_order_list",
                                          to: "tranx_purchase_order_create",
                                          prop_data: values,
                                          isNewTab: false,
                                        });
                                        this.getLastPurchaseOrderSerialNo();
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Permission is denied!",
                                          is_button_show: true,
                                        });
                                      }
                                    }
                                  }}
                                >
                                  Create
                                  {/* <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  class="bi bi-plus-square-dotted svg-style"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                </svg> */}
                                </Button>
                              </>
                            )}
                            {this.state.source == "" ? (
                              <>
                                {selectetPOBills.length > 0 && (
                                  <Button
                                    className="create-btn mr-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      eventBus.dispatch("page_change", {
                                        to: "tranx_purchase_order_to_challan",
                                        prop_data: { selectetPOBills },
                                      });

                                      this.getLastPurchaseChallanSerialNo();
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 32) {
                                        e.preventDefault();
                                      } else if (e.keyCode === 13) {
                                        eventBus.dispatch("page_change", {
                                          to: "tranx_purchase_order_to_challan",
                                          prop_data: { selectetPOBills },
                                        });

                                        this.getLastPurchaseChallanSerialNo();
                                      }
                                    }}
                                    aria-controls="example-collapse-text"
                                  //   aria-expanded={ConvertIntoChallan}
                                  >
                                    To Challan
                                    {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                class="bi bi-plus-square-dotted svg-style"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                              </svg> */}
                                  </Button>
                                )}

                                {selectetPOBills.length > 0 && (
                                  <Button
                                    className="create-btn mr-2 ms-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      eventBus.dispatch("page_change", {
                                        to: "tranx_purchase_order_to_invoice",
                                        prop_data: { selectetPOBills },
                                      });

                                      this.getLastPurchaseChallanSerialNo();
                                    }}
                                    aria-controls="example-collapse-text"
                                    // aria-expanded={ConvertIntoInvoice}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 32) {
                                        e.preventDefault();
                                      } else if (e.keyCode === 13) {
                                        eventBus.dispatch("page_change", {
                                          to: "tranx_purchase_order_to_invoice",
                                          prop_data: { selectetPOBills },
                                        });

                                        this.getLastPurchaseChallanSerialNo();
                                      }
                                    }}
                                  >
                                    To Invoice
                                    {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                class="bi bi-plus-square-dotted svg-style"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                              </svg> */}
                                  </Button>
                                )}
                              </>
                            ) : (
                              <>
                                {this.state.source == "challan" ? (
                                  <>
                                    {selectetPOBills.length > 0 && (
                                      <Button
                                        className="create-btn mr-2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          eventBus.dispatch("page_change", {
                                            to: "tranx_purchase_order_to_challan",
                                            prop_data: { selectetPOBills },
                                          });

                                          this.getLastPurchaseChallanSerialNo();
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.keyCode === 32) {
                                            e.preventDefault();
                                          } else if (e.keyCode === 13) {
                                            eventBus.dispatch("page_change", {
                                              to: "tranx_purchase_order_to_challan",
                                              prop_data: { selectetPOBills },
                                            });

                                            this.getLastPurchaseChallanSerialNo();
                                          }
                                        }}
                                        aria-controls="example-collapse-text"
                                      //   aria-expanded={ConvertIntoChallan}
                                      >
                                        To Challan
                                        {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                class="bi bi-plus-square-dotted svg-style"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                              </svg> */}
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {selectetPOBills.length > 0 && (
                                      <Button
                                        className="create-btn mr-2 ms-2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          eventBus.dispatch("page_change", {
                                            to: "tranx_purchase_order_to_invoice",
                                            prop_data: { selectetPOBills },
                                          });

                                          this.getLastPurchaseChallanSerialNo();
                                        }}
                                        aria-controls="example-collapse-text"
                                        // aria-expanded={ConvertIntoInvoice}
                                        onKeyDown={(e) => {
                                          if (e.keyCode === 32) {
                                            e.preventDefault();
                                          } else if (e.keyCode === 13) {
                                            eventBus.dispatch("page_change", {
                                              to: "tranx_purchase_order_to_invoice",
                                              prop_data: { selectetPOBills },
                                            });

                                            this.getLastPurchaseChallanSerialNo();
                                          }
                                        }}
                                      >
                                        To Invoice
                                        {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                class="bi bi-plus-square-dotted svg-style"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                              </svg> */}
                                      </Button>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Row>
              )}

              <div className="Tranx-tbl-list-style">
                {isActionExist(
                  "purchase-order",
                  "list",
                  this.props.userPermissions
                ) && (
                    <Table size="sm" className="tbl-font">
                      <thead>
                        <tr>
                          <th
                            style={{ width: "4%" }}
                            // className="counter-s-checkbox pl-0"
                            className={`${selectetSCIds != ""
                              ? "counter-s-checkbox pl-0 py-0"
                              : "counter-s-checkbox pl-0"
                              }`}
                          >
                            {selectetSCIds != "" ? (
                              <Form.Group
                                controlId="formBasicCheckbox"
                                className=""
                              >
                                <Form.Check
                                  type="checkbox"
                                  checked={isAllChecked === true ? true : false}
                                  onChange={(e) => {
                                    this.handlePurchaseBillsSelectionAll(
                                      e.target.checked
                                    );
                                  }}
                                  label=" Select"
                                />
                              </Form.Group>
                            ) : (
                              " Select"
                            )}
                          </th>

                          <th>Order No.</th>

                          <th>
                            <div className="d-flex">
                              Order Date
                              <div
                                className="ms-2"
                                onClick={() => this.handleSort("invoice_date")}
                              >
                                {this.state.sortedColumn === "invoice_date" &&
                                  this.state.sortOrder === "asc" ? (
                                  // this.state.arrowToggle ? (
                                  <FontAwesomeIcon
                                    icon={faArrowUp}
                                    className="plus-color"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faArrowDown}
                                    className="plus-color"
                                  />
                                )}
                              </div>
                            </div>
                          </th>
                          {/* <th>Purchase Account</th> */}
                          <th style={{ width: "20%" }}>
                            <div className="d-flex">
                              Supplier Name
                              <div
                                className="ms-2"
                                onClick={() =>
                                  this.handleSort("sundry_creditor_name")
                                }
                              >
                                {this.state.sortedColumn ===
                                  "sundry_creditor_name" &&
                                  this.state.sortOrder === "asc" ? (
                                  // this.state.arrowToggle ? (
                                  <FontAwesomeIcon
                                    icon={faArrowUp}
                                    className="plus-color"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faArrowDown}
                                    className="plus-color"
                                  />
                                )}
                              </div>
                            </div>
                          </th>

                          <th style={{ width: "20%" }}>Narration</th>
                          <th style={{ textAlign: "end" }}>Taxable</th>
                          <th style={{ textAlign: "end" }}>Tax</th>
                          <th>
                            {" "}
                            <div
                              className="d-flex"
                              style={{ justifyContent: "end" }}
                            >
                              Bill Amount
                              <div
                                className="ms-2"
                                onClick={() => this.handleSort("total_amount")}
                              >
                                {this.state.sortedColumn === "total_amount" &&
                                  this.state.sortOrder === "asc" ? (
                                  // this.state.arrowToggle ? (
                                  <FontAwesomeIcon
                                    icon={faArrowUp}
                                    className="plus-color"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faArrowDown}
                                    className="plus-color"
                                  />
                                )}
                              </div>
                            </div>
                          </th>
                          <th style={{ textAlign: "center" }}>Tranx Status</th>
                          <th style={{ width: "4%" }}>Print</th>
                          <th style={{ width: "8%" }}>Action</th>
                        </tr>
                        {/* </div> */}
                      </thead>
                      {/* {JSON.stringify(purchaseInvoiceLst, undefined)} */}
                      <tbody
                        style={{ borderTop: "2px solid transparent" }}
                        className="prouctTableTr tabletrcursor"
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (e.shiftKey && e.keyCode == 9) {
                            document.getElementById("TPOL_create_btn").focus();
                          }
                          if (e.keyCode != 9) {
                            this.handleTableRow(e);
                          }
                        }}
                      >
                        {purchaseInvoiceLst.length > 0 ? (
                          purchaseInvoiceLst.map((v, i) => {
                            return (
                              <tr
                                value={JSON.stringify(v)}
                                id={`TPOLTr_` + i}
                                // prId={v.id}
                                tabIndex={i}
                                // onDoubleClick={(e) => {
                                //   e.preventDefault();

                                //   eventBus.dispatch("page_change", {
                                //     from: "tranx_purchase_order_list",
                                //     to: "tranx_purchase_order_edit",
                                //     prop_data: v,
                                //     isNewTab: false,
                                //   });
                                // }}
                                onDoubleClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    isActionExist(
                                      "purchase-order",
                                      "edit",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    if (v.purchase_order_status == "opened") {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_purchase_order_list",
                                        to: "tranx_purchase_order_edit",
                                        // prop_data: v,
                                        prop_data: { prop_data: v, rowId: i },
                                        isNewTab: false,
                                      });
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Order is Closed!",
                                        is_button_show: true,
                                      });
                                    }
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
                                <td style={{ width: "4%" }}>
                                  <Form.Group
                                    controlId="formBasicCheckbox1"
                                    className="ml-1 pmt-allbtn"
                                  >
                                    <Form.Check
                                      disabled={
                                        v.purchase_order_status == "closed"
                                      }
                                      type="checkbox"
                                      checked={selectetPOBills.includes(
                                        parseInt(v.id)
                                      )}
                                      onChange={(e) => {
                                        this.handlePurchaseBillsSelection(
                                          v.id,

                                          v.sundry_creditor_id,
                                          e.target.checked
                                        );
                                      }}
                                    // label={i + 1}
                                    />
                                  </Form.Group>
                                </td>

                                <td>{v.invoice_no}</td>

                                <td>
                                  {moment(v.invoice_date).format("DD-MM-YYYY")}
                                </td>

                                {/* <td>{v.purchase_account_name}</td> */}
                                <td style={{ width: "20%" }}>
                                  {v.sundry_creditor_name}
                                </td>
                                {/* <td className="btn_align right_col">
                            {v.total_amount}
                          </td> */}

                                <td style={{ width: "20%" }}>
                                  <p>{v.narration}</p>
                                </td>
                                <td className="text-end">
                                  {/* {parseFloat(v.taxable_amt).toFixed(2)} */}
                                  {INRformat.format(v.taxable_amt)}
                                </td>
                                <td className="text-end">
                                  {/* {parseFloat(v.tax_amt).toFixed(2)} */}
                                  {INRformat.format(v.totaligst)}
                                </td>
                                <td className="text-end">
                                  {/* {parseFloat(v.total_amount).toFixed(2)} */}
                                  {INRformat.format(v.total_amount)}
                                </td>

                                <td style={{ textAlign: "center" }}>
                                  {/* {v.sales_order_status} */}
                                  <Badge
                                    bg={`${v.purchase_order_status == "opened"
                                      ? "success"
                                      : v.purchase_order_status == "closed"
                                        ? "danger"
                                        : null
                                      }`}
                                  >
                                    {v.purchase_order_status == "opened"
                                      ? "  Opened"
                                      : v.purchase_order_status == "closed"
                                        ? "Closed"
                                        : null}
                                  </Badge>
                                </td>
                                <td style={{ width: "4%" }}>
                                  <img
                                    src={print3}
                                    className="delete-img"
                                    title="Print"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      this.getInvoiceBillsLstPrint(v.id);
                                    }}
                                  />
                                </td>
                                <td style={{ width: "8%" }}>
                                  <img
                                    src={Edit}
                                    className="delete-img"
                                    title="Edit"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      if (
                                        isActionExist(
                                          "purchase-order",
                                          "edit",
                                          this.props.userPermissions
                                        )
                                      ) {
                                        if (v.purchase_order_status == "opened") {
                                          eventBus.dispatch("page_change", {
                                            from: "tranx_purchase_order_list",
                                            to: "tranx_purchase_order_edit",
                                            // prop_data: v,
                                            prop_data: { prop_data: v, rowId: i },
                                            isNewTab: false,
                                          });
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Order is Closed!",
                                            is_button_show: true,
                                          });
                                        }
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
                                    src={delete_icon}
                                    className="delete-img"
                                    title="Delete"
                                    onClick={(e) => {
                                      // this.deletepurchase(v.id);
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
                                            this.deletepurchase(v.id);
                                          },
                                          handleFailFn: () => { },
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
                          })
                        ) : (
                          <tr>
                            <td colSpan={11} className="text-center">
                              No Data Found
                            </td>
                            {/* {showloader == true && LoadingComponent(showloader)} */}
                          </tr>
                        )}
                      </tbody>
                      {/* <thead className="tbl-footer mb-2">
                        <tr>
                          <th
                            colSpan={11}
                            className=""
                            style={{ borderTop: " 2px solid transparent" }}
                          >
                            {Array.from(Array(1), (v) => {
                              return (
                                <tr>
                                  {/* <th>&nbsp;</th>
                                  <th>Total Purchase Order List :</th>
                                  <th>{purchaseInvoiceLst.length}</th>
                                </tr>
                              );
                            })}
                          </th>
                        </tr>
                      </thead> */}
                    </Table>
                  )}
              </div>
              <Row className="style-footr">
                <Col md="10" className="my-auto">
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
                <Col lg={2} className="text-end">
                  <Row>
                    <Col className="my-auto">
                      {Array.from(Array(1), (v) => {
                        return (
                          <>
                            <span>Orders:</span>
                            <span>{totalRows}</span>
                          </>
                        );
                      })}
                    </Col>
                    {/* <Col md="4" className="text-center">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.goToPreviousPage();
                    }}
                    disabled={currentPage <= 1}
                    className="nextbtn"
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="plus-color"
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    &nbsp;&nbsp;Prev
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.goToNextPage();
                    }}
                    disabled={currentPage === pages ? true : false}
                    className="nextbtn"
                  >
                    Next&nbsp;&nbsp;{" "}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="plus-color"
                      style={{ verticalAlign: "middle" }}
                    />
                  </Button>
                </Col> */}
                    {/* <Col lg="6" className="my-auto">
                      Page No.<span>{this.state.currentPage} Out of 10</span>
                    </Col> */}
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = ({ userPermissions }) => {
  return { userPermissions };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(TranxPurchaseOrderList);
