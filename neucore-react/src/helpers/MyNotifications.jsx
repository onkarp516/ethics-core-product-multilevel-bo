import React, { Component } from "react";
import { Modal, CloseButton, Button, Table } from "react-bootstrap";
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import confirm from "@/assets/images/alert/3x/confirm.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
import { eventBus } from "@/helpers";
import { getInvoiceBill, getOrderBillById } from "@/services/api_functions";
import QrCode from "@/assets/images/qrCode.jpg";
import moment from "moment";
class MyNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      icon: "success",
      title: "Success",
      msg: "Successfully",
      is_button_show: false,
      is_timeout: false,
      delay: 100,
      customerData: "",
      invoiceData: "",
      invoiceDetails: "",
      supplierData: "",
      invoice_no: 0,
      handleSuccessFn: "",
      handleFailFn: "",
      handleFailFnOrder: "",
    };
    this.handleFire = this.handleFire.bind(this);
  }

  handleHide = () => {
    this.setState({ show: false });
  };
  callPrint = () => {
    var newWin = window.frames["formatprintf"];
    var divToPrint = document.getElementById("printDiv1");
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
      "margin: 0px;" +
      "page-break-after: auto;" +
      "font-family: Calibri;" +
      "}" +
      ".outlet-header {" +
      "margin-top: 0px;" +
      "text-transform: uppercase;" +
      "font-weight: bold;" +
      "margin-bottom: 0px;" +
      "font-size: 15px;" +
      "font-family: Calibri;" +
      "}" +
      ".outlet-header1 {" +
      "margin-top: 0px;" +
      "text-transform: uppercase;" +
      "font-weight: bold;" +
      "margin-bottom: 0px;" +
      "font-size: 10px;" +
      "font-family: Calibri;" +
      "}" +
      ".text-center {" +
      "text-align: center;" +
      "}" +
      ".text-end {" +
      "text-align: end;" +
      "}" +
      ".outlet-address {" +
      "word-wrap: break-word;" +
      //   "text-align: center;" +
      //   "font-style: italic;" +
      "font-weight: 500;" +
      "margin-bottom: 0;" +
      "font-size: 8.5px;" +
      "margin-top: 0px;" +
      //   "font-family: Calibri;" +
      "}" +
      ".footer_amt {" +
      "word-wrap: break-word;" +
      //   "font-style: italic;" +
      "font-weight: 500;" +
      "margin-bottom: 0;" +
      "font-size: 9px;" +
      "margin-top: 0px;" +
      "line-height: 15px;" +
      //   "font-family: Calibri;" +
      "}" +
      ".footer_final_amt {" +
      "word-wrap: break-word;" +
      //   "font-style: italic;" +
      "font-weight: 700;" +
      "margin-bottom: 0;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "line-height: 18px;" +
      //   "font-family: Calibri;" +
      "}" +
      ".footer_heading {" +
      "word-wrap: break-word;" +
      //   "font-style: italic;" +
      "font-weight: 500;" +
      "margin-bottom: 0;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "text-align:center" +
      //   "font-family: Calibri;" +
      "}" +
      ".printtop {" +
      "border-bottom: 1px solid #333;" +
      "}" +
      ".receipt-tbl {" +
      "width: 99%;" +
      "border-collapse: collapse;" +
      // "font-size: 8px;" +
      "}" +
      ".th-style {" +
      // "font-weight: 500;" +
      "border-bottom: 1px solid #333;" +
      "border-right:1px solid;" +
      "border-top: 0px solid #333;" +
      "text-align:start;" +
      //   "width:70%;" +
      "font-size: 10px;" +
      // "font-family: Calibri;" +
      "}" +
      ".td-style {" +
      "text-align:start;" +
      "border-right:1px solid;" +
      "border-left:1px solid transparent;" +
      "border-bottom:1px solid transparent;" +
      "font-size: 10px;" +
      // "line-height: 10px;" +
      // "width: auto;" +
      "}" +
      ".display {" +
      "display:none !important;" +
      "}" +
      "}</style>";
    htmlToPrint += data;
    htmlToPrint += "</body>";
    newWin.document.write(htmlToPrint);
    newWin.document.close();
    this.handleHide();
  };
  handleCallPrint = ({
    customerData,
    invoiceData,
    supplierData,
    invoiceDetails,
  }) => {
    console.log("handleCallPrint", {
      customerData,
      invoiceData,
      supplierData,
      invoiceDetails,
    });
    this.setState(
      {
        customerData: customerData,
        invoiceData: invoiceData,
        supplierData: supplierData,
        invoiceDetails: invoiceDetails,
      },
      () => {
        this.callPrint();
      }
    );
  };

  handleFire = ({
    show,
    icon = "success",
    title = "Success",
    msg = "Successfully",
    is_button_show = false,
    is_timeout = false,
    delay = 0,
    handleSuccessFn,
    handleFailFn,
    handleFailFnOrder,
  }) => {
    this.setState({
      show: show,
      icon: icon,
      title,
      msg,
      is_button_show,
      handleSuccessFn,
      handleFailFn,
      handleFailFnOrder,
    });
    if (is_timeout == true) {
      setTimeout(() => {
        this.handleHide();
      }, delay);
    }
  };

  static fire({
    show,
    icon = "success",
    title = "Success",
    msg = "Successfully",
    is_button_show = false,
    is_timeout = false,
    delay = 0,
    handleSuccessFn = "",
    handleFailFn = "",
    handleFailFnOrder = "",
  }) {
    eventBus.dispatch("mynotification", {
      show,
      icon,
      title,
      msg,
      is_button_show,
      is_timeout,
      delay,
      handleSuccessFn,
      handleFailFn,
      handleFailFnOrder,
    });
  }

  handleImage = () => {
    let { icon } = this.state;
    switch (icon) {
      case "success":
        return <img alt="" src={success_icon} />;
        break;
      case "warning":
        return <img alt="" src={warning_icon} />;
        break;
      case "error":
        return <img alt="" src={error_icon} />;
        break;
      case "confirm":
        return <img alt="" src={confirm} />;
        break;
      default:
        return <img alt="" src={success_icon} />;
        break;
    }
  };

  componentDidMount() {
    eventBus.on("mynotification", this.handleFire);
    eventBus.on("callprint", this.handleCallPrint);
  }

  componentWillUnmount() {
    eventBus.remove("mynotification");
    eventBus.remove("callprint");
  }

  render() {
    let {
      show,
      icon,
      title,
      msg,
      is_button_show,
      customerData,
      invoiceData,
      invoiceDetails,
      supplierData,
      invoice_no,
    } = this.state;

    return (
      <div>
        {" "}
        <Modal
          show={show}
          // size="md"
          size={
            window.matchMedia("(min-width:992px) and (max-width:1280px)")
              .matches
              ? "sm"
              : "md"
          }
          className={`${icon}-alert`}
          onHide={() => {
            this.setState({ show: false });
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <p className="title">{title}</p>
            <CloseButton
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                this.handleHide();
              }}
            />
          </Modal.Header>
          <Modal.Body className="text-center">
            {this.handleImage()}
            <p className="msg">{msg}</p>
            {icon === "confirm" && (
              <>
                <Button
                  className="sub-button btn_submit_style"
                  type="submit"
                  autoFocus={true}
                  onClick={(e) => {
                    //console.log("is_button_show", is_button_show);
                    e.preventDefault();
                    // this.getInvoiceBillsLst(is_button_show);
                    // this.getOrderBillsLst(is_button_show);
                    if (this.state.handleSuccessFn !== "") {
                      this.state.handleSuccessFn();
                    }
                    this.handleHide();
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      // if (this.state.handleSuccessFn !== "") {
                      //   this.state.handleSuccessFn();
                      // }
                      this.handleHide();
                    }
                  }}
                >
                  Yes
                </Button>
                <Button
                  className="sub-button btn_cancel_style"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();

                    // eventBus.dispatch("page_change", {
                    //   from: "tranx_sales_invoice_create",
                    //   to: "tranx_sales_invoice_list",
                    //   isNewTab: false,
                    // });
                    if (this.state.handleFailFn !== "") {
                      this.state.handleFailFn();
                    }
                    this.handleHide();
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      if (this.state.handleFailFn !== "") {
                        this.state.handleFailFn();
                      }
                      this.handleHide();
                    }
                  }}
                >
                  No
                </Button>
              </>
            )}
            {/* {isNaN(is_button_show) !== false && is_button_show === true && ( */}
            {icon != "confirm" && is_button_show === true && (
              <Button
                className="sub-button btn_submit_style"
                type="submit"
                autoFocus={true}
                onClick={(e) => {
                  e.preventDefault();
                  if (this.state.handleSuccessFn !== "") {
                    this.state.handleSuccessFn();
                  }
                  this.handleHide();
                }}
              >
                Ok
              </Button>
            )}
          </Modal.Body>
        </Modal>
        <iframe
          id="formatprintf"
          name="formatprintf"
          className="d-none"
        ></iframe>
        <div id="printDiv1" className="d-none" style={{ width: "107%" }}>
          <div
            // className="printtop"
            style={{ display: "flex", border: "1px solid", width: "93.2%" }}
          >
            {/* company start */}
            <div style={{ marginRight: "112px" }}>
              <p className="outlet-header">
                {supplierData && supplierData.company_name}
              </p>
              <p className="outlet-address">
                {supplierData && supplierData.company_address}
              </p>
              {/* <p className="outlet-address">
                PRATHIK NAGAR,MURARJI PETH,SOLAPUR-413001
              </p> */}
              <p className="outlet-address">
                Phone:{supplierData && supplierData.phone_number}
              </p>
              <p className="outlet-address">
                E-Mail : {supplierData && supplierData.email_address}
              </p>
            </div>
            {/* company end */}
            {/* customer start */}
            <div style={{ borderLeft: "1px solid ", paddingLeft: "10px" }}>
              <p className="outlet-header1">
                To {customerData && customerData.supplier_name}
              </p>
              {/* <p className="outlet-address">896,MASARE GALLI,BALIVES</p> */}
              <p className="outlet-address">
                {customerData && customerData.supplier_address}
              </p>
              <p className="outlet-address">
                {customerData && customerData.supplier_state}
              </p>
              <p className="outlet-address">
                Ph.No.:{customerData && customerData.supplier_phone}
              </p>
              <p className="outlet-address">
                GST:{customerData && customerData.supplier_gstin}{" "}
                &nbsp;&nbsp;&nbsp; D.L.No.:20b-MH-SOL-309552,21B-MH-SOL-309553
              </p>
            </div>
            {/* customer end */}
          </div>

          <div
            className=""
            style={{
              display: "flex",
              border: "1px solid",
              width: "93.2%",
              borderTop: "none",
            }}
          >
            <div style={{ paddingRight: "169px", borderRight: "1px solid" }}>
              <p className="outlet-header1">D.L.No.:20B-407288/21B-407289</p>
              <p className="outlet-header1">
                <b>GSTIN:{supplierData && supplierData.gst_number}</b>
              </p>
            </div>
            <div
              style={{
                padding: "0px 10px",
                borderRight: "1px solid",
                display: "flex",
              }}
            >
              <p
                className="outlet-header1"
                style={{ marginTop: "auto", marginBottom: "auto" }}
              >
                GST INVOICE
              </p>
            </div>
            <div style={{ display: "flex", paddingLeft: "5px" }}>
              <div style={{ paddingRight: "10px" }}>
                <p className="outlet-header1">
                  <b>Invoice No.:{invoiceData && invoiceData.invoice_no}</b>
                </p>
                <p className="outlet-header1">Sales Man:</p>
              </div>
              <div style={{ textAlign: "end" }}>
                <p className="outlet-header1">
                  Date:{invoiceData && invoiceData.invoice_dt}
                </p>
                <p className="outlet-header1">
                  <b>Due Bal : 488958.00</b>
                </p>
              </div>
            </div>
          </div>

          <Table
            className="receipt-tbl"
            style={{ width: "93.5%", border: "1px solid", borderTop: "none" }}
          >
            <thead>
              <tr>
                <th className="th-style">Sn.</th>
                <th className="th-style">MFG</th>
                <th className="th-style">HSN</th>
                <th className="th-style">PRODUCT NAME</th>
                <th className="th-style">Pack</th>
                <th className="th-style">Qty</th>
                <th className="th-style">Sch.</th>
                <th className="th-style">Batch</th>
                <th className="th-style">Exp.</th>
                <th className="th-style">MRP</th>
                <th className="th-style">RATE</th>
                <th className="th-style">Dis%</th>
                <th className="th-style">Gst%</th>
                <th className="th-style">Amount</th>
              </tr>
            </thead>
            <tbody className="printtop">
              {/* {JSON.stringify(invoiceDetails)} */}
              {invoiceDetails != "" &&
                invoiceDetails.map((v, i) => {
                  return (
                    <tr>
                      <td
                        className="text-start td-style"
                        style={{
                          width: "10px",
                          height: "10px",
                          borderLeft: "1px solid",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      >
                        {v.mfg}
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      >
                        {v.hsn}
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "700px" }}
                      >
                        {v.product_name}
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "80px" }}
                      >
                        {v.pack_name}
                      </td>
                      <td
                        className="td-style"
                        style={{ width: "fit-content", textAlign: "end" }}
                      >
                        {v.qty}
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      ></td>
                      <td
                        className="text-start td-style"
                        style={{ width: "fit-content" }}
                      >
                        {v.b_no}
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "50px" }}
                      >
                        {moment(v.exp_date).format("MM/YY") === "Invalid date"
                          ? ""
                          : moment(v.exp_date).format("MM/YY")}
                      </td>
                      <td
                        className="td-style"
                        style={{ width: "fit-content", textAlign: "end" }}
                      >
                        {v.mrp}
                      </td>
                      <td
                        className="td-style"
                        style={{ width: "fit-content", textAlign: "end" }}
                      >
                        {v.rate}
                      </td>
                      <td
                        className="td-style"
                        style={{ width: "fit-content", textAlign: "end" }}
                      >
                        {v.disc_per}
                      </td>

                      <td
                        className="td-style"
                        style={{ width: "fit-content", textAlign: "end" }}
                      >
                        {v.Gst}
                      </td>
                      <td
                        className="td-style"
                        style={{ width: "fit-content", textAlign: "end" }}
                      >
                        {v.final_amt}
                      </td>
                    </tr>
                  );
                })}
              {Array.from(Array(15 - invoiceDetails.length), (v, i) => {
                return (
                  <tr>
                    <td
                      className="text-start td-style"
                      style={{
                        width: "10px",
                        height: "16px",
                        borderLeft: "1px solid",
                      }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "100px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "100px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "700px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "100px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "100px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "100px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "150px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "50px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "100px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "110px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "100px" }}
                    ></td>

                    <td
                      className="text-start td-style"
                      style={{ width: "60px" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "300px" }}
                    ></td>
                  </tr>
                );
              })}
            </tbody>
            <thead>
              {/* <tr>
                <th className="th-style borderTop">
                  <p className="mb-0">Item Qty: 2</p>
                </th>
                <th className="th-style borderTop" colSpan={5}>
                  <p className="mb-0 text-end">Total :</p>
                </th>

                <th className="th-style borderTop">
                  <p className="mb-0 text-start">1222.00</p>
                </th>
              </tr> */}
              <tr>
                <th colSpan={16}>
                  <hr style={{ borderTop: "1px solid", margin: "0px" }} />
                </th>
              </tr>
              <tr>
                <th colSpan={16} className="th-style">
                  Rs. Twelve Thousand Nine Hundred Thirty Six Only
                </th>
              </tr>
            </thead>
          </Table>

          <div style={{ display: "flex", width: "93.5%" }}>
            <Table
              className="receipt-tbl"
              style={{ marginTop: "0px", width: "70%" }}
            >
              <thead>
                <tr>
                  <th
                    className="th-style"
                    style={{
                      borderLeft: "1px solid",
                    }}
                  >
                    CLASS
                  </th>
                  <th className="th-style" style={{ textAlign: "end" }}>
                    TOTAL
                  </th>
                  <th className="th-style" style={{ textAlign: "end" }}>
                    SCH.
                  </th>
                  <th className="th-style" style={{ textAlign: "end" }}>
                    DISC.
                  </th>
                  <th className="th-style" style={{ textAlign: "end" }}>
                    SGST
                  </th>
                  <th className="th-style" style={{ textAlign: "end" }}>
                    CGST
                  </th>
                  <th className="th-style" style={{ textAlign: "end" }}>
                    TOTAL GST
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className="text-start td-style"
                    style={{ width: "100px", border: "1px solid" }}
                  >
                    GST 5.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                </tr>
                <tr>
                  <td
                    className="text-start td-style"
                    style={{ width: "100px", border: "1px solid" }}
                  >
                    GST 12.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                </tr>
                <tr>
                  <td
                    className="text-start td-style"
                    style={{ width: "100px", border: "1px solid" }}
                  >
                    GST 18.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                </tr>
                <tr>
                  <td
                    className="text-start td-style"
                    style={{ width: "100px", border: "1px solid" }}
                  >
                    GST 28.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className=" td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                </tr>
              </tbody>
            </Table>

            <div
              className="printtop"
              style={{ width: "13%", borderRight: "1px solid" }}
            >
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                }}
              >
                <img
                  src={QrCode}
                  alt=""
                  style={{ height: "65px", margin: "7px 5px" }}
                />
                {/* <p className="outlet-address">QR Code</p> */}
              </div>
            </div>

            <div
              className="printtop"
              style={{ width: "17%", borderRight: "1px solid" }}
            >
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                }}
              >
                <p className="footer_amt">SUB TOTAL</p>
                <p className="footer_amt" style={{ marginLeft: "auto" }}>
                  {invoiceData && invoiceData.net_amount}
                </p>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                }}
              >
                <p className="footer_amt">Discount Amount</p>
                <p className="footer_amt" style={{ marginLeft: "auto" }}>
                  {invoiceData && invoiceData.total_discount}
                </p>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                }}
              >
                <p className="footer_amt">CGST PAYABLE</p>
                <p className="footer_amt" style={{ marginLeft: "auto" }}>
                  {invoiceData && invoiceData.total_cgst}
                </p>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                }}
              >
                <p className="footer_amt">SGST PAYABLE</p>
                <p className="footer_amt" style={{ marginLeft: "auto" }}>
                  {invoiceData && invoiceData.total_sgst}
                </p>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                }}
              >
                <p className="footer_amt">TRANSPORT CHARGES</p>
                <p className="footer_amt" style={{ marginLeft: "auto" }}>
                  0.00
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", width: "93.5%" }}>
            <Table className="receipt-tbl" style={{ width: "70%" }}>
              <tbody>
                <tr>
                  <td
                    className="text-start td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      borderTop: "none",
                    }}
                  >
                    TOTAL
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      borderTop: "none",
                      textAlign: "end",
                    }}
                  >
                    11550.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      borderTop: "none",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      borderTop: "none",
                      textAlign: "end",
                    }}
                  >
                    0.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      borderTop: "none",
                      textAlign: "end",
                    }}
                  >
                    693.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      borderTop: "none",
                      textAlign: "end",
                    }}
                  >
                    693.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
                      borderTop: "none",
                      textAlign: "end",
                    }}
                  >
                    1386.00
                  </td>
                </tr>
              </tbody>
            </Table>

            <div className="printtop" style={{ width: "30%" }}>
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                }}
              >
                <p className="footer_final_amt">GRAND TOTAL</p>
                <p
                  className="footer_final_amt"
                  style={{ marginLeft: "auto", borderRight: "1px solid" }}
                >
                  {invoiceData && invoiceData.total_amount}
                </p>
              </div>
            </div>
          </div>
          <div
            className="printtop"
            style={{ display: "flex", borderLeft: "1px solid" }}
          >
            <div
              style={{
                paddingRight: "10px",
                borderRight: "1px solid",
                width: "35%",
              }}
            >
              <p className="footer_final_amt">Tearms & Conditions</p>
              <p className="footer_final_amt">
                Goods once sold will not be taken back or exchanged.
              </p>
              <p className="footer_final_amt">
                Bills not paid due date will attract 24% interest
              </p>
            </div>
            <div
              style={{
                padding: "0 10px",
                borderRight: "1px solid",
                width: "22%",
              }}
            >
              <p className="footer_final_amt">Bank Details</p>
              <p className="footer_final_amt">Bank : UNION BANK OF INDIA</p>
              <p className="footer_final_amt">A/C No. : 579401010050449</p>
              <p className="footer_final_amt">IFSC Code : UBIN0557943</p>
            </div>
            <div
              style={{
                padding: "0 10px",
                borderRight: "1px solid",
                width: "13%",
              }}
            >
              <p className="footer_final_amt">Receiver</p>
            </div>
            <div
              style={{
                padding: "0 10px",
                borderRight: "1px solid",
                width: "14.5%",
              }}
            >
              <p className="footer_final_amt">For SHIV PHARMA</p>
            </div>
          </div>
          <p className="footer_heading">
            Opethic Software Service Get Ready With GST Call For Free
            Demo-9921400202/9112377744
          </p>
          {/* <div>
            <p className="outlet-address">For UPAHAR COOKIES & CAKES</p>
            <p className="outlet-address">!!! Thanks !!! Visit Again !!!</p>
          </div> */}

          {/* </div> */}
        </div>
      </div>
    );
  }
}

export { MyNotifications };
