import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
} from "react-bootstrap";
import moment from "moment";

import search from "@/assets/images/search_icon@3x.png";
export default class MdlBillLst extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedLedgerIndex: 0, };
  }

  search_invoice_bill = (value) => {
    let { orginvoiceBillLst, productModalStateChange } = this.props;
    // console.log("orginvoiceBillLst", orginvoiceBillLst, value);
    if (value != "") {
      let inBillLst = orginvoiceBillLst.filter((v) =>
        v.invoice_no.toLowerCase().includes(value.toLowerCase())
      );
      productModalStateChange({ invoiceBillLst: inBillLst });
    } else {
      productModalStateChange({ invoiceBillLst: orginvoiceBillLst });
    }
  };

  FocusTrRowFieldsID(fieldName) {
    console.log("fieldName", fieldName)
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName) != null) {
      document.getElementById(fieldName).focus();
    }
  }
  handleMdlBillLstTableRow(event) {
    // console.log("handleMdlBillLstTableRow", event);
    let { rowIndex, selectedLedgerIndex, rows, selectedLedger } =
      this.state;
    let { invoiceBillLst, productModalStateChange, invoiceBillModal, selectedBillNo } = this.props;
    // let { handleBillByBill, ledgerData } = this.props;
    // console.log("objCR==>", objCR, rowIndex);
    // let currentR = rows[rowIndex];
    const k = event.keyCode;

    if (k == 13) {
      console.log("arrowdown", invoiceBillLst, selectedLedgerIndex);
      let obj = invoiceBillLst[selectedLedgerIndex];
      console.log("enter work", obj);
      if (obj) {
        if (selectedBillNo != "") {
          productModalStateChange({
            invoiceBillModal: false,
            selectedBillNo: selectedBillNo,
          });
          this.props.getPurchaseInvoiceDetails();
        }
        this.setState({ selectedLedgerIndex: 0 });

      }
    } else if (k == 40) {
      console.log("invoiceBillLst", invoiceBillLst);
      console.log("invoiceBillLst len", invoiceBillLst.length);
      console.log("selectedLedgerIndex", selectedLedgerIndex);
      // console.log("arrowdown", invoiceBillLst, selectedLedgerIndex, parseInt(selectedLedgerIndex) < parseInt(invoiceBillLst.length - 1));
      if (parseInt(selectedLedgerIndex) < parseInt(invoiceBillLst.length - 1)) {
        console.log("arrowdownnn", invoiceBillLst, selectedLedgerIndex);
        this.setState(
          { selectedLedgerIndex: selectedLedgerIndex + 1 },
          () => {
            console.log("arrowdownnn", invoiceBillLst, selectedLedgerIndex);
            let obj = invoiceBillLst[this.state.selectedLedgerIndex];
            productModalStateChange({
              selectedBillNo: obj,
            });
            this.FocusTrRowFieldsID(
              `billList-${this.state.selectedLedgerIndex}`
            );
          }
        );
      }
    } else if (k == 38) {
      // console.log("arrowup");
      if (selectedLedgerIndex > 0) {
        this.setState(
          { selectedLedgerIndex: selectedLedgerIndex - 1 },
          () => {
            let obj = invoiceBillLst[this.state.selectedLedgerIndex];
            productModalStateChange({
              selectedBillNo: obj,
            });
            this.FocusTrRowFieldsID(
              `billList-${this.state.selectedLedgerIndex}`
            );
          }
        );
      }
    } else if (k == 8) {
      // this.FocusTrRowFieldsID(
      //   `contra-perticulars-${this.state.selectedLedgerIndex}`
      // );
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps(prev, next) {
    let { invoiceBillModal, selectedBillNo, invoiceBillLst } = prev;
    if (invoiceBillModal == true && selectedBillNo != "") {
      this.setSelectedBillFocus(selectedBillNo, invoiceBillLst);
    }
  }

  setSelectedBillFocus = (selectedBillNo, invoiceBillLst) => {
    console.log("invoiceBillLst", invoiceBillLst);
    console.log("selectedBillNo", selectedBillNo);
    let selectedBillNoId = selectedBillNo.invoice_id;
    let inxOf = -1;
    invoiceBillLst.map((v, i) => {
      if (parseInt(v.invoice_id) == parseInt(selectedBillNoId)) {
        inxOf = i;
      }
    });
    console.log("inxOf", inxOf);
    // billList-2
    if (inxOf > -1) {
      this.setState({ selectedLedgerIndex: inxOf }, () => {
        setTimeout(() => {
          document.getElementById(`billList-${inxOf}`)?.focus();
        }, 100);
      })
    }

  }

  render() {
    let {
      invoiceBillModal,
      invoiceBillLst,
      productModalStateChange,
      selectedBillNo,
    } = this.props;
    let { selectedLedgerIndex } = this.state;
    return (
      <div>
        <Modal
          show={invoiceBillModal}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="tnx-pur-inv-mdl-product"
          centered
          onHide={(e) => {
            productModalStateChange({
              invoiceBillModal: false,
            });
          }}
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Select Bill

              {/* {JSON.stringify(selectedBillNo)} */}
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                productModalStateChange({
                  invoiceBillModal: false,
                });

                // this.SelectProductModalFun(false);
              }}
            />
          </Modal.Header>
          <Modal.Body className="tnx-pur-inv-mdl-body p-0">
            <Row className="p-3">
              <Col lg={6}>
                <InputGroup className="mb-3 mdl-text">
                  <Form.Control
                    autoFocus="true"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    className="mdl-text-box"
                    onChange={(e) => {
                      this.search_invoice_bill(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      if (e.keyCode === 13) {
                        // setTimeout(() => {
                        document.getElementById("productTr_0")?.focus();
                        // }, 500);
                      } else if (e.keyCode == 40) {
                        document
                          .getElementById("billList-0")
                          .focus();
                      }
                    }}
                  />
                  <InputGroup.Text className="int-grp" id="basic-addon1">
                    <img className="srch_box" src={search} alt="" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              {/* <Col lg={1} className="mt-2">
                  <Form.Label>Barcode</Form.Label>
                </Col>
                <Col lg={3}>
                  <InputGroup className="mdl-text">
                    <Form.Control
                      type="text"
                      placeholder="Enter"
                      name="gst_per"
                      id="gst_per"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.transaction_product_listFun("", e.target.value);
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      
                    </InputGroup.Text>
                  </InputGroup>
                </Col> */}
            </Row>
            <div className="tnx-pur-inv-ModalStyle">
              <Table className="text-start"
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.keyCode != 9) {
                    this.handleMdlBillLstTableRow(e);
                  }
                }}>
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Bill No</th>
                    <th>Bill Amount</th>
                    <th>Bill Date</th>
                  </tr>
                </thead>
                <tbody
                  className="prouctTableTr"
                >
                  {invoiceBillLst.map((pv, pi) => {
                    return (
                      <tr

                        // className={`${JSON.stringify(pv) == JSON.stringify(selectedBillNo)
                        //   ? "selected-tr"
                        //   : ""
                        //   }`}
                        id={`billList-${pi}`}
                        prId={pv.id}
                        tabIndex={pi}
                        className={`${pi == selectedLedgerIndex
                          ? "payment-ledger-selected-tr"
                          : ""
                          }`}
                        onDoubleClick={(e) => {
                          // alert("hello")
                          // e.preventDefault();
                          // // console.log("selectedProduct", selectedProduct);
                          // if (selectedBillNo != "") {
                          //   productModalStateChange({
                          //     invoiceBillModal: false,
                          //     selectedBillNo: selectedBillNo,
                          //   });
                          //   this.props.getPurchaseInvoiceDetails();
                          // }

                          this.setState(
                            {

                              selectedLedgerIndex: 0,
                              // selectedLedger: obj,
                            },
                            () => {
                              if (selectedBillNo != "") {
                                productModalStateChange({
                                  invoiceBillModal: false,
                                  selectedBillNo: selectedBillNo,
                                });
                                this.props.getPurchaseInvoiceDetails();
                              }
                            }
                          );
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          productModalStateChange({
                            selectedBillNo: pv,
                          });
                          //   console.log("pv", pv);
                        }}
                      >
                        <td className="ps-3">{pi + 1}</td>
                        <td className="ps-3">{pv.invoice_no}</td>
                        <td className="ps-3">{pv.total_amount}</td>
                        <td className="ps-3">
                          {moment(pv.invoice_date, "YYYY-MM-DD").format(
                            "DD/MM/YYYY"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
