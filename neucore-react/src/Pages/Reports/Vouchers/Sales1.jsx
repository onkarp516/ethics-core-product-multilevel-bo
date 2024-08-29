import React, { Component } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import { MyDatePicker, eventBus } from "@/helpers";
export default class Sales1 extends Component {
  render() {
    return (
      <>
        <div className="report-form-style">
          <div className="p-3">
            <Table bordered hover responsive>
              <thead>
                <tr className="border-dark">
                  <th colSpan={6} className="text-center">
                    <h4>Compony Name</h4>{" "}
                  </th>
                </tr>

                <tr className="border-dark">
                  <th colSpan={6} className="text-center">
                    <h4>Sales Voucher</h4>
                  </th>
                </tr>
                <tr className="border-dark">
                  <th colSpan={6}>
                    <div className="justify-content-center d-flex">
                      PERIOD :
                      <MyDatePicker
                        name="start_date"
                        placeholderText="DD/MM/YYYY"
                        // id="start_date"
                        // dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        // onChange={(newDate) => {
                        //   console.log("Start Date is :", newDate);
                        //   this.setState({ startDate: newDate });
                        // }}
                        // selected={startDate}
                        // value={startDate}
                        // className="report-date-style"
                      />
                      TO
                      <MyDatePicker
                        name="end_date"
                        placeholderText="DD/MM/YYYY"
                        // id="end_date"
                        // dateFormat="dd/MM/yyyy"
                        // // maxDate={new Date()}
                        // onChange={(newDate) => {
                        //   console.log("End Date is :", newDate);
                        //   this.setState({ endDate: newDate }, () => {
                        //     this.get_profit_and_loss_ac_details_on_date_change_of_user();
                        //   });
                        // }}
                        // selected={endDate}
                        // value={endDate}
                        // className="report-date-style"
                      />
                      -Month which we select
                    </div>
                  </th>
                </tr>

                <tr className="border-dark" style={{ background: "#d6fcdc" }}>
                  <th className="text-center">Date</th>
                  <th className="text-center">Invoice No.</th>
                  <th className="text-center">Purticulars</th>
                  <th className="text-center">Vouchers Type</th>
                  <th className="text-center">Debit</th>
                  <th className="text-center">Credit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-dark">
                  <td className="text-center">1/4/2022</td>
                  <td className="text-center">124</td>
                  <td>Sundry creditors A/c</td>
                  <td className="text-center">Purchase</td>
                  <td className="text-center"></td>
                  <td className="text-center">XXX</td>
                </tr>
                <tr className="border-dark">
                  <td className="text-center">1/4/2022</td>
                  <td className="text-center">124</td>
                  <td>Sundry creditors A/c</td>
                  <td className="text-center">Purchase</td>
                  <td className="text-center"></td>
                  <td className="text-center">XXX</td>
                </tr>
                {Array.from(Array(12), (v) => {
                  return (
                    <tr className="border-dark">
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-dark" style={{ background: "#dde2ed" }}>
                  <th className="text-center"></th>
                  <th className="text-center"></th>
                  <th>Total Amount</th>
                  <th className="text-center"></th>
                  <th className="text-center"></th>
                  <th className="text-center">XXXX</th>
                </tr>
                {Array.from(Array(3), (v) => {
                  return (
                    <tr className="border-dark">
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  );
                })}
              </tfoot>
            </Table>
          </div>
        </div>
      </>
    );
  }
}
