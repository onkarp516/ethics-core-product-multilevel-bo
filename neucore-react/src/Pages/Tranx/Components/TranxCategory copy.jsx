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
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createPacking,
  createFlavour,
  createUnit,
  updateUnit,
} from "@/services/api_functions";
import { createPro, ShowNotification } from "@/helpers";

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
import add_btn from "@/assets/images/add_btn.svg";
import plus_img from "@/assets/images/plus_img.svg";
import minus_img from "@/assets/images/minus_img.svg";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
const uomoption = [
  { label: "BAG", value: "Services" },
  { label: "BAL", value: "BAL" },
  { label: "BDL", value: "BDL" },
  { label: "BKL", value: "BKL" },
  { label: "BOU", value: "BOU" },
  { label: "BOX", value: "BOX" },
  { label: "BTL", value: "BTL" },
  { label: "BUN", value: "BUN" },
  { label: "CAN", value: "CAN" },
  { label: "CBM", value: "CBM" },
  { label: "CCM", value: "CCM" },
  { label: "CMS", value: "CMS" },
  { label: "CTN", value: "CTN" },
  { label: "DOZ", value: "DOZ" },
  { label: "DRM", value: "DRM" },
  { label: "GGK", value: "GGK" },
  { label: "GMS", value: "GMS" },
  { label: "GRS", value: "GRS" },
  { label: "GYD", value: "GYD" },
  { label: "KGS", value: "KGS" },
  { label: "KLR", value: "KLR" },
  { label: "KME", value: "KME" },
  { label: "MLT", value: "MLT" },
  { label: "MTR", value: "MTR" },
  { label: "MTS", value: "MTS" },
  { label: "NOS", value: "NOS" },
  { label: "PAC", value: "PAC" },
  { label: "PCS", value: "PCS" },
  { label: "PRS", value: "PRS" },
  { label: "QTL", value: "QTL" },
  { label: "ROL", value: "ROL" },
  { label: "SET", value: "SET" },
  { label: "SQF", value: "SQF" },
  { label: "SQM", value: "SQM" },
  { label: "TBS", value: "TBS" },
  { label: "TGM", value: "TGM" },
  { label: "THD", value: "THD" },
  { label: "TON", value: "TON" },
  { label: "TUB", value: "TUB" },
  { label: "UGS", value: "UGS" },
  { label: "UNT", value: "UNT" },
  { label: "YDS", value: "YDS" },
  { label: "OTH", value: "OTH" },
];
export default class TranxCategory extends Component {
  constructor(props) {
    super(props);
    //const { batchModalShow1 } = props;
    this.state = {
      isEditDataset: false,
      packageModalShow: false,
      flavourModalShow: false,
      unitModalShow: false,
      initVal: {
        id: "",
        unitName: "",
        unitCode: "",
        uom: "",
      },
      packagingInitVal: {
        id: "",
        packing_name: "",
      },
      flavourInitval: {
        id: "",
        flavour_name: "",
      },
    };
  }

  getBrandOpt = (rowIndex) => {
    let { lstPackages, rows } = this.props;
    let product_id = rows[rowIndex]["productId"]["value"];
    let findProductBrand = [];
    if (lstPackages.length > 0 && product_id != "" && product_id) {
      findProductBrand = getSelectValue(lstPackages, product_id);
    }
    return findProductBrand ? findProductBrand["brand_opts"] : [];
  };

  getCategoryOpt = (rowIndex, transactionDetailIndex) => {
    // debugger;
    let { lstPackages, rows } = this.props;
    let product_id = rows[rowIndex]["productId"]["value"];
    let brand_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["brandId"][
        "value"
      ];
    let findProductPackges;
    let catOpt;
    if (lstPackages.length > 0 && product_id != "" && product_id) {
      findProductPackges = getSelectValue(lstPackages, product_id);
    }
    if (findProductPackges) {
      catOpt = getSelectValue(findProductPackges.brand_opts, brand_id);
    }

    // console.log("findProductPackges ==-->>????", findProductPackges);
    // console.log("pkgOpt", pkgOpt);
    return catOpt ? catOpt["categoryOpt"] : [];
  };

  // getFlavourOpt = (rowIndex) => {
  //   let { lstPackages, rows } = this.props;
  //   let product_id = rows[rowIndex]["productId"]["value"];
  //   let findProductFlavour = [];
  //   if (lstPackages.length > 0 && product_id != "" && product_id) {
  //     findProductFlavour = getSelectValue(lstPackages, product_id);
  //   }
  //   return findProductFlavour ? findProductFlavour["flavour_opts"] : [];
  // };

  getFlavourOpt = (rowIndex, transactionDetailIndex) => {
    // debugger;
    let { lstPackages, rows } = this.props;
    let product_id = rows[rowIndex]["productId"]["value"];
    let brand_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["brandId"][
        "value"
      ];
    let category_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["categoryId"][
        "value"
      ];
    let findProductPackges;
    let catOpt;
    let flavourOpt;
    if (lstPackages.length > 0 && product_id != "" && product_id) {
      findProductPackges = getSelectValue(lstPackages, product_id);
    }
    if (findProductPackges) {
      catOpt = getSelectValue(findProductPackges.brand_opts, brand_id);
    }
    if (catOpt) {
      flavourOpt = getSelectValue(catOpt.categoryOpt, category_id);
    }
    // console.log("findProductPackges ==-->>????", findProductPackges);
    // console.log("pkgOpt", pkgOpt);
    return flavourOpt ? flavourOpt["flavourOpt"] : [];
  };

  getPackageOpt = (rowIndex, transactionDetailIndex) => {
  
    let { lstPackages, rows } = this.props;
    let product_id = rows[rowIndex]["productId"]["value"];

    let brand_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["brandId"][
        "value"
      ];
    let category_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["categoryId"][
        "value"
      ];
    let flavour_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["flavourId"][
        "value"
      ];
    let findProductPackges;
    let catOpt;
    let flavourOpt;
    let pkgOpt;
    if (lstPackages.length > 0 && product_id != "" && product_id) {
      findProductPackges = getSelectValue(lstPackages, product_id);
    }
    if (findProductPackges) {
      catOpt = getSelectValue(findProductPackges.brand_opts, brand_id);
    }
    if (catOpt) {
      flavourOpt = getSelectValue(catOpt.categoryOpt, category_id);
    }

    if (flavourOpt) {
      pkgOpt = getSelectValue(flavourOpt.flavourOpt, flavour_id);
    }

    // console.log("findProductPackges ==-->>????", findProductPackges);
    // console.log("pkgOpt", pkgOpt);
    return pkgOpt ? pkgOpt["packageOpt"] : [];
  };
  getUnitOpt = (rowIndex, transactionDetailIndex) => {
    // debugger;
    let { lstPackages, rows } = this.props;
    let product_id = rows[rowIndex]["productId"]["value"];
    let brand_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["brandId"][
        "value"
      ];
    let category_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["categoryId"][
        "value"
      ];
    let flavour_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["flavourId"][
        "value"
      ];
    let package_id =
      rows[rowIndex]["productDetails"][transactionDetailIndex]["packageId"][
        "value"
      ];
    let findProductPackges;
    let catOpt;
    let flavourOpt;
    let pkgOpt;
    let unitOpt;
    if (lstPackages.length > 0 && product_id != "" && product_id) {
      findProductPackges = getSelectValue(lstPackages, product_id);
    }
    if (findProductPackges) {
      pkgOpt = getSelectValue(findProductPackges.flavour_opts, flavour_id);
    }
    if (findProductPackges) {
      catOpt = getSelectValue(findProductPackges.brand_opts, brand_id);
    }
    if (catOpt) {
      flavourOpt = getSelectValue(catOpt.categoryOpt, category_id);
    }

    if (flavourOpt) {
      pkgOpt = getSelectValue(flavourOpt.flavourOpt, flavour_id);
    }
    if (pkgOpt) {
      unitOpt = getSelectValue(pkgOpt.packageOpt, package_id);
    }
    // console.log("findProductPackges ==-->>????", findProductPackges);
    // console.log("pkgOpt", pkgOpt);
    return unitOpt ? unitOpt["unitOpt"] : [];
  };

  // AddNew = (rowIndex, transactionDetailIndex) => {
  //   // debugger;

  //   let { rows, handleRowChange, lstPackages, handlebatchModalShow } =
  //     this.props;

  //   let data = {
  //     details_id: 0,
  //     flavourId: "",
  //     packageId: "",
  //     unitId: "",
  //     qty: 1,
  //     rate: "",
  //     base_amt: 0,
  //     unit_conv: 0,
  //     dis_amt: 0,
  //     dis_per: 0,
  //     dis_per_cal: 0,
  //     dis_amt_cal: 0,
  //     gst: 0,
  //     igst: 0,
  //     cgst: 0,
  //     sgst: 0,
  //     total_igst: 0,
  //     total_cgst: 0,
  //     total_sgst: 0,
  //     final_amt: 0,
  //     discount_proportional_cal: 0,
  //     additional_charges_proportional_cal: 0,
  //   };
  //   rows[rowIndex]["productDetails"] = [
  //     ...rows[rowIndex]["productDetails"],
  //     data,
  //   ];
  //   handleRowChange(rows);
  // };

  AddNew = (rowIndex, transactionDetailIndex) => {
    // debugger;

    let { rows, handleRowChange, lstPackages, handlebatchModalShow } =
      this.props;
    // let brandId="";
    let catId = "";

    let flavId = "";
    let pkgId = "";
    let unitId = "";
    // let flst = this.getFlavourOpt(rowIndex, transactionDetailIndex);
    let blst = this.getBrandOpt(rowIndex, transactionDetailIndex);
    catId = this.getCategoryOpt(rowIndex, transactionDetailIndex);
    flavId = this.getFlavourOpt(rowIndex, transactionDetailIndex);
    pkgId = this.getPackageOpt(rowIndex, transactionDetailIndex);
    unitId = this.getUnitOpt(rowIndex, transactionDetailIndex);
    if (
      blst.length > 0 &&
      catId.length > 0 &&
      flavId.length > 0 &&
      pkgId.length > 0 &&
      unitId.length > 0
    ) {
      if (
        blst.length > 1 ||
        catId.length > 1 ||
        flavId.length > 1 ||
        pkgId.length > 1 ||
        unitId.length > 1
      ) {
        // console.log("third cond");
        let data = {
          details_id: 0,
          brandId: blst[0],
          categoryId: catId[0],
          flavourId: flavId[0],
          packageId: pkgId[0],
          unitId: unitId[0],
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
          b_details_id: 0,
        };
        rows[rowIndex]["productDetails"] = [
          ...rows[rowIndex]["productDetails"],
          data,
        ];
        handleRowChange(rows);
      }
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

  getBrandElement = (rowIndex, transactionDetailIndex, element) => {
    // debugger;
    let { rows } = this.props;
    // console.log(" unitIndex, element", unitIndex, element);
    // console.log({ rows });
    if (element != "brandId") {
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

  getCategoryElement = (rowIndex, transactionDetailIndex, element) => {
    // debugger;
    let { rows } = this.props;
    // console.log(" unitIndex, element", unitIndex, element);
    // console.log({ rows });
    if (element != "categoryId") {
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

  getFlavourElement = (rowIndex, transactionDetailIndex, element) => {
    // debugger;
    let { rows } = this.props;
    // console.log(" unitIndex, element", unitIndex, element);
    // console.log({ rows });
    if (element != "flavourId") {
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

  getPackageElement = (rowIndex, transactionDetailIndex, element) => {
    // debugger;
    let { rows } = this.props;
    // console.log(" unitIndex, element", unitIndex, element);
    // console.log({ rows });
    if (element != "packageId") {
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

  getUnitElement = (rowIndex, transactionDetailIndex, element) => {
    // debugger;
    let { rows } = this.props;
    // console.log(
    //   " unitIndex, element",
    //   rowIndex,
    //   transactionDetailIndex,
    //   element
    // );
    // // console.log({ rows });
    if (element != "unitId" && element != "b_no") {
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
  handleFlavourModalShow = (status) => {
    this.setState({
      flavourModalShow: status,
    });
  };
  handlePackageModalShow = (status) => {
    this.setState({
      packageModalShow: status,
    });
  };
  handelUnitModalShow = (status) => {
    console.log("in model");
    this.setState({ unitModalShow: status });
  };
  handleUnitElement = (rowIndex, transactionDetailIndex, element, value) => {
    //debugger;
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

  handleBrandChange = (rowIndex, transactionDetailIndex, element, value) => {
    let { rows, handleRowChange, lstPackages, handleLstFlavour } = this.props;

    rows[rowIndex]["productDetails"][transactionDetailIndex][element] = value;
    // console.log("rows", rows);
    if (element === "brandId") {
      let selectedPkg = rows[rowIndex]["productDetails"].map((v) => {
        return v["brandId"];
      });
      let result = lstPackages.filter((o1) =>
        selectedPkg.some((o2) => o1.value !== o2.value)
      );
      // console.log("result", result);
      // handleLstPackage(result);
    }

    handleRowChange(rows);
  };

  handleCategoryChange = (rowIndex, transactionDetailIndex, element, value) => {
    let { rows, handleRowChange, lstPackages, handleLstFlavour } = this.props;

    rows[rowIndex]["productDetails"][transactionDetailIndex][element] = value;
    // console.log("rows", rows);
    if (element === "categoryId") {
      let selectedPkg = rows[rowIndex]["productDetails"].map((v) => {
        return v["categoryId"];
      });
      let result = lstPackages.filter((o1) =>
        selectedPkg.some((o2) => o1.value !== o2.value)
      );
      // console.log("result", result);
      // handleLstPackage(result);
    }

    handleRowChange(rows);
  };

  handleFlavourChange = (rowIndex, transactionDetailIndex, element, value) => {
    let { rows, handleRowChange, lstPackages, handleLstFlavour } = this.props;

    rows[rowIndex]["productDetails"][transactionDetailIndex][element] = value;
    // console.log("rows", rows);
    if (element === "flavourId") {
      let selectedPkg = rows[rowIndex]["productDetails"].map((v) => {
        return v["flavourId"];
      });
      let result = lstPackages.filter((o1) =>
        selectedPkg.some((o2) => o1.value !== o2.value)
      );
      // console.log("result", result);
      // handleLstPackage(result);
    }

    handleRowChange(rows);
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

  getBrandValue = (rowIndex, transactionDetailIndex, element) => {
    let { rows } = this.props;
    return rows
      ? rows[rowIndex]["productDetails"][transactionDetailIndex][element]
      : "";
  };

  getCategoryValue = (rowIndex, transactionDetailIndex, element) => {
    let { rows } = this.props;
    return rows
      ? rows[rowIndex]["productDetails"][transactionDetailIndex][element]
      : "";
  };

  getFlavourValue = (rowIndex, transactionDetailIndex, element) => {
    let { rows } = this.props;
    return rows
      ? rows[rowIndex]["productDetails"][transactionDetailIndex][element]
      : "";
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

  checkIsFlavourExist = (rowIndex) => {
    let { lstPackages } = this.props;
    // console.log({ lstPackages });
    if (lstPackages.id !== "" && lstPackages.is_multi_unit === "false") {
      if (lstPackages[0][rowIndex]["label"] === "") {
        return true;
      }
    }
    return false;
  };

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
    let {
      packagingInitVal,
      packageModalShow,
      flavourModalShow,
      flavourInitval,
      unitModalShow,
      initVal,
    } = this.state;
    return (
      <>
        <td>
          <img src={plus_img} alt="" />
        </td>
        <td
          style={{
            // borderLeft: "1px solid #9da2b4",
            width: "183px",
            // width: "10%",
          }}
        >
          <Select
            className="selectTo selectdd"
            styles={invoiceSelectTo}
            components={{
              //   DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            placeholder="Brand"
            // options={this.getFlavourOpt(rowIndex)}
            // onChange={(v, actions) => {
            //   if (actions.action === "clear") {
            //     this.handleBrandChange(
            //       rowIndex,
            //       transactionDetailIndex,
            //       "brandId",
            //       ""
            //     );
            //   } else {
            //     this.handleBrandChange(
            //       rowIndex,
            //       transactionDetailIndex,
            //       "brandId",
            //       v
            //     );
            //   }
            // }}
            // value={this.getBrandValue(
            //   rowIndex,
            //   transactionDetailIndex,
            //   "brandId"
            // )}
            // isDisabled={this.checkIsFlavourExist(rowIndex)}
          />
        </td>
        <td
          style={{
            // borderLeft: "1px solid #9da2b4",
            width: "183px",
            // width: "10%",
          }}
        >
          <Select
            className="selectTo selectdd"
            styles={invoiceSelectTo}
            components={{
              //   DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            placeholder="Category"
            // options={this.getCategoryOpt(rowIndex)}
            // onChange={(v, actions) => {
            //   if (actions.action === "clear") {
            //     this.handleCategoryChange(
            //       rowIndex,
            //       transactionDetailIndex,
            //       "categoryId",
            //       ""
            //     );
            //   } else {
            //     this.handleCategoryChange(
            //       rowIndex,
            //       transactionDetailIndex,
            //       "categoryId",
            //       v
            //     );
            //   }
            // }}
            // value={this.getFlavourValue(
            //   rowIndex,
            //   transactionDetailIndex,
            //   "categoryId"
            // )}
            // isDisabled={this.checkIsFlavourExist(rowIndex)}
          />
        </td>
        <td
          // md="1"
          style={{
            // borderLeft: "1px solid #9da2b4",
            width: "143px",
            // width: "10%",
          }}
        >
          {/* <Row>
            <Col lg="9" md="9" sm="9" xs="9" className="pe-0"> */}
          {this.getFlavourValue(
            rowIndex,
            transactionDetailIndex,
            "flavourId"
          ) && (
            <Select
              className="selectTo selectdd"
              styles={invoiceSelectTo}
              components={{
                //   DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              placeholder="Select"
              options={this.getFlavourOpt(rowIndex)}
              onChange={(v, actions) => {
                if (actions.action === "clear") {
                  this.handleFlavourChange(
                    rowIndex,
                    transactionDetailIndex,
                    "flavourId",
                    ""
                  );
                } else {
                  this.handleFlavourChange(
                    rowIndex,
                    transactionDetailIndex,
                    "flavourId",
                    v
                  );
                }
              }}
              value={this.getFlavourValue(
                rowIndex,
                transactionDetailIndex,
                "flavourId"
              )}
              isDisabled={this.checkIsFlavourExist(rowIndex)}
            />
          )}
          {/* </Col> */}
          {/* <Col lg="3" md="3" sm="3" xs="3" className="ps-0">
              <Button
                // className="add-btn m-auto"
                className="plusbt"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleFlavourModalShow(true);
                }}
                title="Add Flavour"
              >
                <img src={add_btn} alt="" className="add-btn" />
              </Button>
            </Col> */}
          {/* </Row> */}
        </td>

        <td
          md={1}
          style={{
            // borderLeft: "1px solid #9da2b4",
            width: "100px",
            // width: "10%",
          }}
        >
          {/* <Row>
            <Col lg="9" md="9" sm="9" xs="9" className="pe-0"> */}
          {this.getPackageValue(
            rowIndex,
            transactionDetailIndex,
            "packageId"
          ) &&
            this.getPackageValue(rowIndex, transactionDetailIndex, "packageId")[
              "label"
            ] !== undefined && (
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
          {/* </Col> */}
          {/* <Col lg="3" md="3" sm="3" xs="3" className="ps-0">
              <Button
                // className="add-btn m-auto"
                className="plusbt"
                //className="plusbt"
                onClick={(e) => {
                  e.preventDefault();
                  this.handlePackageModalShow(true);
                }}
                title="Add Package"
              >
                <img src={add_btn} alt="" className="add-btn" />
              </Button>
            </Col> */}
          {/* </Row> */}
        </td>

        <td
          // md="1"
          style={{
            // width: "10%",
            width: "98px",
          }}
        >
          {/* <Row>
            <Col lg="9" md="9" sm="9" xs="9" className="pe-0"> */}
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
          {/* </Col>
            <Col lg="3" md="3" sm="3" xs="3" className="ps-0">
              <Button
                // className="add-btn m-auto"
                className="plusbt"
                onClick={(e) => {
                  e.preventDefault();
                  this.handelUnitModalShow(true);
                }}
                title="Add Unit"
              >
                <img src={add_btn} alt="" className="add-btn" />
              </Button>
            </Col>
          </Row> */}

          {/* )} */}
        </td>

        <td
          // md="1"
          style={{
            // width: "10%",
            width: "85px",
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
        </td>

        <td style={{ width: "86px" }}>
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
        </td>

        <td
          // md="1"
          style={{
            // width: "10%",
            width: "95px",
          }}
        >
          {/* <Row>
            <Col lg="5" md="5" sm="5" xs="5" className="pe-0"> */}
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
          {/* </Col>
            <Col lg="7" md="7" sm="7" xs="7" className="pe-0"> */}
          {/* <InputGroup> */}

          {/* </Col>
          </Row> */}
        </td>

        <td
          // md="1"
          style={{
            // width: "10%",
            width: "50px",
          }}
        >
          {/* <Row>
            <Col lg="5" md="5" sm="5" xs="5" className="pe-0"> */}
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
          {/* </Col>
            <Col lg="7" md="7" sm="7" xs="7" className="pe-0"> */}

          {/* </Col>
          </Row> */}
        </td>
        <td style={{ width: "72px" }}>
          {" "}
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
        </td>
        {CheckIsRegisterdCompany() === true ||
        tranx === "purchase" ||
        showBaseAmt ? (
          <>
            <td
              // md="10"
              style={{
                // background: "#DEE4EB",
                width: "95px",
                // width: "10%",
              }}
              className="rowbg"
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
                  "total_b_amt"
                )}
                readOnly
              />
            </td>
            <td
              // md="10"
              style={{
                // background: "#DEE4EB",
                width: "105px",
                // width: "10%",
              }}
              className="rowbg d-flex"
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
              (
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
              )
            </td>
          </>
        ) : (
          <>
            <td
              // md="1"
              style={{
                // background: "#DEE4EB",
                width: "95px",
              }}
              className="rowbg"
            ></td>
            <td
              // md="1"
              style={{
                // background: "#DEE4EB",
                width: "105px",
              }}
              className="rowbg"
            ></td>
          </>
        )}
        <td
          // md={1}
          style={{
            // background: "#DEE4EB",
            width: "105px",
            // width: "10%",
          }}
          className="rowbg"
        >
          {/* <Row>
            <Col lg={10} md={10} sm={10} xs={10}> */}
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
          {/* </Col> */}

          {/* {transactionDetailIndex != 0 ? (
              <Col
                lg={2}
                md={2}
                sm={2}
                xs={2}
                className="p-0 "
                style={
                  {
                    // width: "2%",
                    // background: "#DEE4EB",
                    // width: "20px",
                  }
                }
              >
                <img
                  src={delete_icon}
                  onClick={(e) => {
                    e.preventDefault();
                    // this.setState({ addunits: true });
                    this.RemoveNew(rowIndex, transactionDetailIndex);
                  }}
                />
              </Col>
            ) : (
              <Col
                lg={2}
                md={2}
                sm={2}
                xs={2}
                className="p-0 "
                style={
                  {
                    // background: "#DEE4EB",
                    // width: "20px",
                    // width: "10%",
                  }
                }
              >
                <img
                  src={add_blue_circle}
                  onClick={(e) => {
                    e.preventDefault();
                    // this.setState({ addunits: true });
                    let value = this.props.setElementValue(
                      "productId",
                      rowIndex
                    );
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
              </Col>
            )}
          </Row> */}
        </td>
        {/* package modal */}
        <Modal
          show={packageModalShow}
          size="md"
          className="brandnewmodal mt-5 mainmodal"
          onHide={() => this.handlePackageModalShow(false)}
          dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            // closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Package
            </Modal.Title>
            {/* <CloseButton
              // variant="white"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.handlePackageModalShow(false)}
            /> */}
            <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handlePackageModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button>
          </Modal.Header>
          <Formik
            innerRef={this.myRef}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={packagingInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              packing_name: Yup.string()
                .trim()
                .required("Packing name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();
              requestData.append("packing_name", values.packing_name);

              if (values.id == "") {
                createPacking(requestData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      ShowNotification("Success", res.message);
                      // this.myRef.current.resetForm();
                      // this.setInitValue();
                      // this.pageReload();
                      resetForm();
                      this.handlePackageModalShow(false);
                    } else {
                      ShowNotification("Error", res.message);
                    }
                  })
                  .catch((error) => {});
              }
              // else {
              //   requestData.append("id", values.id);
              //   updatePacking(requestData)
              //     .then((response) => {
              //       let res = response.data;
              //       if (res.responseStatus == 200) {
              //         ShowNotification("Success", res.message);
              //         this.myRef.current.resetForm();
              //         this.setInitValue();
              //         this.pageReload();
              //       } else {
              //         ShowNotification("Error", res.message);
              //       }
              //     })
              //     .catch((error) => {});
              // }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit} className="form-style">
                <Modal.Body className=" p-2">
                  <div className="form-style">
                    <Row>
                      <Col md={2}>
                        <Form.Label>Package</Form.Label>
                      </Col>
                      <Col md={10}>
                        <Form.Control
                          autoFocus="true"
                          type="text"
                          placeholder="Package Name"
                          name="packing_name"
                          id="packing_name"
                          onChange={handleChange}
                          value={values.packing_name}
                          isValid={touched.packing_name && !errors.packing_name}
                          isInvalid={!!errors.packing_name}
                        />
                        {/* <Form.Control.Feedback type="invalid"> */}
                        <span className="text-danger errormsg">
                          {errors.packing_name}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-2 mb-2">
                      <Col md="12" className="text-end">
                        {/* <Button variant="secondary" className="cancel-btn me-2">
                          Cancel
                        </Button> */}
                        <Button
                          className="successbtn-style create-btn"
                          type="submit"
                        >
                          Submit
                        </Button>
                        {/* <Button variant="secondary" className="cancel-btn">
                          Cancel
                        </Button> */}
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </Modal>
        {/* flavour modal */}
        <Modal
          show={flavourModalShow}
          size="md"
          className="brandnewmodal mt-5 mainmodal"
          onHide={() => this.handleFlavourModalShow(false)}
          dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            // closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Flavour
            </Modal.Title>
            {/* <CloseButton
              // variant="white"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.handleFlavourModalShow(false)}
            /> */}
            <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handleFlavourModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button>
          </Modal.Header>
          <Formik
            //innerRef={this.myRef}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={flavourInitval}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              flavour_name: Yup.string()
                .trim()
                .required("Packing name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();
              requestData.append("flavour_name", values.flavour_name);

              if (values.id == "") {
                createFlavour(requestData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      ShowNotification("Success", res.message);

                      this.getMstFlavourOptions();
                      this.handleFlavourModalShow(false);
                      resetForm();
                    } else {
                      ShowNotification("Error", res.message);
                    }
                  })
                  .catch((error) => {});
              }
              // else {
              //   requestData.append("id", values.id);
              //   updateFlavour(requestData)
              //     .then((response) => {
              //       let res = response.data;
              //       if (res.responseStatus == 200) {
              //         ShowNotification("Success", res.message);
              //         this.myRef.current.resetForm();
              //         this.setInitValue();
              //         this.pageReload();
              //       } else {
              //         ShowNotification("Error", res.message);
              //       }
              //     })
              //     .catch((error) => {});
              // }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit} className="form-style">
                <Modal.Body className=" p-2">
                  <div className="form-style">
                    <Row>
                      <Col md={2}>
                        <Form.Label>Flavour</Form.Label>
                      </Col>
                      <Col md={10}>
                        <Form.Control
                          autoFocus="true"
                          type="text"
                          placeholder="Flavour Name"
                          name="flavour_name"
                          id="flavour_name"
                          onChange={handleChange}
                          value={values.flavour_name}
                          isValid={touched.flavour_name && !errors.flavour_name}
                          isInvalid={!!errors.flavour_name}
                        />
                        <span className="text-danger errormsg">
                          {errors.flavour_name}
                        </span>
                      </Col>
                    </Row>
                    <Row className="">
                      <Col md="12" className="text-end">
                        {/* <Button
                          variant="secondary"
                          className="cancel-btn mt-3"
                          onClick={(e) => {
                            e.preventDefault();
                            this.pageReload();
                          }}
                        >
                          Cancel
                        </Button> */}
                        <Button className="successbtn-style mt-3" type="submit">
                          Submit
                        </Button>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col md={12} className="btn_align mt-4"></Col>
                    </Row> */}
                  </div>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </Modal>

        {/* unit modal */}
        <Modal
          show={unitModalShow}
          size="lg"
          // className="groupnewmodal mt-5 mainmodal"
          // onHide={() => this.handelunitModalShow(false)}

          className="brandnewmodal mt-5 mainmodal"
          onHide={() => this.handelUnitModalShow(false)}
          dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            // closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Unit
            </Modal.Title>
            <CloseButton
              variant="dark"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.handelUnitModalShow(false)}
            />
            {/* <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handelUnitModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button> */}
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <Formik
              //  innerRef={this.myRef}
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={initVal}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({
                unitName: Yup.string().trim().required("Unit name is required"),
                unitCode: Yup.object().required("Unit code is required"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let requestData = new FormData();
                requestData.append("unitName", values.unitName);
                requestData.append("unitCode", values.unitCode.value);
                if (values.id == "") {
                  createUnit(requestData)
                    .then((response) => {
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        ShowNotification("Success", res.message);
                        // this.myRef.current.resetForm();
                        // this.setInitValue();
                        // this.pageReload();
                        resetForm();
                        this.handelUnitModalShow(false);
                      } else {
                        ShowNotification("Error", res.message);
                      }
                    })
                    .catch((error) => {});
                } else {
                  requestData.append("id", values.id);
                  updateUnit(requestData)
                    .then((response) => {
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        ShowNotification("Success", res.message);
                        this.myRef.current.resetForm();
                        this.pageReload();
                      } else {
                        ShowNotification("Error", res.message);
                      }
                    })
                    .catch((error) => {});
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting,
                resetForm,
                setFieldValue,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  className="form-style"
                  autoComplete="off"
                >
                  <Row>
                    <Col md="2">
                      <Form.Label>Unit Name</Form.Label>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <Form.Control
                          autoFocus="true"
                          type="text"
                          placeholder="Unit Name"
                          name="unitName"
                          id="unitName"
                          onChange={handleChange}
                          value={values.unitName}
                          isValid={touched.unitName && !errors.unitName}
                          isInvalid={!!errors.unitName}
                        />
                        {/* <Form.Control.Feedback type="invalid"> */}
                        <span className="text-danger errormsg">
                          {errors.unitName}
                        </span>
                        {/* </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>

                    <Col md="2">
                      <Form.Label>Unit Code</Form.Label>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <Select
                          className="selectTo"
                          id="unitCode"
                          placeholder="Unit Code"
                          // styles={customStyles}
                          styles={createPro}
                          isClearable
                          options={uomoption}
                          name="unitCode"
                          onChange={(value) => {
                            setFieldValue("unitCode", value);
                          }}
                          value={values.unitCode}
                        />

                        <span className="text-danger errormsg">
                          {errors.unitCode}
                        </span>
                      </Form.Group>
                    </Col>
                    {/* <Col md="1">
                              <Form.Group className="">
                                <Form.Label>UOM/ UQC</Form.Label>
                                <Select
                                  className="selectTo"
                                  id="uom"
                                  placeholder="UOM"
                                  styles={customStyles}
                                  isClearable
                                  options={uomoption}
                                  name="uom"
                                  onChange={(value) => {
                                    setFieldValue('uom', value);
                                  }}
                                  value={values.uom}
                                />
                                <Form.Control.Feedback type="invalid">
                                  <span className="text-danger errormsg">
                                    {errors.uom}
                                  </span>
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col> */}
                  </Row>
                  <Row>
                    <Col md="12" className="mt-4 pt-1 btn_align">
                      <Button
                        className="submit-btn successbtn-style"
                        type="submit"
                      >
                        {values.id == "" ? "Submit" : "Update"}
                      </Button>
                      {/* <Button
                      variant="secondary cancel-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        // this.pageReload();
                      }}
                    >
                      Cancel
                    </Button> */}
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
