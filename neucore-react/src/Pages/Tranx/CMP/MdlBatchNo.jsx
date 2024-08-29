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
import Frame from "@/assets/images/Frame.png";
import rightCheckMark from "@/assets/images/checkmark_icon.png";
import wrongCheckMark from "@/assets/images/close_crossmark_icon.png";
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
  INRformat,
} from "@/helpers";
import moment from "moment";
import search from "@/assets/images/search_icon@3x.png";

import {
  transaction_batch_details,
  createBatchDetails,
  editBatchDetails,
} from "@/services/api_functions";

export default class MdlBatchNo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchDetails: "",
      batchDataList: "",
      errorArrayBorder: "",
      ismodify: false,
      modifyIndex: -1,
      modifyObj: "",

      new_batch: false,
    };
    this.mfgDateRef = React.createRef();
    this.edtmfgDateRef = React.createRef();
    this.edtbatchdpRef = React.createRef();
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
    // debugger;
    let filterData = this.props.batchDataList.filter((v) =>
      v.batch_no.includes(barcode.trim())
    );
    this.setState({ batchDataList: filterData != "" ? filterData : "" });
  };

  componentWillReceiveProps(next, state) {
    if (next.newBatchModal == false) {
      this.setState({ ismodify: false, modifyIndex: -1 });
    }
    // console.log("MDLBatchNO this.props ==-> ", this.props);
    // console.log("MDLBatchNO Next", next);
    // console.log("MDLBatchNO state", state);
    this.setState({ batchDataList: this.props.batchData }, () => {
      if (this.props.batchInitVal != "") {
        this.setSelectedTR(this.props);
      }
    });
  }
  setSelectedTR = (next) => {
    let {
      batchInitVal,
      batchData,
      batch_data_selected,
      tr_id,
      productModalStateChange,
    } = next;
    if (batchInitVal != "" && (batch_data_selected == "" || tr_id == "")) {
      let data_v = batchData.find(
        (v) => parseInt(v.id) == parseInt(batchInitVal.b_details_id)
      );

      if (data_v) {
        let data_i = batchData.findIndex(
          (v) => parseInt(v.id) == parseInt(batchInitVal.b_details_id)
        );

        productModalStateChange({
          batch_data_selected: data_v,
          b_details_id: data_v,
          tr_id: data_i + 1,
          is_expired: data_v.is_expired,
        });
        this.transaction_batch_detailsFun(data_v);
      }
    }
    // console.log("set TR id MDLBatchNO this.props ==-> ", this.props);
  };
  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
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

        // console.warn("da->>>>>>>>>>>>>>>>>>down", val.id);

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

  handleModifyEnable = (i, v) => {
    console.log("modify value", i, v);
    this.setState({ ismodify: true, modifyIndex: i, modifyObj: { ...v } });
  };

  handleModifyElement = (ele, val) => {
    let { modifyObj } = this.state;
    modifyObj[ele] = val;
    this.setState({ modifyObj: modifyObj });
  };

  clearModifyData = () => {
    this.setState({ ismodify: false, modifyIndex: -1, modifyObj: "" });
  };

  updateBatchData = () => {
    let { modifyObj } = this.state;
    let { rows, rowIndex, selectedSupplier, getProductBatchList } = this.props;
    let requestData = new FormData();

    let obj = rows[rowIndex];

    if (obj) {
      modifyObj["product_id"] = obj.selectedProduct.id;
      modifyObj["level_a_id"] = obj.levelaId?.value;
      modifyObj["level_b_id"] = obj.levelbId?.value;
      modifyObj["level_c_id"] = obj.levelcId?.value;
      modifyObj["unit_id"] = obj.unitId?.value;
    }

    modifyObj["manufacturing_date"] =
      modifyObj["manufacturing_date"] != ""
        ? moment(modifyObj["manufacturing_date"], "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        )
        : "";
    modifyObj["b_expiry"] =
      modifyObj["expiry_date"] != ""
        ? moment(modifyObj["expiry_date"], "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    modifyObj["mrp"] = modifyObj["mrp"] != "" ? modifyObj["mrp"] : 0;

    // console.log("after =->", modifyObj);
    requestData.append("product_id", modifyObj["product_id"]);
    requestData.append("level_a_id", modifyObj["level_a_id"]);
    requestData.append("level_b_id", modifyObj["level_b_id"]);
    requestData.append("level_c_id", modifyObj["level_c_id"]);
    requestData.append("unit_id", modifyObj["unit_id"]);
    requestData.append("manufacturing_date", modifyObj["manufacturing_date"]);
    requestData.append("b_expiry", modifyObj["b_expiry"]);
    requestData.append("mrp", modifyObj["mrp"]);
    requestData.append("supplier_id", selectedSupplier.id);
    requestData.append("b_no", modifyObj["batch_no"]);
    requestData.append("b_details_id", modifyObj["id"]);
    // requestData.append("")
    //! console.log("After values", JSON.stringify(values));
    // for (const pair of requestData.entries()) {
    //   console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    // }
    editBatchDetails(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });

          this.setState(
            { modifyObj: "", modifyIndex: -1, ismodify: false },
            () => {
              getProductBatchList(rowIndex);
            }
          );
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  render() {
    let {
      newBatchModal,
      isBatch,
      is_expired,
      tr_id,
      productModalStateChange,
      transactionType,
      saleRateType,
    } = this.props;
    let {
      batchDetails,
      batchDataList,
      errorArrayBorder,
      ismodify,
      modifyIndex,
      modifyObj,
      new_batch,
    } = this.state;
    return (
      <div>
        <Modal
          show={newBatchModal}
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
          <Modal.Header
            className="pl-1 pr-1 pt-0 pb-0 mdl"
          // style={{ borderBottom: "1px solid #AEBAC7" }}
          >
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
          <Modal.Body className="tnx-pur-inv-mdl-body p-0">
            <div
              style={{
                background: "#F8F0D2",
                borderBottom: "1px solid #dcdcdc",
              }}
            >
              <div className="ledger_details_style ">
                <Row className="mx-0">
                  <Col lg={6} md={6} sm={6} xs={6} className="tbl-color">
                    <Table className="colored_label mb-0 ">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td style={{ width: "20%" }}>Name:</td>
                          <td>
                            {/* {JSON.stringify(tr_id)}
                            {JSON.stringify(is_expired)} */}
                            <p className="colored_sub_text mb-0">
                              {batchDataList && batchDataList[0]?.product_name}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "20%" }}>Supplier:</td>
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
                          <td style={{ width: "20%" }}> Bill Date:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {batchDetails != "" ? batchDetails.billDate : ""}
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
                          <td style={{ width: "20%" }}> Margin %:</td>
                          <td>
                            {" "}
                            <p className="colored_sub_text mb-0">
                              {batchDetails != "" ? batchDetails.minMargin : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "20%" }}>Bill No.:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {batchDetails != "" ? batchDetails.billNo : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </div>
            <Formik
              innerRef={this.formRef}
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={{
                product_id: "",
                b_no: "",
                b_expiry: "",
                manufacturing_date: "",
                level_a_id: "",
                level_b_id: "",
                level_c_id: "",
                unit_id: "",
                mrp: "",
              }}
              validationSchema={Yup.object().shape({
                b_no: Yup.string().required("Please Enter batch No"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // console.log("Before values =-> ", values);
                let { rows, rowIndex, selectedSupplier, getProductBatchList } =
                  this.props;
                let requestData = new FormData();

                let obj = rows[rowIndex];

                if (obj) {
                  values["product_id"] = obj.selectedProduct.id;
                  values["level_a_id"] = obj.levelaId?.value;
                  values["level_b_id"] = obj.levelbId?.value;
                  values["level_c_id"] = obj.levelcId?.value;
                  values["unit_id"] = obj.unitId?.value;
                }

                values["manufacturing_date"] =
                  values["manufacturing_date"] != ""
                    ? moment(values["manufacturing_date"], "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )
                    : "";
                values["b_expiry"] =
                  values["b_expiry"] != ""
                    ? moment(values["b_expiry"], "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )
                    : "";
                values["mrp"] = values["mrp"] != "" ? values["mrp"] : 0;

                // console.log("after =->", values);
                requestData.append("product_id", values["product_id"]);
                requestData.append("level_a_id", values["level_a_id"]);
                requestData.append("level_b_id", values["level_b_id"]);
                requestData.append("level_c_id", values["level_c_id"]);
                requestData.append("unit_id", values["unit_id"]);
                requestData.append(
                  "manufacturing_date",
                  values["manufacturing_date"]
                );
                requestData.append("b_expiry", values["b_expiry"]);
                requestData.append("mrp", values["mrp"]);
                requestData.append("supplier_id", selectedSupplier.id);
                requestData.append("b_no", values["b_no"]);
                //! console.log("After values", JSON.stringify(values));
                // for (const pair of requestData.entries()) {
                //   console.log(`key => ${pair[0]}, value =>${pair[1]}`);
                // }
                createBatchDetails(requestData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      MyNotifications.fire({
                        show: true,
                        icon: "success",
                        title: "Success",
                        msg: res.message,
                        is_timeout: true,
                        delay: 1000,
                      });
                      getProductBatchList(rowIndex);
                      resetForm();
                      // this.setState({
                      //   new_batch: true,
                      // });
                      let batchid = batchDataList.length;
                      setTimeout(() => {
                        document
                          .getElementById("productBatchTr_" + batchid)
                          .focus();
                      }, 2000);
                    } else {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: res.message,
                        // is_button_show: true,
                        is_timeout: true,
                        delay: 1500,
                      });
                    }
                  })
                  .catch((error) => {
                    console.log("error", error);
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
                <Form
                  className=""
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div
                    style={{
                      background: "#E6F2F8",
                      borderBottom: "1px solid #dcdcdc",
                    }}
                    className="p-2"
                  >
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
                                className={`${values.b_no == "" &&
                                    errorArrayBorder[0] == "Y"
                                    ? "border border-danger mdl-text-box-style"
                                    : "mdl-text-box-style"
                                  }`}
                              />
                            </Form.Group>
                            <span className="text-danger">{errors.b_no}</span>
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
                                  // console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  // console.log("checkdate", checkdate);
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
                                  // console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  // console.log("checkdate", checkdate);
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
                                  // console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  // console.log("checkdate", checkdate);
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
                                  // console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  // console.log("checkdate", checkdate);
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
                                      let curdatetime = currentDate.getTime();
                                      let expDate = new Date(
                                        moment(
                                          e.target.value,
                                          "DD/MM/YYYY"
                                        ).toDate()
                                      );
                                      if (
                                        mfgDate.getTime() < expDate.getTime() &&
                                        curdatetime <= expDate.getTime()
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
                                          "DD-MM-yyyy"
                                        ).toDate()
                                      );
                                      let curdatetime = currentDate.getTime();
                                      let curdatet = curDate.getTime();
                                      // console.log("curdatetime", curdatetime);
                                      if (curdatetime < curdatet) {
                                        // console.log(
                                        //   "curdatetime < curdatet",
                                        //   curdatetime < curdatet
                                        // );
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
                                      setFieldValue("b_expiry", e.target.value);
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
                                placeholder="0.00"
                                name="mrp"
                                id="mrp"
                                className="mdl-text-box-style text-end"
                                onChange={handleChange}
                                value={values.mrp}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>

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
                            tabIndex={-1}
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
                          <Col md="12 p-2 pe-4" className="btn_align">
                            <Button
                              className="submit-btn successbtn-style"
                              type="submit"
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.formRef.current.handleSubmit();
                                }
                              }}
                            >
                              + Add
                            </Button>
                            <Button
                              variant="secondary cancel-btn ms-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                resetForm();
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  resetForm();
                                }
                              }}
                            >
                              Clear
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
            {/* <div> */}
            {/* <Row className="ps-2"> */}

            {/* </Row> */}
            {/* </div> */}

            <div className="batchModalNewStyle">
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Batch</th>
                    <th style={{ width: "8%" }}>MFG Date</th>
                    <th style={{ width: "8%" }}>Expiry</th>
                    <th style={{ width: "8%" }}>MRP</th>
                    <th style={{ width: "10%" }}>Opn.Stk</th>
                    <th style={{ width: "10%" }}>Current Stk</th>
                    <th style={{ width: "10%" }}>Pur.Rate</th>
                    <th style={{ width: "10%" }}>Cost</th>
                    <th style={{ width: "10%" }}>Cost with tax</th>
                    <th style={{ width: "10%" }}>Sale Rate</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
                </thead>
                <tbody
                  className="prouctTableTr"
                  onKeyDown={(e) => {
                    // console.warn(e.keyCode);
                    // e.preventDefault();
                    if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {batchDataList &&
                    batchDataList.length > 0 &&
                    batchDataList.map((v, i) => {
                      return ismodify == true && modifyIndex == i ? (
                        <tr>
                          <td
                            className="p-0"
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              padding: "0px",
                              textAlign: "end",
                            }}
                          >
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Batch No"
                                name="modify_batch_no"
                                id="modify_batch_no"
                                className="mdl-text-box-style text-end"
                                onChange={(e) => {
                                  let val = e.target.value;
                                  // console.log("val", val);
                                  this.handleModifyElement("batch_no", val);
                                }}
                                value={modifyObj.batch_no}
                              />
                            </Form.Group>
                          </td>

                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              padding: "0px",
                            }}
                          >
                            <Form.Group>
                              <MyTextDatePicker
                                className="mdl-text-box-style text-end"
                                innerRef={(input) => {
                                  this.edtmfgDateRef.current = input;
                                }}
                                autoComplete="off"
                                name="modify_manufacturing_date"
                                id="modify_manufacturing_date"
                                placeholder="DD/MM/YYYY"
                                value={modifyObj.manufacturing_date}
                                onChange={(e) => {
                                  // console.log("date", e);
                                  e.preventDefault();
                                  let val = e.target.value;
                                  // console.log("val", val);
                                  this.handleModifyElement(
                                    "manufacturing_date",
                                    val
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.key === "Tab") {
                                    let datchco = e.target.value.trim();
                                    // console.log("datchco", datchco);
                                    let checkdate = moment(
                                      e.target.value
                                    ).format("DD/MM/YYYY");
                                    // console.log("checkdate", checkdate);
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
                                    // console.log("datchco", datchco);
                                    let checkdate = moment(
                                      e.target.value
                                    ).format("DD/MM/YYYY");
                                    // console.log("checkdate", checkdate);
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
                                        this.edtmfgDateRef.current.focus();
                                      }, 1000);
                                    }
                                  }
                                }}
                                onBlur={(e) => {
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

                                      if (curdatetime < mfgDateTime) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Mfg Date Should not be Greater than todays date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        this.handleModifyElement(
                                          "manufacturing_date",
                                          ""
                                        );
                                        setTimeout(() => {
                                          this.edtmfgDateRef.current.focus();
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
                                    }
                                  } else {
                                  }
                                }}
                              />
                            </Form.Group>
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              padding: "0px",
                            }}
                          >
                            <Form.Group>
                              <MyTextDatePicker
                                className="mdl-text-box-style text-end"
                                innerRef={(input) => {
                                  this.edtbatchdpRef.current = input;
                                }}
                                autoComplete="off"
                                name="expiry_date"
                                id="expiry_date"
                                placeholder="DD/MM/YYYY"
                                value={modifyObj.expiry_date}
                                onChange={(e) => {
                                  e.preventDefault();
                                  let val = e.target.value;
                                  this.handleModifyElement("expiry_date", val);
                                }}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.key === "Tab") {
                                    let datchco = e.target.value.trim();
                                    // console.log("datchco", datchco);
                                    let checkdate = moment(
                                      e.target.value
                                    ).format("DD/MM/YYYY");
                                    // console.log("checkdate", checkdate);
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
                                    // console.log("datchco", datchco);
                                    let checkdate = moment(
                                      e.target.value
                                    ).format("DD/MM/YYYY");
                                    // console.log("checkdate", checkdate);
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
                                        this.edtbatchdpRef.current.focus();
                                      }, 1000);
                                    }
                                  }
                                }}
                              // onBlur={(e) => {
                              //   //console.log("e ", e);
                              //   if (
                              //     e.target.value != null &&
                              //     e.target.value != ""
                              //   ) {
                              //     if (
                              //       moment(
                              //         e.target.value,
                              //         "DD-MM-YYYY"
                              //       ).isValid() == true
                              //     ) {
                              //       let mfgDate = "";
                              //       if (modifyObj.manufacturing_date != "") {
                              //         mfgDate = new Date(
                              //           moment(
                              //             modifyObj.manufacturing_date,
                              //             " DD-MM-yyyy"
                              //           ).toDate()
                              //         );
                              //         let currentDate = new Date();
                              //         let curdatetime = currentDate.getTime();
                              //         let expDate = new Date(
                              //           moment(
                              //             e.target.value,
                              //             "DD/MM/YYYY"
                              //           ).toDate()
                              //         );
                              //         if (
                              //           mfgDate.getTime() <
                              //             expDate.getTime() &&
                              //           curdatetime <= expDate.getTime()
                              //         ) {
                              //           // ! DO Nothing
                              //           // setFieldValue(
                              //           //   "b_expiry",
                              //           //   e.target.value
                              //           // );
                              //         } else {
                              //           MyNotifications.fire({
                              //             show: true,
                              //             icon: "error",
                              //             title: "Error",
                              //             msg: "Expiry date should be greater MFG date / Current Date",
                              //             // is_button_show: true,
                              //             is_timeout: true,
                              //             delay: 1500,
                              //           });
                              //           this.handleModifyElement(
                              //             "expiry_date",
                              //             ""
                              //           );

                              //           setTimeout(() => {
                              //             this.edtbatchdpRef.current.focus();
                              //           }, 1000);
                              //         }
                              //       } else if (
                              //         modifyObj.manufacturing_date == ""
                              //       ) {
                              //         let currentDate = new Date();
                              //         let curDate = new Date(
                              //           moment(
                              //             e.target.value,
                              //             "DD-MM-yyyy"
                              //           ).toDate()
                              //         );
                              //         let curdatetime = currentDate.getTime();
                              //         let curdatet = curDate.getTime();
                              //         // console.log("curdatetime", curdatetime);
                              //         if (curdatetime > curdatet) {
                              //           MyNotifications.fire({
                              //             show: true,
                              //             icon: "error",
                              //             title: "Error",
                              //             msg: "Expiry date should be greater current date",
                              //             // is_button_show: true,
                              //             is_timeout: true,
                              //             delay: 1500,
                              //           });
                              //           this.handleModifyElement(
                              //             "expiry_date",
                              //             ""
                              //           );

                              //           setTimeout(() => {
                              //             this.edtbatchdpRef.current.focus();
                              //           }, 1000);
                              //         }
                              //       }
                              //     } else {
                              //       MyNotifications.fire({
                              //         show: true,
                              //         icon: "error",
                              //         title: "Error",
                              //         msg: "Invalid date",
                              //         // is_button_show: true,
                              //         is_timeout: true,
                              //         delay: 1500,
                              //       });
                              //       this.handleModifyElement(
                              //         "expiry_date",
                              //         ""
                              //       );
                              //       setTimeout(() => {
                              //         this.edtbatchdpRef.current.focus();
                              //       }, 1000);
                              //       // setFieldValue("b_expiry", "");
                              //     }
                              //   } else {
                              //     // setFieldValue("b_expiry", "");
                              //   }
                              // }}
                              />
                            </Form.Group>
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              padding: "0px",
                            }}
                          >
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name="modify_mrp"
                                id="modify_mrp"
                                className="mdl-text-box-style text-end"
                                onChange={(e) => {
                                  e.preventDefault();
                                  let val = e.target.value;
                                  this.handleModifyElement("mrp", val);
                                }}
                                value={modifyObj.mrp}
                              />
                            </Form.Group>
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {isNaN(INRformat.format(v.opening_stock))
                              ? 0
                              : INRformat.format(v.opening_stock)}
                            {/* {modifyObj.closing_stock} */}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {isNaN(INRformat.format(v.closing_stock))
                              ? 0
                              : INRformat.format(v.closing_stock)}
                            {/* {modifyObj.closing_stock} */}
                          </td>

                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {modifyObj.purchase_rate} */}
                            {isNaN(INRformat.format(v.purchase_rate))
                              ? 0
                              : INRformat.format(v.purchase_rate)}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {modifyObj.costing
                              ? parseFloat(modifyObj.costing).toFixed(2)
                              : ""} */}
                            {isNaN(INRformat.format(v.costing))
                              ? 0
                              : INRformat.format(v.costing)}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {modifyObj.costingWithTax
                              ? parseFloat(modifyObj.costingWithTax).toFixed(2)
                              : ""} */}
                            {/* {INRformat.format(v.taxable_amt)} */}
                          </td>

                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {modifyObj.min_rate_a} */}
                            {isNaN(INRformat.format(v.min_rate_a))
                              ? 0
                              : INRformat.format(v.min_rate_a)}
                          </td>

                          <td className="text-center d-flex">
                            <img
                              src={rightCheckMark}
                              alt=""
                              className="batch-img"
                              onClick={(e) => {
                                e.preventDefault();
                                this.updateBatchData();
                                // console.log("update clicked");
                              }}
                            />
                            <img
                              src={wrongCheckMark}
                              alt=""
                              className="batch-img"
                              onClick={(e) => {
                                e.preventDefault();
                                this.clearModifyData();
                              }}
                            />
                          </td>
                        </tr>
                      ) : (
                        <tr
                          value={JSON.stringify(v)}
                          id={`productBatchTr_` + i}
                          prId={v.id}
                          tabIndex={i}
                          onClick={(e) => {
                            e.preventDefault();
                            // this.setState(
                            //   {
                            //     b_details_id: v,
                            //     tr_id: i + 1,
                            //     is_expired: v.is_expired,
                            //     batch_data_selected: v,
                            //   },
                            //   () => {
                            //     this.transaction_batch_detailsFun(v);
                            //   }
                            // );
                            productModalStateChange({
                              batch_data_selected: v,
                              b_details_id: v,
                              tr_id: i + 1,
                              is_expired: v.is_expired,
                            });
                            this.transaction_batch_detailsFun(v);
                          }}
                          // className={`${
                          //   new_batch == true && batchDataList.length == i + 1
                          //     ? "tr-color"
                          //     : is_expired != true
                          //     ? tr_id == i + 1
                          //       ? "tr-color"
                          //       : ""
                          //     : ""
                          // }`}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            let {
                              rows,
                              rowIndex,
                              b_details_id,
                              is_expired,
                              selectedSupplier,
                            } = this.props;
                            // console.log(
                            //   "Double Click b_details_id =->",
                            //   b_details_id
                            // );
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

                              rows[rowIndex]["b_details_id"] = b_details_id.id;
                              rows[rowIndex]["b_no"] = b_details_id.batch_no;
                              rows[rowIndex]["b_rate"] = b_details_id.mrp;

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
                              // rows[rowIndex]["costing"] = values.costing;
                              // rows[rowIndex]["costingWithTax"] =
                              //   values.costingWithTax;

                              rows[rowIndex]["b_expiry"] =
                                b_details_id.expiry_date != ""
                                  ? b_details_id.expiry_date
                                  : "";

                              rows[rowIndex]["manufacturing_date"] =
                                b_details_id.manufacturing_date != ""
                                  ? b_details_id.manufacturing_date
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
                          }}
                        >
                          <td
                            className="text-end"
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              // padding: "0px",
                            }}
                          >
                            {/* <pre>{JSON.stringify(v, undefined, 2)}</pre> */}
                            {v.batch_no}
                          </td>

                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {v.manufacturing_date}
                            {/* {moment(v.manufacturing_date).format(
                              "DD-MM-YYYY"
                            ) === "Invalid date"
                              ? ""
                              : moment(v.manufacturing_date).format(
                                "DD-MM-YYYY"
                              )} */}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {v.expiry_date}
                            {/* {moment(v.expiry_date).format("DD-MM-YYYY") ===
                              "Invalid date"
                              ? ""
                              : moment(v.expiry_date).format("DD-MM-YYYY")} */}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              // padding: "0px",
                              textAlign: "end",
                            }}
                          >
                            {/* {v.mrp} */}
                            {isNaN(v.mrp)
                              ? INRformat.format(0)
                              : INRformat.format(v.mrp)}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {v.closing_stock} */}
                            {isNaN(v.opening_stock)
                              ? INRformat.format(0)
                              : INRformat.format(v.opening_stock)}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {v.closing_stock} */}
                            {isNaN(v.closing_stock)
                              ? INRformat.format(0)
                              : INRformat.format(v.closing_stock)}
                          </td>

                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {v.purchase_rate} */}
                            {isNaN(v.purchase_rate)
                              ? INRformat.format(0)
                              : INRformat.format(v.purchase_rate)}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {v.costing ? parseFloat(v.costing).toFixed(2) : ""} */}
                            {isNaN(v.costing)
                              ? INRformat.format(0)
                              : INRformat.format(v.costing)}
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {v.costingWithTax
                              ? parseFloat(v.costingWithTax).toFixed(2)
                              : ""} */}
                            {isNaN(v.costingWithTax)
                              ? INRformat.format(0)
                              : INRformat.format(v.costingWithTax)}
                          </td>

                          <td
                            style={{
                              borderRight: "1px solid #dcdcdc",
                              textAlign: "end",
                            }}
                          >
                            {/* {v.min_rate_a} */}
                            {isNaN(v.min_rate_a)
                              ? INRformat.format(0)
                              : INRformat.format(v.min_rate_a)}
                          </td>

                          <td className="text-center d-flex">
                            <img
                              src={Frame}
                              className="batch-img"
                              onClick={(e) => {
                                e.preventDefault();
                                // enable the row editable
                                // v["manufacturing_date"] =
                                //   v["manufacturing_date"] != ""
                                //     ? moment(
                                //         v["manufacturing_date"],
                                //         "DD/MM/YYYY"
                                //       ).toDate()
                                //     : "";
                                // v["b_expiry"] =
                                //   v["b_expiry"] != ""
                                //     ? moment(
                                //         v["b_expiry"],
                                //         "DD/MM/YYYY"
                                //       ).toDate()
                                //     : "";
                                this.handleModifyEnable(i, v);
                              }}
                            />
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
