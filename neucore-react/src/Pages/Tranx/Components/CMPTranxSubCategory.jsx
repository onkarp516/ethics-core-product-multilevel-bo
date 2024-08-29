import React, { Component } from "react";
import Select from "react-select";
import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import { purchaseInvSelect } from "@/helpers";

import CMPTranxPackage from "./CMPTranxPackage";

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
    width: 100,
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

export default class CMPTranxSubCategory extends Component {
  constructor(props) {
    super(props);
  }

  getsubcategoryOpt = (rowIndex, brandIndex, categoryIndex, groupIndex) => {
    let { rows } = this.props;
    let opt = rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"][categoryIndex]["categoryId"]
      ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
          "categoryDetails"
        ][categoryIndex]["categoryId"]["subcategoryOpt"]
      : [];
    return opt;
  };

  handleSubcategoryChange = (
    value,
    rowIndex = -1,
    brandIndex = -1,
    groupIndex = -1,
    categoryIndex = -1,
    subcategoryIndex = -1
  ) => {
    let { rows, handleRowStateChange } = this.props;

    if (value != "") {
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
        "subcategoryId"
      ] = value;

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
        "packageDetails"
      ][0]["packageId"] = value["packageOpt"][0];

      handleRowStateChange(rows);
    }
  };

  handleAddSubCategory = () => {
    let {
      rows,
      handleMstState,
      rowIndex,
      brandIndex,
      groupIndex,
      categoryIndex,
    } = this.props;
    let single_sub_category = {
      subcategoryId: "",
      packageDetails: [
        {
          packageId: "",
          unitDetails: [
            {
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
            },
          ],
        },
      ],
    };

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ][categoryIndex]["subcategoryDetails"] = [
      ...rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"],
      single_sub_category,
    ];

    handleMstState(rows);
  };

  handleRemoveSubCategory = (
    rowIndex,
    brandIndex,
    groupIndex,
    categoryIndex,
    subcategoryIndex
  ) => {
    let { rows, handleClearProduct, rowDelDetailsIds } = this.props;

    let deletedRow = rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"][categoryIndex]["subcategoryDetails"].filter(
      (v, i) => i === subcategoryIndex
    );
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((scv, sci) => {
        scv.packageDetails.map((pv, pi) => {
          pv.unitDetails.map((uv, ui) => {
            console.log("details_id --------------->>>>", uv.details_id);
            if (uv.details_id > 0) {
              if (!rowDelDetailsIds.includes(uv.details_id)) {
                rowDelDetailsIds.push(uv.details_id);
              }
            }
          });
        });
      });
    }

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ][categoryIndex]["subcategoryDetails"] =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"].length > 1
        ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"].filter(
            (v, i) => i != subcategoryIndex
          )
        : rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"];
    console.warn("rahul::rows ", rows);
    handleClearProduct(rows);
  };

  render() {
    let {
      subcategoryData,
      rowData,
      rowIndex,
      brandIndex,
      groupIndex,
      categoryIndex,
      subcategoryIndex,
      isSubCategory,
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
                  this.handleAddSubCategory();
                }}
                disabled={
                  rowData && rowData.isPurchaseReturn === true
                    ? true
                    : rowData.isSubCategory === false
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
                  this.handleRemoveSubCategory(
                    rowIndex,
                    brandIndex,
                    groupIndex,
                    categoryIndex,
                    subcategoryIndex
                  );
                }}
                disabled={
                  subcategoryIndex > 0
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
                name={`subcategoryId-${
                  rowIndex +
                  "" +
                  brandIndex +
                  "" +
                  groupIndex +
                  "" +
                  categoryIndex +
                  "" +
                  subcategoryIndex
                }`}
                id={`subcategoryId-${
                  rowIndex +
                  "" +
                  brandIndex +
                  "" +
                  groupIndex +
                  "" +
                  categoryIndex +
                  "" +
                  subcategoryIndex
                }`}
                className="prd-dd-style "
                styles={newRowDropdown}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder=""
                options={this.getsubcategoryOpt(
                  rowIndex,
                  brandIndex,
                  categoryIndex,
                  groupIndex
                )}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handleSubcategoryChange("");
                  } else {
                    this.handleSubcategoryChange(
                      v,
                      rowIndex,
                      brandIndex,
                      groupIndex,
                      categoryIndex,
                      subcategoryIndex
                    );
                  }
                }}
                value={subcategoryData.subcategoryId}
                isDisabled={
                  rows[rowIndex]["isSubCategory"] == false
                    ? true
                    : rowData.isPurchaseReturn === true
                    ? true
                    : false
                }
              />
            </>
          </td>

          {/* {JSON.stringify(subcategoryData)} */}
          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            <>
              {subcategoryData &&
                subcategoryData.packageDetails &&
                subcategoryData.packageDetails.length > 0 &&
                subcategoryData.packageDetails.map((v, i) => {
                  return (
                    <>
                      <CMPTranxPackage
                        packageIndex={i}
                        packageData={v}
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
