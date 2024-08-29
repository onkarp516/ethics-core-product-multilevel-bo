import React from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  InputGroup,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";
import refresh from "@/assets/images/refresh.png";
import print3 from "@/assets/images/print3.png";
import search from "@/assets/images/search_icon@3x.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import Select from "react-select";
import Edit from "@/assets/images/Edit.png";
import scan_existing from "@/assets/images/scan_existing.svg";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getPurchaseInvoiceList,
  AllListPurchaseInvoice,
  getLastPurchaseInvoiceNo,
  delete_purchase_invoices,
  getPurchaseInvoiceBill,
  getPurchaseInvoiceById,
} from "@/services/api_functions";

import {
  getSelectValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
  transSelectTo,
  LoadingComponent,
  MyTextDatePicker,
  INRformat,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import delete_icon from "@/assets/images/delete_icon3.png";

import {
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faChevronRight,
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
import {
  faPlusCircle,
  faArrowRightArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

class TranxPurchaseInvoiceList extends React.Component {
  constructor(props) {
    super(props);
    this.purInvoiceRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      arrowToggle: true,
      opendiv: false,
      showDiv: true,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      orgData: [],
      showloader: true,
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      barcodeModal: false, // Initial state for the modal
      initVal: {
        pi_sr_no: 1,
        pi_no: 1,
        pi_transaction_dt: new Date(),
        pi_invoice_dt: "",
        purchaseId: "",
        //supplier_Code: "",
        supplierNameId: "",
      },
      barcodePurchaseInvoiceData: [],
    };

    this.myRef = React.createRef();
  }

  lstPurchaseInvoiceProducts = (invoiceNumber) => {
    let reqData = new FormData();
    reqData.append("id", invoiceNumber);

    getPurchaseInvoiceById(reqData).then((response) => {
      let responseData = response.data;
      if (responseData != null) {
        console.log("Barcode : ", JSON.stringify(responseData));
        this.setState({
          barcodePurchaseInvoiceData: responseData.barcode_list,
        });
      }
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
  AllListPurchaseInvoiceFun = () => {
    this.setState({ showloader: true });
    AllListPurchaseInvoice()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              purchaseInvoiceLst1: res.data,
              orgData1: res.data,
              showloader: false,
            },
            () => {
              this.purInvoiceRef.current.setFieldValue("search", "");
            }
          );
          // setTimeout(() => {
          //   if (this.props.block.prop_data.rowId) {
          //     document
          //       .getElementById("TPILTr_" + this.props.block.prop_data.rowId)
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
        this.setState({ purchaseInvoiceLst: [] });
      });
  };

  //Start of purchase Invoice list with pagination
  lstPurchaseInvoice = () => {
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

    getPurchaseInvoiceList(req)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              purchaseInvoiceLst: res.responseObject.data,
              orgData: res.responseObject.data,
              showloader: false,
              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
              currentPage:
                res.responseObject != null ? res.responseObject.page : 0,
            },
            () => {
              this.purInvoiceRef.current.setFieldValue("search", "");
            }
          );

          // console.log("iscreate", this.props.block.prop_data.iscreate);
          // console.log("this.state.totalRows", this.state.totalRows);
          setTimeout(() => {
            if (this.props.block.prop_data.rowId) {
              document
                .getElementById("TPILTr_" + this.props.block.prop_data.rowId)
                .focus();
            } else if (this.props.block.prop_data.rowId == 0) {
              document
                .getElementById("TPILTr_0")
                .focus();
            }
            else if (this.props.block.prop_data.isCreate) {

              document.getElementById(`TPILTr_0`)?.focus();
            } else if (document.getElementById("SearchTPIL") != null) {
              {
                document.getElementById("SearchTPIL").focus();
              }
            }
          }, 1500);
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  //End of purchase Invoice list with pagination
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.lstPurchaseInvoice();
    });
  };

  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.lstPurchaseInvoice();
    });
  };

  // getlstLedgerTranxDetailsReportsPageLoad = (value) => {
  //   // debugger;
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

  //   getPurchaseInvoiceList(reqData).then((response) => {
  //     let res = response.data;
  //     if (res.responseStatus == 200) {
  //       this.setState(
  //         {
  //           purchaseInvoiceLst: res.data,
  //           orgData: res.data,
  //           showloader: false,
  //         },
  //         () => {
  //           this.purInvoiceRef.current.setFieldValue("search", "");
  //         }
  //       );
  //     }
  //     console.log("res---->", res);
  //   });
  // };
  // deletepurchase = (id) ={
  //   let formData = new FormData();
  //   formData.append("id", id);

  //     delete_purchase_invoices()
  //     .then((response) => {

  //   })
  // };

  deletepurchase = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_purchase_invoices(formData)
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

  handleSearch = (vi) => {
    console.log("vi---------------->", vi);
    let { orgData, orgData1 } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        (v.invoice_no != null &&
          v.invoice_no.toLowerCase().includes(vi.toLowerCase())) ||
        // moment(v.transaction_date).format("DD-MM-YYYY").includes(vi) ||
        moment(v.invoice_date).format("DD-MM-YYYY").includes(vi) ||
        (v.purchase_account_name != null &&
          v.purchase_account_name.toLowerCase().includes(vi.toLowerCase())) ||
        (v.sundry_creditor_name != null &&
          v.sundry_creditor_name.toLowerCase().includes(vi.toLowerCase())) ||
        (v.narration != null && v.narration.toLowerCase().includes(vi)) ||
        (v.tax_amt != null && v.tax_amt.toString().includes(vi)) ||
        (v.taxable_amt != null && v.taxable_amt.toString().includes(vi)) ||
        (v.total_amount != null && v.total_amount.toString().includes(vi))
      // ||
      // v.total_amount.toLowerCase().includes(vi.toLowerCase())
    );
    if (vi.length == 0) {
      this.setState({
        purchaseInvoiceLst: orgData,
      });
    } else {
      this.setState({
        purchaseInvoiceLst: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };
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
  lstSundryCreditors = () => {
    getSundryCreditors()
      .then((response) => {
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
              value: v.id,
              code: v.ledger_code,
              state: stateCode,
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

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "list");
    reqData.append("source", "purchase_invoice");
    getPurchaseInvoiceBill(reqData).then((response) => {
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
          from: "tranx_purchase_invoice_create",
          to: "tranx_purchase_invoice_list",
          isNewTab: false,
        });
      }
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  OpenPurchaseInvoiceCreate = (e) => {
    // eventBus.dispatch("page_change", "tranx_purchase_invoice_create");
    eventBus.dispatch("page_change", {
      to: "tranx_purchase_invoice_create",
      from: "tranx_purchase_invoice_list",
      isNewTab: true,
    });
  };

  handleKeyPress = (event) => {
    if (event.key === "F2") {
      event.preventDefault();
      this.OpenPurchaseInvoiceCreate();
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      //  this.lstPurchaseAccounts();
      // this.lstSundryCreditors();
      // this.AllListPurchaseInvoiceFun();
      this.lstPurchaseInvoice();
      document.addEventListener("keydown", this.handleKeyPress);
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount Called");
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  componentWillReceiveProps(next, state) {
    // console.log("INVOICE LIST  next", next);
    // console.log("INVOICE LIST  state", state);
    // console.log("INVOICE LIST CWRP=>", this.props);
  }

  componentDidUpdate() {
    // console.log("INVOICE LIST  CDU =-> ", this.props);
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
        if (
          isActionExist("purchase-invoice", "edit", this.props.userPermissions)
        ) {
          eventBus.dispatch("page_change", {
            from: "tranx_purchase_invoice_list",
            to: "tranx_purchase_invoice_edit",
            // prop_data: selectedLedger,
            prop_data: { prop_data: selectedLedger, rowId: index, edit: true },
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
  toggleBarcodeModal = () => {
    this.setState((prevState) => ({
      barcodeModal: !prevState.barcodeModal,
    }));
  };
  handleAsceDesc = (invoice_data, asce) => {
    let reqData = new FormData();
    reqData.append("column", invoice_data);
    reqData.append("type", asce);
    getPurchaseInvoiceBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        console.log("responseData print ---->>>", responseData);
        //   eventBus.dispatch("page_change", {
        //     from: "tranx_purchase_invoice_create",
        //     to: "tranx_purchase_invoice_list",
        //     isNewTab: false,
        //   });
      }
    });
  };

  render() {
    const {
      show,
      arrowToggle,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      showloader,
      initVal,
      showDiv,
      opendiv,
      barcodeModal,
      barcodePurchaseInvoiceData,
      totalRows,
      currentPage,
      pages,
      iscreate,
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
                    innerRef={this.purInvoiceRef}
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
                      <Form autoComplete="off">
                        <Row onKeyDown={(e) => {
                          if (e.keyCode === 40) {
                            e.preventDefault();
                            document.getElementById("TPILTr_0")?.focus();
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
                              <InputGroup
                                className="mdl-text mb-2"
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13)
                                    document
                                      .getElementById("d_start_date")
                                      .focus();
                                }}
                              >
                                <Form.Control
                                  placeholder="Search"
                                  // id="SearchTPIL" //@prathmesh @id commented
                                  // aria-label="Search"
                                  // aria-describedby="basic-addon1"
                                  // style={{ borderRight: "none" }}
                                  className="mdl-text-box"
                                  autoFocus={true}
                                  onChange={(e) => {
                                    this.handleSearch(e.target.value);
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
                                            this.lstPurchaseInvoice();
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
                                            this.lstPurchaseInvoice();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_start_date", "");
                                      this.setState(
                                        { startDate: e.target.value },
                                        () => {
                                          this.lstPurchaseInvoice();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
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
                                              this.lstPurchaseInvoice();
                                              document
                                                .getElementById("d_end_date")
                                                .focus();
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
                                              this.lstPurchaseInvoice();
                                            }
                                          );
                                        }
                                      } else {
                                        setFieldValue("d_start_date", "");
                                        this.setState(
                                          { startDate: e.target.value },
                                          () => {
                                            this.lstPurchaseInvoice();
                                            document
                                              .getElementById("d_end_date")
                                              .focus();
                                          }
                                        );
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
                                  id="d_end_date"
                                  placeholder="DD/MM/YYYY"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.d_end_date}
                                  onChange={handleChange}
                                  onFocus={() => {
                                    this.setState({ hideDp: true });
                                  }}
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
                                          "d_end_date",
                                          e.target.value
                                        );
                                        // this.getlstLedgerTranxDetailsReportsPageLoad(
                                        //   values
                                        // );
                                        this.setState(
                                          { endDate: e.target.value },
                                          () => {
                                            this.lstPurchaseInvoice();
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
                                            this.lstPurchaseInvoice();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_end_date", "");
                                      // this.lstPurchaseInvoice();
                                      this.setState(
                                        { endDate: e.target.value },
                                        () => {
                                          this.lstPurchaseInvoice();
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
                                              this.lstPurchaseInvoice();
                                              document
                                                .getElementById(
                                                  "TPIL_create_btn"
                                                )
                                                .focus();
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
                                              this.lstPurchaseInvoice();
                                            }
                                          );
                                        }
                                      } else {
                                        setFieldValue("d_end_date", "");
                                        // this.lstPurchaseInvoice();
                                        this.setState(
                                          { endDate: e.target.value },
                                          () => {
                                            this.lstPurchaseInvoice();
                                            document
                                              .getElementById("TPIL_create_btn")
                                              .focus();
                                          }
                                        );
                                      }
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col md="3" className="mt-0 text-end">
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
                                className="create-btn btn btn-success"
                                id="TPIL_create_btn"
                                onClick={(e) => {
                                  e.preventDefault();

                                  if (
                                    isActionExist(
                                      "purchase-invoice",
                                      "create",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_invoice_list",
                                      to: "tranx_purchase_invoice_create",
                                      prop_data: values,
                                      isNewTab: true,
                                    });
                                    this.setLastPurchaseSerialNo();
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
                                        "purchase-invoice",
                                        "create",
                                        this.props.userPermissions
                                      )
                                    ) {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_purchase_invoice_list",
                                        to: "tranx_purchase_invoice_create",
                                        prop_data: values,
                                        isNewTab: false,
                                      });
                                      this.setLastPurchaseSerialNo();
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
                                {" "}
                                Create
                                {/* <FontAwesomeIcon
                              icon={faPlusCircle}
                              className="ms-2"
                            ></FontAwesomeIcon> */}
                                {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              class="bi bi-plus-square-solid svg-style"
                              viewBox="0 0 16 16"
                              style={{
                                marginBottom: "auto",
                                marginTop: "auto",
                              }}
                            >
                              <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                            </svg> */}
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Row>
              )}
              {/* {purchaseInvoiceLst.length > 0 && ( */}
              {/* <h4 className="my-2">Purchase Invoice</h4> */}
              <div className="Tranx-tbl-list-style">
                {isActionExist(
                  "purchase-invoice",
                  "list",
                  this.props.userPermissions
                ) && (
                    <Table size="sm" className="tbl-font">
                      <thead>
                        {/* <div className="scrollbar_hd"> */}
                        <tr>
                          {this.state.showDiv}

                          {/* <th style={{ width: "5%" }}>Sr. #.</th> */}
                          <th>
                            <div className="d-flex">
                              Invoice No.
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
                              Invoice Date
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
                          {/* <th>Transaction Date</th> */}
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
                          {/* <th>Purchase Account</th> */}
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
                          {/* <th className="btn_align ">Total Amount</th> */}
                          <th className="text-center" style={{ width: "5%" }}>
                            Print
                          </th>
                          <th className="text-center" style={{ width: "5%" }}>
                            Barcode
                          </th>
                          <th className="text-center">Action</th>
                        </tr>
                        {/* </div> */}
                      </thead>
                      <tbody
                        style={{ borderTop: "2px solid transparent" }}
                        className="prouctTableTr tabletrcursor"
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (e.shiftKey && e.keyCode == 9) {
                            document.getElementById("TPIL_create_btn").focus();
                          } else if (e.keyCode != 9) {
                            this.handleTableRow(e);
                          }
                        }}
                      >
                        {/* <div className="scrollban_new"> */}
                        {purchaseInvoiceLst.length > 0 ? (
                          purchaseInvoiceLst.map((v, i) => {
                            return (
                              <tr
                                style={{ outline: "none" }}
                                // onDoubleClick={(e) => {
                                //   e.preventDefault();
                                //   eventBus.dispatch("page_change", {
                                //     from: "tranx_purchase_invoice_list",
                                //     to: "tranx_purchase_invoice_edit",
                                //     prop_data: v,
                                //     isNewTab: false,
                                //   });
                                // }}
                                value={JSON.stringify(v)}
                                id={`TPILTr_` + i}
                                ref={`TPILTr_` + i}
                                // prId={v.id}
                                tabIndex={i}
                                onDoubleClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    isActionExist(
                                      "purchase-invoice",
                                      "edit",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_purchase_invoice_list",
                                      to: "tranx_purchase_invoice_edit",
                                      // prop_data: v,
                                      prop_data: { prop_data: v, rowId: i, edit: true },
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
                                {/* <td>{i + 1}</td> */}
                                {/* <td style={{ width: "5%" }}>{i + 1}</td> */}
                                <td>{v.invoice_no}</td>
                                <td>
                                  {moment(v.invoice_date).format("DD-MM-YYYY")}
                                </td>
                                {/* <td>
                              {moment(v.transaction_date).format("DD-MM-YYYY")}
                            </td> */}
                                <td style={{ width: "20%" }}>
                                  {v.sundry_creditor_name}
                                </td>

                                <td style={{ width: "20%" }}>
                                  <p>{v.narration}</p>
                                </td>
                                {/* <td style={{width:'10%'}}>{v.purchase_account_name}</td> */}
                                {/* <td className="text-end">{v.total_amount}</td> */}
                                <td style={{ textAlign: "end" }}>
                                  {/* {parseFloat(v.taxable_amt.toFixed(2)).toFixed(2)} */}
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
                                <td
                                  className="text-center"
                                  style={{ width: "5%" }}
                                >
                                  {" "}
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
                                <td
                                  className="text-center"
                                  style={{ width: "5%" }}
                                >
                                  {" "}
                                  <img
                                    src={scan_existing}
                                    className="delete-img"
                                    style={{ height: "20px", padding: "3px" }}
                                    title="Print"
                                    onClick={(e) => {
                                      console.log("V=>", JSON.stringify(v));
                                      console.log("Clicked id : ", v.id);

                                      e.preventDefault();
                                      this.toggleBarcodeModal(); // Open the modal when the image is clicked

                                      this.lstPurchaseInvoiceProducts(v.id);
                                    }}
                                  />
                                </td>
                                <td className="text-center">
                                  <img
                                    src={Edit}
                                    className="delete-img"
                                    title="Edit"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        isActionExist(
                                          "purchase-invoice",
                                          "edit",
                                          this.props.userPermissions
                                        )
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "tranx_purchase_invoice_list",
                                          to: "tranx_purchase_invoice_edit",
                                          // prop_data: v,
                                          prop_data: { prop_data: v, rowId: i, edit: true },
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
                                    src={delete_icon}
                                    title="Delete"
                                    className="delete-img"
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
                            <td colSpan={8} className="text-center">
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
                                {/* <th>&nbsp;</th>
                                <th>Total Purchase Invoice List :</th>
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
                            <span>Invoices:</span>
                            <span>{this.state.purchaseInvoiceLst.length}</span>
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
        <Modal
          show={barcodeModal}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="tnx-pur-inv-mdl-product"
          centered
          onHide={this.toggleBarcodeModal}
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Barcode
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={this.toggleBarcodeModal}
            />
          </Modal.Header>
          <Modal.Body className="tnx-pur-inv-mdl-body p-0">
            <div className="tnx-pur-inv-ModalStyle">
              <Table className="text-start">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Sr</th>
                    <th>Product Name</th>
                    <th>Packing</th>
                    <th>Unit</th>
                    <th>Qty</th>
                    <th style={{ width: "10%" }}>Printing Qty</th>
                  </tr>
                </thead>
                <tbody className="prouctTableTr ">
                  {this.state.barcodePurchaseInvoiceData.map((product, i) => {
                    product.print_qty = product.product_qty;
                    return (
                      <tr>
                        <td className="p-0 text-center">{i + 1}</td>

                        <td className="p-0">{product.product_name}</td>
                        <td>{product.packing_name}</td>
                        <td>{product.units_name}</td>
                        <td className="p-0 text-end">{product.product_qty}</td>
                        <td className="p-0 text-end">
                          <Form.Control
                            type="text"
                            className="tnx-pur-inv-prod-style text-start"
                            placeholder={product.print_qty}
                            onChange={(event) => {
                              product.print_qty = Number(event.target.value);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div></div>
          </Modal.Body>
          <Modal.Footer style={{ border: "none" }}>
            <Button
              className="create-btn btn btn-success"
              onClick={(e) => {
                var finalData = [];

                this.state.barcodePurchaseInvoiceData.forEach((pro, index) => {
                  if (pro.print_qty > 0) {
                    for (let s = 0; s < pro.print_qty; s++) {
                      finalData.push(pro);
                    }
                  }
                  console.log(index + " : " + JSON.stringify(pro));
                });

                console.log("Final Data : ", JSON.stringify(finalData));

                this.setState({ barcodeModal: false });

                //    eventBus.dispatch("page_change",
                //    "utilites_print_preview"
                // );
                eventBus.dispatch("page_change", {
                  from: "tranx_purchase_invoice_list",
                  to: "utilites_print_preview",
                  // prop_data: selectedLedger,
                  prop_data: { prop_data: finalData },
                  isNewTab: true,
                });
              }}
            >
              {" "}
              Print
            </Button>
            <Button
              className="create-btn btn btn-success"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                MyNotifications.fire({
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to Cancel",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    this.setState({ barcodeModal: false });
                  },
                  handleFailFn: () => { },
                });
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
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

export default connect(
  mapStateToProps,
  mapActionsToProps
)(TranxPurchaseInvoiceList);
