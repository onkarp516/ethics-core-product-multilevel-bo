import React, { Component } from "react";
import Select from "react-select";

import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import NewPackaging from "./NewPackaging";
import { Button } from "react-bootstrap";

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
    width: 130,
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
export default class NewSubCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  getSubcategoryOpt = () => {
    let { mstCategory } = this.props;
    return mstCategory.category_id != ""
      ? mstCategory.category_id.subCategoryOpt
      : [];
  };

  handelAddSubCategory = () => {
    let {
      mstBrandIndex,
      mstGroupIndex,
      mstCategoryIndex,
      mstPackaging,
      handleMstState,
    } = this.props;
    let single_category = {
      subcategory_id: "",
      package: [
        {
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
        },
      ],
    };
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"] = [
      ...mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
        mstCategoryIndex
      ]["subcategory"],
      single_category,
    ];

    handleMstState(mstPackaging);
  };

  handleSubcategory = (v) => {
    let {
      mstBrandIndex,
      mstPackaging,
      mstCategoryIndex,
      handleMstState,
      mstSubCategoryIndex,
      mstGroupIndex,
    } = this.props;
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"][mstSubCategoryIndex]["subcategory_id"] = v;
    handleMstState(mstPackaging);
  };

  handleRemoveSubCategory = (
    mstBrandIndex,
    mstGroupIndex,
    mstCategoryIndex
  ) => {
    let { mstPackaging, handleMstState } = this.props;

    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"] =
      mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
        mstCategoryIndex
      ]["subcategory"].length > 1
        ? mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
            mstCategoryIndex
          ]["subcategory"].filter((v, i) => i != mstCategoryIndex)
        : mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
            mstCategoryIndex
          ]["subcategory"];

    handleMstState(mstPackaging);
  };

  render() {
    let {
      mstSubCategoryIndex,
      mstSubCategory,
      subCategoryLst,
      isBrand,
      isGroup,
      isCategory,
      isSubCategory,
      isPackage,
      mstBrandIndex,
      mstGroupIndex,
      mstCategoryIndex,
      mstCategory,
    } = this.props;
    return (
      <>
        <tr>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            {mstSubCategoryIndex == 0 ? (
              <Button
                className="rowPlusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handelAddSubCategory();
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
            <Button
              disabled={mstCategory.subcategory.length < 1 ? true : false}
              className="rowMinusBtn"
              onClick={(e) => {
                e.preventDefault();
                this.handleRemoveSubCategory(
                  mstBrandIndex,
                  mstGroupIndex,
                  mstCategoryIndex
                );
              }}
            >
              <FontAwesomeIcon icon={faMinus} className="minus-color" />
              {/* <img src={minus_img} alt="" className=" " /> */}
            </Button>
          </td>
          <td style={{ padding: "0px 5px 0px 5px" }}>
            <Select
              name={`sub_category_id_${
                mstBrandIndex +
                "" +
                mstGroupIndex +
                "" +
                mstCategoryIndex +
                "" +
                mstSubCategoryIndex
              }`}
              id={`sub_category_id_${
                mstBrandIndex +
                "" +
                mstGroupIndex +
                "" +
                mstCategoryIndex +
                "" +
                mstSubCategoryIndex
              }`}
              isDisabled={!isSubCategory}
              className="prd-dd-style "
              menuPlacement="auto"
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              styles={newRowDropdown}
              placeholder="Select"
              onChange={(v, action) => {
                if (action.action == "clear") {
                  this.handleSubcategory("");
                } else {
                  let key =
                    "package_id_" +
                    mstBrandIndex +
                    "" +
                    mstGroupIndex +
                    "" +
                    mstCategoryIndex +
                    "" +
                    mstCategoryIndex +
                    "" +
                    mstCategoryIndex;
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

                  this.handleSubcategory(v);
                }
              }}
              options={subCategoryLst}
              value={mstSubCategory.subcategory_id}
              autosize={true}
            />
          </td>
          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {mstSubCategory.package &&
              mstSubCategory.package.length > 0 &&
              mstSubCategory.package.map((v, i) => {
                return (
                  <NewPackaging
                    {...this.props}
                    mstPackage={v}
                    mstPackageIndex={i}
                  />
                );
              })}
          </td>
        </tr>
      </>
    );
  }
}
