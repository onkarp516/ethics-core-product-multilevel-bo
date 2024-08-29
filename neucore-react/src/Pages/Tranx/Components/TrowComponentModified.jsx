import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form, Modal, Button, Card, Row, Col } from "react-bootstrap";
import TranxPackageModel from "./TranxPackageModel";
import { getProduct } from "@/services/api_functions";
import {
  AuthenticationCheck,
  MyDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
  ShowNotification,
  invoiceSelectTo,
} from "@/helpers";

import add_btn from "@/assets/images/add_btn.svg";
import add_product_btn from "@/assets/images/add_product_btn.svg";
import TranxBrand from "./TranxBrand";

const customStyles1 = {
  control: (base) => ({
    ...base,
    // marginLeft: -25,
    marginTop: 3,
    border: "1px solid transparent",
    height: 36,
    minHeight: 36,
    fontSize: "14px",
    marginBottom: 0,
    // marginRight: -10,
    boxShadow: "none",
    background: "transparent",
  }),
  dropdownIndicator: (base) => ({
    // background: "black",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 999,
    fontSize: "13px",
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

export default function TRowComponentModified(props) {
  const {
    i,
    productLst,
    setFieldValue,
    isDisabled,
    lstPackages,
    handlebatchModalShow,
    rows,
    setElementValue,
    handleChangeArrayElement,
    getProductPackageLst,
    batchModalShow1,
  } = props;

  return (
    <tr style={{ borderBottom: "1px solid #dee4eb" }}>
      <td style={{ padding: "0" }}>
        <Select
          className="selectTo selectdd"
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
      <td style={{ padding: "0" }}>
        {props.setElementValue("productId", i) &&
          props.setElementValue("productId", i) != undefined &&
          props.setElementValue("productId", i) != "" && (
            <>
              <img
                src={add_product_btn}
                alt=""
                className="add-btn"
                onClick={(e) => {
                  eventBus.dispatch("page_change", "newproductcreate");
                }}
              />
            </>
          )}
      </td>
      {/* <pre>{JSON.stringify(rows, undefined, 2)}</pre> */}

      <td colSpan={20} className="rwht" style={{ padding: "0" }}>
        <>
          {rows &&
            rows[i]["productDetails"] &&
            rows[i]["productDetails"].map((v, ii) => {
              return (
                <tr className="tr-row">
                  {props.setElementValue("productId", i) != "" ? (
                    <TranxBrand
                      rowIndex={i}
                      tranxBrandIndex={ii}
                      lstPackages={lstPackages}
                      {...props}
                    />
                  ) : (
                    // <TranxPackageModel
                    //   rowIndex={i}
                    //   transactionDetailIndex={ii}
                    //   lstPackages={lstPackages}
                    //   {...props}
                    // />
                    ""
                  )}
                </tr>
              );
            })}
        </>
      </td>
    </tr>
  );
}
