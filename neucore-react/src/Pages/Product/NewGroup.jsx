import React, { Component } from "react";

import Select from "react-select";
import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import NewCategory from "./NewCategory";

// import { newRowDropdown } from "@/helpers";
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
    width: 106,
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

export default class NewGroup extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  getGroupOpts = () => {
    let { mstBrand } = this.props;
    return mstBrand != "" ? mstBrand["brand_id"]["groupOpt"] : [];
  };

  handleGroup = (v) => {
    let { mstBrandIndex, mstGroupIndex, mstPackaging, handleMstState } =
      this.props;
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["group_id"] = v;
    handleMstState(mstPackaging);
  };

  handleAddGroup = () => {
    let { mstBrandIndex, mstPackaging, handleMstState } = this.props;
    let single_group = {
      group_id: "",
      category: [
        {
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
        },
      ],
    };
    mstPackaging[mstBrandIndex]["group"] = [
      ...mstPackaging[mstBrandIndex]["group"],
      single_group,
    ];

    handleMstState(mstPackaging);
  };

  handleRemoveGroup = (mstBrandIndex, mstGroupIndex) => {
    let { mstPackaging, handleMstState, mstCategoryIndex } = this.props;

    mstPackaging[mstBrandIndex]["group"] =
      mstPackaging[mstBrandIndex]["group"].length > 1
        ? mstPackaging[mstBrandIndex]["group"].filter(
            (v, i) => i != mstGroupIndex
          )
        : mstPackaging[mstBrandIndex]["group"];

    handleMstState(mstPackaging);
  };

  render() {
    let {
      isBrand,
      isGroup,
      isCategory,
      isSubCategory,
      isPackage,
      mstGroup,
      groupLst,
      mstGroupIndex,
      mstBrandIndex,
      mstBrand,
    } = this.props;

    return (
      <>
        <tr>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            {mstGroupIndex == 0 ? (
              <Button
                className="rowPlusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleAddGroup();
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
              disabled={mstBrand.group < 1 ? true : false}
              className="rowMinusBtn"
              onClick={(e) => {
                e.preventDefault();
                this.handleRemoveGroup(mstBrandIndex, mstGroupIndex);
              }}
            >
              <FontAwesomeIcon icon={faMinus} className="minus-color" />
              {/* <img src={minus_img} alt="" className=" " /> */}
            </Button>
          </td>
          <td style={{ padding: "0px 5px 0px 5px" }}>
            <Select
              name={`group_id_${mstBrandIndex + "" + mstGroupIndex}`}
              id={`group_id_${mstBrandIndex + "" + mstGroupIndex}`}
              isDisabled={!isGroup}
              className="prd-dd-style "
              menuPlacement="auto"
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              options={groupLst}
              styles={newRowDropdown}
              onChange={(v, action) => {
                if (action.action == "clear") {
                  this.handleGroup("");
                } else {
                  let key =
                    "category_id_" +
                    mstBrandIndex +
                    "" +
                    mstGroupIndex +
                    "" +
                    mstGroupIndex;
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
                  this.handleGroup(v);
                }
              }}
              value={mstGroup.group_id}
              placeholder="Select"
              required
              // isDisabled={is_flavour != "" && is_flavour == true ? false : true}
            />
          </td>
          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {mstGroup.category &&
              mstGroup.category.length > 0 &&
              mstGroup.category.map((v, i) => {
                return (
                  <NewCategory
                    {...this.props}
                    mstCategory={v}
                    mstCategoryIndex={i}
                  />
                );
              })}
          </td>
        </tr>
      </>
    );
  }
}
