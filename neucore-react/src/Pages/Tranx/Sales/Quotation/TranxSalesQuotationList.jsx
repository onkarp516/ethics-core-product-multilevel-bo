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
  Badge,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import moment from "moment";
import delete_icon from "@/assets/images/delete_icon3.png";
import print3 from "@/assets/images/print3.png";
import TableEdit from "@/assets/images/1x/editnew.png";
import {
  faArrowDown,
  faArrowUp,
  faChevronRight,
  faChevronLeft,
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

import Select from "react-select";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  getSalesAccounts,
  getSundryDebtors,
  authenticationService,
  getSalesInvoiceList,
  getLastSalesQuotationNo,
  getAllSalesOrdersURL,
  getSalesQuotationList,
  getLastSalesOrder,
  getLastSalesChallanNo,
  getLastSalesInvoiceNo,
  delete_sales_quotation,
  getSaleQuotationList,
  AllListSalesQuotations,
  getSalesQuotationBill,
} from "@/services/api_functions";
import axios from "axios";
import {
  getSelectValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  eventBus,
  customStylesWhite,
  MyNotifications,
  isActionExist,
  LoadingComponent,
  INRformat,
  MyTextDatePicker,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
class TranxSalesQuotationList extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.salesQutRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      source: "",
      show: false,
      arrowToggle: true,
      opendiv: false,
      ConvertIntoOrder: false,
      ConvertIntoChallan: false,
      ConvertIntoInvoice: false,
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      orgData: [],
      orgData1: [],
      isAllChecked: false,
      convshow: false,
      convshowChallan: false,
      convshowInvoice: false,
      selectedCounterSalesBills: [],
      selectedQuoBills: [],
      salesInvoiceLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      selectedSDids: "",
      initVal: {
        sales_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        bill_no: "",
        bill_dt: "",
        order_date: "",
        challan_date: "",
        invoice_date: "",
        clientCodeId: "",
        clientNameId: "",
        invoice_dt: "",
      },
      OrderinitVal: {
        so_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        sobill_no: "",
        bill_dt: "",
        order_date: "",
        clientCodeId: "",
        clientNameId: "",
        invoice_dt: "",
      },
      ChallaninitVal: {
        sc_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        scbill_no: "",

        clientCodeId: "",
        clientNameId: "",

        invoice_dt: "",
      },
      InvoiceinitVal: {
        si_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        sibill_no: "",
        clientNameId: "",

        clientCodeId: "",
        invoice_dt: "",
      },
    };
  }

  setLastSalesQuotationSerialNo = () => {
    getLastSalesQuotationNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          initVal["sales_sr_no"] = res.count;
          initVal["bill_no"] = res.serialNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setLastSalesOrderSerialNo = () => {
    getLastSalesOrder()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { OrderinitVal } = this.state;
          OrderinitVal["so_sr_no"] = res.count;
          OrderinitVal["sobill_no"] = res.serialNo;
          this.setState({
            OrderinitVal: OrderinitVal,
            ConvertIntoOrder: true,
            ConvertIntoInvoice: false,
            ConvertIntoChallan: false,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setLastSalesChallanSerialNo = () => {
    getLastSalesChallanNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { ChallaninitVal } = this.state;
          ChallaninitVal["sc_sr_no"] = res.count;
          ChallaninitVal["scbill_no"] = res.serialNo;
          this.setState({
            ChallaninitVal: ChallaninitVal,
            ConvertIntoChallan: true,
            ConvertIntoInvoice: false,
            ConvertIntoOrder: false,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  setLastSalesInvoiceSerialNo = () => {
    getLastSalesInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { InvoiceinitVal } = this.state;
          InvoiceinitVal["si_sr_no"] = res.count;
          InvoiceinitVal["sibill_no"] = res.serialNo;
          this.setState({
            InvoiceinitVal: InvoiceinitVal,
            ConvertIntoInvoice: true,
            ConvertIntoOrder: false,
            ConvertIntoChallan: false,
          });
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
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ salesAccLst: opt });
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
      .catch((error) => {
        console.log("error", error);
      });
  };

  //Start of sales qoutation list without pagination
  AllListSalesQuotationsFun = () => {
    AllListSalesQuotations()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log({ res });
          this.setState(
            { salesInvoiceLst1: res.data, orgData1: res.data },
            () => {
              this.salesQutRef.current.setFieldValue("search", "");
            }
          );
          if (
            this.props.block.prop_data != "" &&
            this.props.block.prop_data.hasOwnProperty("selectedBills") &&
            this.props.block.prop_data.selectedBills != ""
          ) {
            this.setState({
              selectedQuoBills: this.props.block.prop_data.selectedBills,
            });
          }
          // setTimeout(() => {
          //   if (this.props.block.prop_data.rowId) {
          //     document
          //       .getElementById("TSQLTr_" + this.props.block.prop_data.rowId)
          //       .focus();
          //   } else if (document.getElementById("Search") != null) {
          //     {
          //       document.getElementById("Search").focus();
          //     }
          //   }
          // }, 1000);
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };

  //Start of sales qoutation list without pagination

  //start of qoutation list for pagination
  lstSaleQuotationsPG = () => {
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
    getSalesQuotationList(req)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          console.log({ res });
          this.setState(
            {
              salesInvoiceLst:
                res.responseObject.data != null ? res.responseObject.data : [],
              orgData:
                res.responseObject.data != null ? res.responseObject.data : [],
              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              currentPage:
                res.responseObject != null ? res.responseObject.page : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
            },
            () => {
              this.salesQutRef.current.setFieldValue("search", "");
            }
          );
          console.log("this.props", this.props.block.prop_data);
          setTimeout(() => {
            if (this.props.block.prop_data.rowId >= 0) {
              document
                .getElementById("TSQLTr_" + this.props.block.prop_data.rowId)
                .focus();
            } else if (this.props.block.prop_data.opType === "create") {
              // let createSaleCount = this.state.orgData.length - 1
              // document.getElementById("TSILTr_" + createSaleCount).focus()
              document.getElementById("TSQLTr_0")?.focus();
            }
            else if (document.getElementById("SearchTQL") != null) {
              document.getElementById("SearchTQL").focus();
            }
          }, 1500);
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };

  //end of qoutation list for pagination
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.lstSaleQuotationsPG();
    });
  };

  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.lstSaleQuotationsPG();
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
  //   getSalesQuotationList(reqData).then((response) => {
  //     let res = response.data;
  //     if (res.responseStatus == 200) {
  //       this.setState(
  //         {
  //           salesInvoiceLst: res.data,
  //           orgData: res.data,
  //           showloader: false,
  //         },
  //         () => {
  //           this.salesQutRef.current.setFieldValue("search", "");
  //         }
  //       );
  //     }
  //     // console.log("res---->", res);
  //   });
  // };

  handleSearch = (vi) => {
    let { orgData, orgData1 } = this.state;
    let orgData_F = orgData1.filter(
      (v) =>
        (v.bill_no != null &&
          v.bill_no.toLowerCase().includes(vi.toLowerCase())) ||
        moment(v.bill_date).format("DD-MM-YYYY").includes(vi) ||
        (v.sundry_debtors_name != null &&
          v.sundry_debtors_name.toLowerCase().includes(vi.toLowerCase())) ||
        (v.narration != null && v.narration.toLowerCase().includes(vi)) ||
        (v.taxable_amt != null && v.taxable_amt.toString().includes(vi)) ||
        (v.tax_amt != null && v.tax_amt.toString().includes(vi)) ||
        (v.total_amount != null && v.total_amount.toString().includes(vi))
    );
    if (vi.length == 0) {
      this.setState({
        salesInvoiceLst: orgData,
      });
    } else {
      this.setState({
        salesInvoiceLst: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  lstSaleQuotation = () => {
    getSaleQuotationList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ salesInvoiceLst: res.data });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };

  handleCounterSalesBillsSelection = (id, sundry_debtors_id, status) => {
    let {
      selectedQuoBills,
      salesInvoiceLst,
      selectedSDids,

      supplierNameLst,
      InvoiceinitVal,
      OrderinitVal,
      ChallaninitVal,
    } = this.state;
    if (status == true) {
      if (selectedQuoBills.length == 0) {
        if (!selectedQuoBills.includes(id)) {
          selectedQuoBills = [...selectedQuoBills, id];
        }
        // InvoiceinitVal = ['supplierNameId'];
        InvoiceinitVal["clientNameId"] = getSelectValue(
          supplierNameLst,
          sundry_debtors_id + ""
        );
        ChallaninitVal["clientNameId"] = getSelectValue(
          supplierNameLst,
          sundry_debtors_id + ""
        );
        OrderinitVal["clientNameId"] = getSelectValue(
          supplierNameLst,
          sundry_debtors_id + ""
        );

        this.setState({ selectedSDids: sundry_debtors_id });
      } else {
        if (selectedSDids == sundry_debtors_id) {
          if (!selectedQuoBills.includes(id)) {
            selectedQuoBills = [...selectedQuoBills, id];
          }
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "You have selected different supplier",
            is_button_show: true,
          });
          // ShowNotification("Error", "You have selected different supplier");
        }
      }
    } else {
      if (selectedSDids == sundry_debtors_id) {
        if (!selectedQuoBills.includes(id)) {
          selectedQuoBills = [...selectedQuoBills, id];
        } else {
          selectedQuoBills = selectedQuoBills.filter((v) => v != id);
        }
      } else {
        if (selectedQuoBills.includes(id)) {
          selectedQuoBills = selectedQuoBills.filter((v) => v != id);
        }
      }
    }
    this.setState(
      {
        isAllChecked:
          selectedQuoBills.length == 0
            ? false
            : selectedQuoBills.length === salesInvoiceLst.length
              ? true
              : false,
        selectedQuoBills: selectedQuoBills,
        InvoiceinitVal: InvoiceinitVal,
        ChallaninitVal: ChallaninitVal,
        OrderinitVal: OrderinitVal,
      },
      () => {
        if (this.state.selectedQuoBills.length == 0) {
          InvoiceinitVal["clientNameId"] = "";
          OrderinitVal["clientNameId"] = "";
          ChallaninitVal["clientNameId"] = "";

          this.setState({
            InvoiceinitVal: InvoiceinitVal,
            ChallaninitVal: ChallaninitVal,
            OrderinitVal: OrderinitVal,
            selectedSDids: "",
          });
        }
      }
    );
  };

  handleCounterSalesBillsSelectionAll = (status) => {
    let {
      salesInvoiceLst,
      selectedSDids,
      InvoiceinitVal,
      OrderinitVal,
      ChallaninitVal,
    } = this.state;

    let lstSelected = [];
    let selectedSundryId = "";
    if (status == true) {
      salesInvoiceLst.map((v) => {
        if (
          v.sundry_debtors_id == selectedSDids &&
          v.sales_quotation_status == "opened"
        ) {
          lstSelected.push(v.id);
        }
      });
      selectedSundryId = selectedSDids;
    } else {
      InvoiceinitVal["clientNameId"] = "";
      OrderinitVal["clientNameId"] = "";
      ChallaninitVal["clientNameId"] = "";
    }

    this.setState(
      {
        isAllChecked: status,
        selectedQuoBills: lstSelected,
        selectedSDids: selectedSundryId,
        OrderinitVal: OrderinitVal,
        InvoiceinitVal: InvoiceinitVal,
        ChallaninitVal: ChallaninitVal,
      },
      () => {
        if (this.state.selectedQuoBills.length == 0) {
          this.setState({ selectedSDids: "" });
        }
      }
    );
  };

  pageReload = () => {
    this.componentDidMount();
  };

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "list");
    reqData.append("source", "sales_quotation");
    getSalesQuotationBill(reqData).then((response) => {
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
          from: "tranx_sales_quotation_create",
          to: "tranx_sales_quotation_list",
          isNewTab: false,
        });
      }
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstSalesAccounts();
      this.lstSundrydebtors();
      this.AllListSalesQuotationsFun();
      // this.lstSaleQuotations();

      const { prop_data } = this.props.block;
      console.log("ledger prop_data", prop_data);
      let res = prop_data;
      // console.log("res in did mount", res);
      // if (res != "") {
      //   this.setState(
      //     {
      //       salesInvoiceLst: res.data,
      //       orgData: res.data,
      //       source: res.source,
      //     },
      //     () => {
      //       this.salesQutRef.current.setFieldValue("search", "");
      //     }
      //   );
      // } else {
      // this.lstSaleQuotations();
      this.lstSaleQuotationsPG();
      // }
    }
  }

  deleteQuotation = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_sales_quotation(formData)
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
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
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
          isActionExist("sales-quotation", "edit", this.props.userPermissions)
        ) {
          console.log("v.purchase_order_status", selectedLedger);
          if (selectedLedger.sales_quotation_status == "opened") {
            eventBus.dispatch("page_change", {
              from: "tranx_sales_quotation_list",
              to: "tranx_sales_quotation_edit",
              // prop_data: selectedLedger,
              prop_data: { prop_data: selectedLedger, rowId: index },
              isNewTab: false,
            });
          } else {
            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: "Quotation is Closed!",
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
    let { salesInvoiceLst, sortedColumn, sortOrder } = this.state;

    let sortedData = [...salesInvoiceLst];
    if (sortOrder == "asc") {
      sortedData.sort((a, b) => (a[sortedColumn] > b[sortedColumn] ? 1 : -1));
    } else {
      sortedData.sort((a, b) => (a[sortedColumn] < b[sortedColumn] ? 1 : -1));
    }

    this.setState({
      salesInvoiceLst: sortedData,
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
      show,
      arrowToggle,
      opendiv,
      salesAccLst,
      supplierNameLst,
      supplierCodeLst,
      salesInvoiceLst,
      initVal,
      OrderinitVal,
      ChallaninitVal,
      InvoiceinitVal,
      ConvertIntoOrder,
      ConvertIntoChallan,
      ConvertIntoInvoice,
      selectedCounterSalesBills,
      selectedQuoBills,
      selectedSDids,
      convshow,
      convshowChallan,
      convshowInvoice,
      isAllChecked,
      showloader,
      currentPage,
      pages,
      totalRows,
    } = this.state;

    return (
      <div className="">
        {/* <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style p-2">
            <div className="main-div">
              <h4 className="form-header">Create Sales Quotation</h4>
              <Formik
                innerRef={this.myRef}
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={initVal}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                  sales_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  salesAccId: Yup.object().required("Select sales account"),
                  bill_no: Yup.string().trim().required("bill no is required"),
                  clientNameId: Yup.object().required("Select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_quotation_list",
                    to: "tranx_sales_quotation_create",
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
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Q. Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="sales_sr_no"
                            id="sales_sr_no"
                            onChange={handleChange}
                            value={values.sales_sr_no}
                            isValid={touched.sales_sr_no && !errors.sales_sr_no}
                            isInvalid={!!errors.sales_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.sales_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="2">
                        <Form.Group>
                          <Form.Label>
                            Quotation Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <MyDatePicker
                            name="transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("transaction_dt", date);
                            }}
                            selected={values.transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1" className="p-0">
                        <Form.Group>
                          <Form.Label>
                            Quotation #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bill_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                              if (v != null) {
                                setFieldValue("salesAccId", v);
                              } else {
                                setFieldValue("salesAccId", "");
                              }
                            }}
                            value={values.salesAccId}
                          />

                          <span className="text-danger errormsg">
                            {errors.salesAccId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Client Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={customStylesWhite}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="clientNameId"
                            onChange={(v) => {
                              if (v != null) {
                                setFieldValue("clientNameId", v);
                              } else {
                                setFieldValue("clientNameId", "");
                              }
                            }}
                            value={values.clientNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.clientNameId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2" className="mt-4 pt-1 btn_align">
                        <Button className="successbtn-style" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            this.myRef.current.resetForm();
                            this.setState({ opendiv: !opendiv });
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
        </Collapse> */}

        {/* <Collapse in={ConvertIntoOrder}>
          <div id="example-collapse-text" className="common-form-style p-2">
            <div className="main-div ">
              <h4 className="form-header">Convert Into Order</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={OrderinitVal}
                validationSchema={Yup.object().shape({
                  so_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  bill_dt: Yup.date(),
                  salesAccId: Yup.object().required("select sales account"),
                  sobill_no: Yup.string()
                    .trim()
                    .required("bill no is required"),
                  // invoice_dt: Yup.string().required(
                  //   'invoice dt is required'
                  // ),
                  // //  bill_dt: Yup.string().required('Bill dt is required'),
                  // clientCodeId: Yup.object().required("select client code"),
                  clientNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // this.props.history.push({
                  //   pathname: '/SalesInvoiceCreate',
                  //   state: values,
                  // });
                  values["selectedCounterSales"] = selectedQuoBills;
                  console.log("values", values);
                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_quotation_list",
                    to: "tranx_sales_quotation_to_order",
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
                     {JSON.stringify(errors)};
                    <Row>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Order Sr. #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="so_sr_no"
                            id="so_sr_no"
                            onChange={handleChange}
                            value={values.so_sr_no}
                            isValid={touched.so_sr_no && !errors.so_sr_no}
                            isInvalid={!!errors.so_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.so_sr_no}
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
                            type="date"
                            className="date-style"
                            name="transaction_dt"
                            id="transaction_dt"
                            onChange={handleChange}
                            value={values.transaction_dt}
                            isValid={
                              touched.transaction_dt && !errors.transaction_dt
                            }
                            isInvalid={!!errors.transaction_dt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Order No #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Bill No."
                            name="sobill_no"
                            id="sobill_no"
                            onChange={handleChange}
                            value={values.sobill_no}
                            isValid={touched.sobill_no && !errors.sobill_no}
                            isInvalid={!!errors.sobill_no}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.sobill_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Order Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="bill_dt"
                            placeholderText="DD/MM/YYYY"
                            id="bill_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("bill_dt", date);
                            }}
                            selected={values.bill_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.bill_dt}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Client Name{" "}
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
                            name="clientNameId"
                            onChange={(v) => {
                              if (v != null) {
                                setFieldValue(
                                  "clientCodeId",
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                              }
                              setFieldValue("clientNameId", v);
                            }}
                            // onChange={handleChange}

                            value={values.clientNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.clientNameId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="2" className="mt-4 pt-1 btn_align">
                        <Button className="successbtn-style" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          // className="alterbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              ConvertIntoOrder: !ConvertIntoOrder,
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
        </Collapse> */}

        {/* <Collapse in={ConvertIntoChallan}>
          <div id="example-collapse-text" className="common-form-style p-2">
            <div className="main-div ">
              <h4 className="form-header">Convert Into Challan</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={ChallaninitVal}
                validationSchema={Yup.object().shape({
                  sc_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  salesAccId: Yup.object().required("select sales account"),
                  scbill_no: Yup.string()
                    .trim()
                    .required("bill no is required"),
                  // bill_dt: Yup.string().required('Bill dt is required'),
                  // invoice_dt: Yup.string().required(
                  //   'invoice dt is required'
                  // ),
                  // clientCodeId: Yup.object().required("select client code"),
                  clientNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  values["selectedCounterSales"] = selectedQuoBills;
                  console.log("values", values);

                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_quotation_list",
                    to: "tranx_sales_quotation_to_challan",
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
                      <Col md="1" className="">
                        <Form.Group>
                          <Form.Label>
                            Challan Sr.
                            <span className="pt-1 pl-1 req_validation">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="sc_sr_no"
                            id="sc_sr_no"
                            onChange={handleChange}
                            value={values.sc_sr_no}
                            isValid={touched.sc_sr_no && !errors.sc_sr_no}
                            isInvalid={!!errors.sc_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.sc_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="1" className="p-0">
                        <Form.Group>
                          <Form.Label>
                            Challan Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            className="pl-2"
                            name="transaction_dt"
                            id="transaction_dt"
                            onChange={handleChange}
                            value={values.transaction_dt}
                            isValid={
                              touched.transaction_dt && !errors.transaction_dt
                            }
                            isInvalid={!!errors.transaction_dt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Challan #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Bill No."
                            name="scbill_no"
                            id="bill_no"
                            onChange={handleChange}
                            value={values.scbill_no}
                            isValid={touched.scbill_no && !errors.scbill_no}
                            isInvalid={!!errors.scbill_no}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.scbill_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                       <Col md="3">
                                <Form.Group>
                                  <Form.Label>
                                    Challan Date{' '}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <MyDatePicker
                                    name="bill_dt"
                                    placeholderText="DD/MM/YYYY"
                                    id="bill_dt"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                      setFieldValue('bill_dt', date);
                                    }}
                                    selected={values.bill_dt}
                                    maxDate={new Date()}
                                    className="date-style"
                                  />

                                  <span className="text-danger errormsg">
                                    {errors.bill_dt}
                                  </span>
                                </Form.Group>
                              </Col> 

                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Client Name{" "}
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

                      <Col md="3" className="mt-4 btn_align">
                        <Button className="successbtn-style" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          // className="alterbtn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              ConvertIntoChallan: !ConvertIntoChallan,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button className="alterbtn">Alter</Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Collapse> */}

        {/* <Collapse in={ConvertIntoInvoice}>
          <div id="example-collapse-text" className="common-form-style p-2">
            <div className="main-div">
              <h4 className="form-header">Convert Into Invoice</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={InvoiceinitVal}
                validationSchema={Yup.object().shape({
                  si_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  salesAccId: Yup.object().required("select sales account"),
                  sibill_no: Yup.string()
                    .trim()
                    .required("bill no is required"),
                  // bill_dt: Yup.string().required('Bill dt is required'),
                  // invoice_dt: Yup.string().required(
                  //   'invoice dt is required'
                  // ),
                  // clientCodeId: Yup.object().required("select client code"),
                  clientNameId: Yup.object().required("select client name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // console.log('values', values);
                  // this.props.history.push({
                  //   pathname: '/SalesInvoiceCreate',
                  //   state: values,
                  // });
                  values["selectedCounterSales"] = selectedQuoBills;
                  console.log("values", values);

                  eventBus.dispatch("page_change", {
                    from: "tranx_sales_quotation_list",
                    to: "tranx_sales_quotation_to_invoice",
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
                    {JSON.stringify(errors)};
                    <Row>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Invoice Sr.
                            <span className="pt-1 pl-1 req_validation">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="si_sr_no"
                            id="sales_sr_no"
                            onChange={handleChange}
                            value={values.si_sr_no}
                            isValid={touched.si_sr_no && !errors.si_sr_no}
                            isInvalid={!!errors.si_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.sales_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1" className="p-0">
                        <Form.Group>
                          <Form.Label>
                            Invoice Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <MyDatePicker
                            name="transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("transaction_dt", date);
                            }}
                            selected={values.transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.transaction_dt}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Invoice #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Bill No."
                            name="sibill_no"
                            id="sibill_no"
                            onChange={handleChange}
                            value={values.sibill_no}
                            isValid={touched.sibill_no && !errors.sibill_no}
                            isInvalid={!!errors.sibill_no}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.sibill_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Sales A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                       <Col md="3">
                                <Form.Group>
                                  <Form.Label>
                                    Invoice Date{' '}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <MyDatePicker
                                    name="bill_dt"
                                    placeholderText="DD/MM/YYYY"
                                    id="bill_dt"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                      setFieldValue('bill_dt', date);
                                    }}
                                    selected={values.bill_dt}
                                    maxDate={new Date()}
                                    className="date-style"
                                  />

                                  <span className="text-danger errormsg">
                                    {errors.bill_dt}
                                  </span>
                                </Form.Group>
                              </Col> 

                      <Col md="3">
                        <Form.Group className="">
                          <Form.Label>
                            Client Name{" "}
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
                            name="clientNameId"
                            onChange={(v) => {
                              setFieldValue("clientNameId", v);
                            }}
                            value={values.clientNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.clientNameId}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="3" className="btn_align mt-4">
                        <Button className="successbtn-style" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          // className="alterbtn"
                          onClick={(e) => {
                            e.preventDefault();
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
        </Collapse> */}

        <div className="ledger-group-style">
          <div className="cust_table">
            {!opendiv && (
              <Row className="">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  innerRef={this.salesQutRef}
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
                      <Row
                        onKeyDown={(e) => {
                          if (e.keyCode === 40) {
                            e.preventDefault();
                            document.getElementById("TSQLTr_0")?.focus();
                          }
                        }}
                      >
                        <Col md="3">
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
                              {/* <Button type="submit">x</Button>
                            </Form.Group>
                          </Form> */}
                          <InputGroup className="mb-2 mdl-text">
                            <Form.Control
                              placeholder="Search"
                              // id="SearchTQL" @mayur id commented
                              aria-label="Search"
                              className="mdl-text-box"
                              autoFocus={true}
                              aria-describedby="basic-addon1"
                              style={{ borderRight: "none" }}
                              onChange={(e) => {
                                let v = e.target.value;
                                console.log({ v });
                                setFieldValue("search", v);
                                this.handleSearch(v);
                              }}
                              value={values.search}
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  document
                                    .getElementById("TSQL_d_start_date")
                                    .focus();
                                }
                              }}
                            />
                            <InputGroup.Text
                              className="int-grp"
                              id="basic-addon1"
                            >
                              <img className="srch_box" src={search} alt="" />
                            </InputGroup.Text>
                          </InputGroup>
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
                                id="TSQL_d_start_date"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/MM/yyyy"
                                value={values.d_start_date}
                                onChange={handleChange}
                                onBlur={(e) => {

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
                                        "d_start_date",
                                        e.target.value
                                      );
                                      this.setState(
                                        { startDate: e.target.value },
                                        () => {
                                          this.lstSaleQuotationsPG();
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
                                          this.lstSaleQuotationsPG();
                                        }
                                      );
                                    }
                                  } else {
                                    setFieldValue("d_start_date", "");
                                    this.setState(
                                      { startDate: e.target.value },
                                      () => {
                                        this.lstSaleQuotationsPG();
                                      }
                                    );
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    document
                                      .getElementById("TSQL_d_end_date")
                                      .focus();
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
                                id="TSQL_d_end_date"
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
                                          this.lstSaleQuotationsPG();
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
                                          this.lstSaleQuotationsPG();
                                        }
                                      );
                                    }
                                  } else {
                                    setFieldValue("d_end_date", "");
                                    this.setState(
                                      { endDate: e.target.value },
                                      () => {
                                        this.lstSaleQuotationsPG();
                                      }
                                    );
                                    // this.lstSaleQuotations();
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                    document
                                      .getElementById("TSTQL_create_btn")
                                      .focus();
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>

                        <Col md="3" className="text-end">
                          {selectedQuoBills.length == 0 && !opendiv && (
                            <Button
                              className="create-btn float-end"
                              id="TSTQL_create_btn"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "sales-quotation",
                                    "create",
                                    this.props.userPermissions
                                  )
                                ) {
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_sales_quotation_list",
                                    to: "tranx_sales_quotation_create",
                                    prop_data: values,
                                    isNewTab: false,
                                  });
                                  this.setLastSalesQuotationSerialNo();
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
                            >
                              Create
                            </Button>
                          )}
                          {/* {this.state.hide == 'true'} */}

                          {/* {selectedQuoBills.length == 0 && !opendiv && (
                            <Button
                              className="me-2 btn-refresh float-end"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                this.pageReload();
                              }}
                            >
                              <img src={refresh} alt="icon" />
                            </Button>
                          )} */}
                          {/* {JSON.stringify(selectedQuoBills)} */}
                          <Row
                            style={{
                              paddingRight: "8px",
                              justifyContent: "end",
                            }}
                          >
                            {this.state.source == "" ? (
                              <>
                                {selectedQuoBills != "" &&
                                  selectedQuoBills.length > 0 && (
                                    <Col md={3} className="p-0 me-2">
                                      {/* {JSON.stringify(selectedCounterSalesBills)} */}
                                      <Button
                                        className="create-btn "
                                        onClick={(e) => {
                                          e.preventDefault();
                                          eventBus.dispatch("page_change", {
                                            to: "tranx_sales_quotation_to_order",
                                            prop_data: {
                                              selectedBills: selectedQuoBills,
                                            },
                                          });
                                        }}
                                        aria-controls="example-collapse-text"
                                      // aria-expanded={ConvertIntoOrder}
                                      // onClick={this.open}
                                      >
                                        To Order
                                        {/* <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    class="bi bi-plus-square-dotted svg-style"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                  </svg> */}
                                      </Button>
                                    </Col>
                                  )}

                                {selectedQuoBills.length > 0 && (
                                  <Col md={3} className="p-0 me-2">
                                    <Button
                                      className="create-btn m-0"
                                      //  disabled={selectedCounterSalesBills.length > 0}
                                      // disabled={
                                      //   selectedCounterSalesBills.length == 0 ? true : false
                                      // }
                                      onClick={(e) => {
                                        e.preventDefault();
                                        eventBus.dispatch("page_change", {
                                          to: "tranx_sales_quotation_to_challan",
                                          prop_data: {
                                            selectedBills: selectedQuoBills,
                                          },
                                        });

                                        //this.getLastPurchaseChallanSerialNo();
                                      }}
                                      aria-controls="example-collapse-text"
                                    //aria-expanded={ConvertIntoChallan}
                                    // onClick={this.open}
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
                                  </Col>
                                )}

                                {selectedQuoBills.length > 0 && (
                                  <Col md={3} className="p-0 me-2">
                                    <Button
                                      className="create-btn m-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        eventBus.dispatch("page_change", {
                                          to: "tranx_sales_quotation_to_invoice",
                                          prop_data: {
                                            selectedBills: selectedQuoBills,
                                          },
                                        });

                                        this.setLastSalesInvoiceSerialNo();
                                      }}
                                      aria-controls="example-collapse-text"
                                    //aria-expanded={ConvertIntoInvoice}
                                    // onClick={this.open}
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
                                  </Col>
                                )}
                              </>
                            ) : (
                              <>
                                {this.state.source == "order" ? (
                                  <>
                                    {selectedQuoBills.length > 0 && (
                                      <Col md={3} className="p-0 me-2">
                                        {/* {JSON.stringify(selectedCounterSalesBills)} */}
                                        <Button
                                          className="create-btn "
                                          onClick={(e) => {
                                            e.preventDefault();
                                            eventBus.dispatch("page_change", {
                                              to: "tranx_sales_quotation_to_order",
                                              prop_data: { selectedQuoBills },
                                            });
                                          }}
                                          aria-controls="example-collapse-text"
                                        // aria-expanded={ConvertIntoOrder}
                                        // onClick={this.open}
                                        >
                                          To Order
                                          {/* <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    class="bi bi-plus-square-dotted svg-style"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                  </svg> */}
                                        </Button>
                                      </Col>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {this.state.source == "challan" ? (
                                      <>
                                        {selectedQuoBills.length > 0 && (
                                          <Col md={3} className="p-0 me-2">
                                            <Button
                                              className="create-btn m-0"
                                              //  disabled={selectedCounterSalesBills.length > 0}
                                              // disabled={
                                              //   selectedCounterSalesBills.length == 0 ? true : false
                                              // }
                                              onClick={(e) => {
                                                e.preventDefault();
                                                eventBus.dispatch(
                                                  "page_change",
                                                  {
                                                    to: "tranx_sales_quotation_to_challan",
                                                    prop_data: {
                                                      selectedQuoBills,
                                                    },
                                                  }
                                                );

                                                //this.getLastPurchaseChallanSerialNo();
                                              }}
                                              aria-controls="example-collapse-text"
                                            //aria-expanded={ConvertIntoChallan}
                                            // onClick={this.open}
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
                                          </Col>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {selectedQuoBills.length > 0 && (
                                          <Col md={3} className="p-0 me-2">
                                            <Button
                                              className="create-btn m-0"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                eventBus.dispatch(
                                                  "page_change",
                                                  {
                                                    to: "tranx_sales_quotation_to_invoice",
                                                    prop_data: {
                                                      selectedQuoBills,
                                                    },
                                                  }
                                                );

                                                this.setLastSalesInvoiceSerialNo();
                                              }}
                                              aria-controls="example-collapse-text"
                                            //aria-expanded={ConvertIntoInvoice}
                                            // onClick={this.open}
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
                                          </Col>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Row>
            )}

            {/* {salesInvoiceLst.length > 0 && ( */}
            <div className="Tranx-tbl-list-style">
              {isActionExist(
                "sales-quotation",
                "list",
                this.props.userPermissions
              ) && (
                  <Table size="sm" className="tbl-font">
                    <thead>
                      <tr>
                        {/* {this.state.showDiv && ( */}
                        <th
                          style={{ width: "5%" }}
                          // className="counter-s-checkbox pl-0"
                          className={`${selectedSDids != ""
                            ? "counter-s-checkbox pl-0 py-0"
                            : "counter-s-checkbox pl-0"
                            }`}
                        >
                          {selectedSDids != "" ? (
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className=""
                            >
                              <Form.Check
                                type="checkbox"
                                checked={isAllChecked === true ? true : false}
                                onChange={(e) => {
                                  this.handleCounterSalesBillsSelectionAll(
                                    e.target.checked
                                  );
                                }}
                                label="Select"
                                className="mb-0"
                              />
                            </Form.Group>
                          ) : (
                            "Select"
                          )}
                        </th>
                        <th>
                          <div className="d-flex">
                            SQ No.
                            <div
                              className="ms-2"
                              onClick={() => this.handleSort("bill_no")}
                            >
                              {this.state.sortedColumn === "bill_no" &&
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
                        <th>
                          <div className="d-flex">
                            SQ Date
                            <div
                              className="ms-2"
                              onClick={() => this.handleSort("bill_date")}
                            >
                              {this.state.sortedColumn === "bill_date" &&
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

                        {/* <th>Sales A/c</th> */}
                        <th style={{ width: "20%" }}>
                          <div className="d-flex">
                            Client Name
                            <div
                              className="ms-2"
                              onClick={() =>
                                this.handleSort("sundry_debtors_name")
                              }
                            >
                              {this.state.sortedColumn ===
                                "sundry_debtors_name" &&
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
                        {/* <th>Tranx Status</th> */}
                        {/* <th className="btn_align right_col">Total Amount</th> */}
                        <th style={{ width: "20%" }}>Narration</th>
                        <th style={{ textAlign: "end" }}>Taxable</th>
                        <th style={{ textAlign: "end" }}>Tax</th>
                        <th>
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
                        <th style={{ textAlign: "center", width: "4%" }}>
                          Print
                        </th>

                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    {/* {JSON.stringify(selectedQuoBills)} */}
                    <tbody
                      style={{ borderTop: "2px solid transparent" }}
                      className="prouctTableTr tabletrcursor"
                      onKeyDown={(e) => {
                        e.preventDefault();
                        if (e.shiftKey && e.keyCode == 9) {
                          document.getElementById("TSTQL_create_btn").focus();
                        } else if (e.keyCode != 9) {
                          this.handleTableRow(e);
                        }
                      }}
                    >
                      {salesInvoiceLst &&
                        salesInvoiceLst.length > 0 &&
                        salesInvoiceLst.map((v, i) => {
                          return (
                            <tr
                              value={JSON.stringify(v)}
                              id={`TSQLTr_` + i}
                              // prId={v.id}
                              tabIndex={i}
                              // onDoubleClick={(e) => {
                              //   e.preventDefault();
                              //   // console.log("v", v);

                              //   eventBus.dispatch("page_change", {
                              //     from: "tranx_sales_quotation_list",
                              //     to: "tranx_sales_quotation_edit",
                              //     prop_data: v,
                              //     isNewTab: false,
                              //   });
                              // }}
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                if (
                                  isActionExist(
                                    "sales-quotation",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  console.log("v.purchase_order_status", v);
                                  if (v.sales_quotation_status == "opened") {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_quotation_list",
                                      to: "tranx_sales_quotation_edit",
                                      // prop_data: v,
                                      prop_data: { prop_data: v, rowId: i },
                                      isNewTab: false,
                                    });
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Quotation is Closed!",
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
                              <td style={{ width: "5%" }}>
                                <Form.Group
                                  controlId="formBasicCheckbox1"
                                  className="ml-1 pmt-allbtn"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    disabled={
                                      v.sales_quotation_status == "closed"
                                    }
                                    checked={
                                      selectedQuoBills != ""
                                        ? selectedQuoBills.includes(
                                          parseInt(v.id)
                                        )
                                        : ""
                                    }
                                    onChange={(e) => {
                                      // e.preventDefault();
                                      this.handleCounterSalesBillsSelection(
                                        v.id,
                                        v.sundry_debtors_id,
                                        e.target.checked
                                      );
                                    }}
                                  // label={i + 1}
                                  />
                                </Form.Group>
                              </td>
                              <td>{v.bill_no}</td>
                              <td>{moment(v.bill_date).format("DD-MM-YYYY")}</td>

                              <td style={{ width: "20%" }}>
                                {v.sundry_debtors_name}
                              </td>
                              <td style={{ width: "20%" }}>
                                <p>{v.narration}</p>
                              </td>
                              {/* <td>{v.sales_quotation_status}</td> */}
                              {/* <td className="btn_align right_col">
                          {v.total_amount}
                        </td> */}
                              <td style={{ textAlign: "end" }}>
                                {/* {parseFloat(v.taxable_amt).toFixed(2)} */}
                                {INRformat.format(v.taxable_amt)}
                              </td>
                              <td style={{ textAlign: "end" }}>
                                {/* {parseFloat(v.tax_amt).toFixed(2)} */}
                                {INRformat.format(v.tax_amt)}
                              </td>
                              <td style={{ textAlign: "end" }}>
                                {/* {parseFloat(v.total_amount).toFixed(2)} */}
                                {INRformat.format(v.total_amount)}
                              </td>

                              <td style={{ textAlign: "center" }}>
                                {/* {v.sales_order_status} */}
                                <Badge
                                  bg={`${v.sales_quotation_status == "opened"
                                    ? "success"
                                    : v.sales_quotation_status == "closed"
                                      ? "danger"
                                      : null
                                    }`}
                                >
                                  {v.sales_quotation_status == "opened"
                                    ? "  Opened"
                                    : v.sales_quotation_status == "closed"
                                      ? "Closed"
                                      : null}
                                </Badge>
                              </td>
                              <td style={{ textAlign: "center", width: "4%" }}>
                                <img
                                  src={print3}
                                  className="del_icon"
                                  title="Print"
                                  onClick={(e) => {
                                    e.preventDefault();

                                    this.getInvoiceBillsLstPrint(v.id);
                                  }}
                                ></img>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <img
                                  src={TableEdit}
                                  className="del_icon"
                                  title="Edit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                      isActionExist(
                                        "sales-quotation",
                                        "edit",
                                        this.props.userPermissions
                                      )
                                    ) {
                                      console.log("v.purchase_order_status", v);
                                      if (v.sales_quotation_status == "opened") {
                                        eventBus.dispatch("page_change", {
                                          from: "tranx_sales_quotation_list",
                                          to: "tranx_sales_quotation_edit",
                                          // prop_data: v,
                                          prop_data: { prop_data: v, rowId: i },
                                          isNewTab: false,
                                        });
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Quotation is Closed,can't Edit!",
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
                                ></img>

                                <img
                                  src={delete_icon}
                                  className="del_icon"
                                  title="Delete"
                                  onClick={(e) => {
                                    if (v.sales_quotation_status == "closed") {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Quotation is Closed, can't Delete!",
                                        // is_button_show: true,
                                      });
                                      //to hide the notification after 1 second display and hide
                                      // setTimeout(function() {
                                      //   MyNotifications.fire({ show: false });
                                      // }, 1000);
                                    } else if (
                                      isActionExist(
                                        "sales-quotation",
                                        "delete",
                                        this.props.userPermissions
                                      )
                                    ) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "confirm",
                                        title: "Confirm",
                                        msg: "Do you want to Delete",
                                        is_button_show: false,
                                        is_timeout: false,
                                        delay: 0,
                                        handleSuccessFn: () => {
                                          this.deleteQuotation(v.id);
                                        },
                                        handleFailFn: () => { },
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
                              </td>
                            </tr>
                          );
                        })}
                      {salesInvoiceLst.length === 0 && (
                        <tr>
                          <td colSpan={11} className="text-center">
                            No Data Found
                          </td>
                        </tr>
                      )}
                      {/* {salesInvoiceLst.length === 0 && (
                        <tr>
                          <td colSpan={11} className="text-center">
                            No Data Found
                          </td>
                          {showloader == true && LoadingComponent(showloader)}
                        </tr>
                      )} */}
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
                              
                                <th>Total Sales Quotation List :</th>
                                <th>{salesInvoiceLst.length}</th>
                              </tr>
                            );
                          })}
                        </th>
                      </tr>
                    </thead> */}
                    {/* <thead className="tbl-footer">
                      <tr>
                        <th colSpan={10}></th>
                      </tr>
                    </thead> */}
                  </Table>
                )}
              {/* )} */}
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
                          <span>Quotation:</span>
                          <span>{totalRows}</span>
                        </>
                      );
                    })}
                  </Col>
                  {/* <Col md="4" className="my-auto">
                    <Button
                      type="button"
                      className="nextbtn"
                    >
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="plus-color"
                        style={{ verticalAlign: "middle" }}
                        onClick={(e) => {
                          e.preventDefault();
                          this.goToPreviousPage();
                        }}
                        disabled={currentPage <= 1}
                      />
                    </Button>
                    <Button
                      type="button"
                      className="nextbtn"
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="plus-color "
                        style={{ verticalAlign: "middle" }}
                        onClick={(e) => {
                          e.preventDefault();
                          this.goToNextPage();
                        }}
                        disabled={currentPage === pages ? true : false}
                      />
                    </Button>
                  </Col> */}
                  {/* <Col md="6" className="my-auto">
                    Page No.<span>{currentPage} Out of 10</span>
                  </Col> */}
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
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
)(TranxSalesQuotationList);
