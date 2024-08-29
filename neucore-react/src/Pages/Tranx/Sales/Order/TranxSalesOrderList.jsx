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
  Collapse,
  Badge,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import delete_icon from "@/assets/images/delete_icon3.png";
import TableEdit from "@/assets/images/1x/editnew.png";
import print3 from "@/assets/images/print3.png";
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

import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import moment from "moment";
import Select from "react-select";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  getSalesAccounts,
  getSundryDebtors,
  authenticationService,
  getSalesInvoiceList,
  getLastSalesOrder,
  getSaleOrderList,
  AllListSaleOrders,
  getLastSalesChallanNo,
  getLastSalesInvoiceNo,
  delete_sales_order,
  getOrderBillById,
} from "@/services/api_functions";

import {
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  getHeader,
  CustomDTHeader,
  customStyles,
  MyDatePicker,
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
class TranxSalesOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.salesOrderRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      show: false,
      source: "",
      arrowToggle: true,
      opendiv: false,
      ConvertIntoChallan: false,
      convshow: false,
      showDiv: false,
      convshowInvoice: false,
      ConvertIntoInvoice: false,
      isAllChecked: false,
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      salesInvoiceLst: [],
      AllsalesInvoiceLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      orgData: [],
      orgData1: [],
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      selectedCounterSalesBills: [],
      selectedSDids: "",
      soBills: [],
      initVal: {
        so_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        sobill_no: "",
        clientCodeId: "",
        invoice_dt: "",
        clientNameId: "",
        clientName: "",
        mobileNo: "",
      },
      ChallaninitVal: {
        sc_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        scbill_no: "",

        clientCodeId: "",
        invoice_dt: "",
        clientNameId: "",
      },
      InvoiceinitVal: {
        si_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        sibill_no: "",

        clientCodeId: "",
        invoice_dt: "",
        clientNameId: "",
      },
      // order_type: "restro",
      order_type: "core_product",
    };
  }
  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  setLastSalesOrderSerialNo = () => {
    let reqData = new FormData();

    // reqData.append("order_type", "core_product");
    // reqData.append("order_type", "restro");

    getLastSalesOrder()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          initVal["so_sr_no"] = res.count;
          initVal["sobill_no"] = res.serialNo;
          this.setState({ initVal: initVal });
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
            ConvertIntoChallan: false,
            ConvertIntoInvoice: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // lstSalesAccounts = () => {
  //   getSalesAccounts()
  //     .then((response) => {
  //       // console.log("res", response);
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         let opt = res.list.map((v, i) => {
  //           return { label: v.name, value: v.id };
  //         });
  //         this.setState({ salesAccLst: opt });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };
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
            // console.log("prop_data", prop_data);
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

  //sale order list without pagination start

  AllListSaleOrdersFun = () => {
    // let { order_type } = this.state;
    // ;
    let formData = new FormData();
    // formData.append("order_type", "core_product");
    // formData.append("order_type", order_type);

    AllListSaleOrders()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log({ res });
          this.setState(
            { AllsalesInvoiceLst: res.data, orgData1: res.data },
            () => {
              this.salesOrderRef.current.setFieldValue("search", "");

              if (
                this.props.block.prop_data != "" &&
                "selectedBills" in this.props.block.prop_data
              ) {
                this.setState({
                  soBills: this.props.block.prop_data.selectedBills,
                });
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ AllsalesInvoiceLst: [] });
      });
  };

  //sale order list without pagination end

  // sale order list with pagination start
  lstSaleOrder = () => {
    let { startDate, endDate, pageNo, currentPage, pageLimit } = this.state;
    // ;
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

    getSaleOrderList(req)
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
              this.salesOrderRef.current.setFieldValue("search", "");
              console.warn(
                "res.responseObject.data.length - 1->>>>>",
                res.responseObject.data.length - 1
              );
              setTimeout(() => {
                if (this.props.block.prop_data.rowId >= 0) {
                  document
                    .getElementById(
                      "TSOLTr_" + this.props.block.prop_data.rowId
                    )
                    .focus();
                } else if (this.props.block.prop_data.opType === "create") {
                  // let createSaleCount = this.state.orgData.length - 1
                  // document.getElementById("TSILTr_" + createSaleCount).focus()
                  document.getElementById("TSOLTr_0")?.focus();
                } else if (document.getElementById("SearchTSOL") != null) {
                  document.getElementById("SearchTSOL").focus();
                }
              }, 1500);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.lstSaleOrder();
    });
  };

  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.lstSaleOrder();
    });
  };
  //sale order list with pagination end

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
  //   getSaleOrderList(reqData).then((response) => {
  //     let res = response.data;
  //     if (res.responseStatus == 200) {
  //       this.setState(
  //         {
  //           salesInvoiceLst: res.data,
  //           orgData: res.data,
  //           showloader: false,
  //         },
  //         () => {
  //           this.salesOrderRef.current.setFieldValue("search", "");
  //         }
  //       );
  //     }
  //     console.log("res---->", res);
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
  setTableManager = (tm) => (this.tableManager.current = tm);

  callOpenDiv = () => {
    const { opendiv } = this.state;
    this.setState({ opendiv: !opendiv });
  };

  handleCounterSalesBillsSelection = (id, sundry_debtors_id, status) => {
    let {
      soBills,
      salesInvoiceLst,
      selectedSDids,
      supplierNameLst,
      InvoiceinitVal,

      ChallaninitVal,
    } = this.state;
    if (status == true) {
      if (soBills.length == 0) {
        if (!soBills.includes(id)) {
          soBills = [...soBills, id];
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

        this.setState({ selectedSDids: sundry_debtors_id });
      } else {
        if (selectedSDids == sundry_debtors_id) {
          if (!soBills.includes(id)) {
            soBills = [...soBills, id];
          }
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "You have selected different supplier",
            is_button_show: true,
          });
        }
      }
    } else {
      if (selectedSDids == sundry_debtors_id) {
        if (!soBills.includes(id)) {
          soBills = [...soBills, id];
        } else {
          soBills = soBills.filter((v) => v != id);
        }
      } else {
        if (soBills.includes(id)) {
          soBills = soBills.filter((v) => v != id);
        }
      }
    }
    this.setState(
      {
        isAllChecked:
          soBills.length == 0
            ? false
            : soBills.length === salesInvoiceLst.length
            ? true
            : false,
        soBills: soBills,
        InvoiceinitVal: InvoiceinitVal,
        ChallaninitVal: ChallaninitVal,
      },
      () => {
        if (this.state.soBills.length == 0) {
          InvoiceinitVal["clientNameId"] = "";

          ChallaninitVal["clientNameId"] = "";

          this.setState({
            InvoiceinitVal: InvoiceinitVal,
            ChallaninitVal: ChallaninitVal,

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

      ChallaninitVal,
    } = this.state;

    let lstSelected = [];
    let selectedSundryId = "";
    if (status == true) {
      salesInvoiceLst.map((v) => {
        if (
          v.sundry_debtors_id == selectedSDids &&
          v.sales_order_status == "opened"
        ) {
          lstSelected.push(v.id);
        }
      });
      selectedSundryId = selectedSDids;
    } else {
      InvoiceinitVal["clientNameId"] = "";

      ChallaninitVal["clientNameId"] = "";
    }

    this.setState(
      {
        isAllChecked: status,
        soBills: lstSelected,
        selectedSDids: selectedSundryId,

        InvoiceinitVal: InvoiceinitVal,
        ChallaninitVal: ChallaninitVal,
      },
      () => {
        if (this.state.soBills.length == 0) {
          this.setState({ selectedSDids: "" });
        }
      }
    );
  };

  deletesales = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_sales_order(formData)
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

  pageReload = () => {
    this.componentDidMount();
  };

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "list");
    reqData.append("source", "sales_order");
    getOrderBillById(reqData).then((response) => {
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
          from: "tranx_sales_order_create",
          to: "tranx_sales_order_list",
          isNewTab: false,
        });
      }
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstSalesAccounts();
      this.lstSundrydebtors();
      this.AllListSaleOrdersFun();
      // this.lstSalesInvoice();
      this.lstSaleOrder();
    }
  }

  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let {
      ledgerModalStateChange,
      transactionType,
      invoice_data,
      ledgerData,
    } = this.props;
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
        if (selectedLedger.sales_order_status == "closed") {
          MyNotifications.fire({
            show: true,
            icon: "info",
            title: "Info",
            msg: "Order is Closed, can't Edit!",
            is_button_show: true,
          });
        } else if (
          isActionExist("sales-order", "edit", this.props.userPermissions)
        ) {
          eventBus.dispatch("page_change", {
            from: "tranx_sales_order_list",
            to: "tranx_sales_order_edit",
            // prop_data: selectedLedger,
            prop_data: { prop_data: selectedLedger, rowId: index },
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
      salesAccLst,
      supplierNameLst,
      opendiv,
      showDiv,
      supplierCodeLst,
      salesInvoiceLst,
      initVal,
      ChallaninitVal,
      InvoiceinitVal,
      selectedSDids,
      convshow,
      selectedCounterSalesBills,
      soBills,
      convshowInvoice,
      isAllChecked,
      ConvertIntoChallan,
      ConvertIntoInvoice,
      order_type,
      showloader,
      currentPage,
      pages,
      totalRows,
    } = this.state;

    return (
      <div className="">
        <div className="ledger_form_style">
          <div className="ledger-group-style">
            <div className="cust_table">
              {!opendiv && (
                <Row className="">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    innerRef={this.salesOrderRef}
                    initialValues={{ search: "" }}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                      // groupName: Yup.string().trim().required("Group name is required"),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                              document.getElementById("TSOLTr_0")?.focus();
                            }
                          }}
                        >
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
                                {/* <Button type="submit">x</Button> 
                              </Form.Group>
                            </Form> */}
                              <InputGroup className="mb-2 mdl-text">
                                <Form.Control
                                  placeholder="Search"
                                  // id="SearchTSOL" @mayur id commented
                                  // aria-label="Search"
                                  // aria-describedby="basic-addon1"
                                  // style={{ borderRight: "none" }}
                                  className="mdl-text-box"
                                  autoFocus={true}
                                  onChange={(e) => {
                                    this.handleSearch(e.target.value);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      document
                                        .getElementById("TSOL_d_start_date")
                                        .focus();
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
                                  id="TSOL_d_start_date"
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
                                            this.lstSaleOrder();
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
                                            this.lstSaleOrder();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_start_date", "");
                                      this.setState(
                                        { startDate: e.target.value },
                                        () => {
                                          this.lstSaleOrder();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      document
                                        .getElementById("TSOL_d_end_date")
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
                                  id="TSOL_d_end_date"
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
                                            this.lstSaleOrder();
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
                                            this.lstSaleOrder();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_end_date", "");
                                      // this.lstSaleOrder();
                                      this.setState(
                                        { endDate: e.target.value },
                                        () => {
                                          this.lstSaleOrder();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      document
                                        .getElementById("TSOL_create_btn")
                                        .focus();
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col md="3" className=" text-end">
                            {/* <Button
                            className="me-2 btn-refresh float-end"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              this.pageReload();
                            }}
                          >
                            <img src={refresh} alt="icon" />
                          </Button> */}
                            {/* {this.state.hide == 'true'} */}
                            {soBills.length == 0 && !opendiv && (
                              <Button
                                className="create-btn"
                                id="TSOL_create_btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // if (isActionExist("sales-order", "create")) {
                                  //   this.setState({ opendiv: !opendiv });
                                  //   this.setLastSalesOrderSerialNo();
                                  // } else {
                                  //   MyNotifications.fire({
                                  //     show: true,
                                  //     icon: "error",
                                  //     title: "Error",
                                  //     msg: "Permission is denied!",
                                  //     is_button_show: true,
                                  //   });
                                  // }
                                  if (
                                    isActionExist(
                                      "sales-order",
                                      "create",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_order_list",
                                      to: "tranx_sales_order_create",
                                      prop_data: values,
                                      isNewTab: false,
                                    });
                                    // this.setLastSalesOrderSerialNo();
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

                            {/* {JSON.stringify(selectedCounterSalesBills)} */}
                            {this.state.source == "" ? (
                              <>
                                {soBills.length > 0 && (
                                  <Button
                                    // className="createbtn mr-2"
                                    className="create-btn  mr-2"
                                    //  disabled={selectedCounterSalesBills.length > 0}
                                    // disabled={
                                    //   selectedCounterSalesBills.length == 0 ? true : false
                                    // }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      eventBus.dispatch("page_change", {
                                        // from: "tranx_sales_order_to_list",
                                        to: "tranx_sales_order_to_challan",
                                        prop_data: { selectedBills: soBills },
                                        isNewTab: false,
                                      });

                                      // this.setLastSalesInvoiceSerialNo();
                                    }}
                                    aria-controls="example-collapse-text"
                                    // aria-expanded={ConvertIntoChallan}
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
                                )}
                                {soBills.length > 0 && (
                                  <Button
                                    className="create-btn mr-2 ms-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_sales_order_to_list",
                                        to: "tranx_sales_order_to_invoice",
                                        prop_data: { selectedBills: soBills },
                                        isNewTab: false,
                                      });

                                      // this.setLastSalesInvoiceSerialNo();
                                    }}
                                    // aria-controls="example-collapse-text"
                                    // aria-expanded={ConvertIntoInvoice}
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
                                )}
                              </>
                            ) : (
                              <>
                                {this.state.source == "challan" ? (
                                  <>
                                    {soBills.length > 0 && (
                                      <Button
                                        // className="createbtn mr-2"
                                        className="create-btn  mr-2"
                                        //  disabled={selectedCounterSalesBills.length > 0}
                                        // disabled={
                                        //   selectedCounterSalesBills.length == 0 ? true : false
                                        // }
                                        onClick={(e) => {
                                          e.preventDefault();
                                          eventBus.dispatch("page_change", {
                                            // from: "tranx_sales_order_to_list",
                                            to: "tranx_sales_order_to_challan",
                                            prop_data: {
                                              selectedBills: soBills,
                                            },
                                            isNewTab: false,
                                          });

                                          // this.setLastSalesInvoiceSerialNo();
                                        }}
                                        aria-controls="example-collapse-text"
                                        // aria-expanded={ConvertIntoChallan}
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
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {soBills.length > 0 && (
                                      <Button
                                        className="create-btn mr-2 ms-2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          eventBus.dispatch("page_change", {
                                            from: "tranx_sales_order_to_list",
                                            to: "tranx_sales_order_to_invoice",
                                            prop_data: {
                                              selectedBills: soBills,
                                            },
                                            isNewTab: false,
                                          });

                                          // this.setLastSalesInvoiceSerialNo();
                                        }}
                                        // aria-controls="example-collapse-text"
                                        // aria-expanded={ConvertIntoInvoice}
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
                                    )}
                                  </>
                                )}
                              </>
                            )}

                            {/* <Button className="ml-2 refresh-btn" type="button">
                            Refresh
                          </Button> */}
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
                  "sales-order",
                  "list",
                  this.props.userPermissions
                ) && (
                  <Table size="sm" className="tbl-font">
                    <thead>
                      <tr>
                        <th
                          style={{ width: "5%" }}
                          // className="counter-s-checkbox pl-0"
                          className={`${
                            selectedSDids != ""
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
                              />
                            </Form.Group>
                          ) : (
                            "Select"
                          )}
                        </th>
                        {/* )} */}
                        {/* <th>Tranx Status</th> */}
                        <th>
                          <div className="d-flex">
                            SO No.
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
                            REF. No.
                            <div
                              className="ms-2"
                              onClick={() => this.handleSort("referenceNo")}
                            >
                              {this.state.sortedColumn === "referenceNo" &&
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
                            SO Date
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
                        {order_type == "core_product" ? (
                          <th style={{ width: "15%" }}>
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
                        ) : (
                          <th style={{ width: "15%" }}>
                            <div className="d-flex">
                              Customer Name
                              <div
                                className="ms-2"
                                onClick={this.handleArrowClick}
                              >
                                {this.state.arrowToggle ? (
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
                        )}

                        {/* <th>Mobile No</th>
                        <th>Advanced Amount</th> */}
                        <th style={{ width: "15%" }}>Narration</th>
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
                        {/* <th className="btn_align right_col">Order Status</th> */}
                        <th style={{ textAlign: "center" }}>Tranx Status</th>
                        <th style={{ textAlign: "center" }}>Print</th>

                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                      {/* </div> */}
                    </thead>
                    <tbody
                      style={{ borderTop: "2px solid transparent" }}
                      className="prouctTableTr tabletrcursor"
                      onKeyDown={(e) => {
                        e.preventDefault();
                        if (e.shiftKey && e.keyCode == 9) {
                          document.getElementById("TSOL_create_btn").focus();
                        }
                        if (e.keyCode != 9) {
                          this.handleTableRow(e);
                        }
                      }}
                    >
                      {/* <div className="scrollban_new"> */}
                      {salesInvoiceLst.map((v, i) => {
                        return (
                          <tr
                            value={JSON.stringify(v)}
                            id={`TSOLTr_` + i}
                            // prId={v.id}
                            tabIndex={i}
                            // onDoubleClick={(e) => {
                            //   e.preventDefault();
                            //   eventBus.dispatch("page_change", {
                            //     from: "tranx_sales_order_list",
                            //     to: "tranx_sales_order_edit",
                            //     prop_data: v,
                            //     isNewTab: false,
                            //   });
                            // }}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              if (v.sales_order_status == "closed") {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "info",
                                  title: "Info",
                                  msg: "Order is Closed, can't Edit!",
                                  is_button_show: true,
                                });
                              } else if (
                                isActionExist(
                                  "sales-order",
                                  "edit",
                                  this.props.userPermissions
                                )
                              ) {
                                eventBus.dispatch("page_change", {
                                  from: "tranx_sales_order_list",
                                  to: "tranx_sales_order_edit",
                                  // prop_data: v,
                                  prop_data: { prop_data: v, rowId: i },
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
                            <td style={{ width: "5%" }}>
                              <Form.Group
                                controlId="formBasicCheckbox1"
                                className="ml-1 pmt-allbtn"
                              >
                                <Form.Check
                                  type="checkbox"
                                  className="m-0"
                                  disabled={v.sales_order_status == "closed"}
                                  checked={
                                    soBills != ""
                                      ? soBills.includes(parseInt(v.id))
                                      : ""
                                  }
                                  onChange={(e) => {
                                    // e.preventDefault();
                                    this.handleCounterSalesBillsSelection(
                                      v.id,
                                      v.sundry_debtors_id,
                                      e.target.checked
                                    );
                                    // eventBus.dispatch("page_change", {
                                    //   from: "tranx_sales_order_to_list",
                                    //   to: "tranx_sales_order_to_invoice",
                                    //   prop_data: v,
                                    //   isNewTab: false,
                                    // });
                                  }}
                                  // label={i + 1}
                                />
                              </Form.Group>
                            </td>
                            {/* <td>{v.sales_order_status}</td> */}
                            <td>{v.bill_no}</td>
                            <td>{v.referenceNo}</td>
                            <td>{moment(v.bill_date).format("DD-MM-YYYY")}</td>
                            {/* <td>{v.sale_account_name}</td> */}
                            {order_type == "core_product" ? (
                              <td style={{ width: "15%" }}>
                                {v.sundry_debtors_name}
                              </td>
                            ) : (
                              <td style={{ width: "15%" }}>
                                {v.customer_name}
                              </td>
                            )}

                            {/* <td style={{ width: "10%" }}>{v.mobileNo}</td>
                            <td style={{ width: "10%" }}>{v.advanceAmount}</td> */}

                            <td style={{ width: "15%" }}>
                              <p>{v.narration}</p>
                            </td>
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
                            {/* <td className="btn_align right_col"> */}
                            <td style={{ textAlign: "center" }}>
                              {/* {v.sales_order_status} */}
                              <Badge
                                bg={`${
                                  v.sales_order_status == "opened"
                                    ? "success"
                                    : v.sales_order_status == "closed"
                                    ? "danger"
                                    : null
                                }`}
                              >
                                {v.sales_order_status == "opened"
                                  ? "  Opened"
                                  : v.sales_order_status == "closed"
                                  ? "Closed"
                                  : null}
                              </Badge>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <img
                                src={print3}
                                className="delete-img"
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
                                className="delete-img"
                                title="Edit"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (v.sales_order_status == "closed") {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "info",
                                      title: "Info",
                                      msg: "Order is Closed, can't Edit!",
                                      is_button_show: true,
                                    });
                                    //to hide the notification after 1 second display and hide
                                    // setTimeout(function() {
                                    //   MyNotifications.fire({ show: false });
                                    // }, 1000);
                                  } else if (
                                    isActionExist(
                                      "sales-order",
                                      "edit",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_order_list",
                                      to: "tranx_sales_order_edit",
                                      // prop_data: v,
                                      prop_data: { prop_data: v, rowId: i },
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
                              ></img>
                              <img
                                src={delete_icon}
                                className="delete-img"
                                title="Delete"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (v.sales_order_status == "closed") {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "info",
                                      title: "Info",
                                      msg: "Order is Closed, can't Delete!",
                                      is_button_show: true,
                                    });
                                    //to hide the notification after 1 second display and hide
                                    // setTimeout(function() {
                                    //   MyNotifications.fire({ show: false });
                                    // }, 1000);
                                  }
                                  // this.deletesales(v.id);
                                  else if (
                                    isActionExist(
                                      "sales-order",
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
                                          this.deletesales(v.id);
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
                      {/* </div> */}
                      {salesInvoiceLst.length === 0 && (
                        <tr>
                          <td colSpan={11} className="text-center">
                            No Data Found
                          </td>
                          {showloader == true && LoadingComponent(showloader)}
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
                                  <th>Total Sales Order List :</th>
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
                            <span>Order:</span>
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

export default connect(mapStateToProps, mapActionsToProps)(TranxSalesOrderList);
