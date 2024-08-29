import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form, Modal, Button, Card } from "react-bootstrap";
import delete_icon from "../../../assets/images/delete_icon@3x.png";
import add_blue_circle from "../../../assets/images/add_blue_circle@3x.png";

import {
  getSelectValue,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
  NewcustomStyles,
} from "@/helpers";
const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    fontSize: "16px",
    border: "none",
    padding: "0 6px",
    fontWeight: "500",
    // fontFamily: "MontserratRegular",
    boxShadow: "none",
    background: "transparent",
  }),
};
const customStylesPackaging = {
  control: (base) => ({
    ...base,

    border: "none",

    fontFamily: "MontserratRegular",
    boxShadow: "none",

    background: "transparent",
  }),
};

export default function TrowComponent1(props) {
  const {
    i,
    productLst,
    setFieldValue,
    isDisabled,
    rows_count,
    rows,
    lstPackages,
    handleRowChange,
    transaction_detail_index,
    unitIndex,
  } = props;
  const [addModalShow, setAddModalShow] = useState(false);
  let row_data = [];
  for (let index = 0; index < rows_count; index++) {
    console.log("row_count", rows_count);
    row_data.push(index);
  }

  const getUnitOpt = () => {
    let { lstPackages, transaction_detail_index, rows } = props;
    console.log(rows);
    let lst = [];
    if (lstPackages && lstPackages.length > 0 && lstPackages[0]["value"] != 0) {
      lst = lstPackages[0].unitOpt;
    } else if (
      lstPackages &&
      lstPackages.length > 0 &&
      lstPackages[0]["value"] == 0
    ) {
      lst = lstPackages[0].unitOpt;
    }
    // lst = rows[transaction_detail_index]["packageId"]
    //   ? rows[transaction_detail_index]["packageId"]["unitOpt"]
    //   : lstPackages[0].unitOpt;

    console.log(lst);
    return lst;
  };

  const handlePackageChange = (transaction_detail_index, element, value) => {
    let { rows, handleRowChange } = props;
    // console.log('handleRowChange', handleRowChange);
    rows[transaction_detail_index][element] = value;
    handleRowChange(rows);
  };

  const getPackageValue = (transaction_detail_index, element) => {
    console.log(
      "transaction_detail_index, element",
      transaction_detail_index,
      element
    );
    let { rows } = props;
    return rows ? rows[transaction_detail_index][element] : "";
  };

  const handleUnitElement = (
    transaction_detail_index,
    unitIndex,
    element,
    value
  ) => {
    let { rows, handleRowChange } = props;
    console.log("handleRowChange", handleRowChange);
    rows[transaction_detail_index]["units"][unitIndex][element] = value;
    handleRowChange(rows);
  };

  const getUnitElement = (transaction_detail_index, unitIndex, element) => {
    let { rows } = props;
    console.log(" unitIndex, element", unitIndex, element);
    return rows
      ? rows[transaction_detail_index]["units"][unitIndex][element]
      : "";
  };

  const AddNewUnit = (transaction_detail_index) => {
    let { rows, handleRowChange } = this.props;
    let single_unit = {
      packageId: "",
      unitId: "",
      qty: "",
      rate: "",
      base_amt: "",
      unit_conv: "",
    };
    let Frows = rows;
    Frows[transaction_detail_index]["units"] = [
      ...Frows[transaction_detail_index]["units"],
      single_unit,
    ];
    handleRowChange(Frows);
    // rows
    //   ? rows[transaction_detail_index]['units']
  };

  const RemoveNewUnit = (transaction_detail_index, unitIndex) => {
    let { rows, handleRowChange } = this.props;
    let Frows = rows;
    let InnerUnits = Frows[transaction_detail_index]["units"].filter(
      (v, i) => i != unitIndex
    );
    Frows[transaction_detail_index]["units"] = InnerUnits;
    handleRowChange(Frows);
  };

  return (
    <tr className="entryrow">
      <td style={{ width: "2%" }}>{i + 1}</td>
      <td style={{ width: "30%", borderRight: "1px solid #9da2b4" }}>
        <Select
          className="selectTo"
          autoFocus={true}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          placeholder=""
          styles={customStyles1}
          isClearable={!isDisabled}
          options={productLst}
          // onCreateOption={handleCreate}
          borderRadius="0px"
          colors="#729"
          onChange={(value, triggeredAction) => {
            if (triggeredAction.action === "clear") {
              props.handleClearProduct(i);
            } else {
              props.handleChangeArrayElement(
                "productId",
                value,
                i,
                setFieldValue
              );
            }
          }}
          value={props.setElementValue("productId", i)}
          isDisabled={isDisabled}
        />
      </td>

      <td
        // onClick={(e) => {
        //   e.preventDefault();
        //   let value = props.setElementValue("productId", i);
        //   if (value != "") {
        //     props.handleChangeArrayElement(
        //       "productId",
        //       value,
        //       i,
        //       setFieldValue
        //     );
        //   }
        // }}
        style={{ width: "7%" }}
      >
        {row_data != "" && row_data.length == 0 ? (
          <Select
            className="selectTo"
            // autoFocus={true}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            placeholder=""
            // styles={customStyles}

            options={lstPackages}
            onChange={(v, actions) => {
              if (actions.action == "clear") {
                handlePackageChange(i, "packageId", "");
              } else {
                handlePackageChange(i, "packageId", v);
              }
            }}
            value={getPackageValue(i, "packageId")}
            // isDisabled={isDisabled}
          />
        ) : (
          row_data.map((v) => {
            return (
              <Select
                className="selectTo"
                // autoFocus={true}
                // components={{
                //   DropdownIndicator: () => null,
                //   IndicatorSeparator: () => null,
                // }}
                placeholder="Select"
                // styles={customStyles}

                options={lstPackages} // onCreateOption={handleCreate}
                onChange={(v, actions) => {
                  if (actions.action == "clear") {
                    console.log(
                      "transaction_detail_index",
                      transaction_detail_index
                    );
                    handlePackageChange(i, "packageId", "");
                  } else {
                    console.log(
                      "transaction_detail_index",
                      transaction_detail_index
                    );
                    handlePackageChange(i, "packageId", v);
                  }
                }}
                value={getPackageValue(i, "packageId")}
              />
            );
          })
        )}
      </td>

      <td
        onClick={(e) => {
          e.preventDefault();
          let value = props.setElementValue("productId", i);
          if (value != "") {
            props.handleChangeArrayElement(
              "productId",
              value,
              i,
              setFieldValue
            );
          }
        }}
        style={{ width: "7%" }}
      >
        {/* {JSON.stringify(getUnitOpt())} */}
        {rows &&
          rows[i] &&
          rows[i]["units"] &&
          rows[i]["units"].length > 0 &&
          rows[i]["units"].map((v, ii) => {
            return (
              <Select
                className="selectTo"
                // autoFocus={true}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder="Select"
                // styles={customStyles}

                options={getUnitOpt()}
                onChange={(v, actions) => {
                  if (actions.action == "clear") {
                    handleUnitElement(i, ii, "unitId", "");
                  } else {
                    console.log("in else......");
                    handleUnitElement(i, ii, "unitId", v);
                  }
                }}
                value={getUnitElement(i, ii, "unitId")}
                // isDisabled={isDisabled}
              />
            );
          })}
      </td>

      <td
        onClick={(e) => {
          e.preventDefault();
          let value = props.setElementValue("productId", i);
          if (value != "") {
            props.handleChangeArrayElement(
              "productId",
              value,
              i,
              setFieldValue
            );
          }
        }}
      >
        <div className="text-center">
          {/* {props.setElementValue("units", i)
            ? props.setElementValue("units", i).length > 0 &&
              props.setElementValue("units", i).map((v) => {
                return ( */}
          {/* //   <Form.Control
                  //     type="text"
                  //     className="mb-1"
                  //     value={v != "" ? (v.qty != "" ? v.qty : "") : ""}
                  //   />
                  // <div className="d-inline-flex">
                  //   <p className="me-4">
                  //     {v.unitId != "" ? "unit : " + v.unitId.label : ""}
                  //   </p>
                  //   <p className="me-4">{v.qty != "" ? "qnty:" + v.qty : ""}</p>
                  //   <p className="me-4">
                  //     {v.rate != "" ? "rate : " + v.rate : ""}
                  //   </p>
                  // </div> */}

          {rows &&
            rows[i] &&
            rows[i]["units"] &&
            rows[i]["units"].length > 0 &&
            rows[i]["units"].map((v, ii) => {
              return (
                <Form.Control
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    let v = e.target.value;
                    handleUnitElement(i, ii, "qty", v);

                    let value = props.setElementValue("unitId", i);
                    if (value != "") {
                      props.handleChangeArrayElement(
                        "unitId",
                        value,
                        i,
                        setFieldValue
                      );
                    }
                  }}
                  value={getUnitElement(i, ii, "qty")}
                />
              );
            })}

          {/* ); }) : ""} */}
        </div>
      </td>
      <td
        onClick={(e) => {
          e.preventDefault();
          let value = props.setElementValue("productId", i);
          if (value != "") {
            props.handleChangeArrayElement(
              "productId",
              value,
              i,
              setFieldValue
            );
          }
        }}
      >
        <div className="text-center">
          {rows &&
            rows[i] &&
            rows[i]["units"] &&
            rows[i]["units"].length > 0 &&
            rows[i]["units"].map((v, ii) => {
              return (
                <Form.Control
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    let v = e.target.value;
                    handleUnitElement(i, ii, "rate", v);

                    // handleUnitElement(
                    //     transaction_detail_index,
                    //     unitIndex,
                    //     "rate",
                    //     v
                    //   );
                  }}
                  value={getUnitElement(i, ii, "rate")}
                />
              );
            })}
        </div>
      </td>

      <td>
        <Form.Control
          type="text"
          // className="input-style"
          placeholder=""
          onChange={(value) => {
            props.handleChangeArrayElement(
              "dis_amt",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("dis_amt", i)}
          readOnly={isDisabled == true ? true : false}
        />
      </td>
      <td style={{ borderRight: "1px solid #9da2b4" }}>
        <Form.Control
          type="text"
          // className="input-style"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "dis_per",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("dis_per", i)}
          readOnly={isDisabled == true ? true : false}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "total_amt",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("total_amt", i)}
          readOnly
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "gst",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("gst", i)}
          readOnly
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "total_igst",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("total_igst", i)}
          readOnly
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0"
          onChange={(value) => {
            props.handleChangeArrayElement(
              "final_amt",
              value.target.value,
              i,
              setFieldValue
            );
          }}
          value={props.setElementValue("final_amt", i)}
          readOnly={isDisabled == true ? true : false}
        />
      </td>
      <td>
        <img src={delete_icon} style={{ width: "20px" }} />
      </td>
      <td>
        <img src={add_blue_circle} style={{ width: "20px" }} />
        <a
          className="btn-add-pckg"
          style={{
            width: "25%",
            fontSize: "15px",
            color: "primary",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.preventDefault();
            this.AddNewUnit(i);
          }}
        ></a>
      </td>
    </tr>
  );
}
