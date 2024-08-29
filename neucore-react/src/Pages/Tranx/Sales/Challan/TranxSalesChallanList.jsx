import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  Modal,
  InputGroup,
  CloseButton,
  Badge,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import moment from "moment";
import Select from "react-select";
import {
  getSalesAccounts,
  getSundryDebtors,
  getSaleChallanList,
  AllListSaleChallan,
  getLastSalesChallanNo,
  getLastSalesInvoiceNo,
  delete_sales_challan,
  getInvoiceBill,
} from "@/services/api_functions";
import { DTSaleChallanURL } from "@/services/api";
//import delete_icon from "@/assets/images/3x/delete_icon.png";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import TableEdit from "@/assets/images/1x/editnew.png";
import print3 from "@/assets/images/print3.png";

import delete_icon from "@/assets/images/delete_icon3.png";
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

import axios from "axios";
import {
  getSelectValue,
  AuthenticationCheck,
  MyDatePicker,
  getHeader,
  ShowNotification,
  customStyles,
  eventBus,
  MyNotifications,
  isActionExist,
  LoadingComponent,
  INRformat,
  MyTextDatePicker,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
//import delete_icon from "@/assets/images/delete_icon.svg";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
class TranxSalesChallanList extends React.Component {
  constructor(props) {
    super(props);
    this.tableManager = React.createRef(null);
    this.salesOrderRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      orgData: [],
      orgData1: [],
      show: false,
      arrowToggle: true,

      opendiv: false,
      convshowInvoice: false,
      ConvertIntoInvoice: false,
      isAllChecked: false,
      showDiv: false,
      salesAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      salesInvoiceLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      clientNameId: "",
      selectedSDids: "",
      selectedCounterSalesBills: [],
      scBills: [],
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      initVal: {
        scbill_no: 1,
        sc_sr_no: 1,
        transaction_dt: new Date(),
        salesId: "",
        invoice_dt: "",
        clientCodeId: "",
        clientNameId: "",
      },
      InvoiceinitVal: {
        si_sr_no: 1,

        transaction_dt: moment().format("YYYY-MM-DD"),
        salesId: "",
        sibill_no: "",

        invoice_dt: "",
        clientCodeId: "",
        clientNameId: "",
      },
    };
  }

  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
  }

  setLastSalesChallanSerialNo = () => {
    getLastSalesChallanNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;
          initVal["sc_sr_no"] = res.count;
          initVal["scbill_no"] = res.serialNo;
          this.setState({ initVal: initVal });
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
  AllListSaleChallanFun = () => {
    AllListSaleChallan()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              salesInvoiceLst1: res.data,
              orgData1: res.data,
            },
            () => {
              this.salesOrderRef.current.setFieldValue("search", "");

              if (
                this.props.block.prop_data != "" &&
                "selectedBills" in this.props.block.prop_data
              ) {
                this.setState({
                  scBills: this.props.block.prop_data.selectedBills,
                });
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst1: [] });
      });
  };

  //start of challan list for pagination
  lstSaleChallan = () => {
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
    getSaleChallanList(req)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              salesInvoiceLst:
                res.responseObject != null ? res.responseObject.data : [],
              orgData:
                res.responseObject.data != null ? res.responseObject.data : [],
              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
              currentPage:
                res.responseObject != null ? res.responseObject.page : 0,

              scBills:
                this.props.block.prop_data !== "" &&
                this.props.block.prop_data.selectedBills !== undefined
                  ? this.props.block.prop_data.selectedBills
                  : [],
            },
            () => {
              this.salesOrderRef.current.setFieldValue("search", "");

              if (this.props.block.prop_data.rowId) {
                document
                  .getElementById("TSCLTr_" + this.props.block.prop_data.rowId)
                  .focus();
              } else if (document.getElementById("SearchTSCL") != null) {
                {
                  document.getElementById("SearchTSCL").focus();
                }
              } else if (this.props.block.prop_data.opType === "create") {
                // let createSaleCount = this.state.orgData.length - 1
                setTimeout(() => {
                  // document.getElementById("TSILTr_" + createSaleCount).focus()
                  document.getElementById("TSCLTr_0").focus();
                }, 1500);
              } else if (this.props.block.prop_data.opType === "edit") {
                // let createSaleCount = this.state.orgData.length - 1
                setTimeout(() => {
                  // document.getElementById("TSILTr_" + createSaleCount).focus()
                  document.getElementById("TSCLTr_0").focus();
                }, 1500);
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ salesInvoiceLst: [] });
      });
  };
  //end of challan list for pagination
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.lstSaleChallan();
    });
  };

  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.lstSaleChallan();
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
  //   getSaleChallanList(reqData).then((response) => {
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

  setTableManager = (tm) => (this.tableManager.current = tm);
  onRowsRequest = async (requestData, tableManager) => {
    let req = {
      from: requestData.from,
      to: requestData.to,
      searchText: requestData.searchText,
      sort: JSON.stringify(requestData.sort),
    };
    const response = await axios({
      url: DTSaleChallanURL(),
      method: "POST",
      headers: getHeader(),
      data: JSON.stringify(req),
    })
      .then((response) => response.data)
      .catch((e) => {
        console.log("e--->", e);
      });

    if (!response?.rows) return;

    return {
      rows: response.rows,
      totalRows: response.totalRows,
    };
  };

  callOpenDiv = () => {
    const { opendiv } = this.state;
    this.setState({ opendiv: !opendiv });
  };

  handleCounterSalesBillsSelection = (id, sundry_debtors_id, status) => {
    let {
      scBills,
      salesInvoiceLst,
      selectedSDids,
      supplierNameLst,
      InvoiceinitVal,
    } = this.state;
    if (status == true) {
      if (scBills.length == 0) {
        if (!scBills.includes(id)) {
          scBills = [...scBills, id];
        }
        // InvoiceinitVal = ['supplierNameId'];
        InvoiceinitVal["clientNameId"] = getSelectValue(
          supplierNameLst,
          sundry_debtors_id + ""
        );

        this.setState({ selectedSDids: sundry_debtors_id });
      } else {
        if (selectedSDids == sundry_debtors_id) {
          if (!scBills.includes(id)) {
            scBills = [...scBills, id];
          }
        } else {
          // ShowNotification("Error", "You have selected differnt supplier");
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "You have selected differnt supplier",
            is_button_show: true,
          });
        }
      }
    } else {
      if (selectedSDids == sundry_debtors_id) {
        if (!scBills.includes(id)) {
          scBills = [...scBills, id];
        } else {
          scBills = scBills.filter((v) => v != id);
        }
      } else {
        if (scBills.includes(id)) {
          scBills = scBills.filter((v) => v != id);
        }
      }
    }
    this.setState(
      {
        isAllChecked:
          scBills.length == 0
            ? false
            : scBills.length === salesInvoiceLst.length
            ? true
            : false,
        scBills: scBills,
        InvoiceinitVal: InvoiceinitVal,
      },
      () => {
        if (this.state.scBills.length == 0) {
          InvoiceinitVal["clientNameId"] = "";

          this.setState({
            InvoiceinitVal: InvoiceinitVal,

            selectedSDids: "",
          });
        }
      }
    );
  };

  handleCounterSalesBillsSelectionAll = (status) => {
    let { salesInvoiceLst, selectedSDids, InvoiceinitVal } = this.state;

    let lstSelected = [];
    let selectedSundryId = "";
    if (status == true) {
      salesInvoiceLst.map((v) => {
        if (
          v.sundry_debtors_id == selectedSDids &&
          v.sales_challan_status == "opened"
        ) {
          lstSelected.push(v.id);
        }
      });
      selectedSundryId = selectedSDids;
    } else {
      InvoiceinitVal["clientNameId"] = "";
    }

    this.setState(
      {
        isAllChecked: status,
        scBills: lstSelected,
        selectedSDids: selectedSundryId,

        InvoiceinitVal: InvoiceinitVal,
      },
      () => {
        if (this.state.scBills.length == 0) {
          this.setState({ selectedSDids: "" });
        }
      }
    );
  };

  handleSearch = (vi) => {
    let { orgData, orgData1 } = this.state;
    let orgData_F = orgData.filter(
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

  getInvoiceBillsLstPrint = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    reqData.append("print_type", "list");
    reqData.append("source", "sales_challan");
    getInvoiceBill(reqData).then((response) => {
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
          from: "tranx_sales_challan_create",
          to: "tranx_sales_challan_list",
          isNewTab: false,
        });
      }
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };
  deleteSaleChallan = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_sales_challan(formData)
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
      this.lstSalesAccounts();
      this.lstSundrydebtors();
      // this.lstSalesInvoice();
      this.lstSaleChallan();
      // this.AllListSaleChallanFun();
      const { prop_data } = this.props.block;

      let res = prop_data;

      // if (res != "") {
      //   this.setState(
      //     {
      //       salesInvoiceLst: res.data,
      //       orgData: res.data,
      //       source: res.source,
      //     },
      //     () => {
      //       this.salesOrderRef.current.setFieldValue("search", "");
      //     }
      //   );
      // } else {
      //   this.lstSaleChallan();
      // }
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
        if (
          isActionExist("sales-challan", "edit", this.props.userPermissions)
        ) {
          eventBus.dispatch("page_change", {
            from: "tranx_sales_challan_list",
            to: "tranx_sales_challan_edit",
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
      supplierCodeLst,
      salesInvoiceLst,
      initVal,
      InvoiceinitVal,
      opendiv,
      showDiv,
      clientNameId,
      selectedSDids,
      ConvertIntoInvoice,
      convshow,
      selectedCounterSalesBills,
      scBills,
      convshowInvoice,
      isAllChecked,
      showloader,
      values,
      handleChange,
      setFieldValue,
      currentPage,
      pages,
      totalRows,
    } = this.state;

    return (
      <>
        <Collapse in={ConvertIntoInvoice}>
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
                  values["selectedCounterSales"] = scBills;
                  console.log("values", values);
                  // window.electron.ipcRenderer.webPageChange({
                  //   to: "tranx_sales_challan_to_invoice",
                  //   prop_data: values,
                  //   isNewTab: false,
                  // });
                  eventBus.disptach("page_change", {
                    from: "tranx_sales_challan_to_list",
                    to: "tranx_sales_challan_to_invoice",
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
                    {/* {JSON.stringify(errors)}; */}
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
                            id="si_sr_no"
                            onChange={handleChange}
                            value={values.si_sr_no}
                            isValid={touched.si_sr_no && !errors.si_sr_no}
                            isInvalid={!!errors.si_sr_no}
                            readOnly={true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.si_sr_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md="1" className="p-0">
                        <Form.Group>
                          <Form.Label>
                            Invoice Date{" "}
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
                        <Form.Group className="">
                          <Form.Label>
                            Client Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <Select
                            // isDisabled={true}
                            className="selectTo"
                            styles={customStyles}
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
                              document.getElementById("TSCLTr_0")?.focus();
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
                        />
                        {/* <Button type="submit">x</Button> 
                      </Form.Group>
                    </Form> */}
                              <InputGroup className="mb-2 mdl-text">
                                <Form.Control
                                  placeholder="Search"
                                  // id="SearchTSCL" @mayur id conmmented
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
                                        .getElementById("d_start_dateSCL")
                                        ?.focus();
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
                                  id="d_start_dateSCL"
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
                                            this.lstSaleChallan();
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
                                            this.lstSaleChallan();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_start_date", "");
                                      this.setState(
                                        { startDate: e.target.value },
                                        () => {
                                          this.lstSaleChallan();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      document
                                        .getElementById("d_end_dateSCL")
                                        ?.focus();
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
                                  id="d_end_dateSCL"
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
                                            this.lstSaleChallan();
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
                                            this.lstSaleChallan();
                                          }
                                        );
                                      }
                                    } else {
                                      setFieldValue("d_end_date", "");
                                      // this.lstSaleChallan();
                                      this.setState(
                                        { endDate: e.target.value },
                                        () => {
                                          this.lstSaleChallan();
                                        }
                                      );
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      document
                                        .getElementById("TSCL_create_btn")
                                        ?.focus();
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col md="3" className="text-end">
                            {/* {this.state.hide == 'true'} */}
                            {/* <Button
                    className="ml-2 btn-refresh"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.pageReload();
                    }}
                  >
                    <img src={refresh} alt="icon" />
                  </Button> */}
                            {scBills.length == 0 && !opendiv && (
                              <Button
                                className="create-btn btn "
                                id="TSCL_create_btn"
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   this.setState({ opendiv: !opendiv });
                                //   this.setLastSalesChallanSerialNo();
                                // }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // if (isActionExist("sales-challan", "create")) {
                                  //   this.setState({ opendiv: !opendiv });
                                  //   this.setLastSalesChallanSerialNo();
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
                                      "sales-challan",
                                      "create",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_sales_challan_list",
                                      to: "tranx_sales_challan_create",
                                      // prop_data: values,
                                      isNewTab: false,
                                    });
                                    this.setLastSalesChallanSerialNo();
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
                            )}
                            {scBills.length > 0 && (
                              <Button
                                className="create-btn mr-2"
                                // id="TSCL_create_btn"
                                onClick={(e) => {
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_sales_challan_to_list",
                                    to: "tranx_sales_challan_to_invoice",
                                    prop_data: { selectedBills: scBills },
                                    isNewTab: false,
                                  });
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
                            )}
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Row>
              )}

              {/* Coverting Sale Quotation to sale Invoice */}

              {/* {salesInvoiceLst.length > 0 && ( */}
              <div className="Tranx-tbl-list-style">
                {isActionExist(
                  "sales-challan",
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
                        <th>
                          <div className="d-flex">
                            SC No.
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
                            SC Date
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
                        {/* <th>Sales Challan A/c</th> */}
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
                        <th style={{ width: "20%" }}>Narration</th>
                        {/* <th className="btn_align right_col">Total Amount</th> */}
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
                        <th style={{ textAlign: "center" }}>Tranxs Status</th>
                        <th style={{ textAlign: "center", width: "4%" }}>
                          Print
                        </th>
                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{ borderTop: "2px solid transparent" }}
                      className="prouctTableTr tabletrcursor"
                      onKeyDown={(e) => {
                        e.preventDefault();
                        if (e.shiftKey && e.keyCode == 9) {
                          document.getElementById("TSCL_create_btn").focus();
                        } else if (e.keyCode != 9) {
                          this.handleTableRow(e);
                        }
                      }}
                    >
                      {salesInvoiceLst.map((v, i) => {
                        return (
                          <tr
                            value={JSON.stringify(v)}
                            id={`TSCLTr_` + i}
                            // prId={v.id}
                            tabIndex={i}
                            // onDoubleClick={(e) => {
                            //   e.preventDefault();
                            //   eventBus.dispatch("page_change", {
                            //     from: "tranx_sales_challan_list",
                            //     to: "tranx_sales_challan_edit",
                            //     prop_data: v,
                            //     isNewTab: false,
                            //   });
                            // }}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              if (v.sales_challan_status == "closed") {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "info",
                                  title: "Info",
                                  msg: "Challan is Closed, can't Edit!",
                                  is_button_show: true,
                                });
                              } else if (
                                isActionExist(
                                  "sales-challan",
                                  "edit",
                                  this.props.userPermissions
                                )
                              ) {
                                eventBus.dispatch("page_change", {
                                  from: "tranx_sales_challan_list",
                                  to: "tranx_sales_challan_edit",
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
                                  disabled={v.sales_challan_status == "closed"}
                                  checked={scBills.includes(parseInt(v.id))}
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
                            <td>{v.referenceNo}</td>
                            <td>{moment(v.bill_date).format("DD-MM-YYYY")}</td>
                            {/* <td>{v.sale_account_name}</td> */}

                            <td style={{ width: "20%" }}>
                              {v.sundry_debtors_name}
                            </td>
                            <td style={{ width: "20%" }}>
                              <p>{v.narration}</p>
                            </td>
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
                              {/* {v.sales_challan_status} */}
                              <Badge
                                bg={`${
                                  v.sales_challan_status == "opened"
                                    ? "success"
                                    : v.sales_challan_status == "closed"
                                    ? "danger"
                                    : null
                                }`}
                              >
                                {v.sales_challan_status == "opened"
                                  ? "  Opened"
                                  : v.sales_challan_status == "closed"
                                  ? "Closed"
                                  : null}
                              </Badge>
                            </td>
                            <td style={{ textAlign: "center", width: "4%" }}>
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
                              <div className="d-flex">
                                <img
                                  src={TableEdit}
                                  className="delete-img ms-auto"
                                  title="Edit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (v.sales_challan_status == "closed") {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "info",
                                        title: "Info",
                                        msg: "Challan is Closed, can't Edit!",
                                        is_button_show: true,
                                      });
                                    } else if (
                                      isActionExist(
                                        "sales-challan",
                                        "edit",
                                        this.props.userPermissions
                                      )
                                    ) {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_sales_challan_list",
                                        to: "tranx_sales_challan_edit",
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
                                  className="delete-img me-auto"
                                  title="Delete"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (v.sales_challan_status == "closed") {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "info",
                                        title: "Info",
                                        msg: "Challan is Closed, can't Delete!",
                                        is_button_show: true,
                                      });
                                    } else if (
                                      isActionExist(
                                        "sales-challan",
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
                                            this.deleteSaleChallan(v.id);
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
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
                            colSpan={7}
                            className=""
                            style={{ borderTop: " 2px solid transparent" }}
                          >
                            {Array.from(Array(1), (v) => {
                              return (
                                <tr>
                                  <th>Total Sales Challan List :</th>
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
                            <span>Challan:</span>
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
)(TranxSalesChallanList);
