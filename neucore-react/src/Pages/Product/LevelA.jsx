import React, { Component } from "react";

import Select from "react-select";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import LevelB from "./LevelB";
import { newRowDropdown, isUserControl, level_A_DD } from "@/helpers";

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
//     width: 170,
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

export default class LevelA extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  handleAddLevelA = () => {
    let { mstPackaging, handleMstState } = this.props;
    let single_levela = {
      levela_id: "",
      levela_error: "",
      levelb: [
        {
          levelb_id: "",
          levelb_error: "",
          levelc: [
            {
              levelc_id: "",
              levelc_error: "",
              units: [
                {
                  error: [],
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
        },
      ],
    };

    let fmstPackaging = [...mstPackaging, single_levela];
    console.log(fmstPackaging);
    handleMstState(fmstPackaging);
  };

  handleRemoveLevelA = (mstLevelAIndex) => {
    let { mstPackaging, handleMstState, rowDelDetailsIds } = this.props;
    // console.log("mstLevelAIndex", mstLevelAIndex);

    let deletedRow = mstPackaging.filter((v, i) => i === mstLevelAIndex);
    console.warn("rahul::deletedRow ", deletedRow);

    if (deletedRow) {
      deletedRow.map((bv, bi) => {
        bv.levelb.map((gv, gi) => {
          gv.levelc.map((cv, ci) => {
            cv.units.map((uv, ui) => {
              // console.log("details_id --------------->>>>", uv.details_id);
              if (uv.details_id > 0) {
                if (!rowDelDetailsIds.includes(uv.details_id)) {
                  rowDelDetailsIds.push(uv.details_id);
                }
              }
            });
          });
        });
      });
    }
    // console.warn("rahul::rowDelDetailsIds ", rowDelDetailsIds);

    let fmstPackaging =
      mstPackaging.length > 1
        ? mstPackaging.filter((v, i) => i != mstLevelAIndex)
        : mstPackaging;
    handleMstState(fmstPackaging);
  };

  render() {
    let {
      isLevelA,
      isLevelB,
      isLevelC,
      isBatchNo,
      mstLevelA,
      levelAOpt,
      mstLevelAIndex,
      handleLevelAChange,
      mstLevelBIndex,
      mstPackaging,
      getPPixel,
      getPixel,
      methodUsed,
      handleDisablePlusButton,
      ABC_flag_value,
      handleFlavourModalShow,
      levelAModalShow,
    } = this.props;

    return (
      <>
        <tr>
          {/* {isUserConrol("is_level_a", this.props.userControl) ? (<> */}
          {ABC_flag_value == "A" ||
            ABC_flag_value == "AB" ||
            ABC_flag_value == "ABC" ? (
            <>
              <td style={{ padding: "0px 0px 0px 5px" }}>
                {/* {mstLevelAIndex == mstPackaging.length - 1 ? ( */}
                <Button
                  className="rowPlusBtn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleAddLevelA();
                  }}
                  disabled={handleDisablePlusButton()}
                >
                  <FontAwesomeIcon icon={faPlus} className="plus-color" />
                  {/* <img alt="" className=" " /> */}
                </Button>
                {/* ) : (
                  ""
                )} */}
              </td>
              <td style={{ padding: "0px 0px 0px 5px" }}>
                <Button
                  // disabled={mstPackaging.length === 1 ? true : false}
                  className="rowMinusBtn"
                  onClick={(e) => {
                    e.preventDefault();
                    console.warn("rahul::clicked");
                    this.handleRemoveLevelA(mstLevelAIndex);
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} className="minus-color" />
                  {/* <img src={minus_img} alt="" className=" " /> */}
                </Button>
              </td>
              <td style={{ padding: "0px 5px 0px 5px" }}>
                <>
                  {" "}
                  <Select
                    // isDisabled={!isLevelA}
                    className="prd-dd-style "
                    menuPlacement="auto"
                    components={{
                      // DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    isClearable={false}
                    styles={level_A_DD(ABC_flag_value)}
                    onChange={(v) => {
                      // setFieldValue("unit_id", "");
                      // this.handleLevelAChange("", "mstLevelAIndex");
                      if (v !== "") {
                        if (v.label === "Add New") {
                          console.log(v.label === "Add New");
                          levelAModalShow(true);
                        } else {
                          console.log("else part", v);
                          handleLevelAChange(mstLevelAIndex, v);

                        }
                      }
                    }}
                    // onChange={(v, action) => {
                    //   if (action.action == "clear") {
                    //     handleLevelAChange(mstLevelAIndex, "");
                    //   } else {
                    //     console.warn(
                    //       "mstLevelAIndex+ mstLevelAIndex",
                    //       mstLevelAIndex + mstLevelBIndex
                    //     );
                    //     let key =
                    //       "levela_id_" + mstLevelAIndex + "" + mstLevelBIndex;
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
                    //     handleLevelAChange(mstLevelAIndex, v);
                    //   }
                    // }}
                    options={levelAOpt}
                    value={mstLevelA.levela_id}
                    placeholder="Select"
                    name={`levela_id_${mstLevelAIndex}`}
                    id={`levela_id_${mstLevelAIndex}`}
                  />
                  {/* <span className="text-danger errormsg">
                    {mstLevelA.levela_error}
                  </span> */}
                </>
              </td>
            </>
          ) : (
            ""
          )}
          {/* </>
          ) : (<></>)
          } */}

          <td style={{ padding: "0px", borderLeft: "1px solid #ECECEC" }}>
            {mstLevelA.levelb &&
              mstLevelA.levelb.length > 0 &&
              mstLevelA.levelb.map((v, i) => {
                // return "HI";
                return (
                  <LevelB
                    {...this.props}
                    mstLevelB={v}
                    mstLevelBIndex={i}
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
