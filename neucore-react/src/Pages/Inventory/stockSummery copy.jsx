import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  ButtonGroup,
  Modal,
  Container,
  InputGroup,
  CloseButton,
  Accordion,
} from "react-bootstrap";

import { Formik, setNestedObjectValues } from "formik";
import * as Yup from "yup";
import TRowComponentModified from "../Tranx/Components/TRowComponentModified";
import moment from "moment";
import Select from "react-select";

// import { Select, components } from "react-select";
import { default as ReactSelect } from "react-select";

// import inr from "@render/assets/images/inr.png";
//import //   getPurchaseAccounts,
//   getSundryCreditors,
//   getProduct,
//   createPurchaseInvoice,
//   getDiscountLedgers,
//   getAdditionalLedgers,
//   authenticationService,
//   getPOPendingOrderWithIds,
//   getPOInvoiceWithIds,
//   getClosingStock,
//   getInwardStock,
//   getOutwardStock,
//   getOpeningStock,
//"@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
} from "@/helpers";

// const customStyles = {
//   control: (base) => ({
//     ...base,
//     height: 30,
//     minHeight: 30,
//     border: 'none',
//     fontSize: '13px',
//     padding: '0 6px',
//     boxShadow: 'none',
//     //lineHeight: "10",
//     background: 'transparent',
//     //borderBottom: "1px solid #ccc",
//     fontFamily: 'MontserratRegular',
//     '&:focus': {
//       borderBottom: '1px solid black',
//     },
//   }),
// };
const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    fontSize: "13px",
    border: "none",
    padding: "0 6px",
    fontFamily: "MontserratRegular",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
    // borderBottom: '1px solid #ccc',
    // '&:focus': {
    //   borderBottom: '1px solid #1e3989',
    // },
  }),
};

const selectopt = [
  { value: "Opening Stock", label: "Opening Stock" },
  { value: "Closing Stock", label: "Closing Stock" },
  { value: "Inwrads", label: "Inwrads" },
  { value: "Outwrads", label: "Outwrads" },
];
const products = [
  { value: "Product 1", label: "Product 1" },
  { value: "Washing Machine", label: "Washing Machine" },
];
const drcrtype = [
  { value: "Dr", label: "Dr" },
  { value: "Cr", label: "Cr" },
];

export default class stockSummery extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
      optionSelected: null,
      show: false,
      undervalue: false,
      invoice_data: "",
      // selectoption: false,
      amtledgershow: false,
      showDiv: false,
      onaccountmodal: false,
      capitalacdetailsView: false,
      groupsummeryModalShow: false,
      capitalacdetailrenders: false,
      billadjusmentmodalshow: false,
      bankledgershow: false,
      bankchequeshow: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      billLst: [],
      invoiceedit: false,
      adjusmentbillmodal: false,
      createproductmodal: false,
      pendingordermodal: false,
      pendingorderprdctsmodalshow: false,
      productLst: [],
      unitLst: [],
      rows: [],
      serialnopopupwindow: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,
      taxcal: { igst: [], cgst: [], sgst: [] },
      isAllChecked: false,
      selectedProductDetails: [],
      selectedPendingOrder: [],
      purchasePendingOrderLst: [],
      selectedPendingChallan: [],

      //
      closingStocks: [],
      closingstocksTotal: {},
      openingStocks: [],
      openingStocksTotal: {},
      inwardStocks: [],
      inwardStocksTotal: {},
      outwardStocks: [],
      outwardStocksTotal: {},

      startDate: "",
      endDate: "",
      //

      openingstock: false,
      closingstock: true,
      inwardstock: false,
      outwardstock: false,
    };
    this.open = this.open.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (selected) => {
    this.setState({
      optionSelected: selected,
      closingstock: !this.state.closingstock,
    });
  };
  handleopeningstock = (selected) => {
    this.setState({
      openingstock: !this.state.openingstock,
    });
  };
  handleinwardstock = (selected) => {
    this.setState({
      inwardstock: !this.state.inwardstock,
    });
  };
  handleoutwardstock = (selected) => {
    this.setState({
      outwardstock: !this.state.outwardstock,
    });
  };
  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  getElementObject = (index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    return elementCheck ? elementCheck : "";
  };
  handelgroupsummeryModalShow = (status) => {
    this.setState({ groupsummeryModalShow: status });
  };
  //   lstAdditionalLedgers = () => {
  //     getAdditionalLedgers()
  //       .then((response) => {
  //         // console.log("response", response);
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           let data = res.list;
  //           if (data.length > 0) {
  //             let Opt = data.map(function (values) {
  //               return { value: values.id, label: values.name };
  //             });
  //             let fOpt = Opt.filter(
  //               (v) => v.label.trim().toLowerCase() != "round off"
  //             );
  //             // console.log({ fOpt });
  //             this.setState({ lstAdditionalLedger: fOpt });
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };
  //   lstDiscountLedgers = () => {
  //     getDiscountLedgers()
  //       .then((response) => {
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           let data = res.list;
  //           if (data.length > 0) {
  //             let Opt = data.map(function (values) {
  //               return { value: values.id, label: values.name };
  //             });
  //             this.setState({ lstDisLedger: Opt });
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };

  //   lstPurchaseAccounts = () => {
  //     getPurchaseAccounts()
  //       .then((response) => {
  //         // console.log("res", response);
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           let opt = res.list.map((v, i) => {
  //             return { label: v.name, value: v.id };
  //           });
  //           this.setState({ purchaseAccLst: opt });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };
  //   lstSundryCreditors = () => {
  //     getSundryCreditors()
  //       .then((response) => {
  //         // console.log("res", response);
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           let opt = res.list.map((v, i) => {
  //             return {
  //               label: v.name,
  //               value: v.id,
  //               code: v.ledger_code,
  //               state: v.state,
  //             };
  //           });
  //           let codeopt = res.list.map((v, i) => {
  //             return {
  //               label: v.ledger_code,
  //               value: v.id,
  //               name: v.name,
  //               state: v.state,
  //             };
  //           });
  //           this.setState({
  //             supplierNameLst: opt,
  //             supplierCodeLst: codeopt,
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };

  //   lstProduct = () => {
  //     getProduct()
  //       .then((response) => {
  //         // console.log('res', response);
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           let data = res.responseObject;
  //           let opt = data.map((v) => {
  //             let unitOpt = v.units.map((vi) => {
  //               return { label: vi.unitCode, value: vi.id };
  //             });
  //             return {
  //               label: v.productName,
  //               value: v.id,
  //               igst: v.igst,
  //               hsnId: v.hsnId,
  //               sgst: v.sgst,
  //               cgst: v.cgst,
  //               productCode: v.productCode,
  //               productName: v.productName,
  //               isNegativeStocks: v.isNegativeStocks,
  //               isSerialNumber: v.isSerialNumber,
  //               unitOpt: unitOpt,
  //             };
  //           });
  //           this.setState({ productLst: opt });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };

  /**
   * @description Initialize Product Row
   */
  initRow = (len = null) => {
    let lst = [];
    let condition = 10;
    if (len != null) {
      condition = len;
    }
    for (let index = 0; index < 10; index++) {
      let data = {
        productId: "",
        unitId: "",
        qtyH: "",
        qtyM: "",
        qtyL: "",
        rateH: "",
        rateM: "",
        rateL: "",
        base_amt_H: 0,
        base_amt_M: 0,
        base_amt_L: 0,
        base_amt: "",
        dis_amt: "",
        dis_per: "",
        dis_per_cal: "",
        dis_amt_cal: "",
        total_amt: "",
        gst: "",
        igst: "",
        cgst: "",
        sgst: "",
        total_igst: "",
        total_cgst: "",
        total_sgst: "",
        final_amt: "",
        serialNo: [],
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
        reference_id: "",
        reference_type: "",
      };
      lst.push(data);
    }
    this.setState({ rows: lst });
  };
  /**
   * @description Initialize Additional Charges
   */
  initAdditionalCharges = () => {
    // additionalCharges
    let lst = [];
    for (let index = 0; index < 5; index++) {
      let data = {
        ledgerId: "",
        amt: "",
      };
      lst.push(data);
    }
    this.setState({ additionalCharges: lst });
  };

  //   lstPOPendingOrder = (values) => {
  //     const { invoice_data } = this.state;
  //     let { supplierCodeId } = invoice_data;

  //     let reqData = new FormData();
  //     reqData.append(
  //       "supplier_code_id",
  //       supplierCodeId ? supplierCodeId.value : ""
  //     );
  //     getPOPendingOrderWithIds(reqData)
  //       .then((response) => {
  //         console.log("Pending Order Response", response);
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           this.setState({ purchasePendingOrderLst: res.data });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //         this.setState({ purchasePendingOrderLst: [] });
  //       });
  //   };

  handlePendingOrderSelection = (id, status) => {
    let { selectedPendingOrder } = this.state;
    if (status == true) {
      if (!selectedPendingOrder.includes(id)) {
        selectedPendingOrder = [...selectedPendingOrder, id];
      }
    } else {
      selectedPendingOrder = selectedPendingOrder.filter((v) => v != id);
    }
    this.setState({
      selectedPendingOrder: selectedPendingOrder,
    });
  };
  handlePendingOrderSelectionAll = (status) => {
    let { purchasePendingOrderLst } = this.state;

    let lstSelected = [];
    if (status == true) {
      lstSelected = purchasePendingOrderLst.map((v) => v.id);
      console.log("lst", lstSelected);
    }
    this.setState({
      isAllChecked: status,
      selectedPendingOrder: lstSelected,
    });
  };

  handlePendingOrder = () => {
    this.lstPOPendingOrder();
    let { purchasePendingOrderLst } = this.state;
    if (purchasePendingOrderLst.length > 0) {
      this.setState({ pendingordermodal: true });
    }
  };
  handlePendingOrderProduct = () => {
    this.setBillEditData();
    // let { selectedProductDetails } = this.state;
    // console.log({ selectedProductDetails });
    // this.setState({ pendingorderprdctsmodalshow: true });
  };

  //  this is for closing stock.. ----------------------------------------------------------------------------------------_

  //   lstClosingStock = () => {
  //     let dates = new FormData();
  //     dates.append("startDate", this.state.startDate);
  //     dates.append("endDate", this.state.endDate);

  //     getClosingStock(dates)
  //       .then((response) => {
  //         let res = response.data;
  //         if (res.responseStatus == 200) {
  //           this.setState({ closingstocksTotal: res.totalResult });
  //           let opt = res.response.map((v, i) => {
  //             return v;
  //           });
  //           this.setState({ closingStocks: opt });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };

  // ------------------------------------------------------------------------------------

  //   lstOpeningStock = () => {
  //     let dates = new FormData();
  //     dates.append("startDate", this.state.startDate);
  //     dates.append("endDate", this.state.endDate);

  //     getOpeningStock(dates)
  //       .then((response) => {
  //         let res = response.data;
  //         console.log("res", res);
  //         if (res.responseStatus == 200) {
  //           this.setState({ openingStocksTotal: res.totalResult });
  //           let opt = res.response.map((v, i) => {
  //             return v;
  //           });
  //           console.log("Opt  ::s ", opt);
  //           this.setState({ openingStocks: opt });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };
  //   lstInwardStock = () => {
  //     let dates = new FormData();
  //     dates.append("startDate", this.state.startDate);
  //     dates.append("endDate", this.state.endDate);

  //     getInwardStock(dates)
  //       .then((response) => {
  //         let res = response.data;
  //         console.log("res", res);
  //         if (res.responseStatus == 200) {
  //           this.setState({ inwardStocksTotal: res.totalResult });
  //           let opt = res.response.map((v, i) => {
  //             return v;
  //           });
  //           console.log("Opt  ::s ", opt);
  //           this.setState({ inwardStocks: opt });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };

  //   lstOutwardStock = () => {
  //     let dates = new FormData();
  //     dates.append("startDate", this.state.startDate);
  //     dates.append("endDate", this.state.endDate);

  //     getOutwardStock(dates)
  //       .then((response) => {
  //         let res = response.data;
  //         console.log("res", res);
  //         if (res.responseStatus == 200) {
  //           this.setState({ outwardStocksTotal: res.totalResult });
  //           let opt = res.response.map((v, i) => {
  //             return v;
  //           });
  //           console.log("Opt  ::s ", opt);
  //           this.setState({ outwardStocks: opt });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   };
  // _---------------------------------------------------------------------------------------------------------------------_

  // __________________________________________________________________________________________________________________________________
  getStockDataInventory() {
    this.lstOpeningStock();
    this.lstClosingStock();
    this.lstInwardStock();
    this.lstOutwardStock();
  }
  // __________________________________________________________________________________________________________________________________

  componentDidMount() {
    // console.log("props", this.props);
    // if (AuthenticationCheck()) {
    //   this.lstPurchaseAccounts();
    //   this.lstSundryCreditors();
    //   this.lstProduct();
    //   // this.lstUnit();
    //   this.initRow();
    //   this.initAdditionalCharges();
    //   this.lstDiscountLedgers();
    //   this.lstAdditionalLedgers();
    //   //
    //   this.lstClosingStock();
    //   this.lstOpeningStock();
    //   this.lstInwardStock();
    //   this.lstOutwardStock();
    //   //
    //   const { prop_data } = this.props.block;
    //   this.setState({ invoice_data: prop_data });
    // }
  }
  setBillEditData = () => {
    const { selectedPendingOrder } = this.state;
    console.log("selectedPendingOrder", selectedPendingOrder);
    let purchase_order_id = selectedPendingOrder.map((v) => {
      return { id: v };
    });
    let reqData = new FormData();
    reqData.append("purchase_order_id", JSON.stringify(purchase_order_id));
    //     getPOInvoiceWithIds(reqData)
    //       .then((response) => {
    //         console.log("POInvoice", response);
    //         let res = response.data;
    //         if (res.responseStatus == 200) {
    //           let rdata = res.data;
    //           let initRowData = [];
    //           const { productLst } = this.state;
    //           if (rdata.length > 0) {
    //             rdata.map((v) => {
    //               let productId = getSelectValue(productLst, v.product_id);
    //               let inner_data = {
    //                 details_id: v.details_id ? v.details_id : 0,
    //                 productId: productId,
    //                 unitId: "",
    //                 qtyH: v.qtyH > 0 ? v.qtyH : "",
    //                 qtyM: v.qtyM > 0 ? v.qtyM : "",
    //                 qtyL: v.qtyL > 0 ? v.qtyL : "",
    //                 rateH: v.rateH > 0 ? v.rateH : "",
    //                 rateM: v.rateM > 0 ? v.rateM : "",
    //                 rateL: v.rateL > 0 ? v.rateL : "",
    //                 base_amt_H: v.base_amt_H > 0 ? v.base_amt_H : "",
    //                 base_amt_M: v.base_amt_M > 0 ? v.base_amt_M : "",
    //                 base_amt_L: v.base_amt_L > 0 ? v.base_amt_L : "",
    //                 base_amt: v.base_amt > 0 ? v.base_amt : "",
    //                 dis_amt: v.dis_amt > 0 ? v.dis_amt : "",
    //                 dis_per: v.dis_per > 0 ? v.dis_per : "",
    //                 dis_per_cal: "",
    //                 dis_amt_cal: "",
    //                 total_amt: "",
    //                 gst: productId.igst,
    //                 igst: productId.igst,
    //                 cgst: productId.cgst,
    //                 sgst: productId.sgst,
    //                 total_igst: "",
    //                 total_cgst: "",
    //                 total_sgst: "",
    //                 final_amt: "",
    //                 serialNo: [],
    //                 discount_proportional_cal: 0,
    //                 additional_charges_proportional_cal: 0,
    //                 isDisabled: true,
    //                 reference_id: v.reference_id ? v.reference_id : null,
    //                 reference_type: v.reference_type ? v.reference_type : "",
    //               };
    //               initRowData.push(inner_data);
    //             });
    //           }

    //           this.setState(
    //             {
    //               rows: initRowData,
    //               isEditDataSet: true,
    //             },
    //             () => {
    //               this.handleAdditionalChargesSubmit();
    //             }
    //           );
    //         }
    //       })
    //       .catch((error) => {
    //         console.log("error", error);
    //       });
  };

  componentDidUpdate() {
    const {
      purchaseAccLst,
      supplierNameLst,
      productLst,
      lstAdditionalLedger,
      isEditDataSet,
      invoice_data,
      lstDisLedger,
      isAllChecked,
      selectedCounterSalesBills,
      selectedOrderToInvoice,
      selectedPendingOrder,
    } = this.state;

    if (
      purchaseAccLst.length > 0 &&
      supplierNameLst.length > 0 &&
      productLst.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      lstDisLedger.length > 0 &&
      isEditDataSet == false &&
      invoice_data != ""
    ) {
      this.setBillEditData();
    }
  }
  /**
   *
   * @param {*} product
   * @param {*} element
   * @description to return place holder according to product unit
   * @returns
   */
  handlePlaceHolder = (product, element) => {
    // console.log({ product, element });
    if (product != "") {
      if (element == "qtyH") {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == "rateH") {
        if (product.unitOpt.length > 0) {
          return product.unitOpt[0].label;
        }
      }
      if (element == "qtyM") {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == "rateM") {
        if (product.unitOpt.length > 1) {
          return product.unitOpt[1].label;
        }
      }
      if (element == "qtyL") {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
      if (element == "rateL") {
        if (product.unitOpt.length > 2) {
          return product.unitOpt[2].label;
        }
      }
    }
    return "";
  };

  /**
   *
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  handleChangeArrayElement = (element, value, index, setFieldValue) => {
    // console.log({ element, value, unittype });
    let { rows } = this.state;

    // checkelement[element] = value;
    /**
     * @description Calculate product level calculation
     */
    let frows = rows.map((v, i) => {
      if (i == index) {
        v[element] = value;
        index = i;
        if (element == "productId" && value != null && value != undefined) {
          v["igst"] = value.igst;
          v["gst"] = value.igst;
          v["cgst"] = value.cgst;
          v["sgst"] = value.sgst;
          if (value.isSerialNumber == true) {
            let serialnoarray = [];
            for (let index = 0; index < 100; index++) {
              serialnoarray.push({ no: "" });
            }
            v["serialNo"] = serialnoarray;
            this.setState({
              serialnopopupwindow: true,
              serialnoshowindex: i,
              serialnoarray: serialnoarray,
            });
          }
        }

        return v;
      } else {
        return v;
      }
    });
    this.setState({ rows: frows }, () => {
      this.handleAdditionalChargesSubmit();
    });
  };

  setElementValue = (element, index) => {
    let elementCheck = this.state.rows.find((v, i) => {
      return i == index;
    });
    // console.log("elementCheck", elementCheck);
    // console.log("element", element);
    return elementCheck ? elementCheck[element] : "";
  };

  // handleBottomDiscountChange = (value, type = "purchase_discount") => {
  //   if (type == "purchase_discount") {
  //     // console.log("values", this.myRef.current.values);
  //     this.myRef.current.setFieldValue("purchase_discount", value);
  //   } else {
  //     this.myRef.current.setFieldValue("purchase_discount_amt", value);
  //   }
  //   console.log("handlesubmitcall");
  //   this.handleAdditionalChargesSubmit();
  // };
  handleUnitLstOpt = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    // console.log("productId", productId);
    if (productId != undefined && productId) {
      return productId.unitOpt.length;
    }
  };
  handleSerialNoQty = (element, index) => {
    let { rows } = this.state;
    console.log("serial no", rows);
    console.log({ element, index });
    // this.setState({ serialnopopupwindow: true });
  };
  handleSerialNoValue = (index, value) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.map((v, i) => {
      if (i == index) {
        v["no"] = value;
      }
      return v;
    });

    this.setState({ serialnoarray: fn });
  };
  valueSerialNo = (index) => {
    let { serialnoarray } = this.state;
    let fn = serialnoarray.find((v, i) => i == index);
    return fn ? fn.no : "";
  };
  renderSerialNo = () => {
    let { rows, serialnoshowindex, serialnoarray, capitalacdetails } =
      this.state;
    // console.log({ rows, serialnoshowindex });
    if (serialnoshowindex != -1) {
      let rdata = rows.find((v, i) => i == serialnoshowindex);

      return serialnoarray.map((vi, ii) => {
        return (
          <tr>
            <td>{ii + 1}</td>
            <td>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    // console.log(e.target.value);
                    this.handleSerialNoValue(ii, e.target.value);
                  }}
                  value={this.valueSerialNo(ii)}
                />
              </Form.Group>
            </td>
          </tr>
        );
      });
    }
  };
  handleSerialNoSubmit = () => {
    let { rows, serialnoshowindex, serialnoarray } = this.state;

    if (serialnoshowindex != -1) {
      let rdata = rows.map((v, i) => {
        if (i == serialnoshowindex) {
          let no = serialnoarray.filter((vi, ii) => {
            if (vi.no != "") {
              return vi.no;
            }
          });
          v["serialNo"] = no;
          v["qtyH"] = no.length;
        }
        return v;
      });
      this.setState({
        rows: rdata,
        serialnoshowindex: -1,
        serialnoarray: [],
        serialnopopupwindow: false,
      });
    }
  };
  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;
      }
      return v;
    });
    let totalamt = 0;
    fa.map((v) => {
      if (v.amt != "") {
        totalamt += parseFloat(v.amt);
      }
    });
    this.setState({ additionalCharges: fa, additionalChargesTotal: totalamt });
  };
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleClearProduct = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      details_id: 0,
      productId: "",
      unitId: "",
      qtyH: "",
      qtyM: "",
      qtyL: "",
      rateH: "",
      rateM: "",
      rateL: "",
      base_amt_H: 0,
      base_amt_M: 0,
      base_amt_L: 0,
      base_amt: "",
      dis_amt: "",
      dis_per: "",
      dis_per_cal: "",
      dis_amt_cal: "",
      total_amt: "",
      gst: "",
      igst: "",
      cgst: "",
      sgst: "",
      total_igst: "",
      total_cgst: "",
      total_sgst: "",
      final_amt: "",
      serialNo: [],
      discount_proportional_cal: 0,
      additional_charges_proportional_cal: 0,
    };
    frows[index] = data;
    this.setState({ rows: frows }, () => {
      this.handleAdditionalChargesSubmit();
    });
  };

  /**
   * @description Calculate the formula discount + Additional charges
   */
  handleAdditionalChargesSubmit = (discamtval = -1, type = "") => {
    const { rows, additionalChargesTotal } = this.state;
    if (discamtval == "") {
      discamtval = 0;
    }
    if (type != "" && discamtval >= 0) {
      if (type == "purchase_discount") {
        this.myRef.current.setFieldValue(
          "purchase_discount",
          discamtval != "" ? discamtval : 0
        );
      } else {
        this.myRef.current.setFieldValue(
          "purchase_discount_amt",
          discamtval != "" ? discamtval : 0
        );
      }
    }
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      if (v["productId"] != "") {
        if (v["qtyH"] != "" && v["rateH"] != "") {
          v["base_amt_H"] = parseInt(v["qtyH"]) * parseFloat(v["rateH"]);
        }
        if (v["qtyM"] != "" && v["rateM"] != "") {
          v["base_amt_M"] = parseInt(v["qtyM"]) * parseFloat(v["rateM"]);
        }
        if (v["qtyL"] != "" && v["rateL"] != "") {
          v["base_amt_L"] = parseInt(v["qtyL"]) * parseFloat(v["rateL"]);
        }

        v["base_amt"] = v["base_amt_H"] + v["base_amt_M"] + v["base_amt_L"];
        v["total_amt"] = parseFloat(v["base_amt"]);
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          // console.log("v['dis_amt']", v["dis_amt"]);
          v["total_amt"] =
            parseFloat(v["total_amt"]) - parseFloat(v["dis_amt"]);
          v["dis_amt_cal"] = v["dis_amt"];
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          // console.log("v['dis_per']", v["dis_per"]);
          let per_amt = calculatePercentage(v["total_amt"], v["dis_per"]);
          v["dis_per_cal"] = per_amt;
          v["total_amt"] = v["total_amt"] - per_amt;
        }

        totalamt = parseFloat(totalamt) + parseFloat(v["total_amt"]);
      }
      // console.log("vvvvvv============------------>", { v });
      return v;
    });

    // console.log({ row_disc });
    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *
     */
    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (type != "" && discamtval >= 0) {
          if (type == "purchase_discount") {
            // console.log("values", this.myRef.current.values);
            // this.myRef.current.setFieldValue("purchase_discount", discamtval);

            let peramt = calculatePercentage(
              totalamt,
              parseFloat(discamtval),
              v["total_amt"]
            );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              peramt,
              v["total_amt"]
            );

            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(totalamt, peramt, v["total_amt"]);
          } else {
            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                v["total_amt"]
              );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              parseFloat(discamtval),
              v["total_amt"]
            );
          }
        } else {
          if (
            this.myRef.current.values.purchase_discount > 0 &&
            this.myRef.current.values.purchase_discount != ""
          ) {
            let peramt = calculatePercentage(
              totalamt,
              this.myRef.current.values.purchase_discount,
              v["total_amt"]
            );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              peramt,
              v["total_amt"]
            );

            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(totalamt, peramt, v["total_amt"]);
          }
          if (
            this.myRef.current.values.purchase_discount_amt > 0 &&
            this.myRef.current.values.purchase_discount_amt != ""
          ) {
            v["total_amt"] =
              v["total_amt"] -
              calculatePrValue(
                totalamt,
                this.myRef.current.values.purchase_discount_amt,
                v["total_amt"]
              );
            v["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
              v["total_amt"]
            );
          }
        }
        ntotalamt = parseFloat(ntotalamt) + parseFloat(v["total_amt"]);
      }
      return v;
    });
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      if (v["productId"] != "") {
        v["total_amt"] = parseFloat(
          v["total_amt"] +
            calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
        v["additional_charges_proportional_cal"] = calculatePrValue(
          ntotalamt,
          additionalChargesTotal,
          v["total_amt"]
        );
      }
      return v;
    });

    let famt = 0;
    let totalbaseamt = 0;
    let totaltaxableamt = 0;
    let totaltaxamt = 0;
    let totalcgstamt = 0;
    let totalsgstamt = 0;
    let totaligstamt = 0;
    let total_discount_proportional_amt = 0;
    let total_additional_charges_proportional_amt = 0;
    let total_purchase_discount_amt = 0;

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    let totalqtyH = 0;
    let totalqtyM = 0;
    let totalqtyL = 0;
    let totalqty = 0;
    /**
     * GST Calculation
     * **/
    let frow = addCharges.map((v, i) => {
      if (v["productId"] != "") {
        v["total_igst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["igst"])
        ).toFixed(2);
        v["total_cgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["cgst"])
        ).toFixed(2);
        v["total_sgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["sgst"])
        ).toFixed(2);

        v["final_amt"] = parseFloat(
          parseFloat(v["total_amt"]) + parseFloat(v["total_igst"])
        ).toFixed(2);
        totalqtyH += parseInt(v["qtyH"] != "" ? v["qtyH"] : 0);
        totalqtyM += parseInt(v["qtyM"] != "" ? v["qtyM"] : 0);
        totalqtyL += parseInt(v["qtyL"] != "" ? v["qtyL"] : 0);
        totaligstamt += parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt += parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt += parseFloat(v["total_sgst"]).toFixed(2);
        total_purchase_discount_amt =
          parseFloat(total_purchase_discount_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v["additional_charges_proportional_cal"]);
        // additional_charges_proportional_cal
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v["final_amt"])
        ).toFixed(2);

        // parseFloat(v["dis_per_cal"] != "" ? v["dis_per_cal"] : 0) -
        // parseFloat(v["dis_amt_cal"] != "" ? v["dis_amt_cal"] : 0)
        let baseamt = parseFloat(v["base_amt"]);
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          baseamt = baseamt - parseFloat(v["dis_amt_cal"]);
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          baseamt = baseamt - parseFloat(v["dis_per_cal"]);
        }
        // ((isNaN(parseFloat(v["dis_per_cal"]))
        //   ? 0
        //   : parseFloat(v["dis_per_cal"])) -
        //   (isNaN(parseFloat(v["dis_amt_cal"]))
        //     ? 0
        //     : parseFloat(v["dis_amt_cal"])));
        // console.log("baseamt", baseamt);
        totalbaseamt = parseFloat(parseFloat(totalbaseamt) + baseamt).toFixed(
          2
        );

        totaltaxableamt = parseFloat(
          parseFloat(totaltaxableamt) + parseFloat(v["total_amt"])
        ).toFixed(2);
        totaltaxamt = parseFloat(
          parseFloat(totaltaxamt) + parseFloat(v["total_igst"])
        ).toFixed(2);

        // ! Tax Indidual gst % calculation
        if (v.productId != "") {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
                  }
                  return vi;
                });
                taxIgst = [...innerIgstCal];
              } else {
                let innerIgstCal = {
                  gst: v.productId.igst,
                  amt: parseFloat(v.total_igst),
                };
                taxIgst = [...taxIgst, innerIgstCal];
              }
            } else {
              let innerIgstCal = {
                gst: v.productId.igst,
                amt: parseFloat(v.total_igst),
              };
              taxIgst = [...taxIgst, innerIgstCal];
            }
          }
          if (v.productId.cgst > 0) {
            if (taxCgst.length > 0) {
              let innerCgstTax = taxCgst.find(
                (vi) => vi.gst == v.productId.cgst
              );
              // console.log("innerTax", innerTax);
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxCgst.filter((vi) => {
                  if (vi.gst == v.productId.cgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
                  }
                  return vi;
                });
                taxCgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.cgst,
                  amt: parseFloat(v.total_cgst),
                };
                taxCgst = [...taxCgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.cgst,
                amt: parseFloat(v.total_cgst),
              };
              taxCgst = [...taxCgst, innerCgstCal];
            }
          }
          if (v.productId.sgst > 0) {
            if (taxSgst.length > 0) {
              let innerCgstTax = taxSgst.find(
                (vi) => vi.gst == v.productId.sgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxSgst.filter((vi) => {
                  if (vi.gst == v.productId.sgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
                  }
                  return vi;
                });
                taxSgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.sgst,
                  amt: parseFloat(v.total_sgst),
                };
                taxSgst = [...taxSgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.sgst,
                amt: parseFloat(v.total_sgst),
              };
              taxSgst = [...taxSgst, innerCgstCal];
            }
          }
        }
      }
      return v;
    });
    let roundoffamt = Math.round(famt);

    let roffamt = parseFloat(roundoffamt - famt).toFixed(2);

    this.myRef.current.setFieldValue("totalqtyH", totalqtyH);
    this.myRef.current.setFieldValue("totalqtyM", totalqtyM);
    this.myRef.current.setFieldValue("totalqtyL", totalqtyL);

    // this.myRef.current.setFieldValue("totalqty", totalqty);
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      parseFloat(total_purchase_discount_amt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );

    this.myRef.current.setFieldValue("roundoff", roffamt);
    this.myRef.current.setFieldValue(
      "total_base_amt",
      parseFloat(totalbaseamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(totaltaxableamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "totalcgst",
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalsgst",
      parseFloat(totalsgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totaligst",
      parseFloat(totaligstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      parseFloat(roundoffamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
  };
  handleRoundOffchange = (v) => {
    // console.log("roundoff", v);
    const { rows, additionalChargesTotal } = this.state;
    let totalamt = 0;
    /**
     * @description calculate indivisual row discount and total amt
     */
    let row_disc = rows.map((v) => {
      // console.log("v", v.final_amt);
      if (v["productId"] != "") {
        if (v["qtyH"] != "" && v["rateH"] != "") {
          v["base_amt_H"] = parseInt(v["qtyH"]) * parseFloat(v["rateH"]);
        }
        if (v["qtyM"] != "" && v["rateM"] != "") {
          v["base_amt_M"] = parseInt(v["qtyM"]) * parseFloat(v["rateM"]);
        }
        if (v["qtyL"] != "" && v["rateL"] != "") {
          v["base_amt_L"] = parseInt(v["qtyL"]) * parseFloat(v["rateL"]);
        }

        v["base_amt"] = v["base_amt_H"] + v["base_amt_M"] + v["base_amt_L"];
        v["total_amt"] = v["base_amt"];
        if (v["dis_amt"] != "" && v["dis_amt"] > 0) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) - parseFloat(v["dis_amt"]);
          v["dis_amt_cal"] = v["dis_amt"];
        }
        if (v["dis_per"] != "" && v["dis_per"] > 0) {
          let per_amt = calculatePercentage(v["total_amt"], v["dis_per"]);
          v["dis_per_cal"] = per_amt;
          v["total_amt"] = v["total_amt"] - per_amt;
        }
        totalamt += parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *
     */

    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (
          this.myRef.current.values.purchase_discount > 0 &&
          this.myRef.current.values.purchase_discount != ""
        ) {
          let peramt = calculatePercentage(
            totalamt,
            this.myRef.current.values.purchase_discount,
            v["total_amt"]
          );
          v["discount_proportional_cal"] = calculatePrValue(
            totalamt,
            peramt,
            v["total_amt"]
          );

          v["total_amt"] =
            v["total_amt"] - calculatePrValue(totalamt, peramt, v["total_amt"]);
        }
        if (
          this.myRef.current.values.purchase_discount_amt > 0 &&
          this.myRef.current.values.purchase_discount_amt != ""
        ) {
          v["total_amt"] =
            parseFloat(v["total_amt"]) -
            calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
              v["total_amt"]
            );
          v["discount_proportional_cal"] = parseFloat(
            calculatePrValue(
              totalamt,
              this.myRef.current.values.purchase_discount_amt,
              v["total_amt"]
            )
          ).toFixed(2);
        }

        ntotalamt += parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("ntotalamt", ntotalamt);
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      if (v["productId"] != "") {
        v["total_amt"] = parseFloat(
          v["total_amt"] +
            calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
        v["additional_charges_proportional_cal"] = parseFloat(
          calculatePrValue(ntotalamt, additionalChargesTotal, v["total_amt"])
        ).toFixed(2);
      }
      return v;
    });

    let famt = 0;
    let totalbaseamt = 0;

    let totaltaxableamt = 0;
    let totaltaxamt = 0;
    let totalcgstamt = 0;
    let totalsgstamt = 0;
    let totaligstamt = 0;
    let total_discount_proportional_amt = 0;
    let total_additional_charges_proportional_amt = 0;
    let total_purchase_discount_amt = 0;

    let taxIgst = [];
    let taxCgst = [];
    let taxSgst = [];
    /**
     * GST Calculation
     * **/
    let frow = addCharges.map((v, i) => {
      if (v["productId"] != "") {
        v["total_igst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["igst"])
        ).toFixed(2);
        v["total_cgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["cgst"])
        ).toFixed(2);
        v["total_sgst"] = parseFloat(
          calculatePercentage(v["total_amt"], v["productId"]["sgst"])
        ).toFixed(2);

        v["final_amt"] = parseFloat(
          parseFloat(v["total_amt"]) + parseFloat(v["total_igst"])
        ).toFixed(2);
        totaligstamt =
          parseFloat(totaligstamt) + parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt =
          parseFloat(totalcgstamt) + parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt =
          parseFloat(totalsgstamt) + parseFloat(v["total_sgst"]).toFixed(2);
        // console.log("final_amt", v["final_amt"]);
        famt = parseFloat(
          parseFloat(famt) + parseFloat(v["final_amt"])
        ).toFixed(2);
        // totalbaseamt =
        //   parseFloat(totalbaseamt) + parseFloat(v["base_amt"]).toFixed(2);

        totalbaseamt = parseFloat(
          parseFloat(totalbaseamt) +
            (parseFloat(v["base_amt"]) -
              parseFloat(v["dis_per_cal"] != "" ? v["dis_per_cal"] : 0) -
              parseFloat(v["dis_amt_cal"] != "" ? v["dis_amt_cal"] : 0))
        ).toFixed(2);
        totaltaxableamt =
          parseFloat(totaltaxableamt) + parseFloat(v["total_amt"]).toFixed(2);
        totaltaxamt =
          parseFloat(totaltaxamt) + parseFloat(v["total_igst"]).toFixed(2);
        total_purchase_discount_amt =
          parseFloat(total_purchase_discount_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(v["discount_proportional_cal"]);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(v["additional_charges_proportional_cal"]);
        // ! Tax Indidual gst % calculation
        if (v.productId != "") {
          if (v.productId.igst > 0) {
            if (taxIgst.length > 0) {
              let innerIgstTax = taxIgst.find(
                (vi) => vi.gst == v.productId.igst
              );
              if (innerIgstTax != undefined) {
                let innerIgstCal = taxIgst.filter((vi) => {
                  if (vi.gst == v.productId.igst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
                  }
                  return vi;
                });
                taxIgst = [...innerIgstCal];
              } else {
                let innerIgstCal = {
                  gst: v.productId.igst,
                  amt: parseFloat(v.total_igst),
                };
                taxIgst = [...taxIgst, innerIgstCal];
              }
            } else {
              let innerIgstCal = {
                gst: v.productId.igst,
                amt: parseFloat(v.total_igst),
              };
              taxIgst = [...taxIgst, innerIgstCal];
            }
          }
          if (v.productId.cgst > 0) {
            if (taxCgst.length > 0) {
              let innerCgstTax = taxCgst.find(
                (vi) => vi.gst == v.productId.cgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxCgst.filter((vi) => {
                  if (vi.gst == v.productId.cgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
                  }
                  return vi;
                });
                taxCgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.cgst,
                  amt: parseFloat(v.total_cgst),
                };
                taxCgst = [...taxCgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.cgst,
                amt: parseFloat(v.total_cgst),
              };
              taxCgst = [...taxCgst, innerCgstCal];
            }
          }
          if (v.productId.sgst > 0) {
            if (taxSgst.length > 0) {
              let innerCgstTax = taxSgst.find(
                (vi) => vi.gst == v.productId.sgst
              );
              if (innerCgstTax != undefined) {
                let innerCgstCal = taxSgst.filter((vi) => {
                  if (vi.gst == v.productId.sgst) {
                    vi["amt"] =
                      parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
                  }
                  return vi;
                });
                taxSgst = [...innerCgstCal];
              } else {
                let innerCgstCal = {
                  gst: v.productId.sgst,
                  amt: parseFloat(v.total_sgst),
                };
                taxSgst = [...taxSgst, innerCgstCal];
              }
            } else {
              let innerCgstCal = {
                gst: v.productId.sgst,
                amt: parseFloat(v.total_sgst),
              };
              taxSgst = [...taxSgst, innerCgstCal];
            }
          }
        }
      }
      return v;
    });
    let roundoffamt = Math.round(famt);
    this.myRef.current.setFieldValue(
      "total_discount_proportional_amt",
      parseFloat(total_discount_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_additional_charges_proportional_amt",
      parseFloat(total_additional_charges_proportional_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      parseFloat(total_purchase_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue("roundoff", v);
    // let roffamt = parseFloat(roundoffamt - famt).toFixed(2);
    // this.myRef.current.setFieldValue("roundoff", roundoffamt);
    this.myRef.current.setFieldValue(
      "total_base_amt",
      parseFloat(totalbaseamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(totaltaxableamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totaligst",
      parseFloat(totaligstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalcgst",
      parseFloat(totalcgstamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalsgst",
      parseFloat(totalsgstamt).toFixed(2)
    );

    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(totaltaxamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
    this.myRef.current.setFieldValue("totalamt", parseFloat(famt).toFixed(2));
    this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
  };
  handeladjusmentbillmodal = (status) => {
    this.setState({ adjusmentbillmodal: status });
  };
  render() {
    //return <div>h</div>;
    // const {
    //   invoice_data,
    //   invoiceedit,
    //   createproductmodal,
    //   //selectoption,
    //   adjusmentbillmodal,
    //   billadjusmentmodalshow,
    //   groupsummeryModalShow,
    //   capitalacdetailsView,
    //   bankledgershow,
    //   bankchequeshow,
    //   purchaseAccLst,
    //   supplierNameLst,
    //   supplierCodeLst,
    //   rows,
    //   showDiv,
    //   amtledgershow,
    //   onaccountmodal,
    //   productLst,
    //   serialnopopupwindow,
    //   pendingordermodal,
    //   pendingorderprdctsmodalshow,
    //   additionchargesyes,
    //   lstDisLedger,
    //   additionalCharges,
    //   lstAdditionalLedger,
    //   additionalChargesTotal,
    //   taxcal,
    //   undervalue,
    //   purchasePendingOrderLst,
    //   isAllChecked,
    //   selectedPendingOrder,
    //   //
    //   closingStocks,
    //   closingstocksTotal,
    //   openingStocks,
    //   openingStocksTotal,
    //   inwardStocks,
    //   inwardStocksTotal,
    //   outwardStocks,
    //   outwardStocksTotal,
    //   //
    // } = this.state;
    // // let initVal = {
    // //   selectoption1: 'false',
    // // };
    // const content = this.state.checked ? <div> Content </div> : null;
    // const Option = (props) => {
    //   return (
    //     <div>
    //       <components.Option {...props}>
    //         <input
    //           type="checkbox"
    //           checked={props.isSelected}
    //           //onChange={() => null}
    //           onChange={(e) => {
    //             console.log("e", e.target.value);
    //             setFieldValue("selectoption1", e);
    //           }}
    //         />
    //         <label>{props.label}</label>
    //       </components.Option>
    //     </div>
    //   );
    return (
      <Container fluid>
        <div className="">
          <div className="wrapper_div m-0" style={{ height: "700px" }}>
            <Form className="supplie-det bsheet">
              <Row>
                <Col md="3"></Col>
                <Col md="6">
                  <div className="p-2 main_hd_center">
                    <h6>Samarth Mobile Shopee</h6>
                  </div>
                </Col>
                <Col md="3">
                  {/* <div className="bs_date">
                  <h2>Period : As at 30th June 2021</h2>
                </div> */}
                </Col>
              </Row>
            </Form>
            <div className="inventory_stk">
              <Formik initialValues={{ selectoption1: "" }}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
                  setFieldValue,
                }) => (
                  <>
                    <div className="purchasescreen pb-5">
                      <Row className="p-3">
                        <Col md="5">
                          <InputGroup className="mb-3 ">
                            <MyDatePicker
                              placeholderText="DD-MM-YYYY"
                              id="startDate"
                              dateFormat="dd-MM-yyyy"
                              // placeholderText="START DATE"
                              onChange={(date) => {
                                setFieldValue("startDate", date);
                                this.state.startDate =
                                  moment(date).format("YYYY-MM-DD");
                                if (
                                  this.state.startDate != "" &&
                                  this.state.endDate != ""
                                ) {
                                  this.getStockDataInventory();
                                }
                              }}
                              selected={values.startDate}
                              maxDate={new Date()}
                              className="newdate text_center mt-1"
                            />
                            <InputGroup.Text
                              id="basic-addon2"
                              className=" mt-1"
                            >
                              <i
                                className="fa fa-arrow-right"
                                aria-hidden="true"
                              ></i>
                            </InputGroup.Text>
                            <MyDatePicker
                              placeholderText="DD-MM-YYYY"
                              id="endDate"
                              dateFormat="dd-MM-yyyy"
                              // placeholderText="END DATE"
                              onChange={(date) => {
                                setFieldValue("endDate", date);
                                this.state.endDate =
                                  moment(date).format("YYYY-MM-DD");
                                if (
                                  this.state.startDate != "" &&
                                  this.state.endDate != ""
                                ) {
                                  this.getStockDataInventory();
                                }
                              }}
                              selected={values.endDate}
                              maxDate={new Date()}
                              className="newdate text_center mt-1"
                            />
                          </InputGroup>
                        </Col>

                        <Col md="1">
                          <Form.Group className="mb-3 createnew "></Form.Group>
                        </Col>
                        <Col md="6">
                          <Form.Group>
                            <Accordion
                              className="is_multi"
                              style={{ marginRight: "30px" }}
                            >
                              <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                  <b>Select Option</b>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="formBasicCheckbox"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      label="Closing Stock"
                                      id="closingstock"
                                      name="closingstock"
                                      checked={this.state.closingstock}
                                      onChange={this.handleChange}
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      label="Opening Stock"
                                      id="openingstock"
                                      name="openingstock"
                                      checked={this.state.openingstock}
                                      onChange={this.handleopeningstock}
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      label="Inward Stock"
                                      id="inwardgstock"
                                      name="inwardgstock"
                                      checked={this.state.inwardstock}
                                      onChange={this.handleinwardstock}
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      label="Outward Stock"
                                      id="outwardstock"
                                      name="outwardstock"
                                      checked={this.state.outwardstock}
                                      onChange={this.handleoutwardstock}
                                    />
                                  </Form.Group>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <div className="table_wrapper">
                      <Table bordered responsive className="ss_maintable">
                        <thead>
                          <tr>
                            <>
                              <th
                                style={{
                                  width: "20%",
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                }}
                                className="text_center"
                                rowSpan={2}
                              >
                                Particulars
                              </th>
                            </>
                            {/* Opening Stock */}
                            {/* {this.state.openingstock ? ( */}
                            <th colSpan={3} className="text_center">
                              Opening Stock
                            </th>
                            {/* ) : null} */}
                            {/* Opening Stock end */}
                            {/* Inwards start */}
                            {/* {this.state.inwardstock ? ( */}
                            <th colSpan={3} className="text_center">
                              Inwards
                            </th>
                            {/* ) : null} */}
                            {/* Inwards end */}
                            {/* Outwards start */}
                            {/* {this.state.outwardstock ? ( */}
                            <th colSpan={3} className="text_center">
                              Outwards
                            </th>
                            {/* ) : null} */}
                            {/* Outwards end */}
                            {/* Closing Stock  start*/}
                            {/* {this.state.closingstock ? ( */}
                            <th colSpan={3} className="text_center">
                              Closing Stock
                            </th>
                            {/* ) : null} */}
                            {/* Closing Stock  end*/}
                          </tr>

                          <tr>
                            {/* opening stock start */}
                            {/* {this.state.openingstock ? ( */}
                            <>
                              <th className="headTh StockQuantity">Quantity</th>
                              <th className="headTh StockRate">Rate </th>
                              <th className="headTh StockValue">Value</th>
                            </>
                            {/* ) : null} */}
                            {/* opening stock end */}
                            {/* inwards stack start */}
                            {/* {this.state.inwardstock ? ( */}
                            <>
                              <th className="headTh  StockQuantity">
                                Quantity
                              </th>
                              <th className="headTh  StockRate">Rate </th>
                              <th className="headTh  StockValue">Value </th>
                            </>
                            {/* ) : null} */}
                            {/* inwards stack end */}
                            {/* outwards stock start */}
                            {/* {this.state.outwardstock ? ( */}
                            <>
                              <th className="headTh  StockQuantity">
                                Quantity
                              </th>
                              <th className="headTh  StockRate">Rate </th>
                              <th className="headTh  StockValue">Value </th>
                            </>
                            {/* ) : null} */}
                            {/* outwards stock end */}
                            {/* Closeing Stock start */}
                            {/* {this.state.closingstock ? ( */}
                            <>
                              <th className="headTh  StockQuantity">
                                Quantity
                              </th>
                              <th className="headTh StockRate">Rate </th>
                              <th className="headTh  StockValue">Value </th>
                            </>
                            {/* ) : null} */}
                            {/* Closeing Stock end */}
                          </tr>
                        </thead>

                        <tbody>
                          {/* {closingStocks.length > 0
                            ? closingStocks.map((v, i) => {
                                return ( */}
                          <tr>
                            <td>perticular</td>
                            {/* openingstock start */}
                            {/* {this.state.openingstock ? ( */}
                            <>
                              <td className="inventoryCell">
                                {/* {openingStocks.length > 0
                                  ? openingStocks[i].quantity
                                  : "0 PCS"} */}
                              </td>
                              <td className="inventoryCell">
                                {/* {openingStocks.length > 0
                                  ? openingStocks[i].rate
                                  : 0} */}
                              </td>
                              <td className="inventoryCell">
                                {/* {openingStocks.length > 0
                                  ? openingStocks[i].value
                                  : 0} */}
                              </td>
                            </>
                            {/* ) : null} */}
                            {/* openingstock end */}
                            {/* inword Stock  start */}
                            {/* {this.state.inwardstock ? ( */}
                            <>
                              <td className="inventoryCell">
                                {/* {inwardStocks[i].quantity} */}
                              </td>
                              <td className="inventoryCell">
                                {/* {inwardStocks[i].rate} */}
                              </td>
                              <td className="inventoryCell">
                                {/* {inwardStocks[i].value} */}
                              </td>
                            </>
                            {/* ) : null} */}
                            {/* inword Stock  end */}
                            {/* outword Stock  start */}
                            {/* {this.state.outwardstock ? ( */}
                            <>
                              <td className="inventoryCell">
                                {/* {outwardStocks[i].quantity} */}
                              </td>
                              <td className="inventoryCell">
                                {/* {outwardStocks[i].rate} */}
                              </td>
                              <td className="inventoryCell">
                                {/* {outwardStocks[i].value} */}
                              </td>
                            </>
                            {/* ) : null} */}
                            {/* outword Stock  end */}
                            {/* closing Stock  start */}
                            {/* {this.state.closingstock ? ( */}
                            <>
                              <td className="inventoryCell">quantity</td>
                              <td className="inventoryCell">rate</td>
                              <td className="inventoryCell">value</td>
                            </>
                            {/* ) : null} */}
                            {/* closing Stock  end */}
                          </tr>
                          {/* ); }) : null} */}
                        </tbody>
                      </Table>
                    </div>
                  </>
                )}
              </Formik>
            </div>
          </div>

          <Modal
            // show={invoiceedit}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ invoiceedit: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Purchase Invoice
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="institute-head purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  //initialValues={invoice_data}
                  validationSchema={Yup.object().shape({
                    purchase_sr_no: Yup.string()
                      .trim()
                      .required("Purchase no is required"),
                    transaction_dt: Yup.string().required(
                      "Transaction date is required"
                    ),
                    purchaseId: Yup.object().required(
                      "select purchase account"
                    ),
                    invoice_no: Yup.string()
                      .trim()
                      .required("invoice no is required"),
                    invoice_dt: Yup.string().required("invoice dt is required"),
                    supplierCodeId: Yup.object().required(
                      "select supplier code"
                    ),
                    supplierNameId: Yup.object().required(
                      "select supplier name"
                    ),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    this.setState({ invoice_data: values, invoiceedit: false });
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
                    <Form onSubmit={handleSubmit} noValidate>
                      <Row>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>
                              Purchase Sr. #.
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder=" "
                              name="purchase_sr_no"
                              id="purchase_sr_no"
                              onChange={handleChange}
                              value={values.purchase_sr_no}
                              isValid={
                                touched.purchase_sr_no && !errors.purchase_sr_no
                              }
                              isInvalid={!!errors.purchase_sr_no}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.purchase_sr_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Transaction Date
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="transaction_dt"
                              id="transaction_dt"
                              onChange={handleChange}
                              value={values.transaction_dt}
                              isValid={
                                touched.transaction_dt && !errors.transaction_dt
                              }
                              isInvalid={!!errors.transaction_dt}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.transaction_dt}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Purchase Acc.
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Select
                              className="selectTo"
                              styles={customStyles1}
                              isClearable
                              // options={purchaseAccLst}
                              borderRadius="0px"
                              colors="#729"
                              name="purchaseId"
                              onChange={(v) => {
                                setFieldValue("purchaseId", v);
                              }}
                              value={values.purchaseId}
                            />

                            <span className="text-danger">
                              {errors.purchaseId}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col md="2">
                          <Form.Group>
                            <Form.Label>
                              Invoice No.
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Invoice No."
                              name="invoice_no"
                              id="invoice_no"
                              onChange={handleChange}
                              value={values.invoice_no}
                              isValid={touched.invoice_no && !errors.invoice_no}
                              isInvalid={!!errors.invoice_no}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.invoice_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Invoice Date
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>

                            <MyDatePicker
                              name="invoice_dt"
                              id="invoice_dt"
                              className="newdate"
                              dateFormat="dd/MM/yyyy"
                              onChange={(date) => {
                                setFieldValue("invoice_dt", date);
                              }}
                              selected={values.invoice_dt}
                            />

                            <span className="text-danger errormsg">
                              {errors.invoice_dt}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Supplier Code
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>

                            <Select
                              className="selectTo"
                              styles={customStyles1}
                              isClearable
                              //   options={supplierCodeLst}
                              borderRadius="0px"
                              colors="#729"
                              name="supplierCodeId"
                              onChange={(v) => {
                                setFieldValue("supplierCodeId", v);
                                setFieldValue(
                                  "supplierNameId"
                                  //   getSelectValue(supplierNameLst, v.value)
                                );
                              }}
                              value={values.supplierCodeId}
                            />

                            <span className="text-danger">
                              {errors.supplierCodeId}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group className="createnew">
                            <Form.Label>
                              Supplier Name
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Select
                              className="selectTo"
                              styles={customStyles1}
                              isClearable
                              //options={supplierNameLst}
                              borderRadius="0px"
                              colors="#729"
                              name="supplierNameId"
                              onChange={(v) => {
                                setFieldValue(
                                  "supplierCodeId"
                                  //getSelectValue(supplierCodeLst, v.value)
                                );
                                setFieldValue("supplierNameId", v);
                              }}
                              value={values.supplierNameId}
                            />

                            <span className="text-danger">supplierNameId</span>
                          </Form.Group>
                        </Col>

                        <Col md="2">
                          <div>
                            <Form.Label style={{ color: "#fff" }}>
                              blank
                              <br />
                            </Form.Label>
                          </div>

                          <Button className="createbtn" type="submit">
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </div>
            </Modal.Body>
          </Modal>

          {/* serial no start */}
          <Modal
            //show={serialnopopupwindow}
            size="sm"
            className="mt-5"
            onHide={() => this.setState({ serialnopopupwindow: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Serial No.
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <div className="institute-head purchasescreen">
                <Form className="serailnoscreoolbar">
                  <Table className="serialnotbl">
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Serial No.</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderSerialNo()}</tbody>
                  </Table>
                </Form>
              </div>
            </Modal.Body>

            <Modal.Footer className="p-1">
              <Button
                className="createbtn seriailnobtn"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleSerialNoSubmit();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
          {/* group summery modal start */}
          <Modal
            fullscreen
            //show={groupsummeryModalShow}
            size="xl"
            className="mainmodal"
            onHide={() => this.setState({ handelgroupsummeryModalShow: false })}
            // dialogClassName="modal-90w"
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              //closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Group Summery
              </Modal.Title>
              <CloseButton
                variant="white"
                className="pull-right"
                //  onClick={this.handleClose}
                onClick={() => this.handelgroupsummeryModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="group_summery_head">
                <Row style={{ background: "#eee", padding: "4px" }}>
                  <Col md="8">
                    <div className="group_s_p">
                      <b>Particaulars</b>
                    </div>
                  </Col>
                  <Col md="2">
                    <div className="group_s_p" style={{ textAlign: "right" }}>
                      <b>Debit</b>
                    </div>
                  </Col>
                  <Col md="2">
                    <div className="group_s_p" style={{ textAlign: "right" }}>
                      <b>Credit</b>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="8">
                    <div className="group_s_det">Health Insurance</div>
                  </Col>

                  <Col md="2">
                    <div className="group_s_det" style={{ textAlign: "right" }}>
                      2000.00
                    </div>
                  </Col>
                  <Col md="2">
                    <div
                      className="group_s_det"
                      style={{ textAlign: "right" }}
                    ></div>
                  </Col>
                </Row>
                <Row>
                  <Col md="8">
                    <div className="group_s_det">Hospital Exp</div>
                  </Col>

                  <Col md="2">
                    <div className="group_s_det" style={{ textAlign: "right" }}>
                      2000.00
                    </div>
                  </Col>
                  <Col md="2">
                    <div
                      className="group_s_det"
                      style={{ textAlign: "right" }}
                    ></div>
                  </Col>
                </Row>

                <Row>
                  <Col md="8">
                    <div className="group_s_det">Shree</div>
                  </Col>

                  <Col md="2">
                    <div
                      className="group_s_det"
                      style={{ textAlign: "right" }}
                    ></div>
                  </Col>
                  <Col md="2">
                    <div className="group_s_det" style={{ textAlign: "right" }}>
                      2000.00
                    </div>
                  </Col>
                </Row>
                <div className="grand_tot">
                  <Row>
                    <Col md="8">
                      <div className="group_s_det">Grand Total</div>
                    </Col>

                    <Col md="2">
                      <div
                        className="group_s_det"
                        style={{ textAlign: "right" }}
                      >
                        2000.00
                      </div>
                    </Col>
                    <Col md="2">
                      <div
                        className="group_s_det"
                        style={{ textAlign: "right" }}
                      >
                        2000.00
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          {/* group summery modal end */}

          {/* Bank ledger modal start */}
          <Modal
            // show={amtledgershow}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ amtledgershow: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
              //closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Ledger
              </Modal.Title>
              <CloseButton
                variant="white"
                className="pull-right"
                onClick={this.amtledgershow}
                //  onClick={() => this.handelPurchaseacModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="pmt-select-ledger">
                <Table className="mb-2">
                  <tr>
                    <th className="pl-2">
                      <span className="pt-2 mt-2">Ledgers</span>
                    </th>
                    <th className="pl-2">Amt</th>
                  </tr>
                  <tbody>
                    <tr className="bgcolor">
                      <td className="p-1">Pharma Medical 1</td>
                      <td className="p-1">10,000/- Dr</td>
                    </tr>
                    <tr>
                      <td className="p-1">
                        Shivshankar Pharmaceticul Distributers
                      </td>
                      <td className="p-1">10,000/- Dr</td>
                    </tr>
                    <tr>
                      <td className="p-1">Pharma Medical</td>
                      <td className="p-1">10,000/- Dr</td>
                    </tr>
                    <tr>
                      <td className="p-1">Pharma Medical</td>
                      <td className="p-1">10,000/- Dr</td>
                    </tr>
                    <tr>
                      <td className="p-1">Pharma Medical</td>
                      <td className="p-1">10,000/- Dr</td>
                    </tr>
                  </tbody>
                </Table>

                <div className="pmt-select-all mb-1">
                  <Row>
                    <Col md="6">
                      {/* <Button variant="secondary">Select All</Button> */}
                      <Button variant="secondary">ctrl+l</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          {/* Bank ledger modal end */}

          {/*  On Account payment Date edit */}
          <Modal
            //show={onaccountmodal}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ onaccountmodal: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                On Account
              </Modal.Title>
              {/* <CloseButton
              variant="white"
              className="pull-right"
              onClick={() => this.onaccountmodal(false)}
                onClick={() => this.handelPurchaseacModalShow(false)}
            /> */}
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={this.getElementObject(this.state.index)}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    this.handleOnAccountSubmit(values);
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
                    <Form onSubmit={handleSubmit} noValidate>
                      <Row>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder=""
                              name="amt"
                              id="amt"
                              onChange={handleChange}
                              value={
                                values.particulars ? values.particulars.amt : 0
                              }
                              isValid={touched.amt && !errors.amt}
                              isInvalid={!!errors.amt}
                              readOnly={true}
                              style={{ paddingLeft: "6px" }}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.voucher_sr_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>Payable Amount</Form.Label>
                            <Form.Control
                              type="text"
                              name="paid_amt"
                              id="paid_amt"
                              onChange={handleChange}
                              value={values.paid_amt}
                              isValid={touched.paid_amt && !errors.paid_amt}
                              isInvalid={!!errors.paid_amt}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.paid_amt}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="2" className="pt-1">
                          {/* <div>
                          <Form.Label style={{ color: '#fff' }}>
                            blank
                            <br />
                          </Form.Label>
                        </div> */}

                          <Button className="createbtn mt-4 pt-1" type="submit">
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </div>
            </Modal.Body>
          </Modal>
          {/* On Account payment Date edit */}

          {/* Bank cheque modal start */}
          <Modal
            //show={bankchequeshow}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ bankchequeshow: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
              // closeButton
              variant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Bank
              </Modal.Title>
              <CloseButton
                variant="white"
                className="pull-right"
                // onClick={this.handleClose}
                onClick={() => this.bankchequeshow(false)}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="pmt-select-ledger">
                <Table className="mb-2">
                  <tr>
                    <th className="pl-2">
                      <span className="pt-2 mt-2">Transaction Type</span>
                    </th>
                    <th className="pl-2">#</th>
                  </tr>
                  <tbody>
                    <tr>
                      <td className="" style={{ width: "37%" }}>
                        <Form.Control as="select" className="p-1">
                          <option>Cheque / DD</option>
                          <option>NEFT</option>
                          <option>IMPS</option>
                          <option>UPI</option>
                          <option>Others</option>
                        </Form.Control>
                      </td>
                      <td className="p-1 pt-2" style={{ width: "37%" }}>
                        1234
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <div className="pmt-select-all mb-1">
                  <Row>
                    {/* <Col md="6">

                        <Button variant="secondary">ctrl+l</Button>
                      </Col> */}
                    <Col md="12">
                      <Button
                        variant="secondary"
                        className="pull-right createbtn"
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          {/* Bank cheque ledger modal end */}

          {/* Bank ledger modal start */}
          <Modal
            // show={bankledgershow}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ bankledgershow: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
              //  closeButton
              variant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Bank
              </Modal.Title>
              <CloseButton
                variant="white"
                className="pull-right"
                // onClick={this.handleClose}
                onClick={() => this.bankledgershow(false)}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="pmt-select-ledger">
                <Table className="mb-2">
                  <tr>
                    <th className="pl-2" style={{ width: "87%" }}>
                      <span className="pt-2 mt-2">Ledgers</span>
                    </th>
                    <th style={{ textAlign: "center" }} className="pl-2">
                      Amt
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td className="p-1 ml-2">Bank</td>
                      <td className="p-1" style={{ textAlign: "right" }}>
                        10,000/- Dr
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1">Bank</td>
                      <td className="p-1" style={{ textAlign: "right" }}>
                        10,000/- Dr
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1">Bank</td>
                      <td className="p-1" style={{ textAlign: "right" }}>
                        10,000/- Dr
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1">Bank</td>
                      <td className="p-1" style={{ textAlign: "right" }}>
                        10,000/- Dr
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1">Bank</td>
                      <td className="p-1" style={{ textAlign: "right" }}>
                        10,000/- Dr
                      </td>
                    </tr>
                  </tbody>
                  {/* <tbody>
                  <tr className="pmt-total">
                    <td className="p-1">Total</td>
                    <td className="p-1">20,000/- Dr</td>
                  </tr>
                </tbody> */}
                </Table>

                <div className="pmt-select-all mb-1">
                  <Row>
                    {/* <Col md="6">
                        {" "}

                        <Button variant="secondary">ctrl+l</Button>
                      </Col> */}
                    <Col md="12">
                      <Button
                        variant="secondary"
                        className="pull-right createbtn"
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          {/* Bank ledger modal end */}
        </div>
      </Container>
    );
  }
}
