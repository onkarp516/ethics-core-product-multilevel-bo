import React, { Component } from "react";
import Select from "react-select";

import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import { purchaseInvSelect } from "@/helpers";

import CMPTranxUnit from "./CMPTranxUnit";

import { Button } from "react-bootstrap";
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
    width: 70,
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

export default class CMPTranxPackage extends Component {
  constructor(props) {
    super(props);
  }

  getPackageOpt = (
    rowIndex,
    brandIndex,
    categoryIndex,
    subcategoryIndex,
    groupIndex
  ) => {
    let { rows } = this.props;

    let opt = rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][subcategoryIndex][
      "subcategoryId"
    ]
      ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
          "categoryDetails"
        ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
          "subcategoryId"
        ]["packageOpt"]
      : [];

    return opt;
  };

  handlePackageChange = (value) => {
    let {
      rows,
      rowIndex,
      handleRowStateChange,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      packageIndex,
      groupIndex,
    } = this.props;
    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ][categoryIndex]["subcategoryDetails"][subcategoryIndex]["packageDetails"][
      packageIndex
    ]["packageId"] = value;

    handleRowStateChange(rows);
  };

  handleAddPackage = () => {
    let {
      rows,
      handleMstState,
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      groupIndex,
    } = this.props;
    let single_package = {
      packageId: "",
      unitDetails: [
        {
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
        },
      ],
    };

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ][categoryIndex]["subcategoryDetails"][subcategoryIndex]["packageDetails"] =
      [
        ...rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
          groupIndex
        ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
          subcategoryIndex
        ]["packageDetails"],
        single_package,
      ];

    handleMstState(rows);
  };

  handleRemovePackaging = (
    rowIndex,
    brandIndex,
    groupIndex,
    categoryIndex,
    subcategoryIndex,
    packageIndex
  ) => {
    let { rows, handleClearProduct, rowDelDetailsIds } = this.props;

    let deletedRow = rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][subcategoryIndex][
      "packageDetails"
    ].filter((v, i) => i != packageIndex);
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((pv, pi) => {
        pv.unitDetails.map((uv, ui) => {
          console.log("details_id --------------->>>>", uv.details_id);
          if (uv.details_id > 0) {
            if (!rowDelDetailsIds.includes(uv.details_id)) {
              rowDelDetailsIds.push(uv.details_id);
            }
          }
        });
      });
    }

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ][categoryIndex]["subcategoryDetails"][subcategoryIndex]["packageDetails"] =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][subcategoryIndex]["packageDetails"]
        .length > 1
        ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"].filter((v, i) => i != packageIndex)
        : rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"];
    console.warn("rahul::rows ", rows);
    handleClearProduct(rows);
  };

  getPackageValue = (
    rowIndex,
    brandIndex,
    categoryIndex,
    subcategoryIndex,
    flavourIndex,
    packageIndex,
    element
  ) => {
    let { rows } = this.props;
    return rows
      ? rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
          categoryIndex
        ]["subcategoryDetails"][subcategoryIndex]["packageDetails"][
          packageIndex
        ][element]
      : "";
  };

  render() {
    let {
      packageData,
      rowData,
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      groupIndex,
      packageIndex,
      isPackage,
      rows,
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
                  this.handleAddPackage();
                }}
                disabled={
                  rowData && rowData.isPurchaseReturn === true
                    ? true
                    : rowData.isPackage === false
                    ? true
                    : false
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
                  this.handleRemovePackaging(
                    rowIndex,
                    brandIndex,
                    groupIndex,
                    categoryIndex,
                    subcategoryIndex,
                    packageIndex
                  );
                }}
                disabled={
                  packageIndex > 0
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
                id={`packageId-${
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
                  packageIndex
                }`}
                name={`packageId-${
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
                  packageIndex
                }`}
                className="prd-dd-style "
                styles={newRowDropdown}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder=" "
                options={this.getPackageOpt(
                  rowIndex,
                  brandIndex,
                  categoryIndex,
                  subcategoryIndex,
                  groupIndex
                )}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handlePackageChange("");
                  } else {
                    this.handlePackageChange(v);
                  }
                }}
                value={packageData.packageId}
                isDisabled={
                  rows[rowIndex]["isPackage"] == false
                    ? true
                    : rowData.isPurchaseReturn === true
                    ? true
                    : false
                }
              />
            </>
          </td>

          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            <>
              {packageData &&
                packageData.unitDetails &&
                packageData.unitDetails.length > 0 &&
                packageData.unitDetails.map((v, i) => {
                  return (
                    <>
                      <CMPTranxUnit
                        unitIndex={i}
                        unitData={v}
                        {...this.props}
                      />
                    </>
                  );
                })}
            </>
          </td>
        </tr>
      </>
    );
  }
}
