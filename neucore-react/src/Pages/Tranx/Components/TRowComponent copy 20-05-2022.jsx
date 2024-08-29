import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form, Modal, Button, Card, InputGroup } from "react-bootstrap";
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
  invoiceSelectTo,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
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

export default function TRowComponent(props) {
  const { i, productLst, setFieldValue, isDisabled, rows_count } = props;
  const [addModalShow, setAddModalShow] = useState(false);
  let row_data = [];
  for (let index = 0; index < rows_count; index++) {
    row_data.push(index);
  }

  return (
    <tr className="">
      <td>{i + 1}</td>
      <td style={{ width: "30%", borderRight: "1px solid #9da2b4" }}>
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
        style={{ width: "7%" }}
      >
        {props.setElementValue("productId", i) != "" ? (
          row_data != "" && row_data.length == 0 ? (
            <Select
              className="selectTo dd-style"
              // autoFocus={true}
              components={{
                //   DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              placeholder="Select"
              styles={invoiceSelectTo}
              // isClearable
              options={productLst}
              // onCreateOption={handleCreate}
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
              // isDisabled={isDisabled}
            />
          ) : (
            row_data.map((v) => {
              return (
                <>
                  <Form.Control
                    type="text"
                    placeholder=""
                    className="gstreadonly border-0 mt-2"
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
                    style={{ color: "black", lineHeight: "0.5" }}
                  />
                  <Select
                    className="selectTo dd-style"
                    // autoFocus={true}
                    components={{
                      //   DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    placeholder="Select"
                    styles={invoiceSelectTo}
                    // isClearable
                    options={productLst}
                    // onCreateOption={handleCreate}
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
                    // isDisabled={isDisabled}
                  />
                  <Select
                    className="selectTo dd-style mt-2"
                    // autoFocus={true}
                    components={{
                      //   DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    placeholder="Select"
                    styles={invoiceSelectTo}
                    // isClearable
                    options={productLst}
                    // onCreateOption={handleCreate}
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
                    // isDisabled={isDisabled}
                  />
                </>
              );
            })
          )
        ) : (
          "1"
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
        {props.setElementValue("productId", i) != "" ? (
          <>
            <Form.Control
              type="text"
              placeholder=""
              className="gstreadonly border-0 mt-2"
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
              style={{ color: "black", lineHeight: "0.5" }}
            />
            <Select
              className="selectTo dd-style"
              // autoFocus={true}
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              placeholder="Select"
              styles={invoiceSelectTo}
              // isClearable
              options={productLst}
              // onCreateOption={handleCreate}
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
              // isDisabled={isDisabled}
            />
            <Select
              className="selectTo dd-style mt-2"
              // autoFocus={true}
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              placeholder="Select"
              styles={invoiceSelectTo}
              // isClearable
              options={productLst}
              // onCreateOption={handleCreate}
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
              // isDisabled={isDisabled}
            />
          </>
        ) : (
          "1"
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
      >
        {props.setElementValue("productId", i) != "" ? (
          <>
            <Form.Control
              type="text"
              placeholder=""
              className="gstreadonly border-0 mt-2"
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
              style={{ color: "black", lineHeight: "0.5" }}
            />
            <Form.Control
              type="text"
              className="inputbox-style"
              // value={v != "" ? (v.qty != "" ? v.qty : "") : ""}
            />
            <Form.Control
              type="text"
              className="mt-2 inputbox-style"
              // value={v != "" ? (v.qty != "" ? v.qty : "") : ""}
            />
          </>
        ) : (
          "1"
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
      >
        {props.setElementValue("productId", i) != "" ? (
          <>
            <Form.Control
              type="text"
              placeholder=""
              className="gstreadonly border-0 mt-2"
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
              style={{ color: "black", lineHeight: "0.5" }}
            />
            <InputGroup>
              <Form.Control
                aria-label="Amount (to the nearest dollar)"
                className="inputbox-style"
              />
              <InputGroup.Text
                style={{
                  fontSize: "12px",
                  padding: "5px",
                  color: "gray",
                  height: "30px",
                }}
              >
                <FontAwesomeIcon icon={faIndianRupeeSign} />
              </InputGroup.Text>
            </InputGroup>
            <InputGroup className="mt-2">
              <Form.Control
                aria-label="Amount (to the nearest dollar)"
                className="inputbox-style"
              />
              <InputGroup.Text
                style={{
                  fontSize: "12px",
                  padding: "5px",
                  color: "gray",
                  height: "30px",
                }}
              >
                <FontAwesomeIcon icon={faIndianRupeeSign} />
              </InputGroup.Text>
            </InputGroup>
          </>
        ) : (
          "1"
        )}
      </td>

      <td>
        {props.setElementValue("productId", i) != "" ? (
          <>
            <Form.Control
              type="text"
              placeholder=""
              className="gstreadonly border-0 mt-2"
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
              style={{ color: "black", lineHeight: "0.5" }}
            />
            <InputGroup>
              <Form.Control
                aria-label="Amount (to the nearest dollar)"
                className="inputbox-style"
              />
              <InputGroup.Text
                style={{
                  fontSize: "12px",
                  padding: "5px",
                  color: "gray",
                  height: "30px",
                }}
              >
                <FontAwesomeIcon icon={faIndianRupeeSign} />
              </InputGroup.Text>
            </InputGroup>
            <InputGroup className="mt-2">
              <Form.Control
                aria-label="Amount (to the nearest dollar)"
                className="inputbox-style"
              />
              <InputGroup.Text
                style={{
                  fontSize: "12px",
                  padding: "5px",
                  color: "gray",
                  height: "30px",
                }}
              >
                <FontAwesomeIcon icon={faIndianRupeeSign} />
              </InputGroup.Text>
            </InputGroup>
          </>
        ) : (
          "1"
        )}
      </td>
      <td style={{ borderRight: "1px solid #9da2b4" }}>
        {props.setElementValue("productId", i) != "" ? (
          <>
            <Form.Control
              type="text"
              placeholder=""
              className="gstreadonly border-0 mt-2"
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
              style={{ color: "black", lineHeight: "0.5" }}
            />
            <InputGroup>
              <Form.Control
                aria-label="Amount (to the nearest dollar)"
                className="inputbox-style"
              />
              <InputGroup.Text
                style={{
                  fontSize: "12px",
                  padding: "5px",
                  color: "gray",
                  height: "30px",
                }}
              >
                %
              </InputGroup.Text>
            </InputGroup>
            <InputGroup className="mt-2">
              <Form.Control
                aria-label="Amount (to the nearest dollar)"
                className="inputbox-style"
              />
              <InputGroup.Text
                style={{
                  fontSize: "12px",
                  padding: "5px",
                  color: "gray",
                  height: "30px",
                }}
              >
                %
              </InputGroup.Text>
            </InputGroup>
          </>
        ) : (
          "1"
        )}
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0 mt-2"
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0 mt-2"
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
          style={{ color: "black", lineHeight: "0.5" }}
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0 mt-2"
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0 mt-2"
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
          style={{ color: "black", lineHeight: "0.5" }}
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0 mt-2"
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0 mt-2"
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
          style={{ color: "black", lineHeight: "0.5" }}
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0 mt-2"
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
        <Form.Control
          type="text"
          placeholder=""
          className="gstreadonly border-0 mt-2"
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
          style={{ color: "black", lineHeight: "0.5" }}
        />
      </td>
      <td>
        {props.setElementValue("productId", i) != "" ? (
          <>
            <img style={{ width: "20px" }} />
            <img src={delete_icon} style={{ width: "20px" }} />
            <img src={delete_icon} style={{ width: "20px" }} />
          </>
        ) : (
          "1"
        )}
      </td>
      <td>
        {props.setElementValue("productId", i) != "" ? (
          <>
            <img style={{ width: "20px" }} />
            <img src={add_blue_circle} style={{ width: "20px" }} />
            <img src={add_blue_circle} style={{ width: "20px" }} />
          </>
        ) : (
          "1"
        )}
      </td>
      <td>
        {props.setElementValue("productId", i) != "" ? (
          <>
            <FontAwesomeIcon icon={faAngleDown} />
            <FontAwesomeIcon icon={faAngleUp} />
          </>
        ) : (
          1
        )}
      </td>
    </tr>
  );
}
