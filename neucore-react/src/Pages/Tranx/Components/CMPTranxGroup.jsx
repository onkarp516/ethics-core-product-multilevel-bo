import React, { Component } from "react";
import Select from "react-select";

import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import { purchaseInvSelect } from "@/helpers";

import CMPTranxCategory from "./CMPTranxCategory";

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

export default class CMPTranxGroup extends Component {
  constructor(props) {
    super(props);
  }

  getGroupOpt = (rowIndex, brandIndex) => {
    let { rows } = this.props;

    // console.warn("rahul::getPackageOpt >>>>>>>>>>>>>>>>>", {
    //   rows,
    //   rowIndex,
    //   brandIndex,
    // });
    let opt = rows[rowIndex]["brandDetails"][brandIndex]["brandId"]
      ? rows[rowIndex]["brandDetails"][brandIndex]["brandId"]["groupOpt"]
      : [];
    return opt;
  };

  handleGroupChange = (
    value,
    rowIndex = -1,
    brandIndex = -1,
    groupIndex = -1
  ) => {
    let { rows, handleRowStateChange } = this.props;

    if (value != "") {
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "groupId"
      ] = value;

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][0]["categoryId"] = value["categoryOpt"][0];

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][0]["subcategoryDetails"][0]["subcategoryId"] =
        value["categoryOpt"][0]["subcategoryOpt"][0];

      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][0]["subcategoryDetails"][0]["packageDetails"][0]["packageId"] =
        value["categoryOpt"][0]["subcategoryOpt"][0]["packageOpt"][0];

      handleRowStateChange(rows);
    }
  };

  handleAddGroup = () => {
    let { rows, handleMstState, rowIndex, brandIndex } = this.props;
    let single_group = {
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
    };

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"] = [
      ...rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"],
      single_group,
    ];

    handleMstState(rows);
  };

  handleRemoveGroup = (rowIndex, brandIndex, groupIndex) => {
    let { rows, handleClearProduct, rowDelDetailsIds } = this.props;

    let deletedRow = rows[rowIndex]["brandDetails"][brandIndex][
      "groupDetails"
    ].filter((v, i) => i === groupIndex);
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((gv, gi) => {
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
    }

    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"] =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"].length > 1
        ? rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"].filter(
            (v, i) => i != groupIndex
          )
        : rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"];
    handleClearProduct(rows);
  };

  render() {
    let {
      groupData,
      rowData,
      rowIndex,
      brandIndex,
      groupIndex,
      rows,
      isGroup,
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
                  this.handleAddGroup();
                }}
                disabled={
                  rowData && rowData.isPurchaseReturn === true
                    ? true
                    : rowData.isGroup === false
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
                  this.handleRemoveGroup(rowIndex, brandIndex, groupIndex);
                }}
                disabled={
                  groupIndex > 0
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
                  rows[rowIndex]["isGroup"] == false
                    ? true
                    : rowData.isPurchaseReturn === true
                    ? true
                    : false
                }
                id={`groupId-${rowIndex + "" + brandIndex + "" + groupIndex}`}
                name={`groupId-${rowIndex + "" + brandIndex + "" + groupIndex}`}
                className="prd-dd-style "
                styles={newRowDropdown}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder=" "
                options={this.getGroupOpt(rowIndex, brandIndex)}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handleGroupChange("");
                  } else {
                    this.handleGroupChange(v, rowIndex, brandIndex, groupIndex);
                  }
                }}
                value={groupData.groupId}
              />
            </>
            {/* )} */}
          </td>

          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            <>
              {groupData &&
                groupData.categoryDetails &&
                groupData.categoryDetails.length > 0 &&
                groupData.categoryDetails.map((v, i) => {
                  return (
                    <>
                      <CMPTranxCategory
                        categoryIndex={i}
                        categoryData={v}
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
