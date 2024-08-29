import React, { Component } from "react";
import Select from "react-select";

import { purchaseInvSelect } from "@/helpers";
import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";

import CMPTranxPackage from "./CMPTranxPackage";

export default class CMPTranxFlavour extends Component {
  constructor(props) {
    super(props);
  }

  getFlavourOpt = () => {
    let { rows, rowIndex, brandIndex, categoryIndex, subcategoryIndex } =
      this.props;
    let opt = rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
      categoryIndex
    ]["subcategoryDetails"][subcategoryIndex]["subCategoryId"]
      ? rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
          categoryIndex
        ]["subcategoryDetails"][subcategoryIndex]["subCategoryId"]["flavourOpt"]
      : [];
    return opt;
  };

  handleFlavourChange = (value) => {
    let {
      rows,
      rowIndex,
      handleRowStateChange,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      flavourIndex,
    } = this.props;
    rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
      categoryIndex
    ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][flavourIndex][
      "flavourId"
    ] = value;

    handleRowStateChange(rows);
  };

  handleAddFlavour = () => {
    let {
      rows,
      handleMstState,
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
    } = this.props;
    let single_brand = {
      flavourId: "",
      packageDetails: [
        {
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
        },
      ],
    };

    rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
      categoryIndex
    ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"] = [
      ...rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
        categoryIndex
      ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"],
      single_brand,
    ];

    handleMstState(rows);
  };
  handleRemoveFlavour = () => {
    let {
      rows,
      handleMstState,
      brandIndex,
      rowIndex,
      categoryIndex,
      subcategoryIndex,
      flavourIndex,
    } = this.props;
    rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
      categoryIndex
    ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"] =
      rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
        categoryIndex
      ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"].length > 1
        ? rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"].filter(
            (v, i) => i != flavourIndex
          )
        : rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"];
    handleMstState(rows);
  };

  getFlavourValue = (
    rowIndex,
    brandIndex,
    categoryIndex,
    subcategoryIndex,
    flavourIndex,
    element
  ) => {
    let { rows } = this.props;
    return rows
      ? rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
          categoryIndex
        ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
          flavourIndex
        ][element]
      : "";
  };

  render() {
    let {
      flavourData,
      rowData,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      flavourIndex,
      rowIndex,
    } = this.props;
    return (
      <>
        {/* <tr> */}
        <td style={{ padding: "0", width: "1.5%" }}>
          {rowData && rowData.productId && rowData.productId != "" && (
            <>
              <img
                src={plus_img}
                alt=""
                style={{ marginTop: "13px" }}
                onClick={(e) => {
                  e.preventDefault();
                  this.handleAddFlavour();
                }}
              />
            </>
          )}
        </td>
        <td style={{ padding: "0px", width: "1.5%" }}>
          {rowData && rowData.productId && rowData.productId != "" && (
            <>
              <img
                src={minus_img}
                style={{ marginTop: "13px" }}
                onClick={(e) => {
                  e.preventDefault();
                  this.handleRemoveFlavour();
                }}
              />
            </>
          )}
        </td>
        <td
          // className="d-none"
          style={{
            // borderLeft: "1px solid #9da2b4",
            width: "12%",
            // padding: "0px 5px 0px 0px !important",
            // width: "10%",
          }}
          className="padding-style"
        >
          {rowData && rowData.productId && rowData.productId != "" && (
            <>
              <Select
                className="selectTo selectdd"
                styles={purchaseInvSelect}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder=" "
                options={this.getFlavourOpt()}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handleFlavourChange("");
                  } else {
                    this.handleFlavourChange(v);
                  }
                }}
                value={flavourData.flavourId}
              />
            </>
          )}
        </td>

        <td style={{ width: "85%", padding: "0" }}>
          <>
            {flavourData &&
              flavourData.packageDetails &&
              flavourData.packageDetails.length > 0 &&
              flavourData.packageDetails.map((v, i) => {
                return (
                  <>
                    <tr className="tr-row ">
                      <CMPTranxPackage
                        packageIndex={i}
                        packageData={v}
                        {...this.props}
                      />
                    </tr>
                  </>
                );
              })}
          </>
        </td>
        {/* </tr> */}
      </>
    );
  }
}
