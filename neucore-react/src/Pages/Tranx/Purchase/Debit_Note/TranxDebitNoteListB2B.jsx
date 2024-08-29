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
} from "react-bootstrap";
import print3 from "@/assets/images/print3.png";
import { Formik } from "formik";

import * as Yup from "yup";
import delete_icon from "@/assets/images/delete_icon3.png";
import Edit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import refresh from "@/assets/images/refresh.png";
import moment from "moment";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowDown,
  faArrowUp,
  faChevronRight,
  faChevronLeft, faCalculator, faCirclePlus, faCircleQuestion, faFloppyDisk, faGear, faHouse, faPen, faPrint, faArrowUpFromBracket, faRightFromBracket, faTrash, faXmark
} from "@fortawesome/free-solid-svg-icons";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getTranxDebitNoteLast,
  getTranxDebitNoteListInvoiceBillSC,
  getPurchaseReturnLst,
  delete_purchase_return,
  getPurchaseReturnBill,
} from "@/services/api_functions";

import {
  AuthenticationCheck,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
  INRformat,
  MyTextDatePicker,
} from "@/helpers";

class TranxDebitNoteListB2B extends React.Component {
  constructor(props) {
    super(props);
    this.debitnoteRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      show: false,
      arrowToggle: true,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      orgData: [],
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      initVal: {
        debit_note_sr: 1,
        pr_invoice_dt: "",
        transaction_dt: moment().format("DD-MM-YYYY"),
        purchaseId: "",
        invoice_no: "",
        invoice_dt: "",
        from_date: "",
        to_date: "",
        supplierCodeId: "",
        supplierNameId: "",
        purchase_return_invoice: "",
        outstanding: "",
      },
      opendiv: false,
      modal: false,
      errormodal: false,
      name: "",
      modalInputName: "",
      invoiceLstSC: [],
      selected_values: "",
      lst_products: [],
      debitnoteModalShow: false,
      supplier_name: "",
    };

    this.myRef = React.createRef();
  }
  handeldebitnoteModalShow = (status) => {
    this.setState({ debitnoteModalShow: status });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    this.setState({ name: this.state.modalInputName });
    this.modalClose();
  }

  modalOpen() {
    this.setState({ modal: true });
  }
  errorModal() {
    this.setState({ errormodal: true });
  }
  recordsavemodal() {
    this.setState({ recordsavemodal: true });
  }
  modalClose() {
    this.setState({
      modalInputName: "",
      modal: false,
      errormodal: false,
      recordsavemodal: false,
    });
  }

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt });
        }
      })
      .catch((error) => { });
  };
  // getPurchase_ReturnLst = () => {
  //   getPurchaseReturnLst()
  //     .then((response) => {
  //       let res = response.data;
  //       console.log("res----", res)
  //       if (res.responseStatus == 200) {
  //         this.setState(
  //           { purchaseInvoiceLst: res.data, orgData: res.data },
  //           () => {
  //             this.debitnoteRef.current.setFieldValue("search", "");
  //           }
  //         );
  //         setTimeout(() => {
  //           if (this.props.block.prop_data.rowId) {
  //             document
  //               .getElementById("TDNLTr_" + this.props.block.prop_data.rowId)
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

  //start of purchase return invoice list with pagination
  getPurchase_ReturnLst = () => {
    let { currentPage, pageLimit, startDate, endDate, colId, isAsc } =
      this.state;
    let req = {
      "pageNo": currentPage,
      "pageSize": pageLimit,
      "searchText": "",
      "sort": '{ "colId": null, "isAsc": true }',
      "startDate":
        startDate != null && startDate != ""
          ? moment(startDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
      "endDate":
        endDate != null && endDate != ""
          ? moment(endDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
    };
    getPurchaseReturnLst(req)
      .then((response) => {
        let res = response.data;
        console.log("res----", res);
        if (res.responseStatus == 200) {
          this.setState(
            {
              purchaseInvoiceLst: res.responseObject.data,
              orgData: res.responseObject.data,
              totalRows:
                res.responseObject != null
                  ? res.responseObject.total
                  : 0,
              pages:
                res.responseObject != null
                  ? res.responseObject.total_pages
                  : 0,
              currentPage:
                res.responseObject != null ? res.responseObject.page : 0,
            },
            () => {
              this.debitnoteRef.current.setFieldValue("search", "");
            }
          );
          setTimeout(() => {
            if (this.props.block.prop_data.rowId) {
              document.getElementById("TDNLTr_" + this.props.block.prop_data.rowId).focus();
            } else if (this.props.block.prop_data.isCreate) {
              // alert ("isCreate")
              document.getElementById(`TDNLTr_0`).focus();
            } else if (document.getElementById("SearchTDNL") != null) {
              {
                document.getElementById("SearchTDNL").focus();
              }
            }
          }, 1500);
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  //end of purchase return invoice list with pagination
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.getPurchase_ReturnLst();
    });
  };

  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.getPurchase_ReturnLst();
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
  //   getPurchaseReturnLst(reqData).then((response) => {
  //     let res = response.data;
  //     if (res.responseStatus == 200) {
  //       this.setState(
  //         {
  //           purchaseInvoiceLst: res.data,
  //           orgData: res.data,
  //           showloader: false,
  //         },
  //         () => {
  //           this.debitnoteRef.current.setFieldValue("search", "");
  //         }
  //       );
  //     }
  //     console.log("res---->", res);
  //   });
  // };
  handleSearch = (vi) => {
    console.log("vi------------------>", vi);
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        (v.pur_return_no != null &&
          v.pur_return_no.toLowerCase().includes(vi.toLowerCase())) ||
        moment(v.purchase_return_date).format("DD-MM-YYYY").includes(vi) ||
        // moment(v.transaction_date).format("DD-MM-YYYY").includes(vi) ||
        (v.sundry_creditor_name != null &&
          v.sundry_creditor_name.toLowerCase().includes(vi.toLowerCase())) ||
        (v.narration != null && v.narration.toLowerCase().includes(vi)) ||
        (v.tax_amt != null && v.tax_amt.toString().includes(vi)) ||
        (v.taxable_amt != null && v.taxable_amt.toString().includes(vi)) ||
        (v.total_amount != null && v.total_amount.toString().includes(vi))
      // v.purchase_order_status.toLowerCase().includes(vi.toLowerCase()) ||
      // v.purchase_account_name.toLowerCase().includes(vi.toLowerCase())
      // v.pur_return_no.includes(vi) ||
      // moment(v.transaction_date).format("DD-MM-YYYY").includes(vi) ||
      // v.invoice_no.toLowerCase().includes(vi.toLowerCase()) ||
      // v.sundry_creditor_name.toLowerCase().includes(vi.toLowerCase())
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
    getTranxDebitNoteLast()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;

          initVal["debit_note_sr"] = res.count;
          initVal["purchase_return_invoice"] = res.purReturnNo;
          this.setState({ initVal: initVal });
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
              ledger_balance: v.ledger_balance,
              ledger_balance_type: v.ledger_balance_type,
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
      .catch((error) => { });
  };

  deletepurchase = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_purchase_return(formData)
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
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      this.lstSundryCreditors();
      // this.lstPurchaseInvoice();
      this.setLastPurchaseSerialNo();
      this.getPurchase_ReturnLst();
    }
  }
  handleCreateBtn = () => {
    this.setState({ show: true });
  };

  handleSubmitSCList = (value) => {
    this.setState({ initVal: value });

    let reqData = new FormData();
    reqData.append("sundry_creditor_id", value.supplierCodeId.value);

    getTranxDebitNoteListInvoiceBillSC(reqData)
      .then((response) => {
        // console.log('before response', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          // console.log('response', response);
          let lst = res.data;
          this.setState({
            invoiceLstSC: lst,
            selected_values: value,
            show: true,
          });
        }
      })
      .catch((error) => { });
  };

  handleRowClick = (v) => {
    let prop_data = {
      returnIntiVal: this.state.initVal,
      returnData: v,
    };

    eventBus.dispatch("page_change", {
      from: "tranx_debit_note_list",
      to: "tranx_debit_note_product_list",
      isNewTab: false,
      prop_data: prop_data,
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
          isActionExist("purchase-return", "edit", this.props.userPermissions)
        ) {
          eventBus.dispatch("page_change", {
            from: "tranx_debit_note_list_B2B",
            to: "tranx_debit_note_edit_B2B",
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
  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "list");
    reqData.append("source", "purchase_return");
    getPurchaseReturnBill(reqData).then((response) => {
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
          // to: "tranx_purchase_order_list",
          to: "tranx_debit_note_list_B2B",
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
      show,
      arrowToggle,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      initVal,
      invoiceLstSC,
      selected_values,
      debitnoteModalShow,
      supplier_name,
      lst_products,
      opendiv,
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
                    innerRef={this.debitnoteRef}
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
                            document.getElementById("TDNLTr_0")?.focus();
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
                                {/* <Button type="submit">x</Button> 
                              </Form.Group>
                            </Form> */}
                              <InputGroup className="mb-2 mdl-text">
                                <Form.Control
                                  placeholder="Search"
                                  // id="SearchTDNL"
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
                                      document
                                        .getElementById("d_start_dateDNL")
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
                                  id="d_start_dateDNL"
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
                                            this.getPurchase_ReturnLst();
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
                                            this.getPurchase_ReturnLst();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_start_date", "");
                                      this.setState(
                                        { startDate: e.target.value },
                                        () => {
                                          this.getPurchase_ReturnLst();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      document.getElementById("d_end_dateDNL").focus();
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
                                  id="d_end_dateDNL"
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
                                            this.getPurchase_ReturnLst();
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
                                            this.getPurchase_ReturnLst();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_end_date", "");
                                      // this.getPurchase_ReturnLst();
                                      this.setState(
                                        { endDate: e.target.value },
                                        () => {
                                          this.getPurchase_ReturnLst();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      document.getElementById("TDNB2BL_create_btn").focus();
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
                            {/* {this.state.hide == 'true'} */}
                            {!opendiv && (
                              <Button
                                className="create-btn mr-2"
                                id="TDNB2BL_create_btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    isActionExist(
                                      "purchase-return",
                                      "create",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_debit_note_list_B2B",
                                      to: "tranx_debit_note_product_list_B2B",
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
                                }}
                                aria-controls="example-collapse-text"
                                aria-expanded={opendiv}
                                // onClick={this.open}

                                onKeyDown={(e) => {
                                  if (e.keyCode === 32) {
                                    e.preventDefault();
                                  } else if (e.keyCode === 13) {
                                    if (
                                      isActionExist(
                                        "purchase-return",
                                        "create",
                                        this.props.userPermissions
                                      )
                                    ) {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_debit_note_list_B2B",
                                        to: "tranx_debit_note_product_list_B2B",
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
              {/* {purchaseInvoiceLst.length > 0 && ( */}
              <div className="Tranx-tbl-list-style">
                {isActionExist(
                  "purchase-return",
                  "list",
                  this.props.userPermissions
                ) && (
                    <Table
                      size="sm"
                      className={`${opendiv != "" ? "tbl-font" : "tbl-font"}`}
                    >
                      <thead>
                        <tr>
                          {/* <th style={{ width: "5%" }}>Sr. #.</th> */}
                          <th>Pur Return No.</th>
                          {/* <th >Transaction Date</th> */}
                          {/* <th>Purchase Account</th> */}
                          <th>
                            <div className="d-flex">
                              Return Date
                              <div
                                className="ms-2"
                                onClick={() =>
                                  this.handleSort("purchase_return_date")
                                }
                              >
                                {this.state.sortedColumn ===
                                  "purchase_return_date" &&
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
                          <th className="text-center">Print </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody
                        style={{ borderTop: "2px solid transparent" }}
                        className="prouctTableTr tabletrcursor"
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (e.shiftKey && e.keyCode == 9) {
                            document.getElementById("TDNB2BL_create_btn").focus();
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
                                id={`TDNLTr_` + i}
                                // prId={v.id}
                                tabIndex={i}
                                // onDoubleClick={(e) => {
                                //   e.preventDefault();
                                //   if (isActionExist("purchase-return-edit", "edit")) {
                                //     eventBus.dispatch("page_change", {
                                //       from: "tranx_debit_note_list",
                                //       to: "tranx_debit_note_edit",
                                //       prop_data: v,
                                //       isNewTab: false,
                                //     });
                                //   } else {
                                //     MyNotifications.fire({
                                //       show: true,
                                //       icon: "error",
                                //       title: "Error",
                                //       msg: "Permission is denied!",
                                //       is_button_show: true,
                                //     });
                                //   }
                                // }}
                                onDoubleClick={(e) => {
                                  // ;
                                  e.preventDefault();
                                  if (
                                    isActionExist(
                                      "purchase-return",
                                      "edit",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_debit_note_list_B2B",
                                      to: "tranx_debit_note_edit_B2B",
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
                                {/* <td style={{ width: "5%" }}>{i + 1}</td> */}
                                <td>{v.pur_return_no}</td>
                                {/* <td style={{ width: "15%" }}>
                              {moment(v.transaction_date).format("DD-MM-YYYY")}
                            </td> */}
                                {/* <td>{v.purchase_account_name}</td> */}
                                {/* <td>{v.purchase_return_date}</td> */}
                                <td>
                                  {moment(v.purchase_return_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td style={{ width: "20%" }}>
                                  {v.sundry_creditor_name}
                                </td>
                                {/* <td className="btn_align right_col">
                          {v.total_amount}
                        </td> */}
                                <td style={{ width: "20%" }}>
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
                                <td className="text-center">
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
                                <td>
                                  <img
                                    src={Edit}
                                    className="delete-img"
                                    title="Edit"
                                    onClick={(e) => {
                                      // ;
                                      e.preventDefault();
                                      if (
                                        isActionExist(
                                          "purchase-return",
                                          "edit",
                                          this.props.userPermissions
                                        )
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "tranx_debit_note_list_B2B",
                                          to: "tranx_debit_note_edit_B2B",
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
                            <td colSpan={9} className="text-center">
                              No Data Found
                            </td>
                            {/* {showloader == true && LoadingComponent(showloader)} */}
                          </tr>
                        )}
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
                                  <th>Total Purchase Return List :</th>
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
              {/* )} */}
            </div>
          </div>

          <Modal
            show={show}
            size="lg"
            className="transaction_mdl invoice-mdl-style"
            onHide={() => this.setState({ show: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
            animation={false}
          >
            <Modal.Header
            //closeButton
            // className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title
              // id="example-custom-modal-styling-title"
              // className=""
              >
                Invoice List
              </Modal.Title>
              <CloseButton
                // variant="white"
                className="pull-right"
                onClick={this.handleClose}
              // onClick={() => this.handlesupplierdetailsModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className="p-0">
              <div className="table_wrapper">
                {invoiceLstSC.length > 0 && (
                  // <div className="all_bills">
                  //   <div className="bills_dt">
                  //     <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
                  //       <div className="table_wrapper1">
                  <Table hover size="sm" className="tbl-font">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }} className="">
                          {" "}
                          Sr.
                        </th>
                        <th style={{ textAlign: "left" }} className="">
                          Bill
                        </th>
                        <th style={{ textAlign: "left" }} className="">
                          Bill Amt
                        </th>
                        <th style={{ textAlign: "left" }} className="">
                          Bill Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceLstSC.map((v, i) => {
                        return (
                          <tr
                            onClick={(e) => {
                              e.preventDefault();

                              this.handleRowClick(v);
                            }}
                          >
                            <td>{i + 1}</td>
                            <td>{v.invoice_no}</td>
                            <td>{v.total_amount}</td>
                            <td>
                              {moment(v.invoice_date).format("DD-MM-YYYY")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  //  </div>
                  //       </div>
                  //     </div>
                  //   </div>
                )}
              </div>
            </Modal.Body>
          </Modal>

          {/* Debit Note Create Modal */}
          <Modal
            fullscreen
            show={debitnoteModalShow}
            size="xl"
            className="groupnewmodal mt-5 mainmodal"
            onHide={() => this.handeldebitnoteModalShow(false)}
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
          //centered
          >
            <Modal.Header
              //closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                {supplier_name && supplier_name}
              </Modal.Title>
              <CloseButton
                variant="white"
                className="pull-right"
                //onClick={this.handleClose}
                onClick={() => this.handeldebitnoteModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className=" p-2 p-invoice-modal">
              <div
                className="institutetbl pb-2 pt-0 pl-2 pr-2"
              //style={{ height: '410px' }}
              >
                <Table
                  size="lg"
                  className="key mb-0 purchacetbl"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>
                        <Form.Group
                          controlId="formBasicCheckbox"
                          className="ml-1 pmt-allbtn"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Sr. #."
                            className="pt-1"
                          />
                        </Form.Group>
                      </th>
                      <th>Particulars</th>
                      <th>Qty</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="unithead">
                      <td></td>
                      <td></td>
                      <td>
                        <tr>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="H"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="M"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="L"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                        </tr>
                      </td>
                      {/* <td></td> */}
                      <td>
                        <tr>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="H"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="M"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="L"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                        </tr>
                      </td>
                    </tr>
                    {lst_products.length > 0 &&
                      lst_products.map((v, i) => {
                        return (
                          <tr>
                            <td>
                              <Form.Group
                                controlId="formBasicCheckbox"
                                className="ml-1 pmt-allbtn"
                              >
                                <Form.Check
                                  type="checkbox"
                                  label="Sr. #."
                                  className="pt-1"
                                />
                              </Form.Group>
                            </td>
                            <td>{v.product_name}</td>
                            <td>{v.qtyH}</td>
                            <td>{v.qtyM}</td>
                            <td>{v.qtyL}</td>
                            <td>{v.rateH}</td>
                            <td>{v.rateM}</td>
                            <td>{v.rateL}</td>
                          </tr>
                        );
                      })}
                    {/*{rows.map((v, i) => {
                      return (
                        <TRowComponent
                          i={i}
                          setFieldValue={setFieldValue}
                          setElementValue={this.setElementValue.bind(this)}
                          handleChangeArrayElement={this.handleChangeArrayElement.bind(
                            this
                          )}
                          productLst={productLst}
                          handlePlaceHolder={this.handlePlaceHolder.bind(
                            this
                          )}
                          handleUnitLstOptLength={this.handleUnitLstOptLength.bind(
                            this
                          )}
                          isDisabled={false}
                          handleClearProduct={this.handleClearProduct.bind(
                            this
                          )}
                        />
                      );
                    })}*/}
                  </tbody>
                </Table>
              </div>
            </Modal.Body>
          </Modal>
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
)(TranxDebitNoteListB2B);
