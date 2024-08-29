import React, { Component } from "react";
import Select from "react-select";
import { purchaseInvSelect } from "@/helpers";

import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import { Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const newRowDropdown = {
  control: (base, state) => ({
    ...base,
    // marginLeft: -25,
    borderRadius: "none",
    // border: "1px solid transparent",
    marginTop: 3,
    height: 28,
    minHeight: 28,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "12px",
    width: 55,
    // letterSpacing: "-0.02em",
    // textDecorationLine: "underline",
    color: "#000000",
    background: "transparent",

    "&:hover": {
      background: "transparent",
      border: "1px solid #dcdcdc !important",
    },
    // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
    border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
  }),
  dropdownIndicator: (base) => ({
    // background: "black",
    color: " #ADADAD",
    // marginRight: "5px",
    // height: "4.5px",
    // width: "9px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 999,
    fontSize: "12px",
  }),
};

export default class CMPTranxUnit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchModalShow: false,
      isEditDataset: false,
    };
  }

  getUnitOpt = (
    rowIndex,
    brandIndex,
    categoryIndex,
    subcategoryIndex,
    groupIndex,
    packageIndex
  ) => {
    let { rows } = this.props;
    let opt = rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][subcategoryIndex][
      "packageDetails"
    ][packageIndex]["packageId"]
      ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
          "categoryDetails"
        ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
          "packageDetails"
        ][packageIndex]["packageId"]["unitOpt"]
      : [];
    return opt;
  };

  handleUnitChange = (ele, value) => {
    let {
      rows,
      rowIndex,
      handleRowStateChange,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      groupIndex,
      packageIndex,
      unitIndex,
      showBatch,
    } = this.props;
    if (value == "" && ele == "qty") {
      value = 0;
    }
    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ][categoryIndex]["subcategoryDetails"][subcategoryIndex]["packageDetails"][
      packageIndex
    ]["unitDetails"][unitIndex][ele] = value;

    if (ele == "unitId") {
      //  this.handleBatchModel(true);
      this.setState(
        {
          isEditDataset: true,
        },
        () => {
          if (showBatch && ele == "unitId") {
            handleRowStateChange(
              rows,
              rows[rowIndex]["productId"]["isBatchNo"], // true,
              rowIndex,
              brandIndex,
              groupIndex,
              categoryIndex,
              subcategoryIndex,
              packageIndex,
              unitIndex
            );
          }
        }
      );
    } else {
      handleRowStateChange(rows);
    }
  };

  handleBatchModel = (status) => {
    console.log("status", status);
  };

  getUnitElement = (ele) => {
    let {
      rows,
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      groupIndex,
      packageIndex,
      unitIndex,
    } = this.props;
    // console.log(ele);

    return rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][subcategoryIndex][
      "packageDetails"
    ][packageIndex]["unitDetails"][unitIndex][ele]
      ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
          "categoryDetails"
        ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
          "packageDetails"
        ][packageIndex]["unitDetails"][unitIndex][ele]
      : "";
  };

  getFloatUnitElement = (ele) => {
    let {
      rows,
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      groupIndex,
      packageIndex,
      unitIndex,
    } = this.props;
    // console.log(ele);

    return rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][subcategoryIndex][
      "packageDetails"
    ][packageIndex]["unitDetails"][unitIndex][ele]
      ? parseFloat(
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][ele]
        ).toFixed(2)
      : "";
  };

  checkIsBatchExist = (rowIndex) => {
    let { setElementValue } = this.props;

    let p = setElementValue("unitId", rowIndex);

    if (p.isBatchNo !== "" && p.isBatchNo === false) {
      return true;
    }
    return false;
  };

  handleAddUnits = () => {
    let {
      rows,
      handleMstState,
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      groupIndex,
      packageIndex,
    } = this.props;
    let single_brand = {
      details_id: "",
      is_multi_unit: "",
      unitCount: "",
      unitId: "",
      qty: "",
      rate: "",
      base_amt: 0,
      unit_conv: 0,
      dis_amt: 0,
      dis_per: 0,
      dis_per_cal: 0,
      dis_amt_cal: 0,
      total_amt: 0,
      total_base_amt: 0,
      gst: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      total_igst: 0,
      total_cgst: 0,
      total_sgst: 0,
      final_amt: 0,
      final_discount_amt: 0,
      discount_proportional_cal: 0,
      additional_charges_proportional_cal: 0,
      b_no: 0,
      b_rate: 0,
      rate_a: 0,
      rate_b: 0,
      rate_c: 0,
      max_discount: 0,
      min_discount: 0,
      min_margin: 0,
      manufacturing_date: 0,
      b_purchase_rate: 0,
      b_expiry: 0,
      b_details_id: 0,
      is_batch: false,
    };

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ][categoryIndex]["subcategoryDetails"][subcategoryIndex]["packageDetails"][
      packageIndex
    ]["unitDetails"] = [
      ...rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
        "packageDetails"
      ][packageIndex]["unitDetails"],
      single_brand,
    ];

    handleMstState(rows);
  };

  handleRemoveUnits = (
    rowIndex,
    brandIndex,
    groupIndex,
    categoryIndex,
    subcategoryIndex,
    packageIndex,
    unitIndex
  ) => {
    let { rows, handleClearProduct, rowDelDetailsIds } = this.props;

    let deletedRow = rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][subcategoryIndex][
      "packageDetails"
    ][packageIndex]["unitDetails"].filter((v, i) => i != unitIndex);
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((uv, ui) => {
        console.log("details_id --------------->>>>", uv.details_id);
        if (uv.details_id > 0) {
          if (!rowDelDetailsIds.includes(uv.details_id)) {
            rowDelDetailsIds.push(uv.details_id);
          }
        }
      });
    }

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ][categoryIndex]["subcategoryDetails"][subcategoryIndex]["packageDetails"][
      packageIndex
    ]["unitDetails"] =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
        "packageDetails"
      ][packageIndex]["unitDetails"].length > 1
        ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"].filter(
            (v, i) => i != unitIndex
          )
        : rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"];
    console.warn("rahul::rows ", rows);
    handleClearProduct(rows);
  };

  getUnitValue = (
    rowIndex,
    brandIndex,
    categoryIndex,
    subcategoryIndex,
    groupIndex,
    packageIndex,
    unitIndex,
    element
  ) => {
    // console.warn("::getUnitValue");
    let { rows } = this.props;
    return rows
      ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
          "categoryDetails"
        ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
          "packageDetails"
        ][packageIndex]["unitDetails"][unitIndex][element]
      : "";
  };

  render() {
    let {
      rowData,
      rowIndex,
      brandIndex,
      groupIndex,
      categoryIndex,
      subcategoryIndex,
      packageIndex,
      unitIndex,
    } = this.props;

    return (
      <>
        <tr>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            <>
              <Button
                className="rowPlusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleAddUnits();
                }}
                disabled={
                  rowData && rowData.isPurchaseReturn === true
                    ? true
                    : rowData.productId != ""
                    ? false
                    : true
                }
              >
                <FontAwesomeIcon icon={faPlus} className="plus-color" />
              </Button>
            </>
          </td>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            <>
              <Button
                className="rowMinusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleRemoveUnits(
                    rowIndex,
                    brandIndex,
                    groupIndex,
                    categoryIndex,
                    subcategoryIndex,
                    packageIndex,
                    unitIndex
                  );
                }}
                disabled={
                  unitIndex > 0
                    ? false
                    : rowData.isPurchaseReturn === true
                    ? true
                    : true
                }
              >
                <FontAwesomeIcon icon={faMinus} className="minus-color" />
              </Button>
            </>
          </td>
          <td style={{ padding: "0px 5px 0px 5px" }}>
            <>
              <Select
                name={`unitId-${
                  rowIndex +
                  "" +
                  brandIndex +
                  "" +
                  groupIndex +
                  "" +
                  categoryIndex +
                  "" +
                  subcategoryIndex +
                  "" +
                  packageIndex +
                  "" +
                  unitIndex
                }`}
                id={`unitId-${
                  rowIndex +
                  "" +
                  brandIndex +
                  "" +
                  groupIndex +
                  "" +
                  categoryIndex +
                  "" +
                  subcategoryIndex +
                  "" +
                  packageIndex +
                  "" +
                  unitIndex
                }`}
                className="prd-dd-style "
                styles={newRowDropdown}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder=" "
                options={this.getUnitOpt(
                  rowIndex,
                  brandIndex,
                  categoryIndex,
                  subcategoryIndex,
                  groupIndex,
                  packageIndex
                )}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handleUnitChange("unitId", "");
                  } else {
                    this.handleUnitChange("unitId", v);
                  }
                }}
                value={this.getUnitElement("unitId")}
                isDisabled={
                  rowData && rowData.isPurchaseReturn === true
                    ? true
                    : rowData.productId != ""
                    ? false
                    : true
                }
              />
            </>
          </td>
          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            {/* {this.checkIsBatchExist(rowIndex) === false && ( */}
            <Form.Control
              readOnly={
                rowData && rowData.productId && rowData.productId != ""
                  ? false
                  : true
              }
              className="td-text-box width1"
              type="text"
              placeholder=""
              onChange={(v, actions) => {
                if (actions.action === "clear") {
                  this.handleUnitChange("b_no", "");
                } else {
                  this.handleUnitChange("b_no", v);
                }
              }}
              value={this.getUnitElement("b_no")}
            />
          </td>

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              readOnly={rowData && rowData.productId != "" ? false : true}
              className="td-text-box width2"
              type="text"
              placeholder=""
              name="qty"
              id="qty"
              onChange={(v) => {
                this.handleUnitChange("qty", v.target.value);
              }}
              value={this.getUnitElement("qty")}
            />
          </td>
          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              readOnly={
                rowData && rowData.productId != ""
                  ? rowData.isPurchaseReturn === true
                    ? true
                    : false
                  : true
              }
              className="td-text-box width3"
              type="text"
              name="rate"
              id="rate"
              placeholder=""
              onChange={(v) => {
                this.handleUnitChange("rate", v.target.value);
              }}
              value={this.getUnitElement("rate")}
            />
          </td>

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              readOnly={
                rowData && rowData.productId != ""
                  ? rowData.isPurchaseReturn === true
                    ? true
                    : false
                  : true
              }
              className="td-text-box width4"
              type="text"
              name="dis_per"
              placeholder=""
              onChange={(v) => {
                this.handleUnitChange("dis_per", v.target.value);
              }}
              value={this.getUnitElement("dis_per")}
            />
          </td>
          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              readOnly={
                rowData && rowData.productId != ""
                  ? rowData.isPurchaseReturn === true
                    ? true
                    : false
                  : true
              }
              className="td-text-box width5"
              type="text"
              placeholder=""
              name="dis_amt"
              onChange={(v) => {
                this.handleUnitChange("dis_amt", v.target.value);
              }}
              value={this.getUnitElement("dis_amt")}
            />
          </td>

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #D9D9D9",
              backgroundColor: "#F4F4F4",
            }}
          >
            <Form.Control
              readOnly={
                rowData && rowData.productId != ""
                  ? rowData.isPurchaseReturn === true
                    ? true
                    : false
                  : true
              }
              type="text"
              placeholder=""
              className="td-text-box width6"
              name="base_amt"
              id="base_amt"
              value={this.getFloatUnitElement("total_base_amt")}
              // readOnly
              disabled
            />
          </td>
          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #D9D9D9",
              backgroundColor: "#F4F4F4",
            }}
          >
            <Form.Control
              readOnly={
                rowData && rowData.productId != ""
                  ? rowData.isPurchaseReturn === true
                    ? true
                    : false
                  : true
              }
              type="text"
              placeholder=""
              className="td-text-box width6"
              name="total_amt"
              id="total_amt"
              value={this.getFloatUnitElement("total_amt")}
              // readOnly
              disabled
            />
          </td>
          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #D9D9D9",
              backgroundColor: "#F4F4F4",
            }}
          >
            <Form.Control
              readOnly={
                rowData && rowData.productId != ""
                  ? rowData.isPurchaseReturn === true
                    ? true
                    : false
                  : true
              }
              type="text"
              placeholder=""
              className="td-text-box width7"
              name="gst"
              id="gst"
              value={this.getFloatUnitElement("gst")}
              // readOnly
              disabled
            />
          </td>

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #D9D9D9",
              backgroundColor: "#D2F6E9",
            }}
          >
            <Form.Control
              readOnly={
                rowData && rowData.productId != ""
                  ? rowData.isPurchaseReturn === true
                    ? true
                    : false
                  : true
              }
              type="text"
              placeholder=""
              className="td-text-box width6"
              name="final_amt"
              id="final_amt"
              value={this.getFloatUnitElement("final_amt")}
              // readOnly
              disabled
            />
          </td>
        </tr>
      </>
    );
  }
}
