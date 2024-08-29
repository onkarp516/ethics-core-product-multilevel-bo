import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form, Modal, Button, Card } from "react-bootstrap";

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

export default function TRowComponent(props) {
  const { i, productLst, setFieldValue, isDisabled } = props;
  const [addModalShow, setAddModalShow] = useState(false);

  return (
    <tr className="entryrow">
      <td style={{ width: "2%" }}>{i + 1}</td>
      <td style={{ width: "30%" }}>
        <Select
          className="selectTo"
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
        <Form.Control
          style={{ border: "none" }}
          value={
            props.setElementValue("packageId", i)
              ? props.setElementValue("packageId", i)["label"]
              : ""
          }
        />
      </td>
      {/* {props.setElementValue("units", i)
        ? props.setElementValue("units", i).length > 0 &&
          props.setElementValue("units", i).map((v) => {
            return (
              <>
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
                  {v.unitId != "" ? v.unitId.label : ""}
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
                  {v.qty != "" ? v.qty : ""}
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
                  {v.base_amt != "" ? v.base_amt : ""}
                </td>
              </>
            );
          })
        : ""} */}
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
        {/* {props.setElementValue("units", i)
          ? props.setElementValue("units", i).length > 0 &&
            props.setElementValue("units", i).map((v) => {
              return (
                <tr>
                  <td>{v.unitId != "" ? v.unitId.label : ""}</td>
                  <td>{v.qty != "" ? v.qty : ""}</td>
                  <td>{v.base_amt != "" ? v.base_amt : ""}</td>
                </tr>
              );
            })
          : ""} */}

        <div className="text-center">
          {props.setElementValue("units", i)
            ? props.setElementValue("units", i).length > 0 &&
              props.setElementValue("units", i).map((v) => {
                return (
                  <>
                    {v != "" ? (
                      v.unitId == "" ? (
                        <Form.Control
                          type="text"
                          className="gstreadonly mb-1"
                          value={
                            v != ""
                              ? v.unitId != ""
                                ? v.unitId.label
                                : ""
                              : ""
                          }
                          readOnly
                        />
                      ) : (
                        <Form.Control
                          type="text"
                          className="gstreadonly unit-style mb-1"
                          value={
                            v != ""
                              ? v.unitId != ""
                                ? v.unitId.label
                                : ""
                              : ""
                          }
                          readOnly
                        />
                      )
                    ) : (
                      ""
                    )}
                  </>
                  // <div className="d-inline-flex">
                  //   <p className="me-4">
                  //     {v.unitId != "" ? "unit : " + v.unitId.label : ""}
                  //   </p>
                  //   <p className="me-4">{v.qty != "" ? "qnty:" + v.qty : ""}</p>
                  //   <p className="me-4">
                  //     {v.rate != "" ? "rate : " + v.rate : ""}
                  //   </p>
                  // </div>
                );
              })
            : ""}
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
        {/* {props.setElementValue("units", i)
          ? props.setElementValue("units", i).length > 0 &&
            props.setElementValue("units", i).map((v) => {
              return (
                <tr>
                  <td>{v.unitId != "" ? v.unitId.label : ""}</td>
                  <td>{v.qty != "" ? v.qty : ""}</td>
                  <td>{v.base_amt != "" ? v.base_amt : ""}</td>
                </tr>
              );
            })
          : ""} */}

        <div className="text-center">
          {props.setElementValue("units", i)
            ? props.setElementValue("units", i).length > 0 &&
              props.setElementValue("units", i).map((v) => {
                return (
                  <Form.Control
                    type="text"
                    className="gstreadonly mb-1"
                    value={v != "" ? (v.qty != "" ? v.qty : "") : ""}
                    readOnly
                  />
                  // <div className="d-inline-flex">
                  //   <p className="me-4">
                  //     {v.unitId != "" ? "unit : " + v.unitId.label : ""}
                  //   </p>
                  //   <p className="me-4">{v.qty != "" ? "qnty:" + v.qty : ""}</p>
                  //   <p className="me-4">
                  //     {v.rate != "" ? "rate : " + v.rate : ""}
                  //   </p>
                  // </div>
                );
              })
            : ""}
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
        {/* {props.setElementValue("units", i)
          ? props.setElementValue("units", i).length > 0 &&
            props.setElementValue("units", i).map((v) => {
              return (
                <tr>
                  <td>{v.unitId != "" ? v.unitId.label : ""}</td>
                  <td>{v.qty != "" ? v.qty : ""}</td>
                  <td>{v.base_amt != "" ? v.base_amt : ""}</td>
                </tr>
              );
            })
          : ""} */}

        <div className="text-center">
          {props.setElementValue("units", i)
            ? props.setElementValue("units", i).length > 0 &&
              props.setElementValue("units", i).map((v) => {
                return (
                  <Form.Control
                    type="text"
                    className="gstreadonly mb-1"
                    value={v.rate != "" ? +v.rate : ""}
                    readOnly
                  />
                  // <div className="d-inline-flex">
                  /* <p className="me-4">
                      {v.unitId != "" ? "unit : " + v.unitId.label : ""}
                    </p>
                    <p className="me-4">{v.qty != "" ? "qnty:" + v.qty : ""}</p> */
                  /* <p className="me-4">{v.rate != "" ? +v.rate : ""}</p> */
                  // </div>
                );
              })
            : ""}
        </div>
      </td>

      <td>
        <Form.Control
          type="text"
          className="input-style"
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
      <td>
        <Form.Control
          type="text"
          className="input-style"
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
      </td>
    </tr>
  );
}
