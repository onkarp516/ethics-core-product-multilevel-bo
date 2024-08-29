import React from "react";
import {
  Button,
  Col,
  Row,
  Navbar,
  NavDropdown,
  Item,
  Nav,
  Form,
  Container,
  InputGroup,
  Table,
  Alert,
  Modal,
  CloseButton,
  Collapse,
  FormControl,
} from "react-bootstrap";

import "@/assets/scss/format.scss";
import { getInvoiceBill } from "@/services/api_functions";

export default class Biradar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerData: "",
      invoiceData: "",
      invoiceDetails: "",
      supplierData: "",
    };
  }

  getInvoiceBillsLst = () => {
    let reqData = new FormData();
    reqData.append("id", 1);
    getInvoiceBill(reqData).then((response) => {
      let responseData = response.data;
      if (responseData.responseStatus == 200) {
        console.log("responseData ---->>>", responseData);
        // let invoiceDetails = responseData.invoice_details.product_details;
        // console.log("invoiceDetails :", invoiceDetails);

        this.setState({
          customerData: responseData.customer_data,
          invoiceData: responseData.invoice_data,
          supplierData: responseData.supplier_data,
          invoiceDetails: responseData.invoice_details.product_details,
          // productDetails: responseData.product_details,
        });
      }
    });
  };

  componentDidMount = () => {
    this.getInvoiceBillsLst();
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
  };

  render() {
    const {
      customerData,
      invoiceData,
      invoiceDetails,
      supplierData,
      product_details,
    } = this.state;

    return (
      <div className="">
        <Button
          onClick={(e) => {
            e.preventDefault();
            this.callPrint();
          }}
        >
          Print
        </Button>
        <iframe id="printf" name="printf" className="d-none"></iframe>
        <div id="printDiv" className="">
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
          </div>
          <Table className="product-tbl">
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
              {/* <tr>
                <td className="td-style">
                  <p className="mb-0">1 MILKTOAST 125 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">2</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">22.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">36.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS sfsdfs dsfsdfds 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS dsfds dsfdsfweew 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr>
              <tr>
                <td className="td-style">
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">3</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">60.00</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">162.60</p>
                </td>
              </tr> */}
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
          </Table>
          <div>
            <p className="outlet-address">For UPAHAR COOKIES & CAKES</p>
            <p className="outlet-address">!!! Thanks !!! Visit Again !!!</p>
          </div>
        </div>
      </div>
    );
  }
}
