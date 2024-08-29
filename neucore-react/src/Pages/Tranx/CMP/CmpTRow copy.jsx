import React, { Component } from "react";

import { Table, Form, Button } from "react-bootstrap";
import Select from "react-select";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";

import TableDelete from "@/assets/images/deleteIcon.png";
import add_icon from "@/assets/images/add_icon.svg";

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
  OnlyEnterAmount,
} from "@/helpers";

class CmpTRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ABC_flag_value: "",
      levelA: false,
      levelB: false,
      levelC: false,
      product_hover_details: "",
    };
  }
  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
    //console.log("getUserControlLevelFromRedux : ", level);
    this.setState({ ABC_flag_value: level });

    if (level == "A") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
    } else if (level == "AB") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
    } else if (level == "ABC") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
      const l_C = getUserControlData("is_level_c", this.props.userControl);
      this.setState({ levelC: l_C });
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getUserControlLevelFromRedux();
    }
  }
  transaction_product_Hover_detailsFun = (product_id = 0) => {
    let { productLst, productModalStateChange } = this.props;
    if (product_id != 0) {
      let obj = productLst.find((v) => v.id === product_id);
      if (obj) {
        // this.setState({ product_hover_details: obj });
        productModalStateChange({ product_hover_details: obj });
        return obj;
      }
    }
    return null;
  };

  getLevelsOpt = (element, rowIndex, parent) => {
    let { rows } = this.props;
    return rows[rowIndex] && rows[rowIndex][parent]
      ? rows[rowIndex][parent][element]
      : [];
  };

  getFloatUnitElement = (ele, rowIndex) => {
    let { rows } = this.props;
    return rows[rowIndex][ele]
      ? parseFloat(rows[rowIndex][ele]).toFixed(2)
      : "";
  };

  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
  };

  render() {
    let { ABC_flag_value, levelA, levelB, levelC } = this.state;
    let {
      rows,
      productModalStateChange,
      add_button_flag,
      get_supplierlist_by_productidFun,
      handleUnitChange,
      handleAddRow,
      handleRemoveRow,
      openSerialNo,
      openBatchNo,
      getProductBatchList,
      batchHideShow,
      transactionType,
      transactionTableStyle,
      qtyVerificationById,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      saleRateType,
      productId,
    } = this.props;

    return (
      <div>
        <div class="outer-wrapper">
          <div class="table-wrapper">
            <div
              className={`${
                transactionTableStyle == "salesOrder" ||
                transactionTableStyle == "salesQuotation" ||
                transactionTableStyle == "counter_sale" ||
                transactionTableStyle == "purchaseOrder"
                  ? "tnx-sale-ord-tbl-style"
                  : "tnx-pur-inv-tbl-style"
              }`}
            >
              {/* {JSON.stringify(rows)} */}
              <Table>
                <thead
                  style={{
                    border: "1px solid #A8ADB3",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        textAlign: "center",
                        width: "35px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="py-1"
                    >
                      Sr. No.
                    </th>

                    <th
                      style={{
                        // width: "630px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="purticular-width"
                    >
                      Particulars
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        // width: "179px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="qty_width"
                    >
                      Package
                    </th>

                    {ABC_flag_value == "A" ||
                    ABC_flag_value == "AB" ||
                    ABC_flag_value == "ABC" ? (
                      <th
                        className={`${
                          ABC_flag_value == "A"
                            ? "Level_A"
                            : ABC_flag_value == "AB"
                            ? "Level_AB"
                            : ABC_flag_value == "ABC"
                            ? "Level_ABC"
                            : "Level_no"
                        }`}
                      >
                        {isUserControl("is_level_a", this.props.userControl)
                          ? levelA["label"]
                          : ""}
                      </th>
                    ) : (
                      ""
                    )}

                    {ABC_flag_value == "AB" || ABC_flag_value == "ABC" ? (
                      <th
                        className={`${
                          ABC_flag_value == "AB"
                            ? "Level_AB"
                            : ABC_flag_value == "ABC"
                            ? "Level_ABC"
                            : "Level_no"
                        }`}
                      >
                        {isUserControl("is_level_b", this.props.userControl)
                          ? levelB["label"]
                          : ""}
                      </th>
                    ) : (
                      ""
                    )}

                    {ABC_flag_value == "ABC" ? (
                      <th
                        className={`${
                          ABC_flag_value == "ABC" ? "Level_ABC" : "Level_no"
                        }`}
                      >
                        {isUserControl("is_level_c", this.props.userControl)
                          ? levelC["label"]
                          : ""}
                      </th>
                    ) : (
                      ""
                    )}

                    <th
                      style={{
                        textAlign: "center",
                        // width: "117px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="py-1 unit_width"
                    >
                      Unit
                    </th>

                    {batchHideShow === true ? (
                      <th
                        style={{
                          textAlign: "center",
                          // width: "200px",
                          borderRight: "1px solid #A8ADB2",
                        }}
                        className="batch_width"
                      >
                        Batch No/Serial No
                      </th>
                    ) : (
                      <></>
                    )}

                    <th
                      style={{
                        textAlign: "center",
                        // width: "115px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="qty_width"
                    >
                      Quantity
                    </th>

                    {isFreeQtyExist("is_free_qty", this.props.userControl) && (
                      <th
                        style={{
                          textAlign: "center",
                          // width: "135px",
                          borderRight: "1px solid #A8ADB2",
                        }}
                        className="free_width"
                      >
                        Free
                      </th>
                    )}
                    <th
                      style={{
                        textAlign: "center",
                        // width: "179px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="rate_width"
                    >
                      Rate
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        // width: "135px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="amt_width"
                    >
                      Gross Amount
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        // width: "75px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="py-1 dis1_width"
                    >
                      1-Dis.
                      <br />%
                    </th>

                    {isMultiDiscountExist(
                      "is_multi_discount",
                      this.props.userControl
                    ) && (
                      <th
                        style={{
                          textAlign: "center",
                          // width: "75px",
                          borderRight: "1px solid #A8ADB2",
                        }}
                        className="py-1 dis2_width"
                      >
                        2-Dis.
                        <br />%
                      </th>
                    )}
                    <th
                      style={{
                        textAlign: "center",
                        // width: "100px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="py-1 disc_width"
                    >
                      Disc.
                      <br />₹
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        // width: "75px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="py-1 tax_width"
                    >
                      Tax
                      <br />%
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        // width: "110px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                      className="net_ant_width"
                    >
                      Net Amount
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        width: "30px",
                        borderRight: "1px solid #A8ADB2",
                      }}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((rv, ri) => {
                    return (
                      <tr
                        style={{ borderbottom: "1px solid #D9D9D9" }}
                        onMouseOver={(e) => {
                          e.preventDefault();
                          if (rows[ri]["productId"] !== "") {
                            this.transaction_product_Hover_detailsFun(
                              rv.productId
                            );
                          }
                        }}
                      >
                        <td className="sr-no-style">{parseInt(ri) + 1}</td>
                        <td
                          // onFocus={(e) => {
                          //   //console.log("product on focus");
                          //   if (rows[ri]["productId"] === "") {
                          //     productModalStateChange({
                          //       selectProductModal: true,
                          //       rowIndex: ri,
                          //     });
                          //   }
                          // }}
                          onMouseOver={(e) => {
                            e.preventDefault();
                            console.log("mouse over--", e.target.value);
                            if (rows[ri]["productId"] !== "") {
                              get_supplierlist_by_productidFun(rv.productId);
                            }
                          }}
                          onMouseOut={(e) => {
                            e.preventDefault();
                            get_supplierlist_by_productidFun();
                          }}
                        >
                          <Form.Control
                            type="text"
                            id={`${productId + ri}`}
                            name={`${productId + ri}`}
                            // id={`productName-${ri}`}
                            // name={`productName-${ri}`}
                            className={`${
                              productNameData && productNameData[ri] == "Y"
                                ? "border border-danger tnx-pur-inv-prod-style text-start"
                                : "tnx-pur-inv-prod-style text-start"
                            }`}
                            // className="tnx-pur-inv-prod-style text-start"
                            placeholder="Particulars"
                            // styles={particularsDD}
                            colors="#729"
                            onClick={(e) => {
                              e.preventDefault();
                              //   this.SelectProductModalFun(true, ri);
                              productModalStateChange({
                                selectProductModal: true,
                                rowIndex: ri,
                              });
                            }}
                            value={rows[ri]["productName"]}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                productModalStateChange({
                                  selectProductModal: true,
                                  rowIndex: ri,
                                });
                              } else if (e.shiftKey && e.key === "Tab") {
                              } else if (e.key === "Tab" && !e.target.value) {
                                e.preventDefault();
                              }
                            }}
                            readOnly
                          />
                        </td>
                        <td>
                          <Form.Control
                            className=" table-text-box border-0"
                            id={`packing-${ri}`}
                            name={`packing-${ri}`}
                            type="text"
                            placeholder="0"
                            onChange={(e) => {
                              handleUnitChange("packing", e.target.value, ri);
                            }}
                            value={rows[ri]["packing"]}
                          />
                        </td>

                        {ABC_flag_value == "A" ||
                        ABC_flag_value == "AB" ||
                        ABC_flag_value == "ABC" ? (
                          <td>
                            <Select
                              isDisabled={
                                rows[ri]["is_level_a"] === true ? false : true
                              }
                              id={`levelaId-${ri}`}
                              name={`levelaId-${ri}`}
                              className="prd-dd-style "
                              menuPlacement="auto"
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              placeholder="select..."
                              styles={flavourDD}
                              options={this.getLevelsOpt(
                                "levelAOpt",
                                ri,
                                "prod_id"
                              )}
                              colors="#729"
                              onChange={(value, triggeredAction) => {
                                // rows[ri]["levelaId"] = value;
                                handleUnitChange("levelaId", value, ri);
                                // this.getLevelbOpt(
                                //   ri,
                                //   rows[ri]["productId"],
                                //   value
                                // );
                                handleUnitChange();
                              }}
                              value={rows[ri]["levelaId"]}
                            />
                          </td>
                        ) : (
                          ""
                        )}

                        {ABC_flag_value == "AB" || ABC_flag_value == "ABC" ? (
                          <td>
                            <Select
                              isDisabled={
                                rows[ri]["is_level_b"] === true ? false : true
                              }
                              id={`levelbId-${ri}`}
                              name={`levelbId-${ri}`}
                              className="prd-dd-style "
                              menuPlacement="auto"
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              placeholder="select..."
                              styles={flavourDD}
                              options={this.getLevelsOpt(
                                "levelBOpt",
                                ri,
                                "levelaId"
                              )}
                              colors="#729"
                              onChange={(value, triggeredAction) => {
                                handleUnitChange("levelbId", value, ri);

                                // rows[ri]["levelbId"] = value;
                                // this.getLevelcOpt(
                                //   ri,
                                //   rows[ri]["productId"],
                                //   rows[ri]["levelaId"],
                                //   value
                                // );
                              }}
                              value={rows[ri]["levelbId"]}
                            />
                          </td>
                        ) : (
                          ""
                        )}
                        {ABC_flag_value == "ABC" ? (
                          <td>
                            <Select
                              isDisabled={
                                rows[ri]["is_level_c"] === true ? false : true
                              }
                              id={`levelbId-${ri}`}
                              name={`levelbId-${ri}`}
                              className="prd-dd-style "
                              menuPlacement="auto"
                              components={{
                                IndicatorSeparator: () => null,
                              }}
                              placeholder="select..."
                              styles={flavourDD}
                              options={this.getLevelsOpt(
                                "levelCOpt",
                                ri,
                                "levelbId"
                              )}
                              colors="#729"
                              onChange={(value, triggeredAction) => {
                                // rows[ri]["levelcId"] = value;
                                handleUnitChange("levelcId", value, ri);
                              }}
                              value={rows[ri]["levelcId"]}
                            />
                          </td>
                        ) : (
                          ""
                        )}

                        <td>
                          <Form.Group
                            className={`${
                              unitIdData && unitIdData[ri] == "Y"
                                ? "border border-danger "
                                : ""
                            }`}
                          >
                            <Select
                              menuPlacement="auto"
                              menuPosition="fixed"
                              id={`unitId-${ri}`}
                              name={`unitId-${ri}`}
                              className="prd-dd-style drop-up "
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              placeholder="Unit"
                              styles={unitDD}
                              options={this.getLevelsOpt(
                                "unitOpt",
                                ri,
                                "levelcId"
                              )}
                              onChange={(value, triggeredAction) => {
                                handleUnitChange("unitId", value, ri);
                              }}
                              value={rows[ri]["unitId"]}
                              // onKeyDown={(e) => {
                              //   if (e.key === "Tab") {
                              //     if (rv.selectedProduct?.is_serial) {
                              //       openSerialNo(ri);
                              //     } else if (rv.selectedProduct?.is_batch) {
                              //       openBatchNo(ri);
                              //     }
                              //   }
                              // }}
                            />
                          </Form.Group>
                        </td>
                        {batchHideShow == true ? (
                          <>
                            {" "}
                            <td>
                              <Form.Control
                                id={`batchNo-${ri}`}
                                name={`batchNo-${ri}`}
                                className={`${
                                  batchNoData && batchNoData[ri] == "Y"
                                    ? "border border-danger table-text-box"
                                    : "table-text-box border-0"
                                }`}
                                // className="table-text-box border-0"
                                type="text"
                                placeholder=""
                                onInput={(e) => {
                                  e.preventDefault();
                                  // this.getProductBatchList(ri);
                                  console.log("rv", rv);
                                  if (rv.selectedProduct?.is_serial) {
                                    console.log(
                                      "rv serial",
                                      rv.selectedProduct?.is_serial
                                    );
                                    openSerialNo(ri);
                                  } else if (rv.selectedProduct?.is_batch) {
                                    console.log(
                                      "rv batch",
                                      rv.selectedProduct?.is_batch
                                    );
                                    openBatchNo(ri);
                                  }
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log(
                                    "rv selectedProduct",
                                    rv.selectProduct
                                  );
                                  if (rv.selectedProduct?.is_serial) {
                                    // console.log(
                                    //   "rv serial",
                                    //   rv.selectedProduct?.is_serial
                                    // );
                                    openSerialNo(ri);
                                  } else if (rv.selectedProduct?.is_batch) {
                                    // console.log(
                                    //   "rv batch",
                                    //   rv.selectedProduct?.is_batch
                                    // );
                                    openBatchNo(ri);
                                  }
                                  // this.getProductBatchList(ri);
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    if (rv.selectedProduct?.is_serial) {
                                      openSerialNo(ri);
                                    } else if (rv.selectedProduct?.is_batch) {
                                      openBatchNo(ri);
                                    }
                                  } else if (e.shiftKey && e.key === "Tab") {
                                  } else if (
                                    e.key === "Tab" &&
                                    !e.target.value
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                value={rows[ri]["b_no"]}
                                // disabled={
                                //   !(
                                //     rv.selectedProduct?.is_batch ||
                                //     rv.selectedProduct?.is_serial
                                //   )
                                // }
                                readOnly
                              />
                            </td>
                          </>
                        ) : (
                          <></>
                        )}

                        <td>
                          <Form.Control
                            className={`${
                              qtyData && qtyData[ri] == "Y"
                                ? "border border-danger table-text-box"
                                : "table-text-box border-0"
                            }`}
                            id={`qty-${ri}`}
                            name={`qty-${ri}`}
                            // className="table-text-box border-0"
                            type="text"
                            placeholder="0"
                            onChange={(e) => {
                              // rows[ri]["qty"] = e.target.value;
                              handleUnitChange("qty", e.target.value, ri);
                            }}
                            value={rows[ri]["qty"]}
                            onKeyPress={(e) => {
                              OnlyEnterNumbers(e);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Tab" && !e.target.value) {
                                e.preventDefault();
                              } else if (e.key === "Tab") {
                                if (
                                  transactionType === "sale_invoice" ||
                                  transactionType === "sales_edit"
                                ) {
                                  console.log("rv", rv);
                                  if (rv.qty != null) {
                                    qtyVerificationById(rv);
                                  }
                                }
                              }
                            }}
                          />
                        </td>

                        {isFreeQtyExist(
                          "is_free_qty",
                          this.props.userControl
                        ) && (
                          <td>
                            <Form.Control
                              id={`freeQty-${ri}`}
                              name={`freeQty-${ri}`}
                              className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              onChange={(e) => {
                                handleUnitChange(
                                  "free_qty",
                                  e.target.value,
                                  ri
                                );
                              }}
                              onBlur={(e) => {
                                // if (
                                //   parseInt(rows[ri]["qty"]) <
                                //     parseInt(rows[ri]["free_qty"]) ===
                                //   true
                                // ) {
                                //   MyNotifications.fire({
                                //     show: true,
                                //     icon: "error",
                                //     title: "Error",
                                //     msg: "Free Qty should be less than Qty",
                                //     is_button_show: true,
                                //   });
                                //   handleUnitChange("free_qty", 0, ri);
                                // }
                              }}
                              value={rows[ri]["free_qty"]}
                              onKeyPress={(e) => {
                                OnlyEnterNumbers(e);
                              }}
                            />
                          </td>
                        )}

                        <td>
                          <Form.Control
                            className={`${
                              rateData && rateData[ri] == "Y"
                                ? "border border-danger table-text-box "
                                : "table-text-box border-0"
                            }`}
                            id={`rate-${ri}`}
                            name={`rate-${ri}`}
                            // className="table-text-box border-0"
                            type="text"
                            placeholder="0"
                            onChange={(e) => {
                              handleUnitChange("rate", e.target.value, ri);
                            }}
                            value={rows[ri]["rate"]}
                            onKeyPress={(e) => {
                              OnlyEnterAmount(e);
                            }}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.key === "Tab") {
                              } else if (e.key === "Tab" && !e.target.value) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`grossAmt-${ri}`}
                            name={`grossAmt-${ri}`}
                            className="table-text-box border-0"
                            type="text"
                            placeholder="0"
                            // value={rows[ri]["total_base_amt"]}
                            value={this.getFloatUnitElement("base_amt", ri)}
                            disabled
                            readOnly
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`dis1Per-${ri}`}
                            name={`dis1Per-${ri}`}
                            className="table-text-box border-0"
                            type="text"
                            placeholder="0"
                            onChange={(e) => {
                              handleUnitChange("dis_per", e.target.value, ri);
                            }}
                            value={rows[ri]["dis_per"]}
                            onKeyPress={(e) => {
                              OnlyEnterAmount(e);
                            }}
                          />
                        </td>

                        {isMultiDiscountExist(
                          "is_multi_discount",
                          this.props.userControl
                        ) && (
                          <td>
                            <Form.Control
                              id={`dis2Per-${ri}`}
                              name={`dis2Per-${ri}`}
                              className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              onChange={(e) => {
                                handleUnitChange(
                                  "dis_per2",
                                  e.target.value,
                                  ri
                                );
                              }}
                              value={rows[ri]["dis_per2"]}
                              onKeyPress={(e) => {
                                OnlyEnterAmount(e);
                              }}
                            />
                          </td>
                        )}

                        <td>
                          <Form.Control
                            id={`disAmt-${ri}`}
                            name={`disAmt-${ri}`}
                            className="table-text-box border-0"
                            type="text"
                            placeholder="0"
                            onChange={(e) => {
                              handleUnitChange("dis_amt", e.target.value, ri);
                            }}
                            // onBlur={(e) => {
                            //   e.preventDefault();
                            //   this.setState({
                            //     newBatchSelectModal: true,
                            //   });
                            // }}
                            value={rows[ri]["dis_amt"]}
                            onKeyPress={(e) => {
                              OnlyEnterAmount(e);
                            }}
                            // onBlur={(e) => {
                            //   e.preventDefault();
                            //   if (rv.selectedProduct?.is_serial) {
                            //     // console.log(
                            //     //   "rv serial",
                            //     //   rv.selectedProduct?.is_serial
                            //     // );
                            //     // openSerialNo(ri);
                            //   } else if (rv.selectedProduct?.is_batch) {
                            //     // console.log(
                            //     //   "rv batch",
                            //     //   rv.selectedProduct?.is_batch
                            //     // );
                            //     // openBatchNo(ri);
                            //     getProductBatchList(ri, "costing");
                            //   }

                            // }}

                            onKeyDown={(e) => {
                              if (e.shiftKey && e.key === "Tab") {
                              } else if (e.key === "Tab") {
                                if (rv.selectedProduct?.is_serial) {
                                  // console.log(
                                  //   "rv serial",
                                  //   rv.selectedProduct?.is_serial
                                  // );
                                  // openSerialNo(ri);
                                } else if (rv.selectedProduct?.is_batch) {
                                  // console.log(
                                  //   "rv batch",
                                  //   rv.selectedProduct?.is_batch
                                  // );
                                  // openBatchNo(ri);
                                  getProductBatchList(ri, "costing");
                                }
                              }
                            }}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`tax-${ri}`}
                            name={`tax-${ri}`}
                            className="table-text-box border-0"
                            type="text"
                            placeholder="0"
                            value={rows[ri]["gst"]}
                            disabled
                            readOnly
                          />
                        </td>

                        <td style={{ backgroundColor: "#D2F6E9" }}>
                          <Form.Control
                            id={`netAmt-${ri}`}
                            name={`netAmt-${ri}`}
                            className="table-text-box border-0"
                            type="text"
                            placeholder="0"
                            value={this.getFloatUnitElement("final_amt", ri)}
                            disabled
                            readOnly
                            style={{ backgroundColor: "#D2F6E9" }}
                          />
                        </td>

                        <td className="d-flex">
                          {rows.length > 1 && (
                            <Button
                              className="btn_img_style"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveRow(ri);
                                // this.setState({
                                //   add_button_flag: true,
                                // });
                                productModalStateChange({
                                  add_button_flag: true,
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  handleRemoveRow(ri);
                                  productModalStateChange({
                                    add_button_flag: true,
                                  });
                                }
                              }}
                            >
                              <img
                                isDisabled={rows.length > 0}
                                src={TableDelete}
                                alt=""
                                className="btnimg"
                                // autoFocus={true}
                              />
                            </Button>
                          )}
                          {add_button_flag === true &&
                            this.checkLastRow(
                              ri,
                              rows.length - 1,
                              rv,
                              rows[ri]["unitId"],
                              rows[ri]["qty"]
                            ) && (
                              <Button
                                id={this.props.addBtnId + ri}
                                className="btn_img_style"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddRow();
                                  // this.setState({
                                  //   add_button_flag: !add_button_flag,
                                  // });
                                  productModalStateChange({
                                    add_button_flag: true,
                                  });
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    handleAddRow();
                                    productModalStateChange({
                                      add_button_flag: true,
                                    });
                                  }
                                }}
                              >
                                <img
                                  src={add_icon}
                                  alt=""
                                  className="btnimg"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddRow();
                                    productModalStateChange({
                                      add_button_flag: true,
                                    });
                                  }}
                                  isDisabled={
                                    rv && rv.productId && rv.productId != ""
                                      ? true
                                      : false
                                  }
                                />
                              </Button>
                            )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userPermissions, userControl }) => {
  return { userPermissions, userControl };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
      setUserControl,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(CmpTRow);
