import React, { Component } from "react";
import moment from "moment";
import { Formik } from "formik";
import {
  Button,
  Col,
  Row,
  Form,
  Modal,
  CloseButton,
  Table,
  InputGroup,
} from "react-bootstrap";
import search from "@/assets/images/search_icon@3x.png";
import {
  MyNotifications,
  INRformat,
  roundDigit,
  configDecimalPlaces,
} from "@/helpers";

export default class MdlCosting extends Component {
  constructor(props) {
    super(props);
    this.taxbatchRef = React.createRef();
    this.salesRateARef = React.createRef();
    this.salesRateARef2 = React.createRef();
    this.salesRateARef3 = React.createRef();
    this.cessRef = React.createRef();
    this.state = { batchDataList: "" };
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
    // console.log(
    //   "margin,mrp,pruchase_rate,costing",
    //   margin,
    //   mrp,
    //   purchase_rate,
    //   costing
    // );
    let costingPer = roundDigit((costing / 100) * margin, configDecimalPlaces);
    // console.log("sales_rate", costingPer + costing);
    // console.log("costingPer", costingPer);
    let sale_rate = parseFloat(costingPer) + parseFloat(costing);
    // console.log("sale_rate", sale_rate);

    if (margin > 0) {
      this.taxbatchRef.current.setFieldValue(
        element,
        roundDigit(sale_rate, configDecimalPlaces)
      );
    } else {
      setFieldValue("rate_a", "");
    }
  };

  validateSalesRate = (
    mrp = 0,
    purchaseRate = 0,
    salesRates = 0,
    costing = 0,
    element,
    setFieldValue
  ) => {
    // console.log("costing_____", costing);
    if (
      parseFloat(costing) <= parseFloat(salesRates) &&
      parseFloat(salesRates) <= parseFloat(mrp)
    ) {
      document.getElementById("rate_b")?.focus();
    } else {
      MyNotifications.fire({
        show: true,
        icon: "confirm",
        title: "Confirm",
        msg: "Sales rate is always between Costing and MRP, do you want to continue?",
        is_timeout: false,
        // delay: 1500,
        // is_button_show: true,
        handleSuccessFn: () => {
          setTimeout(() => {
            this.salesRateARef2.current?.focus();
          }, 500);
        },
        handleFailFn: () => {
          setFieldValue(element, 0);
          setTimeout(() => {
            this.salesRateARef.current?.focus();
          }, 500);
        },
      });
      // setFieldValue(element, 0);
      setTimeout(() => {
        this.taxbatchRef.current.setFieldValue("rate_a", "");
        this.salesRateARef.current?.focus();
      }, 1000);
    }
  };

  validateSalesRate2 = (
    mrp = 0,
    purchaseRate = 0,
    salesRates = 0,
    costing = 0,
    element,
    setFieldValue
  ) => {
    // console.log("costing_____", costing);
    if (
      parseFloat(costing) <= parseFloat(salesRates) &&
      parseFloat(salesRates) <= parseFloat(mrp)
    ) {
    } else {
      MyNotifications.fire({
        show: true,
        icon: "confirm",
        title: "Confirm",
        msg: "Sales rate is always between Costing and MRP, do you want to continue?",
        is_timeout: false,
        // delay: 1500,
        // is_button_show: true,
        handleSuccessFn: () => {
          setTimeout(() => {
            this.salesRateARef3.current?.focus();
          }, 500);
        },
        handleFailFn: () => {
          setFieldValue(element, 0);
          setTimeout(() => {
            this.salesRateARef2.current?.focus();
          }, 500);
        },
      });
      // setFieldValue(element, 0);
      setTimeout(() => {
        this.taxbatchRef.current.setFieldValue("rate_b", "");
        this.salesRateARef2.current?.focus();
      }, 1000);
    }
    // else if (parseFloat(salesRates) >= parseFloat(costing) === false) {
    //   MyNotifications.fire({
    //     show: true,
    //     icon: "confirm",
    //     title: "Confirm",
    //     msg: "Sales rate is less than Costing, do you want to continue?",
    //     is_timeout: false,
    //     handleSuccessFn: () => {
    //       setTimeout(() => {
    //         this.salesRateARef3.current?.focus();
    //       }, 1000);
    //     },
    //     handleFailFn: () => {

    //     }
    //   })
    // }
  };

  validateSalesRate3 = (
    mrp = 0,
    purchaseRate = 0,
    salesRates = 0,
    costing = 0,
    element,
    setFieldValue
  ) => {
    // console.log("costing_____", costing);
    if (
      parseFloat(costing) <= parseFloat(salesRates) &&
      parseFloat(salesRates) <= parseFloat(mrp)
    ) {
    } else {
      MyNotifications.fire({
        show: true,
        icon: "confirm",
        title: "Confirm",
        msg: "Sales rate is always between Costing and MRP, do you want to continue?",
        is_timeout: false,
        // delay: 1500,
        // is_button_show: true,
        handleSuccessFn: () => {
          setTimeout(() => {
            this.cessRef.current?.focus();
          }, 500);
        },
        handleFailFn: () => {
          setFieldValue(element, 0);
          setTimeout(() => {
            this.salesRateARef3.current?.focus();
          }, 500);
        },
      });
      // setFieldValue(element, 0);
      setTimeout(() => {
        this.taxbatchRef.current.setFieldValue("rate_c", "");
        this.salesRateARef3.current?.focus();
      }, 1000);
    }
  };

  batchSearchFun = (barcode) => {
    let filterData = this.props.batchData.filter((v) =>
      v.batch_no.includes(barcode.trim())
    );
    this.setState({ batchDataList: filterData != "" ? filterData : "" });
  };

  componentWillReceiveProps(prev) {
    this.setState({ batchDataList: this.props.batchData });
  }
  handleKeyDown = (e, index) => {
    if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index)?.focus();
    }
    if (e.keyCode === 37) {
      // const prevIndex = (index - 1) % this.inputRefs.length;
      // if (prevIndex === -1) {
      //   this.inputRefs[index].focus();
      // } else {
      //   this.inputRefs[prevIndex].focus();
      // }
    }
    if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index)?.focus();
    }
    if (e.altKey && e.keyCode === 67) {
      const index = "cancel";
      document.getElementById(index)?.focus();
    }
  };
  render() {
    let {
      costingMdl,
      costingInitVal,
      productModalStateChange,
      tr_id,
      transactionType,
    } = this.props;
    let { batchDataList } = this.state;
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
              // console.log(
              //   "values",
              //   values,
              //   rows[rowIndex]["rate"],
              //   rows[rowIndex]["rate_a"],
              //   rows[rowIndex]["rate_b"],
              //   rows[rowIndex]["rate_c"]
              // );
              let batchError = false;
              if (b_details_id != 0) {
                // console.log("bdetail===>", b_details_id);
                batchError = false;
                let salesrate = values.rate_a;
                let salesrate2 = values.rate_b;
                let salesrate3 = values.rate_c;
                // console.log(
                //   "salesrate_______",
                //   salesrate,
                //   salesrate2,
                //   salesrate3
                // );
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

                // rows[rowIndex]["rate"] = b_details_id.purchase_rate;
                rows[rowIndex]["sales_rate"] = salesrate;

                rows[rowIndex]["b_details_id"] = b_details_id.id;
                rows[rowIndex]["b_no"] = b_details_id.batch_no;
                rows[rowIndex]["b_rate"] = b_details_id.b_rate;

                rows[rowIndex]["rate_a"] = values.rate_a;
                // rows[rowIndex]["rate_b"] = b_details_id.min_rate_b;
                // rows[rowIndex]["rate_c"] = b_details_id.min_rate_c;
                rows[rowIndex]["rate_b"] = values.rate_b;
                rows[rowIndex]["rate_c"] = values.rate_c;
                rows[rowIndex]["margin_per"] = values.margin_per; //b_details_id.min_margin;
                if (
                  transactionType == "purchase_order" ||
                  transactionType == "purchase_invoice"
                ) {
                  rows[rowIndex]["b_purchase_rate"] = rows[rowIndex]["rate"];
                }

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
                rows[rowIndex]["costing"] = roundDigit(
                  values.costing,
                  configDecimalPlaces
                );
                rows[rowIndex]["costingWithTax"] = roundDigit(
                  values.costingWithTax,
                  configDecimalPlaces
                );

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
              <Form
                className=""
                onSubmit={handleSubmit}
                autoComplete="off"
                // onKeyDown={(e) => {
                //   if (e.keyCode == 13) {
                //     e.preventDefault();
                //   }
                // }}
              >
                <Modal.Body className="tnx-pur-inv-mdl-body p-0">
                  <div className="ledger_details_style ">
                    <Row className="mx-0">
                      <Col lg={3} md={3} sm={3} xs={3} className="tbl-color">
                        <Table className="colored_label mb-0 ">
                          <tbody style={{ borderBottom: "0px transparent" }}>
                            <tr>
                              <td>Name:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0">
                                  {values ? values.productName : ""}
                                </p>
                              </td>
                            </tr>

                            <tr>
                              <td>Costing:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0">
                                  {/* {values ? values.costing : ""}
                                   */}
                                  {isNaN(values.costing)
                                    ? INRformat.format(0)
                                    : INRformat.format(values.costing)}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col lg={3} md={3} sm={3} xs={3} className="tbl-color">
                        <Table className="colored_label mb-0">
                          <tbody style={{ borderBottom: "0px transparent" }}>
                            <tr>
                              <td>Batch:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0">
                                  {values ? values.b_no : ""}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>Costing with tax:</td>
                              <td>
                                <p className="colored_sub_text mb-0">
                                  {/* {values ? values.costingWithTax : ""} */}
                                  {isNaN(values.costingWithTax)
                                    ? INRformat.format(0)
                                    : INRformat.format(values.costingWithTax)}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col lg={3} md={3} sm={3} xs={3} className="tbl-color">
                        <Table className="colored_label mb-0 ">
                          <tbody style={{ borderBottom: "0px transparent" }}>
                            <tr>
                              <td>MRP:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0">
                                  {/* {values ? values.b_rate : ""} */}
                                  {isNaN(values.b_rate)
                                    ? INRformat.format(0)
                                    : INRformat.format(values.b_rate)}
                                </p>
                              </td>
                            </tr>

                            {/* <tr>
                              <td> Bill Date:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0"></p>
                              </td>
                            </tr> */}
                          </tbody>
                        </Table>
                      </Col>
                      <Col lg={3} md={3} sm={3} xs={3} className="tbl-color">
                        <Table className="colored_label mb-0 ">
                          <tbody style={{ borderBottom: "0px transparent" }}>
                            <tr>
                              <td>Purchase Rate:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0">
                                  {/* {values ? values.b_purchase_rate : ""} */}
                                  {isNaN(values.b_purchase_rate)
                                    ? INRformat.format(0)
                                    : INRformat.format(values.b_purchase_rate)}
                                </p>
                              </td>
                            </tr>

                            {/* <tr>
                              <td> Bill Date:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0"></p>
                              </td>
                            </tr> */}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </div>
                  <div
                    className="p-3"
                    style={{
                      background: "#E6F2F8",
                      borderBottom: "1px solid #dcdcdc",
                    }}
                  >
                    <Row className="">
                      <Col lg={2}>
                        <Row>
                          <Col lg={6}>
                            <Form.Label>Margin %</Form.Label>
                          </Col>
                          <Col lg={6}>
                            <Form.Group>
                              <Form.Control
                                autoComplete="off"
                                autoFocus={true}
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="%"
                                name="margin_per"
                                id="margin_per"
                                onChange={(e) => {
                                  e.preventDefault();
                                  if (
                                    e.target.value == 0 &&
                                    e.target.value == ""
                                  ) {
                                    setFieldValue("margin_per", "");
                                    setFieldValue("rate_a", "");
                                    setFieldValue("rate_b", "");
                                    setFieldValue("rate_c", "");
                                  } else {
                                    setFieldValue("margin_per", e.target.value);
                                    this.checkMargin(
                                      e.target.value,
                                      values.b_rate,
                                      values.b_purchase_rate,
                                      values.costing,
                                      "rate_a",
                                      setFieldValue
                                    );
                                  }
                                }}
                                value={values.margin_per}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                    this.handleKeyDown(e, "rate_a");
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={10}>
                        <Row>
                          <Col lg={4}>
                            <Row>
                              <Col lg={5}>
                                <Form.Label>Sales Rate 1</Form.Label>
                              </Col>
                              <Col lg={7}>
                                <Form.Group>
                                  <Form.Control
                                    innerRef={(input) => {
                                      this.salesRateARef.current = input;
                                    }}
                                    ref={this.salesRateARef}
                                    autoComplete="off"
                                    type="text"
                                    className="mdl-text-box-style"
                                    placeholder="0.00"
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
                                          values.costing,
                                          "rate_a",
                                          setFieldValue
                                        );
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault();
                                        if (values.rate_a > 0) {
                                          this.validateSalesRate(
                                            values.b_rate,
                                            values.b_purchase_rate,
                                            values.rate_a,
                                            values.costing,
                                            "rate_a",
                                            setFieldValue
                                          );
                                        } else {
                                          this.handleKeyDown(e, "rate_b");
                                        }
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4}>
                            <Row>
                              <Col lg={5}>
                                <Form.Label>Sales Rate 2</Form.Label>
                              </Col>
                              <Col lg={7}>
                                <Form.Group>
                                  <Form.Control
                                    innerRef={(input) => {
                                      this.salesRateARef2.current = input;
                                    }}
                                    ref={this.salesRateARef2}
                                    autoComplete="off"
                                    type="text"
                                    className="mdl-text-box-style"
                                    placeholder="0.00"
                                    name="rate_b"
                                    id="rate_b"
                                    onChange={handleChange}
                                    value={values.rate_b}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      if (values.rate_b > 0) {
                                        this.validateSalesRate2(
                                          values.b_rate,
                                          values.b_purchase_rate,
                                          values.rate_b,
                                          values.costing,
                                          "rate_b",
                                          setFieldValue
                                        );
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault();
                                        if (values.rate_b > 0) {
                                          this.validateSalesRate2(
                                            values.b_rate,
                                            values.b_purchase_rate,
                                            values.rate_b,
                                            values.costing,
                                            "rate_b",
                                            setFieldValue
                                          );
                                        } else this.handleKeyDown(e, "rate_c");
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4}>
                            <Row>
                              <Col lg={5}>
                                <Form.Label>Sales Rate 3</Form.Label>
                              </Col>
                              <Col lg={7}>
                                <Form.Group>
                                  <Form.Control
                                    innerRef={(input) => {
                                      this.salesRateARef3.current = input;
                                    }}
                                    ref={this.salesRateARef3}
                                    autoComplete="off"
                                    type="text"
                                    className="mdl-text-box-style"
                                    placeholder="0.00"
                                    name="rate_c"
                                    id="rate_c"
                                    onChange={handleChange}
                                    value={values.rate_c}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      if (values.rate_c > 0) {
                                        this.validateSalesRate3(
                                          values.b_rate,
                                          values.b_purchase_rate,
                                          values.rate_c,
                                          values.costing,
                                          "rate_c",
                                          setFieldValue
                                        );
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault();
                                        if (values.rate_c > 0) {
                                          this.validateSalesRate3(
                                            values.b_rate,
                                            values.b_purchase_rate,
                                            values.rate_c,
                                            values.costing,
                                            "rate_c",
                                            setFieldValue
                                          );
                                        } else
                                          this.handleKeyDown(e, "cess_field");
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col lg={2}>
                        <Row>
                          <Col lg={6}>
                            <Form.Label>Cess %</Form.Label>
                          </Col>
                          <Col lg={6}>
                            <Form.Group>
                              <Form.Control
                                ref={this.cessRef}
                                autoComplete="off"
                                type="text"
                                className="mdl-text-box-style"
                                placeholder="%"
                                id="cess_field"
                                // name="margin_per"
                                // id="margin_per"
                                // onChange={(e) => {
                                //   e.preventDefault();
                                //   setFieldValue("margin_per", e.target.value);
                                //   this.checkMargin(
                                //     e.target.value,
                                //     values.b_rate,
                                //     values.b_purchase_rate,
                                //     values.costing,
                                //     "rate_a",
                                //     setFieldValue
                                //   );
                                // }}
                                // value={values.margin_per}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                    this.handleKeyDown(e, "cess_amt");
                                  }
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={10}>
                        <Row>
                          <Col lg={4}>
                            <Row>
                              <Col lg={5}>
                                <Form.Label>Cess Amt.</Form.Label>
                              </Col>
                              <Col lg={7}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    className="mdl-text-box-style"
                                    placeholder="0.00"
                                    id="cess_amt"
                                    // name="rate_b"
                                    // id="rate_b"
                                    // onChange={handleChange}
                                    // value={values.rate_b}
                                    // onBlur={(e) => {
                                    //   e.preventDefault();
                                    //   if (values.rate_b > 0) {
                                    //     this.validateSalesRate(
                                    //       values.b_rate,
                                    //       values.b_purchase_rate,
                                    //       values.rate_b,
                                    //       values.costing,
                                    //       "rate_b",
                                    //       setFieldValue
                                    //     );
                                    //   }
                                    // }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault();
                                        this.handleKeyDown(e, "companybarcode");
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4}>
                            <Row>
                              <Col lg={5}>
                                <Form.Label>Barcode</Form.Label>
                              </Col>
                              <Col lg={7}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    className="mdl-text-box-style"
                                    placeholder="Barcode"
                                    name=""
                                    id="companybarcode"
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault();
                                        this.handleKeyDown(e, "submit");
                                      }
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="ps-2">
                      <Col lg={6}></Col>
                      <Col lg={6}>
                        <Row>
                          <Col md="12 p-2 pe-4" className="btn_align">
                            <Button
                              className="submit-btn"
                              type="submit"
                              id="submit"
                              // onKeyDown={(e) => {
                              //   if (e.keyCode == 13) {
                              //     this.taxbatchRef.current.handleSubmit();
                              //   }
                              // }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.taxbatchRef.current.handleSubmit();
                                }
                              }}
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary cancel-btn ms-2"
                              type="button"
                              id="cancel"
                              onClick={(e) => {
                                e.preventDefault();
                                productModalStateChange(
                                  {
                                    costingMdl: false,
                                    rowIndex: -1,
                                    b_details_id: 0,
                                  },
                                  true
                                );
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  productModalStateChange(
                                    {
                                      costingMdl: false,
                                      rowIndex: -1,
                                      b_details_id: 0,
                                    },
                                    true
                                  );
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    );
  }
}
