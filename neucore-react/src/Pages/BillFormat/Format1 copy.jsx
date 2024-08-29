import React, { Component } from "react";
import { Button, Col, Row, Form, Table, Figure } from "react-bootstrap";
import QrCode from "@/assets/images/qrCode.jpg";

export default class Format1 extends Component {
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
      ".data_body {" +
      // "padding: 10px" +
      "width: 47%;" +
      "display: inline-block;" +
      "font-size: 18px;" +
      "font-family: Calibri;" +
      "}" +
      ".border-style{" +
      "border-right: 1px dashed black;" +
      "margin-right: 10px" +
      "}" +
      ".p-style{" +
      "font-size: 10px;" +
      "margin: 0px;" +
      "}" +
      ".row-style{" +
      "display: flex;" +
      "}" +
      ".rec-style{" +
      "font-size: 12px;" +
      "text-align: start;" +
      "margin-left:2px;" +
      "margin:5px;" +
      "margin-bottom:11px;" +
      "line-height:5px;" +
      "}" +
      ".rec-style1{" +
      "font-size: 12px;" +
      "text-align: end;" +
      "margin-left:2px;" +
      "margin:5px;" +
      "margin-bottom:11px;" +
      "line-height:5px;" +
      "}" +
      ".word-style{" +
      "font-size: 11px;" +
      "}" +
      ".sign-style{" +
      "margin-left:5px;" +
      "font-size: 13px;" +
      "margin-top: 30px;" +
      "text-align: start;" +
      "}" +
      ".h3-style{" +
      "font-size: 16px;" +
      "margin: 0px;" +
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
      ".support {" +
      "text-align: center;" +
      "word-wrap: break-word;" +
      "font-weight: 500;" +
      "font-size: 12px;" +
      "margin-top: 0px;" +
      "margin-bottom: 0 !important;" +
      "font-family: Calibri;" +
      "}" +
      ".support1 {" +
      "font-size: 12px;" +
      // "text-align: center;" +
      "word-wrap: break-word;" +
      "margin-top: 2px;" +
      "margin-bottom: 0 !important;" +
      "font-family: Calibri;" +
      // font-family: Calibri;
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
      ".amt-th-style {" +
      "text-align:center !important;" +
      "}" +
      ".amt-style {" +
      "text-align:center !important;" +
      // "text-align:end !important;" +
      "width:50px;" +
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
          id="formatprintf"
          name="formatprintf"
          className="d-none"
        ></iframe>
        <div id="printDiv1" className="" style={{ width: "107%" }}>
          <div className="printtop" style={{ display: "flex" }}>
            <div style={{ marginRight: "112px" }}>
              <p className="outlet-header">SHIV PHARMA</p>
              <p className="outlet-address">
                GROUND FLOOR SHOP NO.1 PLOT NO.85
              </p>
              <p className="outlet-address">
                PRATHIK NAGAR,MURARJI PETH,SOLAPUR-413001
              </p>
              <p className="outlet-address">Phone:9960195657</p>
              <p className="outlet-address">
                E-Mail : shivpharma5657@gmail.com
              </p>
            </div>
            <div style={{ borderLeft: "1px solid ", paddingLeft: "10px" }}>
              <p className="outlet-header1">To NEW PHARMACON</p>
              <p className="outlet-address">896,MASARE GALLI,BALIVES</p>
              <p className="outlet-address">NORTH KASBA,SOLAPUR</p>
              <p className="outlet-address">MAHARASHTRA</p>
              <p className="outlet-address">Ph.No.:9545521010</p>
              <p className="outlet-address">
                GST:27BJQPM1684J1ZK &nbsp;&nbsp;&nbsp;
                D.L.No.:20b-MH-SOL-309552,21B-MH-SOL-309553
              </p>
            </div>
          </div>

          <div className="printtop" style={{ display: "flex" }}>
            <div style={{ paddingRight: "157px", borderRight: "1px solid" }}>
              <p className="outlet-header1">D.L.No.:20B-407288/21B-407289</p>
              <p className="outlet-header1">
                <b>GSTIN:27BEDPB9918J2Z9</b>
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
                  <b>Invoice No.:CR000040</b>
                </p>
                <p className="outlet-header1">Sales Man:</p>
              </div>
              <div style={{ textAlign: "end" }}>
                <p className="outlet-header1">Date:14-04-2023</p>
                <p className="outlet-header1">
                  <b>Due Bal : 488958.00</b>
                </p>
              </div>
            </div>
          </div>

          <div>
            <Table className="receipt-tbl">
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
                {Array.from(Array(15), (v, i) => {
                  return (
                    <tr>
                      <td
                        className="text-start td-style"
                        style={{ width: "10px", height: "10px" }}
                      >
                        {i + 1}
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      >
                        REAL
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      >
                        3004
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "700px" }}
                      >
                        NS REAL
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      >
                        100ML
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      >
                        26800
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      ></td>
                      <td
                        className="text-start td-style"
                        style={{ width: "150px" }}
                      >
                        VA3010681
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "50px" }}
                      >
                        3/26
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      >
                        19.65
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "110px" }}
                      >
                        7.810
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "100px" }}
                      >
                        0.000
                      </td>

                      <td
                        className="text-start td-style"
                        style={{ width: "60px" }}
                      >
                        12.00
                      </td>
                      <td
                        className="text-start td-style"
                        style={{ width: "300px" }}
                      >
                        209308.00
                      </td>
                    </tr>
                  );
                })}
                {Array.from(Array(0), (v, i) => {
                  return (
                    <tr>
                      <td
                        className="text-start td-style"
                        style={{ width: "10px", height: "18px" }}
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
          </div>

          <div style={{ display: "flex", width: "93.5%" }}>
            <Table
              className="receipt-tbl"
              style={{ marginTop: "0px", width: "70%" }}
            >
              <thead>
                <tr>
                  <th className="th-style">CLASS</th>
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

            <div className="printtop" style={{ width: "17%" }}>
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
                    style={{ width: "100px", border: "1px solid" }}
                  >
                    TOTAL
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
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
                    693.00
                  </td>
                  <td
                    className="td-style"
                    style={{
                      width: "100px",
                      border: "1px solid",
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
                <p className="footer_final_amt" style={{ marginLeft: "auto" }}>
                  12936.00
                </p>
              </div>
            </div>
          </div>
          <div className="printtop" style={{ display: "flex" }}>
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
                width: "17%",
              }}
            >
              <p className="footer_final_amt">For SHIV PHARMA</p>
            </div>
          </div>
          <p className="footer_heading">
            Opethic Software Service MARG Erp9+ Get Ready With GST Call For Free
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
