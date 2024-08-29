import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
// import { newRowDropdown } from "@/helpers";

import NewUnitLevel from "./NewUnitLevel";
import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const newRowDropdown = {
  // singleValue: (base) => ({
  //   width: "100%",
  //   marginTop: "-20px",
  // }),
  // valueContainer: (base) => ({
  //   width: 300,
  // }),
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
export default class NewPackaging extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handlePackagingChange = (v) => {
    let {
      mstBrandIndex,
      mstGroupIndex,
      mstPackaging,
      mstCategoryIndex,
      handleMstState,
      mstSubCategoryIndex,
      mstPackageIndex,
    } = this.props;
    console.log("mstPackaging", mstPackaging);
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"][mstSubCategoryIndex]["package"][mstPackageIndex][
      "package_id"
    ] = v;
    handleMstState(mstPackaging);
  };

  handleAddPackaging = () => {
    let {
      mstBrandIndex,
      mstGroupIndex,
      mstPackaging,
      mstCategoryIndex,
      handleMstState,
      mstSubCategoryIndex,
    } = this.props;
    let single_pkg = {
      package_id: "",
      units: [
        {
          details_id: 0,
          isNegativeStocks: 0,
          unit_id: "",
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
          hsn_id: "",
          taxMaster_id: "",
          applicable_date: "",
        },
      ],
    };
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"][mstSubCategoryIndex]["package"] = [
      ...mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
        mstCategoryIndex
      ]["subcategory"][mstSubCategoryIndex]["package"],
      single_pkg,
    ];
    handleMstState(mstPackaging);
  };
  handleRemovePackaging = (
    mstBrandIndex,
    mstGroupIndex,
    mstCategoryIndex,
    mstSubCategoryIndex,
    mstPackageIndex
  ) => {
    let { handleMstState, mstPackaging } = this.props;

    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"][mstSubCategoryIndex]["package"] =
      mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
        mstCategoryIndex
      ]["subcategory"][mstSubCategoryIndex]["package"].length > 1
        ? mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
            mstCategoryIndex
          ]["subcategory"][mstSubCategoryIndex]["package"].filter(
            (v, i) => i != mstPackageIndex
          )
        : mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
            mstCategoryIndex
          ]["subcategory"][mstSubCategoryIndex]["package"];
    handleMstState(mstPackaging);
  };

  render() {
    let {
      packageOpts,
      is_packaging,
      mstPackage,
      isBrand,
      isGroup,
      isCategory,
      isSubCategory,
      isPackage,
      mstBrandIndex,
      mstGroupIndex,
      mstCategoryIndex,
      mstSubCategoryIndex,
      mstPackageIndex,
      mstSubCategory,
    } = this.props;
    return (
      <>
        <tr>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            {mstPackageIndex == 0 ? (
              <Button
                className="rowPlusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleAddPackaging();
                  // if (is_packaging != "" && is_packaging == true) {
                  // }
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="plus-color" />
                {/* <img src={plus_img} alt="" className=" " /> */}
              </Button>
            ) : (
              ""
            )}
          </td>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            {/* {is_packaging != "" && is_packaging == true ? ( */}
            <Button
              disabled={mstSubCategory.package.length < 1 ? true : false}
              className="rowMinusBtn"
              onClick={(e) => {
                e.preventDefault();
                this.handleRemovePackaging(
                  mstBrandIndex,
                  mstGroupIndex,
                  mstCategoryIndex,
                  mstSubCategoryIndex,
                  mstPackageIndex
                );
                // if (is_packaging != "" && is_packaging == true) {
                // }
              }}
            >
              <FontAwesomeIcon icon={faMinus} className="minus-color" />
              {/* <img src={minus_img} alt="" className=" " /> */}
            </Button>

            {/* ) : (
              <img src={minus_img_wt} alt="" style={{ marginTop: "13px" }} />
            )} */}
          </td>
          <td style={{ padding: "0px 5px 0px 5px" }}>
            <Select
              name={`package_id_${
                mstBrandIndex +
                "" +
                mstGroupIndex +
                "" +
                mstCategoryIndex +
                "" +
                mstSubCategoryIndex +
                "" +
                mstPackageIndex
              }`}
              id={`package_id_${
                mstBrandIndex +
                "" +
                mstGroupIndex +
                "" +
                mstCategoryIndex +
                "" +
                mstSubCategoryIndex +
                "" +
                mstPackageIndex
              }`}
              isDisabled={!isPackage}
              className="prd-dd-style"
              menuPlacement="auto"
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              styles={newRowDropdown}
              onChange={(v, action) => {
                if (action.action == "clear") {
                  this.handlePackagingChange("");
                } else {
                  let key =
                    "unit_id_" +
                    mstBrandIndex +
                    "" +
                    mstGroupIndex +
                    "" +
                    mstCategoryIndex +
                    "" +
                    mstCategoryIndex +
                    "" +
                    mstPackageIndex +
                    "" +
                    mstPackageIndex;
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

                  this.handlePackagingChange(v);
                }
              }}
              options={packageOpts}
              value={mstPackage.package_id}
              placeholder="Select"
              // isDisabled={
              //   is_packaging != "" && is_packaging == true ? false : true
              // }
            />
          </td>

          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {mstPackage &&
              mstPackage.units &&
              mstPackage.units.length > 0 &&
              mstPackage.units.map((v, i) => {
                return (
                  <NewUnitLevel {...this.props} mstUnit={v} mstUnitIndex={i} />
                );
              })}

            {/* */}
          </td>
        </tr>
      </>
    );
  }
}
