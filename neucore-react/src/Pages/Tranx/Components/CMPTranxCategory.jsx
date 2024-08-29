import React, { Component } from "react";
import Select from "react-select";

import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import { purchaseInvSelect } from "@/helpers";

import CMPTranxSubCategory from "./CMPTranxSubCategory";
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

export default class CMPTranxCategory extends Component {
  constructor(props) {
    super(props);
  }

  getCategoryOpt = (rowIndex, brandIndex, groupIndex) => {
    let { rows } = this.props;
    let opt = rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["groupId"]
      ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
          "groupId"
        ]["categoryOpt"]
      : [];
    return opt;
  };

  handleCategoryChange = (
    value,
    rowIndex = -1,
    brandIndex = -1,
    groupIndex = -1,
    categoryIndex = -1
  ) => {
    let { rows, handleRowStateChange } = this.props;

    if (value != "") {
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["categoryId"] = value;

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][0]["subcategoryId"] =
        value["subcategoryOpt"][0];

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][0]["packageDetails"][0][
        "packageId"
      ] = value["subcategoryOpt"][0]["packageOpt"][0];

      handleRowStateChange(rows);
    }
  };

  handleAddCategory = () => {
    let { rows, handleMstState, rowIndex, brandIndex, groupIndex } = this.props;
    let single_category = {
      categoryId: "",
      subcategoryDetails: [
        {
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
        },
      ],
    };

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ] = [
      ...rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ],
      single_category,
    ];

    handleMstState(rows);
  };

  handleRemoveCategory = (rowIndex, brandIndex, groupIndex, categoryIndex) => {
    let { rows, handleClearProduct, rowDelDetailsIds } = this.props;

    let deletedRow = rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
      groupIndex
    ]["categoryDetails"].filter((v, i) => i === categoryIndex);
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((cv, ci) => {
        cv.subcategoryDetails.map((scv, sci) => {
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
      });
    }

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
      "categoryDetails"
    ] =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ].length > 1
        ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"].filter((v, i) => i != categoryIndex)
        : rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"];
    console.warn("rahul::rows ", rows);
    handleClearProduct(rows);
  };

  render() {
    let {
      categoryData,
      rowData,
      rowIndex,
      brandIndex,
      groupIndex,
      categoryIndex,
      isCategory,
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
                  this.handleAddCategory();
                }}
                disabled={
                  rowData && rowData.isPurchaseReturn === true
                    ? true
                    : rowData.isCategory === false
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
                  this.handleRemoveCategory(
                    rowIndex,
                    brandIndex,
                    groupIndex,
                    categoryIndex
                  );
                }}
                disabled={
                  categoryIndex > 0
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
            {/* {rowData && rowData.productId && rowData.productId != "" && ( */}
            <>
              <Select
                name={`categoryId-${
                  rowIndex +
                  "" +
                  brandIndex +
                  "" +
                  groupIndex +
                  "" +
                  categoryIndex
                }`}
                id={`categoryId-${
                  rowIndex +
                  "" +
                  brandIndex +
                  "" +
                  groupIndex +
                  "" +
                  categoryIndex
                }`}
                className="prd-dd-style "
                styles={newRowDropdown}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder=" "
                options={this.getCategoryOpt(rowIndex, brandIndex, groupIndex)}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handleCategoryChange("");
                  } else {
                    this.handleCategoryChange(
                      v,
                      rowIndex,
                      brandIndex,
                      groupIndex,
                      categoryIndex
                    );
                  }
                }}
                value={categoryData.categoryId}
                isDisabled={
                  rows[rowIndex]["isCategory"] == false
                    ? true
                    : rowData.isPurchaseReturn === true
                    ? true
                    : false
                }
              />
            </>
            {/* )} */}
          </td>

          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            <>
              {categoryData &&
                categoryData.subcategoryDetails &&
                categoryData.subcategoryDetails.length > 0 &&
                categoryData.subcategoryDetails.map((v, i) => {
                  return (
                    <>
                      <CMPTranxSubCategory
                        subcategoryIndex={i}
                        subcategoryData={v}
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
