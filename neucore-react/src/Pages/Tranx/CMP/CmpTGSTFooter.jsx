import React from "react";
import { Table, Form } from "react-bootstrap";
import _ from "lodash";
import { authenticationService } from "@/services/api_functions";
import { roundDigit , configDecimalPlaces} from "@/helpers";

const PurchaseGST = ({
  values,
  taxcal,
  gstId,
  handleCGSTChange,
  handleSGSTChange,
}) => {
  return (
    <div className="tgstFooter_tabl_style ">
      <thead
        style={{
          borderBottom: "2px solid transparent",
          background: " #d9d9d9",
          position: "sticky",
          zIndex: "999",
          top: "0",
        }}
      >
        <tr>
          <th
            className={`${
              gstId &&
              gstId != "" &&
              parseInt(gstId.state) !=
                parseInt(authenticationService.currentUserValue.state)
                ? "thwidth1"
                : "thwidth"
            }`}
          >
            GST
          </th>
          {gstId &&
          gstId != "" &&
          parseInt(gstId.state) !=
            parseInt(authenticationService.currentUserValue.state) ? (
            <>
              <th style={{ width: "50%" }}>IGST</th>
            </>
          ) : (
            <>
              <th style={{ width: "120px" }}>CGST</th>
              <th style={{ width: "120px" }}>SGST</th>
            </>
          )}
        </tr>
      </thead>

      {taxcal && taxcal.cgst.length > 0 ? (
        <tbody className="TGST-body">
          {_.zip(taxcal.igst, taxcal.cgst, taxcal.sgst).map((vi, i) => {
            return (
              <tr className="TGST">
                <td className="p-0">
                  {/* {parseFloat(vi[0].amt).toFixed(2) +
                    " (" +
                    vi[0].d_gst +
                    " %)"} */}
                  {"(" + vi[0].d_gst + " %)"}
                </td>
                {gstId &&
                gstId != "" &&
                parseInt(gstId.state) !=
                  parseInt(authenticationService.currentUserValue.state) ? (
                  <>
                    <td className="p-0">
                      {/* {parseFloat(vi[0].amt).toFixed(2) +
                        " (" +
                        vi[0].d_gst +
                        " %)"} */}
                      <Form.Control
                        autoComplete="off"
                        id="amt"
                        name="amt"
                        className="footer-table-text-box text-end"
                        type="text"
                        placeholder="0"
                        onChange={(e) => {
                          e.preventDefault();
                        }}
                        value={vi[0].amt}
                        readOnly
                        disabled
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-0">
                      <Form.Control
                        autoComplete="off"
                        id="amt"
                        name="amt"
                        className="footer-table-text-box text-end"
                        type="text"
                        placeholder="0"
                        onChange={(e) => {
                          e.preventDefault();
                          handleCGSTChange("amt", e.target.value, i);
                        }}
                        value={vi[1].amt}
                        disabled
                      />
                    </td>
                    <td className="p-0">
                      <Form.Control
                        autoComplete="off"
                        id="amt"
                        name="amt"
                        className="footer-table-text-box text-end"
                        type="text"
                        placeholder="0"
                        onChange={(e) => {
                          e.preventDefault();
                          handleSGSTChange("amt", e.target.value, i);
                        }}
                        value={vi[2].amt}
                        disabled
                      />
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      ) : (
        <></>
      )}

      {taxcal && taxcal.cgst.length > 0 ? (
        <tfoot className="tfoot-style">
          <tr>
            <td
              className={`${
                gstId &&
                gstId != "" &&
                parseInt(gstId.state) !=
                  parseInt(authenticationService.currentUserValue.state)
                  ? "thwidth1"
                  : "thwidth"
              }`}
            >
              <b> Total:</b>
            </td>
            {gstId &&
            gstId != "" &&
            parseInt(gstId.state) !=
              parseInt(authenticationService.currentUserValue.state) ? (
              <>
                <td style={{ width: "50%" }}>
                  {taxcal &&
                    taxcal.igst &&
                    roundDigit(taxcal.igst
                                          .reduce(
                                            (prev, next) => parseFloat(prev) + parseFloat(next.amt),
                                            0
                                          ),configDecimalPlaces)}
                      
                </td>
              </>
            ) : (
              <>
                <td style={{ width: "120px" }}>
                  {taxcal &&
                    taxcal.cgst &&
                    roundDigit(taxcal.cgst
                                          .reduce(
                                            (prev, next) => parseFloat(prev) + parseFloat(next.amt),
                                            0
                                          ),configDecimalPlaces)
                      }
                </td>
                <td style={{ width: "120px" }}>
                  {taxcal &&
                    taxcal.sgst &&
                    roundDigit(taxcal.sgst
                                          .reduce(
                                            (prev, next) => parseFloat(prev) + parseFloat(next.amt),
                                            0
                                          ),configDecimalPlaces)
                      }
                </td>
              </>
            )}
          </tr>
        </tfoot>
      ) : (
        <></>
      )}
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
      {taxcal && taxcal.cgst.length > 0 ? (
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

export default function CmpTGSTFooter({
  values,
  taxcal,
  gstId,
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
            gstId={gstId}
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
