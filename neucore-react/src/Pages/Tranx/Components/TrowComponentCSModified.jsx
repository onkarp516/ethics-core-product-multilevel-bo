import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form, Modal, Button, Card } from "react-bootstrap";
import TranxPackageModelCS from "./TranxPackageModelCS";

const customStyles1 = {
  control: (base) => ({
    // ...base,
    // height: 30,
    // minHeight: 30,
    // fontSize: "16px",
    // border: "none",
    // padding: "0 6px",
    // fontWeight: "500",
    // // fontFamily: "MontserratRegular",
    // boxShadow: "none",
    // background: "transparent",
    ...base,
    marginLeft: -25,
    marginTop: -5,
    height: 10,
    minHeight: 10,
    fontSize: "14px",
    border: "none",
    // padding: "0 6px",
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

export default function TRowComponentCSModified(props) {
  const {
    i,
    productLst,
    setFieldValue,
    isDisabled,
    lstPackages,
    rows,
    setElementValue,
    handleChangeArrayElement,
    getProductPackageLst,
  } = props;
  const [addModalShow, setAddModalShow] = useState(false);

  const AddNew = (rowIndex) => {
    let { rows, handleRowChange } = props;
    let data = {
      packageId: "",
      unitId: "",
      qty: "",
      rate: "",
      base_amt: "",
      unit_conv: "",
      dis_amt: "",
      dis_per: "",
      dis_per_cal: "",
      dis_amt_cal: "",
    };
    rows[rowIndex]["productDetails"] = [
      ...rows[rowIndex]["productDetails"],
      data,
    ];
    // console.log("rows", rows);
    handleRowChange(rows);
  };

  const RemoveNewUnit = (transaction_detail_index) => {
    const arr = [...props.rows];

    arr.splice(transaction_detail_index, 1);
    this.setState({ rows: arr });
  };
  return (
    <tr>
      <td>
        <p className="m-0 mt-1">{i + 1}</p>
      </td>
      <td>
        <Select
          className="selectTo m-0"
          // autoFocus={true}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          placeholder=""
          styles={customStyles1}
          isClearable={!isDisabled}
          options={productLst}
          // onCreateOption={handleCreate}
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
      {/* <pre>{JSON.stringify(rows, undefined, 2)}</pre> */}

      <td colSpan={12}>
        <>
          {rows &&
            rows[i]["productDetails"] &&
            rows[i]["productDetails"].map((v, ii) => {
              return (
                <tr>
                  {props.setElementValue("productId", i) != "" ? (
                    <TranxPackageModelCS
                      rowIndex={i}
                      transactionDetailIndex={ii}
                      lstPackages={lstPackages}
                      // getProductPackageLst={this.getProductPackageLst(this)}
                      {...props}
                    />
                  ) : (
                    ""
                  )}
                </tr>
              );
            })}
        </>
      </td>
      {/* <td>
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly"
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
          className="gstreadonly"
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
          className="gstreadonly"
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
          className="gstreadonly"
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
      </td> */}
      {/* <td className="text-end">
        <img
          src={add_blue_circle}
          onClick={(e) => {
            e.preventDefault();
            // this.setState({ addunits: true });
            AddNew(i);
          }}
        />
      </td>
      <td>
        <img
          src={delete_icon}
          onClick={(e) => {
            e.preventDefault();
            // this.setState({ addunits: true });
            RemoveNewUnit(i);
          }}
        />
      </td> */}
    </tr>
  );
}
