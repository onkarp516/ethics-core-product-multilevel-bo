import React, { Component } from "react";
import { Modal, CloseButton, Button, Table } from "react-bootstrap";
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import confirm from "@/assets/images/alert/3x/confirm.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
import { eventBus } from "@/helpers";
import { getInvoiceBill, getOrderBillById } from "@/services/api_functions";
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
                >
                  No
                </Button>
              </>
            )}
            {/* {isNaN(is_button_show) !== false && is_button_show === true && ( */}
            {is_button_show === true && (
              <Button
                className="sub-button btn_submit_style"
                type="submit"
                autoFocus={true}
                onClick={(e) => {
                  e.preventDefault();
                  this.handleHide();
                }}
              >
                Ok
              </Button>
            )}
          </Modal.Body>
        </Modal>
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
              Mob No:{customerData && customerData.supplier_phone} Bill No:
              {invoiceData && invoiceData.invoice_no}
            </p>
            <p className="support1">
              Times : 15:33 &nbsp;&nbsp;&nbsp;&nbsp; Date :
              {invoiceData && invoiceData.invoice_dt}
            </p>
            <p className="support1">
              Payment Mode :{invoiceData && invoiceData.payment_mode}
            </p>
          </div>
          <Table className="product-tbl">
            <thead>
              <tr>
                <th className="th-style">Items</th>
                {/* <th className="th-style">GST</th>
                        <th className="th-style">Package</th>
                        <th className="th-style">Units</th> */}
                {/* <th className="th-style"></th>
                <th className="th-style"></th>
                <th className="th-style"></th> */}
                <th className="th-style">Qty</th>
                <th className="th-style">Rate</th>
                <th className="th-style">Amount</th>
              </tr>
            </thead>
            {/* {JSON.stringify(invoiceDetails, undefined, 2)} */}
            <tbody className="printtop">
              {invoiceDetails &&
                invoiceDetails.map((v, i) => {
                  // return (
                  //   v.productDetails &&
                  //   v.productDetails.map((vi, ii) => {
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
                          {/* <td className="td-style"></td>
                              <td className="td-style"></td>
                              <td className="td-style"></td> */}

                          <td className="td-style">
                            <p className="mb-0">{v.qty}</p>
                          </td>
                          <td className="td-style">
                            <p className="mb-0">{v.rate}</p>
                          </td>
                          <td className="td-style">
                            <p className="mb-0">{vi.base_amt}</p>
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
                  //   })
                  // );
                })}
            </tbody>
            <thead>
              <tr>
                <th className="th-style borderTop">
                  <p className="mb-0">
                    Item Qty: {invoiceDetails && invoiceDetails.length}
                  </p>
                </th>

                {invoiceData && invoiceData.advanced_amount > 0 && (
                  <>
                    <th className="th-style borderTop"></th>
                    <th className="th-style borderTop">
                      <p className="mb-0">
                        Advanced Amount :
                        {/* </p>
                    </th>
                    <th className="th-style borderTop">
                      <p className="mb-0 text-start"> */}
                        {invoiceData && invoiceData.advanced_amount}
                      </p>
                    </th>
                  </>
                )}
                {invoiceData && invoiceData.advanced_amount == 0 && (
                  <th className="th-style borderTop" colSpan={2}></th>
                )}
                <th className="th-style borderTop">
                  <p className="mb-0">
                    Total :
                    {/* </p>
                </th>
                <th className="th-style borderTop">
                  <p className="mb-0 text-start"> */}
                    {invoiceData && invoiceData.net_amount}
                  </p>
                </th>
              </tr>
              {invoiceData && invoiceData.total_discount > 0 && (
                <tr>
                  <th className="th-style" colSpan={3}>
                    <p className="mb-0 text-end">
                      You Have Saved :
                      {invoiceData && invoiceData.total_discount}
                    </p>
                  </th>
                  <th className="th-style"></th>
                </tr>
              )}
              <tr>
                <th className="th-style" colSpan={3}>
                  <p className="mb-0 text-end">
                    NET AMOUNT :{invoiceData && invoiceData.total_amount}
                  </p>
                </th>
                <th className="th-style"></th>
              </tr>
            </thead>
          </Table>
          <div>
            <p className="outlet-address">For UPAHAR COOKIES & CAKES</p>
            <p className="outlet-address">!!! Thank YOU !!! Visit Again !!!</p>
          </div>
        </div>
      </div>
    );
  }
}

export { MyNotifications };
