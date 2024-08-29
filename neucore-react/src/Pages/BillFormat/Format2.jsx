import React, { Component } from "react";
import { Button, Col, Row, Form, Table, Figure } from "react-bootstrap";
import QrCode from "@/assets/images/qrCode.jpg";

export default class Format2 extends Component {
  callPrint = () => {
    var newWin = window.frames["formatprintf2"];
    var divToPrint = document.getElementById("printDiv2");
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
      "width: 93.7%;" +
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
  };

  render() {
    return (
      <Form
        autoComplete="off"
        className="form-style"
        style={{ height: "90vh", overflow: "auto" }}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            this.callPrint();
          }}
        >
          Print
        </Button>

        <iframe
          id="formatprintf2"
          name="formatprintf2"
          className="d-none"
        ></iframe>
        <div id="printDiv2" className="" style={{ width: "107%" }}>
          <div
            className=""
            style={{ display: "flex", border: "1px solid", width: "93.2%" }}
          >
            <div style={{ marginRight: "112px" }}>
              <p className="outlet-header">SHRI SAI AGENCIES</p>
              <p className="outlet-address">1864,NEW PACCHA PETH,</p>
              <p className="outlet-address">
                DATTA NAGAR SOLAPUR-27-MAHARASHTRA
              </p>
              <p className="outlet-address">Phone:8087727808</p>
            </div>
            <div style={{ borderLeft: "1px solid ", paddingLeft: "10px" }}>
              <p className="outlet-header1">
                M/s RUDRAPRIYAM RETAIL MART <span>BILL:CREDIT</span>
              </p>
              <p className="outlet-address">
                KRUSHNA COLONY,RUBY NAGAR VIJAPUR ROAD,State:27
              </p>
              <p className="outlet-address">SOLAPUR 27-MAHARASHTRA</p>
              <p className="outlet-address">Ph.No.:9822468198</p>
              <p className="outlet-address">GST:27BJQPM1684J1ZK</p>
            </div>
          </div>

          <div
            className=""
            style={{
              display: "flex",
              border: "1px solid",
              borderTop: "none",
              width: "93.2%",
            }}
          >
            <div style={{ paddingRight: "167px", borderRight: "1px solid" }}>
              <p className="outlet-header1">GSTIN:27ASFPM5835Q1ZZ</p>
              <p className="outlet-header1">FSSAI NO.:11521041000294</p>
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
                TAX INVOICE
              </p>
            </div>
            <div style={{ display: "flex", paddingLeft: "5px" }}>
              <div style={{ paddingRight: "10px" }}>
                <p className="outlet-header1">
                  <b>Invoice No.:000394</b>
                </p>
                <p className="outlet-header1">Sales Man:</p>
              </div>
              <div style={{ textAlign: "end" }}>
                <p className="outlet-header1">Date:12/04/2023</p>
                <p className="outlet-header1">
                  <b>MOB : 9999999999</b>
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
                <th className="th-style" rowSpan={2}>
                  <p style={{ marginBottom: "17px" }}>Sn.</p>
                </th>
                <th className="th-style" rowSpan={2}>
                  <p style={{ marginBottom: "17px" }}>HSN</p>
                </th>
                <th className="th-style" rowSpan={2}>
                  <p style={{ marginBottom: "17px" }}>Name of Product</p>
                </th>
                <th className="th-style" rowSpan={2}>
                  <p style={{ marginBottom: "17px" }}>Qty</p>
                </th>
                <th className="th-style" rowSpan={2}>
                  <p style={{ marginBottom: "17px" }}>Mrp</p>
                </th>
                <th className="th-style" rowSpan={2}>
                  <p style={{ marginBottom: "17px" }}>Rate</p>
                </th>
                <th className="th-style">Gross</th>
                <th className="th-style">Dis1</th>
                <th className="th-style">Dis1</th>
                <th className="th-style">Dis2</th>
                <th className="th-style">Dis2</th>
                <th className="th-style">Taxable</th>
                <th className="th-style" colSpan={2}>
                  CGST
                </th>
                <th className="th-style" rowSpan={2}>
                  Net
                  <br />
                  Amount
                </th>
              </tr>
              <tr>
                <th className="th-style">Amount</th>
                <th className="th-style">%</th>
                <th className="th-style">Amt</th>
                <th className="th-style">%</th>
                <th className="th-style">Amt</th>
                <th className="th-style">Amount</th>
                <th className="th-style">%</th>
                <th className="th-style">Amt</th>
              </tr>
            </thead>
            <tbody className="printtop">
              {Array.from(Array(10), (v, i) => {
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
                      style={{ width: "fit-content" }}
                    >
                      96190030
                    </td>
                    <td
                      className="text-start td-style"
                      style={{ width: "700px" }}
                    >
                      LOVINGLE DIAPER M 7
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "100px", textAlign: "end" }}
                    >
                      6
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    >
                      999.00
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "100px", textAlign: "end" }}
                    >
                      69.90
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "60px", textAlign: "end" }}
                    >
                      99419.40
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    >
                      22.300
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    >
                      993.530
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    >
                      00.000
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    >
                      00.000
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "100px", textAlign: "end" }}
                    >
                      999325.87
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "20px", textAlign: "end" }}
                    >
                      12.00
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "60px", textAlign: "end" }}
                    >
                      939.10
                    </td>
                    <td
                      className="td-style"
                      style={{ width: "100px", textAlign: "end" }}
                    >
                      9999364.97
                    </td>
                  </tr>
                );
              })}
              {Array.from(Array(5), (v, i) => {
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
                      style={{ width: "fit-content" }}
                    ></td>
                    <td
                      className="text-start td-style"
                      style={{ width: "700px" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "100px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "100px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "60px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "50px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "100px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "20px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "60px", textAlign: "end" }}
                    ></td>
                    <td
                      className="td-style"
                      style={{ width: "100px", textAlign: "end" }}
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
                    GST 5.00
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
                    GST 5.00
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
                  11550.00
                </p>
              </div>
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                }}
              >
                <p className="footer_amt">BILL DISCOUNT</p>
                <p className="footer_amt" style={{ marginLeft: "auto" }}>
                  0.00
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
                  693.00
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
                  693.00
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
                  12936.00
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
      </Form>
    );
  }
}
