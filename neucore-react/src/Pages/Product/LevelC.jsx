import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";

import NewUnitLevel from "./NewUnitLevel";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { newRowDropdown, isUserControl, level_C_DD } from "@/helpers";

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
//     border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
//     // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
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

export default class LevelC extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  handleLevelC = (mstLevelCIndex, v) => {
    let {
      mstLevelAIndex,
      mstPackaging,
      mstLevelBIndex,
      handleMstState,

    } = this.props;
    mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"][
      mstLevelCIndex
    ]["levelc_id"] = v;
    handleMstState(mstPackaging);
  };
  handelAddLevelC = () => {
    let { mstLevelAIndex, mstLevelBIndex, mstPackaging, handleMstState } =
      this.props;
    let single_levelc = {
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
    };
    mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"] = [
      ...mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"],
      single_levelc,
    ];

    handleMstState(mstPackaging);
  };

  handleRemoveLevelC = (mstLevelAIndex, mstLevelBIndex, mstLevelCIndex) => {
    let { mstPackaging, handleMstState, rowDelDetailsIds } = this.props;

    let deletedRow = mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex][
      "levelc"
    ].filter((v, i) => i === mstLevelCIndex);
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((lc, ui) => {
        lc.units.map((uv, ui) => {
          console.log("details_id --------------->>>>", uv.details_id);
          if (uv.details_id > 0) {
            if (!rowDelDetailsIds.includes(uv.details_id)) {
              rowDelDetailsIds.push(uv.details_id);
            }
          }
        });

      });
    }
    // console.warn("rahul::rowDelDetailsIds ", rowDelDetailsIds);

    mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"] =
      mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"].length >
        1
        ? mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex][
          "levelc"
        ].filter((v, i) => i != mstLevelCIndex)
        : mstPackaging[mstLevelAIndex]["levelb"][mstLevelBIndex]["levelc"];

    handleMstState(mstPackaging);
  };

  render() {
    let {
      mstLevelC,
      mstLevelCIndex,
      levelCOpt,
      isLevelC,
      mstLevelAIndex,
      mstLevelBIndex,
      mstLevelB,
      getPPixel,
      getPixel,
      methodUsed,
      handleDisablePlusButton,
      ABC_flag_value,
      levelCModalShow,
      handleLevelC,
    } = this.props;

    return (
      <>
        <tr>
          {ABC_flag_value == "ABC" ? (
            <>
              <td style={{ padding: "0px 0px 0px 5px" }}>
                {/* {mstLevelCIndex == 0 ? ( */}
                <Button
                  className="rowPlusBtn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handelAddLevelC();
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
                {/* {mstLevelCIndex == 0 ? ( */}
                <Button
                  // disabled={mstLevelB.levelc.length < 1 ? true : false}
                  className="rowMinusBtn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleRemoveLevelC(
                      mstLevelAIndex,
                      mstLevelBIndex,
                      mstLevelCIndex
                    );
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
                    name={`levelc_id_${mstLevelAIndex + "" + mstLevelBIndex + "" + mstLevelCIndex
                      }`}
                    id={`levelc_id_${mstLevelAIndex + "" + mstLevelBIndex + "" + mstLevelCIndex
                      }`}
                    // isDisabled={!isLevelC}
                    className="prd-dd-style "
                    menuPlacement="auto"
                    components={{
                      // DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    isClearable={false}
                    styles={level_C_DD(ABC_flag_value)}
                    onChange={(v) => {
                      // setFieldValue("unit_id", "");
                      // this.handleLevelAChange("", "mstLevelAIndex");
                      if (v !== "") {
                        if (v.label === "Add New") {
                          console.log(v.label === "Add New");
                          levelCModalShow(true);
                        } else {
                          console.log("else part", v);
                          this.handleLevelC(mstLevelCIndex, v);
                        }
                      }
                    }}
                    // onChange={(v, action) => {
                    //   if (action.action == "clear") {
                    //     this.handleLevelC("");
                    //   } else {
                    //     let key =
                    //       "unit_id_" +
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

                    //     this.handleLevelC(v);
                    //   }
                    // }}
                    options={levelCOpt}
                    value={mstLevelC.levelc_id}
                    placeholder="Select"
                  />
                  {/* <span className="text-danger errormsg">
                    {mstLevelC.levelc_error}
                  </span> */}
                </>
              </td>
            </>
          ) : (
            ""
          )}
          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {mstLevelC &&
              mstLevelC.units &&
              mstLevelC.units.length > 0 &&
              mstLevelC.units.map((v, i) => {
                return (
                  <NewUnitLevel
                    {...this.props}
                    mstUnit={v}
                    mstUnitIndex={i}
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
