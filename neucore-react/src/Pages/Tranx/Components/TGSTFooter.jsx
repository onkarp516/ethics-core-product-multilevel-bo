import React from "react";
import { Table, Form } from "react-bootstrap";
import _ from "lodash";

const PurchaseGST = ({
  values,
  taxcal,
  authenticationService,
  handleCGSTChange,
  handleSGSTChange,
}) => {
  return (
    <div className="tgstFooter_tabl_style ">
      {" "}
      <thead
        style={{
          borderBottom: "2px solid transparent",
          background: " #d9d9d9",
          position: "sticky",
          zIndex: "999",
          top: "0",
        }}
        className="TGST-style"
      >
        <tr>
          <th style={{ width: "100px" }}>IGST</th>
          <th style={{ width: "100px" }}>CGST</th>
          <th style={{ width: "100px" }}>SGST</th>
        </tr>
      </thead>
      {/* {JSON.stringify(taxcal.cgst)} */}
      {taxcal.cgst.length > 0 ? (
        <tbody className="TGST-body">
          {_.zip(taxcal.igst, taxcal.cgst, taxcal.sgst).map((vi, i) => {
            return (
              <tr className="TGST">
                <td className="p-0">
                  {/* <Form.Control
                    id='amt'
                    name='amt'
                    className="table-text-box border-0"
                    type="text"
                    placeholder="0"
                    onChange={(e) => {
                      e.preventDefault();
                      handleCGSTChange(amt, e.target.value, i);
                    }}
                    value={vi[0].amt}
                  /> */}

                  {parseFloat(vi[0].amt).toFixed(2) + " (" + vi[0].d_gst + "%)"}
                </td>
                <td className="p-0">
                  {/* {vi[1].amt
                    ? parseFloat(vi[1].amt).toFixed(2) +
                    " (" +
                    vi[1].gst +
                    " %)"
                    : parseFloat(0).toFixed(2)} */}
                  <Form.Control
                    id="amt"
                    name="amt"
                    className="footer-table-text-box "
                    type="text"
                    placeholder="0"
                    onChange={(e) => {
                      e.preventDefault();
                      handleCGSTChange("amt", e.target.value, i);
                    }}
                    value={vi[1].amt}
                  />
                </td>
                <td className="p-0">
                  <Form.Control
                    id="amt"
                    name="amt"
                    className="footer-table-text-box"
                    type="text"
                    placeholder="0"
                    onChange={(e) => {
                      e.preventDefault();
                      handleSGSTChange("amt", e.target.value, i);
                    }}
                    value={vi[2].amt}
                  />

                  {/* {vi[2].amt
                    ? parseFloat(vi[2].amt).toFixed(2) +
                    " (" +
                    vi[2].gst +
                    " %)"
                    : parseFloat(0).toFixed(2)} */}
                </td>
              </tr>
            );
          })}

        </tbody>


      ) : (
        <></>
      )}
      <tfoot className="tfoot-style">
        <tr >
          <td className="thwidth">
            <b> Total:</b><label>120.00</label>
          </td>



          <td style={{ width: "120px" }}>120.00</td>
          <td style={{ width: "120px" }}>120.00</td>

        </tr>

      </tfoot>
    </div>
  );
};

const SalesGST = ({ values, taxcal, authenticationService }) => {
  return (
    <>
      {" "}
      <thead>
        <tr>
          <th>IGST</th>
          <th>CGST</th>
          <th>SGST</th>
        </tr>
      </thead>
      {taxcal.cgst.length > 0 ? (
        <tbody>
          {_.zip(taxcal.igst, taxcal.cgst, taxcal.sgst).map((vi) => {
            return (
              <tr>
                <td className="p-0">
                  {parseFloat(vi[0].amt).toFixed(2) +
                    " (" +
                    vi[0].d_gst +
                    " %)"}
                </td>
                <td className="p-0">
                  {vi[1].amt
                    ? parseFloat(vi[1].amt).toFixed(2) +
                      " (" +
                      vi[1].gst +
                      " %)"
                    : parseFloat(0).toFixed(2)}
                </td>
                <td className="p-0">
                  {vi[2].amt
                    ? parseFloat(vi[2].amt).toFixed(2) +
                      " (" +
                      vi[2].gst +
                      " %)"
                    : parseFloat(0).toFixed(2)}
                </td>
              </tr>

            );
          })}

        </tbody>
      ) : (
        <></>
      )}
    </>
  );
};

export default function TGSTFooter({
  values,
  taxcal,
  authenticationService,
  handleCGSTChange,
  handleSGSTChange,
  tranType = "purchase",
}) {
  // console.log("TGSTFooter", {
  //   values,
  //   taxcal,
  //   authenticationService,
  //   handleCGSTChange,
  //   handleSGSTChange,
  // });
  // handleCGSTChange = (ele, value, rowIndex) => {
  //   let { rows, showBatch } = this.state;
  //   taxcal[rowIndex][ele] = value;
  //   console.warn(" tax ::", value);
  //   this.setState({ taxcal: value });

  // };
  // console.log("handleCGSTChange", handleCGSTChange)
  return (
    <div>
      <Table
        className="text-center btm-tbl mt-2 mb-2"
        // style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        {tranType === "purchase" ? (
          <PurchaseGST
            values={values}
            taxcal={taxcal}
            authenticationService={authenticationService}
            handleCGSTChange={handleCGSTChange}
            handleSGSTChange={handleSGSTChange}
          />
        ) : (
          <>
            <SalesGST
              values={values}
              taxcal={taxcal}
              authenticationService={authenticationService}
            />
          </>
        )}
      </Table>
    </div>
  );
}
