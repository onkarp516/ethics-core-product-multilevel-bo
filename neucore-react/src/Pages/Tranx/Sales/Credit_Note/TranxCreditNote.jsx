import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  getSalesAccounts,
  getSundryDebtors,
  getTranxCreditNoteLast,
  getTranxCreditNoteListInvoiceBillSC,
  getTranxSalesReturnLst,
  getallSalesReturn,
  delete_sales_return,
  getSalesReturnBill,
} from "@/services/api_functions";

import delete_icon from "@/assets/images/delete_icon 3.png";
import TableEdit from "@/assets/images/1x/editnew.png";
import print3 from "@/assets/images/print3.png";
import {
  faArrowDown,
  faArrowUp,
  faChevronRight,
  faChevronLeft, faCalculator, faCirclePlus, faCircleQuestion, faFloppyDisk, faGear, faHouse, faPen, faPrint, faArrowUpFromBracket, faRightFromBracket, faTrash, faXmark

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import search from "@/assets/images/search_icon@3x.png";
import refresh from "@/assets/images/refresh.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  AuthenticationCheck,
  eventBus,
  isActionExist,
  MyNotifications,
  INRformat,
  MyTextDatePicker,
} from "@/helpers";
class TranxCreditNote extends Component {
  constructor(props) {
    super(props);
    this.salesOrderRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      show: false,
      arrowToggle: true,
      orgData: [],
      orgData1: [],
      opendiv: false,
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      data: [],
      salesInvoiceRtnLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      showloader: false,
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      initVal: {
        credit_note_sr: 1,
        transaction_dt: moment().format("YYYY-MM-DD"),
        salesId: "",
        invoice_no: "",
        invoice_dt: "",
        to_date: "",
        supplierCodeId: "",
        supplierNameId: "",
        sales_return_invoice: "",
        outstanding: "",
      },

      invoiceLstSC: [],
      selected_values: "",
      lst_products: [],
    };
  }

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
            return {
              label: v.name,
              value: v.id,
              code: v.ledger_code,
              state: v.state,
              ledger_balance: v.ledger_balance,
              ledger_balance_type: v.ledger_balance_type,
            };
          });
          let codeopt = res.list.map((v, i) => {
            return {
              label: v.ledger_code,
              value: v.id,
              name: v.name,
              state: v.state,
              ledger_balance: v.ledger_balance,
              ledger_balance_type: v.ledger_balance_type,
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
  handleSearch = (vi) => {
    // debugger;
    let { orgData, orgData1 } = this.state;
    console.log({ orgData1 });
    let orgData_F = orgData1.filter(
      (v) =>
        (v.sales_return_no != null &&
          v.sales_return_no.toString().includes(vi)) ||
        (v.invoice_no != null &&
          v.invoice_no.toLowerCase().includes(vi.toLowerCase())) ||
        (v.sundry_debtor_name != null &&
          v.sundry_debtor_name.toLowerCase().includes(vi.toLowerCase())) ||
        (v.narration != null && v.narration.toLowerCase().includes(vi)) ||
        (v.taxable_amt != null &&
          v.taxable_amt.toString().includes(vi.toString())) ||
        (v.taxable_amt != null && v.taxable_amt.toString().includes(vi)) ||
        (v.tax_amt != null && v.tax_amt.toString().includes(vi)) ||
        (v.total_amount != null && v.total_amount.toString().includes(vi))

      // v.sales_return_no != null && v.sales_return_no.toLowerCase().includes(vi.toLowerCase()) ||
      // v.invoice_no != null && v.invoice_no.toLowerCase().includes(vi.toLowerCase()) ||
      // // moment(v.invoice_date).format("DD-MM-YYYY").includes(vi) ||
      // v.sundry_debtor_name != null && v.sundry_debtor_name.toLowerCase().includes(vi.toLowerCase()) ||
    );
    if (vi.length == 0) {
      this.setState({
        salesInvoiceRtnLst: orgData,
      });
    } else {
      this.setState({
        salesInvoiceRtnLst: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  getallSalesReturnFun = () => {
    getallSalesReturn()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ orgData1: res.data }, () => {
            this.salesOrderRef.current.setFieldValue("search", "");
          });
          // setTimeout(() => {
          //   if (this.props.block.prop_data.rowId) {
          //     document
          //       .getElementById("TCNTr_" + this.props.block.prop_data.rowId)
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
        this.setState({ salesInvoiceRtnLst1: [] });
      });
  };

  //start of sales return list with pagination
  lstSalesInvoiceRtn = () => {
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
    getTranxSalesReturnLst(req)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              salesInvoiceRtnLst: res.responseObject.data,
              orgData: res.responseObject.data,
              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
              currentPage:
                res.responseObject != null ? res.responseObject.page : 0,
            },
            () => {
              this.salesOrderRef.current.setFieldValue("search", "");
            }
          );
          setTimeout(() => {
            if (this.props.block.prop_data.rowId) {
              document.getElementById("TCNTr_" + this.props.block.prop_data.rowId).focus();
            }
            else if (this.props.block.prop_data.isCreate) {
              document.getElementById("TCNTr_0").focus();
            } else if (document.getElementById("SearchTCN") != null) {
              {
                document.getElementById("SearchTCN").focus();
              }
            }
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceRtnLst: [] });
      });
  };
  goToNextPage = () => {
    // not yet implemented
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.lstSalesInvoiceRtn();
    });
  };

  goToPreviousPage = () => {
    // not yet implemented
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.lstSalesInvoiceRtn();
    });
  };
  //end of sales return list with pagination

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
  //   getTranxSalesReturnLst(reqData).then((response) => {
  //     let res = response.data;
  //     if (res.responseStatus == 200) {
  //       this.setState(
  //         {
  //           salesInvoiceRtnLst: res.data,
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

  setLastCreditNoteNo = () => {
    getTranxCreditNoteLast()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;

          initVal["credit_note_sr"] = res.count;
          initVal["sales_return_invoice"] = res.salesReturnNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleSubmitSCList = (value) => {
    console.log("value", value);
    this.setState({ initVal: value });

    let reqData = new FormData();
    reqData.append("sundry_debtors_id", value.supplierCodeId.value);
    getTranxCreditNoteListInvoiceBillSC(reqData)
      .then((response) => {
        // console.log('before response', response);
        let res = response.data;
        if (res.responseStatus === 200) {
          // console.log('response', response);
          let lst = res.data;
          if (lst.length > 0) {
            this.setState({
              invoiceLstSC: lst,
              selected_values: value,
              show: true,
            });
          } else {
            // ShowNotification("Error", "Data not found");
            MyNotifications.fire({
              show: true,
              icon: "Error",
              title: "SuccessFul",
              msg: "Error,Data not found",
              is_button_show: true,
            });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleRowClick = (v) => {
    let prop_data = {
      returnIntiVal: this.state.initVal,
      returnData: v,
    };

    eventBus.dispatch("page_change", {
      from: "tranx_credit_note_list",
      to: "tranx_credit_note_product_list",
      isNewTab: false,
      prop_data: prop_data,
    });
  };

  deletesales = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_sales_return(formData)
      .then((response) => {
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
          // resetForm();
          // this.initRow();
          this.componentDidMount();
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  pageReload() {
    if (AuthenticationCheck()) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      // this.lstSalesAccounts();
      // this.lstSundrydebtors();
      // this.setLastCreditNoteNo();
      this.getallSalesReturnFun();

      this.lstSalesInvoiceRtn();
      // this.setLastCreditNoteNo();
    }
  }

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

        if (isActionExist("sales-return", "edit", this.props.userPermissions)) {
          eventBus.dispatch("page_change", {
            from: "tranx_credit_note_list",
            to: "tranx_credit_note_edit",
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

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "list");
    reqData.append("source", "sales_return");
    getSalesReturnBill(reqData).then((response) => {
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
          to: "tranx_credit_note_list",

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
    let { salesInvoiceRtnLst, sortedColumn, sortOrder } = this.state;

    let sortedData = [...salesInvoiceRtnLst];
    if (sortOrder == "asc") {
      sortedData.sort((a, b) => (a[sortedColumn] > b[sortedColumn] ? 1 : -1));
    } else {
      sortedData.sort((a, b) => (a[sortedColumn] < b[sortedColumn] ? 1 : -1));
    }

    this.setState({
      salesInvoiceRtnLst: sortedData,
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
      invoiceLstSC,
      salesInvoiceRtnLst,
      currentPage,
      pages,
      totalRows,
    } = this.state;
    return (
      <>
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
                              document.getElementById("TCNTr_0")?.focus();
                            }
                          }}>
                          <Col md="3">
                            <div className="">
                              <InputGroup className="mb-2 mdl-text">
                                <Form.Control
                                  placeholder="Search"
                                  // id="SearchTCN" @mayur id commented
                                  className="mdl-text-box"
                                  autoFocus="true"
                                  onChange={(e) => {
                                    this.handleSearch(e.target.value);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      document.getElementById("d_start_dateCN")?.focus();
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
                                  id="d_start_dateCN"
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
                                            this.lstSalesInvoiceRtn();
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
                                            this.lstSalesInvoiceRtn();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_start_date", "");
                                      this.setState(
                                        { startDate: e.target.value },
                                        () => {
                                          this.lstSalesInvoiceRtn();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      document.getElementById("d_end_dateCN")?.focus();
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
                                  id="d_end_dateCN"
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
                                            this.lstSalesInvoiceRtn();
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
                                            this.lstSalesInvoiceRtn();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_end_date", "");
                                      // this.lstSalesInvoiceRtn();
                                      this.setState(
                                        { endDate: e.target.value },
                                        () => {
                                          this.lstSalesInvoiceRtn();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      document.getElementById("TCNL_create_btn")?.focus();
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col md="3" className=" text-end">
                            {/* <Button
                    className="ml-2 btn-refresh"
                    type="button"
                    onClick={() => {
                      this.pageReload();
                    }}
                  >
                    <img src={refresh} alt="icon" />
                  </Button> */}
                            {!opendiv && (
                              <Button
                                className="create-btn mr-2"
                                id="TCNL_create_btn"
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   this.setState({ opendiv: !opendiv });
                                // }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    isActionExist(
                                      "sales-invoice",
                                      "create",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_credit_note_list",
                                      to: "tranx_credit_note_product_list",
                                      // prop_data: values,
                                      isNewTab: false,
                                    });
                                    this.setLastCreditNoteNo();
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
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Row>
              )}
              {/* {salesInvoiceRtnLst.length > 0 && ( */}
              <div className="Tranx-tbl-list-style">
                {isActionExist(
                  "sales-return",
                  "list",
                  this.props.userPermissions
                ) && (
                    <Table size="sm" className="tbl-font">
                      <thead>
                        {/* <div className="scrollbar_hd"> */}
                        <tr>
                          {/* <th style={{ width: "5%" }}>Sr. #.</th> */}
                          <th>Sales Return No.</th>
                          <th>
                            <div className="d-flex">
                              Tranx Date
                              <div
                                className="ms-2"
                                onClick={() =>
                                  this.handleSort("transaction_date")
                                }
                              >
                                {this.state.sortedColumn === "transaction_date" &&
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
                              Ref. Invoice
                              <div
                                className="ms-2"
                                onClick={() => this.handleSort("invoice_no")}
                              >
                                {this.state.sortedColumn === "invoice_no" &&
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

                          <th style={{ width: "17%" }}>
                            <div className="d-flex">
                              Supplier Name
                              <div
                                className="ms-2"
                                onClick={() =>
                                  this.handleSort("sundry_debtor_name")
                                }
                              >
                                {this.state.sortedColumn ===
                                  "sundry_debtor_name" &&
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

                          <th style={{ textAlign: "center", width: "4%" }}>
                            Print
                          </th>
                          <th style={{ textAlign: "center" }}>Action</th>
                          {/* <th className="btn_align right_col">Total Amount</th> */}
                        </tr>
                        {/* </div> */}
                      </thead>
                      <tbody
                        style={{ borderTop: "2px solid transparent" }}
                        className="prouctTableTr tabletrcursor"
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (e.shiftKey && e.keyCode == 9) {
                            document.getElementById("TCNL_create_btn").focus();
                          }
                          if (e.keyCode != 9) {
                            this.handleTableRow(e);
                          }
                        }}
                      >
                        {/* <div className="scrollban_new"> */}
                        {salesInvoiceRtnLst.length > 0 ? (
                          salesInvoiceRtnLst.map((v, i) => {
                            return (
                              <tr
                                value={JSON.stringify(v)}
                                id={`TCNTr_` + i}
                                // prId={v.id}
                                tabIndex={i}
                                onDoubleClick={(e) => {
                                  e.preventDefault();

                                  console.log("v---------->>>>", v);
                                  if (
                                    isActionExist(
                                      "sales-return",
                                      "edit",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_credit_note_list",
                                      to: "tranx_credit_note_edit",
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
                                {/* <td style={{ width: "3%" }}>{i + 1}</td> */}
                                <td>{v.sales_return_no}</td>
                                <td>
                                  {moment(v.transaction_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>

                                <td>{v.invoice_no}</td>
                                <td style={{ width: "17%" }}>
                                  {v.sundry_debtor_name}
                                </td>

                                {/* <td className="btn_align right_col">
                            {v.total_amount}
                          </td> */}
                                <td style={{ width: "15%" }}>
                                  <p> {v.narration}</p>
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

                                <td style={{ textAlign: "center", width: "4%" }}>
                                  <img
                                    src={print3}
                                    className="mdl-icons"
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
                                    className="mdl-icons"
                                    title="Edit"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      console.log("v---------->>>>", v);
                                      if (
                                        isActionExist(
                                          "sales-return",
                                          "edit",
                                          this.props.userPermissions
                                        )
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "tranx_credit_note_list",
                                          to: "tranx_credit_note_edit",
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
                                      // this.deletesales(v.id);
                                      if (
                                        isActionExist(
                                          "sales-return",
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
                                            handleFailFn: () => { },
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
                          })
                        ) : (
                          <tr>
                            <td colSpan={9} className="text-center">
                              No Data Found
                            </td>
                          </tr>
                        )}
                        {/* </div> */}
                      </tbody>
                      {/* <thead className="tbl-footer mb-2">
                        <tr>
                          <th
                            colSpan={9}
                            className=""
                            style={{ borderTop: " 2px solid transparent" }}
                          >
                            {Array.from(Array(1), (v) => {
                              return (
                                <tr>
                                  <th>Total Sales Return List :</th>
                                  <th>{salesInvoiceRtnLst.length}</th>
                                </tr>
                              );
                            })}
                          </th>
                        </tr>
                      </thead> */}
                    </Table>
                  )}
              </div>

              <Row className="mx-0 btm-rows-btn1">
                <Col md="10" className="my-auto">
                  {/* <Row>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+A</span>
                          </Form.Label>
                        </Col>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">F2</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+E</span>
                          </Form.Label>
                        </Col>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+S</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+D</span>
                          </Form.Label>
                        </Col>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faXmark} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+C</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Alt+C</span>
                          </Form.Label>
                        </Col>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">F11</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+Z</span>
                          </Form.Label>
                        </Col>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+P</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Export</span>
                          </Form.Label>
                        </Col>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
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
                            <span>Return:</span>
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

        <Modal
          show={show}
          size="lg"
          className="mt-5 invoice-mdl-style"
          onHide={() => this.setState({ show: false })}
          aria-labelledby="contained-modal-title-vcenter"
          animation={false}
        >
          <Modal.Header
            closeButton
            // closeVariant="white"
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Credit Note
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="table_wrapper">
              {invoiceLstSC.length > 0 && (
                <Table hover size="sm" className="tbl-font">
                  <thead>
                    <tr className="text-left">
                      <th>Sr.</th>
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
                          <td>{i + 1}</td>
                          <td>{v.invoice_no}</td>

                          <td>{moment(v.invoice_date).format("DD/MM/YYYY")}</td>
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

export default connect(mapStateToProps, mapActionsToProps)(TranxCreditNote);
