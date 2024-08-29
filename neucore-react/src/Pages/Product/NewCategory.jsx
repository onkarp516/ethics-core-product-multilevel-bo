import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
// import { newRowDropdown } from "@/helpers";

import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import NewSubCategory from "./NewSubCategory";

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
    width: 106,
    // letterSpacing: "-0.02em",
    // textDecorationLine: "underline",
    color: "#000000",
    background: "transparent",

    "&:hover": {
      background: "transparent",
      border: "1px solid #dcdcdc !important",
    },
    border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
    // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
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

export default class NewCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  getCategoryOpts = () => {
    let { mstBrand } = this.props;
    return mstBrand != "" ? mstBrand["brand_id"]["categoryOpt"] : [];
  };

  handleCategory = (v) => {
    let {
      mstBrandIndex,
      mstPackaging,
      mstGroupIndex,
      handleMstState,
      mstCategoryIndex,
    } = this.props;
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["category_id"] = v;
    handleMstState(mstPackaging);
  };
  handelAddCategory = () => {
    let { mstBrandIndex, mstGroupIndex, mstPackaging, handleMstState } =
      this.props;
    let single_category = {
      category_id: "",
      subcategory: [
        {
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
        },
      ],
    };
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"] = [
      ...mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"],
      single_category,
    ];

    handleMstState(mstPackaging);
  };

  handleRemoveCategory = (mstBrandIndex, mstGroupIndex, mstCategoryIndex) => {
    let { mstPackaging, handleMstState } = this.props;

    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"] =
      mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"].length > 1
        ? mstPackaging[mstBrandIndex]["group"][mstGroupIndex][
            "category"
          ].filter((v, i) => i != mstCategoryIndex)
        : mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"];

    handleMstState(mstPackaging);
  };

  render() {
    let {
      mstCategory,
      mstCategoryIndex,
      categoryLst,
      isBrand,
      isGroup,
      isCategory,
      isSubCategory,
      isPackage,
      mstBrandIndex,
      mstGroupIndex,
      mstGroup,
    } = this.props;

    return (
      <>
        <tr>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            {mstCategoryIndex == 0 ? (
              <Button
                className="rowPlusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handelAddCategory();
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
              disabled={mstGroup.category < 1 ? true : false}
              className="rowMinusBtn"
              onClick={(e) => {
                e.preventDefault();
                this.handleRemoveCategory(
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
              name={`category_id_${
                mstBrandIndex + "" + mstGroupIndex + "" + mstCategoryIndex
              }`}
              id={`category_id_${
                mstBrandIndex + "" + mstGroupIndex + "" + mstCategoryIndex
              }`}
              isDisabled={!isCategory}
              className="prd-dd-style "
              menuPlacement="auto"
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              styles={newRowDropdown}
              onChange={(v, action) => {
                if (action.action == "clear") {
                  this.handleCategory("");
                } else {
                  let key =
                    "sub_category_id_" +
                    mstBrandIndex +
                    "" +
                    mstGroupIndex +
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

                  this.handleCategory(v);
                }
              }}
              options={categoryLst}
              value={mstCategory.category_id}
              placeholder="Select"
            />
          </td>
          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {mstCategory &&
              mstCategory.subcategory &&
              mstCategory.subcategory.length > 0 &&
              mstCategory.subcategory.map((v, i) => {
                return (
                  <NewSubCategory
                    {...this.props}
                    mstSubCategory={v}
                    mstSubCategoryIndex={i}
                  />
                );
              })}
          </td>
        </tr>
      </>
    );
  }
}
