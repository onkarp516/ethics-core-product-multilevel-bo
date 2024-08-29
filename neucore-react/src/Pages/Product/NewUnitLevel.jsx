import React, { Component } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  isMultiRateExist,
  isUserControl,
  MyNotifications,
  OnlyEnterNumbers,
  newRowDropdownUnit,
} from "@/helpers";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// const newRowDropdownUnit = {
//   control: (base, state) => ({
//     ...base,
//     // marginLeft: -25,
//     borderRadius: "none",
//     // border: "1px solid transparent",
//     marginTop: 3,
//     height: 28,
//     minHeight: 28,
//     fontFamily: "Inter",
//     fontStyle: "normal",
//     fontWeight: 400,
//     fontSize: "14px",
//     lineHeight: "12px",
//     width: "75px",
//     // letterSpacing: "-0.02em",
//     // textDecorationLine: "underline",
//     color: "#000000",
//     background: "transparent",
//     padding: "0px",
//     "&:hover": {
//       background: "transparent",
//       border: "1px solid #dcdcdc !important",
//     },
//     // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
//     border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
//   }),

//   dropdownIndicator: (base) => ({
//     // background: "black",
//     color: " #ADADAD",
//     // marginRight: "5px",
//     // height: "4.5px",
//     // width: "9px",
//   }),
//   menu: (base) => ({
//     ...base,
//     zIndex: 999,
//     fontSize: "12px",
//   }),
// };
class NewUnitLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoModalShow: false,
    };
  }

  componentDidMount() {
    console.log("this.props ", this.props);
  }
  handleUnitChange = (v, element) => {
    console.log("V", v);
    console.log("element", element);
    let {
      mstLevelAIndex,
      mstLevelBIndex,
      mstPackaging,
      mstLevelCIndex,
      handleMstState,
      mstUnitIndex,
    } = this.props;
    mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
      mstLevelCIndex
    ]["units"][mstUnitIndex][element] = v;
    handleMstState(mstPackaging);
  };

  handleRateBlur = (v, element) => {
    let {
      mstLevelAIndex,
      mstLevelBIndex,
      mstPackaging,
      mstLevelCIndex,
      handleMstState,
      mstUnitIndex,
    } = this.props;

    console.log("rahul ::", { v, element });

    let mrp =
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"][mstUnitIndex]["mrp"];

    let purchaseRate =
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"][mstUnitIndex]["purchase_rate"];

    let saleRate =
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"][mstUnitIndex]["min_rate_a"];

    console.log("rahul ::mrp", mrp, purchaseRate, saleRate);

    let newValue = v;
    if (
      element == "purchase_rate" &&
      parseFloat(purchaseRate) > parseFloat(mrp) &&
      parseFloat(mrp) != 0
    ) {
      // newValue = 0;
      let key = element + "_" + mstUnitIndex;
      let inputElement = document.getElementById(key);
      console.warn("rahul::inputElement ", inputElement);
      if (inputElement) inputElement.focus();
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "Purchase rate exceeding mrp",
        // is_timeout: true,
        // delay: 1000,
      });
    } else if (
      element == "min_rate_a" &&
      parseFloat(mrp) != 0 &&
      (parseFloat(saleRate) < parseFloat(purchaseRate) ||
        parseFloat(saleRate) > parseFloat(mrp))
    ) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "Sale rate should be between purchase rate and mrp",
        // is_timeout: true,
        // delay: 1000,
      });
    }
    mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
      mstLevelCIndex
    ]["units"][mstUnitIndex][element] = newValue;

    handleMstState(mstPackaging);
  };

  handleDiscountBlur = (v, element) => {
    let {
      mstLevelAIndex,
      mstLevelBIndex,
      mstPackaging,
      mstLevelCIndex,
      handleMstState,
      mstUnitIndex,
    } = this.props;

    console.log("rahul ::", { v, element });

    let max_disc =
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"][mstUnitIndex]["max_discount"] != ""
        ? mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
            mstLevelCIndex
          ]["units"][mstUnitIndex]["max_discount"]
        : 0;

    let min_disc =
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"][mstUnitIndex]["min_discount"] != ""
        ? mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
            mstLevelCIndex
          ]["units"][mstUnitIndex]["min_discount"]
        : 0;

    console.warn("rahul::max_disc,min_disc ", max_disc, min_disc);

    let new_max_disc = parseFloat(max_disc);
    let new_min_disc = parseFloat(min_disc);
    if (element === "max_discount") {
      if (parseFloat(max_disc) === 0) {
        new_max_disc = 0;
        new_min_disc = 0;

        mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
          mstLevelCIndex
        ]["units"][mstUnitIndex][element] = new_max_disc;

        mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
          mstLevelCIndex
        ]["units"][mstUnitIndex]["min_discount"] = new_max_disc;

        if (parseFloat(min_disc) !== 0) {
          let key = "min_discount_" + mstUnitIndex;
          let inputElement = document.getElementById(key);
          console.warn("rahul::inputElement ", inputElement);
          if (inputElement) inputElement.focus();
        }
      } else if (parseFloat(max_disc) > parseFloat(min_disc)) {
      } else {
        new_max_disc = 0;

        mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
          mstLevelCIndex
        ]["units"][mstUnitIndex][element] = new_max_disc;

        let key = element + "_" + mstUnitIndex;
        let inputElement = document.getElementById(key);
        console.warn("rahul::inputElement ", inputElement);
        if (inputElement) inputElement.focus();
      }
    }
    if (element === "min_discount") {
      if (new_max_disc > 0 && parseFloat(max_disc) > parseFloat(min_disc)) {
      } else {
        new_min_disc = 0;
      }
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"][mstUnitIndex][element] = new_min_disc;
    }

    handleMstState(mstPackaging);
  };

  getUnitElement = (element) => {
    let {
      mstLevelAIndex,
      mstLevelBIndex,
      mstPackaging,
      mstLevelCIndex,
      mstUnitIndex,
    } = this.props;
    return mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
      mstLevelCIndex
    ]["units"][mstUnitIndex][element];
  };
  handleInfoModal = (status) => {
    this.setState({ infoModalShow: status });
  };

  handleAddUnit = () => {
    let {
      mstLevelAIndex,
      mstLevelBIndex,
      mstPackaging,
      mstLevelCIndex,
      handleMstState,
    } = this.props;
    let single_unit = {
      details_id: 0,
      isNegativeStocks: 0,
      unit_id: "",
      unit_idError: "",
      unit_conv: 1,
      unit_marg: 0,
      min_qty: 0,
      max_qty: 0,
      disc_amt: 0,
      disc_per: 0,
      mrp: 0,
      purchase_rate: 0,
      sales_rate: 0,
      min_sales_rate: 0,
      opening_qty: 0,
      opening_valution: 0,
      opening_rate: 0,
      min_rate_a: 0,
      min_rate_b: 0,
      min_rate_c: 0,
      min_margin: 0,
      max_discount: 0,
      min_discount: 0,
      applicable_date: "",
      batchList: [],
    };
    let units = [
      ...mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"],
      single_unit,
    ];
    mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
      mstLevelCIndex
    ]["units"] = units;

    handleMstState(mstPackaging);
  };

  handleRemoveUnit = (
    mstLevelAIndex,
    mstLevelBIndex,
    mstLevelCIndex,
    mstUnitIndex
  ) => {
    let { mstPackaging, handleMstState, rowDelDetailsIds } = this.props;

    let units =
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"];
    let deletedRow = units.filter((v, i) => i === mstUnitIndex);
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

    // let units =
    //   mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
    //     mstLevelCIndex
    //   ]["units"];
    mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
      mstLevelCIndex
    ]["units"] =
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
        mstLevelCIndex
      ]["units"].length > 1
        ? units.filter((v, i) => i != mstUnitIndex)
        : units;

    handleMstState(mstPackaging);
  };

  render() {
    let {
      unitOpts,
      mstUnitIndex,
      mstLevelAIndex,
      mstLevelBIndex,
      mstLevelCIndex,
      isBatchNo,
      mstLevelC,
      handleOpnStockModalShow,
      getPPixel,
      setFieldValue,
      getPixel,
      methodUsed,
      ABC_flag_value,
      handelUnitModalShow,
      isInventory,
    } = this.props;

    return (
      <>
        <tr>
          {/* {JSON.stringify(this.getUnitElement("unit_idError"))} */}
          <td style={{ padding: "0px 0px 0px 5px" }}>
            <Button
              className="rowPlusBtn"
              onClick={(e) => {
                e.preventDefault();
                this.handleAddUnit();
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="plus-color" />
            </Button>
          </td>

          <td style={{ padding: "0px 0px 0px 5px" }}>
            <Button
              disabled={mstLevelC.units.length === 1 ? true : false}
              className="rowMinusBtn"
              onClick={(e) => {
                e.preventDefault();
                this.handleRemoveUnit(
                  mstLevelAIndex,
                  mstLevelBIndex,
                  mstLevelCIndex,
                  mstUnitIndex
                );
              }}
            >
              <FontAwesomeIcon icon={faMinus} className="minus-color" />
            </Button>
          </td>

          <td style={{ padding: "0px 5px 0px 5px" }}>
            <Select
              name={`unit_id_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              id={`unit_id_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              styles={newRowDropdownUnit}
              placeholder="Select"
              className="prd-dd-style"
              options={unitOpts}
              // onChange={(v, action) => {
              //   handelUnitModalShow(true);
              // }}
              onChange={(v) => {
                // setFieldValue("unit_id", "");
                this.handleUnitChange("", "unit_id");
                if (v !== "") {
                  if (v.label === "Add New") {
                    console.log(v.label === "Add New");
                    handelUnitModalShow(true);
                  } else {
                    this.handleUnitChange(v, "unit_id");
                  }
                }
              }}
              // onChange={(v, action) => {
              //   if (action.action == "clear") {
              //     this.handleUnitChange("", "unit_id");
              //   } else {
              //     let key =
              //       "unit_conv_" +
              //       mstLevelAIndex +
              //       "" +
              //       mstLevelBIndex +
              //       "" +
              //       mstLevelCIndex +
              //       "" +
              //       mstLevelCIndex +
              //       "" +
              //       mstUnitIndex;
              //     let inputElement = document.getElementById(key);
              //     console.warn("rahul::inputElement ", inputElement);
              //     if (inputElement) {
              //       inputElement.focus();
              //     }

              //     this.handleUnitChange(v, "unit_id");
              //   }
              // }}
              value={this.getUnitElement("unit_id")}
            />
            <span className="text-danger errormsg">
              {this.getUnitElement("unit_idError")}
            </span>
          </td>

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              className="td-text-box conv"
              type="text"
              placeholder="Conv."
              name={`unit_conv_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              id={`unit_conv_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              onChange={(e) => {
                let value = e.target.value;

                let key =
                  "hsn_id_" +
                  mstLevelAIndex +
                  "" +
                  mstLevelBIndex +
                  "" +
                  mstLevelCIndex +
                  "" +
                  mstUnitIndex;
                let inputElement = document.getElementById(key);
                console.warn("rahul::inputElement ", inputElement);
                if (inputElement) {
                  let inputEle = inputElement.querySelectorAll(
                    "input, select, checkbox, textarea"
                  );
                  if (inputEle) {
                    inputEle[0].focus();
                  }
                }

                this.handleUnitChange(value, "unit_conv");
              }}
              value={this.getUnitElement("unit_conv")}
              maxLength={5}
            />
          </td>

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              className={`${
                ABC_flag_value == "A" &&
                isMultiRateExist("is_multi_rates", this.props.userControl) ===
                  true
                  ? "td-text-box A_maxQty"
                  : ABC_flag_value == "A"
                  ? "td-text-box level_A_width_123"
                  : ABC_flag_value == "AB"
                  ? "td-text-box level_AB_width_124"
                  : ABC_flag_value == "ABC" &&
                    isMultiRateExist(
                      "is_multi_rates",
                      this.props.userControl
                    ) === true
                  ? "td-text-box ABC_maxQty"
                  : ABC_flag_value == "ABC"
                  ? "td-text-box level_ABC_width_maxtd"
                  : "td-text-box level_width"
              }`}
              type="text"
              placeholder="0"
              name={`max_qty_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              id={`max_qty_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              onChange={(e) => {
                let value = e.target.value;
                this.handleUnitChange(value, "max_qty");
              }}
              onKeyPress={(e) => {
                OnlyEnterNumbers(e);
              }}
              value={this.getUnitElement("max_qty")}
              // onBlur={(v) => {
              //   this.handleRateBlur(this.getUnitElement("max_qty"), "max_qty");
              // }}
            />
          </td>

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              className={`${
                ABC_flag_value == "A" &&
                isMultiRateExist("is_multi_rates", this.props.userControl) ===
                  true
                  ? "td-text-box A_maxQty"
                  : ABC_flag_value == "A"
                  ? "td-text-box level_A_width_120"
                  : ABC_flag_value == "AB" &&
                    isMultiRateExist(
                      "is_multi_rates",
                      this.props.userControl
                    ) === true
                  ? " AB_maxQty td-text-box"
                  : ABC_flag_value == "AB"
                  ? "td-text-box level_AB_width_123"
                  : ABC_flag_value == "ABC" &&
                    isMultiRateExist(
                      "is_multi_rates",
                      this.props.userControl
                    ) === true
                  ? "td-text-box ABC_minQty"
                  : ABC_flag_value == "ABC"
                  ? "td-text-box level_ABC_width_mintd"
                  : "td-text-box level_width"
              }`}
              type="text"
              placeholder="0"
              name={`min_qty_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              id={`min_qty_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              onChange={(e) => {
                let value = e.target.value;
                this.handleUnitChange(value, "min_qty");
              }}
              value={this.getUnitElement("min_qty")}
              onKeyPress={(e) => {
                OnlyEnterNumbers(e);
              }}
            />
          </td>
          {/* {JSON.stringify(isBatchNo)} */}
          {isBatchNo != true ? (
            <>
              <td
                style={{
                  padding: "0px 5px 0px 5px",
                  borderLeft: "1px solid #ECECEC",
                }}
              >
                <Form.Control
                  className={`${
                    ABC_flag_value == "A" &&
                    isMultiRateExist(
                      "is_multi_rates",
                      this.props.userControl
                    ) === true
                      ? "td-text-box A_MRP"
                      : ABC_flag_value == "A"
                      ? "td-text-box level_A_width_120"
                      : ABC_flag_value == "AB" &&
                        isMultiRateExist(
                          "is_multi_rates",
                          this.props.userControl
                        ) === true
                      ? "  AB_MRP td-text-box"
                      : ABC_flag_value == "AB"
                      ? "td-text-box level_AB_width_123"
                      : ABC_flag_value == "ABC" &&
                        isMultiRateExist(
                          "is_multi_rates",
                          this.props.userControl
                        ) === true
                      ? " ABC_MRP td-text-box"
                      : ABC_flag_value == "ABC"
                      ? "td-text-box level_ABC_width_mrp"
                      : "td-text-box level_width"
                  }`}
                  type="text"
                  placeholder="0"
                  name={`mrp_${
                    mstLevelAIndex +
                    "" +
                    mstLevelBIndex +
                    "" +
                    mstLevelCIndex +
                    "" +
                    mstUnitIndex
                  }`}
                  id={`mrp_${
                    mstLevelAIndex +
                    "" +
                    mstLevelBIndex +
                    "" +
                    mstLevelCIndex +
                    "" +
                    mstUnitIndex
                  }`}
                  onChange={(e) => {
                    let value = e.target.value;
                    this.handleUnitChange(value, "mrp");
                  }}
                  value={this.getUnitElement("mrp")}
                  onBlur={(v) => {
                    this.handleRateBlur(this.getUnitElement("mrp"), "mrp");
                  }}
                  onKeyPress={(e) => {
                    OnlyEnterNumbers(e);
                  }}
                  readOnly={isBatchNo}
                />
              </td>

              <td
                style={{
                  padding: "0px 5px 0px 5px",
                  borderLeft: "1px solid #ECECEC",
                }}
              >
                <Form.Control
                  className={`${
                    ABC_flag_value == "A" &&
                    isMultiRateExist(
                      "is_multi_rates",
                      this.props.userControl
                    ) === true
                      ? "td-text-box A_purRate"
                      : ABC_flag_value == "A"
                      ? "td-text-box level_A_width_120"
                      : ABC_flag_value == "AB" &&
                        isMultiRateExist(
                          "is_multi_rates",
                          this.props.userControl
                        ) === true
                      ? " AB_MRP td-text-box"
                      : ABC_flag_value == "AB"
                      ? "td-text-box level_AB_width_123"
                      : ABC_flag_value == "ABC" &&
                        isMultiRateExist(
                          "is_multi_rates",
                          this.props.userControl
                        ) === true
                      ? " ABC_MRP td-text-box"
                      : ABC_flag_value == "ABC"
                      ? "td-text-box level_ABC_width_118"
                      : "td-text-box level_width"
                  }`}
                  type="text"
                  placeholder="0"
                  name={`purchase_rate_${
                    mstLevelAIndex +
                    "" +
                    mstLevelBIndex +
                    "" +
                    mstLevelCIndex +
                    "" +
                    mstUnitIndex
                  }`}
                  id={`purchase_rate_${
                    mstLevelAIndex +
                    "" +
                    mstLevelBIndex +
                    "" +
                    mstLevelCIndex +
                    "" +
                    mstUnitIndex
                  }`}
                  onChange={(e) => {
                    let value = e.target.value;
                    this.handleUnitChange(value, "purchase_rate");
                  }}
                  value={this.getUnitElement("purchase_rate")}
                  onKeyPress={(e) => {
                    OnlyEnterNumbers(e);
                  }}
                  onBlur={(v) => {
                    this.handleRateBlur(
                      this.getUnitElement("purchase_rate"),
                      "purchase_rate"
                    );
                  }}
                  readOnly={isBatchNo}
                />
              </td>

              <td
                style={{
                  padding: "0px 5px 0px 5px",
                  borderLeft: "1px solid #ECECEC",
                }}
              >
                <Form.Control
                  className={`${
                    ABC_flag_value == "A" &&
                    isMultiRateExist(
                      "is_multi_rates",
                      this.props.userControl
                    ) === true
                      ? "td-text-box A_rate1"
                      : ABC_flag_value == "A"
                      ? "td-text-box level_A_width_123"
                      : ABC_flag_value == "AB" &&
                        isMultiRateExist(
                          "is_multi_rates",
                          this.props.userControl
                        ) === true
                      ? " AB_MRP td-text-box"
                      : ABC_flag_value == "AB"
                      ? "td-text-box level_AB_width_124"
                      : ABC_flag_value == "ABC" &&
                        isMultiRateExist(
                          "is_multi_rates",
                          this.props.userControl
                        ) === true
                      ? " ABC_MRP td-text-box"
                      : ABC_flag_value == "ABC"
                      ? "td-text-box level_ABC_width_119"
                      : "td-text-box level_width"
                  }`}
                  type="text"
                  placeholder="0"
                  name={`min_rate_a_${
                    mstLevelAIndex +
                    "" +
                    mstLevelBIndex +
                    "" +
                    mstLevelCIndex +
                    "" +
                    mstUnitIndex
                  }`}
                  id={`min_rate_a_${
                    mstLevelAIndex +
                    "" +
                    mstLevelBIndex +
                    "" +
                    mstLevelCIndex +
                    "" +
                    mstUnitIndex
                  }`}
                  onChange={(e) => {
                    let value = e.target.value;
                    this.handleUnitChange(value, "min_rate_a");
                  }}
                  value={this.getUnitElement("min_rate_a")}
                  onKeyPress={(e) => {
                    OnlyEnterNumbers(e);
                  }}
                  onBlur={(v) => {
                    this.handleRateBlur(
                      this.getUnitElement("min_rate_a"),
                      "min_rate_a"
                    );
                  }}
                  readOnly={isBatchNo}
                />
              </td>

              {isMultiRateExist("is_multi_rates", this.props.userControl) && (
                <td
                  style={{
                    padding: "0px 5px 0px 5px",
                    borderLeft: "1px solid #ECECEC",
                  }}
                >
                  <Form.Control
                    className={`${
                      ABC_flag_value == "A" &&
                      isMultiRateExist(
                        "is_multi_rates",
                        this.props.userControl
                      ) === true
                        ? "td-text-box A_rate1"
                        : ABC_flag_value == "A"
                        ? "td-text-box level_A_width_123"
                        : ABC_flag_value == "AB" &&
                          isMultiRateExist(
                            "is_multi_rates",
                            this.props.userControl
                          ) === true
                        ? " AB_MRP td-text-box"
                        : ABC_flag_value == "AB"
                        ? "td-text-box level_AB_width_124"
                        : ABC_flag_value == "ABC" &&
                          isMultiRateExist(
                            "is_multi_rates",
                            this.props.userControl
                          ) === true
                        ? " ABC_MRP td-text-box"
                        : ABC_flag_value == "ABC"
                        ? "td-text-box level_ABC_width_119"
                        : "td-text-box level_width"
                    }`}
                    type="text"
                    placeholder="0"
                    name={`min_rate_b_${
                      mstLevelAIndex +
                      "" +
                      mstLevelBIndex +
                      "" +
                      mstLevelCIndex +
                      "" +
                      mstUnitIndex
                    }`}
                    id={`min_rate_b_${
                      mstLevelAIndex +
                      "" +
                      mstLevelBIndex +
                      "" +
                      mstLevelCIndex +
                      "" +
                      mstUnitIndex
                    }`}
                    onChange={(e) => {
                      let value = e.target.value;
                      this.handleUnitChange(value, "min_rate_b");
                    }}
                    value={this.getUnitElement("min_rate_b")}
                    onKeyPress={(e) => {
                      OnlyEnterNumbers(e);
                    }}
                    onBlur={(v) => {
                      this.handleRateBlur(
                        this.getUnitElement("min_rate_b"),
                        "min_rate_b"
                      );
                    }}
                    readOnly={isBatchNo}
                  />
                </td>
              )}

              {isMultiRateExist("is_multi_rates", this.props.userControl) && (
                <td
                  style={{
                    padding: "0px 5px 0px 5px",
                    borderLeft: "1px solid #ECECEC",
                  }}
                >
                  <Form.Control
                    className={`${
                      ABC_flag_value == "A" &&
                      isMultiRateExist(
                        "is_multi_rates",
                        this.props.userControl
                      ) === true
                        ? "td-text-box A_rate1"
                        : ABC_flag_value == "A"
                        ? "td-text-box level_A_width_123"
                        : ABC_flag_value == "AB" &&
                          isMultiRateExist(
                            "is_multi_rates",
                            this.props.userControl
                          ) === true
                        ? " AB_MRP td-text-box"
                        : ABC_flag_value == "AB"
                        ? "td-text-box level_AB_width_124"
                        : ABC_flag_value == "ABC" &&
                          isMultiRateExist(
                            "is_multi_rates",
                            this.props.userControl
                          ) === true
                        ? " ABC_MRP td-text-box"
                        : ABC_flag_value == "ABC"
                        ? "td-text-box level_ABC_width_119"
                        : "td-text-box level_width"
                    }`}
                    type="text"
                    placeholder="0"
                    name={`min_rate_c_${
                      mstLevelAIndex +
                      "" +
                      mstLevelBIndex +
                      "" +
                      mstLevelCIndex +
                      "" +
                      mstUnitIndex
                    }`}
                    id={`min_rate_c_${
                      mstLevelAIndex +
                      "" +
                      mstLevelBIndex +
                      "" +
                      mstLevelCIndex +
                      "" +
                      mstUnitIndex
                    }`}
                    onChange={(e) => {
                      let value = e.target.value;
                      this.handleUnitChange(value, "min_rate_c");
                    }}
                    onKeyPress={(e) => {
                      OnlyEnterNumbers(e);
                    }}
                    value={this.getUnitElement("min_rate_c")}
                    onBlur={(v) => {
                      this.handleRateBlur(
                        this.getUnitElement("min_rate_c"),
                        "min_rate_c"
                      );
                    }}
                    readOnly={isBatchNo}
                  />
                </td>
              )}
            </>
          ) : (
            <></>
          )}

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              className="td-text-box unit-con-width"
              type="text"
              placeholder="0"
              name={`cost_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              id={`cost_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              onChange={(e) => {
                let value = e.target.value;

                this.handleUnitChange(value, "cost");
              }}
              value={this.getUnitElement("cost")}
              maxLength={5}
              readOnly
            />
          </td>

          <td
            style={{
              padding: "0px 5px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Control
              className={`${
                ABC_flag_value == "A" &&
                isMultiRateExist("is_multi_rates", this.props.userControl) ===
                  true
                  ? "td-text-box A_rate1"
                  : ABC_flag_value == "A"
                  ? "td-text-box level_A_width_123"
                  : ABC_flag_value == "AB" &&
                    isMultiRateExist(
                      "is_multi_rates",
                      this.props.userControl
                    ) === true
                  ? " AB_MRP td-text-box"
                  : ABC_flag_value == "AB"
                  ? "td-text-box level_AB_width_124"
                  : ABC_flag_value == "ABC" &&
                    isMultiRateExist(
                      "is_multi_rates",
                      this.props.userControl
                    ) === true
                  ? " ABC_MRP td-text-box"
                  : ABC_flag_value == "ABC"
                  ? "td-text-box level_ABC_width_stock"
                  : "td-text-box level_width"
              }`}
              type="text"
              placeholder="0"
              name={`opening_qty_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              id={`opening_qty_${
                mstLevelAIndex +
                "" +
                mstLevelBIndex +
                "" +
                mstLevelCIndex +
                "" +
                mstUnitIndex
              }`}
              // onChange={(e) => {
              //   let value = e.target.value;
              //   this.handleUnitChange(value, "opening_qty");
              // }}
              onInput={(e) => {
                let b =
                  isInventory == true
                    ? handleOpnStockModalShow(
                        true,
                        mstLevelAIndex,
                        mstLevelBIndex,
                        mstLevelCIndex,
                        mstUnitIndex
                      )
                    : "";
              }}
              onClick={(e) => {
                console.log("isInventory", isInventory);
                let a =
                  isInventory == true
                    ? handleOpnStockModalShow(
                        true,
                        mstLevelAIndex,
                        mstLevelBIndex,
                        mstLevelCIndex,
                        mstUnitIndex
                      )
                    : "";
              }}
              value={this.getUnitElement("opening_qty")}
              // onBlur={(v) => {
              //   this.handleDiscountBlur(
              //     this.getUnitElement("opening_qty"),
              //     "opening_qty"
              //   );
              // }}
              readOnly={isBatchNo}
            />
          </td>
          <td
            className="switch-box-style"
            style={{
              padding: "0px 0px 0px 5px",
              borderLeft: "1px solid #ECECEC",
            }}
          >
            <Form.Check
              type="switch"
              id="isNegativeStocks"
              name="isNegativeStocks"
              checked={this.getUnitElement("isNegativeStocks") == 1 ? 1 : 0}
              onChange={(e) => {
                let value = e.target.checked;
                this.handleUnitChange(
                  value == true ? 1 : 0,
                  "isNegativeStocks"
                );
              }}
              value={this.getUnitElement("isNegativeStocks")}
              label=""
              style={{ marginTop: "5px", width: "20px" }}
            />
            <span>{this.getUnitElement("isNegativeStocksError")}</span>
          </td>
        </tr>
      </>
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

export default connect(mapStateToProps, mapActionsToProps)(NewUnitLevel);
