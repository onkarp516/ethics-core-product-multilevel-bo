import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
} from "react-bootstrap";
import search from "@/assets/images/search_icon@3x.png";
import { Formik } from "formik";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import Select from "react-select";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import delete_icon2 from "@/assets/images/delete_icon2.png";
import add_icon from "@/assets/images/add_icon.svg";
import TGSTFooter from "../../../Pages/Tranx/Components/TGSTFooter";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import * as Yup from "yup";

import {
  transaction_ledger_list,
  transaction_ledger_details,
  vouchers_ledger_list,
  getAllHSN,
  get_taxOutlet,
  createTax,
  createHSN,
  getPaymentModes,
  createGstInput,
  checkInvoiceDateIsBetweenFY,
  authenticationService,
  getLastRecordGSTInput,
  delete_ledger,
} from "@/services/api_functions";

import {
  MyTextDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
  getValue,
  purchaseSelect,
  AuthenticationCheck,
  MyDatePicker,
  getSelectValue,
  calculatePercentage,
  gstHSN,
} from "@/helpers";

const typeoption = [
  { label: "Services", value: "Services" },
  { label: "Goods", value: "Goods" },
];
export default class GSTInput extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.voucherDateRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.state = {
      show: false,
      initVal: {
        transaction_dt: moment(new Date()).format("DD-MM-YYYY"),
        voucher_sr_no: 1,
        partyName: "",
        postingAcc: "",
      },
      initValTax: {
        id: "",
        gst_per: "",
        sratio: "50%",
        igst: "",
        cgst: "",
        sgst: "",
      },
      HSNinitVal: {
        id: "",
        hsnNumber: "",
        igst: "",
        cgst: "",
        sgst: "",
        description: "",
        type: "",
      },
      ledgerList: [],
      voucherList: [],
      optHSNList: [],
      optTaxList: [],
      paymentOpt: [],
      rows: [],
      ledgerData: "",
      voucherData: "",
      ledgerModal: false,
      ledgerPostingModal: false,
      HSNshow: false,
      taxModalShow: false,
      selectedLedger: "",
      col_total: "",
      grandTotal: "",
      taxcal: { igst: [], cgst: [], sgst: [] },
      // supplierCodeLst: [],
      lstGst: [],
      partyNameId: "",
      postingAccId: "",
      voucher_dt: "",
      voucher_no: 0,
      round_off_amt: 0,
      selected_state: "",
      add_button_flag: false,
    };
  }

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            ledgerList: res.list,
          });
        }
      })
      .catch(() => {});
  };

  getLastRecordGSTInputFn = () => {
    getLastRecordGSTInput()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            voucher_sr_no: res.count,
          });
          this.myRef.current.setFieldValue("voucher_sr_no", res.count);
        }
      })
      .catch(() => {});
  };

  transaction_ledger_detailsFun = (ledger_id = 0) => {
    let requestData = new FormData();
    requestData.append("ledger_id", ledger_id);
    transaction_ledger_details(requestData)
      .then((response) => {
        console.log("transaction_ledger_detailsFun : ", ledger_id, response);
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            ledgerData: res.result,
          });
        }
      })
      .catch(() => {});
  };
  deleteledger = (id) => {
    debugger;
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
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };

  voucher_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    vouchers_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            voucherList: res.list,
          });
        }
      })
      .catch(() => {});
  };

  ledgerModalFun = (status) => {
    this.setState({ ledgerData: "", ledgerModal: status });
  };

  ledgerPostingModalFun = (status) => {
    this.setState({ ledgerData: "", ledgerPostingModal: status });
  };

  handleHSNModalShow = (status) => {
    this.setState({
      HSNshow: status,
    });
  };

  handleTaxModalShow = (status) => {
    this.setState({
      taxModalShow: status,
    });
  };

  HSNshow = (value) => {
    this.setState({ HSNshow: value }, () => {
      if (value == false)
        this.setState({
          HSNinitVal: {
            id: "",
            hsnNumber: "",
            igst: "",
            cgst: "",
            sgst: "",
            description: "",
            type: getValue(typeoption, "Goods"),
          },
        });
    });
  };

  taxModalShow = (value) => {
    this.setState({ taxModalShow: value }, () => {
      if (value == false)
        this.setState({
          initValTax: {
            id: "",
            gst_per: "",
            sratio: "50%",
            igst: "",
            cgst: "",
            sgst: "",
          },
        });
    });
  };

  lstHSN = (id = "") => {
    getAllHSN()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.hsnno,
              hsndesc: data.hsndesc,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });

          if (options.length == 0)
            options.unshift({
              value: "0",
              label: "Add New",
              hsndesc: "",
              igst: "",
              cgst: "",
              sgst: "",
            });
          else
            options.unshift({
              value: options.length + 1,
              label: "Add New",
              hsndesc: "",
              igst: "",
              cgst: "",
              sgst: "",
            });
          this.setState({ optHSNList: options }, () => {
            // if (id != "") {
            //   let optSelected = getValue(options, parseInt(id));
            //   this.myRef.current.setFieldValue("hsnNo", optSelected);
            // }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstTAX = (id = "") => {
    get_taxOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.gst_per,
              sratio: data.ratio,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });

          if (options.length == 0)
            options.unshift({
              value: "0",
              label: "Add New",
              sratio: "",
              igst: "",
              cgst: "",
              sgst: "",
            });
          else
            options.unshift({
              value: options.length + 1,
              label: "Add New",
              sratio: "",
              igst: "",
              cgst: "",
              sgst: "",
            });

          this.setState({ optTaxList: options }, () => {
            if (id != "") {
              let optSelected = getSelectValue(
                this.state.optTaxList,
                parseInt(id)
              );
              if (optSelected != "") {
                this.myRef.current.setFieldValue("taxMasterId", optSelected);
              }
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  PreviuosPageProfit = (status) => {
    eventBus.dispatch("page_change", {
      from: "gst_input",
      to: "gst_input_list",
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.initRow();
      this.transaction_ledger_listFun();
      this.voucher_ledger_listFun();
      this.lstTAX();
      this.lstHSN();
      this.lstModeOfPayment();
      // mousetrap.bindGlobal("esc", this.PreviuosPageProfit);
      this.getLastRecordGSTInputFn();
    }
  }

  lstModeOfPayment = () => {
    getPaymentModes()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          console.log("payment modes:", data);
          let Opt = data.map(function (values) {
            return { value: values.id, label: values.payment_mode };
          });
          this.setState({ paymentOpt: Opt });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkInvoiceDateIsBetweenFYFun = (voucher_dt = "", setFieldValue) => {
    let requestData = new FormData();
    requestData.append(
      "voucher_dt",
      moment(voucher_dt, "DD-MM-YYYY").format("YYYY-MM-DD")
    );
    checkInvoiceDateIsBetweenFY(requestData)
      .then((response) => {
        console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "confirm",
              title: "Voucher date not valid as per FY",
              msg: "Do you want continue with Voucher date",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => {
                // setFieldValue("voucher_dt", moment(voucher_dt, "DD/MM/YYYY"));
                // this.voucherDateRef.current.setFieldValue("voucher_dt", moment(voucher_dt, "DD/MM/YYYY").format("YYYY-MM-DD"));
                // console.log("inside Date dialog", moment(voucher_dt, "DD/MM/YYYY"));
                // eventBus.dispatch("page_change", "gst_input");
              },
              handleFailFn: () => {
                setFieldValue("voucher_dt", "");
                eventBus.dispatch("page_change", "gst_input");
                // this.reloadPage();
              },
            },
            () => {}
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        productId: "",
        name: "",
        hsn: "",
        tax: "",
        amount: "",
        qty: "",
        gross_amt: 0,
        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
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
  handleMstState = (rows) => {
    this.setState({ rows: rows });
  };

  handleAddRow = () => {
    let { rows } = this.state;
    let new_row = {
      productId: "",
      name: "",
      hsn: "",
      tax: "",
      amount: "",
      qty: "",
      gross_amt: 0,
      gst: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      total_igst: 0,
      total_cgst: 0,
      total_sgst: 0,
      final_amt: 0,
    };
    console.warn({ new_row });
    rows = [...rows, new_row];
    this.handleMstState(rows);
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    console.log("elementCheck", element, index, elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  handleRemoveRow = (rowIndex = -1) => {
    let { rows, rowDelDetailsIds, taxcal } = this.state;
    // debugger;
    console.log("rows", rows, rowIndex, rowDelDetailsIds);
    let deletedRow = rows.filter((v, i) => i === rowIndex);
    console.warn("rahul::deletedRow ", deletedRow, rowDelDetailsIds);

    // if (deletedRow) {
    //   deletedRow.map((uv, ui) => {
    //     if (!rowDelDetailsIds.includes(uv.details_id)) {
    //       rowDelDetailsIds.push(uv.details_id);
    //     }
    //   });
    // }

    rows = rows.filter((v, i) => i != rowIndex);
    // let igst = taxcal.igst.filter((v, i) => i != rowIndex);
    // let cgst = taxcal.cgst.filter((v, i) => i != rowIndex);
    // let sgst = taxcal.sgst.filter((v, i) => i != rowIndex);
    // let taxState = { cgst: cgst, sgst: sgst, igst: igst };

    console.warn("rahul::rows ", rows);
    // this.setState({ rows: rows, taxcal: taxState });
    this.setState({ rows: rows }, () => {
      this.handleUnitChange();
    });

    // rows.map((v, i) => {
    //   this.handleUnitChange("tax",v,i);
    // });
    // this.handleTranxCalculation();
    // this.handleGstCalculations();
  };

  handleUnitChange = (ele, value, rowIndex) => {
    let { rows } = this.state;
    // let amtWithTax = 0;
    console.log("(ele, value, rowIndex) ", ele, rowIndex, value, rows);
    if (ele != undefined && value != undefined && rowIndex != undefined) {
      if (ele == "tax") {
        rows[rowIndex]["gst"] = value.igst;
        rows[rowIndex]["igst"] = value.igst;
        rows[rowIndex]["sgst"] = value.sgst;
        rows[rowIndex]["cgst"] = value.cgst;
        rows[rowIndex]["tax_selected"] = value.value;
      } else if (ele == "hsn") {
        rows[rowIndex]["hsn_selected"] = value.value;
      }
      rows[rowIndex][ele] = value;
      this.setState({ rows: rows });
    }
    console.log("rows>>>", rows);
    this.handleTranxCalculation();
  };

  handleTranxCalculation = () => {
    // !Most IMP̥
    let { rows, selected_state } = this.state;
    let roffamt;
    // ! Row level Discount Calculation
    rows.map((uv, i) => {
      // let base_amt = parseFloat(uv.amount);
      let base_amt = parseInt(uv.qty) * parseFloat(uv.amount);
      uv.base_amt = isNaN(base_amt) ? 0 : parseFloat(base_amt);
      let tax = isNaN(base_amt)
        ? 0
        : (parseFloat(base_amt) * parseInt(uv.tax.label)) / 100;
      console.log("tax:>>>", tax, base_amt);
      uv["total_amt"] = parseFloat(base_amt);
      let grandTotal = parseFloat(base_amt) + tax;
      uv["grand_total"] = grandTotal;

      let roundoffamt = Math.round(grandTotal);
      roffamt = parseFloat(roundoffamt - grandTotal).toFixed(2);
      uv["total_igst"] = parseFloat(
        calculatePercentage(base_amt, uv["igst"])
      ).toFixed(2);
      uv["total_cgst"] = parseFloat(
        calculatePercentage(base_amt, uv["cgst"])
      ).toFixed(2);
      uv["total_sgst"] = parseFloat(
        calculatePercentage(base_amt, uv["sgst"])
      ).toFixed(2);
      return uv;
    });
    let gstResult = this.handleGstCalculations();

    let { taxIgst, taxCgst, taxSgst } = gstResult;

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    console.log(
      "authenticationService.currentUserValue.state",
      authenticationService.currentUserValue.state,
      selected_state
    );
    if (
      authenticationService.currentUserValue.state &&
      selected_state != authenticationService.currentUserValue.state
    ) {
      let taxCal = {
        igst: taxIgst,
      };
      this.myRef.current.setFieldValue("taxCalculation", taxCal);
    } else {
      let taxCal = {
        cgst: taxCgst,
        sgst: taxSgst,
      };
      this.myRef.current.setFieldValue("taxCalculation", taxCal);
    }

    let amtWithTax = 0;
    let colTotal = 0;
    rows.map((uv) => {
      colTotal += uv.total_amt;
      amtWithTax += uv.grand_total;
    });
    this.setState({
      taxcal: taxState,
      col_total: colTotal,
      grandTotal: amtWithTax,
      round_off_amt: roffamt,
    });
    this.myRef.current.setFieldValue(
      "col_total",
      parseFloat(colTotal).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "grand_total",
      parseFloat(amtWithTax).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "round_off_amt",
      parseFloat(roffamt).toFixed(2)
    );

    let totalcgst = taxState.cgst.reduce((n, p) => n + parseFloat(p.amt), 0);
    let totalsgst = taxState.sgst.reduce((n, p) => n + parseFloat(p.amt), 0);
    let totaligst = taxState.igst.reduce((n, p) => n + parseFloat(p.amt), 0);
    this.myRef.current.setFieldValue("totalcgst", totalcgst);
    this.myRef.current.setFieldValue("totalsgst", totalsgst);
    this.myRef.current.setFieldValue("totaligst", totaligst);
  };

  handleGstCalculations = () => {
    let { rows } = this.state;
    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    rows.map((uv, i) => {
      console.log("rows : ", uv);
      // !IGST Calculation
      if (uv.igst > 0) {
        if (taxIgst.length > 0) {
          let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
          if (innerIgstTax != undefined) {
            let innerIgstCal = taxIgst.filter((vi) => {
              console.log("Calculation:", vi);
              if (vi.gst == uv.igst) {
                vi["amt"] =
                  parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]);
              }
              return vi;
            });
            taxIgst = [...innerIgstCal];
          } else {
            let innerIgstCal = {
              d_gst: uv.igst,

              gst: uv.igst,
              amt: parseFloat(uv.total_igst),
            };
            taxIgst = [...taxIgst, innerIgstCal];
          }
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,
            gst: uv.igst,
            amt: parseFloat(uv.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      }

      // !CGST Calculation
      if (uv.cgst > 0) {
        if (taxCgst.length > 0) {
          let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
          if (innerCgstTax != undefined) {
            let innerCgstCal = taxCgst.filter((vi) => {
              if (vi.gst == uv.cgst) {
                vi["amt"] =
                  parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]);
              }
              return vi;
            });
            taxCgst = [...innerCgstCal];
          } else {
            let innerCgstCal = {
              d_gst: uv.igst,

              gst: uv.cgst,
              amt: parseFloat(uv.total_cgst),
            };
            taxCgst = [...taxCgst, innerCgstCal];
          }
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: parseFloat(uv.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      }

      // !SGST Calculation
      if (uv.sgst > 0) {
        if (taxSgst.length > 0) {
          let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
          if (innerCgstTax != undefined) {
            let innerCgstCal = taxSgst.filter((vi) => {
              if (vi.gst == uv.sgst) {
                vi["amt"] =
                  parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]);
              }
              return vi;
            });
            taxSgst = [...innerCgstCal];
          } else {
            let innerCgstCal = {
              d_gst: uv.igst,

              gst: uv.sgst,
              amt: parseFloat(uv.total_sgst),
            };
            taxSgst = [...taxSgst, innerCgstCal];
          }
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: parseFloat(uv.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      }
    });
    return {
      taxIgst,
      taxCgst,
      taxSgst,
    };
  };

  handleGstChange = (value, element, valObject, setFieldValue) => {
    let flag = false;
    let igst = 0;
    if (element == "gst_per") {
      if (value != "") {
        let gst_per = value;
        igst = value.replace("%", "");

        setFieldValue("gst_per", gst_per);
        setFieldValue("igst", igst);
      } else {
        setFieldValue("gst_per", "");
        setFieldValue("igst", "");
      }
    }

    if (valObject.sratio != "") {
      // if (value != '') {
      igst = igst > 0 ? igst : valObject.igst;
      let sratio = parseFloat(valObject.sratio);
      let per = parseFloat((igst * sratio) / 100);
      let rem = parseFloat(igst - per);
      setFieldValue("sratio", sratio);
      setFieldValue("cgst", per);
      setFieldValue("sgst", rem);
      // } else {
      //   setFieldValue('sratio', '');
      //   setFieldValue('cgst', '');
      //   setFieldValue('sgst', '');
      // }
    }
  };
  checkLastRow = (ri, n, product, amount, qty) => {
    if (ri === n && product != null && amount !== "" && qty !== "") return true;
    return false;
  };

  render() {
    let {
      initVal,
      rows,
      ledgerModal,
      ledgerPostingModal,
      additionalCharges,
      ledgerList,
      voucherList,
      ledgerData,
      selectedLedger,
      taxcal,
      col_total,
      grandTotal,
      HSNshow,
      taxModalShow,
      optTaxList,
      optHSNList,
      initValTax,
      HSNinitVal,
      paymentOpt,
      voucher_dt,
      voucher_no,
      add_button_flag,
    } = this.state;
    return (
      <div className="gst_form_style">
        {/* <h6>Purchase Invoice</h6> */}

        <div className="cust_table">
          <Formik
            validateOnChange={false}
            // validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              partyName: Yup.string().required("Supplier Name is required"),
              postingAcc: Yup.string().required("Posting A/C is required"),
              voucher_dt: Yup.string()
                .trim()
                .required("Voucher Date is required"),
              voucher_no: Yup.string().required("Voucher No is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log(
                "inside onSubmit >>>",
                values,
                rows,
                moment(values.transaction_dt).format("YYYY-MM-DD")
              );
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to save",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    let requestData = new FormData();
                    requestData.append(
                      "transaction_dt",
                      moment(values.transaction_dt).format("YYYY-MM-DD")
                    );
                    requestData.append("col_total", values.col_total);
                    requestData.append("grand_total", values.grand_total);
                    requestData.append("narration", values.narration);
                    requestData.append("voucher_sr_no", values.voucher_sr_no);
                    requestData.append("partyNameId", values.partyNameId);
                    requestData.append("pay_mode", values.pay_mode);
                    requestData.append("voucher_no", values.voucher_no);
                    requestData.append("round_off_amt", values.round_off_amt);
                    requestData.append(
                      "voucher_dt",
                      moment(values.voucher_dt, "DD/MM/YYYY").format(
                        "YYYY-MM-DD"
                      )
                    );
                    requestData.append("postingAccId", values.postingAccId);
                    requestData.append("totalcgst", values.totalcgst);
                    requestData.append("totaligst", values.totaligst);
                    requestData.append("totalsgst", values.totalsgst);
                    requestData.append(
                      "taxCalculation",
                      JSON.stringify(values.taxCalculation)
                    );

                    requestData.append("rows", JSON.stringify(rows));

                    console.log("before API Call==-->>>", requestData);

                    createGstInput(requestData)
                      .then((response) => {
                        console.log("in create");
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
                          eventBus.dispatch("page_change", "gst_input_list");
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
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                noValidate
                // className="common-form-style form-style"
                style={{ overflowY: "hidden", overflowX: "hidden" }}
              >
                <div className="institute-head p-2 header-style">
                  <Row>
                    <Col className="my-auto" md={1} lg={1} sm={1}>
                      <Form.Label>
                        Tranx. Date
                        {/* <span className="pt-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md={1} lg={2} sm={1}>
                      <MyTextDatePicker
                        innerRef={(input) => {
                          this.invoiceDateRef.current = input;
                        }}
                        className="tnx-pur-inv-date-style "
                        name="transaction_dt"
                        id="transaction_dt"
                        // autoFocus={true}
                        placeholder="DD/MM/YYYY"
                        dateFormat="dd/MM/yyyy"
                        value={values.transaction_dt}
                        onChange={handleChange}
                        onBlur={(e) => {
                          console.log("e ", e);
                          console.log("e.target.value ", e.target.value);
                          if (e.target.value != null && e.target.value != "") {
                            console.warn(
                              "warn:: isValid",
                              moment(e.target.value, "DD-MM-YYYY").isValid()
                            );
                            if (
                              moment(e.target.value, "DD-MM-YYYY").isValid() ==
                              true
                            ) {
                              setFieldValue("transaction_dt", e.target.value);
                              this.checkInvoiceDateIsBetweenFYFun(
                                e.target.value,
                                setFieldValue
                              );
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
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.transaction_dt}
                      </Form.Control.Feedback>
                    </Col>
                    <Col className="my-auto fRp" md={1} lg={1} sm={1}>
                      <Form.Label className="pt-0">
                        Voucher Sr.No.
                        {/* <span className="pt-1 pl-1 req_validation">
                          *
                        </span>:{" "} */}
                      </Form.Label>
                    </Col>
                    <Col md={2} lg={2} sm={2}>
                      <Form.Control
                        type="text"
                        readOnly={true}
                        className="tnx-pur-inv-text-box mt-1"
                        placeholder=" "
                        name="voucher_sr_no"
                        id="voucher_sr_no"
                        onChange={handleChange}
                        value={values.voucher_sr_no}
                        isValid={touched.voucher_sr_no && !errors.voucher_sr_no}
                        isInvalid={!!errors.voucher_sr_no}
                      />
                    </Col>
                    <Col className="my-auto" md={1} lg={1} sm={1}>
                      <Form.Label className="pt-0">Voucher No.</Form.Label>
                    </Col>
                    <Col md={2} lg={2} sm={2}>
                      <Form.Control
                        type="text"
                        className="tnx-pur-inv-text-box mt-1"
                        placeholder="Voucher No."
                        name="voucher_no"
                        id="voucher_no"
                        onChange={handleChange}
                        value={values.voucher_no}
                        isValid={touched.voucher_no && !errors.voucher_no}
                        isInvalid={!!errors.voucher_no}
                      />
                      <span className="text-danger errormsg">
                        {errors.voucher_no}
                      </span>
                    </Col>
                    <Col className="my-auto fRp" md={1} lg={1} sm={1}>
                      <Form.Label className="pt-0">
                        Supplier Name
                        {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md={1} lg={2} sm={1}>
                      <Form.Control
                        style={{
                          textAlign: "left",
                          paddingRight: "10px",
                          background: "#ffffff",
                          // /readonly,
                        }}
                        name="partyName"
                        id="partyName"
                        onClick={(e) => {
                          e.preventDefault();
                          this.ledgerModalFun(true);
                        }}
                        placeholder="Supplier Name"
                        className="mb-0 mt-1 tnx-pur-inv-text-box"
                        value={values.partyName}
                      />
                      <span className="text-danger errormsg">
                        {errors.partyName}
                      </span>
                    </Col>
                    <Col className="my-auto" md={1} lg={1} sm={1}>
                      <Form.Label className="pt-0">
                        Posting A/c
                        {/* <span className="pt-1 pl-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md={1} lg={2} sm={1}>
                      <Form.Control
                        style={{
                          textAlign: "left",
                          paddingRight: "10px",
                          background: "#ffffff",
                          // /readonly,
                        }}
                        name="postingAcc"
                        id="postingAcc"
                        onClick={(e) => {
                          e.preventDefault();
                          this.ledgerPostingModalFun(true);
                        }}
                        placeholder="Posting Account"
                        className="mb-0 tnx-pur-inv-text-box"
                        value={values.postingAcc}
                      />
                      <span className="text-danger errormsg">
                        {errors.postingAcc}
                      </span>
                    </Col>
                    <Col className="my-auto" md={1} lg={1} sm={1}>
                      <Form.Label>
                        Voucher Date
                        {/* <span className="pt-1 req_validation">*</span> */}
                      </Form.Label>
                    </Col>
                    <Col md={1} lg={2} sm={1}>
                      <MyTextDatePicker
                        innerRef={(input) => {
                          this.voucherDateRef.current = input;
                        }}
                        className="tnx-pur-inv-date-style mt-1"
                        name="voucher_dt"
                        id="voucher_dt"
                        placeholder="DD/MM/YYYY"
                        dateFormat="dd/MM/yyyy"
                        value={values.voucher_dt}
                        onChange={handleChange}
                        onBlur={(e) => {
                          console.log("e ", e);
                          console.log("e.target.value ", e.target.value);
                          if (e.target.value != null && e.target.value != "") {
                            console.warn(
                              "warn:: isValid",
                              moment(e.target.value, "DD-MM-YYYY").isValid()
                            );
                            if (
                              moment(e.target.value, "DD-MM-YYYY").isValid() ==
                              true
                            ) {
                              setFieldValue("voucher_dt", e.target.value);
                              this.checkInvoiceDateIsBetweenFYFun(
                                e.target.value,
                                setFieldValue
                              );
                            } else {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",
                                msg: "Invalid invoice date",
                                is_button_show: true,
                              });
                              this.voucherDateRef.current.focus();
                              setFieldValue("voucher_dt", "");
                            }
                          } else {
                            setFieldValue("voucher_dt", "");
                          }
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.voucher_dt}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </div>
                {/* right side menu start */}
                {/* right side menu end */}
                <div
                  className="tbl-body-style-new table-th-width-style"
                  // style={{ maxHeight: "60vh", height: "60vh" }}
                >
                  <Table size="sm" className="tbl-font mt-2">
                    <thead>
                      <tr>
                        <th className="th1" style={{ textAlign: "center" }}>
                          Sr. No.
                        </th>
                        <th className="th2" style={{ textAlign: "center" }}>
                          Particulars
                        </th>
                        <th
                          className="th3"
                          style={{ textAlign: "center" }}
                          //   className="pl-4"
                        >
                          HSN
                        </th>
                        <th
                          className="th4"
                          style={{ textAlign: "center" }}
                          //   className="pl-4"
                        >
                          Quantity
                        </th>
                        <th
                          className="th5"
                          style={{ textAlign: "center" }}
                          //   className="pl-4"
                        >
                          Amount
                        </th>
                        <th className="th6" style={{ textAlign: "center" }}>
                          Tax
                        </th>
                        <th
                          className="th7"
                          style={{ textAlign: "center" }}
                          //   className="pl-4"
                        ></th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: "2px solid transparent" }}>
                      {/* {JSON.stringify(rows)} */}
                      {rows &&
                        rows.length > 0 &&
                        rows.map((vi, ii) => {
                          return (
                            <tr className="entryrow">
                              <td
                                className="td1"
                                style={{ textAlign: "center" }}
                              >
                                {parseInt(ii) + 1}
                                {/* {JSON.stringify(vi)} */}
                              </td>
                              <td
                                className="td2"
                                style={{
                                  background: "#f5f5f5",
                                }}
                              >
                                <Form.Control
                                  autoComplete="nope"
                                  id={`name-${ii}`}
                                  name={`name-${ii}`}
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleUnitChange("name", v, ii);
                                  }}
                                  style={{ textAlign: "center" }}
                                  value={this.setElementValue("name", ii)}
                                  // value={rows[ii]["name"]}
                                />
                              </td>
                              <td className="td3">
                                <Select
                                  // className="selectTo"
                                  isClearable
                                  style={{ border: "none" }}
                                  styles={gstHSN}
                                  placeholder="HSN"
                                  id={`hsn-${ii}`}
                                  name={`hsn-${ii}`}
                                  onChange={(v) => {
                                    setFieldValue("hsn", "");
                                    if (v != "") {
                                      if (v.label === "Add New") {
                                        this.HSNshow(true);
                                      } else {
                                        // setFieldValue("hsn", v);
                                        // let v = e.target.value;
                                        console.log("fron hsn", values);
                                        this.handleUnitChange("hsn", v, ii);
                                      }
                                    }
                                  }}
                                  options={optHSNList}
                                  value={rows[ii]["hsn"]}
                                />
                                <span className="text-danger errormsg">
                                  {errors.hsn}
                                </span>
                                {/* <Form.Control
                                id={`hsn-${ii}`}
                                name={`hsn-${ii}`}
                                type="text"
                                onChange={(e) => {
                                  let v = e.target.value;
                                  this.handleUnitChange("hsn", v, ii);
                                }}
                                style={{ textAlign: "center" }}
                                // value={rows[ii]["hsn"]}
                                value={this.setElementValue("hsn", ii)}
                                // readOnly={
                                //   this.setElementValue("type", ii) == "dr"
                                //     ? false
                                //     : true
                                // }
                              /> */}
                              </td>
                              <td className="td4" style={{}}>
                                <Form.Control
                                  id={`qty-${ii}`}
                                  name={`qty-${ii}`}
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleUnitChange("qty", v, ii);
                                  }}
                                  style={{ textAlign: "center" }}
                                  // value={rows[ii]["qty"]}
                                  value={this.setElementValue("qty", ii)}
                                  // readOnly={
                                  //   this.setElementValue("type", ii) == "cr"
                                  //     ? false
                                  //     : true
                                  // }
                                />
                              </td>
                              <td className="td5" style={{}}>
                                <Form.Control
                                  id={`amount-${ii}`}
                                  name={`amount-${ii}`}
                                  type="text"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    this.handleUnitChange("amount", v, ii);
                                  }}
                                  style={{ textAlign: "center" }}
                                  // value={rows[ii]["amount"]}
                                  value={this.setElementValue("amount", ii)}
                                  // readOnly={
                                  //   this.setElementValue("type", ii) == "dr"
                                  //     ? false
                                  //     : true
                                  // }
                                />
                              </td>
                              <td className="td6" style={{}}>
                                <Select
                                  // className="selectTo"
                                  isClearable
                                  styles={gstHSN}
                                  placeholder="Tax"
                                  id={`tax-${ii}`}
                                  name={`tax-${ii}`}
                                  onChange={(v) => {
                                    setFieldValue("tax", "");
                                    if (v != "") {
                                      // console.log({ v });
                                      if (v.label === "Add New") {
                                        this.taxModalShow(true);
                                      } else {
                                        // setFieldValue("tax", v);
                                        // let v = e.target.value;
                                        this.handleUnitChange("tax", v, ii);
                                      }
                                    }
                                  }}
                                  options={optTaxList}
                                  value={rows[ii]["tax"]}
                                />
                                <span className="text-danger errormsg">
                                  {errors.tax}
                                </span>
                                {/* <Form.Control
                                id={`tax-${ii}`}
                                name={`tax-${ii}`}
                                type="text"
                                onChange={(e) => {
                                  let v = e.target.value;
                                  this.handleUnitChange(
                                    "tax",
                                    v,
                                    ii
                                  );
                                }}
                                style={{ textAlign: "center" }}
                                // value={rows[ii]["tax"]}
                                value={this.setElementValue("tax", ii)}
                                // readOnly={
                                //   this.setElementValue("type", ii) == "cr"
                                //     ? false
                                //     : true
                                // }
                              /> */}
                              </td>

                              <td
                                className="td7"
                                style={{ textAlign: "center" }}
                              >
                                {rows.length > 1 && (
                                  <Button
                                    className="btn_img_style"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.handleRemoveRow(ii);
                                      this.setState({ add_button_flag: true });
                                    }}
                                  >
                                    <img
                                      isDisabled={
                                        rows.length === 0 ? true : false
                                      }
                                      src={delete_icon2}
                                      alt=""
                                      className="btnimg"
                                    />
                                  </Button>
                                )}
                                {this.checkLastRow(
                                  ii,
                                  rows.length - 1,
                                  vi,
                                  rows[ii]["qty"],
                                  rows[ii]["amount"]
                                ) && (
                                  <Button
                                    className="btn_img_style"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.handleAddRow();
                                      this.setState({
                                        add_button_flag: !add_button_flag,
                                      });
                                    }}
                                    isDisabled={
                                      vi && vi.productId && vi.productId != ""
                                        ? true
                                        : false
                                    }
                                  >
                                    <img
                                      src={add_icon}
                                      alt=""
                                      className="btnimg"
                                    />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <thead>
                      <tr
                        style={{
                          background: "#dde2ed",
                          borderTop: "2px solid transparent",
                        }}
                      >
                        <td
                          colSpan={5}
                          className=" total-amt fw-bold fs-6"
                          style={{
                            textAlign: "right",
                          }}
                        >
                          {" "}
                          Total
                        </td>

                        <td colSpan={2} className="total-add-amt">
                          <Form.Control
                            id="col_total"
                            name="col_total"
                            style={{
                              textAlign: "left",
                              // width: "8%",
                              background: "transparent",
                              border: "none",
                            }}
                            type="text"
                            placeholder=""
                            value={col_total}
                            readonly
                          />
                        </td>
                      </tr>
                    </thead>
                  </Table>
                </div>
                <Row className="mb-2 btm-data">
                  <Col lg={7}>
                    <Row className="mt-2">
                      <Col lg={2}>
                        <Form.Label className="text-label fw-bold fs-6">
                          Narration:
                        </Form.Label>
                      </Col>
                      <Col lg={10}>
                        <Form.Control
                          as="textarea"
                          placeholder="Enter Narration"
                          style={{ height: "72px", resize: "none" }}
                          className="tnx-pur-inv-text-box"
                          id="narration"
                          onChange={handleChange}
                          // rows={5}
                          // cols={25}
                          name="narration"
                          value={values.narration}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={3}>
                    <Row className="mt-2">
                      <Col lg={9}>
                        <TGSTFooter
                          values={values}
                          taxcal={taxcal}
                          authenticationService={authenticationService}
                        />
                        {/* <Table className="gst-tbl-width">
                          <tbody>
                            <tr>
                              <td className="py-0 fw-bold gst-labels text-center">
                                IGST
                              </td>
                              <td className="p-0 text-end gst-labels">
                                {parseFloat("9999.99").toFixed(2)}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-0 fw-bold gst-labels text-center">
                                CGST
                              </td>
                              <td className="p-0 text-end gst-labels">
                                {parseFloat("9999.99").toFixed(2)}
                              </td>
                            </tr>

                            <tr>
                              <td className="py-0 fw-bold gst-labels text-center">
                                SGST
                              </td>
                              <td className="p-0 text-end gst-labels">
                                {parseFloat("9999.99").toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </Table> */}
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={2} className="footer-gst-tbl-style">
                    <Row className="px-2">
                      <Table className="btm-amt-tbl" style={{ width: "333px" }}>
                        <tbody>
                          <tr>
                            <td className="py-0">Total Amount</td>
                            <td className="p-0 text-end">
                              {grandTotal == "" || isNaN(grandTotal)
                                ? "0.00"
                                : parseFloat(grandTotal).toFixed(2)}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-0">MOP</td>
                            <td className="p-0 ">
                              <Select
                                placeholder="Pay Mode"
                                isClearable
                                className="selectTo mb-2"
                                styles={purchaseSelect}
                                options={paymentOpt}
                                name="payment_mode"
                                id="payment_mode"
                                onChange={(v) => {
                                  setFieldValue("payment_mode", "");
                                  if (v != null) {
                                    setFieldValue("pay_mode", v.value);
                                    setFieldValue("payment_mode", v);
                                  }
                                }}
                                value={values.payment_mode}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col className="text-end">
                    <Button className="successbtn-style" type="submit">
                      Submit
                    </Button>

                    <Button
                      className="cancel-btn ms-2"
                      onClick={(e) => {
                        e.preventDefault();
                        MyNotifications.fire(
                          {
                            show: true,
                            icon: "confirm",
                            title: "Confirm",
                            msg: "Do you want to cancel",
                            is_button_show: false,
                            is_timeout: false,
                            delay: 0,
                            handleSuccessFn: () => {
                              eventBus.dispatch("page_change", {
                                from: "gst_input",
                                to: "gst_input_list",
                                isNewTab: false,
                                isCancel: true,
                              });
                            },
                            handleFailFn: () => {},
                          },
                          () => {
                            console.warn("return_data");
                          }
                        );
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>

                {/* <div className="summery mx-2 p-2 invoice-btm-style">
                  <Row>
                    <Col md="10">
                      <div className="summerytag narrationdiv">
                        <fieldset>
                          <legend>Narration :</legend>
                          <Form.Group>
                            <Form.Control
                              as="textarea"
                              rows={7}
                              cols={25}
                              name="narration"
                              onChange={handleChange}
                              style={{ width: "100%" }}
                              className="purchace-text"
                              value={values.narration}
                              //placeholder="Narration"
                            />
                          </Form.Group>
                        </fieldset>
                      </div>
                    </Col>
                    <Col md="2" className="text-center">
                      <ButtonGroup className="pt-4">
                        <Button variant="primary submit-btn mt-4" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="secondary cancel-btn mx-2"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", {
                              from: "voucher_payment",
                              to: "voucher_paymentlist",
                              isNewTab: false,
                            });
                          }}
                          className="mt-4"
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="9"></Col>
                  </Row>
                </div> */}
              </Form>
            )}
          </Formik>
          {/* ledgr Name Modal */}
          <Modal
            show={ledgerModal}
            size={
              window.matchMedia("(min-width:1360px) and (max-width:1919px)")
                .matches
                ? "lg"
                : "xl"
            }
            className="tnx-pur-inv-mdl-product"
            centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Select Ledger
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.ledgerModalFun(false);
                }}
              />
            </Modal.Header>

            <Modal.Body className="tnx-pur-inv-mdl-body p-0">
              <Row className="p-3">
                <Col lg={6}>
                  <InputGroup className="mb-2 mdl-text">
                    <Form.Control
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.transaction_ledger_listFun(e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col lg={{ span: 1, offset: 4 }}>
                  <Button
                    className="successbtn-style"
                    onClick={(e) => {
                      e.preventDefault();

                      if (
                        isActionExist(
                          "gst-input",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        let data = {
                          rows: rows,
                          additionalCharges: additionalCharges,
                          invoice_data:
                            this.myRef != null && this.myRef.current
                              ? this.myRef.current.values
                              : "",
                          from_page: "gst_input",
                        };
                        eventBus.dispatch("page_change", {
                          from: "gst_input",
                          to: "ledgercreate",
                          prop_data: data,
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
                    + Add
                  </Button>
                </Col>
              </Row>
              <div className="tnx-pur-inv-ModalStyle">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Ledger Name</th>
                      <th>City</th>
                      <th>Contact No.</th>
                      <th>Current Balance</th>
                      <th></th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerList.map((v) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log("selectedLedger : ", v);
                            this.setState(
                              {
                                selectedLedger: v,
                                partyNameId: v.id,
                                selected_state: v.gstDetails[0].state,
                              },
                              () => {
                                this.transaction_ledger_detailsFun(v.id);
                                if (v != "") {
                                  if (this.myRef.current) {
                                    let opt = [];
                                    if (v != null) {
                                      opt = v.gstDetails.map((v) => {
                                        return {
                                          label: v.gstNo,
                                          value: v.id,
                                        };
                                      });
                                      console.log("opt", opt);
                                    }
                                    this.myRef.current.setFieldValue(
                                      "partyName",
                                      v != "" ? v.ledger_name : ""
                                    );
                                    this.myRef.current.setFieldValue(
                                      "partyNameId",
                                      v != "" ? v.id : ""
                                    );
                                  }
                                  this.setState({
                                    ledgerModal: false,
                                    selectedLedger: "",
                                  });
                                }
                              }
                            );
                          }}
                        >
                          <td>{v.code}</td>
                          <td>{v.ledger_name}</td>
                          <td>{v.city}</td>
                          <td>{v.contact_number}</td>
                          <td>{v.current_balance}</td>
                          <td>{v.balance_type}</td>
                          <td>
                            <img
                              src={TableEdit}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-input",
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
                                        this.deleteledger(v.id);
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
                            <img
                              src={TableDelete}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-input",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  let source = {
                                    rows: rows,
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page: "gst_input",
                                  };

                                  let data = {
                                    source: source,
                                    id: v.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "gst_input",
                                    to: "ledgeredit",
                                    prop_data: data,
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div className="ledger_details_style">
                <Row className="mx-1">
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>GST No.:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.gst_number : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Licence No.:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {ledgerData != ""
                                ? ledgerData.license_number
                                : ""}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td>FSSAI:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.fssai_number : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>Contact Person:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.contact_name : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Area:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.area : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Route:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {ledgerData != "" ? ledgerData.route : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td>Credit Days:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.credit_days : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Transport:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.route : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Bank:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {" "}
                              {ledgerData != "" ? ledgerData.bank_name : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col md="12 mt-2" className="btn_align">
                  {/* <Button
                    className="submit-btn successbtn-style me-2"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log({ selectedLedger });
                      if (selectedLedger != "") {
                        if (this.myRef.current) {
                          let opt = [];
                          if (selectedLedger != null) {
                            opt = selectedLedger.gstDetails.map((v) => {
                              return {
                                label: v.gstNo,
                                value: v.id,
                              };
                            });
                            console.log("opt", opt);
                            // this.setState({
                            //   lstGst: opt,
                            // });
                          }
                          this.myRef.current.setFieldValue(
                            "partyName",
                            selectedLedger != ""
                              ? selectedLedger.ledger_name
                              : ""
                          );
                        }
                        // console.log("invoice_data", { invoice_data });
                        this.setState({
                          ledgerModal: false,
                          //   invoice_data: invoice_data,
                          selectedLedger: "",
                        });
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ selectedLedger: "" }, () => {
                        this.ledgerModalFun(false);
                      });
                    }}
                  >
                    Cancel
                  </Button>*/}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>

          {/* Posting A/c Modal */}
          <Modal
            show={ledgerPostingModal}
            size="xl"
            className="tnx-pur-inv-mdl-product"
            centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Select Ledger
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={(e) => {
                  e.preventDefault();
                  this.ledgerPostingModalFun(false);
                }}
              />
            </Modal.Header>

            <Modal.Body className="tnx-pur-inv-mdl-body p-0">
              <Row className="p-3">
                <Col lg={6}>
                  <InputGroup className="mb-3 mdl-text">
                    <Form.Control
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.voucher_ledger_listFun(e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col lg={{ span: 1, offset: 4 }}>
                  <Button
                    className="successbtn-style"
                    onClick={(e) => {
                      e.preventDefault();

                      if (
                        isActionExist(
                          "gst-input",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        let data = {
                          rows: rows,
                          additionalCharges: additionalCharges,
                          invoice_data:
                            this.myRef != null && this.myRef.current
                              ? this.myRef.current.values
                              : "",
                          from_page: "gst_input",
                        };
                        eventBus.dispatch("page_change", {
                          from: "gst_input",
                          to: "ledgercreate",
                          prop_data: data,
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
                    + Add
                  </Button>
                </Col>
              </Row>
              <div className="tnx-pur-inv-ModalStyle">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Ledger Name</th>
                      <th>City</th>
                      <th>Contact No.</th>
                      <th>Current Balance</th>
                      <th></th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voucherList.map((v) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            console.log({ v });
                            this.setState(
                              { selectedLedger: v, postingAccId: v.id },
                              () => {
                                if (v != "") {
                                  if (this.myRef.current) {
                                    let opt = [];
                                    if (v != null) {
                                      opt = v.gstDetails.map((v) => {
                                        return {
                                          label: v.gstNo,
                                          value: v.id,
                                        };
                                      });
                                      console.log("opt", opt);
                                    }
                                    this.myRef.current.setFieldValue(
                                      "postingAcc",
                                      v != "" ? v.ledger_name : ""
                                    );
                                    this.myRef.current.setFieldValue(
                                      "postingAccId",
                                      v != "" ? v.id : ""
                                    );
                                  }
                                  // console.log("invoice_data", { invoice_data });
                                  this.setState({
                                    ledgerPostingModal: false,
                                    //   invoice_data: invoice_data,
                                    selectedLedger: "",
                                  });
                                }
                              }
                            );
                          }}
                        >
                          <td>{v.code}</td>
                          <td>{v.ledger_name}</td>
                          <td>{v.city}</td>
                          <td>{v.contact_number}</td>
                          <td>{v.current_balance}</td>
                          <td>{v.balance_type}</td>
                          <td>
                            <img
                              src={TableEdit}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-input",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  let source = {
                                    rows: rows,
                                    additionalCharges: additionalCharges,
                                    invoice_data:
                                      this.myRef != null && this.myRef.current
                                        ? this.myRef.current.values
                                        : "",
                                    from_page: "gst_input",
                                  };

                                  let data = {
                                    source: source,
                                    id: v.id,
                                  };
                                  console.log({ data });
                                  eventBus.dispatch("page_change", {
                                    from: "gst_input",
                                    to: "ledgeredit",
                                    prop_data: data,
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
                              src={TableDelete}
                              alt=""
                              className="mdl-icons"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-input",
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
                                        // this.deleteledgerFun(v.id);
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
                  </tbody>
                </Table>
              </div>
              <Row>
                <Col md="12 mt-2" className="btn_align">
                  {/* <Button
                    className="submit-btn successbtn-style me-2"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log({ selectedLedger });
                      if (selectedLedger != "") {
                        if (this.myRef.current) {
                          let opt = [];
                          if (selectedLedger != null) {
                            opt = selectedLedger.gstDetails.map((v, i) => {
                              return {
                                label: v.gstNo,
                                value: v.id,
                              };
                            });
                            console.log("opt", opt);
                            // this.setState({
                            //   lstGst: opt,
                            // });
                          }
                          console.log("lstGst", lstGst);
                          this.myRef.current.setFieldValue(
                            "posting_acc",
                            selectedLedger != ""
                              ? selectedLedger.ledger_name
                              : ""
                          );
                        }
                        // console.log("invoice_data", { invoice_data });
                        this.setState({
                          ledgerPostingModal: false,
                          //   invoice_data: invoice_data,
                          selectedLedger: "",
                        });
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ selectedLedger: "" }, () => {
                        this.ledgerPostingModalFun(false);
                      });
                    }}
                  >
                    Cancel
                  </Button>*/}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>

          {/* Tax modal */}
          <Modal
            show={taxModalShow}
            size="lg"
            className="tnx-pur-inv-mdl-product"
            onHide={() => this.setState({ show: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                Tax
              </Modal.Title>
              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.handleTaxModalShow(false)}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>
            <Modal.Body className="tnx-pur-inv-mdl-body p-2">
              <div className="">
                <div className="m-0 mb-2">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    enableReinitialize={true}
                    initialValues={initValTax}
                    validationSchema={Yup.object().shape({
                      gst_per: Yup.string()
                        .trim()
                        .required("GST number is required"),
                      igst: Yup.string().trim().required("IGST is required"),
                      cgst: Yup.string().trim().required("CGST is required"),
                      sgst: Yup.string().trim().required("SGST is required"),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      let requestData = new FormData();
                      if (values.id != "") {
                        requestData.append("id", values.id);
                      }
                      requestData.append("gst_per", values.gst_per);
                      requestData.append("sratio", values.sratio);
                      requestData.append("igst", values.igst);
                      requestData.append("cgst", values.cgst);
                      requestData.append("sgst", values.sgst);
                      requestData.append(
                        "applicable_date",
                        moment(values.applicable_date).format("yyyy-MM-DD")
                      );
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to submit",
                          is_button_show: false,
                          is_timeout: false,
                          handleSuccessFn: () => {
                            createTax(requestData)
                              .then((response) => {
                                resetForm();
                                setSubmitting(false);
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
                                  resetForm();
                                  this.handleTaxModalShow(false);
                                  this.lstTAX();
                                  //  this.pageReload();
                                  // resetForm();
                                } else if (res.responseStatus == 409) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                                setSubmitting(false);
                                console.log("error", error);
                              });
                          },
                          handleFailFn: () => {},
                        },
                        () => {
                          console.warn("return_data");
                        }
                      );
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
                        <div className="mb-2">
                          <Row className="p-2">
                            <Col md={1} className="pe-0">
                              <Form.Label>GST %</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  autoFocus="true"
                                  type="text"
                                  placeholder="GST %"
                                  name="gst_per"
                                  id="gst_per"
                                  className="tnx-pur-inv-text-box"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    this.handleGstChange(
                                      e.target.value,
                                      "gst_per",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.gst_per}
                                  isValid={touched.gst_per && !errors.gst_per}
                                  isInvalid={!!errors.gst_per}
                                />
                                <span className="text-danger errormsg">
                                  {errors.gst_per}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Label>IGST</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="IGST"
                                  name="igst"
                                  id="igst"
                                  className="tnx-pur-inv-text-box"
                                  // onChange={handleChange}
                                  onChange={(e) => {
                                    this.handleGstChange(
                                      e.target.value,
                                      "igst",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.igst}
                                  isValid={touched.igst && !errors.igst}
                                  isInvalid={!!errors.igst}
                                />
                                <span className="text-danger errormsg">
                                  {errors.igst}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={1}>
                              <Form.Label>CGST</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  className="tnx-pur-inv-text-box"
                                  placeholder="CGST"
                                  name="cgst"
                                  id="cgst"
                                  onChange={(e) => {
                                    this.handleGstChange(
                                      e.target.value,
                                      "cgst",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.cgst}
                                  isValid={touched.cgst && !errors.cgst}
                                  isInvalid={!!errors.cgst}
                                />
                                <span className="text-danger errormsg">
                                  {errors.cgst}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="p-2">
                            <Col md={1}>
                              <Form.Label>SGST</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="SGST"
                                  name="sgst"
                                  id="sgst"
                                  className="tnx-pur-inv-text-box"
                                  onChange={(e) => {
                                    this.handleGstChange(
                                      e.target.value,
                                      "sgst",
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  value={values.sgst}
                                  isValid={touched.sgst && !errors.sgst}
                                  isInvalid={!!errors.sgst}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sgst}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={2} className="p-0">
                              <Form.Label>
                                Applicable Date
                                <span className="pt-1 pl-1 req_validation">
                                  *
                                </span>
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <MyDatePicker
                                  name="applicable_date"
                                  placeholderText="DD/MM/YYYY"
                                  id="applicable_date"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue("applicable_date", date);
                                  }}
                                  selected={values.applicable_date}
                                  maxDate={new Date()}
                                  className="tnx-pur-inv-date-style"
                                />
                                {/* <span className="text-danger errormsg">{errors.bill_dt}</span> */}
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12 mt-1" className="btn_align">
                              <Button
                                className="submit-btn successbtn-style"
                                type="submit"
                              >
                                Submit
                              </Button>
                              <Button
                                variant="secondary cancel-btn"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.taxModalShow(false);
                                }}
                              >
                                Cancel
                              </Button>
                            </Col>
                            {/* <Col md="12" className="btn_align">
                            <Button
                              variant="secondary cancel-btn"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                this.taxModalShow(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </Col> */}
                          </Row>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {/* HSN modal */}
          <Modal
            show={HSNshow}
            size="lg"
            className="tnx-pur-inv-mdl-product"
            onHide={() => this.handleFlavourModalShow(false)}
            dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
              <Modal.Title
                id="example-custom-modal-styling-title"
                className="mdl-title p-2"
              >
                {" "}
                HSN
              </Modal.Title>
              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.handleHSNModalShow(false)}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={HSNinitVal}
              validationSchema={Yup.object().shape({
                hsnNumber: Yup.string()
                  .trim()
                  .required("HSN number is required"),
                // description: Yup.string()
                //   .trim()
                //   .required("HSN description is required"),
                type: Yup.object().required("Select type").nullable(),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let keys = Object.keys(values);
                let requestData = new FormData();

                keys.map((v) => {
                  if (v != "type") {
                    requestData.append(v, values[v] ? values[v] : "");
                  } else if (v == "type") {
                    requestData.append("type", values.type.value);
                  }
                });
                MyNotifications.fire(
                  {
                    show: true,
                    icon: "confirm",
                    title: "Confirm",
                    msg: "Do you want to submit",
                    is_button_show: false,
                    is_timeout: false,
                    handleSuccessFn: () => {
                      createHSN(requestData)
                        .then((response) => {
                          resetForm();
                          setSubmitting(false);
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
                            //this.handleModalStatus(false);
                            // ShowNotification("Success", res.message);
                            this.lstHSN(res.responseObject);
                            resetForm();
                            // this.props.handleRefresh(true);
                            this.handleHSNModalShow(false);
                            this.pageReload();
                          } else if (res.responseStatus == 409) {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
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
                          setSubmitting(false);
                        });
                    },
                    handleFailFn: () => {},
                  },
                  () => {
                    console.warn("return_data");
                  }
                );
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
                  className="form-style"
                  noValidate
                  autoComplete="off"
                >
                  <Row className="p-3">
                    <Col md={1}>
                      <Form.Label>HSN</Form.Label>
                    </Col>
                    <Col md="2">
                      <Form.Group>
                        <Form.Control
                          autoFocus="true"
                          type="text"
                          placeholder="HSN No"
                          name="hsnNumber"
                          id="hsnNumber"
                          className="tnx-pur-inv-text-box"
                          onChange={handleChange}
                          value={values.hsnNumber}
                          // isValid={touched.hsnNumber && !errors.hsnNumber}
                          // isInvalid={!!errors.hsnNumber}
                        />
                        {/* <span className="text-danger errormsg"> */}
                        <span className="text-danger errormsg">
                          {errors.hsnNumber}
                        </span>
                        {/* </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>
                    <Col md={2} className="px-0">
                      <Form.Label>HSN Description</Form.Label>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="HSN Description"
                          name="description"
                          id="description"
                          className="tnx-pur-inv-text-box"
                          onChange={handleChange}
                          value={values.description}
                          // isValid={touched.description && !errors.description}
                          // isInvalid={!!errors.description}
                        />
                        {/* <span className="text-danger errormsg"> */}
                        <span className="text-danger errormsg"></span>
                        {/* </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>
                    <Col md={1}>
                      <Form.Label>Type</Form.Label>
                    </Col>
                    <Col md="3">
                      <Form.Group className="">
                        <Select
                          className="selectTo"
                          id="type"
                          placeholder="Select Type"
                          styles={purchaseSelect}
                          // styles={createPro}
                          isClearable
                          options={typeoption}
                          name="type"
                          onChange={(value) => {
                            setFieldValue("type", value);
                          }}
                          value={values.type}
                        />
                        <span className="text-danger errormsg">
                          {errors.type}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="pb-2">
                    <Col md={12} className="pt-1 btn_align">
                      <Button
                        className="submit-btn successbtn-style"
                        type="submit"
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.HSNshow(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Modal>
        </div>
      </div>
    );
  }
}
