import React from "react";
import { Table } from "react-bootstrap";
import _ from "lodash";

const PurchaseGST = ({ values, taxcal, authenticationService }) => {
  return (
    <>
      {" "}
      <thead>
        <tr>
          <th>GST %</th>

          {values &&
          values.supplierCodeId &&
          parseInt(values.supplierCodeId.state) !==
            parseInt(authenticationService.currentUserValue.state) ? (
            <>
              <th>IGST Amt</th>
            </>
          ) : (
            <>
              <th>CGST Amt</th>
              <th>SGST Amt</th>
            </>
          )}
        </tr>
      </thead>
      {/* {JSON.stringify(taxcal, undefined, 2)} */}
      {values &&
      values.supplierCodeId &&
      parseInt(values.supplierCodeId.state) !==
        parseInt(authenticationService.currentUserValue.state) ? (
        <>
          {values &&
          values.supplierCodeId &&
          values.supplierCodeId.state !==
            authenticationService.currentUserValue.state ? (
            taxcal.igst.length > 0 && (
              <tbody>
                {taxcal.igst.map((vi) => {
                  return (
                    <tr>
                      <td className="p-0">{vi.gst}</td>
                      <td className="p-0">
                        {vi.amt
                          ? parseFloat(vi.amt).toFixed(2)
                          : parseFloat(0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      {authenticationService.currentUserValue &&
      authenticationService.currentUserValue.state &&
      values &&
      values.supplierCodeId &&
      parseInt(values.supplierCodeId.state) ===
        parseInt(authenticationService.currentUserValue.state) ? (
        <>
          {authenticationService.currentUserValue.state &&
          values &&
          values.supplierCodeId &&
          parseInt(values.supplierCodeId.state) ===
            parseInt(authenticationService.currentUserValue.state) &&
          taxcal.cgst.length > 0 ? (
            <tbody>
              {_.zip(taxcal.cgst, taxcal.sgst).map((vi) => {
                return (
                  <tr>
                    <td className="p-0">{vi[0].d_gst}</td>
                    <td className="p-0">
                      {vi[0].amt
                        ? parseFloat(vi[0].amt).toFixed(2)
                        : parseFloat(0).toFixed(2)}
                    </td>
                    <td className="p-0">
                      {vi[1].amt
                        ? parseFloat(vi[1].amt).toFixed(2)
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
      ) : (
        <></>
      )}
    </>
  );
};

const SalesGST = ({ values, taxcal, authenticationService }) => {
  return (
    <>
      {" "}
      <thead>
        <tr>
          <th>GST %</th>
          {/* <th>
            <pre>{JSON.stringify(values.clientNameId, undefined, 2)}</pre>
            <pre>{JSON.stringify(taxcal, undefined, 2)}</pre>
          </th> */}
          {/* {JSON.stringify(values)}
          {JSON.stringify(authenticationService.currentUserValue.state)} */}

          {values &&
          values.clientNameId &&
          parseInt(values.clientNameId.state) !==
            parseInt(authenticationService.currentUserValue.state) ? (
            <>
              <th>IGST Amt</th>
            </>
          ) : (
            <>
              <th>CGST Amt</th>
              <th>SGST Amt</th>
            </>
          )}
        </tr>
      </thead>
      {/* {JSON.stringify(taxcal, undefined, 2)} */}
      {/* {JSON.stringify(values)} */}
      {values &&
      values.clientNameId &&
      parseInt(values.clientNameId.state) !==
        parseInt(authenticationService.currentUserValue.state) ? (
        <>
          {values &&
          values.clientNameId &&
          values.clientNameId.state !==
            authenticationService.currentUserValue.state ? (
            taxcal.igst.length > 0 && (
              <tbody>
                {taxcal.igst.map((vi) => {
                  return (
                    <tr>
                      <td className="p-0">{vi.gst}</td>
                      <td className="p-0">
                        {vi.amt
                          ? parseFloat(vi.amt).toFixed(2)
                          : parseFloat(0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      {authenticationService.currentUserValue &&
      authenticationService.currentUserValue.state &&
      values &&
      values.clientNameId &&
      parseInt(values.clientNameId.state) ===
        parseInt(authenticationService.currentUserValue.state) ? (
        <>
          {authenticationService.currentUserValue.state &&
          values &&
          values.clientNameId &&
          parseInt(values.clientNameId.state) ===
            parseInt(authenticationService.currentUserValue.state) &&
          taxcal.cgst.length > 0 ? (
            <tbody>
              {_.zip(taxcal.cgst, taxcal.sgst).map((vi) => {
                return (
                  <tr>
                    <td className="p-0">{vi[0].gst}</td>
                    <td className="p-0">
                      {vi[0].amt
                        ? parseFloat(vi[0].amt).toFixed(2)
                        : parseFloat(0).toFixed(2)}
                    </td>
                    <td className="p-0">
                      {vi[1].amt
                        ? parseFloat(vi[1].amt).toFixed(2)
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
      ) : (
        <></>
      )}
    </>
  );
};

export default function TGSTFooter_bkp({
  values,
  taxcal,
  authenticationService,
  tranType = "purchase",
}) {
  // console.log("TGSTFooter", { values, taxcal, authenticationService });
  return (
    <div>
      <Table
        className="text-center btm-tbl"
        // style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        {tranType === "purchase" ? (
          <PurchaseGST
            values={values}
            taxcal={taxcal}
            authenticationService={authenticationService}
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
