import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  Collapse,
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import moment from "moment";
import TableEdit from "@/assets/images/1x/editnew.png";
import {
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faChevronRight, faCalculator, faCirclePlus, faCircleQuestion, faFloppyDisk, faGear, faHouse, faPen, faPrint, faArrowUpFromBracket, faRightFromBracket, faTrash, faXmark
} from "@fortawesome/free-solid-svg-icons";

import Select from "react-select";
import {
  getSalesAccounts,
  getSundryDebtors,
  authenticationService,
  getSalesInvoiceList,
  getSalesCounterList,
  allListCounterSale,
  getLastSalesInvoiceNo,
  getInvoiceBill,
  delete_sales_invoice,
  delete_counter_sales,
} from "@/services/api_functions";
import print3 from "@/assets/images/print3.png";
import delete_icon from "@/assets/images/delete_icon3.png";
import search from "@/assets/images/search_icon@3x.png";
import refresh from "@/assets/images/refresh.png";

import {
  getSelectValue,
  AuthenticationCheck,
  MyDatePicker,
  getHeader,
  CustomDTHeader,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
  LoadingComponent,
  INRformat,
  MyTextDatePicker,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
class CounterSaleList extends React.Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.salesInvoiceRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      show: false,
      arrowToggle: true,
      opendiv: false,
      showDiv: false,
      showloader: false,
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      salesInvoiceLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      orgData: [],
      orgData1: [],
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      initVal: {
        sales_sr_no: 1,
        bill_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        bill_dt: new Date(),
        clientCodeId: "",
        clientNameId: "",
      },
      customerData: "",
      invoiceData: "",
      invoiceDetails: "",
      supplierData: "",
    };
  }

  setLastSalesSerialNo = () => {
    getLastSalesInvoiceNo()
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
  deleteCountersales = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_counter_sales(formData)
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

  // counter Sale List Without pagination start
  allListCounterSaleFun = () => {
    // reqData.append("sale_type", "counter_sale");
    // this.setState({ showloader: true });
    allListCounterSale()
      .then((response) => {
        let res = response.data;
        // console.log("res------->", res);
        if (res.responseStatus === 200) {
          console.log("result", res.list);
          this.setState(
            {
              salesInvoiceLst1: res.list,
              orgData1: res.list,
              showloader: false,
            },
            () => {
              this.salesInvoiceRef.current.setFieldValue("search", "");
            }
          );
          // console.log({ res });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst1: [] });
      });
  };

  // counter Sale List Without pagination end

  //start of counter sale list pagination
  lstSalesCounter = () => {
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
    getSalesCounterList(req)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus === 200) {
          console.log("result", res.responseObject.data);
          this.setState(
            {
              salesInvoiceLst: res.responseObject.data,
              orgData: res.responseObject.data,
              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
              currentPage:
                res.responseObject != null ? res.responseObject.page : 0,
              showloader: false,
            },
            () => {
              this.salesInvoiceRef.current.setFieldValue("search", "");
            }
          );
          // console.log({ res });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };
  //end of counter sale list pagination
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.lstSalesCounter();
    });
  };

  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.lstSalesCounter();
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
  //   getSalesCounterList(reqData).then((response) => {
  //     let res = response.data;
  //     if (res.responseStatus == 200) {
  //       this.setState(
  //         {
  //           salesInvoiceLst: res.data,
  //           orgData: res.data,
  //           showloader: false,
  //         },
  //         () => {
  //           this.salesInvoiceRef.current.setFieldValue("search", "");
  //         }
  //       );
  //     }
  //     console.log("res---->", res);
  //   });
  // };

  handleSearch = (vi) => {
    console.log("vi----->", { vi });
    let { orgData, orgData1 } = this.state;
    let orgData_F = orgData1.filter(
      (v) =>
        (v.invoice_no != null &&
          v.invoice_no.toLowerCase().includes(vi.toLowerCase())) ||
        moment(v.invoice_date).format("DD-MM-YYYY").includes(vi) ||
        (v.customer_name != null &&
          v.customer_name.toLowerCase().includes(vi.toLowerCase())) ||
        (v.narrations != null &&
          v.narrations.toLowerCase().includes(vi.toLowerCase())) ||
        (v.total_amount != null && v.total_amount.toString().includes(vi)) ||
        (v.taxable_amt != null && v.taxable_amt.toString().includes(vi)) ||
        (v.sales_return_no != null &&
          v.sales_return_no.toLowerCase().includes(vi.toLowerCase()))
    );
    console.log("orgDat_F", orgData_F);
    // this.setState({
    //   salesInvoiceLst: orgData_F.length > 0 ? orgData_F : [],
    // });
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

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "list");
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
          from: "tranx_sales_countersale_create",
          to: "tranx_sales_countersale_list",
          isNewTab: false,
        });
      }
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // this.lstSalesAccounts();
      // this.lstSundrydebtors();
      //this.lstSalesInvoice();
      this.lstSalesCounter();
      this.allListCounterSaleFun();
    }
  }

  callPrint = () => {
    var newWin = window.frames["printf"];
    var divToPrint = document.getElementById("printDiv");
    let data = divToPrint.outerHTML;
    let htmlToPrint = '<body onload="window.print()">';
    htmlToPrint +=
      "<style>@media print {" +
      "body {" +
      "width: 100%;" +
      // "margin: 0;" +
      // "color: #ffffff;" +
      // "background-color: #000000;" +
      "font-size: 18px;" +
      "margin-top: 0px;" +
      "page-break-after: auto;" +
      "font-family: monospace;" +
      "}" +
      ".outlet-header {" +
      "margin-top: 0px;" +
      "text-transform: uppercase;" +
      "font-weight: bold;" +
      "margin-bottom: 0px;" +
      "font-size: 18px;" +
      "text-align: center;" +
      "font-family: monospace;" +
      "}" +
      ".text-center {" +
      "text-align: center;" +
      "}" +
      ".text-end {" +
      "text-align: end;" +
      "}" +
      ".outlet-address {" +
      "word-wrap: break-word;" +
      "text-align: center;" +
      "font-style: italic;" +
      "font-weight: 500;" +
      "margin-bottom: 0;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "font-family: monospace;" +
      "}" +
      ".printtop {" +
      "border-bottom: 1px solid #333;" +
      "}" +
      ".support {" +
      "text-align: center;" +
      "word-wrap: break-word;" +
      "font-weight: 500;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "margin-bottom: 0 !important;" +
      "font-family: monospace;" +
      "}" +
      ".support1 {" +
      "font-size: 12px;" +
      // "text-align: center;" +
      "word-wrap: break-word;" +
      "margin-top: 2px;" +
      "margin-bottom: 0 !important;" +
      "font-family: monospace;" +
      // font-family: monospace;
      "}" +
      ".product-tbl {" +
      "margin-bottom: 0px;" +
      "margin-left: 0px;" +
      "width: 100%;" +
      "border: snow;" +
      "tbody {" +
      "font-weight: 600;" +
      "color: white;" +
      "font-family: monospace;" +
      "}" +
      "}" +
      ".th-style {" +
      "font-size: 12px;" +
      "font-weight: 500;" +
      "border-bottom: 1px solid #333;" +
      "text-align:start;" +
      // "font-family: monospace;" +
      "}" +
      ".borderTop {" +
      "border-top: 1px solid #333;" +
      "}" +
      ".td-style {" +
      "font-size: 12px;" +
      "text-align:start;" +
      "font-weight: 500;" +
      // "font-family: monospace;" +
      "}" +
      "}</style>";
    htmlToPrint += data;
    htmlToPrint += "</body>";
    newWin.document.write(htmlToPrint);
    newWin.document.close();
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
        if (
          isActionExist("counter-sales", "edit", this.props.userPermissions)
        ) {
          eventBus.dispatch("page_change", {
            from: "tranx_sales_countersale_list",
            to: "tranx_sales_countersale_edit",
            prop_data: selectedLedger,
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
      opendiv,
      supplierNameLst,
      supplierCodeLst,
      salesInvoiceLst,
      showDiv,
      initVal,
      customerData,
      invoiceData,
      invoiceDetails,
      supplierData,
      showloader,
      currentPage,
      totalRows,
      pages,
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
                    innerRef={this.salesInvoiceRef}
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
                        <Row>
                          <Col md="3">
                            <InputGroup className="mb-2 mdl-text">
                              <Form.Control
                                placeholder="Search"
                                // aria-label="Search"
                                // aria-describedby="basic-addon1"
                                // style={{ borderRight: "none" }}
                                onChange={(e) => {
                                  this.handleSearch(e.target.value);
                                }}
                                className="mdl-text-box"
                                autoFocus={true}
                              />
                              <InputGroup.Text
                                className="int-grp"
                                id="basic-addon1"
                                style={{ border: "1px solid #fff" }}
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
                                  id="d_start_date"
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
                                            this.lstSalesCounter();
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
                                            this.lstSalesCounter();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_start_date", "");
                                      this.setState(
                                        { startDate: e.target.value },
                                        () => {
                                          this.lstSalesCounter();
                                        }
                                      );
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
                                  id="d_end_date"
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
                                            this.lstSalesCounter();
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
                                            this.lstSalesCounter();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_end_date", "");
                                      // this.lstSalesCounter();
                                      this.setState(
                                        { endDate: e.target.value },
                                        () => {
                                          this.lstSalesCounter();
                                        }
                                      );
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col md="3" className=" text-end">
                            {/* {this.state.hide == 'true'} */}
                            {/* <Button
                            className="btn-refresh"
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              this.componentDidMount();
                            }}
                          >
                            <img src={refresh} alt="icon" />
                          </Button> */}
                            {!opendiv && (
                              <Button
                                className="create-btn "
                                id="TCSL_create_btn"
                                onClick={(e) => {
                                  e.preventDefault();

                                  if (
                                    isActionExist(
                                      "counter-sales",
                                      "create",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_invoice_list",
                                      to: "tranx_sales_countersale_create",
                                      prop_data: values,
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

              <Modal
                show={show}
                size="lg"
                className="mt-5 mainmodal"
                onHide={() => this.setState({ show: false })}
                // dialogClassName="modal-400w"
                // aria-labelledby="example-custom-modal-styling-title"
                aria-labelledby="contained-modal-title-vcenter"
              //centered
              >
                <Modal.Header
                  // closeButton
                  className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
                >
                  <Modal.Title
                    id="example-custom-modal-styling-title"
                    className=""
                  >
                    Sales Invoice
                  </Modal.Title>
                  <CloseButton
                    variant="white"
                    className="pull-right"
                    onClick={this.handleClose}
                  //onClick={() => this.handelPurchaseacModalShow(false)}
                  />
                </Modal.Header>
                <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
                  <div className="institute-head purchasescreen">
                    <Formik
                      validateOnChange={false}
                      validateOnBlur={false}
                      initialValues={initVal}
                      validationSchema={Yup.object().shape({
                        sales_sr_no: Yup.string()
                          .trim()
                          .required("Purchase no is required"),
                        transaction_dt: Yup.string().required(
                          "Transaction date is required"
                        ),
                        salesAccId: Yup.object().required(
                          "select sales account"
                        ),
                        // bill_no: Yup.string()
                        //   .trim()
                        //   .required('bill no is required'),
                        bill_dt: Yup.string().required("Bill dt is required"),
                        // clientCodeId: Yup.object().required("select client code"),
                        clientNameId:
                          Yup.object().required("select client name"),
                        transport: Yup.string(),
                        gr_lr: Yup.string(),
                        delivery_date: Yup.string(),
                        gr_lr_date: Yup.string(),
                        challan: Yup.string(),
                      })}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        // console.log('values', values);
                        // this.props.history.push({
                        //   pathname: '/SalesInvoiceCreate',
                        //   state: values,
                        // });
                        // window.electron.ipcRenderer.webPageChange({
                        //   from: "tranx_sales_invoice_list",
                        //   to: "tranx_sales_invoice_create",
                        //   prop_data: values,
                        //   isNewTab: false,
                        // });
                        eventBus.dispatch("page_change", {
                          from: "tranx_sales_countersale_list",
                          to: "tranx_sales_countersale_create",
                          // prop_data: values,
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
                        <Form onSubmit={handleSubmit} noValidate>
                          <Row>
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>
                                  Counter Sales Sr. #.{" "}
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
                            {/*}<Col md="3">
                            <Form.Group>
                              <Form.Label>
                                Transaction Date{' '}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="date"
                                className="pl-2"
                                name="transaction_dt"
                                id="transaction_dt"
                                onChange={handleChange}
                                value={values.transaction_dt}
                                isValid={
                                  touched.transaction_dt &&
                                  !errors.transaction_dt
                                }
                                isInvalid={!!errors.transaction_dt}
                                readOnly={true}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.transaction_dt}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col> */}
                            <Col md="3">
                              <Form.Group className="">
                                <Form.Label>
                                  Sales Acc.{" "}
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
                              <Form.Group>
                                <Form.Label>
                                  Invoice No.{" "}
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

                            <Col md="3">
                              <Form.Group>
                                <Form.Label>
                                  Invoice Date{" "}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                {/*}<Form.Control
                                type="date"
                                name="bill_dt"
                                id="bill_dt"
                                onChange={handleChange}
                                value={values.bill_dt}
                                // isValid={
                                //   touched.bill_dt && !errors.bill_dt
                                // }
                                // isInvalid={!!errors.bill_dt}
                                max={moment(new Date()).format('YYYY-MM-DD')}
                                // minLength={new Date()}
                              />*/}
                                <MyDatePicker
                                  name="bill_dt"
                                  id="bill_dt"
                                  className="newdate"
                                  // dateFormat="dd-MM-yyyy"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue("bill_dt", date);
                                  }}
                                  selected={values.bill_dt}
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                {errors.bill_dt}
                              </Form.Control.Feedback> */}
                                <span className="text-danger errormsg">
                                  {errors.bill_dt}
                                </span>
                              </Form.Group>
                            </Col>
                            {/* <Col md="3">
                            <Form.Group className="">
                              <Form.Label>
                                Client Code{" "}
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                              <Select
                                className="selectTo"
                                styles={customStyles}
                                isClearable
                                options={supplierCodeLst}
                                borderRadius="0px"
                                colors="#729"
                                name="clientCodeId"
                                onChange={(v) => {
                                  setFieldValue("clientCodeId", v);
                                  if (v != null) {
                                    setFieldValue(
                                      "clientNameId",
                                      getSelectValue(supplierNameLst, v.value)
                                    );
                                  }
                                }}
                                value={values.clientCodeId}
                              />

                              <span className="text-danger errormsg">
                                {errors.clientCodeId}
                              </span>
                            </Form.Group>
                          </Col> */}
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
                            <Col md="2">
                              <Form.Group>
                                <Form.Label>
                                  Salesman.{" "}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Salesman Name.."
                                  name="invoice_no"
                                  id="invoice_no"
                                  onChange={handleChange}
                                  value={values.invoice_no}
                                  isValid={
                                    touched.invoice_no && !errors.invoice_no
                                  }
                                  isInvalid={!!errors.invoice_no}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.invoice_no}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            <Col md="4">
                              <Form.Group>
                                <Form.Label>
                                  Sales Invoice Transport
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="transport"
                                  name="transportsdf"
                                  id="transportsdf"
                                  onChange={handleChange}
                                  //value={values.transport}
                                  isValid={
                                    touched.transport && !errors.transport
                                  }
                                  isInvalid={!!errors.transport}
                                // readOnly
                                />

                                <Form.Control.Feedback type="invalid">
                                  {errors.transport}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            <Col md="3">
                              <Form.Group>
                                <Form.Label>
                                  GR/LR
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="gr_lr"
                                  id="gr_lr"
                                  onChange={handleChange}
                                  // value={values.transport}
                                  isValid={touched.gr_lr && !errors.gr_lr}
                                  isInvalid={!!errors.gr_lr}
                                // readOnly/
                                />

                                <Form.Control.Feedback type="invalid">
                                  {errors.gr_lr}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            <Col md="3">
                              <Form.Group>
                                <Form.Label>
                                  GR/LR Date{" "}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                {/*}<Form.Control
                                type="date"
                                name="bill_dt"
                                id="bill_dt"
                                onChange={handleChange}
                                value={values.bill_dt}
                                // isValid={
                                //   touched.bill_dt && !errors.bill_dt
                                // }
                                // isInvalid={!!errors.bill_dt}
                                max={moment(new Date()).format('YYYY-MM-DD')}
                                // minLength={new Date()}
                              />*/}
                                <MyDatePicker
                                  name="gr_lr_date"
                                  id="gr_lr_date"
                                  className="newdate"
                                  // dateFormat="dd-MM-yyyy"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue("gr_lr_date", date);
                                  }}
                                  selected={values.gr_lr_date}
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                {errors.bill_dt}
                              </Form.Control.Feedback> */}
                                <span className="text-danger errormsg">
                                  {errors.gr_lr_date}
                                </span>
                              </Form.Group>
                            </Col>

                            <Col md="3">
                              <Form.Group>
                                <Form.Label>
                                  Challan
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="challan"
                                  id="challan"
                                  onChange={handleChange}
                                  // value={values.transport}
                                  isValid={touched.challan && !errors.challan}
                                  isInvalid={!!errors.challan}
                                // readOnly/
                                />

                                <Form.Control.Feedback type="invalid">
                                  {errors.challan}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            <Col md="3">
                              <Form.Group>
                                <Form.Label>
                                  Delivery Date{" "}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                {/*}<Form.Control
                                type="date"
                                name="bill_dt"
                                id="bill_dt"
                                onChange={handleChange}
                                value={values.bill_dt}
                                // isValid={
                                //   touched.bill_dt && !errors.bill_dt
                                // }
                                // isInvalid={!!errors.bill_dt}
                                max={moment(new Date()).format('YYYY-MM-DD')}
                                // minLength={new Date()}
                              />*/}
                                <MyDatePicker
                                  name="delivery_date"
                                  id="delivery_date"
                                  className="newdate"
                                  // dateFormat="dd-MM-yyyy"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue("delivery_date", date);
                                  }}
                                  selected={values.delivery_date}
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                {errors.bill_dt}
                              </Form.Control.Feedback> */}
                                <span className="text-danger errormsg">
                                  {errors.delivery_date}
                                </span>
                              </Form.Group>
                            </Col>

                            <Col md="2">
                              <div>
                                <Form.Label style={{ color: "#fff" }}>
                                  blank
                                  <br />
                                </Form.Label>
                              </div>

                              {/* <Link
                              to="/PurchaseInvoice"
                              className="nav-link anchorbtn"
                            >
                              Submit
                            </Link> */}
                              <Button className="createbtn" type="submit">
                                Submit
                              </Button>
                              {/* <Button className="alterbtn">Alter</Button> */}
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Modal.Body>
              </Modal>
              {/* {salesInvoiceLst.length > 0 && ( */}
              <>
                <div className="Tranx-tbl-list-style">
                  {isActionExist(
                    "counter-sales",
                    "list",
                    this.props.userPermissions
                  ) && (
                      <Table size="sm" className="tbl-font">
                        <thead>
                          {/* <div className="scrollbar_hd"> */}
                          <tr>
                            {/* <th style={{ width: "5%" }}>Sr. #.</th> */}
                            <th>
                              <div className="d-flex">
                                Counter No.
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
                            <th>
                              <div className="d-flex">
                                Counter Date
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
                            {/* <th>Sales Invoice Account</th> */}
                            <th>
                              <div className="d-flex">
                                Client Name
                                <div
                                  className="ms-2"
                                  onClick={() => this.handleSort("customer_name")}
                                >
                                  {this.state.sortedColumn === "customer_name" &&
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
                            <th>Narration</th>
                            {/* <th style={{ textAlign: "end" }}>Taxable Amount</th> */}
                            {/* <th style={{ textAlign: "end" }}>Tax Amount</th> */}
                            <th>
                              {" "}
                              <div
                                className="d-flex"
                                style={{ justifyContent: "end" }}
                              >
                                Total Amount
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
                            {/* <th className="btn_align ">Print</th> */}
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
                              document.getElementById("TCSL_create_btn").focus();
                            }
                            else if (e.keyCode != 9) {
                              this.handleTableRow(e);
                            }
                          }}
                        >
                          {/* <div className="scrollban_new"> */}

                          {salesInvoiceLst &&
                            salesInvoiceLst.map((v, i) => {
                              return (
                                <tr
                                  value={JSON.stringify(v)}
                                  id={`ledgerTr_` + i}
                                  // prId={v.id}
                                  tabIndex={i}
                                  onDoubleClick={(e) => {
                                    e.preventDefault();

                                    console.log("v---------->>>>", v);
                                    if (
                                      isActionExist(
                                        "counter-sales",
                                        "edit",
                                        this.props.userPermissions
                                      )
                                    ) {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_sales_countersale_list",
                                        to: "tranx_sales_countersale_edit",
                                        prop_data: v,
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
                                  <td>{v.invoice_no}</td>
                                  <td>
                                    {moment(v.invoice_date).format("DD-MM-YYYY")}
                                  </td>
                                  {/* <td>{v.sale_account_name}</td> */}
                                  <td>{v.customer_name}</td>
                                  <td>
                                    <p>{v.narrations}</p>
                                  </td>
                                  {/* <td className="btn_align right_col"> */}
                                  {/* <td style={{ textAlign: "end" }}>
                                  {parseFloat(v.taxable_amt).toFixed(2)}
                                </td> */}
                                  {/* <td style={{ textAlign: "end" }}>
                                  {parseFloat(v.gst).toFixed(2)}
                                </td> */}
                                  <td style={{ textAlign: "end" }}>
                                    {/* {parseFloat(v.total_amount).toFixed(2)} */}
                                    {INRformat.format(v.total_amount)}
                                  </td>
                                  {/* <td className="btn_align right_col"> */}
                                  {/* <td style={{ width: "5%", textAlign: "center" }}>
                                <img
                                  src={print3}
                                  className="delete-img"
                                  title="Print"
                                  onClick={(e) => {
                                    e.preventDefault();

                                    this.getInvoiceBillsLstPrint(v.id);
                                  }}
                                ></img>
                              </td> */}
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
                                    {/* </Button> */}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <img
                                      src={TableEdit}
                                      className="delete-img"
                                      title="Edit"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        console.log("v---------->>>>", v);
                                        if (
                                          isActionExist(
                                            "counter-sales",
                                            "edit",
                                            this.props.userPermissions
                                          )
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "tranx_sales_countersale_list",
                                            to: "tranx_sales_countersale_edit",
                                            prop_data: v,
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
                                              this.deleteCountersales(v.id);
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
                            })}
                          {salesInvoiceLst.length === 0 && (
                            <tr>
                              <td colSpan={9} className="text-center">
                                No Data Found
                              </td>
                              {showloader == true && LoadingComponent(showloader)}
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
                                    {/* <th>&nbsp;</th>
                                    <th>Total Counter Sale List :</th>
                                    {/* <th>{salesInvoiceLst.length}</th>
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
                              <span>Counter Sale:</span>
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
                <iframe id="printf" name="printf" className="d-none"></iframe>
                <div id="printDiv" className="d-none">
                  <div className="printtop">
                    {/* <h4>{companyData.outletName} </h4> */}
                    <p className="outlet-address">INVOICE</p>
                    <p className="outlet-header">
                      {supplierData && supplierData.company_name}
                    </p>
                    <p className="outlet-address">
                      {supplierData && supplierData.company_address}
                    </p>
                    {/* <p className="outlet-address">UDYOG BANK SEVEK SOCIETY,</p>
            <p className="outlet-address">NORTH SOLAPUR-413005</p> */}
                  </div>
                  <div className="printtop">
                    <p className="support1">
                      Customer :{customerData && customerData.supplier_name}
                    </p>

                    <p className="support1">
                      Mob No:{customerData && customerData.supplier_phone} Bill
                      No:
                      {invoiceData && invoiceData.invoice_no}
                    </p>
                    <p className="support1">
                      Times : 15:33 &nbsp;&nbsp;&nbsp;&nbsp; Date :
                      {invoiceData && invoiceData.invoice_dt}
                    </p>
                  </div>
                  {/* <Table className="product-tbl">
                  <thead>
                    <tr>
                      <th className="th-style">Items</th>
                      <th className="th-style">Qty</th>
                      <th className="th-style">Rate</th>
                      <th className="th-style">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="printtop">
                    {invoiceDetails &&
                      invoiceDetails.map((v) => {
                        return (
                          <tr>
                            <td className="td-style">
                              <p className="mb-0">{v.product_name}</p>
                            </td>
                            <td className="td-style">
                              <p className="mb-0">{v.units[0].qty}</p>
                            </td>
                            <td className="td-style">
                              <p className="mb-0">{v.units[0].rate}.00</p>
                            </td>
                            <td className="td-style">
                              <p className="mb-0">{v.units[0].base_amt}.00</p>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <thead>
                    <tr>
                      <th className="th-style borderTop">
                        <p className="mb-0">
                          Item Qty: {invoiceDetails && invoiceDetails.length}
                        </p>
                      </th>
                      <th className="th-style borderTop">
                        <p className="mb-0">Total:</p>
                      </th>
                      <th className="th-style borderTop" colSpan={2}>
                        <p className="mb-0 text-center">
                          {invoiceData && invoiceData.net_amount}.00
                        </p>
                      </th>
                    </tr>
                    <tr>
                      <th className="th-style" colSpan={2}>
                        <p className="mb-0 text-center">You Have Saved</p>
                      </th>
                      <th className="th-style" colSpan={2}>
                        <p className="mb-0 text-center">
                          {invoiceData && invoiceData.total_discount}.00
                        </p>
                      </th>
                    </tr>
                    <tr>
                      <th className="th-style" colSpan={2}>
                        <p className="mb-0 text-center">NET AMOUNT</p>
                      </th>
                      <th className="th-style" colSpan={2}>
                        <p className="mb-0 text-center">
                          {invoiceData && invoiceData.total_amount}.00
                        </p>
                      </th>
                    </tr>
                  </thead>
                </Table> */}
                  <Table className="product-tbl">
                    <thead>
                      <tr>
                        <th className="th-style">Items</th>
                        <th className="th-style"></th>
                        <th className="th-style"></th>
                        <th className="th-style"></th>
                        {/* <th className="th-style">GST</th>
                    <th className="th-style">Package</th>
                    <th className="th-style">Units</th> */}
                        <th className="th-style">Qty</th>
                        <th className="th-style">Rate</th>
                        <th className="th-style">Amount</th>
                      </tr>
                    </thead>
                    {/* {JSON.stringify(invoiceDetails, undefined, 2)} */}
                    <tbody className="printtop">
                      {invoiceDetails &&
                        invoiceDetails.map((v, i) => {
                          return (
                            v.productDetails &&
                            v.productDetails.map((vi, ii) => {
                              return (
                                <tr>
                                  <td className="td-style">
                                    <p className="mb-0">{v.product_name}</p>
                                  </td>

                                  {v.productDetails.length > 0 ? (
                                    <>
                                      {/* <td className="td-style">
                                    <p className="mb-0">
                                      {vi.Gst ? vi.Gst : ""}
                                    </p>
                                  </td>
                                  <td className="td-style">
                                    <p className="mb-0">
                                      {vi.package_id
                                        ? vi.package_id.pack_name
                                        : ""}
                                    </p>
                                  </td>
                                  <td className="td-style">
                                    <p className="mb-0">
                                      {vi.unitId ? vi.unitId.label : ""}
                                    </p>
                                  </td> */}
                                      <td className="td-style"></td>
                                      <td className="td-style"></td>
                                      <td className="td-style"></td>

                                      <td className="td-style">
                                        <p className="mb-0">{vi.qty}</p>
                                      </td>
                                      <td className="td-style">
                                        <p className="mb-0">{vi.rate}.00</p>
                                      </td>
                                      <td className="td-style">
                                        <p className="mb-0">{vi.base_amt}.00</p>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      {/* <td className="td-style">
                                        <p className="mb-0">
                                          {v.productDetails[0].qty}
                                        </p>
                                      </td>
                                      <td className="td-style">
                                        <p className="mb-0">
                                          {v.productDetails[0].rate}.00
                                        </p>
                                      </td>
                                      <td className="td-style">
                                        <p className="mb-0">
                                          {v.productDetails[0].base_amt}.00
                                        </p>
                                      </td> */}
                                    </>
                                  )}
                                </tr>
                              );
                            })
                          );
                        })}
                    </tbody>
                    <thead>
                      <tr>
                        <th className="th-style borderTop">
                          <p className="mb-0">
                            Item Qty: {invoiceDetails && invoiceDetails.length}
                          </p>
                        </th>
                        <th className="th-style borderTop" colSpan={5}>
                          <p className="mb-0 text-end">Total :</p>
                        </th>
                        {/* <th className="th-style borderTop" colSpan={4}></th> */}
                        <th className="th-style borderTop">
                          <p className="mb-0 text-start">
                            {invoiceData && invoiceData.net_amount}.00
                          </p>
                        </th>
                      </tr>
                      <tr>
                        <th className="th-style" colSpan={6}>
                          <p className="mb-0 text-end">You Have Saved :</p>
                        </th>
                        {/* <th className="th-style" colSpan={4}></th> */}
                        <th className="th-style">
                          <p className="mb-0 text-start">
                            {invoiceData && invoiceData.total_discount}.00
                          </p>
                        </th>
                      </tr>
                      <tr>
                        <th className="th-style" colSpan={6}>
                          <p className="mb-0 text-end">NET AMOUNT :</p>
                        </th>
                        {/* <th className="th-style" colSpan={4}></th> */}
                        <th className="th-style">
                          <p className="mb-0 text-start">
                            {invoiceData && invoiceData.total_amount}.00
                          </p>
                        </th>
                      </tr>
                    </thead>
                  </Table>
                  <div>
                    <p className="outlet-address">For UPAHAR COOKIES & CAKES</p>
                    <p className="outlet-address">
                      !!! Thanks !!! Visit Again !!!
                    </p>
                  </div>
                </div>
              </>
              {/* )} */}
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

export default connect(mapStateToProps, mapActionsToProps)(CounterSaleList);
