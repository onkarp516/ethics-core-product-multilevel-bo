import React, { Component } from "react";
import moment from "moment";
import { Formik } from "formik";
import { Button, Col, Row, Form, Modal, CloseButton } from "react-bootstrap";
import { MyNotifications } from "@/helpers";

export default class MdlCosting extends Component {
  constructor(props) {
    super(props);
    this.taxbatchRef = React.createRef();
    this.salesRateARef = React.createRef();
  }

  validatePurchaseRate = (mrp = 0, p_rate = 0, setFieldValue) => {
    //console.log("MRP =", parseFloat(mrp));
    //console.log("Purchase rate ::", parseFloat(p_rate));
    if (parseFloat(mrp) != 0) {
      if (parseFloat(mrp) < parseFloat(p_rate) === true) {
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Purchase rate should less than MRP",
          is_button_show: true,
        });
        //setFieldValue("b_purchase_rate", 0);
      }
    }
  };

  checkMargin = (
    margin = 0,
    mrp = 0,
    purchase_rate = 0,
    costing = 0,
    element,
    setFieldValue
  ) => {
    //console.log(
    // "margin,mrp,pruchase_rate,costing",
    // margin,
    // mrp,
    // purchase_rate,
    // costing
    // );
    let costingPer = (costing / 100) * margin;
    //console.log("sales_rate", costingPer + costing);
    this.taxbatchRef.current.setFieldValue(element, costingPer + costing);
  };

  validateSalesRate = (
    mrp = 0,
    purchaseRate = 0,
    salesRates = 0,
    element,
    setFieldValue
  ) => {
    if (
      parseFloat(salesRates) > parseFloat(purchaseRate) === false ||
      parseFloat(salesRates) < parseFloat(mrp) === false
    ) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "Sales rate is always between Purchase and Mrp",
        is_timeout: true,
        delay: 1000,
        // is_button_show: true,
      });
      // setFieldValue(element, 0);
      // setTimeout(() => {
      //   this.salesRateARef.current.focus();
      // }, 1000);
    }
  };

  render() {
    let { costingMdl, costingInitVal, productModalStateChange, tr_id } = this.props;
    return (
      <div>
        <Modal
          show={costingMdl}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="tnx-pur-inv-mdl-product"
          centered
          onHide={(e) => {
            productModalStateChange(
              {
                costingMdl: false,
                rowIndex: -1,
                b_details_id: 0,
              },
              true
            );
          }}
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Costing
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                // this.setState({ newBatchModal: false });
                // this.setState({ newBatchSelectModal: false });
                productModalStateChange(
                  {
                    costingMdl: false,
                    rowIndex: -1,
                    b_details_id: 0,
                  },
                  true
                );
              }}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.taxbatchRef}
            enableReinitialize={true}
            initialValues={costingInitVal}
            // validationSchema={Yup.object().shape({})}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let {
                rows,
                rowIndex,
                b_details_id,
                is_expired,
                selectedSupplier,
                isBatch,
              } = this.props;

              let batchError = false;
              if (b_details_id != 0) {
                //console.log("bdetail===>", b_details_id);
                batchError = false;
                let salesrate = b_details_id.min_rate_a;

                if (
                  selectedSupplier &&
                  parseInt(selectedSupplier.salesRate) == 2
                ) {
                  salesrate = b_details_id.min_rate_b;
                } else if (
                  selectedSupplier &&
                  parseInt(selectedSupplier.salesRate) == 3
                ) {
                  salesrate = b_details_id.min_rate_c;
                }

                rows[rowIndex]["rate"] = b_details_id.purchase_rate;
                rows[rowIndex]["sales_rate"] = salesrate;

                rows[rowIndex]["b_details_id"] = b_details_id.id;
                rows[rowIndex]["b_no"] = b_details_id.batch_no;
                rows[rowIndex]["b_rate"] = b_details_id.b_rate;

                rows[rowIndex]["rate_a"] = b_details_id.min_rate_a;
                rows[rowIndex]["rate_b"] = b_details_id.min_rate_b;
                rows[rowIndex]["rate_c"] = b_details_id.min_rate_c;
                rows[rowIndex]["margin_per"] = b_details_id.min_margin;
                rows[rowIndex]["b_purchase_rate"] = b_details_id.purchase_rate;
                rows[rowIndex]["costing"] = values.costing;
                rows[rowIndex]["costingWithTax"] = values.costingWithTax;

                rows[rowIndex]["b_expiry"] =
                  b_details_id.expiry_date != ""
                    ? b_details_id.expiry_date
                    : "";

                rows[rowIndex]["manufacturing_date"] =
                  b_details_id.manufacturing_date != ""
                    ? b_details_id.manufacturing_date
                    : "";

                rows[rowIndex]["is_batch"] = isBatch;
              } else {
                let salesrate = values.rate_a;

                if (
                  selectedSupplier &&
                  parseInt(selectedSupplier.salesRate) == 2
                ) {
                  salesrate = values.rate_b;
                } else if (
                  selectedSupplier &&
                  parseInt(selectedSupplier.salesRate) == 3
                ) {
                  salesrate = values.rate_c;
                }

                rows[rowIndex]["rate"] = values.b_purchase_rate;
                rows[rowIndex]["sales_rate"] = salesrate;
                rows[rowIndex]["b_details_id"] = values.b_details_id;
                rows[rowIndex]["b_no"] = values.b_no;
                rows[rowIndex]["b_rate"] = values.b_rate;
                rows[rowIndex]["rate_a"] = values.rate_a;
                rows[rowIndex]["rate_b"] = values.rate_b;
                rows[rowIndex]["rate_c"] = values.rate_c;
                rows[rowIndex]["margin_per"] = values.margin_per;
                rows[rowIndex]["b_purchase_rate"] = values.b_purchase_rate;
                rows[rowIndex]["costing"] = values.costing;
                rows[rowIndex]["costingWithTax"] = values.costingWithTax;

                rows[rowIndex]["b_expiry"] =
                  values.b_expiry != ""
                    ? moment(
                      new Date(moment(values.b_expiry, "DD/MM/YYYY").toDate())
                    ).format("YYYY-MM-DD")
                    : "";

                rows[rowIndex]["manufacturing_date"] =
                  values.manufacturing_date != ""
                    ? moment(
                      new Date(
                        moment(
                          values.manufacturing_date,
                          "DD/MM/YYYY"
                        ).toDate()
                      )
                    ).format("YYYY-MM-DD")
                    : "";

                rows[rowIndex]["is_batch"] = isBatch;
              }
              productModalStateChange(
                {
                  batch_error: batchError,
                  costingMdl: false,
                  rowIndex: -1,
                  b_details_id: 0,
                  isBatch: isBatch,
                  rows: rows,
                },
                true
              );
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
              isSubmitting,
              resetForm,
            }) => (
              <Form className="" onSubmit={handleSubmit} autoComplete="off">
                <Modal.Body className="tnx-pur-inv-mdl-body p-0">
                  <div
                    className="p-3"
                    style={{
                      background: "#E6F2F8",
                      borderBottom: "1px solid #dcdcdc",
                    }}
                  >
                    {/* {JSON.stringify(values)} */}
                    <Row className="mb-3">
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Product Name</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="Product Name"
                                name="productName"
                                id="productName"
                                onChange={handleChange}
                                value={values.productName}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Batch No.</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                // autoFocus="true"
                                autoComplete="off"
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="Batch No"
                                name="b_no"
                                id="b_no"
                                onChange={handleChange}
                                value={values.b_no}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>MRP</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="MRP"
                                name="b_rate"
                                id="b_rate"
                                onChange={handleChange}
                                value={values.b_rate}
                                autoComplete="off"
                              //readOnly
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Purchase Rate</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="Purchase Rate"
                                name="b_purchase_rate"
                                id="b_purchase_rate"
                                onChange={handleChange}
                                value={values.b_purchase_rate}
                                readOnly
                                onBlur={(e) => {
                                  e.preventDefault();
                                  this.validatePurchaseRate(
                                    values.b_rate,
                                    values.b_purchase_rate,
                                    setFieldValue
                                  );
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Costing</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              autoComplete="off"
                              type="text"
                              className="mdl-text-box-style"
                              placeholder="Costing"
                              name="costing"
                              id="costing"
                              onChange={handleChange}
                              value={values.costing}
                              readOnly
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Cost with tax</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                autoComplete="off"
                                className="mdl-text-box-style"
                                placeholder="Cost with tax"
                                name="costingWithTax"
                                id="costingWithTax"
                                onChange={handleChange}
                                value={values.costingWithTax}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Margin %</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                autoFocus="true"
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="Margin %"
                                name="margin_per"
                                id="margin_per"
                                onChange={(e) => {
                                  e.preventDefault();
                                  setFieldValue("margin_per", e.target.value);
                                  this.checkMargin(
                                    e.target.value,
                                    values.b_rate,
                                    values.b_purchase_rate,
                                    values.costing,
                                    "rate_a",
                                    setFieldValue
                                  );
                                }}
                                value={values.margin_per}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Sales Rate A</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                innerRef={(input) => {
                                  this.salesRateARef.current = input;
                                }}
                                autoComplete="off"
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="Sales Rate A"
                                name="rate_a"
                                id="rate_a"
                                onChange={handleChange}
                                value={values.rate_a}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  if (values.rate_a > 0) {
                                    this.validateSalesRate(
                                      values.b_rate,
                                      values.b_purchase_rate,
                                      values.rate_a,
                                      "rate_a",
                                      setFieldValue
                                    );
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Sales Rate B</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="Sales Rate B"
                                name="rate_b"
                                id="rate_b"
                                onChange={handleChange}
                                value={values.rate_b}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  if (values.rate_b > 0) {
                                    this.validateSalesRate(
                                      values.b_rate,
                                      values.b_purchase_rate,
                                      values.rate_b,
                                      "rate_b",
                                      setFieldValue
                                    );
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="">
                      <Col lg={4}>
                        <Row>
                          <Col lg={4}>
                            <Form.Label>Sales Rate C</Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="Sales Rate C"
                                name="rate_c"
                                id="rate_c"
                                onChange={handleChange}
                                value={values.rate_c}
                                onBlur={(e) => {
                                  e.preventDefault();
                                  if (values.rate_c > 0) {
                                    this.validateSalesRate(
                                      values.b_rate,
                                      values.b_purchase_rate,
                                      values.rate_c,
                                      "rate_c",
                                      setFieldValue
                                    );
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>

                  <Row>
                    <Col md="12" className="btn_align pad">
                      <Button className="submit-btn" type="submit">
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn ms-2"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          productModalStateChange(
                            {
                              costingMdl: false,
                              rowIndex: -1,
                              b_details_id: 0,
                            },
                            true,
                          );

                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    );
  }
}
