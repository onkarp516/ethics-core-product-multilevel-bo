import React, { Component } from "react";
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
import { Formik } from "formik";
import * as Yup from "yup";
import {
  MyTextDatePicker,
  getSelectValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  TRAN_NO,
  purchaseSelect,
  isActionExist,
  fnTranxCalculation,
  fnTranxCalculationTaxRoundOff,
  getValue,
  isUserControl,
  calculatePercentage,
  isFreeQtyExist,
  isMultiDiscountExist,
  getUserControlLevel,
  getUserControlData,
  isUserControlExist,
  unitDD,
  flavourDD,
  OnlyEnterNumbers,
  allEqual,
} from "@/helpers";
import moment from "moment";
import search from "@/assets/images/search_icon@3x.png";

import { transaction_batch_details } from "@/services/api_functions";

export default class MdlBatchNo extends Component {
  constructor(props) {
    super(props);
    this.state = { batchDetails: "", batchDataList: "", errorArrayBorder: "" };
    this.mfgDateRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.formRef = React.createRef();
  }
  transaction_batch_detailsFun = (batchNo = 0) => {
    let requestData = new FormData();

    requestData.append("batchNo", batchNo.batch_no);
    requestData.append("id", batchNo.id);
    transaction_batch_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            batchDetails: res.response,
            filterbatchDetails: res.response,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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

  handleTableRow(event) {
    const t = event.target;
    // console.warn('current ->>>>>>>>>>', t)
    let {
      productModalStateChange,
      get_supplierlist_by_productidFun,
      rows,
      rowIndex,
      getProductPackageLst,
      transactionType,
      values,
      isBatch,
    } = this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));

        console.warn("da->>>>>>>>>>>>>>>>>>down", val.id);

        productModalStateChange({
          batch_data_selected: val,
          b_details_id: val,
          // tr_id: i + 1,
          is_expired: val.is_expired,
        });
        this.transaction_batch_detailsFun(val);
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', da)

        productModalStateChange({
          batch_data_selected: val,
          b_details_id: val,
          // tr_id: i + 1,
          is_expired: val.is_expired,
        });
        this.transaction_batch_detailsFun(val);
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let batch_data_selected = JSON.parse(
          cuurentProduct.getAttribute("value")
        );
        // console.warn("batch_data_selected->>>>>>>>>>>>", batch_data_selected);
        // console.warn("this.formRef.current.values->>>>>>>>>>>>", this.formRef.current.values);

        let values = this.formRef.current.values;

        let { rows, rowIndex, selectedSupplier } = this.props;

        let batchError = false;

        if (batch_data_selected) {
          batchError = false;
          let salesrate = batch_data_selected.min_rate_a;

          if (selectedSupplier && parseInt(selectedSupplier.salesRate) == 2) {
            salesrate = batch_data_selected.min_rate_b;
          } else if (
            selectedSupplier &&
            parseInt(selectedSupplier.salesRate) == 3
          ) {
            salesrate = batch_data_selected.min_rate_c;
          }
          if (
            transactionType == "sales_invoice" ||
            transactionType == "sales_edit"
          ) {
            rows[rowIndex]["rate"] = salesrate;
            rows[rowIndex]["sales_rate"] = salesrate;
          } else {
            rows[rowIndex]["rate"] = batch_data_selected.purchase_rate;
            rows[rowIndex]["sales_rate"] = salesrate;
          }

          rows[rowIndex]["b_details_id"] = batch_data_selected.id;
          rows[rowIndex]["b_no"] = batch_data_selected.batch_no;
          rows[rowIndex]["b_rate"] = batch_data_selected.b_rate;

          rows[rowIndex]["rate_a"] = batch_data_selected.min_rate_a;
          rows[rowIndex]["rate_b"] = batch_data_selected.min_rate_b;
          rows[rowIndex]["rate_c"] = batch_data_selected.min_rate_c;
          rows[rowIndex]["margin_per"] = batch_data_selected.min_margin;
          rows[rowIndex]["b_purchase_rate"] = batch_data_selected.purchase_rate;
          rows[rowIndex]["costing"] = values.costing;
          rows[rowIndex]["costingWithTax"] = values.costingWithTax;

          rows[rowIndex]["b_expiry"] =
            batch_data_selected.expiry_date != ""
              ? batch_data_selected.expiry_date
              : "";

          rows[rowIndex]["manufacturing_date"] =
            batch_data_selected.manufacturing_date != ""
              ? batch_data_selected.manufacturing_date
              : "";

          rows[rowIndex]["is_batch"] = isBatch;
        } else {
          let salesrate = values.rate_a;

          if (selectedSupplier && parseInt(selectedSupplier.salesRate) == 2) {
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
          rows[rowIndex]["b_no"] =
            parseInt(values.b_no) != 0 ? values.b_no : "";
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
                    moment(values.manufacturing_date, "DD/MM/YYYY").toDate()
                  )
                ).format("YYYY-MM-DD")
              : "";

          rows[rowIndex]["is_batch"] = isBatch;
        }
        productModalStateChange(
          {
            batch_error: batchError,
            newBatchModal: false,
            rowIndex: -1,
            b_details_id: 0,
            isBatch: isBatch,
            rows: rows,
          },
          true
        );
      }
      // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
    }
  }
  setErrorBorder(index, value) {
    let { errorArrayBorder } = this.state;
    let errorArrayData = [];
    if (errorArrayBorder.length > 0) {
      errorArrayData = errorArrayBorder;
      if (errorArrayBorder.length >= index) {
        errorArrayData.splice(index, 1, value);
      } else {
        Array.from(Array(index), (v) => {
          errorArrayData.push(value);
        });
      }
    } else {
      {
        Array.from(Array(index + 1), (v) => {
          errorArrayData.push(value);
        });
      }
    }

    this.setState({ errorArrayBorder: errorArrayData });
  }

  render() {
    let {
      newBatchModal,
      batchInitVal,
      isBatch,
      batchData,
      is_expired,
      tr_id,
      productModalStateChange,
      transactionType,
      saleRateType,
    } = this.props;
    let { batchDetails, batchDataList, errorArrayBorder } = this.state;
    return (
      <div>
        <Modal
          show={newBatchModal}
          // size={
          //   window.matchMedia("(min-width:1360px) and (max-width:1919px)")
          //     .matches
          //     ? "lg"
          //     : "xl"
          // }
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="tnx-pur-inv-mdl-product"
          centered
          onHide={() => {
            productModalStateChange({
              newBatchModal: false,
              rowIndex: -1,
              tr_id: "",
              is_expired: false,
            });
          }}
        >
          {" "}
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Batch
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                productModalStateChange({
                  newBatchModal: false,
                  rowIndex: -1,
                  tr_id: "",
                  is_expired: false,
                });
              }}
            />
          </Modal.Header>
          <Formik
            innerRef={this.formRef}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={batchInitVal}
            // validationSchema={Yup.object().shape({})}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let errorArray = [];
              if (values.b_no == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              // validation end

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  let {
                    rows,
                    rowIndex,
                    b_details_id,
                    is_expired,
                    selectedSupplier,
                  } = this.props;

                  let batchError = false;

                  if (b_details_id != 0) {
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
                    if (
                      saleRateType == "sale" ||
                      transactionType == "sales_invoice" ||
                      transactionType == "sales_edit"
                    ) {
                      rows[rowIndex]["rate"] = salesrate;
                      rows[rowIndex]["sales_rate"] = salesrate;
                    } else {
                      rows[rowIndex]["rate"] = b_details_id.purchase_rate;
                      rows[rowIndex]["sales_rate"] = salesrate;
                    }

                    rows[rowIndex]["b_details_id"] = b_details_id.id;
                    rows[rowIndex]["b_no"] = b_details_id.batch_no;
                    rows[rowIndex]["b_rate"] = b_details_id.b_rate;

                    rows[rowIndex]["rate_a"] = b_details_id.min_rate_a;
                    rows[rowIndex]["rate_b"] = b_details_id.min_rate_b;
                    rows[rowIndex]["rate_c"] = b_details_id.min_rate_c;
                    rows[rowIndex]["margin_per"] = b_details_id.min_margin;
                    rows[rowIndex]["b_purchase_rate"] =
                      b_details_id.purchase_rate;
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
                    rows[rowIndex]["b_no"] =
                      parseInt(values.b_no) != 0 ? values.b_no : "";
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
                            new Date(
                              moment(values.b_expiry, "DD/MM/YYYY").toDate()
                            )
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
                  //   this.setState(
                  //     {
                  //       batch_error: batchError,
                  //       newBatchModal: false,
                  //       rowIndex: -1,
                  //       b_details_id: 0,
                  //       isBatch: isBatch,
                  //       // rows: rows,
                  //     },
                  //     () => {
                  //       this.handleRowStateChange(rows);
                  //     }
                  //   );
                  productModalStateChange(
                    {
                      batch_error: batchError,
                      newBatchModal: false,
                      rowIndex: -1,
                      b_details_id: 0,
                      isBatch: isBatch,
                      rows: rows,
                    },
                    true
                  );
                }
              });
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
                {/* {JSON.stringify(b_details_id)}
                  {JSON.stringify(rowIndex)} */}
                <Modal.Body className="tnx-pur-inv-mdl-body p-0">
                  {transactionType == "sales_invoice" ? (
                    <></>
                  ) : (
                    <div
                      style={{
                        background: "#E6F2F8",
                        borderBottom: "1px solid #dcdcdc",
                      }}
                      className="p-3"
                    >
                      <Row className="justify-content-center pb-2">
                        <Col lg={5}>
                          <Row className="justify-content-center">
                            <Col
                              lg={12}
                              className="d-flex justify-content-center"
                            >
                              <Form.Label className="mdl-title-name text-end">
                                Product :{" "}
                              </Form.Label>
                              {/* </Col>
                            <Col lg={7}> */}
                              <Form.Label className="mdl-title-name">
                                {batchDataList && batchDataList[0].product_name}
                              </Form.Label>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <Row className="">
                        <Col lg={3}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>Batch No.</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  autoFocus
                                  autoComplete="off"
                                  type="text"
                                  // className="mdl-text-box-style"
                                  placeholder="Batch No"
                                  name="b_no"
                                  id="b_no"
                                  onChange={handleChange}
                                  value={values.b_no}
                                  // onKeyDown={(e) => {
                                  //   if (e.key === "Tab") {
                                  //     if (parseInt(values.b_no) == 0) {
                                  //       MyNotifications.fire({
                                  //         show: true,
                                  //         icon: "error",
                                  //         title: "Error",
                                  //         msg: "Batch No. Should not be Zero.",
                                  //         is_button_show: true,
                                  //       });
                                  //       setFieldValue("b_no", "");
                                  //       e.preventDefault();
                                  //     }
                                  //   }
                                  // }}
                                  className={`${
                                    values.b_no == "" &&
                                    errorArrayBorder[0] == "Y"
                                      ? "border border-danger mdl-text-box-style"
                                      : "mdl-text-box-style"
                                  }`}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={3}>
                          <Row>
                            <Col lg={5}>
                              <Form.Label>MFG Date</Form.Label>
                            </Col>
                            <Col lg={7}>
                              <MyTextDatePicker
                                className="mdl-text-box-style"
                                innerRef={(input) => {
                                  this.mfgDateRef.current = input;
                                }}
                                autoComplete="off"
                                name="manufacturing_date"
                                id="manufacturing_date"
                                placeholder="DD/MM/YYYY"
                                value={values.manufacturing_date}
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.key === "Tab") {
                                    let datchco = e.target.value.trim();
                                    console.log("datchco", datchco);
                                    let checkdate = moment(
                                      e.target.value
                                    ).format("DD/MM/YYYY");
                                    console.log("checkdate", checkdate);
                                    if (
                                      datchco != "__/__/____" &&
                                      // checkdate == "Invalid date"
                                      datchco.includes("_")
                                    ) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Please Enter Correct Date. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        this.mfgDateRef.current.focus();
                                      }, 1000);
                                    }
                                  } else if (e.key === "Tab") {
                                    let datchco = e.target.value.trim();
                                    console.log("datchco", datchco);
                                    let checkdate = moment(
                                      e.target.value
                                    ).format("DD/MM/YYYY");
                                    console.log("checkdate", checkdate);
                                    if (
                                      datchco != "__/__/____" &&
                                      // checkdate == "Invalid date"
                                      datchco.includes("_")
                                    ) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Please Enter Correct Date. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        this.mfgDateRef.current.focus();
                                      }, 1000);
                                    }
                                  }
                                }}
                                onBlur={(e) => {
                                  //console.log("e ", e);
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      let curdate = new Date();

                                      let mfgDate = new Date(
                                        moment(
                                          e.target.value,
                                          "DD/MM/YYYY"
                                        ).toDate()
                                      );
                                      let curdatetime = curdate.getTime();
                                      let mfgDateTime = mfgDate.getTime();
                                      if (curdatetime >= mfgDateTime) {
                                        setFieldValue(
                                          "manufacturing_date",
                                          e.target.value
                                        );
                                        // this.checkInvoiceDateIsBetweenFYFun(
                                        //   e.target.value
                                        // );
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Mfg Date Should not be Greater than todays date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        // setFieldValue("manufacturing_date", "");
                                        setTimeout(() => {
                                          this.mfgDateRef.current.focus();
                                        }, 1000);
                                      }
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid date",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        this.mfgDateRef.current.focus();
                                      }, 1000);
                                      // setFieldValue("manufacturing_date", "");
                                    }
                                  } else {
                                    // setFieldValue("manufacturing_date", "");
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={3}>
                          <Row>
                            <Col lg={5}>
                              <Form.Label>Expiry Date</Form.Label>
                            </Col>
                            <Col lg={7}>
                              <MyTextDatePicker
                                className="mdl-text-box-style"
                                innerRef={(input) => {
                                  this.batchdpRef.current = input;
                                }}
                                autoComplete="off"
                                name="b_expiry"
                                id="b_expiry"
                                placeholder="DD/MM/YYYY"
                                value={values.b_expiry}
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.key === "Tab") {
                                    let datchco = e.target.value.trim();
                                    console.log("datchco", datchco);
                                    let checkdate = moment(
                                      e.target.value
                                    ).format("DD/MM/YYYY");
                                    console.log("checkdate", checkdate);
                                    if (
                                      datchco != "__/__/____" &&
                                      // checkdate == "Invalid date"
                                      datchco.includes("_")
                                    ) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Please Enter Correct Date. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        this.batchdpRef.current.focus();
                                      }, 1000);
                                    }
                                  } else if (e.key === "Tab") {
                                    let datchco = e.target.value.trim();
                                    console.log("datchco", datchco);
                                    let checkdate = moment(
                                      e.target.value
                                    ).format("DD/MM/YYYY");
                                    console.log("checkdate", checkdate);
                                    if (
                                      datchco != "__/__/____" &&
                                      // checkdate == "Invalid date"
                                      datchco.includes("_")
                                    ) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Please Enter Correct Date. ",
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        this.batchdpRef.current.focus();
                                      }, 1000);
                                    }
                                  }
                                }}
                                onBlur={(e) => {
                                  //console.log("e ", e);

                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      let mfgDate = "";
                                      if (values.manufacturing_date != "") {
                                        mfgDate = new Date(
                                          moment(
                                            values.manufacturing_date,
                                            " DD-MM-yyyy"
                                          ).toDate()
                                        );
                                        let currentDate = new Date();
                                        let curDate = new Date(
                                          moment(
                                            e.target.value,
                                            " DD-MM-yyyy"
                                          ).toDate()
                                        );
                                        let curdatetime = currentDate.getTime();
                                        let curdatet = curDate.getTime();
                                        let expDate = new Date(
                                          moment(
                                            e.target.value,
                                            "DD/MM/YYYY"
                                          ).toDate()
                                        );
                                        if (
                                          mfgDate.getTime() <
                                            expDate.getTime() &&
                                          curdatetime < curdatet
                                        ) {
                                          setFieldValue(
                                            "b_expiry",
                                            e.target.value
                                          );
                                          // this.checkInvoiceDateIsBetweenFYFun(
                                          //   e.target.value
                                          // );
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Expiry date should be greater MFG date / Current Date",
                                            // is_button_show: true,
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          // setFieldValue("b_expiry", "");
                                          setTimeout(() => {
                                            this.batchdpRef.current.focus();
                                          }, 1000);
                                        }
                                        // }else{

                                        //   MyNotifications.fire({
                                        //     show: true,
                                        //     icon: "error",
                                        //     title: "Error",
                                        //     msg: "Expiry date should be greater current date",
                                        //     is_button_show: true,
                                        //   });
                                        //   setFieldValue("b_expiry", "");
                                        //   this.batchdpRef.current.focus();   //console.log("expirt date is not greater than today")
                                        // }
                                      } else if (
                                        values.manufacturing_date == ""
                                      ) {
                                        let currentDate = new Date();
                                        let curDate = new Date(
                                          moment(
                                            e.target.value,
                                            " DD-MM-yyyy"
                                          ).toDate()
                                        );
                                        let curdatetime = currentDate.getTime();
                                        let curdatet = curDate.getTime();
                                        console.log("curdatetime", curdatetime);
                                        if (curdatetime < curdatet) {
                                          console.log(
                                            "curdatetime < curdatet",
                                            curdatetime < curdatet
                                          );
                                          setFieldValue(
                                            "b_expiry",
                                            e.target.value
                                          );
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Expiry date should be greater current date",
                                            // is_button_show: true,
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          // setFieldValue("b_expiry", "");
                                          setTimeout(() => {
                                            this.batchdpRef.current.focus();
                                          }, 1000);
                                        }
                                      } else {
                                        setFieldValue(
                                          "b_expiry",
                                          e.target.value
                                        );
                                      }
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid date",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      setTimeout(() => {
                                        this.batchdpRef.current.focus();
                                      }, 1000);
                                      // setFieldValue("b_expiry", "");
                                    }
                                  } else {
                                    // setFieldValue("b_expiry", "");
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={3}>
                          <Row>
                            <Col lg={4}>
                              <Form.Label>MRP</Form.Label>
                            </Col>
                            <Col lg={8}>
                              <Form.Group>
                                <Form.Control
                                  autoComplete="off"
                                  type="text"
                                  placeholder="MRP"
                                  name="b_rate"
                                  id="b_rate"
                                  className="mdl-text-box-style"
                                  onChange={handleChange}
                                  value={values.b_rate}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  )}
                  <div>
                    <Row className="ps-2">
                      <Col lg={6}>
                        <InputGroup className="my-2 mdl-text">
                          <Form.Control
                            autoComplete="off"
                            // autoFocus="true"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="basic-addon1"
                            className="mdl-text-box"
                            onChange={(e) => {
                              this.batchSearchFun(e.target.value);
                            }}
                            disabled={
                              values.b_no == 0 && values.b_no == ""
                                ? false
                                : true
                            }
                          />
                          <InputGroup.Text
                            className="int-grp"
                            id="basic-addon1"
                          >
                            <img className="srch_box" src={search} alt="" />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>
                      <Col lg={6}>
                        <Row>
                          <Col md="12 p-3" className="btn_align">
                            <Button
                              className="submit-btn successbtn-style"
                              type="submit"
                              disabled={
                                values.b_no == 0 && values.b_no == ""
                                  ? true
                                  : false
                              }
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary cancel-btn ms-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                productModalStateChange({
                                  newBatchModal: false,
                                  rowIndex: -1,
                                  tr_id: "",
                                  is_expired: false,
                                });
                              }}
                              disabled={
                                values.b_no == 0 && values.b_no == ""
                                  ? true
                                  : false
                              }
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>

                  <div
                    className="tnx-pur-inv-ModalStyle"
                    style={{ height: "30vh" }}
                  >
                    <Table>
                      <thead>
                        <tr>
                          <th>Batch</th>
                          <th>Current Stock</th>
                          <th>MRP</th>
                          <th>Purchase Rate</th>
                          <th>Sale Rate</th>

                          <th>Net Rate</th>
                          <th>Sale Rate with tax</th>
                          <th>MFG Date</th>
                          <th>Expiry</th>
                        </tr>
                      </thead>
                      <tbody
                        className="prouctTableTr"
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (e.keyCode != 9) {
                            this.handleTableRow(e);
                          }
                        }}
                      >
                        {batchDataList &&
                          batchDataList.length > 0 &&
                          batchDataList.map((v, i) => {
                            return (
                              <tr
                                value={JSON.stringify(v)}
                                id={`productTr_` + i}
                                prId={v.id}
                                tabIndex={i}
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({ batch_data_selected: v });
                                  this.setState(
                                    {
                                      b_details_id: v,
                                      tr_id: i + 1,
                                      is_expired: v.is_expired,
                                    },
                                    () => {
                                      this.transaction_batch_detailsFun(v);
                                    }
                                  );
                                  productModalStateChange({
                                    batch_data_selected: v,
                                    b_details_id: v,
                                    tr_id: i + 1,
                                    is_expired: v.is_expired,
                                  });
                                  this.transaction_batch_detailsFun(v);
                                }}
                                className={`${
                                  is_expired != true
                                    ? tr_id == i + 1
                                      ? "tr-color"
                                      : ""
                                    : ""
                                }`}
                                onDoubleClick={(e) => {
                                  e.preventDefault();
                                  let {
                                    rows,
                                    rowIndex,
                                    b_details_id,
                                    is_expired,
                                    selectedSupplier,
                                  } = this.props;

                                  let batchError = false;

                                  if (b_details_id != 0) {
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
                                    if (
                                      saleRateType == "sale" ||
                                      transactionType == "sales_invoice" ||
                                      transactionType == "sales_edit"
                                    ) {
                                      rows[rowIndex]["rate"] = salesrate;
                                      rows[rowIndex]["sales_rate"] = salesrate;
                                    } else {
                                      rows[rowIndex]["rate"] =
                                        b_details_id.purchase_rate;
                                      rows[rowIndex]["sales_rate"] = salesrate;
                                    }

                                    rows[rowIndex]["b_details_id"] =
                                      b_details_id.id;
                                    rows[rowIndex]["b_no"] =
                                      b_details_id.batch_no;
                                    rows[rowIndex]["b_rate"] =
                                      b_details_id.b_rate;

                                    rows[rowIndex]["rate_a"] =
                                      b_details_id.min_rate_a;
                                    rows[rowIndex]["rate_b"] =
                                      b_details_id.min_rate_b;
                                    rows[rowIndex]["rate_c"] =
                                      b_details_id.min_rate_c;
                                    rows[rowIndex]["margin_per"] =
                                      b_details_id.min_margin;
                                    rows[rowIndex]["b_purchase_rate"] =
                                      b_details_id.purchase_rate;
                                    rows[rowIndex]["costing"] = values.costing;
                                    rows[rowIndex]["costingWithTax"] =
                                      values.costingWithTax;

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

                                    rows[rowIndex]["rate"] =
                                      values.b_purchase_rate;
                                    rows[rowIndex]["sales_rate"] = salesrate;
                                    rows[rowIndex]["b_details_id"] =
                                      values.b_details_id;
                                    rows[rowIndex]["b_no"] =
                                      parseInt(values.b_no) != 0
                                        ? values.b_no
                                        : "";
                                    rows[rowIndex]["b_rate"] = values.b_rate;
                                    rows[rowIndex]["rate_a"] = values.rate_a;
                                    rows[rowIndex]["rate_b"] = values.rate_b;
                                    rows[rowIndex]["rate_c"] = values.rate_c;
                                    rows[rowIndex]["margin_per"] =
                                      values.margin_per;
                                    rows[rowIndex]["b_purchase_rate"] =
                                      values.b_purchase_rate;
                                    rows[rowIndex]["costing"] = values.costing;
                                    rows[rowIndex]["costingWithTax"] =
                                      values.costingWithTax;

                                    rows[rowIndex]["b_expiry"] =
                                      values.b_expiry != ""
                                        ? moment(
                                            new Date(
                                              moment(
                                                values.b_expiry,
                                                "DD/MM/YYYY"
                                              ).toDate()
                                            )
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
                                  //   this.setState(
                                  //     {
                                  //       batch_error: batchError,
                                  //       newBatchModal: false,
                                  //       rowIndex: -1,
                                  //       b_details_id: 0,
                                  //       isBatch: isBatch,
                                  //       // rows: rows,
                                  //     },
                                  //     () => {
                                  //       this.handleRowStateChange(rows);
                                  //     }
                                  //   );
                                  productModalStateChange(
                                    {
                                      batch_error: batchError,
                                      newBatchModal: false,
                                      rowIndex: -1,
                                      b_details_id: 0,
                                      isBatch: isBatch,
                                      rows: rows,
                                    },
                                    true
                                  );
                                }}
                              >
                                <td>{v.batch_no}</td>
                                <td>{v.closing_stock}</td>
                                <td>{v.mrp}</td>
                                <td>{v.purchase_rate}</td>
                                <td>{v.sales_rate}</td>

                                <td>
                                  {v.net_rate
                                    ? parseFloat(v.net_rate).toFixed(2)
                                    : ""}
                                </td>
                                <td>
                                  {v.sales_rate_with_tax
                                    ? parseFloat(v.sales_rate_with_tax).toFixed(
                                        2
                                      )
                                    : ""}
                                </td>
                                <td>{v.manufacturing_date}</td>
                                <td>
                                  {v.expiry_date}
                                  {v.is_expired}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                  {/* <div className=" mt-5">
                      <Row className="mx-1">
                        <Col lg={6} className="tbl-color">
                          <Row>
                            <Col lg={4}>
                              <Form.Label className="colored_label">
                                Supplier:
                              </Form.Label>
                            </Col>
                            <Col lg={8} className="sub_col_style">
                              <p className="colored_sub_text">
                                {batchDetails != ""
                                  ? batchDetails.supplierName
                                  : ""}
                              </p>
                            </Col>
                            <Col lg={4}>
                              <Form.Label className="colored_label">
                                Bill No.:
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <p className="colored_sub_text">
                                {batchDetails != "" ? batchDetails.billNo : ""}
                              </p>
                            </Col>
                            <Col lg={4}>
                              <Form.Label className="colored_label">
                                Bill Date:
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <p className="colored_sub_text">
                                {batchDetails != ""
                                  ? batchDetails.billDate
                                  : ""}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6} className="tbl-color">
                          <Row>
                            <Col lg={4}>
                              <Form.Label className="colored_label">
                                Margin %:
                              </Form.Label>
                            </Col>
                            <Col lg={8}>
                              <p className="colored_sub_text">
                                {batchDetails != ""
                                  ? batchDetails.minMargin
                                  : ""}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div> */}
                  <div className="ledger_details_style mb-3">
                    <Row className="mx-1">
                      <Col lg={6} md={6} sm={6} xs={6} className="tbl-color">
                        <Table className="colored_label mb-0 ">
                          <tbody style={{ borderBottom: "0px transparent" }}>
                            <tr>
                              <td>Supplier:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0">
                                  {batchDetails != ""
                                    ? batchDetails.supplierName
                                    : ""}
                                </p>
                              </td>
                            </tr>

                            <tr>
                              <td> Bill Date:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0">
                                  {batchDetails != ""
                                    ? batchDetails.billDate
                                    : ""}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col lg={6} md={6} sm={6} xs={6} className="tbl-color">
                        <Table className="colored_label mb-0">
                          <tbody style={{ borderBottom: "0px transparent" }}>
                            <tr>
                              <td> Margin %:</td>
                              <td>
                                {" "}
                                <p className="colored_sub_text mb-0">
                                  {batchDetails != ""
                                    ? batchDetails.minMargin
                                    : ""}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>Bill No.:</td>
                              <td>
                                <p className="colored_sub_text mb-0">
                                  {batchDetails != ""
                                    ? batchDetails.billNo
                                    : ""}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
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
