import React, { Component } from "react";
import Select from "react-select";
import {
  customStylesWhite,
  invoiceSelectTo,
  CheckIsRegisterdCompany,
  getSelectValue,
} from "@/helpers";
import {
  Modal,
  Row,
  Col,
  Form,
  CloseButton,
  Button,
  InputGroup,
} from "react-bootstrap";
import TransactionModalUnit from "./TransactionModalUnit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlug,
  faPlugCircleBolt,
  faPlusCircle,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import updown_arrow from "@/assets/images/updown_arrow.svg";
import add_blue_circle from "@/assets/images/add_circle_blue.svg";
import delete_icon from "@/assets/images/delete_icon.svg";
export default class TranxPackageModel extends Component {
  constructor(props) {
    super(props);
    //const { batchModalShow1 } = props;
    this.state = {
      isEditDataset: false,
    };
  }

  getPackageOpt = (rowIndex, transactionDetailIndex) => {
    let { lstPackages, rows } = this.props;
    let product_id = rows[rowIndex]["productId"]["value"];
    let findProductPackges = [];
    if (lstPackages.length > 0 && product_id != "" && product_id) {
      findProductPackges = getSelectValue(lstPackages, product_id);
    }
    return findProductPackges ? findProductPackges["package_opts"] : [];
  };

  AddNew = (rowIndex, transactionDetailIndex) => {
    // ;

    let { rows, handleRowChange, lstPackages, handlebatchModalShow } =
      this.props;

    let flst = this.getPackageOpt(rowIndex, transactionDetailIndex);
    console.log("flst", flst);
    if (
      flst &&
      flst.length === 1 &&
      this.getUnitOpt(rowIndex, transactionDetailIndex) &&
      this.getUnitOpt(rowIndex, transactionDetailIndex).length > 1
    ) {
      let packageId = "";
      if (flst.length >= 1) {
        packageId = flst[0];
      }
      let unitId = "";
      console.log("opt1", this.getUnitOpt(rowIndex, transactionDetailIndex));
      if (this.getUnitOpt(rowIndex, transactionDetailIndex).length > 1) {
        unitId = this.getUnitOpt(rowIndex, transactionDetailIndex)[0];
        // console.log("unit_id", this.unitId);
      }
      let data = {
        details_id: 0,
        packageId: packageId,
        unitId: unitId,
        qty: 1,
        rate: "",
        base_amt: 0,
        unit_conv: 0,
        dis_amt: 0,
        dis_per: 0,
        dis_per_cal: 0,
        dis_amt_cal: 0,
        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
      };
      rows[rowIndex]["productDetails"] = [
        ...rows[rowIndex]["productDetails"],
        data,
      ];
      handleRowChange(rows);
    } else if (
      flst &&
      flst.length > 1 &&
      this.getUnitOpt(rowIndex, transactionDetailIndex) &&
      this.getUnitOpt(rowIndex, transactionDetailIndex).length === 1
    ) {
      let packageId = "";
      if (flst.length >= 1) {
        packageId = flst[0];
      }
      let unitId = "";
      console.log("opt1", this.getUnitOpt(rowIndex, transactionDetailIndex));
      if (this.getUnitOpt(rowIndex, transactionDetailIndex).length > 1) {
        unitId = this.getUnitOpt(rowIndex, transactionDetailIndex)[0];
        // console.log("unit_id", this.unitId);
      }
      let data = {
        details_id: 0,
        packageId: packageId,
        unitId: unitId,
        qty: 1,
        rate: "",
        base_amt: 0,
        unit_conv: 0,
        dis_amt: 0,
        dis_per: 0,
        dis_per_cal: 0,
        dis_amt_cal: 0,
        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
      };
      rows[rowIndex]["productDetails"] = [
        ...rows[rowIndex]["productDetails"],
        data,
      ];
      handleRowChange(rows);
    } else if (
      flst &&
      flst.length > 1 &&
      this.getUnitOpt(rowIndex, transactionDetailIndex) &&
      this.getUnitOpt(rowIndex, transactionDetailIndex).length > 1
    ) {
      let packageId = "";
      if (flst.length >= 1) {
        packageId = flst[0];
      }
      let unitId = "";
      console.log("opt1", this.getUnitOpt(rowIndex, transactionDetailIndex));
      if (this.getUnitOpt(rowIndex, transactionDetailIndex).length > 1) {
        unitId = this.getUnitOpt(rowIndex, transactionDetailIndex)[0];
        // console.log("unit_id", this.unitId);
      }
      let data = {
        details_id: 0,
        packageId: packageId,
        unitId: unitId,
        qty: 1,
        rate: "",
        base_amt: 0,
        unit_conv: 0,
        dis_amt: 0,
        dis_per: 0,
        dis_per_cal: 0,
        dis_amt_cal: 0,
        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
      };
      rows[rowIndex]["productDetails"] = [
        ...rows[rowIndex]["productDetails"],
        data,
      ];
      console.log("Data--->", data);
      handleRowChange(rows);
    } else {
      console.log("No units left");
    }
  };

  RemoveNew = (rowIndex, transaction_detail_index) => {
    let { rows, handleRowChange } = this.props;
    let Frows = rows;
    let InnerRows = Frows[rowIndex]["productDetails"].filter(
      (v, i) => i !== transaction_detail_index
    );
    Frows[rowIndex]["productDetails"] = InnerRows;
    handleRowChange(Frows);

    this.props.handleChangeArrayElement();
  };

  getUnitOpt = (rowIndex, transactionDetailIndex) => {
    let pkgId = this.getPackageValue(
      rowIndex,
      transactionDetailIndex,
      "packageId"
    );
    return pkgId ? pkgId["unitOpt"] : [];
  };

  getUnitElement = (rowIndex, transactionDetailIndex, element) => {
    // ;
    let { rows } = this.props;
    // console.log(" unitIndex, element", unitIndex, element);
    // console.log({ rows });
    if (element != "unitId") {
      return rows
        ? isNaN(
            rows[rowIndex]["productDetails"][transactionDetailIndex][element]
          )
          ? 0
          : rows[rowIndex]["productDetails"][transactionDetailIndex][element]
        : "";
    }
    return rows
      ? rows[rowIndex]["productDetails"][transactionDetailIndex][element]
      : "";
  };
  getRateElement = (rowIndex, transactionDetailIndex, element) => {
    let { rows } = this.props;
    // console.log(" unitIndex, element", unitIndex, element);
    // console.log({ rows });
    return rows
      ? rows[rowIndex]["productDetails"][transactionDetailIndex][element]
      : "";
  };

  handleUnitElement = (rowIndex, transactionDetailIndex, element, value) => {
    //;
    let {
      rows,
      handleRowChange,
      lstPackages,
      handleLstPackage,
      tranx,
      handlebatchModalShow,
      showBatch,
    } = this.props;
    // console.log("handleRowChange", handleRowChange);
    if (element === "unitId") {
      // console.log("value", value);
      if (tranx === "purchase") {
        rows[rowIndex]["productDetails"][transactionDetailIndex]["rate"] =
          value.purchase_rate;
      } else if (tranx === "sales") {
        rows[rowIndex]["productDetails"][transactionDetailIndex]["rate"] =
          value.mrp;
      } else {
        rows[rowIndex]["productDetails"][transactionDetailIndex][element] =
          value;
      }
    }
    rows[rowIndex]["productDetails"][transactionDetailIndex][element] = value;

    this.setState(
      {
        isEditDataset: true,
      },
      () => {
        if (showBatch && element == "unitId") {
          handleRowChange(rows, true, rowIndex, transactionDetailIndex);
        } else {
          handleRowChange(rows);
        }
      }
    );
  };
  handleRateElement = (rowIndex, transactionDetailIndex, element, value) => {
    let { rows, handleRowChange, lstPackages, handleLstPackage } = this.props;
    // console.log("handleRowChange", handleRowChange);
    rows[rowIndex]["productDetails"][transactionDetailIndex]["purchase_rate"] =
      value;

    this.setState(
      {
        isEditDataset: true,
      },
      () => {
        handleRowChange(rows);
      }
    );
  };

  handlePackageChange = (rowIndex, transactionDetailIndex, element, value) => {
    let { rows, handleRowChange, lstPackages, handleLstPackage } = this.props;

    rows[rowIndex]["productDetails"][transactionDetailIndex][element] = value;
    // console.log("rows", rows);
    if (element === "packageId") {
      let selectedPkg = rows[rowIndex]["productDetails"].map((v) => {
        return v["packageId"];
      });
      let result = lstPackages.filter((o1) =>
        selectedPkg.some((o2) => o1.value !== o2.value)
      );
      // console.log("result", result);
      // handleLstPackage(result);
    }

    handleRowChange(rows);
  };

  getPackageValue = (rowIndex, transactionDetailIndex, element) => {
    let { rows } = this.props;
    return rows
      ? rows[rowIndex]["productDetails"][transactionDetailIndex][element]
      : "";
  };
  // getunitValue = (rowIndex, transactionDetailIndex, element) => {
  //   let { rows } = this.props;
  //   return rows
  //     ? rows[rowIndex]["productDetails"][transactionDetailIndex][element]
  //     : "";
  // };
  checkIsPackageExist = (rowIndex) => {
    let { lstPackages } = this.props;
    // console.log({ lstPackages });
    if (lstPackages.id !== "" && lstPackages.is_multi_unit === "false") {
      if (lstPackages[0][rowIndex]["label"] === "") {
        return true;
      }
    }
    return false;
  };

  checkIsBatchExist = (rowIndex) => {
    let { setElementValue } = this.props;
    // console.log("Product Batch---->", { productLst });
    // if (productLst.isBatchNo === "false") {
    //   if (productLst.isBatchNo[0][rowIndex]["label"] === "") {
    //     return true;
    //   }
    // }
    let p = setElementValue("productId", rowIndex);
    // console.log("P", p);
    if (p.isBatchNo !== "" && p.isBatchNo === false) {
      return true;
    }
    return false;
  };

  componentDidUpdate() {}

  render() {
    let {
      transaction_mdl_show,
      handleTranxModal,
      transactionDetailIndex,
      lstPackages,
      rowIndex,
      rows,
      handleRowChange,
      setElementValue,
      handleChangeArrayElement,
      isDisabled,
      setFieldValue,
      tranx,
      getProductPackageLst,
      showBaseAmt,
    } = this.props;

    return (
      <>
        <td
          style={{
            width: "8%",
          }}
        >
          {this.getPackageValue(
            rowIndex,
            transactionDetailIndex,
            "flavourId"
          ) &&
            this.getPackageValue(rowIndex, transactionDetailIndex, "flavourId")[
              "label"
            ] !== "" && (
              <Select
                className="selectTo selectdd"
                styles={invoiceSelectTo}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder="Select"
                options={this.getPackageOpt(rowIndex, transactionDetailIndex)}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handlePackageChange(
                      rowIndex,
                      transactionDetailIndex,
                      "flavourId",
                      ""
                    );
                  } else {
                    this.handlePackageChange(
                      rowIndex,
                      transactionDetailIndex,
                      "flavourId",
                      v
                    );
                  }
                }}
                value={this.getPackageValue(
                  rowIndex,
                  transactionDetailIndex,
                  "flavourId"
                )}
                isDisabled={this.checkIsPackageExist(rowIndex)}
              />
            )}
        </td>
        <td
          style={{
            // borderLeft: "1px solid #9da2b4",
            // width: "130px",
            width: "8%",
          }}
        >
          {this.getPackageValue(
            rowIndex,
            transactionDetailIndex,
            "packageId"
          ) &&
            this.getPackageValue(rowIndex, transactionDetailIndex, "packageId")[
              "label"
            ] !== "" && (
              <Select
                className="selectTo selectdd"
                styles={invoiceSelectTo}
                components={{
                  //   DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder="Select"
                options={this.getPackageOpt(rowIndex, transactionDetailIndex)}
                onChange={(v, actions) => {
                  if (actions.action === "clear") {
                    this.handlePackageChange(
                      rowIndex,
                      transactionDetailIndex,
                      "packageId",
                      ""
                    );
                  } else {
                    this.handlePackageChange(
                      rowIndex,
                      transactionDetailIndex,
                      "packageId",
                      v
                    );
                  }
                }}
                value={this.getPackageValue(
                  rowIndex,
                  transactionDetailIndex,
                  "packageId"
                )}
                isDisabled={this.checkIsPackageExist(rowIndex)}
              />
            )}
        </td>

        <td
          style={{
            width: "7%",
            // width: "120px",
          }}
        >
          <Select
            className="selectTo selectdd"
            isClearable={false}
            components={{
              //   DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            styles={invoiceSelectTo}
            options={this.getUnitOpt(rowIndex, transactionDetailIndex)}
            placeholder="Select"
            onChange={(v, actions) => {
              // console.log(" unitIndex, element", unitIndex, element);
              // console.log({ rows });
              if (actions.action === "clear") {
                this.handleUnitElement(
                  rowIndex,
                  transactionDetailIndex,
                  "unitId",
                  ""
                );
              } else {
                this.handleUnitElement(
                  rowIndex,
                  transactionDetailIndex,
                  "unitId",
                  v
                );
              }
              // this.batchModalShow1();
            }}
            value={this.getUnitElement(
              rowIndex,
              transactionDetailIndex,
              "unitId"
            )}
          />
          {/* )} */}
        </td>
        <td
          style={{
            width: "7%",
            // width: "100px",
          }}
        >
          {this.checkIsBatchExist(rowIndex) === false && (
            <Form.Control
              className="box-style p-1"
              type="text"
              placeholder="0"
              onChange={(e) => {
                if (this.checkIsBatchExist(rowIndex) === false) {
                  let v = e.target.value;
                  this.handleUnitElement(
                    rowIndex,
                    transactionDetailIndex,
                    "b_no",
                    v
                  );
                }
              }}
              value={this.getUnitElement(
                rowIndex,
                transactionDetailIndex,
                "b_no"
              )}
              isDisabled={this.checkIsBatchExist(rowIndex)}
            />
          )}
          {/* <InputGroup> */}

          {/* Check
          {JSON.stringify(this.checkIsBatchExist(rowIndex))} */}
        </td>
        <td
          style={{
            width: "4%",
            // width: "110px",
          }}
        >
          <Form.Control
            className="box-style p-1"
            type="text"
            placeholder="0"
            onChange={(e) => {
              let v = e.target.value;
              this.handleUnitElement(
                rowIndex,
                transactionDetailIndex,
                "qty",
                v
              );
            }}
            value={this.getUnitElement(rowIndex, transactionDetailIndex, "qty")}
          />
          {/* <InputGroup.Text
              style={{
                // marginTop: "-5px",
                fontSize: "12px",
                padding: "5px",
                color: "gray",
                height: "25px",
              }}
            >
              <img src={updown_arrow} />
            </InputGroup.Text> */}
        </td>
        <td
          style={{
            width: "5%",
            // width: "100px",
          }}
        >
          {/* <InputGroup> */}
          <Form.Control
            className="box-style p-1"
            type="text"
            placeholder="0"
            onChange={(e) => {
              let v = e.target.value;
              this.handleUnitElement(
                rowIndex,
                transactionDetailIndex,
                "rate",
                v
              );
            }}
            value={this.getUnitElement(
              rowIndex,
              transactionDetailIndex,
              "rate"
            )}
          />
          {/* <InputGroup.Text
              style={{
                // marginTop: "-5px",
                fontSize: "12px",
                padding: "5px",
                color: "gray",
                height: "25px",
              }}
            >
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                style={{ fontSize: "8px" }}
              />
            </InputGroup.Text>
          </InputGroup> */}
        </td>
        <td
          style={{
            width: "5%",
            // width: "100px",
          }}
        >
          {/* <InputGroup> */}
          <Form.Control
            className="box-style p-1"
            type="text"
            placeholder="0"
            onChange={(value) => {
              this.handleUnitElement(
                rowIndex,
                transactionDetailIndex,
                "dis_amt",
                value.target.value
              );
              // this.props.handleChangeArrayElement(
              //   "dis_amt",
              //   value.target.value,
              //   rowIndex,
              //   setFieldValue
              // );
            }}
            value={this.getUnitElement(
              rowIndex,
              transactionDetailIndex,
              "dis_amt"
            )}
            readOnly={isDisabled == true ? true : false}
          />
          {/* <InputGroup.Text
              style={{
                // marginTop: "-5px",
                fontSize: "12px",
                padding: "5px",
                color: "gray",
                height: "25px",
              }}
            >
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                style={{ fontSize: "8px" }}
              />
            </InputGroup.Text>
          </InputGroup> */}
        </td>
        <td
          style={{
            // borderRight: "1px solid #9da2b4",
            // width: "100px",
            width: "5%",
          }}
        >
          {/* <InputGroup style={{ paddingRight: "10px" }}> */}
          <Form.Control
            className="box-style p-1"
            type="text"
            placeholder="0"
            onChange={(value) => {
              // this.props.handleChangeArrayElement(
              //   "dis_per",
              //   value.target.value,
              //   rowIndex,
              //   setFieldValue
              // );
              this.handleUnitElement(
                rowIndex,
                transactionDetailIndex,
                "dis_per",
                value.target.value
              );
            }}
            value={this.getUnitElement(
              rowIndex,
              transactionDetailIndex,
              "dis_per"
            )}
            readOnly={isDisabled === true ? true : false}
          />
          {/* <InputGroup.Text
              style={{
                // marginTop: "-5px",
                fontSize: "8px",
                padding: "2px",
                color: "gray",
                height: "25px",
              }}
            >
              %
            </InputGroup.Text>
          </InputGroup> */}
        </td>
        {/* {JSON.stringify(lstPackages, undefined, 2)} */}
        {/* {lstPackages.id != "" && lstPackages.is_multi_unit == "true" ? (
          <> */}

        {CheckIsRegisterdCompany() === true ||
        tranx === "purchase" ||
        showBaseAmt ? (
          <>
            <td
              style={{
                // background: "#DEE4EB",
                // width: "110px",
                width: "8%",
              }}
            >
              <Form.Control
                // style={{ paddingLeft: "10px" }}
                type="text"
                placeholder=""
                className="box-style p-1"
                onChange={(value) => {
                  // this.props.handleChangeArrayElement(
                  //   "total_amt",
                  //   value.target.value,
                  //   transactionDetailIndex,
                  //   setFieldValue
                  // );
                }}
                value={this.getUnitElement(
                  rowIndex,
                  transactionDetailIndex,
                  "total_amt"
                )}
                readOnly
              />
            </td>

            <td
              style={{
                // background: "#DEE4EB",
                // width: "80px",
                width: "5%",
              }}
            >
              <Form.Control
                type="text"
                placeholder=""
                className="box-style p-1"
                onChange={(value) => {
                  // this.props.handleChangeArrayElement(
                  //   "gst",
                  //   value.target.value,
                  //   transactionDetailIndex,
                  //   setFieldValue
                  // );
                }}
                value={this.getUnitElement(
                  rowIndex,
                  transactionDetailIndex,
                  "gst"
                )}
                readOnly
              />
            </td>
            <td
              style={{
                // background: "#DEE4EB",
                // width: "120px",
                width: "8%",
              }}
            >
              <Form.Control
                type="text"
                placeholder=""
                className="box-style p-1"
                onChange={(value) => {
                  // this.props.handleChangeArrayElement(
                  //   "total_igst",
                  //   value.target.value,
                  //   transactionDetailIndex,
                  //   setFieldValue
                  // );
                }}
                value={this.getUnitElement(
                  rowIndex,
                  transactionDetailIndex,
                  "total_igst"
                )}
                readOnly
              />
            </td>
          </>
        ) : (
          <>
            <td
              style={
                {
                  // background: "#DEE4EB",
                  // width: "150px",
                }
              }
            ></td>
            <td
              style={
                {
                  // background: "#DEE4EB",
                  // width: "150px",
                }
              }
            ></td>
          </>
        )}
        <td
          style={{
            // background: "#DEE4EB",
            // width: "150px",
            width: "8%",
          }}
        >
          <Form.Control
            type="text"
            placeholder=""
            className="box-style p-1"
            onChange={(value) => {
              // this.props.handleChangeArrayElement(
              //   "final_amt",
              //   value.target.value,
              //   transactionDetailIndex,
              //   setFieldValue
              // );
            }}
            value={this.getUnitElement(
              rowIndex,
              transactionDetailIndex,
              "final_amt"
            )}
            readOnly={isDisabled == true ? true : false}
          />
        </td>
        {/* {JSON.stringify(rows, undefined, 2)} */}
        {/* {rows[rowIndex]["productDetails"][transactionDetailIndex]["packageId"][
          "id"
        ] != "" && */}

        {/* rows[rowIndex]["productDetails"][transactionDetailIndex]["packageId"][
            "is_multi_unit"
          ] == true ? ( */}
        <td
          // className="text-end"
          style={{
            // background: "#DEE4EB",
            // width: "20px",
            width: "2%",
          }}
        >
          <img
            src={add_blue_circle}
            onClick={(e) => {
              e.preventDefault();
              // this.setState({ addunits: true });
              let value = this.props.setElementValue("productId", rowIndex);
              if (value != "") {
                this.props.handleChangeArrayElement(
                  "productId",
                  value,
                  rowIndex,
                  setFieldValue
                );
              }

              // this.props.getProductPackageLst(value);
              this.AddNew(rowIndex, transactionDetailIndex);
            }}
          />
        </td>
        {/* ) : (
            // </>
            <td></td>
          )
        } */}
        {transactionDetailIndex != 0 ? (
          <td
            style={{
              width: "2%",
              // background: "#DEE4EB",
              // width: "20px",
            }}
          >
            <img
              src={delete_icon}
              onClick={(e) => {
                e.preventDefault();
                // this.setState({ addunits: true });
                this.RemoveNew(rowIndex, transactionDetailIndex);
              }}
            />
          </td>
        ) : (
          <td
            style={{
              // background: "#DEE4EB",
              // width: "20px",
              width: "2%",
            }}
          ></td>
        )}
      </>
    );
  }
}
