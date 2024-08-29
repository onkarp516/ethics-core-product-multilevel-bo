import React, { Component } from "react";

import Select from "react-select";
import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import LevelC from "./LevelC";

import { newRowDropdown, isUserControl, level_B_DD } from "@/helpers";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

// const newRowDropdown = {
//   control: (base, state) => ({
//     ...base,
//     // marginLeft: -25,
//     borderRadius: "none",
//     // border: "1px solid transparent",
//     marginTop: 3,
//     height: 28,
//     minHeight: 28,
//     fontFamily: "Inter",
//     fontStyle: "normal",
//     fontWeight: 400,
//     fontSize: "14px",
//     lineHeight: "12px",
//     width: 165,
//     // letterSpacing: "-0.02em",
//     // textDecorationLine: "underline",
//     color: "#000000",
//     background: "transparent",

//     "&:hover": {
//       background: "transparent",
//       border: "1px solid #dcdcdc !important",
//     },
//     // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
//     border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
//   }),
//   dropdownIndicator: (base) => ({
//     // background: "black",
//     color: " #ADADAD",
//     // marginRight: "5px",
//     // height: "4.5px",
//     // width: "9px",
//   }),
//   menu: (base) => ({
//     ...base,
//     zIndex: 999,
//     fontSize: "12px",
//   }),
// };

export default class LevelB extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  handleLevelB = (mstLevelBIndex, v) => {
    let { mstLevelAIndex, mstPackaging, handleMstState } =
      this.props;
    console.log("mstLevelAIndex, mstLevelBIndex, mstPackaging, handleMstState",
      mstLevelAIndex, mstLevelBIndex, mstPackaging, handleMstState);
    mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelb_id"] = v;
    console.log("mstPackaging--", mstPackaging);
    handleMstState(mstPackaging);
  };

  handleAddLevelB = () => {
    let { mstLevelAIndex, mstPackaging, handleMstState } = this.props;
    let single_levelb = {
      levelb_id: "",
      levelb_error: "",
      levelc: [
        {
          levelc_id: "",
          levelc_error: "",
          units: [
            {
              details_id: 0,
              isNegativeStocks: 0,
              unit_id: "",
              unit_idError: "",
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
              applicable_date: "",
              batchList: [],
            },
          ],
        },
      ],
    };
    mstPackaging[mstLevelAIndex]["levelb"] = [
      ...mstPackaging[mstLevelAIndex]["levelb"],
      single_levelb,
    ];

    handleMstState(mstPackaging);
  };

  handleRemoveLevelB = (mstLevelAIndex, mstLevelBIndex) => {
    let { mstPackaging, handleMstState, rowDelDetailsIds } = this.props;

    let deletedRow = mstPackaging[mstLevelAIndex]["levelb"].filter(
      (v, i) => i === mstLevelBIndex
    );
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((cv, ci) => {
        cv.levelc.map((lc, ci) => {
          lc.units.map((uv, ui) => {
            console.log("details_id --------------->>>>", uv.details_id);
            if (uv.details_id > 0) {
              if (!rowDelDetailsIds.includes(uv.details_id)) {
                rowDelDetailsIds.push(uv.details_id);
              }
            }
          });


        });
      });
    }
    // console.warn("rahul::rowDelDetailsIds ", rowDelDetailsIds);

    mstPackaging[mstLevelAIndex]["levelb"] =
      mstPackaging[mstLevelAIndex]["levelb"].length > 1
        ? mstPackaging[mstLevelAIndex]["levelb"].filter(
          (v, i) => i != mstLevelBIndex
        )
        : mstPackaging[mstLevelAIndex]["levelb"];

    handleMstState(mstPackaging);
  };

  render() {
    let {
      isLevelA,
      isLevelB,
      isLevelC,
      mstLevelB,
      levelBOpt,
      mstLevelBIndex,
      mstLevelAIndex,
      mstLevelCIndex,
      mstLevelA,
      getPPixel,
      getPixel,
      methodUsed,
      handleDisablePlusButton,
      ABC_flag_value,
      levelBModalShow,
      handleLevelB,
      mstPackaging
    } = this.props;

    return (
      <>
        <tr>
          {ABC_flag_value == "AB" || ABC_flag_value == "ABC" || ABC_flag_value == "ABC" ? (
            <>
              <td style={{ padding: "0px 0px 0px 5px" }}>
                {/* {mstLevelBIndex == mstPackaging.length - 1 ? ( */}
                <Button
                  className="rowPlusBtn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleAddLevelB();
                  }}
                  disabled={handleDisablePlusButton()}
                >
                  <FontAwesomeIcon icon={faPlus} className="plus-color" />
                  {/* <img src={plus_img} alt="" className=" " /> */}
                </Button>
                {/* ) : (
                  ""
                )} */}
              </td>
              <td style={{ padding: "0px 0px 0px 5px" }}>
                {/* {mstLevelBIndex == 0 ? ( */}
                <Button
                  // disabled={mstLevelA.levelb.length === 1 ? true : false}
                  className="rowMinusBtn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleRemoveLevelB(mstLevelAIndex, mstLevelBIndex);
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} className="minus-color" />
                  {/* <img src={minus_img} alt="" className=" " /> */}
                </Button>
                {/* ) : (
                  ""
                )} */}
              </td>
              <td style={{ padding: "0px 5px 0px 5px" }}>
                <>
                  <Select
                    name={`levelb_id_${mstLevelAIndex + "" + mstLevelBIndex}`}
                    id={`levelb_id_${mstLevelAIndex + "" + mstLevelBIndex}`}
                    // isDisabled={!isLevelB}
                    className="prd-dd-style "
                    menuPlacement="auto"
                    components={{
                      // DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    isClearable={false}
                    options={levelBOpt}
                    styles={level_B_DD(ABC_flag_value)}
                    onChange={(v) => {
                      // setFieldValue("unit_id", "");
                      // this.handleLevelAChange("", "mstLevelAIndex");
                      if (v !== "") {
                        if (v.label === "Add New") {
                          console.log(v.label === "Add New");
                          levelBModalShow(true);
                        } else {
                          console.log("else part", v);
                          this.handleLevelB(mstLevelBIndex, v);
                        }
                      }
                    }}
                    // onChange={(v, action) => {
                    //   if (action.action == "clear") {
                    //     this.handleLevelB("");
                    //   } else {
                    //     let key =
                    //       "levelc_id_" +
                    //       mstLevelAIndex +
                    //       "" +
                    //       mstLevelBIndex +
                    //       "" +
                    //       mstLevelCIndex;
                    //     let inputElement = document.getElementById(key);
                    //     console.warn("rahul::inputElement ", inputElement);
                    //     if (inputElement) {
                    //       let inputEle = inputElement.querySelectorAll(
                    //         "input, select, checkbox, textarea"
                    //       );
                    //       if (inputEle) {
                    //         inputEle[0].focus();
                    //       }
                    //     }
                    //     this.handleLevelB(v);
                    //   }
                    // }}
                    value={mstLevelB.levelb_id}
                    placeholder="Select"
                  // required
                  // isDisabled={is_flavour != "" && is_flavour == true ? false : true}
                  />
                </>
              </td>
              {/* <span className="text-danger errormsg">
                {mstLevelB.levelb_error}
              </span> */}
            </>
          ) : (
            ""
          )}
          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {mstLevelB.levelc &&
              mstLevelB.levelc.length > 0 &&
              mstLevelB.levelc.map((v, i) => {
                return (
                  <LevelC
                    {...this.props}
                    mstLevelC={v}
                    mstLevelCIndex={i}
                    ABC_flag_value={ABC_flag_value}
                  />
                );
              })}
          </td>
        </tr>
      </>
    );
  }
}
