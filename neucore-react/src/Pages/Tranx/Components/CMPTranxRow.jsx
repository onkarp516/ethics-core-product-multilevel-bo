import React, { Component } from "react";
import Select from "react-select";
import add_product_btn from "@/assets/images/add_product_btn.svg";
import CMPTranxBrand from "./CMPTranxBrand";
import { eventBus } from "@/helpers";

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadSideVirus,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
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
    width: 125,
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

export default class CMPTranxRow extends Component {
  constructor(props) {
    super(props);
  }

  handleClearProduct = () => {};
  handleProductSelectChange = (value) => {
    let { rows, rowIndex, handleRowStateChange, getProductPackageLst } =
      this.props;
    rows[rowIndex]["productId"] = value;

    handleRowStateChange(rows);
    if (value && value != "" && value != null) {
      getProductPackageLst(value.value, rowIndex);
    }
  };

  getProductValue = (rowIndex, element) => {
    let { rows } = this.props;
    return rows ? rows[rowIndex][element] : "";
  };

  handleAddProduct = () => {
    let { rows, handleMstState, rowIndex } = this.props;
    let single_product = {
      productId: "",
      details_id: "",
      brandDetails: [
        {
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
        },
      ],
      dis_per_cal: 0,
      dis_amt_cal: 0,
      total_amt: 0,
      total_b_amt: 0,

      gst: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      total_igst: 0,
      total_cgst: 0,
      total_sgst: 0,
      final_amt: 0,
      serialNo: [],
      discount_proportional_cal: 0,
      additional_charges_proportional_cal: 0,
      reference_id: "",
      reference_type: "",
      isBrand: false,
      isGroup: false,
      isCategory: false,
      isSubCategory: false,
      isPackage: false,
    };
    rows.push(single_product);

    handleMstState(rows);
  };

  handleRemoveProduct1 = (
    rowIndex,
    brandIndex,
    groupIndex,
    categoryIndex,
    subcategoryIndex,
    packageIndex,
    unitIndex
  ) => {
    let { handleClearProduct } = this.props;

    handleClearProduct(
      rowIndex,
      brandIndex,
      groupIndex,
      categoryIndex,
      subcategoryIndex,
      packageIndex,
      unitIndex
    );
  };

  handleRemoveProduct = (rowIndex) => {
    let { rows, handleClearProduct, rowDelDetailsIds } = this.props;
    console.log("rows", rows, rowIndex);
    let deletedRow = rows.filter((v, i) => i === rowIndex);
    console.warn("rahul::deletedRow ", deletedRow, rowDelDetailsIds);

    if (deletedRow) {
      deletedRow.map((pv, pi) => {
        console.log(pv);
        pv.brandDetails.map((bv, bi) => {
          bv.groupDetails.map((gv, gi) => {
            gv.categoryDetails.map((cv, ci) => {
              cv.subcategoryDetails.map((scv, sci) => {
                scv.packageDetails.map((pv, pi) => {
                  pv.unitDetails.map((uv, ui) => {
                    console.log(
                      "details_id --------------->>>>",
                      uv.details_id
                    );

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
      });
    }

    rows = rows.filter((v, i) => i != rowIndex);
    console.warn("rahul::rows ", rows);
    handleClearProduct(rows);
  };

  render() {
    let { rows, rowData, rowIndex, productLst, isDisabled } = this.props;

    return (
      <>
        <tr style={{ borderBottom: "1px solid #dee4eb" }}>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            <>
              <Button
                className="rowPlusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleAddProduct();
                }}
                disabled={
                  rowData && rowData.productId && rowData.productId != ""
                    ? rowData.isPurchaseReturn === true
                      ? true
                      : false
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

                  console.warn("rahul::row", rowIndex, rows);

                  this.handleRemoveProduct(rowIndex);
                }}
                disabled={rows.length <= 1}
              >
                <FontAwesomeIcon icon={faMinus} className="minus-color" />
              </Button>
            </>
          </td>
          <td style={{ padding: "0px 5px 0px 5px" }}>
            <Select
              id={`productId-${rowIndex}`}
              name={`productId-${rowIndex}`}
              className="prd-dd-style "
              menuPlacement="auto"
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              placeholder="Select"
              styles={newRowDropdown}
              options={productLst}
              colors="#729"
              onChange={(value, triggeredAction) => {
                if (triggeredAction.action === "clear") {
                  this.handleClearProduct();
                } else {
                  this.handleProductSelectChange(value);
                }
              }}
              isDisabled={rowData.isPurchaseReturn === true ? true : false}
              value={rowData.productId}
            />
            {/* )} */}
          </td>
          <td
            colSpan={28}
            // className="rwht"
            style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}
          >
            <>
              {rowData.brandDetails &&
                rowData.brandDetails.length > 0 &&
                rowData.brandDetails.map((v, i) => {
                  return (
                    <>
                      <CMPTranxBrand
                        brandIndex={i}
                        brandData={v}
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
