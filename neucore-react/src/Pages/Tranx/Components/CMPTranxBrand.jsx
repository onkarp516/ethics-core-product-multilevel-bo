import React, { Component } from "react";
import Select from "react-select";
import { purchaseInvSelect, getSelectValue } from "@/helpers";

import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import CMPTranxGroup from "./CMPTranxGroup";
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
    width: 115,
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

export default class CMPTranxBrand extends Component {
  constructor(props) {
    super(props);
  }
  getBrandOpt = (rowIndex) => {
    let { lstBrand, rows } = this.props;
    let productId = rows[rowIndex]["productId"]
      ? rows[rowIndex]["productId"]["value"]
      : "";
    let isExist = getSelectValue(lstBrand, productId);
    if (isExist) {
      return isExist.brandOpt;
    }
    // console.log("lstPackages, rowIndex", { lstPackages, rowIndex });
  };

  handleBrandChangeOld = (value) => {
    let { rows, rowIndex, handleRowStateChange, brandIndex } = this.props;
    rows[rowIndex]["brandDetails"][brandIndex]["brandId"] = value;

    handleRowStateChange(rows);
  };

  handleBrandChange = (value, rowIndex = -1, brandIndex = -1) => {
    let { rows, handleRowStateChange, lstBrand } = this.props;

    console.warn("rahul::value", value);

    if (value != "") {
      rows[rowIndex]["brandDetails"][brandIndex]["brandId"] = value;

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][0]["groupId"] =
        value["groupOpt"][0];

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][0][
        "categoryDetails"
      ][0]["categoryId"] = value["groupOpt"][0]["categoryOpt"][0];

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][0][
        "categoryDetails"
      ][0]["subcategoryDetails"][0]["subcategoryId"] =
        value["groupOpt"][0]["categoryOpt"][0]["subcategoryOpt"][0];

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][0][
        "categoryDetails"
      ][0]["subcategoryDetails"][0]["packageDetails"][0]["packageId"] =
        value["groupOpt"][0]["categoryOpt"][0]["subcategoryOpt"][0][
          "packageOpt"
        ][0];

      handleRowStateChange(rows);
    }
  };
  handleAddBrand = () => {
    let { rows, handleMstState, rowIndex } = this.props;
    let single_brand = {
      details_id: 0,
      brandId: "",
      groupDetails: [
        {
          groupId: "",
          categoryDetails: [
            {
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
            },
          ],
        },
      ],
    };
    rows[rowIndex]["brandDetails"] = [
      ...rows[rowIndex]["brandDetails"],
      single_brand,
    ];

    handleMstState(rows);
  };

  handleRemoveBrand = (rowIndex, brandIndex) => {
    let { rows, handleClearProduct, rowDelDetailsIds } = this.props;

    let deletedRow = rows[rowIndex]["brandDetails"].filter(
      (v, i) => i === brandIndex
    );
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((bv, bi) => {
        bv.groupDetails.map((gv, gi) => {
          gv.categoryDetails.map((cv, ci) => {
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
        });
      });
    }

    rows[rowIndex]["brandDetails"] =
      rows[rowIndex]["brandDetails"].length > 1
        ? rows[rowIndex]["brandDetails"].filter((v, i) => i != brandIndex)
        : rows[rowIndex]["brandDetails"];

    console.warn("rahul::rows ", rows);

    handleClearProduct(rows);
  };

  getBrandValue = (rowIndex, brandIndex, element) => {
    let { rows } = this.props;
    return rows ? rows[rowIndex]["brandDetails"][brandIndex][element] : "";
  };

  render() {
    let { brandData, rowIndex, brandIndex, rowData, isBrand, rows } =
      this.props;
    return (
      <>
        <tr>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            <>
              <Button
                className="rowPlusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleAddBrand();
                }}
                disabled={
                  rowData && rowData.isPurchaseReturn === true
                    ? true
                    : rowData.isBrand === false
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
                  this.handleRemoveBrand(rowIndex, brandIndex);
                }}
                disabled={
                  brandIndex > 0
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
                isDisabled={
                  rows[rowIndex]["isBrand"] == false
                    ? true
                    : rowData.isPurchaseReturn === true
                    ? true
                    : false
                }
                name={`brandId-${rowIndex + "" + brandIndex}`}
                id={`brandId-${rowIndex + "" + brandIndex}`}
                className="prd-dd-style "
                styles={newRowDropdown}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder=" "
                options={this.getBrandOpt(rowIndex)}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handleBrandChange("");
                  } else {
                    this.handleBrandChange(v, rowIndex, brandIndex);
                  }
                }}
                value={brandData.brandId}
              />
            </>
            {/* )} */}
          </td>
          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {brandData &&
              brandData.groupDetails &&
              brandData.groupDetails.length > 0 &&
              brandData.groupDetails.map((v, i) => {
                return (
                  <CMPTranxGroup groupIndex={i} groupData={v} {...this.props} />
                );
              })}
          </td>
        </tr>
      </>
    );
  }
}
