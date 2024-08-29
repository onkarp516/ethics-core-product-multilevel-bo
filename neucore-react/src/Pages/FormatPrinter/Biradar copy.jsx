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

export default class Biradar extends React.Component {
  constructor(props) {
    super(props);
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
      ".cust-text-success{" +
      "color:green;}" +
      ".outlet-header {" +
      "margin-top: 0px;" +
      "text-transform: uppercase;" +
      "font-weight: bold;" +
      "margin-bottom: 0px;" +
      "font-size: 20px;" +
      "text-align: center;" +
      "font-family: monospace;" +
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
      "margin-left: -10px;" +
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

  callPrint = () => {
    var newWin = window.frames["printf"];
    var divToPrint = document.getElementById("printDiv");
    let data = divToPrint.outerHTML;
    let htmlToPrint = '<body onload="window.print()">';
    htmlToPrint +=
      "<style>@media print{td,th{border:1px solid #000}table{border-collapse:collapse}.tb-form{width:800px;height:400px;text-align:center}.text{text-align:left}.text1{text-align:left}.col{background-color:#d0caca}}</style>";
    htmlToPrint += data;
    htmlToPrint += "</body>";
    newWin.document.write(htmlToPrint);
    newWin.document.close();
  };

  render() {
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
        <div id="printDiv" className="d-none">
          <div className="printtop">
            {/* <h4>{companyData.outletName} </h4> */}
            <p className="outlet-address">INVOICE</p>
            <p className="outlet-header">UPAHAR COOKIES & CAKES</p>
            <p className="outlet-address">OLD BIDI GHARKUL,</p>
            <p className="outlet-address">UDYOG BANK SEVEK SOCIETY,</p>
            <p className="outlet-address">NORTH SOLAPUR-413005</p>
          </div>
          <div className="printtop">
            <p className="support1">Customer :CASH</p>

            <p className="support1">
              Mobile No : 7897987987 &nbsp;&nbsp;&nbsp;&nbsp; Bill No :A00001
            </p>
            <p className="support1">
              Times : 15:33 &nbsp;&nbsp;&nbsp;&nbsp; Date :04-05-2022
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
            <tbody>
              <tr>
                <td className="td-style" colSpan={2}>
                  <p className="mb-0">1 MILKTOAST 125 GM</p>
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
                <td className="td-style" colSpan={2}>
                  <p className="mb-0">2 SWEET HEARTS 300 GM</p>
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
                  <p className="mb-0">Item Qty: 5</p>
                </td>
                <td className="td-style">
                  <p className="mb-0">Total:</p>
                </td>
                <td className="td-style" colSpan={2}>
                  <p className="mb-0">224.00</p>
                </td>
              </tr>
              <tr>
                <td className="td-style" colSpan={2}>
                  <p className="mb-0">You Have Saved</p>
                </td>
                <td className="td-style" colSpan={2}>
                  <p className="mb-0">22.40</p>
                </td>
              </tr>
              <tr>
                <td className="td-style" colSpan={2}>
                  <p className="mb-0">NET AMOUNT</p>
                </td>
                <td className="td-style" colSpan={2}>
                  <p className="mb-0">202.00</p>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <iframe id="printf" name="printf" className="d-none"></iframe>

        <div className="pagestyle" id="printDiv">
          <h1 className="blueheading ms-2"> Table</h1>
          <div className="institutetbl denomination-style p-2">
            <table className="tb-form">
              <tr>
                <th colSpan={6}>
                  TAX INVOICE <br />
                  BIRADAR CLOTH EMPORIUM & DRESSES
                </th>
              </tr>
              <tr>
                <th colSpan={6}>
                  MAIN ROAD,AFZALPUR-585301 <br />
                  <br />
                  Mobile No.9860848262,9970605622
                  <br />
                  <h4>GSTIN:29BOOPB7434L1ZF</h4>
                </th>
              </tr>
              <tr>
                <td colSpan={3} className="text">
                  Customer Name:-SHREE <br />
                  SOLAPUR
                  <br />
                  9970605622
                </td>
                <td colSpan={3} className="text">
                  Invoice No.: 0000001
                  <br />
                  date:15/09/2020
                </td>
              </tr>
              <tr className="col">
                <th>Sr.No</th>
                <th>Particulars</th>
                <th>HSN</th>
                <th>QTY</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>1</td>
                <td>Jeans Pant</td>
                <td>5000</td>
                <td>1</td>
                <td>500</td>
                <td>500</td>
              </tr>
              <tr>
                <td>2</td>
                <td>T-Shirt</td>
                <td>3000</td>
                <td>1</td>
                <td>300</td>
                <td>300</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Top</td>
                <td>2000</td>
                <td>1</td>
                <td>200</td>
                <td>200</td>
              </tr>

              <tr>
                <th colSpan={3}></th>
                <th colSpan={2} className="text1">
                  SUB TOTAL
                  <br />
                  Discount 10%
                  <br />
                  Roundoff
                </th>
                <th>
                  0.00
                  <br />
                  177.90
                  <br />
                  0.10
                </th>
              </tr>
              <tr>
                <td colSpan={3}>Rs.One Thousand Six Hundred One Only </td>
                <td colSpan={2}>GRAND TOTAL </td>
                <td>1601.00 </td>
              </tr>
              <tr>
                <td colSpan={6} className="text">
                  1.Goods Once sold will not be taken back.
                  <br />
                  2.If any product having damage or manufacturing defect so take{" "}
                  <br />
                  before going to cut by tailor.
                  <br />
                  3.Any Product material have no Guarantee.
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
