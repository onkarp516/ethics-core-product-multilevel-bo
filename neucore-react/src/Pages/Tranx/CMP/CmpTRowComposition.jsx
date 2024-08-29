import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Table,
  Form,
  Button,
  Col,
  Row,
  Modal,
  InputGroup,
  CloseButton,
} from "react-bootstrap";
import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import rightCheckMark from "@/assets/images/checkmark_icon.png";
import wrongCheckMark from "@/assets/images/close_crossmark_icon.png";
import close_crossmark_icon from "@/assets/images/close_crossmark_icon.png";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import moment from "moment";

import TableDelete from "@/assets/images/deleteIcon.png";
import add_icon from "@/assets/images/add_icon.svg";

import {
  transaction_product_list,
  transaction_product_details,
  delete_Product_list,
  transaction_batch_details,
  createBatchDetails,
  editBatchDetails,
} from "@/services/api_functions";
import {
  MyTextDatePicker,
  getSelectValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  MyNotifications,
  TRAN_NO,
  purchaseSelect,
  isActionExist,
  fnTranxCalculation,
  fnTranxCalculationTaxRoundOff,
  getValue,
  isUserControl,
  calculatePercentage,
  isFreeQtyExist,
  isMultiDiscountExist,
  getUserControlLevel,
  getUserControlData,
  isUserControlExist,
  unitDD,
  flavourDD,
  OnlyEnterNumbers,
  OnlyEnterAmount,
  INRformat,
} from "@/helpers";
import Frame from "@/assets/images/Frame.png";

const data = [
  { no: "1", name: "Shreenivaas Narayan Nandal" },
  { no: "2", name: "Shrikant Gopal Ande" },
  { no: "3", name: "Ashwin Rajaram Shendre" },
  { no: "4", name: "Rohan Nandakumar Gurav" },
  { no: "5", name: "Dinesh Janardan Shripuram" },
  { no: "6", name: "LalitKumar Yeladi" },
  { no: "7", name: "Harish Gali" },
  { no: "8", name: "Rahul Sadanand Pola" },
  { no: "9", name: "Vaibhav Kamble" },
  { no: "10", name: "Akshay Salunke" },
];
class CmpTRowComposition extends Component {
  constructor(props) {
    super(props);
    this.qtyRef = React.createRef();
    this.state = {
      prevProduct: "",
      ABC_flag_value: "",
      levelA: false,
      levelB: false,
      levelC: false,
      product_hover_details: "",
      code: "",
      batch_no: "", //batchSanjiv
      isopen: false,
      isBatchOpen: false,
      cust_data: data,
      batch: "",
      productLst: [],
      orgProductLst: [],

      productData: "",
      batchDataList: "",
      apiCal: false,
      addBatch: false,
      ismodify: false,
      modifyIndex: -1,
      modifyObj: "",

      isTextBox: false,
      isTextBoxBatch: false, //batchS

      currentSelectedProductId: "",
      currentSelectedBatchId: "", //batchS

      productTrForm: "",
      productTrParticular: "",
    };
    this.qtyRef = React.createRef();
    this.newmfgDateRef = React.createRef();
    this.newbatchdpRef = React.createRef();
    this.newbatchMRPref = React.createRef();
    this.mfgDateRef = React.createRef();
    this.edtmfgDateRef = React.createRef();
    this.edtbatchdpRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.formRef = React.createRef();
    this.customModalRef = React.createRef(); //@vinit Ref is created & used at productModal and BatchModal Below
  }
  /**
   *
   * @param {string} search query key
   * @param {string} barcode company barcode / generated barcode
   * @param {object} selectedProduct product object all info
   */
  transaction_product_listFun = (
    search = "",
    barcode = "",
    selectedProduct = null
  ) => {
    let requestData = new FormData();
    requestData.append("search", search);
    requestData.append("barcode", barcode);
    transaction_product_list(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              // prdList : res.list,
              productLst: res.list,
              orgProductLst: res.list,
            },
            () => {
              let { productModalStateChange } = this.props;
              productModalStateChange({ productLst: res.list });
              // console.log("productModalStateChange_______", res.list);
              setTimeout(() => {
                if (!this.props.selectedProduct) {
                  if (document.getElementById("productTr_0") != null) {
                    document.getElementById("productTr_0").click();
                  }
                } else {
                  if (document.getElementById("productTr_0") != null) {
                    document.getElementById("productTr_0").click();
                  }
                }
              }, 1000);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
    //console.log("getUserControlLevelFromRedux : ", level);
    this.setState({ ABC_flag_value: level });

    if (level == "A") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
    } else if (level == "AB") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
    } else if (level == "ABC") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
      const l_C = getUserControlData("is_level_c", this.props.userControl);
      this.setState({ levelC: l_C });
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // @vinit @ On Escape key press and On outside Modal click Modal will Close
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside);
      let { isRowProductSet, setProductRowIndex, setProductId, productIdRow } =
        this.props;

      this.getUserControlLevelFromRedux();
      this.transaction_product_listFun();
      if (this.props.isRowProductSet) {
        // console.log("isRowProductSet", this.props.isRowProductSet);
        this.setRowProductData();
      }
      if (
        productIdRow != "" &&
        setProductId == true &&
        setProductRowIndex != -1
      ) {
        this.setProductIdFun(productIdRow, setProductRowIndex);
      }
    }
  }

  // @vinit @ On Escape key press and On outside Modal click Modal will Close
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  // @vinit @ On Escape key press  Modal will Close
  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ isopen: false });
      this.setState({ isBatchOpen: false });
    }
  };

  // @vinit @ On outside Modal click Modal will Close
  handleClickOutside = (event) => {
    const modalNode = ReactDOM.findDOMNode(this.customModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ isopen: false });
      this.setState({ isBatchOpen: false });
    }
  };

  setSelectedTR = (next) => {
    let {
      batchInitVal,
      batchData,
      batch_data_selected,
      tr_id,
      productModalStateChange,
    } = next;
    if (batchInitVal != "" && (batch_data_selected == "" || tr_id == "")) {
      let data_v = batchData.find(
        (v) => parseInt(v.id) == parseInt(batchInitVal.b_details_id)
      );

      if (data_v) {
        let data_i = batchData.findIndex(
          (v) => parseInt(v.id) == parseInt(batchInitVal.b_details_id)
        );

        productModalStateChange({
          batch_data_selected: data_v,
          b_details_id: data_v,
          tr_id: data_i + 1,
          is_expired: data_v.is_expired,
        });
        this.transaction_batch_detailsFun(data_v);
      }
    }
    // console.log("set TR id MDLBatchNO this.props ==-> ", this.props);
  };

  componentWillReceiveProps(prev, next) {
    let { apiCal } = this.state;
    // console.log("prev => ", prev, "next => ", next);
    // console.log("this.props", this.props);
    let { isRowProductSet, setProductRowIndex, setProductId, productIdRow } =
      this.props;
    // console.log("MLDPRODUCT willreceive props this.props", prev);
    let { selectProductModal, rowIndex, productData, selectedProduct } = prev;

    if (isRowProductSet) {
      this.setRowProductData();
    }

    this.setState({ batchDataList: this.props.batchData }, () => {
      if (this.props.batchInitVal != "") {
        this.setSelectedTR(this.props);
      }
    });

    if (
      selectProductModal == true &&
      rowIndex != -1 &&
      productData == "" &&
      selectedProduct == ""
    ) {
      this.setSelectedProduct(rowIndex);
    }

    // if (selectProductModal == true) {
    //   this.setState({ apiCal: true }, () => {
    //     if (apiCal == false) {
    //       this.transaction_product_listFun();
    //     }
    //   });
    // }

    if (
      productIdRow != "" &&
      setProductId == true &&
      setProductRowIndex != -1
    ) {
      this.setProductIdFun(productIdRow, setProductRowIndex);
    }
  }
  transaction_product_Hover_detailsFun = (product_id = 0) => {
    let { productLst, productModalStateChange } = this.props;
    if (product_id != 0) {
      let obj = productLst.find((v) => v.id === product_id);
      if (obj) {
        // this.setState({ product_hover_details: obj });
        productModalStateChange({
          product_hover_details: obj,
        });
        return obj;
      }
    }
    return null;
  };

  getLevelsOpt = (element, rowIndex, parent) => {
    let { rows } = this.props;
    return rows[rowIndex] && rows[rowIndex][parent]
      ? rows[rowIndex][parent][element]
      : [];
  };

  getFloatUnitElement = (ele, rowIndex) => {
    let { rows } = this.props;
    return rows[rowIndex][ele]
      ? parseFloat(rows[rowIndex][ele]).toFixed(2)
      : "";
  };

  checkLastRow = (ri, n, product, unit, qty) => {
    if (ri === n && product != null && unit !== "" && qty !== "") return true;
    return false;
  };

  FocusTrRowFields(fieldName, fieldIndex) {
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName + fieldIndex) != null) {
      document.getElementById(fieldName + fieldIndex).focus();
    }
  }
  setSelectedProduct = (rowIndex) => {
    let { rows, productModalStateChange } = this.props;
    let { productLst } = this.state;
    let p_id = rows[rowIndex]["product_id"];
    let selectedProduct = productLst.find(
      (vi) => parseInt(vi.id) === parseInt(p_id)
    );
    if (selectedProduct) {
      this.transaction_product_detailsFun(p_id);
      productModalStateChange({ selectedProduct: selectedProduct });
    }
  };

  transaction_product_detailsFun = (product_id = 0) => {
    let requestData = new FormData();
    requestData.append("product_id", product_id);
    transaction_product_details(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("res--product", res);
        if (res.responseStatus == 200) {
          this.setState({
            productData: res.result,
          });
          // @prathmesh @product info show
          let { productModalStateChange } = this.props;
          productModalStateChange({ productData: res.result });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  setRowProductData = () => {
    let {
      rows,
      productModalStateChange,
      transactionType,
      productDetailsId,
      batchDetailsId,
    } = this.props;

    let { productLst } = this.state;
    if (productLst.length > 0) {
      rows = rows.map((v, i) => {
        let selectedProduct = productLst.find(
          (vi) => parseInt(vi.id) === parseInt(v.product_id)
        );

        if (selectedProduct != "") {
          v["selectedProduct"] = selectedProduct;
          v["productName"] = selectedProduct.product_name;
          if (
            transactionType == "sales_edit" ||
            transactionType == "purchase_edit" ||
            transactionType == "debit_note" ||
            transactionType == "credit_note"
          ) {
            v["rate"] = v["rate"];
          } else if (transactionType == "sales_invoice") {
            v["rate"] = selectedProduct.sales_rate;
          } else {
            if (selectedProduct.is_batch == false) {
              v["rate"] = selectedProduct.purchaserate;
            }
          }

          v["productId"] = selectedProduct.id;
          v["is_level_a"] = getUserControlData(
            "is_level_a",
            this.props.userControl
          )
            ? true
            : false;
          v["is_level_b"] = getUserControlData(
            "is_level_b",
            this.props.userControl
          )
            ? true
            : false;
          v["is_level_c"] = getUserControlData(
            "is_level_c",
            this.props.userControl
          )
            ? true
            : false;
          v["is_batch"] = selectedProduct.is_batch;
          v["is_serial"] = selectedProduct.is_serial;
          v["packing"] = selectedProduct.packing;

          let unit_id = {
            gst: selectedProduct.igst,
            igst: selectedProduct.igst,
            cgst: selectedProduct.cgst,
            sgst: selectedProduct.sgst,
          };

          v["unit_id"] = unit_id;
          this.transaction_product_detailsFun(v.product_id);
          // get_supplierlist_by_productidFun(v.product_id);
        }

        return v;
      });

      productModalStateChange(
        { isRowProductSet: false, rows: rows, add_button_flag: true },
        true
      );
      if (productDetailsId && productDetailsId != "") {
        this.transaction_product_detailsFun(productDetailsId);
      }
      if (batchDetailsId && batchDetailsId != "") {
        this.transaction_batch_detailsFun();
      }
    }
  };

  setProductIdFun = (productIdRow, setProductRowIndex) => {
    let { rows, productModalStateChange, saleRateType, getProductPackageLst } =
      this.props;
    let { productLst } = this.state;
    // console.log("MDLPRODUCT productLst=->", productLst);
    let selectedProduct;
    if (productLst.length > 0) {
      let p_id = productIdRow;
      selectedProduct = productLst.find(
        (vi) => parseInt(vi.id) === parseInt(p_id)
      );
      // console.log("MDLPRODUCT selectedProduct", selectedProduct, rows);

      if (selectedProduct && selectedProduct != "") {
        rows[setProductRowIndex]["selectedProduct"] = selectedProduct;
        rows[setProductRowIndex]["productName"] = selectedProduct.product_name;
        if (saleRateType == "sale") {
          rows[setProductRowIndex]["rate"] = selectedProduct.sales_rate;
        } else {
          if (selectedProduct.is_batch == false) {
            rows[setProductRowIndex]["rate"] = selectedProduct.purchaserate;
          }
        }

        rows[setProductRowIndex]["productId"] = selectedProduct.id;
        rows[setProductRowIndex]["is_level_a"] = getUserControlData(
          "is_level_a",
          this.props.userControl
        )
          ? true
          : false;
        rows[setProductRowIndex]["is_level_b"] = getUserControlData(
          "is_level_b",
          this.props.userControl
        )
          ? true
          : false;
        rows[setProductRowIndex]["is_level_c"] = getUserControlData(
          "is_level_c",
          this.props.userControl
        )
          ? true
          : false;
        rows[setProductRowIndex]["is_batch"] = selectedProduct.is_batch;
        rows[setProductRowIndex]["is_serial"] = selectedProduct.is_serial;
        rows[setProductRowIndex]["packing"] = selectedProduct.packing;

        let unit_id = {
          gst: selectedProduct.igst,
          igst: selectedProduct.igst,
          cgst: selectedProduct.cgst,
          sgst: selectedProduct.sgst,
        };

        rows[setProductRowIndex]["unit_id"] = unit_id;

        getProductPackageLst(selectedProduct.id, setProductRowIndex);
      }

      this.transaction_product_detailsFun(p_id);

      productModalStateChange({
        rows: rows,
        selectProductModal: false,
        levelOpt: [],
        productId: "",
        setProductId: false,
        setProductRowIndex: -1,
        add_button_flag: true,
      });
    }
  };

  filterData(value) {
    let { productLst, orgProductLst } = this.state;

    let filterData = orgProductLst.filter(
      (v) =>
        v.product_name.toLowerCase().includes(value) ||
        (v.code != null && v.code.toLowerCase().includes(value)) ||
        (v.packing != null && v.packing.includes(value))
    );

    this.setState({
      code: value,
      productLst: filterData.length > 0 ? filterData : [],
      code_name: "",
      isopen: true,
    });
  }
  filterBatchData(value) {
    let filterBatchData = data.filter((v) => v.no.includes(value));

    this.setState({ batch: value, cust_data: filterBatchData, code_name: "" });
  }

  batchSearchFun = (barcode) => {
    // console.log("barcode", barcode);
    // console.log("batchDataList", this.props.batchData);
    let filterData =
      this.props.batchData.length > 0 &&
      this.props.batchData.filter((v) =>
        // parseInt(v.batch_no).includes(barcode.trim())
        v.batch_no.includes(barcode.trim())
      );
    this.setState({
      batchDataList: filterData.length > 0 ? filterData : [],
      batch: barcode,
      isBatchOpen: true,
    });
  };

  /***Branch Related Function start */

  transaction_batch_detailsFun = (batchNo = 0) => {
    let requestData = new FormData();

    let { rows } = this.props;
    if (batchNo != "") {
      requestData.append("batchNo", batchNo.batch_no);
      requestData.append("id", batchNo.b_details_id);
    } else {
      requestData.append("batchNo", rows[0]["b_no"]);
      requestData.append("id", rows[0]["b_details_id"]);
    }
    // requestData.append("id", batchNo.b_details_id);
    transaction_batch_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            batchDetails: res.response,
            filterbatchDetails: res.response,
          });
          // @prathmesh @batch info show
          let { productModalStateChange } = this.props;
          productModalStateChange({ batchDetails: res.response });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleModifyEnable = (i, v) => {
    this.setState({ ismodify: true, modifyIndex: i, modifyObj: { ...v } });
  };

  handleModifyElement = (ele, val) => {
    let { modifyObj } = this.state;
    modifyObj[ele] = val;
    this.setState({ modifyObj: modifyObj });
  };

  clearModifyData = () => {
    this.setState({ ismodify: false, modifyIndex: -1, modifyObj: "" });
  };

  /**
   *
   *@description batch update data api call
   */
  updateBatchData = () => {
    let { modifyObj } = this.state;
    if (modifyObj.batch_no == "") {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Insert Batch No. ",
        is_timeout: false,
        is_button_show: true,
        // is_timeout: true,
        // delay: 1000,
      });
      document.getElementById("modify_batch_no").focus();
      return;
    } else if (modifyObj.mrp == "") {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Insert MRP. ",
        is_timeout: false,
        is_button_show: true,
        // is_timeout: true,
        // delay: 1000,
      });
      document.getElementById("modify_mrp").focus();
      return;
    }
    let { rows, rowIndex, selectedSupplier, getProductBatchList } = this.props;
    let requestData = new FormData();
    let obj = rows[rowIndex];
    if (obj) {
      modifyObj["product_id"] = obj.productId; // selectedProduct.id;
      modifyObj["level_a_id"] = obj.levelaId?.value;
      modifyObj["level_b_id"] = obj.levelbId?.value;
      modifyObj["level_c_id"] = obj.levelcId?.value;
      modifyObj["unit_id"] = obj.unitId?.value;
    }

    modifyObj["manufacturing_date"] =
      modifyObj["manufacturing_date"] != ""
        ? moment(modifyObj["manufacturing_date"], "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          )
        : "";
    modifyObj["b_expiry"] =
      modifyObj["expiry_date"] != ""
        ? moment(modifyObj["expiry_date"], "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    modifyObj["mrp"] = modifyObj["mrp"] != "" ? modifyObj["mrp"] : 0;

    requestData.append("product_id", modifyObj["product_id"]);
    requestData.append("level_a_id", modifyObj["level_a_id"]);
    requestData.append("level_b_id", modifyObj["level_b_id"]);
    requestData.append("level_c_id", modifyObj["level_c_id"]);
    requestData.append("unit_id", modifyObj["unit_id"]);
    requestData.append("manufacturing_date", modifyObj["manufacturing_date"]);
    requestData.append("b_expiry", modifyObj["b_expiry"]);
    requestData.append("mrp", modifyObj["mrp"]);
    requestData.append("supplier_id", selectedSupplier.id);
    requestData.append("b_no", modifyObj["batch_no"]);
    requestData.append("b_details_id", modifyObj["id"]);
    // requestData.append("")
    //! console.log("After values", JSON.stringify(values));
    // for (const pair of requestData.entries()) {
    //   console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    // }
    editBatchDetails(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });

          this.setState(
            { modifyObj: "", modifyIndex: -1, ismodify: false },
            () => {
              getProductBatchList(rowIndex, "batch", true);
            }
          );
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // ! Function related with Seacrh with Up-Down 1409
  setProductInputData(propValue, flag, id) {
    this.setState(
      {
        isTextBox: flag,
        currentSelectedProductId: id,
        isopen: true,
      },
      () => {
        document.getElementById(id).value = propValue;
      }
    );
  }

  //Function for batch multi cursor  //batchS
  setBatchInputData(propValue, flag, id) {
    // console.log("setBatchInputData", propValue, id, flag);
    this.setState(
      {
        isTextBoxBatch: flag,
        currentSelectedBatchId: id,
      },
      () => {
        document.getElementById(id).value = propValue;
      }
    );
  }

  // ! Key up-down focus to Table TR for product
  handleProductTableRow(event) {
    const t = event.target;

    let {
      code,
      currentSelectedProductId,
      prevProduct,
      productTrParticular,
      productTrForm,
    } = this.state;

    const k = event.keyCode;

    let {
      productModalStateChange,
      rowIndex,
      getProductPackageLst,
      rows,
      transactionType,
      saleRateType,
      productId,
    } = this.props;
    if (k === 40) {
      //! condition for down key press
      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));
        this.setState(
          {
            prevProduct: rows[rowIndex],
          },
          () => {
            this.transaction_product_detailsFun(val.id);
          }
        );

        // productModalStateChange({
        //   isProduct: "productMdl",
        //   rowIndex: rowIndex,
        //   selectedProduct: val,
        //   add_button_flag: true,
        // });
        // transaction_product_detailsFun(val.id);
      }
    } else if (k === 38) {
      //! condition for up key press
      const prev = t.previousElementSibling;
      if (prev) {
        prev.focus();

        let val = JSON.parse(prev.getAttribute("value"));
        this.setState(
          {
            prevProduct: rows[rowIndex],
          },
          () => {
            this.transaction_product_detailsFun(val.id);
          }
        );

        // productModalStateChange({
        //   isProduct: "productMdl",
        //   rowIndex: rowIndex,
        //   selectedProduct: val,
        //   add_button_flag: true,
        // });
        // transaction_product_detailsFun(val.id);
      }
    } else if (k === 13) {
      //! condition for enter key press
      let cuurentProduct = t;
      let selectedProduct = JSON.parse(cuurentProduct.getAttribute("value"));

      if (
        rows[rowIndex]["details_id"] != 0 &&
        selectedProduct.id == prevProduct.product_id
      ) {
        // console.log("same product selected while editing tranx, then continue");
        document
          .getElementById(productId + "particularsname-" + rowIndex)
          .focus();
        setTimeout(() => {
          this.focusNextElement(productTrForm, productTrParticular);
        }, 500);
      } else if (selectedProduct) {
        rows[rowIndex]["selectedProduct"] = selectedProduct;
        rows[rowIndex]["productName"] = selectedProduct.product_name;
        if (saleRateType == "sale") {
          rows[rowIndex]["rate"] = selectedProduct.sales_rate;
        } else {
          if (
            transactionType == "purchase_order" ||
            transactionType == "purchase_invoice"
          ) {
            rows[rowIndex]["rate"] = selectedProduct.purchaserate;
          }
          if (selectedProduct.is_batch == false) {
            rows[rowIndex]["rate"] = selectedProduct.purchaserate;
          }
        }

        rows[rowIndex]["productId"] = selectedProduct.id;
        rows[rowIndex]["is_level_a"] = getUserControlData(
          "is_level_a",
          this.props.userControl
        )
          ? true
          : false;
        rows[rowIndex]["is_level_b"] = getUserControlData(
          "is_level_b",
          this.props.userControl
        )
          ? true
          : false;
        rows[rowIndex]["is_level_c"] = getUserControlData(
          "is_level_c",
          this.props.userControl
        )
          ? true
          : false;
        rows[rowIndex]["is_batch"] = selectedProduct.is_batch;
        rows[rowIndex]["is_serial"] = selectedProduct.is_serial;

        let unit_id = {
          gst: selectedProduct.igst,
          igst: selectedProduct.igst,
          cgst: selectedProduct.cgst,
          sgst: selectedProduct.sgst,
        };
        // console.log("unit_id--->", unit_id);
        rows[rowIndex]["unit_id"] = unit_id;
        rows[rowIndex]["packing"] = selectedProduct.packing;
        rows[rowIndex]["b_no"] = "";
        rows[rowIndex]["b_rate"] = "";
        rows[rowIndex]["rate_a"] = "";
        rows[rowIndex]["rate_b"] = "";
        rows[rowIndex]["rate_c"] = "";
        rows[rowIndex]["rate"] = "";
        rows[rowIndex]["gross_amt"] = "";
        rows[rowIndex]["gross_amt1"] = "";
        rows[rowIndex]["disc_amt"] = "";
        rows[rowIndex]["disc_per"] = "";
        rows[rowIndex]["disc_per2"] = "";
        rows[rowIndex]["base_amt"] = "";
        rows[rowIndex]["disc_per_cal"] = "";
        rows[rowIndex]["disc_amt_cal"] = "";
        rows[rowIndex]["net_amt"] = "";
        rows[rowIndex]["taxable_amt"] = "";
        rows[rowIndex]["total_base_amt"] = "";
        rows[rowIndex]["total_amt"] = "";
        rows[rowIndex]["qty"] = "";
        rows[rowIndex]["dis_amt"] = "";
        rows[rowIndex]["dis_per"] = "";
        rows[rowIndex]["dis_per2"] = "";
        rows[rowIndex]["row_dis_amt"] = "";
        rows[rowIndex]["invoice_dis_amt"] = "";
        rows[rowIndex]["gst"] = "";
        rows[rowIndex]["igst"] = "";
        rows[rowIndex]["cgst"] = "";
        rows[rowIndex]["sgst"] = "";
        rows[rowIndex]["final_amt"] = "";
        rows[rowIndex]["costing"] = "";
        rows[rowIndex]["costing_with_tax"] = "";

        productModalStateChange({ selectedProduct: selectedProduct });
        productModalStateChange({
          isProduct: "productMdl",
          rowIndex: rowIndex,
          rows: rows,
          selectProductModal: false,
          levelOpt: [],
          add_button_flag: true,
        });
        getProductPackageLst(selectedProduct.id, rowIndex);
        // this.transaction_product_listFun();
        setTimeout(() => {
          this.focusNextElement(productTrForm, productTrParticular);
        }, 500);
      }
      this.setState({ isopen: false });
    } else if (k == 8) {
      //! condition for backspace key press 1409
      document.getElementById(currentSelectedProductId).focus();
    } else if (k == 37 || k == 39) {
      //! condition for left & right key press 1409
    }
  }

  //Multi cursor for batch Modal    //batchS
  handleBatchTableRow(event) {
    const t = event.target;
    let { batch_no, currentSelectedBatchId } = this.state;
    let { productId } = this.props;

    const k = event.keyCode;
    let { saleRateType, transactionType, isBatch, productModalStateChange } =
      this.props;
    if (k === 40) {
      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));
        // console.log("___________down", val);
        this.transaction_batch_detailsFun(val);
      }
    } else if (k === 38) {
      const prev = t.previousElementSibling;
      if (prev) {
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // console.log("___________up", val);
        this.transaction_batch_detailsFun(val);
      }
    } else if (k === 13) {
      // debugger
      let cuurentBatch = t;
      let selectedBatch = JSON.parse(cuurentBatch.getAttribute("value"));

      let { rows, rowIndex, b_details_id, is_expired, selectedSupplier } =
        this.props;
      // console.log(
      //   "batchData____________",
      //   selectedBatch.batch_no
      // );

      // console.log(
      //   "Double Click b_details_id =->",
      //   selectedBatch.expiry_date
      // );
      let currentDate = new Date().toLocaleDateString("en-GB");
      // console.log("currentDate______", currentDate);

      let actuDate = selectedBatch.expiry_date;
      // console.log("actuDate______", actuDate);
      // console.log(
      //   "currentDate < b_details_id.expiry_date",
      //   currentDate < selectedBatch.expiry_date
      // );

      // var loginDate = currentDate;

      // loginDate = new Date(
      //   loginDate.split("/")[2],
      //   loginDate.split("/")[1] - 1,
      //   loginDate.split("/")[0]
      // );
      // var mat_date = b_details_id.expiry_date;
      // mat_date = new Date(
      //   mat_date.split("/")[2],
      //   mat_date.split("/")[1] - 1,
      //   mat_date.split("/")[0]
      // );
      // var timeDiff =
      //   mat_date.getTime() - loginDate.getTime();
      // var NoOfDays = Math.ceil(
      //   timeDiff / (1000 * 3600 * 24)
      // );

      let loginDate = moment(currentDate, "DD-MM-YYYY").toDate();
      let mat_date = moment(selectedBatch.expiry_date, "DD-MM-YYYY").toDate();
      let NoOfDays = (mat_date.getTime() - loginDate.getTime()) / 86400000;

      let isConfirm = "";
      if (NoOfDays < 0) {
        MyNotifications.fire({
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Batch expired allowed or not?",
          is_button_show: true,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            // if (b_details_id.batch_no !== "") {
            //   setTimeout(() => {
            //     this.qtyRef.current?.focus();
            //   }, 100);
            // }

            let batchError = false;

            if (selectedBatch != 0) {
              batchError = false;
              let salesrate = selectedBatch.min_rate_a;

              if (
                selectedSupplier &&
                parseInt(selectedSupplier.salesRate) == 2
              ) {
                salesrate = selectedBatch.min_rate_b;
              } else if (
                selectedSupplier &&
                parseInt(selectedSupplier.salesRate) == 3
              ) {
                salesrate = selectedBatch.min_rate_c;
              }
              if (
                saleRateType == "sale" ||
                transactionType == "sales_invoice" ||
                transactionType == "sales_edit"
              ) {
                rows[rowIndex]["rate"] = salesrate;
                rows[rowIndex]["sales_rate"] = salesrate;
              } else {
                rows[rowIndex]["rate"] = selectedBatch.purchase_rate;
                rows[rowIndex]["sales_rate"] = salesrate;
              }

              rows[rowIndex]["selectedBatch"] = selectedBatch.id;
              rows[rowIndex]["b_details_id"] = selectedBatch.id;
              rows[rowIndex]["b_no"] = selectedBatch.batch_no;
              rows[rowIndex]["b_rate"] = selectedBatch.mrp;

              rows[rowIndex]["rate_a"] = selectedBatch.min_rate_a;
              rows[rowIndex]["rate_b"] = selectedBatch.min_rate_b;
              rows[rowIndex]["rate_c"] = selectedBatch.min_rate_c;
              rows[rowIndex]["margin_per"] = selectedBatch.min_margin;
              rows[rowIndex]["b_purchase_rate"] = selectedBatch.purchase_rate;
              // rows[rowIndex]["costing"] = values.costing;
              // rows[rowIndex]["costingWithTax"] =
              //   values.costingWithTax;

              rows[rowIndex]["b_expiry"] =
                selectedBatch.expiry_date != ""
                  ? selectedBatch.expiry_date
                  : "";

              rows[rowIndex]["manufacturing_date"] =
                selectedBatch.manufacturing_date != ""
                  ? selectedBatch.manufacturing_date
                  : "";

              rows[rowIndex]["is_batch"] = isBatch;
            }
            productModalStateChange(
              {
                isBatchMdl: "batchMdl",
                rowIndex: rowIndex,
                batch_error: batchError,
                newBatchModal: false,
                // rowIndex: -1,
                selectedBatch: 0,
                isBatch: isBatch,
                rows: rows,
              },
              true
            );
            this.setState({ isBatchOpen: false }, () => {
              document.getElementById(productId + "qty-" + rowIndex)?.focus();
            });
          },
          handleFailFn: () => {
            isConfirm = false;
          },
        });
      } else {
        // isConfirm = true;

        let batchError = false;

        if (selectedBatch != 0) {
          batchError = false;
          let salesrate = selectedBatch.min_rate_a;

          if (selectedSupplier && parseInt(selectedSupplier.salesRate) == 2) {
            salesrate = selectedBatch.min_rate_b;
          } else if (
            selectedSupplier &&
            parseInt(selectedSupplier.salesRate) == 3
          ) {
            salesrate = selectedBatch.min_rate_c;
          }
          if (
            saleRateType == "sale" ||
            transactionType == "sales_invoice" ||
            transactionType == "sales_edit"
          ) {
            rows[rowIndex]["rate"] = salesrate;
            rows[rowIndex]["sales_rate"] = salesrate;
          } else {
            rows[rowIndex]["rate"] = selectedBatch.purchase_rate;
            rows[rowIndex]["sales_rate"] = salesrate;
          }

          rows[rowIndex]["selectedBatch"] = selectedBatch.id;
          rows[rowIndex]["b_no"] = selectedBatch.batch_no;
          rows[rowIndex]["b_rate"] = selectedBatch.mrp;

          rows[rowIndex]["rate_a"] = selectedBatch.min_rate_a;
          rows[rowIndex]["rate_b"] = selectedBatch.min_rate_b;
          rows[rowIndex]["rate_c"] = selectedBatch.min_rate_c;
          rows[rowIndex]["margin_per"] = selectedBatch.min_margin;
          rows[rowIndex]["b_purchase_rate"] = selectedBatch.purchase_rate;
          // rows[rowIndex]["costing"] = values.costing;
          // rows[rowIndex]["costingWithTax"] =
          //   values.costingWithTax;

          rows[rowIndex]["b_expiry"] =
            selectedBatch.expiry_date != "" ? selectedBatch.expiry_date : "";

          rows[rowIndex]["manufacturing_date"] =
            selectedBatch.manufacturing_date != ""
              ? selectedBatch.manufacturing_date
              : "";

          rows[rowIndex]["is_batch"] = isBatch;
        }

        rows[rowIndex]["selectedBatch"] = selectedBatch.id;
        rows[rowIndex]["b_details_id"] = selectedBatch.id;
        rows[rowIndex]["b_no"] = selectedBatch.batch_no;
        rows[rowIndex]["b_rate"] = selectedBatch.mrp;
        rows[rowIndex]["closing_stock"] = selectedBatch.closing_stock;
        rows[rowIndex]["rate_a"] = selectedBatch.min_rate_a;
        rows[rowIndex]["rate_b"] = selectedBatch.min_rate_b;
        rows[rowIndex]["rate_c"] = selectedBatch.min_rate_c;
        rows[rowIndex]["margin_per"] = selectedBatch.min_margin;
        rows[rowIndex]["b_purchase_rate"] = selectedBatch.purchase_rate;
        // rows[rowIndex]["costing"] = values.costing;
        // rows[rowIndex]["costingWithTax"] =
        //   values.costingWithTax;

        rows[rowIndex]["b_expiry"] =
          selectedBatch.expiry_date != "" ? selectedBatch.expiry_date : "";

        rows[rowIndex]["manufacturing_date"] =
          selectedBatch.manufacturing_date != ""
            ? selectedBatch.manufacturing_date
            : "";

        rows[rowIndex]["is_batch"] = isBatch;
        productModalStateChange(
          {
            isBatchMdl: "batchMdl",
            rowIndex: rowIndex,
            batch_error: batchError,
            newBatchModal: false,
            // rowIndex: -1,
            selectedBatch: 0,
            isBatch: isBatch,
            rows: rows,
          },
          true
        );
        this.setState({ isBatchOpen: false }, () => {
          document.getElementById(productId + "qty-" + rowIndex).focus();
        });
      }
    } else if (k === 8) {
      document.getElementById(currentSelectedBatchId)?.focus();
    } else if (k === 37 || k === 39) {
    } else {
      // debugger;
      let searchInput = batch_no + event.key;
      this.setBatchInputData(searchInput, false, currentSelectedBatchId);
      // let test = e.target.value;

      let { batchLst, batchDataList } = this.state;
      if (searchInput != "") {
        let filterData = [];
        batchDataList != "" &&
          batchDataList.map((v) => {
            if (v.batch_no.includes(searchInput.trim())) {
              filterData.push(v);
            }
          });
        if (filterData != "" && filterData.length > 0) {
          this.setState(
            {
              batch_no: searchInput,
              batchDataList: filterData,
              isopen: true,
            },
            () => {
              document.getElementById("");
            }
          );
        }
      }
    }
  }

  // ! Dont delete following code
  focusNextElement(form, e, nextIndex = null) {
    let { ABC_flag_value, isBatchOpen } = this.state;
    let { rows, rowIndex } = this.props;
    // console.warn("rowIndex->>>>>", rowIndex);
    // console.warn("rows[rowIndex]->>>>", rows[rowIndex]);
    // debugger;
    var form = form;
    var cur_index =
      nextIndex != null ? nextIndex : Array.prototype.indexOf.call(form, e);
    let ind = cur_index + 1;
    for (let index = ind; index <= form.elements.length; index++) {
      if (form.elements[index]) {
        if (
          !form.elements[index].readOnly &&
          !form.elements[index].disabled &&
          form.elements[index].tabIndex >= 0 &&
          form.elements[index].id != ""
        ) {
          if (
            isBatchOpen == false &&
            ABC_flag_value != "" &&
            (ABC_flag_value == "A" ||
              ABC_flag_value == "AB" ||
              ABC_flag_value == "ABC")
          ) {
            if (
              rowIndex >= 0 &&
              rows[rowIndex].unitId != "" &&
              rows[rowIndex].unitId.length > 1
            ) {
              form.elements[index].focus();
              break;
            } else if (form.elements[index].tabIndex >= 0) {
              form.elements[index].focus();
              break;
            } else {
              this.focusNextElement(form, e, index);
            }
          } else if (
            rowIndex >= 0 &&
            rows[rowIndex].unitId != "" &&
            rows[rowIndex].unitId.length > 1
          ) {
            form.elements[index].focus();
            break;
          } else {
            form.elements[index].focus();
            break;
          }
        } else {
          this.focusNextElement(form, e, index);
        }
      } else {
        this.focusNextElement(form, e, index);
      }
    }
  }

  render() {
    let {
      ABC_flag_value,
      levelA,
      levelB,
      levelC,
      code_name,
      code,
      cust_data,
      batch,
      productLst,
      orgProductLst,
      isopen,
      batchDataList,
      isBatchOpen,
      addBatch,
      ismodify,
      modifyIndex,
      modifyObj,
      costingMdl,
      prevProduct,
      productTrForm,
    } = this.state;
    let {
      rows,
      productModalStateChange,
      add_button_flag,
      get_supplierlist_by_productidFun,
      handleUnitChange,
      handleAddRow,
      handleRemoveRow,
      openSerialNo,
      openBatchNo,
      getProductBatchList,
      batchHideShow,
      transactionType,
      transactionTableStyle,
      qtyVerificationById,
      productNameData,
      unitIdData,
      batchNoData,
      qtyData,
      rateData,
      saleRateType,
      productId,
      productData,
      selectedProduct,
      getProductPackageLst,
      isBatch,
      batchData,
      rowIndex,
      b_details_id,
      is_expired,
      selectedSupplier,
      sourceType,
      transaction_batch_detailsFun,
      transaction_product_detailsFun,
      transaction_product_listFun,
      from_source,
      invoice_data,
      opType,
      conversionEditData,
      productModalDisplay,
    } = this.props;

    return (
      <div>
        {/* <Form.Control
        className="w-20"
        onChange={(e) => {
          e.preventDefault();
          this.filterData(e.target.value);
        }}
      /> */}
        {/* <Form.Control className="w-20" value={code_name} />{" "} */}
        <div class="outer-wrapper">
          <div class="table-wrapper">
            <div
              className={`${
                transactionTableStyle == "salesOrder" ||
                transactionTableStyle == "salesQuotation" ||
                transactionTableStyle == "counter_sale" ||
                transactionTableStyle == "purchaseOrder"
                  ? "tnx-sale-ord-tbl-style"
                  : "tnx-pur-inv-tbl-style"
              }`}
            >
              <Table>
                <thead
                  style={{
                    border: "1px solid #A8ADB3",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        textAlign: "center",
                        width: "35px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="py-1"
                    >
                      Sr. No.
                    </th>

                    <th
                      style={{
                        // width: "630px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="purticular-width"
                    >
                      Particulars
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        // width: "179px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="qty_width"
                    >
                      Package
                    </th>
                    {isBatchOpen == false ? (
                      <>
                        {ABC_flag_value == "A" ||
                        ABC_flag_value == "AB" ||
                        ABC_flag_value == "ABC" ? (
                          <th
                            className={`${
                              ABC_flag_value == "A"
                                ? "Level_A"
                                : ABC_flag_value == "AB"
                                ? "Level_AB"
                                : ABC_flag_value == "ABC"
                                ? "Level_ABC"
                                : "Level_no"
                            }`}
                          >
                            {isUserControl("is_level_a", this.props.userControl)
                              ? levelA["label"]
                              : ""}
                          </th>
                        ) : (
                          ""
                        )}

                        {ABC_flag_value == "AB" || ABC_flag_value == "ABC" ? (
                          <th
                            className={`${
                              ABC_flag_value == "AB"
                                ? "Level_AB"
                                : ABC_flag_value == "ABC"
                                ? "Level_ABC"
                                : "Level_no"
                            }`}
                          >
                            {isUserControl("is_level_b", this.props.userControl)
                              ? levelB["label"]
                              : ""}
                          </th>
                        ) : (
                          ""
                        )}

                        {ABC_flag_value == "ABC" ? (
                          <th
                            className={`${
                              ABC_flag_value == "ABC" ? "Level_ABC" : "Level_no"
                            }`}
                          >
                            {isUserControl("is_level_c", this.props.userControl)
                              ? levelC["label"]
                              : ""}
                          </th>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      <></>
                    )}

                    <th
                      style={{
                        textAlign: "center",
                        // width: "117px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="py-1 unit_width"
                    >
                      Unit
                    </th>

                    {batchHideShow === true ? (
                      <th
                        style={{
                          textAlign: "center",
                          // width: "200px",
                          borderRight: "1px solid #d9d9d9",
                        }}
                        className="batch_width"
                      >
                        Batch No/Serial No
                      </th>
                    ) : (
                      <></>
                    )}

                    <th
                      style={{
                        textAlign: "center",
                        // width: "115px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="qty_width"
                    >
                      Quantity
                    </th>

                    {isFreeQtyExist("is_free_qty", this.props.userControl) && (
                      <th
                        style={{
                          textAlign: "center",
                          // width: "135px",
                          borderRight: "1px solid #d9d9d9",
                        }}
                        className="free_width"
                      >
                        Free
                      </th>
                    )}
                    <th
                      style={{
                        textAlign: "center",
                        // width: "179px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="rate_width"
                    >
                      Rate
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        // width: "135px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="amt_width"
                    >
                      Gross Amount
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        // width: "75px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="py-1 dis1_width"
                    >
                      1-Dis.
                      <br />%
                    </th>

                    {isMultiDiscountExist(
                      "is_multi_discount",
                      this.props.userControl
                    ) && (
                      <th
                        style={{
                          textAlign: "center",
                          // width: "75px",
                          borderRight: "1px solid #d9d9d9",
                        }}
                        className="py-1 dis2_width"
                      >
                        2-Dis.
                        <br />%
                      </th>
                    )}
                    <th
                      style={{
                        textAlign: "center",
                        // width: "100px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="py-1 disc_width"
                    >
                      Disc.
                      <br />₹
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        // width: "75px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="py-1 tax_width"
                    >
                      Tax
                      <br />%
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        // width: "110px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                      className="net_ant_width"
                    >
                      Net Amount
                    </th>

                    <th
                      style={{
                        textAlign: "center",
                        width: "40px",
                        borderRight: "1px solid #d9d9d9",
                      }}
                    ></th>
                  </tr>
                </thead>

                {/* {JSON.stringify(rows)} */}
                <tbody>
                  {rows &&
                    rows.map((rv, ri) => {
                      return (
                        <tr
                          style={{ borderbottom: "1px solid #D9D9D9" }}
                          // onMouseOver={(e) => {
                          //   e.preventDefault();
                          //   if (rows[ri]["productId"] !== "") {
                          //     this.transaction_product_Hover_detailsFun(
                          //       rv.productId
                          //     );
                          //   }
                          // }}
                        >
                          {/* {JSON.stringify(rows[ri])} */}
                          {/* // && rows[ri]["selectedProduct"] */}
                          <td className="sr-no-style">{parseInt(ri) + 1}</td>
                          <td
                            // onFocus={(e) => {
                            //   //console.log("product on focus");
                            //   if (rows[ri]["productId"] === "") {
                            //     productModalStateChange({
                            //       selectProductModal: true,
                            //       rowIndex: ri,
                            //     });
                            //   }
                            // }}
                            //@prathmesh particulars product info & batch info show on arrow up down
                            onFocus={(e) => {
                              e.preventDefault();
                              // this.transaction_product_listFun();
                              transaction_product_detailsFun(rv.productId);
                              transaction_batch_detailsFun(rv);
                            }}
                            onMouseOver={(e) => {
                              e.preventDefault();
                              if (rows[ri]["productId"] !== "") {
                                get_supplierlist_by_productidFun(rv.productId);
                                transaction_product_detailsFun(rv.productId); //@prathmesh particulars product info show on mouser hover
                                transaction_batch_detailsFun(rv); //@prathmesh batch info show on mouser hover
                              }
                            }}
                            // onMouseOut={(e) => {
                            //   e.preventDefault();
                            //   get_supplierlist_by_productidFun();
                            //   transaction_product_detailsFun();
                            // }}
                          >
                            <Form.Control
                              type="text"
                              // id={`${productId + ri}`}
                              id={productId + `particularsname-${ri}`} //@prathmesh @productName arrow up-down added
                              name={`${productId + ri}`}
                              // id={`productName-${ri}`}
                              // name={`productName-${ri}`}
                              className={`${
                                productNameData && productNameData[ri] == "Y"
                                  ? "border border-danger tnx-pur-inv-prod-style text-start"
                                  : "tnx-pur-inv-prod-style text-start"
                              }`}
                              // className="tnx-pur-inv-prod-style text-start"
                              placeholder="Particulars"
                              // styles={particularsDD}
                              colors="#729"
                              onClick={(e) => {
                                if (productModalDisplay === false) {
                                  return false;
                                }
                                e.preventDefault();
                                productModalStateChange({
                                  rowIndex: ri,
                                });
                                this.transaction_product_listFun();
                                this.setState(
                                  {
                                    isopen: true,
                                    currentSelectedProductId:
                                      productId + `particularsname-${ri}`,
                                    productTrForm: e.target.form,
                                  },
                                  () => {
                                    if (rv.productId != "") {
                                      const index = productLst.findIndex(
                                        (object) => {
                                          return object.id === rv.productId;
                                        }
                                      );
                                      if (index >= 0) {
                                        document
                                          .getElementById(
                                            "productMdlTr_" + index
                                          )
                                          .focus();
                                      }
                                    }
                                  }
                                );
                              }}
                              onChange={(e) => {
                                e.preventDefault();
                                productModalStateChange({ rowIndex: ri });
                                //this.filterData(e.target.value.toLowerCase());
                                this.transaction_product_listFun(
                                  e.target.value.toLowerCase()
                                );
                                handleUnitChange(
                                  "productName",
                                  e.target.value,
                                  ri
                                );

                                this.setProductInputData(
                                  e.target.value,
                                  true,
                                  productId + `particularsname-${ri}`
                                );
                                this.setState({ productTrForm: e.target.form });
                              }}
                              value={
                                rows[ri]["productName"]
                                  ? rows[ri]["productName"]
                                  : ""
                              }
                              onKeyDown={(e) => {
                                this.setState({
                                  productTrForm: e.target.form,
                                  productTrParticular: e.target,
                                });
                                if (e.keyCode === 13) {
                                  productModalStateChange({ rowIndex: ri });
                                  this.transaction_product_listFun();
                                  this.setState(
                                    {
                                      isopen: true,
                                    },
                                    () => {
                                      if (rv.productId != "") {
                                        const index = productLst.findIndex(
                                          (object) => {
                                            return object.id === rv.productId;
                                          }
                                        );
                                        if (index >= 0) {
                                          document
                                            .getElementById(
                                              "productMdlTr_" + index
                                            )
                                            .focus();
                                        }
                                      }
                                    }
                                  );
                                } else if (e.key === "Tab") {
                                  if (e.target.value === "") {
                                    e.preventDefault();
                                    if (isopen === true) {
                                      document
                                        .getElementById("addProduct")
                                        .focus();
                                    }
                                  } else if (
                                    isopen === true &&
                                    e.target.value !== ""
                                  ) {
                                    this.setState({ isopen: false });
                                  }
                                }
                                // else if (e.target.value === "") {
                                //   document.getElementById("addProduct").focus();
                                // }

                                //@prathmesh @productName arrow up-down added start
                                else if (e.keyCode == 40) {
                                  //! this condition for down button press 1409
                                  if (isopen == true)
                                    document
                                      .getElementById("productMdlTr_0")
                                      .focus();
                                  else
                                    this.FocusTrRowFields(
                                      productId + "particularsname-",
                                      ri + 1
                                    );
                                } else if (e.keyCode == 38) {
                                  this.FocusTrRowFields(
                                    productId + "particularsname-",
                                    ri - 1
                                  );
                                }
                                //@prathmesh @productName arrow up-down added end
                              }}
                              // onKeyDown={(e) => {
                              //   if (e.keyCode == 40) {
                              //     this.FocusTrRowFields(productId, ri + 1);
                              //     // console.warn("Down");
                              //   } else if (e.keyCode == 38) {
                              //     this.FocusTrRowFields(productId, ri - 1);
                              //     // console.warn("Up");
                              //   } else if (e.keyCode == 13) {
                              //     productModalStateChange({
                              //       selectProductModal: true,
                              //       rowIndex: ri,
                              //     });
                              //   } else if (e.shiftKey && e.key === "Tab") {
                              //   } else if (e.key === "Tab" && !e.target.value) {
                              //     e.preventDefault();
                              //   }
                              // }}
                              // readOnly
                            />
                          </td>
                          <td>
                            <Form.Control
                              className=" table-text-box border-0"
                              id={productId + `packing-${ri}`}
                              name={`packing-${ri}`}
                              type="text"
                              placeholder="0"
                              onChange={(e) => {
                                handleUnitChange("packing", e.target.value, ri);
                              }}
                              value={
                                rows[ri]["packing"] ? rows[ri]["packing"] : ""
                              }
                              onKeyDown={(e) => {
                                if (e.keyCode == 40) {
                                  this.FocusTrRowFields(
                                    productId + "packing-",
                                    ri + 1
                                  );
                                } else if (e.keyCode == 38) {
                                  this.FocusTrRowFields(
                                    productId + "packing-",
                                    ri - 1
                                  );
                                }
                              }}
                              readOnly
                              tabIndex={-1}
                            />
                          </td>
                          {/* {JSON.stringify(rows[ri]["levelaId"].label)} */}
                          {isBatchOpen == false ? (
                            <>
                              {ABC_flag_value == "A" ||
                              ABC_flag_value == "AB" ||
                              ABC_flag_value == "ABC" ? (
                                <td
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(
                                        productTrForm,
                                        e.target
                                      );
                                    }
                                  }}
                                >
                                  <Select
                                    isDisabled={
                                      rows[ri]["is_level_a"] === true
                                        ? false
                                        : true
                                    }
                                    id={`levelaId-${ri}`}
                                    name={`levelaId-${ri}`}
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder="select..."
                                    styles={flavourDD}
                                    options={this.getLevelsOpt(
                                      "levelAOpt",
                                      ri,
                                      "prod_id"
                                    )}
                                    colors="#729"
                                    onChange={(value, triggeredAction) => {
                                      // rows[ri]["levelaId"] = value;
                                      handleUnitChange("levelaId", value, ri);
                                      // this.getLevelbOpt(
                                      //   ri,
                                      //   rows[ri]["productId"],
                                      //   value
                                      // );
                                      // handleUnitChange();
                                    }}
                                    value={rows[ri]["levelaId"]}
                                    tabIndex={
                                      rows[ri]["levelaId"].label == ""
                                        ? -1
                                        : false
                                    }
                                  />
                                </td>
                              ) : (
                                ""
                              )}

                              {ABC_flag_value == "AB" ||
                              ABC_flag_value == "ABC" ? (
                                <td
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(
                                        productTrForm,
                                        e.target
                                      );
                                    }
                                  }}
                                >
                                  <Select
                                    isDisabled={
                                      rows[ri]["is_level_b"] === true
                                        ? false
                                        : true
                                    }
                                    id={`levelbId-${ri}`}
                                    name={`levelbId-${ri}`}
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder="select..."
                                    styles={flavourDD}
                                    options={this.getLevelsOpt(
                                      "levelBOpt",
                                      ri,
                                      "levelaId"
                                    )}
                                    colors="#729"
                                    onChange={(value, triggeredAction) => {
                                      handleUnitChange("levelbId", value, ri);

                                      // rows[ri]["levelbId"] = value;
                                      // this.getLevelcOpt(
                                      //   ri,
                                      //   rows[ri]["productId"],
                                      //   rows[ri]["levelaId"],
                                      //   value
                                      // );
                                    }}
                                    value={rows[ri]["levelbId"]}
                                    tabIndex={
                                      rows[ri]["levelbId"].label == ""
                                        ? -1
                                        : false
                                    }
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              {ABC_flag_value == "ABC" ? (
                                <td
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                      this.focusNextElement(
                                        productTrForm,
                                        e.target
                                      );
                                    }
                                  }}
                                >
                                  <Select
                                    isDisabled={
                                      rows[ri]["is_level_c"] === true
                                        ? false
                                        : true
                                    }
                                    id={`levelbId-${ri}`}
                                    name={`levelbId-${ri}`}
                                    className="prd-dd-style "
                                    menuPlacement="auto"
                                    components={{
                                      IndicatorSeparator: () => null,
                                    }}
                                    placeholder="select..."
                                    styles={flavourDD}
                                    options={this.getLevelsOpt(
                                      "levelCOpt",
                                      ri,
                                      "levelbId"
                                    )}
                                    colors="#729"
                                    onChange={(value, triggeredAction) => {
                                      // rows[ri]["levelcId"] = value;
                                      handleUnitChange("levelcId", value, ri);
                                    }}
                                    value={rows[ri]["levelcId"]}
                                    tabIndex={
                                      rows[ri]["levelcId"].label == ""
                                        ? -1
                                        : false
                                    }
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            <></>
                          )}

                          <td>
                            <Form.Group
                              className={`${
                                unitIdData && unitIdData[ri] == "Y"
                                  ? "border border-danger "
                                  : ""
                              }`}
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.focusNextElement(
                                    productTrForm,
                                    e.target
                                  );
                                }
                              }}
                            >
                              <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                id={`unitId-${ri}`}
                                name={`unitId-${ri}`}
                                className="prd-dd-style drop-up "
                                components={{
                                  // DropdownIndicator: () => null,
                                  IndicatorSeparator: () => null,
                                }}
                                placeholder="Unit"
                                styles={unitDD}
                                options={this.getLevelsOpt(
                                  "unitOpt",
                                  ri,
                                  "levelcId"
                                )}
                                onChange={(value, triggeredAction) => {
                                  console.log("eee---", value);
                                  handleUnitChange("unitId", value, ri);
                                }}
                                tabIndex={
                                  this.getLevelsOpt("unitOpt", ri, "levelcId")
                                    .length > 1
                                    ? 0
                                    : -1
                                }
                                value={
                                  rows[ri]["unitId"] ? rows[ri]["unitId"] : ""
                                }
                                // value={}
                                // onKeyDown={(e) => {
                                //   if (e.key === "Tab") {
                                //     if (rv.selectedProduct?.is_serial) {
                                //       openSerialNo(ri);
                                //     } else if (rv.selectedProduct?.is_batch) {
                                //       openBatchNo(ri);
                                //     }
                                //   }
                                // }}
                              />
                            </Form.Group>
                          </td>

                          {batchHideShow == true ? (
                            <>
                              {/* {JSON.stringify(rows[ri])} */}
                              <td>
                                <Form.Control
                                  id={productId + `batchNo-${ri}`}
                                  name={`batchNo-${ri}`}
                                  className={`${
                                    batchNoData && batchNoData[ri] == "Y"
                                      ? "border border-danger table-text-box"
                                      : "table-text-box border-0"
                                  }`}
                                  // className="table-text-box border-0"
                                  type="text"
                                  placeholder="0"
                                  tabIndex={
                                    rows[ri]["is_batch"] == false &&
                                    rows[ri]["is_serial"] == false
                                      ? -1
                                      : 0
                                  }
                                  onInput={(e) => {
                                    e.preventDefault();
                                    // e.preventDefault();
                                    // getProductBatchList(ri);
                                    // console.log("rv", rv);
                                    if (rv.selectedProduct?.is_serial) {
                                      openSerialNo(ri);
                                    } else if (rv.selectedProduct?.is_batch) {
                                      // openBatchNo(ri);
                                      productModalStateChange({ rowIndex: ri });

                                      handleUnitChange(
                                        "b_no",
                                        e.target.value,
                                        ri
                                      );
                                      if (rows[ri]["is_batch"] == true) {
                                        this.batchSearchFun(e.target.value);
                                      }
                                      //getProductBatchList(ri);
                                    }
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // console.log("rv.selectedProduct---", rv.selectedProduct);
                                    productModalStateChange({ rowIndex: ri });
                                    //   this.batchSearchFun("");

                                    // if (rv.selectedProduct?.is_serial === true) {
                                    if (
                                      "is_serial" in rows[ri] &&
                                      rows[ri]["is_serial"] === true
                                    ) {
                                      openSerialNo(ri);
                                    } else {
                                      if (
                                        "is_batch" in rows[ri] &&
                                        rows[ri]["is_batch"] == true
                                      ) {
                                        // console.log("batchData ", batchData);
                                        const index = batchData.findIndex(
                                          (object) => {
                                            return (
                                              object.id ===
                                              rows[ri]["b_details_id"]
                                            );
                                          }
                                        );
                                        if (index >= 0) {
                                          setTimeout(() => {
                                            document
                                              .getElementById(
                                                "productBatchTr_" + index
                                              )
                                              .focus();
                                          }, 200);
                                        }
                                        this.setState({ isBatchOpen: true });
                                      }
                                    }
                                  }}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    productModalStateChange({ rowIndex: ri });
                                    if (rows[ri]["is_batch"] == true) {
                                      this.batchSearchFun(e.target.value);
                                      handleUnitChange(
                                        "b_no",
                                        e.target.value,
                                        ri
                                      );
                                    }
                                  }}
                                  // @prathmesh @Without Product selection batch popup open start
                                  // disabled={rows[ri] && "selectedProduct" in rows[ri] && rows[ri]["selectedProduct"] !== '' ? false : true}
                                  disabled={
                                    opType == "create"
                                      ? rows[ri] &&
                                        "selectedProduct" in rows[ri] &&
                                        rows[ri]["selectedProduct"] !== ""
                                        ? false
                                        : true
                                      : ""
                                  }
                                  onFocus={(e) => {
                                    e.preventDefault();
                                    getProductBatchList(ri);
                                    transaction_batch_detailsFun(rv);
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.shiftKey &&
                                      e.keyCode === 9 &&
                                      e.target.value >= 0
                                    ) {
                                    } else if (e.keyCode == 40) {
                                      this.FocusTrRowFields(
                                        productId + "batchNo-",
                                        ri + 1
                                      );
                                    } else if (e.keyCode == 38) {
                                      this.FocusTrRowFields(
                                        productId + "batchNo-",
                                        ri - 1
                                      );
                                    } else if (
                                      e.keyCode === 9 &&
                                      e.target.value == 0
                                    ) {
                                      e.preventDefault();
                                      this.setState({
                                        currentSelectedBatchId: `productBatchTr_${ri}`,
                                      });
                                      if (rv.selectedProduct?.is_serial) {
                                        openSerialNo(ri);
                                      } else if (rv.selectedProduct?.is_batch) {
                                        // openBatchNo(ri);
                                        productModalStateChange({
                                          rowIndex: ri,
                                        });

                                        handleUnitChange(
                                          "b_no",
                                          e.target.value,
                                          ri
                                        );
                                        this.batchSearchFun(e.target.value);
                                      }
                                    } else if (e.keyCode === 13) {
                                      e.preventDefault();

                                      this.setState({
                                        currentSelectedBatchId: `productBatchTr_${ri}`,
                                      });
                                      if (
                                        "is_serial" in rows[ri] &&
                                        rows[ri]["is_serial"] == true
                                      ) {
                                        // rv.selectedProduct?.is_serial

                                        openSerialNo(ri);
                                      } else if (
                                        "is_batch" in rows[ri] &&
                                        rows[ri]["is_batch"] == true
                                      ) {
                                        //rv.selectedProduct?.is_batch
                                        // openBatchNo(ri);
                                        productModalStateChange({
                                          rowIndex: ri,
                                        });

                                        handleUnitChange(
                                          "b_no",
                                          e.target.value,
                                          ri
                                        );
                                        // this.batchSearchFun(e.target.value);
                                        if (
                                          "is_batch" in rows[ri] &&
                                          rows[ri]["is_batch"] == true
                                        ) {
                                          // console.log("batchData ", batchData);
                                          const index = batchData.findIndex(
                                            (object) => {
                                              return (
                                                object.id ===
                                                rows[ri]["b_details_id"]
                                              );
                                            }
                                          );
                                          if (index >= 0) {
                                            setTimeout(() => {
                                              document
                                                .getElementById(
                                                  "productBatchTr_" + index
                                                )
                                                .focus();
                                            }, 200);
                                          }
                                          this.setState({ isBatchOpen: true });
                                        }
                                      }
                                    }
                                    // else if (e.keyCode === 9) {

                                    //   if (e.target.value === "") {
                                    //     e.preventDefault();
                                    //   } else if (
                                    //     isBatchOpen === true &&
                                    //     e.target.value !== ""
                                    //   ) {
                                    //     this.setState({ isBatchOpen: false });
                                    //   }
                                    // }
                                  }}
                                  value={rows[ri]["b_no"]}
                                  // disabled={
                                  //   !(
                                  //     rv.selectedProduct?.is_batch ||
                                  //     rv.selectedProduct?.is_serial
                                  //   )
                                  // }
                                  // readOnly
                                  // onChange={(e) => {
                                  //   e.preventDefault();
                                  //   this.filterBatchData(e.target.value);
                                  // }}

                                  // onChange={(e) => {
                                  //   e.preventDefault();
                                  //   productModalStateChange({ rowIndex: ri });

                                  //   handleUnitChange(
                                  //     "batchNo",
                                  //     e.target.value,
                                  //     ri
                                  //   );
                                  //   this.batchSearchFun(e.target.value);
                                  // }}
                                />
                              </td>
                            </>
                          ) : (
                            <></>
                          )}

                          <td>
                            <Form.Control
                              className={`${
                                qtyData && qtyData[ri] == "Y"
                                  ? "border border-danger table-text-box"
                                  : "table-text-box border-0"
                              }`}
                              id={productId + `qty-${ri}`}
                              name={`qty-${ri}`}
                              // className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              ref={this.qtyRef}
                              onChange={(e) => {
                                // rows[ri]["qty"] = e.target.value;
                                handleUnitChange("qty", e.target.value, ri);
                              }}
                              value={rows[ri]["qty"]}
                              onKeyPress={(e) => {
                                OnlyEnterNumbers(e);
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode == 40) {
                                  this.FocusTrRowFields(
                                    productId + "qty-",
                                    ri + 1
                                  );
                                } else if (e.keyCode == 38) {
                                  this.FocusTrRowFields(
                                    productId + "qty-",
                                    ri - 1
                                  );
                                } else if (e.key === "Tab" && !e.target.value) {
                                  e.preventDefault();
                                } else if (e.key === "Tab") {
                                  if (
                                    transactionType === "sale_invoice" ||
                                    transactionType === "sales_edit"
                                  ) {
                                    if (
                                      rv.qty != null &&
                                      !isFreeQtyExist(
                                        "is_free_qty",
                                        this.props.userControl
                                      )
                                    ) {
                                      qtyVerificationById(
                                        rv,
                                        productId + `qty-${ri}`,
                                        ri
                                      );
                                    }
                                  }
                                } else if (e.keyCode == 13) {
                                  if (e.target.value)
                                    this.focusNextElement(
                                      productTrForm,
                                      e.target
                                    );
                                }
                              }}
                            />
                          </td>

                          {isFreeQtyExist(
                            "is_free_qty",
                            this.props.userControl
                          ) && (
                            <td>
                              <Form.Control
                                id={productId + `freeQty-${ri}`}
                                name={`freeQty-${ri}`}
                                className="table-text-box border-0"
                                type="text"
                                placeholder="0"
                                onChange={(e) => {
                                  handleUnitChange(
                                    "free_qty",
                                    e.target.value,
                                    ri
                                  );
                                }}
                                onBlur={(e) => {
                                  // if (
                                  //   parseInt(rows[ri]["qty"]) <
                                  //     parseInt(rows[ri]["free_qty"]) ===
                                  //   true
                                  // ) {
                                  //   MyNotifications.fire({
                                  //     show: true,
                                  //     icon: "error",
                                  //     title: "Error",
                                  //     msg: "Free Qty should be less than Qty",
                                  //     is_button_show: true,
                                  //   });
                                  //   handleUnitChange("free_qty", 0, ri);
                                  // }
                                }}
                                value={rows[ri]["free_qty"]}
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 40) {
                                    this.FocusTrRowFields(
                                      productId + "freeQty-",
                                      ri + 1
                                    );
                                    // console.warn("Down");
                                  } else if (e.keyCode == 38) {
                                    this.FocusTrRowFields(
                                      productId + "freeQty-",
                                      ri - 1
                                    );
                                    // console.warn("Up");
                                  } else if (e.keyCode == 13) {
                                    this.focusNextElement(
                                      productTrForm,
                                      e.target
                                    );
                                  }
                                }}
                              />
                            </td>
                          )}

                          <td>
                            <Form.Control
                              className={`${
                                rateData && rateData[ri] == "Y"
                                  ? "border border-danger table-text-box "
                                  : "table-text-box border-0"
                              }`}
                              id={productId + `rate-${ri}`}
                              name={`rate-${ri}`}
                              // className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              onChange={(e) => {
                                handleUnitChange(
                                  "org_rate",
                                  e.target.value,
                                  ri
                                );
                              }}
                              value={rows[ri]["org_rate"]}
                              onKeyPress={(e) => {
                                OnlyEnterAmount(e);
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode == 40) {
                                  this.FocusTrRowFields(
                                    productId + "rate-",
                                    ri + 1
                                  );
                                } else if (e.keyCode == 38) {
                                  this.FocusTrRowFields(
                                    productId + "rate-",
                                    ri - 1
                                  );
                                } else if (e.shiftKey && e.key === "Tab") {
                                } else if (e.key === "Tab") {
                                  if (
                                    e.target.value.trim() == "" ||
                                    parseFloat(e.target.value.trim()) <= 0
                                  ) {
                                    e.preventDefault();
                                  }
                                } else if (
                                  e.keyCode == 13 &&
                                  rows[ri]["rate"] > 0
                                ) {
                                  this.focusNextElement(
                                    productTrForm,
                                    e.target
                                  );
                                }
                              }}
                            />
                          </td>

                          <td>
                            <Form.Control
                              id={`grossAmt-${ri}`}
                              name={`grossAmt-${ri}`}
                              className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              // value={rows[ri]["total_base_amt"]}
                              value={this.getFloatUnitElement(
                                "org_base_amt",
                                ri
                              )}
                              disabled
                              readOnly
                            />
                          </td>

                          <td>
                            <Form.Control
                              id={productId + `dis1Per-${ri}`}
                              name={`dis1Per-${ri}`}
                              className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              onChange={(e) => {
                                handleUnitChange("dis_per", e.target.value, ri);
                              }}
                              value={rows[ri]["dis_per"]}
                              onKeyPress={(e) => {
                                OnlyEnterAmount(e);
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode == 40) {
                                  this.FocusTrRowFields(
                                    productId + "dis1Per-",
                                    ri + 1
                                  );
                                } else if (e.keyCode == 38) {
                                  this.FocusTrRowFields(
                                    productId + "dis1Per-",
                                    ri - 1
                                  );
                                } else if (e.keyCode == 13) {
                                  this.focusNextElement(
                                    productTrForm,
                                    e.target
                                  );
                                }
                              }}
                            />
                          </td>

                          {isMultiDiscountExist(
                            "is_multi_discount",
                            this.props.userControl
                          ) && (
                            <td>
                              <Form.Control
                                id={productId + `dis2Per-${ri}`}
                                name={`dis2Per-${ri}`}
                                className="table-text-box border-0"
                                type="text"
                                placeholder="0"
                                onChange={(e) => {
                                  handleUnitChange(
                                    "dis_per2",
                                    e.target.value,
                                    ri
                                  );
                                }}
                                value={rows[ri]["dis_per2"]}
                                onKeyPress={(e) => {
                                  OnlyEnterAmount(e);
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 40) {
                                    this.FocusTrRowFields(
                                      productId + "dis2Per-",
                                      ri + 1
                                    );
                                    // console.warn("Down");
                                  } else if (e.keyCode == 38) {
                                    this.FocusTrRowFields(
                                      productId + "dis2Per-",
                                      ri - 1
                                    );
                                    // console.warn("Up");
                                  } else if (e.keyCode == 13) {
                                    this.focusNextElement(
                                      productTrForm,
                                      e.target
                                    );
                                  }
                                }}
                              />
                            </td>
                          )}

                          <td>
                            <Form.Control
                              id={productId + `disAmt-${ri}`}
                              name={`disAmt-${ri}`}
                              className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              onChange={(e) => {
                                handleUnitChange("dis_amt", e.target.value, ri);
                              }}
                              // onBlur={(e) => {
                              //   e.preventDefault();
                              //   this.setState({
                              //     newBatchSelectModal: true,
                              //   });
                              // }}
                              value={rows[ri]["dis_amt"]}
                              onKeyPress={(e) => {
                                OnlyEnterAmount(e);
                              }}
                              // onBlur={(e) => {
                              //   e.preventDefault();
                              //   if (rv.selectedProduct?.is_serial) {
                              //     // console.log(
                              //     //   "rv serial",
                              //     //   rv.selectedProduct?.is_serial
                              //     // );
                              //     // openSerialNo(ri);
                              //   } else if (rv.selectedProduct?.is_batch) {
                              //     // console.log(
                              //     //   "rv batch",
                              //     //   rv.selectedProduct?.is_batch
                              //     // );
                              //     // openBatchNo(ri);
                              //     getProductBatchList(ri, "costing");
                              //   }

                              // }}

                              onKeyDown={(e) => {
                                if (e.keyCode == 40) {
                                  this.FocusTrRowFields(
                                    productId + "disAmt-",
                                    ri + 1
                                  );
                                } else if (e.keyCode == 38) {
                                  this.FocusTrRowFields(
                                    productId + "disAmt-",
                                    ri - 1
                                  );
                                } else if (e.shiftKey && e.key === "Tab") {
                                } else if (e.key === "Tab") {
                                  if (rv.selectedProduct?.is_serial) {
                                    // console.log(
                                    //   "rv serial",
                                    //   rv.selectedProduct?.is_serial
                                    // );
                                    // openSerialNo(ri);
                                  } else if (rv.selectedProduct?.is_batch) {
                                    // console.log(
                                    //   "rv batch",
                                    //   rv.selectedProduct?.is_batch
                                    // );
                                    // openBatchNo(ri);
                                    getProductBatchList(ri, "costing");
                                  }
                                } else if (e.keyCode == 13) {
                                  if (rv.selectedProduct?.is_serial) {
                                    // console.log(
                                    //   "rv serial",
                                    //   rv.selectedProduct?.is_serial
                                    // );
                                    // openSerialNo(ri);
                                  } else if (rv.selectedProduct?.is_batch) {
                                    // console.log(
                                    //   "rv batch",
                                    //   rv.selectedProduct?.is_batch
                                    // );
                                    // openBatchNo(ri);
                                    getProductBatchList(ri, "costing");
                                  }
                                  this.focusNextElement(
                                    productTrForm,
                                    e.target
                                  );
                                }
                              }}
                            />
                          </td>

                          <td>
                            <Form.Control
                              id={`tax-${ri}`}
                              name={`tax-${ri}`}
                              className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              value={rows[ri]["gst"]}
                              disabled
                              readOnly
                            />
                          </td>

                          <td style={{ backgroundColor: "#D2F6E9" }}>
                            <Form.Control
                              id={`netAmt-${ri}`}
                              name={`netAmt-${ri}`}
                              className="table-text-box border-0"
                              type="text"
                              placeholder="0"
                              value={this.getFloatUnitElement("final_amt", ri)}
                              disabled
                              readOnly
                              style={{ backgroundColor: "#D2F6E9" }}
                            />
                          </td>

                          <td className="d-flex">
                            {rows.length > 1 && (
                              <Button
                                id={productId + `deleteBtn-${ri}`}
                                className="btn_img_style"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveRow(ri);
                                  // this.setState({
                                  //   add_button_flag: true,
                                  // });
                                  productModalStateChange({
                                    add_button_flag: true,
                                  });
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 40) {
                                    this.FocusTrRowFields(
                                      productId + "deleteBtn-",
                                      ri + 1
                                    );
                                  } else if (e.keyCode == 38) {
                                    this.FocusTrRowFields(
                                      productId + "deleteBtn-",
                                      ri - 1
                                    );
                                  } else if (e.keyCode === 32) {
                                    handleRemoveRow(ri);
                                    productModalStateChange({
                                      add_button_flag: true,
                                    });
                                  } else if (e.keyCode === 13) {
                                    this.focusNextElement(
                                      productTrForm,
                                      e.target
                                    );
                                  }
                                }}
                              >
                                <img
                                  isDisabled={rows.length > 0}
                                  src={TableDelete}
                                  alt=""
                                  className="btnimg"
                                  // autoFocus={true}
                                />
                              </Button>
                            )}
                            {sourceType != "return" ? (
                              <>
                                {add_button_flag === true &&
                                  this.checkLastRow(
                                    ri,
                                    rows.length - 1,
                                    rv,
                                    rows[ri]["unitId"],
                                    rows[ri]["qty"]
                                  ) && (
                                    <Button
                                      id={this.props.addBtnId + ri}
                                      className="btn_img_style"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleAddRow();
                                        // this.setState({
                                        //   add_button_flag: !add_button_flag,
                                        // });
                                        productModalStateChange({
                                          add_button_flag: true,
                                        });
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 32) {
                                          handleAddRow();
                                          productModalStateChange({
                                            add_button_flag: true,
                                          });
                                        } else if (e.keyCode === 13) {
                                          this.focusNextElement(
                                            productTrForm,
                                            e.target
                                          );
                                        }
                                      }}
                                    >
                                      <img
                                        src={add_icon}
                                        alt=""
                                        className="btnimg"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleAddRow();
                                          productModalStateChange({
                                            add_button_flag: true,
                                          });
                                        }}
                                        isDisabled={
                                          rv &&
                                          rv.productId &&
                                          rv.productId != ""
                                            ? true
                                            : false
                                        }
                                      />
                                    </Button>
                                  )}
                              </>
                            ) : (
                              <></>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              {/* {JSON.stringify(productLst)}{" "} */}
            </div>
          </div>
        </div>
        {isopen ? (
          <Row className="justify-content-end" ref={this.customModalRef}>
            <div
              className={`${
                transactionTableStyle == "salesOrder" ||
                transactionTableStyle == "salesQuotation" ||
                transactionTableStyle == "counter_sale" ||
                transactionTableStyle == "purchaseOrder"
                  ? "table-style-product-new ps-0"
                  : "table-style-product ps-0"
              }`}
            >
              <Row style={{ background: "#D9F0FB" }} className="ms-0">
                {/* {JSON.stringify(prevProduct)} */}
                <Col lg={6}>
                  <h6 className="table-header-product my-auto">Product</h6>
                </Col>
                <Col lg={6} className="text-end">
                  <img
                    src={close_crossmark_icon}
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ isopen: false });
                    }}
                    className="closeimg"
                  />
                </Col>
              </Row>
              <div className="table-product-style">
                <Table>
                  <thead>
                    <tr style={{ borderBottom: "2px solid transparent" }}>
                      <th>Code</th>
                      <th>
                        <Row>
                          <Col lg={6}>Name</Col>
                          <Col lg={6} className="text-end ps-0">
                            <Button
                              // autoFocus
                              id="addProduct"
                              className="add-btn ms-0"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "product",
                                    "create",
                                    this.props.userPermissions
                                  )
                                ) {
                                  let data = {
                                    rows: rows,
                                    // additionalCharges: additionalCharges,
                                    invoice_data: invoice_data,
                                    from_page: from_source,
                                    rowIndex: rowIndex,
                                    id: invoice_data.id,
                                    opType: opType,
                                  };
                                  eventBus.dispatch("page_change", {
                                    from: from_source,
                                    to: "newproductcreate",
                                    // prop_data: data,
                                    //@vinit @prop_data changed to focus the previous tab were we left
                                    prop_data: {
                                      prop_data: data,
                                      conversionEditData: conversionEditData,
                                      isProduct: "productMdl",
                                      rowIndex: rowIndex,
                                      // opType: opType,
                                    },
                                    isNewTab: false,
                                  });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 40) {
                                  document
                                    .getElementById("productMdlTr_0")
                                    .focus();
                                } else if (e.keyCode === 13) {
                                  if (
                                    isActionExist(
                                      "product",
                                      "create",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    let data = {
                                      rows: rows,
                                      // additionalCharges: additionalCharges,
                                      invoice_data: invoice_data,
                                      from_page: from_source,
                                      rowIndex: rowIndex,
                                      id: invoice_data.id,
                                      opType: opType,
                                    };
                                    eventBus.dispatch("page_change", {
                                      from: from_source,
                                      to: "newproductcreate",
                                      // prop_data: data,
                                      //@vinit @prop_data changed to focus the previous tab were we left
                                      prop_data: {
                                        prop_data: data,
                                        isProduct: "productMdl",
                                        rowIndex: rowIndex,
                                        // opType: opType,
                                      },
                                      isNewTab: false,
                                    });
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Permission is denied!",
                                      is_button_show: true,
                                    });
                                  }
                                }
                              }}
                            >
                              + Add Product
                            </Button>
                          </Col>
                        </Row>
                      </th>
                      <th>Packing</th>
                      <th>Barcode</th>
                      <th>Brand</th>
                      <th>MRP</th>
                      <th>Current Stock</th>
                      <th>Unit</th>
                      <th>Sale Rate</th>
                      <th style={{ width: "5%" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody
                    onKeyDown={(e) => {
                      e.preventDefault();
                      if (e.keyCode != 9) {
                        this.handleProductTableRow(e);
                      }
                    }}
                  >
                    {productLst.map((pv, i) => {
                      return (
                        <tr
                          value={JSON.stringify(pv)}
                          id={`productMdlTr_` + i}
                          tabIndex={i}
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState(
                              {
                                prevProduct: rows[rowIndex],
                              },
                              () => {
                                productModalStateChange({
                                  isProduct: "productMdl",
                                  rowIndex: rowIndex,
                                  selectedProduct: pv,
                                  add_button_flag: true,
                                });
                                this.transaction_product_detailsFun(pv.id);
                                // transaction_product_detailsFun(pv.id);
                              }
                            );
                            // get_supplierlist_by_productidFun(pv.id);
                          }}
                          // onMouseOver={(e) => {
                          //   e.preventDefault();
                          //   // console.log("mouse over--", e.target.value);
                          //   transaction_product_detailsFun(pv.id); //@prathmesh @particulars product info show on mouser hover
                          // }}
                          onDoubleClick={(e) => {
                            e.preventDefault();

                            if (selectedProduct) {
                              rows[rowIndex]["selectedProduct"] =
                                selectedProduct;
                              if (
                                rows[rowIndex]["details_id"] != 0 &&
                                selectedProduct.id == prevProduct.productId
                              ) {
                                // console.log(
                                //   "same product selected while editing tranx, then continue"
                                // );
                              } else if (selectedProduct) {
                                rows[rowIndex]["selectedProduct"] =
                                  selectedProduct;
                                rows[rowIndex]["productName"] =
                                  selectedProduct.product_name;
                                if (saleRateType == "sale") {
                                  rows[rowIndex]["rate"] =
                                    selectedProduct.sales_rate;
                                } else {
                                  if (
                                    transactionType == "purchase_order" ||
                                    transactionType == "purchase_invoice"
                                  ) {
                                    rows[rowIndex]["rate"] =
                                      selectedProduct.purchaserate;
                                  }
                                  if (selectedProduct.is_batch == false) {
                                    rows[rowIndex]["rate"] =
                                      selectedProduct.purchaserate;
                                  }
                                }

                                rows[rowIndex]["productId"] =
                                  selectedProduct.id;
                                rows[rowIndex]["is_level_a"] =
                                  getUserControlData(
                                    "is_level_a",
                                    this.props.userControl
                                  )
                                    ? true
                                    : false;
                                rows[rowIndex]["is_level_b"] =
                                  getUserControlData(
                                    "is_level_b",
                                    this.props.userControl
                                  )
                                    ? true
                                    : false;
                                rows[rowIndex]["is_level_c"] =
                                  getUserControlData(
                                    "is_level_c",
                                    this.props.userControl
                                  )
                                    ? true
                                    : false;
                                rows[rowIndex]["is_batch"] =
                                  selectedProduct.is_batch;
                                rows[rowIndex]["is_serial"] =
                                  selectedProduct.is_serial;

                                let unit_id = {
                                  gst: selectedProduct.igst,
                                  igst: selectedProduct.igst,
                                  cgst: selectedProduct.cgst,
                                  sgst: selectedProduct.sgst,
                                };

                                rows[rowIndex]["unit_id"] = unit_id;
                                rows[rowIndex]["packing"] =
                                  selectedProduct.packing;
                                rows[rowIndex]["b_no"] = "";
                                rows[rowIndex]["b_rate"] = "";
                                rows[rowIndex]["rate_a"] = "";
                                rows[rowIndex]["rate_b"] = "";
                                rows[rowIndex]["rate_c"] = "";
                                rows[rowIndex]["rate"] = "";
                                rows[rowIndex]["gross_amt"] = "";
                                rows[rowIndex]["gross_amt1"] = "";
                                rows[rowIndex]["disc_amt"] = "";
                                rows[rowIndex]["disc_per"] = "";
                                rows[rowIndex]["disc_per2"] = "";
                                rows[rowIndex]["base_amt"] = "";
                                rows[rowIndex]["disc_per_cal"] = "";
                                rows[rowIndex]["disc_amt_cal"] = "";
                                rows[rowIndex]["net_amt"] = "";
                                rows[rowIndex]["taxable_amt"] = "";
                                rows[rowIndex]["total_base_amt"] = "";
                                rows[rowIndex]["total_amt"] = "";
                                rows[rowIndex]["qty"] = "";
                                rows[rowIndex]["dis_amt"] = "";
                                rows[rowIndex]["dis_per"] = "";
                                rows[rowIndex]["dis_per2"] = "";
                                rows[rowIndex]["row_dis_amt"] = "";
                                rows[rowIndex]["invoice_dis_amt"] = "";
                                rows[rowIndex]["gst"] = "";
                                rows[rowIndex]["igst"] = "";
                                rows[rowIndex]["cgst"] = "";
                                rows[rowIndex]["sgst"] = "";
                                rows[rowIndex]["final_amt"] = "";
                                rows[rowIndex]["costing"] = "";
                                rows[rowIndex]["costing_with_tax"] = "";

                                productModalStateChange({
                                  isProduct: "productMdl",
                                  rowIndex: rowIndex,
                                  rows: rows,
                                  selectProductModal: false,
                                  levelOpt: [],
                                });
                                getProductPackageLst(
                                  selectedProduct.id,
                                  rowIndex
                                );
                                // this.transaction_product_listFun();
                              }
                            }
                            this.setState({ isopen: false });
                          }}
                        >
                          <td> {pv.code} </td>
                          <td> {pv.product_name}</td>
                          <td> {pv.packing}</td>
                          <td> {pv.barcode}</td>
                          <td>{pv.brand}</td>
                          <td className="text-end">
                            {isNaN(pv.mrp)
                              ? INRformat.format(0)
                              : INRformat.format(pv.mrp)}
                          </td>
                          <td className="text-end">
                            {isNaN(pv.current_stock)
                              ? INRformat.format(0)
                              : INRformat.format(pv.current_stock)}
                          </td>
                          <td> {pv.unit}</td>
                          <td className="text-end">
                            {isNaN(pv.sales_rate)
                              ? INRformat.format(0)
                              : INRformat.format(pv.sales_rate)}
                          </td>
                          <td className="text-center">
                            <img
                              src={Frame}
                              alt=""
                              className="edit-icon"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  isActionExist(
                                    "product",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  let source = {
                                    rows: rows,
                                    // additionalCharges: additionalCharges,
                                    invoice_data: invoice_data,
                                    from_page: from_source,
                                    rowIndex: rowIndex,
                                    id: invoice_data.id,
                                    opType: opType,
                                  };
                                  let data = {
                                    source: source,
                                    conversionEditData: conversionEditData,
                                    id: pv.id,
                                    isProduct: "productMdl",
                                    rowIndex: rowIndex,
                                  };
                                  eventBus.dispatch("page_change", {
                                    from: from_source,
                                    to: "newproductedit",
                                    prop_data: data,
                                    isNewTab: false,
                                  });
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Permission is denied!",
                                    is_button_show: true,
                                  });
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Row>
        ) : (
          ""
        )}
        {isBatchOpen ? (
          <Row className="justify-content-end" ref={this.customModalRef}>
            <div className="table-style-batch ps-0">
              <div>
                <Row style={{ background: "#D9F0FB" }} className="ms-0">
                  <Col lg={6}>
                    <h6 className="table-header-batch my-auto">Batch</h6>
                  </Col>
                  <Col lg={6} className="text-end">
                    <img
                      src={close_crossmark_icon}
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ isBatchOpen: false });
                      }}
                      className="closeimg"
                    />
                  </Col>
                </Row>
                <Formik
                  innerRef={this.formRef}
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={{
                    product_id: "",
                    b_no: "",
                    b_expiry: "",
                    manufacturing_date: "",
                    level_a_id: "",
                    level_b_id: "",
                    level_c_id: "",
                    unit_id: "",
                    mrp: "",
                  }}
                  validationSchema={Yup.object().shape({
                    b_no: Yup.string().required("Please Enter batch No"),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    // console.log("Before values =-> ", values);
                    let {
                      rows,
                      rowIndex,
                      selectedSupplier,
                      getProductBatchList,
                    } = this.props;
                    let requestData = new FormData();

                    let obj = rows[rowIndex];

                    if (obj) {
                      values["product_id"] = obj.selectedProduct.id;
                      values["level_a_id"] = obj.levelaId?.value;
                      values["level_b_id"] = obj.levelbId?.value;
                      values["level_c_id"] = obj.levelcId?.value;
                      values["unit_id"] = obj.unitId?.value;
                    }

                    values["manufacturing_date"] =
                      values["manufacturing_date"] != ""
                        ? moment(
                            values["manufacturing_date"],
                            "DD/MM/YYYY"
                          ).format("YYYY-MM-DD")
                        : "";
                    values["b_expiry"] =
                      values["b_expiry"] != ""
                        ? moment(values["b_expiry"], "DD/MM/YYYY").format(
                            "YYYY-MM-DD"
                          )
                        : "";
                    values["mrp"] = values["mrp"] != "" ? values["mrp"] : 0;

                    // console.log("after =->", values);
                    requestData.append("product_id", values["product_id"]);
                    requestData.append("level_a_id", values["level_a_id"]);
                    requestData.append("level_b_id", values["level_b_id"]);
                    requestData.append("level_c_id", values["level_c_id"]);
                    requestData.append("unit_id", values["unit_id"]);
                    requestData.append(
                      "manufacturing_date",
                      values["manufacturing_date"]
                    );
                    requestData.append("b_expiry", values["b_expiry"]);
                    requestData.append("mrp", values["mrp"]);
                    requestData.append("supplier_id", selectedSupplier.id);
                    requestData.append("b_no", values["b_no"]);
                    //! console.log("After values", JSON.stringify(values));
                    // for (const pair of requestData.entries()) {
                    //   console.log(`key => ${pair[0]}, value =>${pair[1]}`);
                    // }
                    createBatchDetails(requestData)
                      .then((response) => {
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          MyNotifications.fire({
                            show: true,
                            icon: "success",
                            title: "Success",
                            msg: res.message,
                            is_timeout: true,
                            delay: 1000,
                          });
                          this.setState({ addBatch: false });
                          getProductBatchList(rowIndex, "batch", true);
                          resetForm();
                          // this.setState({
                          //   new_batch: true,
                          // });
                          let batchid = batchDataList.length;

                          setTimeout(() => {
                            document
                              .getElementById("productBatchTr_" + batchid)
                              .focus();
                          }, 1300);
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            // is_button_show: true,
                            is_timeout: true,
                            delay: 1500,
                          });
                        }
                      })
                      .catch((error) => {
                        console.log("error", error);
                      });
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting,
                    resetForm,
                  }) => (
                    <Form
                      className=""
                      onSubmit={handleSubmit}
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div
                        style={{
                          background: "#E6F2F8",
                          borderBottom: "1px solid #dcdcdc",
                        }}
                        className="p-2"
                      >
                        <Row className="">
                          <Col lg={3}>
                            <Row>
                              <Col lg={4} className="pe-0">
                                <Form.Label className="batch-label">
                                  Batch No.
                                </Form.Label>
                              </Col>
                              <Col lg={8} className="pe-0">
                                <Form.Group>
                                  <Form.Control
                                    autoFocus
                                    autoComplete="off"
                                    type="text"
                                    className="batch-text"
                                    placeholder="Batch No"
                                    name="b_no"
                                    id="b_no"
                                    onChange={handleChange}
                                    value={values.b_no}
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.newmfgDateRef.current.focus();
                                      }
                                    }}
                                  />
                                </Form.Group>
                                <span className="text-danger">
                                  {errors.b_no}
                                </span>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={9}>
                            <Row>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={5}>
                                    <Form.Label className="batch-label">
                                      MFG Dt
                                    </Form.Label>
                                  </Col>
                                  <Col lg={7} className="p-0">
                                    <MyTextDatePicker
                                      className="batch-date"
                                      // innerRef={(input) => {
                                      //   this.mfgDateRef.current = input;
                                      // }}
                                      innerRef={(input) => {
                                        this.newmfgDateRef.current = input;
                                      }}
                                      autoComplete="off"
                                      name="manufacturing_date"
                                      id="manufacturing_date"
                                      placeholder="DD/MM/YYYY"
                                      value={values.manufacturing_date}
                                      onChange={handleChange}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                          let datchco = e.target.value.trim();
                                          // console.log("datchco", datchco);
                                          let checkdate = moment(
                                            e.target.value
                                          ).format("DD/MM/YYYY");
                                          // console.log("checkdate", checkdate);
                                          if (
                                            datchco != "__/__/____" &&
                                            // checkdate == "Invalid date"
                                            datchco.includes("_")
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date. ",
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              this.newmfgDateRef.current.focus();
                                            }, 1000);
                                          }
                                        } else if (e.key === "Tab") {
                                          let datchco = e.target.value.trim();
                                          // console.log("datchco", datchco);
                                          let checkdate = moment(
                                            e.target.value
                                          ).format("DD/MM/YYYY");
                                          // console.log("checkdate", checkdate);
                                          if (
                                            datchco != "__/__/____" &&
                                            // checkdate == "Invalid date"
                                            datchco.includes("_")
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date. ",
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              this.newmfgDateRef.current.focus();
                                            }, 1000);
                                          }
                                        } else if (e.keyCode == 13) {
                                          this.newbatchdpRef.current.focus();
                                        }
                                      }}
                                      onBlur={(e) => {
                                        //console.log("e ", e);
                                        if (
                                          e.target.value != null &&
                                          e.target.value != ""
                                        ) {
                                          if (
                                            moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            ).isValid() == true
                                          ) {
                                            let curdate = new Date();

                                            let mfgDate = new Date(
                                              moment(
                                                e.target.value,
                                                "DD/MM/YYYY"
                                              ).toDate()
                                            );
                                            let curdatetime = curdate.getTime();
                                            let mfgDateTime = mfgDate.getTime();
                                            if (curdatetime >= mfgDateTime) {
                                              setFieldValue(
                                                "manufacturing_date",
                                                e.target.value
                                              );
                                              // this.checkInvoiceDateIsBetweenFYFun(
                                              //   e.target.value
                                              // );
                                            } else {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Mfg Date Should not be Greater than todays date",
                                                // is_button_show: true,
                                                is_timeout: true,
                                                delay: 1500,
                                              });
                                              // setFieldValue("manufacturing_date", "");
                                              setTimeout(() => {
                                                this.newmfgDateRef.current.focus();
                                              }, 1000);
                                            }
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid date",
                                              // is_button_show: true,
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              this.newmfgDateRef.current.focus();
                                            }, 1000);
                                            // setFieldValue("manufacturing_date", "");
                                          }
                                        } else {
                                          // setFieldValue("manufacturing_date", "");
                                        }
                                      }}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={5}>
                                    <Form.Label className="batch-label">
                                      Expiry Dt
                                    </Form.Label>
                                  </Col>
                                  <Col lg={7} className="p-0">
                                    <MyTextDatePicker
                                      className="batch-date"
                                      // innerRef={(input) => {
                                      //   this.batchdpRef.current = input;
                                      // }}
                                      innerRef={(input) => {
                                        this.newbatchdpRef.current = input;
                                      }}
                                      autoComplete="off"
                                      name="b_expiry"
                                      id="b_expiry"
                                      placeholder="DD/MM/YYYY"
                                      value={values.b_expiry}
                                      onChange={handleChange}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.key === "Tab") {
                                          let datchco = e.target.value.trim();
                                          // console.log("datchco", datchco);
                                          let checkdate = moment(
                                            e.target.value
                                          ).format("DD/MM/YYYY");
                                          // console.log("checkdate", checkdate);
                                          if (
                                            datchco != "__/__/____" &&
                                            // checkdate == "Invalid date"
                                            datchco.includes("_")
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date. ",
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              this.newbatchdpRef.current.focus();
                                            }, 1000);
                                          }
                                        } else if (e.key === "Tab") {
                                          let datchco = e.target.value.trim();
                                          // console.log("datchco", datchco);
                                          let checkdate = moment(
                                            e.target.value
                                          ).format("DD/MM/YYYY");
                                          // console.log("checkdate", checkdate);
                                          if (
                                            datchco != "__/__/____" &&
                                            // checkdate == "Invalid date"
                                            datchco.includes("_")
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date. ",
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              this.newbatchdpRef.current.focus();
                                            }, 1000);
                                          }
                                        } else if (e.keyCode == 13) {
                                          this.newbatchMRPref.current.focus();
                                        }
                                      }}
                                      onBlur={(e) => {
                                        //console.log("e ", e);

                                        if (
                                          e.target.value != null &&
                                          e.target.value != ""
                                        ) {
                                          if (
                                            moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            ).isValid() == true
                                          ) {
                                            let mfgDate = "";
                                            if (
                                              values.manufacturing_date != ""
                                            ) {
                                              mfgDate = new Date(
                                                moment(
                                                  values.manufacturing_date,
                                                  " DD-MM-yyyy"
                                                ).toDate()
                                              );
                                              let currentDate = new Date();
                                              let curdatetime =
                                                currentDate.getTime();
                                              let expDate = new Date(
                                                moment(
                                                  e.target.value,
                                                  "DD/MM/YYYY"
                                                ).toDate()
                                              );
                                              if (
                                                mfgDate.getTime() <
                                                  expDate.getTime() &&
                                                curdatetime <= expDate.getTime()
                                              ) {
                                                setFieldValue(
                                                  "b_expiry",
                                                  e.target.value
                                                );
                                                // this.checkInvoiceDateIsBetweenFYFun(
                                                //   e.target.value
                                                // );
                                              } else {
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg: "Expiry date should be greater MFG date / Current Date",
                                                  // is_button_show: true,
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                // setFieldValue("b_expiry", "");
                                                setTimeout(() => {
                                                  this.newbatchdpRef.current.focus();
                                                }, 1000);
                                              }
                                              // }else{

                                              //   MyNotifications.fire({
                                              //     show: true,
                                              //     icon: "error",
                                              //     title: "Error",
                                              //     msg: "Expiry date should be greater current date",
                                              //     is_button_show: true,
                                              //   });
                                              //   setFieldValue("b_expiry", "");
                                              //   this.newbatchdpRef.current.focus();   //console.log("expirt date is not greater than today")
                                              // }
                                            } else if (
                                              values.manufacturing_date == ""
                                            ) {
                                              let currentDate = new Date();
                                              let curDate = new Date(
                                                moment(
                                                  e.target.value,
                                                  "DD-MM-yyyy"
                                                ).toDate()
                                              );
                                              let curdatetime =
                                                currentDate.getTime();
                                              let curdatet = curDate.getTime();
                                              // console.log("curdatetime", curdatetime);
                                              if (curdatetime < curdatet) {
                                                // console.log(
                                                //   "curdatetime < curdatet",
                                                //   curdatetime < curdatet
                                                // );
                                                setFieldValue(
                                                  "b_expiry",
                                                  e.target.value
                                                );
                                              } else {
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg: "Expiry date should be greater current date",
                                                  // is_button_show: true,
                                                  is_timeout: true,
                                                  delay: 1500,
                                                });
                                                // setFieldValue("b_expiry", "");
                                                setTimeout(() => {
                                                  this.newbatchdpRef.current.focus();
                                                }, 1000);
                                              }
                                            } else {
                                              setFieldValue(
                                                "b_expiry",
                                                e.target.value
                                              );
                                            }
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid date",
                                              // is_button_show: true,
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              this.newbatchdpRef.current.focus();
                                            }, 1000);
                                            // setFieldValue("b_expiry", "");
                                          }
                                        } else {
                                          // setFieldValue("b_expiry", "");
                                        }
                                      }}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3}>
                                <Row>
                                  <Col lg={4}>
                                    <Form.Label className="batch-label">
                                      {" "}
                                      MRP
                                    </Form.Label>
                                  </Col>
                                  <Col lg={8} className="ps-0">
                                    <Form.Group>
                                      <Form.Control
                                        ref={this.newbatchMRPref}
                                        autoComplete="off"
                                        type="text"
                                        placeholder="0.00"
                                        name="mrp"
                                        id="mrp"
                                        className="batch-text text-end"
                                        onChange={handleChange}
                                        value={values.mrp}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 13) {
                                            document
                                              .getElementById(
                                                "newBatchSubmitBtn"
                                              )
                                              .focus();
                                          }
                                        }}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={1} className="ps-0">
                                <Button
                                  id="newBatchSubmitBtn"
                                  className="batch-submit"
                                  type="submit"
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 32) {
                                      e.preventDefault();
                                    } else if (e.keyCode === 13) {
                                      this.formRef.current.handleSubmit();
                                    }
                                  }}
                                >
                                  Add
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              {/* <div className="batch-table"> */}
              <div className="batch-table">
                <Table>
                  <thead>
                    <tr style={{ borderBottom: "2px solisd transparent" }}>
                      <th>
                        {/* <Row>
                          <Col lg={7}>Batch</Col>
                          <Col lg={5} className="text-end">
                            <Button
                              className="add-btn"
                              onClick={(e) => {
                                this.setState({ addBatch: true });
                              }}
                            >
                              + Add Batch
                            </Button>
                          </Col>
                        </Row> */}
                        Batch
                      </th>

                      <th>MFG Date</th>
                      <th>Expiry</th>
                      <th>MRP</th>
                      {/* <th>Opn.Stk</th> */}
                      <th>Current Stk</th>
                      <th>Pur.Rate</th>
                      <th>Cost</th>
                      <th>Cost with tax</th>
                      <th>Sale Rate</th>
                      <th style={{ width: "5%" }}>Action</th>
                    </tr>
                  </thead>
                  {/* {JSON.stringify(batchDataList)} */}
                  <tbody
                    onKeyDown={(e) => {
                      //batchS
                      // e.preventDefault();
                      if (e.keyCode != 9) {
                        if (ismodify === false) {
                          this.handleBatchTableRow(e);
                        }
                      }
                    }}
                  >
                    {batchDataList &&
                      batchDataList.length > 0 &&
                      batchDataList.map((v, i) => {
                        return ismodify == true && modifyIndex == i ? (
                          <tr
                          // id={`productBatchTr_` + i}   //batchS
                          // prId={v.id}
                          // tabIndex={i}
                          >
                            <td
                              className="p-0"
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                padding: "0px",
                                textAlign: "end",
                              }}
                            >
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Batch No"
                                  name="modify_batch_no"
                                  id="modify_batch_no"
                                  className="batch-text text-end"
                                  onChange={(e) => {
                                    let val = e.target.value;
                                    // console.log("val", val);
                                    this.handleModifyElement("batch_no", val);
                                  }}
                                  value={modifyObj.batch_no}
                                />
                              </Form.Group>
                            </td>

                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                padding: "0px",
                              }}
                            >
                              <Form.Group>
                                <MyTextDatePicker
                                  className="batch-date text-end"
                                  innerRef={(input) => {
                                    this.edtmfgDateRef.current = input;
                                  }}
                                  autoComplete="off"
                                  name="modify_manufacturing_date"
                                  id="modify_manufacturing_date"
                                  placeholder="DD/MM/YYYY"
                                  value={modifyObj.manufacturing_date}
                                  onChange={(e) => {
                                    // console.log("date", e);
                                    e.preventDefault();
                                    let val = e.target.value;
                                    // console.log("val", val);
                                    this.handleModifyElement(
                                      "manufacturing_date",
                                      val
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                      let datchco = e.target.value.trim();
                                      // console.log("datchco", datchco);
                                      let checkdate = moment(
                                        e.target.value
                                      ).format("DD/MM/YYYY");
                                      // console.log("checkdate", checkdate);
                                      if (
                                        datchco != "__/__/____" &&
                                        // checkdate == "Invalid date"
                                        datchco.includes("_")
                                      ) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Please Enter Correct Date. ",
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        setTimeout(() => {
                                          this.mfgDateRef.current.focus();
                                        }, 1000);
                                      }
                                    } else if (e.key === "Tab") {
                                      let datchco = e.target.value.trim();
                                      // console.log("datchco", datchco);
                                      let checkdate = moment(
                                        e.target.value
                                      ).format("DD/MM/YYYY");
                                      // console.log("checkdate", checkdate);
                                      if (
                                        datchco != "__/__/____" &&
                                        // checkdate == "Invalid date"
                                        datchco.includes("_")
                                      ) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Please Enter Correct Date. ",
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        setTimeout(() => {
                                          this.edtmfgDateRef.current.focus();
                                        }, 1000);
                                      }
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      if (
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid() == true
                                      ) {
                                        let curdate = new Date();

                                        let mfgDate = new Date(
                                          moment(
                                            e.target.value,
                                            "DD/MM/YYYY"
                                          ).toDate()
                                        );
                                        let curdatetime = curdate.getTime();
                                        let mfgDateTime = mfgDate.getTime();

                                        if (curdatetime < mfgDateTime) {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Mfg Date Should not be Greater than todays date",
                                            // is_button_show: true,
                                            is_timeout: true,
                                            delay: 1500,
                                          });
                                          let val = e.target.value;
                                          this.handleModifyElement(
                                            "manufacturing_date",
                                            val
                                          );
                                          setTimeout(() => {
                                            this.edtmfgDateRef.current.focus();
                                          }, 1000);
                                        }
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Invalid date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                      }
                                    } else {
                                    }
                                  }}
                                />
                              </Form.Group>
                            </td>
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                padding: "0px",
                              }}
                            >
                              <Form.Group>
                                <MyTextDatePicker
                                  className="batch-date text-end"
                                  innerRef={(input) => {
                                    this.edtbatchdpRef.current = input;
                                  }}
                                  autoComplete="off"
                                  name="expiry_date"
                                  id="expiry_date"
                                  placeholder="DD/MM/YYYY"
                                  value={modifyObj.expiry_date}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let val = e.target.value;
                                    this.handleModifyElement(
                                      "expiry_date",
                                      val
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.key === "Tab") {
                                      let datchco = e.target.value.trim();
                                      // console.log("datchco", datchco);
                                      let checkdate = moment(
                                        e.target.value
                                      ).format("DD/MM/YYYY");
                                      // console.log("checkdate", checkdate);
                                      if (
                                        datchco != "__/__/____" &&
                                        // checkdate == "Invalid date"
                                        datchco.includes("_")
                                      ) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Please Enter Correct Date. ",
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        setTimeout(() => {
                                          this.batchdpRef.current.focus();
                                        }, 1000);
                                      }
                                    } else if (e.key === "Tab") {
                                      let datchco = e.target.value.trim();
                                      // console.log("datchco", datchco);
                                      let checkdate = moment(
                                        e.target.value
                                      ).format("DD/MM/YYYY");
                                      // console.log("checkdate", checkdate);
                                      if (
                                        datchco != "__/__/____" &&
                                        // checkdate == "Invalid date"
                                        datchco.includes("_")
                                      ) {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Please Enter Correct Date. ",
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        setTimeout(() => {
                                          this.edtbatchdpRef.current.focus();
                                        }, 1000);
                                      }
                                    }
                                  }}
                                  onBlur={(e) => {
                                    //console.log("e ", e);
                                    if (
                                      e.target.value != null &&
                                      e.target.value != ""
                                    ) {
                                      if (
                                        moment(
                                          e.target.value,
                                          "DD-MM-YYYY"
                                        ).isValid() == true
                                      ) {
                                        let mfgDate = "";
                                        if (
                                          modifyObj.manufacturing_date != ""
                                        ) {
                                          mfgDate = new Date(
                                            moment(
                                              modifyObj.manufacturing_date,
                                              " DD-MM-yyyy"
                                            ).toDate()
                                          );
                                          let currentDate = new Date();
                                          let curdatetime =
                                            currentDate.getTime();
                                          let expDate = new Date(
                                            moment(
                                              e.target.value,
                                              "DD/MM/YYYY"
                                            ).toDate()
                                          );
                                          if (
                                            mfgDate.getTime() <
                                              expDate.getTime() &&
                                            curdatetime <= expDate.getTime()
                                          ) {
                                            // ! DO Nothing
                                            // setFieldValue(
                                            //   "b_expiry",
                                            //   e.target.value
                                            // );
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Expiry date should be greater MFG date / Current Date",
                                              // is_button_show: true,
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            let val = e.target.value;
                                            this.handleModifyElement(
                                              "expiry_date",
                                              val
                                            );

                                            setTimeout(() => {
                                              this.edtbatchdpRef.current.focus();
                                            }, 1000);
                                          }
                                        } else if (
                                          modifyObj.manufacturing_date == ""
                                        ) {
                                          let currentDate = new Date();
                                          let curDate = new Date(
                                            moment(
                                              e.target.value,
                                              "DD-MM-yyyy"
                                            ).toDate()
                                          );
                                          let curdatetime =
                                            currentDate.getTime();
                                          let curdatet = curDate.getTime();
                                          // console.log("curdatetime", curdatetime);
                                          if (curdatetime > curdatet) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Expiry date should be greater current date",
                                              // is_button_show: true,
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            let val = e.target.value;
                                            this.handleModifyElement(
                                              "expiry_date",
                                              val
                                            );

                                            setTimeout(() => {
                                              this.edtbatchdpRef.current.focus();
                                            }, 1000);
                                          }
                                        }
                                      } else {
                                        MyNotifications.fire({
                                          show: true,
                                          icon: "error",
                                          title: "Error",
                                          msg: "Invalid date",
                                          // is_button_show: true,
                                          is_timeout: true,
                                          delay: 1500,
                                        });
                                        let val = e.target.value;
                                        this.handleModifyElement(
                                          "expiry_date",
                                          val
                                        );
                                        setTimeout(() => {
                                          this.edtbatchdpRef.current.focus();
                                        }, 1000);
                                        // setFieldValue("b_expiry", "");
                                      }
                                    } else {
                                      // setFieldValue("b_expiry", "");
                                    }
                                  }}
                                />
                              </Form.Group>
                            </td>
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                padding: "0px",
                              }}
                            >
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  name="modify_mrp"
                                  id="modify_mrp"
                                  className="batch-text text-end"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let val = e.target.value;
                                    this.handleModifyElement("mrp", val);
                                  }}
                                  value={modifyObj.mrp}
                                />
                              </Form.Group>
                            </td>

                            {/* <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {isNaN(INRformat.format(v.opening_stock))
                                ? 0
                                : INRformat.format(v.opening_stock)}
                            </td> */}

                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {isNaN(INRformat.format(v.closing_stock))
                                ? 0
                                : INRformat.format(v.closing_stock)}
                              {/* {modifyObj.closing_stock} */}
                            </td>

                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {modifyObj.purchase_rate} */}
                              {isNaN(INRformat.format(v.purchase_rate))
                                ? 0
                                : INRformat.format(v.purchase_rate)}
                            </td>
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {modifyObj.costing
                            ? parseFloat(modifyObj.costing).toFixed(2)
                            : ""} */}
                              {isNaN(INRformat.format(v.costing))
                                ? 0
                                : INRformat.format(v.costing)}
                            </td>
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {modifyObj.costingWithTax
                            ? parseFloat(modifyObj.costingWithTax).toFixed(2)
                            : ""} */}
                              {/* {INRformat.format(v.taxable_amt)} */}
                            </td>

                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {modifyObj.min_rate_a} */}
                              {isNaN(INRformat.format(v.min_rate_a))
                                ? 0
                                : INRformat.format(v.min_rate_a)}
                            </td>

                            <td className="text-center d-flex">
                              <Button
                                className="batch-btn-img"
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                    this.updateBatchData();
                                  }
                                }}
                              >
                                <img
                                  src={rightCheckMark}
                                  alt=""
                                  className="batch-img"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.updateBatchData();
                                    // console.log("update clicked");
                                  }}
                                />
                              </Button>
                              <Button
                                className="batch-btn-img"
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                    this.clearModifyData();
                                  }
                                }}
                              >
                                <img
                                  src={wrongCheckMark}
                                  alt=""
                                  className="batch-img"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.clearModifyData();
                                  }}
                                />
                              </Button>
                            </td>
                          </tr>
                        ) : (
                          <tr
                            value={JSON.stringify(v)}
                            id={`productBatchTr_` + i}
                            prId={v.id}
                            tabIndex={i}
                            onClick={(e) => {
                              e.preventDefault();
                              productModalStateChange({
                                isBatchMdl: "batchMdl",
                                rowIndex: rowIndex,
                                batch_data_selected: v,
                                b_details_id: v,
                                tr_id: i + 1,
                                is_expired: v.is_expired,
                              });
                              // this.transaction_batch_detailsFun(v);
                              transaction_batch_detailsFun(v);
                            }}
                            // @prathmesh @batch info show on mouser hover
                            onFocus={(e) => {
                              e.preventDefault();
                              // console.log("mouse over--", e.target.value);
                              transaction_batch_detailsFun(v);
                            }}
                            // className={`${
                            //   new_batch == true && batchDataList.length == i + 1
                            //     ? "tr-color"
                            //     : is_expired != true
                            //     ? tr_id == i + 1
                            //       ? "tr-color"
                            //       : ""
                            //     : ""
                            // }`}
                            onChange={(e) => {
                              // this.setBatchInputData(   //batchS
                              //   e.target.value,
                              //   true,
                              //   `productBatchTr_-${i}`
                              // );
                            }}
                            // onKeyDown={(e) => {      //batchS
                            //   e.preventDefault();
                            //   if (e.keyCode != 9) {
                            //     this.handleBatchTableRow(e);
                            //   }
                            // }}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              // setTimeout(() => {
                              //     this.qtyRef.current.focus();
                              // }, 500);
                              let {
                                rows,
                                rowIndex,
                                b_details_id,
                                is_expired,
                                selectedSupplier,
                              } = this.props;
                              console.log("b_details_id", b_details_id);
                              let currentDate = new Date().toLocaleDateString(
                                "en-GB"
                              );

                              let actuDate = b_details_id.expiry_date;

                              var loginDate = currentDate;
                              loginDate = new Date(
                                loginDate.split("/")[2],
                                loginDate.split("/")[1] - 1,
                                loginDate.split("/")[0]
                              );
                              var mat_date = b_details_id.expiry_date;
                              mat_date = new Date(
                                mat_date.split("/")[2],
                                mat_date.split("/")[1] - 1,
                                mat_date.split("/")[0]
                              );
                              var timeDiff =
                                mat_date.getTime() - loginDate.getTime();
                              var NoOfDays = Math.ceil(
                                timeDiff / (1000 * 3600 * 24)
                              );

                              let isConfirm = "";
                              if (NoOfDays < 0) {
                                console.log("no of days");
                                MyNotifications.fire({
                                  show: true,
                                  icon: "confirm",
                                  title: "Confirm",
                                  msg: "Batch expired allowed or not?",
                                  is_button_show: true,
                                  is_timeout: false,
                                  delay: 0,
                                  handleSuccessFn: () => {
                                    // if (b_details_id.batch_no !== "") {
                                    //   setTimeout(() => {
                                    //     this.qtyRef.current?.focus();
                                    //   }, 100);
                                    // }

                                    let batchError = false;

                                    if (b_details_id != 0) {
                                      batchError = false;
                                      let salesrate = b_details_id.min_rate_a;

                                      if (
                                        selectedSupplier &&
                                        parseInt(selectedSupplier.salesRate) ==
                                          2
                                      ) {
                                        salesrate = b_details_id.min_rate_b;
                                      } else if (
                                        selectedSupplier &&
                                        parseInt(selectedSupplier.salesRate) ==
                                          3
                                      ) {
                                        salesrate = b_details_id.min_rate_c;
                                      }
                                      if (
                                        saleRateType == "sale" ||
                                        transactionType == "sales_invoice" ||
                                        transactionType == "sales_edit"
                                      ) {
                                        rows[rowIndex]["rate"] = salesrate;
                                        rows[rowIndex]["sales_rate"] =
                                          salesrate;
                                      } else {
                                        rows[rowIndex]["rate"] =
                                          b_details_id.purchase_rate;
                                        rows[rowIndex]["sales_rate"] =
                                          salesrate;
                                      }

                                      rows[rowIndex]["b_details_id"] =
                                        b_details_id.id;
                                      rows[rowIndex]["b_no"] =
                                        b_details_id.batch_no;
                                      rows[rowIndex]["b_rate"] =
                                        b_details_id.mrp;

                                      rows[rowIndex]["rate_a"] =
                                        b_details_id.min_rate_a;
                                      rows[rowIndex]["rate_b"] =
                                        b_details_id.min_rate_b;
                                      rows[rowIndex]["rate_c"] =
                                        b_details_id.min_rate_c;
                                      rows[rowIndex]["margin_per"] =
                                        b_details_id.min_margin;
                                      rows[rowIndex]["b_purchase_rate"] =
                                        b_details_id.purchase_rate;
                                      // rows[rowIndex]["costing"] = values.costing;
                                      // rows[rowIndex]["costingWithTax"] =
                                      //   values.costingWithTax;

                                      rows[rowIndex]["b_expiry"] =
                                        b_details_id.expiry_date != ""
                                          ? b_details_id.expiry_date
                                          : "";

                                      rows[rowIndex]["manufacturing_date"] =
                                        b_details_id.manufacturing_date != ""
                                          ? b_details_id.manufacturing_date
                                          : "";

                                      rows[rowIndex]["is_batch"] = isBatch;
                                    }
                                    productModalStateChange(
                                      {
                                        isBatchMdl: "batchMdl",
                                        rowIndex: rowIndex,
                                        batch_error: batchError,
                                        newBatchModal: false,
                                        // rowIndex: -1,
                                        b_details_id: 0,
                                        isBatch: isBatch,
                                        rows: rows,
                                      },
                                      true
                                    );
                                    this.setState({ isBatchOpen: false });
                                  },
                                  handleFailFn: () => {
                                    isConfirm = false;
                                  },
                                });
                              } else {
                                // isConfirm = true;
                                console.log("no of days else ------");

                                let batchError = false;

                                if (b_details_id != 0) {
                                  batchError = false;
                                  let salesrate = b_details_id.min_rate_a;

                                  if (
                                    selectedSupplier &&
                                    parseInt(selectedSupplier.salesRate) == 2
                                  ) {
                                    salesrate = b_details_id.min_rate_b;
                                  } else if (
                                    selectedSupplier &&
                                    parseInt(selectedSupplier.salesRate) == 3
                                  ) {
                                    salesrate = b_details_id.min_rate_c;
                                  }
                                  if (
                                    saleRateType == "sale" ||
                                    transactionType == "sales_invoice" ||
                                    transactionType == "sales_edit"
                                  ) {
                                    rows[rowIndex]["rate"] = "";
                                    rows[rowIndex]["org_rate"] = salesrate;

                                    rows[rowIndex]["sales_rate"] = salesrate;
                                  } else {
                                    rows[rowIndex]["rate"] =
                                      b_details_id.purchase_rate;
                                    rows[rowIndex]["sales_rate"] = salesrate;
                                  }

                                  rows[rowIndex]["b_details_id"] =
                                    b_details_id.id;
                                  rows[rowIndex]["b_no"] =
                                    b_details_id.batch_no;
                                  rows[rowIndex]["b_rate"] = b_details_id.mrp;

                                  rows[rowIndex]["rate_a"] =
                                    b_details_id.min_rate_a;
                                  rows[rowIndex]["rate_b"] =
                                    b_details_id.min_rate_b;
                                  rows[rowIndex]["rate_c"] =
                                    b_details_id.min_rate_c;
                                  rows[rowIndex]["margin_per"] =
                                    b_details_id.min_margin;
                                  rows[rowIndex]["b_purchase_rate"] =
                                    b_details_id.purchase_rate;
                                  // rows[rowIndex]["costing"] = values.costing;
                                  // rows[rowIndex]["costingWithTax"] =
                                  //   values.costingWithTax;

                                  rows[rowIndex]["b_expiry"] =
                                    b_details_id.expiry_date != ""
                                      ? b_details_id.expiry_date
                                      : "";

                                  rows[rowIndex]["manufacturing_date"] =
                                    b_details_id.manufacturing_date != ""
                                      ? b_details_id.manufacturing_date
                                      : "";

                                  rows[rowIndex]["is_batch"] = isBatch;
                                }

                                rows[rowIndex]["b_details_id"] =
                                  b_details_id.id;
                                rows[rowIndex]["b_no"] = b_details_id.batch_no;
                                rows[rowIndex]["b_rate"] = b_details_id.mrp;
                                rows[rowIndex]["closing_stock"] =
                                  b_details_id.closing_stock;
                                rows[rowIndex]["rate_a"] =
                                  b_details_id.min_rate_a;
                                rows[rowIndex]["rate_b"] =
                                  b_details_id.min_rate_b;
                                rows[rowIndex]["rate_c"] =
                                  b_details_id.min_rate_c;
                                rows[rowIndex]["margin_per"] =
                                  b_details_id.min_margin;
                                rows[rowIndex]["b_purchase_rate"] =
                                  b_details_id.purchase_rate;
                                // rows[rowIndex]["costing"] = values.costing;
                                // rows[rowIndex]["costingWithTax"] =
                                //   values.costingWithTax;

                                rows[rowIndex]["b_expiry"] =
                                  b_details_id.expiry_date != ""
                                    ? b_details_id.expiry_date
                                    : "";

                                rows[rowIndex]["manufacturing_date"] =
                                  b_details_id.manufacturing_date != ""
                                    ? b_details_id.manufacturing_date
                                    : "";

                                rows[rowIndex]["is_batch"] = isBatch;
                                productModalStateChange(
                                  {
                                    isBatchMdl: "batchMdl",
                                    rowIndex: rowIndex,
                                    batch_error: batchError,
                                    newBatchModal: false,
                                    // rowIndex: -1,
                                    b_details_id: 0,
                                    isBatch: isBatch,
                                    rows: rows,
                                  },
                                  true
                                );
                                this.setState({ isBatchOpen: false });
                              }

                              // if (isConfirm)
                            }}
                          >
                            <td
                              className="text-end"
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                // padding: "0px",
                              }}
                            >
                              {/* <pre>{JSON.stringify(v, undefined, 2)}</pre> */}
                              {v.batch_no}
                            </td>

                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {v.manufacturing_date}
                              {/* {moment(v.manufacturing_date).format(
                            "DD-MM-YYYY"
                          ) === "Invalid date"
                            ? ""
                            : moment(v.manufacturing_date).format(
                              "DD-MM-YYYY"
                            )} */}
                            </td>
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {v.expiry_date}
                              {/* {moment(v.expiry_date).format("DD-MM-YYYY") ===
                            "Invalid date"
                            ? ""
                            : moment(v.expiry_date).format("DD-MM-YYYY")} */}
                            </td>
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                // padding: "0px",
                                textAlign: "end",
                              }}
                            >
                              {/* {v.mrp} */}
                              {isNaN(v.mrp)
                                ? INRformat.format(0)
                                : INRformat.format(v.mrp)}
                            </td>
                            {/* <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                             
                              {isNaN(v.opening_stock)
                                ? INRformat.format(0)
                                : INRformat.format(v.opening_stock)}
                            </td> */}
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {v.closing_stock} */}
                              {isNaN(v.closing_stock)
                                ? INRformat.format(0)
                                : INRformat.format(v.closing_stock)}
                            </td>

                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {v.purchase_rate} */}
                              {isNaN(v.purchase_rate)
                                ? INRformat.format(0)
                                : INRformat.format(v.purchase_rate)}
                            </td>
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {v.costing ? parseFloat(v.costing).toFixed(2) : ""} */}
                              {isNaN(v.costing)
                                ? INRformat.format(0)
                                : INRformat.format(v.costing)}
                            </td>
                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {v.costingWithTax
                            ? parseFloat(v.costingWithTax).toFixed(2)
                            : ""} */}
                              {isNaN(v.costingWithTax)
                                ? INRformat.format(0)
                                : INRformat.format(v.costingWithTax)}
                            </td>

                            <td
                              style={{
                                borderRight: "1px solid #dcdcdc",
                                textAlign: "end",
                              }}
                            >
                              {/* {v.min_rate_a} */}
                              {isNaN(v.min_rate_a)
                                ? INRformat.format(0)
                                : INRformat.format(v.min_rate_a)}
                            </td>

                            <td className="text-center d-flex">
                              <img
                                src={Frame}
                                className="batch-edit"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // enable the row editable
                                  // v["manufacturing_date"] =
                                  //   v["manufacturing_date"] != ""
                                  //     ? moment(
                                  //         v["manufacturing_date"],
                                  //         "DD/MM/YYYY"
                                  //       ).toDate()
                                  //     : "";
                                  // v["b_expiry"] =
                                  //   v["b_expiry"] != ""
                                  //     ? moment(
                                  //         v["b_expiry"],
                                  //         "DD/MM/YYYY"
                                  //       ).toDate()
                                  //     : "";
                                  this.handleModifyEnable(i, v);
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Row>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ userPermissions, userControl }) => {
  return { userPermissions, userControl };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
      setUserControl,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(CmpTRowComposition);
