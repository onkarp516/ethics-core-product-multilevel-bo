import React, { Component } from "react";

import Select from "react-select";
import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import NewGroup from "./NewGroup";
import NewUnitLevel from "./NewUnitLevel";
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
    width: 128,
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

export default class NewBrand extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  handleAddBrand = () => {
    let { mstPackaging, handleMstState } = this.props;
    let single_brand = {
      brand_id: "",
      group: [
        {
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
        },
      ],
    };

    let fmstPackaging = [...mstPackaging, single_brand];
    handleMstState(fmstPackaging);
  };

  handleRemoveBrand = (mstBrandIndex) => {
    let { mstPackaging, handleMstState } = this.props;
    console.log("mstBrandIndex", mstBrandIndex);
    let fmstPackaging =
      mstPackaging.length > 1
        ? mstPackaging.filter((v, i) => i != mstBrandIndex)
        : mstPackaging;
    handleMstState(fmstPackaging);
  };

  render() {
    let {
      isBrand,
      isGroup,
      isBatchNo,

      isCategory,
      isSubCategory,
      isPackage,
      mstBrand,
      lstBrandOpt,
      mstBrandIndex,
      handleBrandChange,
      mstGroupIndex,
      mstPackaging,
    } = this.props;
    console.log(this.props.isBatchNo);

    return (
      <>
        <tr>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            {mstBrandIndex == 0 ? (
              <Button
                className="rowPlusBtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleAddBrand();
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="plus-color" />
                {/* <img alt="" className=" " /> */}
              </Button>
            ) : (
              ""
            )}
          </td>
          <td style={{ padding: "0px 0px 0px 5px" }}>
            <Button
              disabled={mstPackaging.length < 1 ? true : false}
              className="rowMinusBtn"
              onClick={(e) => {
                e.preventDefault();
                console.warn("rahul::clicked");
                this.handleRemoveBrand(mstBrandIndex);
              }}
            >
              <FontAwesomeIcon icon={faMinus} className="minus-color" />
              {/* <img src={minus_img} alt="" className=" " /> */}
            </Button>
          </td>
          <td style={{ padding: "0px 5px 0px 5px" }}>
            <Select
              isDisabled={!isBrand}
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
                  handleBrandChange(mstBrandIndex, "");
                } else {
                  console.warn(
                    "mstBrandIndex+ mstGroupIndex",
                    mstBrandIndex + "" + mstBrandIndex
                  );
                  let key = "group_id_" + mstBrandIndex + "" + mstBrandIndex;
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
                  handleBrandChange(mstBrandIndex, v);
                }
              }}
              options={lstBrandOpt}
              value={mstBrand.brand_id}
              placeholder="Select"
              name={`brand_id_${mstBrandIndex}`}
              id={`brand_id_${mstBrandIndex}`}
            />
          </td>
          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {/* {mstBrand.group &&
              mstBrand.group.length > 0 &&
              mstBrand.group.map((v, i) => {
                return ( */}
            <NewUnitLevel {...this.props} />
            {/* );
              })} */}
          </td>
        </tr>
      </>
    );
  }
}
