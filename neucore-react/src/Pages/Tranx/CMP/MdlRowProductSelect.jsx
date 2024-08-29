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

export default class MdlRowProductSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBills: [],
      isAllChecked: false,
    };
  }

  handleBillsSelectionAll = (status) => {
    let { lstProductRows } = this.props;
    console.log("Status==>>>", status);
    console.log("lstProductRows---", lstProductRows);
    let fBills = lstProductRows;
    let lstSelected = [];
    if (status == true) {
      lstSelected = lstProductRows.map((v) => v.details_id);

      console.log("lst", lstSelected);
    }
    this.setState({
      isAllChecked: status,
      selectedBills: lstSelected,
      lstProductRows: fBills,
    });
  };
  handleBillselection = (id, index, status) => {
    // debugger;
    let { selectedBills } = this.state;
    let { lstProductRows } = this.props;

    console.log({ id, index, status });
    console.log("Selectedbills==>>??", selectedBills);

    let f_selectedBills = selectedBills;
    let f_billLst = lstProductRows;
    if (status == true) {
      if (selectedBills.length > 0) {
        if (!selectedBills.includes(id)) {
          f_selectedBills = [...f_selectedBills, parseInt(id)];
        }
      } else {
        f_selectedBills = [...f_selectedBills, parseInt(id)];
      }
    } else {
      f_selectedBills = f_selectedBills.filter(
        (v, i) => parseInt(v) != parseInt(id)
      );
    }
    this.setState({
      isAllChecked: f_billLst.length == f_selectedBills.length ? true : false,
      selectedBills: f_selectedBills,
      lstProductRows: f_billLst,
    });
  };

  // search_invoice_bill = (value) => {
  //   let { orgLstProductRows, productModalStateChange } = this.props;

  //   if (value !== "") {
  //     const searchResults = orgLstProductRows.filter((product) => {
  //       const productName = product.product_name.toLowerCase();
  //       return productName.includes(value.toLowerCase());
  //     });
  //     productModalStateChange({ lstProductRows: searchResults });
  //   } else {
  //     // If the search input is empty, show all products.
  //     productModalStateChange({ lstProductRows: orgLstProductRows });
  //   }
  // };
  FocusTrRowFieldsID(fieldName) {
    console.log("fieldName", fieldName);
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName) != null) {
      document.getElementById(fieldName).focus();
    }
  }

  search_invoice_bill = (value) => {
    let { orgLstProductRows, productModalStateChange } = this.props;

    if (value !== "") {
      const searchResults = orgLstProductRows.filter((product) => {
        const lowerCasedValue = value.toLowerCase();
        const productFields = [
          product.product_name.toLowerCase(),
          product.unit_name.toLowerCase(),
          product.batch_no.toLowerCase(),
          product.b_expiry.toLowerCase(),
          product.qty.toString().toLowerCase(),
          product.rate.toString().toLowerCase(),
          (product.pi + 1).toString().toLowerCase(),
        ];

        return productFields.some((field) => field.includes(lowerCasedValue));
      });
      productModalStateChange({ lstProductRows: searchResults });
    } else {
      // If the search input is empty, show all products.
      productModalStateChange({ lstProductRows: orgLstProductRows });
    }
  };

  focusNextElement(e, nextIndex = null) {
    // debugger
    var form = e.target.form;
    var cur_index =
      nextIndex != null
        ? nextIndex
        : Array.prototype.indexOf.call(form, e.target);
    let ind = cur_index + 1;
    for (let index = ind; index <= form.elements.length; index++) {
      if (form.elements[index]) {
        if (
          !form.elements[index].readOnly &&
          !form.elements[index].disabled &&
          form.elements[index].id != ""
        ) {
          form.elements[index].focus();
          break;
        } else {
          this.focusNextElement(e, index);
        }
      } else {
        this.focusNextElement(e, index);
      }
    }
  }

  // componentWillReceiveProps(prev, next) {
  //   let { selectedProduct, rowProductModal } = prev;
  //   if (rowProductModal == true && selectedProduct != "") {
  //     this.setSelectedBillFocus(selectedProduct, rowProductModal);
  //   }
  // }

  // setSelectedBillFocus = (selectedProduct, invoiceBillLst, orgLstProductRows) => {
  //   console.log("orgLstProductRows", orgLstProductRows);
  //   console.log("selectedProduct", selectedProduct);
  //   this.setState({ selectedBills: selectedProduct })
  // let selectedBillNoId = selectedProduct;
  // let inxOf = -1;
  // orgLstProductRows.map((v, i) => {
  //   if (parseInt(v.product_id) == parseInt(selectedBillNoId)) {
  //     inxOf = i;
  //   }
  // });
  // console.log("inxOf", inxOf);
  // // billList-2
  // if (inxOf > -1) {
  //   this.setState({ selectedLedgerIndex: inxOf }, () => {
  //     setTimeout(() => {
  //       document.getElementById(`billList-${inxOf}`)?.focus();
  //     }, 100);
  //   })
  // }

  // }

  render() {
    let { isAllChecked, selectedBills } = this.state;
    let {
      rowProductModal,
      productModalStateChange,
      lstProductRows,
      orgLstProductRows,
      onSubmitRowProductSelect,
      disabledType
    } = this.props;
    return (
      <div>
        <Modal
          show={rowProductModal}
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
              rowProductModal: false,
            });
          }}
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Select Product
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                productModalStateChange({
                  rowProductModal: false,
                });

                // this.SelectProductModalFun(false);
              }}
            />
          </Modal.Header>
          <Modal.Body
            className="tnx-pur-inv-mdl-body p-0"
            onKeyDown={(e) => {
              if (e.keyCode == 13) {
                e.preventDefault();
              }
            }}
          >
            <Form>
              <Row className="p-3">
                <Col lg={6}>
                  <InputGroup className="mb-3 mdl-text">
                    <Form.Control
                      id="productMdlSearch"
                      autoFocus={true}
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      className="mdl-text-box"
                      onChange={(e) => {
                        this.search_invoice_bill(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13 || e.keyCode === 40) {
                          this.focusNextElement(e);
                        }
                      }}
                    />
                    <InputGroup.Text className="int-grp" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>

              <div className="tnx-pur-inv-ModalStyle">
                {/* {JSON.stringify(lstProductRows.length)} */}
                <Table className="text-start">
                  <thead>
                    <tr>
                      <th className="">
                        <Form.Group
                          controlId="formBasicCheckbox"
                          className="ml-1 mb-1 pmt-allbtn"
                        >
                          <Form.Check
                            id="Allcheck"
                            label="Invoice #."
                            type="checkbox"
                            style={{ verticalAlign: "middle" }}
                            checked={isAllChecked === true ? true : false}
                            onChange={(e) => {
                              this.handleBillsSelectionAll(e.target.checked);
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode === 13) {
                                this.focusNextElement(e);
                              }
                            }}
                          />
                        </Form.Group>
                      </th>
                      <th>Sr. No.</th>
                      <th>Product Name</th>
                      <th>Package Name</th>
                      <th>Unit Name</th>
                      <th>Batch No.</th>
                      <th>Expiry Date</th>
                      <th>Ret. Qty</th>
                      <th>Qty</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lstProductRows &&
                      lstProductRows.length > 0 &&
                      lstProductRows.map((pv, pi) => {
                        return (
                          <tr
                            style={{
                              background:
                                disabledType == "salesReturnCreate" ? pv.returnable_qty == 0 ? "lightgray" : "" : "",
                            }}
                          >
                            <td className="pt-1 p2-1 pl-1 pb-0">
                              <Form.Group>
                                <Form.Check
                                  id={`details_id-${pi}`}
                                  name="details_id"
                                  type="checkbox"
                                  label={pv.details_id}
                                  value={pv.details_id}
                                  checked={
                                    pv.returnable_qty == 0
                                      ? false
                                      : selectedBills.includes(
                                        parseInt(pv.details_id)
                                      )
                                  }
                                  onClick={(e) => {
                                    // console.log("click");
                                    this.handleBillselection(
                                      pv.details_id,
                                      pi,
                                      e.target.checked
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                  style={{ verticalAlign: "middle" }}
                                  disabled={disabledType == "salesReturnCreate" ?
                                    pv.returnable_qty == 0 ? true : false : ""
                                  }
                                />
                              </Form.Group>
                            </td>
                            <td className="ps-3">{pi + 1}</td>
                            <td className="ps-3">{pv.product_name}</td>
                            <td className="ps-3">{pv.pack_name}</td>
                            <td className="ps-3">{pv.unit_name}</td>
                            <td className="ps-3">{pv.batch_no}</td>
                            <td className="ps-3">{pv.b_expiry}</td>
                            <td className="ps-3">{pv.returnable_qty}</td>
                            <td className="ps-3">{pv.qty}</td>
                            <td className="ps-3">{pv.rate}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
              <Row>
                <Col md="12 p-3" className="btn_align">
                  <Button
                    id="select_prd_id"
                    className="submit-btn successbtn-style me-2"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (selectedBills.length > 0) {
                        let f_rows = lstProductRows.filter((v) =>
                          selectedBills.includes(parseInt(v.details_id))
                        );
                        console.log("f_rows", f_rows, selectedBills);
                        this.props.onSubmitRowProductSelect(f_rows);
                      }

                      productModalStateChange({
                        rowProductModal: false,
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                        if (selectedBills.length > 0) {
                          let f_rows = lstProductRows.filter((v) =>
                            selectedBills.includes(parseInt(v.details_id))
                          );
                          console.log("f_rows", f_rows, selectedBills);
                          this.props.onSubmitRowProductSelect(f_rows);
                        }

                        productModalStateChange({
                          rowProductModal: false,
                        });
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn ms-2"
                    type="button"
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   productModalStateChange({
                    //     newBatchModal: false,
                    //     rowIndex: -1,
                    //     tr_id: "",
                    //     is_expired: false,
                    //   });
                    // }}
                    onClick={(e) => {
                      e.preventDefault();
                      productModalStateChange({
                        rowProductModal: false,
                      });

                      // this.SelectProductModalFun(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
